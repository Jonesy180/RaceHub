OTG! PERSONAL MAIN v8.0.172 — SMALL JOBS QA
========================================
BUILT FOR: installed MAIN v8.0.171 in C:\RaceHub ONLY. Do NOT install to LAB or public website.

1. Export a FRESH PORTABLE BACKUP on the phone. Keep that JSON file safe.
2. Overlay these files into C:\RaceHub, preserving ALL existing files/folders. Never delete or reset Spaces.
3. Check index.html has <meta name="racehub-version" content="8.0.172">.
4. git status --short / git diff --stat to review, then:
   git add -A
   git commit -m "OTG MAIN v8.0.172 garage noticeboard and terrible decisions QA"
   git push origin main
5. Use the existing in-app update flow and confirm 8.0.172.
6. Open Evil Tournament; look for GARAGE NOTICEBOARD on campaign home.
   - E✓ legend shows cyan/orange/purple.
   - Campaign Pulse from saved DONE visits (not victory count).
   - Evil Track Rotation counts SAVED TIMED rounds/stages, not every car/lap.
   - Button opens EXISTING FH5 Track Directory, which already shows USED X TIMES
     across all racing in the current FH5 Space (Festival, Race Off, Custom).
   - Swiss Round Check is READ ONLY; Swiss live screen PHONE QA still pending.
7. Department of Terrible Decisions is an occasional alternative AFTER a new,
   verified Mark as Done. No deliberate slot completion is necessary for QA.
   It is OFF when Cone Break intermission popups are OFF. Original Break Room
   archive and 32 cone scenes remain in place; 12 new Department incidents.

SAFETY
- No tracks are redrawn; no existing recorded result, medal, slot, draw,
  upgrade, Car History or saved racing queue is edited.
- Existing `evilConeBreaks8164` preference / archive is retained. For future
  Department episodes, the existing record gains only optional `series` label.
- No changes to existing saved incidents or prior DONE slots.
- Overlay only. Never restore backup during testing unless a real recovery is needed.

QA STATUS: JS syntax and backup data checks PASS; PHONE QA REQUIRED.
