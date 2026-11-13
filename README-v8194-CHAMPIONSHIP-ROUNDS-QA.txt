OTG! MAIN v8.0.194 — RELAY CHAMPIONSHIP ROUNDS + REHEARSAL QA
=================================================================
BASE: PHONE-PASSED v8.0.193 (incremental patch; NOT complete app)

INSTALL
1. Preserve a current 704-car-or-newer portable export and separately stored private media.
2. Extract the ZIP into C:\RaceHub and overwrite the matching files. DO NOT delete the folder, uninstall OTG, or clear site data.
3. git add -A
   git commit -m "OTG MAIN v8.0.194 relay championship rounds rehearsal QA"
   git push origin main

WHAT IS NEW
- Locked relays now display CHAMPIONSHIP ROUNDS / QA REHEARSAL inside the opening round Group Directory.
- After ALL opening groups finish with unique winners, CONFIRM ROUND 2 creates groups from the qualifiers, without modifying the opening-round save.
- Subsequent round stages have separate time-entry, three-car team consistency, group standings, winner progression, tie blocking and save/resume.
- Each subsequent round is stored in a NEW isolated QA localStorage key otg.evil2.relay.qa.rounds.v2:<Space ID>:<mode>.
- The source v8.0.190 schema-1 locked draw and times are not migrated or modified by later-round controls.
- The latest generated round has its own entry screen; completed previous rounds remain in the summary. Existing names and team lineups never redraw.
- FINAL rounds display The Marathon → The Goliath → The Colossus as a preview; NO real course/track IDs assigned yet.
- Opening group qualifiers changed after a next-round was created: later rounds freeze, rather than silently replacing them.

KEY QA FEATURE — NO NEED TO RACE HUNDREDS OF TEST EVENTS
- From the new Championship Rounds screen, tap TEST 16-TEAM REHEARSAL.
- Rehearsal makes a temporary 16-team sample from the existing locked draw IN MEMORY ONLY.
- Tap FILL THIS ROUND WITH SYNTHETIC TEST TIMES; inspect winners and press CONFIRM ... NEXT ROUND.
- The next round is the 4-team Grand Final. Fill synthetic final times to see a QA champion.
- EXIT REHEARSAL returns to the real locked draw and previously saved QA rounds.
- Rehearsal does NOT write ANY localStorage key, career result, record, Garage, or Evil slot.
- The rehearsal display always identifies itself as SYNTHETIC and NOT SAVED.

DELIBERATE LIMITATIONS
- The real 192/234-team championship cannot create next-round racing until all its opening groups are complete. The rehearsal provides safe progression QA without real races.
- Verified Street Scene / Road Sprint route IDs and final route IDs still need catalogue verification. Do not infer track records from these QA times.
- No medals, team all-time records, career honours, normal racing results, or Evil 2.0 live campaign slots are created.
- QA local browser saves are not guaranteed inside standard portable export; do not clear app/browser storage.

PHONE QA
1. Open Evil 2.0 → Relay Garage → locked Manufacturer → GROUPS & STANDINGS → CHAMPIONSHIP ROUNDS / QA REHEARSAL.
2. Confirm live subsequent rounds LOCKED while opening groups unfinished.
3. Tap TEST 16-TEAM REHEARSAL; confirm 4 groups of 4 and normal time-entry field.
4. Tap FILL THIS ROUND WITH SYNTHETIC TEST TIMES → next round. Confirm four qualifiers in the Grand Final.
5. Fill final; check champion display and the three named final routes.
6. EXIT REHEARSAL; confirm original Manufacturer stage times and group winners unchanged.
7. Switch to Mixed Relay; verify independent data, back navigation and Garage intact.
