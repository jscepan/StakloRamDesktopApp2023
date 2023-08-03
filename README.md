---

FRONTEND: pisan u Angularu
Obratiti paznju na kom portu se startuje backend i isti taj port treba podesiti na backendu u server.js fajlu kako ne bismo dobijali CORS error. Trenutno je namesteno da frontend radi na portu 55552

---

BACKEND: pisan u NODE

---

DATABASE: koristi se SQLITE3 baza

---

ELECTRON:

1. Instalirali smo electron zavisnost sa komandom: npm i electron --save-dev
2. U index.html smo u base href dodali tacku pa sad izgleda = href="./"
3. Kreirali smo u samom projektu fajl main.js
4. U angular.json smo setovali za outputPath vrednost "dist/radnja" sto je putanja gde ce nam se bildovati projekat
5. Dodali smo u package.json:
   u vrhu:
   "main": "main.js",
   u skriptama:
   "electron": "ng build && electron ."

---

DEVELOPMENT:

1. Pokrece se sa npm run electron

---

PRODUCTION:

1.  Koristili smo electron-packager za EXE. Instalirali smo ga sa:
    npm install electron-packager -g
2.  u root main.js zakomentarisati liniju koda koja otvara devTools
    win.webContents.openDevTools();
3.  Odradimo build za ceo projekat - dosta je samo npm run electron
4.  Kada je build gotov, možete koristiti "electron-packager" da zapakujete vašu Electron aplikaciju u .exe fajl.
    Otvorite terminal i uđite u root direktorijum vašeg projekta. Zatim pokrenite sledeću komandu:
    Ja sam do sada koristio:

    electron-packager . StakloRamPlusApp -- platform=win32 --arch=x64 --out=dist/StakloRamPlusApp/ --overwrite --icon=staklo-ram-icon.ico
    electron-packager . StakloRamPlusApp -- platform=win32 --arch=ia32 --out=dist/StakloRamPlusApp/ --overwrite --icon=staklo-ram-icon.ico

        electron-packager . MyAppName --platform=win32 --arch=x64 --out=dist/ --overwrite --icon=icon.ico

    Gde:
    . predstavlja putanju do root direktorijuma vaše aplikacije.
    MyAppName zamenite ovim imenom koje želite da bude ime izvršnog fajla.
    --platform=win32 označava da želite da zapakujete za Windows platformu.
    --arch=x64 označava da želite da zapakujete za 64-bitnu verziju.
    --out=dist/ označava putanju gde će se izvršni fajl sačuvati.
    --overwrite označava da želite da prepišete postojeće fajlove, ako postoje.
    --icon=icon.ico označava putanju do ikonice koju želite da koristite za izvršni fajl (opciono).
