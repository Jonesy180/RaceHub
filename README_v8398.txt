OTG! Main v8.0.398 — expanded official racing formats; STRICTLY NOT a completed tournament.
OVERLAY INSTALL: extract over existing C:\RaceHub; DO NOT delete older versioned assets.

Live official draw, result banking and supported medal receipts now include:
 - Lonely Hearts and eligible full-manufacturer knockout stages, carried from v8.0.397.
 - Swiss Cups: 16 unique cars, four 8-match rounds ranked by wins, opponent wins, total time; top-eight elimination; mandatory bronze duel before final. Each later pairing requires authenticated completed earlier stages.
 - Festival Top 3: 3 real FH5 Garage entrants, one canonical FH5 route; 3 timed runs and podium.
 - Unified All-Car Gauntlet: disjoint 2-8 car batches, three canonical FH5 routes/car, aggregate times, medal receipt only after whole event.
 - Car medals for 1st/2nd/3rd; manufacturer gold for winning manufacturer only, not for maker-only contests. Already saved honours records retain same storage schema.

Rules enforced: immutable official completed slots, cannot overwrite recorded time, fails on contested ties, cannot invent track or car, no OTG native racing write. All new stages use the existing isolated official TET2 slot ledger and actual native result-entry UI.

NOT SUPPORTED: Relay, Aerodromo double header (distance input), numerous historically sourced competition families, some final battles. The 2,071-visit programme is not end-to-end runnable. Do not start your actual tournament on this build; this is for validating next-slot capabilities only.

Validation: JavaScript parse, official standings and Swiss progression synthetic tests, original honours publisher rule tests, current-version SW/HTML asset checks; PHONE QA NOT DONE.
