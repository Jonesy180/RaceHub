OTG! MAIN v8.0.219 — RELAY TILE SIZE / LEFT ALIGNMENT (QA)

SCOPE: very small Festival-only cosmetic correction requested from screenshot:
- Relay Competitions header matches other championship rows at 64 CSS px.
- Hides the empty legacy decorative flex item that indented title text.
- Reduces extra lower margin. Expanded Race Control remains unchanged.

Preserves v8.0.218 service-worker navigation-loop repair and v8.0.217
Aerodromo Long Jump; no changes to racing logic, Garage, Spaces, settings,
competition results, records or private content. NO COMPETITIVE RESET.

INSTALL: overlay this ZIP onto the existing C:\RaceHub folder, overwriting matching
files. Keep all existing files; DO NOT delete the site, clear site data,
uninstall the PWA or reset storage. Then git add/commit/push to GitHub.

PHONE QA:
1) UPDATE NOW to 8.0.219 (once); confirm it opens and shows 8.0.219.
2) Close and reopen from your normal shortcut; check it does not re-offer 8.0.219.
3) Festival: Relay Competitions is same height/left alignment as adjacent
   championship rows, expands and still opens Relay Race Control.
4) Long Jump and Garage Gauntlets remain available.

If it still loops, STOP, report the installed/offered versions. Don't clear
browser data. Service-worker routing source tested; phone not yet tested.
