/* TET2 v8.0.393 — inspect-only track readiness; always gate official start. */
(function(root,factory){'use strict';const api=factory(root);root.TET2TrackReadiness393=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof window!=='undefined'?window:globalThis,function(root){'use strict';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const str=x=>String(x??'').trim();const key=r=>JSON.stringify([r.position,r.eventId,r.visit??null]);
function assess(rows,registry,preview,join,recon){
 if(!Array.isArray(rows)||!rows.length)throw Error('Verified timetable missing');
 if(!preview||preview.blocked!==true||preview.officialWrites!==0||!Array.isArray(preview.assigned)||!Array.isArray(preview.unassigned))throw Error('Untrusted route proposal');
 if(!join||join.officialStartLocked!==true||join.officialWrites!==0||!Array.isArray(join.rows))throw Error('Untrusted schedule join');
 if(!recon||recon.blocked!==true||recon.officialWrites!==0||!recon.totals||!Array.isArray(recon.issues))throw Error('Untrusted reconciliation');
 const c=registry?.selected, routes=Array.isArray(c?.rows)?c.rows:[],errors=[];
 if(!c?.source||!routes.length)errors.push('Verified FH5 route catalogue missing');
 const ids=new Map();for(const r of routes){const id=str(r.id);if(!id||!str(r.name)||ids.has(id))errors.push('Invalid or duplicate catalogue ID');else ids.set(id,r);}
 const map=new Map(),schedule=new Set(),joined=new Map(),out=[];
 for(const p of preview.assigned){const k=key(p);if(map.has(k))errors.push('Duplicate route proposal');map.set(k,p);}
 for(const r of join.rows){const k=key(r);if(joined.has(k))errors.push('Duplicate joined visit');joined.set(k,r);}
 if(join.rows.length!==rows.length)errors.push('Joined timetable count differs');
 if(join.ok!==true)errors.push('Schedule join did not pass');
 if(recon.issues.length)errors.push('Catalogue reconciliation integrity issues');
 const totals={visits:rows.length,verifiedExisting:0,previewReady:0,blocked:0,missingFamily:0,missingCatalogue:0,invalidExisting:0,wrongFamily:0,missingProposal:0,invalidProposal:0,recentRepeat:0};
 const kind=root.TET2TrackAssignment390?.kind,eventFamily=root.TET2TrackAssignment390?.eventFamily;
 if(typeof kind!=='function'||typeof eventFamily!=='function')throw Error('Race family verifier unavailable');
 for(const row of rows){const k=key(row);if(schedule.has(k))errors.push('Duplicate schedule identity');schedule.add(k);
  const fam=eventFamily(row),candidate=map.get(k),j=joined.get(k);const existing=Array.isArray(row.routeIds)&&row.routeIds.length?row.routeIds.map(str):row.routeId||row.courseId?[str(row.routeId??row.courseId)]:[];
  let status='BLOCKED',reason='No verified route proposal',route='';
  if(!fam){totals.missingFamily++;reason='Missing or ambiguous explicit race category';}
  else if(!c?.source||!routes.length){totals.missingCatalogue++;reason='No independently verified FH5 catalogue';}
  else if(existing.length){const found=existing.map(id=>ids.get(id));if(found.some(r=>!r)){totals.invalidExisting++;reason='Existing route ID not found';}
   else if(found.some(r=>kind(r.kind)!==fam)){totals.wrongFamily++;reason='Existing route category conflict';}
   else {status='VALID EXISTING';reason='Existing ID and category verified; no official changes';route=existing.join(', ');totals.verifiedExisting++;}}
  else if(!candidate){totals.missingProposal++;reason='No proposed route for this visit';}
  else {const r=ids.get(str(candidate.routeId));if(!r||str(r.name)!==str(candidate.routeName)||kind(r.kind)!==fam||candidate.family!==fam){totals.invalidProposal++;reason='Proposal identity or category conflict';}
   else if(!j||j.routeId!==candidate.routeId||j.status!=='PROPOSED ONLY'){totals.invalidProposal++;reason='Proposal disagrees with joined schedule';}
   else{status='PREVIEW READY';reason='Catalogue verified, proposal only — not approved';route=str(candidate.routeId);totals.previewReady++;if(candidate.recentRepeat)totals.recentRepeat++;}}
  if(status==='BLOCKED')totals.blocked++;
  out.push({position:row.position,eventId:row.eventId,visit:row.visit??null,name:row.name??row.title??row.eventId,status,reason,route});
 }
 for(const k of map.keys())if(!schedule.has(k))errors.push('Orphan route proposal');
 for(const k of joined.keys())if(!schedule.has(k))errors.push('Orphan joined visit');
 if(totals.blocked+totals.previewReady+totals.verifiedExisting!==rows.length)errors.push('Unbalanced readiness totals');
 const counts=recon.totals;
 if(counts.visits!==rows.length||counts.proposed!==totals.previewReady||counts.validExisting!==totals.verifiedExisting)errors.push('Independent reconciliation counts disagree');
 return Object.freeze({officialStartLocked:true,officialWrites:0,readOnly:true,source:c?.source||null,integrityOK:errors.length===0,errors,totals,first:out.slice(0,15),blockedExamples:out.filter(x=>x.status==='BLOCKED').slice(0,12),completePreview:errors.length===0&&totals.blocked===0});
}
function snapshot(){const t=root.TET2AssembledList379?.snapshot?.();if(!t?.audit?.ok)throw Error('Candidate timetable integrity failed');const v=root.TET2TrackValidation389?.resolveCatalogue?.(),p=root.TET2TrackAssignment390?.snapshot?.(),j=root.TET2TrackIntegration391?.snapshot?.(),r=root.TET2RouteReconciliation392?.snapshot?.();return assess(t.rows,v,p,j,r);}
function html(){try{const d=snapshot(),t=d.totals;return `<div class="t2-a388"><p class="t2-a388-status fail">🔒 TRACK ASSIGNMENT READINESS · NO OFFICIAL RELEASE</p><div class="t2-a388-metrics"><div><strong>${t.previewReady}</strong><small>Verified previews</small></div><div><strong>${t.verifiedExisting}</strong><small>Verified existing</small></div><div><strong>${t.blocked}</strong><small>Blocked visits</small></div><div><strong>${t.missingFamily}</strong><small>Missing race category</small></div></div><p>Source: ${esc(d.source||'NOT VERIFIED')} · ${t.visits} scheduled visits. ${t.missingCatalogue} missing catalogue; ${t.invalidExisting} invalid existing IDs; ${t.wrongFamily} category mismatches; ${t.missingProposal} missing proposals; ${t.invalidProposal} invalid proposals; ${t.recentRepeat} recent repeat candidates.</p><p>${d.integrityOK?'✓ Cross-check integrity passed.':'⛔ Cross-check problems: '+esc(d.errors.slice(0,4).join(' · '))} ${d.completePreview?'Preview coverage complete. Official start still BLOCKED.':'Track assignment readiness incomplete; official start BLOCKED.'}</p><details><summary>First 15 visit readiness decisions</summary><ol>${d.first.map(x=>`<li>#${esc(x.position)} ${esc(x.name)} — <strong>${esc(x.status)}</strong> · ${esc(x.reason)}${x.route?' · ID '+esc(x.route):''}</li>`).join('')}</ol></details><details><summary>First 12 blocked visits and reasons</summary>${d.blockedExamples.length?`<ol>${d.blockedExamples.map(x=>`<li>#${esc(x.position)} ${esc(x.name)} · ${esc(x.reason)}</li>`).join('')}</ol>`:'<p>No blocked visits in the preview. No official release implied.</p>'}</details><p class="t2-a388-foot">INSPECTION ONLY · NO ROUTE WRITES · NO GARAGE/RESULT CHANGES · SLOT 001 LOCKED</p></div>`;}catch(e){return `<div class="t2-a388" role="alert">⛔ Track readiness unavailable: ${esc(e.message)}. Official start locked.</div>`;}}
return Object.freeze({assess,snapshot,html});
});