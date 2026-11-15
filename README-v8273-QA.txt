OTG! MAIN 8.0.273 - Service worker installation hotfix (QA)

Cause found in v8.0.272: install critical list requested ./js/otg-storage-audit-v8272.js?v=8271; that file does not exist. Correct existing file is ./js/otg-storage-audit-v8271.js?v=8271.
The install handler treated a missing critical file as fatal, producing UPDATE INSTALL BLOCKED - install failed.

Fix: new worker and manifest, new versioned entrypoint, limited mandatory pre-cache list, all critical assets verified present in package.
No original localStorage data is deleted, switched, or reset. IndexedDB proof remains copy-only.

Phone QA: update -> Evil Tournament -> Prelaunch QA -> COPY & VERIFY IN INDEXEDDB (NO SWITCH), confirm verified copy.
Keep private backup off public GitHub. Never clear site data to troubleshoot.
