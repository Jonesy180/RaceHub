OTG! Main 8.0.357 — update-loop hotfix based on 8.0.356

Detected two faults in v8.0.356:
1. Both index.html and index-v8356.html kept meta racehub-version=8.0.355, causing its updater to consider 8.0.356 perpetually new.
2. Service worker navigation built new URL() with three arguments and a non-URL second argument, throwing when handling navigations.

This patch corrects the version tag in both entry points and restores the proper 2-argument service worker URL. It retains the v8.0.356 final battles engine (js/tet2-final-battles-v8356.js) unchanged; that file must already be in the repository from the prior overlay.

OVERLAY ONLY into C:\RaceHub. Do NOT remove any files, clear phone storage, or alter LAB.
After extraction run git status --short then the usual three Git lines and update phone.
No racing results, Garage, or backup schema is modified.
Static checks only; actual phone update pending.
