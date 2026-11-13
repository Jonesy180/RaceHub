OTG! MAIN v8.0.215 — GAUNTLET MULTI-MANUFACTURER SWITCHING HOTFIX QA

Overlay onto approved MAIN v8.0.214. Extract into existing C:\RaceHub and OVERWRITE matching files ONLY. DO NOT delete folder or clear phone storage.

Bug: v214 allowed just one Gauntlet draw per format; after starting Abarth there was no way to select another manufacturer.
Fix: Manufacturer and Type tabs now display the category selector ALWAYS, including when an event already exists. Each selected maker/type has an independent local QA save, times, standings, stage route lock and resume. Old v211-v214 saves are read through a fallback key and remain intact; any future changes to a legacy category copy the original before saving. No QA history, Garage ownership, Space, private content or normal racing data is deleted.

Phone QA: Open Festival > Garage Gauntlets > Manufacturer. Abarth should resume with previous saved times and locked routes. Use the now-visible category dropdown, select another manufacturer, start its new field, enter a time, switch back to Abarth and confirm times intact. Switch to Car Type and back; ensure each category resumes separately. Reopen twice to ensure no version update loop.
