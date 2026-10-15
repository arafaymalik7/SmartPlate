"""REST API; fully functional offline with SQLite, validated endpoints, protected admin."""
from __future__ import annotations
import hashlib
import json
import os
import re
import sqlite3
import time
from collections import defaultdict
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, Request, HTTPException, Depends, Query
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from .database import connect, init_db, restaurant_to_dict, item_to_dict, BASE
from .schemas import RestaurantInput, MenuItemInput, Preferences, Credentials
from .seed import seed_if_empty, slugify
from .recommender import rank_items
from .security import (COOKIE_NAME, authenticate, start_session, require_admin,
                       get_session, end_session, record_audit)

@asynccontextmanager
async def lifespan(_app):
    seed_if_empty()
    yield

app = FastAPI(title='SMARTPLATE API', version='1.0.0', lifespan=lifespan,
              description='Transparent, non-medical restaurant menu and nutrition recommendation demo.')
app.mount('/static', StaticFiles(directory=str(BASE/'static')), name='static')

@app.middleware('http')
async def secure_headers(request: Request, call_next):
    response = await call_next(request)
    for k,v in {
        'X-Content-Type-Options':'nosniff', 'X-Frame-Options':'DENY',
        'Referrer-Policy':'strict-origin-when-cross-origin',
        'Permissions-Policy':'camera=(), microphone=(), geolocation=()',
        'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
        'Cache-Control':'no-store' if request.url.path.startswith('/api/auth') or request.url.path.startswith('/api/admin') else 'public, max-age=0'
    }.items():
        response.headers[k] = v
    return response


def not_found(message='Record not found'):
    raise HTTPException(status_code=404, detail=message)


def load_items(public=True, restaurant_id=None, query='', vegetarian=None):
    clauses = ['1=1']
    args = []
    if public:
        clauses += ['i.available=1','r.published=1']
    if restaurant_id is not None:
        clauses.append('i.restaurant_id=?'); args.append(restaurant_id)
    if query:
        clauses.append('(lower(i.name) LIKE ? OR lower(i.description) LIKE ? OR lower(i.category) LIKE ?)')
        q=f'%{query.lower()}%'; args.extend((q,q,q))
    if vegetarian is True:
        clauses.append('i.vegetarian=1')
    sql = '''SELECT i.*,r.name AS restaurant_name,r.slug AS restaurant_slug,r.accent AS restaurant_accent
             FROM menu_items i JOIN restaurants r ON r.id=i.restaurant_id WHERE '''+' AND '.join(clauses)+' ORDER BY i.featured DESC, i.name COLLATE NOCASE'
    with connect() as db:
        rows=db.execute(sql,args).fetchall()
    return [item_to_dict(i) for i in rows]

@app.get('/api/health')
def health():
    with connect() as db:
        rows=db.execute('SELECT COUNT(*) FROM menu_items').fetchone()[0]
    return {'status':'ok','database':'sqlite','menu_items':rows,'version':'1.0.0'}

@app.get('/api/restaurants')
def public_restaurants():
    with connect() as db:
        result=db.execute('''SELECT r.*,count(i.id) AS item_count FROM restaurants r
            LEFT JOIN menu_items i ON i.restaurant_id=r.id AND i.available=1
            WHERE r.published=1 GROUP BY r.id ORDER BY r.id''').fetchall()
    return [restaurant_to_dict(r) for r in result]

@app.get('/api/restaurants/{slug}')
def public_restaurant(slug: str):
    with connect() as db:
        result=db.execute('SELECT * FROM restaurants WHERE slug=? AND published=1',(slug,)).fetchone()
    if not result: not_found('Restaurant not found')
    return {'restaurant':restaurant_to_dict(result), 'items':load_items(restaurant_id=result['id'])}

@app.get('/api/items')
def public_items(q: str=Query('',max_length=120), restaurant_id: int|None=None, vegetarian: bool|None=None):
    return load_items(restaurant_id=restaurant_id,query=q,vegetarian=vegetarian)

@app.get('/api/items/{item_id}')
def public_item(item_id:int):
    with connect() as db:
        row=db.execute('''SELECT i.*,r.name AS restaurant_name,r.slug AS restaurant_slug,r.accent AS restaurant_accent
                       FROM menu_items i JOIN restaurants r ON i.restaurant_id=r.id WHERE i.id=? AND i.available=1 AND r.published=1''',(item_id,)).fetchone()
    if not row:not_found('Menu item not found')
    return item_to_dict(row)

@app.get('/api/meta')
def meta():
    items=load_items()
    return {'categories':sorted({i['category'] for i in items}), 'total_items':len(items),
            'nutrition_disclaimer':'All seeded prices and nutrient values are fictional illustrative data, not measured restaurant values.'}

@app.post('/api/recommend')
def recommend(prefs: Preferences):
    return rank_items(load_items(), prefs)

# Login protection: per-address throttle for single-process educational demo.
_ATTEMPTS = defaultdict(list)

@app.post('/api/auth/login')
def login(body: Credentials, request: Request):
    origin = request.headers.get('origin')
    if origin and origin.rstrip('/') != f'{request.url.scheme}://{request.headers.get("host", "")}':
        raise HTTPException(status_code=403, detail='Invalid login origin')
    addr = request.client.host if request.client else 'unknown'
    now = time.time()
    _ATTEMPTS[addr] = [t for t in _ATTEMPTS[addr] if t > now-900]
    if len(_ATTEMPTS[addr]) >= 8:
        raise HTTPException(status_code=429, detail='Too many attempts. Retry after 15 minutes.')
    admin=authenticate(body.username,body.password)
    if not admin:
        _ATTEMPTS[addr].append(now)
        raise HTTPException(status_code=401, detail='Invalid username or password')
    _ATTEMPTS.pop(addr,None)
    token, csrf=start_session(admin['id'])
    response=JSONResponse({'authenticated':True,'username':admin['username'],'csrf':csrf})
    response.set_cookie(COOKIE_NAME,token,httponly=True,samesite='strict',secure=os.getenv('SMARTPLATE_COOKIE_SECURE')=='1',max_age=8*3600,path='/')
    return response

@app.get('/api/auth/me')
def auth_me(request: Request):
    s=get_session(request)
    return {'authenticated':bool(s),'username':s['username'] if s else None,'csrf':s['csrf'] if s else None}

@app.post('/api/auth/logout')
def logout(request: Request, admin=Depends(require_admin)):
    end_session(request)
    response=JSONResponse({'ok':True})
    response.delete_cookie(COOKIE_NAME,path='/')
    return response

@app.get('/api/admin/stats')
def admin_stats(admin=Depends(require_admin)):
    with connect() as db:
        r=db.execute('SELECT COUNT(*) FROM restaurants').fetchone()[0]
        m=db.execute('SELECT COUNT(*) FROM menu_items').fetchone()[0]
        a=db.execute('SELECT COUNT(*) FROM audit_events').fetchone()[0]
    return {'restaurants':r,'menu_items':m,'audit_events':a}

@app.get('/api/admin/restaurants')
def admin_restaurants(admin=Depends(require_admin)):
    with connect() as db:
        rows=db.execute('SELECT * FROM restaurants ORDER BY id').fetchall()
    return [restaurant_to_dict(r) for r in rows]

@app.post('/api/admin/restaurants',status_code=201)
def add_restaurant(body:RestaurantInput,admin=Depends(require_admin)):
    with connect() as db:
        slug=slugify(body.name)
        if not slug: raise HTTPException(422,'Invalid restaurant name')
        suffix=2
        while db.execute('SELECT 1 FROM restaurants WHERE slug=?',(slug,)).fetchone():
            slug=f'{slugify(body.name)}-{suffix}';suffix+=1
        try:
            cur=db.execute('INSERT INTO restaurants(name,slug,cuisine,description,location,accent,published) VALUES(?,?,?,?,?,?,?)',
                           (body.name,slug,body.cuisine,body.description,body.location,body.accent,int(body.published)))
        except sqlite3.IntegrityError:raise HTTPException(409,'Restaurant name already exists')
        id_=cur.lastrowid
    record_audit(admin['admin_id'],'create','restaurant',id_)
    return {'id':id_,'slug':slug}

@app.put('/api/admin/restaurants/{id_}')
def update_restaurant(id_:int,body:RestaurantInput,admin=Depends(require_admin)):
    with connect() as db:
        current=db.execute('SELECT * FROM restaurants WHERE id=?',(id_,)).fetchone()
        if not current:not_found()
        try:
            db.execute('UPDATE restaurants SET name=?,cuisine=?,description=?,location=?,accent=?,published=? WHERE id=?',
                      (body.name,body.cuisine,body.description,body.location,body.accent,int(body.published),id_))
        except sqlite3.IntegrityError:raise HTTPException(409,'Restaurant name already exists')
    record_audit(admin['admin_id'],'update','restaurant',id_)
    return {'ok':True}

@app.delete('/api/admin/restaurants/{id_}')
def delete_restaurant(id_:int,admin=Depends(require_admin)):
    with connect() as db:
        cur=db.execute('DELETE FROM restaurants WHERE id=?',(id_,))
        if cur.rowcount==0:not_found()
    record_audit(admin['admin_id'],'delete','restaurant',id_)
    return {'ok':True}

@app.get('/api/admin/items')
def admin_items(admin=Depends(require_admin)):
    return load_items(public=False)


def fields(body:MenuItemInput):
    data=body.model_dump()
    data['ingredients_json']=json.dumps(data.pop('ingredients'))
    data['allergens_json']=json.dumps(data.pop('allergens'))
    for key in ('ingredients_verified','allergens_verified','available','featured'):
        data[key]=int(data[key])
    data['vegetarian']=None if data['vegetarian'] is None else int(data['vegetarian'])
    return data

@app.post('/api/admin/items',status_code=201)
def add_item(body:MenuItemInput,admin=Depends(require_admin)):
    data=fields(body)
    columns=list(data)
    with connect() as db:
        if not db.execute('SELECT 1 FROM restaurants WHERE id=?',(body.restaurant_id,)).fetchone():
            raise HTTPException(status_code=422,detail='Restaurant does not exist')
        cur=db.execute(f'INSERT INTO menu_items ({",".join(columns)}) VALUES ({",".join("?" for _ in columns)})',list(data.values()))
        id_=cur.lastrowid
    record_audit(admin['admin_id'],'create','item',id_)
    return {'id':id_}

@app.put('/api/admin/items/{id_}')
def update_item(id_:int,body:MenuItemInput,admin=Depends(require_admin)):
    data=fields(body)
    with connect() as db:
        if not db.execute('SELECT 1 FROM restaurants WHERE id=?',(body.restaurant_id,)).fetchone():
            raise HTTPException(status_code=422,detail='Restaurant does not exist')
        cur=db.execute('UPDATE menu_items SET '+','.join(k+'=?' for k in data)+',updated_at=CURRENT_TIMESTAMP WHERE id=?',
                       list(data.values())+[id_])
        if cur.rowcount==0:not_found()
    record_audit(admin['admin_id'],'update','item',id_)
    return {'ok':True}

@app.delete('/api/admin/items/{id_}')
def delete_item(id_:int,admin=Depends(require_admin)):
    with connect() as db:
        cur=db.execute('DELETE FROM menu_items WHERE id=?',(id_,))
        if cur.rowcount==0:not_found()
    record_audit(admin['admin_id'],'delete','item',id_)
    return {'ok':True}

@app.get('/')
@app.get('/{page:path}', include_in_schema=False)
def app_index(page: str=''):
    # Only frontend HTML routes are caught here; unknown /api paths are proper 404s.
    if page.startswith(('api/','static/')):
        not_found()
    return FileResponse(BASE/'static'/'index.html')
