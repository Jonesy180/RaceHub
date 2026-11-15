OTG! MAIN v8.0.276 NATIVE SAVE SHADOW QA

This package adds opt-in same-session shadow verification of successful native rhSave() calls. Initial copy verifies IndexedDB. When opted in, future successful native rhSave() calls are mirrored asynchronously with read-back. Original localStorage remains primary; no reset, no deletion, no live migration. Quota failures still block normal saves.

Install by overlaying C:\RaceHub, commit and push. Test Dashboard > Evil Tournament > Prelaunch QA Controls > ENABLE VERIFIED SHADOW (THIS SESSION). Expect VERIFIED SHADOW PASS. Do not race to test mirroring while storage quota remains exceeded.

Only four original scripts were supplied and other feature scripts may persist directly to localStorage; the shadow does not intercept those paths.
