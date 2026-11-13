OTG! MAIN 8.0.209 — UPDATE LOOP RECOVERY (PHONE QA)

Apply OVER existing C:\RaceHub. Do not remove or clear any app files, storage or private content.

CHANGES
* Versioned HTML, bootstrap, update-wire, worker, and relay export scripts advanced to 8.0.209.
* Service-worker installation now verifies only six CURRENT essential resources rather than requiring hundreds of old assets to be fetched again.
* Old version caches are retained during this recovery; current assets still use versioned URLs.
* Safety Backup/update confirmation process unchanged.
* No racing or Garage data writes added.

QA: verify update installs once, open/close twice without repeat prompts, check existing relay results, and export snapshot.

Note: diagnosing an actual device loop requires browser/service-worker diagnostics. This is a targeted possible fix, not proof of root cause.
