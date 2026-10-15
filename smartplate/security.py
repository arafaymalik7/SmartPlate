"""Minimal admin-only secure sessions; no guest passwords or diagnoses stored."""
import hashlib
import hmac
import os
import secrets
import time
from fastapi import HTTPException, Request
from .database import connect

COOKIE_NAME = 'smartplate_admin'
SESSION_SECONDS = 8 * 3600


def hash_password(password: str, salt: bytes) -> str:
    return hashlib.scrypt(password.encode('utf-8'), salt=salt, n=2**14, r=8, p=1).hex()


def create_admin(username: str, password: str):
    username = username.strip().lower()
    if not 3 <= len(username) <= 40 or not username.replace('_','').replace('-','').isalnum():
        raise ValueError('Username must contain 3-40 letters, numbers, _ or -.')
    if len(password) < 12:
        raise ValueError('Password must have at least 12 characters.')
    salt = secrets.token_bytes(32)
    with connect() as db:
        db.execute('INSERT INTO administrators(username,salt,password_hash) VALUES (?,?,?)',
                   (username, salt.hex(), hash_password(password, salt)))


def authenticate(username: str, password: str):
    with connect() as db:
        user = db.execute('SELECT * FROM administrators WHERE username=?', (username.lower().strip(),)).fetchone()
    # Equal-cost comparison for nonexistent and existing users.
    salt = bytes.fromhex(user['salt']) if user else b'\x00' * 32
    candidate = hash_password(password, salt)
    if user and hmac.compare_digest(candidate, user['password_hash']):
        return dict(user)
    return None


def start_session(admin_id: int):
    token = secrets.token_urlsafe(40)
    csrf = secrets.token_urlsafe(30)
    with connect() as db:
        db.execute('DELETE FROM sessions WHERE expires_at < ?', (int(time.time()),))
        db.execute('INSERT INTO sessions(token_hash,admin_id,csrf,expires_at) VALUES (?,?,?,?)',
                   (hashlib.sha256(token.encode()).hexdigest(), admin_id, csrf, int(time.time())+SESSION_SECONDS))
    return token, csrf


def get_session(request: Request):
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        return None
    digest = hashlib.sha256(token.encode()).hexdigest()
    with connect() as db:
        row = db.execute('SELECT s.*, a.username FROM sessions s JOIN administrators a ON s.admin_id=a.id WHERE s.token_hash=? AND s.expires_at>?',
                         (digest, int(time.time()))).fetchone()
    return dict(row) if row else None


def require_admin(request: Request):
    session = get_session(request)
    if not session:
        raise HTTPException(status_code=401, detail='Administrator authentication required')
    if request.method in ('POST','PUT','PATCH','DELETE'):
        supplied = request.headers.get('X-CSRF-Token','')
        if not supplied or not hmac.compare_digest(supplied, session['csrf']):
            raise HTTPException(status_code=403, detail='CSRF token missing or invalid')
    return session


def end_session(request: Request):
    token = request.cookies.get(COOKIE_NAME)
    if token:
        with connect() as db:
            db.execute('DELETE FROM sessions WHERE token_hash=?', (hashlib.sha256(token.encode()).hexdigest(),))


def record_audit(admin_id, action, entity, entity_id):
    with connect() as db:
        db.execute('INSERT INTO audit_events(admin_id,action,entity_type,entity_id) VALUES (?,?,?,?)',
                   (admin_id, action, entity, entity_id))
