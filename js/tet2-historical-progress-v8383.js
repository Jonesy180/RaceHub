/* OTG! Main v8.0.383 — Source-linked historical competition progression.
 * Prelaunch rehearsals only. New visits depend on COMPLETE, validated prior
 * results, frozen car IDs, source stop-when instructions and candidate-field
 * equality; never writes to OTG! stores, medals, or official TET2 slots.
 * Does not alter or migrate the v8.0.382 first-visit rehearsal ledger.
 */
(function(root,factory){'use strict';const api=factory(root);root.TET2HistoricalProgress383=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof window!=='undefined'?window:globalThis,function(root){
'use strict';
const S=x=>String(x??'').trim(),esc=x=>S(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone=o=>JSON.parse(JSON.stringify(o)),err=s=>{throw Error('Historical progress safe stop: '+s)};
const OLD_SOURCE='TET2_HISTORICAL_REHEARSAL_8382',NEW_SOURCE='TET2_HISTORICAL_PROGRESS_8383';
const OLD_PREFIX='tet2.prelaunch.historical.v8382.',NEW_PREFIX='tet2.prelaunch.historical.progress.v8383.';
const idKey=x=>encodeURIComponent(S(x));
const matchRole=s=>{const a=S(s).toUpperCase();if(/^PRELIMINARY\b/.test(a))return 'PRELIMINARY';const r=a.match(/^ROUND OF (\d+)\b/);if(r)return 'ROUND OF '+r[1];if(/^QUARTER[ -]FINAL\b/.test(a))return 'QUARTER-FINAL';if(/^SEMI[ -]FINAL\b/.test(a))return 'SEMI-FINAL';if(/^FINAL\b/.test(a))return 'FINAL';return null;};
const festivalRole=s=>{const a=S(s).toUpperCase();let m=a.match(/STAGE (\d+) GROUP (\d+)\/(\d+)/);if(m)return {kind:'groups',level:Number(m[1]),number:Number(m[2]),total:Number(m[3])};if(/RUN THE FINAL/.test(a))return {kind:'final'};if(/RUN ROUND/.test(a))return {kind:'standard'};return null;};
const countTracks=stage=>{
 if(stage.fmt==='GROUPS'){const m=S(stage.action).match(/•\s*(\d+) TRACKS?/i);return m?Number(m[1]):null;}
 if(stage.fmt==='STANDARD'){const m=S(stage.action).match(/RUN ROUNDS?\s+(\d+)\s*[–-]\s*(\d+)/i);return m?Number(m[2])-Number(m[1])+1:1;}
 return 1;
};
function complete(rec){if(!rec||!Array.isArray(rec.ids)||!Array.isArray(rec.tracks))return false;
 if(rec.mode==='raceoff')return rec.matches?.length>0&&rec.matches.every(m=>Object.hasOwn(rec.saved,m.id));
 return Array.isArray(rec.saved)&&rec.saved.length===rec.tracks.length&&rec.saved.every(track=>rec.ids.every(id=>Object.hasOwn(track,id)));
}
function validateRecord(rec,row,stamp,allowedPool){
 if(!rec||rec.stamp!==stamp||rec.eventId!==row.eventId||rec.position!==row.position||rec.visit!==row.visit)err('Saved visit signature differs from the current timetable; nothing changed');
 const old=row.visit===1,src=old?OLD_SOURCE:NEW_SOURCE,mode=row.mode==='Race Off'?'raceoff':'group';
 if(rec.source!==src||rec.mode!==mode||!Array.isArray(rec.ids)||!rec.ids.length||new Set(rec.ids).size!==rec.ids.length||rec.ids.some(id=>!allowedPool.has(id)))err('Saved car identities are invalid or not in the present Garage');
 if(!Array.isArray(rec.tracks)||rec.tracks.some(t=>S(t).length<3)||rec.tracks.length!==rec.trackCount||!rec.saved||typeof rec.saved!=='object')err('Saved results have an invalid format');
 if(mode==='raceoff'){
   if(!Array.isArray(rec.matches)||rec.matches.length*2!==rec.ids.length||rec.amount!==rec.matches.length||rec.tracks.length!==1||Array.isArray(rec.saved))err('Knockout match count or route changed');
   const unique=new Set();for(const m of rec.matches){if(!S(m.id)||!Array.isArray(m.cars)||m.cars.length!==2||m.cars[0]===m.cars[1]||m.cars.some(id=>!rec.ids.includes(id)||unique.has(id)))err('Knockout pairing contains repeated or foreign entrants');m.cars.forEach(id=>unique.add(id));}
   if(unique.size!==rec.ids.length||Object.keys(rec.saved).some(mid=>!rec.matches.some(m=>m.id===mid)))err('Unexpected saved match');
   for(const m of rec.matches){const v=rec.saved[m.id];if(!v)continue;if(!Number.isSafeInteger(v.a)||v.a<=0||!Number.isSafeInteger(v.b)||v.b<=0||v.a===v.b||v.winnerId!==(v.a<v.b?m.cars[0]:m.cars[1]))err('Saved result does not match the winning car');}
 }else{
   if(!Number.isInteger(rec.amount)||rec.amount!==rec.ids.length||!Array.isArray(rec.saved)||rec.saved.length!==rec.tracks.length)err('Festival group or route count changed');
   for(const track of rec.saved){if(!track||typeof track!=='object'||Array.isArray(track)||Object.keys(track).some(id=>!rec.ids.includes(id)))err('Saved group contains an unexpected car');for(const t of Object.values(track))if(!Number.isSafeInteger(t)||t<=0||t>=86400000)err('Invalid saved stage time');}
 }
 if(rec.ids.length*rec.tracks.length!==(row.format==='BRONZE'?2:Number(row.workload)))err('Recorded stage workload differs from source visit');
}
function winners(rec){if(!complete(rec)||rec.mode!=='raceoff')err('Knockout winners require every prior match to be saved');return rec.matches.map(m=>rec.saved[m.id].winnerId);}
function losers(rec){if(!complete(rec)||rec.mode!=='raceoff')err('Knockout losers require every prior match to be saved');return rec.matches.map(m=>m.cars.find(id=>id!==rec.saved[m.id].winnerId));}
function ranked(rec){if(!complete(rec)||rec.mode!=='group')err('Group qualifiers require every car to finish every track');
 const totals=rec.ids.map(id=>({id,total:rec.saved.reduce((sum,t)=>sum+t[id],0)})).sort((a,b)=>a.total-b.total||a.id.localeCompare(b.id));
 if(totals.length>2&&totals[1].total===totals[2].total)err('Tied Top 2 qualification: resolve legitimately before progression');
 return totals;
}
function sourceRows(info){
 const snap=root.TET2AssembledList379?.snapshot?.();if(!snap?.audit?.ok||!Array.isArray(snap.rows))err('Candidate schedule audit failed');
 const source=root.TET2HistoricalSource383?.[info.row.eventId];if(!source||!Array.isArray(source.visits))err('Original stage instructions unavailable');
 const rows=snap.rows.filter(r=>r.origin==='historical'&&r.eventId===info.row.eventId).sort((a,b)=>a.visit-b.visit);
 if(rows.length!==info.row.visitTotal||!rows.length||rows.some((r,i)=>r.visit!==i+1||r.visitTotal!==rows.length))err('Historical schedule visits or ordinal positions are inconsistent');
 const hasSemi=source.visits.some(v=>matchRole(v.action)==='SEMI-FINAL');
 const expectBronze=info.row.mode==='Race Off'&&hasSemi;
 if(rows.filter(r=>r.format==='BRONZE').length!==(expectBronze?1:0)||rows.length!==source.visits.length+(expectBronze?1:0))err('Bronze-duel scheduling differs from verified source');
 let offset=0;
 const stages=rows.map(r=>{
  let s;
  if(r.format==='BRONZE')s={fmt:'BRONZE',workload:2,action:'BRONZE-MEDAL DUEL · losing semifinalists only',stop:'Bronze medal decided before final.'};
  else {s=source.visits[offset++];if(!s||s.fmt!==r.format||Number(s.workload)!==Number(r.workload))err('Source stage identity or workload changed');}
  return {row:r,source:s,role:r.mode==='Race Off'?(r.format==='BRONZE'?'BRONZE':matchRole(s.action)):festivalRole(s.action)};
 });
 if(offset!==source.visits.length||!stages.some(v=>v.row.visit===info.row.visit))err('Source visits could not be reconciled');
 if(expectBronze){const sem=stages.findIndex(s=>s.role==='SEMI-FINAL'),br=stages.findIndex(s=>s.role==='BRONZE'),fin=stages.findIndex(s=>s.role==='FINAL');if(!(sem>=0&&sem<br&&br<fin))err('Bronze duel must fall between semifinals and final');}
 return {snap,source,stages};
}
function bookRead(prefix,space){let raw;try{raw=root.localStorage?.getItem?.(prefix+idKey(space.id));}catch(_){err('Isolated rehearsal storage unavailable');}if(!raw)return null;try{return JSON.parse(raw);}catch(_){err('Existing rehearsal save could not be read. Nothing was overwritten');}}
function bookWrite(sp,book){if(book?.source!==NEW_SOURCE||book.spaceId!==S(sp.id)||book.schema!==1)err('Incorrect rehearsal book destination');try{if(typeof root.localStorage?.setItem!=='function')err('Local rehearsal storage unavailable');root.localStorage.setItem(NEW_PREFIX+idKey(sp.id),JSON.stringify(book));}catch(_){err('Rehearsal save failed; no result accepted');}}
function readAll(c){
 const old=bookRead(OLD_PREFIX,c.sp),newBook=bookRead(NEW_PREFIX,c.sp)||{schema:1,source:NEW_SOURCE,spaceId:S(c.sp.id),stamp:c.info.stamp,records:{}};
 if(old&&(old.source!==OLD_SOURCE||old.schema!==1||old.spaceId!==S(c.sp.id)||!old.records||typeof old.records!=='object'))err('v382 rehearsal source/Space mismatch');
 if(newBook.source!==NEW_SOURCE||newBook.schema!==1||newBook.spaceId!==S(c.sp.id)||newBook.stamp!==c.info.stamp||!newBook.records||typeof newBook.records!=='object')err('Saved later-stage schedule changed; no data overwritten');
 const priorBook=newBook.records[c.info.row.eventId]||{};
 const oldRec=old?.records?.[c.info.row.eventId]||null;
 const records=new Map();
 for(const st of c.stages){let rec=st.row.visit===1?oldRec:priorBook[st.row.visit];if(rec){validateRecord(rec,st.row,c.info.stamp,c.eligible);records.set(st.row.visit,rec);}}
 return {old,newBook,records};
}
function ensureCompletePredecessors(c){const target=c.info.row.visit;for(const st of c.stages){if(st.row.visit>=target)break;const r=c.records.get(st.row.visit);if(!r)return `Finish and save visit ${st.row.visit} (${st.source.action}) before this one`;if(!complete(r))return `Visit ${st.row.visit} has ${r.mode==='raceoff'?Object.keys(r.saved).length:r.saved.reduce((n,x)=>n+Object.keys(x).length,0)} saved entries; complete that visit first`; }return null;}
function deriveKnockout(c,st){
 const role=st.role;if(!role)err('Unknown original knockout round');
 if(role==='BRONZE'||role==='FINAL'){
   const semi=c.stages.filter(s=>s.role==='SEMI-FINAL');
   if(role==='BRONZE'){
     if(!semi.length)err('No semifinal in original source');
     const ids=semi.flatMap(s=>losers(c.records.get(s.row.visit)));
     if(ids.length!==2)err('Exactly two losing semifinalists required');return {ids,fixed:true,note:'Two verified losing semifinalists; bronze is before the final.'};
   }
   if(semi.length){const ids=semi.flatMap(s=>winners(c.records.get(s.row.visit)));if(ids.length!==2)err('Exactly two semifinal winners required');return {ids,fixed:true,note:'Two verified semifinal winners; bronze results must already be saved.'};}
   // Two- or three-car original brackets can have no semifinal or bronze.
 }
 const round=role;
 const same=c.stages.filter(s=>s.role===round);
 if(!same.length)err('Knockout round not found');
 const first=same[0],firstIndex=c.stages.indexOf(first),allPrevious=c.stages.slice(0,firstIndex);
 const earlierRoles=[...new Set(allPrevious.map(s=>s.role).filter(x=>x!=='BRONZE'))];const previousRole=earlierRoles.at(-1)||null;
 let ids=[];
 if(!previousRole){ids=c.pool.cars.map(x=>S(x.id));}
 else{
   const prev=c.stages.filter(s=>s.role===previousRole);
   const win=prev.flatMap(s=>winners(c.records.get(s.row.visit)));
   const everUsed=new Set(allPrevious.flatMap(s=>c.records.get(s.row.visit)?.ids||[]));
   const neverUsed=c.pool.cars.map(x=>S(x.id)).filter(id=>!everUsed.has(id));
   const target=same.reduce((n,s)=>n+Number(s.row.workload),0);
   const needed=target-win.length;
   if(needed<0||needed>neverUsed.length)err('Original bracket requires an impossible number of byes');
   if(previousRole!=='PRELIMINARY'&&needed!==0)err('Unexpected later-round byes are not source-authorised');
   if(needed!==neverUsed.length)err('Source byes would exclude or resurrect competitors');
   ids=win.concat(neverUsed);
 }
 const total=same.reduce((n,s)=>n+Number(s.row.workload),0);
 if(round==='PRELIMINARY'){if(total>ids.length||((ids.length-total)%1)!==0)err('Preliminary workload exceeds the eligible roster');}
 else if(total!==ids.length)err('Round entrants do not match the exact source stage workload');
 const earlierSame=same.filter(s=>s.row.visit<st.row.visit);
 const used=new Set(earlierSame.flatMap(s=>c.records.get(s.row.visit)?.ids||[]));
 const remaining=ids.filter(id=>!used.has(id));
 if(remaining.length<Number(st.row.workload))err('Insufficient unused eligible entrants for current knockout visit');
 return {ids:remaining,fixed:remaining.length===Number(st.row.workload),note:previousRole?`Advancing winners from ${previousRole}${round==='ROUND OF 16'&&previousRole==='PRELIMINARY'?' plus original byes':''}`:'First-round candidate cars not already used in this bracket.'};
}
function deriveFestival(c,st){
 if(st.source.fmt==='STANDARD'){
   const first=c.records.get(1);if(!first)err('First source cohort has not been drawn');
   const firstRole=festivalRole(c.stages[0].source.action);
   if(firstRole?.kind!=='standard'||c.stages.some(s=>s.source.fmt!=='STANDARD'))err('Mixed Festival modes require separate audit');
   if(first.ids.length*countTracks(st.source)!==Number(st.row.workload))err('Cohort size differs from the source round');
   return {ids:first.ids.slice(),fixed:true,note:'Exactly the same locked cars as the previous Championship round.'};
 }
 if(st.source.fmt!=='GROUPS'||!st.role)err('Unsupported original Festival stage combination');
 const role=st.role;
 const phase=role.kind==='final'?Math.max(...c.stages.map(s=>s.role?.level||0)):role.level;
 if(!Number.isInteger(phase)||phase<1||phase>5)err('Unrecognised Festival qualification stage');
 let poolIds=[];
 const initial=role.kind==='groups'&&phase===1;
 if(initial){poolIds=c.pool.cars.map(x=>S(x.id));}
 else{
  const fromLevel=role.kind==='final'?phase:phase-1;
  const from=c.stages.filter(s=>s.role?.kind==='groups'&&s.role.level===fromLevel);
  if(!from.length)err('Earlier Festival group phase is missing');
  if(!from.every(s=>/Top 2/i.test(S(s.source.stop))))err('Original source does not explicitly establish Top 2 advancement');
  poolIds=from.flatMap(s=>ranked(c.records.get(s.row.visit)).slice(0,2).map(x=>x.id));
 }
 const same=c.stages.filter(s=>role.kind==='final'?s.role?.kind==='final':s.role?.kind==='groups'&&s.role.level===phase);
 const total=same.reduce((n,s)=>n+Number(s.row.workload)/countTracks(s.source),0);
 if(!Number.isInteger(total)||total!==poolIds.length)err('Festival round field does not equal all source-authorised qualifiers');
 const used=new Set(same.filter(s=>s.row.visit<st.row.visit).flatMap(s=>c.records.get(s.row.visit)?.ids||[]));
 const remaining=poolIds.filter(id=>!used.has(id));
 if(remaining.length<Number(st.row.workload)/countTracks(st.source))err('Not enough unassigned cars in this qualification round');
 return {ids:remaining,fixed:remaining.length===Number(st.row.workload)/countTracks(st.source),note:initial?'New entrants not used in an earlier stage-one group':`Top 2 from every completed stage ${role.kind==='final'?phase:phase-1} group; no redraw of eliminated cars.`};
}
function meta(){
 const info=root.TET2EventRouter375?.inspect?.();if(info?.row?.origin!=='historical'||!['Race Off','Festival'].includes(info.row.mode))err('A historical source visit must be selected');
 if(info.row.visit===1)err('Original first visit belongs to the v382 rehearsal adapter');
 if(!S(info.stamp))err('Original schedule signature is missing');
 const sp=root.rhSpace?.();if(!sp||sp.catalogueKey!=='fh5-catalogue-v1'||!S(sp.id)||!Array.isArray(sp.cars)||new Set(sp.cars.map(x=>S(x.id))).size!==sp.cars.length||sp.cars.some(x=>!S(x.id)))err('Valid FH5 Space required');
 const {snap,source,stages}=sourceRows(info);
 const pool=root.TET2Historical382?.eligibility?.({info,sp,src:source});if(!pool?.resolved)err('The historical candidate Garage category cannot be derived safely');
 const eligible=new Set(pool.cars.map(x=>S(x.id)));if(eligible.size!==pool.cars.length)err('Repeated candidate Garage car');
 const current=stages.find(s=>s.row.visit===info.row.visit);if(!current||current.row.position!==info.row.position)err('Selected stage does not belong to this event');
 const stamp=info.stamp,map=new Map(sp.cars.map(x=>[S(x.id),x]));
 return {info,sp,src:source,stages,pool,eligible,map,current,snap};
}
function status(){const c=meta(),b=readAll(c);Object.assign(c,b);
 if(c.pool.candidateCount!==c.src.sourceCount)return {...c,ready:false,reason:`Historical source recorded ${c.src.sourceCount} eligible cars; the current provisional Garage filter finds ${c.pool.candidateCount}. Cannot silently exclude or invent entrants. Eligibility reconciliation is required.`};
 const waiting=ensureCompletePredecessors(c);if(waiting)return {...c,ready:false,reason:waiting};
 let derived;try{derived=c.info.row.mode==='Race Off'?deriveKnockout(c,c.current):deriveFestival(c,c.current);}catch(e){return {...c,ready:false,reason:S(e.message)};}
 const tracks=countTracks(c.current.source);
 const amount=c.info.row.mode==='Race Off'?(c.current.row.format==='BRONZE'?1:Number(c.current.row.workload)/2):Number(c.current.row.workload)/tracks;
 if(!Number.isInteger(tracks)||tracks<1||tracks>3||!Number.isInteger(amount)||amount<1||amount>64||(c.info.row.mode==='Race Off'?(c.current.row.format==='BRONZE'?amount:Number(amount)*2):amount*tracks)!==Number(c.current.row.workload))return {...c,ready:false,reason:'Unsupported source stage size or track arrangement'};
 const size=c.info.row.mode==='Race Off'?amount*2:amount;
 if(derived.ids.length<size)return {...c,ready:false,reason:'Only '+derived.ids.length+' source-derived car(s) available; this visit requires '+size};
 const currentRec=c.records.get(c.info.row.visit)||null;
 if(currentRec&&(!derived.ids.every(id=>c.eligible.has(id))||currentRec.ids.some(id=>!derived.ids.includes(id))))return {...c,ready:false,reason:'Frozen stage entrants no longer match their original qualified field; saved results protected'};
 const saved=currentRec?(currentRec.mode==='raceoff'?Object.keys(currentRec.saved).length:currentRec.saved.reduce((n,x)=>n+Object.keys(x).length,0)):0;
 return {...c,ready:true,spec:{mode:c.info.row.mode==='Race Off'?'raceoff':'group',amount,size,tracks,required:c.info.row.mode==='Race Off'?amount:amount*tracks,derived},rec:currentRec,saved};
}
let preview=null;
function draw(){const c=status();if(!c.ready)err(c.reason);if(c.rec)err('This stage is already locked');
 const d=c.spec.derived;
 let ids=[];
 if(d.fixed){ids=d.ids.slice();}
 else{
  if(typeof root.TET2SlotDraw363?.selectFromGarage!=='function')err('Native FH5 draw engine is missing');
  const r=root.TET2SlotDraw363.selectFromGarage({mode:c.spec.mode,...(c.spec.mode==='raceoff'?{matches:c.spec.amount}:{count:c.spec.amount}),eligibleCarIds:d.ids,preview:true});
  if(r.mode!==c.spec.mode)err('Native draw mode changed');
  ids=c.spec.mode==='raceoff'?r.matches?.flatMap(m=>[S(m.carA.id),S(m.carB.id)]):r.group?.map(x=>S(x.id));
 }
 if(!Array.isArray(ids)||ids.length!==c.spec.size||new Set(ids).size!==ids.length||ids.some(id=>!d.ids.includes(id)))err('Draw did not respect the qualified car pool');
 preview={stamp:c.info.stamp,eventId:c.info.row.eventId,position:c.info.row.position,ids};return clone(preview);
}
function lock(routes){const c=status();if(!c.ready)err(c.reason);if(c.rec)err('Previously locked rehearsal cannot be re-drawn');
 if(!preview||preview.stamp!==c.info.stamp||preview.position!==c.info.row.position||preview.eventId!==c.info.row.eventId||preview.ids.length!==c.spec.size||preview.ids.some(id=>!c.spec.derived.ids.includes(id)))err('Draw preview expired or qualifications changed');
 const tracks=routes.map(S);if(tracks.length!==c.spec.tracks||tracks.some(t=>t.length<3||t.length>100))err('Enter '+c.spec.tracks+' valid practice track name(s)');
 const r=c.info.row;
 const rec={source:NEW_SOURCE,stamp:c.info.stamp,eventId:r.eventId,position:r.position,visit:r.visit,mode:c.spec.mode,amount:c.spec.amount,trackCount:tracks.length,tracks,ids:preview.ids.slice(),saved:c.spec.mode==='raceoff'?{}:tracks.map(()=>({})),matches:c.spec.mode==='raceoff'?Array.from({length:c.spec.amount},(_,i)=>({id:'m'+(i+1),cars:preview.ids.slice(2*i,2*i+2)})):undefined};
 validateRecord(rec,r,c.info.stamp,c.eligible);
 const book=clone(c.newBook);book.records[r.eventId] ||= {};if(book.records[r.eventId][r.visit])err('A result was saved for this stage while drawing');book.records[r.eventId][r.visit]=rec;
 bookWrite(c.sp,book);preview=null;return clone(rec);
}
function bank(p){const c=status();if(!c.ready||!c.rec)err(c.reason||'Lock the current qualified stage first');const rec=clone(c.rec);
 const expectedSlot='HISTORICAL-PROGRESS-'+c.info.row.position;
 if(S(p?.slotId)!==expectedSlot||S(p?.competitionId)!==c.info.row.eventId||p.mode!==rec.mode)err('Result belongs to a different stage');
 if(rec.mode==='raceoff'){
  const m=rec.matches.find(m=>m.id===S(p.matchId));if(!m||Object.hasOwn(rec.saved,m.id)||S(p.track)!==rec.tracks[0]||S(p.carA)!==m.cars[0]||S(p.carB)!==m.cars[1])err('Incorrect or already banked pairing');
  if(!Number.isSafeInteger(p.timeA)||p.timeA<=0||!Number.isSafeInteger(p.timeB)||p.timeB<=0||p.timeA===p.timeB||S(p.winnerId)!==(p.timeA<p.timeB?m.cars[0]:m.cars[1]))err('Two different valid times and correct winner required');
  rec.saved[m.id]={a:p.timeA,b:p.timeB,winnerId:S(p.winnerId)};
 }else{
  if(!Number.isInteger(p.trackIndex)||p.trackIndex<0||p.trackIndex>=rec.tracks.length||S(p.track)!==rec.tracks[p.trackIndex]||!rec.ids.includes(S(p.carId))||Object.hasOwn(rec.saved[p.trackIndex],S(p.carId))||!Number.isSafeInteger(p.timeMs)||p.timeMs<=0||p.timeMs>=86400000)err('Invalid or repeated track / car result');
  rec.saved[p.trackIndex][S(p.carId)]=p.timeMs;
 }
 validateRecord(rec,c.info.row,c.info.stamp,c.eligible);
 const book=clone(c.newBook);book.records[c.info.row.eventId][c.info.row.visit]=rec;bookWrite(c.sp,book);return {saved:true,complete:complete(rec)};
}
function open(){const c=status();if(!c.ready||!c.rec)err(c.reason||'Lock this visit first');if(typeof root.TET2ResultsEntry360?.openTrial!=='function')err('Native results entry is missing');
 const car=id=>{const x=c.map.get(id);if(!x)err('Saved car no longer exists in Garage');return {id,name:S(x.name)||[x.make,x.model,x.year].filter(Boolean).join(' '),h:x.h===true,e:x.e===true};};
 const rec=c.rec;const config={source:'TET2_DRAW_PRACTICE_V8363',spaceId:S(c.sp.id),slotId:'HISTORICAL-PROGRESS-'+c.info.row.position,competitionId:rec.eventId,label:'HISTORICAL '+c.info.row.mode.toUpperCase()+' · STAGE '+c.info.row.visit+' REHEARSAL',stageRehearsal:true,mode:rec.mode,onBank:async p=>bank(p),onExit:()=>root.TET2Stage4UI359?.page('race')};
 if(rec.mode==='raceoff')Object.assign(config,{matches:rec.matches.map(m=>({id:m.id,track:rec.tracks[0],cars:m.cars.map(car)})),saved:clone(rec.saved)});
 else Object.assign(config,{cars:rec.ids.map(car),tracks:rec.tracks.slice(),saved:clone(rec.saved)});
 root.TET2ResultsEntry360.openTrial(config);return {opened:true,saved:c.saved};
}
function summary(c){
 const visit=c.info.row.visit;return `<div class="t2-p383-visits">${c.stages.filter(s=>s.row.visit<visit).slice(-4).map(s=>{const r=c.records.get(s.row.visit);return `<div><span>Visit ${s.row.visit} · ${esc(s.source.action)}</span><strong>${r?(complete(r)?'✅ Complete':'⏳ Incomplete'):'🔒 Awaiting results'}</strong></div>`}).join('')}</div>`;
}
function html(info){if(info?.row?.origin!=='historical'||info.row.visit===1)return '';
 try{const c=status();let inner='';
 if(!c.ready)inner=`<p class="t2-p383-hold" role="alert">🔒 ${esc(c.reason)}</p><p>Earlier cars and results are never replaced with a fresh random draw.</p>`;
 else if(c.rec){inner=`<p class="t2-p383-ready">🔒 Qualified visit saved · ${c.saved}/${c.spec.required} ${c.spec.mode==='raceoff'?'matches':'times'} banked.</p><button class="t2-btn" type="button" data-t2-p383="open">${complete(c.rec)?'VIEW':'RESUME'} THIS VISIT’S RESULTS →</button>`;}
 else if(preview?.stamp===c.info.stamp&&preview.position===c.info.row.position&&preview.eventId===c.info.row.eventId){
   inner=`<p class="t2-p383-ready">Qualified ${c.spec.size} cars · ${esc(c.spec.derived.note)}</p><ol class="t2-p383-preview">${preview.ids.map((id,i)=>`<li>${i+1}. ${esc(c.map.get(id)?.name||id)}</li>`).join('')}</ol>${Array.from({length:c.spec.tracks},(_,i)=>`<label class="t2-p383-input">Practice route ${i+1}<input type="text" data-p383-track="${i}" maxlength="100" placeholder="FH5 route name"></label>`).join('')}<button class="t2-btn" type="button" data-t2-p383="lock">🔒 LOCK THIS QUALIFIED STAGE (REHEARSAL)</button>`;
 }else inner=`<p class="t2-p383-ready">✅ ${c.spec.size} source-derived eligible cars · ${c.spec.mode==='raceoff'?c.spec.amount+' matches':c.spec.amount+' cars / '+c.spec.tracks+' routes'}</p><p>${esc(c.spec.derived.note)}</p><button class="t2-btn" type="button" data-t2-p383="preview">🎲 PREVIEW QUALIFIED STAGE</button>`;
 return `<section class="t2-p383"><h3>🏁 HISTORICAL PROGRESSION · VISIT ${info.row.visit}</h3><p class="t2-p383-warning">PRELAUNCH REHEARSAL ONLY · Source ${esc(c.src.ecosystem)} · field reconciliation required before official racing. No honours, records or completed slots.</p><p><strong>${esc(c.current.source.action)}</strong><br><small>${esc(c.current.source.stop||'Original stage completion requires all valid results.')}</small></p>${summary(c)}<p><b>Live candidate field:</b> ${c.pool.candidateCount} · Original historical reference: ${c.src.sourceCount}</p><div id="t2-p383-error" hidden role="alert"></div>${inner}<p class="t2-p383-footer">All preceding appearances must be finished, qualification ties are blocked, and the bronze duel is mandatory before the final.</p></section>`;
 }catch(e){return `<section class="t2-p383"><h3>🏁 HISTORICAL PROGRESSION</h3><p class="t2-p383-hold" role="alert">${esc(e.message)}</p><p>Existing rehearsals have not been changed.</p></section>`;}
}
function action(e,go){const btn=e.target?.closest?.('[data-t2-p383]');if(!btn)return false;
 try{const op=btn.dataset.t2P383;if(op==='preview'){draw();go('race');}else if(op==='lock'){const items=[...btn.closest('.t2-p383').querySelectorAll('[data-p383-track]')].sort((a,b)=>Number(a.dataset.p383Track)-Number(b.dataset.p383Track));lock(items.map(x=>x.value));go('race');}else if(op==='open'){open();go('entry');}else err('Unrecognised historical stage action');}
 catch(ex){const box=btn.closest('.t2-p383')?.querySelector('#t2-p383-error');if(box){box.hidden=false;box.className='t2-p383-hold';box.textContent=S(ex.message);}}return true;
}
return Object.freeze({status,draw,lock,bank,open,html,action,complete,ranked,version:'8.0.383'});
});
