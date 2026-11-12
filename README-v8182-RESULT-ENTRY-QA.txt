OTG! MAIN v8.0.182 — EVIL 2.0 PRACTICE RESULTS COCKPIT (QA)
INCREMENTAL ZIP. Extract over existing C:\RaceHub. Does NOT replace the old tournament.

Features: real owned FH5 cars; 3-stage manufacturer/mixed relays; 3-stage maker/type gauntlets; one jump per car; manual times MM:SS.mmm / HH:MM:SS.mmm; 0.00m legitimate jump failure; saved standings and corrections; export test results as JSON; Back buttons.

CRITICAL SAFETY: All entered data is stored ONLY under localStorage key OTG_EVIL2_TRIAL_V182_<FH5SpaceId>. No rhSave calls. It does NOT count towards career medals, normal race records, Evil badges, Evil progress, or Hall of Shame. Isolated test drafts are not part of standard OTG portable backup. Do not use it as your sole racing-results tracker. Never clear the phone's browser storage. Private images and story scripts are NOT bundled.

No verified FH5 route lengths: for multi-stage tests manually enter real routes; shared route per stage. Production smart selector remains blocked pending verified profiles.

Three VS Code lines:
git add -A
git commit -m "OTG MAIN v8.0.182 isolated results entry QA"
git push origin main

Phone QA: FH5 -> Evil Tournament -> EVIL 2.0 — RESULT ENTRY COCKPIT (QA).
Enter a single practice stage or jump, close and reopen, verify value still present and Back works. Check old Evil completed slot count is unchanged. No uninstall/clear-data.
