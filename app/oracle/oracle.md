# Oracle-Treiber

Zur Verbindung mit einer Oracle-Datenbank sind folgende Instant-Client-Dateien notwendig.

* `instantclient-basic-linux.~version~.zip`
* `instantclient-sdk-linux.~version~.zip`

Die entsprechenden Dateien müssen in _diesen_ Ordner (`/app/oracle`) platziert werden. Die Dateien lassen sich auf der [offiziellen Seite von Oracle](https://www.oracle.com/database/technologies/instant-client/downloads.html) herunterladen. 

Aktuell ist die Dockerfile für `linux.x65-21.1.0.0.0` ausgelegt.
Je nach heruntergeladener Version muss diese unter `/app/Dockerfile` entsprechend angepasst werden, damit die Namen in der File mit dem jeweiligen Dateinamen übereinstimmt.

Des Weiteren sollte bei dem Download des Clients darauf geachtet werden, dass die für die Installation auf Docker eine Linux-Variante notwendig ist. Unabhängig davon, welches Betriebssystem eigentlich vorhanden ist!

