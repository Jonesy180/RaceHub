OTG! MAIN 8.0.202 — COMPACT FESTIVAL RELAYS + ROUTE LOCK DIALOG QA

SAFE INCREMENTAL UPDATE based on phone-approved v8.0.201.
Unzip into existing C:\RaceHub; overwrite matching paths, DO NOT delete other files.
Preserve phone browser site data, relay QA saves, Garage, all Spaces and private content.

Changes:
- Festival relay section is now one compact expandable tile; open it to see the two relay launch buttons.
- Route-lock native browser confirm replaced with OTG-styled modal showing all 3 routes, CANCEL and CONFIRM & LOCK.
- Existing v8.0.197 synchronous lock handler and storage validation remain authoritative.
- No changes to competition results, old Evil tournament, relay data schema, medals or career records.

Phone QA:
1. Check installed version 8.0.202; close and reopen twice (no loop).
2. Festival: one compact Relay Competitions tile; tap expands, tap again collapses.
3. Open Manufacturer and Mixed from the dropdown, returning correctly.
4. In an untouched group tap Lock Routes: in-app panel displays three tracks; CANCEL leaves group unlocked.
5. Reopen confirmation, CONFIRM & LOCK; reload and confirm routes remain locked.
6. Check old recorded times, 704-car Garage (unless changed), private media, other features.

Do not test permanent locks on a group with pre-lock times or one you want left unlocked.
No old saves are migrated. Existing QA saves remain outside portable backup coverage.
