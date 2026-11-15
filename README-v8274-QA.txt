OTG! MAIN v8.0.274 — Protected IndexedDB save/reopen rehearsal (QA)

Install over existing v8.0.273 files. DO NOT clear browser/site data or delete old files.

What it does: tests saving the exact verified main-state copy as a separate temporary IndexedDB record, closing/reopening IndexedDB, checking SHA-256 and all Space IDs, then deleting only the scratch record.

What it does NOT do: it does not intercept live rhSave, migrate the live state, delete or modify original localStorage, change Garage/race results, freeze Evil 2.0, or reset anything.

Reason for guard: core native save code (js/core.js and other base app modules) isn't included in this cumulative update package. A true storage-engine switch cannot safely be implemented or tested without inspecting those original source files.

QA: Prelaunch QA Controls > REHEARSE IDB SAVE + REOPEN (NO SWITCH) > PASS and report. Keep prior private backup off public GitHub.
