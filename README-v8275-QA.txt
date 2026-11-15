OTG! MAIN v8.0.275 — Storage-engine integration preparation (QA)

This update adds a standalone asynchronous IndexedDB staging adapter and a read-only save engine readiness report. It does NOT replace or intercept rhSave/rhLoad, does NOT migrate the live app, and does NOT delete localStorage.

Why no live switch yet: the current cumulative package lacks the native js/core.js, js/studio-final-v7020.js and related base save-engine source. Patching a synchronous save engine blind could lose writes or reload stale state. A full save-system switch requires inspection and modification of those source files first.

INSTALL: overwrite matching files in your project, do not delete others or clear phone data.
QA: Dashboard > Evil Tournament > Prelaunch QA Controls > CHECK SAVE ENGINE (READ ONLY).
Keep existing private JSON export safe. Leave schedule freeze disabled.

For the actual production integration, supply the original native app source files from C:\RaceHub\js\: core.js, studio-final-v7020.js, studio-release-v595.js, studio-v6-garage-foundation-v600.js, plus any module that defines rhSave/rhLoad/RH_FINAL_STORE. Never supply your private JSON saved-state export through public GitHub.
