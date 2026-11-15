/* OTG! v8.0.303 — one-time clean Evil 2.0 campaign activation.
 * Only the verified existing draw is locked. Original save is backed up first.
 * Deletes identified Evil-only fields; unclassified shared results are preserved.
 * No new results engine, no external services, no per-race save replacement.
 */
(()=>{'use strict';
 const DB='OTG_Evil2_CampaignVault_v1',OS='drafts',DRAFT='main-draft',ACTIVE='active-campaign',BACKUP='pre-evil2-launch-backup';
 const SAVE='RaceHub_Studio_Final_v5_6',CAM='evil2-native-slot-launch-20261114';
 const KEYS=['evilCampaign8076','evilCampaignR18098','fh5TrackBags8070','evil2Mixed260','evil2NativeRun8250','evil2NewFormats8256','evil2Honours8257','evil2Specialist8259','evil2Restored8261','evil2Swiss8262'];
 let busy=false;
 const open=()=>new Promise((yes,no)=>{const q=indexedDB.open(DB,1);q.onsuccess=()=>yes(q.result);q.onerror=()=>no(q.error||Error('Vault unavailable'));q.onblocked=()=>no(Error('Vault blocked'));});
 const read=(db,key)=>new Promise((yes,no)=>{const q=db.transaction(OS,'readonly').objectStore(OS).get(key);q.onsuccess=()=>yes(q.result||null);q.onerror=()=>no(q.error||Error('Vault read failed'));});
 const put=(db,items)=>new Promise((yes,no)=>{const t=db.transaction(OS,'readwrite');for(const x of items)t.objectStore(OS).put(x);t.oncomplete=()=>yes();t.onerror=()=>no(t.error||Error('Vault write failed'));t.onabort=()=>no(t.error||Error('Vault aborted'));});
 const hash=async str=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(str))),b=>b.toString(16).padStart(2,'0')).join('');
 function stateLive(){const s=typeof state!=='undefined'&&state?.spaces?state:window.state;if(!s||!Array.isArray(s.spaces))throw Error('Live OTG state missing');return s;}
 function space(s){const x=s.spaces.filter(v=>v.catalogueKey==='fh5-catalogue-v1');if(x.length!==1)throw Error('Exactly one FH5 catalogue Space required');return x[0];}
 function isOwnRun(r){return r&&r.evilCampaignR2?.campaign===CAM && /^evil2-/.test(String(r.type||''));}
 function isOwnRaceOff(r){return r&&r.evilCampaignR2?.campaign===CAM && /^evil2-/.test(String(r.type||''));}
 async function status(){const db=await open();try{const a=await read(db,ACTIVE);if(!a)return {active:false};const p=await window.otgEvilRoute8303.inspect();if(!p.active||p.sha256!==a.drawSha256)throw Error('Active manifest integrity mismatch');return {active:true,first:p.first.name,sha:p.sha256,stageCount:p.rows.length,launchedAt:a.launchedAt};}finally{db.close();}}
 async function activate(){if(busy)throw Error('Launch operation already running');busy=true;let db=null,changed=false,oldRaw='',spaceId='';
 try{
  if(localStorage.getItem('otg.idb.primary.pilot8279')==='yes')throw Error('Exit the isolated save pilot first');
  if(typeof window.rhSave!=='function')throw Error('Original proven OTG save engine unavailable');
  db=await open();const existing=await read(db,ACTIVE);if(existing)return status();
  const plan=await window.otgEvilRoute8303.inspect();if(plan.active||plan.rows.length!==2225||!plan.first)throw Error('Verified inactive 2,225-stage draw unavailable');
  const d=await read(db,DRAFT);if(!d||d.drawSha256!==plan.sha256||d.active!==false||d.ids?.length!==2225)throw Error('Campaign draw integrity check failed');
  const live=stateLive(),sp=space(live);spaceId=sp.id;
  const selected=live.spaces.find(x=>String(x.id)===String(live.activeSpaceId));if(selected!==sp)throw Error('Select real FH5 Space to launch');
  oldRaw=localStorage.getItem(SAVE)||'';if(!oldRaw)throw Error('Existing OTG save missing');
  const before=JSON.parse(oldRaw),beforeFH5=space(before);if(beforeFH5.id!==sp.id||before.spaces.length!==live.spaces.length)throw Error('Stored Spaces differ from live state');
  if(JSON.stringify(beforeFH5.cars)!==JSON.stringify(sp.cars))throw Error('Garage save differs from live state; save/refresh before launching');
  if(await hash(plan.rows.map(r=>r.id).join('\n'))==='')throw Error('Unreachable stage guard');
  const backupOld=await read(db,BACKUP);if(backupOld&&backupOld.status==='prepared')throw Error('Previous launch needs recovery; launch stopped');
  const backup={id:BACKUP,status:'prepared',createdAt:new Date().toISOString(),fh5Id:sp.id,drawSha256:d.drawSha256,raw:oldRaw,rawSha256:await hash(oldRaw)};
  await put(db,[backup]);const stored=await read(db,BACKUP);if(stored?.rawSha256!==backup.rawSha256||await hash(stored.raw)!==backup.rawSha256)throw Error('Cold backup verification failed');
  const original=JSON.parse(JSON.stringify(sp));
  const removed=[];for(const k of KEYS)if(Object.prototype.hasOwnProperty.call(sp,k)){delete sp[k];removed.push(k);}
  // Remove only explicit old QA-native runs, never anonymous/shared normal results.
  let removedRuns=0,removedRaceOffs=0;
  if(Array.isArray(sp.runs)){const n=sp.runs.length;sp.runs=sp.runs.filter(r=>!isOwnRun(r));removedRuns=n-sp.runs.length;}
  if(Array.isArray(sp.raceOffs)){const n=sp.raceOffs.length;sp.raceOffs=sp.raceOffs.filter(r=>!isOwnRaceOff(r));removedRaceOffs=n-sp.raceOffs.length;}
  // Save with the SAME OTG native save function already used by Evil 1.0.
  try{window.rhSave();changed=true;}catch(e){Object.keys(sp).forEach(k=>delete sp[k]);Object.assign(sp,original);throw Error('Original OTG save refused the reset: '+String(e.message||e));}
  const afterRaw=localStorage.getItem(SAVE);if(!afterRaw||afterRaw===oldRaw)throw Error('Reset did not persist through native save');
  const after=JSON.parse(afterRaw);if(JSON.stringify(after.spaces.filter(x=>x.id!==sp.id))!==JSON.stringify(before.spaces.filter(x=>x.id!==sp.id)))throw Error('Other Space changed during save');
  const afterFH5=space(after);for(const k of KEYS)if(Object.hasOwn(afterFH5,k))throw Error('Old Evil field '+k+' still present');
  for(const k of Object.keys(beforeFH5)){if(KEYS.includes(k)||k==='runs'||k==='raceOffs')continue;if(JSON.stringify(beforeFH5[k])!==JSON.stringify(afterFH5[k]))throw Error('Protected FH5 field changed: '+k);}
  if(JSON.stringify(afterFH5.cars)!==JSON.stringify(beforeFH5.cars))throw Error('Garage changed');
  const active={...d,id:ACTIVE,mode:'LIVE_EVIL2',active:true,spaceId:sp.id,launchedAt:new Date().toISOString(),oldEvilKeysRetired:removed,oldQAResultsRetired:{runs:removedRuns,raceOffs:removedRaceOffs},backupSha256:backup.rawSha256};
  await put(db,[active,{...backup,status:'launched',launchSha256:d.drawSha256}]);
  const persisted=await read(db,ACTIVE);if(persisted?.drawSha256!==active.drawSha256||persisted?.mode!=='LIVE_EVIL2')throw Error('Active vault cold-read failed');
  const verified=await window.otgEvilRoute8303.inspect();if(!verified.active||verified.sha256!==d.drawSha256||verified.rows.length!==2225)throw Error('Active stage order verification failed');
  return {active:true,first:verified.first.name,stageCount:verified.rows.length,sha:verified.sha256,removed,removedRuns,removedRaceOffs,backup:true};
 }catch(e){if(changed && oldRaw){try{const s=stateLive(),sp=space(s),orig=space(JSON.parse(oldRaw));Object.keys(sp).forEach(k=>delete sp[k]);Object.assign(sp,orig);localStorage.setItem(SAVE,oldRaw);}catch(restore){throw Error('LAUNCH STOPPED — backup is in IndexedDB; automatic rollback failed: '+restore.message+'; original error: '+e.message);}}if(db){try{const b=await read(db,BACKUP);if(b?.status==='prepared')await put(db,[{...b,status:'aborted',error:String(e.message||e)}]);}catch(_){}}throw e;
 }finally{db?.close();busy=false;}}
 window.otgEvilLaunch8303=Object.freeze({activate,status});
})();