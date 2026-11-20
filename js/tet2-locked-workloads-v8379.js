/* TET2 v8.0.379 — LOCKED competition workload reconciliation (READ ONLY).
 * 18 Nov decisions: ONE all-owned-car Gauntlet, 8 cars/Evil List slot,
 * each entrant runs 3 stages; SAME times feed overall, maker, class and type.
 * Manufacturer with exactly ONE car enters one combined Lonely Hearts knockout;
 * TWO cars => own direct manufacturer final, THREE => manufacturer placings;
 * FOUR+ => knockout, separate bronze duel BEFORE final.
 * 19-20 Nov decisions: Drag then Long Jump, 16 cars per Evil List slot;
 * EVERY owned car enters one of the 16-car Swiss Cups, one bronze duel each; Second Chance
 * only real eligible bronze-duel winners, no 16-car cap; Champion is final.
 * This module DOES NOT freeze fields or create official racing slots/results.
 */
(function(root,factory){'use strict';const api=factory();root.TET2LockedWorkloads379=api;root.TET2LockedWorkloads370=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
const GAUNTLET_BATCH=8,AERO_BATCH=16,STAGES=3,SWISS_FIELD=16,SWISS_STAGES=8;
const fmt=n=>Number(n).toLocaleString('en-GB');
const esc=x=>String(x??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function compute(cars,source,ruleEngine){
 if(!Array.isArray(cars)||cars.length===0)throw Error('Requires live owned FH5 cars');
 const prior=globalThis.TET2Workloads368;if(!prior?.compile||!prior?.fullMakerRaceOff)throw Error('Verified base stage model unavailable');
 const original=prior.compile(cars,source,ruleEngine);
 const m=new Map(),type=new Map(),klass=new Map();
 for(const c of cars){const mk=String(c.make||'').trim(),t=String(c.classType||c.class_type||c.type||'').trim(),cl=String(c.performanceClass||c.class||'').trim();
  if(!mk)throw Error('Car has no manufacturer');m.set(mk,(m.get(mk)||0)+1);
  if(t)type.set(t,(type.get(t)||0)+1);if(cl)klass.set(cl,(klass.get(cl)||0)+1);
 }
 const count=n=>[...m.values()].filter(x=>n(x)).length;
 const one=count(x=>x===1),two=count(x=>x===2),three=count(x=>x===3),fourPlus=count(x=>x>=4);
 if(one+two+three+fourPlus!==m.size||one+two!==original.summary.lonelyMakers||one+two*2!==original.summary.lonelyCars)throw Error('Manufacturer cohort classification mismatch');
 // Lonely Hearts is one single-car-maker knockout, NOT makers with 1 or 2 cars.
 const lonely=one>=2?prior.fullMakerRaceOff(one):null;
 const gauntletBatches=Math.ceil(cars.length/GAUNTLET_BATCH);
 const gauntletAttempts=cars.length*STAGES;
 const aeroBatches=Math.ceil(cars.length/AERO_BATCH);
 const swissCups=Math.ceil(cars.length/SWISS_FIELD);
 const swissVisits=swissCups*SWISS_STAGES;
 const s=original.summary;
 if(aeroBatches!==s.aero||s.historical!==1128)throw Error('Historical/Aeródromo baseline changed');
 // Snapshot-based subtotal, not final Evil List count, no source-stage de-dup yet.
 const subtotal=s.historical+aeroBatches+s.makerVisits+s.relayCards+gauntletBatches+swissVisits+(lonely?.slots||0);
 const opening=globalThis.TET2OpeningCoverage365;
 if(!opening||opening.formats.filter(x=>x.id==='gauntlet-unified').length!==1||opening.formats.some(x=>/^gauntlet-(type|manufacturer)$/.test(x.id)))throw Error('Opening still contains superseded Gauntlet formats');
 return Object.freeze({owned:cars.length,manufacturers:m.size,one,two,three,fourPlus,lonelyCars:one,lonely,
  aeroBatches,gauntletBatches,gauntletAttempts,gauntletDistinctCompetitions:1,
  manufacturerKnockouts:s.makerEvents,manufacturerVisits:s.makerVisits,manufacturerMatches:s.makerMatches,
  relayCards:s.relayCards,swissCups,swissVisits,swissOriginalVisits:swissCups*7,
  historicalVisits:s.historical,driftCars:s.driftCars,openingFamilies:opening.formats.length,
  extraOldGauntletRegistrations:s.gauntletRegistrations,extraOldGauntletAttempts:s.gauntletAttempts,
  snapshotSubtotal:subtotal,aliasWarnings:s.aliasWarnings,
  sourceWarnings:['The 1,128 historical donor visits remain reference-only until checked against the new competition rules and double-counting safeguards.',
   'Manufacturer/Type Gauntlet sub-tables are honours derived from the ONE all-car Gauntlet; no extra Gauntlet entries or slots.',
   'Swiss bronze-duel slot per cup is mandatory; the results/medal bridge must still be connected.',
   'The established 22-car Drift Car Championship still needs its exact TET2 schedule bridge.',
   'Dependent Second Chance and Champion of Champions stages remain unallocated until real qualifying results exist; other specialist and overlap checks remain.',
   'Case-variant manufacturer labels must be reconciled without mutating the Garage before champion eligibility freezes.']});
}
let last=null,lastSig='';
function snapshot(){const sp=typeof window.rhSpace==='function'?window.rhSpace():null;
 if(!sp||sp.catalogueKey!=='fh5-catalogue-v1'||!Array.isArray(sp.cars))throw Error('Select the live FH5 Catalogue Space');
 const sig=sp.cars.map(c=>String(c.id)+':'+String(c.make)+':'+String(c.classType)).join('|');
 if(!last||sig!==lastSig){last=compute(sp.cars,window.TET2R1StageInventory366,window.rhEvil2Rules181);lastSig=sig;}return last;}
function html(){try{const d=snapshot(),l=d.lonely;
 return `<p class="t2-c370-notice"><strong>LOCKED RULES RESTORED · READ ONLY</strong><br>Corrected earlier workload examples to match our agreed TET2 competition rules. This is a calculated workload preview, NOT playable slots or a final Evil List.</p>
 <div class="t2-c370-stats"><div><b>${fmt(d.owned)}</b><span>Owned cars (live)</span></div><div><b>${fmt(d.openingFamilies)}</b><span>Random opening families</span></div><div><b>${fmt(d.gauntletBatches)}</b><span>Unified Gauntlet slots</span></div><div><b>${fmt(d.aeroBatches)}</b><span>Drag + Jump batches</span></div></div>
 <div class="t2-c370-card"><h3>🔧 One unified all-car Gauntlet</h3><p><strong>${fmt(d.owned)} cars, ${fmt(d.gauntletBatches)} slot batches of up to 8</strong>, with ${fmt(d.gauntletAttempts)} total timed runs (3 routes per car). Each car appears once.</p><p>One result set feeds the overall, manufacturer, performance-class and car-type standings. <strong>No separate Manufacturer or Type Gauntlet races.</strong> Prior ${fmt(d.extraOldGauntletRegistrations)}-field / ${fmt(d.extraOldGauntletAttempts)}-time scenarios were obsolete, and are removed from this Evil List display.</p></div>
 <div class="t2-c370-card"><h3>💔 Lonely Hearts and manufacturer knockouts</h3><p>Manufacturer field at this snapshot: <strong>${fmt(d.one)} single-car</strong>, ${fmt(d.two)} two-car, ${fmt(d.three)} three-car, ${fmt(d.fourPlus)} four-or-more makers.</p><p>Only the <strong>${fmt(d.one)} single-car manufacturers</strong> contest the combined Lonely Hearts knockout: ${l?fmt(l.matches):'—'} matches including bronze duel, ${l?fmt(l.slots):'—'} staged visits (up to 8 matches per visit). Two-car makers have their own direct final, and three-car makers have their own placements; neither enters this Lonely Hearts field.</p><p>${fmt(d.manufacturerKnockouts)} full-manufacturer competitions, ${fmt(d.manufacturerVisits)} modelled visits. A 4+ car manufacturer's bronze-duel winner may qualify for the later unlimited Second Chance Cup.</p></div>
 <div class="t2-c370-card"><h3>🏁 Remaining verified workloads</h3><div class="t2-c370-lines"><div><span>Historical stage references (not fully validated)</span><strong>${fmt(d.historicalVisits)}</strong></div><div><span>Manufacturer Race Off visits</span><strong>${fmt(d.manufacturerVisits)}</strong></div><div><span>Relay group visits</span><strong>${fmt(d.relayCards)}</strong></div><div><span>Swiss Cup visits incl. bronze (${fmt(d.swissCups)} × 8)</span><strong>${fmt(d.swissVisits)}</strong></div><div><span>Lonely Hearts knockout visits</span><strong>${fmt(l?.slots||0)}</strong></div><div><span>Unified Gauntlet batches (8 cars)</span><strong>${fmt(d.gauntletBatches)}</strong></div><div><span>Aeródromo Double-Header batches (16 cars)</span><strong>${fmt(d.aeroBatches)}</strong></div></div></div>
 <p class="t2-c370-subtotal"><strong>${fmt(d.snapshotSubtotal)}</strong> accounted-for stage visits at this Garage snapshot <em>NOT THE FINAL EVIL LIST LENGTH</em>. Unallocated specialist/Drift/final stages, new late entrants and historic overlap reconciliation remain.</p>
 <details class="t2-c370-open"><summary>Remaining schedule integration gates</summary><ul>${d.sourceWarnings.map(x=>`<li>${esc(x)}</li>`).join('')}${d.aliasWarnings?`<li>${fmt(d.aliasWarnings)} manufacturer case-variant names remain unmerged in Garage snapshot.</li>`:''}</ul></details>`;
 }catch(error){return `<div class="t2-c370-notice" role="alert">Read-only workload report unavailable: ${esc(error.message)}. Official tournament stays disabled.</div>`;}}
return Object.freeze({compute,html,snapshot});
});
