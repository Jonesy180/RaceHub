OTG! MAIN v8.0.230 — OFFICIAL HONOURS RECORD CONTRACT QA — READ-ONLY
Overlay atop phone-pass v8.0.229. No career writes, no reset.

The prior Evil R1 medal tables are derived from completed event records, not an editable balance. The new panel maps fully validated, REAL-source completed Second Chance Cup podiums into that exact medal record shape; only 4 per Cup (1 Gold, 1 Silver, 2 Bronze). Manufacturer medals remain restricted to multi-make fields. It rejects unverified/demonstration cups and duplicate identity rows and validates every car/make against the owned Garage.

It compares against real existing Evil R1 medals by calling the existing read-only `rhEvilR1MedalQA8111.records()` accessor. It NEVER replaces, appends to, writes, or modifies the live medal tables or car histories. Old Evil history remains intact. NO API in this version can enable official publication; Evil Tournament 2.0 launch requires separate signoff and then career reset.

READ-ONLY EXAMPLE: Fabricates 16 finished source events in memory only, draws 16 distinct owned qualifiers, runs 4 groups/2 semifinals/a final and verifies exactly 4 stageable honours with no writes. This fixture is NOT part of your saved tournaments.

PHONE QA:
1. Festival > Second Chance Cups > OFFICIAL MEDALS & CAREER RECORDS — INTEGRATION CHECK.
2. Verify existing Evil medal row count visible and labelled UNTOUCHED.
3. Existing two demo Cups and Ultimate should show 0 verified rows, 3 blocked events; no simulated medals published.
4. Tap RUN OFFICIAL MEDAL BRIDGE EXAMPLE (READ-ONLY) and confirm PASS (four staged medals), then reload to confirm no saved data changed.
5. Check existing Cup 1, Cup 2, Ultimate and original medals still intact.
6. No update loop.

Install: extract OVER C:\RaceHub; overwrite matching files; do not delete anything.
Git:
git add .
git commit -m "OTG v8.0.230 Official Honours Record Contract QA"
git push
