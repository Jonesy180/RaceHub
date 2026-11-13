OTG! MAIN v8.0.229 — SECOND CHANCE HONOURS / CAREER RECORDS READ-ONLY BRIDGE QA
Incremental overlay over phone-PASS v8.0.228. SAFE: no resets, no official medals, no history writes.

PURPOSE: Official Evil R1 medal tables are DERIVED dynamically from completed source records;
not a persistent medal counter. Before enabling Evil 2.0 medals we must verify podiums,
manufacturer eligibility, source authenticity and no duplicates without contaminating
any real stats with the existing two DEMO Cup winners.

NEW: Festival > Second Chance Cups > MEDALS & CAREER HONOURS (collapsed):
- Completed Cup podium: 1 gold, 1 silver, both losing semifinalists bronze.
- Ultimate podium: gold, silver and only actual losing semifinalists bronze
  (2-car Ultimate Final correctly has NO bronze).
- Manufacturer eligibility only if the championship field has more than one make.
- Builds provisional per-car and per-make medal tables, deduplicated by event/car/medal.
- Each ticket is source-checked against the currently completed, actual event and recorded
  fourth/fifth place, with once-only rule and source ID validation.
- Any demo/simulated ticket bars a Cup from publication. QA Ultimate is always barred.
- Stores nothing: no second ledger, no writes to original game state, results, medals,
  manufacturer/car tables, history, private content or existing QA timing state.
- Existing two completed DEMO Cups and Ultimate should display as QA ONLY/NOT ELIGIBLE.
- Swiss, Relay exclusion, RaceOff, group and small-source adapters retained.

NOTE: This build does not yet publish honours to real tables. That's intentional and
required to avoid presenting synthetic Cup1/Cup2 as actual results. The next step after
QA is a guarded real-source/official-record activation and complete Evil 2.0 audit.

INSTALL: extract ZIP to C:\RaceHub overwriting matching files, DO NOT DELETE existing files.
VS CODE:
git add .
git commit -m "OTG v8.0.229 Second Chance Honours Audit QA"
git push

PHONE QA:
1. Festival > Second Chance Cups > MEDALS & CAREER HONOURS.
2. Completed Cup 1 and Cup 2 show Gold/Silver/2 Bronze and QA ONLY.
3. Ultimate two-car Final shows Gold and Silver, NO fabricated bronze.
4. Car and Manufacturer previews populated (read-only).
5. Existing official medals and records unchanged, prior QA Cups present after reload.
6. No update loop.
