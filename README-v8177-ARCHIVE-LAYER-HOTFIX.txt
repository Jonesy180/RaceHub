OTG! PERSONAL MAIN v8.0.177 — INCIDENT ARCHIVE DISPLAY HOTFIX
===================================================================
INCREMENTAL PATCH: install over existing MAIN v8.0.176 (NOT LAB).

WHAT WAS BROKEN
  OPEN PRIVATE INCIDENT ARCHIVE button DID work, but incident overlay opened
  behind the Garage Noticeboard due to a lower CSS z-index. v176 incident overlay
  was z=999999 while the existing Noticeboard was z=2147483500.

WHAT CHANGES
  A tiny, new late-loading CSS stylesheet raises ONLY the incident window to
  z=2147483640 (above noticeboard and existing private gallery).
  No changes to JavaScript incident unlock rules, private data storage,
  portrait, game saves, tournament results, medals, Hall of Shame or Cone Breaks.

INSTALL
  1) Keep your latest portable backup safe.
  2) Extract this ZIP OVER the existing C:\RaceHub repository, do not delete files.
  3) In the VS Code terminal:
       git add -A
       git commit -m "OTG MAIN v8.0.177 fix private incident archive visibility"
       git push origin main
  4) Use the normal phone update flow; DO NOT reinstall or clear app/site data.
  5) Evil Tournament > Garage Noticeboard > OPEN PRIVATE INCIDENT ARCHIVE.
     Now the private archive should be on top and display import instructions.
  6) Use BACK TO NOTICEBOARD, then BACK TO EVIL TOURNAMENT.

NOTE
  The private story JSON is NOT part of this update and MUST remain outside
  GitHub / C:\RaceHub. The six new family illustrations do not exist yet;
  the series must remain sealed until all six private pictures are imported.

QA: real stacking order and click usability tested in a mobile browser fixture
with both the original Noticeboard CSS and archive CSS loaded. PHONE PASS
still required before accepting the hotfix.
