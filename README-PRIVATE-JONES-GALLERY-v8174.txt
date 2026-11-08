OTG! PERSONAL MAIN v8.0.174 — PRIVATE JONES MOB GALLERY / BACK BUTTON QA
==========================================================================
Install over already-working PERSONAL MAIN v8.0.173 in C:\RaceHub ONLY.
Do not use in OTG-LAB or on the public website.

WHAT'S NEW
- The Garage Noticeboard finally gets a prominent, working ← BACK button.
- PRIVATE JONES MOB exhibit accessed from Garage Noticeboard.
- Import the generated group portrait ONCE from your phone's Files/Photos chooser.
- The picture lives in local IndexedDB on that phone. It is NOT included in the GitHub ZIP, NOT sent to a server and NOT visible to website visitors.
- Gallery has its own visible ← BACK button to return to the Noticeboard.
- Both BACK buttons were exercised in browser QA; no racing-data writes.

WHY THE IMAGE IS NOT INCLUDED
- GitHub Pages assets are publicly reachable, even when the app is only used personally.
- The Jones Mob picture contains family and children. Keep it private by importing it locally; don't copy the .png to GitHub assets.
- The portrait is separate from racing data and is NOT exported by OTG! Portable Backup. Keep the original image saved privately; clearing app/site data erases the local gallery copy.

INSTALLATION
1) Export an ordinary OTG! Portable Backup and keep it safe.
2) Extract this ZIP over C:\RaceHub; do NOT delete older files.
3) Review changed files; run in the VS Code terminal, one line at a time:
   git add -A
   git commit -m "OTG MAIN v8.0.174 private Jones Mob gallery and Back buttons"
   git push origin main
4) Update existing app on phone to 8.0.174. Do not uninstall, clear app data or restore a backup.
5) Evil Tournament > GARAGE NOTICEBOARD > verify ← BACK returns correctly.
6) Reopen Noticeboard > PRIVATE EXHIBIT > OPEN PRIVATE TEAM PORTRAIT > verify ← BACK returns to Noticeboard.
7) Save the image from the ChatGPT conversation to your phone; tap IMPORT PORTRAIT FROM PHONE and select it. Confirm it appears; close and reopen gallery and verify it remains.

STOP if there is an unexpected update loop or any regression. Do not repeatedly retry/reset.

No race mechanic, career medal, championship, track shuffle, result, Hall of Shame or other gameplay changes.
