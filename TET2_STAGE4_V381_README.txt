OTG! MAIN v8.0.381 — FESTIVAL TOP 3 / OPEN EVENT PRELAUNCH REHEARSAL

BASELINE: Install on top of v8.0.380 (accepted phone PASS). This is an overlay,
NOT a full app and NOT an official racing activation. DO NOT delete existing files.

NEW
- TET2 -> Evil List -> search 'Festival Top 3' -> select Open Event ->
  VIEW IN RACE CONTROL. Under the existing Race Control information, the
  Festival Top 3 isolated rehearsal panel appears.
- Draw exactly 3 REAL FH5 Garage cars with the existing secure draw engine.
  Draw is a reviewable, not-yet-locked preview (names only; no badges or logos).
- Add a user-supplied PRACTICE track name, then explicitly lock this local draw.
- Use existing group time entry for ONE track, with each car saved individually.
- A provisional podium appears when all three times are recorded; equal times
  stop the podium from being treated as decided.
- Save/resume is isolated per FH5 Space under
  `tet2.prelaunch.festival-top3.v8381.<SpaceID>`; saved cars or times never
  silently change if Garage ownership / proposed schedule changes.
- Does not touch OTG! Garage, rhSave, medals, records, official slot ledger,
  previous rehearsal stores or candidate Evil List numbering.

IMPORTANT SOURCE LIMIT
The historical source registers this as a Festival Top 3 / Open Event. It does
not confirm the live field identity, race course or detailed rules. The 3-car,
1-course workflow is a PRELAUNCH REHEARSAL ADAPTER, not an approved permanent
competition format. No artificial official entrants or route allocation made.

NEXT ACTUAL WORK: historical Race Off and Festival eligibility/round adapters,
then the remaining specialist events, dependent finals, official slot/draw
locks and real honours.

PHONE CHECK — ONE ONLY
TET2 -> Evil List -> search 'Festival Top 3' -> select its event ->
VIEW IN RACE CONTROL. Confirm a card labelled
'🏆 FESTIVAL TOP 3 · OPEN EVENT' with a button
'🎲 PREVIEW THREE-CAR OPEN EVENT'. No draw or times necessary.

LOCAL QA PERFORMED
- Node: draw shape/uniqueness, explicit lock, individual times, save/resume,
  three-ranked provisional podium, invalid/duplicate result rejection,
  Garage and schedule modification safe stops: PASS.
- 390px standalone Chrome layout from generated card: PASS with no overflow.
- JS syntax checks and versioned worker/bootstrap/HTML wiring: PASS.
- Not a phone PASS until user confirms the screen.
