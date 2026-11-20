/* OTG! Main v8.0.378 — TWO Relay championships; one current scheduled
 * group per draw, three separate car legs per team, one winner per group.
 * Entirely isolated PRELAUNCH REHEARSAL. Official results, rhSave, honours,
 * tracks, and TET2 ledger are not written. Previously accepted rehearsals
 * v375/v376/v377 retain their independent browser namespaces unchanged.
 * Uses pure original v8.0.181 Relay draw + 3-stage scoring rules.
 */
(function(root,factory){'use strict';const api=factory(root);if(root)root.TET2Relay378=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis,function(root){
 'use strict';
 const SOURCE='TET2_RELAY_STAGE_REHEARSAL_8378';
 const PREFIX='tet2.prelaunch.relay-rehearsal.v8378.';
 const EVENTS={'T2-RELAY-MIXED':'mixed','T2-RELAY-MANUFACTURER':'maker'};
 const S=v=>String(v??'').trim();
 const E=v=>S(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const clone=o=>JSON.parse(JSON.stringify(o));
 const fail=m=>{throw Error('Relay rehearsal safe stop: '+m);};
 let preview=null;
 function space(){const s=root.rhSpace?.();if(!s||s.catalogueKey!=='fh5-catalogue-v1'||!S(s.id)||!Array.isArray(s.cars))fail('Open the real FH5 Catalogue Garage');
  const ids=s.cars.map(c=>S(c?.id));if(!ids.length||ids.some(id=>!id)||new Set(ids).size!==ids.length)fail('Garage cars need unique, stable IDs');return s;}
 const storage=()=>{const x=root.localStorage;if(!x||typeof x.getItem!=='function'||typeof x.setItem!=='function')fail('Private practice storage unavailable');return x;};
 const key=sp=>PREFIX+encodeURIComponent(S(sp.id));
 function read(sp){let raw;try{raw=storage().getItem(key(sp));}catch(_){fail('Cannot read isolated Relay data');}
  if(!raw)return {schema:1,source:SOURCE,spaceId:S(sp.id),events:{}};
  let b;try{b=JSON.parse(raw);}catch(_){fail('Saved Relay rehearsal is damaged; refusing to overwrite');}
  if(!b||b.schema!==1||b.source!==SOURCE||b.spaceId!==S(sp.id)||!b.events||typeof b.events!=='object'||Array.isArray(b.events))fail('Saved Relay data belongs to a different source or Garage');return b;}
 function write(sp,b){if(b.source!==SOURCE||b.spaceId!==S(sp.id))fail('Rehearsal storage scope mismatch');try{storage().setItem(key(sp),JSON.stringify(b));}catch(_){fail('Could not save isolated Relay rehearsal');}}
 const stageParts=stage=>{const m=/^(Qualifying|Final) · round (\d+) · group (\d+)\/(\d+)$/.exec(S(stage));
  if(!m)fail('Unrecognised Relay group stage: '+stage);
  const x={kind:m[1],round:Number(m[2]),group:Number(m[3]),groups:Number(m[4])};
  if(x.round<1||x.round>12||x.group<1||x.groups<1||x.group>x.groups)fail('Relay stage label invalid');
  if((x.kind==='Final')!==(x.groups===1))fail('Relay final/qualifying identity is inconsistent');return x;};
 function context(){const info=root.TET2EventRouter375?.inspect?.(),r=info?.row;
  if(!r||r.origin!=='relay'||!Object.hasOwn(EVENTS,S(r.eventId))||r.format!=='RELAY')fail('Select a Mixed or Manufacturer Relay group from the Evil List');
  if(!info?.native?.entry||typeof root.TET2ResultsEntry360?.timeMs!=='function')fail('Original time-entry engine is not available');
  const engine=root.rhEvil2Rules181;
  if(!engine||typeof engine.drawMakerRelay!=='function'||typeof engine.drawMixedRelay!=='function'||typeof engine.scoreThreeStages!=='function')fail('Original three-car Relay rules engine is unavailable');
  const sp=space(),snap=root.TET2AssembledList373?.snapshot?.();if(!snap?.audit?.ok||!Array.isArray(snap.rows))fail('Unverified candidate Evil List');
  const rows=snap.rows.filter(x=>x.eventId===r.eventId).sort((a,b)=>a.visit-b.visit),parts=stageParts(r.stage);
  if(!rows.length||rows.length!==r.visitTotal||rows[r.visit-1]?.position!==r.position||rows.some((x,i)=>x.visit!==i+1||x.origin!=='relay'||x.format!=='RELAY'||x.name!==r.name||!Number.isInteger(Number(x.workload))||Number(x.workload)<2||Number(x.workload)>4))fail('Relay stage order/workloads do not match verified timetable');
  const byRound=new Map();for(const x of rows){const p=stageParts(x.stage),list=byRound.get(p.round)||[];list.push({row:x,...p});byRound.set(p.round,list);}
  for(let n=1;n<=byRound.size;n++){
   const a=byRound.get(n);if(!a?.length||a.length!==a[0].groups||a.some((x,i)=>x.round!==n||x.group!==i+1||x.groups!==a.length))fail('Relay competition has missing or out-of-order groups');
   if(n>1&&a.reduce((s,x)=>s+Number(x.row.workload),0)!==byRound.get(n-1).length)fail('Relay advancement would reuse or lose a group winner');
  }
  if(byRound.get(byRound.size).length!==1||parts.round>byRound.size)fail('Relay final is missing');
  const book=read(sp),old=book.events[r.eventId],ids=sp.cars.map(c=>S(c.id)),cars=new Map(sp.cars.map(c=>[S(c.id),c]));
  if(old&&(old.source!==SOURCE||old.stamp!==info.stamp||old.name!==r.name||old.mode!==EVENTS[r.eventId]))fail('The Garage or timetable changed since this Relay draw; saved practice is protected');
  const event=old||{source:SOURCE,stamp:info.stamp,name:r.name,mode:EVENTS[r.eventId],fieldIds:ids,visits:{}};
  if(!Array.isArray(event.fieldIds)||event.fieldIds.length!==ids.length||new Set(event.fieldIds).size!==ids.length||event.fieldIds.some(id=>!cars.has(id)))fail('Frozen Relay eligibility no longer matches the Garage');
  return {info,parts,sp,rows,byRound,book,event,cars,engine,mode:EVENTS[r.eventId]};
 }
 function validateRecord(rec,row,c){const p=stageParts(row.stage);
  if(!rec||rec.position!==row.position||rec.visit!==row.visit||rec.stage!==row.stage||rec.round!==p.round||rec.group!==p.group||!Array.isArray(rec.teams)||rec.teams.length!==Number(row.workload))fail('Frozen Relay group differs from its source visit');
  if(!Array.isArray(rec.tracks)||rec.tracks.length!==3||rec.tracks.some(t=>S(t).length<3||S(t).length>100)||new Set(rec.tracks.map(t=>S(t).toLowerCase())).size!==3)fail('Frozen Relay routes invalid');
  if(!Array.isArray(rec.saved)||rec.saved.length!==3||rec.saved.some(x=>!x||typeof x!=='object'||Array.isArray(x)))fail('Frozen Relay time structure invalid');
  const ids=new Set(),names=new Set();for(const t of rec.teams){if(!t||!S(t.id)||names.has(S(t.id))||!Array.isArray(t.carIds)||t.carIds.length!==3||!S(t.label)||t.carIds.some(id=>!c.cars.has(S(id))))fail('Stored Relay has invalid team or cars');
   names.add(S(t.id));const makes=new Set(t.carIds.map(id=>S(c.cars.get(id)?.make)));
   if(makes.size!==(c.mode==='mixed'?3:1)||t.carIds.some(id=>{if(ids.has(id))return true;ids.add(id);return false;}))fail('A Relay team violates its three-car eligibility rules');
   if(c.mode==='maker'&&t.label!==S(c.cars.get(t.carIds[0]).make)+' 1')fail('Manufacturer team label has changed');
  }
  for(const map of rec.saved)for(const [id,ms] of Object.entries(map))if(!names.has(id)||!Number.isSafeInteger(ms)||ms<=0||ms>=86400000)fail('Invalid saved team-leg time');
  // Previous leg must be complete for ALL teams before another leg is saved.
  for(let leg=1;leg<3;leg++)if(Object.keys(rec.saved[leg]).length&&!rec.teams.every(t=>Object.hasOwn(rec.saved[leg-1],t.id)))fail('Relay results violate track-by-track order');
 }
 function scoreboard(rec,c){const entries=rec.teams.map(t=>({id:t.id,cars:t.carIds.map(id=>({id,make:S(c.cars.get(id).make)}))})),results=[];
  for(let leg=0;leg<3;leg++)for(const t of rec.teams)if(Object.hasOwn(rec.saved[leg],t.id))results.push({entryId:t.id,carId:t.carIds[leg],stage:leg+1,timeMs:rec.saved[leg][t.id]});
  const scored=c.engine.scoreThreeStages(entries,results);
  if(!Array.isArray(scored)||scored.length!==rec.teams.length)fail('Original Relay score engine refused current results');
  return scored.map(x=>({...x,label:rec.teams.find(t=>t.id===x.entryId)?.label||x.entryId}));
 }
 function completed(rec,c){if(!rec)return false;return rec.teams.every(t=>rec.saved.every(map=>Object.hasOwn(map,t.id)));}
 function winner(rec,c){if(!completed(rec,c))return null;const ranks=scoreboard(rec,c);
  if(ranks.length<2||!Number.isInteger(ranks[0].total)||ranks[0].total===ranks[1].total)return null;
  return ranks[0].entryId;}
 function getStatus(){const c=context(),r=c.info.row,rec=c.event.visits[r.visit]||null,usedCars=new Set(),usedMakers=new Set(),usedTeamIds=new Set();
  for(const x of c.rows){if(x.visit>r.visit)break;const saved=c.event.visits[x.visit];if(x.visit<r.visit&&!saved)fail('Earlier Relay group '+x.visit+' must be drawn first');
   if(saved){validateRecord(saved,x,c);const p=stageParts(x.stage);
    if(p.round>1){
     const earlier=c.byRound.get(p.round-1),victors=earlier.map(z=>{const previous=c.event.visits[z.row.visit],w=previous&&winner(previous,c);if(!w)fail('Earlier round contains missing or tied qualification results');return previous.teams.find(t=>t.id===w);});
     const offset=c.byRound.get(p.round).filter(z=>z.group<p.group).reduce((n,z)=>n+Number(z.row.workload),0);
     const required=victors.slice(offset,offset+saved.teams.length);
     if(required.length!==saved.teams.length||saved.teams.some((t,i)=>t.id!==required[i].id||t.carIds.join('|')!==required[i].carIds.join('|')))fail('Relay advancing group does not match previous round winners');
    }
    if(p.round===1){for(const t of saved.teams){if(usedTeamIds.has(t.id))fail('Duplicate first-round Relay team identity');usedTeamIds.add(t.id);if(c.mode==='maker'){
      const maker=S(c.cars.get(t.carIds[0]).make);if(usedMakers.has(maker))fail('Manufacturer Relay maker appears in more than one first-round team');usedMakers.add(maker);}
      for(const id of t.carIds){if(usedCars.has(id))fail('One car appears in multiple first-round Relay teams');usedCars.add(id);}}}
    if(x.visit<r.visit&&!completed(saved,c))fail('Complete all three legs for every team in earlier Relay group '+x.visit);
    if(x.visit<r.visit&&!winner(saved,c))fail('Earlier Relay group '+x.visit+' has an unresolved tie for first; no advancement permitted');
   }}
  if(rec){const p=stageParts(r.stage);if(p.round>1){const previousTeams=new Map();for(const x of c.byRound.get(p.round-1)){
      const prior=c.event.visits[x.row.visit],id=prior&&winner(prior,c);if(id){const t=prior.teams.find(t=>t.id===id);previousTeams.set(id,t);}}
      for(const t of rec.teams){const source=previousTeams.get(t.id);if(!source||t.carIds.join('|')!==source.carIds.join('|'))fail('Advancing Relay team does not match its earlier winner');}}
   }
  const taken=c.mode==='mixed'?c.event.fieldIds.filter(id=>usedCars.has(id)):c.event.fieldIds.filter(id=>usedMakers.has(S(c.cars.get(id).make)));
  const eligible=c.event.fieldIds.filter(id=>!taken.includes(id));
  const progress=rec?rec.saved.reduce((n,m)=>n+Object.keys(m).length,0):0;
  return {...c,rec,required:Number(r.workload),eligible,progress,expected:Number(r.workload)*3,done:rec?completed(rec,c):false,winnerId:rec?winner(rec,c):null};
 }
 const checkRoutes=xs=>{if(!Array.isArray(xs)||xs.length!==3||xs.some(x=>S(x).length<3||S(x).length>100)||new Set(xs.map(x=>S(x).toLowerCase())).size!==3)fail('Enter three DIFFERENT practice routes (3–100 characters)');return xs.map(S);};
 function makeSeed(){if(root.crypto?.getRandomValues){const b=new Uint32Array(1);root.crypto.getRandomValues(b);return b[0]||181;}return (Date.now()>>>0)||181;}
 function buildPreview(c,seed){const r=c.info.row,p=c.parts,needed=c.required;let candidates=[];
  if(p.round===1){const current=c.sp.cars.filter(car=>c.eligible.includes(S(car.id))).map(car=>({id:S(car.id),make:S(car.make),name:S(car.name)||[car.make,car.model,car.year].filter(Boolean).join(' ')}));
   const all=c.mode==='mixed'?c.engine.drawMixedRelay(current,seed).teams:c.engine.drawMakerRelay(current,seed);
   if(!Array.isArray(all)||all.length<needed)fail('Not enough eligible, unique three-car teams for this scheduled group');
   // Only this CURRENT group is selected/frozen; remaining cars remain eligible
   // for future groups. The rest of the engine's candidate teams are discarded.
   const usedBefore=c.rows.filter(x=>stageParts(x.stage).round===1&&x.visit<c.info.row.visit).reduce((n,x)=>n+Number(x.workload),0);
   candidates=all.slice(0,needed).map((team,i)=>{const ids=team.cars.map(car=>S(car.id));const make=S(team.cars[0]?.make);
    return {id:c.mode==='mixed'?'mixed:'+(usedBefore+i+1):'maker:'+make,label:c.mode==='mixed'?'Mixed '+(usedBefore+i+1):make+' 1',carIds:ids};});
  }else{
   const prev=c.byRound.get(p.round-1),victors=[];
   for(const x of prev){const prevRec=c.event.visits[x.row.visit],w=prevRec&&winner(prevRec,c);
    if(!w)fail('Previous Relay round '+(p.round-1)+' must produce verified, untied winners first');
    victors.push(prevRec.teams.find(t=>t.id===w));}
   const before=c.byRound.get(p.round).filter(x=>x.group<p.group).reduce((n,x)=>n+Number(x.row.workload),0);
   candidates=victors.slice(before,before+needed).map(clone);
  }
  if(candidates.length!==needed||new Set(candidates.map(t=>t.id)).size!==needed||new Set(candidates.flatMap(t=>t.carIds)).size!==needed*3)fail('Relay group has missing or duplicate teams/cars');
  for(const t of candidates){const makeSet=new Set(t.carIds.map(id=>S(c.cars.get(id)?.make)));
   if(t.carIds.length!==3||t.carIds.some(id=>!c.cars.has(id))||makeSet.size!==(c.mode==='mixed'?3:1))fail('Native Relay draw failed its car/manufacturer check');}
  return candidates;
 }
 function drawPreview(seed=makeSeed()){const c=getStatus();if(c.rec)fail('This Relay group is already locked; no redraw');if(!Number.isSafeInteger(seed)||seed<=0||seed>4294967295)fail('Random seed invalid');
  const teams=buildPreview(c,seed);preview={eventId:c.info.row.eventId,visit:c.info.row.visit,stamp:c.info.stamp,seed,teams};return clone(preview);}
 function lock(tracks){const c=getStatus(),r=c.info.row;if(c.rec)fail('This Relay group has already been locked');checkRoutes(tracks);
  const p=preview;if(!p||p.eventId!==r.eventId||p.visit!==r.visit||p.stamp!==c.info.stamp)fail('Preview this CURRENT group before locking it');
  const fresh=buildPreview(c,p.seed);if(JSON.stringify(fresh)!==JSON.stringify(p.teams))fail('Relay source field changed during preview; no lock written');
  const rec={position:r.position,visit:r.visit,stage:r.stage,round:c.parts.round,group:c.parts.group,teams:clone(p.teams),tracks:checkRoutes(tracks),saved:[{},{},{}],seed:p.seed,createdAt:new Date().toISOString()};
  c.event.visits[r.visit]=rec;c.book.events[r.eventId]=c.event;write(c.sp,c.book);preview=null;return clone(rec);
 }
 function bank(leg,teamId,time,carId){const c=getStatus(),rec=c.rec;if(!rec)fail('Lock this group draw before entering times');leg=Number(leg);teamId=S(teamId);
  if(!Number.isSafeInteger(leg)||leg<0||leg>2)fail('Unknown Relay leg');const t=rec.teams.find(x=>x.id===teamId);
  if(!t||S(carId)!==t.carIds[leg])fail('Result car is not assigned to this team and leg');
  if(Object.hasOwn(rec.saved[leg],teamId))fail('This car has already banked its Relay leg');
  if(leg>0&&!rec.teams.every(x=>Object.hasOwn(rec.saved[leg-1],x.id)))fail('Complete the previous track for ALL teams first');
  const ms=root.TET2ResultsEntry360.timeMs(time);if(!Number.isSafeInteger(ms)||ms<=0||ms>=86400000)fail('Native time entry rejected this Relay result');
  rec.saved[leg][teamId]=ms;write(c.sp,c.book);return {saved:c.progress+1,total:c.expected};
 }
 function fmt(ms){return root.TET2ResultsEntry360?.display?.(ms)||String(ms);}
 function html(info){if(info?.row?.origin!=='relay')return '';
  try{const c=getStatus(),r=c.info.row,rec=c.rec,p=preview&&preview.eventId===r.eventId&&preview.visit===r.visit&&preview.stamp===c.info.stamp?preview:null;
   const mode=c.mode==='mixed'?'🏎️ MIXED':'🏭 MANUFACTURER',teams=rec?.teams||p?.teams||[],stageIndex=rec?rec.saved.findIndex(leg=>rec.teams.some(t=>!Object.hasOwn(leg,t.id))):-1,active=stageIndex<0?2:stageIndex;
   const ranks=rec?scoreboard(rec,c):[],ranked=ranks.filter(t=>t.total!==null);
   return `<section class="t2-r378" aria-label="Relay Championship current group rehearsal"><h3>🏁 ${mode} RELAY · CURRENT GROUP</h3>
    <p class="t2-r378-alert"><b>PRELAUNCH REHEARSAL ONLY</b> · Real FH5 cars, isolated saved times. No official Evil List results, medals, route records or honours.</p>
    <div class="t2-r378-stats"><span><b>${c.required}</b><small>Teams this group</small></span><span><b>${c.parts.round}</b><small>Relay round</small></span><span><b>${c.parts.group}/${c.parts.groups}</b><small>Group / round</small></span><span><b>${c.progress}/${c.expected}</b><small>Leg times saved</small></span></div>
    ${!rec?`${p?'<div class="t2-r378-confirm">🎲 Preview ready · only THIS group is selected. Review cars and three tracks, then lock.</div>':'<p class="t2-r378-note">Draw ONLY the current group of '+c.required+' three-car teams. Later groups are not locked early. Each Mixed team has THREE different manufacturers; Manufacturer teams have THREE cars of one make.</p>'}
    ${p?`<div class="t2-r378-roster">${teams.map(t=>teamCard(t,c,null)).join('')}</div><div class="t2-r378-tracks"><h4>Three practice routes · one per leg</h4>${[0,1,2].map(n=>`<label>Leg ${n+1} route<input maxlength="100" data-t2-r378-track="${n}" autocomplete="off" placeholder="Track ${n+1} (practice)"></label>`).join('')}</div>
       <button class="t2-btn" type="button" data-t2-r378="lock">🔒 REVIEWED — LOCK CURRENT GROUP</button><button class="t2-btn t2-secondary" type="button" data-t2-r378="preview">🎲 REDRAW UNLOCKED GROUP</button>`:
      `<button class="t2-btn" type="button" data-t2-r378="preview">🎲 PREVIEW THIS GROUP'S RELAY TEAMS</button>`}`:
      `<div class="t2-r378-confirm">🔒 <b>Current group frozen.</b> Three tracks and ${c.required} teams saved only in isolated rehearsal data.</div>
       <div class="t2-r378-routegrid">${rec.tracks.map((x,i)=>`<span><small>LEG ${i+1}</small><b>${E(x)}</b></span>`).join('')}</div>
       ${c.done?`<div class="t2-r378-finish">${c.winnerId?'✓ GROUP COMPLETE · WINNER: '+E(rec.teams.find(t=>t.id===c.winnerId)?.label):'⚠️ TIED FOR FIRST — advancement BLOCKED until a verified tie resolution.'} No official honours created.</div>`:`<p class="t2-r378-note"><b>Track-by-track:</b> complete EVERY team's Leg ${active+1} before Leg ${Math.min(3,active+2)}. Each team uses a different assigned car on each leg.</p>`}
       <div class="t2-r378-roster">${rec.teams.map(t=>teamCard(t,c,active)).join('')}</div>
       ${ranked.length?`<div class="t2-r378-leaders"><h4>${c.done?'FINAL GROUP':'PROVISIONAL GROUP'} STANDINGS</h4><ol>${ranks.map(row=>`<li>${E(row.label)} — ${row.total===null?'Pending':E(fmt(row.total))}</li>`).join('')}</ol><small>Group winner progresses to this competition's next qualifying round; no medal is awarded for winning a qualifying group.</small></div>`:''}`}
    <p class="t2-r378-note">The entire Relay Championship reappears later in the Evil List; saved teams and earlier group winners are reused, never redrawn. The candidate schedule remains read-only.</p>
    <p class="t2-r378-error" data-t2-r378-error role="alert" hidden></p></section>`;
  }catch(err){return `<section class="t2-r378"><h3>🏁 RELAY CHAMPIONSHIP · CURRENT GROUP</h3><p class="t2-r378-alert" role="alert">${E(err.message)}</p><p>No official result or Garage data changed.</p></section>`;}
 }
 function teamCard(t,c,leg){return `<article class="t2-r378-team"><h4>${E(t.label)}</h4>${t.carIds.map((id,i)=>{const car=c.cars.get(id),name=S(car?.name)||[car?.make,car?.model,car?.year].filter(Boolean).join(' ')||id;
  const value=c.rec?.saved[i]?.[t.id],canSave=leg===i&&!Object.hasOwn(c.rec.saved[i],t.id);
  return `<div class="t2-r378-leg"><div class="t2-r378-car"><small>LEG ${i+1}</small><b>${E(name)}</b>${car?.h===true?'<span>H</span>':''}${car?.e===true?'<span>E✓</span>':''}</div>${value!=null?`<output>✓ ${E(fmt(value))}</output>`:canSave?`<div class="t2-r378-save"><input type="text" inputmode="numeric" autocomplete="off" data-t2-r378-time="${E(t.id)}:${i}" placeholder="0336784" aria-label="${E(t.label)} leg ${i+1} time"><button type="button" data-t2-r378="bank" data-team="${E(t.id)}" data-car="${E(id)}" data-leg="${i}">SAVE</button></div>`:''}</div>`;}).join('')}
  <p>Team total: <b>${c.rec&&c.rec.saved.every(s=>Object.hasOwn(s,t.id))?E(fmt(c.rec.saved.reduce((n,s)=>n+s[t.id],0))):'Pending'}</b></p></article>`;}
 function action(ev,go){const btn=ev.target?.closest?.('[data-t2-r378]');if(!btn)return false;
  try{const op=btn.dataset.t2R378,host=btn.closest('.t2-r378')||root.document;
   if(op==='preview')drawPreview();
   else if(op==='lock'){const fields=[...host.querySelectorAll('[data-t2-r378-track]')],tracks=[0,1,2].map(i=>fields.find(f=>f.dataset.t2R378Track===String(i))?.value||'');lock(tracks);}
   else if(op==='bank'){const t=S(btn.dataset.team),leg=Number(btn.dataset.leg),car=S(btn.dataset.car),input=[...host.querySelectorAll('[data-t2-r378-time]')].find(f=>f.getAttribute('data-t2-r378-time')===t+':'+leg);
    if(!input)fail('Could not find the time entry for this assigned car');bank(leg,t,input.value,car);}
   go('race');
  }catch(err){const p=btn.closest('.t2-r378')?.querySelector('[data-t2-r378-error]');if(p){p.textContent=S(err.message);p.hidden=false;}}
  return true;}
 return Object.freeze({getStatus,drawPreview,lock,bank,scoreboard,winner,html,action,stageParts,version:'8.0.378'});
});
