/* OTG! MAIN v8.0.252 — Native R2 source visits 003–006.
   Existing OTG Race Off / Festival / result-saving functions; NO result-save wrappers.
   Slot 001/002 data remains in its v8250 controller, and old R1 data untouched.
   This is a progressive, source-exact rollout, not a 2,221-stage launch. */
(()=>{'use strict';
const CAMPAIGN='evil2-native-slot-launch-20261114',STATE='evil2NativeRun8250',ROTYPE='evil2-native-raceoff',STTYPE='evil2-native',FIRST=3,LAST=6;
const esc=x=>String(x??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const sid=x=>String(x??'');const now=()=>new Date().toISOString();const hostId='e2-native-next-screen-v8251';
const app=()=>{const s=window.rhSpace?.();if(!s||s.catalogueKey!=='fh5-catalogue-v1')throw Error('Select your FH5 catalogue Space first.');return s;};
const data=()=>{const d=window.rhEvilSpecialistR18097;if(!d?.slots||!d?.events)throw Error('Original FH5 tournament source unavailable.');return d;};
const book=s=>{const b=s?.[STATE];if(!b||b.campaign!==CAMPAIGN||!b.slots||typeof b.slots!=='object')throw Error('Start and complete Slot 001 and Slot 002 using the existing native engine first.');return b;};
function source(n){if(!Number.isInteger(n)||n<FIRST||n>LAST)throw Error('Only the first six verified source visits are currently connected.');const d=data(),s=d.slots.find(v=>v.slot===n),ev=d.events[s?.eventId],fmt=s?.liveFormat;
 if(!s||!ev||!Array.isArray(ev.eligibleIds)||!((n<6&&s.mode==='Race Off'&&fmt==='KNOCKOUT')||(n===6&&s.mode==='Festival'&&fmt==='STANDARD')))throw Error('Source slot format not verified — nothing created.');
 if(!Number.isInteger(s.workload)||s.workload<2||s.workload>30||n<6&&s.workload%2!==0)throw Error('Source visit workload invalid.');
 return {s,ev,n,type:n===6?'STANDARD':'RACE OFF',target:n===6?s.workload:s.workload/2};}
function cars(sp,ev){const map=new Map((sp.cars||[]).map(c=>[sid(c.id),c]));if(map.size!==sp.cars?.length||map.has(''))throw Error('Duplicate or missing Garage IDs: no new draw.');const seen=new Set(),out=[];
 for(const src of ev.eligibleIds){const id=sid(src);if(!id||seen.has(id))throw Error('Source field contains duplicate car ID.');seen.add(id);if(map.has(id))out.push(map.get(id));}
 if(out.length<2)throw Error('Not enough owned eligible cars.');return out;}
function found(sp,n){const ent=book(sp).slots[n];if(!ent)return null;const o=source(n),list=o.type==='RACE OFF'?sp.raceOffs:sp.runs,id=ent.raceOffId||ent.runId;if(!id||!Array.isArray(list))throw Error('Saved native entity missing; refusing duplicate creation.');
 const result=list.find(r=>sid(r.id)===sid(id));if(!result)throw Error('Native entity deleted or inaccessible; refusing duplicate creation.');
 if(result.evilCampaignR2?.campaign!==CAMPAIGN||result.evilCampaignR2.slot!==n||result.value!==o.ev.id||result.type!==(n===6?STTYPE:ROTYPE))throw Error('Saved native event identity conflict.');
 const ids=n===6?result.entries:result.entryIds;if(!Array.isArray(ids)||ids.length<2||new Set(ids.map(sid)).size!==ids.length||ent.expectedCars!==ids.length)throw Error('Frozen native entrants corrupted; refusing to redraw.');
 if(n===6&&(!Array.isArray(result.results)||!Array.isArray(result.rounds)||result.rounds.length!==2||!result.rounds.every(r=>r?.id&&r.name)||result.rounds[0].name===result.rounds[1].name))throw Error('Saved Festival rounds mismatch.');
 if(n<6&&(!Array.isArray(result.entrants)||result.entrants.length!==ids.length||!Array.isArray(result.rounds)))throw Error('Saved Race Off bracket mismatch.');return result;}
function previousDone(sp,n){const b=book(sp);for(let i=1;i<n;i++)if(!b.slots[i]?.doneAt)return false;return true;}
function routes(){const all=window.rhFH5TrackTaxonomy8067?.standardPool?.('OFFROAD');if(!Array.isArray(all)||all.length<2)throw Error('Mexico Dirt / Cross Country route directory unavailable.');const a=[...new Set(all.map(sid).filter(Boolean))];if(a.length<2)throw Error('Too few verified off-road courses.');for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a.slice(0,2);}
function create(n){const sp=app(),o=source(n),b=book(sp);if(!previousDone(sp,n))throw Error('Finish the previous numbered slot before starting this one.');if(b.slots[n])return found(sp,n);const owned=cars(sp,o.ev),ids=owned.map(c=>sid(c.id)),t=now(),id=typeof window.rhId==='function'?window.rhId(n===6?'run':'raceoff'):('evil2-'+Date.now()+'-'+Math.random().toString(36).slice(2));
 const marker={campaign:CAMPAIGN,slot:n,eventId:o.ev.id,format:o.s.liveFormat,createdAt:t,source:'ORIGINAL_R1'};
 let r;
 if(n===6){const names=routes();r={id,name:o.ev.event,type:STTYPE,value:o.ev.id,trophy:window.rhTrophyTypeKey?.('festival')||'festival',status:'active',createdAt:t,startedAt:t,updatedAt:t,
  rounds:names.map((name,i)=>({id:'e2-s6-'+i+'-'+id,name,layout:''})),results:[],entries:ids.slice(),evilCampaignR2:marker};}
 else{const snap=c=>({sourceCarId:sid(c.id),make:sid(c.make),model:sid(c.model),year:sid(c.year),classType:sid(c.classType),name:sid(window.carName?.(c)||[c.make,c.model,c.year].filter(Boolean).join(' '))});
  r={id,name:o.ev.event,type:ROTYPE,value:o.ev.id,status:'prepared',createdAt:t,updatedAt:t,fieldLockedAt:t,entryIds:ids.slice(),entrants:owned.map(snap),rounds:[],currentRoundIndex:0,championCarId:null,evilCampaignR2:marker};}
 const key=n===6?'runs':'raceOffs',orig=Array.isArray(sp[key])?sp[key]:[],items=orig.slice();if(items.some(v=>sid(v.id)===sid(id)))throw Error('Native ID collision');
 const saved={eventId:o.ev.id,createdAt:t,expectedCars:ids.length,expectedVisitResults:o.s.workload,format:o.s.liveFormat};saved[n===6?'runId':'raceOffId']=id;
 try{sp[key]=items.concat(r);b.slots[n]=saved;if(typeof window.rhSave!=='function')throw Error('OTG save function missing');window.rhSave();}catch(e){sp[key]=orig;delete b.slots[n];throw e;}return r;}
function pairings(ro){const seen=new Set(),finished=[];for(const round of ro?.rounds||[])for(const m of round.matches||[]){if(m?.status!=='complete'&&!m?.winnerCarId)continue;
   const key=sid(m.id)||sid(m.carA?.sourceCarId)+':'+sid(m.carB?.sourceCarId);if(!key||seen.has(key))continue;seen.add(key);if(!m.winnerCarId||!m.resultA||!m.resultB)continue;finished.push(m);}
 return finished;}
function resultKeys(r){const ids=new Set((r.entries||[]).map(sid)),rounds=new Set((r.rounds||[]).map(x=>sid(x.id))),seen=new Set();for(const row of r.results||[]){if(!ids.has(sid(row.carId))||!rounds.has(sid(row.roundId)))continue;seen.add(sid(row.carId)+'\u0001'+sid(row.roundId));}return seen;}
function progress(sp,n){const o=source(n),entity=found(sp,n),count=entity?(n===6?resultKeys(entity).size:pairings(entity).length):0;return {count,target:o.target,ready:count===o.target,over:count>o.target,entity};}
function status(n){const sp=app(),o=source(n),b=book(sp),ready=previousDone(sp,n),p=progress(sp,n);return{sp,o,b,ready,p,done:!!b.slots[n]?.doneAt};}
function finish(n){const v=status(n);if(!v.ready||v.done||!v.p.ready||v.p.over)throw Error('Slot workload is not exactly complete; not marking done.');v.b.slots[n].doneAt=now();v.b.slots[n].bankedResults=v.p.count;window.rhSave();}
let screenN=3,msg='';function panel(){let e=document.getElementById(hostId);if(!e){e=document.createElement('section');e.id=hostId;e.className='e2slot-shell';e.style.display='none';document.body.appendChild(e);e.addEventListener('click',clicked);}return e;}
function nextNo(sp){const b=book(sp);for(let n=3;n<=6;n++)if(!b.slots[n]?.doneAt)return n;return 6;}
function repaint(){const h=panel();if(h.style.display==='none')return;try{const v=status(screenN),s=v.o.s,x=v.p,number=sid(screenN).padStart(3,'0');
  let body='<div class="e2slot-card"><button class="e2slot-back" data-e2n="back">← BACK TO FESTIVAL</button><small>EVIL TOURNAMENT 2.0 · ORIGINAL NATIVE ENGINES</small><h1>SLOT '+number+'</h1><h2>'+esc(s.event)+'</h2><p>'+esc(s.mode)+' · '+esc(s.liveFormat)+' · '+esc(s.doNow)+'</p><div class="e2slot-stat"><span>FH5 GARAGE<b>'+v.sp.cars.length+'</b></span><span>ELIGIBLE<b>'+cars(v.sp,v.o.ev).length+'</b></span><span>'+ (screenN===6?'RACE TIMES':'PAIRINGS')+'<b>'+x.count+'/'+x.target+'</b></span></div>';
  if(msg)body+='<p class="e2slot-message" role="status">'+esc(msg)+'</p>';
  if(!v.ready)body+='<p>LOCKED: Finish the previous numbered visit first. Your existing native results are safe.</p>';
  else if(v.done)body+='<p class="e2slot-ok">✓ SLOT '+number+' DONE — LOCKED</p>';
  else if(x.over)body+='<p class="e2n-error">STOP: '+x.count+' results exceed the source limit '+x.target+'. No automatic deletion or signoff. Review the saved Race Off before continuing.</p>';
  else if(x.ready)body+='<p class="e2slot-ok">🏁 SOURCE WORKLOAD BANKED. STOP HERE.</p><button class="e2slot-primary" data-e2n="done">✓ MARK SLOT '+number+' DONE</button>';
  else if(!x.entity)body+='<p>Creates one real OTG! '+esc(v.o.type)+' competition with frozen eligible cars and the usual results controls. No extra stopwatch or save bridge.</p><button class="e2slot-primary" data-e2n="start">🏁 START SLOT '+number+'</button>';
  else body+='<p>Continue in the existing OTG! '+esc(v.o.type)+' screen. Results and records are saved normally.</p><button class="e2slot-primary" data-e2n="resume">▶ CONTINUE ORIGINAL '+esc(v.o.type)+' SCREEN</button>';
  if(v.done&&screenN<6)body+='<button class="e2slot-primary" data-e2n="next">OPEN NEXT SLOT — '+sid(screenN+1).padStart(3,'0')+'</button>';
  if(v.done&&screenN===6)body+='<p>Next stage, Slot 007, is not wired in this release. Existing results remain saved; no preview schedule is silently activated.</p>';
  body+='<p class="e2slot-foot">This is REAL saved FH5 racing data. Slots 001–002 remain in the phone-passed v8.0.250 system. Only 003–006 are added here. Do not reset racing history while these new Evil 2.0 visits are active.</p></div>';h.innerHTML=body;
 }catch(e){h.innerHTML='<div class="e2slot-card"><button class="e2slot-back" data-e2n="back">← BACK</button><h2>RACE LAUNCH BLOCKED</h2><p>'+esc(e.message||e)+'</p></div>';}}
function open(n=3){
 // A real Race Off leaves its own screen visible behind the fixed STOP overlay.
 // The former handler only showed the slot panel, leaving the Race Off screen
 // and its full-screen shield on top. Use the native page router first.
 screenN=n;msg='';document.getElementById(stopId)?.remove();
 const race=document.getElementById('raceoff');
 if(race&&!race.classList.contains('hidden'))window.show?.('festival');
 race?.classList.add('hidden');
 const h=panel();h.style.display='block';document.getElementById('festival')?.classList.add('hidden');
 repaint();window.scrollTo?.(0,0);
}
function close(){panel().style.display='none';document.getElementById('festival')?.classList.remove('hidden');}
function toNative(n,entity){close();window.show?.(n===6?'festival':'raceoff');if(n===6){if(typeof window.rhOpenRun!=='function')throw Error('Native Festival opening unavailable');window.rhOpenRun(entity.id);return;}
 if(typeof window.rhRaceOffOpenRoundSetup!=='function'||typeof window.rhRenderRaceOffLocked!=='function')throw Error('Native Race Off controls unavailable');window.rhCurrentRaceOffId=entity.id;
 const r=entity.rounds?.[entity.currentRoundIndex||0];if(r?.status==='drawn'||r?.status==='racing'||r?.status==='raced')window.rhRenderRaceOffLocked(entity.id);else window.rhRaceOffOpenRoundSetup(entity.id);}
function clicked(e){const btn=e.target.closest('button[data-e2n]');if(!btn)return;e.preventDefault();try{const op=btn.dataset.e2n;if(op==='back'){close();window.show?.('festival');return;}if(op==='next'){open(screenN+1);return;}if(op==='done'){finish(screenN);msg='Slot '+sid(screenN).padStart(3,'0')+' locked ✓';repaint();return;}if(op==='start'||op==='resume'){const r=create(screenN);toNative(screenN,r);return;}}catch(err){msg='NOT STARTED / NOT SAVED — '+sid(err.message||err);repaint();}}
// Pause Race Off after exactly this visit's share of its bracket. Never overwrite
// original score entry or finalisation functions, and do not mutate race results.
const stopId='e2native-raceoff-stop-v8251';let stopPending=false;
function stopCheck(){if(stopPending)return;stopPending=true;setTimeout(()=>{stopPending=false;const h=document.getElementById('raceoff');if(!h||h.classList.contains('hidden'))return;
  const sp=window.rhSpace?.(),b=sp?.[STATE];if(!b||b.campaign!==CAMPAIGN)return;
  for(let n=3;n<=5;n++){const e=b.slots?.[n];if(!e?.raceOffId||e.doneAt)continue;const ro=(sp.raceOffs||[]).find(x=>sid(x.id)===sid(e.raceOffId));if(!ro||sid(window.rhCurrentRaceOffId)!==sid(ro.id))continue;
    let count=0;try{count=pairings(ro).length;}catch{return;}const limit=source(n).target;if(count<limit)return;
    if(!h.querySelector('#'+stopId)){const div=document.createElement('div');div.id=stopId;div.className='e2n-stop-shield';div.innerHTML='<section><small>EVIL 2.0 • SLOT '+sid(n).padStart(3,'0')+'</small><h2>🛑 STOP HERE, YOU FUCKWIT!</h2><p>'+count+' / '+limit+' native Race Off pairings banked. The bracket is saved. Do not race the next pairing until its scheduled slot.</p><button type="button">RETURN TO EVIL 2.0 SLOT</button></section>';
      div.querySelector('button').addEventListener('click',()=>open(n));h.appendChild(div);}return;
  }
},65);}
function preventRaces(){for(const nm of ['rhRaceOffOpenRoundSetup','rhRaceOffEnterNext','rhRaceOffRenderDrawComplete','rhRaceOffRenderDrawReview']){
 const orig=window[nm];if(typeof orig!=='function')continue;window[nm]=function(id){const sp=window.rhSpace?.(),ro=(sp?.raceOffs||[]).find(x=>sid(x.id)===sid(id));if(ro?.evilCampaignR2?.campaign===CAMPAIGN&&ro.evilCampaignR2.slot>=3&&ro.evilCampaignR2.slot<=5){const n=ro.evilCampaignR2.slot;
   if(pairings(ro).length>=source(n).target&&!sp?.[STATE]?.slots?.[n]?.doneAt){open(n);return;}}
 return orig.apply(this,arguments);};}}
preventRaces();
// Exact native eligibility and preset for ONLY these new R2 run types.
// Older R1, the v8250 GROUPS engine and ordinary Garage competitions delegate unchanged.
const inheritedEligible=window.rhEligible;
if(typeof inheritedEligible!=='function')throw Error('Existing OTG eligibility engine unavailable');
window.rhEligible=function(type,value){
 if(sid(type)!==ROTYPE&&!(sid(type)===STTYPE&&sid(value)===source(6).ev.id))return inheritedEligible.apply(this,arguments);
 const s=window.rhSpace?.();if(!s||s.catalogueKey!=='fh5-catalogue-v1')return[];
 const ev=data().events[sid(value)];if(!ev||![3,4,5,6].some(n=>source(n).ev.id===sid(value)))return[];
 const b=s[STATE],ent=Object.values(b?.slots||{}).find(e=>e?.eventId===sid(value));
 const id=ent?.runId||ent?.raceOffId,list=sid(type)===STTYPE?s.runs:s.raceOffs;
 const existing=id?(list||[]).find(x=>sid(x.id)===sid(id)&&x.evilCampaignR2?.campaign===CAMPAIGN&&x.value===sid(value)):null;
 if(id&&!existing)return[]; // Fail closed if frozen competition was lost.
 const frozen=new Set(existing?(sid(type)===STTYPE?existing.entries:existing.entryIds).map(sid):ev.eligibleIds.map(sid));
 return(s.cars||[]).filter(c=>frozen.has(sid(c.id)));
};
try{rhEligible=window.rhEligible;}catch(_){/* global lexical may be read-only */}
const inheritedPreset=window.rhFH5Preset8056;
if(typeof inheritedPreset==='function')window.rhFH5Preset8056=function(type,value,context='festival'){
 if(sid(type)!==ROTYPE&&!(sid(type)===STTYPE&&sid(value)===source(6).ev.id))return inheritedPreset.apply(this,arguments);
 const ev=data().events[sid(value)];if(!ev||![3,4,5,6].some(n=>source(n).ev.id===sid(value)))return inheritedPreset.apply(this,arguments);
 const cat=sid(type)===STTYPE?'OFFROAD':'ROAD',pool=window.rhFH5TrackTaxonomy8067?.standardPool?.(cat)||[];
 return{type,value,context,discipline:ev.pool||'Road / Street',tracks:[...pool],pool:[...pool],raceCategory:cat,fixed:false,source:'EVIL 2.0 · '+ev.event};
};
// Native Race Off screen is rebuilt for each saved result. Observe rendering only
// to show a stop-line; the real score and record savers are never intercepted.
function mount(){const festival=document.getElementById('festival');if(festival&&!festival.querySelector('#e2native-launch-v8251')){
  const tile=document.createElement('section');tile.className='e2slot-launch';tile.id='e2native-launch-v8251';tile.innerHTML='<details><summary>🏁 EVIL 2.0 — NATIVE SLOTS 003–006 <small>RACE OFF + OFF-ROAD FESTIVAL</small></summary><p>First three original Race Off brackets and the first Off-Road Festival visit. Requires Slots 001–002 marked DONE. Original OTG! results/records save normally.</p><button type="button">OPEN CURRENT NATIVE SLOT</button></details>';
  tile.querySelector('button').addEventListener('click',()=>{try{const s=app();open(nextNo(s));}catch(err){msg=sid(err.message||err);open(3);}});festival.appendChild(tile);
 }
 const base=document.getElementById('e2-native-slot-screen-8250');if(base&&!base.querySelector('[data-e2n-link]')&&base.textContent?.includes('SLOT 002 MARKED DONE')){
   const card=base.querySelector('.e2slot-card');if(card){const button=document.createElement('button');button.className='e2slot-primary';button.dataset.e2nLink='3';button.textContent='OPEN NEXT SLOT — 003';button.onclick=()=>open(3);card.appendChild(button);}}
}
function init(){const race=document.getElementById('raceoff');if(race)new MutationObserver(stopCheck).observe(race,{childList:true,subtree:true});
 const fest=document.getElementById('festival'),base=document.getElementById('e2-native-slot-screen-8250');let pending=false;const change=()=>{if(pending)return;pending=true;setTimeout(()=>{pending=false;if(fest&&!fest.classList.contains('hidden')&&fest.children.length)mount();else if(base)mount();},110);};
 if(fest)new MutationObserver(change).observe(fest,{childList:true,subtree:true});if(base)new MutationObserver(change).observe(base,{childList:true,subtree:true});change();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.rhEvil2NativeNext8252={open,source,cars,found,progress,create,finish,pairings,version:'8.0.252'};
})();
