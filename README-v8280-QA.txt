OTG! MAIN v8.0.280 — NATIVE IDB PILOT SCHEMA FIX

Based on v8.0.279 cumulative overlay.
Fix: pilot now validates native OTG save schemas 2 and 3 (v6 Garage = schema 3).
Space identities must be present, unique and active/default references valid.
Pilot remains isolated. No production cutover, Garage edit or Evil reset.

PHONE QA:
1. Install on top of your existing RaceHub repository; do not delete files.
2. Dashboard > Evil Tournament > Prelaunch QA Controls.
3. ENABLE ISOLATED SAVE PILOT; it should create a verified copy and reload.
4. TEST NATIVE SAVE; reopen app; VERIFY AFTER REOPEN.
5. EXIT PILOT / RESTORE ORIGINAL. Do NOT race while in pilot mode.

Git:
git add .
git commit -m "OTG MAIN v8.0.280 Native pilot schema compatibility fix"
git push
