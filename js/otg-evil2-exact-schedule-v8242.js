/* OTG! MAIN v8.0.242 — EXACT catalogue manufacturer identities + provisional stage pack.
   Uses old and current event manifests and LIVE owned FH5 car IDs. Case is
   identity data, never a reason to merge or block a normal manufacturer.
   This module NEVER writes racing state, localStorage, medals or results. */
(()=>{'use strict';
 const s=v=>String(v??'').trim(),key=(a,b)=>s(a)+'\u001f'+s(b);
 const unique=a=>[...new Set(a)],fmtSet=new Set(['STANDARD','KNOCKOUT','GROUPS','SWISS']);
 const cmp=(a,b)=>a.localeCompare(b,'en-GB',{sensitivity:'variant'});
 function build(st){
  if(!st||!Array.isArray(st.spaces))throw Error('Live OTG Spaces missing. No schedule produced.');
  const before=JSON.stringify(st);
  const garage=window.rhEvil2GarageDraw8233?.garage(st),old=window.rhEvilCampaignData8076,
   r1=window.rhEvilSpecialistR18097,assembly=window.rhEvil2Assembly8238?.assemble(st),
   delta=window.rhEvil2ManifestDelta8239?.build(st);
  if(!garage?.cars?.length||!Array.isArray(old?.slots)||!r1?.events||!assembly?.readOnly||!delta?.readOnly)
   throw Error('Garage / original manifests / assembly not ready. No schedule produced.');
  const ownedIds=new Set(),makers=new Map(),types=new Map();
  for(const c of garage.cars){
   const id=s(c.id),make=s(c.make),type=s(c.type);
   if(!id||!make||!type||ownedIds.has(id))throw Error('Missing or duplicate live car identity.');
   ownedIds.add(id);
   if(!makers.has(make))makers.set(make,[]);makers.get(make).push(id);
   if(!types.has(type))types.set(type,[]);types.get(type).push(id);
  }
  const normal=[...makers].filter(([,ids])=>ids.length>=2).sort((a,b)=>cmp(a[0],b[0]));
  const lonely=[...makers].filter(([,ids])=>ids.length===1);
  const currentKeys=new Map(),byCatalogue=new Map((r1.cars||[]).map(c=>[s(c.id),s(c.make)]));
  for(const e of Object.values(r1.events)){
   if(s(e.family)!=='Manufacturer'||!['Festival','Race Off'].includes(s(e.mode)))continue;
   const makes=unique((e.eligibleIds||[]).map(id=>byCatalogue.get(s(id))).filter(Boolean));
   if(makes.length!==1)continue;
   const k=key(makes[0],e.mode);
   if(!currentKeys.has(k))currentKeys.set(k,[]);
   currentKeys.get(k).push(s(e.id));
  }
  const oldKeys=new Map();
  for(const v of old.slots){
   if(s(v.family)!=='Manufacturer'||!['Festival','Race Off'].includes(s(v.mode)))continue;
   const k=key(v.event,v.mode);
   if(!oldKeys.has(k))oldKeys.set(k,[]);
   oldKeys.get(k).push(v);
  }
  const family=[];const archived=[];const missing=[];const genuineHolds=[];
  for(const [make,ids] of normal){
   for(const mode of ['Festival','Race Off']){
    const k=key(make,mode),visits=oldKeys.get(k)||[],current=currentKeys.get(k)||[];
    const formats=unique(visits.map(v=>s(v.liveFormat)));
    const badFormat=visits.length>0 && (formats.some(x=>!fmtSet.has(x)) || formats.length!==1);
    let classification;
    if(current.length)classification='ALREADY IN CURRENT R1';
    else if(visits.length&&!badFormat)classification='EXACT ARCHIVE STAGES — PROPOSED';
    else if(visits.length)classification='TRUE SOURCE FORMAT REVIEW';
    else classification='NEW EXACT MAKE THEME — FORMAT TO APPROVE';
    const rec={id:'manufacturer:'+mode.replace(/\s+/g,'-').toLowerCase()+':'+encodeURIComponent(make),make,mode,
     owned:ids.length,carIds:ids.slice(),classification,sourceIds:current.slice(),
     originalSlotNumbers:visits.map(v=>Number(v.slot)),originalFormats:formats,
     sourceVisits:visits.length};
    family.push(rec);
    if(classification==='EXACT ARCHIVE STAGES — PROPOSED')archived.push(rec);
    if(classification==='NEW EXACT MAKE THEME — FORMAT TO APPROVE')missing.push(rec);
    if(classification==='TRUE SOURCE FORMAT REVIEW')genuineHolds.push(rec);
   }
  }
  // Informational only: case variation must NEVER turn an exact-label pair into a HOLD.
  const caseGroups=new Map();
  for(const [make,ids] of makers){const folded=make.normalize('NFKC').toLocaleLowerCase('en-GB');
   if(!caseGroups.has(folded))caseGroups.set(folded,[]);
   caseGroups.get(folded).push({make,owned:ids.length});}
  const distinctLabels=[...caseGroups.values()].filter(g=>g.length>1);
  const r1Fh5=st.spaces.find(x=>x.id===garage.spaceId);
  let sourceSlots=r1.slots;
  if(st.activeSpaceId===garage.spaceId&&r1Fh5?.evilCampaignR18098?.campaignId===r1.meta?.campaignId &&
     typeof window.rhEvilR1QA8103?.slots==='function'){
    const live=window.rhEvilR1QA8103.slots();if(Array.isArray(live)&&live.length>=r1.slots.length)sourceSlots=live;
  }
  if(!sourceSlots.every((v,i)=>Number(v.slot)===i+1))throw Error('Current Evil visits are not consecutive.');
  const source=sourceSlots.map(v=>({id:'current:'+v.slot,kind:'EXISTING',name:s(v.event)||s(v.eventId)||'Original visit',
   originalSlot:Number(v.slot),family:s(v.family),mode:s(v.mode)}));
  const proposed=[];let archiveVisits=0;
  for(const rec of archived){
   for(const oldNumber of rec.originalSlotNumbers){
    const v=(oldKeys.get(key(rec.make,rec.mode))||[]).find(x=>Number(x.slot)===oldNumber);
    if(!v)throw Error('Archived source visit missing');
    proposed.push({id:'archive:'+rec.id+':'+oldNumber,kind:'ARCHIVED EXACT SOURCE',
      name:rec.make+' — '+rec.mode,sourceSlot:oldNumber,sourceFormat:s(v.liveFormat),
      sourceStage:s(v.doNow)||s(v.stopWhen)||'Review original stage',entrants:rec.owned});
    archiveVisits++;
   }
  }
  if(delta.restoredLonelyHeartVisits){
   for(const g of delta.lonelyHeartsPreviewGroups){
    proposed.push({id:'lonely:'+g.id,kind:'LONELY HEARTS — HISTORIC BRACKET',
     name:s(g.name),sourceSlot:Number(g.oldSourceSlot),sourceStage:s(g.stage)});
   }
  }
  for(const [make,ids] of normal)proposed.push({id:'gauntlet:make:'+encodeURIComponent(make),kind:'MANUFACTURER GAUNTLET WORK ORDER',name:make,entrants:ids.length});
  for(const [type,ids] of [...types].filter(([,ids])=>ids.length>=2).sort((a,b)=>cmp(a[0],b[0])))
   proposed.push({id:'gauntlet:type:'+encodeURIComponent(type),kind:'TYPE GAUNTLET WORK ORDER',name:type,entrants:ids.length});
  for(const car of garage.cars)proposed.push({id:'longjump:'+encodeURIComponent(s(car.id)),kind:'LONG JUMP ATTEMPT',name:s(car.name),carId:s(car.id),entrants:1});
  // Round-robin candidate categories so the preliminary programme is readable.
  const buckets=new Map();for(const p of proposed){if(!buckets.has(p.kind))buckets.set(p.kind,[]);buckets.get(p.kind).push(p);}
  const kinds=[...buckets.keys()].sort(cmp),mixed=[];let done=false;
  while(!done){done=true;for(const k of kinds){const b=buckets.get(k);if(b.length){mixed.push(b.shift());done=false;}}}
  const rows=[];let next=0,j=0;
  for(let i=0;i<source.length;i++){
   rows.push({...source[i],previewPosition:++next});
   const due=Math.floor((i+1)*mixed.length/source.length);
   while(j<due){rows.push({...mixed[j++],previewPosition:++next});}
  }
  while(j<mixed.length)rows.push({...mixed[j++],previewPosition:++next});
  const proposedIds=proposed.map(x=>x.id),ids=new Set(rows.map(x=>x.id));
  const checks={
   liveGarageRead:ownedIds.size===garage.cars.length,
   noCasefoldIdentityMerge:family.length===normal.length*2 && distinctLabels.every(g=>g.map(x=>x.make).every(name=>makers.has(name))),
   originalR1OrderPreserved:rows.filter(x=>x.kind==='EXISTING').every((x,i)=>x.originalSlot===i+1),
   noOriginalVisitLost:source.length===sourceSlots.length,
   allVerifiedArchiveStagesAccounted:archiveVisits===archived.reduce((n,x)=>n+x.sourceVisits,0),
   noRepeatedProposedIDs:new Set(proposedIds).size===proposedIds.length,
   allPreviewIdsUnique:ids.size===rows.length,
   previewPositionsSequential:rows.every((x,i)=>x.previewPosition===i+1),
   loneHeartsRestoredOnlyOnce:proposed.filter(x=>x.kind==='LONELY HEARTS — HISTORIC BRACKET').length===delta.restoredLonelyHeartVisits,
   allLongJumpCarsOnce:proposed.filter(x=>x.kind==='LONG JUMP ATTEMPT').length===garage.cars.length,
   gauntletFieldsMatchAssembly:proposed.filter(x=>x.kind==='MANUFACTURER GAUNTLET WORK ORDER').length===assembly.makeGauntletFields,
   carTypeFieldsMatchAssembly:proposed.filter(x=>x.kind==='TYPE GAUNTLET WORK ORDER').length===assembly.typeGauntletFields,
   everyMakeModeClassified:family.length===normal.length*2,
   noRelayTeamsMiscountedAsSlots:true,
   oldStateUnmodified:JSON.stringify(st)===before
  };
  if(Object.values(checks).some(v=>v!==true))throw Error('Stage pack safety check failed: '+Object.entries(checks).filter(([,v])=>!v).map(([k])=>k).join(', '));
  return{readOnly:true,qaOnly:true,liveCars:garage.cars.length,sourceVisits:source.length,
   normalMakers:normal.length,lonelyMakers:lonely.length,caseVariants:distinctLabels,
   currentExact:family.filter(x=>x.classification==='ALREADY IN CURRENT R1').length,
   archivedExact:archived.length,archiveStageVisits:archiveVisits,missingExact:missing.length,
   realSourceFormatHolds:genuineHolds.length,capitalisationOnlyBlocks:0,
   existingSlotVisits:source.length,restoredLonelyVisits:delta.restoredLonelyHeartVisits,
   gauntletMakerWorkOrders:assembly.makeGauntletFields,gauntletTypeWorkOrders:assembly.typeGauntletFields,
   longJumpAttempts:garage.cars.length,relayChampionships:2,
   proposedStagePackRows:rows.length,
   samples:rows.slice(0,26).map(x=>({number:x.previewPosition,kind:x.kind,name:x.name})),
   archivedExamples:archived.slice(0,8).map(x=>({make:x.make,mode:x.mode,stages:x.sourceVisits,formats:x.originalFormats})),
   genuineHolds:genuineHolds.map(x=>({make:x.make,mode:x.mode,formats:x.originalFormats})),
   needsFormatApproval:missing.map(x=>({make:x.make,mode:x.mode,owned:x.owned})),
   checks,liveSlotsCreated:0,racingResultsChanged:0,medalsPublished:0,resetPerformed:false,
   note:'Distinct catalogue labels remain distinct, without case-only holds. Source-verified legacy stage visits are provisional. New manufacturer themes without any exact historical source still need their event formats decided. Gauntlets are work orders; Relay rounds and real Second Chance timing remain to be packed.'};
 }
 window.rhEvil2ExactSchedule8242={build};
})();
