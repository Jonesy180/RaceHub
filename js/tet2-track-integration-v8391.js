/* TET2 v8.0.391 — read-only schedule <-> verified route preview join.
 * This never modifies timetable rows, route catalogues, slots or storage.
 * Strict stable visit keys: position + eventId + visit; duplicates fail closed.
 */
(function(root,factory){'use strict';const api=factory(root);root.TET2TrackIntegration391=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof window!=='undefined'?window:globalThis,function(root){'use strict';
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const key=r=>JSON.stringify([r.position,r.eventId,r.visit??null]);
 function join(rows,result){
  if(!Array.isArray(rows)||!rows.length)throw Error('Verified schedule unavailable');
  if(!result||!Array.isArray(result.assigned)||!Array.isArray(result.unassigned)||result.officialWrites!==0||result.blocked!==true)throw Error('Untrusted route preview result');
  const keys=new Set(),seen=new Set(),proposals=new Map(),issues=[];
  for(const r of rows){const k=key(r);if(keys.has(k))issues.push('Duplicate schedule visit '+k);keys.add(k);}
  for(const a of result.assigned){const k=key(a);if(seen.has(k))issues.push('Duplicate route assignment '+k);seen.add(k);if(!keys.has(k))issues.push('Orphan route proposal '+k);if(!a.routeId||!a.routeName||!a.family)issues.push('Incomplete proposal '+k);proposals.set(k,a);}
  // Every assignment must resolve to an independently verified catalogue ID and family.
  const catalogue=root.TET2TrackValidation389?.resolveCatalogue?.()?.selected;
  const known=new Map((catalogue?.rows||[]).map(r=>[String(r.id),r]));
  for(const a of result.assigned){const r=known.get(String(a.routeId));if(!r||String(r.name)!==String(a.routeName)||root.TET2TrackAssignment390?.kind?.(r.kind)!==a.family)issues.push('Catalogue mismatch '+key(a));}
  const merged=rows.map(r=>{const a=proposals.get(key(r));const hasExisting=!!(r.routeId||r.courseId||(Array.isArray(r.routeIds)&&r.routeIds.length));return Object.freeze({position:r.position,eventId:r.eventId,visit:r.visit??null,name:r.name??r.title??r.eventId,stage:r.stage??null,routeId:hasExisting?null:(a?.routeId??null),routeName:hasExisting?null:(a?.routeName??null),raceFamily:a?.family??null,status:hasExisting?'EXISTING ID — SEPARATE VERIFICATION':a?'PROPOSED ONLY':'UNRESOLVED',recentRepeat:!!a?.recentRepeat});});
  if(merged.filter(r=>r.routeId).length!==result.assigned.length)issues.push('Schedule/proposal counts disagree');
  return Object.freeze({ok:issues.length===0,issues,rows:merged,totals:{schedule:rows.length,proposed:result.assigned.length,unresolved:merged.filter(r=>r.status==='UNRESOLVED').length,existing:merged.filter(r=>r.status.startsWith('EXISTING')).length,repeat:merged.filter(r=>r.recentRepeat).length},catalogueSource:catalogue?.source||null,officialWrites:0,officialStartLocked:true});
 }
 function snapshot(){const p=root.TET2AssembledList379?.snapshot?.();if(!p?.audit?.ok)throw Error('Verified candidate timetable failed integrity audit');const route=root.TET2TrackAssignment390?.snapshot?.();if(!route)throw Error('Route rehearsal unavailable');return join(p.rows,route);}
 function html(){try{const d=snapshot();const first=d.rows.slice(0,12);return `<div class="t2-a388"><p class="t2-a388-status ${d.ok?'fail':'fail'}">🔒 SCHEDULE ↔ TRACK PREVIEW · NO OFFICIAL ASSIGNMENTS</p><div class="t2-a388-metrics"><div><strong>${d.totals.schedule}</strong><small>Scheduled visits</small></div><div><strong>${d.totals.proposed}</strong><small>Matched previews</small></div><div><strong>${d.totals.unresolved}</strong><small>Unresolved visits</small></div><div><strong>${d.totals.existing}</strong><small>Existing IDs (not replaced)</small></div></div><p>${d.ok?'✓ Visit identities reconciled':'⛔ Join failed: '+esc(d.issues.slice(0,4).join(' · '))}. Catalogue: ${esc(d.catalogueSource||'NOT VERIFIED')}. These rows are a separate read-only view; the actual Evil List is unchanged.</p><details><summary>First 12 scheduled visits and proposed tracks</summary><ol>${first.map(r=>`<li><strong>Slot ${esc(r.position)} — ${esc(r.name)}</strong><br><small>${esc(r.status)}${r.routeName?' · '+esc(r.routeName)+' [ID '+esc(r.routeId)+']':''}${r.recentRepeat?' · REPEAT WITHIN FIVE SLOTS':''}</small></li>`).join('')}</ol></details><p class="t2-a388-foot">NO STORAGE WRITES · NO TRACK FREEZE · NO SLOT ACTIVATION · SLOT 001 LOCKED</p></div>`;}catch(e){return `<div class="t2-a388" role="alert">⛔ Track-to-schedule integration unavailable: ${esc(e.message)}. Slot 001 locked.</div>`;}}
 return Object.freeze({key,join,snapshot,html});
});
