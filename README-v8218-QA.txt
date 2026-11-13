OTG! MAIN v8.0.218 — VERSIONED PAGE / UPDATE LOOP REPAIR (QA)

FIX VERIFIED IN SOURCE: the previous updater reloaded index-v8216.html after switching workers.
That leaves old HTML running, which offers the latest version repeatedly. v218
fixes this two ways: new updater navigates to index-v8218.html after activation;
new service worker redirects navigation to stale /index-vXXXX.html entries onto the
current versioned page, including reloads triggered by the older updater code.

INSTALL: overlay these files onto the EXISTING C:\RaceHub folder. Overwrite matching
files. DO NOT delete existing files or data. Git add/commit/push as usual.
Do not uninstall the app, clear site data, or reset OTG! Spaces/Garage.

FEATURES: Aeródromo Long Jump v8.0.217 preserved; v8.0.218 changes only
update navigation and keeps the four-Space IndexedDB Safety Backup gate.

PHONE QA:
1. From the normal OTG! site, choose UPDATE NOW for 8.0.218, once.
2. Verify home opens and installed version reads 8.0.218, WITHOUT another offer.
3. Close/reopen Samsung Browser from the OTG! bookmark and confirm 8.0.218.
4. Festival -> Aeródromo Long Jump QA remains accessible with current Garage.

IF STILL LOOPING: open the EXISTING OTG! site address ending /index.html once
(not any /index-v8216.html bookmark); this redirects to the published 8.0.218 page
without clearing OTG! data. Report the installed version and any error.

NOT YET PHONE-TESTED. Source/syntax/static routing tests only.
