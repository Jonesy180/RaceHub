/* OTG! v8.0.272: protected copy-only IndexedDB proof. No localStorage writes, no app storage switching. */
(()=>{'use strict';
const KEY='RaceHub_Studio_Final_v5_6';
const DB='OTG_Main_State_Migration_Proof_v1';
const STORE='verified_copies';
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const status=(host,msg,good)=>{host.innerHTML='<div role="status" class="e272-status '+(good?'e272-good':'')+'">'+E(msg)+'</div>';};
function openDb(){return new Promise((resolve,reject)=>{
 if(!('indexedDB' in window))return reject(new Error('IndexedDB is not available on this device.'));
 const req=indexedDB.open(DB,1);
 req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:'id'});};
 req.onsuccess=()=>resolve(req.result);
 req.onerror=()=>reject(req.error||Error('IndexedDB open failed'));
 req.onblocked=()=>reject(Error('IndexedDB is blocked by another open tab.'));
});}
function put(db,value){return new Promise((resolve,reject)=>{
 let tx;try{tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(value);}catch(e){reject(e);return;}
 tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error||Error('IndexedDB write failed'));
 tx.onabort=()=>reject(tx.error||Error('IndexedDB transaction aborted'));
 });}
function get(db,id){return new Promise((resolve,reject)=>{
 let tx;try{tx=db.transaction(STORE,'readonly');const r=tx.objectStore(STORE).get(id);
 r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error||Error('IndexedDB read failed'));
 }catch(e){reject(e);}});}
function hex(b){return Array.from(new Uint8Array(b),x=>x.toString(16).padStart(2,'0')).join('');}
async function sha(s){if(!window.crypto?.subtle)throw Error('Secure SHA-256 unavailable. No migration performed.');return hex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)));}
async function verify(host){
 if(!host)return;
 const button=host.closest('.e272-migration')?.querySelector('[data-e263="idbcopy"]');
 if(button)button.disabled=true;
 let db;
 try{
 status(host,'Reading and validating the exact localStorage save (no changes to the original)…',false);
 const before=localStorage.getItem(KEY);
 if(!before)throw Error('Main save was not found. No copy made.');
 let parsed;try{parsed=JSON.parse(before);}catch(_){throw Error('Original main save is not valid JSON. No copy made.');}
 if(!parsed || typeof parsed!=='object'||Array.isArray(parsed))throw Error('Unexpected main save structure. No copy made.');
 const digest=await sha(before);
 const length=before.length;
 const spaceCount=Array.isArray(parsed.spaces)?parsed.spaces.length:null;
 db=await openDb();
 const id='main-'+digest;
 const existing=await get(db,id);
 if(existing && existing.raw!==before)throw Error('Existing IndexedDB proof copy hash collision/mismatch. Stopped.');
 if(!existing){
   status(host,'Copying main save into IndexedDB. The original remains untouched…',false);
   await put(db,{id,sourceKey:KEY,raw:before,sha256:digest,characters:length,spaces:spaceCount,createdAt:new Date().toISOString(),sourceVersion:'8.0.271'});
 }
 const readback=await get(db,id);
 if(!readback||readback.raw!==before||readback.sha256!==digest||readback.characters!==length)throw Error('Read-back comparison failed. Do NOT use the copy.');
 const rereadDigest=await sha(readback.raw);
 if(rereadDigest!==digest)throw Error('IndexedDB read-back SHA-256 mismatch.');
 const still=localStorage.getItem(KEY);
 if(still!==before)throw Error('Original save changed while verifying; proof is stale. No storage switch performed.');
 const report={result:'PASS — IndexedDB copy exactly verified',originalUnchanged:true,storageSwitched:false,localStorageDeleted:false,sourceKey:KEY,characters:length,approxUtf16MiB:+(length*2/1048576).toFixed(2),spaces:spaceCount,sha256:digest,indexedDB:DB,recordId:id,verifiedAt:new Date().toISOString()};
 window.rhIDBCopyProof8272=report;
 host.innerHTML='<p class="e272-good"><b>✓ VERIFIED COPY — PASS</b></p><p>Exact IndexedDB read-back matches the original save. SHA-256: <code>'+E(digest.slice(0,16))+'…</code></p><p>Source: '+E(KEY)+' · '+report.approxUtf16MiB+' MiB · '+(spaceCount??'unknown')+' Spaces</p><p><b>No live migration.</b> OTG! still saves to localStorage. The original has NOT been deleted or changed.</p><button type="button" data-e272-report>DOWNLOAD VERIFICATION REPORT</button>';
 host.querySelector('[data-e272-report]').addEventListener('click',()=>download(JSON.stringify(report,null,2),'OTG_IDB_COPY_VERIFICATION_v8.0.272.json'));
 }catch(e){status(host,'SAFE STOP — '+String(e.message||e)+'. Original save has not been intentionally modified. Do not attempt the schedule freeze.',false);}
 finally{if(db)db.close();if(button)button.disabled=false;}
}
function download(data,name){const blob=new Blob([data],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);}
window.rhIDBCopyVerify8272=verify;
})();
