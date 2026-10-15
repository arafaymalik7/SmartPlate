import os
import tempfile
import pytest
from fastapi.testclient import TestClient
from smartplate.api import app, _ATTEMPTS
from smartplate.database import connect
from smartplate.security import create_admin

@pytest.fixture
def client(monkeypatch,tmp_path):
    monkeypatch.setenv('SMARTPLATE_DB',str(tmp_path/'test.db'))
    _ATTEMPTS.clear()
    with TestClient(app) as tc:yield tc


def test_seed_health_and_public_collection(client):
    d=client.get('/api/health').json()
    assert d['menu_items']==48
    r=client.get('/api/restaurants').json()
    assert len(r)==4 and sum(x['item_count'] for x in r)==48
    assert len(client.get('/api/items').json())==48
    assert client.get('/api/restaurants/'+r[0]['slug']).status_code==200


def test_recommendation_and_validation(client):
    response=client.post('/api/recommend',json={'target_calories':550,'vegetarian_only':True})
    assert response.status_code==200
    data=response.json();assert data['count']>0
    assert all(r['vegetarian'] for r in data['results'])
    assert client.post('/api/recommend',json={'target_calories':90000}).status_code==422
    assert client.post('/api/recommend',json={'exclude_allergens':['peanut']}).json()['count']==0


def test_admin_access_denied_without_session(client):
    assert client.get('/api/admin/items').status_code==401
    assert client.post('/api/admin/restaurants',json={}).status_code==401


def admin_login(client):
    create_admin('supervisor','A-random-long-test-passphrase-2026!')
    response=client.post('/api/auth/login',json={'username':'supervisor','password':'A-random-long-test-passphrase-2026!'})
    assert response.status_code==200
    return response.json()['csrf']


def test_wrong_password_rejected(client):
    create_admin('supervisor','A-random-long-test-passphrase-2026!')
    assert client.post('/api/auth/login',json={'username':'supervisor','password':'bad'}).status_code==401


def test_login_rate_limit(client):
    for _ in range(8):assert client.post('/api/auth/login',json={'username':'notfound','password':'bad'}).status_code==401
    assert client.post('/api/auth/login',json={'username':'notfound','password':'bad'}).status_code==429


def test_admin_crud_csrf_logout(client):
    csrf=admin_login(client)
    assert client.get('/api/auth/me').json()['authenticated']
    assert client.post('/api/admin/restaurants',json={}).status_code==403
    headers={'X-CSRF-Token':csrf}
    data={'name':'Sandbox Bistro','cuisine':'Demo','description':'Project demo','location':'Campus','accent':'mint','published':True}
    response=client.post('/api/admin/restaurants',json=data,headers=headers)
    assert response.status_code==201,response.text
    rid=response.json()['id']
    item={'restaurant_id':rid,'name':'Test Mango Bowl','category':'Bowls','description':'Demo bowl',
          'price':12.5,'serving_size':'280 g','calories':350,'protein':10,'carbs':51,'fat':11,'sodium':130,'fiber':6,
          'vegetarian':True,'ingredients':['mango'],'ingredients_verified':True,'allergens':[], 'allergens_verified':False,
          'nutrition_source_type':'illustrative','nutrition_source_url':'','available':True,'featured':False}
    saved=client.post('/api/admin/items',json=item,headers=headers)
    assert saved.status_code==201,saved.text
    item_id=saved.json()['id']
    item['calories']=410
    assert client.put(f'/api/admin/items/{item_id}',json=item,headers=headers).status_code==200
    assert client.get(f'/api/items/{item_id}').json()['calories']==410
    assert client.delete(f'/api/admin/items/{item_id}',headers=headers).status_code==200
    assert client.get(f'/api/items/{item_id}').status_code==404
    data['published']=False
    assert client.put(f'/api/admin/restaurants/{rid}',json=data,headers=headers).status_code==200
    assert client.get('/api/restaurants/sandbox-bistro').status_code==404
    assert client.delete(f'/api/admin/restaurants/{rid}',headers=headers).status_code==200
    assert client.post('/api/auth/logout',headers=headers).status_code==200
    assert client.get('/api/admin/items').status_code==401


def test_unknown_path_no_private_exposure(client):
    assert client.get('/api/invalid').status_code==404
    assert client.get('/').status_code==200
    assert 'SMARTPLATE' in client.get('/').text


def test_reject_bad_source_url(client):
    csrf=admin_login(client)
    h={'X-CSRF-Token':csrf}
    item={'restaurant_id':1,'name':'Bad source','category':'Main','price':10,'serving_size':'200 g',
          'nutrition_source_url':'javascript:alert(1)'}
    assert client.post('/api/admin/items',json=item,headers=h).status_code==422
