OTG! MAIN v8.0.248 — SAMSUNG NUMERIC KEYPAD TIME ENTRY FIX
INSTALL ON TOP OF v8.0.247. CUMULATIVE OVERLAY — DO NOT DELETE FILES.

 git add .
 git commit -m "OTG v8.0.248 Phone Friendly Race Time Entry"
 git push

USER CONFIRMED v8.0.247 SAVE WORKS ON SAMSUNG: 03:12.111 Dodge Magnum SRT-8,
1/16 RESULTS SAVED AND NEXT CAR FORD FOCUS RS 2003. ISSUE: Samsung
numeric keyboard cannot type ':' so time required copy/paste.

FIX: inputmode=numeric; accepts ordinary MM:SS.mmm (03:12.111),
7-digit MMSSmmm (0312111), or 9-digit HHMMSSmmm (010312111). Typed digits show live formatted preview;
saving retains standardized 03:12.111. Correction form accepts digits too.
Incomplete/invalid times are not saved. Current frozen group & already
saved 03:12.111 result remain under original unchanged v8246 prelaunch key.

PHONE TEST: Open Festival > First playable cockpit; counter must still show
1/16 and NEXT Ford Focus RS 2003. Type 0312111 (NO punctuation) and
confirm 'Ready to save: 03:12.111'. Tap SAVE THIS TIME; expect 2/16,
next car, SAVED confirmation. Reopen and confirm 2/16 remains.
These are ISOLATED PRELAUNCH records, NOT official. Stop before racing
further if not desired; test times don't migrate into main OTG results.

For actual Evil 2.0 launch, integrate competition schedule with EXISTING
OTG! result entry and Advanced Timing, NOT a duplicate permanent cockpit.
No reset; no edits to owned Garage/Spaces/medals/results/dashboard/private data.
