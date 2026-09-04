## v8.0.27
- Wired Custom Groups race flow: frozen balanced draw, sequential groups, Top 2 qualification, group standings/history, and configurable Final.

## v8.0.18 — Safety-gated manifest update certification
- Version-pinned v17 stays active until UPDATE NOW.
- v18 worker is only registered after protected Safety Backup verification succeeds.
- LATER does not install or stage the v18 worker.
- Manual update check reads the same no-cache manifest.

## v8.0.17b
- Corrected the v8.0.16 bridge updater so the waiting update prompt identifies v8.0.17 rather than v8.0.16.
- No changes to Safety Backup gate or activation logic.


## v8.0.16 — Gated waiting service-worker update
- Stops silent service-worker activation from bypassing the Safety Backup gate.
- New app worker installs in WAITING state until UPDATE NOW succeeds.
- UPDATE NOW creates and verifies Safety Backup before SKIP_WAITING.
- Activated worker serves the v8.0.16 app shell and reloads once.
## v8.0.11 — Groups compact navigation/status pills
- Reduced the Total Time Groups visible Back pill to a compact size.
- Matched the Current Car `x OF y` status pill to the Back pill dimensions and kept it on one line.
- No racing logic changed; v8.0.10 live Garage reconciliation retained.

## v8.0.8
- Fixed Total Time Groups final CHAMPIONSHIP COMPLETE action.
- Persists Groups champion and winning Final total for Hall of Fame/Journey.
- Groups completion now exits cleanly back to Festival without re-opening the completed Final.

## v8.0.7 — Festival Groups record notifications
- Restored Championship Record and All-Time OTG! Record notifications for Total Time Groups.
- Reuses the approved existing record celebration screen and artwork.
- Record flow returns to the current Group without exposing hidden cumulative group standings.

# OTG! v8.0.5

- Fixed Total Time Groups result handoff so a saved result advances the active car to the next track.
- Group results now carry active group/stage metadata from the real segmented result-save handler.
- Added safe recovery for v8.0.4 in-progress group results saved without group metadata.
- Group result confirmation shows only the individual track leaderboard; cumulative group standings remain hidden until the group is complete.
- Added a visible Back control to the active Groups overview/result flow without altering the locked draw.
- Preserves v8.0.4 Festival entry selector no-scroll-jump fix.

# OTG! v8.0.6

- Added visible Stage + Group identity to active Total Time Groups screens and completed group reveals.
- Reduced the Groups Back control to the normal compact OTG! navigation size.
- Added the existing OTG! Danger Zone / Abandon Championship flow to active Groups championships.
- Preserves valid completed results, PBs and records when a Groups championship is abandoned.

## v8.0.9 — Festival Groups stage track setup
- After a Groups stage finishes, OTG! now pauses before the next stage/final and asks for a fresh track set.
- Qualified cars remain locked; previous-stage results remain locked.
- Final track setup is separate from Stage 1, with three fresh tracks by default and add/remove support.
- Saved race-name picker is available on the new stage setup screen.

## v8.0.13 — Safety Backup Gate
- Adds verified pre-operation Safety Backup plumbing.
- A risky operation is allowed only after the Safety Backup is persisted and verified.
- Verification failure blocks the operation before it can run.
- Adds Main/developer test controls in Data / Backups for success and forced-failure paths.

## v8.0.14
- Added automatic online OTG! version discovery on app launch.
- Added OTG! UPDATE AVAILABLE modal with Update Now / Later.
- Update Now is blocked unless the protected Safety Backup is created and verified first.
- Manual Check for Latest Update now uses the same no-cache version check.
- Removed the temporary v8.0.13 Safety Gate developer test card after both paths passed.

## v8.0.15
- Update discovery end-to-end test release.
- No feature changes beyond version/service-worker bump required to prove v8.0.14 automatic discovery and gated update flow.


## v8.0.16b — Waiting Worker Doorbell Repair
- Keeps v8.0.15 active while update waits.
- Makes only the update shell critical during service-worker install; legacy optional cache misses can no longer abort the waiting worker.
- Existing v8.0.15 discovery listener can now see the waiting v8.0.16 worker and show the update prompt.

- v8.0.18b: retired legacy automatic updater from active v8.0.18 shell; manifest-led Safety-gated updater is now sole update authority.


- v8.0.18c: update Safety gate rebuilt as a self-contained all-Space localStorage transaction with immediate persisted verification before service-worker registration.

## v8.0.21 — Backup Authority Fix
- Update transaction re-reads persisted backup slots immediately before Safety Backup creation.
- Persisted manual backups are canonical and preserved byte-for-byte.
- Fresh Safety Backup is written only to the protected slot and verified before update registration.

- v8.0.22: Final backup rotation certification build; no feature changes.

## v8.0.24
- Removed truncated qualifier previews from Completed Groups rows.
- Added Back navigation from completed-group standings to history.

## v8.0.26
- Custom Racing racer picker now preserves the currently expanded manufacturer while cars are selected or deselected.
- Multiple cars from the same manufacturer can be selected without reopening its accordion after every tick.

- v8.0.28: Fixed Custom Groups Start/Continue render failure caused by the wrong DOM ID helper.
