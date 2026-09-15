OTG! MAIN v8.0.62 — CONSOLIDATED RELIABILITY + LONELY HEARTS

UPDATE / SAFETY BACKUP
- v8.0.61 → v8.0.62 should visibly show OTG! UPDATE AVAILABLE.
- UPDATE NOW remains gated by a verified Safety Backup.
- A direct-new-index fallback prevents a silent version jump if the new HTML arrives before the worker update.
- version.json, update-manifest.json, bootstrap and service worker all identify v8.0.62.
- New Safety Backups protect the complete current Space, including active Race Offs and Race Setups.

SWISS ABANDON
- Restores the Danger Zone / ABANDON action to Festival Swiss and Custom Racing Swiss.
- Remains available through Swiss knockout continuation.
- Existing results, PBs and records are retained with Abandoned provenance.

CHAMPIONSHIP CARD SAFETY
- Fixes setup cards whose names contain apostrophes/special characters.
- `Pickups & 4x4's Championship` can now open normally.

HENNESSEY
- Repairs live duplicate/whitespace Hennessey variants to one canonical Hennessey manufacturer entry.
- Backups and protected catalogue source data are not rewritten.

LONELY HEARTS
- Added to Festival and Race Off.
- Eligible manufacturer = exactly one owned car in the current Garage.
- Eligibility is live before a new run; entrant field freezes on START.
- Festival uses normal entrant thresholds: Standard 2–16, Groups 17–64, Swiss 65+.
- Race Off uses knockout.
- FH5 preset programme uses existing approved routes and presentation only; no new artwork.

RACE OFF
- Landing page now surfaces every active/in-progress Race Off, each with its own Continue action.
- Completed Race Off champions now appear in Hall of Fame with aggregate winning time.

UNCHANGED
- Existing Garage ownership, records, results, Spaces and racing data are preserved.
- Main only. rh-guide remains v8.0.17 and is not rebuilt during Main development.

DEPLOYMENT
VS Code:
  code .

PowerShell:
  Set-Location "<PATH-TO-EXTRACTED-OTG-v8.0.62>"
  code .

GitHub:
  git add .
  git commit -m "OTG! v8.0.62 consolidated reliability and Lonely Hearts"
  git push origin main
