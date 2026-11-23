OTG! MAIN v8.0.433 — REMOVE FINISHED FRESH-START PANEL
========================================================
BASE: Samsung-PASS v8.0.432 (full 902 factory PI and class mappings,
Custom Upgrade groups, car-first race entry, Garage Intelligence panels).

ONLY INTENDED CHANGE
- Remove the large 'FRESH EVIL TOURNAMENT · SLOT 001' warning/reset card
  under Current event on TET2 Command Centre.
- Remove its reset/backup click handler and load-time dependency.
- Keep normal OTG! backup/export controls elsewhere in the app.
- Preserve current Evil List slot, locked draws, race times, awards, records,
  Garage ownership, OTG! racing, saved Spaces and settings.
- This update DOES NOT wipe, restart or regenerate TET2.
- 902 factory PI info panels and 30px class/H badges unchanged.

TECHNICAL
- Version-pinned JS: js/tet2-worlds-v8433.js; no reference to fresh-start UI.
- Old reset script and CSS remain inside ZIP solely for older-version
  compatibility, but are no longer loaded in the new app.
- Service worker/cache, update manifest, update wire and versioned entry
  updated to 8.0.433; old worker and indexes retained for rollback.
- Fix updater fallback URLs (inherited from old release) to target v8433
  instead of obsolete v8428/v8430.
- No storage keys changed, no migrations, no racing functions modified.
- Automated checks only; not phone-tested yet.

INSTALL
Extract into GitHub repository, replacing existing matching files.
Do not clear app data. Do not press 'START AGAIN' to remove this box.

SACRED THREE LINES
  git add -A
  git commit -m "OTG MAIN v8.0.433 Remove TET2 Fresh Start Panel"
  git push origin main
