OTG MAIN v8.0.421 — CLEAN RESET OF THE 12 FAKE TET2 TEST SLOTS ONLY

THIS UPDATE DOES NOT DELETE ANYTHING WHEN INSTALLED.

1. Install overlay in C:\RaceHub; retain all other existing files.
2. Deploy to GitHub Pages and open TET2 -> Command Centre on the phone.
3. In CLEAN START panel, first tap DOWNLOAD FULL OTG BACKUP. Confirm the JSON file is in phone Downloads.
4. Tap CLEAR 12 TET2 TEST SLOTS, confirm and type RESET TET2.
5. Check Evil List shows SLOT 0001 CURRENT (green), other cards UPCOMING (cyan), Pit Wall empty, Medal Tables empty. All OTG and Garage data unchanged.
6. DO NOT begin real racing yet. Controlled Evil List order shuffle is the NEXT separate update.

SECURITY BOUNDARY: only THREE keys on the CURRENT VALIDATED FH5 Catalogue Space are deleted:
 - tet2RaceControlV8397 (test draws/competition state)
 - tet2OfficialSlotLedgerV8361 (12 fake slots/results/course records)
 - tet2Stage3HonoursV8358 (TET2-only verified competition honours)

All native OTG! Garage, results, settings, bookmarks, route catalogue, approved 2,070 visit source definitions, local course lock and world selection are NOT touched. Screen cannot offer reset unless exactly 12 completed fake slots, no additional starts, and the current browser state matches persisted data. Full-app backup download action required before activation. Mutation is one rhSave call; exact persisted state outside the three keys is compared and reset rolled back on error.

INSTALL:
 git add -A
 git commit -m "OTG v8.0.421 TET2 test-only reset"
 git push origin main
