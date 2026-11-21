OTG! MAIN v8.0.405 — RACE ENTRY BADGES + SINGLE LOCATION BUTTON

Targeted gameplay/UI update on phone-passed v8.0.404. No changes to tournament schedule, draw, shuffle bags, racing times or saved results.

1. ONE LOCATION per round on Race Control and Results Entry. Every match in a shared-track round no longer repeats the button. Other multi-course formats retain their one-location-per-distinct-track view.
2. Native-style H and E✓ mini-badges appear beside ALL entrant cars in Results Entry. H opens the original OTG! Car History using its original car ID, and highlights where recorded history is available. E✓ is grey until an actual saved Evil racing result; saved original OTG! Evil and TET2 official results are recognised; mere selection/draw is never counted as a recorded race.
3. Update manifest, pinned bootstrap, service worker and index navigation references are version-consistent. Normal OTG! and Garage unchanged.

Installation: Overlay this ZIP on C:\RaceHub and keep older versioned files. git add -A; git commit -m "OTG 8.0.405 restore H and E badges and one location per round"; git push origin main. Reopen on phone.

Phone check: in Slot 001, Race Control has one LOCATION button by Wetland Charge, not one per match. Open results entry; one LOCATION button at the top, H and E✓ for every car. Tap H on a car to open original Car History, then return. E✓ remains grey for a car with no prior saved Evil race. Existing fake results (if any) are not cleared.
