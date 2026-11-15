/* OTG! v8.0.278 -- read-only startup storage cutover preflight.
   Neither changes source state nor localStorage nor installs live saving hooks.
   A bounded read-only verification runs alongside normal synchronous startup;
   the native load path remains untouched to avoid changing script ordering. */
(()=>{'use strict';
 const SOURCE='RaceHub_Studio_Final_v5_6';
 const DB='OTG_Main_State_Migration_Proof_v1',STORE='verified_copies';
 const status={checked:false,available:false,valid:false,matching:false,spaces:0,reason:'Not checked'};
 const hash=async raw=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw))),n=>n.toString(16).padStart(2,'0')).join('');
 const open=()=>new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error||Error('IndexedDB open failed'));r.onblocked=()=>reject(Error('IndexedDB blocked'));r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE,{keyPath:'id'});};});
 const read=(db,key)=>new Promise((resolve,reject)=>{const r=db.transaction(STORE,'readonly').objectStore(STORE).get(key);r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error||Error('Read failed'));});
 async function check(){
  try{
   const raw=localStorage.getItem(SOURCE);if(!raw)throw Error('Main localStorage save missing');
   const source=JSON.parse(raw);if(!Array.isArray(source.spaces)||!source.spaces.length)throw Error('Source Spaces invalid');
   status.spaces=source.spaces.length;
   const db=await open();status.available=true;
   try{
    // v8276 shadow or v8272 verified copy may exist. Do not create a new copy here.
    for(const id of ['native-shadow-current-v8276','native-shadow-v8276','original-copy-v8272','exact-copy-v8272']){
     const copy=await read(db,id);if(!copy||!copy.raw)continue;
     if(!copy.sha256||await hash(copy.raw)!==copy.sha256)continue;
     const parsed=JSON.parse(copy.raw);if(!Array.isArray(parsed.spaces)||parsed.spaces.length!==source.spaces.length)continue;
     status.valid=true;status.matching=(copy.raw===raw);status.reason=status.matching?'Verified IndexedDB copy matches current main save':'Verified IndexedDB copy is older than current localStorage save';break;
    }
    if(!status.valid)status.reason='No matching named verified copy found; no live switch attempted';
   }finally{db.close();}
  }catch(e){status.reason=String(e.message||e);}finally{status.checked=true;}
  return {...status};
 }
 const startup=Promise.race([check(),new Promise(resolve=>setTimeout(()=>resolve({...status,reason:'Startup read-only probe timed out; using existing save engine'}),1700))]);
 window.otgIDBStartupStatus8278=()=>({...status});
 window.otgIDBStartupGate8278=()=>startup;
})();
