# OTG! Main v8.0.65

Main-only live-QA build covering the next agreed design cleanup: **Pickups & 4x4** taxonomy normalisation, dedicated **Festival / Race Off History** screens, Race Off catalogue-order parity, and the new FH5 **Drag Shootout** format.

Drag is now Festival-only: one assigned strip, one timed run per car, fastest overall wins. Drag has been removed from the Race Off catalogue. Existing zero-result prepared/active Drag Championships are migrated safely to the one-run format; completed Drag Race Off history is retained.

No reset required. rh-guide is unchanged.

**Revision 2:** the pre-update Safety Backup gate now uses IndexedDB for the full protected snapshot (with a small verified pointer in OTG! state), avoiding localStorage quota failures on large Spaces. The package also carries a same-version v8.0.64 updater hotfix so an installed v8.0.64 can receive the repaired gate before v8.0.65 installs.

Deployment:
```powershell
git add .
git commit -m "OTG v8.0.65 R2 safety gate history pickups drag redesign"
git push origin main
```
