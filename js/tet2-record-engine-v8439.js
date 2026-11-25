/* OTG! MAIN v8.0.439 — official TET2 genuine records, independent of native OTG! records.
 First results are benchmarks, not records. Each qualifying time is compared to
 PRE-BANK official results. No medals, standings or competition draws are modified.
 Round-end awards are scoped to a verified completed round, not a partial slot.
*/
(function(root,factory){'use strict';const api=factory(root);if(root)root.TET2Records439=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof window!=='undefined'?window:globalThis,function(root){'use strict';
const KEY='tet2OfficialSlotLedgerV8361',AWARDS='tet2RecordAwardsV8439',SOURCE='TET2_CONTROLLED_CHAOS_LOCKED_V1';
const S=x=>String(x??'').trim(), E=x=>S(x).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const good=(v,kind)=>Number.isSafeInteger(v)&&(kind==='distance'?v>=0:v>0);
const better=(a,b,kind)=>kind==='distance'?a>b:a<b;
const fmt=(v,kind)=>{if(!Number.isSafeInteger(v))return '—';if(kind==='distance')return (v/100).toFixed(2)+' m';return `${String(Math.floor(v/60000)).padStart(2,'0')}:${String(Math.floor((v%60000)/1000)).padStart(2,'0')}.${String(v%1000).padStart(3,'0')}`;};
const difference=(v,prior,kind)=>kind==='distance'?'+'+((v-prior)/100).toFixed(2)+' m':'−'+fmt(prior-v,'time');
const best=(a,kind)=>a.slice().sort((x,y)=>kind==='distance'?y.value-x.value:x.value-y.value)[0]||null;
const carName=(sp,id)=>S(sp.cars?.find(c=>S(c.id)===S(id))?.name)||S(id);
function ledger(sp){const b=sp?.[KEY];return b?.source===SOURCE&&b.spaceId===S(sp.id)&&b.slots&&typeof b.slots==='object'?b:null;}
function schedule(){return root.TET2AssembledList379?.snapshot?.()?.rows||[];}
function rowPhase(r){if(!r)return 'UNKNOWN';
 const phase=S(r.sourcePhase);if(r.origin==='historical'&&phase)return 'H:'+phase;
 return 'S:'+S(r.stage).replace(/\s*[·•]\s*batch\s+\d+\s*\/\s*\d+/ig,'').replace(/\s*[·•]\s*group\s+\d+\s*\/\s*\d+/ig,'').replace(/\s*[·•]\s*source visit\s+\d+\s+of\s+\d+/ig,'').trim();}
function readEntries(sp){const b=ledger(sp);if(!b)return [];
 const result=[];const add=(slotId,d,resultKey,carId,track,value,kind='time',complete=false)=>{
  if(!S(track)||!S(carId)||!good(value,kind))return;
  result.push({slotId,competitionId:d.competitionId,key:resultKey+'|'+S(carId),carId:S(carId),track:S(track),kind,value,complete});
 };
 for(const [slotId,slot] of Object.entries(b.slots).sort((a,b)=>Number(a[0].match(/\d+$/)?.[0]||0)-Number(b[0].match(/\d+$/)?.[0]||0))){
  const d=slot?.definition,r=slot?.results||{};if(d?.source!==SOURCE)continue;
  const done=!!slot.completedAt;
  if(d.mode==='group')for(let i=0;i<(d.tracks||[]).length;i++)for(const id of d.carIds||[])add(slotId,d,'g:'+i+':'+id,id,d.tracks[i],r['g:'+i+':'+id],'time',done);
  if(d.mode==='relay')for(let i=0;i<(d.tracks||[]).length;i++)for(const t of d.teams||[])add(slotId,d,'r:'+i+':'+t.id,t.carIds[i],d.tracks[i],r['r:'+i+':'+t.id],'time',done);
  if(d.mode==='aero')for(const id of d.carIds||[]){add(slotId,d,'a:drag:'+id,id,d.track,r['a:drag:'+id],'time',done);add(slotId,d,'a:jump:'+id,id,d.jumpFacility,r['a:jump:'+id],'distance',done);}
  if(d.mode==='raceoff')for(const m of d.matches||[]){const v=r['m:'+m.id];if(!v)continue;add(slotId,d,'m:'+m.id,m.carIds[0],m.track,v.a,'time',done);add(slotId,d,'m:'+m.id,m.carIds[1],m.track,v.b,'time',done);}
 }
 return result;
}
function incoming(p){let a=[];
 if(p.mode==='raceoff')a=[{carId:p.carA,value:p.timeA},{carId:p.carB,value:p.timeB}].map(x=>({...x,track:p.track,kind:'time',key:'m:'+p.matchId+'|'+S(x.carId)}));
 else if(p.mode==='group')a=[{carId:p.carId,value:p.timeMs,kind:'time',track:p.track,key:'g:'+p.trackIndex+':'+p.carId+'|'+S(p.carId)}];
 else if(p.mode==='relay')a=[{carId:p.carId,value:p.timeMs,kind:'time',track:p.track,key:'r:'+p.leg+':'+p.teamId+'|'+S(p.carId)}];
 else if(p.mode==='aero')a=[{carId:p.carId,value:p.discipline==='jump'?p.distanceCm:p.timeMs,kind:p.discipline==='jump'?'distance':'time',track:p.discipline==='jump'?p.jumpFacility:p.track,key:'a:'+p.discipline+':'+p.carId+'|'+S(p.carId)}];
 return a.filter(x=>good(x.value,x.kind)&&S(x.track)&&S(x.carId));}
function officialDoneCompetitions(sp,rows){const b=ledger(sp),all=schedule(),out=new Set();
 for(const id of new Set(all.map(r=>S(r.eventId)).filter(Boolean))){const visits=all.filter(r=>S(r.eventId)===id);
  if(visits.length&&visits.every(r=>!!b.slots['TET2-'+r.position]?.completedAt))out.add(id);
 }return out;}
function candidate(sp,p){if(!ledger(sp)||!p?.slotId||!p?.competitionId)return null;
 const previous=readEntries(sp),compDone=officialDoneCompetitions(sp,previous),qualifying=[];
 const arrivals=incoming(p);
 for(const x of arrivals){const relevant=previous.filter(r=>r.track===S(x.track)&&r.kind===x.kind);
  const prevPB=best(relevant.filter(r=>r.carId===S(x.carId)),x.kind);
  const global=best(relevant,x.kind);
  const history=new Set(relevant.filter(r=>r.complete&&r.competitionId!==p.competitionId&&compDone.has(r.competitionId)).map(r=>r.competitionId));
  const pb=!!prevPB&&better(x.value,prevPB.value,x.kind);
  // Two OTHER, completed competitions must already have established a history on this same course.
  const trackRecord=history.size>=2&&!!global&&better(x.value,global.value,x.kind);
  if(pb||trackRecord)qualifying.push({...x,pb,trackRecord,carName:carName(sp,x.carId),slotId:S(p.slotId),competitionId:S(p.competitionId),previous:trackRecord?global.value:prevPB?.value||null});
 }
 const immediate=qualifying.filter(x=>x.pb||x.trackRecord).sort((a,b)=>Number(b.trackRecord)-Number(a.trackRecord)||Math.abs((b.previous||b.value)-b.value)-Math.abs((a.previous||a.value)-a.value))[0]||null;
 return qualifying.length?{observations:qualifying,immediate:immediate?{...immediate,type:immediate.trackRecord?'track':'pb'}:null}:null;
}
function memo(sp){const a=sp?.[AWARDS];return a&&a.schema===1&&a.spaceId===S(sp.id)&&a.items&&a.seen?a:{schema:1,spaceId:S(sp.id),items:{},seen:{}};}
function commit(sp,candidate){if(!candidate?.observations?.length||!ledger(sp)||typeof root.rhSave!=='function')return;
 const previous=sp[AWARDS],state=JSON.parse(JSON.stringify(memo(sp)));
 for(const x of candidate.observations){const id=S(x.slotId)+'|'+S(x.key);if(state.items[id])continue;state.items[id]={slotId:x.slotId,key:x.key,pb:x.pb,trackRecord:x.trackRecord,kind:x.kind,track:x.track,value:x.value,previous:x.previous,carId:x.carId};}
 sp[AWARDS]=state;try{root.rhSave();}catch(e){if(previous===undefined)delete sp[AWARDS];else sp[AWARDS]=previous;root.console?.warn?.('TET2 record award note was not saved; the official race time remains safe',e);}
}
function getRound(sp,slotId){const rows=schedule(),current=rows.find(r=>'TET2-'+r.position===S(slotId));if(!current)return null;
 const phase=rowPhase(current),roundRows=rows.filter(r=>S(r.eventId)===S(current.eventId)&&rowPhase(r)===phase),b=ledger(sp);
 if(!roundRows.length||!b||roundRows.some(r=>!b.slots['TET2-'+r.position]?.completedAt)||current.position!==Math.max(...roundRows.map(r=>r.position)))return null;
 return {current,phase,rows:roundRows,roundId:current.eventId+'|'+phase,allRows:rows};
}
function roundAward(sp,slotId){const round=getRound(sp,slotId);if(!round)return null;
 const {current,rows,allRows,roundId}=round,state=memo(sp);
 if(state.seen[roundId])return null;
 const roundSlots=new Set(rows.map(r=>'TET2-'+r.position));
 const earned=Object.values(state.items).filter(x=>roundSlots.has(x.slotId));
 const entries=readEntries(sp).filter(r=>roundSlots.has(r.slotId));
 // An event record compares ONLY equivalent course results from a PREVIOUS fully completed round of the SAME event.
 const earlier=allRows.filter(r=>S(r.eventId)===S(current.eventId)&&r.position<Math.min(...rows.map(q=>q.position)));
 const pastPhases=[...new Set(earlier.map(rowPhase))];const finished=new Set();
 for(const phase of pastPhases){const rs=allRows.filter(r=>S(r.eventId)===S(current.eventId)&&rowPhase(r)===phase);if(rs.length&&rs.every(r=>!!ledger(sp).slots['TET2-'+r.position]?.completedAt))for(const r of rs)finished.add('TET2-'+r.position);}
 const prior=readEntries(sp).filter(r=>finished.has(r.slotId));
 const event=[];for(const track of new Set(entries.map(r=>r.track))){for(const kind of ['time','distance']){
  const now=best(entries.filter(r=>r.track===track&&r.kind===kind),kind),before=best(prior.filter(r=>r.track===track&&r.kind===kind),kind);
  if(now&&before&&better(now.value,before.value,kind))event.push({...now,previous:before.value,event:true,carName:carName(sp,now.carId)});
 }}
 const enriched=event.map(x=>({...x,pb:earned.some(e=>e.key===x.key&&e.slotId===x.slotId&&e.pb),trackRecord:earned.some(e=>e.key===x.key&&e.slotId===x.slotId&&e.trackRecord)}));
 // Prefer the rarest combined achievement, never fabricate a double from different cars.
 enriched.sort((a,b)=>(Number(b.pb)+Number(b.trackRecord))-(Number(a.pb)+Number(a.trackRecord))||Math.abs((b.previous||b.value)-b.value)-Math.abs((a.previous||a.value)-a.value));
 let chosen=enriched[0]||null,kind=chosen?(chosen.pb&&chosen.trackRecord?'triple':chosen.pb||chosen.trackRecord?'double':'event'):null;
 if(!chosen){const double=earned.filter(x=>x.pb&&x.trackRecord).sort((a,b)=>Math.abs((b.previous||b.value)-b.value)-Math.abs((a.previous||a.value)-a.value))[0];if(double){chosen=double;kind='double';}}
 if(!chosen)return null;
 const s=chosen,base=Object.assign({},s,{type:kind,kind:s.kind||'time',competitionName:S(current.name),roundName:S(current.stage),roundId,previous:s.previous??null,value:s.value,carName:s.carName||carName(sp,s.carId),track:s.track,achievements:{pb:!!s.pb,event:!!s.event,track:!!s.trackRecord}});
 return base;
}
function roundReport(sp,slotId){const round=getRound(sp,slotId);if(!round)return '';
 const ids=new Set(round.rows.map(r=>'TET2-'+r.position)),all=readEntries(sp).filter(r=>ids.has(r.slotId));
 const topics=[...new Set(all.map(r=>r.kind+'|'+r.track))].sort();
 const line=topics.map(topic=>{const [kind,...parts]=topic.split('|'),track=parts.join('|');const fastest=all.filter(r=>r.kind===kind&&r.track===track).sort((a,b)=>kind==='distance'?b.value-a.value:a.value-b.value).slice(0,3);
  return `<div class="t2-round-course439"><h4>${E(track)}</h4><table><thead><tr><th>Fastest this round</th><th>${kind==='distance'?'Distance':'Time'}</th></tr></thead><tbody>${fastest.map(r=>`<tr><td>${E(carName(sp,r.carId))}</td><td>${fmt(r.value,kind)}</td></tr>`).join('')}</tbody></table></div>`;
 }).join('');
 return `<section class="t2-round-summary439"><h3>ROUND COMPLETE · ${round.rows.length} SLOT${round.rows.length===1?'':'S'}</h3><p><strong>${E(round.current.name)}</strong> · ${E(round.current.stage)}<br>${all.length} saved performance${all.length===1?'':'s'} across this complete round.</p><p>Fastest performances from the entire round, including earlier slots. Rankings are <strong>not</strong> medals or a championship winner.</p>${line}</section>`;
}
function acknowledge(sp,roundId){if(!ledger(sp)||!S(roundId)||typeof root.rhSave!=='function')return false;
 const prev=sp[AWARDS],state=JSON.parse(JSON.stringify(memo(sp)));state.seen[S(roundId)]=true;sp[AWARDS]=state;
 try{root.rhSave();return true;}catch(e){if(prev===undefined)delete sp[AWARDS];else sp[AWARDS]=prev;return false;}
}
const art={pb:'pb',event:'event',track:'track',double:'double',triple:'triple'};
function card(r,round=false){if(!r||!art[r.type])return '';
 const a=art[r.type],headline={pb:'PERSONAL BEST!',event:'EVENT RECORD!',track:'ALL-TIME TRACK RECORD!',double:'DOUBLE RECORD BREAKER!',triple:'TRIPLE RECORD BREAKER!'}[a];
 const before=Number.isSafeInteger(r.previous)?fmt(r.previous,r.kind):'—';const after=fmt(r.value,r.kind);
 const changed=Number.isSafeInteger(r.previous)?difference(r.value,r.previous,r.kind):'—';
 const competition=round&&r.competitionName?`<div class="t2-record-event439">${E(r.competitionName)} · ${E(r.roundName)}</div>`:'';
 const flags=r.achievements?`<div class="t2-record-flags439">${[['pb','PERSONAL BEST'],['event','EVENT RECORD'],['track','ALL-TIME TRACK RECORD']].filter(([k])=>r.achievements[k]).map(([,v])=>`<span>${v}</span>`).join('')}</div>`:'';
 const action=round?'continue-award439':'continue-record';
 const eventRibbon=a==='event'?`<div class="t2-record-image-event439">${E(r.competitionName||'EVENT')} · ${E(r.roundName||'ROUND COMPLETE')}</div>`:'';
 return `<div class="t2-record-overlay439" data-t2-record-screen="yes" role="dialog" aria-modal="true" aria-label="${headline}"><section class="t2-record-wrap439" data-record-type="${a}"><div class="t2-record-art439"><img alt="Approved cinematic TET2 ${E(headline)} celebration artwork" src="assets/tet2-records-v8439/${a}-art.webp">${eventRibbon}</div><div class="t2-record-info439"><h2>${headline}</h2>${competition}${flags}<p><b>${E(r.carName)}</b> · ${E(r.track)}</p><div class="t2-record-values439"><div>PREVIOUS<strong>${before}</strong></div><div>NEW RECORD<strong>${after}</strong></div><div>IMPROVEMENT<strong>${changed}</strong></div></div><button type="button" data-t2-action="${action}" ${round?`data-round-id="${E(r.roundId)}"`:''}>${round?'BACK TO ROUND RESULTS':'CONTINUE RACING'} →</button></div></section></div>`;
}
return Object.freeze({candidate,commit,roundAward,roundReport,acknowledge,card,readEntries,_phase:rowPhase,_round:getRound,version:'8.0.439'});
});
