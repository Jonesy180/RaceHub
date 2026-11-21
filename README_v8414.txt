OTG! MAIN v8.0.414 — TET2 RECORD CELEBRATIONS AND STANDINGS

This cumulative patch includes v8.0.413's illustrated global navigation fix;
you can skip installing v8.0.413 separately. Requires your existing working
OTG! MAIN installation through v8.0.412; overlay the ZIP; do not delete
original assets or older versioned OTG files.

RESTORED WHILE RACING
* After an official, successfully BANKED time becomes the fastest TET2 time
  recorded on that actual FH5 course, show the NEW TET2 COURSE RECORD screen.
* An inaugural official TET2 course time is its first record. Subsequent times
  must strictly beat the best; ties are not records.
* Aerodromo one-shot Long Jump record uses longest distance, not fastest time.
* Records are derived from the verified, existing TET2 official slot results
  and are NOT added to the original OTG! records or history.
* Continue Results dismisses the celebration and goes to the next unsaved
  result. Nothing is automatically banked. Saved entries remain saved.

RESTORED AFTER MARK AS DONE
* A scrollable CURRENT STANDINGS / RESULTS screen appears after each slot.
* Final standings and honours are shown only when the event has finished;
  any medals shown must already exist in verified official TET2 honours.
* Knockout: match winners advancing for the slot; does not wrongly rank
  unrelated head-to-head times or award provisional medals.
* Relay: three-leg summed team standings for the group.
* Drift: timed standings for all cars; verified gold/silver/bronze if final.
* Gauntlet: times for the batch + provisional table of completed batches.
* Swiss: match winners + cumulative W/L from completed Swiss visits.
* Aerodromo: separate drag and long-jump rankings.
* Past completed slots (including fake Slots 001–003) can be reviewed in
  Pit Wall by opening the relevant slot and tapping VIEW SLOT STANDINGS.

SAFETY / SCOPE
* No fake results or progress reset. Existing completed slots are unchanged.
* No new medals awarded by the display module; no changes to trophy designs.
* The approved Evil List draw/order, track shuffle and digital result entry
  remain the same. Navigation artwork fix v8.0.413 included.

INSTALL:
Extract over C:\RaceHub. Replace same-named files, preserve other files.
Then, from C:\RaceHub run:
  git add -A
  git commit -m "OTG Main v8.0.414 restore TET2 records and standings"
  git push origin main

PHONE TEST
1. Verify updated TET2 command-centre artwork navigation (v413 was skipped).
2. Pit Wall -> completed Slot 003 -> VIEW SLOT STANDINGS shows the 22-car
   Drift classification and verified final podium if honours were published.
3. Slot 004 Swiss Cup: BANK fake times. First new course record should show
   a TET2 record celebration, then CONTINUE RESULTS returns to next unsaved.
4. MARK AS DONE -> Current Swiss results/standings screen -> Continue -> Slot 005.

No developer/QA/preflight panels are added to the live app.
