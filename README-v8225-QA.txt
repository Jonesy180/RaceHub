OTG! MAIN v8.0.225 — REAL RACE OFF QUALIFICATION SOURCE QA
SMALL, DATA-SAFE OVERLAY ON PHONE-PASSED v8.0.224. NO CAREER RESET.

WHAT CHANGED:
- Adds a compact read-only RACE OFF SOURCE CHECK within Festival > Second Chance
  Cups > Qualifier Inbox. Reports count of finished and unfinished Race Offs.
- A finished Race Off with a champion and completed knockout round can supply
  ONE qualifying ticket to the isolated Second Chance QA system, AFTER user
  confirms whether the lowest bronze medal was 3rd or 4th (existing source
  selection/claim). A source already claimed cannot contribute twice.
- Bronze through 4th: use fastest of four QUARTERFINAL losers for 5th.
- Bronze through 3rd: compare both SEMIFINAL losers on one shared circuit;
  faster loser is 3rd (bronze), slower loser is 4th (Second Chance).
- Validation now checks BOTH cars in every relevant knockout match raced on
  the SAME circuit AND layout, that each has one valid time, that the winner
  and loser belong to their matchup, and no car appears twice in the round.
- If times tie, a match is missing, status unfinished, or tracks/layouts differ,
  the ticket is BLOCKED rather than guessed.
- CHECK EXAMPLE RACE OFF is a READ-ONLY fixture using 8 owned FH5 cars and
  realistic saved-match record schema; shows both possible medal-cutoff outcomes.
  It does NOT create a ticket or modify a Race Off.
- No background import, race history changes, automatic awards, or official
  medals. This remains staged QA until mechanics and Evil 2.0 are approved.
- All Second Chance Cup 1/2, Ultimate and previous demo QA results survive,
  using the SAME isolated localStorage key, with no data migration.
- Existing navigation/update-loop repair is preserved.

INSTALL: Extract to C:\RaceHub, overwrite matching names, DO NOT DELETE old files.

THREE VS CODE TERMINAL LINES:
git add .
git commit -m "OTG v8.0.225 Race Off Source Qualification QA"
git push

PHONE QA:
1. Open Festival > Second Chance Cups > Qualifier Inbox.
2. Expand RACE OFF SOURCE CHECK. It must show honest finished/unfinished counts
   (if no Race Off is finished yet, 0 finished is CORRECT).
3. Press CHECK EXAMPLE RACE OFF (READ-ONLY). It must show two different
   eligible cars: one for bronze-through-3rd, one for bronze-through-4th.
4. Verify Cups 1 and 2, Ultimate QA champion and times remain intact.
5. If you ALREADY have a truly completed Race Off: select it, confirm bronze
   cutoff, verify candidate, and claim ONE QA ticket; a repeat claim is blocked.
6. Reload. No official medals or real Race Off results must change.

NEXT: Finish source adapters for specialist races/major championships, official
medals, schedule; do NOT perform the Evil 2.0 reset yet.
