OTG! Main v8.0.384 — HISTORICAL GARAGE ELIGIBILITY / SOURCE RULE AUDIT
Requires accepted v8.0.383 as installed baseline. OVERLAY ONLY.
Extract into C:\RaceHub, replacing ONLY included files. DO NOT DELETE previous assets.

- On a historical Race Control visit, compare original 2026 R1 eligible count, live current category count, and source-ecosystem-filtered count.
- Exclude only clearly nonmatching Forza Edition, Drift, Rally/Offroad/Truck, and clearly designated racing cars. Keep mixed road/race categories visible for review.
- Source R1 is a historic CURATED ecosystem; matching counts never certify matching car identities. Dedicated road/race track cars can need explicit classification.
- BMW Normal Championship: reference source count 26; with the same 28-BMW reference Garage (26 road / 1 FE / 1 RACE), the new filter should show 28 raw and 26 provisional candidates. No private original R1 car IDs are bundled.
- Existing first-visit v8382 and later-visit v8383 rehearsal ledgers, source stage and schedule remain untouched; no official racing, medals, resets or exports.
- No changes to the CLEAN Evil List interface: reconciliation appears inside Race Control for historical events only.
- The source identity proof / official eligible roster freeze is deliberately NOT implemented yet; private old roster cannot be reliably reconstructed from counts.

PHONE: TET2 > Evil List > BMW Normal Championship > first visit > View in Race Control. Confirm HISTORICAL GARAGE ELIGIBILITY, 28 raw BMW and 26 provisional after ecosystem filter (if Garage unchanged). Expand differences to see why two cars are excluded.

INSTAL:
git add -A
git commit -m "OTG Main v8.0.384 audit historical source eligibility"
git push origin main
