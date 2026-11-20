/* OTG! MAIN v8.0.388 — pure READ-ONLY tournament timetable audit.
   No official schedule activation, no draws, no data writes. */
(function(root,factory){'use strict';const api=factory(root);root.TET2LaunchAudit388=api;
 if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis,function(root){'use strict';
const E=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const count=(rows,p)=>rows.filter(p).length;
const uniq=arr=>new Set(arr).size===arr.length;
const ok=(expr,msg,problems)=>{if(!expr)problems.push(msg);};
function inspect(cars,plan,source,opening){
 if(!Array.isArray(cars)||!cars.length||!plan?.audit?.ok||!Array.isArray(plan.rows)||!source?.events||!source?.visits||!opening?.formats)throw Error('Verified live Garage and source-backed schedule required');
 const rows=plan.rows,problems=[],warnings=[];
 const owned=cars.length, swiss=Math.ceil(owned/16),gauntlet=Math.ceil(owned/8),aero=Math.ceil(owned/16);
 const events=new Map();let completeChains=true;
 for(let i=0;i<rows.length;i++){
   const r=rows[i];ok(r.position===i+1,'Non-contiguous preview position '+(i+1),problems);
   if(!events.has(r.eventId))events.set(r.eventId,[]);
   events.get(r.eventId).push(r);
 }
 ok(uniq(rows.map(r=>r.eventId+'\u0000'+r.visit)),'Duplicate event/visit identity',problems);
 for(const [id,visits] of events){for(let i=0;i<visits.length;i++){
   if(visits[i].visit!==i+1||visits[i].visitTotal!==visits.length){completeChains=false;break;}
 }}
 ok(completeChains,'Broken event visit chain',problems);
 ok(source.events.length===214&&source.visits.length===1128,'Historical source inventory mismatch',problems);
 const original=new Map(source.events.map(e=>[e[0],e]));
 const hist=rows.filter(r=>r.origin==='historical');
 const originalBronze=source.events.filter(e=>e[2]==='Race Off'&&Number(e[5])>=4);
 ok(hist.length===1128+originalBronze.length,'Historical visit count / bronze reconciliation failure',problems);
 ok(originalBronze.length===93,'Historical source bronze count changed',problems);
 ok(new Set(hist.map(r=>r.eventId)).size===214,'Historical competition missing',problems);
 for(const e of source.events){
   const stages=events.get(e[0])||[];
   if(e[2]==='Race Off'){
     const extra=Number(e[5])>=4;
     ok(stages.length>=(extra?3:1)&&stages.at(-1)?.stage.startsWith('Final ·'),'Missing original Race Off final '+e[0],problems);
     ok(extra?(stages.at(-2)?.format==='BRONZE'&&count(stages,r=>r.format==='BRONZE')===1):count(stages,r=>r.format==='BRONZE')===0,'Wrong historical bronze order '+e[0],problems);
   }
 }
 const makers=rows.filter(r=>r.origin==='maker-knockout');
 const makerEvents=[...events].filter(([,v])=>v[0]?.origin==='maker-knockout');
 for(const [id,stages] of makerEvents){const makerName=stages[0].name.replace(' · Full Manufacturer Race Off','');const n=count(cars,c=>String(c.make||'').trim()===makerName);
  ok(n>=2,'Manufacturer Race Off without two owned cars '+id,problems);
  ok(stages.at(-1)?.stage==='Final','Full manufacturer final missing '+id,problems);
  ok(n>=4?(stages.at(-2)?.format==='BRONZE'&&count(stages,r=>r.format==='BRONZE')===1):!stages.some(r=>r.format==='BRONZE'),'Incorrect full-maker bronze '+id,problems);
 }
 const swissRows=rows.filter(r=>r.origin==='swiss');
 ok(swissRows.length===swiss*8&&new Set(swissRows.map(r=>r.eventId)).size===swiss,'All-Garage Swiss Cup workload mismatch',problems);
 for(const [id,stages] of events)if(stages[0].origin==='swiss'){
   ok(stages.length===8&&stages[6].format==='BRONZE'&&stages[7].stage==='Final','Swiss final/bronze stages wrong '+id,problems);
 }
 const lonely=rows.filter(r=>r.origin==='lonely');
 if(lonely.length)ok(lonely.at(-2)?.format==='BRONZE'&&lonely.at(-1)?.stage==='Final','Lonely Hearts bronze/final order broken',problems);
 ok(count(rows,r=>r.origin==='gauntlet')===gauntlet,'Unified Gauntlet 8-car batch count wrong',problems);
 ok(count(rows,r=>r.origin==='aerodromo')===aero,'Aeródromo Double-Header 16-car batch count wrong',problems);
 ok(new Set(rows.filter(r=>r.origin==='gauntlet').map(r=>r.eventId)).size===1,'Multiple Gauntlets found',problems);
 ok(count(rows,r=>r.origin==='relay')===plan.audit.relay,'Relay workload mismatch',problems);
 ok(count(rows,r=>r.origin==='drift')===1&&count(rows,r=>r.origin==='specialist')===1,'Drift or Festival Top 3 missing',problems);
 const first=rows.slice(0,opening.formats.length);const openingNames=new Set(opening.formats.map(f=>f.id));
 ok(first.length===11&&openingNames.size===11&&first.every(r=>r.opening&&r.visit===1)&&uniq(first.map(r=>r.eventId)),'Opening is not eleven distinct first visits',problems);
 ok(plan.first?.length===first.length&&first.every((r,i)=>r.eventId===plan.first[i].eventId)&&uniq(plan.first.map(f=>f.format))&&plan.first.every(f=>openingNames.has(f.format)),'Opening format coverage does not match approved list',problems);
 ok(rows.every((r,i)=>r.protected||!rows.slice(0,i).some(x=>x.protected)),'Protected donor tail is interleaved with ordinary visits',problems);
 ok(count(rows,r=>r.protected)===plan.audit.protectedN,'Protected historical source tail count changed',problems);
 ok(!rows.some(r=>/^(T2-SECOND-CHANCE|T2-CHAMPION)/.test(r.eventId)||/Second Chance Cup|Champion of Champions/i.test(r.name)),'Dependent finals assigned unconditional slot',problems);
 ok(!rows.some(r=>r.origin==='separate-maker-gauntlet'||/drift zone score|drift knockout/i.test(r.name)),'Obsolete competition reintroduced',problems);
 const second=count(rows,r=>r.secondChanceSource),champion=count(rows,r=>r.championRepresentativeSource);
 const likelySecond=count(makerEvents,([,v])=>count(cars,c=>String(c.make||'').trim()===v[0].name.replace(' · Full Manufacturer Race Off',''))>=4)+(lonely.length?1:0);
 ok(second===likelySecond&&champion===makerEvents.length,'Wrong dependent qualification sources',problems);
 const expected=hist.length+makers.length+count(rows,r=>r.origin==='relay')+swissRows.length+lonely.length+gauntlet+aero+2;
 ok(rows.length===expected&&rows.length===plan.audit.count,'Family totals fail to reconcile',problems);
 // Pre-launch gates are deliberately SEPARATE from schedule structure checks.
 const missingRoutes=count(rows,r=>!r.routeId&&!r.routeIds&&!r.courseId);
 const labels=new Map();for(const car of cars){const label=String(car.make||'').trim();const key=label.toLocaleLowerCase('en-GB');if(!labels.has(key))labels.set(key,new Set());labels.get(key).add(label);}
 const aliases=[...labels.values()].filter(v=>v.size>1).map(v=>[...v].join(' / '));
 const gates=[
   {key:'courses',blocked:missingRoutes>0,text:`${missingRoutes.toLocaleString('en-GB')} / ${rows.length.toLocaleString('en-GB')} visits have no frozen official route IDs. Track selection still needs its genuine course engine.`},
   {key:'rosters',blocked:true,text:`Historical source roster IDs and current Garage eligibility still need per-competition approval.${aliases.length?' Manufacturer aliases: '+aliases.join(', ')+'.':''}`},
   {key:'official',blocked:true,text:'Official slot freeze, results-to-honours publishing, immutable completion receipts and restart recovery are not yet connected end-to-end.'},
   {key:'finals',blocked:true,text:'Second Chance and Champion of Champions remain conditional and unscheduled until their real qualification/results dependency engine is completed.'},
   {key:'specialists',blocked:true,text:'Festival Top 3, the 22-car Drift Championship and remaining historical route/result adapters require final rule and course verification.'}
 ];
 const report={structuralPass:problems.length===0,launchReady:problems.length===0&&!gates.some(g=>g.blocked),problems,gates,
  owned,visits:rows.length,competitions:events.size,opening:first.length, historical:hist.length,historicalBronze:originalBronze.length,
  maker:makers.length,makerCompetitions:makerEvents.length,relay:count(rows,r=>r.origin==='relay'),swissCups:swiss,swissVisits:swissRows.length,
  lonely:lonely.length,gauntlet,aerodromo:aero,secondChanceSources:second,championSourceFinals:champion,
  missingRouteIds:missingRoutes,aliases,protectedTail:count(rows,r=>r.protected),pendingSwissRows:count(swissRows,r=>r.pending),
  candidateOnly:true,officialSlotsWritten:0};
 return report;
}
function snapshot(){const sp=root.rhSpace?.();if(!sp||sp.catalogueKey!=='fh5-catalogue-v1'||!Array.isArray(sp.cars))throw Error('Select live FH5 Catalogue Space.');
 const p=root.TET2AssembledList379?.snapshot?.();return inspect(sp.cars,p,root.TET2R1StageInventory366,root.TET2OpeningCoverage365);
}
function html(){try{const d=snapshot();const passed=d.structuralPass;
 const numbers=[['Preview visits',d.visits],['Competition identities',d.competitions],['Opening formats',d.opening],['Structural conflicts',d.problems.length]];
 return `<div class="t2-a388"><p class="t2-a388-status ${passed?'pass':'fail'}">${passed?'✓ CANDIDATE STRUCTURE VERIFIED':'⛔ STRUCTURAL AUDIT FAILED'} · ${d.launchReady?'READY':'OFFICIAL START LOCKED'}</p><div class="t2-a388-metrics">${numbers.map(([k,v])=>`<div><strong>${Number(v).toLocaleString('en-GB')}</strong><small>${E(k)}</small></div>`).join('')}</div>
 <p>${E(d.owned)} owned FH5 cars · ${d.swissCups} Swiss Cups · ${d.gauntlet} Gauntlet visits · ${d.aerodromo} Double-Headers · ${d.historicalBronze} historical bronze-duel additions.</p>
 <details><summary>Remaining prelaunch requirements (${d.gates.filter(g=>g.blocked).length})</summary><ul>${d.gates.filter(g=>g.blocked).map(g=>`<li>${E(g.text)}</li>`).join('')}</ul></details>
 ${d.problems.length?`<p class="t2-a388-fail">${d.problems.slice(0,4).map(E).join(' · ')}</p>`:''}<p class="t2-a388-foot">SOURCE-BASED SCHEDULE INSPECTION ONLY. No new slots, draws, results, honours, backup operations or Garage modifications.</p></div>`;
 }catch(err){return `<div class="t2-a388" role="alert">⛔ LAUNCH AUDIT UNAVAILABLE — OFFICIAL START LOCKED. ${E(err.message)}</div>`;}}
return Object.freeze({inspect,snapshot,html});
});
