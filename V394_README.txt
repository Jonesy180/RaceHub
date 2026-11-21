OTG! MAIN v8.0.394 — OFFICIAL TRACK ASSIGNMENT PREFLIGHT (READ ONLY)

DELTA OVERLAY: Extract into your known-good v8.0.393 C:\RaceHub repository; DO NOT delete older JS/assets. This package is not a standalone app.
Adds an evidence-only preflight panel under Race Control, combining catalogue integrity, family/category compatibility, schedule joins, unresolved visit count and recent track repetition flags. Even if the evidence is complete, no official assignment or Slot 001 activation is permitted. No new module reads or writes localStorage, IndexedDB, Garage, results, honours or schedule state.
QA: check the deployed version stays at 8.0.394 after relaunch; open TET2 > Race Control > OFFICIAL TRACK ASSIGNMENT · PREFLIGHT, inspect blockers and prior panels. Slot 001 must stay locked.
IMPORTANT: Existing repository must retain all historical assets referenced in the existing service worker critical list. This overlay includes only new files.
