## 8.0.69 — FH5 Festival RANDOMISE ALL
- Added RANDOMISE ALL above the current FH5 Festival race programme.
- Rolls every editable race slot in the current setup/stage in one hit using the same category-safe pools as the individual picker.
- Batch rolls avoid duplicates inside the generated set and continue to deprioritise tracks used recently.
- Individual RANDOM TRACK / REROLL TRACK controls remain available after the batch roll.
- Groups later-stage setup is supported; single-option finales remain locked and multi-option finale pools remain protected.
- Drag keeps its assigned-strip logic and fixed/special programmes remain untouched.
- No rh-guide changes.

## 8.0.68 — FH5 Festival track randomiser
- Added a one-at-a-time RANDOM TRACK button to each editable FH5 Festival race slot.
- Event race category automatically selects the eligible pool: Road/Street, Off-road, Rally Adventure, Hot Wheels or Mixed.
- Random picks avoid duplicates inside the current race set and prefer tracks not used in recent Festival runs.
- Groups later-stage setup is supported too. In the Final, the last slot uses the protected finale pool; single-finale categories stay locked.
- Drag keeps its existing assigned-strip logic and fixed/special programmes remain untouched.
- Existing suggested programmes remain available and editable; randomising is optional.
- No rh-guide changes.

## 8.0.67 — FH5 track taxonomy foundation
- Added explicit FH5 Festival race categories without changing any existing race setup.
- Added canonical Road/Street, Off-road (Dirt + Cross Country), Rally Adventure, Hot Wheels and Drag track pools.
- Added finale pools: Road (Goliath / Colossus / Marathon), Off-road (Titan / Gauntlet), Rally Adventure (Horizon Badlands Goliath), Hot Wheels (Hot Wheels Goliath). The Gauntlet is tagged as an optional future Road finale wildcard.
- Added setup-screen category/coverage badge for QA.
- No random track picker yet; this build is the category foundation only.
- rh-guide unchanged.

## 8.0.66 — Live QA fixes
- Car History: guaranteed visible Back control.
- Reset Racing Data: now clears Race Off data, fixing surviving Hall of Fame/record entries after reset.
- Festival: guarded Championship opener prevents a malformed saved run becoming an untappable card; data-preserving recovery screen added.
- No FH5 rules/catalogue changes; rh-guide remains frozen at v8.0.17 PASS.

## v8.0.62 — Consolidated Reliability + Lonely Hearts
- Repaired the update delivery chain so the v8.0.61 → v8.0.62 transition is gated by the UPDATE AVAILABLE / Safety Backup flow instead of silently advancing when new page files arrive first. `version.json`, `update-manifest.json`, the bootstrap and service worker are aligned to v8.0.62.
- Safety Backups now protect the complete current Space payload, including active Race Offs, Race Setups and other Space data that the older snapshot omitted. A recent incomplete Safety Backup can be repaired on first v8.0.62 load.
- Restored the Danger Zone / Abandon action to Festival Swiss and Custom Racing Swiss, including Swiss knockout continuation screens. Existing completed results, PBs and records keep their Abandoned provenance.
- Fixed Championship cards containing apostrophes or other special characters, including `Pickups & 4x4's Championship`, by replacing the fragile inline setup handler with a safe delegated handler.
- Repairs duplicate Hennessey manufacturer variants in live Space data to one canonical Hennessey manufacturer without changing backups or the protected catalogue.
- Added LONELY HEARTS to Festival and Race Off. Eligibility is exactly one owned car per manufacturer, evaluated live before a new run and frozen when the run starts. Festival uses the normal Standard / Groups / Swiss entrant thresholds; Race Off uses knockout.
- Completed Race Off champions now appear in Hall of Fame with the Race Off presentation and aggregate winning time. Existing Festival Hall of Fame entries are unchanged.
- Race Off landing now lists every active/in-progress tournament with its own Continue action, so parked tournaments can be interleaved and resumed safely.
- Main only; rh-guide remains v8.0.17 and is untouched.

## v8.0.61 — Result Summary + Record Celebration Reliability
- Fixed the Result Summary regression that mixed times from different rounds/courses into the displayed average.
- Average comparison is now scoped to the current Championship/Event and the current round/course only, with matching count/copy.
- Fixed the intermittent top-right record-celebration artifact by strengthening the shared mask that hides the baked-in All-Time rosette/text when no All-Time record was earned.
- The record visual fix is shared by Festival, Custom Racing and Race Off record screens.
- Record calculations, FH5 setup/programme logic, progression, Garage/catalogue data and backups are unchanged.
- Main only; rh-guide remains untouched.

## v8.0.59 — Swiss Full Programme Preview
- Festival Swiss setup now shows the complete suggested programme before START, matching the Groups preview model.
- The card shows the configured Swiss-stage tracks followed by the selected knockout path (Round of 16 / Quarter-Final / Semi-Final as applicable) and Final.
- Preview suggestions use the same v8.0.58 live knockout-track logic, including diversified Goliath / Colossus / Marathon and specialist finales.
- Changing the Swiss knockout cut or editing configured Swiss tracks refreshes the preview.
- Live knockout suggestions remain editable when each round is reached; Standard and Groups behaviour is unchanged.
- Main only. Locked artwork unchanged.

## v8.0.56 — FH5 Festival / Race Off Rebuild
- FH5 Championship presets now load suggested format and rounds automatically from the final multi-tab race-setups library.
- Existing Festival families retained: All Cars, Favourite Manufacturer, Vintage & Classic, Era, Class / Type and Manufacturer.
- Added Rally Adventure, Hot Wheels and Drag Racing specialist Championship and Race Off families.
- Recommended format: 2–16 Standard, 17–64 Groups, 65+ Swiss; users may edit recommended setups before start.
- All Cars Festival is fixed to Standard / 1 round / Copper Canyon Sprint and retains the late-car exception.
- Race Off pre-fills a suggested track each knockout round and reserves matching long-form finals where applicable.
- Main only. Locked artwork unchanged.

## v8.0.55 — Foundation Fixes
- Result Summary average comparison is now scoped to the current round/course inside the current Championship/Event; mixed-course Championship averages are no longer shown on Result Summary.
- Swiss remains available for every field of 8+ entrants with no entrant ceiling.
- Swiss now recommends 3 rounds for 8–64 entrants and 4 rounds for 65+ entrants. Custom Racing exposes an Advanced/Custom rounds override for longer Swiss stages with no configured-round ceiling.
- Removed the obsolete 4–8 configured-round validator from Custom Racing Swiss and Festival Swiss, including START gating.
- Final Standings total-time logic is unchanged. No artwork, catalogue or user-data migration changes.

## v8.0.54 — Custom Swiss Final Trophy
- Custom Racing Swiss now routes its completed knockout final to the existing locked Final Standings/trophy presentation.
- Final screen shows both finalists, the Swiss champion and the actual final winning time, then returns to Custom Racing.
- No artwork, catalogue, backup or user-data changes.


## v8.0.53 — Scalable Swiss Entrants
- Removed the old 32-entrant Swiss ceiling. Swiss now accepts any field of 8 or more entrants in Custom Racing and Festival championships.
- Retains the existing 4–8 Swiss round planner, Wins → Opponent Wins → Total Time standings, rotating byes, rematch avoidance and Top 4/8/16 knockout cuts.
- No user-data migration or reset.
## v8.0.52
- Festival Swiss completion now uses the locked final-standings/trophy screen, with the Swiss champion and Final winning time.
- Standard Championship Result Summary now ranks cars by the just-completed Round and shows ROUND TIME/GAP instead of cumulative Championship totals.
- Retains all v8.0.51 setup, Swiss, Smart Bar, Hall of Fame and loader fixes.

## v8.0.51
- Saved Race Setups display A–Z; Load Race Setup rows keep a fixed aligned chevron column.
- Fixed the Round 2+ Smart Bar ghost-tap path: suggestions now commit on click instead of pointer-down, so a re-render cannot tap the Saved Race Names button underneath; the picker touch/scroll path is also hardened.
- Added Swiss to Festival Championship format options (8–32 entrants), reusing the tested Swiss standings/pairing rules and flowing into a knockout finish.
- Standard Championship final standings now include each car's per-round/event split times alongside Total Time and Gap.
- Repaired Hall of Fame Back so Records mode and visible screen state change together.
- Main only; no artwork changes and no data migration/reset.


## v8.0.50
- Repaired update manifest/service-worker pinning so installed builds actually advance from v8.0.48.
- Compact Saved Race Setup cards: no track list; setup name limited to two lines; round count/Edit/Delete retained.
## v8.0.49 — Compact Saved Race Setups
- Removed track-name lists from Saved Setup cards.
- Setup name is limited to two lines; round count and Edit/Delete remain compact alongside it.

## v8.0.42
- Custom Swiss race flow carried forward from v8.0.41.
- Fixed update discovery by bumping update-manifest, worker, bootstrap, updater and visible version together.

## v8.0.41 — Custom Swiss Planner Foundation
- Adds Swiss as a Custom Racing format.
- 8–32 entrant guardrail, selectable Swiss rounds and knockout cut.
- Locks pairing rules, standings tie-breaks and round-by-round track selection for race-flow wiring.

## v8.0.39 — App-wide Smart Bar
- Enforces the compact one-best-match Smart Bar above every genuine text-entry field. Numeric/result fields remain excluded.

## v8.0.38 — Custom Knockout Records/PB Wiring
- Custom Knockout single-run results now feed Track Records and Car PB history.
- New Championship/All-Time bests use the current approved OTG! record screen.
- Existing knockout bracket, prelim/byes and match progression logic is unchanged.

## v8.0.37 — Custom Knockout compact match rows
- Reduced car-name, time, status and match-number sizing.
- Tightened vertical spacing while preserving the v8.0.36 readable match-row hierarchy.
- No knockout maths or progression changes.

## v8.0.36 — Custom Knockout match-row polish
- Reworked live Knockout MATCHES rows into separate car/time lines with anchored status and a dedicated winner line.
- No knockout progression or result logic changed.

## v8.0.34 — Custom Knockout Planner Foundation
- Added KNOCKOUT to Custom Racing competition formats.
- OTG! calculates a clean elimination bracket from the selected entrant count.
- Odd fields show preliminary matches and straight-through places automatically.
- Custom KO is capped at 64 entrants for the planner foundation.
- START remains deliberately disabled until the proven Race Off engine is wired into Custom.

## v8.0.33 — Custom Groups Final Exit / Archive Fix
- Fixed RETURN TO CUSTOM RACING on the completed Custom Groups Final screen.
- Completed Custom Groups events now return to the refreshed Custom Racing list, where they remain completed rather than In Progress.

## v8.0.30
- Custom Groups single-run results now feed Track Records and Car PB history.
- Event/All-Time record celebrations now appear when an existing best is beaten.

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

## v8.0.29
- Custom Groups result entry now uses the approved segmented digital OTG! screen.
- Advanced Timing decoration is available on Custom Groups result entry.
- Fixed live Custom Groups Back navigation to return to Custom Racing.

- v8.0.31 — Corrected Custom Groups Records build packaging/version chain; carries v8.0.30 Records/PB wiring.

## v8.0.32
- Custom Groups record celebrations now use the current OTG! record screen and current record hero.
- Removed the legacy Custom Groups clipboard/Hubs record route.
- Hubs character artwork is blocked from active app rendering; Hubs remains website-only.

## v8.0.35
- Custom Knockout race flow: frozen bracket, preliminary round, straight-through cars, round-by-round track setup, head-to-head results and champion completion.

## v8.0.43
- Custom Swiss BYE display now reads AUTOMATIC WIN instead of +1 W. Swiss scoring and pairing logic unchanged.

- v8.0.44 — Custom Swiss BYE card layout polished: AUTOMATIC WIN now displays on its own line above the car name. Swiss logic unchanged.

## v8.0.57 — FH5 Groups Full Programme
- FH5 Groups presets now continue automatically from Preliminary through any required Stage 2 to the Final.
- Stage 2 uses three fresh discipline-appropriate suggested tracks wherever possible.
- Finals use three suggested races and end on the appropriate showcase finale: Goliath, Gauntlet, Titan, Horizon Badlands Goliath, Hot Wheels Goliath, or Aerodromo Drag Strip.
- Later-stage suggestions remain editable and never overwrite a manually edited pending stage setup.
- Existing active v8.0.56 FH5 Groups runs can receive the new continuation suggestions without restarting.
- The five unverified Cross Country names identified by Race Finder Mk II are excluded from newly generated later-stage fallback suggestions pending in-game verification.
- Specialist Festival/Race Off helper text phone layout polished.
- Record-celebration right-rosette issue remains watch-only; no static layout change.
- Main only; no artwork changes.
## v8.0.58 — FH5 diversified finals + Swiss full programme
- Mexico showcase finals now select Goliath, Colossus or Marathon by event/profile rather than defaulting all road-ish events to Goliath.
- Groups final suggestions use the diversified showcase map while preserving manual edits and active v8.0.57 runs.
- Festival Swiss knockout rounds now auto-suggest editable FH5 tracks through Top 16 / Top 8 / Top 4 brackets and the Final.
- Race Off final pairing uses the same diversified showcase map.
- No artwork changes; record-rosette issue remains watch-only.


## v8.0.59 — FH5 Swiss Full Programme Preview
- Festival Swiss setup now shows its complete configured Swiss stage and selected knockout route through the Final before START.
- Preview uses the same live v8.0.58 knockout track suggestions and remains editable at each live stage.

## v8.0.60 — FH5 Staged Programme Previews
- Race Off first-round setup now shows a FULL RACE OFF PROGRAMME before the first draw starts.
- Route is calculated from the actual locked entrant count, including Preliminary Round when required and every knockout stage through the Final.
- Race Off preview uses the same live round track rotation and diversified Final logic already used during the tournament.
- Swiss full-programme preview from v8.0.59 retained unchanged.
- No bracket, draw, result, record, Standard, or Groups logic changes. Main only; locked artwork unchanged.

## v8.0.63 — Live QA polish
- Festival Lonely Hearts intro now matches the clean Race Off presentation and no longer crushes explanatory copy on phones.
- Canonicalises the misspelled `Hennessy` manufacturer into `Hennessey`, merging the two live manufacturer cards without losing cars/progress.
- Guards Race Off catalogue ordering so Festival remains before Favourite Manufacturer.
- Main only; cumulative over v8.0.62. No reset required.

## v8.0.64 — Race Off in-progress cards
- Replaced the temporary top-level **CONTINUE RACE OFF** bucket with Festival-style in-place status cards.
- Active/setup Race Offs now remain in their natural Festival / Favourite / Vintage / Era / Class-Type / Manufacturer / specialist sections.
- Each active card shows **IN PROGRESS** plus its current bracket/setup status and resumes that exact tournament.
- Multiple active tournaments remain independently resumable, including duplicate active runs from one catalogue category.

## v8.0.65 — History, Pickups normalisation & Drag redesign
- Canonicalised FH5 `Pickups & 4x4`, merging apostrophe/plural aliases in live data and source catalogue/programme tables.
- Replaced the long Race Off History block with dedicated History screens reached from compact hero tiles on both Festival and Race Off.
- History cards include completion date, entrants, champion/winner and timing metadata, with tap-through to the completed run/tournament.
- Race Off top ordering now mirrors Festival: OTG! / Favourite / Lonely Hearts before the rest of the catalogue.
- Removed Drag specialist events from Race Off.
- Festival Drag is now a one-round, one-run-per-car shootout; fastest overall time wins.
- Drag strip assignment is performance-aware: Teotihuacan (slow), Festival (middle), Aerodromo (fast).
- Zero-result prepared/active legacy Drag Championships are migrated in place; runs with existing results are not rewritten.

- v8.0.65 R2: hardened the update Safety Backup gate for large Spaces using verified IndexedDB-backed snapshots; added an in-place v8.0.64 updater hotfix path and delayed v8.0.65 data migrations until update acceptance.
