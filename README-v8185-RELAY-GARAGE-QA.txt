OTG! MAIN v8.0.185 — EVIL 2.0 RELAY GARAGE (PHONE QA)

This incremental ZIP builds DIRECTLY ON ACCEPTED v8.0.184. It overlays a new read-only planning screen. Extract into existing C:\RaceHub without deleting existing files. Do not reinstall the phone app or clear any browser storage.

FEATURE:
  Evil Tournament > EVIL 2.0 — RELAY GARAGE (QA)
  Manufacturer Relay: three different owned cars from one manufacturer per team.
  Mixed Relay: three owned cars from three different manufacturers per team.
  4/8/12/16-team previews; seeded repeatable draw; stage 1/2/3 named cars.
  Explicit integrity audit counts unique car IDs and validates manufacturer grouping.
  Track selectors remain UNASSIGNED pending verified route profiles.
  NO event can be started here. No medals, time entries, official results or tournament slots are touched.
  No planner data is saved anywhere (preview disappears on close).
  Current Garage count is read LIVE, never baked in. Expected today: 704 owned FH5 cars.

PRE-INSTALL SAFETY:
  Export a NEW portable backup with 704 owned cars and keep an independent copy.
  Prior 698-car backup is stale. Portable JSON does not include all private artwork or isolated cockpit practice data; protect browser storage and private media separately.
  DO NOT uninstall or clear the site's localStorage/IndexedDB. Do not restart the old Evil Tournament.

DEPLOY (VS Code terminal at C:\RaceHub):
  git add -A
  git commit -m "OTG MAIN v8.0.185 Evil2 relay garage planner QA"
  git push origin main

PHONE QA:
  1. Normal update arrives once. Verify 8.0.185, no update loop.
  2. Open FH5 > Evil Tournament > EVIL 2.0 — RELAY GARAGE (QA).
  3. LIVE owned cars should read 704 if that's still your inventory. Don't continue if wrong.
  4. Manufacturer Relay: four teams of 3, every team's manufacturer consistent; stage car names distinct.
  5. Mixed Relay: 4 teams of 3 DIFFERENT makes, no repeated car across the 12 selected cars.
  6. Choose 8/12/16 teams; audit counts should agree or show incomplete (no invented cars).
  7. Seed 185 -> REDRAW; same seed repeated yields same lineup. Change seed -> different preview.
  8. Every stage track says UNASSIGNED; no auto-picked unknown routes.
  9. BACK works; original Evil progress, normal Race Off History, cockpit numeric time, Garage, private archive still open.
  10. Relaunch planner: no actual tournament event was created; Garage count and saved racing results unchanged.

STOP immediately on update loop, wrong Space/car count, lost records or private content.
No test result from user has yet been reported for this build.
