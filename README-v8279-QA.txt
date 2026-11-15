OTG! MAIN v8.0.279 — ISOLATED NATIVE SAVE PILOT, NOT PRODUCTION CUTOVER

Backup: Keep your private JSON backup offline.
Default: existing localStorage save and all 4 Spaces remain unchanged.
QA: Dashboard > Evil Tournament > Prelaunch QA > ENABLE ISOLATED SAVE PILOT.
In pilot: DO NOT RACE. Tap TEST NATIVE SAVE; close app, reopen; VERIFY AFTER REOPEN; EXIT PILOT / RESTORE ORIGINAL.
Pilot test changes are discarded on exit; original localStorage remains the authoritative racing save.
No schedule freeze or racing reset.

Copy ZIP content into C:\RaceHub, overwrite matching files; never delete your current files.
git add .
git commit -m "OTG MAIN v8.0.279 Isolated native IndexedDB pilot"
git push
