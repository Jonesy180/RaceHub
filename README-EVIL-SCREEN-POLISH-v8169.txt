OTG! PERSONAL MAIN v8.0.169 — EVIL SCREEN REFINEMENTS (QA)
========================================================

WHAT CHANGED — visual only
1. On the active Evil Race Off screen, the next match is already shown with
   two car names, colour E✓ badges and working Car History controls in UP NEXT.
   In MATCHES the same native NEXT match is now a short reference row:
   "PAIR SHOWN IN UP NEXT ↑". It remains in the saved draw and in the DOM;
   no racer, round, stage, time or match is removed or changed.
2. The existing native "↩ EVIL R1 • SLOT ####" return button moves out of
   its fixed bottom-right position and into a small in-page navigation bar
   immediately below the hero on Evil Festival and Race Off screens.
   The ORIGINAL BUTTON (with its existing native click handler) is moved;
   no second button, custom navigation or state mutation is introduced.

WHAT DIDN'T CHANGE
- v8.0.165 track-shuffle hotfix, v8.0.167 Festival full queue and E✓ colour,
  v8.0.168 Race Off UP NEXT/cards, all car history, Swiss War Room and Swiss
  progress, Cone Breaks, Hall of Shame and 1,219-slot Evil Tournament logic.
- Saved Spaces, Garage, entrants, draws, track plans, results, medals,
  competition standings, active progress, upgrades and localStorage.
- The ZIP does not contain a full replacement app or any saved user data.

INSTALL — C:\RaceHub PERSONAL MAIN ONLY (NEVER LAB / PUBLIC WEBSITE)
1. Export/keep a fresh Portable Backup. Do not restore or reset it.
2. Ensure v8.0.168 is already running on phone. Keep that version available.
3. In VS Code verify the workspace is C:\RaceHub and the GitHub origin
   belongs to personal MAIN, NOT otg-lab or the public website.
4. Extract ZIP OVER existing C:\RaceHub (preserve all existing files/folders).
5. Check version and git status, then run ONE command at a time:
   git add -A
   git commit -m "OTG MAIN v8.0.169 Evil screen refinements QA"
   git push origin main
6. Use your normal in-app updater; don't clear site data or reinstall app.

PHONE QA — NO RACING REQUIRED
A. Check Settings shows v8.0.169.
B. Open an Evil Race Off with saved draw: UP NEXT still names two cars;
   the NEXT match row below is a single compact line, with remaining matches
   and all controls visible. The back-to-slot button no longer overlaps rows.
C. Open a live Evil Festival: the back-to-slot button is in a small bar
   above the racing content, not floating on top of queue/cards. E✓ colours,
   history and full NEXT UP queue are unchanged.
D. Tap the back-to-slot button on either screen to ensure it still returns
   to the correct Evil slot. Do not alter or record results for testing.

STATUS: Desktop/browser-fixture QA passed 375px/414px for both screens.
PHONE QA PENDING. Swiss redesign comes AFTER this pass.
