OTG! MAIN v8.0.190 — RELAY COMPETITION FOUNDATION, ISOLATED QA

PATCH OVER PHONE-PASSED v8.0.189. Extract into existing C:\RaceHub and overwrite matching files. NEVER delete the folder, uninstall the PWA, or clear browser data. Back up first; user previously verified 704 owned cars.

Changes:
- Manufacturer and Mixed relay previews retain maximal participation and seeded draw logic from v8.0.189.
- Repeatable seed field and Redraw button aligned on phone.
- Confirm Draw locks an independent snapshot of team/car/stage assignments per mode and FH5 Space in a dedicated localStorage QA key: otg.evil2.relay.qa.v1:<SpaceID>:<maker|mixed>.
- Enter/clear 3 per-team numeric stage times (e.g., 0342250 for 03:42.250); blank never means a win. Save times per team. Complete-team totals and provisional top-ten standings appear after all three times entered.
- Return to the app and reopen to verify QA save/resume. For testing only, a DOUBLE-CONFIRMED 'delete this QA relay' button deletes just this isolated namespace entry.
- No track selections, live race records, career victories, Evil 1.0 reset, app state migrations, or campaign generation. Existing Garage and private media untouched. The isolated QA relay is not yet exported by the regular OTG portable backup; keep phone/browser storage intact.
- No persistent writes occur until Confirm Draw. No stable Space ID means confirmation disabled.

PHONE QA:
1. App reports v8.0.190 with no update loop. Evil Tournament > Relay Garage opens and returns.
2. Repeatable seed and Redraw button align; both modes show maximal teams and no reused cars.
3. Confirm one draw, see locked state and cannot redraw; enter 0342250 for first team Stage 1 and Save Team Times.
4. Leave/reopen Relay Garage and verify locked teams and saved 03:42.250; test 2 additional stages and team total; provisional standings.
5. Test empty time does not score; verify manufacturer/mixed independent. Check Garage count, normal events and private content unaffected.
6. Report any unresponsive warning. Do not delete QA test unless intending to discard it.

Synthetic syntax and archive checks do not replace phone QA.
