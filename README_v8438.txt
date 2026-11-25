OTG! MAIN v8.0.438 — ADAPTIVE RESULTS, PHASE 2: SWISS ROUND FIXTURES
BASE: v8.0.437. NO RESET. NO RESULTS FORMAT OR MEDAL CHANGES.

- Swiss Cups: display ALL fixtures in the CURRENT VERIFIED ROUND on one mobile results screen, including pairings and status for each match. The currently active match has inline car-first time entry; other fixtures remain visible but read-only until reached. Every car still gets the v8.0.434 setup reminder BEFORE racing.
- Banked results display both times and the match winner. No intermediary medals or competition winner. The existing Swiss field, round progression, bronze duel, locked draws, onBank callback and race-result identities are NOT changed.
- No future Swiss rounds are generated or revealed; official Swiss draws must wait until prior rounds are completed.
- Standard Race Off and Festival / multi-track / Relay / Aeródromo workflows are unchanged. v8.0.437 remains available as rollback reference in the ZIP.
- The shared read-only event plan now additionally retains its declared round label. Other OTG! native areas are NOT yet integrated; this is another incremental TET2 phase.
- All user state, other Spaces, Garage, honours, and Pit Wall results are preserved. Installation is not a tournament reset.

DEPLOY: extract over existing repo without deleting unrelated files, then:
git add -A
git commit -m "OTG MAIN v8.0.438 Swiss Adaptive Round Entry"
git push origin main

PHONE QA WHEN YOU ACTUALLY RACE: On a Swiss Cup round, confirm every fixture is visible, the setup reminder appears for each individual car, times bank into the correct match, and no later-round pairings or interim medals appear. Do not enter fake races simply for QA.
