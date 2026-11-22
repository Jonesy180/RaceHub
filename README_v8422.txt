OTG! MAIN v8.0.422 — TET2 REAL TOURNAMENT FULL CONTROLLED-CHAOS SHUFFLE

SOURCE: directly based on accepted OTG! MAIN v8.0.421 SAFE TEST RESET overlay.

WHAT CHANGED
 • Replaced the 12-slot QA opening rule with a full seeded draw across ALL eligible event visits.
 • Changed only order of competition visits. Approved historical inventory and new competitions are intact.
 • Retained the native progression: each event visits 1,2,3... sequentially; only first next round may enter a slot.
 • Retained knockout semifinals -> bronze duel -> final, independent real Second Chance/Champion dependencies.
 • Source phase-06 protected historical stages remain at the late tail.
 • Incomplete 16-car Swiss cups are still in the Evil List but PENDING at the very end, not a premature stop.
 • Original Evil List red/green/cyan/neon layout is frozen. Only the misleading 10-opening-format label
   was changed to 'Approved format types'.
 • Seed is deterministic for an unchanged Garage, NOT reshuffled on app open or refresh.
 • No automatic reset, deletion, draw, time entry, medal, or update of user data occurs on installing.
 • TET2-only test reset v8.0.421 has already been confirmed by the user, this update does not run it again.

CAVEAT: Schedule source is still based on current Garage and native workload rules. Adding a car
AFTER the official start may change event workloads/signature and trigger the pre-existing locked-
schedule safety gate. This update does not invent a workaround. Do not change Garage membership
mid-tournament until that late-entrant rule is implemented and tested.

INSTALL
1. Extract this ZIP into C:\RaceHub replacing the matching files (other OTG files stay).
2. Deploy to GitHub Pages:
     git add -A
     git commit -m "OTG v8.0.422 full Evil List shuffle"
     git push origin main
3. On phone, open TET2 -> Evil List. Verify Slot 0001 is green CURRENT; no DONE tiles.
4. Open Race Control; verify its current event matches slot 0001.
5. Browse first 10+ cards for the new surprise order. IMPORTANT: no first-ten-format constraint now.
6. Do not click ENTER RACE RESULTS until the new draw is approved.

TECHNICAL
 • Uses v8422 versioned index/bootstrap/updater/service worker.
 • Full course shuffle-bag allocation remains on genuine FH5 catalogue. No track code modified.
 • Local OTG! Garage / normal races / TET2 histories have NO migration or write code in new source.
 • Same competition set + visit counts for the same Garage: only position and route assignments change.
