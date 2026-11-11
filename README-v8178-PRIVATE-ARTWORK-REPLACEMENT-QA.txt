OTG! MAIN v8.0.178 — PRIVATE ARTWORK REPLACEMENT HOTFIX (QA)

Problem: v8.0.176 shows the six-picture import control only while Series One is NOT armed. Once activated and incidents earned, the archive hides the option. Users could only replace artwork one unlocked episode at a time.

Change: Restore an always-visible “REPLACE PRIVATE ARTWORK (ALL SIX)” picker on the main Incident Archive after activation, including while 2/6 stories are unlocked. Existing v8.0.176 stageArtworkFiles() accepts matching filenames, overwrites local IndexedDB privateArt blobs and *does not* change armed/baseline/unlocked/delivered progress if already armed. No racing results, medals, campaign, track or garage code touched.

Safety: NO private story JSON, NO private family artwork, NO racing save data bundled. Do not place family artwork or secret scripts in the PUBLIC GitHub repo. Keep existing app data, original artwork ZIP and secret JSON elsewhere as personal backups. Do not uninstall/clear site data.

Install: Extract overlay over C:\RaceHub and push normally. Open Evil Tournament > Garage Noticeboard > OPEN PRIVATE INCIDENT ARCHIVE. Tap REPLACE PRIVATE ARTWORK (ALL SIX) and select extracted JONES-MOB-01.png ... JONES-MOB-06.png on the SAME phone. Check 2/6 declassified stays 2/6 and the two opened episode artworks change. No new slot completions needed.

Phone QA outstanding until user confirms.
