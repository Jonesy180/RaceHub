OTG! MAIN v8.0.419 — SAMSUNG LONG JUMP KEYBOARD VISIBILITY FIX

ONLY UI / SCROLLING CHANGES — NO RESET, NO DRAW, NO RESULT ENGINE CHANGES.

- Aeródromo Slot 010 still completes each car's DRAG then LONG JUMP before showing the next car.
- The long explanatory block and venues now appear AFTER the active car instead of above it.
- Once Drag is saved, the Jump input appears at the top of that car card; the saved Drag summary is underneath.
- On Samsung/Android, tapping the Jump distance aligns the TET2 scrolling area to the available keyboard viewport and moves the Jump field above the keyboard.
- Existing and partially saved Drag and Jump results are untouched. 0.00 m is still a valid recorded failed jump.

INSTALL: extract overlay into C:\RaceHub; replace matching files but do NOT delete older versioned files or browser data.
Run: git add -A && git commit -m "OTG v8.0.419 keep Aerodromo jump input visible above keyboard" && git push origin main

PHONE CHECK: resume Slot 010; on any car after its Drag is saved, tap Long Jump distance and ensure you can see what you are typing with the Samsung number keyboard open; save Jump; verify next car displays. Keep Slots 001–009 unchanged.
