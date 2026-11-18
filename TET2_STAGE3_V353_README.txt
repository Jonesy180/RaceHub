OTG! MAIN v8.0.353 — DRIFT ZONE SCORE REVERSION

Base: installed v8.0.352 (or if 352 was not installed, the original native engine and Festival menus remain unchanged). Overlays only changed files.

CHANGED
- Remove the new Formula Drift Zone Score launcher and specialist stylesheet from active index.
- Remove associated stylesheet from service worker mandatory cache; prevent update installation failure from stale cache file.
- Preserve existing Class/Type Drift Car Championship (22 cars) and its established racing engine. No change to Class/Type implementation.
- Preserve Festival, Race Off, Relay, Gauntlet, Long Jump and other competition code; no Garage or backup/data changes.
- Keep Second Chance and Champion of Champions TET2-exclusive.
- Correct initial bootstrap worker pin to v8353.

DELETE THE TWO RETIRED v8.0.352 FILES FROM THE GIT REPOSITORY:
  git rm -- js/tet2-formula-drift-score-v8352.js style-tet2-specialist-v8352.css
This is a source-file removal only. It does NOT clear any local storage or saves.
If the files don't exist in your repo, skip this git rm command.

Then the usual three lines:
  git add -A
  git commit -m "OTG Main v8.0.353 retire Drift Zone Score; retain existing Drift Championship"
  git push origin main

Phone check: new Drift Zone Score entry absent; Class/Type still includes the existing 22-car Drift Car Championship. Don't reset anything.

This does NOT implement Drag Shootout, Champion of Champions or a new Evil List. Those remain in Stage 3/5 as previously agreed.
