/* OTG! MAIN v8.0.231 — read-only COMPLETE-SCOPE launch-safety rehearsal.
   PROHIBITED: modifying state, writing localStorage/IndexedDB, triggering rhSave,
   publishing medals, clearing results, or changing Evil Tournament progress.
   Reset simulation occurs ONLY on an ephemeral JSON COPY in memory. */
(()=>{'use strict';
 const ID='e2-launch-safety-v8231',PANEL='e2-launch-safe-screen-v8231';
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
       '1,219-slot calendar and actual Finals Night scheduling have not been generated/frozen.',
       'Full results reset across ALL Spaces has not been implemented or tested end-to-end; unknown stored racing fields still require mapping.',
       'Safe restore test of the exported portable backup and verification of private browser-only content must be completed before approval.'
     ],schedule,ready:false};
 }
 function storageQAKeys(){try{const keys=[];for(let i=0;i<window.localStorage.length;i++){const k=window.localStorage.key(i);if(k&&k.startsWith('otg.secondchance.qa.v1:'))keys.push(k);}return keys;}catch(_){return[];}}
 function report(){return audit(liveState(),storageQAKeys());}
 function badge(value){return '<b>'+esc(value)+'</b>';}
 function row(label,value){return '<div class="e2s-row"><span>'+esc(label)+'</span><span>'+esc(value)+'</span></div>';}
 function render(r,notice){
   let s='<div class="e2safe-inner"><button class="e2s-back" type="button" data-e2s="close">← BACK TO FESTIVAL</button><h2>🏁 EVIL 2.0 — LAUNCH SAFETY</h2><p><b>v8.0.231 · READ-ONLY PREFLIGHT.</b> No results, Garage ownership, trophies or settings are changed by this check.</p>';
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
 window.rhEvil2LaunchSafety8231={audit,report,draftReset,sourceSummary,schedule,reportedFields,preservedFields};
})();
