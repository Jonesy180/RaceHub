OTG! MAIN v8.0.435 — HISTORICAL FOUR-TRACK CHAMPIONSHIP FIX

Base: v8.0.434 STOCK CHAMPIONSHIPS PRE RACE SETUPS

Fix 1: The source-authored Hennessey Normal Championship at Slot 4 is 3 cars × 4 timed routes. Previously the historical bridge rejected any group stage with 4 routes. v8435 supports 1–4 tracks; 35 historical source stages have 4 tracks. The original route allocation already provides 4 distinct genuine FH5 routes.

Fix 2: The results-entry module and official slot ledger now accept 4-track GROUP definitions/results. Relay still requires exactly 3 distinct legs, and Gauntlet remains 3.

Fix 3: The official slot ledger no longer requires ALL cars to finish Track 1 before Car 1 starts Track 2. Banking follows the intended car-first progression: a given car must complete its own earlier tracks, and results-entry UI requires finishing that car before switching to the next. Saved result keys, lock hashes, source schedule and podium calculations are unchanged.

PRESERVED: 2,161-slot schedule, source data, track shuffle, prior results, locked draws, Garage, TET2 stock classifications, E✓, pre-race setup briefings, competition names, medals, and native OTG racing. No resets or migrations.

Install over existing GitHub deployment, replacing same filenames. v8.0.435 is a fresh versioned entry, worker, and cache; older versioned assets remain for safe rollback.

QA: syntax and required-file checks, simulated Hennessey four-track plan and 12 sequential car-first banked results; Samsung testing still needed.
