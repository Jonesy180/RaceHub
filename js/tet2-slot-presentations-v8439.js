/* OTG! MAIN 8.0.426 — TET2 neutral concept record artwork; original and completed-slot standings.
 * READS the authentic official ledger; does not write records, reset results,
 * award medals or touch any native OTG! record. Ties are NOT record breaks.
 * Both views can be rebuilt after reloading, without storing display-only state.
 */
(function(root,factory){'use strict';const api=factory(root);if(root)root.TET2SlotPresentation414=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof window!=='undefined'?window:globalThis,function(root){'use strict';
const S=x=>String(x??'').trim(), E=x=>S(x).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const LEDGER='tet2OfficialSlotLedgerV8361',SOURCE='TET2_CONTROLLED_CHAOS_LOCKED_V1';
let selected=null;
const time=n=>{if(!Number.isSafeInteger(n)||n<0)return '—';return `${String(Math.floor(n/60000)).padStart(2,'0')}:${String(Math.floor(n%60000/1000)).padStart(2,'0')}.${String(n%1000).padStart(3,'0')}`;};
const metres=n=>Number.isSafeInteger(n)?(n/100).toFixed(2)+' m':'—';
const name=(sp,id)=>S(sp.cars?.find(c=>S(c.id)===S(id))?.name)||S(id);
function get(){const sp=root.rhSpace?.();if(!sp||!Array.isArray(sp.cars))throw Error('Open the real FH5 Garage Space first');const led=sp[LEDGER];if(!led||led.source!==SOURCE||led.spaceId!==S(sp.id)||!led.slots)throw Error('Verified tournament results unavailable');const list=root.TET2AssembledList379?.snapshot?.()?.rows||[];return {sp,slots:led.slots,rows:list};}
function entries(sp,slots){const result=[];const add=(track,carId,value,kind='time')=>{if(!S(track)||!S(carId)||!Number.isSafeInteger(value)||(kind==='time'&&value<=0)||(kind==='distance'&&value<0))return;result.push({track:S(track),carId:S(carId),value,kind});};
 for(const slot of Object.values(slots||{})){
  const d=slot?.definition,r=slot?.results||{};if(!d||d.source!==SOURCE)continue;
  if(d.mode==='raceoff')for(const m of d.matches||[]){const v=r['m:'+m.id];if(!v||v.a===v.b)continue;add(m.track,m.carIds[0],v.a);add(m.track,m.carIds[1],v.b);}
  if(d.mode==='group')for(let i=0;i<(d.tracks||[]).length;i++)for(const id of d.carIds||[])add(d.tracks[i],id,r['g:'+i+':'+id]);
  if(d.mode==='relay')for(let i=0;i<(d.tracks||[]).length;i++)for(const t of d.teams||[])add(d.tracks[i],t.carIds[i],r['r:'+i+':'+t.id]);
  if(d.mode==='aero')for(const id of d.carIds||[]){add(d.track,id,r['a:drag:'+id]);add(d.jumpFacility,id,r['a:jump:'+id],'distance');}
 }
 return result;
}
function recordCandidate(sp,p){
 if(root.TET2Records439)return root.TET2Records439.candidate(sp,p);
 if(!sp||!sp[LEDGER]||!p||!['raceoff','group','relay','aero'].includes(p.mode))return null;
 let track='',carId='',value=0,kind='time';
 if(p.mode==='raceoff'){track=p.track;carId=p.timeA<p.timeB?p.carA:p.carB;value=Math.min(p.timeA,p.timeB);}
 else if(p.mode==='aero'){kind=p.discipline==='jump'?'distance':'time';track=kind==='distance'?p.jumpFacility:p.track;carId=p.carId;value=kind==='distance'?p.distanceCm:p.timeMs;}
 else {track=p.track;carId=p.carId;value=p.timeMs;}
 if(!S(track)||!S(carId)||!Number.isSafeInteger(value)||(kind==='time'&&value<=0)||(kind==='distance'&&value<0))return null;
 const prior=entries(sp,sp[LEDGER].slots).filter(r=>r.track===S(track)&&r.kind===kind).sort((a,b)=>kind==='distance'?b.value-a.value:a.value-b.value)[0];
 if(prior&&(kind==='distance'?value<=prior.value:value>=prior.value))return null;
 return {track:S(track),carName:name(sp,carId),value:kind==='distance'?metres(value):time(value),previous:prior?(kind==='distance'?metres(prior.value):time(prior.value)):null,kind,first:!prior};
}
function recordCard(r){if(!r)return '';
 if(root.TET2Records439)return root.TET2Records439.card(r.immediate||r,false);
 // Display ONLY the approved neutral TET2 concept car; never render the competing
 // car's make/model as artwork. Its real name and time remain dynamic text fields.
 const headline=r.first?'FIRST TET2 COURSE RECORD!':'NEW TET2 COURSE RECORD!';
 const prior=r.previous?'PREVIOUS BEST · '+E(r.previous):'FIRST OFFICIAL TET2 RESULT ON THIS '+(r.kind==='distance'?'RUNWAY':'COURSE');
 return `<div class="t2-record-scrim414" role="dialog" aria-modal="true" aria-label="${E(headline)}" data-t2-record-screen="yes"><div class="t2-record-card414 t2-record-card417"><div class="t2-record-kicker414">TET2 · THE EVIL TOURNAMENT</div><div class="t2-record-mast417">🏆 NEW RECORD! 🏆</div><div class="t2-record-hero417"><img src="assets/tet2-neutral-record-hero-v8417.webp" alt="Chief Tech Penguin, Dave and Steve celebrating with the approved fictional silver TET2 concept car" draggable="false"></div><h2>${E(headline)}</h2><div class="t2-record-details417"><p class="t2-record-route414">${E(r.track)}</p><p class="t2-record-car414">${E(r.carName)}</p><div class="t2-record-time414">${E(r.value)}</div><p class="t2-record-before414">${prior}</p></div><p class="t2-record-note414">Official TET2 result saved · OTG! records unchanged.</p><button type="button" class="t2-record-next414" data-t2-action="continue-record">CONTINUE RESULTS →</button></div></div>`;
}
function sortedTable(rows,fmt,sp,limit){const sorted=[...rows].sort((a,b)=>a.score-b.score||S(a.label).localeCompare(S(b.label)));return sorted.slice(0,limit||10000).map((r,i)=>`<tr><td>${i+1}</td><td>${E(r.label||name(sp,r.id))}</td><td>${fmt(r.score)}</td></tr>`).join('');}
function table(title,rows,fmt,sp,caption){return `<section class="t2-results-board414"><h3>${E(title)}</h3>${caption?'<p>'+E(caption)+'</p>':''}<div class="t2-results-scroll414"><table><thead><tr><th>#</th><th>Entrant</th><th>${fmt===metres?'Distance':'Combined time'}</th></tr></thead><tbody>${sortedTable(rows,fmt,sp)}</tbody></table></div></section>`;}
function currentResults(slot,sp){const d=slot.definition,r=slot.results||{};if(d.mode==='raceoff'){
  const matches=(d.matches||[]).map(m=>({m,v:r['m:'+m.id]})).filter(x=>x.v);
  return `<section class="t2-results-board414"><h3>CURRENT ROUND · MATCH WINNERS</h3><p>These are winners of the matches in THIS slot, not the final championship standings.</p><ol class="t2-results-matches414">${matches.map(({m,v})=>`<li><strong>${E(name(sp,v.winnerId))}</strong><small>Beat ${E(name(sp,m.carIds.find(id=>id!==v.winnerId)))} · ${time(Math.min(v.a,v.b))} vs ${time(Math.max(v.a,v.b))}</small></li>`).join('')}</ol></section>`;
 }
 if(d.mode==='relay'){
  const teams=(d.teams||[]).map(t=>({id:t.id,label:t.label,score:(d.tracks||[]).reduce((n,_,i)=>n+(r['r:'+i+':'+t.id]||0),0)}));
  return table('CURRENT GROUP · RELAY STANDINGS',teams,time,sp,'Three legs per team. Group results only; championship medals are not awarded here.');
 }
 if(d.mode==='group'){
  const cars=(d.carIds||[]).map(id=>({id,score:(d.tracks||[]).reduce((n,_,i)=>n+(r['g:'+i+':'+id]||0),0)}));
  return table('TIMED STANDINGS · THIS VISIT',cars,time,sp,'Combined times from the tracks raced in this slot.');
 }
 if(d.mode==='aero'){
  const drag=(d.carIds||[]).map(id=>({id,score:r['a:drag:'+id]})).filter(x=>Number.isSafeInteger(x.score));
  const jump=(d.carIds||[]).map(id=>({id,score:r['a:jump:'+id]})).filter(x=>Number.isSafeInteger(x.score)).map(x=>({...x,score:-x.score}));
  return table('AERÓDROMO · DRAG TIMES',drag,time,sp,'Fastest drag wins.')+(jump.length?table('AERÓDROMO · LONG JUMP',jump,v=>metres(-v),sp,'Longest jump wins; each car gets one attempt.'):'');
 }
 return '<p>Results have been saved for this slot.</p>';
}
function roundAccumulation(ctx,row,slot){
 const {sp,rows,slots}=ctx,d=slot.definition;
 if(d.mode==='group'&&row?.eventId==='T2-GAUNTLET-ALL'){
  const cars=[];
  for(const r of rows.filter(r=>r.eventId===row.eventId)){
   const s=slots['TET2-'+r.position],def=s?.definition;if(!s?.completedAt||def?.mode!=='group')continue;
   for(const id of def.carIds||[]){const values=def.tracks.map((_,i)=>s.results['g:'+i+':'+id]);if(values.every(v=>Number.isSafeInteger(v)&&v>0))cars.push({id,score:values.reduce((a,b)=>a+b,0)});}
  }
  return table('CURRENT GAUNTLET · ALL COMPLETED BATCHES',cars,time,sp,`${cars.length} cars have completed their three courses. This is a provisional ranking.`);
 }
 if(d.mode==='raceoff'&&row?.origin==='swiss'){
  const scores=new Map();
  for(const r of rows.filter(r=>r.eventId===row.eventId&&r.position<=row.position)){
   const s=slots['TET2-'+r.position];if(!s?.completedAt||s.definition?.mode!=='raceoff')continue;
   for(const m of s.definition.matches||[]){const v=s.results['m:'+m.id];if(!v)continue;
    for(const id of m.carIds){const s=scores.get(id)||{id,wins:0,losses:0};s[id===v.winnerId?'wins':'losses']++;scores.set(id,s);}
   }
  }
  const ranked=[...scores.values()].sort((a,b)=>b.wins-a.wins||a.losses-b.losses||name(sp,a.id).localeCompare(name(sp,b.id)));
  return `<section class="t2-results-board414"><h3>SWISS CUP · CURRENT WIN / LOSS TABLE</h3><p>Provisional wins and losses from completed matches only. No final ranking or medals implied.</p><div class="t2-results-scroll414"><table><thead><tr><th>#</th><th>Car</th><th>W</th><th>L</th></tr></thead><tbody>${ranked.map((s,i)=>`<tr><td>${i+1}</td><td>${E(name(sp,s.id))}</td><td>${s.wins}</td><td>${s.losses}</td></tr>`).join('')}</tbody></table></div></section>`;
 }
 return '';
}
function medalBlock(ctx,row){try{const a=root.tet2HonoursBridge358?.results?.(ctx.sp,ctx.sp.cars)?.receipts||[];const all=a.filter(r=>r.eventId===row.eventId||r.eventId?.startsWith(row.eventId+':'));
 if(!all.length)return '';
 return `<section class="t2-results-board414 t2-medals414"><h3>🏆 FINAL HONOURS · VERIFIED</h3>${all.map(rec=>`<h4>${E(rec.kind||rec.eventId)}</h4>${root.TET2AwardArt426?.podium?.(rec,ctx.sp,ctx.rows)||''}<div class="t2-podium414"><p>🥇 ${rec.medals.gold.map(id=>E(name(ctx.sp,id))).join(' · ')}</p><p>🥈 ${rec.medals.silver.map(id=>E(name(ctx.sp,id))).join(' · ')}</p>${rec.medals.bronze.length?`<p>🥉 ${rec.medals.bronze.map(id=>E(name(ctx.sp,id))).join(' · ')}</p>`:''}</div>`).join('')}</section>`;
 }catch(_){return ''}}
function openSummary(slotId){if(!/^TET2-\d+$/.test(S(slotId)))throw Error('Invalid tournament slot ID');const ctx=get(),slot=ctx.slots[S(slotId)];if(!slot?.completedAt||slot.definition?.source!==SOURCE)throw Error('Only officially completed slots have finalised summaries');selected=S(slotId);return true;}
function summaryHtml(){try{const ctx=get(),slot=ctx.slots[selected];if(!slot?.completedAt)throw Error('Completed results could not be found');const row=ctx.rows.find(r=>'TET2-'+r.position===selected)||{name:slot.definition.label,stage:'',eventId:slot.definition.competitionId},visits=ctx.rows.filter(r=>r.eventId===row.eventId),totalDone=visits.filter(r=>!!ctx.slots['TET2-'+r.position]?.completedAt).length;const honours=medalBlock(ctx,row),isFinal=!!honours||(visits.length>0&&totalDone===visits.length);
 return `<div class="t2-results-page414"><p class="t2-results-kicker414">✅ MARK AS DONE · ${E(selected.replace('TET2-','SLOT '))}</p><h2>${isFinal?'FINAL STANDINGS':'CURRENT STANDINGS / RESULTS'}</h2><p class="t2-results-sub414"><strong>${E(row.name)}</strong> · ${E(row.stage)}</p><p class="t2-results-progress414">${totalDone} / ${visits.length} scheduled visits completed for this competition${!isFinal?' · Competition still in progress':''}</p>${currentResults(slot,ctx.sp)}${roundAccumulation(ctx,row,slot)}${root.TET2Records439?.roundReport?.(ctx.sp,selected)||''}${root.TET2Records439?.card?.(root.TET2Records439?.roundAward?.(ctx.sp,selected),true)||''}${honours||(isFinal?'<p class="t2-results-future414">The event is complete, but final honours have not been verified. No medals shown.</p>':'<p class="t2-results-future414">No medals yet — this competition has not reached a verified final result.</p>')}<button type="button" class="t2-btn t2-results-next414" data-t2-page="race">CONTINUE TO RACE CONTROL →</button></div>`;
 }catch(e){return `<div class="t2-results-page414"><h2>RESULTS SAVED</h2><p>${E(e.message)}</p><button type="button" class="t2-btn" data-t2-page="race">RACE CONTROL →</button></div>`;}}
function summaryLink(slotId){return `<button type="button" class="t2-summary-link414" data-t2-summary-slot="${E(slotId)}">📊 VIEW SLOT STANDINGS</button>`;}
return Object.freeze({recordCandidate,recordCard,openSummary,summaryHtml,summaryLink,_entries:entries,_get:get,_medalBlock:medalBlock});
});
