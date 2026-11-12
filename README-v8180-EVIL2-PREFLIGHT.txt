OTG! MAIN v8.0.180 — EVIL 2.0 READ-ONLY PREFLIGHT (QA)

NOT the redesigned tournament and NOT a reset. No existing Evil slot, medal, track-bag, car, race record, E badge, family incident, or other data is edited.

What it does:
- New EVIL 2.0 — SAFE PREVIEW button directly beneath the Current Event panel on Evil Tournament home.
- Audits your actual CURRENT FH5 Garage (not the old 697-car campaign snapshot).
- Read-only random sample of manufacturer relay teams: all makes with >=3 cars, random 3 owned cars per team.
- Read-only mixed relay teams: 3 different makes per team; every car used <=1 in this preview, explicitly lists unallocated cars.
- Manufacturer- and vehicle-type Gauntlet field candidate counts.
- Long Jump provisional starting order with all owned cars, EXACTLY one attempt each.
- Second Chance rules: finisher immediately below LAST awarded bronze; once per car, 16 car editions, 4 groups of 4, only ONE advances per group.
- Current track taxonomy counts. Explicitly refuses to pretend we know route lengths / suitability where those are not catalogued.
- Read-only audit + optional download JSON preview. Export contains car IDs/names and team selections, NOT private family artwork or story packs.

To install QA preview: extract this ZIP over your existing C:\RaceHub. Then:
 git add -A
 git commit -m "OTG MAIN v8.0.180 Evil 2.0 read-only preflight"
 git push origin main

Open FH5 Space -> Evil Tournament -> EVIL 2.0 — SAFE PREVIEW.
Nothing else is required. No hard reset exists in this build.
Before ANY future Evil 2.0 actual restart, export a fresh portable backup and retain your private Jones Mob media packs separately.

QA: Do not uninstall the phone app or clear storage. No racing data is sent anywhere by this preview.
