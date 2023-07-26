-----------------------------------------------------------
FRONTEND: pisan u Angularu
Obratiti paznju na kom portu se startuje backend i isti taj port treba podesiti na backendu u server.js fajlu kako ne bismo dobijali CORS error. Trenutno je namesteno da frontend radi na portu 55552


------------------------------------------------------------
BACKEND: pisan u NODE



------------------------------------------------------------
DATABASE: koristi se SQLITE3 baza



------------------------------------------------------------
ELECTRON:
1. Instalirali smo electron zavisnost sa komandom: npm i electron --save-dev
2. Kreirali smo u samom projektu fajl main.js
3. U angular.json smo setovali za outputPath vrednost "dist/radnja" sto je putanja gde ce nam se bildovati projekat
4. Dodali smo u package.json:
  u vrhu:
    "main": "main.js",
  u skriptama:
    "electron": "electron .",
    "electron-build": "ng build"

------------------------------------------------------------
DEVELOPMENT:
1. Pokrece se sa npm run electron
2. Da bi se videle izmene mora da se pokrene npm run electron-build pa onda npm run electron



------------------------------------------------------------
PRODUCTION:

1. u root main.js zakomentarisati liniju koda koja otvara devTools
  win.webContents.openDevTools();
