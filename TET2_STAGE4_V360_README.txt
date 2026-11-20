TET2 v8.0.360 — Multi-result Entry, Stage 4 incremental overlay

Extract the ZIP into your existing Main repository after installing v8.0.359.

Changes:
- Race Control has two working interactive previews: three-car group and Race Off pairings.
- Phone keypad: 0336784 becomes 03:36.784. Per-car H (no tick), E✓ where relevant. No car pictures.
- Group entry banks times individually, track by track; Race Off banks both timed competitors per pairing.
- Preview saves exist ONLY in RAM while screen is open. They NEVER touch OTG! results, Garage, Spaces, backups, medals or TET2 official records.
- Controller integration API TET2ResultsEntry360.openScheduled() needs verified slot, competition and active-space IDs plus a transactional onBank callback; not yet wired into an Evil List controller.
- Record comparison, podium celebrations and official slot completion are for subsequent connection.
- The obsolete fixed 1,219 slot count was removed from the Evil List placeholder.

Phone check: Update to v8.0.360, open TET2 > Race Control > 3-CAR GROUP. Type 0336784 and Save. Then open RACE OFF PAIRS and check both times can be banked. No racing required.
