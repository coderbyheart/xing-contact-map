VENDOR=./vendor
UNDERSCORE=${VENDOR}/underscore.js
BACKBONE=${VENDOR}/backbone.js
REQUIRE=${VENDOR}/require.js
REQUIRE_TEXT=${VENDOR}/require-text.js
REQUIRE_ASYNC=${VENDOR}/require-async.js
VENDOR_MIN=${VENDOR}/vendor.js

all: install 

install: remove-deps install-backend-deps install-frontend-deps minify

install-virtualenv:
	wget https://raw.github.com/pypa/virtualenv/master/virtualenv.py -O ./virtualenv.py
	python2 ./virtualenv.py VIRTUALENV

install-backend-deps: install-virtualenv
	. VIRTUALENV/bin/activate; pip install -U bottle oauth2 beaker slimit

install-frontend-deps:
	mkdir -p ./vendor/js
	wget http://twitter.github.com/bootstrap/assets/bootstrap.zip
	unzip -d ./vendor bootstrap.zip
	rm bootstrap.zip
	wget http://underscorejs.org/underscore.js -O ${UNDERSCORE}
	wget http://backbonejs.org/backbone.js -O ${BACKBONE}
	wget http://requirejs.org/docs/release/2.0.4/comments/require.js -O ${REQUIRE}
	wget https://raw.github.com/requirejs/text/latest/text.js -O ${REQUIRE_TEXT}
	wget https://raw.github.com/millermedeiros/requirejs-plugins/master/src/async.js -O ${REQUIRE_ASYNC}
	
minify:
	cat ${UNDERSCORE} ${BACKBONE} > ${VENDOR}/underscore-backbone.js
	. VIRTUALENV/bin/activate; slimit < ${VENDOR}/underscore-backbone.js > ${VENDOR}/underscore-backbone.min.js
	. VIRTUALENV/bin/activate; slimit < ${REQUIRE} > ${VENDOR}/require.min.js
	. VIRTUALENV/bin/activate; slimit < ${REQUIRE_TEXT} > ${VENDOR}/require-text.min.js
	. VIRTUALENV/bin/activate; slimit < ${REQUIRE_ASYNC} > ${VENDOR}/require-async.min.js
	
remove-deps:
	-rm -rf vendor
	-rm -rf VIRTUALENV