OTG! MAIN v8.0.351 — Stage 3 Festival navigation correction
BASE: Main v8.0.350 (phone-installed) — SMALL OVERLAY, NOT WHOLE APP.

- Aeródromo Long Jump now uses the exact four-element summary structure of the existing Festival categories, including a cyan icon. This fixes the squashed label, misaligned count and missing icon.
- Second Chance Cup is removed from the Festival menu. Its existing QA source remains in the repository but is NOT a valid TET2 implementation and must not be used for official results.
- Second Chance TET2 rule remains: manufacturer Race Off and eligible Lonely Hearts knockout bronze-duel winners qualify when source competition has >=4 entrants. No hard 16-car cap. Qualifier count is determined by earned results. The new tournament-only implementation belongs in Stage 5, after the competition/source results integration. No 16-car pilot promoted here.
- Champion of Champions will also be tournament-only.
- Relay, Gauntlet and Long Jump launchers are MOVED, not cloned. No changes to competition logic, Garage, storage, backup or other results.
- The old v8349 menu bridge remains as an unused historical source file; the new index no longer loads it.

Installation: overlay ONLY the files in this ZIP into C:\RaceHub after confirming current Main is v8.0.350. Inspect git status/diff before commit. Standard Git add/commit/push once satisfied. Update phone, then check Festival visual menu: Long Jump aligned, Second Chance absent, Relay/Gauntlet still present.
