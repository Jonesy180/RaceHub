OTG! v8.0.397 — OFFICIAL KNOCKOUT RACE BRIDGE (FUNCTIONAL, LIMITED COVERAGE)

This is not full 2,071-visit tournament readiness. Working live subset: Lonely Hearts and full-manufacturer Race Off stages, only where full eligible entrant fields, scheduled match counts, stable catalogue tracks and previous verified results allow an exact locked draw.

The bridge connects the REAL FH5 Catalogue Space to the existing official v8361 slot ledger, the v8376 timed race-entry UI, and the existing v8358 isolated honours bridge. A real user confirmation is required before Slot 001 starts; there is no auto-reset, no OTG racing writes, and no silent medals. Completed knockout medals publish only with explicitly verified semis -> bronze -> final chains. Other formats (Swiss, Relays, historic visits, Gauntlet, Aerodromo, Festival, Drift, Second Chance, Champion) are NOT enabled by this update.

IMPORTANT LIMITATION: once official racing begins, the current schedule/Garage signature must stay consistent; changing the garage or regenerated schedule will trigger safe-stop rather than corrupting the draw. Consequently this build should be treated as a limited-live pilot, not as the final production-ready tournament until all formats and permitted draw-period Garage changes have been addressed.

INSTALL: Overlay into C:\RaceHub without deleting existing versioned files; git add -A; git commit -m "OTG v8.0.397 first official TET2 knockout slot"; git push origin main.

PHONE QA: First confirm version 8.0.397, TET2 > Race Control > OFFICIAL RACING panel, and existing Garage and track views. Review Slot 001 matchup identities and tracks BEFORE pressing start. The new start action writes an official frozen draw and should NOT be used for a practice test.
