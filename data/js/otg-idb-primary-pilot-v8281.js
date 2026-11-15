/* OTG! MAIN 8.0.280 — EXPLICIT, ISOLATED IndexedDB primary-save PILOT.
   DEFAULT DISABLED. Original localStorage saved state remains untouched.
   NEVER enable during live racing; this pilot saves only an isolated IDB clone.
   This is a full native rhSave/rhLoad integration experiment, not production migration. */
(()=>{'use strict';
 const SRC='RaceHub_Studio_Final_v5_6',FLAG='otg.idb.primary.pilot8279';
 const DB='OTG_Main_State_Migration_Proof_v1',TABLE='verified_copies',KEY='live-primary-pilot-v8279';
 const ESC=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const active=()=>localStorage.getItem(FLAG)==='yes';
 let status={mode:active()?'PILOT':'OFF',saved:0,pending:0,error:'',restored:false,spaces:0,lastHash:'',lastSaved:''},queue=Promise.resolve(),pilotReady=false,blocked=false;
 const sha=async s=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))),x=>x.toString(16).padStart(2,'0')).join('');
 const open=()=>new Promise((ok,no)=>{let r=indexedDB.open(DB,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(TABLE))r.result.createObjectStore(TABLE,{keyPath:'id'})};r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error||Error('Database open failed'));r.onblocked=()=>no(Error('Database blocked'));});
 const get=(db,id=KEY)=>new Promise((ok,no)=>{const q=db.transaction(TABLE,'readonly').objectStore(TABLE).get(id);q.onsuccess=()=>ok(q.result||null);q.onerror=()=>no(q.error||Error('Database read failed'));});
 const put=(db,rec)=>new Promise((ok,no)=>{const t=db.transaction(TABLE,'readwrite');t.objectStore(TABLE).put(rec);t.oncomplete=()=>ok();t.onerror=()=>no(t.error||Error('Database write failed'));t.onabort=()=>no(t.error||Error('Transaction aborted'));});
 const parse=raw=>{
  const p=JSON.parse(raw);
  // Native v5 saved schema 2; the supplied v6 Garage foundation explicitly uses schema 3.
  if(!p||typeof p!=='object'||![2,3].includes(p.schema))throw Error('Unsupported OTG! save schema (expected 2 or 3)');
  if(!Array.isArray(p.spaces)||!p.spaces.length)throw Error('Missing OTG! Spaces');
  const ids=new Set();
  for(const space of p.spaces){
    if(!space||typeof space!=='object'||typeof space.id!=='string'||!space.id.trim()||ids.has(space.id))throw Error('Invalid or duplicate OTG! Space identity');
    ids.add(space.id);
  }
  if(p.activeSpaceId!=null&&!ids.has(p.activeSpaceId))throw Error('Active OTG! Space missing');
  if(p.defaultSpaceId!=null&&!ids.has(p.defaultSpaceId))throw Error('Default OTG! Space missing');
  return p;
 };
 const draw=(host,title,message)=>{if(host)host.innerHTML='<p role="status"><strong>'+ESC(title)+'</strong></p><p>'+ESC(message)+'</p><small>IndexedDB PILOT: original localStorage not replaced. No real racing during pilot.</small>';};
 function warning(msg){status.error=String(msg);blocked=true;const id='otg279-pilot-save-warning';let d=document.getElementById(id);if(!d){d=document.createElement('div');d.id=id;d.style.cssText='position:fixed;z-index:999999;inset:0;background:#06101bf2;color:#fff;overflow:auto;padding:7vh 6vw;font:18px system-ui';document.body.append(d);}d.innerHTML='<div style="max-width:550px;margin:auto;border:2px solid #f66;border-radius:20px;padding:25px;background:#15212d"><h1>⛔ SAVE FAILURE — SAFE STOP</h1><p>'+ESC(msg)+'</p><p>Do not enter races. Your original localStorage save is untouched. Exit pilot mode to return to that original backup.</p><button id="otg279-export" style="padding:14px">EXPORT UNSAVED PILOT STATE</button> <button id="otg279-exit" style="padding:14px">EXIT PILOT</button></div>';
 d.querySelector('#otg279-export').onclick=()=>{try{const raw=JSON.stringify(typeof state!=='undefined'?state:null);const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([raw],{type:'application/json'}));a.download='OTG_IDB_PILOT_UNSAVED_PRIVATE.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),3000)}catch(_){alert('Export failed; do not close the app.')}};
 d.querySelector('#otg279-exit').onclick=()=>{localStorage.removeItem(FLAG);location.reload();};
 }
 async function checkRec(){const db=await open();try{const rec=await get(db);if(!rec?.raw||!rec.sha256||await sha(rec.raw)!==rec.sha256)throw Error('Stored pilot copy or checksum missing');const parsed=parse(rec.raw);return {rec,parsed};}finally{db.close();}}
 async function activate(host){if(active())return draw(host,'PILOT ALREADY ENABLED','Use pilot QA to verify persistence or exit.');
 if(!confirm('Start an ISOLATED IndexedDB save-engine PILOT? This is NOT production racing. Existing localStorage save will remain unchanged; test changes will be discarded when you exit. Confirm only if your private backup is safe.'))return;
 try{const raw=localStorage.getItem(SRC);if(!raw)throw Error('Original main save missing');const p=parse(raw);const digest=await sha(raw);const db=await open();try{await put(db,{id:KEY,raw,sha256:digest,mode:'PILOT_8280',spaces:p.spaces.length,updatedAt:new Date().toISOString()});const rec=await get(db);if(rec?.raw!==raw||rec?.sha256!==digest||await sha(rec.raw)!==digest)throw Error('Pilot copy read-back mismatch');}finally{db.close();}
 if(localStorage.getItem(SRC)!==raw)throw Error('Source changed during pilot preparation');localStorage.setItem(FLAG,'yes');draw(host,'✓ ISOLATED PILOT CREATED','An exact verified test copy has been saved. Reloading to test the native load path.');setTimeout(()=>location.reload(),650);
 }catch(e){draw(host,'SAFE STOP — PILOT NOT ENABLED',e.message||e);}}
 async function enqueue(raw){if(!active())throw Error('Pilot is not active');if(!pilotReady||blocked)throw Error('Pilot load not verified; write blocked');parse(raw);status.pending++;const task=queue.catch(()=>{}).then(async()=>{if(blocked)throw Error('Earlier pilot write failed');const digest=await sha(raw),db=await open();try{const rec={id:KEY,raw,sha256:digest,mode:'PILOT_8280',updatedAt:new Date().toISOString()};await put(db,rec);const reread=await get(db);if(reread?.raw!==raw||reread?.sha256!==digest||await sha(reread.raw)!==digest)throw Error('Pilot read-back mismatch');status.lastHash=digest;status.lastSaved=rec.updatedAt;status.saved++;}finally{db.close();}});queue=task;
 try{await task;}catch(e){warning(e.message||e);throw e;}finally{status.pending=Math.max(0,status.pending-1);}}
 async function restore(){if(!active())return;
 let cover=document.createElement('div');cover.id='otg279-pilot-loading';cover.style.cssText='position:fixed;inset:0;z-index:99999;background:#06121d;color:white;display:flex;align-items:center;justify-content:center;text-align:center;font:600 18px system-ui;padding:20px';cover.textContent='🛡️ Verifying IndexedDB pilot state before opening OTG!…';document.body.append(cover);
 try{const {rec,parsed}=await checkRec();if(!active())throw Error('Pilot mode disabled during load');
 // The original app starts with legacy state only as a temporary boot placeholder.
 // Replace it with the exact verified pilot state before the user can interact.
 if(typeof state==='undefined'||typeof rhSync!=='function')throw Error('Original OTG! state engine unavailable');
 state=parsed;rhSync();pilotReady=true;status.restored=true;status.spaces=parsed.spaces.length;status.lastHash=rec.sha256;status.lastSaved=rec.updatedAt||'';
 if(typeof show==='function')show('home');cover.remove();
 const banner=document.createElement('div');banner.id='otg279-pilot-banner';banner.style.cssText='position:sticky;top:0;z-index:9990;background:#5b260e;color:white;text-align:center;padding:10px;font:700 14px system-ui';banner.textContent='🛡️ INDEXEDDB PILOT TEST MODE — DO NOT RACE · changes are isolated';document.body.prepend(banner);
 }catch(e){cover.textContent='⛔ PILOT RESTORE FAILED: '+(e.message||e)+'. Original save remains intact. Exit pilot below.';const b=document.createElement('button');b.textContent='EXIT PILOT AND RELOAD ORIGINAL';b.style.cssText='margin:20px;padding:14px';b.onclick=()=>{localStorage.removeItem(FLAG);location.reload();};cover.append(b);blocked=true;}}
 async function test(host){if(!active())return draw(host,'PILOT OFF','Enable pilot first to test the real rhSave entrypoint.');if(!pilotReady)return draw(host,'PILOT NOT READY','Wait until verified IndexedDB restoration completes.');
 try{const old=state.__otgIDBNativePilotQA279||0;state.__otgIDBNativePilotQA279=old+1;const orig=localStorage.getItem(SRC);await window.rhSave();if(localStorage.getItem(SRC)!==orig)throw Error('Original localStorage was changed by pilot save');const {parsed}=await checkRec();if(parsed.__otgIDBNativePilotQA279!==old+1)throw Error('Native rhSave write did not survive readback');draw(host,'✓ NATIVE PILOT WRITE — PASS','Test-only counter '+(old+1)+' durably saved to IndexedDB. Original main save unchanged. Close and reopen OTG!, then press VERIFY REOPEN.');
 }catch(e){draw(host,'SAFE STOP — NATIVE PILOT FAILED',e.message||e);}}
 async function verify(host){if(!active()||!pilotReady)return draw(host,'PILOT NOT ACTIVE','Enable and restore the pilot first.');try{const {parsed}=await checkRec();if(!(parsed.__otgIDBNativePilotQA279>0)||parsed.__otgIDBNativePilotQA279!==state.__otgIDBNativePilotQA279)throw Error('Saved test counter missing or different');draw(host,'✓ PILOT REOPEN — PASS','Native state restored from verified IndexedDB copy; QA counter '+parsed.__otgIDBNativePilotQA279+'; all '+parsed.spaces.length+' Spaces intact. EXIT PILOT to return to original racing data.');}catch(e){draw(host,'SAFE STOP — REOPEN CHECK FAILED',e.message||e);}}
 function exit(){if(!active())return; if(!confirm('Exit TEST PILOT and reload the untouched original OTG! save? Isolated pilot QA changes will not be applied to real racing data.'))return;
 localStorage.removeItem(FLAG);location.reload();}
 // Only while pilot mode is enabled do we intercept native load and save calls.
 // This avoids writing the near-full localStorage record during startup.
 if(active()){
  const oldLoad=window.rhLoad,oldSave=window.rhSave;
  window.rhLoad=function(){try{const raw=localStorage.getItem(SRC);if(raw)return parse(raw);}catch(_){}return oldLoad.apply(this,arguments);};
  window.rhSave=function(){return enqueue(JSON.stringify(state));};
 }
 window.otgPrimaryPilot279={activate,test,verify,exit,status:()=>({...status,active:active()}),isActive:active};
 if(active()){if(document.readyState==='complete')restore();else window.addEventListener('load',restore,{once:true});}
})();