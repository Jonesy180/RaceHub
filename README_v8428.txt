OTG! MAIN v8.0.428 — FIVE CHECKED STOCK-CLASS BADGES (SAFE PARTIAL FIX)
=======================================================================
Based on full v8.0.427 CURRENT TROPHY ON RACE CONTROL source (not v426).

Corrections on Evil List entry badge BEFORE H:
184 — 2018 DeBerti Ford Mustang GT: verified S1 824
189 — 2022 Dodge Challenger SRT Super Stock: verified S1 802
223 — 2022 Fast & Furious Dodge Charger SRT Hellcat Redeye: verified S1 (PI not recorded)
225 — 1973 Fast & Furious Datsun 240Z 'Fast X': verified S1 838
226 — 1970 Fast & Furious Dodge Charger 'Fast X': verified S1 (PI not recorded)

For the other 897 cars, existing class recommendations remain but display a small '?'
to clearly flag they are NOT verified original FH5 stock classifications.
Tapping/long-pressing may show explanatory badge tooltip depending on phone browser.

IMPORTANT: This is a BADGE-ONLY, read-only change. It deliberately does NOT
repartition Custom Upgrade Championships or change saved draws, slots, Garage,
results, medals or championship membership. The latter requires broader checked
stock data to avoid silently changing a live tournament.

Copy all package files to your GitHub repo directory, replacing matching files,
then run:
git add -A
git commit -m "OTG MAIN v8.0.428 Verified stock class badges (safe partial fix)"
git push origin main

Phone check: Slot 1 Datsun Fast X badge before H should display S1 (without ?).
Other unverified cars display their original recommended tier with a tiny ?.
Keep current data backed up before deploying.
