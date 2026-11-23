OTG! MAIN v8.0.431 — FRESH EVIL TOURNAMENT + CAR-FIRST ENTRY
==========================================================
BASE: v8.0.430 full factory-class source (also includes all v8.0.427 trophies).
INSTALL OVER: v8.0.429 (v8.0.430 does NOT need installing first).

FRESH TET2 ONLY
- In TET2 Command Centre, a one-time "FRESH EVIL TOURNAMENT · SLOT 001" panel
  appears while a previous tournament is saved.
- Step 1: download the COMPLETE native OTG! JSON backup and CHECK Downloads.
- Step 2: choose START AGAIN; approve explicit confirmation and type START TET2.
- ONLY removes active FH5 Space's TET2: Race Control, Official Slot Ledger,
  TET2 Honours; plus the separate TET2-only course lock.
- Leaves Garage ownership, other Spaces, OTG racing, OTG history, settings,
  native/manual/safety backups and all non-TET2 data untouched.
- Upon reset: a new Slot 001 is generated from CURRENT FH5 Garage with original
  stock-class groupings (D/C/B/A/S1/S2). Old entered times/medals/draws erased.
- No automatic reset on installation. The older v8.0.421 12-test-slot reset
  is NO LONGER used; it cannot reset real slots.

RESULT ENTRY — USER'S REQUEST
- Timed group / Gauntlet 3-track events now CAR FIRST: Car 1 races all three
  tracks (save each), then Car 2 completes all three, and so forth.
- Relay changes to TEAM FIRST: team 1 all three legs, then team 2; each Relay
  leg still uses its assigned different car.
- Aerodromo Drag -> Jump already CAR FIRST and is unchanged.
- Race Off matches and single-track events are unchanged.
- Persisted ledger result keys, medals and scoring are UNCHANGED; resumable
  started slots show the first unfinished car/team and track.
- Original FH5 stock-class badges still display the verified 902-car class.
  TAPPING the badge shows exact stock PI, class maximum and potential headroom;
  the app cannot know the user's installed/current tune.

QA
- Source: v8.0.430. All 902 factory classes retained, incl. Datsun 240Z S1 838.
- Worker CRITICAL paths verified as in-package; no invented world script.
- Run node syntax and event-entry simulations; package integrity checks.
- Not phone tested. If INSTALL BLOCKED, report full message.

SACRED THREE GIT LINES (after extracting into repo):
git add -A
git commit -m "OTG MAIN v8.0.431 Fresh TET2 Car First Results"
git push origin main
