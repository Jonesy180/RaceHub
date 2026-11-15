OTG MAIN v8.0.278 — STORAGE CUTOVER PREFLIGHT QA

Cumulative overlay on v8.0.277; overwrite matching files without deleting anything.

1) Ensure private JSON backup exists off GitHub.
2) Update OTG then open Dashboard > Evil Tournament > Prelaunch QA Controls.
3) Press TEST ORDERED IDB WRITES (NO SWITCH).
4) Expect QUEUED SAVE + REOPEN — PASS.

This build DOES NOT switch the native rhSave/rhLoad operations and DOES NOT fix the localStorage quota.
Schedule freeze remains disabled. Do not race or clear storage as part of this QA.
