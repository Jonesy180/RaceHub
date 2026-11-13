OTG! MAIN v8.0.195 — Relay Smart Route Selection QA

Install: extract into EXISTING C:\RaceHub and overwrite matching files. Do NOT delete folder or storage.
git add -A
git commit -m "OTG MAIN v8.0.195 relay smart route selection QA"
git push origin main

Changes:
- FH5 Street Scene and Road Sprint route pools checked against official Forza route listing.
- Group-specific 3-route allocations calculated deterministically from locked team IDs, round, and group.
- Every team in one group sees the same 3 routes; adjacent groups prefer different routes.
- Finals preview: The Marathon / The Goliath / The Colossus (exception for Goliath).
- Routes displayed inside opening-round Race Control and later-round/rehearsal screen.
- STRICT PREVIEW ONLY: no route assignment is written to saved racing results yet. Existing saved times are NOT automatically associated with any preview route.
- Route keys are local preview identifiers, NOT catalogue stable track IDs. Official catalogue identity bridge is a separate future QA step.
- No data migration, honour/record changes, Evil 1 reset or updates to private content.

Phone QA:
1. Open saved Manufacturer Relay: see three distinct allowed routes on current group.
2. Move to next group: three-stage route plan changes; back returns same plan.
3. Open Mixed Relay: independent consistent allocation.
4. Open 16-team rehearsal: route cards visible; final displays Marathon, Goliath, Colossus.
5. Existing recorded test times still saved and Garage unaffected.

Reference: Official Forza FH5 routes and events: https://forums.forza.net/t/fh5-routes-and-events/773135
