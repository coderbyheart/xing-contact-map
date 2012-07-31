from bottle import route, run, request, redirect, app
import oauth2 as oauth
import urllib
import urlparse
import time
import httplib2
import json
import ConfigParser

config = ConfigParser.RawConfigParser()
config.read('config.ini')

XING_API_ROOT = config.get("xing", "api_root")
XING_API_KEY = config.get("xing", "api_key")
XING_API_SECRET = config.get("xing", "api_secret")

@route('/')
def index():
    session = request.environ.get('beaker.session')
    
    if "user_id" not in session:
        redirect('/login')
        
    # Signed GET-Requests are broken in the oauth2 lib
    # as it tries to create a body signature
        
    consumer = oauth.Consumer(key=XING_API_KEY, secret=XING_API_SECRET)
    
    method = "GET"
    url = XING_API_ROOT + "/v1/users/" + session['user_id']
    params = {
      'oauth_version': "1.0",
      'oauth_signature_method': "HMAC-SHA1",
      'oauth_nonce': oauth.generate_nonce(),
      'oauth_timestamp': int(time.time()),
      'oauth_token': session['oauth_token'],
      'oauth_consumer_key': XING_API_KEY,
    }
    
    sig_method = oauth.SignatureMethod_HMAC_SHA1()
    req = oauth.Request(method=method, url=url, parameters=params)
    token = oauth.Token(session['oauth_token'], session['oauth_token_secret'])
    signature = sig_method.sign(req, consumer, token)
     
    signed_url = req.to_url() + '&oauth_signature=' + signature
    
    client = httplib2.Http()
    resp, content = client.request(signed_url)
    
    data = json.loads(content)
    
    return "HELLO " + data['users'][0]['display_name'] + "!"


@route('/login')
def login():
    session = request.environ.get('beaker.session')
    consumer = oauth.Consumer(key=XING_API_KEY, secret=XING_API_SECRET)
    client = oauth.Client(consumer)
    resp, content = client.request(XING_API_ROOT + "/v1/request_token", "POST", urllib.urlencode({"oauth_callback": request.urlparts.scheme + "://" + request.urlparts.netloc + "/oauth_callback"}))
    data = dict(urlparse.parse_qsl(content))
    session['oauth_token'] = data['oauth_token']
    session['oauth_token_request_secret'] = data['oauth_token_secret']
    session.save()
    redirect("%s/v1/authorize?oauth_token=%s" % (XING_API_ROOT, data['oauth_token']))

@route('/oauth_callback')
def oauth_callback():
    session = request.environ.get('beaker.session')
    if "oauth_token" not in session:
        redirect('/')
        
    consumer = oauth.Consumer(key=XING_API_KEY, secret=XING_API_SECRET)
    token = oauth.Token(session['oauth_token'], session['oauth_token_request_secret'])
    client = oauth.Client(consumer, token)
    resp, content = client.request(XING_API_ROOT + "/v1/access_token", "POST", urllib.urlencode({"oauth_token": session['oauth_token'], "oauth_verifier": request.query.oauth_verifier}))
    data = dict(urlparse.parse_qsl(content))
    
    session['oauth_token'] = data['oauth_token']
    session['oauth_token_secret'] = data['oauth_token_secret']
    session['user_id'] = data['user_id']
    session.save()
    
    redirect('/')
    
@route('/logout')
def logout():
    session = request.environ.get('beaker.session')
    session.invalidate()
    redirect('/')

if __name__ == "__main__":
    
    from beaker.middleware import SessionMiddleware

    session_opts = {
        'session.type': 'file',
        'session.cookie_expires': 300,
        'session.data_dir': './session',
        'session.auto': True
    }
    app = SessionMiddleware(app(), session_opts)
    run(app=app)
    