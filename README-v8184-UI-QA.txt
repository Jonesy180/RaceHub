OTG! MAIN v8.0.184 — EVIL 2.0 PHONE UI FIXES (QA)

INCREMENTAL ZIP: Extract into C:\RaceHub, overwriting same-name files, NEVER delete the folder.
Built on installed v8.0.183. Includes index.html/index-v8184.html, new versioned bootstrap, updater and worker.
This ZIP deliberately does NOT include or overwrite Garage, campaign, race history, private artwork or data.

FIX A — Isolated Evil 2.0 Racing Cockpit time input: numeric keypad, digits only, 6–9 digits.
  0342250 => 03:42.250   (3m 42s 250ms)
  342250  => 03:42.250   (3m 42s 250ms)
  010342250 => 01:03:42.250 (1h 3m 42s 250ms)
  The green preview shows the interpreted result before RECORD.
  Minutes and seconds must be <=59. Zero/blank times are rejected. Long Jump metres still use decimal entry.
  Practice data key OTG_EVIL2_TRIAL_V182_<FH5SpaceId> is unchanged, so v182 drafts are preserved.

FIX B — OLD Evil Tournament Race Off UP NEXT only: two compact aligned 40x40 History buttons,
  names wrap naturally, phone layout stacks car cards vertically, full History click handler retained.
  Doesn't change match logic, completed results, or History records.

SAFETY: Keep the phone installed PWA; DO NOT uninstall, reset, clear site storage, or import the old 698-car backup.
  Your Garage currently holds 704 owned cars. Export a NEW OTG portable backup before update;
  make a second secure copy. Private family artwork in IndexedDB requires separate protection;
  this update leaves browser storage in place but portable JSON does not include that artwork.
  The isolated QA cockpit remains outside standard portable backup.
  Old tournament restart from Slot 001 is NOT part of this update.

VS CODE in C:\RaceHub, after extracting ZIP and reviewing changed files:
  git add -A
  git commit -m "OTG MAIN v8.0.184 Evil2 numeric entry and Race Off History UI QA"
  git push origin main

PHONE QA (report PASS/FAIL per step):
  1) Update normally; verify v8.0.184 and NO repeated update prompt.
  2) FH5 > Evil Tournament > EVIL 2.0 — RESULT ENTRY COCKPIT (QA).
     Manufacturer Relay, first stage: tap race time; digits-only keyboard; type 0342250.
     Preview must say = 03:42.250. RECORD; check result = 03:42.250.
  3) Reopen cockpit: practice record still present. Back buttons work.
  4) Long Jump: decimal input accepts 124.50 and zero remains valid practice failure.
  5) Old Evil Tournament > active Jaguar Race Off UP NEXT: two small square History buttons,
     whole car names visible, tap each opens correct history. Back works.
  6) Old Evil slot progress + FH5 Garage 704 owned unchanged; private incident/gallery opens.
STOP on update loop, lost records, or a Garage ownership mismatch. Never clear phone storage.

Phone QA has NOT been performed on this ZIP yet.
