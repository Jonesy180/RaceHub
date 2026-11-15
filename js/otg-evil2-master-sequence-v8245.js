/* OTG! MAIN v8.0.245 — master provisional stage order.
   Actual current R1 stages stay ordered; verified restored source stages,
   Gauntlet / Long Jump work orders and both Relay round group cards are
   interleaved. At the END is one Grand Second Chance phase GATE, NOT an
   invented Cup slot or a fabricated entrant list. This does NOT write state. */
(()=>{'use strict';
 function plan(st){
  const original=JSON.stringify(st),a=window.rhEvil2ExactSchedule8245?.build(st),
   relay=window.rhEvil2RelayFinals8245?.create(st);
  if(!a?.readOnly||!relay?.readOnly||!Array.isArray(a.previewRows)||!Array.isArray(relay.provisionalRelayCards))
   throw Error('Exact source and native Relay stage order are not available');
  if(a.previewRows.length!==relay.baseProvisionalRows)throw Error('Master stage source length mismatch');
  const toInsert=new Map();
  for(const card of relay.provisionalRelayCards){
   const at=card.anchor;if(!Number.isSafeInteger(at)||at<1||at>a.previewRows.length)
    throw Error('Relay forecast slot anchor out of bounds');
   if(!toInsert.has(at))toInsert.set(at,[]);
   toInsert.get(at).push(card);
  }
  const timeline=[],ids=new Set();
  function add(id,kind,row){
   if(ids.has(id))throw Error('Duplicate stage identity in merged preview: '+id);ids.add(id);
   timeline.push({previewPosition:timeline.length+1,id,kind,...row});
  }
  for(let i=0;i<a.previewRows.length;i++){
   const x=a.previewRows[i];add(x.id,x.kind,{name:x.name,originalSlot:x.originalSlot||null,
    sourceStage:x.sourceStage||null,sourceEventId:x.sourceEventId||null});
   for(const c of toInsert.get(i+1)||[]){add(c.id,c.isFinal?'RELAY FINALS NIGHT':'RELAY QUALIFYING GROUP',{
    name:c.championship+' — Round '+c.round+', Group '+c.group,
    round:c.round,group:c.group,teamCount:c.groupTeams,teamLegAttempts:c.teamLegAttempts,
    unlockedByPriorRound:c.round>1,finalsNight:c.isFinal});}
  }
  const originals=timeline.filter(x=>x.kind==='EXISTING');
  const relayCards=timeline.filter(x=>x.kind==='RELAY FINALS NIGHT'||x.kind==='RELAY QUALIFYING GROUP');
  const finals=relayCards.filter(x=>x.finalsNight);
  const lastCurrent=originals.at(-1)?.originalSlot;
  const grandGate={id:'evil2:grand-second-chance:close-qualifiers',kind:'END PHASE GATE — NOT A RACE SLOT',
   afterProvisionalPosition:timeline.length,
   requirements:['ALL eligible source competitions have fully finished and awarded medals',
    'Each source has issued at most one unused below-bronze car, falling to the next finishing car where necessary',
    'All Relay finals already complete; they issue ZERO Second Chance tickets',
    'Bracket field and number of rounds are calculated from the FINAL verified unique entrant list'],
   note:'Single Grand Second Chance championship; no mini-Cups or Ultimate Cup. No speculative entrant identities or stage count.'};
  const checks={
   exactSourceStagePackPass:Object.values(a.checks).every(Boolean),
   relayRoundPackPass:Object.values(relay.check).every(Boolean),
   originalVisitsInSourceOrder:originals.length===a.existingSlotVisits && originals.every((x,i)=>x.originalSlot===i+1),
   archiveAndWorkOrderRowsPreserved:timeline.length===a.previewRows.length+relay.relayGroupCards,
   allRelayGroupCardsOnce:relayCards.length===relay.relayGroupCards,
   twoRelayFinalsPreserved:finals.length===2,
   uniqueStageIdentities:ids.size===timeline.length,
   sequentialProvisionalPositions:timeline.every((x,i)=>x.previewPosition===i+1),
   oldRaceVisitOrderUnchanged:lastCurrent===a.existingSlotVisits,
   finalSecondChanceOnly:grandGate.afterProvisionalPosition===timeline.length && !timeline.some(x=>/second chance cup|ultimate second chance/i.test(x.kind)),
   actualGameStateUnchanged:JSON.stringify(st)===original
  };
  if(Object.values(checks).some(x=>!x))throw Error('Master sequence invariants failed: '+Object.entries(checks).filter(([,v])=>!v).map(([k])=>k).join(','));
  return{readOnly:true,qaOnly:true,liveCars:a.liveCars,originalVisits:a.existingSlotVisits,
   archivalStageVisits:a.archiveStageVisits,lonelyHeartVisits:a.restoredLonelyVisits,
   gauntletWorkOrders:a.gauntletMakerWorkOrders+a.gauntletTypeWorkOrders,
   longJumpAttempts:a.longJumpAttempts,
   relayGroupVisits:relay.relayGroupCards,relayQualifyingCards:relayCards.length-finals.length,
   relayFinalsCards:finals.length,
   originalPackEntries:a.proposedStagePackRows,mergedProvisionalStagePositions:timeline.length,
   unsourcedManufacturerThemes:(a.newFormatTemplates||[]).length,
   secondChanceAtEnd:grandGate,
   earlySamples:timeline.slice(0,12),lateSamples:timeline.slice(-12),
   grandSecondChanceBracketsSpecified:0,grandSecondChanceActualTickets:0,
   checks,provisionalRows:timeline,
   productionReady:false,realSlotWrites:0,resultWrites:0,medalsPublished:0,resetPerformed:false,
   note:'MASTER PREVIEW is NOT yet a production slot manifest: original races and source visits are retained, but Gauntlets are unresolved work orders, Relay future winners unknown, and real track allocations/results/medals remain unconnected.'};
 }
 window.rhEvil2MasterSequence8245={plan};
})();
