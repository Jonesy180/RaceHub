/* OTG! v8.0.277 — protected durable-write transition checkpoint.
   This is NOT a primary-storage switch. Keeps live app data completely unchanged.
   Full-size modified CLONE is written to IndexedDB, validated, then verified after a fresh app load.
*/
(()=>{'use strict';
 const KEY='RaceHub_Studio_Final_v5_6', DB='OTG_Main_State_Migration_Proof_v1', STORE='verified_copies', ID='transition-checkpoint-v8277';
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const hash=async raw=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw))),v=>v.toString(16).padStart(2,'0')).join('');
 const open=()=>new Promise((res,rej)=>{let q=indexedDB.open(DB,1);q.onupgradeneeded=()=>{if(!q.result.objectStoreNames.contains(STORE))q.result.createObjectStore(STORE,{keyPath:'id'});};q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error||Error('IndexedDB open failed'));q.onblocked=()=>rej(Error('IndexedDB blocked'));});
 const put=(db,obj)=>new Promise((res,rej)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(obj);tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error||Error('Write failed'));tx.onabort=()=>rej(tx.error||Error('Write aborted'));});
 const get=(db,id)=>new Promise((res,rej)=>{const q=db.transaction(STORE,'readonly').objectStore(STORE).get(id);q.onsuccess=()=>res(q.result||null);q.onerror=()=>rej(q.error||Error('Read failed'));});
 const del=(db,id)=>new Promise((res,rej)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(id);tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error||Error('Delete failed'));tx.onabort=()=>rej(tx.error||Error('Delete aborted'));});
 function valid(raw){const p=JSON.parse(raw);if(!p||!Array.isArray(p.spaces)||p.spaces.length<1||p.spaces.some(s=>!s||!s.id||!Array.isArray(s.cars)))throw Error('Stored Spaces are malformed');return p;}
 function render(host,type,details){if(!host)return;host.innerHTML='<p role="status"><b>'+esc(type)+'</b></p><p>'+esc(details)+'</p><p><small>Read/write QA only. Original main save remains primary and is never replaced by this test. Schedule freeze stays disabled.</small></p>';}
 async function stage(host){try{
  render(host,'RUNNING — testing durable save of modified clone','Do not close the app during this write.');
  const before=localStorage.getItem(KEY);if(!before)throw Error('Original main save missing');const orig=valid(before);
  const baseline=await hash(before);
  // The cloned test payload gets a private QA-only marker; no real Garage, results, or live state mutation.
  const changed=JSON.parse(before), marker='QA-v8277-'+Date.now()+'-'+Math.random().toString(36).slice(2);
  changed.__otgStorageTransitionProbe8277=marker;
  const raw=JSON.stringify(changed), changedHash=await hash(raw);
  const db=await open();try{
   await put(db,{id:ID,raw,sha256:changedHash,sourceSha256:baseline,marker,spaces:orig.spaces.map(s=>s.id),createdAt:new Date().toISOString(),mode:'TEST_CLONE_ONLY'});
   const rec=await get(db,ID);if(!rec||rec.raw!==raw||rec.sha256!==changedHash||await hash(rec.raw)!==changedHash)throw Error('Immediate readback mismatch');
  }finally{db.close();}
  if(localStorage.getItem(KEY)!==before)throw Error('Original save changed while testing — probe retained for investigation');
  render(host,'✓ CHECKPOINT WRITTEN — PASS','A modified copy of all '+orig.spaces.length+' Spaces was saved and verified in IndexedDB. CLOSE AND REOPEN OTG!, then press VERIFY AFTER REOPEN.');
 }catch(e){render(host,'SAFE STOP — CHECKPOINT FAILED',e.message||e);}}
 async function verify(host){try{
  render(host,'CHECKING PERSISTENCE','Reading the test checkpoint from IndexedDB.');
  const db=await open();let rec;try{rec=await get(db,ID);}finally{db.close();}
  if(!rec||rec.mode!=='TEST_CLONE_ONLY')throw Error('No valid checkpoint. Run WRITE CHECKPOINT first.');
  const parsed=valid(rec.raw);if(parsed.__otgStorageTransitionProbe8277!==rec.marker)throw Error('Test marker mismatch');
  if(await hash(rec.raw)!==rec.sha256)throw Error('Saved checksum mismatch');
  if(parsed.spaces.length!==rec.spaces.length||parsed.spaces.some((s,i)=>s.id!==rec.spaces[i]))throw Error('Space identities changed');
  const current=localStorage.getItem(KEY);if(!current||!valid(current))throw Error('Original main save unavailable');
  // The original is allowed to evolve independently after staging, but must never contain probe marker.
  if(current.includes(rec.marker))throw Error('Test marker leaked into original main save');
  const db2=await open();try{await del(db2,ID);if(await get(db2,ID))throw Error('Test checkpoint cleanup failed');}finally{db2.close();}
  render(host,'✓ DURABLE REOPEN — PASS',rec.spaces.length+' Spaces verified; modified test payload survived app restart; checkpoint cleaned up. Original save unchanged by this test. Primary storage NOT switched.');
 }catch(e){render(host,'SAFE STOP — REOPEN CHECK FAILED',e.message||e);}}
 window.otgTransitionWrite8277=stage;
 window.otgTransitionVerify8277=verify;
})();
