OTG! MAIN v8.0.375 — MANUFACTURER RACE OFF STAGE REHEARSAL (PRELAUNCH)

Overlay onto accepted Main v8.0.374 in C:\RaceHub. Does not replace
OTG main racing, OTG Space data, Garage, honours, or backups.

NEW:
- A Manufacturer Race Off Evil List entry routes directly to a current-stage
  REHEARSAL DRAW / RESULTS box in Race Control. Draws up to EIGHT matches in
  precisely the selected visit, even for 28-car BMW. No full-tournament draw.
- Requires an explicitly entered *practice* route. No invented official route.
- Native secure random FH5-owned-car selection; no duplicates within the
  selected stage; later first-round batches exclude previously drawn cars.
- Draw locks in a separate, Space-scoped browser localStorage namespace.
  Result entry uses the existing validated multi-time engine, independent
  saved match callback and "0336784" -> "03:36.784" conversion.
- Reopen same event, restart page or return from results: the draw + every
  saved pair is restored. Saved races cannot be silently edited or redrawn.
- Later visit draw is blocked until previous visit times are all banked.
  Advancing cars derive from saved winners, first-stage byes, and, for the
  bronze duel, the actual two *losing* semifinalists. Bronze precedes final.
- Later round with inconsistent entrant counts safely stops rather than
  inventing winners/byes. Existing old local practice remains available.
- Other competition formats remain safety-gated. No medals/records/official
  results, and the candidate schedule is STILL NOT THE LOCKED EVIL LIST.

NO OFFICIAL RACING ENABLED. The practice route and saved values cannot be
promoted to official results. Browser localStorage can be cleared by the
browser; rehearsal records are not part of an OTG backup.

PHONE QA: TET2 -> Evil List -> search BMW -> choose BMW FULL Manufacturer
Race Off (Round of 32, first batch) -> VIEW IN RACE CONTROL. Confirm the
"THIS STAGE · DRAW & RESULT PATH" section shows 8 matches and lets you enter
an explicit practice route. No need to enter any race times yet.
