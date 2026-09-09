OTG! MAIN v8.0.55 — FOUNDATION FIXES

Result Summary
- Average comparison is per round/course within the current Championship/Event.
- Mixed-course Championship averages are not used on Result Summary.
- Final Standings total-time logic remains unchanged.

Swiss
- 8+ entrants; no entrant ceiling.
- Recommended: 3 rounds for 8–64 entrants.
- Recommended: 4 rounds for 65+ entrants.
- Advanced/Custom allows more rounds with no configured-round ceiling.
- Obsolete 4–8 configured-round validation removed from Custom Racing and Festival Swiss.

DEPLOYMENT
VS Code:
  code .

PowerShell:
  Set-Location "<PATH-TO-EXTRACTED-OTG-v8.0.55>"
  code .

Netlify CLI (when using the CLI):
  npx netlify deploy --prod --dir .

Main only. No rh-guide build. No artwork changes.
