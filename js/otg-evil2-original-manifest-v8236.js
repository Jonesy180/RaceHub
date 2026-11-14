/* OTG! MAIN 8.0.236 — read-only original-list reconciliation.
   Compare the active Specialist-First R1 programme with the retained 708-slot
   earlier Evil source BEFORE adding any new events. Not a production draw.
   Never clone the 708-slot archive into R1; the archive contains overlapping
   competitions and templates whose fields may have changed. */
(()=>{'use strict';
 const s=x=>String(x??'').trim();
 const norm=x=>s(x).toLocaleLowerCase('en-GB').normalize('NFKC').replace(/\s+/g,' ');
 const enc=x=>encodeURIComponent(x);
 const id=x=>s(x?.id);
 const clone=v=>JSON.parse(JSON.stringify(v));
 const uniq=(v)=>[...new Set(v)];
 const key=(make,mode)=>s(make)+'|'+s(mode);
 function check(st){
  if(!st||!Array.isArray(st.spaces))throw Error('No saved Spaces present. Event reconciliation blocked.');
  const before=JSON.stringify(st);
  const garage=window.rhEvil2GarageDraw8233?.garage(st);
  if(!garage||!garage.cars?.length)throw Error('Live FH5 Garage audit not available.');
  const eligibility=window.rhEvil2ManufacturerEligibility8235?.create(st);
  if(!eligibility?.readOnly)throw Error('Two-car and Lonely Hearts eligibility must pass first.');
  const legacy=window.rhEvilCampaignData8076, r1=window.rhEvilSpecialistR18097;
  if(!Array.isArray(legacy?.slots)||!Array.isArray(r1?.slots)||!r1.events)
    throw Error('One or both original Evil event source manifests are missing. Do not generate new events.');
  // The live R1 QA view includes separately inserted Swiss and Favourite visits.
  // Only call it when the FH5 Space already has an established R1 state. That
  // avoids implicitly creating a campaign state while running an audit.
  const fh5=st.spaces.find(x=>x.id===garage.spaceId),liveR1Available=
    st.activeSpaceId===garage.spaceId && fh5?.evilCampaignR18098?.campaignId===r1.meta?.campaignId &&
    typeof window.rhEvilR1QA8103?.slots==='function';
  let activeSlots=r1.slots,activeSlotsSource='SPECIALIST R1 BASE MANIFEST ONLY';
  if(liveR1Available){
    const v=window.rhEvilR1QA8103.slots();
    if(Array.isArray(v)&&v.length>=r1.slots.length){activeSlots=v;activeSlotsSource='LIVE EVIL R1 PROGRAMME (INCLUDES ADDENDA)';}
  }
  const legacySlots=legacy.slots;
  const legacyByName=new Map();
  for(const x of legacySlots){
    const k=norm(x.mode)+'|'+norm(x.family)+'|'+norm(x.event);
    if(!legacyByName.has(k))legacyByName.set(k,[]);
    legacyByName.get(k).push(x);
  }
  const r1ByEvent=new Map();
  for(const x of activeSlots){
    const eid=s(x.eventId)||'unnamed:'+norm(x.mode)+'|'+norm(x.family)+'|'+norm(x.event);
    if(!r1ByEvent.has(eid))r1ByEvent.set(eid,[]);
    r1ByEvent.get(eid).push(x);
  }
  const lonely=x=>/lonely\s*hearts?/i.test([x.family,x.event,x.eventId].map(s).join(' '));
  const oldLonely=legacySlots.filter(lonely),r1Lonely=activeSlots.filter(lonely);
  const finalLonely=oldLonely.filter(x=>/final/i.test(s(x.event)));
  const legacyMaker=new Set();
  for(const x of legacySlots)if(norm(x.family)==='manufacturer'&&['Festival','Race Off'].includes(s(x.mode)))
    legacyMaker.add(key(x.event,x.mode));
  const carsById=new Map((r1.cars||[]).map(x=>[s(x.id),s(x.make)]));
  const activeMaker=new Set(),ambiguous=[];
  for(const e of Object.values(r1.events)){
    if(norm(e?.family)!=='manufacturer'||!['Festival','Race Off'].includes(s(e.mode)))continue;
    const makes=uniq((e.eligibleIds||[]).map(x=>carsById.get(s(x))).filter(Boolean).map(s));
    if(makes.length===1)activeMaker.add(key(makes[0],e.mode));
    else ambiguous.push({id:id(e),event:s(e.event),makes:makes.slice(0,5)});
  }
  // Addenda with the same core families are rare; count those conservatively
  // without claiming old-archive overlap as a confirmed production duplicate.
  const liveMakeGroups=new Map();
  for(const c of garage.cars){const k=s(c.make);if(!liveMakeGroups.has(k))liveMakeGroups.set(k, {make:c.make,ids:[]});liveMakeGroups.get(k).ids.push(c.id);}
  const liveEligible=[...liveMakeGroups.values()].filter(x=>x.ids.length>=2).sort((a,b)=>a.make.localeCompare(b.make,'en-GB'));
  const aliasCandidates=new Map();
  for(const make of liveMakeGroups.keys()){const k=norm(make);if(!aliasCandidates.has(k))aliasCandidates.set(k,[]);aliasCandidates.get(k).push(make);}
  const caseVariantLabels=[...aliasCandidates.values()].filter(v=>v.length>1);
  const pairs=liveEligible.flatMap(x=>['Festival','Race Off'].map(mode=>{
    const k=key(x.make,mode);
    const inActive=activeMaker.has(k),inLegacy=legacyMaker.has(k);
    return{make:x.make,mode,candidateId:'manufacturer:'+norm(mode).replace(/ /g,'-')+':'+enc(x.make),owned:x.ids.length,
      inCurrentR1:inActive,inEarlierArchive:inLegacy,
      status:inActive?'ALREADY IN CURRENT R1':inLegacy?'EARLIER ARCHIVE — CHECK BEFORE ADDING':'NOT MATCHED IN EITHER MANIFEST'};
  }));
  const totals={alreadyInR1:pairs.filter(x=>x.inCurrentR1).length,legacyOnly:pairs.filter(x=>!x.inCurrentR1&&x.inEarlierArchive).length,notMatched:pairs.filter(x=>!x.inCurrentR1&&!x.inEarlierArchive).length};
  const sourcePairIDs=pairs.map(x=>x.candidateId);
  const checks={
    distinctLegacyAndR1Manifests:legacySlots!==r1.slots && legacySlots.length>0 && r1.slots.length>0,
    consecutiveR1SlotIds:activeSlots.every((x,i)=>Number(x.slot)===i+1),
    nonemptyLegacyLonelyHeartsBracket:oldLonely.length>0&&finalLonely.length>0,
    exactlyOneLonelyEligibleMakeRule:eligibility.lonelyHeartsCars===eligibility.lonelyHeartsManufacturers,
    noDuplicateCandidateIds:new Set(sourcePairIDs).size===pairs.length,
    allNormalManufacturersAccounted:pairs.length===eligibility.normalManufacturers*2,
    onlyTwoOrMoreCarsInPairedPools:pairs.every(x=>x.owned>=2),
    preservedAllLiveState:JSON.stringify(st)===before
  };
  if(!Object.values(checks).every(Boolean))throw Error('Original-list audit blocked: '+Object.entries(checks).filter(x=>!x[1]).map(x=>x[0]).join(', '));
  return{
    readOnly:true,officialSlotsAdded:0,drawLocked:false,legacySourceSlots:legacySlots.length,
    legacyUniqueEntries:legacyByName.size,originalR1SourceSlots:r1.slots.length,
    activeR1Slots:activeSlots.length,activeR1DistinctEventIds:r1ByEvent.size,
    activeR1Coverage:activeSlotsSource,legacyLonelyHeartVisits:oldLonely.length,
    legacyLonelyStages:oldLonely.map(x=>({slot:x.slot,title:x.event,stage:x.liveFormat})),
    liveR1LonelyVisits:r1Lonely.length,
    normalManufacturers:liveEligible.length,normalPairedCandidates:pairs.length,caseVariantLabels,
    manufacturerComparison:totals,
    archiveOnlyPairSamples:pairs.filter(x=>!x.inCurrentR1&&x.inEarlierArchive).slice(0,12),
    unmatchedPairSamples:pairs.filter(x=>!x.inCurrentR1&&!x.inEarlierArchive).slice(0,12),
    activePairSamples:pairs.filter(x=>x.inCurrentR1).slice(0,8),
    warnings:[
      'Legacy 708-slot source is a retained older competition template, NOT another whole playlist to append to R1.',
      'Lonely Hearts appeared in that legacy source; compare with the LIVE R1 programme before deciding whether its group stages must be carried forward.',
      'Manufacturer matches are made by live-owned make, mode and original R1 eligible-car IDs. Different ecosystems and field sizes require manual reconciliation.',
      'Archive-only and unmatched manufacturer candidates are NOT automatically new events. The actual draw must eliminate overlaps and preserve all historical themes.',
      'Current R1 source may grow with Favourite, Swiss and Hubbs addenda; current displayed slots are read live if possible, not hardcoded at 1,219.',
      'Some catalogue manufacturer labels may differ only in case (e.g. Mini / MINI). Keep them separate for now, but review aliases before final draw to avoid false Lonely Hearts or duplicates.',
      'One car may enter multiple Festival/Race Off events; the once-only restriction belongs to SECOND CHANCE admission only.'
    ],checks
  };
 }
 window.rhEvil2OriginalManifest8236={check};
})();
