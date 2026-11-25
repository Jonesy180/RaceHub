OTG! MAIN v8.0.437 — ADAPTIVE RESULTS, PHASE 1
BASE: v8.0.436. NO RESET. NO SAVED-RESULT FORMAT CHANGE.

1. Adds an OTG-wide read-only event-result layout planner (OTGAdaptiveResults437). Layouts derive from actual event entrant/course/fixture arrays, not hard-coded UI size assumptions. Supports one-course car lists, multi-track car-first, match/Swiss-round fixture lists, relay team-first and Drag/Jump. Planner is a foundation for other OTG modes, NOT a claim their existing UIs have been migrated.
2. TET2 one-course GROUP events show all cars on ONE results screen, retaining an active-car setup gate and existing per-car immutable bank keys. Multi-course groups retain the approved car-first all-tracks layout.
3. TET2 Race Off shows every verified current-slot fixture together, with individual current match and pre-car setup reminders. If a Swiss round spans several slots, the engine does NOT disclose the unassigned future fixtures: these will need an explicit verified completed-round read model before whole-round display is possible.
4. No modifications to original OTG! Festival/Custom Racing/Pick My Ride/League Manager handlers; their complete deployed source is not in this ZIP. Those require incremental migrations, once available, without touching records.
5. No medals, records or celebration changes in this release. Those are a separate subsequent update.
6. All existing Garage, honours, slot data, saved results, prior draw keys and tournament progression remain in existing storage with no migration/reset.

DEPLOY: Extract over your existing GitHub repository (do not delete native files). Run:
git add -A
git commit -m "OTG MAIN v8.0.437 Adaptive Results Phase 1"
git push origin main

PHONE CHECK: Slot 4 Hennessey should still use car-first, four-course entry. For an actual one-course group event, confirm several cars are visible together but only the next car is bankable after setup. For a Race Off slot with more than one verified pairing, confirm its full CURRENT slot pairing list appears, with the next pair active. No reset needed.
