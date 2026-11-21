/* TET2 v8.0.392 — fail-closed route catalogue / race-family reconciliation.
   Read only: no storage access, no slot edits, no inferred official identifiers. */
(function(root,factory){'use strict';const api=factory(root);root.TET2RouteReconciliation392=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof window!=='undefined'?window:globalThis,function(root){'use strict';
 const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const val=x=>String(x??'').trim();
 const family=x=>root.TET2TrackAssignment390?.kind?.(x)??null;
 function reconcile(rows,registry,preview){
  if(!Array.isArray(rows)||!rows.length)throw Error('Verified schedule rows missing');
  if(!preview||!Array.isArray(preview.assigned)||!Array.isArray(preview.unassigned)||preview.officialWrites!==0||preview.blocked!==true)throw Error('Untrusted preview');
  const source=registry?.selected, catalogue=Array.isArray(source?.rows)?source.rows:[];
  const issue=[],lookup=new Map(),byFamily=new Map(),seenVisits=new Set(),seenAssignments=new Set();
  if(!source?.source||!catalogue.length)issue.push('No verified FH5 catalogue');
  for(const r of catalogue){const id=val(r.id),name=val(r.name),f=family(r.kind);if(!id||!name){issue.push('Incomplete catalogue route identity');continue;}if(lookup.has(id)){issue.push('Duplicate route ID '+id);continue;}lookup.set(id,{name,f});if(f)byFamily.set(f,(byFamily.get(f)||0)+1);}
  const assignment=new Map();
  for(const a of preview.assigned){const key=JSON.stringify([a.position,a.eventId,a.visit??null]);if(seenAssignments.has(key))issue.push('Duplicate preview key '+key);seenAssignments.add(key);assignment.set(key,a);const r=lookup.get(val(a.routeId));if(!r||r.name!==val(a.routeName)||r.f!==a.family)issue.push('Unverified proposed route '+key);}
  const totals={visits:rows.length,validExisting:0,unknownExisting:0,wrongFamilyExisting:0,missingExistingFamily:0,missingRaceFamily:0,unavailableFamily:0,proposed:0,proposalCategoryConflict:0,unresolved:0,repeatProposals:0};
  const examples=[];let worst='';
  for(const row of rows){
   const key=JSON.stringify([row.position,row.eventId,row.visit??null]);if(seenVisits.has(key))issue.push('Duplicate schedule visit '+key);seenVisits.add(key);
   const explicit=root.TET2TrackAssignment390?.eventFamily?.(row)??null;
   const ids=Array.isArray(row.routeIds)&&row.routeIds.length?row.routeIds.map(val):row.routeId||row.courseId?[val(row.routeId??row.courseId)]:[];
   const p=assignment.get(key);let status='UNRESOLVED',reason='No verified route identity';
   if(!explicit){totals.missingRaceFamily++;}
   else if(!byFamily.has(explicit)){totals.unavailableFamily++;}
   if(ids.length){
    const matched=ids.map(id=>lookup.get(id));
    if(matched.some(x=>!x)){totals.unknownExisting++;status='INVALID EXISTING ID';reason='Existing IDs absent from verified catalogue';}
    else if(!explicit){totals.missingExistingFamily++;status='EXISTING CATEGORY UNKNOWN';reason='Cannot independently confirm event race family';}
    else if(matched.some(x=>x.f!==explicit)){totals.wrongFamilyExisting++;status='EXISTING CATEGORY MISMATCH';reason='Existing route family differs from explicit race family';}
    else{totals.validExisting++;status='VALID EXISTING ID';reason='Existing IDs verified against catalogue and race family';}
    if(p){issue.push('Preview overwrites existing route '+key);}
   }else if(p){
    if(!explicit||p.family!==explicit){totals.proposalCategoryConflict++;status='PROPOSAL CATEGORY MISMATCH';reason='Proposed route class is unsupported by event';}
    else{totals.proposed++;status='PREVIEW ONLY';reason='Verified candidate, not an official track assignment';}
    if(p.recentRepeat)totals.repeatProposals++;
   }else{totals.unresolved++;reason=!explicit?'Explicit race family unavailable':!byFamily.has(explicit)?'No verified routes in this race family':'No preview route proposed';}
   if(examples.length<15&&(status!=='VALID EXISTING ID'))examples.push({position:row.position,name:row.name??row.title??row.eventId,status,reason});
  }
  for(const key of assignment.keys())if(!seenVisits.has(key))issue.push('Orphan proposal '+key);
  const accounted=totals.validExisting+totals.unknownExisting+totals.wrongFamilyExisting+totals.missingExistingFamily+totals.proposed+totals.proposalCategoryConflict+totals.unresolved;
  if(accounted!==rows.length)issue.push('Visit reconciliation totals do not match');
  return Object.freeze({blocked:true,officialWrites:0,officialStartLocked:true,source:source?.source||null,routeCount:lookup.size,routeFamilies:Object.fromEntries(byFamily),totals,issues:issue,examples,complete:issue.length===0&&totals.unresolved===0&&totals.unknownExisting===0&&totals.wrongFamilyExisting===0&&totals.missingExistingFamily===0&&totals.missingRaceFamily===0&&totals.unavailableFamily===0&&totals.proposalCategoryConflict===0});
 }
 function snapshot(){const t=root.TET2AssembledList379?.snapshot?.();if(!t?.audit?.ok)throw Error('Candidate timetable integrity audit failed');const v=root.TET2TrackValidation389?.resolveCatalogue?.();const p=root.TET2TrackAssignment390?.snapshot?.();return reconcile(t.rows,v,p);}
 function html(){try{const d=snapshot(),t=d.totals;return `<div class="t2-a388"><p class="t2-a388-status fail">🔒 FH5 CATALOGUE RECONCILIATION · OFFICIAL START BLOCKED</p><div class="t2-a388-metrics"><div><strong>${d.routeCount}</strong><small>Verified catalogue IDs</small></div><div><strong>${t.validExisting+t.proposed}</strong><small>Verified IDs / proposals</small></div><div><strong>${t.unresolved}</strong><small>Unresolved visits</small></div><div><strong>${t.wrongFamilyExisting+t.proposalCategoryConflict}</strong><small>Category conflicts</small></div></div><p>Catalogue: ${escape(d.source||'NOT VERIFIED')}. ${t.visits} candidate visits; ${t.proposed} proposed only, ${t.validExisting} independently validated existing; ${t.unknownExisting} unknown existing IDs. ${t.missingRaceFamily} missing/ambiguous event categories. ${t.unavailableFamily} visits with no available routes in their category. Recent repeat proposals: ${t.repeatProposals}.</p><p>${d.issues.length?'⛔ INTEGRITY ISSUES: '+escape(d.issues.slice(0,3).join(' · ')):'✓ Internal reconciliation checks consistent.'} ${d.complete?'All candidate visits accounted for; still no official promotion.':'Route coverage is incomplete or unverified.'}</p><details><summary>First 15 unresolved / preview visit explanations</summary><ol>${d.examples.map(x=>`<li>#${escape(x.position)} ${escape(x.name)} — <strong>${escape(x.status)}</strong>: ${escape(x.reason)}</li>`).join('')||'<li>No exceptions.</li>'}</ol><p>Eligible route classes: ${escape(Object.entries(d.routeFamilies).map(([k,v])=>k+' '+v).join(' · ')||'none')}.</p></details><p class="t2-a388-foot">READ ONLY · NO ROUTE GUESSING · NO OFFICIAL FREEZE · SLOT 001 LOCKED · NO GARAGE/RESULT WRITES</p></div>`;}catch(e){return `<div class="t2-a388" role="alert">⛔ Catalogue reconciliation unavailable: ${escape(e.message)}. Slot 001 locked.</div>`;}}
 return Object.freeze({reconcile,snapshot,html});
});
