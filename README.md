## Current build: v8.0.61
Result Summary + record-celebration reliability fixes.

- Result Summary averages now compare only prior results from the same Championship/Event AND the same round/course.
- The fix is in the shared result-summary race-end path, so mixed-course averages cannot leak back into Standard Festival or Custom Racing summaries.
- Record celebration now uses a stronger shared right-side mask when an All-Time record was not earned, removing the intermittent baked-in gold rosette/text "ghost" seen at the top-right.
- The record-celebration fix applies to every flow using the approved shared hero: Festival, Custom Racing and Race Off.
- Record calculations themselves are unchanged. FH5 programme previews and racing progression are unchanged.
- Main only; no rh-guide build and no user-data migration.

See `README.txt` for deployment/GitHub lines.
