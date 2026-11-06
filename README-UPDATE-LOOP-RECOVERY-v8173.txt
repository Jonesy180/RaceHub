OTG! PERSONAL MAIN v8.0.173 — UPDATE LOOP RECOVERY / PHONE QA
============================================================

WHAT WENT WRONG IN 8.0.172
The v8.0.172 service worker installed but its navigation handler still
served index-v8171.html. The visible app stayed on v8.0.171 and offered
v8.0.172 again and again. This ZIP fixes that incorrect navigation target
using a new worker: otg-service-worker-v8173.js, serving index-v8173.html.

WHAT THIS ZIP CONTAINS
The complete v8.0.172 small-jobs files plus all required version 8.0.173
bootstrap, update handler, cached index and manifest. Its main features:
  • Garage Noticeboard: E✓ legend, Evil-only track rotation, campaign pulse,
    read-only Swiss round check and link to existing FH5 Track Directory.
  • 12 occasional Department of Terrible Decisions intermissions.
No new racing logic, database migration or resets.

INSTALL IN THE PERSONAL MAIN REPOSITORY (e.g. C:\RaceHub), NOT LAB OR WEBSITE:
1. DO NOT reset the app, clear site data, uninstall the PWA, or restore an old backup.
2. Keep your most recent OTG! Portable Backup safe.
3. In VS Code confirm the current repo / branch is your PERSONAL MAIN.
4. Unzip directly over the repository root, preserving folders and files.
5. Check git diff --stat, and verify update-manifest.json says 8.0.173.
6. Then: git add -A
         git commit -m "OTG MAIN v8.0.173 update loop recovery"
         git push origin main
7. Use the existing phone UPDATE NOW flow ONCE; let it finish.
8. Confirm on your phone that the installed app displays v8.0.173,
   then open Evil Tournament > GARAGE NOTICEBOARD.

If phone is still stuck at v8.0.171, STOP and report exactly what
appears. Do NOT clear phone storage/caches or reinstall OTG!. The fix may
need to be deployed differently depending on the active worker status.

QA: code syntax + ZIP integrity + offline/navigation asset checks passed.
Actual phone testing is still required.
