OTG MAIN v8.0.352 — TET2 STAGE 3, FORMULA DRIFT SCORE + OBSOLETE QA CARD REMOVAL
BASE: phone-PASS v8.0.351. INCREMENTAL OVERLAY ONLY; extract directly over C:\RaceHub. NOT a new app.

WHAT THIS REALLY DOES:
- Removes the old EVIL 2.0 NEW FORMAT NATIVE RACING diagnostic panel from Festival startup.
- Retains its underlying native-race engine APIs; engine file copied to a new v8352 filename with the one diagnostic panel initialization disabled.
- Adds an independent real Formula Drift Zone Score competition entry to Festival: 15 cars made by Formula Drift in the current owned FH5 Garage, Los Campos Drift Zone, exactly one saved attempt per car, shown in 3 sessions of 5, one global ranking.
- Saves only the new event object inside the active FH5 Space using existing rhSave(). Does not write honours/medals yet because shared official pathway is still Stage 3 pending. This is not a full Stage 3 completion.
- No obsolete Drift Knockout. Second Chance/Champion of Champions remain reserved for TET2 Tournament HQ, and no artificial 16-car cup is introduced.
- Drag Shootout is NOT added in this update: original pilot formats (8/16) do not establish the final approved field. It must be connected to the correct approved competition entry, not guessed.

TEST SCOPE: Phone opens Festival and sees Formula Drift entry; open it and verify '15 cars' and Los Campos. DO NOT START / SAVE YET until we check actual entry and result flow. No old QA panel should appear. All other tested engines remain unchanged. No old results clean-slate reset performed.

Backup first. Use usual Git three lines after extract/review. Do not delete app or clear storage.
