OTG! MAIN 8.0.393 — TRACK ASSIGNMENT READINESS (READ ONLY)

OVERLAY ONLY: Extract into existing phone-PASS v8.0.392 C:\RaceHub without deleting earlier JS or asset files.
Race Control adds TRACK ASSIGNMENT · READINESS showing per-visit verified existing IDs, verified proposals, and blocked reasons. No official assignment or slot activation.
No localStorage, IndexedDB, Garage, results, honours or schedule writes in new module.

QA: install once, confirm 8.0.393 stays after relaunch and no update loop; open TET2 > Race Control, inspect readiness and previous track sections. Confirm Slot 001 locked.

BEFORE PUSH: install manifest guard checks this overlay's new versioned scripts and dependencies of previous pass build; if a referenced historical dependency is absent from your existing repository, push must be withheld until restored. This is a delta overlay, not a standalone app.
