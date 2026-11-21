OTG! MAIN v8.0.391 — TET2 READ-ONLY TRACK/SCHEDULE INTEGRATION

Overlay ONLY. Install over accepted existing C:\RaceHub v8.0.390 hotfix, NEVER into empty repo.
New Race Control panel: SCHEDULE ↔ VERIFIED ROUTE PREVIEW.
Matches proposed verified FH5 route IDs with actual candidate Evil List visit identities (position/eventId/visit). Fails closed on duplicate, orphan, incomplete, or unverified identifiers. Shows first 12 visits and unresolved status.
Does NOT mutate Evil List, Garage, results, browser storage or official slots. No promotion or activation. Slot 001 locked. If no catalogue exists, shows genuine unresolved counts.

Test: node test_track_integration_v8391.js
Install: extract overlay replacing existing files, git add -A, git commit -m "OTG v8.0.391 read-only schedule route integration", git push origin main
Phone test: TET2 > Race Control; find SCHEDULE ↔ VERIFIED ROUTE PREVIEW after FH5 ROUTE ENGINE. Check it opens and existing panels still show.
