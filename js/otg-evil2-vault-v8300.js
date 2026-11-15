/* OTG! MAIN v8.0.300 — independent Evil 2.0 launch-draft vault.
 * Transactional IndexedDB store for a proposed draw and its clean source candidate.
 * NO LIVE ACTIVATION. The live application still uses its original save engine.
 */
(()=>{'use strict';
 const NAME='OTG_Evil2_CampaignVault_v1',STORE='drafts',KEY='main-draft';
 const hash=async s=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))),x=>x.toString(16).padStart(2,'0')).join('');
 const open=()=>new Promise((yes,no)=>{const r=indexedDB.open(NAME,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE,{keyPath:'id'});};r.onsuccess=()=>yes(r.result);r.onerror=()=>no(r.error||Error('Vault database unavailable'));r.onblocked=()=>no(Error('Vault is blocked in another browser tab'));});
 const read=(db)=>new Promise((yes,no)=>{const q=db.transaction(STORE,'readonly').objectStore(STORE).get(KEY);q.onsuccess=()=>yes(q.result||null);q.onerror=()=>no(q.error||Error('Vault read failed'));});
 const write=(db,item)=>new Promise((yes,no)=>{const t=db.transaction(STORE,'readwrite');t.objectStore(STORE).put(item);t.oncomplete=()=>yes();t.onabort=()=>no(t.error||Error('Vault write aborted'));t.onerror=()=>no(t.error||Error('Vault write failed'));});
 const check=async value=>{
  if(!value||value.id!==KEY||value.mode!=='PRELAUNCH_ONLY'||value.active!==false)throw Error('Vault draft activation state invalid');
  if(!Array.isArray(value.ids)||value.ids.length!==2225||new Set(value.ids).size!==2225)throw Error('Vault stage identities invalid');
  if(!value.sourceSha256||!value.candidateSha256||!value.scheduleSha256||!value.stageOneId)throw Error('Vault provenance is incomplete');
  if(value.stageOneId!==value.ids[0])throw Error('Vault first-stage identity mismatch');
  const payload=JSON.stringify({sourceSha256:value.sourceSha256,candidateSha256:value.candidateSha256,scheduleSha256:value.scheduleSha256,seed:value.seed,ids:value.ids,stageOneId:value.stageOneId});
  if(value.drawSha256!==await hash(payload))throw Error('Vault draw integrity failed');
  return true;
 };
 async function stage(manifest){
  if(!manifest||manifest.stageCount!==2225||manifest.proposedDraw?.ids?.length!==2225||manifest.phase!=='PRELAUNCH CANDIDATE — NOT ACTIVE')throw Error('Vault accepts verified prelaunch candidates only');
  const ids=manifest.proposedDraw.ids;
  const candidate={id:KEY,mode:'PRELAUNCH_ONLY',active:false,sourceSha256:manifest.originSha256,candidateSha256:manifest.candidateSha256,scheduleSha256:manifest.scheduleSha256,seed:manifest.proposedDraw.seed,ids:[...ids],stageOneId:ids[0],stageOneName:manifest.proposedDraw.firstStages[0],createdAt:new Date().toISOString()};
  candidate.drawSha256=await hash(JSON.stringify({sourceSha256:candidate.sourceSha256,candidateSha256:candidate.candidateSha256,scheduleSha256:candidate.scheduleSha256,seed:candidate.seed,ids:candidate.ids,stageOneId:candidate.stageOneId}));
  await check(candidate);
  let db=await open();try{
   const prev=await read(db);
   if(prev){await check(prev);
    if(prev.sourceSha256===candidate.sourceSha256 && prev.scheduleSha256===candidate.scheduleSha256 && prev.candidateSha256===candidate.candidateSha256){
     if(prev.drawSha256!==candidate.drawSha256)throw Error('Vault detected a different draw for unchanged source — SAFE STOP');
     return {reused:true,seed:prev.seed,drawSha256:prev.drawSha256,stageOneName:prev.stageOneName};
    }
    // A changed FH5 Garage/save requires a fresh draft; never switch active data.
   }
   await write(db,candidate);
  }finally{db.close();}
  // Close and reopen a NEW IndexedDB connection to verify persistence, not just
  // the success of an in-memory object or an uncommitted transaction.
  db=await open();try{const verified=await read(db);await check(verified);if(verified.drawSha256!==candidate.drawSha256||verified.sourceSha256!==candidate.sourceSha256)throw Error('Vault cold-read mismatch');}finally{db.close();}
  return {reused:false,seed:candidate.seed,drawSha256:candidate.drawSha256,stageOneName:candidate.stageOneName};
 }
 async function verify(){const db=await open();try{const rec=await read(db);if(!rec)return {ok:false,reason:'No draft staged'};await check(rec);return {ok:true,active:false,stageCount:rec.ids.length,seed:rec.seed,drawSha256:rec.drawSha256,stageOneName:rec.stageOneName};}finally{db.close();}}
 window.otgEvilVault8300=Object.freeze({stage,verify});
})();
