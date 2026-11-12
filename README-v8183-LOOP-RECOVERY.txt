OTG! MAIN v8.0.183 — v8.0.182 UPDATE LOOP RECOVERY (QA)
INCREMENTAL ZIP — extract over C:\RaceHub, do not delete the directory.
Root cause: v182 index identified as v8.0.181 and loaded old v8181 bootstrap/update checker; v182 worker served index-v8181 on navigation. This caused repeated prompts and worker rollbacks.
Fix: root and index-v8183.html both declare v8.0.183; v8183 bootstrap/manifest/worker agree; worker pre-caches correct page and uses network-first navigation with v183 offline fallback.
Includes same Evil 2.0 result-entry QA cockpit from v182; no destructive reset or saved career changes.
DO NOT uninstall/reinstall the PWA, clear browser data, or remove existing files. Private family art in IndexedDB is not included in OTG portable backup.

IN VS CODE AT C:\RaceHub:
git add -A
git commit -m "OTG MAIN v8.0.183 fix v182 update loop"
git push origin main

On phone, reopen OTG normally, accept the v8.0.183 update prompt, allow it to reload. Check version 8.0.183 and that the Evil 2.0 Result Entry Cockpit opens once and Back works. If it still loops, stop: do not clear phone storage. Send the exact screen text and installed version for further recovery.
