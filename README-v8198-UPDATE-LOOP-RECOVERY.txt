OTG! MAIN v8.0.198 — UPDATE LOOP RECOVERY (incremental over 8.0.197)

Copy ALL files into the EXISTING C:\RaceHub folder, overwrite matching files. Do NOT delete any existing files, uninstall app, clear storage, or restore outdated backups. Commit and push.

ROOT CAUSE: v8.0.197 accidentally retained <meta name="racehub-version" content="8.0.196"> in its HTML despite the manifest/worker being 8.0.197. This made the updater repeatedly think a newer release was available. The legacy gate could also mistake stale old caches for an installed older version.

CHANGES: Correct v8.0.198 HTML metadata, consistently pin new worker/bootstrap/update-wire/index, prefer active worker to stale cache in startup check, correct worker-version parser for version 8.0.198. Preserve existing protected backup confirmation flow.

No changes to relay calculations, route locks, car data, older Evil tournament, records or private content. JS/CSS from prior versions remain required on disk; do not remove.

PHONE QA: Install and accept one update after verified safety backup. Close/reopen twice: NO repeated update overlay. Confirm version 8.0.198. Test Relay Garage, group lock/persistence, old QA times, 704 Garage cars (unless changed), private content.
