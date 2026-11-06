OTG! MAIN v8.0.166 — EVIL TOURNAMENT E✓ ALREADY-RACED BADGE (QA)
================================================================
PERSONAL MAIN ONLY. DO NOT INSTALL IN OTG LAB OR THE PUBLIC WEBSITE.
INCREMENTAL OVERLAY ONLY, for your already phone-tested MAIN v8.0.165.

WHAT IT DOES:
• A small cyan E✓ appears beside a car's name ONLY if a saved Evil Tournament
  result (timed Festival, Race Off, or recorded drift score) exists for that car.
• Shows on Evil R1 exact eligible-car list and classification index, and when
  that car is shown on active Evil Festival / Race Off result-entry screens,
  groups lineups and Race Off draw/match lists.
• Empty/undriven draws do NOT earn the badge. E✓ does NOT assert upgraded.
• Ambiguous duplicate-name cars remain unmarked rather than falsely marked.
• No new stored fields, writes, result modifications or migrations.

SAFETY:
Keep an up-to-date Portable Backup before installing. Do not restore or reset.
Version 8.0.165 track shuffle remains installed and is still loaded with its
v=8165 URL. Existing Hall of Shame, Cone Breaks, Pit Wall, medals and Spaces remain.

INSTALL:
1. Open your personal MAIN repository (usually C:\RaceHub) in VS Code.
   Confirm it is NOT the otg-lab repository or public website.
2. Extract/copy this ZIP's eight files into the repository ROOT, preserving
   the js/ subfolder. Replace index.html and update-manifest.json as requested.
   Do NOT delete existing files or folders.
3. Review git status, then use the usual three PowerShell terminal lines:
      git add -A
      git commit -m "OTG MAIN v8.0.166 Evil car used badge QA"
      git push origin main
4. On your phone, use the existing in-app update, then check Settings v8.0.166.
   DO NOT clear browser data, reset an event, or import/restore any Space.

PHONE QA:
A. Open Evil Slot 37 or another active slot; expand EXACT ELIGIBLE FIELD.
B. Find a car you definitely raced in an earlier Evil slot: cyan E✓ should
   appear beside its name (e.g. Ford GT 2005 in your Nov 5 backup).
C. Find an eligible car not yet raced: no E✓. Enter a new result normally.
D. After the first saved result, E✓ should appear when revisiting the car.
E. Confirm the Race Off result entry screen also shows the badge for cars
   previously raced, and track Las Afueras still stays on Slot 37.
Report back; this remains QA until your phone test.

Chief Tech Penguin: 'An E✓ means raced, Dave — not upgraded.'
