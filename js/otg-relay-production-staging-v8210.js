/* OTG! MAIN 8.0.210 — opt-in production staging for NEW relay championships.
   Creates a separate clean staging draft using validated LOCKED QA teams.
   Does not import QA race times, qualify winners, award honours, alter old Evil 1.0,
   change native OTG! event storage, or write to other Spaces. */
(function(){'use strict';
const ROOT='otg-relay-staging-8210',QA='otg.evil2.relay.qa.v1:',DRAFT='otg.relay.production.staging.v1:';
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const current=()=>{const s=window.rhSpace?.();const id=s&&(s.id||s.spaceId||s.space_id);if(!s||id==null||!String(id).trim())throw Error('Open a Space with a stable ID first.');if(s.catalogueKey!=='fh5-catalogue-v1')throw Error('FH5 catalogue Space required.');return String(id);};
const keys=(id,mode)=>({source:QA+encodeURIComponent(id)+':'+mode,target:DRAFT+encodeURIComponent(id)+':'+mode});
function verify(source,mode){
 if(!source||source.schema!==1||source.mode!==mode||!Array.isArray(source.teams)||!Array.isArray(source.results)||source.teams.length!==source.results.length||source.teams.length<1||source.teams.length>2000)throw Error('No valid locked '+mode+' relay QA draw is available.');
 const seen=new Set();
 for(const t of source.teams){if(!t||!Array.isArray(t.cars)||t.cars.length!==3)throw Error('A team is incomplete.');const makers=new Set();
  for(const car of t.cars){if(car?.id==null||typeof car.name!=='string'||typeof car.make!=='string')throw Error('A car has missing identity information.');const id=String(car.id);if(seen.has(id))throw Error('Duplicate car found; draft refused.');seen.add(id);makers.add(car.make);}
  if(makers.size!==(mode==='maker'?1:3))throw Error('Team manufacturer eligibility failed.');
 }
 for(const r of source.results)if(!Array.isArray(r)||r.length!==3||!r.every(x=>x===null||(Number.isSafeInteger(x)&&x>0)))throw Error('Existing QA time data failed validation.');
 return seen.size;
}
function lookup(mode){const id=current(),k=keys(id,mode);let d;try{d=JSON.parse(localStorage.getItem(k.source)||'null');}catch(_){throw Error('The QA draw cannot be read safely.');}const cars=verify(d,mode);return {id,k,d,cars};}
function getExisting(id,mode){const str=localStorage.getItem(keys(id,mode).target);if(!str)return null;try{const d=JSON.parse(str);if(!d||d.schema!==1||d.stage!=='unstarted'||d.spaceId!==id||d.mode!==mode||!Array.isArray(d.teams)||!Array.isArray(d.results)||d.results.length!==d.teams.length||!d.results.every(r=>Array.isArray(r)&&r.length===3&&r.every(v=>v===null)))throw Error('Staging draft is not an unstarted schema-1 draft.');return d;}catch(err){throw Error('An existing production staging record is not recognised. Nothing was overwritten.');}}
function prepare(mode){const {id,k,d,cars}=lookup(mode);if(localStorage.getItem(k.target)!==null)throw Error('A staging draft already exists. It will NOT be overwritten.');
 const teams=d.teams.map((team,i)=>({id:String(team.id??i),name:mode==='mixed'?'Team '+(i+1):String(team.cars[0].make)+' '+(d.teams.slice(0,i+1).filter(t=>t.cars[0].make===team.cars[0].make).length),cars:team.cars.map(c=>({id:String(c.id),name:c.name,make:c.make}))}));
 const data={schema:1,stage:'unstarted',mode,spaceId:id,createdAt:new Date().toISOString(),origin:'validated QA team DRAW only — zero QA race results or routes copied',eligibleAtSource:d.eligible,teams,results:teams.map(()=>[null,null,null]),rounds:[],routeLocks:{},honoursEnabled:false,liveRacingEnabled:false};
 // One unique key per mode per Space, explicitly never overwriting anything.
 localStorage.setItem(k.target,JSON.stringify(data));return {teams:teams.length,cars};
}
function paint(){const wrap=document.getElementById(ROOT);if(!wrap)return;let msg='';try{const id=current();const rows=['maker','mixed'].map(mode=>{let desc='',draft=false;try{const src=lookup(mode);const saved=getExisting(id,mode);draft=!!saved;desc=src.d.teams.length+' teams · '+src.cars+' cars'+(draft?' · CLEAN DRAFT SAVED':' · READY TO PREPARE');}catch(err){desc=err.message;}return '<div class="relay-stage-row"><div><b>'+(mode==='maker'?'🏭 Manufacturer':'🏎️ Mixed')+'</b><small>'+E(desc)+'</small></div><button type="button" data-prep="'+mode+'" '+(draft?'disabled':'')+'>'+(draft?'DRAFT SAVED':'PREPARE DRAFT')+'</button></div>';}).join('');wrap.querySelector('.relay-stage-rows').innerHTML=rows;
 }catch(err){msg=err.message;wrap.querySelector('.relay-stage-rows').innerHTML='';}if(msg)wrap.querySelector('.relay-stage-status').textContent=msg;}
function mount(){const choices=document.getElementById('otg-relay-choices-8202');if(!choices||choices.querySelector('#'+ROOT))return;
 const panel=document.createElement('section');panel.id=ROOT;panel.innerHTML='<details><summary>🏁 PRODUCTION RELAY PREPARATION (QA)</summary><p>Create an <strong>unstarted, separate staging draft</strong> from locked team selections. No old QA times, tracks, winners or medals are imported. Nothing changes in the real competition roster yet.</p><div class="relay-stage-rows"></div><p class="relay-stage-status" role="status"></p><p><small>Staging drafts are browser-local and NOT in the standard portable backup. Keep your relay QA snapshot and full backup safe.</small></p></details>';
 const note=choices.querySelector('.otg-relay-qa-8202');choices.insertBefore(panel,note||null);
 panel.querySelector('details').addEventListener('toggle',e=>{if(e.target.open)paint();});
 panel.addEventListener('click',e=>{const b=e.target.closest('[data-prep]');if(!b||b.disabled)return;const mode=b.dataset.prep;if(!['maker','mixed'].includes(mode))return;
  const st=panel.querySelector('.relay-stage-status');if(b.dataset.armed!=='yes'){panel.querySelectorAll('[data-prep]').forEach(x=>{delete x.dataset.armed;x.textContent='PREPARE DRAFT';});b.dataset.armed='yes';b.textContent='CONFIRM CLEAN DRAFT';st.textContent='Confirm to create a separate unstarted '+(mode==='maker'?'Manufacturer':'Mixed')+' staging record. The QA draw and results stay unchanged.';return;}
  try{const r=prepare(mode);st.textContent='Created clean staging draft: '+r.teams+' teams / '+r.cars+' cars. No QA results, routes or medals copied.';}catch(err){st.textContent='No changes: '+String(err.message||err);}delete b.dataset.armed;paint();});
}
let scheduled=false;function schedule(){if(scheduled)return;scheduled=true;setTimeout(()=>{scheduled=false;mount();},80);}
function init(){const festival=document.getElementById('festival');if(!festival)return;new MutationObserver(schedule).observe(festival,{childList:true,subtree:true});schedule();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.rhRelayProductionStaging210={verify,prepare,keys};
})();
