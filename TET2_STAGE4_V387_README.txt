OTG! MAIN v8.0.387 — HONOURS VALIDATION & MEDAL TABLE CONNECTION
NOVEMBER 20, 2026 — PRELAUNCH / OFFICIAL RACING STILL LOCKED

DEPENDENCY: apply this OVERLAY to the existing OTG! Main v8.0.386
in C:\RaceHub. Do not delete files from the repository. No Garage reset.

NEW: TET2 > MEDAL TABLES
- Reads completed and verified competition receipts ONLY via the existing
  isolated v8358 honours bridge; separate manufacturer and car rankings.
- Displays zero medals until real, validated official TET2 competitions finish.
  Rehearsal saves, historic candidates, unfinished groups, and OTG! racing
  are deliberately never imported.
- Clear prelaunch safety notices; the Evil List stays clean.

NEW: HONOURS + RECORD RULE VALIDATORS (NO STORAGE WRITES)
- Final standings: exactly one gold/silver/bronze at 3+ entrants; for 2
  entrants, gold/silver only. No medals for qualifying/provisional groups.
- Knockout semifinal winners enter final, losing semifinalists compete in a
  mandatory bronze duel BEFORE final; ties/unverified outcomes are rejected.
- Gauntlet / Long Jump category projections: overall, performance class,
  car type, manufacturer with 2+ entries, and combined Lonely Hearts for
  single-car manufacturers. No auto-gold for a one-car category.
- Pure, independent record comparisons: route/discipline-wide track record,
  competition record, and car personal best, with time lower / distance
  higher. Only canonical ms and mm units; ties don't break existing records.
- Outputs are READ-ONLY proposed outcomes; no medals or records are published
  from this preview and no old OTG! lifetime records are touched.

IMPORTANT — STILL TO DO BEFORE LAUNCH
- Lock official Controlled Chaos slot schedule, entrant draws and racecourse IDs.
- Connect stage-by-stage verified time results and completion receipts to the
  genuine official result publisher and record ledger.
- Complete category-specific medal receipt persistence and Pit Wall history.
- Verify all competition and honours dependencies before unlocking Slot 001.
- The v8358 receipt validator remains the source of truth for existing final
  medals; this release does NOT bypass its strict final-only guard.

LOCAL TESTS:
- 13 deterministic Node assertions: 2/4-car awards, standings, bronze order,
  unfinished/tied results refusal, categories, time/distance record projection,
  idempotent original receipt semantics, and empty verified medal table.
- JavaScript syntax checks for all altered modules and service worker.
- Standalone Chromium screenshot test did not complete in this container.
  Actual on-phone presentation still requires one check.

PHONE CHECK (ONE VIEW): TET2 > MEDAL TABLES.
Expected: VERIFIED TOURNAMENT HONOURS, 0 finished competitions,
manufacturer and car tables, and Racing records with prelaunch guard.

GIT:
git add -A
git commit -m "OTG Main v8.0.387 validate TET2 honours and records"
git push origin main

No trophies have been renamed. The Yoghurt Cup remains only a possible
future Hall of Shame reward, with Dave and Steve strictly supervised.
