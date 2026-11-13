OTG! MAIN v8.0.196 — STRICT SHUFFLE-BAG RELAY ROUTES QA

Install into your EXISTING C:\RaceHub, overwrite matching files; DO NOT delete folders or browser storage.
Git commands:
  git add -A
  git commit -m "OTG MAIN v8.0.196 relay strict shuffle bag QA"
  git push origin main

Changes:
- Strict 38-route shuffle bag for eligible FH5 Street Scene / Road Sprint route previews.
- Each pool of 38 is exhausted before being reshuffled. At bag boundaries, routes already assigned within the active group are skipped until they can be legally used.
- Route selection is deterministic for a locked draw, separately seeded for Manufacturer vs Mixed.
- Group allocations advance sequentially across qualifying rounds; the bag does NOT restart every round.
- Never duplicate a route within a group; avoid identical consecutive three-route sets when an alternative is available.
- 16-team rehearsal uses a correctly sized 4-group opening round to derive later-round route positions.
- Grand Final still fixed at The Marathon / The Goliath / The Colossus.
- Existing times remain untouched. Track selection is a read-only preview, not an official track-ID integration or permanent assignment.
- No changes to Garage, other Spaces, career honours, retired Evil 1.0 or private artwork.

PHONE QA:
1. Open Manufacturer Relay and inspect Group 1 then Group 2 route cards; each group has 3 different eligible routes.
2. Visit multiple groups then return to Group 1; routes must be unchanged.
3. Visit Mixed Relay and confirm independent repeatable selections.
4. In the 16-team rehearsal, check qualifying routes and fixed grand final.
5. Verify existing stage times and all other content remain unchanged.

Known limit: the verified route labels in this legacy preview are not official catalogue stable IDs; route locking into permanent saves is deferred to a separate QA release.
