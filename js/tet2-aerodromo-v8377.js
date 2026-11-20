/* OTG! Main v8.0.377 — Aeródromo Double-Header: ONE scheduled visit, TWO
 * independent result streams. This is an isolated, fail-closed PRELAUNCH
 * rehearsal, never an authorised TET2 slot. The native Garage draw and time
 * parser are reused; a custom distance entry is necessary for Long Jump.
 * Frozen random batches: <=16 unique cars, Drag time FIRST for each car,
 * then exactly ONE jump distance for that car. Next batch requires all pairs.
 * NO writes to OTG state, records, honours, garage, or official Evil ledger.
 */
(function(root,factory){'use strict';const api=factory(root);if(root)root.TET2Aerodromo377=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis,function(root){
 'use strict';
 const EVENT_ID='T2-AERODROMO-DOUBLE',SOURCE='TET2_AERODROMO_STAGE_REHEARSAL_8377';
 const PREFIX='tet2.prelaunch.aerodromo-rehearsal.v8377.';
 const S=v=>String(v??'').trim();
 const E=v=>S(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const copy=v=>JSON.parse(JSON.stringify(v));
 const fail=msg=>{throw Error('Aeródromo rehearsal safe stop: '+msg);};
 function space(){const x=root.rhSpace?.();if(!x||x.catalogueKey!=='fh5-catalogue-v1'||!S(x.id)||!Array.isArray(x.cars))fail('Open the original FH5 Catalogue Garage');
  const ids=x.cars.map(c=>S(c?.id));if(!ids.length||ids.some(x=>!x)||new Set(ids).size!==ids.length)fail('Garage contains invalid or repeated car IDs');return x;}
 const key=sp=>PREFIX+encodeURIComponent(S(sp.id));
 function storage(){const x=root.localStorage;if(!x||typeof x.getItem!=='function'||typeof x.setItem!=='function')fail('Isolated local storage unavailable');return x;}
 function read(sp){let raw;try{raw=storage().getItem(key(sp));}catch(_){fail('Cannot read isolated rehearsal data');}
  if(!raw)return {schema:1,source:SOURCE,spaceId:S(sp.id),events:{}};
  let b;try{b=JSON.parse(raw);}catch(_){fail('Saved rehearsal data is damaged; refusing to overwrite');}
  if(!b||b.schema!==1||b.source!==SOURCE||b.spaceId!==S(sp.id)||!b.events||typeof b.events!=='object'||Array.isArray(b.events))fail('Rehearsal data has a different source or Space');return b;}
 function write(sp,b){if(b.source!==SOURCE||b.spaceId!==S(sp.id))fail('Storage namespace mismatch');try{storage().setItem(key(sp),JSON.stringify(b));}catch(_){fail('Isolated result could not be saved');}}
 function context(){const info=root.TET2EventRouter375?.inspect?.();
  if(!info||info.row?.origin!=='aerodromo'||info.row?.eventId!==EVENT_ID||info.row?.format!=='DRAG + JUMP')fail('Select an Aeródromo Double-Header visit from Evil List');
  if(!info.native?.draw||!info.native?.entry||typeof root.TET2ResultsEntry360?.timeMs!=='function')fail('Native draw/time engine is missing');
  const sp=space(),snap=root.TET2AssembledList373?.snapshot?.();if(!snap?.audit?.ok||!Array.isArray(snap.rows))fail('Candidate timetable has not passed its source checks');
  const rows=snap.rows.filter(r=>r.eventId===EVENT_ID).sort((a,b)=>a.visit-b.visit);
  const row=info.row,n=Number(row.workload);
  if(!rows.length||rows.length!==row.visitTotal||!Number.isSafeInteger(n)||n<1||n>16)fail('Aeródromo batch size is invalid');
  if(rows.some((r,i)=>r.visit!==i+1||r.origin!=='aerodromo'||r.format!=='DRAG + JUMP'||!Number.isSafeInteger(Number(r.workload))||Number(r.workload)<1||Number(r.workload)>16))fail('Aeródromo visit lineage is invalid');
  if(rows[row.visit-1]?.position!==row.position||rows.reduce((a,r)=>a+Number(r.workload),0)!==sp.cars.length)fail('Garage count or stage timetable does not match Aeródromo batches');
  const ids=sp.cars.map(c=>S(c.id)),book=read(sp),existing=book.events[EVENT_ID];
  if(existing&&(existing.source!==SOURCE||existing.stamp!==info.stamp||existing.name!==row.name))fail('Garage or timetable changed since draw; saved results are protected');
  const event=existing||{source:SOURCE,stamp:info.stamp,name:row.name,fieldIds:ids,visits:{}};
  if(!Array.isArray(event.fieldIds)||event.fieldIds.length!==ids.length||new Set(event.fieldIds).size!==ids.length||event.fieldIds.some(id=>!ids.includes(id)))fail('Frozen Aeródromo car pool no longer matches live Garage');
  return {info,sp,snap,rows,book,event,cars:new Map(sp.cars.map(c=>[S(c.id),c]))};
 }
 function validate(rec,row,c){if(!rec||rec.position!==row.position||rec.visit!==row.visit||rec.stage!==row.stage||!Array.isArray(rec.carIds)||rec.carIds.length!==Number(row.workload)||new Set(rec.carIds).size!==rec.carIds.length||rec.carIds.some(id=>!c.event.fieldIds.includes(id)))fail('Drawn stage identity or cars are invalid');
  if(!['m','ft'].includes(rec.unit)||!rec.dragMs||!rec.jumpMm||typeof rec.dragMs!=='object'||typeof rec.jumpMm!=='object'||Array.isArray(rec.dragMs)||Array.isArray(rec.jumpMm))fail('Invalid result structure');
  for(const [id,ms] of Object.entries(rec.dragMs))if(!rec.carIds.includes(id)||!Number.isSafeInteger(ms)||ms<=0)fail('Invalid stored Drag time');
  for(const [id,mm] of Object.entries(rec.jumpMm))if(!rec.carIds.includes(id)||!Object.hasOwn(rec.dragMs,id)||!Number.isSafeInteger(mm)||mm<=0)fail('Invalid saved Long Jump distance or missing Drag run');
 }
 const done=rec=>!!rec&&rec.carIds.every(id=>Object.hasOwn(rec.dragMs,id)&&Object.hasOwn(rec.jumpMm,id));
 function getStatus(){const c=context(),r=c.info.row,rec=c.event.visits[r.visit]||null,used=new Set();
  for(const row of c.rows){if(row.visit>r.visit)break;const v=c.event.visits[row.visit];
   if(row.visit<r.visit&&!v)fail('Earlier Double-Header batch '+row.visit+' has not been drawn');
   if(v){validate(v,row,c);for(const id of v.carIds){if(used.has(id))fail('A car was drawn more than once across Aeródromo batches');used.add(id);}
    if(row.visit<r.visit&&!done(v))fail('Finish BOTH Drag and Long Jump for every car in batch '+row.visit+' first');}}
  const available=c.event.fieldIds.filter(id=>!used.has(id));if(!rec&&available.length<Number(r.workload))fail('Insufficient unused cars for this batch');
  const bankedDrag=rec?Object.keys(rec.dragMs).length:0,bankedJump=rec?Object.keys(rec.jumpMm).length:0;
  return {...c,rec,available,required:Number(r.workload),bankedDrag,bankedJump,completed:done(rec)};
 }
 function draw(unit){const c=getStatus(),r=c.info.row;if(c.rec)fail('This visit already has a frozen draw');if(!['m','ft'].includes(unit))fail('Select metres or feet before drawing');
  const native=root.TET2SlotDraw363.selectFromGarage({mode:'group',count:c.required,eligibleCarIds:c.available,singleCarStageRehearsal:true,preview:true});
  if(!native||native.mode!=='group'||!Array.isArray(native.group)||native.group.length!==c.required)fail('Native draw returned the wrong number of cars');
  const ids=native.group.map(car=>S(car.id));if(new Set(ids).size!==ids.length||ids.some(id=>!c.available.includes(id)))fail('Draw contains an ineligible or previously drawn car');
  const rec={position:r.position,visit:r.visit,stage:r.stage,carIds:ids,unit,dragMs:{},jumpMm:{},createdAt:new Date().toISOString()};
  c.event.visits[r.visit]=rec;c.book.events[EVENT_ID]=c.event;write(c.sp,c.book);return copy(rec);
 }
 function parseJump(raw,unit){const s=S(raw).replace(/,/g,'.');if(!/^(?:\d{1,5})(?:\.\d{1,2})?$/.test(s))fail('Enter a positive distance such as 320.50 (max 2 decimals)');
  const x=Number(s);if(!(x>0&&Number.isFinite(x)))fail('Long Jump distance must be positive');
  const mm=Math.round(x*(unit==='ft'?304.8:1000));if(!Number.isSafeInteger(mm)||mm<1)fail('Long Jump distance is outside supported range');return mm;}
 const formatJump=(mm,unit)=>((unit==='ft'?mm/304.8:mm/1000).toFixed(2))+' '+unit;
 const formatTime=ms=>root.TET2ResultsEntry360?.display?.(ms)||String(ms);
 function bank(kind,id,value){const c=getStatus(),rec=c.rec;if(!rec)fail('Draw this batch before saving any results');id=S(id);if(!rec.carIds.includes(id))fail('This car is not in the current frozen batch');
  if(kind==='drag'){
   if(Object.hasOwn(rec.dragMs,id))fail('Drag time already saved; each car has ONE run');
   const ms=root.TET2ResultsEntry360.timeMs(value);
   if(!Number.isSafeInteger(ms)||ms<=0)fail('Invalid native Drag time');rec.dragMs[id]=ms;
  }else if(kind==='jump'){
   if(!Object.hasOwn(rec.dragMs,id))fail('DRAG FIRST — record this car’s Drag time before its Long Jump');
   if(Object.hasOwn(rec.jumpMm,id))fail('Long Jump already saved; only ONE attempt is allowed');
   rec.jumpMm[id]=parseJump(value,rec.unit);
  }else fail('Unknown result type');
  write(c.sp,c.book);return {drag:Object.keys(rec.dragMs).length,jump:Object.keys(rec.jumpMm).length,required:c.required};
 }
 function leaderboard(c){const drag=[],jump=[];for(const r of c.rows){if(r.visit>c.info.row.visit)break;const rec=c.event.visits[r.visit];if(!rec)continue;for(const id of rec.carIds){const car=c.cars.get(id),name=S(car?.name)||[car?.make,car?.model,car?.year].filter(Boolean).join(' ')||id;
   if(Object.hasOwn(rec.dragMs,id))drag.push({id,name,ms:rec.dragMs[id],batch:r.visit});
   if(Object.hasOwn(rec.jumpMm,id))jump.push({id,name,mm:rec.jumpMm[id],batch:r.visit});}}
  drag.sort((a,b)=>a.ms-b.ms||a.id.localeCompare(b.id));jump.sort((a,b)=>b.mm-a.mm||a.id.localeCompare(b.id));return {drag,jump};}
 function html(info){if(info?.row?.origin!=='aerodromo')return '';
  try{const c=getStatus(),r=c.info.row,rec=c.rec,leaders=leaderboard(c),unit=rec?.unit||'m';
   return `<section class="t2-r377" aria-label="Aeródromo Double-Header stage rehearsal"><h3>✈️ AERÓDROMO · DOUBLE-HEADER</h3>
   <p class="t2-r377-warning"><b>PRELAUNCH REHEARSAL ONLY</b> — real owned cars, locally saved test results. No official slot, records or medals.</p>
   <div class="t2-r377-stats"><div><strong>${c.required}</strong><small>Cars this batch</small></div><div><strong>${r.visit}/${c.rows.length}</strong><small>Batch / total</small></div><div><strong>${c.bankedDrag}/${c.required}</strong><small>Drag times</small></div><div><strong>${c.bankedJump}/${c.required}</strong><small>Jump attempts</small></div></div>
   ${rec?`<div class="t2-r377-frozen">🔒 <b>Draw frozen.</b> Same ${rec.carIds.length} cars complete BOTH events in this visit. Jump unit: <b>${unit==='ft'?'feet (ft)':'metres (m)'}</b>.</div>
    <div class="t2-r377-list">${rec.carIds.map((id,i)=>{const car=c.cars.get(id),name=S(car?.name)||[car?.make,car?.model,car?.year].filter(Boolean).join(' '),hasD=Object.hasOwn(rec.dragMs,id),hasJ=Object.hasOwn(rec.jumpMm,id);
      return `<article class="t2-r377-car"><header><span class="t2-r377-number">${String(i+1).padStart(2,'0')}</span><strong>${E(name)}</strong><span class="t2-r377-badges">${car?.h===true?'<b>H</b>':''}${car?.e===true?'<b>E✓</b>':''}</span></header>
      <div class="t2-r377-result"><label><span>① Drag time · fastest wins</span>${hasD?`<output>✓ ${E(formatTime(rec.dragMs[id]))}</output>`:`<input type="text" inputmode="numeric" autocomplete="off" data-t2-r377-time="${E(id)}" placeholder="0336784 or 03:36.784" aria-label="Drag time for ${E(name)}">`}</label>${hasD?'':`<button type="button" data-t2-r377="drag" data-car-id="${E(id)}">SAVE DRAG</button>`}</div>
      <div class="t2-r377-result"><label><span>② Long Jump · furthest wins (${unit})</span>${hasJ?`<output>✓ ${E(formatJump(rec.jumpMm[id],unit))}</output>`:`<input type="text" inputmode="decimal" autocomplete="off" data-t2-r377-jump="${E(id)}" placeholder="e.g. 320.50" aria-label="Long Jump distance for ${E(name)}" ${hasD?'':'disabled'}>`}</label>${hasJ?'':`<button type="button" data-t2-r377="jump" data-car-id="${E(id)}" ${hasD?'':'disabled'}>SAVE JUMP</button>`}</div></article>`;}).join('')}</div>
    ${c.completed?'<div class="t2-r377-done">✓ BOTH EVENTS COMPLETE FOR THIS BATCH. Return to Race Control or Evil List. No official completion or honours were created.</div>':'<p class="t2-r377-help">For each car: bank its Drag time first, then ONE jump attempt. Saved entries cannot be edited during this protected rehearsal.</p>'}`:
    `<p class="t2-r377-help">Draw ONLY this scheduled batch of ${c.required} undrawn cars from the ${c.available.length} still eligible. Finish both results for each car before a later Aeródromo slot can draw.</p>
    <label class="t2-r377-field">FH5 Long Jump distance display unit<select id="t2-r377-unit"><option value="m">Metres (m)</option><option value="ft">Feet (ft)</option></select></label>
    <button class="t2-btn" type="button" data-t2-r377="draw">🎲 DRAW CURRENT 16-CAR (MAX) DOUBLE-HEADER</button>`}
   ${(leaders.drag.length||leaders.jump.length)?`<section class="t2-r377-leaders" aria-label="Separate provisional Aeródromo leaderboards"><h4>🏁 PROVISIONAL · TWO SEPARATE LEADERBOARDS</h4><div><strong>Drag — lowest time</strong><ol>${leaders.drag.slice(0,5).map(x=>`<li>${E(x.name)} <b>${E(formatTime(x.ms))}</b></li>`).join('')||'<li>No Drag times</li>'}</ol></div><div><strong>Long Jump — longest distance</strong><ol>${leaders.jump.slice(0,5).map(x=>`<li>${E(x.name)} <b>${E(formatJump(x.mm,unit))}</b></li>`).join('')||'<li>No jumps</li>'}</ol></div><small>Provisional across entered batches only. No medals or official records.</small></section>`:''}
   <p class="t2-r377-help">This is one Evil List appearance with TWO independently ranked results. Never two separate scheduled slots. Later batches remain untouched until reached.</p><p class="t2-r377-error" data-t2-r377-error role="alert" hidden></p></section>`;
  }catch(err){return `<section class="t2-r377"><h3>✈️ AERÓDROMO · DOUBLE-HEADER</h3><p class="t2-r377-warning" role="alert">${E(err.message)}</p><p>No Garage result or official honours have been changed.</p></section>`;}
 }
 function action(e,go){const btn=e.target?.closest?.('[data-t2-r377]');if(!btn)return false;const op=btn.dataset.t2R377;
  try{if(op==='draw'){const host=btn.closest('.t2-r377')||root.document,unit=host.querySelector('#t2-r377-unit')?.value;draw(unit);go('race');}
    else if(op==='drag'||op==='jump'){const host=btn.closest('.t2-r377')||root.document,id=btn.dataset.carId;
     const field=[...host.querySelectorAll(op==='drag'?'[data-t2-r377-time]':'[data-t2-r377-jump]')].find(el=>el.getAttribute(op==='drag'?'data-t2-r377-time':'data-t2-r377-jump')===id);
     if(!field)fail('Result field is unavailable');bank(op,id,field.value);go('race');}}
  catch(err){const host=btn.closest('.t2-r377'),target=host?.querySelector('[data-t2-r377-error]');if(target){target.textContent=S(err.message);target.hidden=false;}}
  return true;}
 return Object.freeze({getStatus,draw,bank,leaderboard,html,action,parseJump,formatJump,version:'8.0.377'});
});
