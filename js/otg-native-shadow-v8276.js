/* OTG! v8.0.276 — opt-in native rhSave shadow bridge; never switches primary storage. */
(()=>{'use strict';
 const KEY='RaceHub_Studio_Final_v5_6', DB='OTG_Native_Shadow_v8276', STORE='records', RECORD='live-shadow';
 const status={enabled:false,attempts:0,verified:0,lastSha:'',lastError:'',pending:false,spaces:0};
 let tail=Promise.resolve();
 const digest=async raw=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw))),x=>x.toString(16).padStart(2,'0')).join('');
 const open=()=>new Promise((resolve,reject)=>{const q=indexedDB.open(DB,1);q.onupgradeneeded=()=>{if(!q.result.objectStoreNames.contains(STORE))q.result.createObjectStore(STORE,{keyPath:'id'});};q.onerror=()=>reject(q.error||Error('IndexedDB open failed'));q.onblocked=()=>reject(Error('IndexedDB blocked'));q.onsuccess=()=>resolve(q.result);});
 const put=(db,rec)=>new Promise((res,rej)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(rec);tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error||Error('IndexedDB write failed'));tx.onabort=()=>rej(tx.error||Error('IndexedDB write aborted'));});
 const get=(db,id)=>new Promise((res,rej)=>{const q=db.transaction(STORE,'readonly').objectStore(STORE).get(id);q.onsuccess=()=>res(q.result||null);q.onerror=()=>rej(q.error||Error('IndexedDB read failed'));});
 const esc=s=>String(s).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
 const render=host=>{if(!host)return;const s=status;host.innerHTML='<p><b>'+ (s.lastError?'⚠ SHADOW FAILURE — '+esc(s.lastError):(s.verified?'✓ VERIFIED SHADOW — PASS':'No shadow write verified yet'))+'</b></p><p>Session watch: '+(s.enabled?'ON':'OFF')+' · Native save hooks observed: '+s.attempts+' · Verified IndexedDB writes: '+s.verified+' · Spaces: '+s.spaces+'</p>'+(s.lastSha?'<p>Last SHA-256: '+esc(s.lastSha.slice(0,20))+'…</p>':'')+'<p><small>The original localStorage save remains primary. This session-only shadow is NOT a live storage migration and cannot prevent localStorage quota errors.</small></p>';};
 const targets=new Set();function report(){for(const host of targets)if(host.isConnected)render(host);else targets.delete(host);}
 async function shadow(raw){
  const before=localStorage.getItem(KEY);if(before!==raw)throw Error('Original save changed before mirror; skipped');
  const parsed=JSON.parse(raw);if(!Array.isArray(parsed.spaces)||!parsed.spaces.length)throw Error('Main save lacks valid Spaces');
  const sha=await digest(raw),db=await open();
  try{await put(db,{id:RECORD,raw,sha256:sha,spaces:parsed.spaces.length,savedAt:new Date().toISOString()});const copy=await get(db,RECORD);
   if(!copy||copy.raw!==raw||copy.sha256!==sha||(await digest(copy.raw))!==sha)throw Error('Shadow verification mismatch');
   status.verified++;status.spaces=parsed.spaces.length;status.lastSha=sha;status.lastError='';
  }finally{db.close();}
 }
 function schedule(){if(!status.enabled)return;let raw;try{raw=localStorage.getItem(KEY);if(!raw)throw Error('Main save missing');}catch(e){status.lastError=String(e.message||e);report();return;}
  status.attempts++;status.pending=true;
  tail=tail.catch(()=>{}).then(async()=>{try{await shadow(raw);}catch(e){status.lastError=String(e.message||e);}finally{status.pending=false;report();}});report();
 }
 window.otgNativeShadowEnable8276=async function(host){if(host)targets.add(host);if(status.enabled){render(host);return;}
  try{if(typeof window.rhSave!=='function')throw Error('Native rhSave unavailable');const existing=localStorage.getItem(KEY);if(!existing)throw Error('Original main save missing');
   await shadow(existing);if(localStorage.getItem(KEY)!==existing)throw Error('Original save changed during initial verification');
   const original=window.rhSave;
   window.rhSave=function(...args){const value=original.apply(this,args);schedule();return value;};
   status.enabled=true;status.lastError='';report();
  }catch(e){status.lastError=String(e.message||e);report();}
 };
 window.otgNativeShadowStatus8276=function(host){if(host){targets.add(host);render(host);}return {...status};};
})();