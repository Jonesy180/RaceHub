OTG! PERSONAL MAIN v8.0.176 — PRIVATE JONES MOB INCIDENT FILES (QA)
======================================================================
INCREMENTAL ONLY. Install on existing MAIN v8.0.175, not LAB/public website.

WHAT IS READY:
- Private on-device Incident File archive under GARAGE NOTICEBOARD.
- Import a separate, private six-episode STORY PACK from your phone.
- Episodes remain SECRET until earned at staggered future DONE slots.
- All six separate private drawings MUST be imported before unlocks start.
  With missing pictures the series remains SEALED, so stories are never
  displayed prematurely as text-only rewards.
- Displays an incident after an existing Cone Break (not over top of it).
- Names shown only once a story is unlocked; no spoilers in public app source.
- Option to import/replace private image for each earned episode.
- Large visible working BACK TO NOTICEBOARD and BACK TO ARCHIVE buttons.
- No changes to existing racing/garage/history/medals/Cone Break/Secret Missions.

IMPORTANT: THE SIX NEW ILLUSTRATIONS ARE NOT YET IN THIS RELEASE.
This is the engine and six finished PRIVATE WRITTEN INCIDENTS only.
The six NEW illustrations still need to be produced; this QA stage cannot
auto-unlock any episode until all six private cartoons have been imported.
Do not mistake this QA stage for the finished illustrated series.

TWO SEPARATE FILES:
1) OTG_MAIN_v8.0.176_PRIVATE_JONES_MOB_INCIDENT_ENGINE_QA.zip — GitHub overlay.
2) JONES_MOB_SERIES_ONE_PRIVATE_STORIES_DO_NOT_PUSH.json — personal story pack.

DO NOT place the PRIVATE JSON (or any family pictures) inside C:\RaceHub or a
public GitHub repository. Save it in personal Downloads and copy to your phone
through your preferred private method. It contains real family names/stories.

INSTALL:
1. Export an OTG portable racing backup before changing anything.
2. Extract ENGINE ZIP over the existing MAIN repo WITHOUT deleting files.
3. VS Code terminal in repo:
   git add -A
   git commit -m "OTG MAIN v8.0.176 private Jones Mob incident engine"
   git push origin main
4. Update the installed phone app. DO NOT uninstall or clear browser storage.
5. Evil Tournament > Garage Noticeboard > JONES MOB INCIDENT FILES.
6. Import PRIVATE JSON from local phone Downloads (not from public GitHub).
7. BEFORE unlocks can begin, import six PRIVATE artworks into the archive
   named JONES-MOB-01.png ... JONES-MOB-06.png (PNG/JPG/WebP).
   This release does not yet include those artwork files. Until all 6 are
   present the series remains sealed, and existing races carry on normally.
8. New discoveries will appear only after subsequent verified Mark As Done slots,
   at irregular milestones (2,6,9,14,17,21 new DONE slots after import).

PHONE QA: check existing portrait still installed; existing v175 Back buttons;
Noticeboard > archive > import > six locked entries > check SEALED status >
return/back; race results
remain unchanged; no false awards for already completed slots.
DO NOT manually mark slots as done just to test.

SAVE/PRIVACY: Private pack/illustrations/unlocks live in a separate IndexedDB.
They are NOT in the OTG portable backup. Keep the original JSON/art safe. Loss
of browser data will destroy locally imported copies. The app's public script
has no private names, family artwork, or finished story content.

No real-phone PASS is claimed for v8.0.176.
