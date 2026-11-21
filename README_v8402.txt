OTG! MAIN v8.0.402 — TET2 RACE CONTROL SOURCE DEPENDENCY FIX

Cause of phone screenshot: v8.0.400 cleanup removed the loader for
js/tet2-competition-audit-v8367.js, even though the real timetable workload
engine v8368 still calls TET2CompetitionAudit367.compile().
The schedule and Race Control therefore could not load at all.

Fix: restore the original approved source-audit engine as an INVISIBLE
DEPENDENCY, load it before workloads, and ship all critical TET2 timetable
and historical-source modules as tangible package files. No diagnostic panel
or practice/rehearsal interface is restored. All current racing logic and
the approved Evil List remain in place without data or progression changes.

Install: unzip over C:\RaceHub, replace matching files, do not delete old assets.
Commit and push the update normally. On the phone, verify Race Control shows
'SLOT 1 — Lonely Hearts Cup' and the lock/start controls. Do not clear storage.

Automated validation: package file references, service worker critical file
existence, JS syntax, exact script dependency order, and 12-event fixture.
