/* OTG! MAIN 8.0.379 — full-Garage Swiss Cup rehearsals, one cup drawn at a time.
 * Swiss system follows the existing OTG custom Swiss ranking/pairing rules:
 * wins -> opponent wins -> total time; avoid rematches where possible;
 * 16 entrants, four Swiss rounds, top eight knockout, separate bronze duel.
 * STRICTLY no rhSave(), Garage/OTG results/records/honours writes, or official slots.
 */
(function(root,factory){'use strict';const api=factory(root);if(root)root.TET2Swiss379=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis,function(root){
'use strict';
const SOURCE='TET2_SWISS_REHEARSAL_8379',PREFIX='tet2.prelaunch.swiss-rehearsal.v8379.',FIELD=16,STAGES=8;
const S=v=>String(v??'').trim(),E=v=>S(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fail=m=>{throw Error('Swiss safe stop: '+m);};
const clone=x=>JSON.parse(JSON.stringify(x));
function hash(s){let h=2166136261>>>0;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}return h>>>0;}
function shuffle(ids,seed){const a=ids.slice();let n=hash(seed)||1;for(let i=a.length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const j=n%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
function getSpace(){const sp=root.rhSpace?.();if(!sp||sp.catalogueKey!=='fh5-catalogue-v1'||!Array.isArray(sp.cars)||!S(sp.id))fail('Select the current FH5 Catalogue Garage');const ids=sp.cars.map(c=>S(c?.id));if(!ids.length||ids.some(id=>!id)||new Set(ids).size!==ids.length)fail('Garage needs distinct, stable car IDs');return sp;}
function storage(){const x=root.localStorage;if(!x||typeof x.getItem!=='function'||typeof x.setItem!=='function')fail('Private rehearsal storage unavailable');return x;}
function key(sp){return PREFIX+encodeURIComponent(S(sp.id));}
function read(sp){let raw;try{raw=storage().getItem(key(sp));}catch(_){fail('Cannot read Swiss rehearsal storage');}if(!raw)return{schema:1,source:SOURCE,spaceId:S(sp.id),cups:{}};
 let b;try{b=JSON.parse(raw);}catch(_){fail('Saved Swiss rehearsal is damaged; refusing to overwrite');}if(!b||b.schema!==1||b.source!==SOURCE||b.spaceId!==S(sp.id)||!b.cups||Array.isArray(b.cups)||typeof b.cups!=='object')fail('Saved Swiss rehearsal does not belong to this FH5 Space');return b;}
function write(sp,book){if(book.source!==SOURCE||book.spaceId!==S(sp.id))fail('Wrong Swiss rehearsal storage scope');try{storage().setItem(key(sp),JSON.stringify(book));}catch(_){fail('Cannot save isolated Swiss rehearsal');}}
function cupNumber(id){const m=/^T2-SWISS-(\d+)$/.exec(S(id));if(!m||Number(m[1])<1)return null;return Number(m[1]);}
function swissStage(i){return i<=4?'Swiss round '+i:i===5?'Quarterfinals':i===6?'Semifinals':i===7?'Bronze-medal duel':'Final';}
function stageSize(i){return i<=4?8:i===5?4:i===6?2:1;}
function standings(ids,visits){const scores=new Map(ids.map(id=>[id,{id,wins:0,opps:[],time:0,oppWins:0}]));for(let i=1;i<=4;i++){
 const v=visits[i];if(!v?.done)continue;
 for(const p of v.pairs){const a=scores.get(p.a),b=scores.get(p.b);if(!a||!b||![p.a,p.b].includes(p.winnerId))fail('Swiss result references another car');
  a.opps.push(b.id);b.opps.push(a.id);a.time+=p.times[p.a];b.time+=p.times[p.b];scores.get(p.winnerId).wins++;}
 }
 for(const s of scores.values())s.oppWins=s.opps.reduce((sum,id)=>sum+(scores.get(id)?.wins||0),0);
 return [...scores.values()].sort((a,b)=>b.wins-a.wins||b.oppWins-a.oppWins||a.time-b.time||ids.indexOf(a.id)-ids.indexOf(b.id));
}
function played(visits,a,b){return [1,2,3,4].some(i=>visits[i]?.done&&visits[i].pairs.some(p=>(p.a===a&&p.b===b)||(p.a===b&&p.b===a)));}
function swissPairs(fieldIds,visits,round,cupId){const earlier=Object.fromEntries(Object.entries(visits).filter(([i])=>Number(i)<round));let ids=round===1?shuffle(fieldIds,'SWISS-CUP-ROUND-1:'+cupId):standings(fieldIds,earlier).map(s=>s.id);const pairs=[];while(ids.length){const a=ids.shift(),ix=ids.findIndex(b=>!played(earlier,a,b));const b=ids.splice(ix<0?0:ix,1)[0];if(!b)fail('Swiss pairing left an unmatched car');pairs.push({a,b,times:{},winnerId:null});}return pairs;}
function stagePairs(event,visit){const ids=event.fieldIds,v=event.visits;if(visit<=4)return swissPairs(ids,v,visit,event.eventId);
 if(visit===5){const ranked=standings(ids,v),a=ranked[7],b=ranked[8];if(!a||!b)fail('Swiss qualification standings incomplete');if(a.wins===b.wins&&a.oppWins===b.oppWins&&a.time===b.time)fail('Unresolved tie at Swiss Top Eight cut');return [[0,7],[1,6],[2,5],[3,4]].map(([i,j])=>({a:ranked[i].id,b:ranked[j].id,times:{},winnerId:null}));}
 const q=v[5],s=v[6];if(visit===6){if(!q?.done)fail('Quarterfinals are not complete');return [[0,3],[1,2]].map(([i,j])=>({a:q.pairs[i].winnerId,b:q.pairs[j].winnerId,times:{},winnerId:null}));}
 if(!s?.done)fail('Semifinals must finish before bronze or final');if(visit===7)return [{a:loser(s.pairs[0]),b:loser(s.pairs[1]),times:{},winnerId:null}];if(!v[7]?.done)fail('Bronze medal duel must finish BEFORE the final');
 return[{a:s.pairs[0].winnerId,b:s.pairs[1].winnerId,times:{},winnerId:null}];
}
function loser(p){return p.winnerId===p.a?p.b:p.winnerId===p.b?p.a:fail('Winner is not in the semifinals');}
function validateVisit(v,index,event){if(!v||v.visit!==index||v.stage!==swissStage(index)||!S(v.track)||S(v.track).length<3||S(v.track).length>100||!Array.isArray(v.pairs)||v.pairs.length!==stageSize(index))fail('Stored Swiss stage identity or route is invalid');
 const expected=stagePairs(event,index),set=new Set();for(let n=0;n<v.pairs.length;n++){
  const p=v.pairs[n],ex=expected[n];if(!p||p.a!==ex.a||p.b!==ex.b||p.a===p.b||set.has(p.a)||set.has(p.b)||!event.fieldIds.includes(p.a)||!event.fieldIds.includes(p.b)||!p.times||typeof p.times!=='object')fail('Swiss stage pairing was changed');set.add(p.a);set.add(p.b);
  const keys=Object.keys(p.times);if(keys.some(k=>![p.a,p.b].includes(k)||!Number.isSafeInteger(p.times[k])||p.times[k]<=0||p.times[k]>=86400000))fail('Swiss banked time corrupted');
  if(keys.length===2){if(p.times[p.a]===p.times[p.b]||p.winnerId!==(p.times[p.a]<p.times[p.b]?p.a:p.b))fail('Unresolved Swiss result tie or wrong winner');}
  else if(p.winnerId!==null)fail('Incomplete Swiss match cannot have a winner');
  if(v.done&&keys.length!==2)fail('Swiss stage declared complete without all results');
 }
}
let preview=null;
function context(){const info=root.TET2EventRouter375?.inspect?.(),row=info?.row,sp=getSpace();if(!row||row.origin!=='swiss'||row.family!=='Swiss'||!cupNumber(row.eventId)||row.visit<1||row.visit>STAGES)fail('Select a Swiss Cup appearance from Evil List');
 if(typeof root.TET2ResultsEntry360?.timeMs!=='function')fail('Original OTG time parser not installed');
 const snap=root.TET2AssembledList379?.snapshot?.();if(!snap?.audit?.ok||!Array.isArray(snap.rows))fail('Verified candidate schedule missing');
 const owned=sp.cars.length,nCups=Math.ceil(owned/FIELD),cupNo=cupNumber(row.eventId);if(cupNo>nCups)fail('Swiss Cup number is outside this Garage');
 const rows=snap.rows.filter(r=>r.eventId===row.eventId).sort((a,b)=>a.visit-b.visit);
 if(rows.length!==8||rows.some((r,i)=>r.visit!==i+1||r.visitTotal!==8||r.stage!==swissStage(i+1)||r.position<1||r.origin!=='swiss'||r.format!==(i<4?'SWISS':i===6?'BRONZE':'KNOCKOUT')||Number(r.workload)!==stageSize(i+1)))fail('Swiss eight-stage programme differs from the verified schedule');
 const book=read(sp),maps=new Map(sp.cars.map(c=>[S(c.id),c]));const otherIds=new Set(),events=Object.values(book.cups);
 for(const ev of events){if(!ev||!cupNumber(ev.eventId)||ev.source!==SOURCE||ev.stamp!==info.stamp||!Number.isInteger(ev.cupNo)||ev.cupNo!==cupNumber(ev.eventId)||!Array.isArray(ev.fieldIds)||ev.fieldIds.length!==FIELD||new Set(ev.fieldIds).size!==FIELD||!ev.fieldIds.every(id=>maps.has(id))||!ev.visits||typeof ev.visits!=='object')fail('Swiss saved field/timetable changed. Do not silently redraw or delete it');
  for(const id of ev.fieldIds){if(otherIds.has(id))fail('One car was allocated to two Swiss Cups');otherIds.add(id);}
  for(let i=1;i<=8;i++)if(ev.visits[i]){if(i>1&&!ev.visits[i-1]?.done)fail('Swiss stage was started before prior stage completion');validateVisit(ev.visits[i],i,ev);}
 }
 const event=book.cups[row.eventId]||null;
 const unused=sp.cars.filter(c=>!otherIds.has(S(c.id)));
 const incomplete=event?false:unused.length<FIELD;
 return{info,row,rows,sp,book,event,cupNo,nCups,unused,maps,incomplete};}
function previewStage(){const c=context(),r=c.row,e=c.event;if(r.visit>1&&(!e||!e.visits[r.visit-1]?.done))fail('Complete the earlier Swiss appearance before drawing this one');if(e?.visits[r.visit])fail('This Swiss visit is already locked');if(c.incomplete)fail('Fewer than 16 unallocated cars remain; this pending cup cannot draw yet');
 const field=e?.fieldIds||shuffle(c.unused.map(x=>S(x.id)),'TET2-SWISS-DRAW:'+c.sp.id+':'+r.eventId+':'+c.info.stamp).slice(0,FIELD);
 const working=e||{source:SOURCE,eventId:r.eventId,cupNo:c.cupNo,stamp:c.info.stamp,fieldIds:field,visits:{}};
 const pairs=stagePairs(working,r.visit);preview={eventId:r.eventId,visit:r.visit,stamp:c.info.stamp,fieldIds:field,pairs};return clone(preview);
}
function lockStage(track){const c=context(),r=c.row,t=S(track);if(t.length<3||t.length>100)fail('Enter a real track name (3–100 characters) before locking');if(!preview||preview.eventId!==r.eventId||preview.visit!==r.visit||preview.stamp!==c.info.stamp)fail('Preview the current Swiss stage before locking it');if(c.event?.visits[r.visit])fail('This stage is already locked');
 if(r.visit>1&&!c.event?.visits[r.visit-1]?.done)fail('Earlier visit still in progress');const e=c.event||{source:SOURCE,eventId:r.eventId,cupNo:c.cupNo,stamp:c.info.stamp,fieldIds:preview.fieldIds,visits:{}};
 const expected=stagePairs(e,r.visit);if(JSON.stringify(expected)!==JSON.stringify(preview.pairs))fail('Swiss proposed pairings changed');
 const rec={visit:r.visit,stage:swissStage(r.visit),track:t,pairs:clone(preview.pairs),done:false};
 e.visits[r.visit]=rec;c.book.cups[r.eventId]=e;write(c.sp,c.book);preview=null;return clone(rec);
}
function saveTime(matchIndex,side,raw){const c=context(),v=c.event?.visits[c.row.visit];if(!v||v.done)fail('Draw and lock this Swiss visit first');const p=v.pairs[Number(matchIndex)],id=side==='a'?p?.a:side==='b'?p?.b:null;if(!id)fail('Invalid match or competitor');if(Object.hasOwn(p.times,id))fail('This car has already banked its time');
 const ms=root.TET2ResultsEntry360.timeMs(S(raw));if(!Number.isSafeInteger(ms)||ms<=0||ms>=86400000)fail('Enter a valid race time, e.g. 0336784 for 03:36.784');
 const other=id===p.a?p.b:p.a;if(p.times[other]===ms)fail('Equal times need an agreed tie resolution; no winner can be invented');p.times[id]=ms;
 if(Object.hasOwn(p.times,other))p.winnerId=ms<p.times[other]?id:other;
 write(c.sp,c.book);return{ms,winnerId:p.winnerId};}
function finish(){const c=context(),v=c.event?.visits[c.row.visit];if(!v)fail('Stage has not been locked');if(v.done)return true;if(v.pairs.some(p=>!p.winnerId))fail('Every match needs both times before this visit can finish');v.done=true;write(c.sp,c.book);return true;}
const formatMs=ms=>{if(!Number.isFinite(ms))return'—';const m=Math.floor(ms/60000),s=Math.floor((ms%60000)/1000),d=ms%1000;return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')+'.'+String(d).padStart(3,'0');};
function html(){try{const c=context(),r=c.row,ev=c.event,v=ev?.visits[r.visit],earlier=r.visit===1||ev?.visits[r.visit-1]?.done;const p=preview?.eventId===r.eventId&&preview?.visit===r.visit&&preview?.stamp===c.info.stamp?preview:null;
 const availability=c.incomplete?`<div class="t2-r379-warning">Only ${c.unused.length} unused cars remain for this cup. An incomplete 16-car field stays PENDING; no phantom drivers or byes are created. Later eligible additions require a safe schedule recheck.</div>`:'';
 const summary=ev?`Field frozen: <b>${ev.fieldIds.length} cars</b> · completed rounds ${Object.values(ev.visits).filter(x=>x.done).length}/8`:`Not drawn · ${c.unused.length} eligible cars currently unallocated`;
 let body='';if(!earlier)body=`<div class="t2-r379-warning">🔒 Finish Swiss Cup ${c.cupNo}, appearance ${r.visit-1}, before ${E(r.stage)}. This cup resumes when its later Evil List visit comes around.</div>`;
 else if(!v&&!p)body=`${availability}<p class="t2-r379-help">The next draw selects <b>this cup only</b>. No cars are duplicated across frozen Swiss Cups. Pairings follow OTG's Swiss standings rules; no official races are started.</p><button class="t2-btn" type="button" data-t2-swiss="preview" ${c.incomplete?'disabled':''}>🎲 PREVIEW THIS CUP’S ${FIELD}-CAR DRAW</button>`;
 else if(!v&&p)body=`<div class="t2-r379-warning">PREVIEW ONLY — not frozen. Review ${p.pairs.length} matches and enter the current route before locking.</div><div class="t2-r379-preview">${p.pairs.map((m,i)=>`<div><b>${i+1}.</b> ${E(c.maps.get(m.a)?.name)} <em>vs</em> ${E(c.maps.get(m.b)?.name)}</div>`).join('')}</div><label class="t2-r379-route">Track / route for this visit<input type="text" id="t2-r379-track" maxlength="100" placeholder="Enter verified FH5 track name" autocomplete="off"></label><button type="button" class="t2-btn" data-t2-swiss="lock">🔒 LOCK THIS SWISS VISIT</button>`;
 else{
  const matches=v.pairs.map((m,i)=>{const parts=[m.a,m.b].map(id=>{const saved=Object.hasOwn(m.times,id),car=c.maps.get(id);return `<div class="t2-r379-time"><label><strong>${E(car?.name||id)}</strong>${saved?`<output>${formatMs(m.times[id])}</output>`:`<input type="tel" inputmode="numeric" data-t2-swiss-input="${i}:${id===m.a?'a':'b'}" maxlength="7" placeholder="0336784" aria-label="Time for ${E(car?.name||id)}">`}</label>${saved?'<small>✓ SAVED</small>':`<button type="button" data-t2-swiss="save" data-index="${i}" data-side="${id===m.a?'a':'b'}">SAVE</button>`}</div>`;}).join('');return `<article class="t2-r379-match"><header>MATCH ${i+1} ${m.winnerId?'<b>✓ COMPLETE</b>':''}</header>${parts}${m.winnerId?`<div class="t2-r379-winner">Winner: ${E(c.maps.get(m.winnerId)?.name)}</div>`:''}</article>`;}).join('');
  body=`<div class="t2-r379-locked">🔒 ${E(v.track)} · ${v.pairs.filter(x=>x.winnerId).length}/${v.pairs.length} matches complete ${v.done?'· VISIT FINISHED':''}</div><div class="t2-r379-matches">${matches}</div>`;
  if(!v.done&&v.pairs.every(m=>m.winnerId))body+=`<button class="t2-btn" type="button" data-t2-swiss="finish">✅ FINISH REHEARSAL VISIT</button>`;
  if(v.done)body+=`<div class="t2-r379-done">✅ Saved and completed. ${r.visit===8?'This rehearsal Cup has reached its final.':'The next Swiss Cup appearance will use these actual saved results.'}</div>`;
 }
 let table='';if(ev){const completed=Math.min(4,Object.values(ev.visits).filter(x=>x.done&&x.visit<=4).length);if(completed){const rank=standings(ev.fieldIds,ev.visits);table=`<details class="t2-r379-standings"><summary>Swiss standings · ${completed}/4 rounds</summary><div class="t2-r379-table">${rank.map((x,i)=>`<div><b>${i+1}.</b><span>${E(c.maps.get(x.id)?.name)}</span><strong>${x.wins} W</strong><small>Opp ${x.oppWins} · ${formatMs(x.time)}</small></div>`).join('')}</div></details>`;}}
 return `<section class="t2-r379"><h3>🏆 SWISS CUP ${String(c.cupNo).padStart(2,'0')} · CURRENT VISIT</h3><div class="t2-r379-meta"><div><b>${c.nCups}</b><small>Full-Garage Swiss Cups</small></div><div><b>${FIELD}</b><small>Cars per full Cup</small></div><div><b>${r.visit}/8</b><small>${E(swissStage(r.visit))}</small></div></div><p class="t2-r379-help">${summary}. Four Swiss rounds → top-eight quarterfinals → semifinals → bronze-medal duel → final.</p><div class="t2-r379-warning"><b>PRELAUNCH REHEARSAL ONLY.</b> Isolated browser saves; NO OTG! records, official medals, Garage writes or tournament completion.</div><div id="t2-r379-message" role="status" hidden></div>${body}${table}</section>`;
 }catch(err){return `<div class="t2-r379-error" role="alert">${E(err.message)}</div>`;}}
function action(ev,update){const button=ev.target?.closest?.('[data-t2-swiss]');if(!button)return false;try{const what=button.dataset.t2Swiss;
 if(what==='preview')previewStage();else if(what==='lock')lockStage(root.document?.getElementById('t2-r379-track')?.value);else if(what==='save'){const i=Number(button.dataset.index),side=button.dataset.side;const parent=button.closest('.t2-r379-time'),input=parent?.querySelector('input[data-t2-swiss-input]');saveTime(i,side,input?.value);}else if(what==='finish')finish();else fail('Unknown Swiss action');update('race');
 }catch(err){const note=root.document?.getElementById('t2-r379-message');if(note){note.hidden=false;note.textContent=S(err.message);note.className='t2-r379-error';}else if(root.console?.warn)root.console.warn(err);}return true;}
return Object.freeze({context,previewStage,lockStage,saveTime,finish,standings,swissPairs,stagePairs,html,action,stageSize,stageName:swissStage,version:'8.0.379'});
});
