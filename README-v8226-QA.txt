OTG! MAIN v8.0.226 — SMALL COMPETITION SOURCE VERIFICATION QA
SMALL OVERLAY ON PHONE-PASSED v8.0.225. NO RACING HISTORY RESET.

Changes:
- Inside Festival > Second Chance Cups > Qualifier Inbox, new expandable
  SMALL COMPETITION SOURCE CHECK for finished Manufacturer, Car Type, Hot
  Wheels, Rally, and Off-Road competitions already stored as runs/Race Offs.
- Uses the actual source participant roster and owned FH5 Garage car data.
  Manufacturer and Car Type labels require the name AND entrant metadata to
  match; Hot Wheels requires every entrant to be Hot Wheels. Off-Road/Rally
  follows the actual completed event's title. Unknown/unmatched is not guessed.
- Read-only previews of BOTH bronze cutoffs (through 3rd -> 4th, through 4th
  -> 5th). Where the source has too few entrants, results are incomplete or
  tied, or a qualifying car is missing, preview says BLOCKED. Never fabricates
  a 4th place finisher in a three-car championship!
- SELECT COMPLETED SOURCE scrolls logically into the existing source dropdown
  selection, where you must confirm medals before any QA ticket is created.
- Prevents an ordinary finished Swiss run from being used with the generic
  cumulative-time adapter (Swiss requires separate final standings support).
- Previous v225 Race Off verification, Cups 1 & 2, Ultimate QA final results
  and the updater navigation fix are all preserved.
- NO automatic awards, career records, medals, new official results, or reset.
  Only explicitly confirmed QA tickets go to isolated Second Chance storage.

INSTALL: Extract over C:\RaceHub. Overwrite matching files. DO NOT DELETE any
existing files or clear browser data.

YOUR 3 VS CODE LINES:
git add .
git commit -m "OTG v8.0.226 Specialist Second Chance Source QA"
git push

PHONE QA:
1. Open Festival > Second Chance Cups > Qualifier Inbox.
2. Expand SMALL COMPETITION SOURCE CHECK.
3. Existing historical completed Mitsubishi Normal Championship (3 entrants)
   should be recognised as MANUFACTURER, but 4th-place ticket is BLOCKED.
4. Existing completed Off-Road — Mitsubishi Championship (6 entrants) should
   be recognised as MANUFACTURER · OFF-ROAD and display real eligible
   candidate previews from both possible bronze cutoffs.
5. Tap SELECT COMPLETED SOURCE for Off-Road Mitsubishi and confirm that the
   original source picker shows it (do NOT claim unless you deliberately want
   one QA test ticket). Neither event should be marked newly completed.
6. Confirm Cup 1, Cup 2, Ultimate Champion and all saved race times unchanged.
7. Reload. Still no update loop, no surprise QA tickets or honours changes.

NEXT: Source adapters for group championships, Relays, Swiss; eventual official
medal integration. Nothing should reset until all Evil Tournament 2.0 mechanics
are finished, tested and approved.
