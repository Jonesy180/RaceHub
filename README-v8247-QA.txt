OTG! MAIN v8.0.247 — FIRST PRELAUNCH RACE SAVE BUTTON MOBILE HOTFIX
INSTALL ON TOP OF v8.0.246. 22 FILE CUMULATIVE DEPENDENCY-SAFE OVERLAY.
Copy files over C:\RaceHub WITHOUT deleting any existing data/files.

 git add .
 git commit -m "OTG v8.0.247 First Race Mobile Save Fix"
 git push

REPRO REPORTED: Samsung Browser save tap after entering time showed no change.
FIX: explicit button-click listener (same root event path that reliably froze
race draws), no dependency on native HTML form-submit on mobile, plus
SAVED/NOT SAVED status placed immediately above the current race card.
Keyboard Enter retains form-submit as secondary path.
Reads old v8246 isolated prelaunch race storage (same prefix and schema);
existing frozen first group is NOT drawn again; prior pilot times unaffected.
All data saved are isolated PRELAUNCH results only, not official career data.

PHONE:
Festival > EVIL 2.0 — FIRST PLAYABLE RACE CARDS (PRELAUNCH) > OPEN
FIRST RACE COCKPIT > same already frozen group.
Type 03:42.250 (actual input, not gray placeholder); tap SAVE THIS TIME.
Check green SAVED above card, counter 1/16, Next Up moves to next car.
Back to Festival then reopen to confirm 1/16 persists.
Invalid time clearly shows NOT SAVED by top of screen.
Garage, original Evil Tournament, results, medals remain untouched.

IMPORTANT PRODUCT DESIGN: pilot has its OWN isolated controls for QA ONLY.
Final official Evil 2.0 will integrate with existing OTG Enter Results /
Advanced Timing and its official stats/records/medals on explicit launch
and approval. No duplicate official racing history or second permanent
result entry system should be created. No live data migration now.

NO reset, dashboard switch, automatic import of trial results, official
record writes or private-story modifications.
