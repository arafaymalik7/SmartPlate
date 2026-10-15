"""SQLite storage, migrations and connection lifecycle (stdlib-only)."""
from __future__ import annotations
import json
import os
import sqlite3
from pathlib import Path
from contextlib import contextmanager

BASE = Path(__file__).resolve().parent.parent


def db_path() -> Path:
    val = os.getenv('SMARTPLATE_DB')
    path = Path(val) if val else BASE / 'data' / 'smartplate.db'
    return path.resolve()


@contextmanager
def connect():
    p = db_path()
    p.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(str(p), timeout=10)
    db.row_factory = sqlite3.Row
    db.execute('PRAGMA foreign_keys=ON')
    db.execute('PRAGMA busy_timeout=10000')
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def init_db():
    with connect() as db:
        db.executescript('''
        CREATE TABLE IF NOT EXISTS restaurants (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE, slug TEXT NOT NULL UNIQUE,
          cuisine TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
          location TEXT NOT NULL DEFAULT '', accent TEXT NOT NULL DEFAULT 'sage',
          published INTEGER NOT NULL DEFAULT 1 CHECK(published IN (0,1)),
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS menu_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
          name TEXT NOT NULL, category TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
          price REAL NOT NULL CHECK(price>=0), serving_size TEXT NOT NULL,
          calories REAL CHECK(calories>=0), protein REAL CHECK(protein>=0),
          carbs REAL CHECK(carbs>=0), fat REAL CHECK(fat>=0),
          sodium REAL CHECK(sodium>=0), fiber REAL CHECK(fiber>=0),
          vegetarian INTEGER CHECK(vegetarian IN (0,1) OR vegetarian IS NULL),
          ingredients_json TEXT NOT NULL DEFAULT '[]', allergens_json TEXT NOT NULL DEFAULT '[]',
          ingredients_verified INTEGER NOT NULL DEFAULT 0 CHECK(ingredients_verified IN (0,1)),
          allergens_verified INTEGER NOT NULL DEFAULT 0 CHECK(allergens_verified IN (0,1)),
          nutrition_source_type TEXT NOT NULL DEFAULT 'illustrative',
          nutrition_source_url TEXT NOT NULL DEFAULT '',
          available INTEGER NOT NULL DEFAULT 1 CHECK(available IN (0,1)),
          featured INTEGER NOT NULL DEFAULT 0 CHECK(featured IN (0,1)),
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_item_restaurant ON menu_items(restaurant_id);
        CREATE INDEX IF NOT EXISTS idx_item_category ON menu_items(category);
        CREATE TABLE IF NOT EXISTS administrators (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE, salt TEXT NOT NULL,
          password_hash TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS sessions (
          token_hash TEXT PRIMARY KEY, admin_id INTEGER NOT NULL REFERENCES administrators(id) ON DELETE CASCADE,
          csrf TEXT NOT NULL, expires_at INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS audit_events (
          id INTEGER PRIMARY KEY AUTOINCREMENT, admin_id INTEGER REFERENCES administrators(id) ON DELETE SET NULL,
          action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id INTEGER,
          occurred_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        ''')


def restaurant_to_dict(row):
    return {k: row[k] for k in row.keys()} | {'published': bool(row['published'])}


def item_to_dict(row):
    data = dict(row)
    data['ingredients'] = json.loads(data.pop('ingredients_json'))
    data['allergens'] = json.loads(data.pop('allergens_json'))
    for k in ('ingredients_verified','allergens_verified','available','featured'):
        data[k] = bool(data[k])
    data['vegetarian'] = None if data['vegetarian'] is None else bool(data['vegetarian'])
    return data
