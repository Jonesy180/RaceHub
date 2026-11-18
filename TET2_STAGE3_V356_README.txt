TET2 / OTG MAIN 8.0.356 — FINAL BATTLES ENGINE FOUNDATION

Source: current accepted v8.0.355 overlay + original v8.0.346 donor.

Adds js/tet2-final-battles-v8356.js. No UI, no storage writes, no changes to Garage, events, previous results, existing Second Chance QA pilot, or normal Festival/Race Off navigation.
The new engine is a read-only pure calculation module intended for the TET2-only Tournament HQ / Evil List integration in Stage 5.

LOCKED:
- Second Chance: >=4 entrant completed Manufacturer Race Off or Lonely Hearts knockout; bronze duel winner among the two losing semifinalists; one unique car per source and one qualification per car. NO 16 car cap.
- Champion of Champions: 1 car per manufacturer. Single-car manufacturer auto-entered; otherwise Manufacturer Race Off winner after confirmed completion. Finale AFTER Second Chance.
- Head-to-head knockout schedule limited to 8 matches per Evil List visit; mandatory bronze duel before final for 4+ fields.
- A completed-result receipt is required; no guessing qualifying entries from pre-existing save schema.

NOT YET DONE: Real data receipts from shared results pathway, user UI, saving endgame results, medals, TET2 Tournament HQ, full Evil List. Do NOT treat this as a finished playable Second Chance / Champion of Champions competition.

QA: pure engine automated tests; no phone testing required for new screen because no screen added.
Overlay into C:\RaceHub AFTER reviewing; do not delete donor files or reset anything.
