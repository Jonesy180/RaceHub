OTG! MAIN v8.0.253 — ADD PRETEND RESULTS (QA ONLY)

Install directly over PHONE PASSED v8.0.251 OR the v8.0.252 hotfix.
Overwrite matching files ONLY, do not delete files or clear browser storage.

QA workflow:
1) Slot 003 already DONE remains done. Slot 004 should be next.
2) OPEN current Slot 004/005 and START, enter the original native Race Off screen.
3) Use the existing Race Off interface to set the course and lock the normal random DRAW.
4) Then tap 🎭 ADD PRETEND RESULTS — QA ONLY, either in the Race Off drawn screen or when back in the Evil 2.0 slot panel. Confirm once.
5) Only missing pairings get plausible QA times and a QA marker; existing real results are never changed. You return to the numbered slot screen where MARK DONE is available.
6) Slot 006 Festival: START, return to the slot screen if needed and tap ADD PRETEND RESULTS; the two source-verified tracks are filled for all 11 entrants, without typing 22 times.

Important: this QA control is not an actual racing mode. It is restricted to Slots 003–006, to the live FH5 Space and this prelaunch native R2 campaign only. These pretend times are stored in your Space but explicitly tagged qaPretend; native record/medal save APIs are never called and no record flags are set. Later all-Spaces clean-slate launch must remove such QA data safely, and we will verify actual recorded R2 results separately. No current deletion/reset.

Fails closed if a draw is not locked, a pairing is partially recorded or any stored identity conflicts. No background generation, no slot auto-DONE, no other events touched.

Three VS Code lines:
git add .
git commit -m "OTG v8.0.253 QA Pretend Result Button"
git push
