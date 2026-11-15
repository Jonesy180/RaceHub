OTG! MAIN v8.0.264 — DASHBOARD EVIL LIST / PERFORMANCE FIX
Cumulative overlay over the same v8.0.263 and earlier overlays; do NOT remove other project files or clear phone data.

Fixes: existing dashboard EVIL TOURNAMENT tile opens the Evil List 2.0 (no replacement of tile artwork or position). Festival's v263 temporary Evil List entry no longer created. Back goes to Dashboard. The stage snapshot is calculated only once per opening, deferred until after browser paints loading message. Filtering and pagination reuse cached 2,225 rows, with debounced search. There is still one full snapshot validation on opening; phone test needed to verify the initial pause is acceptable.

QA: Open dashboard tile; inspect next stage (expected #3 Abarth Festival) and 2,225 stage count, 6 verified, 0 holds. Search Abarth, then #2225; paginate, filter, Back. Verify Festival has no new duplicate v263 list tile. Other prelaunch QA controls remain; NO launch reset. If a loading pause persists, stop and report; no data reset.

VS Code terminal after extracting all files into the existing C:\RaceHub folder:
git add .
git commit -m "OTG MAIN v8.0.264 Dashboard Evil List performance fix"
git push
