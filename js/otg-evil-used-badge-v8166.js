/* OTG! MAIN v8.0.166 — Evil Tournament previously-raced badge.
   DISPLAY ONLY. Never writes to race results, car records, rounds or campaign state.
   E✓ means a completed/saved Evil race or drift score exists; NOT upgraded.
 */
(()=>{
 'use strict';
 const EVIL='evil-specialist-r1-20261014';
 const CLASS='rhEvilUsedBadge8166';
 const SELECTORS={
  evilcampaign:[
   '.rhEvilR1EligibleList8097 > div > span > b',
   '.rhEvilR1CarRow8097 > span > b',
   '.rhEvilR1DriftEntry8098 h2',
   '.rhEvilR1DriftBoard8098 > div > span'
  ],
  festival:[
   '.rh5801Context > b',
   '.rhResultCar > b',
   '.rhCurrentCarHeadV1 h2',
   '.rhLineupRowV1 > div > b',
   '.v8TrackBoards details > div > span',
   '.v8TrackResult > h2',
   '.v8MiniBoard > div > span'
  ],
  raceoff:[
   '.rh5801Context > b',
   '.rhResultCar > b',
   '.rhRaceOffDrawMatchV6118 > b',
   '.rhRaceOffDrawMatchV6118 > span',
   '.rhEventTransitionModal > h2'
  ]
 };
 const nameKey=value=>String(value??'').trim().replace(/\s+/g,' ').toLocaleLowerCase('en-GB');
 const idKey=value=>String(value??'');
 const validTime=x=>Number.isFinite(Number(x))&&Number(x)>0;
 const validScore=x=>x!==null&&x!==undefined&&x!==''&&Number.isFinite(Number(x));
 function activeSpace(){try{return typeof window.rhSpace==='function'?window.rhSpace():null}catch(_){return null}}
 function isEvil(x){return !!x&&(x.type==='evil-r1'||x.evilCampaignR1?.campaignId===EVIL)}
 function usedIds(sp){
  const used=new Set();
  const record=(id,ok)=>{if(id!==null&&id!==undefined&&id!==''&&ok)used.add(idKey(id))};
  for(const run of sp.runs||[]){
   if(!isEvil(run))continue;
   for(const r of run.results||[])record(r.carId,validTime(r.time)||validScore(r.score));
  }
  for(const ro of sp.raceOffs||[]){
   if(!isEvil(ro))continue;
   for(const rd of ro.rounds||[])for(const m of rd.matches||[]){
    for(const r of [m.resultA,m.resultB,...(m.attempts||[])])if(r)record(r.carId||r.car?.sourceCarId,validTime(r.time));
   }
  }
  const drift=sp.evilCampaignR18098?.driftEvents||{};
  for(const d of Object.values(drift)){
   for(const rd of d?.rounds||[]){
    for(const [id,score] of Object.entries(rd.scores||{}))record(id,validScore(score));
    for(const m of rd.matches||[]){record(m.a,validScore(m.scoreA));record(m.b,validScore(m.scoreB));}
   }
  }
  return used;
 }
 function namesById(sp){
  const names=new Map();
  function add(name,id){const key=nameKey(name);if(!key||!id)return;let set=names.get(key);if(!set){set=new Set();names.set(key,set)}set.add(idKey(id));}
  for(const c of sp.cars||[]){
   add(c.name,c.id);
   add([c.make,c.model,c.year].filter(Boolean).join(' '),c.id);
   try{if(typeof window.carName==='function')add(window.carName(c),c.id)}catch(_){}
  }
  // The campaign car index uses the same IDs but sometimes a historical display name.
  for(const c of window.rhEvilSpecialistR18097?.cars||[])add(c.name,c.id);
  return names;
 }
 function isEvilRaceScreen(root,items){
  if(!root||!root.querySelector)return false;
  // Normal Festival/Race Off screens must not be decorated: require the displayed
  // event to expose the specific Evil race ID in its existing action links.
  for(const item of items){
   if(!isEvil(item)||!item.id)continue;
   // IDs are generated from safe alphanumerics/hyphens; use a quoted selector.
   if(root.querySelector('[onclick*="'+String(item.id).replace(/[^a-zA-Z0-9_-]/g,'')+'"]'))return true;
  }
  return false;
 }
 function makeBadge(){
  const el=document.createElement('span');el.className=CLASS;el.textContent='E✓';
  el.setAttribute('title','Already raced in the Evil Tournament — upgrades not verified');
  el.setAttribute('aria-label','Previously raced in the Evil Tournament; upgrades not verified');
  el.style.cssText='display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;white-space:nowrap;margin-inline-start:0.45em;padding:0.12em 0.42em;border:1px solid rgba(48,218,231,.63);border-radius:0.46em;background:rgba(24,180,194,.12);color:#52e6f1;font:700 0.63em/1.25 system-ui,sans-serif;letter-spacing:.025em;';
  return el;
 }
 function processRoot(root,selectors,seen,names){
  if(!root)return;
  for(const target of root.querySelectorAll(selectors.join(','))){
   if(target.querySelector('.'+CLASS))continue;
   // Match exact car names, never nearby event titles, classes or other text.
   const candidates=names.get(nameKey(target.textContent));
   // Ambiguous names stay unmarked rather than claiming the wrong car has raced.
   if(!candidates||candidates.size!==1)continue;
   if(seen.has(candidates.values().next().value))target.appendChild(makeBadge());
  }
 }
 function refresh(){
  const sp=activeSpace();if(!sp||sp.catalogueKey!=='fh5-catalogue-v1')return;
  const seen=usedIds(sp),names=namesById(sp);
  processRoot(document.getElementById('evilcampaign'),SELECTORS.evilcampaign,seen,names);
  const fes=document.getElementById('festival');
  if(isEvilRaceScreen(fes,sp.runs||[]))processRoot(fes,SELECTORS.festival,seen,names);
  const ro=document.getElementById('raceoff');
  if(isEvilRaceScreen(ro,sp.raceOffs||[]))processRoot(ro,SELECTORS.raceoff,seen,names);
  const transition=document.getElementById('rhRaceOffTransitionV6119');
  if(isEvilRaceScreen(transition,sp.raceOffs||[]))processRoot(transition,SELECTORS.raceoff,seen,names);
 }
 // UI-only observer: existing rendering methods replace their DOM, so refresh
 // after each DOM change without wrapping result-save or draw functions.
 let scheduled=false;
 function schedule(){if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;try{refresh()}catch(err){console.warn('OTG! Evil E✓ display skipped',err)}})}
 if(document.body){
  // Listen to just the three relevant app screens; avoid scanning the saved
  // campaign every time an unrelated dashboard card, modal or clock changes.
  const observer=new MutationObserver(schedule);
  for(const id of ['evilcampaign','festival','raceoff']){
   const root=document.getElementById(id);
   if(root)observer.observe(root,{childList:true,subtree:true});
  }
  // The Race Off between-car transition is an overlay appended to body.
  observer.observe(document.body,{childList:true,subtree:false});
  schedule();
 }
 window.rhEvilRacedBadgeQA8166=()=>{const sp=activeSpace();return {version:'8.0.166',usedCars:sp?usedIds(sp).size:0,displayOnly:true}};
})();
