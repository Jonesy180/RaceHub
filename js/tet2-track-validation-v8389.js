/* TET2 v8.0.389 — strict, non-writing route provenance inspection.
   NEVER infer route IDs from a displayed label. Never promote preview routes to official slots. */
(function(root,factory){'use strict';const api=factory(root);root.TET2TrackValidation389=api;
 if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis,function(root){'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stable=s=>String(s??'').trim();
// We accept a catalogue only when it is a real array of route objects with
// durable IDs. This is deliberately stricter than reading buttons or strings.
const CATALOGUE_SOURCES=[
 ['FH5TrackDirectory',()=>root.FH5TrackDirectory],
 ['FH5TrackDirectory103',()=>root.FH5TrackDirectory103],
 ['FH5TrackTaxonomy',()=>root.FH5TrackTaxonomy],
 ['FH5TrackTaxonomy8067',()=>root.FH5TrackTaxonomy8067],
 ['FH5_TRACKS',()=>root.FH5_TRACKS],
 ['FH5_ROUTES',()=>root.FH5_ROUTES],
 ['rhFH5Tracks',()=>root.rhFH5Tracks]
];
function arrayCandidates(obj){if(Array.isArray(obj))return [obj];if(!obj||typeof obj!=='object')return [];
 const out=[];for(const key of ['routes','tracks','courses','events','items','catalogue','all','entries']){
  if(Array.isArray(obj[key]))out.push(obj[key]);}
 return out;
}
function resolveCatalogue(){let plausible=[];
 for(const [name,get] of CATALOGUE_SOURCES){let src;try{src=get();}catch(_){continue;}
  for(const arr of arrayCandidates(src)){
   const valid=arr.filter(r=>r&&typeof r==='object'&&stable(r.id??r.routeId??r.trackId??r.courseId)&&stable(r.name??r.routeName??r.title??r.label));
   if(valid.length>=3){const mapped=valid.map(r=>({id:stable(r.id??r.routeId??r.trackId??r.courseId),name:stable(r.name??r.routeName??r.title??r.label),kind:stable(r.type??r.kind??r.category??r.raceType??''),source:name}));
    const ids=mapped.map(x=>x.id);const unique=new Set(ids).size===ids.length;
    plausible.push({source:name,total:arr.length,valid:mapped.length,unique,rows:mapped});}
  }
 }
 plausible.sort((a,b)=>Number(b.unique)-Number(a.unique)||b.valid-a.valid);
 return {selected:plausible.find(x=>x.unique)||null,sources:plausible.map(({source,total,valid,unique})=>({source,total,valid,unique}))};
}
function inspect(plan,catalogue){if(!Array.isArray(plan?.rows)||!plan.rows.length)throw Error('Verified candidate Evil List is not available.');
 const rows=plan.rows,ids=new Map((catalogue?.selected?.rows||[]).map(r=>[r.id,r]));
 const assignments=[];const unresolved=[];const invalid=[];const noId=[];
 for(const row of rows){
  const raw=row.routeId??row.courseId??null;
  const arr=Array.isArray(row.routeIds)?row.routeIds:raw?[raw]:[];
  if(!arr.length){noId.push(row);continue;}
  const names=arr.map(v=>stable(v));
  if(names.some(x=>!x||!ids.has(x))){invalid.push({position:row.position,eventId:row.eventId,routeIds:names});continue;}
  assignments.push({position:row.position,eventId:row.eventId,routeIds:names});
 }
 const allNames=new Map();for(const a of assignments){for(const id of a.routeIds){allNames.set(id,(allNames.get(id)||0)+1);}}
 const hottest=[...allNames].sort((a,b)=>b[1]-a[1]).slice(0,5).map(([id,n])=>({id,name:ids.get(id)?.name,count:n}));
 const sourceReady=!!catalogue?.selected;
 const blocked=!sourceReady||!!noId.length||!!invalid.length;
 return {candidateOnly:true,officialRouteAssignmentsWritten:0,totalVisits:rows.length,catalogueSource:catalogue?.selected?.source||null,
  catalogueSize:ids.size,otherSources:catalogue?.sources||[],validatedVisits:assignments.length,
  noRouteIds:noId.length,unrecognisedRouteIds:invalid.length,blocked,
  repeatHotspots:hottest,unresolvedSamples:noId.slice(0,5).map(r=>({position:r.position,name:r.name,stage:r.stage})),invalidSamples:invalid.slice(0,5),
  warnings:[!sourceReady?'No durable-ID FH5 route registry was positively identified on this installation.':null,
   noId.length?'A route name or planned event type is NOT a frozen catalogue route ID.':null,
   invalid.length?'Some supplied route IDs cannot be resolved against the validated registry.':null].filter(Boolean)};
}
function snapshot(){const plan=root.TET2AssembledList379?.snapshot?.();if(!plan?.audit?.ok)throw Error('Candidate Evil List integrity check failed.');return inspect(plan,resolveCatalogue());}
function html(){try{const d=snapshot();return `<div class="t2-a388"><p class="t2-a388-status ${d.blocked?'fail':'pass'}">${d.blocked?'⛔ OFFICIAL TRACK FREEZE BLOCKED':'✓ ROUTE IDENTITIES VALIDATED · PRELAUNCH ONLY'}</p>
 <div class="t2-a388-metrics"><div><strong>${d.catalogueSize}</strong><small>Verified catalogue IDs</small></div><div><strong>${d.validatedVisits.toLocaleString('en-GB')}</strong><small>Resolved visits</small></div><div><strong>${d.noRouteIds.toLocaleString('en-GB')}</strong><small>Unassigned visits</small></div><div><strong>${d.unrecognisedRouteIds}</strong><small>Unknown IDs</small></div></div>
 <p>${d.catalogueSource?'Catalogue source: '+esc(d.catalogueSource)+'.':'No confirmed route-ID source yet.'} Candidate: ${d.totalVisits.toLocaleString('en-GB')} visits. This scan does not choose, freeze or save any tracks.</p>
 ${d.warnings.length?`<p class="t2-a388-fail">${d.warnings.map(esc).join(' ')}</p>`:''}
 <details><summary>Route registry evidence & repeat checks</summary><p>Detected source candidates: ${d.otherSources.length?d.otherSources.map(s=>esc(s.source)+' ('+s.valid+' identified; IDs '+(s.unique?'unique':'duplicated')+')').join(' · '):'none with verified IDs'}</p><p>Confirmed repeat hotspots: ${d.repeatHotspots.length?d.repeatHotspots.map(x=>esc(x.name)+' ×'+x.count).join(' · '):'none yet (no routes assigned)'}</p><p>First unassigned slots: ${d.unresolvedSamples.map(x=>'#'+x.position+' '+esc(x.name)).join(' · ')||'none'}</p></details>
 <p class="t2-a388-foot">NO ROUTE GUESSING · NO COURSE REPETITION MASKING · NO OFFICIAL SLOT ACTIVATION · NO GARAGE OR RESULT WRITES.</p></div>`;
 }catch(e){return `<div class="t2-a388" role="alert">⛔ ROUTE AUDIT UNAVAILABLE. OFFICIAL START LOCKED. ${esc(e.message)}</div>`;}}
return Object.freeze({resolveCatalogue,inspect,snapshot,html});
});
