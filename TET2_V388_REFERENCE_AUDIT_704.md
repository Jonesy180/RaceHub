# TET2 v8.0.388 — Source-backed Evil List audit (704-car reference)

**Status:** Candidate schedule structurally consistent; **NOT READY TO LAUNCH**.

This independent audit was run against the 704-car FH5 Garage donor snapshot and the v8.0.387 schedule/source modules. It is *not* a capture of the user's phone Garage at the time of installation. On-device Race Control recalculates against its current FH5 Garage.

## Verified candidate structure

| Family | Preview visits |
| --- | ---: |
| Original 1,128 historical visits + 93 missing bronze-duel visits | 1,221 |
| 75 full-manufacturer Race Offs | 257 |
| Mixed and Manufacturer Relays | 98 |
| 44 Swiss Cups x 8 | 352 |
| Lonely Hearts | 9 |
| Unified all-car Gauntlet | 88 |
| 44 Aeródromo Drag + Long Jump batches | 44 |
| Festival Top 3 and Drift Championship | 2 |
| **Candidate preview** | **2,071** |

- **340 distinct competition IDs**; no duplicate `(competition ID, visit)` entries.
- **11 opening formats** each appear once in the randomised opening, all at their first competition visit.
- The source-backed historical programme includes all **214 competitions**, all 1,128 donor stage references and 93 necessary extra bronze duels.
- Race Off, Swiss Cup and Lonely Hearts bronze duels precede finals within their competition chains.
- All 44 Swiss Cups each reserve 16 places, covering 704 cars **by capacity**; actual one-car-one-Cup participation must still be verified in frozen draws.
- Original protected source late stages remain at the end of the candidate core.
- Qualifier source flags: **44** prospective Second Chance sources (43 makers with >=4 cars plus Lonely Hearts) and **75** full-manufacturer finalist sources for Champion of Champions.
- No unconditional Second Chance or Champion of Champions event was fabricated.
- Repeated compilation is deterministic at this Garage snapshot. Four independently corrupted schedule cases were detected and stopped. A 703-car case correctly leaves the final Swiss Cup's eight stage visits pending.

## Launch is still blocked

1. **No frozen racing route IDs:** 2,071/2,071 candidate visits lack a specific official course identifier. The established track selector/route library must supply real course assignments before racing.
2. **Unfinished historic entrant audit:** source class/member rules are interpreted, but historical full roster identities are not independently confirmed for all competitions. Donor manufacturer aliases include `Mini`/`MINI` and `Subaru`/`SUBARU`.
3. **Official completion pipeline incomplete:** saving a practice result is not an official confirmed result. The official locked-slot / records / medal receipt publisher, idempotency, and recovery need full integration tests.
4. **Dependent finals conditional:** Second Chance and Champion of Champions remain unscheduled and locked pending real qualifying source results and completion dependencies.
5. **Specialist routes/rules need final checks:** Festival Top 3, the 22-car Drift Championship and remaining historic stage adapters need real course IDs and final eligibility/result rule checks.

**Important:** The candidate slots are *preview positions*, not approved fixed slot numbers. The 2,071 count excludes future conditional finals. Official TET2 activation remains intentionally disabled. No Garage, original OTG! data, rehearsal results, achievements, or records were modified.
