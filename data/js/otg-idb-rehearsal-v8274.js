/* OTG! 8.0.274: isolated reversible IndexedDB save/reopen rehearsal.
   No live store switch, no localStorage writes, no delete of original proof. */
(()=>{'use strict';
const KEY='RaceHub_Studio_Final_v5_6',DB='OTG_Main_State_Migration_Proof_v1',STORE='verified_copies';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const status=(h,t,pass)=>{h.innerHTML='<p role="status" style="color:'+(pass?'#78e4b4':'#d3e3ea')+'">'+esc(t)+'</p>';};
const sha=async s=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))),b=>b.toString(16).padStart(2,'0')).join('');
function dbOpen(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE,{keyPath:'id'});};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error||Error('Database open failed'));r.onblocked=()=>reject(Error('Database blocked'));});}
function write(db,record){return new Promise((resolve,reject)=>{const t=db.transaction(STORE,'readwrite');t.objectStore(STORE).put(record);t.oncomplete=resolve;t.onerror=()=>reject(t.error||Error('Write failed'));t.onabort=()=>reject(t.error||Error('Write aborted'));});}
function remove(db,id){return new Promise((resolve,reject)=>{const t=db.transaction(STORE,'readwrite');t.objectStore(STORE).delete(id);t.oncomplete=resolve;t.onerror=()=>reject(t.error||Error('Cleanup failed'));t.onabort=()=>reject(t.error||Error('Cleanup aborted'));});}
function read(db,id){return new Promise((resolve,reject)=>{const t=db.transaction(STORE,'readonly'),r=t.objectStore(STORE).get(id);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error||Error('Read failed'));});}
async function run(host){if(!host)return;const button=host.closest('.e274-rehearsal')?.querySelector('button');if(button)button.disabled=true;
let db=null,scratchId=null,source=null;
try{
 if(!crypto?.subtle||!indexedDB)throw Error('Secure browser storage APIs unavailable');
 status(host,'Validating original main save and the previously verified IndexedDB proof…');
 source=localStorage.getItem(KEY);if(!source)throw Error('Original localStorage save missing');
 const original=JSON.parse(source);if(!original||!Array.isArray(original.spaces)||!original.spaces.length)throw Error('Unexpected saved Spaces structure');
 const originalCount=original.spaces.length,originalIDs=original.spaces.map(x=>String(x.id));
 const fingerprint=await sha(source);db=await dbOpen();
 const proof=await read(db,'main-'+fingerprint);
 if(!proof||proof.raw!==source||proof.sha256!==fingerprint)throw Error('IndexedDB exact-copy proof missing or stale; run COPY & VERIFY first');
 // Make a separate scratch record: never overwrite the verified source.
 scratchId='rehearsal-'+fingerprint;
 if(await read(db,scratchId))throw Error('Existing scratch transaction found; refusing to overwrite it');
 await write(db,{id:scratchId,sourceKey:KEY,raw:proof.raw,sha256:fingerprint,spaces:originalCount,mode:'scratch-only',rehearsal:true});
 db.close();db=null;
 // Simulate reopening on a fresh DB handle, then verify content exactly.
 db=await dbOpen();const reopened=await read(db,scratchId);
 if(!reopened||reopened.raw!==source||reopened.sha256!==fingerprint||reopened.spaces!==originalCount)throw Error('Scratch save/reopen verification mismatch');
 if(await sha(reopened.raw)!==fingerprint)throw Error('SHA-256 mismatch after reopen');
 const reread=JSON.parse(reopened.raw);if(JSON.stringify(reread.spaces.map(x=>String(x.id)))!==JSON.stringify(originalIDs))throw Error('Space identity mismatch');
 if(localStorage.getItem(KEY)!==source)throw Error('Original localStorage changed during test — stop');
 const reference=await read(db,'main-'+fingerprint);if(!reference||reference.raw!==source)throw Error('Original verified IndexedDB copy changed');
 await remove(db,scratchId);scratchId=null;
 if(await read(db,'rehearsal-'+fingerprint))throw Error('Scratch cleanup did not verify');
 const report={result:'PASS — isolated IndexedDB write/reopen/cleanup',spaces:originalCount,sourceKey:KEY,sha256:fingerprint,originalPreserved:true,proofPreserved:true,liveSaveSwitched:false,scratchCleaned:true,checkedAt:new Date().toISOString()};
 window.rhIDBRehearsalReport8274=report;
 host.innerHTML='<p style="color:#78e4b4"><b>✓ IDB REHEARSAL — PASS</b></p><p>'+originalCount+' Spaces verified · SHA-256 '+esc(fingerprint.slice(0,16))+'…</p><p>Scratch transaction saved, reopened, checked and removed. Original localStorage and verified copy remain untouched.</p><p><b>No live save switch yet.</b> Native synchronous save integration still requires the full original save-engine source.</p><button type="button" data-e274-download>DOWNLOAD REHEARSAL REPORT</button>';
 host.querySelector('[data-e274-download]').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='OTG_v8.0.274_IDB_REHEARSAL_REPORT.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);});
}catch(e){status(host,'SAFE STOP — '+String(e?.message||e)+'. No intentional changes to the original saved state.');}
finally{if(db){if(scratchId){try{await remove(db,scratchId);}catch(_){/* keep original protected; scratch never used for app saving */}}db.close();}if(button)button.disabled=false;}
}
window.rhIDBRehearse8274=run;
})();
