OTG! MAIN v8.0.354 — NATIVE DRAG SHOOTOUT FESTIVAL CATEGORY

This is a SMALL PRESENTATION PATCH to Main v8.0.353. Does NOT replace or rebuild Drag Shootout racing logic.

SOURCE FINDINGS:
- Existing FH5 Drag Racing specialist is in js/fh5-festival-raceoff-presets-v8056.js.
- Existing one-run-per-car fixed Drag Shootout rules are in js/v8-fixes-v8065.js.
- Existing Festival facelift v8325 moves native drag specialist underneath Class/Type.
- v8.0.354 moves the existing native Drag Racing details element into a dedicated DRAG SHOOTOUTS Festival accordion; it DOES NOT clone racing controls, change eligibility, or write save data.
- This is not a tournament Evil List, nor a new 16-car limited pilot.

HOW TO APPLY: Extract all files over C:\RaceHub without deleting other folders. Check git diff/status; then use usual three Git commands. Keep LAB unchanged.

PHONE CHECK: confirm v8.0.354 installs and a DRAG SHOOTOUTS Festival heading appears with native entries underneath. No races/results to enter. Do not force a total car count from the number of categories.

Note: no change to Second Chance, Champion of Champions or universal medal systems; those are still pending Stage 3/5 integration.
