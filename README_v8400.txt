OTG! MAIN v8.0.400 — REMOVE TEST / PREVIEW / REHEARSAL CLUTTER

STAGE 1 OF USER-APPROVED THREE-STAGE DELIVERY

Install: extract this ZIP into your EXISTING C:\RaceHub folder, replacing matching files. Do NOT delete existing files, databases or browser storage. This is a versioned overlay, not a fresh installation. Commit and push to GitHub as usual.

CHANGES
- Seven clean TET2 screens: Command Centre, Race Control, Evil List, Medal Tables, Pit Wall, Swiss War Room and Hall of Shame.
- All the visible practice, stage rehearsal, candidate audit, track preflight, diagnostics and developer-only panels removed from the active TET2 interface, and their old script/style imports removed from the active index.
- The current Evil List comes directly from the source-backed schedule assembler, with the unapproved Festival Top 3 Open Event REMOVED, retaining the existing relative order of all other events and the ten different opening families. No fake trophies, slots or results are added.
- All pre-cache service worker dependencies on retired practice/test modules REMOVED. Every mandatory new 8.0.400 asset is included in this ZIP.
- Kept the existing functional Race Control and official result-entry engine (the v8.0.399 engineering code is carried forward without creating new saves). Existing OTG! Garage/Spaces remain untouched by this cleanup. No automatic start or results reset.
- Medal Tables and Pit Wall read existing verified TET2 result receipts only. No mock or provisional results are shown.
- Historical old test modules may remain on disk for browser cache rollback, but are not imported into the TET2 interface. Do not manually delete old versioned assets.

CHECKS
- Source-backed 704-car test: 2,070 visits, ten first appearances of different formats, no Festival Top 3 event, integrity audit PASS.
- JavaScript parser and version / ZIP asset-reference tests PASS.
- This cleanup does not assert that every later competition engine is connected. That is STAGE 2, after user accepts the clean UI.

NEXT
Stage 2: connect all approved event formats to real results / progression / honours.
Stage 3: run first ~12 varied slots sequentially with fake racing times, fix real failures as encountered, then reset test-only tournament results / medals / progress while retaining Garage and approved Evil List.
