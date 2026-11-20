OTG! Main v8.0.361 — TET2 Verified FH5 Garage Link & Slot Ledger Foundation

INSTALL: Extract this small overlay into the existing C:\RaceHub repository on top of the
phone-approved v8.0.360 release. Do not wipe, reset, move or replace Garage/Space backups.

VISIBLE CHANGE (one small phone check):
  TET2 > Race Control now queries your CURRENT real FH5 Catalogue Space through rhSpace().
  It shows Garage CONNECTED and the actual owned-car count, or a clear reason if you are
  in a different Space. The accepted Command Centre layout remains unchanged.

ENGINEERING CHANGES:
  - New isolated per-Space TET2 slot ledger (tet2OfficialSlotLedgerV8361).
  - Works with the existing v360 multi-car / Race Off results interface.
  - When supplied with an authenticated LOCKED Controlled Chaos slot by the future
    scheduler, it freezes the actual drawn IDs/tracks, writes banked results through
    the existing rhSave, resumes from stored results, blocks duplicate results, and
    locks completed slots. The results remain separate from ordinary OTG! racing.
  - Validates native Space, owned Garage IDs, match pairing, winner, track-by-track
    order, immutable result keys and source identity. A failed save rolls back.
  - No competition is auto-created. Without a verified Evil List scheduler, the
    official result-writing path safely refuses to run.
  - The v360 layout trials remain TEMPORARY and never write to the Garage or ledger.
  - Medal awards, record celebrations, the revised 1,500ish-slot generator,
    Aerodromo Drag+Jump scheduling and final race control flow are NOT connected yet.
  - No old Evil results are imported or reactivated. No Garage modifications.

TECHNICAL QA (local, not a phone approval):
  - Node tests exercised identity verification, save/rollback, unique draws, group
    track ordering, per-Space separation, both Race Off times and winner, completion.
  - Chromium 390px viewport smoke check: FH5 live link, safe pending schedule,
    v360 time-entry still usable with no native writes or page errors.

PHONE CHECK: TET2 > Race Control > Tournament Garage connection. Check that it reads
CONNECTED with the correct FH5 owned-car count. No racing or time entry required.
