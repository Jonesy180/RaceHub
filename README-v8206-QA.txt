OTG! MAIN v8.0.206 — NATIVE FESTIVAL RELAY DROPDOWN QA
========================================================
Apply this incremental overlay to your existing C:\RaceHub. Do not delete any existing files.

ISSUE: A custom <button> accordion head kept appearing grey on mobile, even after colour overrides.
FIX: Replace ONLY that heading with native HTML <details>/<summary>, styled in the standard black/cyan Festival colours. No generic button active/pressed rules should now apply. Remove misleading '2' count because expanded menu has one launcher.

Retained unchanged: one Race Control launcher, relay tabs and existing QA saves, native route-lock modal, improved update diagnostics, protected update mechanism, old Evil retirement, Garage and private content.

PHONE QA:
1) Confirm version 8.0.206 and no repeat update loop.
2) Festival > Relay Competitions black/dark like peer headers when collapsed AND expanded.
3) Expand/collapse, one OPEN RELAY RACE CONTROL button, Manufacturer/Mixed tabs and Back.
4) Update checker shows current published version; Garage count and previously saved relay times intact.

NOTE: QA overlay only. Existing local-only relay test records are not included in portable backup; do not clear browser data.
