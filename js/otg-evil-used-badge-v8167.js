/* OTG! PERSONAL MAIN v8.0.167 (revised) — colour-coded Evil E✓ badges.
 * READ ONLY. E✓ means a recorded Evil race/score, NOT a verified upgrade.
 * Colour = MOST RECENT recorded Evil event: cyan road, orange off-road,
 * dirt or rally, purple drift. No saved results or draw plans are changed.
 */
(()=>{
 'use strict';
 const EVIL='evil-specialist-r1-20261014';
 const CLASS='rhEvilUsedBadge8166'; // Stable class retained for v8.0.166 layout styles.
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
 const milliseconds=x=>{const n=Date.parse(String(x||''));return Number.isFinite(n)?n:0;};
 function activeSpace(){try{return typeof window.rhSpace==='function'?window.rhSpace():null}catch(_){return null}}
 function isEvil(x){return !!x&&(x.type==='evil-r1'||x.evilCampaignR1?.campaignId===EVIL)}
 function eventKind(meta,eventId,name){
  const id=String(eventId||meta?.eventId||'').toUpperCase();
  const pool=String(meta?.pool||'').toUpperCase();
  const ecosystem=String(meta?.ecosystem||'').toUpperCase();
  if(/^(DR[-_]|DRIFT)|DRIFT/.test(id)||/DRIFT/.test(ecosystem))return 'drift';
  // Explicit event ecosystem and track pool beat car class names: a rally car
  // in a normal Road/Street championship must still show CYAN.
  if(/^(OR[-_]|RA[-_])/.test(id)||/OFF[- ]?ROAD|CROSS[- ]?COUNTRY|RALLY|DIRT/.test(pool+' '+ecosystem))return 'offroad';
  if(/ROAD\s*\/\s*STREET|ROAD|STREET/.test(pool))return 'road';
  // Safe fallback for older event records without pool/ecosystem metadata.
  if(/OFF[- ]?ROAD|CROSS[- ]?COUNTRY|RALLY ADVENTURE|\bDIRT\b/i.test(String(name||'')))return 'offroad';
  return 'road';
 }
 function displayKind(kind){return kind==='drift'?'Drift':kind==='offroad'?'Off-road / dirt / rally':'Road / street';}
 function makeLedger(sp){
  const byCar=new Map();
  function record(carId,proved,kind,eventLabel,when,slot){
   if(carId===null||carId===undefined||carId===''||!proved)return;
   const id=idKey(carId),at=milliseconds(when),s=Number(slot)||0;
   const previous=byCar.get(id);
   // Times are race-entry timestamps where available. For drift, which saves
   // scores without dates, use the completed-slot timestamp or event creation.
   if(previous&&(at<previous.at||(at===previous.at&&s<previous.slot)))return;
   byCar.set(id,{kind,eventLabel:String(eventLabel||''),at,slot:s});
  }
  for(const run of sp.runs||[]){
   if(!isEvil(run))continue;
   const meta=run.evilCampaignR1||{},kind=eventKind(meta,meta.eventId,run.name);
   const fallback=run.startedAt||run.createdAt||meta.updatedAt;
   for(const result of run.results||[]){
    record(result.carId,validTime(result.time)||validScore(result.score),kind,run.name,
      result.date||result.audit8080?.savedAt||fallback,meta.slot);
   }
  }
  for(const ro of sp.raceOffs||[]){
   if(!isEvil(ro))continue;
   const meta=ro.evilCampaignR1||{},kind=eventKind(meta,meta.eventId,ro.name);
   const fallback=ro.createdAt||meta.updatedAt;
   for(const round of ro.rounds||[])for(const match of round.matches||[]){
    for(const r of [match.resultA,match.resultB,...(match.attempts||[])]){
     if(!r)continue;
     record(r.carId??r.car?.sourceCarId,validTime(r.time),kind,ro.name,r.date||fallback,meta.slot);
    }
   }
  }
  const campaign=sp.evilCampaignR18098||{},driftEvents=campaign.driftEvents||{};
  for(const [eventId,event] of Object.entries(driftEvents)){
   if(!event)continue;
   // Completed drift scores have a reliable event completion date, even when
   // the individual round/match omits its own timestamp.
   const done=Object.entries(campaign.done||{}).find(([,x])=>x?.eventId===eventId);
   const slot=done?Number(done[0]):0;
   const when=done?.[1]?.doneAt||event.updatedAt||event.createdAt;
   const label=event.name||'Evil Drift Tournament';
   for(const round of event.rounds||[]){
    for(const [id,score] of Object.entries(round.scores||{}))record(id,validScore(score),'drift',label,when,slot);
    for(const match of round.matches||[]){
     record(match.a,validScore(match.scoreA),'drift',label,when,slot);
     record(match.b,validScore(match.scoreB),'drift',label,when,slot);
    }
   }
  }
  return byCar;
 }
 function namesById(sp){
  const names=new Map();
  function add(name,id){const key=nameKey(name);if(!key||!id)return;let set=names.get(key);if(!set){set=new Set();names.set(key,set)}set.add(idKey(id));}
  for(const c of sp.cars||[]){
   add(c.name,c.id);
   add([c.make,c.model,c.year].filter(Boolean).join(' '),c.id);
   try{if(typeof window.carName==='function')add(window.carName(c),c.id)}catch(_){}
  }
  for(const c of window.rhEvilSpecialistR18097?.cars||[])add(c.name,c.id);
  return names;
 }
 function isEvilRaceScreen(root,items){
  if(!root||!root.querySelector)return false;
  for(const item of items){
   if(!isEvil(item)||!item.id)continue;
   if(root.querySelector('[onclick*="'+String(item.id).replace(/[^a-zA-Z0-9_-]/g,'')+'"]'))return true;
  }
  return false;
 }
 function paintBadge(el,info){
  if(!el||!info)return;
  const kind=['road','offroad','drift'].includes(info.kind)?info.kind:'road';
  el.dataset.otgEvilLast=kind;
  const title='Last Evil event: '+(info.eventLabel||displayKind(kind))+' ('+displayKind(kind)+'). Previously raced; upgrades not verified.';
  el.title=title;
  el.setAttribute('aria-label',title);
  el.style.setProperty('--otg-evil-badge-colour',kind==='offroad'?'#ffb154':kind==='drift'?'#ccaaff':'#52e6f1');
  el.style.setProperty('--otg-evil-badge-border',kind==='offroad'?'rgba(255,174,79,.75)':kind==='drift'?'rgba(190,147,255,.72)':'rgba(48,218,231,.63)');
  el.style.setProperty('--otg-evil-badge-bg',kind==='offroad'?'rgba(239,129,32,.15)':kind==='drift'?'rgba(157,92,227,.16)':'rgba(24,180,194,.12)');
 }
 function makeBadge(info){
  const el=document.createElement('span');el.className=CLASS;el.textContent='E✓';
  el.style.cssText='display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;white-space:nowrap;margin-inline-start:0.45em;padding:0.12em 0.42em;border:1px solid var(--otg-evil-badge-border);border-radius:0.46em;background:var(--otg-evil-badge-bg);color:var(--otg-evil-badge-colour);font:700 0.63em/1.25 system-ui,sans-serif;letter-spacing:.025em;';
  paintBadge(el,info);
  return el;
 }
 function processRoot(root,selectors,ledger,names){
  if(!root)return;
  for(const target of root.querySelectorAll(selectors.join(','))){
   if(target.querySelector('.'+CLASS))continue;
   const candidates=names.get(nameKey(target.textContent));
   if(!candidates||candidates.size!==1)continue;
   const info=ledger.get(candidates.values().next().value);
   if(info)target.appendChild(makeBadge(info));
  }
 }
 function refresh(){
  const sp=activeSpace();if(!sp||sp.catalogueKey!=='fh5-catalogue-v1')return;
  const ledger=makeLedger(sp),names=namesById(sp);
  processRoot(document.getElementById('evilcampaign'),SELECTORS.evilcampaign,ledger,names);
  const fes=document.getElementById('festival');
  if(isEvilRaceScreen(fes,sp.runs||[]))processRoot(fes,SELECTORS.festival,ledger,names);
  const ro=document.getElementById('raceoff');
  if(isEvilRaceScreen(ro,sp.raceOffs||[]))processRoot(ro,SELECTORS.raceoff,ledger,names);
  const transition=document.getElementById('rhRaceOffTransitionV6119');
  if(isEvilRaceScreen(transition,sp.raceOffs||[]))processRoot(transition,SELECTORS.raceoff,ledger,names);
 }
 let scheduled=false;
 function schedule(){if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;try{refresh()}catch(err){console.warn('OTG! Evil E✓ display skipped',err)}})}
 function start(){
  const observer=new MutationObserver(schedule);
  for(const id of ['evilcampaign','festival','raceoff']){
   const root=document.getElementById(id);
   if(root)observer.observe(root,{childList:true,subtree:true});
  }
  observer.observe(document.body,{childList:true,subtree:false});
  schedule();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
 else if(document.body)start();
 window.rhEvilUsedLedger8167=makeLedger;
 window.rhEvilPaintUsedBadge8167=paintBadge;
 window.rhEvilRacedBadgeQA8167=()=>{const sp=activeSpace();const ledger=sp?makeLedger(sp):new Map();
  return {version:'8.0.167',usedCars:ledger.size,colourGroups:[...ledger.values()].reduce((a,x)=>(a[x.kind]=(a[x.kind]||0)+1,a),{}),displayOnly:true};};
})();
