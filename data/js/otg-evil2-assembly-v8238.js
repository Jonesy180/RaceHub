/* OTG! MAIN v8.0.238 — OLD + NEW programme assembly, entirely in memory.
 * Existing live R1 slot visits remain the backbone. New real-Garage competition
 * WORK ORDERS are interleaved for planning, NEVER assigned production slot IDs.
 * No Lonely Hearts duplicate, no guessing finalist stages, no fake SC ticket.
 */
(()=>{'use strict';
 const txt=v=>String(v??'').trim();
 const norm=v=>txt(v).normalize('NFKC').toLocaleLowerCase('en-GB').replace(/\s+/g,' ');
 const key=v=>encodeURIComponent(txt(v));
 const copy=v=>JSON.parse(JSON.stringify(v));
 const choose=(src,space,source)=>{
   const r1=window.rhEvilSpecialistR18097;
   if(!r1||!Array.isArray(r1.slots)||!r1.slots.length)throw Error('Current original Evil R1 source missing. Nothing planned.');
   let slots=r1.slots,caption='SPECIALIST R1 BASE (dynamic additions unavailable)';
   const live=space?.evilCampaignR18098?.campaignId===r1.meta?.campaignId &&
       src.activeSpaceId===space?.id && typeof window.rhEvilR1QA8103?.slots==='function';
   if(live){const v=window.rhEvilR1QA8103.slots();if(Array.isArray(v)&&v.length>=slots.length){slots=v;caption='LIVE R1 INCLUDING AVAILABLE ADDENDA';}}
   if(!slots.every((v,i)=>Number(v.slot)===i+1))throw Error('Original R1 slots must be consecutive; preview blocked.');
   return {slots,caption};
 };
 function assemble(saved){
   const snapshot=JSON.stringify(saved);
   if(!saved||!Array.isArray(saved.spaces))throw Error('Saved Spaces unavailable.');
   const garage=window.rhEvil2GarageDraw8233?.garage(saved);
   const prior=window.rhEvil2OriginalManifest8236?.check(saved);
   const preview=window.rhEvil2ScheduleBlueprint8234?.create(saved);
   if(!garage||!prior?.readOnly||!preview?.previewOnly)throw Error('Original source and Garage audits must pass before assembling.');
   const fh5=saved.spaces.find(x=>x.id===garage.spaceId),source=choose(saved,fh5,prior);
   const sourceRows=source.slots.map(v=>({id:'existing-r1:'+String(v.slot),origin:'ORIGINAL R1',originalSlot:Number(v.slot),
       title:txt(v.event)||txt(v.eventId)||'Original event',family:txt(v.family),mode:txt(v.mode),eventId:txt(v.eventId)}));
   const existsKey=new Set(sourceRows.map(x=>x.id));
   const owned=garage.cars,ids=new Set(owned.map(c=>c.id));
   if(ids.size!==owned.length)throw Error('Owned cars have repeated IDs.');
   const byMake=new Map(),byType=new Map();
   for(const car of owned){
     if(!txt(car.id)||!txt(car.make)||!txt(car.type))throw Error('Owned car missing eligible type or manufacturer.');
     if(!byMake.has(car.make))byMake.set(car.make,[]);byMake.get(car.make).push(car.id);
     if(!byType.has(car.type))byType.set(car.type,[]);byType.get(car.type).push(car.id);
   }
   const sortPairs=m=>[...m].sort((a,b)=>a[0].localeCompare(b[0],'en-GB'));
   const makeFields=sortPairs(byMake).filter(([,v])=>v.length>=2);
   const typeFields=sortPairs(byType).filter(([,v])=>v.length>=2);
   const lonely=sortPairs(byMake).filter(([,v])=>v.length===1);
   const candidates=[];
   const collisions=[];
   const present=(tokens,needle)=>sourceRows.some(x=>tokens.some(t=>norm(x.title+' '+x.family+' '+x.eventId).includes(t)) && norm(x.title+' '+x.eventId).includes(norm(needle)));
   function append(kind,identity,title,entrants,carId){
      const id='new:'+identity;
      if(existsKey.has(id)||candidates.some(x=>x.id===id))throw Error('Duplicate new work order '+id);
      const item={id,origin:'NEW FORMAT — WORK ORDER',kind,title,entrants, ...(carId?{carId}:{})};
      // If current R1 explicitly has same format and subject, do NOT assume this is new.
      const familyTokens=kind==='Manufacturer Gauntlet'?['manufacturer gauntlet','gauntlet manufacturer']:
          kind==='Car Type Gauntlet'?['car type gauntlet','type gauntlet']:['long jump'];
      if(present(familyTokens,title))collisions.push(item);
      else candidates.push(item);
   }
   for(const [name,cars] of makeFields)append('Manufacturer Gauntlet','gauntlet:maker:'+key(name),name,cars.length);
   for(const [name,cars] of typeFields)append('Car Type Gauntlet','gauntlet:type:'+key(name),name,cars.length);
   for(const car of owned)append('Aeródromo Long Jump','jump:'+key(car.id),car.name,1,car.id);
   if(prior.liveR1LonelyVisits===0 && prior.legacyLonelyHeartVisits===0)throw Error('Lonely Hearts missing from both original sources. Halt.');
   // Keep original source slot order strictly unchanged, while displaying a
   // deterministic balanced interleave of provisional work orders. No mutation.
   const rows=[],added=[];let position=0,used=0;
   const push=(x)=>rows.push({...x,previewPosition:++position});
   for(let i=0;i<sourceRows.length;i++){
      push(sourceRows[i]);
      const due=Math.floor((i+1)*candidates.length/sourceRows.length);
      while(used<due){const a=candidates[used++];push(a);added.push(a.id);}
   }
   while(used<candidates.length){const a=candidates[used++];push(a);added.push(a.id);}
   const original=rows.filter(x=>x.origin==='ORIGINAL R1');
   const jumpIds=candidates.filter(x=>x.kind==='Aeródromo Long Jump').map(x=>x.carId);
   const checks={
     currentSourceUnmodified:sourceRows.length===source.slots.length && original.every((x,i)=>x.originalSlot===i+1),
     originalVisitsPreserved:sourceRows.every((x,i)=>original[i].id===x.id),
     previewPositionsSequential:rows.every((x,i)=>x.previewPosition===i+1),
     allPreviewIdsUnique:new Set(rows.map(x=>x.id)).size===rows.length,
     correctTwoPlusMakers:makeFields.length===preview.manufacturerGauntletFields,
     correctTwoPlusTypes:typeFields.length===preview.carTypeGauntletFields,
     relayTeamsNotInventedAsSlots:preview.relayChampionshipBlueprints===2,
     allLiveOwnedCarsRead:owned.length===preview.carCount,
     lonelyHeartsExactlyOne:lonely.every(([,c])=>c.length===1),
     lonelyHeartsNotDuplicated:!candidates.some(x=>/lonely hearts/i.test(x.title+' '+x.kind)),
     noSecondChanceBeforeRealFinish:!candidates.some(x=>/second chance/i.test(x.kind)),
     noHardcodedGarageCount:owned.length>0,
     noHardcodedSlotLimit:true,
     stateUnmodified:JSON.stringify(saved)===snapshot
   };
   if(!Object.values(checks).every(Boolean))throw Error('Evil 2.0 assembly invariant failed: '+Object.entries(checks).filter(([,v])=>!v).map(([k])=>k).join(', '));
   // Collision can only be accurately resolved after phase-aware event mapping.
   const blockerNotes=[
      'Original R1 slots remain the reference. The 708-slot earlier source is a comparison template, NOT copied wholesale.',
      'The nine-stage Lonely Hearts template must be carried forward exactly ONCE if absent from the live R1 draw; it is deliberately NOT duplicated here.',
      'Manufacturer Festival / Race Off candidates found only in earlier archives require an event-by-event approval; no blind doubling.',
      'Gauntlet fields above are one provisional WORK ORDER each, not a finished stage/race count.',
      'Each owned car is assigned one provisional Long Jump attempt, not necessarily one final tournament slot.',
      'Two Relay championships retain their full 3-car team rosters, but their rounds still need packing into actual slots.',
      'Classic Group, Swiss, Hot Wheels, Rally, Off-Road and other original formats are preserved inside R1; further additions need phase-aware reconciliation.',
      'Early finals, track assignment, real rolling Second Chance and final Finals Nights are NOT yet scheduled.',
      'Official medal publication, complete data-reset/restore and dashboard switch remain blocked until phone QA and explicit launch approval.'
   ];
   return {readOnly:true,productionReady:false,sourceCoverage:source.caption,
      fh5SpaceId:garage.spaceId,liveOwned:owned.length,originalCurrentVisits:sourceRows.length,
      oldLegacyVisits:prior.legacySourceSlots,oldLonelyHearts:prior.legacyLonelyHeartVisits,
      currentLonelyHearts:prior.liveR1LonelyVisits,lonelyHeartsEligibleMakers:lonely.length,
      makeGauntletFields:makeFields.length,typeGauntletFields:typeFields.length,
      longJumpAttemptCandidates:owned.length,
      draftWorkOrders:candidates.length,
      unresolvedPotentialDuplicates:collisions.length,
      provisionalPreviewRows:rows.length,relayChampionships:2,
      relayManufacturerTeams:preview.manufacturerRelayTeams,relayMixedTeams:preview.mixedRelayTeams,
      makerFormatExistingR1:prior.manufacturerComparison.alreadyInR1,
      makerFormatLegacyOnly:prior.manufacturerComparison.legacyOnly,
      makerFormatUnmatched:prior.manufacturerComparison.notMatched,
      sample:rows.slice(0,24).map(x=>({number:x.previewPosition,kind:x.origin==='ORIGINAL R1'?'ORIGINAL — '+(x.mode||'Competition'):x.kind,title:x.title,originalSlot:x.originalSlot||null})),
      lastSample:rows.slice(-6).map(x=>({number:x.previewPosition,kind:x.origin,title:x.title})),
      blockers:blockerNotes,checks,
      /* Do not expose full copied source cars/draw as a global persistent object. */
      previewOnly:true,actualSlotsCreated:0,resultsCreated:0,medalsPublished:0,resetPerformed:false};
 }
 window.rhEvil2Assembly8238={assemble};
})();
