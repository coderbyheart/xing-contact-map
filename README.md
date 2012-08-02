# XING Kontakt Karte

Visualisiert die eigenen XING-Kontakte auf einer Karte.

## Installation der Dependencies

    make install

## Dev-Server starten

    source develop/bin/activate
    python2 xingmap.py
    
## Integration mit Apache

Dies ist eine Beispiel-Konfiguration für einen virtuellen Host:

    <VirtualHost *:80>
      ServerName <hostname>
	    ServerAdmin hosting@coderbyheart.de
	    UseCanonicalName Off
	    DocumentRoot /srv/www/<hostname>/htdocs
	    <Directory /srv/www/<hostname>/htdocs>
		    AllowOverride All
		    Options -Indexes FollowSymLinks
		    DirectoryIndex index.php index.html
		    Order allow,deny
		    Allow from all
	    </Directory>
	    CustomLog /srv/www/<hostname>/logs/access_log combined
	    ErrorLog /srv/www/<hostname>/logs/error_log
	    WSGIDaemonProcess bottle user=<apache user> group=<apache user> processes=1 threads=5
	    WSGIScriptAlias / /srv/www/<hostname>/htdocs/adapter.wsgi
    </VirtualHost>

Anschliend muss noch die `adapter.wsgi` angepasst werden.

