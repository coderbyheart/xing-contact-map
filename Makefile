VENDOR=./vendor
UNDERSCORE=${VENDOR}/underscore.js
BACKBONE=${VENDOR}/backbone.js
REQUIRE=${VENDOR}/require.js
REQUIRE_TEXT=${VENDOR}/require-text.js
REQUIRE_ASYNC=${VENDOR}/require-async.js
VENDOR_MIN=${VENDOR}/vendor.js

all: install 

install: remove-deps install-backend-deps install-frontend-deps minify

install-backend-deps: 
	wget https://raw.github.com/pypa/virtualenv/master/virtualenv.py
	python2 virtualenv.py develop
	. develop/bin/activate
	pip install -U bottle
	pip install -U oauth2
	pip install -U beaker

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
	uglifyjs -nc ${VENDOR}/underscore-backbone.js > ${VENDOR}/underscore-backbone.min.js
	uglifyjs -nc ${REQUIRE} > ${VENDOR}/require.min.js
	uglifyjs -nc ${REQUIRE_TEXT} > ${VENDOR}/require-text.min.js
	uglifyjs -nc ${REQUIRE_ASYNC} > ${VENDOR}/require-async.min.js
	
remove-deps:
	-rm -r vendor
	
