OTG! PERSONAL MAIN v8.0.170 — SWISS LIVE-RACING COMPACT UI (QA)
=================================================================
INSTALL ONLY OVER MAIN v8.0.169, NOT LAB OR THE PUBLIC WEBSITE.

WHAT CHANGED — VISUAL ONLY
- Live Swiss round & Swiss knockout match-racing screens now use a compact
  motorsport-style layout inspired by the successful Evil Race Off interface.
- Clear UP NEXT panel identifies both competing cars and which racer runs next.
- History shortcuts for both cars in UP NEXT and all match-list rows.
- Last-raced-in-Evil E✓ badges match the current accepted cyan / orange / purple
  rules and remain absent from cars with no prior saved Evil result.
- The repeated next pair is a small row under UP NEXT instead of a second big card.
- Match list scrolls when long; compact spacing gives more racing information
  on small phone screens. Native CONTINUE, BACK and result-save controls remain.
- A Car History shortcut also appears on Swiss result-entry pages.

WHAT DID NOT CHANGE
- Swiss War Room, pairings, opponents, wins, standings, tiebreakers,
  rounds, knockout advancement and Evil Tournament slot continuation.
- All finished and active Festival/Race Off events, badges, upgrade settings,
  lap times, car records, championship medals, Garage and other Spaces.
- MAIN v8.0.165 anti-repeat track shuffle, v8.0.167 Festival improvements,
  v8.0.168 Race Off improvements, v8.0.169 return-button refinements,
  Hall of Shame, Cone Breaks and secret side missions.
- Zero localStorage mutations; no data migration or destructive action.
- Ordinary (non-Evil) Swiss races and general Festival screens are unchanged.

INSTALL WITH OUR FAMILIAR C:\RaceHub PERSONAL MAIN GITHUB WORKFLOW
1. Export a fresh Portable Backup first. Keep v8.0.169 available to revert.
2. In VS Code check Get-Location => C:\RaceHub; verify git remote points to
   PERSONAL MAIN, not LAB or public website.
3. Extract this ZIP OVER your existing C:\RaceHub folder, preserving all files.
4. Check update-manifest.json and index.html version show v8.0.170; review git status.
5. Run one line at a time:
   git add -A
   git commit -m "OTG MAIN v8.0.170 compact Evil Swiss racing QA"
   git push origin main
6. Use existing app updater on phone; do NOT clear data, remove app or import.

PHONE QA — NO NEW RACE OR SWISS ROUND START REQUIRED
A. Settings shows v8.0.170.
B. Open an ALREADY STARTED active Swiss round (one exists in Slot 26's saved
   competition, but it may not be visible in an individual slot when awaiting
   next campaign visit). Look for UP NEXT, both car histories, coloured E✓.
C. Check match list scrolls, native CONTINUE and BACK are present.
D. Optional: open result entry, confirm the history shortcut; BACK WITHOUT
   saving. If next round has not been started yet, DON'T start it for QA.
E. Screenshot the Swiss racing screen. QA acceptance is pending phone test.

BROWSER QA COMPLETED
- Chrome fixture based on user's 2026-11-05 Portable Backup Swiss R2 match
  and car IDs; 375px and 414px widths, both Swiss/knockout phases, ordinary
  non-Evil exclusion and result-entry history click all passed.
- No DOM-generated horizontal overflow, JavaScript page errors or data writes
  in the fixture. Real phone/main app still requires QA.

NEXT PROJECT AFTER SWISS: harmonise Festival presentation with the tidier
Race Off design (per user's Nov 6 preference) without changing its mechanics.
