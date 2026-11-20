OTG! MAIN v8.0.379 — EVERY OWNED CAR IN SWISS CUPS

INSTALL: Overlay ZIP on top of accepted v8.0.378 in C:\RaceHub.
Preserve all other app source/assets, Garage, records, Spaces and local storage.

CANDIDATE EVIL LIST (LIVE GARAGE, READ-ONLY)
- No longer just five Swiss Cups. The Cup count is ceil(owned FH5 cars / 16).
- A 704-owned-car Garage produces 44 Swiss Cups, each with 16 UNIQUE cars.
- Each cup gets eight separate stage visits: Swiss rounds 1-4 (8 matches
  apiece), quarterfinals (4), semifinals (2), bronze duel (1), final (1).
- Total 352 Swiss candidate visits at 704 owned cars (was 40); added 312
  Swiss visits; the actual full timetable total must come from the audit.
- No previously planned source Race Off, relay, unified Gauntlet, Drag + Jump,
  Festival or specialist event is removed to make room.
- No car is used twice across frozen Swiss Cups; first draw picks only the
  currently selected cup, never all future cup entrants at once.
- With a Garage size not divisible by 16, the last partial Cup remains
  PENDING FIELD (no fake opponents), subject to later eligible cars and
  safe rescheduling; never silent overwrite of frozen data.

SWISS CUP RACE CONTROL — PRELAUNCH REHEARSAL ONLY
- Evil List -> search 'Swiss Cup' -> Swiss Cup 01 / Swiss round 1 ->
  VIEW IN RACE CONTROL -> SWISS CUP 01 · CURRENT VISIT.
- Preview current 16-car draw; type actual track; lock ONLY this visit.
- Bank each competitor's time separately, with original OTG time parser.
- Native OTG custom Swiss pairing/ranking policy mirrored: wins, opponent
  wins, total time; pair similar records and avoid rematches when possible.
- Four saved Swiss rounds -> ranked top eight knockout (QF, semi).
- Verified semifinal losers meet in BRONZE before the final appears.
- Save/resume per Space and per Cup. Previous rounds must be completed.
- Unresolved equal race times and Top Eight cutoff ties safe-stop.
- Isolated new key tet2.prelaunch.swiss-rehearsal.v8379.<SpaceID>.
- No rhSave() calls, no OTG racing changes, official slots, medals or records.
- Garage/timetable changes after a rehearsal draw SAFE-STOP old rehearsals,
  rather than reassigning saved cars or silently changing a Cup.

PHONE CHECK (one only): TET2 -> Evil List -> search 'Swiss Cup', observe
44 Cups available in the schedule; enter Cup 01 Swiss Round 1 and confirm
SWISS CUP 01 · CURRENT VISIT, 16 cars and PREVIEW THIS CUP'S 16-CAR DRAW.
No drawing or racing required for the phone check.

NOTE: The full Evil List is still candidate/read-only. Exact historical
rules, final qualification, late-entry and official TET2 slot ledger gates
remain pending. This overlay does NOT launch Slot 001.
