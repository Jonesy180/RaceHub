OTG! MAIN v8.0.376 — UNIFIED ALL-CAR GAUNTLET / ISOLATED STAGE REHEARSAL

Apply ZIP overlay to accepted OTG! Main v8.0.375 in C:\RaceHub. This is
not a full app replacement: it is a small, version-pinned overlay.

NEW
- TET2 -> Evil List -> Unified All-Car Gauntlet -> VIEW IN RACE CONTROL
  now offers a real-Garage, current-batch draw and native GROUP results entry.
- Draw exactly the current scheduled batch (up to eight; even a lone final car
  is supported, without changing old group-practice minimum of two).
- Enter and confirm 3 distinct FH5 practice route names before drawing.
- Each car is drawn once in the unified Gauntlet. No manufacturer/type
  Gauntlet duplicates. The next batch requires all 3 times per car from the
  previous batch to be recorded; no speculative future draws.
- Group result entry runs TRACK 1, TRACK 2, TRACK 3 for the whole batch.
  Each time is banked independently and restored on reopening, using the
  familiar compact-phone time converter and H/E badges.
- Complete three-track batch produces a LOCAL provisional rank by total time.
  No medals, records, final standings or official completion are awarded.
- All results are prelaunch-only, isolated to a new Space-scoped localStorage
  key; read-only FH5 Garage, no rhSave and no OTG medals/records changed.
- Existing manufacturer knockout rehearsal v375 remains on its exact old
  localStorage key. Previous draws/times are not migrated or reset.
- Schedule or Garage roster changes after a draw stop safely, not recast cars.

NOT DONE / SAFETY
- Candidate Evil List remains unlocked/read-only. No official slots, awards,
  final winners, track selection or competition-wide standings are enabled.
- This adds ONE further real format rehearsal (unified Gauntlet), not all
  remaining formats. Relays, Swiss, Aerodromo, historical groups and dependent
  finals still need verified adapters.
- Practice route names are typed, NOT official route assignments.
- Browser localStorage rehearsal data is not an OTG backup. Preserve backups.

PHONE QA — ONE CHECK
TET2 > Evil List > search "Unified All-Car Gauntlet" > select Batch 1 >
VIEW IN RACE CONTROL. Confirm a "UNIFIED GAUNTLET · CURRENT BATCH" box
with 8 cars (for the 704-car reference Garage) and three route fields.
You do NOT need to draw or enter any times.
