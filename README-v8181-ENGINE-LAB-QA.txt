OTG! MAIN v8.0.181 — EVIL 2.0 RULES ENGINE LAB (QA)

This is an INCREMENTAL 10-file ZIP. Extract onto the EXISTING C:\RaceHub.
This does NOT create new playable Evil slots, perform the Evil reset, change any medals/E✓, or assign real tracks.

New button beneath EVIL 2.0 SAFE PREVIEW: EVIL 2.0 — ENGINE RULES LAB.
Shows REAL current FH5 owned Garage entries and tests in-memory scoring/rules with VERY CLEARLY LABELLED FAKE times/distances:
- Manufacturer relay: one random 3-car team for every make with >=3 cars; scores all 3 stages by total time.
- Mixed relay: 3 different makes/team; each car used once; show unused car count.
- Gauntlet: same make/type field, same three stages, combined time.
- Long jump: all owned cars on provisional random order, 1 attempt per car, distance ranking & filtered views (no medal duplication).
- Second Chance: source finisher immediately after LAST bronze position; 1 entry per car ever; editions of 16; only one group-of-4 winner; semifinals/final; tie cannot randomly advance.
- Smart-track engine: refuses to draw when route length/speed data missing, avoiding false 'smart' claims.
- Reset-map read-only: counts old Evil runs/Race Offs and clearly lists data that must be preserved.

Everything is READ-ONLY, NO localStorage, no IndexedDB writes, no results committed.
V8.0.180 safe preview stays available. Private family artwork and story packs NEVER enter the repository.

3 VS CODE LINES:
 git add -A
 git commit -m "OTG MAIN v8.0.181 Evil 2.0 rules engine QA"
 git push origin main

Open FH5 > Evil Tournament > EVIL 2.0 — ENGINE RULES LAB.
Use the top or bottom BACK button to return to the current Evil Tournament.
Do not clear phone app data or uninstall. Keep Nov 12 portable backup separately.

QA is a rules-engine stage, NOT the rebuilt tournament. Production requires verified track profiles, playable result entry and an audited safe reset. Developer mobile browser simulations are not the same as user phone PASS.
