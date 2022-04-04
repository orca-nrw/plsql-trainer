![EILD.nrw](app/src/img/Logo-mitSchrift-v2.png)

# PLSQL-Trainer

Dieser PLSQL-Trainer ist eine Lernanwendung für PLSQL-Anweisungen in Oracle-Datenbanken. Die Anwendung wurde ursprünglich von der [Technischen Hochschule Köln](https://www.th-koeln.de/) im Rahmen der Online-Lernplattform [EDB](https://edb2.gm.th-koeln.de/index) entwickelt und wurde nun als Teil des EILD.nrw Projektes weiterentwickelt und als Open-Source Anwendung veröffentlicht.

In EILD wird ein Ansatz mit weitgehender Adaptierbarkeit und Wiederverwendbarkeit der Lehrinhalte umgesetzt.


## Further information
- [EILD.nrw Informationen](https://medien.hs-duesseldorf.de/personen/rakow/Seiten/09062020_EILD.aspx?RootFolder=%2Fpersonen%2Frakow%2FPublishingImages%2FMeldungen&FolderCTID=0x0120004A9137CD4CD45345B9F581109987E838&View=%7BC6A3F1CE-FF3B-4025-A149-D6A910C2E30B%7D#:~:text=NRW%20zur%20Erstellung%20von%20offenen,schafft%20sich%20ihre%20Werkzeuge%20selbst.)
- [EILD.nrw GitHub](https://github.com/EILD-nrw)

## Verwendung

### Einrichten der Datenbank

Zum Betrieb des PLSQL-Trainers ist eine Oracle-Instanz notwendig. 
Alle vom Trainer benötigten Daten befinden sich im `db` Ordner als Datenbank-Export.

### Konfiguration der Datenbank-Verbindung

Der Server erwartet zur Verbindung eine Konfigurationsdatei mit dem Namen `dbconfig.js` im Order `/app/src/database/`.
Im gleichen Ordner befindet sich eine `dbconfig_template.js`-Datei, die das erwartete Format der Datei enthält und entsprechend kopiert und umbenannt werden kann.

Weitere Beispiele für verschiedene akzeptierte Connection-Strings o.Ä. sind in der offiziellen [Dokumentation der OracleDB-Bibliothek](https://oracle.github.io/node-oracledb/doc/api.html#-151-connection-strings) zu finden.

### Start des Servers: 

Da für den Betrieb des Servers einige Programme und Dateien notwendig sind, wurde der Server als Docker-Anwendung konzipiert, die alle benötigten Daten automatisch herunterläd und installiert. Daher ist allerdings eine `Docker`-Installation notwendig um den Server wie folgt zu starten:

- Man öffne zunächst den `app`-Ordner in einem Terminal
- Nun lässt sich ein Docker-Container beispielsweise mit `docker build . -t plsql-trainer` bauen
- Und mit `docker run -p 8080:8080 -d plsql-trainer` starten

Alternativ kann der Server auch ohne Docker betrieben werden, allerdings müssen hierfür die benötigten Treiber für die Oracle-Datenbank (siehe [/app/oracle](./app/oracle/oracle.md) - Versionen für andere Betriebssysteme lassen sich auf der Oracle-Webseite herunterladen), sowie alle dependencies des Projektes (`npm install`) manuell installiert werden.

## Lizenz
[![CC BY-SA 4.0][cc-by-sa-shield]][cc-by-sa]

This work is licensed under a
[Creative Commons Attribution-ShareAlike 4.0 International License][cc-by-sa].

[![CC BY-SA 4.0][cc-by-sa-image]][cc-by-sa]

[cc-by-sa]: http://creativecommons.org/licenses/by-sa/4.0/
[cc-by-sa-image]: https://licensebuttons.net/l/by-sa/4.0/88x31.png
[cc-by-sa-shield]: https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg
