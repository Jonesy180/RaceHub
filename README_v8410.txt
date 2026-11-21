OTG! MAIN v8.0.410 — NEON CURRENT CARD + NEXT RESULT NAVIGATION

This replaces the pending v8.0.409 update, which the user has not installed.
The full v8.0.409 status-colour changes are INCLUDED:
  * Red = completed; green = current; cyan = upcoming.
  * Mobile layout: separate event title and description cards.
And adds:
  * Bright green full border/glow on the current Evil List event.
  * After successful BANK BOTH TIMES / SAVE, scroll the next unbanked
    result entry near the top of the phone screen.
  * After banking the final result, scroll to NEXT LEG / NEXT TRACK or
    MARK AS DONE. Do not auto-open a keyboard or auto-complete a slot.
  * No scrolling to next result on invalid times or failed saves.

All original result engine files from v8.0.408 and official banking logic
are retained. No event definitions, draws, Garage, tracks, medals, result
state, or Mark as Done rules have been changed.

INSTALL: Extract into C:\RaceHub; replace matching files; keep legacy
assets. You do NOT need to install v8.0.409 first. Push using Git.

PHONE: confirm Slot 0001 DONE red, Slot 0002 CURRENT in glowing green
full border, Slot 0003 CYAN. During Slot 0002 save a result and check
that the next unsaved result moves near the top, while the keyboard
stays closed. All fake result data stays untouched.
