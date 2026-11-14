/* OTG! MAIN v8.0.233 — read-only COMPLETE-SCOPE launch-safety rehearsal.
   PROHIBITED: modifying state, writing localStorage/IndexedDB, triggering rhSave,
   publishing medals, clearing results, or changing Evil Tournament progress.
   Reset simulation occurs ONLY on an ephemeral JSON COPY in memory. */
(()=>{'use strict';
 const ID='e2-launch-safety-v8231',PANEL='e2-launch-safe-screen-v8231';
 let lastScheduleQA=null,lastGarageQA=null,lastBlueprintQA=null,lastManufacturerQA=null,lastOriginalQA=null,lastAssemblyQA=null,lastDeltaQA=null,lastThemeQA=null;
 const clean=x=>String(x??'').trim();
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const array=v=>Array.isArray(v)?v:[];
 const count=v=>Array.isArray(v)?v.length:0;
 const keys=v=>v&&typeof v==='object'&&!Array.isArray(v)?Object.keys(v):[];
 const copy=v=>JSON.parse(JSON.stringify(v));
 const reportedFields=['runs','raceOffs','legacyResults','recordExclusions','recordBookExclusions','resultAudit8080','evilCampaign8076','evilCampaignR18098','fh5TrackBags8070'];
 const preservedFields=['id','name','cars','catalogueKey','catalogueTitle','catalogueOwned','catalogueLibrary','catalogueIdentityVersion','catalogueRepairVersion','catalogueMakeAliases','garageEntryMemory','backups','safetyBackup','evilHallOfShame8147','evilHallRewards8152','evilSecretSideMissions8163','evilConeBreaks8164','championshipDiscoveries','favouriteManufacturer','createdAt','fh6Planning','fh6SpecialistPrep'];
 const riskFields=['customEvents','leagues','raceSetups'];
 const schedule=Object.freeze({
   early:['32/64-car Race Offs','Manufacturer-only competitions','Car Type','Hot Wheels','Rally & Off-Road'],
   finals:['Major Group Championships','Mixed + Manufacturer Relays (NO Second Chance ticket)','Swiss Cups','Second Chance semifinals and Cup finals'],
   rolling:'A confirmed completed event awards medals first; one eligible car per event; car enters once; 4 unique entrants open a group; 4 groups open Cup semifinals.',
   ultimate:'All distinct individual Cup champions meet on a final Finals Night AFTER qualifying Cups have concluded.'
 });
 function liveState(){
   // OTG! core.js declares `let state`, so the live app state is a GLOBAL
   // LEXICAL BINDING, not necessarily `window.state`. Do not miss it.
   const s=(typeof state!=='undefined'&&state&&Array.isArray(state.spaces))?state:window.state;
   if(s&&Array.isArray(s.spaces)&&s.spaces.length)return s;
   throw Error('Saved OTG! Spaces are not available in this screen. Nothing was changed.');
 }
 function sourceSummary(space){return{
   id:clean(space.id),name:clean(space.name)||'Unnamed Space',cars:count(space.cars),owned:keys(space.catalogueOwned).length,
   catalogue:clean(space.catalogueKey)||'Custom',runs:count(space.runs),raceOffs:count(space.raceOffs),legacy:count(space.legacyResults),
   results:array(space.runs).reduce((sum,r)=>sum+count(r?.results),0)+array(space.raceOffs).reduce((sum,r)=>sum+array(r?.rounds).reduce((n,round)=>n+array(round?.matches).reduce((a,m)=>a+count(m?.attempts),0),0),0),
   oldEvil:Object.keys(space.evilCampaignR18098?.done||{}).length,
   custom:count(space.customEvents),leagues:count(space.leagues),backups:count(space.backups),
   privateFields:keys(space).filter(k=>/evilHall|evilSecret|evilCone|private|incident|discover|personal|gallery/i.test(k)),
   keyNames:keys(space)
 };}
 /* DRAFT ONLY. The destructive operation is intentionally NOT implemented.
    This transform is never applied to live data, and does not remove user backups.
    Source-of-truth and embedded historic results beyond reportedFields still need
    complete mapping before any actual reset can exist. */
 function draftReset(copyState){
   for(const s of array(copyState.spaces)){
     for(const f of ['runs','raceOffs','legacyResults','recordExclusions','recordBookExclusions','resultAudit8080']){
       if(Object.prototype.hasOwnProperty.call(s,f))s[f]=[];
     }
     for(const f of ['evilCampaign8076','evilCampaignR18098','fh5TrackBags8070']){
       if(Object.prototype.hasOwnProperty.call(s,f))delete s[f];
     }
   }
   return copyState;
 }
 function audit(state,qaStorageKeys=[]){
   if(!state||!Array.isArray(state.spaces)||!state.spaces.length)throw Error('At least one saved Space required.');
   const original=JSON.stringify(state),sums=state.spaces.map(sourceSummary),ids=sums.map(s=>s.id);
   if(ids.some(id=>!id)||new Set(ids).size!==ids.length)throw Error('Missing/duplicate Space identity. No changes possible.');
   const reset=draftReset(copy(state));
   for(let i=0;i<state.spaces.length;i++){
     const before=state.spaces[i],after=reset.spaces[i];
     for(const k of preservedFields){
       if(JSON.stringify(before[k])!==JSON.stringify(after[k]))throw Error('Preservation FAIL: '+k+' changed in '+clean(before.name));
     }
     if(after.runs?.length||after.raceOffs?.length||after.legacyResults?.length||after.resultAudit8080?.length||after.recordExclusions?.length||after.recordBookExclusions?.length||after.evilCampaign8076||after.evilCampaignR18098||after.fh5TrackBags8070)throw Error('Simulation missed known racing history in '+clean(before.name));
   }
   if(JSON.stringify(state)!==original)throw Error('LIVE state altered during dry run — halted!');
   for(const k of keys(state))if(k!=='spaces'&&JSON.stringify(state[k])!==JSON.stringify(reset[k]))throw Error('Top-level state altered: '+k);
   const risks=[];
   for(const sp of sums){for(const f of riskFields)if(sp.keyNames.includes(f)&&((Array.isArray(state.spaces.find(s=>s.id===sp.id)?.[f])&&state.spaces.find(s=>s.id===sp.id)[f].length)||(!Array.isArray(state.spaces.find(s=>s.id===sp.id)?.[f])&&keys(state.spaces.find(s=>s.id===sp.id)?.[f]).length)))risks.push(sp.name+': '+f+' requires results audit');
    const candidates=sp.keyNames.filter(k=>!reportedFields.includes(k)&&!preservedFields.includes(k)&&!riskFields.includes(k)&&/race|result|record|tim(e|ing)|stat|medal|honou?r|campaign|event|round|trophy|history|leader|gauntlet|relay|jump|swiss|evil2/i.test(k));
    for(const k of candidates)risks.push(sp.name+': unmapped possible racing key '+k);
   }
   const totals=sums.reduce((a,s)=>{for(const k of ['cars','runs','raceOffs','legacy','results','oldEvil','owned','backups'])a[k]+=s[k];return a;},{cars:0,runs:0,raceOffs:0,legacy:0,results:0,oldEvil:0,owned:0,backups:0});
   return{spaces:sums,totals,qaKeys:qaStorageKeys.slice(),preservationPass:true,simulationPass:true,originalUnchanged:true,
     knownCoverage:reportedFields.slice(),preservedFields:preservedFields.slice(),unknownRisks:[...new Set(risks)],
     blockers:[
       'Second Chance currently stores QA-only race times; a distinct production event store and automatic finished-source enrolment are not activated.',
       'Official medal publication and career-history projection are read-only; production completed-event adapters and Ultimate Finals seal are not activated.',
       'The retained old Evil event sources must be reconciled so existing themes (including Lonely Hearts) are not lost or duplicated.',
       'The live FH5 schedule blueprint is still NOT a complete Evil 2.0 draw: Race Off/Swiss/Groups/specials, live Second Chance triggers, exact stage slots, track allocations and actual Finals Nights remain uncommitted.',
       'Full results reset across ALL Spaces has not been implemented or tested end-to-end; unknown stored racing fields still require mapping.',
       'Safe restore test of the exported portable backup and verification of private browser-only content must be completed before approval.'
     ],schedule,ready:false};
 }
 function storageQAKeys(){try{const keys=[];for(let i=0;i<window.localStorage.length;i++){const k=window.localStorage.key(i);if(k&&k.startsWith('otg.secondchance.qa.v1:'))keys.push(k);}return keys;}catch(_){return[];}}
 function report(){return audit(liveState(),storageQAKeys());}
 function badge(value){return '<b>'+esc(value)+'</b>';}
 function row(label,value){return '<div class="e2s-row"><span>'+esc(label)+'</span><span>'+esc(value)+'</span></div>';}
 function render(r,notice){
   let s='<div class="e2safe-inner"><button class="e2s-back" type="button" data-e2s="close">← BACK TO FESTIVAL</button><h2>🏁 EVIL 2.0 — LAUNCH SAFETY</h2><p><b>v8.0.240 · READ-ONLY PREFLIGHT.</b> No results, Garage ownership, trophies or settings are changed by this check.</p>';
   if(notice)s+='<div class="e2s-ok">'+esc(notice)+'</div>';
   s+='<div class="e2s-red"><b>LIVE LAUNCH: NOT YET CLEARED</b><p>Passing a simulation is NOT approval to reset your racing history. Production connections and safety gates below remain open.</p></div>';
   s+='<div class="e2s-numbers"><div>'+badge(r.spaces.length)+'<small>SPACES AUDITED</small></div><div>'+badge(r.totals.cars)+'<small>GARAGE CARS PRESERVED</small></div><div>'+badge(r.totals.oldEvil)+'<small>HISTORIC EVIL SLOTS IDENTIFIED</small></div></div>';
   s+='<div class="e2s-box"><h3>All-Space results inventory</h3>';
   for(const sp of r.spaces)s+=row(sp.name,sp.cars+' cars · '+sp.runs+' runs · '+sp.raceOffs+' Race Offs · '+sp.legacy+' legacy results');
   s+='<p class="e2s-small">The draft reset includes normal racing, ALL saved Spaces and their historical competition data. Existing backups are preserved for recovery, not counted as active racing history.</p></div>';
   s+='<div class="e2s-box"><h3>Reset simulation — NO SAVING</h3>';
   s+='<p>Only an in-memory clone is changed. It removes known past runs, Race Offs, normal results, old Evil slots, audit records and track-use history on that clone.</p>';
   s+='<p class="e2s-ok">PASS: All '+r.spaces.length+' Space identities, '+r.totals.cars+' Garage cars, catalogues, owned flags, settings, manual backups and private content fields are preserved in the rehearsal. Live state unchanged.</p>';
   s+='<p>QA Second Chance keys detected: '+r.qaKeys.length+'. These remain isolated from any future official career history.</p>';
   if(r.unknownRisks.length)s+='<p class="e2s-red"><b>Unmapped history to inspect:</b> '+esc(r.unknownRisks.slice(0,10).join('; '))+(r.unknownRisks.length>10?' (and '+(r.unknownRisks.length-10)+' others)':'')+'</p>';
   else s+='<p class="e2s-small">No extra racing-looking Space keys were identified by the preliminary scanner. This is not proof that all nested racing data has been mapped.</p>';
   s+='</div><div class="e2s-box"><h3>Competition scheduling — agreed rules</h3>';
   s+=row('Finish throughout main list',r.schedule.early.join(' · '));
   s+=row('Generally Finals Nights',r.schedule.finals.join(' · '));
   s+='<p>'+esc(r.schedule.rolling)+'</p><p>'+esc(r.schedule.ultimate)+'</p>';
   s+='</div><div class="e2s-box"><h3>Uncapped Evil 2.0 scheduler — QA only</h3>';
   const engine=window.rhEvil2SlotPlanner8232;
   try{const inv=engine.inventory(liveState());
     if(inv.found){s+=row('FH5 eligible Garage cars',String(inv.ownedCars));
       s+=row('Manufacturers with 3+ cars',String(inv.manufacturerCandidates));
       s+=row('Car Type fields',String(inv.typeFields));
       s+='<p class="e2s-small">'+esc(inv.note)+'</p>';
     }else s+='<p>'+esc(inv.note)+'</p>';
   }catch(err){s+='<p class="e2s-red">Garage scan unavailable: '+esc(err.message)+'</p>';}
   s+='<p><b>No 1,219 ceiling.</b> The old total is historic. Real event slots will be numbered sequentially as approved competition rounds become known. Rolling Second Chance groups can be inserted after four genuine qualifiers; major finals are reserved for Finals Nights.</p>';
   s+='<p><b>This screen does not build the production draw.</b> Actual competition counts, slot packing, track allocation and release dependencies still require the complete generator.</p>';
   s+='<button type="button" data-e2s="schedule">RUN UNCAPPED SLOT TEST — READ ONLY</button>';
   if(lastScheduleQA){const q=lastScheduleQA;
     s+='<div class="e2s-ok"><b>PASS: '+esc(q.highestSlot)+' sequential synthetic slots; no fixed ceiling.</b>';
     s+='<p>'+esc(q.completedSourceFixtures)+' imaginary completed events → '+esc(q.groups)+' groups, '+esc(q.cups)+' Cup knockout packets; '+esc(q.lateFinals)+' deferred Finals Night stages.</p>';
     s+='<p>Old locked slots remain unchanged; duplicate cars, source events, relays and unfinished events blocked. No results saved.</p></div>';
   }
   s+='</div><div class="e2s-box"><h3>Live FH5 Garage-based entry audit — QA only</h3>';
   s+='<p>Uses the REAL owned FH5 cars to rehearse candidate Gauntlets, Mixed/Manufacturer Relay rosters and one-attempt Long Jump. This preview is NOT the full tournament draw or a final slot count. No draw is frozen or stored.</p>';
   s+='<button type="button" data-e2s="garage">RUN LIVE FH5 GARAGE DRAW CHECK — READ ONLY</button>';
   if(lastGarageQA){const d=lastGarageQA;
     s+='<div class="e2s-ok"><b>PASS: '+esc(d.carCount)+' real FH5 cars checked; '+esc(d.previewJobs)+' uncommitted opening job candidates.</b>';
     s+='<p>'+esc(d.manufacturerGauntletCount)+' manufacturer Gauntlet fields · '+esc(d.typeGauntletCount)+' Car Type fields · '+esc(d.manufacturerRelayCount)+' manufacturer relay teams · '+esc(d.mixedRelayCount)+' mixed relay teams · '+esc(d.jumpAttempts)+' single-attempt Long Jump entrants.</p>';
     s+='<p>'+esc(d.mixedUnallocated)+' unused Mixed Relay cars; '+esc(d.lonelyHeartMakers)+' one-car manufacturers. Every validation passed.</p></div>';
     s+='<h4>Opening job candidates — sample only</h4>';
     for(const j of d.firstJobs.slice(0,12))s+=row('#'+j.number+' '+j.kind,j.stage+(j.entrants>1?' · '+j.entrants+' entrants':''));
     s+='<p class="e2s-small">The preview is repeatable for the same Garage and seed. No official event slots are committed. Race Offs, Swiss, Group Championships and specials still require draw integration; rolling Second Chance depends on future completed results.</p>';
   }
   s+='</div><div class="e2s-box"><h3>Dashboard Evil tile — approved launch handover</h3>';
   s+='<p><b>Keep the EXISTING dashboard Evil Tournament tile, artwork, size and position.</b> On the authorised Evil 2.0 launch only, its destination will become the new 2.0 tournament screen. No duplicate dashboard tile.</p>';
   s+='<p class="e2s-ok"><b>NOW:</b> Old Evil tile still opens the old campaign. The new competition mechanics and this planning audit remain in Festival for testing. Nothing is switched or retired in v8.0.236.</p>';
   s+='</div><div class="e2s-box"><h3>Live Garage schedule blueprint — QA ONLY</h3>';
   s+='<p>Uses real FH5 owned cars to assemble a repeatable work-order outline, rotating eligible Manufacturer Gauntlet fields, Car Type fields and Long Jump single attempts. Relay rosters are counted as teams in TWO championships — not hundreds of extra events.</p>';
   s+='<button type="button" data-e2s="blueprint">RUN REAL GARAGE SCHEDULE BLUEPRINT — READ ONLY</button>';
   if(lastBlueprintQA){const p=lastBlueprintQA;
     s+='<div class="e2s-ok"><b>PASS: '+esc(p.carCount)+' FH5 cars, '+esc(p.provisionalWorkOrders)+' Garage-backed work orders; '+esc(p.relayChampionshipBlueprints)+' Relay championship blueprints.</b>';
     s+='<p>'+esc(p.manufacturerGauntletFields)+' Manufacturer fields · '+esc(p.carTypeGauntletFields)+' Type fields · '+esc(p.longJumpSingleAttempts)+' one-attempt Long Jump entries.</p>';
     s+='<p>'+esc(p.manufacturerRelayTeams)+' Manufacturer teams and '+esc(p.mixedRelayTeams)+' Mixed teams remain entrants within two Relay competitions, not separately counted event slots.</p>';
     s+='<p>ALL invariants pass; existing car ownership, racing results and Space state unchanged.</p></div>';
     s+='<h4>Provisional opening work order (real owned cars)</h4>';
     for(const x of p.sample.slice(0,12))s+=row('#'+x.order+' '+x.family,x.title+' · '+x.entrants+' entrant'+(x.entrants===1?'':'s'));
     s+='<p class="e2s-small"><b>NOT the final slot total.</b> Remaining unresolved event families, track choices, actual race counts, Finals Nights and genuine Second Chance triggers still prevent a production draw.</p>';
   }
   s+='</div><div class="e2s-box"><h3>Original Evil event lists — source reconciliation QA</h3>';
   s+='<p><b>FIRST CHECK WHAT ALREADY EXISTS.</b> Compares the EARLIER 708-slot Evil list with the CURRENT Specialist-First campaign and its dynamic additions. It will not copy either list or create any new event.</p>';
   s+='<button type="button" data-e2s="original">COMPARE BOTH ORIGINAL EVIL LISTS — READ ONLY</button>';
   if(lastOriginalQA){const a=lastOriginalQA,c=a.manufacturerComparison;
     s+='<div class="e2s-ok"><b>PASS: '+esc(a.legacySourceSlots)+' archived slots and '+esc(a.activeR1Slots)+' current R1 slots compared.</b>';
     s+='<p>Current R1 source: '+esc(a.activeR1Coverage)+'. '+esc(a.activeR1DistinctEventIds)+' distinct current event IDs.</p>';
     s+='<p>💔 Lonely Hearts: <b>'+esc(a.legacyLonelyHeartVisits)+' archived visits</b> (including its final); <b>'+esc(a.liveR1LonelyVisits)+' currently identified R1 visits</b>.</p>';
     s+='<p>Manufacturer Festival / Race Off candidates: '+esc(a.normalPairedCandidates)+' potential make/format pairs. '+esc(c.alreadyInR1)+' already in current R1 source; '+esc(c.legacyOnly)+' found only in older source; '+esc(c.notMatched)+' not matched in either source.</p></div>';
     if(a.caseVariantLabels.length)s+='<p class="e2s-small"><b>MAKE-NAME ALIAS REVIEW:</b> '+esc(a.caseVariantLabels.map(x=>x.join(' / ')).join('; '))+'. Catalogue labels are preserved separately pending final eligibility audit.</p>';
     s+='<h4>Earlier Lonely Hearts bracket — retained as a template, NOT inserted</h4>';
     for(const x of a.legacyLonelyStages.slice(0,9))s+=row('Old #'+x.slot,x.title);
     s+='<h4>Manufacturer modes present only in the older source — examples</h4>';
     for(const x of a.archiveOnlyPairSamples.slice(0,8))s+=row(x.make+' · '+x.mode,'Check original event before adding');
     s+='<h4>Manufacturer modes not matched in either source — examples</h4>';
     for(const x of a.unmatchedPairSamples.slice(0,8))s+=row(x.make+' · '+x.mode,'Needs explicit draw decision');
     s+='<p class="e2s-small"><b>Nothing has been added or deleted.</b> Two different historical manifests do not equal two tournaments to concatenate. We must reconcile each event and redraw eligible cars before creating the new uncapped playlist.</p>';
   }
   s+='</div><div class="e2s-box"><h3>MONSTER ASSEMBLY — existing Evil R1 + NEW real-Garage work orders</h3>';
   s+='<p><b>No duplicates, no reset.</b> This read-only interleaved preview keeps each current R1 visit in order and adds only new-format candidate work orders. It is NOT the final playable slot list.</p>';
   s+='<button type="button" data-e2s="assembly">ASSEMBLE MONSTER PREVIEW — READ ONLY</button>';
   if(lastAssemblyQA){const a=lastAssemblyQA;
     s+='<div class="e2s-ok"><b>PASS: '+esc(a.liveOwned)+' live FH5 cars · '+esc(a.originalCurrentVisits)+' original R1 visits preserved · '+esc(a.draftWorkOrders)+' NEW format work orders.</b>';
     s+='<p>'+esc(a.provisionalPreviewRows)+' sequential preview rows — NOT actual numbered tournament slots.</p>';
     s+='<p>'+esc(a.makeGauntletFields)+' manufacturer Gauntlet fields · '+esc(a.typeGauntletFields)+' type Gauntlet fields · '+esc(a.longJumpAttemptCandidates)+' individual Long Jump candidates.</p>';
     s+='<p>Two Relay championship blueprints ('+esc(a.relayManufacturerTeams)+' manufacturer teams, '+esc(a.relayMixedTeams)+' mixed teams) are NOT mistaken for individual events.</p>';
     s+='<p>Lonely Hearts: '+esc(a.oldLonelyHearts)+' older bracket visits, '+esc(a.currentLonelyHearts)+' current R1 visits, '+esc(a.lonelyHeartsEligibleMakers)+' one-car manufacturers. <b>Zero Lonely Hearts duplicates generated.</b></p>';
     s+='<p>Manufacturer Festival/Race Off themes: '+esc(a.makerFormatExistingR1)+' already in current list; '+esc(a.makerFormatLegacyOnly)+' older-only; '+esc(a.makerFormatUnmatched)+' unmatched — these are held for reconciliation.</p>';
     if(a.unresolvedPotentialDuplicates)s+='<p><b>HOLD:</b> '+esc(a.unresolvedPotentialDuplicates)+' possible overlapping new-format entries require manual validation.</p>';
     s+='</div><h4>First provisional queue entries</h4>';
     for(const x of a.sample.slice(0,16))s+=row('Preview #'+x.number+' · '+x.kind,x.title+(x.originalSlot?' · old #'+x.originalSlot:''));
     s+='<p class="e2s-small"><b>Launch still blocked:</b> real race stages, early finals, final tracks, rolling Second Chance triggers, full honours and backup/reset all need production integration. Current dashboard remains old Evil.</p>';
   }
   s+='</div><div class="e2s-box"><h3>ORIGINAL EVENT DELTA — Lonely Hearts bracket restoration (READ ONLY)</h3>';
   s+='<p>The older Evil list had a six-group / two-second-stage / final Lonely Hearts Cup. If missing from live R1, restore <b>ONE</b> nine-visit bracket using your current one-car manufacturers. Older-only Festival / Race Off themes are held for review rather than duplicated.</p>';
   s+='<button type="button" data-e2s="delta">RECONCILE MISSING EVENTS — READ ONLY</button>';
   if(lastDeltaQA){const d=lastDeltaQA;
     s+='<div class="e2s-ok"><b>PASS: '+esc(d.liveCars)+' live FH5 cars · '+esc(d.oldR1Visits)+' current R1 visits · '+esc(d.restoredLonelyHeartVisits)+' Lonely Hearts bracket visits to restore.</b>';
     s+='<p>'+esc(d.previousPreviewRows)+' existing provisional rows + '+esc(d.restoredLonelyHeartVisits)+' restored bracket visits = <b>'+esc(d.provisionalPreviewRows)+' provisional preview entries</b> — NOT locked race slots.</p>';
     s+='<p>'+esc(d.lonelyHeartsMakers)+' current ONE-car manufacturers are placed once across six opening groups. No extra Lonely Hearts Cup.</p>';
     s+='<p>Manufacturer themes: '+esc(d.currentMakerPairsAlreadyExist)+' already in current R1; '+esc(d.legacyMakerPairsHeld)+' older-only held; '+esc(d.unmatchedMakerPairsHeld)+' unmatched held. <b>None silently added.</b></p></div>';
     s+='<h4>Restored Lonely Hearts structure — proposed only</h4>';
     for(const stage of d.lonelyHeartsPreviewGroups){const description=stage.stage==='OPENING GROUP'?stage.entrants+' current cars · after old R1 #'+stage.afterOriginalSlot:stage.advancing+' · after old R1 #'+stage.afterOriginalSlot;
       s+=row(stage.name,description);}
     s+='<h4>Earlier manufacturer themes needing review — examples</h4>';
     for(const x of d.archiveOnlySamples.slice(0,7))s+=row(x.make+' · '+x.mode,x.oldVisitCount+' earlier visit(s), NOT added');
     if(d.unmatchedSamples.length){s+='<h4>Unmatched live manufacturer themes</h4>';for(const x of d.unmatchedSamples.slice(0,6))s+=row(x.make+' · '+x.mode,'Not in either source — HOLD');}
     s+='<p class="e2s-small"><b>NOT THE LIVE DRAW.</b> Current cars are used; old bracket tracks are suggestions, and the early/late staging is provisional. No tickets, medals, races, real slot numbers or resets were created.</p>';
   }
   s+='</div><div class="e2s-box"><h3>MANUFACTURER EVENT DELTA — LIVE GARAGE REVIEW (READ ONLY)</h3>';
   s+='<p>Rebuilds the original Manufacturer Festival and Race Off candidate definitions from the earlier source against your CURRENT FH5 cars. Existing R1 competitions are kept; archived candidates are marked for review and ambiguous aliases remain held. No automatic addition.</p>';
   s+='<button type="button" data-e2s="themes">REVIEW ARCHIVED MANUFACTURER THEMES — READ ONLY</button>';
   if(lastThemeQA){const v=lastThemeQA;
     s+='<div class="e2s-ok"><b>PASS: '+esc(v.liveFH5Cars)+' live cars · '+esc(v.totalNormalModePairs)+' normal manufacturer/format pairs checked.</b>';
     s+='<p>'+esc(v.existingInR1)+' already in current Evil R1 · '+esc(v.archivedReadyToReview)+' archived source candidates prepared (NOT added) · '+esc(v.archivedWithConflict)+' archived format/alias conflicts held · '+esc(v.heldOther)+' other held/unmatched.</p>';
     s+='<p>'+esc(v.restoredLonelyHeartsVisits)+' Lonely Hearts bracket visits remain a SEPARATE single restore proposal. No duplicate.</p>';
     s+='<p><b>ZERO actual events inserted; ZERO medals or results written.</b></p></div>';
     s+='<details><summary>Archived Festival / Race Off candidate definitions ('+esc(v.archivedReadyToReview)+') — tap to expand</summary>';
     for(const x of v.reviewCandidates)s+=row(x.make+' · '+x.mode,'Old #'+x.oldSourceSlots.join(',')+' · '+x.ownedCars+' live cars · '+x.oldFormat);
     s+='</details>';
     if(v.holds.length){s+='<details><summary>Blocked or unmatched candidates ('+esc(v.holds.length)+') — tap to expand</summary>';
       for(const x of v.holds)s+=row(x.make+' · '+x.mode,x.status+(x.possibleAliasMakes.length?' · alias: '+x.possibleAliasMakes.join(', '):''));
       s+='</details>';}
     s+='<p class="e2s-small">These are archived COMPETITION CANDIDATES, NOT newly numbered slots. Each knockout may require multiple race rounds. 2.0 schedule packing and actual draws are still unfinished.</p>';
   }
   s+='</div><div class="e2s-box"><h3>Lonely Hearts + Festival / Race Off manufacturer eligibility — QA ONLY</h3>';
   s+='<p><b>Corrected rule: Lonely Hearts is for EXACTLY ONE owned car per manufacturer.</b> Two or more enter the normal manufacturer pools. A three-car manufacturer Relay team still needs three cars.</p>';
   s+='<p>For each qualifying maker, Festival and Race Off are separate possible event themes. This is a preview — original Evil events must be reconciled before any event is added twice.</p>';
   s+='<button type="button" data-e2s="manufacturer">RUN MANUFACTURER ELIGIBILITY CHECK — READ ONLY</button>';
   if(lastManufacturerQA){const a=lastManufacturerQA;
     s+='<div class="e2s-ok"><b>PASS: '+esc(a.manufacturerCount)+' makers · '+esc(a.lonelyHeartsManufacturers)+' Lonely Hearts (exactly one car) · '+esc(a.normalManufacturers)+' normal makers (2+).</b>';
     s+='<p>'+esc(a.exactlyTwoCarManufacturers)+' manufacturers have exactly two cars and remain in normal Festival/Race Off candidate pools.</p>';
     s+='<p>'+esc(a.festivalThemeCandidates)+' Festival + '+esc(a.raceOffThemeCandidates)+' Race Off manufacturer-theme candidates. <b>'+esc(a.pairedFormatCandidates)+' total candidate identities, NOT scheduled race slots.</b></p>';
     s+='<p>'+esc(a.relayEligibleManufacturers)+' makers have 3+ cars and can supply a three-car Manufacturer Relay team. Every invariant passed; nothing saved.</p></div>';
     s+='<h4>Lonely Hearts examples — one car each</h4>';
     for(const x of a.lonelySamples.slice(0,7))s+=row(x.name,x.car);
     s+='<h4>Two-car manufacturers — NOT Lonely Hearts</h4>';
     for(const x of a.twoCarSamples.slice(0,10))s+=row(x.name,'2 cars · Festival & Race Off eligible');
     s+='<p class="e2s-small"><b>Not an official draw.</b> No cars, results, actual slots, medals or Second Chance tickets were created. The per-car once-only rule applies to Second Chance Cup entry, not to ordinary tournament formats.</p>';
   }
   s+='</div><div class="e2s-box"><h3>Production launch blockers — OPEN</h3>';
   for(let i=0;i<r.blockers.length;i++)s+='<p>⛔ '+esc(r.blockers[i])+'</p>';
   s+='</div><button type="button" data-e2s="rerun">RUN SAFETY SIMULATION AGAIN (READ-ONLY)</button><p class="e2s-small">NO RESET BUTTON EXISTS IN THIS VERSION. A separate launch release and your explicit approval are required.</p></div>';
   return s;
 }
 function screen(){let el=document.getElementById(PANEL);if(!el){el=document.createElement('div');el.id=PANEL;el.className='e2safe-screen';el.hidden=true;document.body.appendChild(el);}return el;}
 function hide(){const el=document.getElementById(PANEL);if(el){el.hidden=true;el.style.display='none';}document.getElementById('festival')?.classList.remove('hidden');}
 function show(){const el=screen();el.hidden=false;el.style.display='block';document.getElementById('festival')?.classList.add('hidden');try{el.innerHTML=render(report(),'');}catch(e){el.innerHTML='<button type="button" data-e2s="close">← BACK</button><h2>Safety audit blocked</h2><p>'+esc(e.message)+'</p>';}}
 function clicked(e){const btn=e.target.closest('button[data-e2s]');if(!btn)return;
   if(btn.dataset.e2s==='close'){hide();return;}
   if(btn.dataset.e2s==='rerun'){try{const el=screen();el.innerHTML=render(report(),'READ-ONLY SIMULATION PASSED. Live career history was not changed.');}catch(err){screen().innerHTML='<button type="button" data-e2s="close">← BACK</button><p>BLOCKED: '+esc(err.message)+'</p>';}}
   if(btn.dataset.e2s==='garage'){try{lastGarageQA=window.rhEvil2GarageDraw8233.create(liveState());screen().innerHTML=render(report(),'LIVE FH5 GARAGE DRAW AUDIT PASSED. NO CHANGES SAVED.');}catch(err){lastGarageQA=null;screen().innerHTML=render(report(),'GARAGE DRAW BLOCKED: '+err.message);}}
   if(btn.dataset.e2s==='original'){try{lastOriginalQA=window.rhEvil2OriginalManifest8236.check(liveState());screen().innerHTML=render(report(),'ORIGINAL EVIL SOURCE RECONCILIATION PASSED. NOTHING ADDED.');}catch(err){lastOriginalQA=null;screen().innerHTML=render(report(),'ORIGINAL SOURCE RECONCILIATION BLOCKED: '+err.message);}}
   if(btn.dataset.e2s==='assembly'){try{lastAssemblyQA=window.rhEvil2Assembly8238.assemble(liveState());screen().innerHTML=render(report(),'MONSTER QUEUE PREVIEW PASSED. NO REAL RACING SLOTS CREATED.');}catch(err){lastAssemblyQA=null;screen().innerHTML=render(report(),'MONSTER ASSEMBLY BLOCKED: '+err.message);}}
   if(btn.dataset.e2s==='delta'){try{lastDeltaQA=window.rhEvil2ManifestDelta8239.build(liveState());screen().innerHTML=render(report(),'ORIGINAL EVENT DELTA PASSED. NINE-STAGE LONELY HEARTS BLUEPRINT RECONCILED; NOTHING SAVED.');}catch(err){lastDeltaQA=null,lastThemeQA=null;screen().innerHTML=render(report(),'ORIGINAL EVENT DELTA BLOCKED: '+err.message);}}
   if(btn.dataset.e2s==='themes'){try{lastThemeQA=window.rhEvil2ThemeReconcile8240.review(liveState());screen().innerHTML=render(report(),'MANUFACTURER EVENT DELTA CHECK PASSED. NO EVENTS ADDED.');}catch(err){lastThemeQA=null;screen().innerHTML=render(report(),'MANUFACTURER EVENT DELTA BLOCKED: '+err.message);}}
   if(btn.dataset.e2s==='manufacturer'){try{lastManufacturerQA=window.rhEvil2ManufacturerEligibility8235.create(liveState());screen().innerHTML=render(report(),'LONELY HEARTS / MANUFACTURER ELIGIBILITY PASSED. NO SAVED CHANGES.');}catch(err){lastManufacturerQA=null;screen().innerHTML=render(report(),'MANUFACTURER ELIGIBILITY BLOCKED: '+err.message);}}
   if(btn.dataset.e2s==='blueprint'){try{lastBlueprintQA=window.rhEvil2ScheduleBlueprint8234.create(liveState());screen().innerHTML=render(report(),'REAL GARAGE SCHEDULE BLUEPRINT PASSED. NOT A PRODUCTION DRAW.');}catch(err){lastBlueprintQA=null;screen().innerHTML=render(report(),'SCHEDULE BLUEPRINT BLOCKED: '+err.message);}}
   if(btn.dataset.e2s==='schedule'){try{lastScheduleQA=window.rhEvil2SlotPlanner8232.stress(1400);screen().innerHTML=render(report(),'UNCAPPED SLOT TEST PASSED. All data remained unchanged.');}catch(err){lastScheduleQA=null;screen().innerHTML=render(report(),'SLOT CHECK BLOCKED: '+err.message);}}
 }
 function mount(){const f=document.getElementById('festival');if(!f||f.classList.contains('hidden')||!f.children.length||f.querySelector('#'+ID))return;
   const panel=document.createElement('section');panel.id=ID;panel.className='e2safe-launch';panel.innerHTML='<details><summary>🔒 EVIL 2.0 — PRELAUNCH SAFETY CHECK <small>QA</small></summary><p>All Spaces, normal racing history, Garage ownership and private content. In-memory reset simulation only — NO RESET.</p><button type="button">OPEN SAFETY AUDIT</button></details>';
   const anchor=f.querySelector('#otg-sc-launch-8220');if(anchor)anchor.insertAdjacentElement('afterend',panel);else f.appendChild(panel);
   panel.querySelector('button').addEventListener('click',show);
 }
 let pending=false;function start(){const f=document.getElementById('festival');if(!f)return;
   new MutationObserver(()=>{if(pending)return;pending=true;setTimeout(()=>{pending=false;mount();},160)}).observe(f,{childList:true,subtree:true});mount();}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
 document.addEventListener('click',e=>{if(e.target.closest('#'+PANEL))clicked(e);});
 window.rhEvil2LaunchSafety8231=window.rhEvil2LaunchSafety8232=window.rhEvil2LaunchSafety8233=window.rhEvil2LaunchSafety8234=window.rhEvil2LaunchSafety8235=window.rhEvil2LaunchSafety8236=window.rhEvil2LaunchSafety8238=window.rhEvil2LaunchSafety8239=window.rhEvil2LaunchSafety8240={audit,report,draftReset,sourceSummary,schedule,reportedFields,preservedFields};
})();
