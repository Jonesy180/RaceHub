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
