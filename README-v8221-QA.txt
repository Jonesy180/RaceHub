OTG! MAIN v8.0.221 — SECOND CHANCE COMPACT PHONE QA

SCOPE: ONLY Second Chance QA interface. All Cup calculations, rules, source
qualification, timings, state schema and existing saved test results preserved.
- Saved entries now show clear green saved time instead of a blank correction
  form misleadingly stating 00:00.000 (not saved).
- To change a saved time, tap CORRECT to reveal pre-filled time, SAVE CORRECTION
  or CANCEL. Corrections still use existing downstream-result protections.
- Unfinished semifinal and final placeholders are compact lines instead of
  large empty cards. They unlock normally at the same point as before.
- Time-entry row smaller on phones. No other cosmetic changes.
- v8.0.218 navigation-loop repair retained.
- NO reset, NO medals, stats, Garage, Spaces, catalogues, normal racing, private
  content or existing results touched. Same isolated QA localStorage save key.

INSTALL: Extract this small ZIP into C:\RaceHub, overwriting matching files.
Do not delete old files, clear browser storage or reset anything.

git add .
git commit -m "OTG v8.0.221 Second Chance Saved Time Display Fix"
git push

PHONE QA: Open Second Chance QA using the existing Group A save.
1. Three (or four) saved cars display their saved times accurately.
2. No saved car displays '00:00.000 (not saved)'.
3. Tap CORRECT; old time is prefilled. CANCEL doesn't change anything.
4. Semifinals/final remain compact until their entrants qualify.
5. Check v8.0.221 install does not re-enter the update loop.

This is still a QA engine, not live Evil Tournament 2.0 medals integration.
