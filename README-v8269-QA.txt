OTG! MAIN v8.0.269 — PRELAUNCH READ-ONLY INTEGRITY CHECKS
Cumulative overlay on v8.0.268. Contains all files from v268 plus v269 versioned files.

WHAT WAS CHANGED:
- Prelaunch QA Controls display the 5 non-destructive checks on demand.
- QA-only freeze refuses to run if those checks fail.
- No live Evil reset, saved Garage mutations, deletion of old code or new honours.

FESTIVAL CLEANUP STATUS:
- AUDITED: The latest overlay refers to many legacy Festival and competition-engine scripts retained on the installed repository. Core Festival implementation files are NOT present in this overlay ZIP.
- NO DESTRUCTIVE CLEANUP PERFORMED: removing those script tags or hiding unknown selectors could break normal Festival or new Evil engine dependencies.
- Retain prior files; do not delete the Festival folder. Clean up the visual clutter only after inspecting the source modules and testing on phone.

MYSTERY HERO STATUS: Not included in this QA release; artwork and cinematic reveal still pending. Existing compact hero remains unchanged.

PHONE QA:
1. Update without clearing browser storage.
2. Open dashboard Evil Tournament; verify 2225 stages, Stage 3 Abarth, and navigation.
3. Expand PRELAUNCH QA CONTROLS; inspect check status.
4. Do not press freeze unless you intend to save the QA schedule; this is NOT the live tournament reset.
