OTG! MAIN v8.0.252 — SLOT 003 RACE OFF STOP-LINE NAVIGATION HOTFIX

Install on top of existing phone-passed v8.0.251. Copy into C:\RaceHub,
overwrite matching files only. Do NOT clear phone storage.

git add .
git commit -m "OTG v8.0.252 Race Off Stop Return Navigation Fix"
git push

WHY: The v251 Race Off STOP modal appeared, but tapping RETURN TO EVIL 2.0
SLOT left the Race Off screen and its full-screen shield visible over the
source slot. The existing native results, slot signoff and back navigation
worked; the stop return button did not.

FIX: native route back to Festival, explicitly hide Race Off and remove its
STOP overlay before rendering the appropriate R2 slot page. The original
"STOP HERE, YOU FUCKWIT!" warning is restored, with real match count and
no ability to skip the scheduled source stop. No fake results created.

PHONE QA: no need to repeat already banked Slot 003 or redraw any cards.
Check Slot 003 is DONE, Slot 004 remains available and original results and
Garage remain saved. If later a Race Off stop-line appears for Slot 004 or
005, verify the RETURN button opens that slot and MARK DONE works.

SAFETY: NO reset, no Garage/Spaces deletions, no result-save wrappers, no
new racing timers, no changes to stored R2 result/record IDs. Official
current results persist. This does NOT activate all 2,221+ future stages.
