# OTG! Main v8.0.65

Main-only live-QA build covering the next agreed design cleanup: **Pickups & 4x4** taxonomy normalisation, dedicated **Festival / Race Off History** screens, Race Off catalogue-order parity, and the new FH5 **Drag Shootout** format.

Drag is now Festival-only: one assigned strip, one timed run per car, fastest overall wins. Drag has been removed from the Race Off catalogue. Existing zero-result prepared/active Drag Championships are migrated safely to the one-run format; completed Drag Race Off history is retained.

No reset required. rh-guide is unchanged.

Deployment:
```powershell
git add .
git commit -m "OTG v8.0.65 history pickups drag redesign"
git push origin main
```
