OTG! MAIN v8.0.271 — PRIVATE BACKUP KEY FIX — PHONE QA PENDING

Cumulative overlay. Overwrite matching project files; do not delete other files.
Fixes lowercase v in RaceHub_Studio_Final_v5_6 lookup for diagnostics and exact private backup export.
Does not migrate or modify localStorage. Does not freeze schedule or reset racing data.
QA: open Evil Tournament > Prelaunch QA Controls > Check Storage (read only). Confirm main-state size about 6.69 MiB, then Export Exact Saved State and verify file exists. KEEP THIS FILE PRIVATE, OFF GITHUB.
Do not retry freeze until backup confirmed and storage architecture is safely fixed.
