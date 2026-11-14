OTG! MAIN v8.0.249 — EXISTING OTG! ENTER RESULT SCREEN (ISOLATED PILOT)
Install over v8.0.248, overwriting matching files. DO NOT DELETE data.

  git add .
  git commit -m "OTG v8.0.249 Existing Result Entry Pilot Bridge QA"
  git push

NEW: When a frozen group has an up-next car, the cockpit shows
OPEN EXISTING ENTER RESULT. Tapping opens the actual OTG! Enter Result
stopwatch UI (and optional Advanced Timing), drawing from live Garage,
with the exact car and FH5 course from the frozen pilot.
Native SAVE is intercepted BEFORE official handlers for that pilot runId:
record is stored ONLY at the original isolated prelaunch localStorage key
(otg.evil2.prelaunch.race.v8246:...), using the existing v8248 pilot
record invariant. No rhSave, no Space.run entries, medals, official history,
record books, reset or Evil dashboard modifications.
Official OTG! runs continue using their original native save.
The old numeric pilot entry remains as an alternative.

PHONE QA: original pilot group and saved times unchanged. Tap
OPEN EXISTING ENTER RESULT; confirm original familiar OTG stopwatch
and 2000s Normal Championship name, current drawn car and Emerald
Circuit (actual track depends on your frozen draw). Note PRELAUNCH ONLY
banner. Enter a test stopwatch time (or use optional Advanced Timing).
Tap native SAVE RESULT; see SAVED in pilot and next car, with count up
by one. Back / refresh persists result. Open an existing ordinary race
and verify native entry remains ordinary (do not save a test result there).

This is NOT official Evil 2.0 launch and NOT complete stage/medal/Second
Chance integration. Do not rely on prelaunch races for official honours.
No resets, no new hero reveal. Source v8138 native entry code not bundled:
actual device UI/safety QA still needed to verify compatibility.
