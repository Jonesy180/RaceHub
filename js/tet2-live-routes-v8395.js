/* OTG/TET2 8.0.395 — verified, isolated FH5 route freeze ledger.
 * No amendments to OTG Garage, honours, schedule or results. No automatic launch.
 * Missing/mismatched catalogue, missing race family, orphan or duplicate identities: fail closed.
 */
(function(root,factory){'use strict';const api=factory(root);root.TET2LiveRoutes395=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof window!=='undefined'?window:globalThis,function(root){'use strict';
const STORE='tet2-route-lock-v8395',esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const str=x=>String(x??'').trim();const identity=r=>JSON.stringify([r.position,r.eventId,r.visit??null]);
function fingerprint(x){let h=2166136261;for(let i=0;i<x.length;i++){h^=x.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(16).padStart(8,'0');}
function prepare(rows,registry,api,opts={}){
 const problems=[],push=x=>{if(!problems.includes(x))problems.push(x);};
 if(!Array.isArray(rows)||rows.length===0||!api||typeof api.kind!=='function'||typeof api.eventFamily!=='function')throw Error('Verified schedule and race-family verifier required');
 const selected=registry?.selected;const tracks=selected?.rows;
 if(!selected?.source||!Array.isArray(tracks)||tracks.length<3)push('No verified FH5 route catalogue');
 const byId=new Map(),byFamily=new Map();
 for(const t of tracks||[]){const id=str(t.id),name=str(t.name),family=api.kind(t.kind);
   if(!id||!name||byId.has(id)){push('Duplicate or incomplete FH5 route ID');continue;}
   byId.set(id,{id,name,family});if(family){if(!byFamily.has(family))byFamily.set(family,[]);byFamily.get(family).push({id,name,family});}
 }
 const seen=new Set(),used=new Map(),recent=new Map(),assignments=[],blocked=[];
 const cooldown=Number.isInteger(opts.cooldown)?Math.max(0,Math.min(50,opts.cooldown)):5;
 for(const r of rows){const position=r.position,eventId=str(r.eventId),id=identity(r),family=api.eventFamily(r),existing=Array.isArray(r.routeIds)&&r.routeIds.length?r.routeIds.map(str):r.routeId||r.courseId?[str(r.routeId??r.courseId)]:[];
  let reason='';if(!Number.isSafeInteger(position)||position<1||!eventId||seen.has(id))reason='Invalid or duplicate schedule identity';seen.add(id);
  if(!reason&&!family)reason='Race category missing or ambiguous';
  if(!reason&&!selected?.source)reason='No verified FH5 catalogue';
  if(!reason&&existing.length>1)reason='Multiple existing route IDs require manual race-level mapping';
  let chosen=null,already=false;
  if(!reason&&existing.length){chosen=byId.get(existing[0]);already=true;if(!chosen)reason='Existing route ID is unknown';else if(chosen.family!==family)reason='Existing route ID has incorrect racing category';}
  if(!reason&&!chosen){const options=byFamily.get(family)||[];if(!options.length)reason='No verified routes for '+family;
   else{const candidates=options.map(t=>({...t,count:used.get(t.id)||0,age:position-(recent.get(t.id)??-999999),tie:api.hash?api.hash(id+'|'+t.id):fingerprint(id+'|'+t.id)}));
    candidates.sort((a,b)=>Number(a.age<=cooldown)-Number(b.age<=cooldown)||a.count-b.count||b.age-a.age||(a.tie>b.tie?1:a.tie<b.tie?-1:0)||a.id.localeCompare(b.id));chosen=candidates[0];}}
  if(reason){blocked.push({position,eventId,reason});continue;}
  const repeat=position-(recent.get(chosen.id)??-999999)<=cooldown;
  used.set(chosen.id,(used.get(chosen.id)||0)+1);recent.set(chosen.id,position);
  assignments.push({position,eventId,visit:r.visit??null,routeId:chosen.id,routeName:chosen.name,family,existing:already,recentRepeat:repeat});
 }
 const src=str(selected?.source),sourceKey=JSON.stringify({source:src,catalogue:[...byId.values()].sort((a,b)=>a.id.localeCompare(b.id)),schedule:rows.map(r=>({identity:identity(r),family:api.eventFamily(r),routeIds:r.routeIds??null,routeId:r.routeId??r.courseId??null}))});
 const evidenceKey=fingerprint(sourceKey),ready=problems.length===0&&blocked.length===0&&assignments.length===rows.length;
 return {ready,problems,blocked,assignments,visits:rows.length,catalogueSize:byId.size,source:src||null,evidenceKey,repeats:assignments.filter(x=>x.recentRepeat).length,existing:assignments.filter(x=>x.existing).length,proposed:assignments.filter(x=>!x.existing).length,cooldown};
}
function inputs(){const schedule=root.TET2AssembledList379?.snapshot?.();if(!schedule?.audit?.ok)throw Error('Candidate Evil List has not passed schedule audit');const catalogue=root.TET2TrackValidation389?.resolveCatalogue?.();return {schedule,catalogue};}
function snapshot(){const {schedule,catalogue}=inputs();return prepare(schedule.rows,catalogue,root.TET2TrackAssignment390);}
function storage(){if(!root.localStorage)throw Error('Browser storage is unavailable');return root.localStorage;}
function read(){let raw;try{raw=storage().getItem(STORE);}catch(_){return null;}if(!raw)return null;try{return JSON.parse(raw);}catch(_){return {invalid:true};}}
function status(){const s=snapshot(),saved=read();const valid=!!saved&&!saved.invalid&&saved.schema===1&&saved.evidenceKey===s.evidenceKey&&saved.visits===s.visits&&Array.isArray(saved.assignments)&&saved.assignments.length===s.visits&&saved.digest===fingerprint(JSON.stringify(saved.assignments))&&JSON.stringify(saved.assignments)===JSON.stringify(s.assignments);
 return {...s,committed:valid,stale:!!saved&&!valid};}
function commit(){const s=status();if(s.committed)return s;if(s.stale)throw Error('A previous route lock exists and differs; it has NOT been overwritten. Export your backup and investigate.');if(!s.ready)throw Error('Track allocation blocked: '+[...s.problems,...s.blocked.slice(0,2).map(x=>'#'+x.position+' '+x.reason)].join('; '));
 const record={schema:1,version:'8.0.395',source:s.source,evidenceKey:s.evidenceKey,visits:s.visits,assignments:s.assignments,digest:fingerprint(JSON.stringify(s.assignments)),lockedAt:new Date().toISOString()};
 storage().setItem(STORE,JSON.stringify(record));const verify=status();if(!verify.committed)throw Error('Route lock could not be verified after saving');return verify;}
function exportData(){const record=read();if(!record||record.invalid)throw Error('No valid route lock to export');return JSON.stringify({format:'TET2_FH5_ROUTE_LOCK',...record},null,2);}
function download(){const txt=exportData();if(!root.Blob||!root.URL?.createObjectURL||!root.document)throw Error('Browser download unavailable');const url=root.URL.createObjectURL(new Blob([txt],{type:'application/json'}));const a=root.document.createElement('a');a.href=url;a.download='TET2_FH5_TRACK_LOCK_v8395.json';a.click();setTimeout(()=>root.URL.revokeObjectURL(url),1000);}
function html(){try{const d=status(),sample=d.assignments.slice(0,20),lock=d.committed?'✅ VERIFIED ROUTE LOCK SAVED':d.stale?'⛔ STORED LOCK DOES NOT MATCH CURRENT EVIDENCE':d.ready?'✅ READY TO LOCK ROUTES':'⛔ TRACK IDENTITIES NOT READY';return `<div class="t2-a388"><p class="t2-a388-status ${d.committed||d.ready&&!d.stale?'pass':'fail'}">${lock}</p><div class="t2-a388-metrics"><div><strong>${d.visits}</strong><small>Schedule visits</small></div><div><strong>${d.existing}</strong><small>Existing IDs</small></div><div><strong>${d.proposed}</strong><small>Matched proposals</small></div><div><strong>${d.blocked.length}</strong><small>Blocked</small></div></div><p>FH5 source: ${esc(d.source||'NOT VERIFIED')} · ${d.catalogueSize} routes · ${d.repeats} recent repetitions · evidence ${esc(d.evidenceKey)}.</p><p>${d.committed?'Tracks frozen in a separate TET2 route ledger. The official tournament launch and results workflow remain separately locked.':d.stale?'Existing saved route ledger is protected. No automatic overwrite.':d.ready?'All route IDs and race categories verified. Choose LOCK VERIFIED ROUTES to save the complete selection.':'Missing route evidence must be resolved before any route lock.'}</p>${!d.committed&&!d.stale&&d.ready?'<button type="button" class="t2-btn" data-t2-route395="lock">🔐 LOCK VERIFIED FH5 ROUTES</button>':''}${d.committed?'<button type="button" class="t2-btn t2-secondary" data-t2-route395="export">⬇ EXPORT ROUTE LOCK BACKUP</button>':''}<details><summary>First 20 selected routes</summary><ol>${sample.map(x=>`<li>#${esc(x.position)} ${esc(x.eventId)}: ${esc(x.routeName)} (${esc(x.family)}) ${x.existing?'· existing':''}${x.recentRepeat?' · repeat':''}</li>`).join('')}</ol></details>${d.blocked.length?`<details><summary>Unresolved track decisions (${d.blocked.length})</summary><ol>${d.blocked.slice(0,30).map(x=>`<li>#${esc(x.position)} ${esc(x.eventId)} · ${esc(x.reason)}</li>`).join('')}</ol></details>`:''}${d.problems.length?`<p role="alert">${d.problems.map(esc).join(' · ')}</p>`:''}<p class="t2-a388-foot">EXPLICIT TET2 ROUTE LOCK ONLY · NO OTG SAVE WRITES · NO AUTOMATIC SLOT 001 LAUNCH</p></div>`;}catch(e){return `<div class="t2-a388" role="alert">⛔ Route ledger unavailable: ${esc(e.message)}. Nothing saved.</div>`;}}
function action(e,render){const b=e.target.closest('[data-t2-route395]');if(!b)return false;try{if(b.dataset.t2Route395==='lock'){if(root.confirm&&!root.confirm('Lock all verified FH5 route IDs to this TET2 schedule? Existing assignments cannot be silently replaced.'))return true;commit();}else if(b.dataset.t2Route395==='export')download();}catch(err){if(root.alert)root.alert('TET2 TRACK CONTROL: '+err.message);else if(root.console)root.console.warn(err);}render();return true;}
return Object.freeze({prepare,snapshot,read,status,commit,exportData,html,action,identity,fingerprint});
});