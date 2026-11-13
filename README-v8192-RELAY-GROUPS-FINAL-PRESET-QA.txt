OTG! MAIN v8.0.192 — RELAY GROUPS + ULTIMATE FINAL PRESET (PHONE QA)
====================================================================
BASE: accepted MAIN v8.0.191. This is an INCREMENTAL patch, NOT a full app.

INSTALL
1. Keep fresh portable export containing your 704 owned FH5 Garage cars and
   separately preserve private photos/media. Do not restore the old 698-car backup.
2. Extract this ZIP into existing C:\RaceHub, overwrite matching files only.
   Do not delete existing folder, uninstall the phone app, or clear app storage.
3. git add -A
   git commit -m "OTG MAIN v8.0.192 relay groups and ultimate finals QA"
   git push origin main

NEW
- Manufacturer team display label: Ford 1, Ford 2, BMW 1 etc., numbered
  within each manufacturer's teams in the frozen draw. Mixed: Team 1,
  Team 2 etc. Internal IDs and saved team lineups remain untouched.
- Opening-round groups: up to four teams each, balanced groups when total
  is not divisible by four. 3 races per team, one group at a time.
- Group navigation, individual group standings, group directory.
- Qualifying track POLICY preview: Street Scene / Road Sprint, 3 distinct
  routes per group, comparable only within the group.
- Proposed fixed FH5 GRAND FINAL route order: The Marathon, The Goliath,
  The Colossus. The Goliath is explicitly the special endurance exception
  to the no-circuits rule. This is a PREVIEW, not active track assignment.
- Fixed-final-only ALL-TIME relay records policy, separate for Manufacturer
  and Mixed, is shown but recording is NOT active yet.
- Repeatable seed/redraw now stack vertically to remove phone misalignment.

OUT OF SCOPE / NOT YET IMPLEMENTED
- Actual route selection or track IDs (must first verify existing catalogue).
- Automatic group winner advancement, later rounds or playable grand final.
- Permanent race records, medals, or Evil 2.0 campaign integration.
- Any modification to old Evil 1 data, existing Space/Garage/private content.

IMPORTANT
Existing QA relay saves remain stored under their existing schema-1 local
keys, unmodified. All saved times remain preserved; we do NOT retroactively
assign tracks to already recorded stage times. The normal portable export may
not contain isolated QA relay records. Do not clear browser/site storage.

PHONE QA
A. Open Evil 2.0 -> Relay Garage. v8.0.192 visible, Back works.
B. Locked Manufacturer: group X of Y, up to four teams, naming e.g Ford 1;
   navigate groups/teams and inspect standings. Existing times still present.
C. Mixed unlocked: seed input and Redraw stacked, aligned; Team 1 etc.
   If you choose to lock, check teams persist and Race Control is readable.
D. Ultimate final preset shows Marathon -> Goliath -> Colossus, clearly QA
   preview only, not assigned to existing group races.
E. Confirm Garage ownership, existing data and private media unaffected.
