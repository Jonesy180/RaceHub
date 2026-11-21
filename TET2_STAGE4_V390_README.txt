OTG! MAIN v8.0.390 — DETERMINISTIC TRACK ASSIGNMENT ENGINE · READ ONLY

Requires previously accepted 8.0.389 and the rest of the existing C:\RaceHub installation.
Overlay contains changed files only; do not deploy it to an empty directory.

TET2 > RACE CONTROL > FH5 ROUTE ENGINE · CONTROLLED PREVIEW

- Reads the source-backed timetable and the strict v389 route-ID registry.
- Proposes real IDs only when the event declares an explicit, unambiguous race class
  and the route declares a matching, independently verified class.
- Balances usage and penalises repeats over the preceding five slots.
- Ties broken deterministically, not through Math.random: preview is reproducible.
- Existing route IDs are NEVER overwritten; invalid/missing/ambiguous identifiers
  are left unresolved rather than guessed.
- Catalogues without unique durable IDs are rejected.
- All proposals are memory-only and are not written to the candidate timetable.

IMPORTANT: The existing v389 overlay does not include full deployed FH5 catalogue
implementations or an explicit race-class field for every competition. Therefore,
zero or partial preview matches are possible and honest. This is NOT the official
track assignment/freeze, and Slot 001 remains LOCKED. Do not infer approval from
an algorithmic preview. User should check source and counts on the phone.

No Garage/Space/record/honours/result or storage changes. Original OTG! unchanged.

Automated: node test_track_assignment_v8390.js
           node test_track_validation_v8389.js

GIT:
git add -A
git commit -m "OTG Main v8.0.390 deterministic read-only TET2 route preview"
git push origin main
