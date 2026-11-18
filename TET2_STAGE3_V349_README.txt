OTG! MAIN v8.0.349 — TET2 STAGE 3 / FESTIVAL ENGINE ENTRIES
INCREMENTAL OVERLAY for v8.0.348. Does not include or replace the Garage.

WHAT THIS UPDATE ACTUALLY DOES
- Moves the four *existing live* Festival launch panels into the approved category list:
  Relay -> Relay Championships; Gauntlet -> Gauntlets;
  Long Jump -> Aerodromo Long Jump (new category);
  Second Chance -> Second Chance Cup (new category).
- Keeps native launch buttons, click handlers, saved state and competition engine code.
- Does NOT rewrite, test, or mark these engines official. Existing QA text remains truthful:
  some formats still save to test-only keys and do not yet award real honours.
- Does NOT reset or alter car ownership, Garage, catalogue, old results or recoveries.
- Does NOT create Champion of Champions, Drift Zone Score, Drag Shootout or a new Evil List.
- Drift Knockout is excluded from the TET2 master competition plan.
- Swiss Cups remain on the existing category; native tournament registration remains to be wired.

REVIEW/INSTALL
Verify Main is v8.0.348 and external Garage backup exists. Overlay these files onto C:\RaceHub.
Review git status/diff, then usual git add -A / git commit / git push origin main.
After phone update: confirm Festival opens and Relay, Gauntlet, Long Jump, Second Chance launchers are located under category tiles. No test results required.

UNVERIFIED: no phone/browser test performed. This is menu wiring, not the full Stage 3 completion.
Do not extract into OTG LAB.
