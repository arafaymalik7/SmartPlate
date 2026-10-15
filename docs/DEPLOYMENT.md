# Run & Deploy SMARTPLATE

## Local offline development / demonstration

```bash
python -m venv .venv
source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m smartplate.cli init
python -m smartplate.cli create-admin --username admin
python run.py
```

Browse `http://127.0.0.1:8000`. Local admin uses HTTP cookies without Secure because localhost is not HTTPS. No cloud service, account or database server is required.

## Production deployment notes (not claimed complete)

Use a VPS or a platform supporting a persistent filesystem for SQLite, reverse-proxy HTTPS and a supervised long-running process. Set `SMARTPLATE_COOKIE_SECURE=1`. Behind HTTPS, configure your proxy to correctly forward scheme and host information for same-origin login checks. Ensure the SQLite database path is writable, not web-exposed, routinely backed up, and excluded from source repositories. Start the app using a production process manager and proxy traffic to Uvicorn. Use only trusted proxy headers, explicitly configured for the proxy.

**Scaling limit:** SQLite is not suited to heavy concurrent writes or horizontally replicated app containers with ephemeral storage. For larger deployment replace SQLite with PostgreSQL, centralize session/rate-limit state, configure monitoring and run penetration testing. Do not deploy the local test credentials.

## Backup and restore

Prefer SQLite's online backup API rather than copying a live database file while writes may occur:

```python
import sqlite3
src=sqlite3.connect('data/smartplate.db')
dst=sqlite3.connect('data/smartplate-backup.db')
src.backup(dst)
dst.close();src.close()
```

Restore only after stopping the server, using a validated copy. Back up before changing the schema or deleting a restaurant.
