OTG! v8.0.392 — UPDATE LOOP HOTFIX (not v8.0.393)

Root cause verified in the shipped v8.0.392 archive:
- index.html and index-v8392.html incorrectly declared 8.0.391.
- update-wire-v8392.js redirected after activation to index-v8387.html.
These two stale version pointers can repeatedly offer the update or bounce to an old page.

This repair changes only both HTML version meta tags, the updater destination, updater user-facing messages and the worker cache identity to force a fresh worker installation/cache. The route reconciliation logic is unchanged.

Extract into C:\RaceHub preserving all existing files. git add -A; git commit -m "Fix v8.0.392 update loop"; git push origin main.

Phone QA: reopen app, install update if prompted once; verify installed version reports 8.0.392 after relaunch and no further prompt or forced navigation; TET2 > Race Control > FH5 Route Catalogue Reconciliation; Slot 001 remains locked. Do NOT erase site storage, unregister workers, or delete old scripts.
