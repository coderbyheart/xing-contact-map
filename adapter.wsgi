import sys, os, bottle
from beaker.middleware import SessionMiddleware

session_opts = {
    'session.type': 'file',
    'session.cookie_expires': 300,
    'session.data_dir': '/tmp',
    'session.auto': True
}

sys.path = ['/home/m/git/xing-map/'] + sys.path
os.chdir(os.path.dirname(__file__))

import xingmap # This loads your application

# application = bottle.default_app()
# app = SessionMiddleware(bottle.app(), session_opts)

application = SessionMiddleware(bottle.default_app(), session_opts)