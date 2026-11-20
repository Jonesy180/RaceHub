/* TET2 v8.0.367 — approved competition registration reconciliation against actual FH5 owned Garage.
 * READ ONLY. No invented slot counts, entrants, official schedule or racing results.
 * No private Garage objects, IDs or owned lists are bundled in the distributed app.
 */
(function(root,factory){'use strict';const api=factory();root.TET2CompetitionAudit367=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const str=s=>String(s??'').trim();
 function idFor(s){return str(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]+/g,'-').replace(/^-|-$/g,'');}
 function uidFor(s){let h=2166136261>>>0;for(const c of str(s)){h^=c.codePointAt(0);h=Math.imul(h,16777619)>>>0;}return idFor(s)+'-'+h.toString(36).toUpperCase();}
 function verifyGarage(cars){
  if(!Array.isArray(cars)||!cars.length||cars.length>10000)throw Error('A valid live FH5 Garage is required');
  const ids=new Set(),out=[];
  for(const c of cars){const id=str(c?.id),make=str(c?.make),type=str(c?.classType||c?.class_type||c?.type||'');
   if(!id||ids.has(id)||!make)throw Error('Live Garage has missing / duplicated car IDs or manufacturer');
   ids.add(id);out.push({id,make,type});
  }
  return out;
 }
 function liveGarage(){
  const s=typeof window.rhSpace==='function'?window.rhSpace():null;
  if(!s||s.catalogueKey!=='fh5-catalogue-v1'||!Array.isArray(s.cars))throw Error('Select your live FH5 Catalogue Space first');
  return s.cars;
 }
 function reg(id,title,family,details,status='WORKLOAD PENDING',kind='independent'){
  return {id,title,family,details,status,kind};
 }
 function compile(rawCars,source=(typeof window!=='undefined'?window.TET2R1StageInventory366:null)){
  const cars=verifyGarage(rawCars);
  if(!source||!Array.isArray(source.events)||!Array.isArray(source.visits))throw Error('Historical source inventory missing');
  if(source.events.length!==214||source.visits.length!==1128)throw Error('Unexpected R1 source inventory; halt instead of inventing competitions');
  const byMake=new Map(),byType=new Map();
  for(const car of cars){const m=byMake.get(car.make)||[];m.push(car);byMake.set(car.make,m);
   if(car.type){const t=byType.get(car.type)||[];t.push(car);byType.set(car.type,t);}}
  const makers=[...byMake].sort((a,b)=>a[0].localeCompare(b[0]));
  const types=[...byType].sort((a,b)=>a[0].localeCompare(b[0]));
  const multi=makers.filter(([,list])=>list.length>=2),relayMakers=makers.filter(([,list])=>list.length>=3);
  const lonely=makers.filter(([,list])=>list.length<3),gauntletTypes=types.filter(([,list])=>list.length>=2);
  const driftTypes=types.filter(([name])=>idFor(name)==='DRIFT-CARS');const driftCount=driftTypes.reduce((n,[,list])=>n+list.length,0);
  const legacyMakes=source.events.filter(e=>e[3]==='Manufacturer'&&e[2]==='Race Off');
  // Historical maker Race Offs are specifically NORMAL/other subsets. They are
  // NOT equivalent to the full-manufacturer winners required by the final.
  const historicalFullMakerRaces=legacyMakes.filter(e=>!(/Normal|Race Cars|Off.Road|Forza/i.test(e[1])));
  if(historicalFullMakerRaces.length)throw Error('Historical whole-maker Race Off mapping needs explicit review');
  const r=[];
  r.push(reg('T2-FESTIVAL-TOP3','Festival Top 3 / Open Event','Festival','Opening specialist registration; stage workload to be joined to the native Festival engine.'));
  r.push(reg('T2-SWISS-CUP','Swiss Cup','Swiss','16 cars per Cup · Swiss rounds return on future Evil List slots · knockout endgame with bronze duel. Exact cup count and stage placements pending.'));
  r.push(reg('T2-RELAY-MIXED','Mixed Relay Championship','Relay',`Three different manufacturers per team · one use per car in this championship · at most ${Math.floor(cars.length/3)} full teams from the current Garage.`, 'WORKLOAD PENDING'));
  r.push(reg('T2-RELAY-MAKER','Manufacturer Relay Championship','Relay',`${relayMakers.length} current eligible manufacturers (at least 3 owned cars), one 3-car team per maker.`, 'WORKLOAD PENDING'));
  for(const [make,field] of multi)r.push(reg(`T2-MAKER-RO-${uidFor(make)}`,`${make} · Full Manufacturer Race Off`,'Manufacturer Race Off',`${field.length} owned ${make} cars · required as representative-decider for Champion of Champions. Not the old subset-only Normal Race Off.`, 'WORKLOAD PENDING'));
  for(const [make,field] of multi)r.push(reg(`T2-GAUNTLET-MAKE-${uidFor(make)}`,`${make} · Manufacturer Gauntlet`,'Gauntlet',`${field.length} eligible ${make} cars, subject to native Gauntlet stage allocation.`, 'WORKLOAD PENDING'));
  for(const [type,field] of gauntletTypes)r.push(reg(`T2-GAUNTLET-TYPE-${uidFor(type)}`,`${type} · Type Gauntlet`,'Gauntlet',`${field.length} currently owned cars in this type, subject to native Gauntlet stage allocation.`, 'WORKLOAD PENDING'));
  r.push(reg('T2-LONELY-HEARTS','Lonely Hearts Cup','Lonely Hearts',`${lonely.length} manufacturers with fewer than 3 cars · ${lonely.reduce((n,[,list])=>n+list.length,0)} eligible cars at current Garage snapshot. Knockout; future-stage workload pending.`));
  r.push(reg('T2-DRIFT-22','Drift Car Championship','Drift',`${driftCount} owned Drift Cars · established Class/Type 22-car championship (when Garage field remains 22) · NOT Drift Knockout and NOT Drift Zone Score.`));
  r.push(reg('T2-SECOND-CHANCE','Second Chance Cup','Final Battles','Qualifiers only from eligible bronze-medal duel winners of full Manufacturer Race Off or Lonely Hearts knockout events with 4+ entrants. No 16-car cap.','DEFERRED — REAL QUALIFIERS','dependent'));
  r.push(reg('T2-CHAMPION-FINAL','Champion of Champions','Final Battles',`${makers.length} manufacturers: ${makers.filter(([,a])=>a.length===1).length} single-car makers auto-qualify; each multi-car maker requires its full Manufacturer Race Off winner. Must be final tournament competition.`, 'DEFERRED — FINAL SLOT','dependent'));
  const aliasCounts=new Map();for(const [name] of makers){const k=idFor(name);aliasCounts.set(k,(aliasCounts.get(k)||0)+1);}
  const ambiguousMakerAliases=[...aliasCounts.values()].filter(n=>n>1).length;
  const ids=r.map(x=>x.id);
  if(new Set(ids).size!==ids.length)throw Error('Duplicate current Garage manufacturer or type registration ID');
  const histIds=new Set(source.events.map(x=>x[0]));if(ids.some(x=>histIds.has(x)))throw Error('New registrations collided with historical event IDs');
  const families=[...new Set(r.map(x=>x.family))].sort();
  const independent=r.filter(x=>x.kind!=='dependent');
  const summary={owned:cars.length,manufacturers:makers.length,ambiguousMakerAliases,types:types.length,unclassifiedTypes:cars.filter(c=>!c.type).length,
   makerTwoPlus:multi.length,makerThreePlus:relayMakers.length,lonelyMakes:lonely.length,lonelyCars:lonely.reduce((n,[,list])=>n+list.length,0),driftCars:driftCount,
   fullMakerRaceoffs:multi.length,sourceMakerNormalRaceoffs:legacyMakes.length,gauntletMaker:multi.length,gauntletType:gauntletTypes.length,
   mixedTeamUpperBound:Math.floor(cars.length/3),mixedLeftoverLowerBound:cars.length%3,
   registrations:r.length,independentRegistrations:independent.length,dependentFinals:r.length-independent.length,
   historicalEvents:source.events.length,historicalVisits:source.visits.length,aeroBatches:Math.ceil(cars.length/16),
   openingFormats:(typeof window!=='undefined'?window.TET2OpeningCoverage365?.formats?.length:12)||12};
  if(summary.dependentFinals!==2||summary.historicalEvents!==214||summary.historicalVisits!==1128||summary.aeroBatches*16<cars.length)throw Error('Competition registry invariant failed');
  if(!r.some(x=>x.id==='T2-DRIFT-22')||r.some(x=>/Drift Zone Score|Drift Knockout/i.test(x.title)))throw Error('Drift registry has a retired format');
  return {summary,registrations:r,families};
 }
 let filter='',page=0,lastSignature='',last=null;
 function snapshot(){const g=liveGarage(),signature=g.map(c=>`${str(c?.id)}:${str(c?.make)}:${str(c?.classType)}`).join('|');if(!last||lastSignature!==signature){last=compile(g);lastSignature=signature;page=0;}return last;}
 function listHTML(d){const q=filter.trim().toLowerCase(),a=d.registrations.filter(x=>!q||[x.title,x.family,x.details,x.id].join(' ').toLowerCase().includes(q)),pages=Math.max(1,Math.ceil(a.length/25));page=Math.max(0,Math.min(page,pages-1));
  const view=a.slice(page*25,page*25+25);
  return {body:view.length?view.map(x=>`<li class="t2-plan-row"><span class="t2-plan-id">${x.kind==='dependent'?'FINAL / DEPENDENT':'COMPETITION REGISTRATION'}</span><span class="t2-plan-name">${esc(x.title)}</span><span class="t2-plan-meta">${esc(x.family)} · ${esc(x.status)}</span><span class="t2-plan-sub">${esc(x.details)}</span></li>`).join(''):'<p class="t2-empty">No matching competitions registered.</p>',count:`${a.length} matching registrations · showing ${a.length?page*25+1:0}–${Math.min(a.length,(page+1)*25)}`,pager:`<button type="button" data-t2-coverage="prev" ${page===0?'disabled':''}>◀ Previous</button><span>Page ${page+1} / ${pages}</span><button type="button" data-t2-coverage="next" ${page===pages-1?'disabled':''}>Next ▶</button>`};}
 function html(){try{const d=snapshot(),s=d.summary,v=listHTML(d);return `<p class="t2-plan-warning"><strong>APPROVED COMPETITION REGISTRY — NOT PLAYABLE SLOTS.</strong><br>Reconciled against your <strong>live FH5 Garage</strong> and the 214 retained historical competitions. The additions below are real format/eligibility registrations; their final round and slot workloads are <strong>not being invented</strong>.</p>
 <div class="t2-plan-stats"><span><b>${s.owned}</b><small>Live owned FH5 cars</small></span><span><b>${s.manufacturers}</b><small>Manufacturers</small></span><span><b>${s.independentRegistrations}</b><small>Added competition registrations</small></span><span><b>${s.dependentFinals}</b><small>Finals held back</small></span></div>
 <p class="t2-plan-foot"><strong>Live field reconciliation:</strong> ${s.makerThreePlus} manufacturer Relay teams; up to ${s.mixedTeamUpperBound} Mixed Relay teams (eligibility draw to verify); ${s.gauntletMaker} maker Gauntlets; ${s.gauntletType} type Gauntlets; ${s.lonelyMakes} Lonely Hearts manufacturers (${s.lonelyCars} cars); ${s.driftCars} Drift Cars; ${s.aeroBatches} combined Drag + Long Jump batches.</p>
 ${s.ambiguousMakerAliases?`<p class="t2-plan-warning">${s.ambiguousMakerAliases} manufacturer labels differ only by letter case/spelling. Kept separate to match the Garage; these identities must be reconciled before Champion qualifications are frozen.</p>`:''}
 <p class="t2-plan-foot"><strong>Champion qualification safeguard:</strong> ${s.makerTwoPlus} multi-car manufacturers require a <em>full-manufacturer</em> Race Off winner. The ${s.sourceMakerNormalRaceoffs} historical <em>Normal</em> manufacturer Race Off events cannot automatically substitute for these. Single-car makers qualify automatically.</p>
 ${s.unclassifiedTypes?`<p class="t2-plan-warning">${s.unclassifiedTypes} owned cars have no car-type classification available; Type Gauntlet eligibility is incomplete.</p>`:''}
 <p class="t2-plan-foot"><strong>Opening audit:</strong> All ${s.openingFormats} approved independently runnable formats still belong in a randomly shuffled opening; Second Chance and Champion of Champions stay deferred. Exact future-stage workloads need validated engines before these registrations become dated Evil List slots.</p>
 <label class="t2-coverage-search">Find additional competition<input id="t2-coverage-query" type="search" placeholder="BMW, Swiss, Relay…" value="${esc(filter)}" autocomplete="off"></label>
 <p class="t2-plan-count" id="t2-coverage-count">${v.count}</p><ol class="t2-plan-list" id="t2-coverage-list">${v.body}</ol><div class="t2-plan-pager" id="t2-coverage-pager">${v.pager}</div>
 <p class="t2-plan-foot">These registrations supplement — they do not overwrite — the historical 1,128 visits or the Aeródromo batches below. No Garage IDs, car lists, results, schedules or tournament locks are uploaded by this audit.</p>`;}catch(e){return `<div class="t2-plan-warning" role="alert">Live competition reconciliation unavailable: ${esc(e.message)}</div>`;}}
 function refresh(){try{const d=snapshot(),v=listHTML(d),l=document.getElementById('t2-coverage-list'),c=document.getElementById('t2-coverage-count'),p=document.getElementById('t2-coverage-pager');if(l&&c&&p){l.innerHTML=v.body;c.textContent=v.count;p.innerHTML=v.pager;}}catch(_){}}
 function action(e){const b=e.target?.closest?.('[data-t2-coverage]');if(!b)return false;page+=b.dataset.t2Coverage==='next'?1:-1;refresh();return true;}
 function input(e){if(e.target?.id!=='t2-coverage-query')return false;filter=str(e.target.value).slice(0,100);page=0;refresh();return true;}
 return Object.freeze({compile,html,input,action});
});
