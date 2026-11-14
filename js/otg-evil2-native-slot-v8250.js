/* OTG! MAIN v8.0.250 — use the ACTUAL OTG Festival Groups engine for Evil 2.0.
  No synthetic rhCurrentRuns entry, no save monkeypatch, no fake race cards.
  Native rhSaveResultFinal, v8Groups, records, timing, and stage mechanics work normally.
  Slot 001/002 only: intentional controlled native integration, not a full campaign release.
  No legacy history reset or dashboard replacement. */
(()=>{'use strict';
const VERSION='8.0.250',CAMPAIGN='evil2-native-slot-launch-20261114',STATE='evil2NativeRun8250';
const SCREEN='e2-native-slot-screen-8250',LAUNCH='e2-native-slot-launch-8250';
const LIVE_TYPE='evil2-native',SUPPORTED=[1,2];
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const S=x=>String(x??'');const iso=()=>new Date().toISOString();
const getSpace=()=>{const x=window.rhSpace?.();if(!x||x.catalogueKey!=='fh5-catalogue-v1'||!S(x.id))throw Error('Select your real FH5 catalogue Space first.');return x;};
const getData=()=>{const x=window.rhEvilSpecialistR18097;if(!x?.slots||!x?.events)throw Error('Original Evil competition definitions are missing');return x;};
function candidate(slot){if(!SUPPORTED.includes(slot))throw Error('Only the first two verified GROUPS slots are currently wired');const d=getData(),s=d.slots.find(x=>Number(x.slot)===slot),ev=d.events?.[s?.eventId];
 if(!s||!ev||s.mode!=='Festival'||s.liveFormat!=='GROUPS'||!Array.isArray(ev.eligibleIds)||ev.eligibleIds.length<8)throw Error('Original slot is not a verified playable Festival GROUPS event');
 const m=S(s.doNow).match(/STAGE\s+1\s+GROUP\s+1\/(\d+)/i);if(!m)throw Error('Original first group definition is missing');return {s,ev,groupCount:Number(m[1])};}
function getBook(sp){if(sp[STATE]!==undefined&&(!sp[STATE]||sp[STATE].campaign!==CAMPAIGN||!sp[STATE].slots||typeof sp[STATE].slots!=='object'))throw Error('Evil 2.0 native progression saved state is invalid; not overwritten.');return sp[STATE]||null;}
function book(sp){let b=getBook(sp);if(!b){b={campaign:CAMPAIGN,createdAt:iso(),slots:{}};sp[STATE]=b;window.rhSave();}return b;}
function runs(sp){return Array.isArray(sp.runs)?sp.runs:[];}
function findRun(sp,n){const b=getBook(sp),id=b?.slots?.[n]?.runId;return id?runs(sp).find(x=>S(x.id)===S(id))||null:null;}
function validateRun(sp,n,r){const c=candidate(n),b=getBook(sp),entry=b?.slots?.[n];if(!r||!entry||r.id!==entry.runId||r.evilCampaignR2?.campaign!==CAMPAIGN||r.evilCampaignR2.slot!==n||r.type!==LIVE_TYPE||r.value!==c.ev.id||r.format!=='groups-total-time'||!r.v8Groups||!Array.isArray(r.entries)||!Array.isArray(r.results)||!Array.isArray(r.rounds)||r.rounds.length!==2||r.rounds[0].name===r.rounds[1].name)throw Error('Existing native run mismatch. No new draw or overwrite was attempted.');
 if(new Set(r.entries.map(S)).size!==r.entries.length)throw Error('Frozen native entrant IDs contain duplicates');
 return {c,entry};}
function verifiedRoutes(){const a=window.rhFH5TrackTaxonomy8067?.standardPool?.('ROAD');if(!Array.isArray(a))throw Error('FH5 Road/Street route directory is missing');const routes=[...new Set(a.map(S).filter(x=>x&& !/the goliath/i.test(x)))];if(routes.length<2)throw Error('At least two real Road/Street courses required');return routes;}
function drawRoutes(){const a=verifiedRoutes().slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a.slice(0,2);}
function eligible(sp,ev){const by=new Map((sp.cars||[]).map(x=>[S(x.id),x]));if(!by.size||by.has('')||by.size!==(sp.cars||[]).length)throw Error('Garage identities missing/duplicated; draw refused');const source=new Set(),ids=[];for(const v of ev.eligibleIds){const id=S(v);if(!id||source.has(id))throw Error('Source competition contains duplicated identities');source.add(id);if(by.has(id))ids.push(id);}return ids;}
function formatCount(n,g){if(!Number.isInteger(g)||g<2||g>100||n<g*2)throw Error('Original group layout not compatible with current Garage');const q=Math.floor(n/g),r=n%g;return Array.from({length:g},(_,i)=>q+(i<r?1:0));}
function ensureSlot(n){const sp=getSpace(),{s,ev,groupCount}=candidate(n);if(n===2&&!getBook(sp)?.slots?.[1]?.doneAt)throw Error('Finish and mark Slot 001 DONE before opening Slot 002');
 let r=findRun(sp,n);if(r){validateRun(sp,n,r);return r;}
 const b=book(sp);if(b.slots[n])throw Error('Stored slot exists but run is missing; refusing to re-draw');
 const ids=eligible(sp,ev),sizes=formatCount(ids.length,groupCount),tracks=drawRoutes();
 const now=iso();r={id:typeof window.rhId==='function'?window.rhId('run'):('evil2-run-'+Date.now()+'-'+Math.random().toString(36).slice(2)),name:ev.event,type:LIVE_TYPE,value:ev.id,trophy:typeof window.rhTrophyTypeKey==='function'?window.rhTrophyTypeKey('festival'):'festival',
  createdAt:now,startedAt:now,updatedAt:now,status:'active',format:'groups-total-time',
  rounds:tracks.map((name,i)=>({id:'e2-native-slot-'+n+'-round-'+i+'-'+Date.now(),name,layout:''})),results:[],entries:ids.slice(),
  evilCampaignR2:{campaign:CAMPAIGN,slot:n,eventId:ev.id,source:'ORIGINAL_R1',format:'GROUPS',createdAt:now},
  v8Groups:{stage:1,stage1Closed:false,groupPlan:{groupCount,sizes,qualifiers:groupCount*2},excludedStage1:[],knownStage1Eligible:ids.slice(),pool:ids.slice(),qualifiers:[],completedGroups:[],activeGroup:null,final:false,championId:null}};
 sp.runs=Array.isArray(sp.runs)?sp.runs:[];if(sp.runs.some(x=>S(x.id)===S(r.id)))throw Error('Generated run ID collision');
 const snapshot=JSON.stringify(sp.runs);try{sp.runs.push(r);b.slots[n]={runId:r.id,eventId:ev.id,createdAt:now,groupCount,expectedCars:ids.length,firstGroupSize:sizes[0],routes:tracks.slice()};window.rhSave();}catch(err){sp.runs=JSON.parse(snapshot);delete b.slots[n];throw err;}
 return r;}
function groupFinished(r){const g=r?.v8Groups;return !!g&&Array.isArray(g.completedGroups)&&g.completedGroups.filter(x=>x.stage===1).length>=1;}
function groupBanked(r){const g=r?.v8Groups,completed=(g?.completedGroups||[]).find(x=>x.stage===1);if(completed)return completed.carIds.length*r.rounds.length;
 const current=g?.activeGroup;return (r?.results||[]).filter(x=>current&&S(x.v8GroupId)===S(current.id)).length;}
let current=null,message='';function page(){let el=document.getElementById(SCREEN);if(!el){el=document.createElement('section');el.id=SCREEN;el.className='e2slot-shell';el.style.display='none';document.body.appendChild(el);el.addEventListener('click',click);}return el;}
function summary(){const sp=getSpace(),b=getBook(sp),next=b?.slots?.[1]?.doneAt?2:1;return {sp,b,next};}
function paint(){const el=page();if(el.style.display==='none')return;try{const {sp,b,next}=summary(),n=current||next,c=candidate(n),r=findRun(sp,n),entry=b?.slots?.[n];if(entry&&r)validateRun(sp,n,r);else if(entry&&!r)throw Error('Stored native run missing; no duplicate draw allowed');const completed=groupFinished(r),done=!!entry?.doneAt,banked=groupBanked(r),firstCount=Number(entry?.firstGroupSize)||formatCount(eligible(sp,c.ev).length,c.groupCount)[0];const count=firstCount*2;
 let html='<div class="e2slot-card"><button type="button" data-e2slot="exit" class="e2slot-back">← BACK TO FESTIVAL</button><small>EVIL TOURNAMENT 2.0 · LIVE NATIVE ENGINE</small><h1>SLOT '+S(n).padStart(3,'0')+'</h1><h2>'+E(c.s.event)+'</h2><p><b>STAGE 1 · GROUP 1/'+c.groupCount+'</b> · Real OTG! Festival Groups · 2 actual FH5 courses</p>';
 html+='<div class="e2slot-stat"><span>LIVE FH5 GARAGE <b>'+sp.cars.length+'</b></span><span>ELIGIBLE OWNED <b>'+eligible(sp,c.ev).length+'</b></span><span>RESULTS <b>'+banked+'/'+count+'</b></span></div>';
 if(message)html+='<p class="e2slot-message" role="status">'+E(message)+'</p>';
 if(!r){html+='<p>Draw the official first group with the existing Festival engine. This creates a <strong>REAL, DURABLE</strong> new Evil 2.0 run in this Space. The old tournament is not reset.</p><button type="button" class="e2slot-primary" data-e2slot="start">🏁 START SLOT '+S(n).padStart(3,'0')+' — NATIVE RACING</button>';
 }else if(done){html+='<p class="e2slot-ok">✓ SLOT '+S(n).padStart(3,'0')+' MARKED DONE</p><p>Completed results stay in the real OTG! Festival history. No re-draw.</p>';
 if(n===1)html+='<button type="button" class="e2slot-primary" data-e2slot="slot2">OPEN NEXT SLOT — 002</button>';
 }else if(completed){html+='<p class="e2slot-ok">🏁 FIRST GROUP BANKED · '+E(entry.firstGroupSize)+' CARS × 2 TRACKS</p><p>The native group standings are complete. Stop after this original slot visit; the next group of this championship will be scheduled later.</p><button type="button" class="e2slot-primary" data-e2slot="done">✓ MARK SLOT '+S(n).padStart(3,'0')+' DONE</button><button type="button" class="e2slot-secondary" data-e2slot="review">VIEW FESTIVAL STANDINGS</button>';
 }else{html+='<p>Native championship progress is saved in OTG! itself, using your familiar Enter Result and Advanced Timing screen. No temporary save bridge.</p><p class="e2slot-routes">'+r.rounds.map((x,i)=>'<span>RACE '+(i+1)+': <b>'+E(x.name)+'</b></span>').join('')+'</p><button type="button" class="e2slot-primary" data-e2slot="resume">▶ CONTINUE IN EXISTING FESTIVAL SCREEN</button>';}
 html+='<p class="e2slot-foot">Only Slots 001–002 are opened in this release. This is a staged native integration, <b>not</b> a launch of the full 2,221-stage plan. Old Evil results remain until the final safe reset. New Evil 2.0 native run results must be preserved in that later reset.</p></div>';
 el.innerHTML=html;
 }catch(err){el.innerHTML='<div class="e2slot-card"><button data-e2slot="exit">← BACK</button><h2>RACE LAUNCH BLOCKED</h2><p>'+E(err.message||err)+'</p></div>';}}
function open(n=0){const x=summary();current=SUPPORTED.includes(n)?n:x.next;message='';const el=page();el.style.display='block';document.getElementById('festival')?.classList.add('hidden');paint();window.scrollTo(0,0);}
function hide(){page().style.display='none';document.getElementById('festival')?.classList.remove('hidden');}
function nativeRun(r){hide();if(typeof window.rhOpenRun!=='function')throw Error('Native Festival opening function unavailable');window.show?.('festival');window.rhOpenRun(r.id);}
function sign(n){const sp=getSpace(),r=findRun(sp,n);validateRun(sp,n,r);if(!groupFinished(r))throw Error('Complete the FIRST native Festival group before marking the slot DONE');const b=book(sp);if(b.slots[n].doneAt)throw Error('Slot is already locked');b.slots[n].doneAt=iso();b.slots[n].bankedResults=groupBanked(r);window.rhSave();message='Slot '+S(n).padStart(3,'0')+' locked ✓';paint();}
function click(ev){const btn=ev.target.closest('button[data-e2slot]');if(!btn)return;ev.preventDefault();const op=btn.dataset.e2slot;try{if(op==='exit'){hide();window.show?.('festival');return;}if(op==='slot2'){open(2);return;}const {sp,next}=summary(),n=current||next; if(op==='start'){const r=ensureSlot(n);nativeRun(r);return;}if(op==='resume'||op==='review'){const r=findRun(sp,n);validateRun(sp,n,r);if(op==='review'&&groupFinished(r)){hide();window.show?.('festival');return window.rhV8GroupReveal?.(r.id,(r.v8Groups.completedGroups||[]).find(g=>g.stage===1)?.id);}nativeRun(r);return;}if(op==='done'){sign(n);return;}}catch(err){message='NOT STARTED / NOT SAVED — '+S(err.message||err);paint();}}
// Native run's own save API is never overwritten. Prevent a premature next-group
// draw and present the real group 1 stop-line instead.
const baseOpenRun=window.rhOpenRun;
if(typeof baseOpenRun==='function')window.rhOpenRun=function(id){const sp=window.rhSpace?.(),r=runs(sp||{}).find(x=>S(x.id)===S(id));if(r?.evilCampaignR2?.campaign===CAMPAIGN&&SUPPORTED.includes(r.evilCampaignR2.slot)&&groupFinished(r)){
  const n=r.evilCampaignR2.slot;open(n);return;}
 return baseOpenRun.apply(this,arguments);
};
const baseNext=window.rhV8DrawNextGroup;
if(typeof baseNext==='function')window.rhV8DrawNextGroup=function(id){const sp=window.rhSpace?.(),r=runs(sp||{}).find(x=>S(x.id)===S(id));if(r?.evilCampaignR2?.campaign===CAMPAIGN&&groupFinished(r)){open(r.evilCampaignR2.slot);return;}return baseNext.apply(this,arguments);};
// The old OTG rhEligible intentionally returns ALL cars for unknown run types.
// Without this source-exact adapter, native Festival Groups would silently append
// the entire Garage to an Evil 2.0 field when drawing its first group.
// Scope the adapter ONLY to our two documented Evil 2.0 native event IDs.
const originalEligible=window.rhEligible;
if(typeof originalEligible!=='function')throw Error('Native OTG eligibility engine is missing — no races will be created');
window.rhEligible=function(type,value){
 if(S(type)!==LIVE_TYPE)return originalEligible.apply(this,arguments);
 const eventId=S(value),d=window.rhEvilSpecialistR18097,ev=d?.events?.[eventId];
 if(!ev||!SUPPORTED.some(n=>{try{return candidate(n).ev.id===eventId;}catch{return false;}}))return [];
 const sp=window.rhSpace?.();if(!sp||sp.catalogueKey!=='fh5-catalogue-v1')return [];
 const booked=getBook(sp),entry=Object.values(booked?.slots||{}).find(x=>x?.eventId===eventId);
 const actual=entry?runs(sp).find(r=>S(r.id)===S(entry.runId)&&r.evilCampaignR2?.campaign===CAMPAIGN&&r.value===eventId):null;
 // If a saved run is missing, fail closed. Never expand the entrant field.
 if(entry&&!actual)return [];
 const ids=new Set(actual?actual.entries.map(S):eligible(sp,ev));
 return(sp.cars||[]).filter(c=>ids.has(S(c.id)));
};
function mount(){const festival=document.getElementById('festival');if(!festival||festival.classList.contains('hidden')||!festival.children.length||festival.querySelector('#'+LAUNCH))return;
 const panel=document.createElement('section');panel.id=LAUNCH;panel.className='e2slot-launch';panel.innerHTML='<details><summary>🏁 EVIL 2.0 — NATIVE SLOT 001 <small>REAL OTG! RESULTS</small></summary><p>No duplicate result-entry screen. The first two original GROUPS visits use the proven Festival engine, saving normal OTG! results. The legacy tournament stays intact.</p><button type="button" data-go-e2slot="1">OPEN SLOT 001 — NATIVE RACING</button></details>';
 festival.appendChild(panel);panel.querySelector('button').addEventListener('click',()=>open(1));}
let mounting=false;
function init(){const festival=document.getElementById('festival');if(!festival)return;new MutationObserver(()=>{if(mounting)return;mounting=true;setTimeout(()=>{mounting=false;mount();},100)}).observe(festival,{childList:true,subtree:true});mount();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.rhEvil2NativeSlot8250={open,ensureSlot,findRun,validateRun,groupFinished,eligible,formatCount,drawRoutes,version:VERSION};
})();