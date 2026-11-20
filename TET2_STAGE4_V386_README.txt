OTG! MAIN v8.0.386 — SECOND CHANCE + CHAMPION OF CHAMPIONS GATES
PRELAUNCH ONLY — requires v8.0.385 on C:\RaceHub. Extract as overlay, replace included files. Do not delete previous files.

NEW IN RACE CONTROL (NOT EVIL LIST): 'FINAL BATTLES · QUALIFICATION' shows status cards for two conditional final competitions. This is not a new debugging panel in the Evil List.

SECOND CHANCE:
- Qualifiers are only officially completed bronze duel winners from full Manufacturer Race Offs with 4+ cars and the combined Lonely Hearts knockout with 4+ entrants.
- Uses the v8358 isolated official honours receipt validator and v8356 final-battles engine.
- Verifies receipt's source event belongs to the CURRENT source-backed candidate schedule; does not infer results from practice saves, old OTG competitions or historic source counts.
- No 16-car cap; every eligible completed source contributes one car. Qualified-source counting refuses premature field freeze until ALL approved source competitions have reported.
- Knockout progression will use at most eight matches per eventual slot, bronze duel before final.

CHAMPION OF CHAMPIONS:
- Every single-car manufacturer is an automatic prospective entrant; makers with 2+ cars require their genuine FULL manufacturer Race Off winner. Historic Normal Race Off / Festival wins are not substitutes.
- Expected one representative per manufacturer; tournament absolute last, after Second Chance finishes.
- Source-readiness shown but the final cannot be drawn without a frozen official full schedule and all required earlier completions.

DATA SAFETY:
- Both START buttons are intentionally DISABLED.
- No official slots added, no auto-lock, no receipts published or modified, no data resets.
- Unlocked practice results continue in their existing isolated namespaces.
- v8.0.385 historical eligibility classification retained unchanged (module label updated only).
- Yoghurt Cup not created or renamed, held as future secret Hall of Shame trophy idea.

PHONE CHECK (ONE VIEW): TET2 > RACE CONTROL > scroll to FINAL BATTLES · QUALIFICATION. Check both cards say LOCKED, show manufacturer count / qualifier status, and have disabled START buttons. No racing/draw needed.

GIT:
git add -A
git commit -m "OTG Main v8.0.386 gate Second Chance and Champion finals"
git push origin main
