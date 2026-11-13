OTG! MAIN v8.0.223 — SECOND CHANCE CUP 2 & ULTIMATE QUALIFIERS QA

SMALL, DATA-SAFE OVERLAY ON ACCEPTED v8.0.222. NO RESETS / OFFICIAL HONOURS.

CHANGES
- When the newest Cup has a completed final and no waiting tickets, display a
  guarded + START NEXT CUP — 16 TEST QUALIFIERS button.
- This creates precisely one new Cup with four Groups of four distinctly-owned
  test cars. The prior Cup is preserved, including every timing correction.
- New Cup offers an optional FILL NEW CUP DEMO GROUP TIMES button; alternatively
  enter all times manually. Semifinal and Final timing remains fully manual.
- A completed Cup 2 champion joins the existing read-only Ultimate qualifying
  register; distinct winners appear once each; repeat Cup winners are grouped.
- Reuses same isolated FH5 Space QA save, same formats and same existing keys.
- NO official medal, history, Garage, Space, or private-data writes.
- Ultimate Championship PLAYABLE bracket is NOT in this release. This build
  proves rolling Cups first. Next release will implement its Finals Night bracket.
- Existing update-loop navigation repair remains in place.

INSTALL: Extract into C:\RaceHub, overwrite same names. DO NOT delete old files.

git add .
git commit -m "OTG v8.0.223 Second Chance Independent Cup 2 QA"
git push

PHONE QA
1. Open Festival > Second Chance Cups; confirm Cup 1 winner and times persist.
2. Select + START CUP 2 — 16 TEST QUALIFIERS (beneath qualifier summary).
3. Confirm Cup 2 has Groups A–D, all with four test cars, and Cup 1 still exists.
4. Optional: FILL CUP 2 DEMO GROUP TIMES. Verify four separate winners.
5. Run both Semifinals on ONE shared track, with recorded times.
6. Run Cup 2 Final and record winner. Ultimate qualifier register should show
   TWO unique cars (unless the same car independently won both Cups).
7. Switch OPEN CUP to Cup 1, verify saved times intact; reload; check both Cups.
8. Do not press any reset or delete browser data (none are needed).

NEXT: Ultimate Grand Championship bracket and real source competition adapters.
