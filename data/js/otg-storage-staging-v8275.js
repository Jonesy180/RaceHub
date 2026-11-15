/* OTG! v8.0.275 — storage engine bridge preparation, SAFE/OPT-IN only.
   The live synchronous rhSave/rhLoad functions are deliberately untouched.
   Requires native source inspection before a production storage cutover. */
(()=>{'use strict';
 const KEY='RaceHub_Studio_Final_v5_6',DB='OTG_Main_State_Migration_Proof_v1',STORE='verified_copies';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const hash=async raw=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw))),v=>v.toString(16).padStart(2,'0')).join('');
 const open=()=>new Promise((resolve,reject)=>{const req=indexedDB.open(DB,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE,{keyPath:'id'});};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||Error('IndexedDB open failed'));req.onblocked=()=>reject(Error('Database blocked'));});
 const read=(db,id)=>new Promise((resolve,reject)=>{const q=db.transaction(STORE,'readonly').objectStore(STORE).get(id);q.onsuccess=()=>resolve(q.result||null);q.onerror=()=>reject(q.error||Error('Read failed'));});
 const write=(db,data)=>new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(data);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error||Error('Write failed'));tx.onabort=()=>reject(tx.error||Error('Write aborted'));});
 const del=(db,id)=>new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error||Error('Delete failed'));tx.onabort=()=>reject(tx.error||Error('Delete aborted'));});
 // Explicit, isolated async API for eventual native integration; never hooks or replaces rhSave.
 const api=Object.freeze({
   async inspect(){const raw=localStorage.getItem(KEY);if(!raw)throw Error('Existing main save missing');const s=JSON.parse(raw);if(!Array.isArray(s.spaces))throw Error('Invalid spaces array');return {sha256:await hash(raw),bytes:new TextEncoder().encode(raw).byteLength,spaces:s.spaces.length};},
   async stage(raw){if(typeof raw!=='string')throw Error('String payload required');const parsed=JSON.parse(raw);if(!Array.isArray(parsed.spaces)||!parsed.spaces.length)throw Error('Invalid spaces');const fingerprint=await hash(raw);const db=await open();try{const id='integration-staging-'+fingerprint;await write(db,{id,raw,sha256:fingerprint,spaces:parsed.spaces.length,mode:'staging-only'});const back=await read(db,id);if(!back||back.raw!==raw||back.sha256!==fingerprint||await hash(back.raw)!==fingerprint)throw Error('Staged readback mismatch');return {id,sha256:fingerprint,spaces:parsed.spaces.length};}finally{db.close();}},
   async readStaged(id){if(!/^integration-staging-[a-f0-9]{64}$/.test(id))throw Error('Only staging records can be read');const db=await open();try{const rec=await read(db,id);if(!rec||!rec.raw||await hash(rec.raw)!==rec.sha256)throw Error('Staging record missing or hash invalid');return rec.raw;}finally{db.close();}},
   async removeStaged(id){if(!/^integration-staging-[a-f0-9]{64}$/.test(id))throw Error('Only staging records can be removed');const db=await open();try{await del(db,id);}finally{db.close();}}
 });
 window.otgStorageStaging8275=api;
 // Read-only report: detect native entrypoints without dumping source or personal saved state.
 window.otgStorageReadiness8275=async function(host){if(!host)return;const button=host.closest('.e275-readiness')?.querySelector('button');if(button)button.disabled=true;
  try{
   const before=localStorage.getItem(KEY);if(!before)throw Error('Main save not found');
   const info=await api.inspect();
   const sourceCandidates=['js/core.js','js/studio-final-v7020.js','js/studio-release-v595.js','js/studio-v6-garage-foundation-v600.js'];
   const sourceInfo=[];
   for(const path of sourceCandidates){try{const r=await fetch(path,{cache:'no-store'});sourceInfo.push({path,http:r.status,available:r.ok});}catch(e){sourceInfo.push({path,available:false,error:'fetch unavailable'});}}
   const funcs={rhLoad:typeof window.rhLoad==='function',rhSave:typeof window.rhSave==='function',rhSync:typeof window.rhSync==='function'};
   const originalIntact=before===localStorage.getItem(KEY);if(!originalIntact)throw Error('Original main save changed during read-only inspection');
   const report={version:'8.0.275',result:'STAGING ADAPTER READY — NOT LIVE',sourceKey:KEY,bytes:info.bytes,spaces:info.spaces,sourceSHA256:info.sha256,functions:funcs,sourceScripts:sourceInfo,liveStorageSwitched:false,originalPreserved:true,checkedAt:new Date().toISOString()};
   window.otgStorageReadinessReport8275=report;
   host.innerHTML='<p style="color:#78e4b4"><b>✓ STAGED SAVE ADAPTER READY (NO SWITCH)</b></p><p>'+info.spaces+' Spaces · source SHA-256 '+esc(info.sha256.slice(0,16))+'…</p><p>Native hooks: load '+(funcs.rhLoad?'✓':'—')+' · save '+(funcs.rhSave?'✓':'—')+' · sync '+(funcs.rhSync?'✓':'—')+'</p><p><b>Next required:</b> inspect the original synchronous save-engine implementation before turning on automatic IndexedDB writes. This QA tool has not intercepted any live saves.</p><button type="button" data-download275>DOWNLOAD SAFE READINESS REPORT</button>';
   host.querySelector('[data-download275]').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='OTG_v8.0.275_STORAGE_ENGINE_READINESS.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);});
  }catch(e){host.innerHTML='<p role="status">SAFE STOP — '+esc(e.message||e)+'. No storage switch attempted.</p>';}
  finally{if(button)button.disabled=false;}
 };
})();
