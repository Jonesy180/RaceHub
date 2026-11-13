OTG! MAIN v8.0.191 — RELAY RACE CONTROL PHONE QA
=================================================
Incremental update from installed, previously accepted MAIN v8.0.190.

INSTALL
1. Retain your VERIFIED 704-car portable backup and separately saved private art.
2. Extract this ZIP into existing C:\RaceHub, overwriting matching files.
   Do NOT delete the existing folder, uninstall the phone app or clear site data.
3. In VS Code terminal:
   git add -A
   git commit -m "OTG MAIN v8.0.191 Relay Race Control mobile QA"
   git push origin main
4. Check update version 8.0.191 on phone; let existing update safety gate finish.

WHAT CHANGED
- NEW isolated Race Control UX after a confirmed draw: one team and one
  focused car/time input, large full-width digits-only field, 00:00.000
  placeholder (NOT saved time), and Save & Continue.
- Team progress panel (three stages), next three teams, team navigation,
  jump-to-next-unfinished, and full draw/provisional standings.
- Compact pre-lock draw pages retained. Seed input and Redraw button align
  at bottom of their grid row; existing draws stay locked.
- Existing v8.0.190 relay QA storage uses exactly the SAME namespaced localStorage
  key and schema; NO migration, clears, resets, medals or live-race writes.
- Different manufacturer/Mixed QA draws remain independent by Space.
- Existing Evil 1.0 retired UI and saved data remain unchanged.
- No tracks assigned and no permanent standard-event integration yet.

PHONE CHECKS
A. Open existing locked Manufacturer relay from Evil 2.0. Previously
   entered stage times must be retained. The initial visible team is the
   earliest unfinished team.
B. Check clear UP NEXT, big placeholder 00:00.000, stage and team labels.
   Enter 0342250 -> save; result must read 03:42.250 and move to next
   unrecorded stage. Enter remaining two stages -> team total and next team.
C. Correct a previously saved stage through EDIT; confirm persistence.
D. Check Coming Up, team previous/next, Next Unfinished, Full Draw &
   Standings, and return/back.
E. Switch to Mixed; verify independent saved state. Before confirming a
   new draw, check seed/Redraw alignment on phone.
F. Confirm Garage (704 if unchanged), existing normal racing, private
   content, and no unexpected update loop.

CAUTION
Relay QA results are stored in the browser, separate from the standard
portable export. Do not clear the browser/site storage. This patch does
NOT delete your previous test relay; even if the earlier version showed
badly formatted inputs, previously saved numeric times remain intact.

KNOWN SCOPE
This is a phone-QA layout update, not a permanent competition engine.
No slot 001 launch and no old tournament reset.
