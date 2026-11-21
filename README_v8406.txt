OTG! MAIN v8.0.406 - TET2 E✓ display correction ONLY

1. E✓ visually centred in a dedicated fixed-size badge, overriding the original v8.0.360 CSS that incorrectly forced lime green.
2. With no SAVED results in the new TET2 official slot ledger, E✓ is GREY, including when the car has earlier OTG! racing history. Draws and preview entrants cannot colour it.
3. After results are banked, E✓ uses the LAST slot in the TET2 Evil List in which that car has a recorded race: cyan Road/Street, orange Dirt/Rally, green Cross Country, purple Drift; unknown categories stay neutral. This is read-only; no results or progress are changed.
4. H remains original OTG! Car History. No draw, track, Location, Mark as Done or scheduled-event modifications.

Overlay into C:\RaceHub, retain old assets. Push with git add -A; git commit -m "OTG v8.0.406 centre TET2 E badges and track latest event colour"; git push origin main.

Phone check: Slot 001 results entry, all E✓ neutral grey and centred. First saved race should light up the two cars with cyan for the current road/street event; any previously saved older OTG! Evil race does NOT activate a new TET2 badge.
