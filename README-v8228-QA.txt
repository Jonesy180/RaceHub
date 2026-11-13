OTG! MAIN v8.0.228 — SECOND CHANCE ENTRY RULES + SWISS KO QA
Incremental overlay over phone-PASS v8.0.227. No career resets or medal writes.

IMPORTANT PERMANENT RULES:
- EVERY individual car may receive ONE Second Chance ticket for the WHOLE
  Evil Tournament. A car rejected after already entering cannot later join
  another Cup, regardless of source competition or previous elimination.
- All Relay competitions (Mixed & Manufacturer) are EXCLUDED from generating
  Second Chance tickets. Relay competition mechanics and awards unchanged.
- Repeat QA shortcuts (Cup 2, Cup 3, etc.) now use only never-entered FH5 cars.
- Existing Cup 1/2, Ultimate QA, Garage, Spaces and historic data untouched.
  Existing duplicate tickets from older QA builds are NOT silently deleted;
  they remain viewable, flagged, and future repeat entries are blocked.

SWISS: Finished eight-car knockout quarterfinal/semifinal/final can now supply
an explicitly user-confirmed QA qualification candidate IF every knockout
match is saved, all winners reconcile to earlier rounds and final champion,
track/layout is shared across every pairing within each knockout round, and
no required times tie. Bronze through 3rd -> slower SF loser in 4th.
Bronze through 4th -> fastest QF loser in 5th. In-progress Swiss Cups NEVER
qualify. Read-only example button works without finished live Swiss Cup.

INSTALL: Extract ZIP over C:\RaceHub (overwrite only, DO NOT DELETE anything).
VS Code PowerShell:
git add .
git commit -m "OTG v8.0.228 Second Chance Once-Only and Swiss KO QA"
git push

PHONE QA:
1. Festival > Second Chance Cups > Qualifier Inbox: ONCE ONLY text visible.
2. Tap VERIFY ONE ENTRY PER CAR (READ-ONLY): see the reject PASS.
3. Major source check: Relay cards say permanently EXCLUDED.
4. Swiss ongoing Cup still says IN PROGRESS, NO TICKET.
5. CHECK FINISHED SWISS KNOCKOUT EXAMPLE (READ-ONLY): returns 4th & 5th.
6. Cup1/2 results, Ultimate champion, saved times still there after reload.
7. Verify no update loop.

No automatic source ticket harvesting, official medals, historic race results,
career reset, or evil-tournament launch in this QA overlay. Those require
further testing and explicit user approval. v8.0.227 remains baseline until
v8.0.228 phone PASS.
