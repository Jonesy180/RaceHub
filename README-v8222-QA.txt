OTG! MAIN v8.0.222 — SECOND CHANCE CUP PROGRESSION QA

SMALL, DATA-SAFE OVERLAY on v8.0.221. No reset and no official results/medals.

WHAT CHANGED
- The accepted 8.0.221 Group A result is kept in the SAME isolated QA save.
- After a finished Group A, one guarded button adds 12 clearly TEST-labelled
  entrants as Groups B, C and D. Group A's stored times are never edited.
- Each B/C/D group still requires a heat winner (run or demo-fill the group).
- Existing two semifinals, shared-semifinal track, and final are unchanged.
- Read-only ULTIMATE CHAMPIONSHIP QUALIFIERS register shows every finished Cup
  champion, with one Grand-final entry per distinct car if it wins twice.
- Grand-final bracket is NOT playable yet; this build proves qualifying first.
- If several future Cups are finished, all their champions appear automatically.
- Update-loop navigation repair retained. No changes to other competition UI.

INSTALL: Extract ZIP over C:\RaceHub and overwrite matching files ONLY.
Do not delete old files or clear browser storage.

git add .
git commit -m "OTG v8.0.222 Second Chance Cup Progression QA"
git push

PHONE QA
1. Open Festival > Second Chance Cups. Group A results should be unchanged.
2. Tap ADD 12 TEST TICKETS — GROUPS B–D.
3. Confirm three additional four-car groups appear, with Group A untouched.
4. Tap FILL THIS GROUP WITH SIMULATED TIMES in each of B/C/D.
5. Lock one circuit for both semifinals; enter two race times for each.
6. Enter two final times; confirm Cup 1 champion appears under ULTIMATE
   CHAMPIONSHIP QUALIFIERS (qualifying entry only, no medal awarded).
7. Reload the page and confirm all results and the qualifier remain.

NEXT: repeat with Cup 2 to confirm multiple Cup champions; then implement the
ultimate Finals Night bracket and connect all real completed source formats.
