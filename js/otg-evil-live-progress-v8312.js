/* OTG! MAIN v8.0.312 — bank LIVE sealed-draw stage completion (separate from retired QA).
 * Existing race result engines remain authoritative. This stores ONLY the signed
 * stage-order progression in the existing Evil2 IndexedDB vault, never in Evil1.
 * No launch/reset/reshuffle, no simulated results, no auto-completion.
 */
(()=>{'use strict';
const DB='OTG_Evil2_CampaignVault_v1',STORE='drafts',ACTIVE='active-campaign',KEY='active-stage-progress-v8312';
const CAM='evil2-native-slot-launch-20261114';
const fail=m=>{throw Error(m)};
let busy=false;
function space(){const sp=window.rhSpace?.();if(!sp||sp.catalogueKey!=='fh5-catalogue-v1'||!sp.id)fail('Select the original FH5 Space; progression not changed.');return sp;}
function checkPlan(p){if(!p?.active||!p.sha256||!Array.isArray(p.rows)||p.rows.length!==2225||p.rows.some((r,i)=>r.position!==i+1))fail('Verified LIVE 2,225-stage official draw required.');}
function dbOpen(){return new Promise((yes,no)=>{const q=indexedDB.open(DB,1);q.onsuccess=()=>yes(q.result);q.onerror=()=>no(q.error||Error('Evil 2.0 vault unavailable'));q.onblocked=()=>no(Error('Evil 2.0 vault blocked'));});}
function get(store,id){return new Promise((yes,no)=>{const q=store.get(id);q.onsuccess=()=>yes(q.result||null);q.onerror=()=>no(q.error||Error('Progress read failed'));});}
function transactionDone(tx){return new Promise((yes,no)=>{tx.oncomplete=yes;tx.onabort=()=>no(tx.error||Error('Progress transaction aborted'));tx.onerror=()=>no(tx.error||Error('Progress transaction failed'));});}
function validate(rec,plan,sp){
 checkPlan(plan);
 if(!rec)return{id:KEY,schema:1,campaign:CAM,spaceId:String(sp.id),drawSha256:plan.sha256,done:[]};
 if(rec.id!==KEY||rec.schema!==1||rec.campaign!==CAM||String(rec.spaceId)!==String(sp.id)||rec.drawSha256!==plan.sha256||!Array.isArray(rec.done)||rec.done.length>plan.rows.length)fail('Protected progression is linked to a different campaign or Space. No advance.');
 for(let i=0;i<rec.done.length;i++){const d=rec.done[i];if(d?.position!==i+1||d.stageId!==plan.rows[i].id||!d.bankedAt||!d.kind)fail('Stored completed stages do not match the locked draw. No advance.');}
 return rec;
}
function verifyActive(active,plan,sp){if(active?.id!==ACTIVE||active.active!==true||active.mode!=='LIVE_EVIL2'||active.drawSha256!==plan.sha256||String(active.spaceId)!==String(sp.id))fail('Sealed active campaign identity changed. No advance.');}
async function read(plan){checkPlan(plan);const sp=space(),db=await dbOpen();try{
 const tx=db.transaction(STORE,'readonly'),store=tx.objectStore(STORE),[active,record]=await Promise.all([get(store,ACTIVE),get(store,KEY)]);
 verifyActive(active,plan,sp);return validate(record,plan,sp);
 }finally{db.close();}}
function view(plan,record){const rec=validate(record,plan,space());return {done:rec.done, completed:rec.done.length, next:plan.rows[rec.done.length]||null, allDone:rec.done.length===plan.rows.length, drawSha256:rec.drawSha256};}
async function inspect(plan){const rec=await read(plan);return view(plan,rec);}
function verdict(row){const s=window.rhEvil2Mixed8262?.snapshot?.();if(!s?.sp||!s?.p)fail('Live racing coordinator unavailable.');if(typeof window.rhEvil2Mixed8262.verdict!=='function')fail('Native verified completion API missing.');const v=window.rhEvil2Mixed8262.verdict(s.p,s.sp,s.b,row);if(!v||!v.kind)fail('Native results could not be verified.');return v;}
async function bank(plan,position){
 if(busy)fail('Already recording a stage completion.');busy=true;
 try{
  checkPlan(plan);const current=await inspect(plan),row=current.next;
  if(!row||row.position!==position)fail('Only the next uncompleted stage can be marked DONE.');
  const sp=space(),v=verdict(row);
  if(!v.ready||v.kind==='hold')fail('Stage results are not yet verified: '+String(v.text||'Incomplete source racing'));
  if(v.kind==='restored'){
   if(typeof window.rhEvil2Restored8262?.finish!=='function')fail('Source-exact native finish API unavailable.');
   // Native finish validates genuine result counts, IDs and QA status, then
   // persists the race-engine DONE marker. If the subsequent progress write
   // fails, retry is safe: finish() is idempotent for this exact stage.
   window.rhEvil2Restored8262.finish(row);
  }
  // Only after source-native verification, write one append-only progress
  // record in the sealed vault. Never mutate the draw, Garage or saved times.
  const db=await dbOpen();try{
   const tx=db.transaction(STORE,'readwrite'),store=tx.objectStore(STORE),[active,prior]=await Promise.all([get(store,ACTIVE),get(store,KEY)]);
   verifyActive(active,plan,sp);
   const rec=validate(prior,plan,sp);
   if(rec.done.length!==position-1)fail('Another progression update occurred. No duplicate stage completion.');
   rec.done.push({position,stageId:row.id,kind:v.kind,bankedAt:new Date().toISOString()});
   store.put(rec);await transactionDone(tx);
  }finally{db.close();}
  const cold=await inspect(plan);
  if(cold.completed!==position||cold.done[position-1]?.stageId!==row.id)fail('Progress cold-read verification failed; stop rather than advancing.');
  return cold;
 }finally{busy=false;}
}
window.otgEvilLiveProgress8312=Object.freeze({inspect,bank,view,verdict,version:'8.0.312'});
})();