/* TET2 v8.0.366: source-backed candidate-slot compiler and paged audit browser.
 * Read-only: no registry writes, no official slots, no results, no Garage snapshot export.
 * Exact original stages retained in per-competition order; not a final/current approved programme.
 */
(function(root,factory){'use strict';const api=factory();root.TET2CandidateSchedule366=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const SEED='TET2-SOURCE-CANDIDATE-2026-11-20-V1';
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const hash32=s=>{let h=2166136261>>>0;for(const c of String(s)){h^=c.codePointAt(0);h=Math.imul(h,16777619)>>>0;}return h>>>0;};
 const rng=s=>{let a=hash32(s)||0x9e3779b9;return ()=>{a=(a+0x6d2b79f5)|0;let t=Math.imul(a^a>>>15,1|a);t^=t+Math.imul(t^t>>>7,61|t);return ((t^t>>>14)>>>0)/4294967296;};};
 const SOURCE=()=>window.TET2R1StageInventory366;
 function compile(owned=704,seed=SEED){
  const source=SOURCE();if(!source||!Array.isArray(source.visits)||!Array.isArray(source.events))throw Error('Verified historical source inventory is missing.');
  if(!Number.isInteger(owned)||owned<1||owned>10000)throw Error('Invalid current Garage count');
  const meta=new Map(source.events.map(a=>[a[0],{id:a[0],name:a[1],mode:a[2],family:a[3],pool:a[4],historicalField:a[5]}]));
  if(meta.size!==source.events.length)throw Error('Duplicate source event ID');
  const queues=new Map();
  for(const v of source.visits){
   const id=v[0];if(!meta.has(id))throw Error('Unknown historical event '+id);
   if(!queues.has(id))queues.set(id,[]);
   queues.get(id).push({eventId:id,visit:v[1],visitTotal:v[2],format:v[3],sourcePhase:v[4],workload:v[5],...meta.get(id),origin:'historical-reference'});
  }
  for(const [id,q]of queues){q.sort((a,b)=>a.visit-b.visit);if(!q.every((a,i)=>a.visit===i+1&&a.visitTotal===q.length))throw Error('Bad source-visit order '+id);}
  const historical=source.visits.length;const nBatches=Math.ceil(owned/16);
  const aero=[];for(let i=0;i<nBatches;i++)aero.push({eventId:'TET2-AERO-DOUBLEHEADER',name:'Aeródromo Double-Header',mode:'Drag + Long Jump',family:'Aeródromo',origin:'approved-new',visit:i+1,visitTotal:nBatches,format:'DRAG FIRST · THEN JUMP',workload:Math.min(16,owned-16*i),rangeStart:16*i+1,rangeEnd:Math.min(owned,(i+1)*16),historicalField:null});
  queues.set('TET2-AERO-DOUBLEHEADER',aero);
  // Historical phase-06 finale stages are a protected source subset; keep these at the end of *the candidate core*.
  const protectedVisits=[];
  for(const [id,q] of queues){if(id==='TET2-AERO-DOUBLEHEADER')continue;
    while(q.length&&String(q[q.length-1].sourcePhase).startsWith('06'))protectedVisits.unshift(q.pop());
    if(!q.length)queues.delete(id);
  }
  const roll=rng(seed),rows=[],recent=[];
  while(queues.size){
   const choices=[...queues.keys()].filter(k=>!recent.includes(k));const keys=choices.length?choices:[...queues.keys()];
   const chosen=keys[Math.floor(roll()*keys.length)];const q=queues.get(chosen),next=q.shift();
   rows.push({...next,candidatePosition:rows.length+1});
   if(!q.length)queues.delete(chosen);recent.push(chosen);if(recent.length>5)recent.shift();
  }
  // Protected source tail: order independent event chains by original visit sequence.
  const tailByEvent=new Map();for(const row of protectedVisits){if(!tailByEvent.has(row.eventId))tailByEvent.set(row.eventId,[]);tailByEvent.get(row.eventId).push(row);}
  for(const q of tailByEvent.values())q.sort((a,b)=>a.visit-b.visit);
  while(tailByEvent.size){const keys=[...tailByEvent.keys()];const k=keys[Math.floor(roll()*keys.length)];const q=tailByEvent.get(k);rows.push({...q.shift(),candidatePosition:rows.length+1});if(!q.length)tailByEvent.delete(k);}
  const audit=auditRows(rows,source,owned);
  if(!audit.ok)throw Error('Candidate compile integrity failed: '+audit.issues.join('; '));
  return {rows,audit,seed,owned};
 }
 function auditRows(rows,source,owned){
  const issues=[],visits=new Map(),counts=new Map();let dual=0,protectedCount=0;
  for(const row of rows){
   if(row.origin==='approved-new'){dual++;continue;}
   if(!counts.has(row.eventId))counts.set(row.eventId,0);
   counts.set(row.eventId,counts.get(row.eventId)+1);
   const prev=visits.get(row.eventId)||0;
   if(row.visit!==prev+1)issues.push('Visit order reversed for '+row.eventId);
   visits.set(row.eventId,row.visit);
   if(row.sourcePhase?.startsWith('06'))protectedCount++;
   if(row.mode==='Drift Festival'||row.mode==='Drift Race Off'||row.family==='Drag Racing')issues.push('Retired historical mode was accidentally kept');
  }
  if(rows.length!==source.visits.length+Math.ceil(owned/16))issues.push('Wrong total source-stage count');
  if(dual!==Math.ceil(owned/16))issues.push('Double-header batch count mismatch');
  if(counts.size!==source.events.length)issues.push('Some legacy events have no scheduled stages');
  const historicalSource=new Map();for(const v of source.visits)historicalSource.set(v[0],(historicalSource.get(v[0])||0)+1);
  for(const [id,n] of historicalSource){if(counts.get(id)!==n)issues.push('Lost stages '+id);}
  const finalTail=rows.slice(-protectedCount);if(finalTail.some(x=>!x.sourcePhase?.startsWith('06')))issues.push('Source-protected stages leaked into core');
  return Object.freeze({ok:!issues.length,issues,legacyEvents:source.events.length,legacyVisits:source.visits.length,aeroBatches:dual,candidateRows:rows.length,protectedSourceVisits:protectedCount,retiredEvents:14,retiredVisits:37});
 }
 let state={page:0,query:'',family:'all'},last=null;
 function rows(){
   const status=window.TET2SlotLedger361?.status?.();const owned=status?.connected&&Number.isInteger(status.owned)&&status.owned>0?status.owned:704;
   if(!last||last.owned!==owned)last=compile(owned);
   return last;
 }
 function familyOptions(data){const families=[...new Set(data.rows.map(x=>x.family))].sort();return '<option value="all">All families</option>'+families.map(x=>`<option value="${escape(x)}">${escape(x)}</option>`).join('');}
 function filtered(data){const q=state.query.trim().toLowerCase();return data.rows.filter(x=>(state.family==='all'||x.family===state.family)&&(!q||[x.name,x.family,x.mode,x.eventId].join(' ').toLowerCase().includes(q)));}
 function resultsHTML(data){const all=filtered(data),pages=Math.max(1,Math.ceil(all.length/50));state.page=Math.max(0,Math.min(state.page,pages-1));const view=all.slice(state.page*50,(state.page+1)*50);
  return {list:all.length?view.map(x=>`<li class="t2-plan-row"><span class="t2-plan-id">DRAFT ${String(x.candidatePosition).padStart(4,'0')}</span><span class="t2-plan-name">${escape(x.name)}</span><span class="t2-plan-meta">${escape(x.family)} · ${escape(x.mode)} · ${x.origin==='approved-new'?'Batch '+x.visit+'/'+x.visitTotal+', cars '+x.rangeStart+'–'+x.rangeEnd:'Historical visit '+x.visit+'/'+x.visitTotal}</span><span class="t2-plan-sub">${x.origin==='approved-new'?'Drag first → Long Jump second · one attempt/car':escape(x.format)+' · source-stage reference only (rule reconciliation pending)'}</span></li>`).join(''): '<p class="t2-empty">No matching candidate entries.</p>',pager:`<button type="button" data-t2-schedule="prev" ${state.page===0?'disabled':''}>◀ Previous</button><span>Page ${state.page+1} / ${pages}</span><button type="button" data-t2-schedule="next" ${state.page>=pages-1?'disabled':''}>Next ▶</button>`,detail:`${all.length} matching candidate entries · showing ${all.length?(state.page*50+1)+'–'+Math.min((state.page+1)*50,all.length):'0'}`};
 }
 function html(){try{const d=rows(),a=d.audit,r=resultsHTML(d);return `<p class="t2-plan-warning"><strong>ENGINEERING CANDIDATE — NOT THE OFFICIAL EVIL LIST.</strong><br>Historical event visits have been reconciled into a reproducible randomised sequence, with approved Aeródromo Double-Header batches. The new specialist, Swiss, Relay, Gauntlet and endgame workloads are <strong>not yet fully registered</strong>, so this is not the final slot total or a playable racing order.</p>
   <div class="t2-plan-stats"><span><b>${a.legacyEvents}</b><small>Retained historical events</small></span><span><b>${a.legacyVisits}</b><small>Historical visits</small></span><span><b>${a.aeroBatches}</b><small>Double-header batches*</small></span><span><b>${a.candidateRows}</b><small>Candidate entries (partial)</small></span></div>
   <p class="t2-plan-foot">*${d.owned} owned FH5 cars used for the preview · batches of up to 16. Actual tournament draws remain unfrozen, allowing eligible late entrants. All ${a.retiredVisits} old Drift/Drag visits were removed; the existing 22-car Drift Championship remains a separate approved format needing final scheduling. Source-protected visits: ${a.protectedSourceVisits}.</p>
   <div class="t2-plan-controls"><label>Find event<input id="t2-plan-query" type="search" placeholder="Search event / family" value="${escape(state.query)}" autocomplete="off"></label><label>Category<select id="t2-plan-family">${familyOptions(d)}</select></label></div>
   <p class="t2-plan-count" id="t2-plan-count">${r.detail}</p><ol class="t2-plan-list" id="t2-plan-list">${r.list}</ol><div class="t2-plan-pager" id="t2-plan-pager">${r.pager}</div>
   <p class="t2-plan-foot">For safety these are <strong>DRAFT</strong> positions, not official slot IDs. No result entry, draw locking, medals or tournament progression can be launched from this list.</p>`;
  }catch(e){return `<div class="t2-plan-warning" role="alert">Source reconciliation failed — schedule remains disabled. ${escape(e.message)}</div>`;}}
 function refresh(){const d=rows(),r=resultsHTML(d),l=document.getElementById('t2-plan-list'),p=document.getElementById('t2-plan-pager'),c=document.getElementById('t2-plan-count');if(l&&p&&c){l.innerHTML=r.list;p.innerHTML=r.pager;c.textContent=r.detail;}}
 function action(e){const b=e.target.closest('[data-t2-schedule]');if(!b)return false;const step=b.dataset.t2Schedule;if(step==='prev')state.page--;if(step==='next')state.page++;refresh();return true;}
 function input(e){if(e.target.id==='t2-plan-query'){state.query=String(e.target.value||'').slice(0,100);state.page=0;refresh();return true;}return false;}
 function change(e){if(e.target.id==='t2-plan-family'){state.family=e.target.value||'all';state.page=0;refresh();return true;}return false;}
 return Object.freeze({compile,auditRows,html,action,input,change,seed:SEED});
});
