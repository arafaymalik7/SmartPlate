"""Administrative console: initialise data, create admins, or reset demo database."""
import argparse
import getpass
import sqlite3
from .database import init_db, db_path, connect
from .seed import seed_if_empty
from .security import create_admin


def main():
    parser=argparse.ArgumentParser(description='SMARTPLATE administration')
    sub=parser.add_subparsers(dest='command',required=True)
    sub.add_parser('init',help='Initialize tables and illustrative demo menu')
    a=sub.add_parser('create-admin',help='Create admin securely; requires password prompt')
    a.add_argument('--username',help='Admin username (prompted if omitted)')
    p=sub.add_parser('change-password',help='Change an admin password')
    p.add_argument('--username',required=True)
    args=parser.parse_args()
    if args.command=='init':
        added=seed_if_empty()
        print('Database initialized:',db_path(),'Demo items added:',added)
    elif args.command=='create-admin':
        username=args.username or input('Username: ')
        password=getpass.getpass('Password (min 12 characters): ')
        confirm=getpass.getpass('Confirm password: ')
        if password!=confirm:raise SystemExit('Passwords do not match')
        init_db()
        try:create_admin(username,password)
        except (sqlite3.IntegrityError,ValueError) as e:raise SystemExit(str(e))
        print('Admin created:',username)
    elif args.command=='change-password':
        from .security import hash_password
        import secrets
        password=getpass.getpass('New password (min 12 characters): ')
        if len(password)<12:raise SystemExit('Password too short')
        salt=secrets.token_bytes(32)
        with connect() as db:
            cur=db.execute('UPDATE administrators SET salt=?,password_hash=? WHERE username=?',
                           (salt.hex(),hash_password(password,salt),args.username.strip().lower()))
            if not cur.rowcount:raise SystemExit('Unknown administrator')
            db.execute('DELETE FROM sessions WHERE admin_id=(SELECT id FROM administrators WHERE username=?)',(args.username.strip().lower(),))
        print('Password changed; existing sessions revoked.')

if __name__=='__main__': main()
