"""One-command local demo runner: python run.py"""
import os
import uvicorn
from smartplate.seed import seed_if_empty

if __name__=='__main__':
    added=seed_if_empty()
    print('SMARTPLATE — http://127.0.0.1:'+os.getenv('SMARTPLATE_PORT','8000'))
    if added: print('Seeded 4 fictional demo restaurants and 48 illustrative menu items.')
    uvicorn.run('smartplate.api:app',host=os.getenv('SMARTPLATE_HOST','127.0.0.1'),port=int(os.getenv('SMARTPLATE_PORT','8000')))
