from bottle import route, run, request, redirect, app, static_file
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
    redirect('/app')

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
    
    # Load user data
    data = sign_get("users/" + session['user_id'])
    session['user'] = data['users'][0]
       
    session.save()
    
    redirect('/app#map')
    
@route('/logout')
def logout():
    session = request.environ.get('beaker.session')
    session.invalidate()
    redirect('/')
    
@route('/api/auth')
def auth():
    session = request.environ.get('beaker.session')
    if "user" not in session:
        consumer = oauth.Consumer(key=XING_API_KEY, secret=XING_API_SECRET)
        client = oauth.Client(consumer)
        resp, content = client.request(XING_API_ROOT + "/v1/request_token", "POST", urllib.urlencode({"oauth_callback": request.urlparts.scheme + "://" + request.urlparts.netloc + "/oauth_callback"}))
        data = dict(urlparse.parse_qsl(content))
        session['oauth_token'] = data['oauth_token']
        session['oauth_token_request_secret'] = data['oauth_token_secret']
        session.save()
        return {'authorized': False, 'auth_url': "%s/v1/authorize?oauth_token=%s" % (XING_API_ROOT, data['oauth_token'])}
    return {'authorized': True, 'name': session['user']['display_name']}

@route('/api/contact')
def get_contacts():
    session = request.environ.get('beaker.session')
    data = sign_get('users/me/contacts', {'user_fields': 'id,display_name,permalink,business_address', 'limit': '100'})
    users = [
        {'name': session['user']['display_name'], 'url': session['user']['permalink'], 'address': "%s, %s %s, %s" % (session['user']['business_address']['street'], session['user']['business_address']['zip_code'], session['user']['business_address']['city'], session['user']['business_address']['country'])}
    ]
    if 'contacts' not in data:
        return users
    for userinfo in data['contacts']['users']:
        user = {'name': userinfo['display_name'], 'url': userinfo['permalink'], 'address': None}
        if 'city' in userinfo['business_address']:
            a = userinfo['business_address']
            user['address'] = "%s, %s %s, %s" % (a['street'], a['zip_code'], a['city'], a['country'])
        users.append(user)
    return json.dumps(users)

def sign_get(path, query = None):
    """
    Signed GET-Requests are broken in the oauth2 lib
    as it tries to create a body signature
    """
    session = request.environ.get('beaker.session')
    method = "GET"    
    consumer = oauth.Consumer(key=XING_API_KEY, secret=XING_API_SECRET)
    
    url = XING_API_ROOT + "/v1/" + path
    params = {
      'oauth_version': "1.0",
      'oauth_signature_method': "HMAC-SHA1",
      'oauth_nonce': oauth.generate_nonce(),
      'oauth_timestamp': int(time.time()),
      'oauth_token': session['oauth_token'],
      'oauth_consumer_key': XING_API_KEY,
    }
    if query is not None:
        for q in query:
            params[q] = query[q]
    
    sig_method = oauth.SignatureMethod_HMAC_SHA1()
    req = oauth.Request(method=method, url=url, parameters=params)
    token = oauth.Token(session['oauth_token'], session['oauth_token_secret'])
    signature = sig_method.sign(req, consumer, token)
     
    signed_url = req.to_url() + '&oauth_signature=' + signature
    
    client = httplib2.Http()
    resp, content = client.request(signed_url)
    
    return json.loads(content)

# Static files
    
@route('/assets/<filepath:path>')
def get_assets(filepath):
    return static_file(filepath, root='./assets')

@route('/vendor/<filepath:path>')
def get_vendor(filepath):
    return static_file(filepath, root='./vendor')

@route('/humans.txt')
def get_humanstxt():
    return static_file('humans.txt', root='./')

@route('/app')
def get_app():
    return static_file('index.html', root='./')

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
    
