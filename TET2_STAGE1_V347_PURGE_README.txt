OTG! MAIN v8.0.347 — STAGE 1 RELEASE CANDIDATE (18 NOV 2026)

PURPOSE: Disconnect old Evil List and associated experimental schedule/HQ/launch utilities from the REAL OTG! Main v8.0.346.

WHAT THIS ACTUALLY DOES
- Removes 80 old Evil/tournament/diagnostic JS references and 23 obsolete CSS references from the ACTIVE entry page. (Historical unused source files are not deleted from the repository in this overlay.)
- Removes old Evil List and Headquarters entry points; preserves #evilcampaign as a hidden compatibility anchor.
- Retains Relay dependency chain and seven required styles, plus Gauntlet, Long Jump, Second Chance, Festival, Race Off, Garage.
- Uses v8.0.347 bootstrap, update wire and service worker versioning.
- Does NOT overwrite/reset user data, Garage or backup mechanisms.

IMPORTANT BOUNDARY
Some CURRENT competition features (Relay, Gauntlet, Long Jump, Second Chance) remain implemented by old 'QA'-named scripts and may display QA wording. Those are currently the actual working competition implementations; removing them blindly would break the comps we want to keep. In stages 2/3 we will audit/graduate the code and remove obsolete QA surfacing in those formats. Do not claim all QA code is gone at this stage.
Historical JS source files stay physically in the repository because this is a non-destructive overlay. They are not loaded in the active latest entry page. A later safe deletion pass can remove files after dependency review.
No competitive-data clean slate/reset has been performed: this must be scoped safely to competition records separately from Garage.

INSTALL — NORMAL VS CODE / GITHUB WORKFLOW (NO NEW TOOLS)
1. Existing MAIN portable backup recommended before the version update (Garage must survive). Never deploy to LAB.
2. In VS Code terminal in C:\RaceHub, confirm: Get-Location ; git remote get-url origin ; (Get-Content .\version.json -Raw | ConvertFrom-Json).version
3. Expected donor app version is 8.0.346. If different, stop.
4. Extract THIS ZIP over C:\RaceHub, preserving every unlisted file; do NOT 'replace entire folder' or delete old files.
5. In VS Code review git status --short and git diff -- index.html version.json update-manifest.json
6. Once confirmed, normal commands: git add -A ; git commit -m "OTG Main v8.0.347 retire broken Evil List" ; git push origin main
7. On phone use normal OTG! update. Check home opens, Garage count 704 (if unchanged), Festival opens/Relay still appears, Race Off opens, old Evil List gone. No new results required.

VALIDATION: Static source checks and JS syntax checks pass. Full browser/phone execution is NOT claimed.
