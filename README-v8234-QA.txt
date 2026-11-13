OTG! MAIN v8.0.234 — GARAGE SCHEDULE BLUEPRINT + DASHBOARD HANDOVER QA

Incremental overlay onto phone-passed v8.0.233. Copy included files into the existing C:\RaceHub directory and overwrite matching files. DO NOT DELETE older files.

YOU ASKED: Will the existing Evil Tournament DASHBOARD tile stay, but open Evil Tournament 2.0 at launch?
YES. This build records and presents that handover plan. The EXISTING tile, artwork and home layout are UNCHANGED NOW. On a separate approved production launch, the same tile will route to Evil 2.0 instead of the old Evil campaign. No second permanent tile is planned.

PHONE QA:
Festival > EVIL 2.0 PRELAUNCH SAFETY CHECK > OPEN SAFETY AUDIT.
Scroll to Dashboard Evil tile — approved launch handover; it should say old campaign still active.
Scroll to Live Garage schedule blueprint — QA ONLY.
Tap RUN REAL GARAGE SCHEDULE BLUEPRINT — READ ONLY.
Confirm PASS and actual owned FH5 counts; inspect the first 12 work-order candidates.
Check old Evil dashboard tile still works, and existing Garage, records and private content remain unchanged.

WHAT THIS DOES:
Uses real owned FH5 cars to assemble a deterministic, in-memory opening work-order blueprint:
Manufacturer Gauntlet eligible fields, Car Type Gauntlet eligible fields, and a single Long Jump attempt for every car. Manufacturer and Mixed Relay candidate teams are treated as rosters for TWO championships, not falsely counted as hundreds of standalone event slots. No fixed 1,219 cap.

WHAT THIS DOES NOT DO:
NOT the final Evil 2.0 draw, no committed event slots or tracks, no source event completion, no actual race time entry, no medal publication, no automatic Second Chance enrollment and NO RESET.
Still missing: actual 32/64 Race Off, Swiss, Group, Hot Wheels, Rally/Off-Road and other specials; real Gauntlet and Relay race-stage packing, final race count, track selection, real Finals Nights and Second Chance triggers. All remain explicit launch blockers.

Current accepted MAIN baseline is v8.0.233 until this QA passes on phone.

VS CODE:
git add .
git commit -m "OTG v8.0.234 Garage Schedule and Dashboard Handover QA"
git push
