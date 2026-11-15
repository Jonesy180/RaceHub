/* OTG! v8.0.291 — CLEAN EVIL LAUNCH CANDIDATE, not a live reset.
 * Builds one durable, verified IndexedDB launch candidate using the current FH5
 * ownership. Original localStorage and current in-memory state are NEVER changed.
 * A real launch is blocked until shared old-Evil results/honours are classified.
 */
(()=>{'use strict';
const STORE='RaceHub_Studio_Final_v5_6';
const DB='OTG_Evil2_LaunchCandidate_v1',OS='candidates',ID='evil2-stage1-v8291';
const RETIRE=['evilCampaign8076','evilCampaignR18098','fh5TrackBags8070'];
const ESC=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const SHA=async raw=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw))),x=>x.toString(16).padStart(2,'0')).join('');
function dbOpen(){return new Promise((yes,no)=>{const q=indexedDB.open(DB,1);q.onupgradeneeded=()=>{if(!q.result.objectStoreNames.contains(OS))q.result.createObjectStore(OS,{keyPath:'id'});};q.onsuccess=()=>yes(q.result);q.onerror=()=>no(q.error||Error('IndexedDB unavailable'));q.onblocked=()=>no(Error('IndexedDB upgrade blocked'));});}
function put(db,entry){return new Promise((yes,no)=>{const t=db.transaction(OS,'readwrite');t.objectStore(OS).put(entry);t.oncomplete=()=>yes();t.onerror=()=>no(t.error||Error('Candidate write failed'));t.onabort=()=>no(t.error||Error('Candidate transaction aborted'));});}
function get(db){return new Promise((yes,no)=>{const q=db.transaction(OS,'readonly').objectStore(OS).get(ID);q.onsuccess=()=>yes(q.result||null);q.onerror=()=>no(q.error||Error('Candidate read failed'));});}
function record(){const raw=localStorage.getItem(STORE);if(!raw)throw Error('Source save missing');const doc=JSON.parse(raw);if(!Array.isArray(doc.spaces)||doc.spaces.length!==4)throw Error('Expected four saved Spaces');const ids=doc.spaces.map(s=>s.id);if(ids.some(id=>!id)||new Set(ids).size!==ids.length)throw Error('Space identities invalid');const matches=doc.spaces.filter(s=>s.catalogueKey==='fh5-catalogue-v1');if(matches.length!==1)throw Error('Select the one verified FH5 catalogue Space');return {raw,doc,fh5:matches[0],ids};}
function detectShared(sp){const names=['runs','customEvents','raceOffs','championships','results','honours','medals','history'];return names.filter(k=>Array.isArray(sp[k])&&sp[k].length).map(k=>({name:k,count:sp[k].length}));}
async function prepare(host){
 const output=(heading,body)=>{if(host)host.innerHTML='<div role="status" style="border:1px solid #318ea4;border-radius:12px;padding:12px;margin-top:12px"><b>'+ESC(heading)+'</b><p>'+ESC(body)+'</p></div>';};
 try{
  if(localStorage.getItem('otg.idb.primary.pilot8279')==='yes')throw Error('Exit isolated IndexedDB pilot first');
  if(!window.crypto?.subtle||!window.indexedDB)throw Error('Encrypted digest or IndexedDB unavailable');
  const original=record();const srcHash=await SHA(original.raw);
  const plan=window.rhEvil2Mixed8262?.snapshot?.();if(!plan?.p?.rows||plan.p.rows.length!==2225||plan.p.rows.some((r,i)=>r.position!==i+1)||new Set(plan.p.rows.map(r=>r.id)).size!==2225||plan.blocked!==0)throw Error('Full verified 2,225-stage programme not available');
  if(plan.p.rows.filter(r=>r.kind==='EXISTING').length!==1219)throw Error('Original schedule backbone mismatch');
  // This is deliberately a launch CANDIDATE, not a mutation of OTG! state.
  const candidate=JSON.parse(original.raw),space=candidate.spaces.find(s=>s.id===original.fh5.id);
  if(!space)throw Error('FH5 Space identity moved');
  const removed=[];for(const key of RETIRE){if(Object.prototype.hasOwnProperty.call(space,key)){delete space[key];removed.push(key);}}
  // Development-stage completion must NEVER leak into a clean Stage 001 campaign.
  const qaFields=['evil2Mixed260','evil2NativeRun8250'];
  for(const key of qaFields){if(Object.prototype.hasOwnProperty.call(space,key)){delete space[key];removed.push(key);}}
  // Do not change general runs/results/honours until source ownership is proven.
  const shared=detectShared(original.fh5);
  const keepBefore=JSON.parse(original.raw),keepAfter=JSON.parse(JSON.stringify(candidate));
  for(const x of [keepBefore,keepAfter]){const target=x.spaces.find(s=>s.id===original.fh5.id);for(const key of [...RETIRE,...qaFields])delete target[key];}
  if(JSON.stringify(keepBefore)!==JSON.stringify(keepAfter))throw Error('Other data differs from source — abort');
  if(candidate.spaces.some((s,i)=>s.id!==original.ids[i]||JSON.stringify(s.cars)!==JSON.stringify(original.doc.spaces[i].cars)))throw Error('Space or Garage invariant mismatch');
  const raw=JSON.stringify(candidate),candidateHash=await SHA(raw);
  const manifest={id:ID,originSha256:srcHash,candidateSha256:candidateHash,raw,fh5SpaceId:space.id,stageIds:plan.p.rows.map(r=>r.id),stageCount:2225,firstStage:plan.p.rows[0].name,removed,sharedUnclassified:shared,phase:'PRELAUNCH CANDIDATE — NOT ACTIVE',createdAt:new Date().toISOString()};
  if(localStorage.getItem(STORE)!==original.raw)throw Error('Source save changed during staging; retry when idle');
  const db=await dbOpen();try{await put(db,manifest);const verify=await get(db);
    if(!verify||verify.raw!==raw||verify.originSha256!==srcHash||verify.stageCount!==2225||await SHA(verify.raw)!==candidateHash)throw Error('Saved candidate read-back verification failed');
  }finally{db.close();}
  if(localStorage.getItem(STORE)!==original.raw||await SHA(localStorage.getItem(STORE))!==srcHash)throw Error('Original save changed; candidate MUST NOT be used');
  output('✓ CLEAN EVIL 2.0 LAUNCH CANDIDATE STAGED',
    '2,225 stages; Stage 001: '+manifest.firstStage+'. Original save and all '+candidate.spaces.length+' Spaces untouched. '+removed.length+' Evil/QA fields retired in the isolated candidate. '+shared.length+' shared-result collections require final classification. NO live reset, NO primary storage switch.');
 }catch(err){output('SAFE STOP — NO LIVE CHANGE',err?.message||err);}
}
window.otgEvilLaunchCandidate8291={prepare};
})();
