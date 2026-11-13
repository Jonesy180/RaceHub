OTG! MAIN v8.0.220 — SECOND CHANCE ROLLING CUPS (ISOLATED PHONE QA)

STATUS: QA BUILD; no career medals, normal races, old Evil 1.0 results, records,
private files, catalogues, Gauntlets, Relay or Long Jump are changed.
No full competitive reset (reserved for approved Evil Tournament 2.0).

FEATURES:
- Each FINISHED completed standard championship or completed Race Off can
  contribute ONE source ticket, after bronze finishing-place confirmation.
- Winner = car immediately below last bronze; for knockout quarterfinal
  ties, requires all matches in that elimination round on ONE common track,
  selecting the fastest loser (same-track times only).
- Every four distinct eligible tickets unlock a four-car Group immediately.
- Four groups -> two head-to-head semifinals -> Cup final.
- Repeat for any number of cups, not 16 total entrants.
- All four cars within each Group share one locked heat track.
- Both semifinals use the SAME shared knockout-round track.
- All races timed in HH:MM:SS.mmm / digits form, winner from lowest time;
  tied fastest times block progression; saved times can be corrected if no
  later times would become inconsistent.
- Completed legacy sources are QA evidence ONLY (not real Evil 2.0 entrants).
- QA DEMO: inject four distinct owned Garage cars as clearly labelled test
  sources, repeat four times. On each empty all-demo group, optional auto-fill
  allows rapid progression. This does NOT create official results.
- All QA state is separate under a per-FH5-Space localStorage key.
- Preflight source scanner supports STANDARD completed championships and
  completed Race Offs. Group championships, Relay, Swiss and other formats
  are NOT yet connected. Official medal postings NOT yet connected.
- If same car earns multiple source tickets, it cannot appear twice in a
  single Cup; extra ticket waits for a later Cup. No source reused.

INSTALL: Extract/overlay the ZIP into existing C:\RaceHub and OVERWRITE
matching files; do not delete anything and do not clear site/browser data.
Then git add/commit/push (three lines below). All earlier files stay in place.

PHONE QA:
1. Open new v8.0.220; confirm no repeat update offer after relaunch.
2. Festival > SECOND CHANCE CUPS > OPEN SECOND CHANCE TEST.
3. Tap ADD FOUR QA TEST TICKETS ONCE: Group A appears immediately.
4. Lock a single test track for A, save each of four times, confirm fastest
   wins. You may use demo-fill for wholly untouched demo groups.
5. Repeat ADD FOUR QA TICKETS three more times to make B, C, D.
6. Finish all groups; confirm semifinal entrants are A/B and C/D winners.
7. Lock a track and enter TWO semifinal times per match, then TWO final
   times, confirm QA champion is displayed. Back and reopen: retained.
8. Optionally correct a time; ensure rankings change only if downstream
   results remain consistent. Existing Garage data must remain unchanged.

Git terminal:
git add .
git commit -m "OTG v8.0.220 Second Chance Rolling Cups QA"
git push

NEXT: phone QA; then connect finalised source competitions + official medals
and tournament scheduling once source integrations and medal policies are
fully approved. Do not reset history yet.
