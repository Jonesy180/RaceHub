OTG! MAIN v8.0.385 — HISTORICAL SOURCE RULE COVERAGE / MEMBERSHIP BOUNDS
Requires installed v8.0.383 or later baseline. OVERLAY ONLY — unzip into C:\RaceHub, replace included files, DO NOT remove older files.

WHAT THIS PATCH ACTUALLY DOES:
- Extends the old-source rule decoder to cover the original 'All RACE ecosystem cars' and four Rally Adventure class conditions (Classic Rally, Retro Rally, Modern Rally, Rally Monsters).
- Race Control historical eligibility card now distinguishes definite class matches vs possible ones in ambiguous Track Toys, Extreme Track Toys and Classic Racers classes.
- An original 2026 entrant count matching a candidate count is NOT proof of the original entrants' identity. The screen says so explicitly.
- Original source visits/workloads remain unchanged; candidate timetable is NOT live or certifiably final.
- Preserves historical prelaunch storage namespace and results IDs. No Garage, OTG, medals, records or slot writes and no draw/award activation.
- Does NOT alter the clean Evil List or add a development screen. Source eligibility details remain in historical Race Control only.

A LOCAL 697-car historic QA fixture is used for regression checks but is NOT shipped.
INDEPENDENT QA ON SOURCE SNAPSHOT: 214/214 source event rules parse and yield a distinct candidate field for historical cohorts. 2026 source identity cannot be recovered from aggregate counts, and modern Garage can have more or fewer cars. No claim that all entrants have been verified.

PHONE (1 VIEW): TET2 > Evil List > search 'Classic Rally' > first historical event > VIEW IN RACE CONTROL. HISTORICAL GARAGE ELIGIBILITY should show an actual candidate category, not SOURCE RULE UNRESOLVED. No draw needed.

YOGHURT CUP: Creative idea reserved for possible future secret trophy / Hall of Shame gag ONLY. Does not rename any official competition or create a racing slot.

INSTALL:
git add -A
git commit -m "OTG Main v8.0.385 reconcile historical source rule coverage"
git push origin main
