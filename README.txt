OTG! MAIN v8.0.61 — RESULT SUMMARY + RECORD CELEBRATION RELIABILITY

RESULT SUMMARY AVERAGE
- Fixes the regression where the active race-end path was still averaging every previous result in the Championship/Event.
- The comparison now uses only prior results from the same Championship/Event and the same round/course.
- Example: on the second car at Gran Pantano Sprint, only the first Gran Pantano result contributes to the average; the other two courses do not.
- Copy now reads ROUND / COURSE AVERAGE and reports the number of prior results on that round.

RECORD CELEBRATION
- Fixes the intermittent top-right gold-record image/text artifact seen when only the local Championship/Event/Race Off record was earned.
- The approved record hero artwork is unchanged. The shared CSS mask now fully covers the baked-in All-Time rosette/text when it should be hidden.
- Because all record flows use the same mask class, the fix applies across Festival, Custom Racing and Race Off.
- Record calculations are unchanged.

UNCHANGED
- FH5 Standard / Groups / Swiss / Race Off setup and programme preview logic.
- Existing race results, records, Garage/catalogue, Spaces, backups and settings.
- Main only. rh-guide remains v8.0.17 and is not rebuilt during Main development.

DEPLOYMENT
VS Code:
  code .

PowerShell:
  Set-Location "<PATH-TO-EXTRACTED-OTG-v8.0.61>"
  code .

GitHub:
  git add .
  git commit -m "OTG! v8.0.61 result average and record celebration fixes"
  git push origin main
