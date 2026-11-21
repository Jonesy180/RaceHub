OTG! MAIN v8.0.415 — FULL-SIZE TET2 DASHBOARD TILE

CUMULATIVE OVERLAY on your existing OTG! v8.0.414 deployment.

Changes:
- Replaces the small fixed red TET2 popup with a full-size TET2 Smart Tile at the end of the OTG! home dashboard grid, alongside Settings.
- The world-switch entry is now visible only on the OTG! Dashboard, not hovering over Garage, Race Off, Records, or other screens.
- The TET2 Command Centre's existing artwork-native SWITCH TO OTG! action remains. The other TET2 pages continue navigating back to Command Centre.
- Existing OTG! nine tiles, their click actions, and all racing/garage state remain unchanged.
- No changes to the TET2 Evil List, tracks, results, records, medals, or Pit Wall.

Install: unzip into C:\RaceHub replacing same-named files, WITHOUT deleting legacy files or assets.
Run:
  git add -A
  git commit -m "OTG v8.0.415 make TET2 a dashboard smart tile"
  git push origin main

Phone check:
1. OTG! Dashboard — a full-sized red TET2 tile should be beside Settings.
2. Garage / Records — no floating TET2 button.
3. Tap TET2 tile — Command Centre opens. Tap its artwork SWITCH TO OTG! — OTG! Dashboard returns.
4. Confirm Slot 004 Swiss Cup and all three completed slots still display as before.
