OTG! PERSONAL MAIN v8.0.171 — EVIL FESTIVAL VISUAL MAKEOVER (QA)
==================================================================
ONE INCREMENTAL ZIP OVER personal MAIN v8.0.169 OR v8.0.170.
NOT LAB AND NOT THE PUBLIC WEBSITE.

WHAT YOU GET
- Active Evil FH5 Festival 'Championship in Progress' styled to match the
  cleaner Race Off look: narrow championship progress strip; clear UP NEXT
  current car with existing E✓ last-Evil-event colour and Car History shortcut;
  tighter round information; more compact CONTINUE / RANDOM / SHUFFLE controls.
- A full, scrollable RUNNING ORDER in saved order, with each history button.
- When row 1 and CURRENT CAR really match, row 1 becomes a small reference
  'CURRENT CAR · SHOWN ABOVE ↑' rather than repeating the same full card.
  If they differ, no row is collapsed. Original DOM and queue data remain.
- v8.0.169 docked EVIL R1 SLOT back-navigation retained, not floating.
- Includes both v8.0.170 Swiss JS and CSS to install this ONE ZIP directly
  on accepted v8.0.169 without a separate v8.0.170 install. If already on
  v8.0.170, it works as a small overlay too.

DOES NOT CHANGE
- No writes to persistent saved state, no migrations, no Garage changes.
- No results, draws, time entry, event configuration, upgrades, shuffle order,
  championship progression, cars, records, scores or medals changed.
- Ordinary non-Evil Festival screens, Swiss or Race Off display untouched
  beyond v8.0.170 Swiss changes already included in this release.
- Hall of Shame, Cone Breaks, Secret Side Missions, Pit Wall, Career Museum,
  rivalry files, and v8.0.165 track shuffle preserved.

SAFE INSTALL — PERSONAL MAIN ONLY
1. Export and KEEP a fresh Portable Backup. Keep your accepted v8.0.169
   rollback ZIP / Git commit and existing GitHub commit history.
2. In VS Code check 'Get-Location' is C:\RaceHub and check git remote points
   to your PERSONAL MAIN (never LAB or the public OTG! website).
3. Unzip this ZIP over C:\RaceHub, keeping all existing folders/files.
   Do NOT delete the repo or reinstall/reset the phone app.
4. Confirm 'update-manifest.json' and index.html meta say v8.0.171,
   review 'git status --short' (version.json may be on older app version).
5. The usual 3 VS Code commands, one at a time:
   git add -A
   git commit -m "OTG MAIN v8.0.171 Evil Festival visual makeover QA"
   git push origin main
6. Update through existing in-app updater.

PHONE QA — NO NEW RACE OR SWISS ROUND NEEDED
A. Confirm app reports v8.0.171.
B. Open an already-active Evil Festival (e.g. Mitsubishi off-road at Slot 39).
C. See compact progress + UP NEXT current-car panel, colour-coded E✓,
   car-history icon, all remaining cars under RUNNING ORDER.
D. Check first row says CURRENT CAR SHOWN ABOVE only if same as current;
   check your queue is correct and scrolls.
E. Random Pick / Shuffle Queue / Continue / Location / back buttons should
   still be present. DO NOT record a test race just for QA.
F. Send one screenshot for final PHONE PASS.

BROWSER QA: Mock of your actual six-Mitsubishi display, at 375 and 414px:
all six queue rows, full history buttons, cyan/orange badge preservation,
compact matching first row, native actions, docked Evil return, and ordinary
Festival exclusion passed. Actual live phone QA still required.

Chief Tech Penguin has already banned Dave from redesigning the stopwatch.
