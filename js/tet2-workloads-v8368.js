/* TET2 v8.0.368 — source-backed READ-ONLY workload derivation.
   Does not create a draw, slot, race, result, qualification, or honour.
   Uses the active live FH5 Space and the preserved/native pure rules module.
 */
(function(root,factory){'use strict';const api=factory();root.TET2Workloads368=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const norm=v=>String(v??'').trim();
const MAX_PAIRINGS=8, AERO_BATCH=16, RELAY_GROUP_MAX=4;
function fullMakerRaceOff(n){
 if(!Number.isSafeInteger(n)||n<2||n>10000)throw Error('Invalid full-manufacturer Race Off field');
 const bracketSize=2**Math.ceil(Math.log2(n)),byes=bracketSize-n,stages=[];
 let stageField=bracketSize,matches=n-bracketSize/2;
 const push=(title,count)=>{
  if(!Number.isSafeInteger(count)||count<1)throw Error('Invalid knockout match stage');
  stages.push({name:title,matches:count,slots:Math.ceil(count/MAX_PAIRINGS)});
 };
 push(n===2?'Final':(n===3?'Three-car play-in':(stageField===4?'Semifinals':'Round of '+stageField)),matches);
 stageField/=2;
 while(stageField>=2){
  matches=stageField/2;
  if(stageField===2 && n>=4)push('Bronze-medal duel (before final)',1);
  push(stageField===2?'Final':stageField===4?'Semifinals':stageField===8?'Quarterfinals':'Round of '+stageField,matches);
  stageField/=2;
 }
 const slots=stages.reduce((a,r)=>a+r.slots,0),matchesTotal=stages.reduce((a,r)=>a+r.matches,0);
 if(matchesTotal!==n-1+(n>=4?1:0))throw Error('Race Off progression invariant failed');
 if(n>=4&&stages.at(-2)?.name!=='Bronze-medal duel (before final)')throw Error('Bronze medal must precede final');
 if(stages.some(x=>x.slots<1||x.slots>Math.ceil(x.matches/8)))throw Error('Pairings/slot workload invariant');
 return {entrants:n,bracketSize,byes,stages,slots,matches:matchesTotal,threeCarSpecial:n===3};
}
function relayGroupSizes(n){
 if(!Number.isSafeInteger(n)||n<2||n>2000)throw Error('Invalid relay team count');
 const groupCount=Math.ceil(n/RELAY_GROUP_MAX),q=Math.floor(n/groupCount),r=n%groupCount;
 const sizes=Array.from({length:groupCount},(_,i)=>q+(i<r?1:0));
 if(sizes.some(x=>x<2||x>4)||sizes.reduce((a,b)=>a+b,0)!==n)throw Error('Relay group packing mismatch');
 return sizes;
}
function relayLadder(n){
 let teams=n;const rounds=[];
 for(let round=1;round<=12;round++){
  const sizes=relayGroupSizes(teams),final=sizes.length===1;
  rounds.push({round,teams,groups:sizes.length,sizes,kind:final?'Final':'Qualifying',attempts:teams*3});
  if(final)break;
  teams=sizes.length;
 }
 if(rounds.at(-1)?.kind!=='Final')throw Error('Relay final not reached');
 return {openingTeams:n,rounds,groupCards:rounds.reduce((a,r)=>a+r.groups,0),teamLegAttempts:rounds.reduce((a,r)=>a+r.attempts,0)};
}
function liveGarage(){
 const sp=typeof window.rhSpace==='function'?window.rhSpace():null;
 if(!sp||sp.catalogueKey!=='fh5-catalogue-v1'||!Array.isArray(sp.cars))throw Error('Open the live FH5 Catalogue Space first');
 return sp.cars;
}
function compile(cars,source,ruleEngine){
 if(!ruleEngine||typeof ruleEngine.drawMakerRelay!=='function'||typeof ruleEngine.drawMixedRelay!=='function')throw Error('Established relay rules engine is missing; cannot guess teams');
 if(!windowOrNodeAudit(source))throw Error('Approved competition audit/source unavailable');
 // Run the previous audit first: it enforces unique car IDs, source inventory count and non-overlapping registrations.
 const a=globalAudit().compile(cars,source),base=a.summary;
 const counts=new Map(),types=new Map();
 for(const c of cars){const make=norm(c?.make),typ=norm(c?.classType||c?.class_type||c?.type||'');
  counts.set(make,(counts.get(make)||0)+1);if(typ)types.set(typ,(types.get(typ)||0)+1);
 }
 const makers=[...counts].filter(([,n])=>n>=2).sort((a,b)=>a[0].localeCompare(b[0]));
 const makerRows=makers.map(([name,n])=>({name,count:n,...fullMakerRaceOff(n)}));
 const makerMatches=makerRows.reduce((x,y)=>x+y.matches,0),makerVisits=makerRows.reduce((x,y)=>x+y.slots,0);
 // The pure v8.0.181 draw module is read-only. Its seeded team totals are a *planning snapshot*;
 // entrant identity and late additions are not frozen or saved by this function.
 const owned=cars.map(c=>({id:norm(c.id),make:norm(c.make),name:norm(c.name),type:norm(c.classType)}));
 const makerTeams=ruleEngine.drawMakerRelay(owned,181),mixed=ruleEngine.drawMixedRelay(owned,181);
 if(makerTeams.length!==base.makerThreePlus||mixed.leftovers.length+3*mixed.teams.length!==cars.length)throw Error('Native relay eligibility mismatch');
 const makerLadder=relayLadder(makerTeams.length),mixedLadder=relayLadder(mixed.teams.length);
 const distinct=new Set(mixed.teams.flatMap(t=>t.cars.map(c=>c.id)));
 if(distinct.size!==mixed.teams.length*3||mixed.teams.some(t=>new Set(t.cars.map(c=>c.make)).size!==3))throw Error('Mixed Relay has duplicate or invalid car use');
 const relayCards=makerLadder.groupCards+mixedLadder.groupCards;
 const gMake=makers.map(([name,n])=>({kind:'Manufacturer',name,cars:n,attempts:n*3,minVisits:1,scenarioEightCarVisits:Math.ceil(n/8)}));
 const gType=[...types].filter(([,n])=>n>=2).sort((a,b)=>a[0].localeCompare(b[0])).map(([name,n])=>({kind:'Type',name,cars:n,attempts:n*3,minVisits:1,scenarioEightCarVisits:Math.ceil(n/8)}));
 const gAll=[...gMake,...gType];
 if(gMake.length!==base.gauntletMaker||gType.length!==base.gauntletType)throw Error('Gauntlet registration mismatch');
 const gAttempts=gAll.reduce((s,x)=>s+x.attempts,0),gMin=gAll.length,gEight=gAll.reduce((s,x)=>s+x.scenarioEightCarVisits,0);
 // The subtotal is intentionally NOT the final number of slots: historical stages are unvalidated against current rules;
 // multiple eligible competition families and endgames have unallocated work, and the draw is not locked.
 const sourceVisits=source.visits.length,aero=Math.ceil(cars.length/AERO_BATCH);
 const subtotal=sourceVisits+aero+makerVisits+relayCards;
 return {summary:{owned:cars.length,manufacturers:counts.size,historical:sourceVisits,aero,makerEvents:makerRows.length,makerVisits,makerMatches,relayCards,subtotal,
   makerTeams:makerTeams.length,mixedTeams:mixed.teams.length,mixedUnused:mixed.leftovers.length,
   makerRelayCards:makerLadder.groupCards,mixedRelayCards:mixedLadder.groupCards,
   gauntletRegistrations:gAll.length,gauntletAttempts:gAttempts,gauntletMin:gMin,gauntletEight:gEight,
   aliasWarnings:base.ambiguousMakerAliases,threeCarKnockouts:makerRows.filter(x=>x.threeCarSpecial).length,
   historicalEvents:source.events.length,driftCars:base.driftCars,lonelyMakers:base.lonelyMakes,lonelyCars:base.lonelyCars},
   makerRows,gauntletRows:gAll,relay:{maker:makerLadder,mixed:mixedLadder},warnings:[
   'Historical 1,128 visits are preserved references, not confirmed current competition stages.',
   'Gauntlet slot grouping remains unapproved: three route attempts/car are verified, but one or more slots per field is unresolved.',
   'Swiss Cup count and stage spacing, Lonely Hearts field and rounds, Drift Championship, other specialist work, and the two dependent finals still need allocations.',
   ...(base.ambiguousMakerAliases?['Manufacturer labels that differ only by case/spelling must be reconciled before qualifications freeze.']:[]),
   ...(makerRows.some(x=>x.threeCarSpecial)?['Three-car knockout fields need a final bronze/placement policy check; two match visits are provisional for each.']:[])
   ]};
}
function globalAudit(){return typeof window==='undefined'?globalThis.TET2CompetitionAudit367:window.TET2CompetitionAudit367;}
function windowOrNodeAudit(source){return !!globalAudit()?.compile&&!!source?.events&&!!source?.visits;}
let query='',kind='all',page=0,last=null,lastSignature='';
function snapshot(){const c=liveGarage(),signature=c.map(x=>norm(x.id)+':'+norm(x.make)+':'+norm(x.classType)).join('|');if(!last||signature!==lastSignature){last=compile(c,window.TET2R1StageInventory366,window.rhEvil2Rules181);lastSignature=signature;page=0;}return last;}
function filteredRows(d){const q=query.trim().toLowerCase();return (kind==='gauntlets'?d.gauntletRows:kind==='makers'?d.makerRows:[...d.makerRows,...d.gauntletRows]).filter(x=>!q||[x.name,x.kind||'Full maker Race Off'].join(' ').toLowerCase().includes(q));}
function cards(d){const r=filteredRows(d),nPages=Math.max(1,Math.ceil(r.length/20));page=Math.max(0,Math.min(page,nPages-1));
 const subset=r.slice(page*20,page*20+20);return {count:r.length,pages:nPages,view:subset.map(x=>{
 if(x.stages)return `<li class="t2-plan-row"><span class="t2-plan-id">FULL MANUFACTURER RACE OFF</span><span class="t2-plan-name">${esc(x.name)}</span><span class="t2-plan-meta">${x.count} cars · ${x.matches} matches · ${x.slots} planned slot visits · ${x.byes} bye(s)</span><span class="t2-plan-sub">${esc(x.stages.map(s=>s.name+': '+s.matches+' match'+(s.matches===1?'':'es')+' / '+s.slots+' slot'+(s.slots===1?'':'s')).join(' • '))}${x.threeCarSpecial?' · 3-car placement rule under review':''}</span></li>`;
 return `<li class="t2-plan-row"><span class="t2-plan-id">${esc(x.kind.toUpperCase())} GAUNTLET · ALLOCATION PENDING</span><span class="t2-plan-name">${esc(x.name)}</span><span class="t2-plan-meta">${x.cars} cars · ${x.attempts} stage-time entries (3 per car)</span><span class="t2-plan-sub">At least 1 competition visit; ${x.scenarioEightCarVisits} if drawing up to 8 cars per slot (scenario ONLY, not locked).</span></li>`;
 }).join('')||'<p class="t2-empty">No workload matches.</p>'};}
function html(){try{const d=snapshot(),s=d.summary,c=cards(d);return `<p class="t2-plan-warning"><strong>READ-ONLY STAGE WORKLOAD MODEL — NOT OFFICIAL SLOTS.</strong><br>Calculated against this phone’s live FH5 Garage and the existing Race Off / Relay / Gauntlet engines. No entrants or results are frozen. The subtotal below is not a final Evil List length.</p>
 <div class="t2-plan-stats t2-load-stats"><span><b>${s.historical}</b><small>Old source-stage visits (review pending)</small></span><span><b>${s.aero}</b><small>Aeródromo batches of 16</small></span><span><b>${s.makerVisits}</b><small>Full-maker Race Off slot visits*</small></span><span><b>${s.relayCards}</b><small>Relay group visits (native model)*</small></span></div>
 <p class="t2-load-subtotal"><strong>${s.subtotal.toLocaleString()}</strong> modelled visits in these four blocks — <em>NOT a final tournament total</em>.</p>
 <p class="t2-plan-foot">*Race Off: ${s.makerEvents} full-manufacturer competitions, ${s.makerMatches} knockout/bronze matches, up to ${MAX_PAIRINGS} pairings per scheduled slot; later rounds cannot be drawn early. Relay: ${s.makerTeams} Manufacturer teams → ${s.makerRelayCards} group visits; ${s.mixedTeams} Mixed teams → ${s.mixedRelayCards} group visits (${s.mixedUnused} cars unassigned in this seeded planning snapshot). Each Relay group uses 3 legs/team and advances one winner.</p>
 <div class="t2-plan-stats t2-load-stats"><span><b>${s.gauntletRegistrations}</b><small>Registered maker/type Gauntlets</small></span><span><b>${s.gauntletAttempts.toLocaleString()}</b><small>Gauntlet timed attempts (3/car/field)</small></span><span><b>${s.gauntletMin}–${s.gauntletEight}</b><small>Gauntlet visit range: whole field / 8-car scenario — NOT LOCKED</small></span><span><b>${s.threeCarKnockouts}</b><small>3-car maker knockouts needing medal-policy review</small></span></div>
 <p class="t2-plan-foot">Gauntlet visits are deliberately <strong>excluded from the subtotal</strong> until their per-slot group size is fixed. The native Gauntlet engine already verifies three routes per car; the cards below let you inspect each field without inventing a schedule.</p>
 <div class="t2-load-list"><h3>Detailed stage workloads</h3><div class="t2-plan-controls"><label>Find manufacturer or type<input id="t2-load-query" type="search" placeholder="BMW, Ferrari, Drift Cars…" value="${esc(query)}" autocomplete="off"></label><label>Workload family<select id="t2-load-family"><option value="all" ${kind==='all'?'selected':''}>All calculated</option><option value="makers" ${kind==='makers'?'selected':''}>Full Race Off</option><option value="gauntlets" ${kind==='gauntlets'?'selected':''}>Gauntlets</option></select></label></div><p class="t2-plan-count" id="t2-load-count">${c.count} calculations · page ${page+1} of ${c.pages}</p><ol class="t2-plan-list" id="t2-load-list">${c.view}</ol><div class="t2-plan-pager" id="t2-load-pager"><button data-t2-load="prev" type="button" ${page===0?'disabled':''}>◀ Previous</button><span>Page ${page+1} / ${c.pages}</span><button data-t2-load="next" type="button" ${page===c.pages-1?'disabled':''}>Next ▶</button></div></div>
 <details class="t2-load-warnings"><summary>Still to allocate — no made-up slots</summary><ul>${d.warnings.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p>Second Chance Cup keeps all eligible bronze-duel qualifiers (no 16-car limit), and Champion of Champions remains the last competition. Both depend on actual results.</p></details>`;
 }catch(e){return `<div class="t2-plan-warning" role="alert">Workload model unavailable; official Evil List remains disabled: ${esc(e.message)}</div>`;}}
function refresh(){try{const d=snapshot(),c=cards(d),p=document.getElementById('t2-load-pager'),n=document.getElementById('t2-load-count'),l=document.getElementById('t2-load-list');if(!p||!n||!l)return;
 l.innerHTML=c.view;n.textContent=`${c.count} calculations · page ${page+1} of ${c.pages}`;p.innerHTML=`<button data-t2-load="prev" type="button" ${page===0?'disabled':''}>◀ Previous</button><span>Page ${page+1} / ${c.pages}</span><button data-t2-load="next" type="button" ${page===c.pages-1?'disabled':''}>Next ▶</button>`;
 }catch(err){const n=document.getElementById('t2-load-count');if(n)n.textContent='Audit calculation unavailable: '+err.message;}}
function action(e){const b=e.target?.closest?.('[data-t2-load]');if(!b)return false;page+=b.dataset.t2Load==='next'?1:-1;refresh();return true;}
function input(e){if(e.target?.id!=='t2-load-query')return false;query=norm(e.target.value).slice(0,100);page=0;refresh();return true;}
function change(e){if(e.target?.id!=='t2-load-family')return false;kind=e.target.value==='makers'||e.target.value==='gauntlets'?e.target.value:'all';page=0;refresh();return true;}
return Object.freeze({fullMakerRaceOff,relayGroupSizes,relayLadder,compile,html,action,input,change});
});
