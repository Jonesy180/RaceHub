OTG! MAIN v8.0.432 — STOCK PI PANEL + COMPACT CLASS BADGES
=========================================================
BASE: v8.0.431 working build. Includes full FH5 factory class mappings
(v430), TET2-only fresh-start and car-first racing (v431).

WHAT CHANGED
- Tapping a factory class badge now opens a purpose-designed TET2
  Garage Intelligence panel rather than the dull browser alert.
- Panel shows factory class, factory PI, class ceiling, remaining PI room
  and visual class-band progress. Never claims to read the fitted tune.
- Class badge is fixed at 30 x 30 CSS pixels, matching H height and
  width. E-tick stays 34 x 30. No extra car photo or layout elements.
- Panel closes via X, GOT IT, backdrop or Escape; accessible focus loop.
- Only UI files changed: new results-entry JS and one additive CSS.
- Slot drawings, event bank keys, results, honours, storage, ownership,
  all 902 PI mappings, car-first flow and fresh reset unchanged.
- No reset on installation; no saved data deliberately changed.

PACKAGE / INSTALL
- Update to v8.0.432 directly from v8.0.431, with the normal safety gate.
- All required service-worker files are shipped; old versioned files
  remain for compatibility/rollback. Not tested on actual phone.

SACRED THREE LINES (after extracting into GitHub repo):
git add -A
git commit -m "OTG MAIN v8.0.432 Stock PI Panel and Compact Badges"
git push origin main
