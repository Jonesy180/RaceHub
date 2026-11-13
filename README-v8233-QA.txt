OTG! MAIN v8.0.233 — LIVE FH5 GARAGE ENTRY ROSTER QA — READ ONLY

Small overlay onto accepted MAIN v8.0.232 PHONE PASS.
Copy INCLUDED files into the existing C:\RaceHub folder, overwrite matching files. DO NOT DELETE older files.
No racing reset or official tournament draw, settings or competition changes. Works from YOUR live FH5 Garage ONLY.

PHONE:
Festival > EVIL 2.0 — PRELAUNCH SAFETY CHECK > OPEN SAFETY AUDIT.
Scroll to "Live FH5 Garage-based entry audit — QA only".
Press RUN LIVE FH5 GARAGE DRAW CHECK — READ ONLY.
On the historic 12-Nov 698-car Garage fixture the read-only preview finds:
- 74 manufacturer Gauntlet fields (makers with 2+ owned cars)
- 37 Car Type Gauntlet fields (types with 2+ owned cars)
- 55 Manufacturer Relay teams (makers with 3+ owned cars)
- 232 Mixed Relay teams (each car only once per mixed championship, 3 distinct makes per team)
- 698 Long Jump single-attempt car entries
- 1,096 *provisional work-order candidates*, NOT a final event count or launched schedule.
Live Garage numbers may differ if ownership changes. First 12 proposed start jobs are shown.

Regression: The prior RUN UNCAPPED SLOT TEST — READ ONLY remains available.
Check original racing results, Second Chance Cups, Garage, settings and private content remain unchanged after reload.

SAFETY / CAVEATS:
- READ ONLY. No localStorage/IndexedDB writes, event draw lock, racing history or career medal publication.
- Provisional jobs are not actual numbered event slots; the 1,219 legacy ceiling is NOT used.
- Race Off, Group, Swiss, Hot Wheels, Rally, Off-Road and other family draws remain uncommitted.
- One jump attempt per car; attempt-to-slot packing and exact stage schedules remain undefined.
- Second Chance Cups must roll in only AFTER completed medalled competitions, one car once, Relay excluded.
- Full tournament scheduling, production enrolment, official honours, complete all-Space reset/backup verification and FINAL user approval remain REQUIRED. No reset control exists.
- Never assume this audit is permission to launch or clear any results.

VS Code:
git add .
git commit -m "OTG v8.0.233 Real FH5 Garage Entry Audit QA"
git push
