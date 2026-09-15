## Current build: v8.0.62
Consolidated reliability update + Lonely Hearts.

- Update delivery is hardened: v8.0.61 → v8.0.62 must surface the UPDATE AVAILABLE / Safety Backup gate even if the new index reaches the browser before the new service worker.
- Safety Backups now protect the complete current Space payload, including active Race Off tournaments.
- Swiss Abandon is restored across Festival and Custom Racing Swiss/knockout continuation.
- Championship cards safely handle apostrophes/special characters, including `Pickups & 4x4's Championship`.
- Duplicate live Hennessey variants are repaired to one canonical manufacturer.
- LONELY HEARTS is built into Festival and Race Off: exactly one owned car per manufacturer; live eligibility before start, frozen field after start.
- Completed Race Off champions are included in Hall of Fame.
- Race Off landing lists all active tournaments so multiple parked brackets can be resumed.
- Main only; rh-guide remains v8.0.17. No reset required.

See `README.txt` and `QA-v8.0.62.txt` for deployment and live-test notes.
