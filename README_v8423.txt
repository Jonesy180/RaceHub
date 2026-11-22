OTG! MAIN v8.0.423 — LATE GARAGE CARS WITHOUT RE-SHUFFLING

Based on v8.0.422, after the user confirmed the twelve-slot test reset and full live Evil List shuffle.

WHAT IS FIXED
* First real ENTER RACE RESULTS locks a lightweight baseline of the Garage in the TET2-only official race record. It does NOT affect OTG native racing or Garage membership.
* The full 2,070-position approved shuffle, its progression and all verified routes are reconstructed from that initial baseline, so adding a car no longer changes every slot or invalidates the tournament signature.
* Already-entered draws are re-used verbatim, even when the Garage gets a new car. No previously banked results are recalculated or replaced.
* Later Relay groups and not-yet-drawn historically eligible categories can see newly acquired Garage cars, subject to original competition-format eligibility.
* Unfinished Gauntlet and Aerodromo batches accept additional cars at the end of the original field when there is free space in the final 8-car / 16-car batch. Each still races only once per competition. If extra visits are required, the app FAILS SAFELY instead of silently ignoring entrants or changing existing slots.
* A Swiss Cup that had been marked PENDING at the end is enabled once its original 16-car field is completed by new owned cars; previously assigned cup entrants stay fixed.
* Removing or reclassifying a car already owned at first draw triggers a safe stop, rather than risking invalid official results. New cars in the normal OTG Garage remain owned and untouched.

IMPORTANT LIMITATIONS
* Acquisition method (wheelspin/gift vs buying) CANNOT be inferred from current Garage metadata. Continue following your no-purchasing tournament rule manually.
* Spare batch capacity is finite (for a 698-car start, six extra places each in Gauntlet and Aerodromo); additional cars beyond the original reserved batch count need an explicit future-visits extension. The app stops safely rather than rewriting the 2,070-slot Evil List or silently dropping a car.
* Already-started competition fields and individual slot draws do not expand retroactively. New entrants are admitted only in eligible, genuinely UNSTARTED draws. Fixed manufacturer/historical knockout brackets refuse a larger field until an explicit qualifying-stage extension is added; this safe-stop occurs BEFORE the affected draw can be locked.
* Swiss cups are allocated in stable original-baseline order, then late cars join the incomplete last cup. Earlier full Swiss Cup rosters are never redrawn.
* This is NOT a paid-entrant detector, unlimited dynamic scheduler, or a claim that every source-defined format can accept arbitrarily many cars.

NO RESET OR AUTO-START
Existing TET2 data is not cleared. Installing v8.0.423 does not draw a slot or start a tournament; the baseline is pinned on the first explicit ENTER RACE RESULTS. OTG Garage, History, Settings and normal racing are not touched.

INSTALL
Extract into C:\RaceHub, replacing matching files. Then git add -A; git commit -m "OTG v8.0.423 late entrants"; git push origin main. The current TET2 slot order should look unchanged after installing.

VERIFY
Open TET2 Evil List; Slot 0001 should still be CURRENT and the approved order should not change. Open Race Control; first event should be Fast and Furious Normal Race Off. No new debugging panels. Follow existing normal racing workflow.
