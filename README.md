# XING Kontakt Karte

Visualisiert die eigenen XING-Kontakte auf einer Karte.

## Links

 * Hier läuft eine Instanz der Anwendung: http://xingmap.coderbyheart.de/
 * [Thread im XING-Developer-Forum](https://www.xing.com/net/prie8c09ex/xingdevs/discuss-with-the-community-682826/started-hacking-visualize-contacts-on-map-41598171/41598171/).

## Setup

### Konfiguration

Die Datei `config.ini.dist` nach `config.ini` kopieren und die eigenen XING-API-Zugangsdaten eintragen.

Die Datei `assets/config.js.dist` nach `assets/config.js` kopieren und die eigenen Google-Maps-API-Zugangsdaten eintragen.

### Installation der Dependencies

    make install

## Dev-Server starten

    source VIRTUALENV/bin/activate
    python2 xingmap.py
    
## Integration mit Apache

Dies ist eine Beispiel-Konfiguration für einen virtuellen Host:

    <VirtualHost *:80>
      ServerName <hostname>
	    ServerAdmin hosting@coderbyheart.de
	    UseCanonicalName Off
	    DocumentRoot /srv/www/<hostname>/
	    <Directory /srv/www/<hostname>/>
		    AllowOverride All
		    Options -Indexes FollowSymLinks
		    DirectoryIndex index.php index.html
		    Order allow,deny
		    Allow from all
	    </Directory>
	    CustomLog /srv/www/<hostname>/logs/access_log combined
	    ErrorLog /srv/www/<hostname>/logs/error_log
	    WSGIDaemonProcess bottle user=<apache user> group=<apache user> processes=1 threads=5
	    WSGIScriptAlias / /srv/www/<hostname>/adapter.wsgi
    </VirtualHost>

Anschließend muss noch die `adapter.wsgi` angepasst werden.

