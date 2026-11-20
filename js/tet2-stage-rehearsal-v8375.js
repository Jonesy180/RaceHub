/* OTG! MAIN 8.0.375 — STRICTLY LOCAL, PRELAUNCH manufacturer knockout stage rehearsal.
 * A real per-slot draw (maximum eight native match pairs), protected individual
 * time banking, replay/resume and winner lineage for separated knockout stages.
 * NO official Evil List launch, rhSave(), medals, records, honours or Garage writes.
 */
(function(root,factory){'use strict';const api=factory(root);if(root)root.TET2StageRehearsal375=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof window!=='undefined'?window:globalThis,function(root){
 'use strict';
 const SOURCE='TET2_STAGE_REHEARSAL_8375',PREFIX='tet2.prelaunch.maker-rehearsal.v8375.',S=v=>String(v??'').trim();
 const E=v=>S(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const copy=x=>JSON.parse(JSON.stringify(x));
 const fail=x=>{throw Error('Rehearsal safe stop: '+x);};
 function current(){const info=root.TET2EventRouter375?.inspect?.();if(!info?.row||info.row.origin!=='maker-knockout')fail('Select a full Manufacturer Race Off from the Evil List first');
   if(!info.native?.draw||!info.native?.entry)fail('Native draw or time-entry engine unavailable');
   if(info.row.format!=='KNOCKOUT'&&info.row.format!=='BRONZE')fail('This stage is not a Race Off match');
   const n=Number(info.row.workload);if(!Number.isSafeInteger(n)||n<1||n>8)fail('Current stage is outside one-to-eight-match limit');return info;}
 function storage(){const l=root.localStorage;if(!l||typeof l.getItem!=='function'||typeof l.setItem!=='function')fail('Isolated local storage unavailable');return l;}
 function space(){const x=root.rhSpace?.();if(!x||x.catalogueKey!=='fh5-catalogue-v1'||!S(x.id)||!Array.isArray(x.cars))fail('Open your real FH5 Garage first');
  const ids=x.cars.map(c=>S(c.id));if(ids.some(id=>!id)||new Set(ids).size!==ids.length)fail('Invalid Garage IDs');return x;}
 function key(x){return PREFIX+encodeURIComponent(S(x.id));}
 function storeRead(){const x=space();let raw;try{raw=storage().getItem(key(x));}catch(_){fail('Cannot read isolated rehearsal storage');}
  if(!raw)return {schema:1,source:SOURCE,spaceId:S(x.id),events:{}};
  let b;try{b=JSON.parse(raw);}catch(_){fail('Stored rehearsal book is damaged — no results will be overwritten');}
  if(!b||b.schema!==1||b.source!==SOURCE||b.spaceId!==S(x.id)||!b.events||typeof b.events!=='object'||Array.isArray(b.events))fail('Existing rehearsal book does not match this Garage');return b;}
 function storeWrite(book){const x=space();if(book.spaceId!==S(x.id)||book.source!==SOURCE)fail('Storage space mismatch');
  try{storage().setItem(key(x),JSON.stringify(book));}catch(_){fail('Local rehearsal save failed — no result was accepted');}}
 function context(){const info=current(),snap=root.TET2AssembledList373?.snapshot?.();if(!snap?.audit?.ok)fail('Candidate timetable unavailable');
  const rows=snap.rows.filter(x=>x.eventId===info.row.eventId).sort((a,b)=>a.visit-b.visit);
  if(!rows.length||rows.some((r,i)=>r.visit!==i+1)||rows[info.row.visit-1]?.position!==info.row.position)fail('Competition visit lineage mismatch');
  const book=storeRead(),existing=book.events[info.row.eventId];
  if(existing&&(existing.stamp!==info.stamp||existing.name!==info.row.name||existing.source!==SOURCE))fail('Candidate schedule or Garage changed after rehearsal draw. No results will be relabelled.');
  const event=existing||{source:SOURCE,stamp:info.stamp,name:info.row.name,fieldIds:info.eligible?.ids||[],visits:{}};
  if(!Array.isArray(event.fieldIds)||event.fieldIds.length<2||new Set(event.fieldIds).size!==event.fieldIds.length)fail('Manufacturer field is invalid');
  const g=new Map(space().cars.map(c=>[S(c.id),c]));if(event.fieldIds.some(id=>!g.has(id)))fail('Previously drawn car has left the Garage');
  return {info,snap,rows,book,event,g};}
 function roundName(r){return S(r.stage).replace(/\s*·\s*batch\s+\d+\s*\/\s*\d+\s*$/i,'');}
 function groups(rows){const list=[];for(const r of rows){const name=roundName(r);if(!list.length||list[list.length-1].name!==name)list.push({name,rows:[r]});else list[list.length-1].rows.push(r);}return list;}
 function allSaved(record){return !!record&&Array.isArray(record.matches)&&record.matches.length>0&&record.matches.every(m=>record.saved&&Object.hasOwn(record.saved,m.id));}
 function pools(c){const {info,rows,event}=c,gs=groups(rows),idx=gs.findIndex(g=>g.rows.some(r=>r.position===info.row.position));
  if(idx<0)fail('Stage is not present in the verified competition order');
  const group=gs[idx],within=group.rows.findIndex(r=>r.position===info.row.position);
  // Previous visits, including a separate bronze duel, must have every saved pair.
  for(const r of rows.filter(r=>r.visit<info.row.visit))if(!allSaved(event.visits[r.visit]))fail('Earlier rehearsal visit '+r.visit+' must have all match times saved before advancing');
  let pool;
  if(idx===0){pool=event.fieldIds.slice();}
  else if(/^Bronze-medal duel/.test(group.name)){
   const semis=gs.find(g=>g.name==='Semifinals');if(!semis||semis.rows.length!==1)fail('Two verified semifinals required for bronze duel');
   const record=event.visits[semis.rows[0].visit];if(!allSaved(record)||record.matches.length!==2)fail('Semifinal losing cars not verified');
   pool=record.matches.map(m=>m.cars.find(id=>id!==record.saved[m.id].winnerId));
  }else{
   const parent=gs[idx-1].name.startsWith('Bronze-medal duel')?gs[idx-2]:gs[idx-1];if(!parent)fail('Previous knockout stage missing');
   const taken=[],wins=[];for(const r of parent.rows){const rec=event.visits[r.visit];if(!allSaved(rec))fail('Earlier knockout stage is incomplete');
    for(const m of rec.matches){taken.push(...m.cars);wins.push(rec.saved[m.id].winnerId);}}
   if(new Set(taken).size!==taken.length||new Set(wins).size!==wins.length)fail('Earlier stage repeated a car');
   // First round may have bracket byes; later rounds have no speculative byes.
   if(gs.indexOf(parent)===0){const byes=event.fieldIds.filter(id=>!taken.includes(id));pool=[...wins,...byes];}
   else{pool=wins;}
  }
  // Multiple visits of a stage draw only CURRENT slot, not entire next batch.
  const drawn=[];for(const r of group.rows.slice(0,within)){const rec=event.visits[r.visit];if(!allSaved(rec))fail('Earlier batch of this round is unfinished');for(const m of rec.matches)drawn.push(...m.cars);}
  if(new Set(drawn).size!==drawn.length||drawn.some(id=>!pool.includes(id)))fail('Earlier batch entrant duplication');
  const available=pool.filter(id=>!drawn.includes(id));if(available.length<Number(info.row.workload)*2)fail('Not enough eligible progressing cars for this scheduled stage');
  const batchMatches=group.rows.reduce((n,r)=>n+Number(r.workload),0);
  if(batchMatches*2>pool.length)fail('Competition stage requires more match entrants than its source supplied');
  // Only the opening stage may leave byes; non-opening stages must consume all.
  if(idx>0&&batchMatches*2!==pool.length)fail('Later round contains unresolved byes; needs manual source review');
  return {group,available,round:group.name,batch:within+1,batches:group.rows.length};
 }
 function getStatus(){const c=context(),rec=c.event.visits[c.info.row.visit]||null;const pool=rec?null:pools(c);
  if(rec){if(!Array.isArray(rec.matches)||rec.matches.length!==Number(c.info.row.workload)||!S(rec.track)||!rec.saved||typeof rec.saved!=='object')fail('Stored stage shape changed');
   const all=rec.matches.flatMap(m=>m.cars);if(new Set(all).size!==all.length||all.some(id=>!c.event.fieldIds.includes(id)))fail('Saved draw contains invalid Garage cars');
   for(const m of rec.matches){const v=rec.saved[m.id];if(v&&(v.winnerId!==(v.a<v.b?m.cars[0]:m.cars[1])||v.a===v.b||v.a<=0||v.b<=0))fail('Saved result contradicts its winner');}
  }
  return {...c,rec,pool,banked:rec?Object.keys(rec.saved).length:0,required:Number(c.info.row.workload)};}
 function draw(track){const c=getStatus();if(c.rec)fail('This stage already has a frozen rehearsal draw');
  const name=S(track);if(name.length<3||name.length>100)fail('Enter the practice route name (3–100 characters). It is NOT an official assigned racecourse');
  const native=root.TET2SlotDraw363?.selectFromGarage?.({mode:'raceoff',matches:c.required,eligibleCarIds:c.pool.available,preview:true});
  if(!native||native.mode!=='raceoff'||native.matches?.length!==c.required)fail('Existing native draw returned an invalid number of matches');
  const picked=native.matches.flatMap(m=>[S(m.carA.id),S(m.carB.id)]);
  if(new Set(picked).size!==picked.length||picked.some(id=>!c.pool.available.includes(id)))fail('Native draw violated eligible IDs or duplication rule');
  const rec={position:c.info.row.position,visit:c.info.row.visit,stage:c.info.row.stage,track:name,
    matches:native.matches.map((m,i)=>({id:'v'+c.info.row.visit+'-m'+(i+1),cars:[S(m.carA.id),S(m.carB.id)]})),saved:{},createdAt:new Date().toISOString()};
  // First draw snapshots the full maker field: no subsequent silent Garage changes.
  c.event.visits[c.info.row.visit]=rec;c.book.events[c.info.row.eventId]=c.event;storeWrite(c.book);
  return copy(rec);
 }
 function bank(payload){const c=getStatus(),rec=c.rec,p=payload;if(!rec)fail('Draw not frozen');
  if(!p||p.mode!=='raceoff'||S(p.slotId)!=='REHEARSAL-'+c.info.row.position||S(p.competitionId)!==c.info.row.eventId)fail('Wrong event/stage result');
  const match=rec.matches.find(m=>m.id===S(p.matchId));if(!match||Object.hasOwn(rec.saved,match.id))fail('Match not found or already saved');
  if(S(p.track)!==rec.track||S(p.carA)!==match.cars[0]||S(p.carB)!==match.cars[1])fail('Attempted result does not match locked pairing or route');
  if(!Number.isSafeInteger(p.timeA)||!Number.isSafeInteger(p.timeB)||p.timeA<=0||p.timeB<=0||p.timeA===p.timeB)fail('Both positive, unequal times required');
  const winner=p.timeA<p.timeB?match.cars[0]:match.cars[1];if(S(p.winnerId)!==winner)fail('Faster-car winner mismatch');
  rec.saved[match.id]={a:p.timeA,b:p.timeB,winnerId:winner};storeWrite(c.book);return {banked:Object.keys(rec.saved).length,total:rec.matches.length};
 }
 function open(){const c=getStatus(),rec=c.rec;if(!rec)fail('Draw this stage before opening entry');
  const flags=id=>{const car=c.g.get(id);return{id,name:S(car.name)||[car.make,car.model,car.year].filter(Boolean).join(' '),h:car.h===true,e:car.e===true};};
  const spec={source:'TET2_DRAW_PRACTICE_V8363',spaceId:S(space().id),slotId:'REHEARSAL-'+c.info.row.position,competitionId:c.info.row.eventId,
   label:'STAGE REHEARSAL — NOT OFFICIAL',stageRehearsal:true,mode:'raceoff',matches:rec.matches.map(m=>({id:m.id,track:rec.track,cars:m.cars.map(flags)})),
   saved:copy(rec.saved),onBank:async p=>bank(p),onExit:()=>root.TET2Stage4UI359?.page('race')};
  root.TET2ResultsEntry360.openTrial(spec);return {banked:c.banked,required:c.required};
 }
 function html(info){if(info?.row?.origin!=='maker-knockout')return '';
  try{const c=getStatus(),r=c.info.row,rec=c.rec,ready=rec&&allSaved(rec);
   let pairs='';if(rec){pairs=`<ol class="t2-r375-matches">${rec.matches.map((m,i)=>{const v=rec.saved[m.id];const a=c.g.get(m.cars[0]),b=c.g.get(m.cars[1]);return `<li><b>Match ${i+1}</b> ${E(a?.name||m.cars[0])} <span>vs</span> ${E(b?.name||m.cars[1])}${v?`<strong>✓ Saved · ${E(c.g.get(v.winnerId)?.name||v.winnerId)}</strong>`:''}</li>`;}).join('')}</ol>`;}
   return `<section class="t2-r375" aria-label="Isolated stage rehearsal"><h3>🏁 THIS STAGE · DRAW &amp; RESULT PATH</h3><p class="t2-r375-warn">PRELAUNCH REHEARSAL ONLY — real Garage cars, saved locally, <b>not official racing</b>. No slot completion, honours, medals or track records.</p>
     <div class="t2-r374-stat"><span>Current planned stage</span><strong>${E(r.stage)} · ${c.required} match${c.required===1?'':'es'}</strong></div>
     ${rec?`<div class="t2-r374-stat"><span>Saved rehearsal times</span><strong>${c.banked} / ${c.required} matches</strong></div><div class="t2-r375-status">🔒 This visit’s draw is frozen <b>for rehearsal only</b> · ${E(rec.track)} ${ready?'· ALL BANKED ✓':''}</div>${pairs}<button type="button" class="t2-btn t2-r374-button" data-t2-r375="open">${ready?'VIEW':'RESUME'} SAVED STAGE RESULTS →</button>`:
      `<p class="t2-r375-note">${c.pool.available.length} eligible cars available for this visit. Only ${c.required*2} will be drawn; other visits remain untouched.</p><label class="t2-r375-label">Practice route (not an official assigned course)<input id="t2-r375-track" maxlength="100" autocomplete="off" placeholder="Enter route name from FH5"></label><button class="t2-btn t2-r374-button" data-t2-r375="draw">🎲 DRAW &amp; SAVE THIS REHEARSAL STAGE</button>`}
     <p class="t2-r375-foot">Stage results will be used to validate winner/bye/bronze progression <em>inside rehearsal only</em>. Official entrants and courses must be locked separately before tournament launch.</p>
   </section>`;
  }catch(err){return `<section class="t2-r375"><h3>🏁 STAGE DRAW &amp; RESULTS</h3><p class="t2-r375-warn" role="alert">${E(err.message)}</p><p>No official slots or saved results changed.</p></section>`;}}
 function action(e,go){const b=e.target?.closest?.('[data-t2-r375]');if(!b)return false;
  try{if(b.dataset.t2R375==='draw'){const field=e.target.closest('#tet2-stage4-app')?.querySelector('#t2-r375-track');draw(field?.value||'');go('race');}
   if(b.dataset.t2R375==='open'){open();go('entry');}}
  catch(err){const host=b.closest('.t2-r375');if(host){let p=host.querySelector('[data-r375-error]');if(!p){p=document.createElement('p');p.setAttribute('data-r375-error','');p.setAttribute('role','alert');p.className='t2-r375-warn';host.append(p);}p.textContent=S(err.message);}}
  return true;}
 return Object.freeze({getStatus,draw,bank,open,html,action,pools,version:'8.0.375'});
});
