OTG! MAIN v8.0.378 — MIXED / MANUFACTURER RELAY CHAMPIONSHIPS
Prelaunch, schedule-linked, isolated rehearsal. No official racing enabled.

INSTALL
Apply this overlay ZIP over accepted OTG! MAIN v8.0.377 in C:\RaceHub.
Preserve all existing files, Spaces, Garage data, records and app storage.
This small overlay is NOT a replacement for the complete project.

WHAT WAS CONNECTED
TET2 -> Evil List -> search "Mixed Relay Championship" OR
"Manufacturer Relay Championship" -> first qualifying group ->
VIEW IN RACE CONTROL -> RELAY · CURRENT GROUP.

- Native original v8.0.181 rules engine selects current group entrants only.
- Each scheduled group has 2-4 teams, exactly 3 FH5 cars per team.
- MIXED: 3 DIFFERENT makes per team, no repeated cars in the first-round
  group draws. Advancing teams keep their ORIGINAL three cars in later rounds.
- MANUFACTURER: one 3-car team per eligible make with >=3 owned cars.
- Names: Mixed 1, Mixed 2... and BMW 1, Ford 1... (no invented names).
- Preview current group -> review three named practice routes -> LOCK this
  group (no draw of distant slots) -> enter each team's leg 1 time;
  only when ALL leg-1 times are saved, proceed to all leg-2 times, then leg 3.
- Original TET2ResultsEntry360.timeMs parser and native scoreThreeStages
  engine used for 3-leg team totals and determining each group's winner.
- Group winner progresses to future groups/rounds when those visits occur;
  saving and resuming is Space-scoped and tied to the candidate timetable.
- Ties for first stop advancement; we do not invent a tiebreak winner.
- Each current group is independently saved in NEW isolated rehearsal
  localStorage under tet2.prelaunch.relay-rehearsal.v8378.<SpaceID>.
- Official TET2 slot activation, records, medals and Garage writes remain OFF.
- Earlier manufacturer Race Off, Gauntlet and Aerodromo rehearsal saves
  remain in their own namespaces without clearing or promoting them.
- Garage/schedule changes after a draw cause a SAFE STOP, not silent remap.

PHONE CHECK — ONE VIEW ONLY
TET2 -> Evil List -> search "Mixed Relay Championship" -> select the
FIRST qualifying group -> VIEW IN RACE CONTROL.
Expect "MIXED RELAY · CURRENT GROUP" with a 2-4 team group and
"PREVIEW THIS GROUP'S RELAY TEAMS" button.
No need to draw, lock or enter results yet.

LOCAL QA PERFORMED
- Both formats: preview, frozen draw, 3-leg results, unique car eligibility,
  four group-stage visits, advancing teams, reload recovery and safe stops.
- 390px portrait UI: preview, 3 practice route fields, locked group, 4 saved
  leg-1 times. No browser script errors or horizontal overflow observed.
- Pure native v8.0.181 rule engine used; no live OTG! save calls.

NOTE
The combined Evil List is still a read-only schedule candidate. This update
connects its relay stages to working rehearsal results, NOT to official
completion, medals or career record writing. Next engines need independent
verification before Slot 001 goes live.
