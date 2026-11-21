/* TET2 v8.0.390 — deterministic, read-only route allocation rehearsal.
   Refuses unknown event classifications, missing stable course IDs or unknown catalogues.
   This is NOT the official course freeze. */
(function(root,factory){'use strict';const api=factory(root);root.TET2TrackAssignment390=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof window!=='undefined'?window:globalThis,function(root){'use strict';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalized=x=>String(x??'').trim().toLowerCase().replace(/[\s_-]+/g,' ');
// Only exact, explicit race-family identities qualify. A name like "Rally" in
// the event title is insufficient evidence for a Dirt Racing track.
const FAMILY={road:'road', 'road racing':'road',street:'street','street scene':'street',dirt:'dirt','dirt racing':'dirt',crosscountry:'crosscountry','cross country':'crosscountry','cross country racing':'crosscountry',drag:'drag','drag racing':'drag'};
function kind(x){return FAMILY[normalized(x)]||null;}
function hash(s){let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function eventFamily(row){const entries=[row.routeClass,row.trackClass,row.courseClass,row.raceFamily,row.raceType].filter(x=>x!==undefined&&x!==null&&String(x).trim());const kinds=new Set(entries.map(kind));return entries.length===0?null:(kinds.size===1&&!kinds.has(null)?[...kinds][0]:null);}
function plan(rows,registry,opts={}){
 if(!Array.isArray(rows)||!rows.length)throw Error('Verified Evil List rows are required.');
 const selected=registry?.selected;
 if(!selected||!Array.isArray(selected.rows)||!selected.source) return {blocked:true,source:null,total:rows.length,assigned:[],unassigned:rows.map(r=>({position:r.position,reason:'No independently verified route-ID catalogue'})),counts:{},officialWrites:0};
 const seen=new Set();const groups=new Map();let duplicateCatalogue=false;
 for(const r of selected.rows){const id=String(r.id??'').trim(),name=String(r.name??'').trim(),family=kind(r.kind);if(!id||!name||seen.has(id)){duplicateCatalogue=true;continue;}seen.add(id);if(!family)continue;if(!groups.has(family))groups.set(family,[]);groups.get(family).push({id,name,family});}
 if(duplicateCatalogue)return {blocked:true,source:selected.source,total:rows.length,assigned:[],unassigned:rows.map(r=>({position:r.position,reason:'Duplicate or incomplete catalogue identities'})),counts:{},officialWrites:0};
 const use=new Map(),lastPosition=new Map(),assigned=[],unassigned=[];const cooldown=Math.max(0,Math.min(50,Number.isInteger(opts.cooldown)?opts.cooldown:5));
 for(const row of rows){const explicit=eventFamily(row),position=Number(row.position),id=String(row.eventId??'');
  if(!Number.isSafeInteger(position)||position<1||!id){unassigned.push({position:row.position,reason:'Invalid schedule visit identity'});continue;}
  if(row.routeId||row.courseId||(Array.isArray(row.routeIds)&&row.routeIds.length)){unassigned.push({position,reason:'Existing route identity requires separate validation; never overwritten'});continue;}
  if(!explicit){unassigned.push({position,reason:'Missing or ambiguous explicit race family'});continue;}
  const options=groups.get(explicit)||[];if(!options.length){unassigned.push({position,reason:'No verified '+explicit+' routes'});continue;}
  // Deterministic load balancing, repeat avoidance, keyed tie-breaking. This
  // cannot manufacture more distinct courses than the catalogue supplies.
  const ranked=options.map(r=>({...r,used:use.get(r.id)||0,age:position-(lastPosition.get(r.id)??-99999),tie:hash(id+'|'+row.visit+'|'+r.id)})).sort((a,b)=>Number(a.age<=cooldown)-Number(b.age<=cooldown)||a.used-b.used||b.age-a.age||a.tie-b.tie||a.id.localeCompare(b.id));
  const chosen=ranked[0];use.set(chosen.id,chosen.used+1);lastPosition.set(chosen.id,position);
  assigned.push({position,eventId:id,visit:row.visit,routeId:chosen.id,routeName:chosen.name,family:explicit,recentRepeat:chosen.age<=cooldown,usage:chosen.used+1});
 }
 const counts=Object.fromEntries([...groups].map(([family,rs])=>[family,rs.length]));
 return {blocked:true,source:selected.source,total:rows.length,assigned,unassigned,counts,officialWrites:0,cooldown,repeatWithinCooldown:assigned.filter(x=>x.recentRepeat).length,uniqueRoutes:new Set(assigned.map(x=>x.routeId)).size,deterministic:true};
}
function snapshot(){const v=root.TET2TrackValidation389;const current=root.TET2AssembledList379?.snapshot?.();if(!current?.audit?.ok)throw Error('Candidate timetable verification failed.');const registry=v?.resolveCatalogue?.();if(!registry)throw Error('The verified track registry is unavailable.');return plan(current.rows,registry);}
function html(){try{const d=snapshot();const samp=d.assigned.slice(0,7);return `<div class="t2-a388"><p class="t2-a388-status fail">🔒 PREVIEW ONLY · OFFICIAL TRACK FREEZE BLOCKED</p><div class="t2-a388-metrics"><div><strong>${d.assigned.length.toLocaleString('en-GB')}</strong><small>Proposed course visits</small></div><div><strong>${d.unassigned.length.toLocaleString('en-GB')}</strong><small>Unresolved visits</small></div><div><strong>${d.uniqueRoutes||0}</strong><small>Distinct preview routes</small></div><div><strong>${d.repeatWithinCooldown||0}</strong><small>Repeats within ${d.cooldown??5} slots</small></div></div><p>Verified source: ${esc(d.source||'NONE')}. Deterministic lowest-use matching by explicit race class, with recent-repeat protection. <strong>No preview assignment is saved, applied to the Evil List, or made official.</strong></p><details><summary>Track assignment evidence and sample (${d.assigned.length} candidates)</summary><p>Available categories: ${esc(Object.entries(d.counts).map(([k,v])=>k+' '+v).join(' · ')||'none verified')}.</p>${samp.length?`<ol>${samp.map(a=>`<li>Slot ${a.position}: ${esc(a.routeName)} <small>(${esc(a.family)} · ID ${esc(a.routeId)})</small></li>`).join('')}</ol>`:'<p>Nothing has been assigned: catalogue and/or explicit per-event class is still missing.</p>'}<p>Unresolved examples: ${d.unassigned.slice(0,5).map(a=>'#'+esc(a.position)+' '+esc(a.reason)).join(' · ')||'none'}.</p></details><p class="t2-a388-foot">NO WRITES · NO APPROVAL BY INFERENCE · NO PREVIEW-TO-OFFICIAL PROMOTION · SLOT 001 LOCKED</p></div>`;}catch(e){return `<div class="t2-a388" role="alert">⛔ Route preview unavailable: ${esc(e.message)}. Official start locked.</div>`;}}
return Object.freeze({kind,eventFamily,hash,plan,snapshot,html});
});
