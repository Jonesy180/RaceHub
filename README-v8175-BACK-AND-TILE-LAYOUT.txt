OTG! PERSONAL MAIN v8.0.175 — BACK BUTTON & HOME TILE POSITION QA
===================================================================
INCREMENTAL UPDATE. Overlay these files on your existing personal MAIN v8.0.174.
Do NOT use for LAB, the public OTG! website, or a clean installation.

WHAT CHANGED
1) Private Jones Mob portrait gallery: new permanent, large BACK TO NOTICEBOARD
   button below the image and import/remove controls, always visible regardless
   of gallery scrolling. Original header Back still works.
2) Garage Noticeboard: new permanent BACK TO EVIL TOURNAMENT button at the
   bottom of the dialog, visible even when the noticeboard content scrolls.
3) Move the WHOLE group of Evil utility tiles (Swiss War Room, Pit Wall,
   Setup Guide, Classification, Medal Tables, Audit, Cone Break, Noticeboard)
   above the Hubbs Memorial Trophy; the intended order is Current Event >
   Utility Tiles > Hubbs Memorial > Hall of Shame > Slot List.
   If the expected Hubbs markup cannot be found, the script deliberately leaves
   the existing order intact rather than risking navigation/data damage.

INSTALL
1) Keep your current portable racing backup and original Jones Mob portrait.
2) Extract ZIP OVER your PERSONAL MAIN repository (typically C:\RaceHub).
   Do not delete existing files; this is NOT a full app download.
3) Open VS Code Terminal in that repository and use separate commands:
   git add -A
   git commit -m "OTG MAIN v8.0.175 navigation and Evil tile layout"
   git push origin main
4) Update the existing phone app normally. Do NOT uninstall, clear site data,
   remove browser storage or restore racing data.

PHONE QA (not yet performed):
 A) Confirm v8.0.175, no update loop.
 B) Evil home: Continue Current Event -> utility tiles -> Hubbs -> Hall of Shame.
 C) Open Garage Noticeboard, scroll to the end, tap BACK TO EVIL TOURNAMENT.
 D) Open Noticeboard again -> Private Exhibit -> portrait. Scroll all the
    way to Import/Remove and tap BACK TO NOTICEBOARD. Confirm the portrait
    remains visible after reopening, without re-importing.
 E) Check current slot, garage ownership, and saved results unchanged.
 STOP if update loops, tiles disappear, or photo/history is missing.

PRIVACY / SAVE GUARANTEES
- No portrait or family photo is bundled. The already-imported picture remains
  in existing on-device IndexedDB; no migration or overwrite is attempted.
- No racing state, Space, championship, medal, garage or localStorage writes.
- v8.0.174 source files remain on disk; new code is additive.

QA LIMIT: JavaScript syntax / HTML references / service worker navigation target,
ZIP integrity, and simulated mobile dialog/layout DOM QA can be checked here.
Actual phone behaviour requires your confirmation; no claim of phone PASS.
