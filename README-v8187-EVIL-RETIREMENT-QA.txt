OTG! MAIN v8.0.187 — REVERSIBLE EVIL 1.0 RETIREMENT (PHONE QA)

INCREMENTAL PATCH over installed MAIN v8.0.186. Extract into C:\RaceHub, OVERWRITE matching files, DO NOT DELETE the old app folder.

SCOPE
- Dashboard Evil Tournament navigation now displays a lightweight Evil 2.0 development landing instead of rendering the 1,219-slot Evil 1.0 campaign. Normal show('evilcampaign') calls are also routed to this landing.
- Launcher buttons open existing isolated Relay Garage and Racing Cockpit QA modules.
- Legacy tournament scripts, source assets and local data are LEFT IN PLACE to preserve existing Festival, Race Off and Swiss engines.
- Zero database, localStorage, IndexedDB, slot, result, honour, Garage or private-media writes by this retirement patch.
- Explicitly NOT a tournament wipe or Slot 001 reset. Other entry paths to legacy code may remain; this is a safe UI retirement, not a verified full removal of all old computational paths.
- User has confirmed a current morning export and 704-owned-car portable backup. Protect private media separately: portable backups may not include it.

DEPLOY
 git add -A
 git commit -m "OTG MAIN v8.0.187 reversible Evil 1 retirement QA"
 git push origin main

PHONE QA
1. Version 8.0.187 appears ONCE; no update loop.
2. Dashboard > Evil Tournament opens the simple Evil 2.0 landing, without the old slot listing. Note whether unresponsive-page warning still appears. Repeat from dashboard twice.
3. Relay Garage button works; Manufacturer and Mixed preview, car count and Back.
4. Racing Cockpit button works; digits-only time input and Back. Do not record a test race unless desired.
5. Festival, Race Off, Garage, Home, other Spaces and private content still operate. Confirm existing ownership 704 if unchanged.
6. Do not clear browser storage, uninstall, or restore old 698-car backup. STOP if any unexpected data/progress changes.

TESTING: ZIP archive integrity and JS syntax static checks only; live phone QA required. A warning may persist because other legacy scripts still load on page startup.

ROLLBACK: Previous v8.0.186 app ZIP remains available. Replacing this patch's index and plumbing with the previous version restores the old route; no tournament data migration/reversal is required.
