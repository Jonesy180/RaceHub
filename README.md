> Current Main build: **v8.0.79** — Evil Campaign Festival setup + shuffle-bag reset repair.

# OTG! Main v8.0.78

Main-only **Evil Campaign foundation** build.

The authoritative `v8.0.70 FULL-TRACK-CLEANUP CONTROLLED SHAKE-UP R2` campaign is now embedded directly into OTG! as a private FH5 campaign: 697 cars, 708 slots, clean 0/708 progress, controlled reshuffle of the regular season, preserved multi-visit ordering, and preserved Finals / Final Boss sequence.

On the FH5 Dashboard the former full-width Festival row becomes:

`FESTIVAL | EVIL CAMPAIGN`

The rest of the approved Dashboard remains in place. Evil Campaign uses a dark-crimson treatment and shows only progress + next slot.

Supported Festival slots open the normal OTG! setup flow and use the existing persistent shuffle bags / fixed-track rules. The campaign's own pool metadata is authoritative where it deliberately differs from a normal preset. Supported Race Off slots open or continue the normal Race Off flow and existing live auto-routes, with R2 protected Finals enforced. Manual slot completion is used in this first build so parked multi-visit programmes cannot advance accidentally.

Reset Racing Data / Full Reset also resets Evil Campaign progress. Garage/catalogue behaviour is unchanged. rh-guide is untouched.

Deployment:
```powershell
git add .
git commit -m "OTG v8.0.78 evil campaign back visibility fix"
git push origin main
```
