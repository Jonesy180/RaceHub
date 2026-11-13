OTG! MAIN v8.0.204 - FESTIVAL VISUAL + UPDATE CHECK QA
======================================================
Patch over existing C:\RaceHub folder; do not delete existing files.
Changes: Relay category button always black (even when selected/expanded); update-check manifest fetch retries 3 times and provides an informative error instead of an unexplained "unavailable".
No saved race/relay/Garage/private data migration. Same Safety Backup gate.
QA: black collapsed and expanded Relay dropdown; launch both relays; manual CHECK FOR LATEST UPDATE after GitHub Pages deployment; close/reopen; preserve route locks/QA results and 704-car Garage.
If an update check still fails, report the exact HTTP/network error. Do not clear storage.
