/* OTG! MAIN v8.0.383 — candidate Evil List -> native engine routing.
 * READ ONLY. Never forges verified schedule, locks fields, banks results or
 * starts an official slot. One selected schedule position lives in SESSION ONLY.
 * Explicitly fails closed when source eligibility/stage continuity is unknown.
 */
(function(root,factory){'use strict';const api=factory(root);root.TET2EventRouter375=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof window!=='undefined'?window:globalThis,function(root){
'use strict';
const KEY='tet2CandidateSelectionV8375';
const S=x=>String(x??'').trim();
const E=x=>S(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let selection=null, preview=null;
function fail(msg){throw Error('TET2 schedule safety: '+msg)}
function data(){const snap=root.TET2AssembledList379?.snapshot?.();if(!snap?.audit?.ok||!Array.isArray(snap.rows)||!snap.rows.length)fail('Unverified Evil List. No event can be opened.');const sp=root.rhSpace?.();if(!sp||sp.catalogueKey!=='fh5-catalogue-v1'||!S(sp.id)||!Array.isArray(sp.cars))fail('Real FH5 Garage must be active');if(new Set(sp.cars.map(c=>S(c.id))).size!==sp.cars.length||sp.cars.some(c=>!S(c.id)))fail('Garage identities are invalid');return {snap,space:sp};}
function digest(value){let h=2166136261>>>0;for(const ch of String(value)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}return h.toString(36);}
function stamp(d){const garageSignature=d.space.cars.map(c=>[c.id,c.make,c.classType,c.performanceClass].map(S).join(':')).join('|');
 const scheduleSignature=d.snap.rows.map(r=>[r.eventId,r.visit,r.stage].join(':')).join('|');
 return [S(d.space.id),String(d.snap.audit.owned),String(d.snap.rows.length),S(d.snap.seed),digest(garageSignature),digest(scheduleSignature)].join('|');}
function remember(v){selection=v;preview=null;try{root.sessionStorage?.setItem(KEY,JSON.stringify(v));}catch(_){}}
function restore(){if(selection)return selection;try{const raw=root.sessionStorage?.getItem(KEY);if(raw){const b=JSON.parse(raw);if(b&&Number.isInteger(b.position)&&S(b.stamp))selection=b;}}catch(_){}return selection;}
function select(position){const d=data(),p=Number(position);if(!Number.isSafeInteger(p)||p<1||p>d.snap.rows.length)fail('Preview position is outside the validated Evil List');const row=d.snap.rows[p-1];if(row.position!==p||!S(row.eventId))fail('Schedule position changed');remember({position:p,stamp:stamp(d),eventId:row.eventId,visit:row.visit});return inspect();}
function inspect(position){const d=data();const saved=restore();let pos=position===undefined?(saved?.position||1):Number(position);if(!Number.isInteger(pos)||pos<1||pos>d.snap.rows.length)fail('Invalid planned event');const row=d.snap.rows[pos-1];if(!row||row.position!==pos)fail('Schedule entry missing');
 if(position===undefined&&saved&&(saved.stamp!==stamp(d)||saved.eventId!==row.eventId||saved.visit!==row.visit)){selection=null;preview=null;try{root.sessionStorage?.removeItem(KEY);}catch(_){}fail('Garage or proposed timetable changed. Reselect an event from Evil List before inspecting it.');}
 const prior=d.snap.rows.find(x=>x.eventId===row.eventId&&x.visit===row.visit-1)||null;
 const next=d.snap.rows.find(x=>x.eventId===row.eventId&&x.visit===row.visit+1)||null;
 const native={draw:typeof root.TET2SlotDraw363?.selectFromGarage==='function',entry:typeof root.TET2ResultsEntry360?.openScheduled==='function',ledger:typeof root.TET2SlotLedger361?.prepare==='function',swiss:!!root.rhEvil2Rules181,finals:!!root.tet2FinalBattles356};
 let type='Native format adapter pending',eligible=null,block='Official entry needs a locked result chain, eligible entrants and verified routes.',safePreview=null;
 if(row.origin==='maker-knockout'){
   type='Manufacturer knockout / native Race Off';
   if(!row.name.endsWith(' · Full Manufacturer Race Off'))fail('Manufacturer source identity changed');
   const maker=row.name.slice(0,-' · Full Manufacturer Race Off'.length);
   const set=d.space.cars.filter(c=>S(c.make)===maker);
   if(set.length<2)fail('Full maker source field is no longer eligible');
   eligible={description:maker+' (exact Garage manufacturer name)',count:set.length,ids:set.map(c=>S(c.id))};
   block=row.visit>1?'Await earlier round results and the locked advancing entrants; cannot redraw the whole manufacturer field.':'First stage: verified maker pool; bracket and course still require an official draw lock.';
   // The only source-backed previews with no unallocated byes or speculative
   // winners: a direct 2-car final or first round of a 4/8/16-car field.
   const powers=[2,4,8,16];
   if(row.visit===1&&powers.includes(set.length)&&Number(row.workload)===set.length/2&&row.format==='KNOCKOUT'){
     safePreview={mode:'raceoff',matches:set.length/2,eligibleCarIds:eligible.ids,preview:true};
   }
 }else if(row.origin==='lonely'){
   type='Lonely Hearts / native knockout';const totals=new Map();for(const c of d.space.cars)totals.set(S(c.make),(totals.get(S(c.make))||0)+1);
   const set=d.space.cars.filter(c=>totals.get(S(c.make))===1);eligible={description:'Exactly one owned car per manufacturer',count:set.length,ids:null};
   block='Prelaunch Lonely Hearts knockout below: only single-car manufacturers, byes and verified semifinal losers. Official medals and Second Chance qualifications remain locked.';
 }else if(row.origin==='swiss'){
   type='Swiss Cup / original OTG standings rules';eligible={description:'One 16-car cup drawn from unallocated owned FH5 cars',count:row.pending?Math.min(16,d.space.cars.length%16):16,ids:null};
   block=row.pending?'Final cup is pending a full 16-car field. No phantom drivers or matches.':'Isolated current-visit Swiss draw, four-round wins/opponent-wins/time standings, knockout and separate bronze duel are available below. Official honours stay locked.';
 }else if(row.origin==='relay'){
   type='Native three-leg Relay engine';eligible={description:'Two to four three-car teams in this scheduled group',count:Number(row.workload),ids:null};block='A protected current-group Relay rehearsal is available below. It uses real Garage teams, 3 timed legs and verified group winners. Official visits and honours remain locked.';
 }else if(row.origin==='gauntlet'){
   type='Unified all-car Gauntlet · three track times';eligible={description:'One run per car across the complete event, up to 8 in this batch',count:Math.min(8,Number(row.workload)||8),ids:null};
   block='Current installed native Gauntlet is category-based. Unified three-route batch adapter and no-repeat roster still required.';
 }else if(row.origin==='aerodromo'){
   type='Aeródromo Drag → Long Jump combined adapter';eligible={description:'Up to 16 unused cars, one Drag then one Long Jump per car',count:Math.min(16,Number(row.workload)||16),ids:null};
   block='A protected Drag-first, single-jump prelaunch result bridge is available below. Official slot validation, records and honours remain locked.';
 }else if(row.origin==='historical'){
   type=row.mode==='Race Off'?'Historical Race Off donor':'Historical Festival donor';
   block='Source metadata and current-Garage eligibility comparison are shown below. Source-dependent rehearsal progression uses frozen earlier results; mismatched historical fields remain blocked. No official honours or historical roster substitutions.';
 }else if(row.origin==='drift'){
   type='22-car Drift Cars Championship';block='Drift Cars class/type eligibility and one-visit native championship result mapping need verification.';
 }else if(row.origin==='specialist'){
   type='Festival Top 3 / Open Event';eligible={description:'Three real FH5 Garage cars selected only for this event',count:3,ids:null};block='Isolated Festival Top 3 draw, single-route time banking and provisional podium are available below. This is NOT an official event, record or medal award.';
 }
 if(row.format==='BRONZE')block='Bronze duel requires two VERIFIED losing semifinalists from this same competition. It must happen before the final; no random cars allowed.';
 if(row.origin==='maker-knockout'&&native.draw===false)block='Native Race Off draw engine is missing; cannot preview or lock.';
 return {row,prior,next,native,type,eligible,block,safePreview:safePreview&&native.draw?safePreview:null,preview:preview&&preview.position===pos?preview.draw:null,stamp:stamp(d)};
}
function previewDraw(){const info=inspect();if(!info.safePreview)fail('This stage cannot be drawn safely without frozen eligibility and prior verified results');
 const draw=root.TET2SlotDraw363.selectFromGarage(info.safePreview);
 if(draw.mode!=='raceoff'||draw.matches.length!==info.safePreview.matches)fail('Native preview returned the wrong match count');
 const ids=draw.matches.flatMap(m=>[m.carA.id,m.carB.id]);
 if(new Set(ids).size!==ids.length||ids.some(id=>!info.safePreview.eligibleCarIds.includes(S(id))))fail('Native draw failed its exact eligible-field check');
 preview={position:info.row.position,draw};return draw;
}
function html(){try{
 const x=inspect(),r=x.row;const label=String(r.position).padStart(4,'0');
 const badge=r.opening?' · RANDOM OPENING':'';
 const detail=x.eligible?`<div class="t2-r374-stat"><span>Current eligible pool</span><strong>${E(x.eligible.description)} — ${x.eligible.count} ${r.origin==='relay'?'teams':'cars'}</strong></div>`:'';
 let pairs='';if(x.preview){pairs=`<div class="t2-r374-pairs"><h3>Actual FH5 Garage draw preview · NOT LOCKED</h3>${x.preview.matches.map((m,i)=>`<p><b>${i+1}.</b> ${E(m.carA.name)} <em>vs</em> ${E(m.carB.name)}</p>`).join('')}<p>Preview only. No fixed entrants, track, results, honours or official slot.</p></div>`;}
 return `<div class="t2-r374">
  <div class="t2-r374-head"><span>PLANNED POSITION ${label}${badge}</span><strong>${E(r.name)}</strong><small>${E(r.stage||r.mode)} · ${E(r.family)} · visit ${r.visit} of ${r.visitTotal}</small></div>
  <div class="t2-r374-stat"><span>Connected competition route</span><strong>${E(x.type)}</strong></div>
  ${detail}
  <div class="t2-r374-stat"><span>Previous / next appearance</span><strong>${x.prior?'#'+String(x.prior.position).padStart(4,'0'):'First visit'} → ${x.next?'#'+String(x.next.position).padStart(4,'0'):'Competition finale'}</strong></div>
  <div class="t2-r374-stat"><span>Native modules</span><strong>${x.native.draw&&x.native.entry&&x.native.ledger?'Installed · official schedule gate still closed':'One or more modules unavailable'}</strong></div>
  <div class="t2-r374-note"><b>PRELAUNCH SAFETY LOCK</b><br>${E(x.block)}<br><small>This is a candidate timetable position, not an authorised live slot. No result entry, medal or record can be created from this preview.</small></div>
  ${x.row.origin!=='maker-knockout'&&x.safePreview?`<button type="button" class="t2-btn t2-r374-button" data-t2-router="preview">🎲 PREVIEW THIS STAGE’S ELIGIBLE GARAGE DRAW</button>`:''}
  ${pairs}
  ${root.TET2StageRehearsal375?.html?.(x)||''}
  ${root.TET2UnifiedGauntlet376?.html?.(x)||''}
  ${root.TET2Aerodromo377?.html?.(x)||''}
  ${root.TET2Relay378?.html?.(x)||''}
  ${root.TET2Swiss379?.html?.(x)||''}
  ${root.TET2Lonely380?.html?.(x)||''}
  ${root.TET2FestivalTop3_381?.html?.(x)||''}
  ${x.row.origin==='historical'&&x.row.visit>1?(root.TET2HistoricalProgress383?.html?.(x)||''):(root.TET2Historical382?.html?.(x)||'')}
  <button type="button" class="t2-btn t2-secondary t2-r374-button" data-t2-page="evil">← BACK TO EVIL LIST</button>
 </div>`;
 }catch(err){return `<div class="t2-r374-error" role="alert">${E(err.message)}<p><button type="button" class="t2-btn" data-t2-page="evil">Return to Evil List</button></p></div>`;}}
function action(ev,update){const b=ev.target?.closest?.('[data-t2-router]');if(!b)return false;try{if(b.dataset.t2Router==='preview'){previewDraw();update();}}catch(err){const box=ev.target.closest('.t2-r374');if(box){let error=box.querySelector('.t2-r374-error');if(!error){error=document.createElement('div');error.className='t2-r374-error';error.setAttribute('role','alert');box.append(error);}error.textContent=S(err.message);}}return true;}
return Object.freeze({select,inspect,previewDraw,html,action});
});
