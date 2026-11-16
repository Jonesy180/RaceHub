/* OTG! MAIN 8.0.313 — User-invoked, full-backup-protected FH5 racing-results clean slate.
 * Retains verified completed LIVE Stage 001 and a results-empty Stage 002 setup,
 * the official draw + progress in IndexedDB, every Garage/Space, settings and private archives.
 * NEVER runs during installation or automatically. Hard abort on ambiguity.
 */
(()=>{'use strict';
const SAVE='RaceHub_Studio_Final_v5_6',DB='OTG_Evil2_CampaignVault_v1',STORE='drafts',BACKUP='pre-slot001-result-clean-v8313',RECEIPT='slot001-result-clean-receipt-v8313',CAM='evil2-native-slot-launch-20261114';
const ID='otg-slot1-clean-v8313';let report=null,busy=false,backupReady=false;
const C=v=>JSON.parse(JSON.stringify(v)), S=v=>String(v??''), E=v=>S(v).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const fail=m=>{throw Error(m)};
const bytes=v=>new TextEncoder().encode(v).length;
const hash=async v=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v)))].map(x=>x.toString(16).padStart(2,'0')).join('');
function live(){const v=(typeof state!=='undefined'&&state?.spaces)?state:window.state;if(!v?.spaces||!Array.isArray(v.spaces))fail('Live OTG! Spaces unavailable');return v;}
function fh5(st){const x=st.spaces.filter(s=>s.catalogueKey==='fh5-catalogue-v1');if(x.length!==1)fail('Expected exactly one FH5 catalogue Space');return x[0];}
function primary(){const raw=localStorage.getItem(SAVE);if(!raw)fail('Live OTG! save missing');let st;try{st=JSON.parse(raw)}catch(_){fail('Live OTG! save cannot be parsed')};if(!st?.spaces?.length)fail('Live OTG! Spaces missing');return{raw,st};}
function openDb(){return new Promise((yes,no)=>{const q=indexedDB.open(DB,1);q.onsuccess=()=>yes(q.result);q.onerror=()=>no(q.error||Error('Protected campaign vault unavailable'));q.onblocked=()=>no(Error('Vault blocked'));});}
function get(db,id){return new Promise((yes,no)=>{const q=db.transaction(STORE,'readonly').objectStore(STORE).get(id);q.onsuccess=()=>yes(q.result||null);q.onerror=()=>no(q.error||Error('Vault read failed'));});}
function put(db,value){return new Promise((yes,no)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(value);tx.oncomplete=yes;tx.onabort=()=>no(tx.error||Error('Backup transaction aborted'));tx.onerror=()=>no(tx.error||Error('Backup transaction failed'));});}
function stageRun(sp,row){const rec=window.rhEvil2Restored8262?.record,stage=window.rhEvil2Restored8262?.stage;
 if(typeof rec!=='function'||typeof stage!=='function')fail('Source-exact Stage 001 native engine unavailable');
 const spec=stage(row,live()),out=rec(sp,spec);if(!out?.r||!out?.q)fail('No uniquely linked Stage 001 native record');
 const r=out.r,q=out.q;if(spec.id!==row.id||q.runId!==r.id||r.evilCampaignR2?.campaign!==CAM||r.evilCampaignR2?.stageId!==row.id||r.type!=='evil2-native'||r.status!=='complete'||!q.doneAt)fail('Stage 001 source identity / completion is not fully recorded');
 if(r.entries?.length!==2||r.rounds?.length!==3||r.results?.length!==6)fail('Stage 001 must have exactly six saved genuine results');
 const keys=new Set();for(const a of r.results){const k=S(a.carId)+'|'+S(a.roundId);if(keys.has(k)||!r.entries.includes(a.carId)||!r.rounds.some(d=>d.id===a.roundId)||!Number.isFinite(Number(a.time))||Number(a.time)<=0||a.qaPretend||a.pretend)fail('Stage 001 has duplicate, invalid or pretend race results');keys.add(k);}
 const v=window.rhEvil2Restored8262.verdict(row);if(!v.ready||v.saved!==6||v.total!==6)fail('Stage 001 native completion verifier did not confirm all six genuine times');return out;
}
function unusedRace(e){if((e.results||[]).length)return false;if(e.status==='complete')return false;
 const any=(e.rounds||[]).some(rd=>(rd.matches||[]).some(m=>m.resultA||m.resultB||m.winnerId||m.winnerCarId));return !any;}
// Clean custom events' saved results, leaving names, participants, chosen routes and definitions.
// All racing state / nested group outcomes are removed. Future re-entry is via native event setup.
function blankEvent(e){const x=C(e);x.results=[];x.status='setup';
 for(const k of ['completedAt','abandonedAt','championId','championCarId','winnerId','winnerCarId','finishedAt','startedAt','currentRound','currentRoundIndex','lastResultId','trophyAwardedAt','honours','medals','standings','history','raceHistory','resultHistory','v8Swiss','v8Groups','v8Knockout','v8KO'])delete x[k];
 const scrubRounds=arr=>Array.isArray(arr)?arr.map(r=>{const z=C(r);for(const k of ['results','result','winnerId','winnerCarId','championCarId','completedAt','startedAt','finishedAt','scores','standings'])delete z[k];if(Array.isArray(z.matches))z.matches=z.matches.map(m=>{const a=C(m);for(const k of ['resultA','resultB','timeA','timeB','scoreA','scoreB','winnerId','winnerCarId','loserCarId','completedAt','finishedAt'])delete a[k];if(a.status)a.status='setup';return a;});if(z.status)z.status='setup';return z;}):arr;
 x.rounds=scrubRounds(x.rounds);if(x.frozenRounds)x.frozenRounds=scrubRounds(x.frozenRounds);return x;}
function calculate(st,one,stage2){const next=C(st),old=fh5(st),sp=fh5(next);for(const k of ['results','history','recordHistory','legacyResults'])if(Array.isArray(next[k]))next[k]=[];const keepId=one.r.id,counts={runs:(old.runs||[]).length,raceOffs:(old.raceOffs||[]).length,customEvents:(old.customEvents||[]).length,customResults:(old.customEvents||[]).reduce((n,e)=>n+(e.results||[]).length,0),legacyResults:(old.legacyResults||[]).length};
 let s2id=null,s2format='';const book=old.evil2Restored8261;const stage2rec=book?.stages?.[stage2.id];if(stage2rec){s2id=stage2rec.runId||stage2rec.raceOffId;s2format=stage2rec.format;
  const arr=s2format==='KNOCKOUT'?(old.raceOffs||[]):(old.runs||[]),rs=arr.filter(x=>x.id===s2id);
  if(rs.length!==1||!unusedRace(rs[0])||rs[0].evilCampaignR2?.stageId!==stage2.id||rs[0].evilCampaignR2?.campaign!==CAM)fail('Stage 002 has recorded activity or an ambiguous identity. Stop before altering anything.');
 }
 if((old.runs||[]).filter(x=>x.id===keepId).length!==1)fail('Slot 001 native championship is not unique');
 sp.runs=(old.runs||[]).filter(x=>x.id===keepId||(s2id&&s2format!=='KNOCKOUT'&&x.id===s2id)).map(C);
 sp.raceOffs=(old.raceOffs||[]).filter(x=>s2id&&s2format==='KNOCKOUT'&&x.id===s2id).map(C);
 sp.customEvents=(old.customEvents||[]).map(blankEvent);
 for(const k of ['legacyResults','results','history','recordHistory','raceHistory','resultHistory','recordBookExclusions','recordExclusions'])if(Array.isArray(sp[k]))sp[k]=[];
 for(const k of ['evilCampaign8076','evilCampaignR18098','fh5TrackBags8070','evil2Mixed260'])delete sp[k];
 for(const k of ['stats','racingStats','trackUsage','trackRecords','hallOfFame','honoursHistory','medalHistory'])if(Object.prototype.hasOwnProperty.call(sp,k))delete sp[k];
 if(book){
  if(book.campaign!==CAM||String(book.spaceId)!==String(sp.id)||!book.stages?.[one.q&&one.r.evilCampaignR2.stageId])fail('Protected native stage registry identity not verified');
  sp.evil2Restored8261=C(book);for(const k of Object.keys(sp.evil2Restored8261.stages))if(k!==one.r.evilCampaignR2.stageId&&k!==stage2.id)delete sp.evil2Restored8261.stages[k];
 }
 // Other special engines from prelaunch were removed at launch. Never delete
 // an unclassified newly created event/family ledger during this cleanup.
 for(const k of ['evil2NativeRun8250','evil2NewFormats8256','evil2Honours8257','evil2Specialist8259','evil2Swiss8262']){
  if(Object.hasOwn(sp,k)){const v=sp[k];if(v&&typeof v==='object'&&Object.keys(v).length)fail('Additional live engine ledger '+k+' found. Cleanup stopped for manual review, protecting current stage.');delete sp[k];}
 }
 counts.runsRemoved=counts.runs-sp.runs.length;counts.raceOffsRemoved=counts.raceOffs-sp.raceOffs.length;counts.customEventsPreserved=sp.customEvents.length;
 if(sp.runs.length<1||sp.runs[0].id!==keepId||sp.runs[0].results.length!==6||JSON.stringify(sp.runs.find(x=>x.id===keepId))!==JSON.stringify(one.r))fail('Stage 001 preserved result invariant failed');
 if(JSON.stringify(sp.cars)!==JSON.stringify(old.cars)||JSON.stringify(sp.backups)!==JSON.stringify(old.backups))fail('Garage or saved backups changed');
 if(next.spaces.length!==st.spaces.length||next.spaces.some((q,i)=>q.id!==st.spaces[i].id))fail('OTG Spaces or their order changed');
 // Same result-only reset in the other OTG! Spaces. Keep each Space, its
 // Garage, name, catalogue, settings, custom event definitions and backups.
 counts.otherSpaces=[];
 for(const otherBefore of st.spaces.filter(s=>s.id!==sp.id)){
   const other=next.spaces.find(s=>s.id===otherBefore.id);
   if(!other)fail('Other OTG Space disappeared');
   const count={name:otherBefore.name||'Other Space',runs:(otherBefore.runs||[]).length,raceOffs:(otherBefore.raceOffs||[]).length,customResults:(otherBefore.customEvents||[]).reduce((n,e)=>n+(e.results||[]).length,0)};
   other.runs=[];if(Array.isArray(other.raceOffs))other.raceOffs=[];
   if(Array.isArray(other.customEvents))other.customEvents=other.customEvents.map(blankEvent);
   for(const k of ['legacyResults','results','history','recordHistory','raceHistory','resultHistory','recordBookExclusions','recordExclusions'])if(Array.isArray(other[k]))other[k]=[];
   for(const k of ['stats','racingStats','trackUsage','trackRecords','hallOfFame','honoursHistory','medalHistory'])if(Object.hasOwn(other,k))delete other[k];
   if(JSON.stringify(other.cars)!==JSON.stringify(otherBefore.cars)||JSON.stringify(other.backups)!==JSON.stringify(otherBefore.backups))fail('Another Space Garage / backups changed');
   const safeOther=new Set(['runs','raceOffs','customEvents','legacyResults','results','history','recordHistory','raceHistory','resultHistory','recordBookExclusions','recordExclusions','stats','racingStats','trackUsage','trackRecords','hallOfFame','honoursHistory','medalHistory']);
   const affected=[...new Set([...Object.keys(otherBefore),...Object.keys(other)])].filter(k=>JSON.stringify(otherBefore[k])!==JSON.stringify(other[k]));
   if(affected.some(k=>!safeOther.has(k)))fail('Other Space contains an unapproved mutation: '+affected.find(k=>!safeOther.has(k)));
   counts.otherSpaces.push(count);
 }
 const changed=Object.keys(sp).filter(k=>JSON.stringify(sp[k])!==JSON.stringify(old[k])).concat(Object.keys(old).filter(k=>!Object.hasOwn(sp,k)));
 const safe=new Set(['runs','raceOffs','customEvents','legacyResults','results','history','recordHistory','raceHistory','resultHistory','recordBookExclusions','recordExclusions','evilCampaign8076','evilCampaignR18098','fh5TrackBags8070','evil2Mixed260','stats','racingStats','trackUsage','trackRecords','hallOfFame','honoursHistory','medalHistory','evil2Restored8261','evil2NativeRun8250','evil2NewFormats8256','evil2Honours8257','evil2Specialist8259','evil2Swiss8262']);
 if(changed.some(k=>!safe.has(k)))fail('Unapproved field changed during clean-slate simulation: '+changed.find(k=>!safe.has(k)));
 return{next,sp,counts,changed:[...new Set(changed)].sort(),stage1Run:keepId,stage2Run:s2id};}
async function audit(){if(localStorage.getItem('otg.idb.primary.pilot8279')==='yes')fail('Exit isolated storage pilot');if(typeof window.rhSave!=='function')fail('Native save function is unavailable');
 const {raw,st}=primary(),now=live(),fh=fh5(st),lf=fh5(now);
 if(String(st.activeSpaceId)!==String(fh.id)||String(now.activeSpaceId)!==String(fh.id)||String(lf.id)!==String(fh.id))fail('Switch to your real FH5 Space first');
 if(JSON.stringify(now.spaces)!==JSON.stringify(st.spaces))fail('Unsaved changes in the live Spaces: stop, reopen, then inspect again');
 const plan=await window.otgEvilRoute8306?.inspect?.();if(!plan?.active||plan.rows?.length!==2225||!plan.sha256||plan.rows[0]?.position!==1)fail('Active locked draw unavailable');
 const progress=await window.otgEvilLiveProgress8312?.inspect?.(plan);
 if(progress?.completed!==1||progress.done?.length!==1||progress.done[0].stageId!==plan.rows[0].id||progress.next?.position!==2)fail('Expected exactly Stage 001 banked and Stage 002 current. No reset.');
 const db=await openDb();try{if(await get(db,RECEIPT))fail('Slot 001 cleanup already committed. Cannot run twice.');}finally{db.close();}
 const one=stageRun(lf,plan.rows[0]),candidate=calculate(st,one,plan.rows[1]);
 if(localStorage.getItem(SAVE)!==raw)fail('Save changed during the audit. Retry.');
 return{raw,rawSha:await hash(raw),drawSha:plan.sha256,spaceId:fh.id,stageId:plan.rows[0].id,stage2Id:plan.rows[1].id,...candidate};}
function download(name,content){const url=URL.createObjectURL(new Blob([content],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{a.remove();URL.revokeObjectURL(url)},5000);}
function panel(){let n=document.getElementById(ID);if(!n){n=document.createElement('section');n.id=ID;n.style.cssText='position:fixed;z-index:9400;inset:0;background:#061019;color:#effaff;overflow:auto;padding:20px 15px 90px;font-family:system-ui';n.hidden=true;document.body.appendChild(n);n.addEventListener('click',clicked);}return n;}
const btn=(act,t,enabled=true)=>'<button data-clean313="'+act+'" '+(enabled?'':'disabled')+' style="display:block;width:100%;font-size:17px;font-weight:800;padding:15px;background:'+(enabled?'#123e52':'#20323a')+';color:white;border:1px solid #4aa4b3;border-radius:12px;margin:13px 0">'+t+'</button>';
function render(message=''){const d=panel();let h='<div style="max-width:690px;margin:auto">'+btn('close','← BACK TO HEADQUARTERS')+'<h1>🛡️ EVIL 2.0 · CLEAN SLATE</h1><p><b>Keep Stage 001 Abarth Festival and its six real times.</b> Remove earlier FH5 racing results, Hall of Fame and records by clearing their source data. Keep all Space containers, every Garage, Event definitions, campaign draw, current Stage 002 and private archives. Remove old racing results from **every** Space.</p><p style="color:#f8d59a">This is a ONE-TIME destructive cleanup. Nothing runs automatically. Your original full save will be verified in protected storage and downloaded as a separate JSON backup before the reset button is enabled.</p>';
 if(report){const x=report.counts;h+='<section style="border:1px solid #3c8591;padding:12px;border-radius:14px"><h3>VERIFIED LIVE PREVIEW</h3><p>Completed: <b>Stage 001</b> · Next: <b>Stage 002</b> · Source times retained: <b>6/6</b>.</p><p>FH5 old runs to remove: <b>'+x.runsRemoved+'</b> · old Race Offs: <b>'+x.raceOffsRemoved+'</b> · custom-event results: <b>'+x.customResults+'</b> (event definitions retained).</p><p>Live state fields affected: '+E(report.changed.join(', ')||'none')+'</p><p>Every Space and Garage retained; old results inside all Spaces cleared. Private archive and update safety backups untouched.</p></section>';
 h+=btn('backup',backupReady?'✓ RE-DOWNLOAD VERIFIED BACKUP':'⬇ CREATE, VERIFY & DOWNLOAD FULL BACKUP');
 h+='<label style="display:block;padding:12px"><b>Type CLEAN STAGE 001 to authorise the reset:</b><input id="clean313-type" autocomplete="off" placeholder="CLEAN STAGE 001" style="display:block;width:100%;padding:12px;background:#132c3b;color:white;border:1px solid #5a9cae;border-radius:8px;margin-top:9px" /></label>';
 h+=btn('commit','🧹 WIPE OLD RESULTS IN ALL SPACES · KEEP STAGE 001',backupReady);
 }else h+=btn('audit','🔎 AUDIT LIVE DATA (NO CHANGES)');
 if(message)h+='<p role="status" style="white-space:pre-wrap;border:1px solid #6ca9b7;padding:12px;border-radius:10px">'+E(message)+'</p>';
 h+='</div>';d.innerHTML=h;}
function open(){report=null;backupReady=false;panel().hidden=false;render('Ready to inspect. No save changes.');}
function close(){if(busy)return;panel().hidden=true;report=null;backupReady=false;}
async function backup(){if(!report)fail('Audit required');if(localStorage.getItem(SAVE)!==report.raw)fail('Race data changed since preview. Re-audit.');
 const db=await openDb();try{
  const existing=await get(db,BACKUP);if(existing&&existing.rawSha!==report.rawSha)fail('Different protected cleanup backup already exists. STOP.');
  await put(db,{id:BACKUP,createdAt:new Date().toISOString(),rawSha:report.rawSha,drawSha:report.drawSha,stageId:report.stageId,spaceId:report.spaceId,raw:report.raw});
  const cold=await get(db,BACKUP);if(!cold||cold.rawSha!==report.rawSha||await hash(cold.raw)!==report.rawSha)fail('Backup cold-read SHA-256 mismatch. STOP.');
 }finally{db.close();}
 const filename='OTG_FULL_PRE_SLOT001_CLEAN_'+new Date().toISOString().replace(/[:.]/g,'-')+'.json';download(filename,report.raw);backupReady=true;return '✓ Full original save stored and cold-verified in protected IndexedDB (SHA-256 '+report.rawSha.slice(0,16)+'…).\n✓ Full original JSON backup download requested: '+filename+'\nSave a copy outside your phone before continuing.';
}
async function commit(){if(!backupReady||!report)fail('Verified downloadable full backup required');const input=panel().querySelector('#clean313-type');if(S(input?.value).trim()!=='CLEAN STAGE 001')fail('Type CLEAN STAGE 001 exactly to proceed');
 if(!window.confirm('FINAL CHECK: remove older racing results in ALL OTG! Spaces, keep exactly Abarth Stage 001 results, all Garage cars and each Space? A protected full original backup exists.'))return 'CANCELLED — no data changed';
 const a=await audit();if(a.rawSha!==report.rawSha||a.drawSha!==report.drawSha||a.stage1Run!==report.stage1Run||a.stageId!==report.stageId)fail('Campaign or stored racing data changed since backup. STOP.');
 const db=await openDb();try{const b=await get(db,BACKUP);if(b?.rawSha!==a.rawSha||await hash(b.raw)!==a.rawSha)fail('Full original backup is not verified. No reset.')}finally{db.close()}
 const obj=live(),original=fh5(obj),expectedState=C(obj),target=fh5(a.next);const oldRaw=a.raw;
 if(JSON.stringify(original)!==JSON.stringify(fh5(JSON.parse(oldRaw))))fail('Live data changed immediately before saving');
 let wrote=false;
 try{
  for(const k of Object.keys(original))delete original[k];Object.assign(original,C(target));
  // Change the other Space result fields exactly as in the verified preview.
  for(const mapped of a.next.spaces){if(mapped.id===original.id)continue;const dest=obj.spaces.find(s=>s.id===mapped.id);if(!dest)fail('Missing other Space');for(const k of Object.keys(dest))delete dest[k];Object.assign(dest,C(mapped));}
  for(const k of ['results','history','recordHistory','legacyResults'])if(Array.isArray(obj[k]))obj[k]=[];
  wrote=true;window.rhSave();
  const cold=primary().st,csp=fh5(cold);
  if(JSON.stringify(csp)!==JSON.stringify(target))fail('After-save FH5 diff mismatch');
  if(JSON.stringify(cold)!==JSON.stringify(a.next))fail('Stored state differs from the audited full-state clean slate');
  if(csp.runs.length<1||csp.runs[0].id!==a.stage1Run||csp.runs[0].results?.length!==6)fail('Stage 001 results missing after reset');
  const p=await window.otgEvilRoute8306.inspect(),g=await window.otgEvilLiveProgress8312.inspect(p);
  if(!p.active||p.sha256!==a.drawSha||g.completed!==1||g.next?.position!==2)fail('Locked draw or banked Stage 001 failed cold verification');
  const out=window.rhEvil2Restored8262.verdict(p.rows[0]);if(!out.ready||out.saved!==6)fail('Six saved Stage 001 native results failed post-reset verification');
  const receipt={id:RECEIPT,completedAt:new Date().toISOString(),beforeSha256:a.rawSha,afterSha256:await hash(localStorage.getItem(SAVE)),stage1RunId:a.stage1Run,drawSha256:a.drawSha,spaceId:a.spaceId,counts:a.counts};
  const d=await openDb();try{await put(d,receipt);if((await get(d,RECEIPT))?.beforeSha256!==a.rawSha)fail('Cleanup receipt cold-read failed');}finally{d.close()}
  return '✓ CLEAN SLATE COMPLETE.\n✓ Only Stage 001 has six real results. Stage 002 ready.\n✓ Draw and Stage 001 completion verified after save.\n✓ Every Garage and Space retained; old results removed from all Spaces.\n✓ Full previous save retained in protected backup.\nYou can close this panel and race.';
 }catch(err){
   if(wrote){try{for(const k of Object.keys(obj))delete obj[k];Object.assign(obj,C(expectedState));localStorage.setItem(SAVE,oldRaw);}catch(restore){throw Error('CRITICAL: cleanup verification failed and rollback could not finish. Do not race. Backup is protected in IndexedDB. '+restore.message+'; original error: '+err.message)}}
   else{for(const k of Object.keys(obj))delete obj[k];Object.assign(obj,C(expectedState));}
   throw Error('SAFE ROLLBACK — original save restored after verification failure: '+S(err.message||err));
 }
}
async function clicked(e){const b=e.target.closest('button[data-clean313]');if(!b)return;const action=b.dataset.clean313;if(action==='close'){close();return;}if(busy)return;
 busy=true;b.disabled=true;let msg='';try{
   if(action==='audit'){report=await audit();backupReady=false;msg='✓ Verified sealed draw, 1/2,225 stages complete, six genuine Abarth results, and isolated FH5 changes. NO DATA CHANGED.';}
   else if(action==='backup')msg=await backup();
   else if(action==='commit')msg=await commit();
 }catch(ex){if(action==='audit'){report=null;backupReady=false;}msg='⛔ SAFE STOP — '+S(ex.message||ex);}
 finally{busy=false;render(msg);}
}
window.otgSlot1Clean8313=Object.freeze({open,version:'8.0.313'});
})();
