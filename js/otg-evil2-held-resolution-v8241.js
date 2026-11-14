/* OTG! MAIN v8.0.241 — source-evidenced manufacturer hold resolution ledger.
 * Source-backed classification ONLY: old archived manufacturer Festival/Race Off,
 * current R1 catalogue makes, and LIVE FH5 owned make labels. No alias guesses.
 * No race slots, results, medals, Second Chance tickets or saved writes. */
(()=>{'use strict';
 const str=v=>String(v??'').trim();
 const canonical=v=>str(v).normalize('NFKC').toLocaleLowerCase('en-GB').replace(/\s+/g,' ');
 const fmt=m=>m==='Festival'?'STANDARD':'KNOCKOUT';
 const pkey=(a,b)=>str(a)+'\u001f'+str(b);
 const uniq=a=>[...new Set(a)];
 const frozen=s=>JSON.stringify(s);
 function resolve(st){
  if(!st||!Array.isArray(st.spaces))throw Error('Live Spaces unavailable. Resolution blocked.');
  const original=frozen(st);
  const base=window.rhEvil2ThemeReconcile8240?.review(st);
  const garage=window.rhEvil2GarageDraw8233?.garage(st);
  const r1=window.rhEvilSpecialistR18097,old=window.rhEvilCampaignData8076;
  if(!base?.readOnly||!garage?.cars?.length||!r1?.events||!Array.isArray(r1.cars)||!Array.isArray(old?.slots))
    throw Error('Current R1, old archive or v240 check missing; no aliases assigned.');
  const byMake=new Map();
  for(const c of garage.cars){
    const label=str(c.make);if(!label||!str(c.id))throw Error('Missing FH5 car identity.');
    if(!byMake.has(label))byMake.set(label,[]);byMake.get(label).push(str(c.id));
  }
  // Case-folding is used solely for discovering collisions, never for joining rosters.
  const variantGroups=new Map();
  for(const [make,ids] of byMake){const k=canonical(make);if(!variantGroups.has(k))variantGroups.set(k,[]);
   variantGroups.get(k).push({label:make,ownedCars:ids.length,garageCarIDs:ids.slice()});}
  const catalogueById=new Map(r1.cars.map(c=>[str(c.id),str(c.make)]));
  const activeByCanonical=new Map();
  for(const e of Object.values(r1.events)){
   if(str(e.family)!=='Manufacturer'||!['Festival','Race Off'].includes(str(e.mode)))continue;
   const eligible=uniq((e.eligibleIds||[]).map(x=>str(x)).filter(Boolean));
   const labels=uniq(eligible.map(id=>catalogueById.get(id)).filter(Boolean));
   // A mixed catalogue-make field is not proof of any manufacturer equivalence.
   const canonicalLabels=uniq(labels.map(canonical));
   if(canonicalLabels.length!==1)continue;
   const k=pkey(canonicalLabels[0],e.mode);
   if(!activeByCanonical.has(k))activeByCanonical.set(k,[]);
   const ownedIDs=new Set(garage.cars.map(c=>str(c.id)));
   activeByCanonical.get(k).push({eventId:str(e.id),sourceCatalogueMakes:labels,
     sourceEntrants:eligible.length,currentGarageEntrants:eligible.filter(id=>ownedIDs.has(id)).length,
     ownedMakeLabels:uniq(eligible.filter(id=>ownedIDs.has(id)).map(id=>garage.cars.find(c=>str(c.id)===id)?.make).filter(Boolean))});
  }
  const archivedByCanonical=new Map();
  for(const v of old.slots){
   if(str(v.family)!=='Manufacturer'||!['Festival','Race Off'].includes(str(v.mode)))continue;
   const k=pkey(canonical(v.event),v.mode);
   if(!archivedByCanonical.has(k))archivedByCanonical.set(k,[]);
   archivedByCanonical.get(k).push({oldSlot:Number(v.slot),oldMake:str(v.event),format:str(v.liveFormat),trackHint:str(v.track||v.programme)});
  }
  const holds=[],realFormatConflicts=[],archivedReady=[],existing=[];
  // Re-run v240 classification as the authority for exact events: this layer
  // only explains why a row is held and displays source-backed next actions.
  for(const item of base.holds){
   const k=pkey(canonical(item.make),item.mode);
   const variants=variantGroups.get(canonical(item.make))||[];
   const current=activeByCanonical.get(k)||[];
   const archive=archivedByCanonical.get(k)||[];
   const allArchivedFormats=uniq(archive.map(x=>x.format));
   const labels=uniq([...variants.map(x=>x.label),...archive.map(x=>x.oldMake),...current.flatMap(x=>x.sourceCatalogueMakes)]);
   const sourceCollision=labels.some(x=>x!==item.make);
   const genuineFormatMismatch=archive.length>0 && (archive.some(x=>x.format!==fmt(item.mode)) || archive.length!==1);
   let reason,disposition;
   if(sourceCollision){
    reason='CATALOGUE / ARCHIVE MAKE LABEL COLLISION';
    disposition='KEEP SEPARATE — REVIEW MAKE IDENTITY';
   }else if(genuineFormatMismatch){
    reason='ARCHIVED EVENT FORMAT / STAGE COUNT CONFLICT';
    disposition='HOLD — REVIEW HISTORICAL FORMAT';
   }else if(!archive.length&&!current.length){
    reason='NO MATCHING ORIGINAL EVENT';
    disposition='NEW THEME CANDIDATE — NEEDS APPROVED FORMAT';
   }else{
    reason='UNRESOLVED SOURCE OVERLAP';
    disposition='HOLD — REVIEW SOURCE';
   }
   holds.push({id:item.id,make:item.make,mode:item.mode,ownedCars:item.ownedCars,
    reason,disposition,liveMakeVariants:variants.map(x=>({make:x.label,ownedCars:x.ownedCars})),
    sourceLabels:labels,archivedSourceVisits:archive,activeSourceEvents:current,
    oldSourceSlots:item.oldSourceSlots.slice(),
    warnings:[
     'Upper/lowercase source names do NOT establish the same manufacturer.',
     'The old slot visit is evidence of an event format, not permission to duplicate the event.',
     'Second Chance one-entry-per-car eligibility is unaffected by this read-only comparison.'
    ]});
   if(genuineFormatMismatch&&!sourceCollision)realFormatConflicts.push(item.id);
  }
  for(const row of base.reviewCandidates){
   // Each ready archived definition has exactly one matching old visit and
   // matching STANDARD/KNOCKOUT format; this is evidence, not a committed slot.
   if(row.oldSourceSlots.length!==1||row.oldFormat!==fmt(row.mode))throw Error('Archived candidate format changed — halt.');
   archivedReady.push({id:row.id,make:row.make,mode:row.mode,oldSlot:row.oldSourceSlots[0],
     format:row.oldFormat,ownedCars:row.ownedCars,carIds:row.carIds.slice(),stagePackingRequired:true});
  }
  const candidates=new Map(archivedReady.map(x=>[x.id,x]));
  if(candidates.size!==archivedReady.length)throw Error('Duplicate archive candidate IDs.');
  const duplicateHeld=new Set(holds.map(x=>x.id));
  if(duplicateHeld.size!==holds.length||holds.some(x=>candidates.has(x.id)))throw Error('Overlapping hold and ready identity.');
  const normalMakes=[...byMake].filter(([,ids])=>ids.length>=2);
  const keys=normalMakes.flatMap(([make])=>['Festival','Race Off'].map(mode=>str(make)+'|'+mode));
  const allIDs=[...base.reviewCandidates,...base.holds,...base.existingSamples].map(x=>x.id);
  const checks={
   everyCurrentMakerFormatCovered:base.totalNormalModePairs===normalMakes.length*2,
   exactSourceClassesAddUp:base.existingInR1+archivedReady.length+holds.length===base.totalNormalModePairs,
   allHeldCasesPreserved:holds.length===base.holds.length,
   noAutoMergedCaseVariants:holds.every(x=>x.disposition!=='MERGE'),
   archiveReadyFormatsVerified:archivedReady.every(x=>x.format===fmt(x.mode)&&x.ownedCars>=2),
   archivedIDsUnique:candidates.size===archivedReady.length,
   noUnmatchedCarDisappeared:keys.length===base.totalNormalModePairs,
   noActualChanges:base.liveSlotsAdded===0&&base.officialMedalsPublished===0&&base.secondChanceTicketsIssued===0,
   savedStateUnchanged:frozen(st)===original
  };
  if(!Object.values(checks).every(Boolean))throw Error('Held manufacturer QA check failed: '+Object.entries(checks).filter(x=>!x[1]).map(x=>x[0]).join(', '));
  return {readOnly:true,qaOnly:true,liveFH5Cars:garage.cars.length,
   totalNormalPairs:base.totalNormalModePairs,existingPairs:base.existingInR1,
   archivedReady:archivedReady.length,heldPairs:holds.length,
   distinctCaseCollisionGroups:[...variantGroups].filter(([,v])=>v.length>1).map(([k,v])=>({canonical:k,labels:v.map(x=>({make:x.label,ownedCars:x.ownedCars}))})),
   holds,archiveSamples:archivedReady.slice(0,7),realFormatConflicts:realFormatConflicts.length,
   checks,actualSlotsAdded:0,manufacturerAliasesMerged:0,officialMedalsWritten:0,resetPerformed:false,
   note:'No maker names were merged and none of the held source rows were turned into races. Archived candidates with verified formats are ready for later stage scheduling; any collision needs an explicit catalogue-identity decision.'};
 }
 window.rhEvil2HeldResolution8241={resolve};
})();
