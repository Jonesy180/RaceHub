OTG! MAIN v8.0.197 — RELAY GROUP ROUTE LOCKS (INCREMENTAL QA)

Copy all ZIP files into existing C:\RaceHub, overwrite matching files. DO NOT delete the folder, remove old JS/CSS files, clear browser storage, or restore an outdated backup.

New features:
- Lock three displayed Street Scene / Road Sprint routes per group in new isolated localStorage ledger. Final fixed Marathon > Goliath > Colossus.
- Opening and later rounds persist locks with stable local OTG route-list keys, draw fingerprint, Space ID, mode and group/round.
- Lock before writing NEW QA stage times. Existing groups with recorded v8.0.190-196 times are marked legacy: no retrospective route attribution; existing results remain editable.
- Synthetic rehearsal remains in memory, no writes.
- No production race records, medals, or normal track usage updates.

IMPORTANT: Route keys are stable identifiers for the current verified relay-list entries, NOT canonical FH5 catalogue IDs. Canonical ID migration is deferred until validated from the active FH5 track catalogue. This build does not pretend the mapping is complete.

PHONE QA: check one untouched opening group, LOCK group tracks, leave/reopen and verify same locked three. Check another group independent. Verify an older group with recorded times shows LEGACY warning and original times remain. In Championship Rounds, if eligible, confirm same controls; rehearsal should still complete. Check Garage and private content unaffected.

Data safety: ONLY new keys otg.evil2.relay.qa.track-locks.v1:* written for route locks; older QA saves untouched by locking. No campaign restart or activation.
