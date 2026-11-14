/* OTG! MAIN v8.0.240 — archived Manufacturer Festival / Race Off delta review.
   Compare the TWO historical event sources against the CURRENT owned FH5 Garage.
   Prepare unique, live-entrant candidate definitions without writing/starting a draw.
   Never guess make aliases or copy a whole frozen legacy event programme. */
(()=>{'use strict';
 const str=x=>String(x??'').trim();
 const norm=x=>str(x).normalize('NFKC').toLocaleLowerCase('en-GB').replace(/\s+/g,' ');
 const pair=(make,mode)=>str(make)+'\u001f'+str(mode);
 const pairs=['Festival','Race Off'];
 const unique=a=>[...new Set(a)];
 const immutable=x=>JSON.stringify(x);
 const sorted=(a)=>a.sort((x,y)=>x.make.localeCompare(y.make,'en-GB')||x.mode.localeCompare(y.mode));
 function review(st){
   if(!st||!Array.isArray(st.spaces))throw Error('Live OTG! Spaces unavailable.');
   const before=immutable(st);
   const delta=window.rhEvil2ManifestDelta8239?.build(st);
   const source=window.rhEvil2OriginalManifest8236?.check(st);
   const garage=window.rhEvil2GarageDraw8233?.garage(st);
   const old=window.rhEvilCampaignData8076,r1=window.rhEvilSpecialistR18097;
   if(!delta?.readOnly||!source?.readOnly||!garage?.cars?.length||!Array.isArray(old?.slots)||!r1?.events)
     throw Error('Original event checks are missing; no new competitions can be proposed.');
   const ownedByMake=new Map();
   for(const c of garage.cars){
     const make=str(c.make),id=str(c.id);
     if(!make||!id)throw Error('Owned Garage contains an incomplete make or ID.');
     if(!ownedByMake.has(make))ownedByMake.set(make,[]);
     ownedByMake.get(make).push({id,name:str(c.name),make});
   }
   const oldByPair=new Map();
   for(const visit of old.slots){
     if(str(visit.family)!=='Manufacturer'||!pairs.includes(str(visit.mode)))continue;
     const key=pair(visit.event,visit.mode);
     if(!oldByPair.has(key))oldByPair.set(key,[]);
     oldByPair.get(key).push(visit);
   }
   const byCatalogue=new Map((r1.cars||[]).map(c=>[str(c.id),str(c.make)]));
   const current=new Set(),aliasPossible=new Map();
   const currentExamples=new Map();
   for(const event of Object.values(r1.events)){
     if(str(event.family)!=='Manufacturer'||!pairs.includes(str(event.mode)))continue;
     const makes=unique((event.eligibleIds||[]).map(id=>byCatalogue.get(str(id))).filter(Boolean));
     if(makes.length!==1)continue;
     const key=pair(makes[0],event.mode);
     current.add(key);
     if(!currentExamples.has(key))currentExamples.set(key,[]);
     currentExamples.get(key).push(str(event.id));
     const alias=pair(norm(makes[0]),event.mode);
     if(!aliasPossible.has(alias))aliasPossible.set(alias,new Set());
     aliasPossible.get(alias).add(makes[0]);
   }
   const liveCaseAliases=new Map(),legacyCaseAliases=new Map();
   for(const name of ownedByMake.keys()){
     const k=norm(name);if(!liveCaseAliases.has(k))liveCaseAliases.set(k,new Set());
     liveCaseAliases.get(k).add(name);
   }
   for(const k of oldByPair.keys()){
     const make=k.split('\u001f')[0],name=norm(make);
     if(!legacyCaseAliases.has(name))legacyCaseAliases.set(name,new Set());
     legacyCaseAliases.get(name).add(make);
   }
   const ids=new Set(),items=[];
   for(const [make,cars] of [...ownedByMake].filter(([,cs])=>cs.length>=2)){
     for(const mode of pairs){
       const key=pair(make,mode),original=oldByPair.get(key)||[];
       const activeExact=current.has(key);
       const aliases=unique([
         ...(aliasPossible.get(pair(norm(make),mode))||[]),
         ...(liveCaseAliases.get(norm(make))||[]),
         ...(legacyCaseAliases.get(norm(make))||[])
       ]).filter(x=>x!==make);
       const sourceType=mode==='Festival'?'STANDARD':'KNOCKOUT';
       const legacyFormatValid=original.length===1 && str(original[0].liveFormat)===sourceType;
       let status;
       if(activeExact)status='EXISTING — KEEP';
       else if(aliases.length)status='POSSIBLE MAKE ALIAS — HOLD';
       else if(original.length && legacyFormatValid)status='ARCHIVED CANDIDATE — READY FOR REVIEW';
       else if(original.length)status='LEGACY FORMAT CONFLICT — HOLD';
       else status='NOT IN EITHER SOURCE — HOLD';
       const id='manufacturer:'+mode.toLowerCase().replace(/\s+/g,'-')+':'+encodeURIComponent(make);
       if(ids.has(id))throw Error('Duplicate manufacturer event identity '+id);
       ids.add(id);
       items.push({id,make,mode,ownedCars:cars.length,carIds:cars.map(c=>c.id),status,
         oldSourceSlots:original.map(x=>Number(x.slot)),
         oldEventName:original.length?str(original[0].event):'',
         oldFormat:original.length?str(original[0].liveFormat):'',
         oldTrackHint:original.length?str(original[0].track||original[0].programme):'',
         currentEventIDs:currentExamples.get(key)||[],possibleAliasMakes:aliases,
         previewOnly:true,locked:false});
     }
   }
   sorted(items);
   const existing=items.filter(x=>x.status==='EXISTING — KEEP');
   const ready=items.filter(x=>x.status==='ARCHIVED CANDIDATE — READY FOR REVIEW');
   const blocked=items.filter(x=>x.status.endsWith('— HOLD'));
   const archiveOnly=items.filter(x=>x.oldSourceSlots.length&&!x.currentEventIDs.length);
   // User's past event versions can have case-different names; keep each distinct.
   // This is an audit, NOT authorisation to populate a playable tournament draw.
   const checks={
     currentManifestPairsMatched:existing.length===delta.currentMakerPairsAlreadyExist,
     archivedCandidateAndConflictsCount:archiveOnly.length===delta.legacyMakerPairsHeld,
     everyNormalMakeHasBothModes:items.length===source.normalPairedCandidates,
     noDuplicateCandidateIdentity:ids.size===items.length,
     onlyTwoOrMoreInNormalPools:items.every(x=>x.ownedCars>=2),
     allProposedCarsAreOwned:items.every(x=>x.carIds.length===x.ownedCars && x.carIds.every(id=>garage.cars.some(c=>str(c.id)===id))),
     originalProgrammeRetained:delta.oldR1Visits===source.activeR1Slots,
     lonelyHeartsNotDuplicated:delta.restoredLonelyHeartVisits<=9,
     stateUnchanged:immutable(st)===before
   };
   if(!Object.values(checks).every(Boolean))throw Error('Theme review FAILED: '+Object.keys(checks).filter(k=>!checks[k]).join(', '));
   return {readOnly:true,liveFH5Cars:garage.cars.length,currentR1Visits:source.activeR1Slots,
     totalNormalModePairs:items.length,existingInR1:existing.length,
     archivedReadyToReview:ready.length,archivedWithConflict:archiveOnly.length-ready.length,
     heldOther:blocked.length-(archiveOnly.length-ready.length),
     restoredLonelyHeartsVisits:delta.restoredLonelyHeartVisits,
     reviewCandidates:ready.map(x=>({...x})),holds:blocked.map(x=>({...x})),
     existingSamples:existing.slice(0,5),
     checks,liveSlotsAdded:0,officialMedalsPublished:0,secondChanceTicketsIssued:0,resetPerformed:false,
     note:'Archived candidates have real legacy Festival / Race Off definitions and rebuilt CURRENT live car rosters. They are NOT yet approved playable slots. Make aliases and unmatched manufacturer themes remain blocked.'};
 }
 window.rhEvil2ThemeReconcile8240={review};
})();
