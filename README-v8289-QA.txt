OTG! MAIN v8.0.289 — Festival legacy development panel cleanup (PHONE QA PENDING)

Source review: the eight remaining accordion launchers shown on phone all use
class e2slot-launch and mount inside #festival. Previous v288 hid only six
specific older IDs and missed this common class.

Fix: scoped CSS #festival .e2slot-launch { display:none!important }.
No source JS engines are removed or disabled. Evil HQ lives outside #festival
and keeps its hero, 8 Command Centre tiles, event briefing and 64-page schedule.
All prior files retained. No save, result, Garage, Space or Evil reset changes.

Phone check: Festival shows only proper native Festival functions (no Evil 2.0
accordion stack); normal Festival racing opens; Evil HQ still works; update
prompt does not loop. Do not clear storage or remove earlier JS files.

Extract ZIP over C:\RaceHub, overwrite matching names. Run:
 git add .
 git commit -m "OTG MAIN v8.0.289 Festival QA accordion cleanup"
 git push
