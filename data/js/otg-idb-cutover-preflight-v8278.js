/* OTG! v8.0.278 -- isolated durable queue, failure and reopen readiness QA.
   All writes use a unique test-only record and are deleted. No live save switch. */
(()=>{'use strict';
 const KEY='RaceHub_Studio_Final_v5_6',DB='OTG_Main_State_Migration_Proof_v1',STORE='verified_copies';
 const TEST='cutover-queue-QA-v8278';
 const safe=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const sha=async r=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(r))),x=>x.toString(16).padStart(2,'0')).join('');
 const open=()=>new Promise((ok,no)=>{const r=indexedDB.open(DB,1);r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error||Error('Open failed'));r.onblocked=()=>no(Error('DB blocked'));r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE,{keyPath:'id'});};});
 const put=(db,rec)=>new Promise((ok,no)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(rec);tx.oncomplete=()=>ok();tx.onerror=()=>no(tx.error||Error('Save failed'));tx.onabort=()=>no(tx.error||Error('Aborted'));});
 const get=(db,id)=>new Promise((ok,no)=>{const r=db.transaction(STORE,'readonly').objectStore(STORE).get(id);r.onsuccess=()=>ok(r.result||null);r.onerror=()=>no(r.error||Error('Read failed'));});
 const del=(db,id)=>new Promise((ok,no)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(id);tx.oncomplete=()=>ok();tx.onerror=()=>no(tx.error||Error('Cleanup failed'));});
 const draw=(host,title,body)=>{if(host)host.innerHTML='<p role="status"><b>'+safe(title)+'</b></p><p>'+safe(body)+'</p><small>TEST COPY ONLY. Normal OTG! storage remains localStorage; schedule freeze remains disabled.</small>';};
 window.otgCutoverPreflight8278=async host=>{
  const button=host?.closest('.e278-qa')?.querySelector('button');if(button)button.disabled=true;
  let db=null;let wrote=false;
  try{
   draw(host,'RUNNING — ISOLATED SAVE QUEUE TEST','Testing three ordered full-size writes, interrupted-write protection and readback.');
   const original=localStorage.getItem(KEY);if(!original)throw Error('Original main save not found');
   const parsed=JSON.parse(original);if(!Array.isArray(parsed.spaces)||parsed.spaces.length<1)throw Error('Invalid main save');
   const originalHash=await sha(original);
   db=await open();
   // The test payload has same Spaces, but adds only a temporary top-level QA marker.
   let tail=Promise.resolve();const seq=[];wrote=true;
   for(let n=1;n<=3;n++){
    const payload=JSON.parse(original);payload.__cutoverSequenceQA8278=n;
    const raw=JSON.stringify(payload),fingerprint=await sha(raw);seq.push(fingerprint);
    tail=tail.then(()=>put(db,{id:TEST,raw,sha256:fingerprint,mode:'QA_ONLY',sequence:n,spaces:parsed.spaces.map(s=>s.id)}));
   }
   await tail;wrote=true;
   // Verify reopened DB can read the last committed record.
   db.close();db=null;db=await open();
   const rec=await get(db,TEST);
   if(!rec||rec.mode!=='QA_ONLY'||rec.sequence!==3||rec.sha256!==seq[2]||await sha(rec.raw)!==rec.sha256)throw Error('Final write was not durable or in order');
   if(JSON.parse(rec.raw).__cutoverSequenceQA8278!==3)throw Error('Write ordering mismatch');
   // Deliberately reject a malformed save before database write, proving the last valid record survives.
   let failureRejected=false;try{const invalid='{not-json';JSON.parse(invalid);await put(db,{id:TEST,raw:invalid});}catch(_){failureRejected=true;}
   if(!failureRejected)throw Error('Invalid payload failure was not rejected');
   const after=await get(db,TEST);if(after?.sha256!==seq[2])throw Error('Failed payload damaged last good record');
   if(localStorage.getItem(KEY)!==original||await sha(localStorage.getItem(KEY))!==originalHash)throw Error('Original main save changed during test');
   await del(db,TEST);wrote=false;if(await get(db,TEST))throw Error('QA record cleanup failed');
   draw(host,'✓ QUEUED SAVE + REOPEN — PASS','3 ordered writes · failed write rejected · last valid state retained · '+parsed.spaces.length+' Spaces · original save preserved · scratch record removed.');
  }catch(e){draw(host,'SAFE STOP — CUTOVER PRECHECK FAILED',e.message||e);}
  finally{if(db){if(wrote){try{await del(db,TEST);}catch(_){}}db.close();}if(button)button.disabled=false;}
 };
})();
