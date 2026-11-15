/* OTG! MAIN v8.0.239 — Read-only original-event delta and Lonely Hearts restoration BLUEPRINT.
 * Restore nine-stage historical format exactly once in a provisional schedule,
 * but redraw the six opening groups from CURRENT live one-car manufacturers.
 * Archive-only manufacturer themes are held, never silently copied into R1.
 * No live slots, results, medals, Garage edits, or storage writes. */
(()=>{'use strict';
 const t=v=>String(v??'').trim();
 const canon=v=>t(v).normalize('NFKC').toLocaleLowerCase('en-GB').replace(/\s+/g,' ');
 const clone=v=>JSON.parse(JSON.stringify(v));
 const unique=a=>[...new Set(a)];
 function oldType(x){return t(x.family)==='Manufacturer'&&['Festival','Race Off'].includes(t(x.mode));}
 function currentR1(saved,fh5,r1){
   let slots=r1.slots;
   if(saved.activeSpaceId===fh5.id&&fh5.evilCampaignR18098?.campaignId===r1.meta?.campaignId &&
      typeof window.rhEvilR1QA8103?.slots==='function'){
     const live=window.rhEvilR1QA8103.slots();
     if(Array.isArray(live)&&live.length>=r1.slots.length)slots=live;
   }
   if(!slots.every((v,i)=>Number(v.slot)===i+1))throw Error('Original R1 slot identity is not sequential — delta blocked.');
   return slots;
 }
 function make(saved){
  if(!saved||!Array.isArray(saved.spaces))throw Error('Saved Spaces missing.');
  const original=JSON.stringify(saved);
  const old=window.rhEvilCampaignData8076, r1=window.rhEvilSpecialistR18097;
  if(!Array.isArray(old?.slots)||!Array.isArray(r1?.slots)||!r1?.events)throw Error('Historical manifests not loaded.');
  const assembly=window.rhEvil2Assembly8238?.assemble(saved);
  const prior=window.rhEvil2OriginalManifest8236?.check(saved);
  const garage=window.rhEvil2GarageDraw8233?.garage(saved);
  if(!assembly?.previewOnly||!prior?.readOnly||!garage?.cars?.length)throw Error('Previous approved preview checks required.');
  const space=saved.spaces.find(x=>x.id===garage.spaceId),current=currentR1(saved,space,r1);
  if(assembly.originalCurrentVisits!==current.length)throw Error('Assembly source mismatch.');
  const isLonely=x=>/lonely\s*hearts?/i.test([x.family,x.event,x.eventId].map(t).join(' '));
  const activeLonely=current.filter(isLonely);
  const historical=old.slots.filter(isLonely);
  const groups=new Map(),stageTwo=new Map();let final=null;
  for(const visit of historical){
    const name=t(visit.event);
    let m=name.match(/^Lonely Hearts Cup\s*[—-]\s*Group\s+([A-F])$/i);
    if(m){if(groups.has(m[1]))throw Error('Duplicate earlier Lonely Hearts group '+m[1]);groups.set(m[1].toUpperCase(),visit);continue;}
    m=name.match(/^Lonely Hearts Cup\s*[—-]\s*Stage\s*2\s*Group\s+([AB])$/i);
    if(m){if(stageTwo.has(m[1]))throw Error('Duplicate earlier stage two group '+m[1]);stageTwo.set(m[1].toUpperCase(),visit);continue;}
    if(/Lonely Hearts Cup\s*[—-]\s*Final$/i.test(name)){if(final)throw Error('Duplicate earlier Lonely Hearts final');final=visit;continue;}
    throw Error('Unrecognised earlier Lonely Hearts stage: '+name);
  }
  if(historical.length!==9||groups.size!==6||stageTwo.size!==2||!final)throw Error('Original Lonely Hearts nine-stage plan incomplete.');
  // A partial live bracket should halt, not create a second complete bracket.
  if(activeLonely.length&&activeLonely.length!==9)throw Error('Live R1 has partial Lonely Hearts stages. Manual reconciliation required.');
  const groupLabels=['A','B','C','D','E','F'];
  const makerCars=new Map();for(const car of garage.cars){
   const m=t(car.make);if(!m||!t(car.id))throw Error('Incomplete owned Garage identity');
   if(!makerCars.has(m))makerCars.set(m,[]);makerCars.get(m).push(car);
  }
  const lonely=[...makerCars].filter(([,c])=>c.length===1).sort((a,b)=>a[0].localeCompare(b[0],'en-GB'));
  if(lonely.length<12)throw Error('Fewer than 12 single-car manufacturers; original six-group bracket cannot be safely drawn.');
  const distribution=groupLabels.map(()=>[]);
  lonely.forEach(([name,cars],i)=>distribution[i%6].push({make:name,carId:t(cars[0].id),carName:t(cars[0].name)}));
  const needRestore=activeLonely.length===0;
  const stages=[];
  for(let i=0;i<6;i++){
    const oldStage=groups.get(groupLabels[i]);
    stages.push({id:'lonely:group:'+groupLabels[i],name:'Lonely Hearts Cup — Group '+groupLabels[i],
      stage:'OPENING GROUP',oldSourceSlot:Number(oldStage.slot),oldSourceId:t(oldStage.id),
      trackProgramme:t(oldStage.track),entrants:distribution[i].length,
      cars:distribution[i],advancing:'Top two by cumulative time across the original three courses',
      insertAfterPercent:[10,21,31,43,54,62][i]});
  }
  const stage2Rules={A:'A1 + B2 + C1 + D2 + E1 + F2',B:'A2 + B1 + C2 + D1 + E2 + F1'};
  for(let i=0;i<2;i++){
   const letter=['A','B'][i],oldStage=stageTwo.get(letter);
   stages.push({id:'lonely:stage2:'+letter,name:'Lonely Hearts Cup — Stage 2 Group '+letter,
     stage:'SECOND STAGE',oldSourceSlot:Number(oldStage.slot),oldSourceId:t(oldStage.id),
     trackProgramme:t(oldStage.track),entrants:6,advancing:stage2Rules[letter]+' → top two',
     insertAfterPercent:[84,88][i]});
  }
  stages.push({id:'lonely:final',name:'Lonely Hearts Cup — Final',stage:'FINALS NIGHT',
      oldSourceSlot:Number(final.slot),oldSourceId:t(final.id),trackProgramme:t(final.track),
      entrants:4,advancing:'Top 2 from each Stage 2 group; crown champion',insertAfterPercent:97});
  // Do not assign actual production slots; placements are only an ordered hint.
  for(const stage of stages)stage.afterOriginalSlot=Math.max(1,Math.min(current.length,
      Math.round(stage.insertAfterPercent*current.length/100)));
  if(new Set(stages.map(x=>x.id)).size!==9 || new Set(stages.map(x=>x.afterOriginalSlot)).size!==9)
    throw Error('Suggested bracket staging collides: will not assign preview slots.');
  const existingCarIds=new Set(),allOriginalCarIds=[];
  for(const stage of stages.slice(0,6))for(const c of stage.cars){
    if(existingCarIds.has(c.carId))throw Error('Same car entered multiple Lonely Hearts groups.');
    existingCarIds.add(c.carId);allOriginalCarIds.push(c.carId);
  }
  const liveOneCarIds=lonely.map(([,c])=>t(c[0].id));
  if(new Set(allOriginalCarIds).size!==lonely.length||liveOneCarIds.some(id=>!existingCarIds.has(id)))
    throw Error('Not every current single-car manufacturer appears exactly once.');
  const archivePairs=new Map();for(const visit of old.slots){if(!oldType(visit))continue;
    const id=t(visit.event)+'|'+t(visit.mode);if(!archivePairs.has(id))archivePairs.set(id,[]);archivePairs.get(id).push(visit);
  }
  const catalogueMakes=new Map((r1.cars||[]).map(x=>[t(x.id),t(x.make)]));
  const activePairs=new Set();for(const e of Object.values(r1.events)){
    if(t(e.family)!=='Manufacturer'||!['Festival','Race Off'].includes(t(e.mode)))continue;
    const makes=unique((e.eligibleIds||[]).map(id=>catalogueMakes.get(t(id))).filter(Boolean));
    if(makes.length===1)activePairs.add(makes[0]+'|'+t(e.mode));
  }
  const early=[],unmatched=[],already=[];
  for(const [make,cars] of [...makerCars].filter(([,c])=>c.length>=2).sort((a,b)=>a[0].localeCompare(b[0],'en-GB'))){
    for(const mode of ['Festival','Race Off']){
      const k=make+'|'+mode,archive=archivePairs.get(k)||[];
      const el={make,mode,owned:cars.length,oldVisitCount:archive.length,
       oldExamples:archive.slice(0,3).map(v=>({oldSlot:v.slot,event:v.event,format:v.liveFormat}))};
      if(activePairs.has(k))already.push(el);
      else if(archive.length)early.push(el);
      else unmatched.push(el);
    }
  }
  const oldCounts=prior.manufacturerComparison;
  if(early.length!==oldCounts.legacyOnly||unmatched.length!==oldCounts.notMatched||already.length!==oldCounts.alreadyInR1)
    throw Error('Original producer and reconciliation counts disagree; cannot propose additions.');
  const restored=needRestore?stages:[];
  const checks={
    liveFH5GarageMatches:assembly.liveOwned===garage.cars.length,
    allExistingR1VisitsKept:assembly.originalCurrentVisits===current.length,
    historicalNineStageTemplate:historical.length===9&&stages.length===9,
    noDuplicateRestoration:restored.length===0||activeLonely.length===0,
    eachLiveLonelyMakerOnce:existingCarIds.size===lonely.length,
    allLonelyMakersExactlyOne:lonely.every(([,cars])=>cars.length===1),
    restoredSixGroupsThenTwoSemisThenFinal:stages.slice(0,6).every(x=>x.stage==='OPENING GROUP')&&stages[6].stage==='SECOND STAGE'&&stages[7].stage==='SECOND STAGE'&&stages[8].stage==='FINALS NIGHT',
    sourceMakePairsBalanced:early.length+unmatched.length+already.length===prior.normalPairedCandidates,
    noSilentlyAppendedOldMakerPairs:true,
    previewNoCeiling:assembly.provisionalPreviewRows+restored.length>=assembly.provisionalPreviewRows,
    stateUntouched:JSON.stringify(saved)===original
  };
  if(!Object.values(checks).every(Boolean))throw Error('Manifest delta blocked: '+Object.entries(checks).filter(([,v])=>!v).map(([k])=>k).join(', '));
  return {readOnly:true,finalised:false,liveCars:garage.cars.length,oldR1Visits:current.length,
    previousPreviewRows:assembly.provisionalPreviewRows,
    restoredLonelyHeartVisits:restored.length,
    provisionalPreviewRows:assembly.provisionalPreviewRows+restored.length,
    lonelyHeartsMakers:lonely.length,lonelyHeartsPreviewGroups:stages,
    legacyMakerPairsHeld:early.length,unmatchedMakerPairsHeld:unmatched.length,
    currentMakerPairsAlreadyExist:already.length,
    archiveOnlySamples:early.slice(0,10),unmatchedSamples:unmatched.slice(0,10),
    warnings:[
      'The six Lonely Hearts groups use all CURRENT one-car manufacturers, not frozen old entrant names.',
      'The old original three-course track programmes are carried only as a historical blueprint; no tracks are locked.',
      'Preview placements are suggested after old R1 visits, NOT actual sequential tournament slot IDs.',
      'Older-only manufacturer formats and unmatched candidates remain HELD FOR REVIEW, not automatically scheduled.',
      'The 2,000+ preview includes provisional gauntlet work orders and Long Jump attempts; Relay rounds, true race stages, Finals Nights and rolling Second Chance still need production packing.'
    ],checks,actualSlotsCreated:0,medalsPublished:0,resultsCreated:0,resetPerformed:false};
 }
 window.rhEvil2ManifestDelta8239={build:make};
})();
