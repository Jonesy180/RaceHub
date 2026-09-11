OTG! MAIN v8.0.60 — FH5 STAGED PROGRAMME PREVIEWS

SWISS
- Retains the v8.0.59 FULL SWISS PROGRAMME preview before START.
- Shows configured Swiss-stage tracks and the selected knockout route through the Championship Final.
- Top 4, Top 8 and Top 16 cuts show the appropriate later rounds.

RACE OFF
- First-round setup now shows a FULL RACE OFF PROGRAMME before the first draw starts.
- The preview is calculated from the actual locked entrant count.
- Non-power-of-two fields show the Preliminary Round first, then the complete knockout path to the Final.
- Suggested tracks match the existing live Race Off round rotation.
- The Final uses the same diversified finale logic as v8.0.58: Goliath / Colossus / Marathon by event/profile, plus Gauntlet, Titan and specialist DLC/Drag finales.
- Every live Race Off track remains editable before REVIEW DRAW.

UNCHANGED
- Standard remains cumulative total time with no separate finale stage.
- Groups retains full Preliminary → Stage 2 (when needed) → Final preview/automation.
- All Cars Festival remains STANDARD • 1 round • Copper Canyon Sprint.
- Five unverified Cross Country names remain excluded from NEW fallback suggestions pending in-game confirmation.
- Record-rosette shift remains WATCH ONLY.
- Main only. No rh-guide build. No artwork changes.

DEPLOYMENT
VS Code:
  code .

PowerShell:
  Set-Location "<PATH-TO-EXTRACTED-OTG-v8.0.60>"
  code .

GitHub:
  git add .
  git commit -m "OTG! v8.0.60 Swiss and Race Off full programme previews"
  git push origin main
