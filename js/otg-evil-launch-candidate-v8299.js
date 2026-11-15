/* OTG! v8.0.299 — SHARED RESULT AUDIT + CONSTRAINT-SAFE SHUFFLE REHEARSAL, not a live reset.
 * Builds one durable, verified IndexedDB launch candidate using the current FH5
 * ownership. Original localStorage and current in-memory state are NEVER changed.
 * A real launch is blocked until shared old-Evil results/honours are classified.
 */
(()=>{'use strict';
const STORE='RaceHub_Studio_Final_v5_6';
const DB='OTG_Evil2_LaunchCandidate_v1',OS='candidates',ID='evil2-stage1-v8292';
const RETIRE=['evilCampaign8076','evilCampaignR18098','fh5TrackBags8070'];
const ESC=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const SHA=async raw=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw))),x=>x.toString(16).padStart(2,'0')).join('');
function dbOpen(){return new Promise((yes,no)=>{const q=indexedDB.open(DB,1);q.onupgradeneeded=()=>{if(!q.result.objectStoreNames.contains(OS))q.result.createObjectStore(OS,{keyPath:'id'});};q.onsuccess=()=>yes(q.result);q.onerror=()=>no(q.error||Error('IndexedDB unavailable'));q.onblocked=()=>no(Error('IndexedDB upgrade blocked'));});}
function put(db,entry){return new Promise((yes,no)=>{const t=db.transaction(OS,'readwrite');t.objectStore(OS).put(entry);t.oncomplete=()=>yes();t.onerror=()=>no(t.error||Error('Candidate write failed'));t.onabort=()=>no(t.error||Error('Candidate transaction aborted'));});}
function get(db){return new Promise((yes,no)=>{const q=db.transaction(OS,'readonly').objectStore(OS).get(ID);q.onsuccess=()=>yes(q.result||null);q.onerror=()=>no(q.error||Error('Candidate read failed'));});}
function record(){const raw=localStorage.getItem(STORE);if(!raw)throw Error('Source save missing');const doc=JSON.parse(raw);if(!Array.isArray(doc.spaces)||doc.spaces.length!==4)throw Error('Expected four saved Spaces');const ids=doc.spaces.map(s=>s.id);if(ids.some(id=>!id)||new Set(ids).size!==ids.length)throw Error('Space identities invalid');const matches=doc.spaces.filter(s=>s.catalogueKey==='fh5-catalogue-v1');if(matches.length!==1)throw Error('Select the one verified FH5 catalogue Space');return {raw,doc,fh5:matches[0],ids};}
/* Do not infer source ownership from a label. Only explicit machine-readable Evil
 * provenance counts as a positive match; all uncertain entries remain protected. */
function auditShared(sp){
 const keys=['runs','customEvents','raceOffs','championships','results','honours','medals','history'];
 const only=[]; for(const key of keys){const data=sp[key];if(!Array.isArray(data)||!data.length)continue;
  let explicit=0,possible=0,unmarked=0,unknown=0;const evidence=[];
  for(const item of data){
   if(!item||typeof item!=='object'){unknown++;continue;}
   const props=['origin','source','sourceType','sourceKind','competitionSource','tournament','tournamentId','campaign','campaignId','evilCampaignId','evilSlotId','evilSlot','evil2StageId','createdBy'];
   const signals=props.filter(k=>Object.prototype.hasOwnProperty.call(item,k)).map(k=>[k,String(item[k]).slice(0,100)]);
   const explicitOld=signals.some(([k,v])=>/^(evilCampaignId|evilSlotId|evilSlot)$/.test(k)&&v&&v!=='undefined'&&v!=='null')||signals.some(([k,v])=>/^(origin|source|sourceType|sourceKind|competitionSource|tournament|tournamentId|campaign|campaignId|createdBy)$/.test(k)&&/^(evil[ _-]?(?:1|r1|campaign|tournament)|the evil tournament)(?:$|[ _:-])/i.test(v));
   if(explicitOld){explicit++;for(const x of signals)if(evidence.length<3&&!evidence.some(e=>e===x[0]))evidence.push(x[0]);}
   else if(signals.some(([k,v])=>/evil|tournament/i.test(v))){possible++;}
   else if(signals.length)unmarked++;
   else unknown++;
  }
  only.push({name:key,count:data.length,explicitOld:explicit,possible,unmarked,unknown,evidence});
 }
 return only;
}
function seedRandom(){const bytes=new Uint32Array(1);crypto.getRandomValues(bytes);return bytes[0]||0xa274b917;}
function rng(seed){let s=seed>>>0;return()=>{s=(s+0x6d2b79f5)|0;let z=s;z=Math.imul(z^(z>>>15),z|1);z^=z+Math.imul(z^(z>>>7),z|61);return((z^(z>>>14))>>>0)/4294967296;};}
/* Safe schedule rehearsal: respect every original source visit in order, preserve
 * within-family NEW event dependencies and leave finale after Hubbs encore.
 * This is a shuffle PROPOSAL only, not an activated stage assignment. */
function drawRehearsal(rows,seed){
 const finals=rows.filter(r=>r.action==='GRAND_SECOND_CHANCE');
 if(finals.length)throw Error('Grand Second Chance is a finale gate, not a stage; unexpected race slot found');
 const originals=rows.filter(r=>r.kind==='EXISTING');
 if(originals.length!==1219||originals.some((r,i)=>r.originalSlot!==i+1))throw Error('Original source sequence invariant failed');
 const encore=originals.slice(-7);
 if(!encore.every(r=>/hubbs/i.test(String(r.name||''))))throw Error('Hubbs encore identity is unverified; shuffle held');
 const a=originals.slice(0,-7),b=rows.filter(r=>r.kind!=='EXISTING');
 if(a.length+b.length+encore.length!==2225)throw Error('Stage family counts do not reconcile');
 const random=rng(seed),output=[];let i=0,j=0;
 // Seeded weighted riffle: retains both independent streams' order and all
 // within-format prerequisites, while changing the campaign interleaving.
 while(i<a.length||j<b.length){if(!i&&a.length===0){output.push(b[j++]);continue;}
  if(i===a.length){output.push(b[j++]);continue;}
  if(j===b.length){output.push(a[i++]);continue;}
  const remainA=a.length-i,remainB=b.length-j;
  output.push(random()<(remainA/(remainA+remainB))?a[i++]:b[j++]);
 }
 output.push(...encore);
 const ids=output.map(r=>r.id);
 if(ids.length!==2225||new Set(ids).size!==2225||new Set(rows.map(r=>r.id)).size!==2225||ids.some(id=>!rows.some(r=>r.id===id)))throw Error('Draw lost or duplicated a stage');
 if(encore.some((r,k)=>output[output.length-7+k].id!==r.id))throw Error('Finale order invariant failed');
 const checkOriginal=output.filter(r=>r.kind==='EXISTING');if(checkOriginal.some((r,k)=>r.id!==originals[k].id))throw Error('Original competition backbone was reordered');
 const extras=output.filter(r=>r.kind!=='EXISTING');if(extras.some((r,k)=>r.id!==b[k].id))throw Error('Prerequisite ordering was changed');
 return {seed,ids,firstStages:output.slice(0,5).map(r=>r.name),encoreStart:2219,finale:'GRAND SECOND CHANCE — separate locked phase gate',method:'SEEDED_CONSTRAINT_PRESERVING_RIFFLE'};
}
/* Re-read the live coordinator after the UI has mounted. The schedule can be
 * temporarily unavailable during catalogue/Space hydration, particularly on
 * slower mobile devices. Never accept a partial or held programme. */
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function inspectProgramme(s){
 const rows=s?.p?.rows;
 if(!Array.isArray(rows))return 'Coordinator has not supplied stage rows';
 if(rows.length!==2225)return 'Stage count '+rows.length+' (expected 2225)';
 const invalid=rows.findIndex((r,i)=>!r||r.position!==i+1);
 if(invalid!==-1)return 'Stage position mismatch at row '+(invalid+1)+' (actual '+String(rows[invalid]?.position)+')';
 const ids=rows.map(r=>r.id),unique=new Set(ids);
 if(ids.some(id=>!id))return 'One or more stage identities are missing';
 if(unique.size!==2225)return 'Stage identity count '+unique.size+' (expected 2225 unique)';
 const originals=rows.filter(r=>r.kind==='EXISTING');
 if(originals.length!==1219)return 'Original stage count '+originals.length+' (expected 1219)';
 const unexpected=originals.findIndex((r,i)=>r.originalSlot!==i+1);
 if(unexpected!==-1)return 'Original order mismatch at source slot '+(unexpected+1);
 const holds=rows.filter(r=>r.action==='HOLD');
 const blocked=Number(s.blocked);
 if(!Number.isFinite(blocked))return 'Coordinator blocked-count is missing';
 if(blocked!==holds.length)return 'Format-hold discrepancy: coordinator '+blocked+', HOLD rows '+holds.length;
 if(blocked!==0)return blocked+' unresolved format holds; first: '+String(holds[0]?.name||holds[0]?.id||'unknown').slice(0,90);
 return '';
}
async function verifiedProgramme(){
 let last='Coordinator unavailable';
 for(let attempt=0;attempt<3;attempt++){
  const api=window.rhEvil2Mixed8262;
  if(!api||typeof api.snapshot!=='function')last='Mixed tournament coordinator script not ready';
  else{
   try{const value=api.snapshot();const problem=inspectProgramme(value);
    if(!problem)return value;
    last=problem;
    // A fully formed but invalid schedule is a REAL safety failure, not a
    // momentary load issue. Do not retry it and do not skip the validation.
    if(Array.isArray(value?.p?.rows)&&value.p.rows.length===2225)return Promise.reject(Error('Schedule safety check: '+problem));
   }catch(err){last=String(err?.message||err);if(last.startsWith('Schedule safety check:'))throw err;}
  }
  if(attempt<2)await pause(250);
 }
 throw Error('Schedule not ready after 3 checks: '+last);
}
async function prepare(host){
 const output=(heading,body)=>{if(host)host.innerHTML='<div role="status" style="border:1px solid #318ea4;border-radius:12px;padding:12px;margin-top:12px"><b>'+ESC(heading)+'</b><p>'+ESC(body)+'</p></div>';};
 output('PREPARING SAFE CANDIDATE…','Checking protected save and verifying all 2,225 stage identities, source order and format holds. No live data will change.');
 try{
  if(localStorage.getItem('otg.idb.primary.pilot8279')==='yes')throw Error('Exit isolated IndexedDB pilot first');
  if(!window.crypto?.subtle||!window.indexedDB)throw Error('Encrypted digest or IndexedDB unavailable');
  const original=record();const srcHash=await SHA(original.raw);
  const plan=await verifiedProgramme();
  // This is deliberately a launch CANDIDATE, not a mutation of OTG! state.
  const candidate=JSON.parse(original.raw),space=candidate.spaces.find(s=>s.id===original.fh5.id);
  if(!space)throw Error('FH5 Space identity moved');
  const removed=[];for(const key of RETIRE){if(Object.prototype.hasOwnProperty.call(space,key)){delete space[key];removed.push(key);}}
  // Development-stage completion must NEVER leak into a clean Stage 001 campaign.
  const qaFields=['evil2Mixed260','evil2NativeRun8250'];
  for(const key of qaFields){if(Object.prototype.hasOwnProperty.call(space,key)){delete space[key];removed.push(key);}}
  // Do not change general runs/results/honours until source ownership is proven.
  const shared=auditShared(original.fh5);
  const keepBefore=JSON.parse(original.raw),keepAfter=JSON.parse(JSON.stringify(candidate));
  for(const x of [keepBefore,keepAfter]){const target=x.spaces.find(s=>s.id===original.fh5.id);for(const key of [...RETIRE,...qaFields])delete target[key];}
  if(JSON.stringify(keepBefore)!==JSON.stringify(keepAfter))throw Error('Other data differs from source — abort');
  if(candidate.spaces.some((s,i)=>s.id!==original.ids[i]||JSON.stringify(s.cars)!==JSON.stringify(original.doc.spaces[i].cars)))throw Error('Space or Garage invariant mismatch');
  const raw=JSON.stringify(candidate),candidateHash=await SHA(raw);
  // Reuse the seed for the same save and same ordered source programme. Reruns
  // must never silently produce a different proposed tournament.
  const scheduleHash=await SHA(plan.p.rows.map(r=>r.id).join('\n'));
  const db=await dbOpen();let earlier=null;try{earlier=await get(db);}finally{db.close();}
  const stable=earlier?.originSha256===srcHash && earlier?.scheduleSha256===scheduleHash;
  const seed=stable && Number.isInteger(earlier?.proposedDraw?.seed)?earlier.proposedDraw.seed:seedRandom();
  const proposedDraw=drawRehearsal(plan.p.rows,seed);
  const picker=window.otgSmartTrackPicker8299;
  if(!picker?.choose||!picker?.recentFromSpace)throw Error('Smart Track Picker module unavailable; launch rehearsal held safely');
  const firstStage=plan.p.rows.find(r=>r.id===proposedDraw.ids[0]);
  let trackFormat=picker.classify(firstStage);const recent=picker.recentFromSpace(original.fh5);
  // Resolve the real original source manifest (mode, liveFormat and event pool)
  // rather than silently guessing that every Championship has three courses.
  if(Number.isInteger(firstStage.originalSlot)&&firstStage.originalSlot>0&&firstStage.action==='ORIGINAL_SLOT'){
    const slot=window.rhEvil2OriginalGateway8259?.get?.(firstStage.originalSlot);
    const manifest=window.rhEvilSpecialistR18097;
    const ev=manifest?.events?.[slot?.eventId];
    if(!slot||!ev)throw Error('Native original source event not verified; route preview held');
    const category=/OFF-ROAD|RALLY ADVENTURE/i.test(String(ev.pool||''))?'OFFROAD':'ROAD';
    const kind=String(slot.liveFormat||'');
    if(kind==='GROUPS')trackFormat={category,count:2,source:'NATIVE_ORIGINAL_GROUPS_2_ROUNDS',reason:'ORIGINAL_SOURCE_CONFIRMED'};
    else if(kind==='STANDARD'){
      const owned=new Set((original.fh5.cars||[]).map(c=>String(c.id)));
      const eligible=(ev.eligibleIds||[]).filter(id=>owned.has(String(id))).length;
      const count=Number(slot.workload)/eligible;
      trackFormat=Number.isInteger(count)&&count>=1&&count<=4?{category,count,source:'NATIVE_ORIGINAL_STANDARD_WORKLOAD',reason:'ORIGINAL_SOURCE_CONFIRMED'}:{category:null,reason:'SOURCE_WORKLOAD_COUNT_UNVERIFIED',source:'NATIVE_HOLD'};
    }else if(kind==='KNOCKOUT')trackFormat={category:null,reason:'NATIVE_BRACKET_TRACKS_DRAWN_PER_ROUND',source:'NATIVE_ORIGINAL_KNOCKOUT'};
    else trackFormat={category:null,reason:'NATIVE_SPECIALIST_ENGINE_ROUTE_RULES',source:'NATIVE_SPECIALIST'};
  }
  const routeProposal=trackFormat.category?picker.choose({category:trackFormat.category,count:trackFormat.count,seed:seed^0x295,recent}):{ok:false,reason:trackFormat.reason,tracks:[]};
  const unchangedSharedDigest=await SHA(JSON.stringify({runs:original.fh5.runs||[],raceOffs:original.fh5.raceOffs||[]}));
  const candidateSharedDigest=await SHA(JSON.stringify({runs:space.runs||[],raceOffs:space.raceOffs||[]}));
  if(unchangedSharedDigest!==candidateSharedDigest)throw Error('Protected shared results differ; stage blocked');
  const auditCounts={explicitOld:shared.reduce((n,x)=>n+x.explicitOld,0),possible:shared.reduce((n,x)=>n+x.possible,0),unmarked:shared.reduce((n,x)=>n+x.unmarked,0),unknown:shared.reduce((n,x)=>n+x.unknown,0)};
  const manifest={id:ID,originSha256:srcHash,candidateSha256:candidateHash,raw,fh5SpaceId:space.id,stageIds:plan.p.rows.map(r=>r.id),stageCount:2225,firstStage:plan.p.rows[0].name,removed,sharedUnclassified:shared,sharedAuditCounts:auditCounts,scheduleSha256:scheduleHash,proposedDraw,routeProposal,routeFormat:trackFormat,sharedResultsSha256:unchangedSharedDigest,phase:'PRELAUNCH CANDIDATE — NOT ACTIVE',createdAt:new Date().toISOString()};
  if(localStorage.getItem(STORE)!==original.raw)throw Error('Source save changed during staging; retry when idle');
  const writeDb=await dbOpen();try{await put(writeDb,manifest);const verify=await get(writeDb);
    if(!verify||verify.raw!==raw||verify.originSha256!==srcHash||verify.stageCount!==2225||verify.proposedDraw?.ids?.length!==2225||verify.proposedDraw?.seed!==seed||verify.sharedResultsSha256!==unchangedSharedDigest||JSON.stringify(verify.routeProposal)!==JSON.stringify(routeProposal)||await SHA(verify.raw)!==candidateHash)throw Error('Saved candidate read-back verification failed');
  }finally{writeDb.close();}
  if(localStorage.getItem(STORE)!==original.raw||await SHA(localStorage.getItem(STORE))!==srcHash)throw Error('Original save changed; candidate MUST NOT be used');
  if(!window.otgEvilVault8299?.stage)throw Error('Campaign vault missing — safe stop');
  const vault=await window.otgEvilVault8299.stage(manifest);
  if(localStorage.getItem(STORE)!==original.raw)throw Error('Original save changed during vault staging');
  output('✓ CLEAN CANDIDATE + SHUFFLED DRAW PROPOSAL STAGED',
    '2,225 unique stages; proposed draw seed '+seed+'; proposed first 5: '+proposedDraw.firstStages.join(' / ')+'. Original 1,219 visits retain relative order; final Hubbs seven stay anchored; the Grand Second Chance remains a separate locked finale gate. Shared collections: '+shared.map(x=>x.name+' '+x.count+' records (explicit Evil '+x.explicitOld+', possible '+x.possible+', other/unknown '+(x.unmarked+x.unknown)+')').join('; ')+'. Protected shared results SHA-256 matched. Smart track dry-run for Stage 001: '+(routeProposal.ok?routeProposal.category+' · '+routeProposal.tracks.join(' / ')+(trackFormat.reason?' (native engine validation required)':''):'held: '+routeProposal.reason)+'. Format source: '+trackFormat.source+'. Independent Evil 2.0 draft vault '+(vault.reused?'REUSED':'COLD-READ VERIFIED')+'; draw fingerprint '+vault.drawSha256.slice(0,16)+'; Stage 001 '+vault.stageOneName+'. No live activation. Original engine route creation now uses Smart Track for Groups/Standard source races; the listed tracks remain a PREVIEW and are NOT frozen until a native event begins. Brackets and specialists retain their dedicated rules. Original save and all four Spaces untouched. No production save switch, schedule freeze or live launch.');
 }catch(err){output('SAFE STOP — NO LIVE CHANGE',err?.message||err);}
}
window.otgEvilLaunchCandidate8299={prepare};
})();
