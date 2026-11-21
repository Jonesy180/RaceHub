OTG! MAIN v8.0.408 — CLEAN SEVEN-SEGMENT TIME DISPLAY

Small targeted visual fix to v8.0.407:
- Inactive middle bars are fully hidden, so zeros are legible rather than appearing as all-eights.
- Empty MM / SS / mmm placeholders remain dim even when the field receives focus.
- Font sized to fit inside the car tile without clipping on compact phones.
- Existing numeric typing, auto-advance, bank/save, duration calculations, H/E badges,
  location clues, tracks, round progression and Mark as Done unchanged.
- The same timed UI is retained for Race Off, Relay, Gauntlet and Drag.

Install as OVERLAY into C:\RaceHub, replacing matching files; keep older assets.
Phone: TET2 > Race Control > Slot 001 > Enter Race Results.
Check empty 00:00.000 is readable with no fake 8-bars. Enter e.g. 03:36.784
and 03:39.215, then save both to test the existing banking workflow.
