OTG! MAIN v8.0.272 — PROTECTED INDEXEDDB COPY PROOF — PHONE QA PENDING

Cumulative overlay over v8.0.271. OVERWRITE matching files only; do not delete other project assets.
This release does NOT change normal app save architecture or migrate the live save pointer.

PRECONDITION: Keep a PRIVATE off-GitHub JSON backup exported from v8.0.271.

PHONE QA:
1. Dashboard > Evil Tournament > Prelaunch QA Controls.
2. Press COPY & VERIFY IN INDEXEDDB (NO SWITCH).
3. Expect VERIFIED COPY — PASS; save a screenshot and download the verification report.
4. Confirm dashboard, Garage, Spaces, old results still available.
5. Do NOT press any schedule freeze/reset (still disabled).

The exact localStorage string is copied on a user click into IndexedDB, SHA-256 checked on read-back, and compared byte-for-byte with the original; the original remains in localStorage. Repeated identical copies deduplicate by SHA-256. No deletion or app saving switch is performed. No personal data is included in the size/hash verification report, but treat metadata as private if preferred.

The slow 10-second Evil List rebuild is not fixed by this release; do not claim performance PASS. A subsequent build can safely address caching and the operational storage migration after phone copy proof.
