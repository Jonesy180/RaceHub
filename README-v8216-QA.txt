OTG! MAIN v8.0.216 — UPDATE LOOP ACTIVATION REPAIR QA

Overlay onto v8.0.215 MAIN. Extract into existing C:\RaceHub and overwrite only matching files. DO NOT delete folder or clear phone storage.

Bug: startup update gate checked stale active service-worker before accepted-version marker, re-offering update while new worker was still taking control.

Fix: (1) accepted target version takes precedence over stale controller (2) waiting already accepted worker can activate without a duplicate modal (3) accepted marker written only after successful registration, removed on failed install. New updates still use safety backup gate. No reset or racing data migration. Gauntlet script unchanged.

PHONE QA: Install update using prompt once. Reopen app 3 times without manually restarting phone/browser between; no repeated UPDATE NOW modal. Check manual update button. Return to Abarth / another manufacturer and car type; all results and routes persist. Do not uninstall or clear storage.
