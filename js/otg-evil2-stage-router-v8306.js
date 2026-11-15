/* OTG! MAIN 8.0.302 — native racing route adapter for the ACTUAL vault draw.
 * Reuses existing OTG! original, Swiss, restored and specialist engines.
 * It does not create a result system, mutate state, reset Evil, or launch preflight races.
 */
(()=>{'use strict';
const DB='OTG_Evil2_CampaignVault_v1', STORE='drafts', KEY='main-draft', ACTIVE='active-campaign';
const A={
 ORIGINAL_SLOT:['rhEvil2OriginalGateway8259','open'],
 ORIGINAL_SPECIALIST:['rhEvil2OriginalGateway8259','open'],
 ORIGINAL_SWISS:['rhEvil2Swiss8262','show'],
 RESTORED_ARCHIVE:['rhEvil2Restored8262','show'],
 RESTORED_LONELY:['rhEvil2Restored8262','show'],
 NEW_MAKE:['rhEvil2Restored8262','show'],
 NEW_GAUNTLET:['rhEvil2NewRaces8256','openScheduledGauntlet'],
 LONG_JUMP:['rhEvil2NewRaces8256','show'],
 NEW_RELAY:['rhEvil2NewRaces8256','openScheduledRelay']
};
const text=v=>String(v??'');
const digest=async str=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(str))),b=>b.toString(16).padStart(2,'0')).join('');
function openDb(){return new Promise((resolve,reject)=>{const q=indexedDB.open(DB,1);q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error||Error('Campaign vault unavailable'));q.onblocked=()=>reject(Error('Campaign vault blocked'));});}
function get(db,key=KEY){return new Promise((resolve,reject)=>{if(!db.objectStoreNames.contains(STORE))return reject(Error('Campaign draft store missing'));const q=db.transaction(STORE,'readonly').objectStore(STORE).get(key);q.onsuccess=()=>resolve(q.result||null);q.onerror=()=>reject(q.error||Error('Campaign draft read failed'));});}
async function draft(){const db=await openDb();try{return (await get(db,ACTIVE))||(await get(db,KEY))}finally{db.close()}}
async function validated(){
 const d=await draft();if(!d||!((d.id===KEY&&d.mode==='PRELAUNCH_ONLY'&&d.active===false)||(d.id===ACTIVE&&d.mode==='LIVE_EVIL2'&&d.active===true)))throw Error('No verified draft or active Evil 2.0 campaign');
 if(d.ids?.length!==2225||new Set(d.ids).size!==2225||d.ids[0]!==d.stageOneId)throw Error('Invalid draft stage identities');
 const p=JSON.stringify({sourceSha256:d.sourceSha256,candidateSha256:d.candidateSha256,scheduleSha256:d.scheduleSha256,seed:d.seed,ids:d.ids,stageOneId:d.stageOneId});
 if(await digest(p)!==d.drawSha256)throw Error('Draft draw SHA-256 mismatch');
 return d;
}
function source(){const api=window.rhEvil2Mixed8262;if(typeof api?.snapshot!=='function'||typeof api?.openStage!=='function')throw Error('Existing Evil source coordinator unavailable');const s=api.snapshot();if(s.p?.stageCount!==2225||s.p.rows?.length!==2225)throw Error('Source stage programme incomplete');return s;}
function compile(d,s){const ids=s.p.rows.map(r=>r.id);const originalSet=new Set(ids);if(originalSet.size!==2225||d.ids.some(id=>!originalSet.has(id)))throw Error('Vault stage identities no longer match the original programme');
 const byId=new Map(s.p.rows.map(r=>[r.id,r]));const ordered=d.ids.map((id,i)=>({...byId.get(id),position:i+1}));
 const counts={},blocked=[],missing=[];for(const r of ordered){counts[r.action]=(counts[r.action]||0)+1;
  if(!A[r.action]){blocked.push({id:r.id,action:r.action,name:r.name});continue;}
  const [global,fn]=A[r.action];if(typeof window[global]?.[fn]!=='function')missing.push(global+'.'+fn+' ('+r.action+')');
 }
 if(blocked.length)throw Error(blocked.length+' genuinely unbound formats, first '+text(blocked[0].name));
 if(missing.length)throw Error('Native engine API not loaded: '+[...new Set(missing)].join(', '));
 const originals=ordered.filter(r=>r.kind==='EXISTING');if(originals.length!==1219||originals.some((r,i)=>r.originalSlot!==i+1))throw Error('Original source order changed');
 if(!ordered.slice(-7).every(r=>r.kind==='EXISTING'&&/hubbs/i.test(text(r.name))))throw Error('Hubbs finale group displaced');
 return{rows:ordered,counts,first:ordered[0],sha256:d.drawSha256,active:d.active,seed:d.seed};
}
async function inspect(){const d=await validated();return compile(d,source());}
/* Called ONLY by the eventual explicit launch handover. No prelaunch UI can
 * accidentally race: prelaunch=true is rejected. The race screen itself
 * owns normal OTG result saving, honours, entrants and progress. */
async function openStage(stageNumber,confirmedActive,directNative=false){if(confirmedActive!==true)throw Error('Live tournament not activated; racing is locked');
 const plan=await inspect();if(!Number.isInteger(stageNumber)||stageNumber<1||stageNumber>2225)throw Error('Stage number invalid');
 // Only the separately signed, permanently locked active manifest permits racing.
 if(plan.active!==true)throw Error('Only an inactive prelaunch draw exists; refusing a live race');
 const row=plan.rows[stageNumber-1];
 if(directNative&&['RESTORED_ARCHIVE','RESTORED_LONELY','NEW_MAKE'].includes(row.action)){
   if(typeof window.rhEvil2Restored8262?.openDirect!=='function')throw Error('Direct source-exact racing engine unavailable');
   return window.rhEvil2Restored8262.openDirect(row);
 }
 return window.rhEvil2Mixed8262.openStage(row,{...source().p,rows:plan.rows});}
window.otgEvilRoute8306=Object.freeze({inspect,openStage,resolve:compile,actions:Object.freeze({...A})});
})();