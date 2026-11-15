OTG! MAIN v8.0.265 — EVIL LIST DASHBOARD ROUTING HOTFIX

The dashboard Evil Tournament tile uses a scoped legacy router, not window.show. v264 therefore showed the old retirement screen. v265 watches the existing #evilcampaign section become active and displays Evil List 2.0 instead, leaving the tile and legacy data intact.

Phone QA: Tap existing Evil Tournament dashboard tile; should see THE EVIL LIST 2.0, 2,225 stages and Next Up stage 3 Abarth Festival, not the retirement screen. Verify Back to Dashboard. Verify Festival still works. Report any page-unresponsive dialog. No reset.

VS Code:
git add .
git commit -m "OTG MAIN v8.0.265 Evil List dashboard routing hotfix"
git push
