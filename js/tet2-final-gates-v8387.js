/* OTG! MAIN v8.0.387 — TET2 conditional finals, source-verified gate.
 * READ-ONLY: does not publish receipts, start rounds, or amend the Evil List.
 * The current provisional timetable and the isolated official-result bridge are
 * inspected; practice/dummy times never become qualification tickets.
 */
(function(root,factory){'use strict';const api=factory(root);root.TET2FinalGates386=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof window!=='undefined'?window:globalThis,function(root){
'use strict';
const S=x=>String(x??'').trim();
const esc=x=>S(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function fail(s){throw Error('Final battles safe stop: '+s);}
function uniq(list,label){if(new Set(list).size!==list.length)fail(label+' is not unique');}
function snapshotFrom(garage,rows,audit,receipts,engine){
 if(!Array.isArray(garage)||!garage.length||!Array.isArray(rows)||audit?.ok!==true)fail('Live FH5 Garage or candidate timetable not verified');
 if(!engine?.finalBattles||!engine?.knockoutPlan)fail('Native dependent-finals rules engine unavailable');
 const ids=garage.map(c=>S(c.id)),makes=new Map();if(ids.includes(''))fail('Car identity missing');uniq(ids,'Garage car IDs');
 for(const c of garage){const make=S(c.make);if(!make)fail('Manufacturer identity missing');if(!makes.has(make))makes.set(make,[]);makes.get(make).push(S(c.id));}
 const finals=rows.filter(r=>r.origin==='maker-knockout'&&r.championRepresentativeSource&&r.stage==='Final');
 const makerRows=rows.filter(r=>r.origin==='maker-knockout');
 const scSources=rows.filter(r=>r.secondChanceSource&&r.format==='BRONZE'&&['maker-knockout','lonely'].includes(r.origin));
 const sourceIds=scSources.map(r=>r.eventId),makerEvents=new Map();
 uniq(sourceIds,'Second Chance eligible competition sources');
 for(const r of finals){const label=' · Full Manufacturer Race Off';if(!S(r.name).endsWith(label))fail('Champion source is not a full manufacturer Race Off');
  const make=S(r.name).slice(0,-label.length);if(makerEvents.has(make)||!makes.has(make)||makes.get(make).length<2)fail('Duplicate or unmatched manufacturer finale '+make);
  makerEvents.set(make,r.eventId);
 }
 const multi=[...makes].filter(([,cars])=>cars.length>1).map(([make])=>make);
 if(multi.length!==makerEvents.size||multi.some(make=>!makerEvents.has(make)))fail('Not every multi-car manufacturer has exactly one full Race Off finale');
 if(makerRows.some(r=>!finals.some(f=>f.eventId===r.eventId)))fail('Manufacturer event has no finalist source');
 const lonelyRows=rows.filter(r=>r.origin==='lonely');if(lonelyRows.length>0&&new Set(lonelyRows.map(r=>r.eventId)).size!==1)fail('Multiple Lonely Hearts competitions not allowed');
 for(const r of scSources){if(r.origin==='maker-knockout'&&!finals.some(f=>f.eventId===r.eventId))fail('Bronze source not a full-maker competition');if(r.origin==='lonely'&&!lonelyRows.length)fail('Lonely Hearts event missing');}
 const sourceSet=new Set(sourceIds),makerEventById=new Map([...makerEvents].map(([make,id])=>[id,make]));
 if(!Array.isArray(receipts))fail('Official result receipts unavailable');
 const recIds=receipts.map(r=>S(r.eventId));if(recIds.includes(''))fail('Receipt source event ID missing');uniq(recIds,'Official source event IDs');
 // Only the standard isolated honours bridge is allowed to give us verified receipts.
 // Here additionally pin their identity to this exact *full-maker* candidate chain.
 const allowedSource=new Set([...sourceSet,...makerEventById.keys()]);
 const relevant=[];
 for(const r of receipts){if(!['manufacturer-raceoff','lonely-hearts-knockout'].includes(S(r.kind)))continue;
   const id=S(r.eventId);
   if(!allowedSource.has(id))fail('Official receipt does not belong to an approved full-maker/Lonely Hearts source');
   if(r.completed!==true||r.verified!==true||!S(r.proof))fail('Official result receipt not complete or verifiable');
   if(r.kind==='manufacturer-raceoff'&&(makerEventById.get(id)!==S(r.make)))fail('Manufacturer receipt provenance does not match candidate maker event');
   if(r.kind==='lonely-hearts-knockout'&&!lonelyRows.some(row=>row.eventId===id))fail('Wrong Lonely Hearts event source');
   relevant.push(r);
 }
 const result=engine.finalBattles(garage,relevant.filter(r=>sourceSet.has(S(r.eventId))),relevant.filter(r=>r.kind==='manufacturer-raceoff'));
 const qualifiedSources=new Set(relevant.filter(r=>sourceSet.has(S(r.eventId))&&r.bronzeDuelCompleted===true).map(r=>S(r.eventId)));
 const absentSources=sourceIds.filter(id=>!qualifiedSources.has(id));
 const makerCompleted=new Set(relevant.filter(r=>r.kind==='manufacturer-raceoff'&&r.completed===true).map(r=>S(r.make)));
 const absentMakers=multi.filter(make=>!makerCompleted.has(make));
 const lonelyEligible=scSources.some(r=>r.origin==='lonely');
 const secondReady=absentSources.length===0&&result.secondChance.rejections.length===0&&result.secondChance.ready;
 const repsReady=absentMakers.length===0&&result.championOfChampions.pending.length===0&&result.championOfChampions.ready;
 const one=[...makes].filter(([,a])=>a.length===1).length;
 return Object.freeze({
  owned:garage.length,manufacturers:makes.size,singletonMakes:one,multiMakes:multi.length,
  secondChance:{possibleSources:sourceIds.length,verifiedSources:qualifiedSources.size,pendingSources:absentSources.length,
    qualifiedCars:result.secondChance.qualifiers.length,rejected:result.secondChance.rejections.length,
    fieldComplete:secondReady,conditionalPlan:secondReady?result.secondChance.plan:null,
    // An official global tournament lock and schedule builder are still missing.
    canDraw:false},
  champion:{representatives:result.championOfChampions.entrants.length,automatic:one,
    verifiedMakerWinners:makerCompleted.size,pendingMakerFinals:absentMakers.length,expected:makes.size,
    fieldComplete:repsReady,conditionalPlan:repsReady?result.championOfChampions.plan:null,
    canDraw:false},
  candidateVisitCount:rows.length,candidateOnly:true,officialScheduleLocked:false,
  // The champion must follow every other race including all Second Chance rounds.
  sequence:['ALL SOURCE FINALS','SECOND CHANCE CUP','CHAMPION OF CHAMPIONS — LAST']
 });
}
function snapshot(){
 const sp=typeof root.rhSpace==='function'?root.rhSpace():null;
 if(!sp||sp.catalogueKey!=='fh5-catalogue-v1'||!S(sp.id)||!Array.isArray(sp.cars))fail('Real FH5 Catalogue Space not connected');
 const list=root.TET2AssembledList379?.snapshot?.();if(!list?.audit?.ok)fail('Candidate Evil List audit has not passed');
 const honours=root.tet2HonoursBridge358;if(!honours?.results)fail('Isolated official honours bridge missing');
 // results() enforces the full v358 receipt schema, medal uniqueness and
 // semifinal/bronze proof; do not read rehearsal localStorage as a substitute.
 const receipts=honours.results(sp,sp.cars).receipts;
 return snapshotFrom(sp.cars,list.rows,list.audit,receipts,root.tet2FinalBattles356);
}
function planHtml(p){if(!p)return '';const bronze=p.visits.findIndex(x=>x.kind==='bronze-duel'),last=p.visits.length-1;
 if(p.entrantCount>=4&&(bronze<0||bronze!==last-1||p.visits[last]?.round!==p.rounds.length))fail('Knockout final or bronze stage incorrectly ordered');
 return `<p class="t2-f386-small">Once locked: <b>${p.entrantCount}</b> entrants · <b>${p.totalVisits}</b> stage visits · <b>${p.totalMatches}</b> matches including ${p.entrantCount>=4?'bronze duel':'any applicable medals'}. ${p.entrantCount>=4?'Bronze immediately before final.':''}</p>`;
}
function html(){try{const d=snapshot(),s=d.secondChance,c=d.champion;
 return `<section class="t2-f386" aria-label="Final battles qualification gates">
 <h3>🏆 THE FINAL BATTLES</h3>
 <p class="t2-f386-small">The last two competitions are <strong>conditional</strong>. They do not appear as invented slots in the Evil List. Only verified official results can unlock their entrants; rehearsals never qualify.</p>
 <div class="t2-f386-grid"><article><div class="t2-f386-title">🥉 SECOND CHANCE CUP</div><div class="t2-f386-lock">${s.fieldComplete?'🔒 FIELD DERIVED — SCHEDULE NOT LOCKED':'🔒 AWAITING BRONZE DUEL WINNERS'}</div>
 <div class="t2-f386-number">${s.qualifiedCars}<span> verified qualifiers</span></div>
 <p>${s.verifiedSources} / ${s.possibleSources} approved source competitions confirmed · ${s.pendingSources} still awaiting results.</p>
 <p class="t2-f386-small">Only winning bronze duellists from Full Manufacturer Race Offs (4+ cars) and Lonely Hearts (4+ entrants). <strong>No 16-car cap.</strong> Each source contributes at most one eligible car.</p>
 ${s.rejected?`<p class="t2-f386-alert">${s.rejected} source receipt(s) rejected — results must be reviewed.</p>`:''}${planHtml(s.conditionalPlan)}
 <button type="button" disabled aria-label="Second Chance Cup not available until official source results and schedule lock">START SECOND CHANCE · LOCKED</button></article>
 <article><div class="t2-f386-title">👑 CHAMPION OF CHAMPIONS</div><div class="t2-f386-lock">${c.fieldComplete?'🔒 REPRESENTATIVES DERIVED — FINALE LOCKED':'🔒 AWAITING MANUFACTURER CHAMPIONS'}</div>
 <div class="t2-f386-number">${c.representatives}<span> / ${c.expected} representatives</span></div>
 <p>${c.automatic} one-car manufacturers qualify automatically · ${c.verifiedMakerWinners} / ${d.multiMakes} Full Manufacturer Race Off winners confirmed.</p>
 <p class="t2-f386-small">One representative for <strong>every manufacturer</strong>. Makers with 2+ cars require their own full Race Off winner. <strong>This is the last competition of the entire tournament</strong>, after Second Chance is finished.</p>
 ${planHtml(c.conditionalPlan)}
 <button type="button" disabled aria-label="Champion of Champions is the final tournament competition and is not ready">START FINALE · LOCKED</button></article></div>
 <p class="t2-f386-footer">🔒 PRELAUNCH GATE · Read-only examination of official-result bridge + current FH5 Garage. Candidate schedule is not frozen. No draw, result, medal or Garage data has been written.</p>
 </section>`;
 }catch(e){return `<section class="t2-f386" role="alert"><h3>🔒 FINAL BATTLES</h3><p>Read-only safety stop: ${esc(e.message)}</p><p>No finale has been scheduled or activated.</p></section>`;}}
return Object.freeze({snapshot,snapshotFrom,html});
});
