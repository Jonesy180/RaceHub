OTG! MAIN v8.0.186 — EVIL SCREEN PERFORMANCE QA

INCREMENTAL PATCH over accepted MAIN v8.0.185. Copy these files to existing C:\RaceHub; overwrite matches. DO NOT DELETE FOLDER.

CHANGES (intentionally narrow):
1. Existing read-only Relay Garage launcher (previous v8185) now attaches after a 180 ms quiet period following legacy Evil DOM changes; no repeated whole-screen querySelector scan on every animation frame. Planner logic and eligibility are unchanged.
2. A passive in-memory timing probe starts when a dashboard control containing "Evil" is tapped, stops when the Evil screen becomes visible, and logs opening duration to developer console. It does not alter navigation, app data or storage. The latest timing, if captured, can be inspected via otgEvilOpenSpeed186() in developer tools. No diagnostic can run during an unresponsive main-thread freeze, so this does not itself identify the exact blocking function.
3. Normal version and update wiring 8.0.186; critical new assets are pre-cached, older versions retained on disk for safe fallback.

IMPORTANT LIMITATION: This is a targeted observer overhead reduction and measurement patch, NOT a proven root-cause fix for the browser warning. The full legacy tournament renderer isn't included in the incremental ZIP, and we have not established the exact slow operation. If warning persists, we need a targeted review of the live campaign renderer before changing it.

SAFETY: No reset, no slot progression, no results, no draws, no Garage writes, no medals, no private-content or database writes. Expected FH5 ownership reported by user: 704 (live number can change).

Before installation export a CURRENT backup (not the obsolete 698-car copy) and protect private media / browser storage independently; NEVER uninstall or clear app storage.

DEPLOY via VS Code, C:\RaceHub:
 git add -A
 git commit -m "OTG MAIN v8.0.186 Evil opening performance QA"
 git push origin main

PHONE QA:
 1. Update once; version reads 8.0.186; no loop.
 2. Close Evil Tournament, go Home, open Evil Tournament: does it still show "page unresponsive"? Note approximate duration. Repeat opening twice.
 3. Check Evil 2.0 Relay Garage button still appears and 704 owned cars (if unchanged); test BACK.
 4. Check old Evil progress, Race Off History, Racing Cockpit numeric entry, private files and 704 owned cars remain intact.
 5. STOP if any data, progress, loading or navigation differs beyond the performance behaviour.

If warning persists, report it: do not interpret this patch as confirmation that 1219-slot rendering is at fault.
