OTG! MAIN v8.0.188 — RELAY GARAGE DISPLAY HOTFIX (PHONE QA)

PATCH OVER v8.0.187. Extract into the existing C:\RaceHub directory and overwrite matching files. DO NOT delete existing folder.

ROOT CAUSE (from source inspection): The v8.0.186 index accidentally pointed the Relay Garage stylesheet to style-evil2-relay-planner-v8186.css, but this stylesheet was never shipped. This left the planner without the fixed overlay styling needed to be seen when launched from the new v8.0.187 retirement landing. v8.0.188 includes the stylesheet under its own versioned filename and corrects the HTML reference.

WHAT CHANGES:
- Restore planner overlay CSS (original v8.0.185 accepted design), packaged as style-evil2-relay-planner-v8188.css, and add to service worker precache.
- Version v8.0.188, index/update bootstrap pinned. Retired Evil 1.0 navigation retained.
- The Relay Garage button now visibly acknowledges taps, catches module errors, and reports problems without touching user data.
- Existing Relay Garage engine, rules, time-entry cockpit and legacy racing engines remain unchanged.
- No state writes, resets, slot or Garage edits, career honour changes or private media modifications.

PHONE CHECK:
1. Version 8.0.188, no repeated update prompt.
2. Dashboard > Evil 2.0 > Relay Garage: FULL-SCREEN dark cyan planner opens with Back button.
3. Manufacturer and Mixed tabs render current Garage and teams; Back returns to Evil 2.0 page.
4. Racing Cockpit still opens and Back works.
5. Garage owned count 704 unless new acquisitions; other Spaces/private content intact.
6. Note if first-opening page-unresponsive warning persists.

If Relay still fails, report exactly what appears (blank page, no change, alert message, etc.). Do not clear browser storage.
