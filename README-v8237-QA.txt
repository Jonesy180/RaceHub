OTG! MAIN v8.0.237 — SKIPPED INTERMEDIATE UPDATE REPAIR

CAUSE IDENTIFIED: v8.0.236 was offered directly on top of v8.0.234 but its
service worker required index-v8235.html, bootstrap-v8235.js, update-wire-v8235.js,
and launch-safety-v8235.js from the uninstalled v8.0.235 patch. The service
worker install therefore became REDUNDANT and updater showed a generic error.
This was a missing-FILES install error, not evidence that a 704-car Garage was lost.

INSTALL: 10-file ZIP overlay into existing C:\RaceHub. Overwrite matching files,
DO NOT delete anything. v8.0.235 and v8.0.236 installation are NOT required.
Previously accepted v8.0.234 is the safe installed fallback. No data reset.

CHANGES: Repackages the same v8.0.236 read-only Original Evil source comparison;
new 8.0.237 versioned entry and worker install ONLY the six current assets
actually included in this ZIP. Keeps protected all-Space IndexedDB Safety Backup
gate, sw navigation / update-loop repair and all other app mechanics unchanged.
Adds explicit pre-flight checks and actionable error text if a required asset
is missing. Does NOT clear caches, browser history, localStorage or IndexedDB.

PHONE QA: Install normally using Update Now, check it opens 8.0.237 with no
update loop. Open Festival > Evil 2.0 Prelaunch Safety > Open Safety Audit >
Original Evil event lists; run COMPARE BOTH ORIGINAL EVIL LISTS — READ ONLY.
Verify full 704-car FH5 Garage, all original racing results and Spaces still there.

IF UPDATE STILL FAILS: Don't clear storage. Screenshot the EXACT failure text;
new versioned 8.0.237 worker only starts after successful Safety Backup check.

VS CODE:
git add .
git commit -m "OTG v8.0.237 Fix Skipped Update Files"
git push
