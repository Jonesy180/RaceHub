OTG! MAIN v8.0.288 — Festival interface cleanout (PHONE QA PENDING)

BASED ON v8.0.287 + inspected user-provided complete js folder.

What is actually changed:
- Hide six old isolated Festival QA launcher DOM sections via scoped CSS:
  #otg-relay-festival-8201, #otg-relay-festival-8202,
  #otg-gnt-launch-8211, #otg-longjump-launch-8217,
  #otg-sc-launch-8220, #e2-honours-launch-8257.
- Do not unload their scripts: relay route-lock prompt, native competition
  engines, honours API, and deep links remain installed and callable.
- No edits to storage, Spaces, Garage, campaign or race results.
- The existing Festival Championships, normal Festival navigation,
  history, and racing controls remain untouched.
- The separate Evil HQ retains 8 Extras, Lord Ratchet and Ma hero, and
  its paginated 2225-stage prelaunch schedule.

This is an interface cleanup, NOT physical deletion of obsolete JS files.
Those modules must not be physically removed until dependency audit and
Evil 2.0 activation tests are complete.

Phone QA:
1. Festival home: normal Championship controls remain; old QA panels gone.
2. Open normal Festival racing screen and Back; ensure controls work.
3. Evil HQ hero, Command Centre and Next Event still appear; no update loop.
4. Medal Tables remains accessible from Evil HQ.

Install: extract all files over existing C:\RaceHub; never delete existing
files or clear phone storage. Then run:
  git add .
  git commit -m "OTG MAIN v8.0.288 Festival legacy QA interface cleanup"
  git push
