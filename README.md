![EILD.nrw](app/src/img/Logo-mitSchrift-v2.png)

# PLSQL-Trainer

Dieser PLSQL-Trainer ist eine Lernanwendung für PLSQL-Anweisungen in Oracle-Datenbanken. 

Schlagworte: Datenbanksysteme, Datenbank, PLSQL


## Weitere Informationen
In EILD.nrw wird ein Ansatz mit weitgehender Adaptierbarkeit und Wiederverwendbarkeit der Lehrinhalte umgesetzt. Die entwickelten OER werden über ORCA.nrw zur Verfügung gestellt.
- [EILD.nrw]
- [ORCA.nrw]
- [ORCA.nrw Github]


## Aufbau der Applikation
### Grundlagen

Bei dem Trainer handelt es sich um einen regulären JavaScript *Express*-Server. 

Als Templating-Engine wurde `Pug` und für Code-Quality `ESLint` verwendet.

Neben dem Server wird eine Oracle-Datenbank zur Ausführung der PLSQL-Statements der Nutzer benötigt (siehe [Verwendung & Installation]).

### Ordnerstruktur

Grundsätzlich teilt sich die Applikation in eine Hauptkomponente und drei Router für die jeweiligen Sub-Trainer auf. 
Sowohl die Hauptkomponente als auch die Sub-Trainer bestehen jeweils aus einem Router (`app.js` oder `router.js`) in welchem die eigentliche Server-Logik liegt, sowie zugehörigen `Datenbank.js` und `Service.js` Dateien in welchen die Verbindung mit der Datenbank gehändelt wird.

Außerdem gibt es für seitenübergreifende Funktionen, sowie Bilder und zusätzliche (externe-) JavaScript Dateien entsprechende Ordner.


## Verwendung & Installation

Der PLSQL-Trainer muss vor der Verwendung installiert werden. In diesem Abschnitt finden Sie die Installationsanleitung

### Einrichten der Datenbank

Zum Betrieb des PLSQL-Trainers ist eine Oracle-Instanz notwendig. 
Alle vom Trainer benötigten Daten befinden sich im `db` Ordner als Datenbank-Export.

### Konfiguration der Datenbank-Verbindung

Der Server erwartet zur Verbindung eine Konfigurationsdatei mit dem Namen `dbconfig.js` im Order `/app/src/database/`.
Im gleichen Ordner befindet sich eine `dbconfig_template.js`-Datei, die das erwartete Format der Datei enthält und entsprechend kopiert und umbenannt werden kann.

Weitere Beispiele für verschiedene akzeptierte Connection-Strings o.Ä. sind in der offiziellen [Dokumentation der OracleDB-Bibliothek] zu finden.

### Installation der Instant-Client-Treiber

Zur Verbindung mit einer Oracle-Datenbank sind entsprechende Instant-Client Treiber notwendig. 

Bei einer manuellen installation müssen diese auf dem Host-System installiert sein. 

Alternativ können diese automatisch in der Docker-Instanz installiert werden. Hierfür müssen allerdings Linux-Treiber in den entsprechenden Unterordner geladen werden (siehe [/app/oracle] - Versionen für andere Betriebssysteme lassen sich auf der Oracle-Webseite herunterladen).

Aus Lizenzgründen müssen diese manuell von der Oracle-Seite heruntergeladen werden.

### Start des Servers: 

Da für den Betrieb des Servers einige Programme und Dateien notwendig sind, wurde der Server als Docker-Anwendung konzipiert, die alle benötigten Daten automatisch herunterläd und installiert. Daher ist allerdings eine `Docker`-Installation notwendig um den Server wie folgt zu starten:

- Man öffne zunächst den `app`-Ordner in einem Terminal
- Nun lässt sich ein Docker-Container beispielsweise mit `docker build . -t plsql-trainer` bauen
- Und mit `docker run -p 8080:8080 -d plsql-trainer` starten

Alternativ kann der Server auch ohne Docker betrieben werden, allerdings müssen dann die benötigten Oracle-Instant-Client treiber sowie die entsprechenden Dependencies manuell installiert werden (`npm install`).




## Lizenzierung
[![License: MIT][MIT-shield]][MIT]

[![CC BY-SA 4.0][cc-by-sa-shield]][cc-by-sa]

Der PLSQL-Trainer wurde ursprünglich von der [Technischen Hochschule Köln][TH Köln] im Rahmen der Online-Lernplattform [EDB] entwickelt. Als Teil des Projekts [EILD.nrw] wurde sie von Alexander Kosmehl weiterentwickelt und als Open-Source Anwendung veröffentlicht. Dieses Repository enthält Software unter [MIT-Lizenz][MIT] und Content unter [Creative Commons Attribution-ShareAlike 4.0 International License][cc-by-sa]. Content sind insbesondere die Tabellen und Aufgabenstellungen. Ausgenommen von der CC BY-SA 4.0 Lizenz sind die verwendeten Logos sowie alle anders lizenzierten Inhalte.



[![CC BY-SA 4.0][cc-by-sa-image]][cc-by-sa]

![image](https://user-images.githubusercontent.com/73349129/233968870-b61f0850-e7c2-489f-a597-53e030794b22.png)



[MIT]: https://github.com/orca-nrw/plsql-trainer/blob/master/LICENSE
[MIT-shield]: https://img.shields.io/badge/License-MIT-yellow.svg
[cc-by-sa]: http://creativecommons.org/licenses/by-sa/4.0/
[cc-by-sa-image]: https://licensebuttons.net/l/by-sa/4.0/88x31.png
[cc-by-sa-shield]: https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg
[/app/oracle]: https://github.com/orca-nrw/plsql-trainer/blob/main/app/oracle/oracle.md
[Verwendung & Installation]: #verwendung--installation
[Dokumentation der OracleDB-Bibliothek]: https://oracle.github.io/node-oracledb/doc/api.html#-151-connection-strings
[TH Köln]: https://www.th-koeln.de/
[EDB]: https://edb2.gm.th-koeln.de/index/
[BTree Animate GH Pages]: https://eild-nrw.github.io/btree-animate/
[EILD.nrw]: https://www.eild.nrw/
[EILD.nrw GitHub]: https://github.com/EILD-nrw
[ORCA.nrw]: https://www.orca.nrw/
[ORCA.nrw Github]: https://github.com/orca-nrw
