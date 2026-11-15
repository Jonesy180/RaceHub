/* OTG! MAIN v8.0.301 — independent non-live event journal contract.
 * STRICTLY PRELAUNCH: no access to rhSave, no mutations to live runs or cars.
 * Implements stable round route locks, optimistic revisions and cold-read.
 */
(()=>{'use strict';
 const DB='OTG_Evil2_EventJournal_v1',OS='events',KEY='stage-001-rehearsal';
 const digest=async obj=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(obj)))),b=>b.toString(16).padStart(2,'0')).join('');
 const clone=obj=>JSON.parse(JSON.stringify(obj));
 const open=()=>new Promise((yes,no)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(OS))r.result.createObjectStore(OS,{keyPath:'id'});};r.onsuccess=()=>yes(r.result);r.onerror=()=>no(r.error||Error('Event journal database unavailable'));r.onblocked=()=>no(Error('Event journal blocked by other tab'));});
 const read=(db)=>new Promise((yes,no)=>{const q=db.transaction(OS,'readonly').objectStore(OS).get(KEY);q.onsuccess=()=>yes(q.result||null);q.onerror=()=>no(q.error||Error('Event journal read failed'));});
 const put=(db,rec)=>new Promise((yes,no)=>{const tx=db.transaction(OS,'readwrite');tx.objectStore(OS).put(rec);tx.oncomplete=()=>yes();tx.onabort=()=>no(tx.error||Error('Event journal aborted'));tx.onerror=()=>no(tx.error||Error('Event journal write failed'));});
 // Stage inputs cannot carry any invented race result or winning position.
 const validate=async rec=>{
  if(!rec||rec.id!==KEY||rec.mode!=='PRELAUNCH_ONLY'||rec.active!==false||rec.completed!==false||rec.revision!==0)throw Error('Journal status is not a safe prelaunch record');
  if(!rec.drawSha256||!rec.stageId||!rec.stageName||!rec.category||!Number.isInteger(rec.roundCount)||rec.roundCount<1||rec.roundCount>10)throw Error('Incomplete source-verified race definition');
  if(!Array.isArray(rec.routes)||rec.routes.length!==rec.roundCount||new Set(rec.routes).size!==rec.routes.length||rec.routes.some(s=>typeof s!=='string'||!s.trim()))throw Error('Unverified or duplicate round routes');
  if(Object.prototype.hasOwnProperty.call(rec,'results')||Object.prototype.hasOwnProperty.call(rec,'winner')||Object.prototype.hasOwnProperty.call(rec,'entrants'))throw Error('Rehearsal is forbidden to invent racing data');
  const payload={mode:rec.mode,active:rec.active,completed:rec.completed,revision:rec.revision,drawSha256:rec.drawSha256,stageId:rec.stageId,stageName:rec.stageName,category:rec.category,roundCount:rec.roundCount,routes:rec.routes};
  if(rec.integrity!==await digest(payload))throw Error('Event journal integrity mismatch');return true;
 };
 const make=async input=>{
  const rec={id:KEY,mode:'PRELAUNCH_ONLY',active:false,completed:false,revision:0,drawSha256:String(input.drawSha256||''),stageId:String(input.stageId||''),stageName:String(input.stageName||''),category:String(input.category||''),roundCount:Number(input.roundCount),routes:clone(input.routes||[])};
  const payload={mode:rec.mode,active:rec.active,completed:rec.completed,revision:rec.revision,drawSha256:rec.drawSha256,stageId:rec.stageId,stageName:rec.stageName,category:rec.category,roundCount:rec.roundCount,routes:rec.routes};
  rec.integrity=await digest(payload);await validate(rec);return rec;
 };
 async function rehearse(input){
  const wanted=await make(input);
  let db=await open();try{
   const before=await read(db);
   if(before){await validate(before);
    if(before.drawSha256===wanted.drawSha256){
     if(before.integrity!==wanted.integrity)throw Error('Existing stage route lock conflicts with current track proposal');
     return {reused:true,verified:true,stageName:before.stageName,routes:clone(before.routes),digest:before.integrity};
    }
    // A new PROVISIONAL draw is allowed to replace only a PRELAUNCH rehearsal.
   }
   await put(db,wanted);
  }finally{db.close();}
  // Critical: reopen a fresh connection, don't trust a hot memory object.
  db=await open();try{const got=await read(db);await validate(got);if(got.integrity!==wanted.integrity)throw Error('Journal cold-read differs from written route lock');return {reused:false,verified:true,stageName:got.stageName,routes:clone(got.routes),digest:got.integrity};}finally{db.close();}
 }
 async function verify(){const db=await open();try{const rec=await read(db);if(!rec)return {ok:false,reason:'Not prepared'};await validate(rec);return {ok:true,stageId:rec.stageId,stageName:rec.stageName,routes:clone(rec.routes),drawSha256:rec.drawSha256};}finally{db.close();}}
 window.otgEvilJournal8301=Object.freeze({rehearse,verify});
})();
