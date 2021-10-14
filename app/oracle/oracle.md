# Oracle-Treiber

Die entsprechenden Oracle-Instant-Client Dateien müssen in diesen Ordner platziert werden. Diese Dateien lassen sich auf der [offiziellen Seite von Oracle](https://www.oracle.com/database/technologies/instant-client/downloads.html) herunterladen. 

Je nach Version muss zudem die Dockerfile unter `/app/Dockerfile` entsprechend angepasst werden, damit die Namen in der File mit dem jeweiligen Dateinamen übereinstimmt.

Des Weiteren sollte bei dem Download des Clients darauf geachtet werden, dass die für die Installation auf Docker eine Linux-Variante notwendig ist. Unabhängig davon, welches Betriebssystem eigentlich vorhanden ist!

