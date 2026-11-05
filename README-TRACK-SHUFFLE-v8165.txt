OTG! MAIN v8.0.165 — PLAZA CIRCUIT SHUFFLE SAFETY HOTFIX (QA)
===========================================================
DO NOT INSTALL TO OTG LAB OR THE PUBLIC WEBSITE. PERSONAL MAIN ONLY.
This is an INCREMENTAL OVERLAY for existing MAIN v8.0.164.

WHY: The v8.0.70 Race Off planner hard-excluded every track reserved by other active tournaments' FUTURE stages. With many Evil Race Offs, all 53 Road/Street tracks became reserved, so the fallback reused already-consumed Plaza Circuit while 41 unused tracks were in the bag.

FIX: Reservations are advisory. The persistent unconsumed Road/Street bag takes priority. Stage names are still unique within a newly-created Race Off plan. The special protected Final remains unchanged.

EXISTING SAVES: No reset/import/restore. No Space, car, time, result, medal, campaign slot, Hall of Shame, Side Mission or Cone Break data is deleted. Already-drawn/raced stages are NEVER changed. Later planned stages are NEVER changed. ONLY an untouched Evil Race Off first round, with no recorded results, may be repaired if its track has already left the shuffle bag. Previous track logged as repair8165.previousTrack for audit.

INSTALL:
1) Keep your fresh exported Portable Backup (Plaza.json), ideally make an additional local copy. Confirm MAIN currently v8.0.164. C:\RaceHub ONLY.
2) Copy the eight files from this ZIP with folders intact over C:\RaceHub. Do not wipe any other files; keep js/otg-cone-break-v8164.js and all earlier files in place.
3) In VS Code terminal, run each line separately:
   git add -A
   git commit -m "OTG MAIN v8.0.165 Race Off track bag hotfix"
   git push origin main
4) Update personal MAIN on phone through the app and verify version v8.0.165. DO NOT reset app or restore backup.

PHONE QA — one action/screenshot at a time:
A) Check Settings version 8.0.165, all Spaces/results intact.
B) Open pending Evil Slot 37 McLaren Race Off. It must now suggest a track OTHER THAN Plaza Circuit. No results need to be entered for this test.
C) Confirm Slot 36 results, medals and Hall of Shame remain unchanged.
D) Continue races normally; new Race Off first stages must prioritize unused eligible tracks. No existing drawn/raced stage changes.

STATIC QA: The JavaScript has been syntax checked. The download ZIP does NOT modify your live app or device until you install it.

Chief Tech Penguin: "Dave, stop reserving tracks for races scheduled in 2029."
