/* OTG! Main 8.0.380 — Lonely Hearts knockout, PRELAUNCH ONLY.
 * Exactly ONE owned car per manufacturer; source-backed current-visit draws,
 * locked rehearsal pairings, banked match results, byes and bronze-first lineage.
 * No rhSave, official slots, medals, records, standings writes or Garage mutations.
 */
(function(root,factory){'use strict';const api=factory(root);root.TET2Lonely380=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis,function(root){'use strict';
const SOURCE='T2_LONELY_REHEARSAL_V8380',PREFIX='tet2.prelaunch.lonely.v8380.',EVENT='T2-LONELY-HEARTS';
const S=x=>String(x??'').trim(),E=x=>S(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fail=x=>{throw Error('Lonely Hearts safe stop: '+x);};
const copy=x=>JSON.parse(JSON.stringify(x));
function garage(){const sp=root.rhSpace?.();if(!sp||sp.catalogueKey!=='fh5-catalogue-v1'||!S(sp.id)||!Array.isArray(sp.cars))fail('Open the live FH5 Catalogue Garage');
 const ids=sp.cars.map(c=>S(c.id));if(ids.some(id=>!id)||new Set(ids).size!==ids.length)fail('Garage car IDs are not distinct and stable');return sp;}
function singleCars(sp){const makers=new Map();for(const c of sp.cars){const make=S(c.make);if(!make)fail('A Garage car has no manufacturer');makers.set(make,(makers.get(make)||0)+1);}
 const eligible=sp.cars.filter(c=>makers.get(S(c.make))===1);if(eligible.length<4)fail('At least four single-car manufacturers are required for the scheduled knockout');
 if(new Set(eligible.map(c=>S(c.make))).size!==eligible.length)fail('Lonely Hearts must include exactly one car per manufacturer');return eligible;}
function stageName(s){return S(s).replace(/\s*·\s*batch\s+\d+\/\d+\s*$/i,'');}
function grouping(rows){const gs=[];for(const r of rows){const name=stageName(r.stage);if(!gs.length||gs.at(-1).name!==name)gs.push({name,rows:[r]});else gs.at(-1).rows.push(r);}return gs;}
function local(){if(!root.localStorage?.getItem||!root.localStorage?.setItem)fail('Isolated browser rehearsal storage unavailable');return root.localStorage;}
function key(sp){return PREFIX+encodeURIComponent(S(sp.id));}
function read(sp){let raw;try{raw=local().getItem(key(sp));}catch(_){fail('Cannot read rehearsal storage');}
 if(!raw)return {schema:1,source:SOURCE,spaceId:S(sp.id),events:{}};
 let book;try{book=JSON.parse(raw);}catch(_){fail('Saved rehearsal data is damaged; refusing to overwrite');}
 if(!book||book.schema!==1||book.source!==SOURCE||book.spaceId!==S(sp.id)||!book.events||typeof book.events!=='object'||Array.isArray(book.events))fail('This saved rehearsal is not from the active FH5 Space');return book;}
function write(sp,book){if(book?.source!==SOURCE||book.spaceId!==S(sp.id))fail('Rehearsal storage scope mismatch');try{local().setItem(key(sp),JSON.stringify(book));}catch(_){fail('Cannot save this isolated rehearsal');}}
function saved(rec){return !!rec&&Array.isArray(rec.matches)&&rec.matches.length>0&&rec.matches.every(m=>Object.hasOwn(rec.saved||{},m.id));}
function inspectRecord(rec,r,field){if(rec.visit!==r.visit||rec.position!==r.position||rec.stage!==r.stage||!S(rec.track)||S(rec.track).length<3||S(rec.track).length>100||!Array.isArray(rec.matches)||rec.matches.length!==Number(r.workload)||!rec.saved||typeof rec.saved!=='object')fail('Saved visit identity or match count differs from the candidate schedule');
 const unique=new Set();for(const m of rec.matches){if(!m?.id||!Array.isArray(m.cars)||m.cars.length!==2||m.cars[0]===m.cars[1]||m.cars.some(id=>!field.includes(id)||unique.has(id)))fail('Saved match has invalid or duplicated competitors');m.cars.forEach(id=>unique.add(id));
  const s=rec.saved[m.id];if(s&&(!Number.isSafeInteger(s.a)||!Number.isSafeInteger(s.b)||s.a<=0||s.b<=0||s.a===s.b||s.winnerId!==(s.a<s.b?m.cars[0]:m.cars[1])))fail('Saved result has impossible times or winner');
 }if(Object.keys(rec.saved).some(k=>!rec.matches.some(m=>m.id===k)))fail('Saved result does not belong to this visit');}
function context(){const info=root.TET2EventRouter375?.inspect?.(),row=info?.row;if(!row||row.origin!=='lonely'||row.eventId!==EVENT||!['BRONZE','KNOCKOUT'].includes(row.format))fail('Select a Lonely Hearts Cup visit in the Evil List');
 if(!root.TET2ResultsEntry360?.openTrial||!root.TET2SlotDraw363?.selectFromGarage)fail('Existing Race Off draw/results module not installed');
 const snap=root.TET2AssembledList379?.snapshot?.(),sp=garage();if(!snap?.audit?.ok||!Array.isArray(snap.rows))fail('Combined Evil List integrity gate unavailable');
 const rows=snap.rows.filter(x=>x.eventId===EVENT).sort((a,b)=>a.visit-b.visit);if(!rows.length||rows.some((r,i)=>r.visit!==i+1||r.visitTotal!==rows.length||r.eventId!==EVENT||r.origin!=='lonely'||!['KNOCKOUT','BRONZE'].includes(r.format)||Number(r.workload)<1||Number(r.workload)>8)||rows[row.visit-1]?.position!==row.position)fail('Lonely Hearts scheduled visits are invalid');
 const eligible=singleCars(sp),roster=eligible.map(c=>S(c.id)),expected=root.TET2Workloads368?.fullMakerRaceOff?.(roster.length);if(!expected||expected.slots!==rows.length||expected.matches!==rows.reduce((n,r)=>n+Number(r.workload),0)||!rows.at(-2).stage.startsWith('Bronze-medal duel')||stageName(rows.at(-1).stage)!=='Final')fail('Knockout workload or mandatory bronze-first order does not match the current Garage');
 const book=read(sp),before=book.events[EVENT],event=before||{source:SOURCE,eventId:EVENT,stamp:info.stamp,fieldIds:roster,visits:{}};
 if(event.source!==SOURCE||event.eventId!==EVENT||event.stamp!==info.stamp||!Array.isArray(event.fieldIds)||event.fieldIds.length!==roster.length||new Set(event.fieldIds).size!==roster.length||new Set([...event.fieldIds,...roster]).size!==roster.length||!event.visits||typeof event.visits!=='object')fail('Frozen Lonely Hearts field or candidate timetable changed; refusing to rewrite saved cars');
 const map=new Map(sp.cars.map(c=>[S(c.id),c]));for(const [i,v] of Object.entries(event.visits)){const n=Number(i);if(!Number.isSafeInteger(n)||n<1||n>rows.length)fail('Unknown saved Lonely Hearts stage');inspectRecord(v,rows[n-1],event.fieldIds);if(n>1&&!saved(event.visits[n-1]))fail('Later visit exists before the previous one finished');}
 return {info,row,sp,rows,eligible,roster,book,event,map,groups:grouping(rows)};}
function loser(m,rec){const result=rec.saved[m.id];if(!result)fail('Missing semifinal winner');return m.cars.find(id=>id!==result.winnerId);}
function pool(c){const {groups,rows,event,row}=c;const gi=groups.findIndex(g=>g.rows.some(r=>r.visit===row.visit));if(gi<0)fail('Visit missing from knockout ladder');const group=groups[gi],batch=group.rows.findIndex(r=>r.visit===row.visit);
 for(const r of rows.filter(r=>r.visit<row.visit))if(!saved(event.visits[r.visit]))fail('Complete earlier Lonely Hearts visit '+r.visit+' before this stage');
 let entrants;if(gi===0)entrants=event.fieldIds.slice();
 else if(group.name.startsWith('Bronze-medal duel')){const semi=groups.find(g=>g.name==='Semifinals');if(!semi||semi.rows.length!==1)fail('Two semifinals must precede the bronze duel');const rec=event.visits[semi.rows[0].visit];if(!saved(rec)||rec.matches.length!==2)fail('Semifinal losers have not been verified');entrants=rec.matches.map(m=>loser(m,rec));}
 else{let parent=groups[gi-1];if(parent.name.startsWith('Bronze-medal duel'))parent=groups[gi-2];if(!parent)fail('Previous knockout stage is missing');const drawn=[],wins=[];
  for(const r of parent.rows){const rec=event.visits[r.visit];if(!saved(rec))fail('Previous stage has incomplete results');for(const m of rec.matches){drawn.push(...m.cars);wins.push(rec.saved[m.id].winnerId);}}
  if(new Set(drawn).size!==drawn.length||new Set(wins).size!==wins.length)fail('Previous round repeated a car');
  entrants=groups.indexOf(parent)===0?[...wins,...event.fieldIds.filter(id=>!drawn.includes(id))]:wins;
 }
 const prior=[];for(const r of group.rows.slice(0,batch)){const rec=event.visits[r.visit];if(!saved(rec))fail('Earlier batch of this round is unfinished');for(const m of rec.matches)prior.push(...m.cars);}
 if(new Set(prior).size!==prior.length||prior.some(id=>!entrants.includes(id)))fail('Previous batch has duplicated or unexpected entrants');
 const available=entrants.filter(id=>!prior.includes(id)),need=Number(row.workload),total=group.rows.reduce((n,r)=>n+Number(r.workload),0);
 if(available.length<need*2||gi>0&&entrants.length!==total*2||gi===0&&entrants.length<total*2)fail('Knockout visit has insufficient eligible advancing entrants');
 return {available,need,group:group.name,batch:batch+1,totalBatches:group.rows.length,byes:gi===0?entrants.length-total*2:0};}
let draft=null;
function status(){const c=context(),rec=c.event.visits[c.row.visit]||null,p=rec?null:pool(c);if(rec){const expectedRows=c.groups.flatMap(g=>g.rows);void expectedRows;}
 return {...c,rec,p,banked:rec?Object.keys(rec.saved).length:0,need:Number(c.row.workload)};}
function previewStage(){const c=status();if(c.rec)fail('This rehearsal stage is already locked');const draw=root.TET2SlotDraw363.selectFromGarage({mode:'raceoff',matches:c.p.need,eligibleCarIds:c.p.available,preview:true});
 if(draw?.mode!=='raceoff'||draw.matches?.length!==c.p.need)fail('Native Race Off draw returned the wrong number of matches');const pairs=draw.matches.map((m,i)=>({id:'visit'+c.row.visit+'-match'+(i+1),cars:[S(m.carA?.id),S(m.carB?.id)]}));
 const used=pairs.flatMap(m=>m.cars);if(new Set(used).size!==used.length||used.some(id=>!c.p.available.includes(id)))fail('Native draw repeated a car or included a non-entrant');
 draft={stamp:c.info.stamp,visit:c.row.visit,position:c.row.position,pairs};return copy(draft);}
function lockStage(track){const c=status(),name=S(track);if(c.rec)fail('Draw already locked');if(name.length<3||name.length>100)fail('Provide a real route name (3–100 characters)');if(!draft||draft.visit!==c.row.visit||draft.stamp!==c.info.stamp||draft.position!==c.row.position)fail('Preview the current visit before locking its pairings');
 const ids=draft.pairs.flatMap(m=>m.cars);if(ids.some(id=>!c.p.available.includes(id))||new Set(ids).size!==c.p.need*2||draft.pairs.length!==c.p.need)fail('Proposed draw no longer meets this stage eligibility');
 const rec={visit:c.row.visit,position:c.row.position,stage:c.row.stage,track:name,matches:copy(draft.pairs),saved:{}};c.event.visits[c.row.visit]=rec;c.book.events[EVENT]=c.event;write(c.sp,c.book);draft=null;return copy(rec);}
function bank(p){const c=status(),rec=c.rec;if(!rec)fail('Lock a draw before entering results');if(!p||p.mode!=='raceoff'||S(p.slotId)!=='LONELY-REHEARSAL-'+c.row.position||S(p.competitionId)!==EVENT||S(p.track)!==rec.track)fail('Saved race result belongs to a different visit or track');
 const match=rec.matches.find(m=>m.id===S(p.matchId));if(!match||Object.hasOwn(rec.saved,match.id)||S(p.carA)!==match.cars[0]||S(p.carB)!==match.cars[1])fail('Result is already saved or does not match the locked pair');
 if(!Number.isSafeInteger(p.timeA)||!Number.isSafeInteger(p.timeB)||p.timeA<=0||p.timeB<=0||p.timeA>=86400000||p.timeB>=86400000||p.timeA===p.timeB)fail('Two valid unequal times are required; no invented tie-breaker');
 const winner=p.timeA<p.timeB?match.cars[0]:match.cars[1];if(p.winnerId!==winner)fail('Recorded winner is not the faster car');rec.saved[match.id]={a:p.timeA,b:p.timeB,winnerId:winner};write(c.sp,c.book);return{banked:Object.keys(rec.saved).length,required:rec.matches.length,winnerId:winner};}
function open(){const c=status(),rec=c.rec;if(!rec)fail('Lock the current rehearsal stage first');const flag=id=>{const x=c.map.get(id);return{id,name:S(x?.name)||[x?.make,x?.model,x?.year].filter(Boolean).join(' '),h:x?.h===true,e:x?.e===true};};
 root.TET2ResultsEntry360.openTrial({source:'TET2_DRAW_PRACTICE_V8363',spaceId:S(c.sp.id),slotId:'LONELY-REHEARSAL-'+c.row.position,competitionId:EVENT,
 label:'LONELY HEARTS REHEARSAL — NOT OFFICIAL',stageRehearsal:true,mode:'raceoff',matches:rec.matches.map(m=>({id:m.id,track:rec.track,cars:m.cars.map(flag)})),saved:copy(rec.saved),onBank:async p=>bank(p),onExit:()=>root.TET2Stage4UI359?.page('race')});
 return{banked:c.banked,required:c.need};}
function html(info){if(info?.row?.origin!=='lonely')return'';try{const c=status(),r=c.row,p=c.p,rec=c.rec,active=draft?.stamp===c.info.stamp&&draft.visit===r.visit&&draft.position===r.position?draft:null;
 const header=`<section class="t2-r380"><h3>💔 LONELY HEARTS · CURRENT VISIT</h3><div class="t2-r380-meta"><strong>${c.roster.length} single-car manufacturers</strong><span>Visit ${r.visit}/${c.rows.length} · ${E(r.stage)}</span></div><p class="t2-r380-safe">PRELAUNCH REHEARSAL ONLY · No official slots, Garage changes, medals, Second Chance qualifiers or records.</p>`;
 let part='';if(rec){part=`<p class="t2-r380-locked">🔒 ${E(rec.track)} · ${c.banked}/${c.need} matches saved ${saved(rec)?'· COMPLETE ✓':''}</p><ol class="t2-r380-pairs">${rec.matches.map((m,i)=>`<li><b>Match ${i+1}</b><span>${E(c.map.get(m.cars[0])?.name)} <em>vs</em> ${E(c.map.get(m.cars[1])?.name)}</span>${rec.saved[m.id]?`<strong>✓ ${E(c.map.get(rec.saved[m.id].winnerId)?.name)} wins</strong>`:''}</li>`).join('')}</ol><button class="t2-btn" type="button" data-t2-lonely="open">${saved(rec)?'VIEW':'RESUME'} SAVED REHEARSAL RESULTS →</button>`;}
 else if(active){part=`<p>Review ${p.need} pairings before locking. ${p.byes?`${p.byes} first-round byes will advance automatically.`:''}</p><ol class="t2-r380-pairs">${active.pairs.map((m,i)=>`<li><b>Match ${i+1}</b><span>${E(c.map.get(m.cars[0])?.name)} <em>vs</em> ${E(c.map.get(m.cars[1])?.name)}</span></li>`).join('')}</ol><label class="t2-r380-route">Practice route<input type="text" id="t2-r380-route" maxlength="100" placeholder="Enter FH5 track name"></label><button class="t2-btn" type="button" data-t2-lonely="lock">🔒 LOCK THIS REHEARSAL DRAW</button>`;}
 else{part=`<p>${p.available.length} eligible cars available for this visit · ${p.need} match${p.need===1?'':'es'}. ${p.byes?`${p.byes} first-round byes are preserved.`:''}</p><button class="t2-btn" type="button" data-t2-lonely="preview">🎲 PREVIEW THIS LONELY HEARTS STAGE</button>`;}
 return header+`<div id="t2-r380-error" role="alert" hidden></div>${part}<p class="t2-r380-help">Earlier results determine progressing cars. Semifinal losers must race for bronze <b>before</b> the final. No future stage is drawn early.</p></section>`;
 }catch(err){return `<section class="t2-r380"><h3>💔 LONELY HEARTS · CURRENT VISIT</h3><p class="t2-r380-safe" role="alert">${E(err.message)}</p><p>Rehearsal blocked; OTG! data untouched.</p></section>`;}}
function action(ev,go){const b=ev.target?.closest?.('[data-t2-lonely]');if(!b)return false;try{const kind=b.dataset.t2Lonely;if(kind==='preview'){previewStage();go('race');}else if(kind==='lock'){lockStage(root.document?.getElementById('t2-r380-route')?.value);go('race');}else if(kind==='open'){open();go('entry');}else fail('Unknown Lonely Hearts action');}catch(err){const area=b.closest('.t2-r380'),box=area?.querySelector('#t2-r380-error');if(box){box.hidden=false;box.textContent=S(err.message);box.className='t2-r380-safe';}else root.console?.warn?.(err);}return true;}
return Object.freeze({context,status,pool,previewStage,lockStage,bank,open,html,action,version:'8.0.380'});
});
