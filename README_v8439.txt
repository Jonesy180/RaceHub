OTG! MAIN v8.0.439 — GENUINE RECORDS & CINEMATIC AWARDS
Base: v8.0.438. No reset and no edits to race results or medal rules.

Five approved cinematic scenes: PB, Event, All-Time Track, Double, Triple. Full approved art kept in assets/tet2-records-v8439; top art crops are used to keep the example/mock times from appearing as actual live records, with official saved values printed dynamically below.

Rules:
- First recorded attempt by a car on a route = benchmark, no PB celebration.
- Personal Best: that exact car beats its prior official attempt on same course / measurement; celebrate after banking.
- All-Time Track: TWO DIFFERENT PREVIOUSLY COMPLETED competitions must already have official history on that same course. Then a new result must strictly beat the full previous best; celebrate immediately even when PB also earned.
- Event: compare with a prior fully completed round of the same competition on the same course; award only when every scheduled visit of the current round is marked done. No first-round celebration.
- Double / Triple: only genuinely coincident achievements by the SAME saved car performance; shown at round closure, not as a sequence of multiple single pictures. All-time keeps its earlier standalone celebration.
- End-of-round report shows saved racing results; intermediate rounds do NOT award medals. The award presentation is separate from results and can be dismissed permanently. No awards are replayed after dismissal.
- Original OTG! history and other Spaces are untouched. New TET2-only Space key is removable by the verified manual TET2 reset with backup.

IMPORTANT SCOPE: This update integrates the TET2 results ledger. Normal OTG! Custom Racing and Multiplayer League Manager do not have their complete original source in this patch overlay, so their entry screens have NOT been replaced or claimed as converted.

DEPLOY:
git add -A
git commit -m "OTG MAIN v8.0.439 Verified Record Celebrations"
git push origin main

PHONE QA when real records happen naturally, not fake times: PB only after previous attempt; all-time requires two completed other competitions; event at complete round only; no duplicate replay. Software checks do not replace Samsung verification.
