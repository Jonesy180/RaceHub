OTG! MAIN v8.0.193 — RELAY QUALIFICATION & CHAMPIONSHIP LADDER QA
=================================================================
BASE: user-accepted MAIN v8.0.192. Incremental patch only (NOT complete app).

INSTALL
1. Keep the recent portable backup showing 704 FH5 owned cars, and your
   separately protected private artwork/media. Do not restore an older export.
2. Extract this patch into C:\RaceHub, overwrite matching files WITHOUT
   deleting any other files. Do not uninstall phone app or clear site storage.
3. git add -A
   git commit -m "OTG MAIN v8.0.193 relay qualifying ladder QA"
   git push origin main

WHAT IS NEW
- Each locked opening-round group now displays a qualification status:
  incomplete / winner qualified / tied for first.
- Group winner determined ONLY when all members have complete three-stage
  times; minimum total qualifies. Equal winning totals are flagged as a tie
  and no winner is automatically chosen.
- A read-only Championship Qualification view counts qualified/pending/tied
  groups and displays the winner of each completed group.
- ONLY when every opening group has a unique winner, it previews the next
  round's four-team groups using those exact team IDs (no redraw/reuse).
- Existing v8.0.190 schema-1 relay QA draws and stage times are READ without
  any save migration. Qualification is computed on the fly and updates as
  stage times are recorded or corrected.
- This remains isolated QA. No permanent career honours or team records.

DELIBERATE LIMITATIONS — DO NOT CONFUSE WITH FINISHED FEATURES
- Next-round results and active advancement are NOT yet playable. This is
  the qualification engine and bracket preflight. Only the opening-round
  stage timing already present in v8.0.192 is editable/saved.
- Actual group Street Scene / Road Sprint route assignments are NOT active.
  Routes need verified catalogue identity/classification first. Existing
  times are NOT retroactively assigned fictional tracks.
- Grand Final is still the planned fixed Marathon / Goliath / Colossus
  preset, not yet a playable final or permanent record table.
- Previous Evil 1.0 remains reversibly retired; campaign data untouched.
- Relay QA browser-local saves may not be included in portable export.
  Do not clear browser storage.

PHONE QA
A. Open Evil 2.0 / Relay Garage, check v8.0.193 and BACK navigation.
B. Locked Manufacturer Relay: look for PENDING status (e.g. 0/4 finished).
C. Complete one test group (4 teams x 3 stage entries); the group status
   should change to QUALIFIED with the fastest team. No other groups should
   be marked finished or qualified.
D. Correct a previously saved time and inspect whether group winner
   recalculates. Leave/reopen: stage times still present.
E. Open CHAMPIONSHIP QUALIFICATION: groups/pending/qualified totals and
   next-round preview correctly stay locked until every group finishes.
F. Check Mixed Relay stays separate; Garage, other screens and private media
   remain unchanged; note any browser-unresponsive warning.

Automated verification: JS syntax, ZIP integrity, balanced group counts for
1/3/4/5/7/12/16/48/192/234 teams, qualification and tie gating.
