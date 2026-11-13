OTG! MAIN v8.0.227 — GROUP-FINAL SOURCE QA + MAJOR SOURCE READINESS
Small overlay over v8.0.226 (phone PASS). NO racing-history reset.

New: Festival > Second Chance Cups > Qualifier Inbox > MAJOR COMPETITION SOURCE CHECK.
GROUP FINALS: A completed group championship may produce a Second Chance QA
candidate ONLY if original status is complete, a champion is recorded, the
completed final field and its full ranked standings are present, totals / round
counts / identities match, and the bronze boundary is not tied. No preliminary
group winner qualifies early. If a historical final uses a different schema,
it is BLOCKED rather than guessed. The existing user-confirmed bronze source
picker now uses this validated final proof if available.
SWISS: read-only round/finish status. Swiss knockout placement adapter remains
blocked; ordinary cumulative times do NOT decide Swiss finishing positions.
RELAYS: read-only status for current FH5 Space's known relay QA draw, QA rounds
and clean staging draft. None of these is a completed production relay result.
A relay finishes as a THREE-CAR TEAM, whereas Second Chance requires one CAR.
No car is arbitrarily selected from a team. Need to agree rule before connector.

READ-ONLY SAMPLE: CHECK FINISHED GROUP EXAMPLE uses 6 owned cars with an
IN-MEMORY completed final; checks fourth and fifth place with NO saved ticket.
No automatic official medals, racing results or campaign reset. Cup 1 / Cup 2,
Ultimate QA and v8.0.218 update-loop navigation repair remain unchanged.

INSTALL: Extract over C:\RaceHub, overwrite matching files, DO NOT DELETE
or clear browser data. Then:
git add .
git commit -m "OTG v8.0.227 Major Second Chance Source Audit QA"
git push

PHONE QA:
1. Festival > Second Chance Cups > Qualifier Inbox.
2. Expand MAJOR COMPETITION SOURCE CHECK. Existing group championships should
   show IN PROGRESS and 0 completed unless you have finished one since backup.
3. Press CHECK FINISHED GROUP EXAMPLE (READ-ONLY). See 4th and 5th candidates.
4. Swiss should NOT qualify until final knockout standing is official.
5. Relay must say QA/draft only and NO TICKET, never award team qualifying car.
6. Verify existing Cups 1/2, Ultimate Champion, Mitsubishi previews unchanged;
   reload and verify no update loop, no new ticket or medal.

Next: confirm relay team-to-car qualifier rule, complete Swiss final placement
adapter, and build official honours after comprehensive QA. No Evil 2.0 reset
until complete, reviewed and explicitly approved.
