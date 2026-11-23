OTG! MAIN v8.0.430 — COMPLETE ORIGINAL FH5 CLASS CORRECTION
================================================================
BASE: Latest installed user build v8.0.429 (full source ZIP). Preserves v8.0.427 trophies and all other OTG/TET2 UI.

VERIFIED ORIGINAL FH5 PERFORMANCE RATINGS
- 902 OTG cars = 902 stock PI ratings (all catalogue indexes 1..902).
- 901 sourced from the user-supplied KudosPrime complete FH5 car page saved 23 November 2026
  (https://www.kudosprime.com/fh5/carlist.php?range=2000).
- 1 extra car, 1969 Chevrolet Camaro Jordan Luka 3 Forza Edition, A 800,
  sourced independently from Forza Wiki FH5/Forza Edition + Labsgg FH5 data.
- KudosPrime has 903 listed car records. Two do not correspond to OTG entries:
  1969 Chevrolet Camaro Super Sport Coupe Forza Edition (A 800);
  2021 Mercedes-AMG ONE Forza Edition (stock PI blank). Do NOT substitute
  either for the Jordan Luka Camaro or the non-Forza-Edition AMG ONE.
- 28 non-exact entries inspected by variant/correct model; some years or names
  differed in the OTG catalogue and were matched by clear original identity.
- Original stock class counts: D 124, C 125, B 164, A 206, S1 205, S2 78, X 0.
- The Datsun in Evil List Slot 1: Fast & Furious Datsun 240Z 'Fast X': S1 838.
- Badge immediately BEFORE H always shows the original factory class. All 902 covered.
  May be different from installed/current tune PI; app cannot know the applied tune.

CUSTOM UPGRADE CHAMPIONSHIPS
- NEW untouched tournaments: group each car by its DEFAULT/ORIGINAL class.
  No X-class championships because there are no stock X cars in this catalogue.
  Six class championships D,C,B,A,S1,S2 (provided each has >=2 eligible owned cars).
- Already STARTED v8.0.429 tournaments: KEEP EXACT v429 group logic, including
  original 571 stock-class results and provisional groups for other cars.
- Already STARTED v8.0.428 or earlier tournaments: KEEP earlier recommended-class
  group logic, preserving saved Evil List slots, race outcomes, trophies and medals.
- Policy is decided at initial draw, stored in the existing Race Control state;
  neither stock lookup nor new update writes a car's tune, Garage or results.
- Upgrade preference: OPTIONAL, only up to the top PI of each original class:
  D500 / C600 / B700 / A800 / S1 900 / S2 998. Never downgrade.

INSTALL / QA
- Update: v8.0.429 -> v8.0.430. Safety-backup updater unmodified in function.
- All service-worker critical files checked against shipped files; specifically
  keep `tet2-worlds-v8427.js` (there is NO `tet2-worlds-v8430.js`).
- JavaScript syntax, HTML script assets, ZIP, class match and policy tests passed.
- No on-device / phone testing performed. If INSTALL BLOCKED, report full error text.

THREE SACRED LINES:
git add -A
git commit -m "OTG MAIN v8.0.430 Complete FH5 Factory Classes"
git push origin main
