OTG! MAIN v8.0.436 — EVENT-DRIVEN FESTIVAL RESULT ENTRY

BASE: v8.0.435 FOUR TRACK FESTIVAL CAR-FIRST FIX. NO RESET. Preserves all existing saved tournament results, draws, medals, stock classes, setup briefings, Garage, normal racing and original OTG data.

AUDIT: Historical R1 source currently defines 423 timed Festival visits: 97 single-track, 287 two-track, 4 three-track and 35 four-track. NONE require five or more. This build also handles future source-authorised group visits with five or more named courses.

ARCHITECTURE: Historical Festival reads race count from the R1 source action and its real verified route selection. Official ledger accepts that exact locked track array, result-entry renders one field per race from the array, and completion requires entrantCount × trackCount immutable results. Car-first order stays. Group score/podium calculations already iterate the locked tracks dynamically. Changes do not alter the special event formats: Relay remains three distinct legs per team; Aeródromo remains Drag + Jump; Race Off remains paired head-to-head.

SECURITY: Never infer new competition stages or routes. Per-event lockHash, garage IDs, unique-track checks, real-route catalogue, official ledger bank validation, and original saved data all retained. New route counts greater than available real FH5 courses continue to fail closed at route allocation.

DEPLOY: Extract over your existing GitHub OTG source files. Then run:
git add -A
git commit -m "OTG MAIN v8.0.436 Event Driven Race Entry"
git push origin main

PHONE TEST: On Slot 4 Hennessey, verify 3 entrants × 4 courses. A newly started multi-track group should present one car's full list before advancing to the next, and show a setup reminder whenever needed. Do NOT reset.
