/* OTG! MAIN v8.0.376: unified all-car Gauntlet current-slot rehearsal.
 * Exactly THREE routes per car, 1-8 cars per stage. First-pick/no-repeat across
 * the event, isolated stored results, and strict per-batch prerequisite checks.
 * No OTG rhSave, no official results/records/medals, no candidate schedule edits.
 */
(function(root,factory){'use strict';const api=factory(root);if(root)root.TET2UnifiedGauntlet376=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof window!=='undefined'?window:globalThis,function(root){
 'use strict';
 const SOURCE='TET2_GAUNTLET_STAGE_REHEARSAL_8376', PREFIX='tet2.prelaunch.gauntlet-rehearsal.v8376.';
 const S=v=>String(v??'').trim();
 const E=v=>S(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const clone=v=>JSON.parse(JSON.stringify(v));
 const fail=msg=>{throw Error('Gauntlet rehearsal safe stop: '+msg);};
 function space(){const x=root.rhSpace?.();if(!x||x.catalogueKey!=='fh5-catalogue-v1'||!S(x.id)||!Array.isArray(x.cars))fail('Open the original FH5 Catalogue Garage');
  const ids=x.cars.map(c=>S(c?.id));if(!ids.length||ids.some(id=>!id)||new Set(ids).size!==ids.length)fail('Garage IDs are missing or duplicated');return x;}
 function storage(){const s=root.localStorage;if(!s||typeof s.getItem!=='function'||typeof s.setItem!=='function')fail('Isolated local storage unavailable');return s;}
 const key=sp=>PREFIX+encodeURIComponent(S(sp.id));
 function read(sp){let raw;try{raw=storage().getItem(key(sp));}catch(_){fail('Could not read isolated rehearsal storage');}
  if(!raw)return {schema:1,source:SOURCE,spaceId:S(sp.id),events:{}};
  let book;try{book=JSON.parse(raw);}catch(_){fail('Existing rehearsal storage is damaged; refusing to overwrite');}
  if(!book||book.schema!==1||book.source!==SOURCE||book.spaceId!==S(sp.id)||!book.events||Array.isArray(book.events)||typeof book.events!=='object')fail('Stored rehearsal data does not match FH5 Space');return book;
 }
 function write(sp,book){if(book.spaceId!==S(sp.id)||book.source!==SOURCE)fail('Wrong storage namespace');try{storage().setItem(key(sp),JSON.stringify(book));}catch(_){fail('Rehearsal results could not be saved');}}
 function current(){const info=root.TET2EventRouter375?.inspect?.();if(!info||info.row?.origin!=='gauntlet'||info.row?.eventId!=='T2-GAUNTLET-ALL'||info.row?.format!=='GAUNTLET')fail('Select a scheduled Unified All-Car Gauntlet batch from Evil List');
  if(!info.native?.draw||!info.native?.entry)fail('Native Garage draw or results entry is unavailable');
  const count=Number(info.row.workload);if(!Number.isSafeInteger(count)||count<1||count>8)fail('Slot is not a valid 1–8-car Gauntlet batch');return info;}
 function context(){const info=current(),sp=space(),snap=root.TET2AssembledList373?.snapshot?.();if(!snap?.audit?.ok||!Array.isArray(snap.rows))fail('Candidate schedule has not passed integrity checks');
  const rows=snap.rows.filter(r=>r.eventId==='T2-GAUNTLET-ALL').sort((a,b)=>a.visit-b.visit);
  if(!rows.length||rows.length!==info.row.visitTotal||rows.some((r,i)=>r.visit!==i+1)||rows[info.row.visit-1]?.position!==info.row.position)fail('Gauntlet visit lineage is inconsistent');
  if(rows.some(r=>r.origin!=='gauntlet'||r.format!=='GAUNTLET'||!Number.isSafeInteger(Number(r.workload))||Number(r.workload)<1||Number(r.workload)>8))fail('Gauntlet batch workload invalid');
  if(rows.reduce((sum,r)=>sum+Number(r.workload),0)!==sp.cars.length)fail('Gauntlet batches do not cover the current Garage exactly once');
  const book=read(sp),old=book.events[info.row.eventId];
  if(old&&(old.stamp!==info.stamp||old.source!==SOURCE||old.name!==info.row.name))fail('Garage or proposed timetable changed since the first draw; existing rehearsal is protected');
  const event=old||{source:SOURCE,stamp:info.stamp,name:info.row.name,fieldIds:sp.cars.map(c=>S(c.id)),visits:{}};
  const ids=sp.cars.map(c=>S(c.id)),cars=new Map(sp.cars.map(c=>[S(c.id),c]));
  if(!Array.isArray(event.fieldIds)||event.fieldIds.length!==ids.length||new Set(event.fieldIds).size!==ids.length||event.fieldIds.some(id=>!cars.has(id)))fail('Frozen Gauntlet cars do not match live Garage');
  return {info,sp,snap,book,event,rows,cars};
 }
 function completed(rec){return !!rec&&Array.isArray(rec.carIds)&&rec.carIds.length>0&&Array.isArray(rec.saved)&&rec.saved.length===3&&rec.saved.every(times=>rec.carIds.every(id=>Object.hasOwn(times,id)));}
 function inspectRecord(rec,r,c){if(!rec||rec.position!==r.position||rec.visit!==r.visit||rec.stage!==r.stage||!Array.isArray(rec.carIds)||rec.carIds.length!==Number(r.workload)||new Set(rec.carIds).size!==rec.carIds.length||rec.carIds.some(id=>!c.event.fieldIds.includes(id)))fail('Frozen Gauntlet stage cars no longer match source');
  if(!Array.isArray(rec.tracks)||rec.tracks.length!==3||rec.tracks.some(n=>!S(n)||S(n).length>100)||new Set(rec.tracks.map(n=>S(n).toLowerCase())).size!==3)fail('Frozen Gauntlet routes invalid');
  if(!Array.isArray(rec.saved)||rec.saved.length!==3||rec.saved.some(x=>!x||typeof x!=='object'||Array.isArray(x)))fail('Frozen Gauntlet results invalid');
  for(const times of rec.saved){for(const [id,ms] of Object.entries(times)){if(!rec.carIds.includes(id)||!Number.isSafeInteger(ms)||ms<=0)fail('Stored Gauntlet time is not linked to a drawn car');}}
 }
 function getStatus(){const c=context(),r=c.info.row,rec=c.event.visits[r.visit]||null,used=new Set();
  for(const item of c.rows){if(item.visit>r.visit)break;
   const v=c.event.visits[item.visit];if(item.visit<r.visit&&!v)fail('Earlier Gauntlet batch '+item.visit+' has not been drawn');
   if(v){inspectRecord(v,item,c);for(const id of v.carIds){if(used.has(id))fail('The same car was drawn into more than one Gauntlet batch');used.add(id);}
    if(item.visit<r.visit&&!completed(v))fail('Finish all three tracks in Gauntlet batch '+item.visit+' before its successor');}}
  if(rec&&used.size<rec.carIds.length)fail('Current batch roster invalid');
  const available=c.event.fieldIds.filter(id=>!used.has(id));
  if(!rec&&available.length<Number(r.workload))fail('Not enough unused cars for this batch');
  const banked=rec?rec.saved.reduce((n,t)=>n+Object.keys(t).length,0):0;
  return {...c,rec,available,required:Number(r.workload),banked,expected:Number(r.workload)*3,done:completed(rec)};
 }
 function draw(tracks){const c=getStatus();if(c.rec)fail('This Gauntlet visit already has a saved draw');
  if(!Array.isArray(tracks)||tracks.length!==3||tracks.some(x=>S(x).length<3||S(x).length>100)||new Set(tracks.map(x=>S(x).toLowerCase())).size!==3)fail('Enter THREE distinct practice routes (3–100 characters each)');
  const native=root.TET2SlotDraw363?.selectFromGarage?.({mode:'group',count:c.required,eligibleCarIds:c.available,gauntletSingleCarRehearsal:true,preview:true});
  if(!native||native.mode!=='group'||native.group?.length!==c.required)fail('Native Garage draw did not supply the exact batch');
  const chosen=native.group.map(car=>S(car.id));if(new Set(chosen).size!==chosen.length||chosen.some(id=>!c.available.includes(id)))fail('Native draw included a repeated or ineligible car');
  const rec={position:c.info.row.position,visit:c.info.row.visit,stage:c.info.row.stage,carIds:chosen,tracks:tracks.map(S),saved:[{},{},{}],createdAt:new Date().toISOString()};
  c.event.visits[c.info.row.visit]=rec;c.book.events[c.info.row.eventId]=c.event;write(c.sp,c.book);return clone(rec);
 }
 function bank(payload){const c=getStatus(),r=c.info.row,rec=c.rec,p=payload;if(!rec)fail('Gauntlet batch must be drawn before recording times');
  if(!p||p.mode!=='group'||S(p.slotId)!=='GAUNTLET-REHEARSAL-'+r.position||S(p.competitionId)!==r.eventId)fail('Time sent from the wrong slot');
  const n=Number(p.trackIndex),id=S(p.carId);
  if(!Number.isSafeInteger(n)||n<0||n>2||rec.tracks[n]!==S(p.track)||!rec.carIds.includes(id)||Object.hasOwn(rec.saved[n],id))fail('Car/track not in this frozen stage or result already banked');
  if(!Number.isSafeInteger(p.timeMs)||p.timeMs<=0)fail('Time must be a positive whole number of milliseconds');
  // Track 2 and 3 may only be banked after all times for the previous track.
  if(n>0&&!rec.carIds.every(car=>Object.hasOwn(rec.saved[n-1],car)))fail('Complete the previous track for all cars before advancing');
  rec.saved[n][id]=p.timeMs;write(c.sp,c.book);return {banked:rec.saved.reduce((a,t)=>a+Object.keys(t).length,0),expected:c.expected};
 }
 function open(){const c=getStatus(),rec=c.rec;if(!rec)fail('Draw the batch first');
  const cars=rec.carIds.map(id=>{const car=c.cars.get(id);return{id,name:S(car.name)||[car.make,car.model,car.year].filter(Boolean).join(' '),h:car.h===true,e:car.e===true};});
  const trackIndex=rec.saved.findIndex(times=>rec.carIds.some(id=>!Object.hasOwn(times,id)));
  const spec={source:'TET2_DRAW_PRACTICE_V8363',spaceId:S(c.sp.id),slotId:'GAUNTLET-REHEARSAL-'+c.info.row.position,competitionId:c.info.row.eventId,
   label:'UNIFIED GAUNTLET · PRELAUNCH BATCH '+c.info.row.visit+'/'+c.rows.length,stageRehearsal:true,gauntletSingleCarRehearsal:true,
   mode:'group',cars,tracks:rec.tracks,saved:clone(rec.saved),trackIndex:trackIndex<0?2:trackIndex,
   onBank:async p=>bank(p),onExit:()=>root.TET2Stage4UI359?.page('race')};
  root.TET2ResultsEntry360.openTrial(spec);return {banked:c.banked,expected:c.expected};
 }
 function html(info){if(info?.row?.origin!=='gauntlet')return '';
  try{const c=getStatus(),r=c.info.row,rec=c.rec;
   const ranks=c.done?rec.carIds.map(id=>({id,ms:rec.saved.reduce((sum,t)=>sum+t[id],0)})).sort((a,b)=>a.ms-b.ms):[];
   const fmt=ms=>root.TET2ResultsEntry360?.display?.(ms)||String(ms);
   return `<section class="t2-r376" aria-label="Unified Gauntlet stage rehearsal"><h3>🔧 UNIFIED GAUNTLET · CURRENT BATCH</h3><p class="t2-r376-alert"><b>PRELAUNCH REHEARSAL ONLY</b> — real Garage cars, isolated saved practice times. No official slot, medals, records or final standings.</p>
    <div class="t2-r376-stats"><div><strong>${c.required}</strong><span>Cars this batch</span></div><div><strong>${r.visit}/${c.rows.length}</strong><span>Gauntlet visits</span></div><div><strong>${c.banked}/${c.expected}</strong><span>Individual times saved</span></div></div>
    ${rec?`<div class="t2-r376-help"><b>🔒 Draw frozen for rehearsal.</b> Tracks (in order): ${rec.tracks.map(E).join(' → ')}.</div><ol class="t2-r376-cars">${rec.carIds.map(id=>`<li>${E(c.cars.get(id)?.name||id)} <span class="complete">${rec.saved.filter(t=>Object.hasOwn(t,id)).length}/3 tracks</span></li>`).join('')}</ol>${c.done?`<div class="t2-r376-note">Three-track batch complete. Provisional BATCH order only — not overall Gauntlet medals: ${ranks.map((x,i)=>`${i+1}. ${E(c.cars.get(x.id)?.name||x.id)} (${E(fmt(x.ms))})`).join(' · ')}</div>`:''}<button type="button" class="t2-btn" data-t2-r376="open">${c.done?'VIEW':'RESUME'} SAVED THREE-TRACK RESULTS →</button>`:
     `<p class="t2-r376-help">Only ${c.required} of ${c.available.length} undrawn cars will be selected now. Every car appears once across this unified competition. Three separate practice routes are required before you lock a draw.</p>
      <label class="t2-r376-field">Practice route 1<input id="t2-r376-track-0" maxlength="100" autocomplete="off" placeholder="Enter FH5 route name"></label>
      <label class="t2-r376-field">Practice route 2<input id="t2-r376-track-1" maxlength="100" autocomplete="off" placeholder="Enter a different route"></label>
      <label class="t2-r376-field">Practice route 3<input id="t2-r376-track-2" maxlength="100" autocomplete="off" placeholder="Enter a third route"></label>
      <button type="button" class="t2-btn" data-t2-r376="draw">🎲 DRAW THIS GAUNTLET BATCH</button>`}
    <p class="t2-r376-help">Every car runs Track 1, then Track 2, then Track 3. Earlier batches must finish before the next can draw. This does not create an official TET2 result.</p></section>`;
  }catch(err){return `<section class="t2-r376"><h3>🔧 UNIFIED GAUNTLET · CURRENT BATCH</h3><p class="t2-r376-alert" role="alert">${E(err.message)}</p><p class="t2-r376-help">No official result, Garage record or medal has been written.</p></section>`;}
 }
 function action(e,go){const btn=e.target?.closest?.('[data-t2-r376]');if(!btn)return false;
  try{if(btn.dataset.t2R376==='draw'){const el=btn.closest('#tet2-stage4-app')||root.document;const tracks=[0,1,2].map(n=>el.querySelector('#t2-r376-track-'+n)?.value||'');draw(tracks);go('race');}
   else if(btn.dataset.t2R376==='open'){open();go('entry');}}
  catch(err){const host=btn.closest('.t2-r376');if(host){let p=host.querySelector('[data-r376-error]');if(!p){p=root.document.createElement('p');p.setAttribute('data-r376-error','');p.setAttribute('role','alert');p.className='t2-r376-alert';host.append(p);}p.textContent=S(err.message);}}
  return true;}
 return Object.freeze({getStatus,draw,bank,open,html,action,version:'8.0.376'});
});
