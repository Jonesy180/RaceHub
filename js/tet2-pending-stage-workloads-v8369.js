/* TET2 v8.0.369 — verified pending family workload planner (READ ONLY).
   Sources inspected in Main v8.0.346:
   otg-gauntlet-v8215.js — one complete field, 3 verified shared routes/car;
   otg-evil2-swiss-native-v8262.js — five source Swiss Cups, each 4 Swiss rounds
   plus quarterfinal, semifinal, final (7 original visits); each 16 entrants.
   Today's TET2 medal rule additionally requires a bronze duel before the final.
   The Lonely Hearts field/pairing policy is NOT approved as a single frozen field;
   show transparent alternative scenarios instead of manufacturing a slot count.
   No write methods. No fabricated results. No locked Evil List generated here.
*/
(function(root,factory){'use strict';const api=factory();root.TET2Pending369=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const SWISS_COUNT=5,SWISS_ENTRANTS=16,SWISS_ROUNDS=4,SWISS_KO=['Quarterfinals','Semifinals','Bronze duel','Final'];
const SWISS_STAGE_MATCHES=[8,8,8,8,4,2,1,1];
const GAUNTLET_BATCH_OPTIONS=[0,8,16];
const fmt=n=>Number(n).toLocaleString('en-GB');
function compute(cars,source,ruleEngine){
 const audit=globalThis.TET2Workloads368;
 if(!audit||typeof audit.compile!=='function'||typeof audit.fullMakerRaceOff!=='function')throw Error('Previous phone-verified workload engine unavailable');
 if(!Array.isArray(cars))throw Error('Live FH5 Garage required');
 const prior=audit.compile(cars,source,ruleEngine),s=prior.summary;
 const names=new Map();for(const car of cars){const m=String(car.make||'').trim();names.set(m,(names.get(m)||0)+1);}
 const lonelyMakes=[...names].filter(([,count])=>count<3),lonelyCars=lonelyMakes.reduce((x,[,n])=>x+n,0);
 if(lonelyMakes.length!==s.lonelyMakers||lonelyCars!==s.lonelyCars)throw Error('Lonely Hearts live field changed during calculation');
 // This engine is an exact stage/card *model* for any given knockout field;
 // it is NOT authority to select one vs two cars per maker.
 const makeField=lonelyMakes.length>=2?audit.fullMakerRaceOff(lonelyMakes.length):null;
 const carField=lonelyCars>=2?audit.fullMakerRaceOff(lonelyCars):null;
 const gauntlets=prior.gauntletRows;
 const gauntletVisits={whole:gauntlets.length,eight:gauntlets.reduce((a,g)=>a+Math.ceil(g.cars/8),0),sixteen:gauntlets.reduce((a,g)=>a+Math.ceil(g.cars/16),0)};
 if(gauntlets.reduce((a,g)=>a+3*g.cars,0)!==s.gauntletAttempts||gauntletVisits.eight!==s.gauntletEight)throw Error('Native Gauntlet stage-workload mismatch');
 // The v8.0.262 source Swiss rounds contain exactly the first 7 stages;
 // the NEW bronze duel is a required, separate proposed slot before the final.
 const swissNativePerCup=7,swissWithDuelPerCup=8;
 if(SWISS_STAGE_MATCHES.length!==swissWithDuelPerCup||SWISS_STAGE_MATCHES.reduce((a,b)=>a+b,0)!==40)throw Error('Swiss knockout workload invariant');
 // No Swiss Cups are present inside the 214-event / 1,128-visit original base.
 const sourceHasSwiss=source.events.some(e=>/Swiss Cup/i.test(String(e[1])));
 if(sourceHasSwiss)throw Error('Swiss overlap with historical base: do not double-count');
 const drift=cars.filter(c=>String(c.classType||c.class_type||c.type||'').trim().toLowerCase()==='drift cars').length;
 if(drift!==s.driftCars)throw Error('Drift Cars classification mismatch');
 const minLonely=makeField?.slots||0,maxLonely=carField?.slots||0;
 return Object.freeze({prior:s,gauntletVisits,lonelyMakers:lonelyMakes.length,lonelyCars,makeField,carField,driftCars:drift,
  swiss:{cups:SWISS_COUNT,entrants:SWISS_ENTRANTS,nativeVisits:SWISS_COUNT*swissNativePerCup,fullVisits:SWISS_COUNT*swissWithDuelPerCup,bronzeExtra:SWISS_COUNT,matches:SWISS_COUNT*40,stages:SWISS_STAGE_MATCHES},
  status:{gauntlet:'BATCH SIZE NOT LOCKED',lonely:'ONE OR TWO CARS PER MAKER UNRESOLVED',swiss:'5 SOURCE CUPS CONFIRMED; BRONZE DUELS REQUIRE BRIDGE',drift:'22-CAR CHAMPIONSHIP: SLOT PLAN UNCONFIRMED'},
  // A calculation convenience for scenarios, NEVER a formal schedule number.
  scenarios:{gauntletMin:s.subtotal+SWISS_COUNT*8+gauntletVisits.whole+minLonely,
   gauntlet8:s.subtotal+SWISS_COUNT*8+gauntletVisits.eight+minLonely,
   gauntlet16:s.subtotal+SWISS_COUNT*8+gauntletVisits.sixteen+minLonely,
   lonelyAllExtra:maxLonely-minLonely},
  blockers:[
   'Gauntlet: current native controller locks a complete field and the same 3 routes for every car. Multi-slot batches require an adapter and approval of the per-slot batch size; they are not native automatically.',
   'Swiss: five historical cups each have 7 source visits. One bronze-duel stage per cup must be added and connected to the native knockout results before medals; 8 visits per cup is a separate-visit planning model.',
   'Lonely Hearts: 68 qualifying manufacturers / 88 cars at the 704-car snapshot; whether one representative or every car enters is not settled. Never choose a field by assumption.',
   'Drift: preserve the existing 22-car Drift Car Championship, not old Drift Knockout or Drift Zone Score. Its TET2 schedule integration is still pending.',
   'Other specialists, source duplicates/overlap, extra Swiss registrations, stage-spaced relays, and the two dependent finals must be reconciled before a final Evil List total.'
  ]});
}
let last=null,lastSignature='',scenario=16;
function snapshot(){const sp=typeof window.rhSpace==='function'?window.rhSpace():null;
 if(!sp||sp.catalogueKey!=='fh5-catalogue-v1'||!Array.isArray(sp.cars))throw Error('Open live FH5 Catalogue Space first');
 const cars=sp.cars,signature=cars.map(c=>String(c.id)+':'+String(c.make)+':'+String(c.classType)).join('|');
 if(!last||signature!==lastSignature){last=compute(cars,window.TET2R1StageInventory366,window.rhEvil2Rules181);lastSignature=signature;}
 return last;
}
function chosen(d){return scenario===8?d.gauntletVisits.eight:scenario===16?d.gauntletVisits.sixteen:d.gauntletVisits.whole;}
function html(){try{const d=snapshot(),s=d.prior,lon=d.makeField?.slots??'—',lonMax=d.carField?.slots??'—';return `
 <p class="t2-next-warning"><strong>READ-ONLY EVIDENCE CHECK.</strong> This section models the remaining independent competition workloads from the retained engines. It does <strong>not</strong> create official slot numbers or alter any racing results.</p>
 <div class="t2-next-kpis"><div><strong>${fmt(d.swiss.cups)}</strong><small>Source Swiss Cups</small></div><div><strong>${fmt(d.lonelyMakers)}</strong><small>Lonely manufacturers</small></div><div><strong>${fmt(d.driftCars)}</strong><small>Owned Drift Cars</small></div><div><strong>${fmt(d.prior.gauntletRegistrations)}</strong><small>Gauntlet fields</small></div></div>
 <div class="t2-next-card"><h3>⚔️ Swiss Cups · verified native source</h3>
 <p>${d.swiss.cups} original 16-car Cups × <strong>7 source visits</strong> = <strong>${d.swiss.nativeVisits}</strong> historical Swiss visits <em>outside</em> the existing ${fmt(s.historical)}-visit donor baseline.</p>
 <p>Each Cup: 4 Swiss rounds (8 pairings each) → quarterfinals (4) → semifinals (2) → <strong>BRONZE DUEL (1)</strong> → final (1). Our modern bronze rule adds one match before the final.</p>
 <p><strong>${d.swiss.fullVisits} planning visits</strong> / ${d.swiss.matches} matches across the five Cups if the bronze duel gets its own visit. New Swiss entries beyond these five are not counted until verified.</p></div>
 <div class="t2-next-card"><h3>🛠️ Gauntlets · live Garage fields</h3>
 <p>${fmt(s.gauntletRegistrations)} maker/type fields, ${fmt(s.gauntletAttempts)} timed results (every car × 3 shared routes). A field remains one competition even if it spans multiple Evil List slots.</p>
 <label class="t2-next-select">Inspect a <em>non-binding</em> slot-packing example<select id="t2-pending-batch"><option value="0" ${scenario===0?'selected':''}>Whole field per slot (native minimum)</option><option value="8" ${scenario===8?'selected':''}>Up to 8 cars per slot (scenario)</option><option value="16" ${scenario===16?'selected':''}>Up to 16 cars per slot (scenario)</option></select></label>
 <div class="t2-next-number"><strong id="t2-pending-visits">${fmt(chosen(d))}</strong><span>modelled Gauntlet slot visits · <strong>NOT LOCKED</strong></span></div>
 <p class="t2-next-muted">Possible range for this Garage: ${fmt(d.gauntletVisits.whole)}–${fmt(d.gauntletVisits.eight)} visits (with the three routes preserved); batches require a new slot bridge to the native field.</p></div>
 <div class="t2-next-card"><h3>💔 Lonely Hearts · field needs final rule</h3>
 <p>${fmt(d.lonelyMakers)} makers with 1–2 cars, ${fmt(d.lonelyCars)} eligible cars. Both figures come from your live FH5 Garage.</p>
 <div class="t2-next-compare"><div><b>One representative per maker</b><strong>${fmt(d.lonelyMakers)} entrants · ${fmt(lon)} visits</strong><small>Scenario only; representative selection not approved.</small></div><div><b>Every eligible car</b><strong>${fmt(d.lonelyCars)} entrants · ${fmt(lonMax)} visits</strong><small>Scenario only; full field not approved.</small></div></div>
 <p>Each scenario follows at most eight head-to-head pairings per slot and requires a bronze duel before its final.</p></div>
 <div class="t2-next-card"><h3>🏁 Drift &amp; dependent finals</h3><p><strong>${fmt(d.driftCars)} Drift Cars</strong> belong to the established Class/Type Drift Car Championship. No revived Drift Zone Score or Drift Knockout.</p>
 <p>Second Chance: genuine eligible bronze-duel winners only, <strong>no 16-car cap</strong>. Champion of Champions: one representative per manufacturer, last competition. Neither can be scheduled from a guessed field.</p></div>
 <div class="t2-next-card t2-next-total"><h3>⚠️ Subtotal model — still incomplete</h3>
 <p>Previously modelled ${fmt(s.subtotal)} visits + ${d.swiss.fullVisits} source-Swiss-with-bronze planning visits + ${fmt(chosen(d))} example Gauntlet visits + ${fmt(lon)} one-per-maker Lonely Hearts scenario =</p>
 <div class="t2-next-number"><strong id="t2-pending-total">${fmt(s.subtotal+d.swiss.fullVisits+chosen(d)+(d.makeField?.slots||0))}</strong><span>illustrative partial workload · <strong>NOT THE EVIL LIST LENGTH</strong></span></div>
 <p class="t2-next-muted">This total assumes separate bronze slots and one Lonely Hearts car per maker. It excludes the unallocated Drift Championship, specialist stages, any additional Swiss cups, dependent finals and source/rule overlaps.</p></div>
 <details class="t2-next-blockers"><summary>Remaining gates before an official Evil List</summary><ol>${d.blockers.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></details>`;
 }catch(e){return `<div class="t2-next-warning" role="alert">Pending-stage audit unavailable: ${esc(e.message)}</div>`;}}
function change(e){if(e.target?.id!=='t2-pending-batch')return false;const n=Number(e.target.value);if(!GAUNTLET_BATCH_OPTIONS.includes(n))return false;scenario=n;
 try{const d=snapshot(),a=document.getElementById('t2-pending-visits'),b=document.getElementById('t2-pending-total');if(a)a.textContent=fmt(chosen(d));if(b)b.textContent=fmt(d.prior.subtotal+d.swiss.fullVisits+chosen(d)+(d.makeField?.slots||0));}catch(_){}return true;}
return Object.freeze({compute,html,change});
});
