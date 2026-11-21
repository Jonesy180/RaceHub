/* OTG TET2 v8.0.397 -- operational, provenance-checked knockout slot bridge.
 * Supports original Lonely Hearts / full-maker Race Off stages only. Refuses other formats.
 * Uses the v8361 official ledger and v8358 honours publisher. Never touches OTG native results.
 */
(function(root,factory){'use strict';const a=factory(root);root.TET2OfficialRace397=a;if(typeof module==='object'&&module.exports)module.exports=a;})(typeof window!=='undefined'?window:globalThis,function(root){'use strict';
const KEY='tet2RaceControlV8397', LEDGER='tet2OfficialSlotLedgerV8361', SOURCE='TET2_CONTROLLED_CHAOS_LOCKED_V1';
const S=v=>String(v??'').trim(), clone=x=>JSON.parse(JSON.stringify(x));
const esc=v=>S(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hash=v=>{let h=2166136261;for(const c of String(v)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return(h>>>0).toString(16).padStart(8,'0');};
const fail=msg=>{throw Error('TET2 official race: '+msg);};
const isSupported=r=>['lonely','maker-knockout'].includes(S(r.origin))&&r.mode==='Race Off';
function current(){const sp=root.rhSpace?.();if(!sp||sp.catalogueKey!=='fh5-catalogue-v1'||!S(sp.id)||!Array.isArray(sp.cars))fail('Open the original FH5 Catalogue Space first');
 if(!sp.cars.length||sp.cars.some(c=>!S(c.id)||!S(c.make))||new Set(sp.cars.map(c=>S(c.id))).size!==sp.cars.length)fail('Car identities in the Garage are incomplete');return sp;}
function schedule(){const d=root.TET2AssembledList379?.snapshot?.();if(!d?.audit?.ok||!Array.isArray(d.rows)||d.rows.some((r,i)=>r.position!==i+1))fail('Original schedule audit failed');return d.rows;}
function routes(){const d=root.TET2RouteControl396?.snapshot?.();if(!d||!d.assigned||!d.evidenceKey)fail('FH5 course catalogue missing');return d;}
function sig(sp,rows,track){return hash(JSON.stringify({spaceId:S(sp.id),rows:rows.map(r=>[r.position,r.eventId,r.visit,r.stage,r.workload,r.format]),cars:sp.cars.map(c=>[S(c.id),S(c.make)]).sort((a,b)=>a[0].localeCompare(b[0])),tracks:track.evidenceKey}));}
function state(sp){const b=sp[KEY];if(!b)return null;if(b.schema!==1||b.spaceId!==S(sp.id)||!S(b.signature)||!b.events||!b.definitions)fail('Saved tournament identity invalid');return clone(b);}
function save(sp,b){if(typeof root.rhSave!=='function')fail('Save function missing');const old=sp[KEY];sp[KEY]=clone(b);try{root.rhSave();}catch(e){if(old===undefined)delete sp[KEY];else sp[KEY]=old;throw e;}}
function stableShuffle(ids,seed){return [...ids].sort((a,b)=>hash(seed+'|'+a).localeCompare(hash(seed+'|'+b))||a.localeCompare(b));}
function field(sp,row){let selected;if(row.origin==='lonely'){const counts=new Map();for(const c of sp.cars)counts.set(S(c.make),(counts.get(S(c.make))||0)+1);selected=sp.cars.filter(c=>counts.get(S(c.make))===1).map(c=>S(c.id));}
 else {const suffix=' · Full Manufacturer Race Off';if(!S(row.name).endsWith(suffix))fail('Manufacturer competition identity changed');const maker=S(row.name).slice(0,-suffix.length);selected=sp.cars.filter(c=>S(c.make)===maker).map(c=>S(c.id));}
 if(selected.length<2||new Set(selected).size!==selected.length)fail('Competition entrants not eligible');return stableShuffle(selected,S(row.eventId)+'|'+S(sp.id));}
function rowsFor(rows,eventId){return rows.filter(r=>r.eventId===eventId).sort((a,b)=>a.visit-b.visit);}
function baseStage(s){return S(s).replace(/ · batch \d+\/\d+$/,'');}
function rounds(rows){const chunks=[];for(const r of rows){let c=chunks.at(-1);if(!c||c.name!==baseStage(r.stage)){c={name:baseStage(r.stage),rows:[]};chunks.push(c);}c.rows.push(r);}return chunks;}
function officialLed(sp){const b=sp[LEDGER];if(!b)return {slots:{}};if(b.spaceId!==S(sp.id)||b.source!==SOURCE||!b.slots)fail('A different official slot ledger was found');return b;}
function matchProof(slot,m){const v=slot?.results?.['m:'+m.id];if(!v||!Number.isSafeInteger(v.a)||!Number.isSafeInteger(v.b)||v.a<=0||v.b<=0||v.a===v.b||!m.carIds.includes(v.winnerId)||v.winnerId!==(v.a<v.b?m.carIds[0]:m.carIds[1]))fail('Results unavailable or altered for match '+m.id);return {winner:v.winnerId,loser:m.carIds.find(id=>id!==v.winnerId),a:v.a,b:v.b};}
function sameDef(a,b){return !!a&&!!b&&['source','scheduleId','slotId','competitionId','lockHash','label','mode'].every(k=>a[k]===b[k])&&JSON.stringify(a.matches.map(m=>[m.id,m.track,m.carIds]))===JSON.stringify(b.matches.map(m=>[m.id,m.track,m.carIds]));}
function verifiedStage(b,sp,group){const ledger=officialLed(sp),result=[];for(const r of group.rows){const spec=b.definitions[String(r.position)],slot=ledger.slots['TET2-'+r.position];if(!spec||!slot?.completedAt||!sameDef(spec,slot.definition))fail('Earlier stage #'+r.position+' not completed and verified');for(const m of spec.matches)result.push({...matchProof(slot,m),match:m,position:r.position,completedAt:slot.completedAt});}return result;}
function stageEntrants(b,sp,groups,index){if(index===0)return {ids:b.events[groups[0].rows[0].eventId].field,byes:[]};const prev=groups[index-1];if(/^Bronze-medal duel/i.test(groups[index].name)){
 const semi=groups.find(g=>/^Semifinals/i.test(g.name));if(!semi)fail('No certified semifinals for bronze duel');const m=verifiedStage(b,sp,semi);if(m.length!==2)fail('Bronze duel needs exactly two semifinal losers');return {ids:m.map(x=>x.loser),byes:[]};}
 if(/^Final/i.test(groups[index].name)){const semi=groups.find(g=>/^Semifinals/i.test(g.name));if(semi){const m=verifiedStage(b,sp,semi);if(m.length!==2)fail('Final requires two semifinal winners');const bronze=groups.find(g=>/^Bronze-medal duel/i.test(g.name));if(bronze)verifiedStage(b,sp,bronze);return {ids:m.map(x=>x.winner),byes:[]};}}
 const prevResults=verifiedStage(b,sp,prev),prevByes=b.events[groups[0].rows[0].eventId].roundByes[prev.name]||[];
 return {ids:[...prevByes,...prevResults.map(x=>x.winner)],byes:[]};}
function stageMatches(b,sp,groups,index){const g=groups[index],r=g.rows[0],event=b.events[r.eventId];if(!event)fail('Official competition field not frozen');
 const matchesCount=g.rows.reduce((n,x)=>n+Number(x.workload||0),0);if(!Number.isInteger(matchesCount)||matchesCount<1)fail('Invalid declared stage match count');
 const entrants=stageEntrants(b,sp,groups,index).ids;if(new Set(entrants).size!==entrants.length)fail('Repeat contestant across stage');
 if(entrants.length<2*matchesCount)fail('Not enough verified entrants for declared matches');const byeCount=entrants.length-2*matchesCount;if(byeCount>matchesCount+2&&index!==0)fail('Unexplained byes in advancing field');
 const ordered=index===0?[...entrants]:stableShuffle(entrants,r.eventId+'|'+g.name+'|'+b.signature);
 const byes=ordered.slice(0,byeCount),pair=ordered.slice(byeCount);
 if(pair.length!==matchesCount*2)fail('Bracket stage field/count mismatch');event.roundByes[g.name]=byes;
 return Array.from({length:matchesCount},(_,i)=>({id:'R'+(index+1)+'M'+(i+1),carIds:[pair[i*2],pair[i*2+1]]}));}
function plan(b,sp,rows,position,track){const row=rows[position-1];if(!row||!isSupported(row))fail('This event format is not yet supported by the official race bridge');
 if(row.pending)fail('Event pending a complete eligible field');const scheduleRows=rowsFor(rows,row.eventId),groups=rounds(scheduleRows),index=groups.findIndex(x=>x.rows.some(y=>y.position===position));if(index<0)fail('Competition visit not found');
 if(!b.events[row.eventId]){if(row.visit!==1)fail('Cannot enter later event stage before its opening draw');b.events[row.eventId]={field:field(sp,row),roundByes:{},name:row.name};}
 const g=groups[index],all=stageMatches(b,sp,groups,index),offset=g.rows.slice(0,g.rows.findIndex(x=>x.position===position)).reduce((n,x)=>n+Number(x.workload||0),0),count=Number(row.workload);
 if(!Number.isInteger(count)||count<1||count>8||offset+count>all.length)fail('A scheduled slot must have between 1 and 8 verified matches');
 const route=track.assigned.find(x=>x.position===position&&x.eventId===row.eventId);
 if(!route||route.tracks.length<count)fail('Not enough real FH5 courses for this slot');
 const matches=all.slice(offset,offset+count).map((m,i)=>({id:m.id,carIds:m.carIds,track:route.tracks[i].name}));
 if(new Set(matches.flatMap(x=>x.carIds)).size!==matches.length*2)fail('Same car appears twice in one slot');
 const spec={source:SOURCE,scheduleId:'TET2-397-'+b.signature,slotId:'TET2-'+position,competitionId:row.eventId,lockHash:hash(JSON.stringify({signature:b.signature,row:[row.position,row.eventId,row.visit],matches})),label:'#'+position+' · '+row.name+' · '+row.stage,mode:'raceoff',matches};
 return spec;}
function verifyLockedSlot({spaceId,scheduleId,slotId,lockHash}){try{const sp=current(),rows=schedule(),track=routes(),b=state(sp);if(!b||b.signature!==sig(sp,rows,track)||S(spaceId)!==S(sp.id))return {verified:false};
 const d=b.definitions[String(slotId).replace(/^TET2-/,'')];if(!d||d.scheduleId!==scheduleId||d.slotId!==slotId||d.lockHash!==lockHash)return {verified:false};return {verified:true,definition:clone(d)};}catch(_){return {verified:false};}}
function inspect(){const sp=current(),rows=schedule(),track=routes(),signature=sig(sp,rows,track);const existing=state(sp);
 if(existing&&existing.signature!==signature)fail('Garage or candidate schedule changed after official start. No results altered; restore the original state before continuing');
 const b=existing||{schema:1,spaceId:S(sp.id),signature,events:{},definitions:{},startedAt:null},ledger=officialLed(sp);
 const next=rows.find(r=>!ledger.slots['TET2-'+r.position]?.completedAt),position=next?.position||rows.length+1;
 let proposal=null,block=null;
 if(next){try{const draft=clone(b);proposal=plan(draft,sp,rows,position,track);}catch(e){block=e.message;}}return {sp,rows,track,b,ledger,next,position,proposal,block,completed:rows.filter(r=>ledger.slots['TET2-'+r.position]?.completedAt).length};}
function start(){const x=inspect();if(!x.next||!x.proposal)fail(x.block||'No supported next slot');
 const b=clone(x.b),spec=plan(b,x.sp,x.rows,x.position,x.track);const currentSlot=x.ledger.slots[spec.slotId];
 if(currentSlot){if(!sameDef(currentSlot.definition,spec))fail('Previously started slot has different draw');return root.TET2SlotLedger361.resumeActive();}
 if(b.definitions[String(x.position)]&&JSON.stringify(b.definitions[String(x.position)])!==JSON.stringify(spec))fail('Different draw already locked');
 b.definitions[String(x.position)]=spec;if(!b.startedAt)b.startedAt=new Date().toISOString();save(x.sp,b);
 const result=root.TET2SlotLedger361?.prepare?.(spec);if(!result)fail('Official slot ledger did not confirm preparation');
 root.TET2SlotLedger361.resumeActive();return {position:x.position,spec};}
function finishCurrent(){const x=inspect(),active=x.ledger.currentId&&x.ledger.slots[x.ledger.currentId];if(!active||active.completedAt)fail('No unfinished slot');return root.TET2SlotLedger361.finish();}
function receiptFor(b,sp,rows,eventId){
 const event=b.events[eventId];if(!event)fail('Competition field was never officially frozen');
 const visits=rowsFor(rows,eventId),groups=rounds(visits);if(!visits.every(r=>b.definitions[String(r.position)]))fail('Competition has unstarted visits');
 for(const g of groups)verifiedStage(b,sp,g);
 const last=groups.at(-1);if(!/^Final/i.test(last.name))fail('Only finished knockout finals can award honours');
 const finalResults=verifiedStage(b,sp,last);if(finalResults.length!==1)fail('Expected one completed final');
 const final=finalResults[0],field=event.field;
 if(field.length===3)fail('Three-car knockout needs an approved bronze/tiebreak structure');
 let semis=[],bronze=null;
 if(field.length>=4){const sg=groups.find(g=>/^Semifinals/i.test(g.name));const bg=groups.find(g=>/^Bronze-medal duel/i.test(g.name));
  if(!sg||!bg||groups.indexOf(sg)>=groups.indexOf(bg)||groups.indexOf(bg)>=groups.indexOf(last))fail('Semifinal, bronze and final stage order invalid');
  semis=verifiedStage(b,sp,sg);const br=verifiedStage(b,sp,bg);if(semis.length!==2||br.length!==1)fail('Bronze or semifinals incomplete');bronze=br[0];
  const finalists=semis.map(x=>x.winner),losers=semis.map(x=>x.loser);
  if(!finalists.includes(final.winner)||!finalists.includes(final.loser)||!losers.includes(bronze.winner)||!losers.includes(bronze.loser))fail('Final or bronze participants do not match semifinal winners and losers');
 }
 const proof=hash(JSON.stringify({signature:b.signature,eventId,definitions:visits.map(r=>b.definitions[String(r.position)]),results:visits.map(r=>officialLed(sp).slots['TET2-'+r.position]?.results)}));
 return {eventId,kind:eventId==='T2-LONELY-HEARTS'?'lonely-hearts-knockout':'manufacturer-raceoff',format:'knockout',completed:true,verified:true,fieldCarIds:field,medals:{gold:[final.winner],silver:[final.loser],bronze:bronze?[bronze.winner]:[]},semifinalLoserIds:semis.map(x=>x.loser),bronzeDuelCompleted:!!bronze,semifinalsCompleted:!!bronze,bronzeDuelWinnerId:bronze?.winnerId||bronze?.winner||'',make:sp.cars.find(c=>S(c.id)===field[0])?.make,proof};
}
function pendingMedals(x){const bridge=root.tet2HonoursBridge358;if(!bridge?.results)return [];
 const existing=bridge.results(x.sp,x.sp.cars).receipts.map(r=>r.eventId);
 return Object.keys(x.b.events).filter(id=>!existing.includes(id)).flatMap(id=>{try{return [{id,receipt:receiptFor(x.b,x.sp,x.rows,id)}];}catch(_){return [];}});
}
function publishMedal(eventId){const x=inspect(),pending=pendingMedals(x),match=pending.find(p=>p.id===eventId);if(!match)fail('No completed verified competition is eligible for this medal publication');
 const e=root.tet2HonoursBridge358?.publish?.(x.sp,x.sp.cars,match.receipt,root.rhSave);
 if(!e)fail('Official honours publisher unavailable');return e;
}
function html(){try{const x=inspect();if(!x.next)return `<div class="t2-a388"><h3>✅ ALL SCHEDULED VISITS COMPLETE</h3></div>`;
 const slot=x.ledger.slots['TET2-'+x.position],support=!!x.proposal,medals=pendingMedals(x);
 return `<div class="t2-a388"><h3>🏁 OFFICIAL RACING · SLOT ${x.position}</h3><p class="t2-a388-status fail">⚠️ LIMITED LIVE PILOT — only supported knockout stages can be completed. This is NOT the finished 2,071-visit tournament.</p><p><b>${esc(x.next.name)}</b> · ${esc(x.next.stage)}</p><p>Completed ${x.completed} / ${x.rows.length} visits. ${x.b.startedAt?'Tournament start recorded':'Tournament not started'}.</p>${support?`<p>✅ Verified ${x.proposal.matches.length} head-to-head match${x.proposal.matches.length===1?'':'es'} with genuine tracks and actual Garage cars.</p><ol>${x.proposal.matches.slice(0,8).map(m=>{const map=new Map(x.sp.cars.map(c=>[S(c.id),S(c.name)]));return '<li>'+esc(map.get(m.carIds[0])||m.carIds[0])+' vs '+esc(map.get(m.carIds[1])||m.carIds[1])+' · '+esc(m.track)+'</li>';}).join('')}</ol>${slot?'<button class="t2-btn" data-t2-official397="resume">🏁 RESUME OFFICIAL RESULTS</button>':'<button class="t2-btn" data-t2-official397="start">🔒 LOCK DRAW & START SLOT '+x.position+'</button>'}`:`<p class="t2-a388-status fail">⛔ ${esc(x.block)}</p>`}${medals.map(m=>`<p>🏆 Verified finished competition: ${esc(m.id)} <button class="t2-btn" data-t2-official397="medal" data-t2-medal-id="${esc(m.id)}">PUBLISH VERIFIED MEDALS</button></p>`).join('')}<p><small>Supported now: Lonely Hearts and verified full-manufacturer knockout visits. Other competition formats do not silently start. Results save through the separate official slot ledger; OTG racing is untouched.</small></p></div>`;
 }catch(e){return `<div class="t2-a388" role="alert">⛔ ${esc(e.message)}</div>`;}}
function action(e,navigate,render){const btn=e.target.closest?.('[data-t2-official397]');if(!btn)return false;try{if(btn.dataset.t2Official397==='start'){if(root.confirm&&!root.confirm('This permanently starts a REAL official slot, but the full 2,071-slot tournament is NOT yet supported. Continue with this limited pilot?' ))return true;start();navigate('entry');}else if(btn.dataset.t2Official397==='resume'){root.TET2SlotLedger361.resumeActive();navigate('entry');}else if(btn.dataset.t2Official397==='finish'){finishCurrent();render();}else if(btn.dataset.t2Official397==='medal'){if(root.confirm&&!root.confirm('Publish verified completed competition medals?'))return true;publishMedal(btn.dataset.t2MedalId);render();}}catch(err){root.alert?.(err.message);render();}return true;}
const api=Object.freeze({inspect,plan,verifyLockedSlot,start,finishCurrent,receiptFor,pendingMedals,publishMedal,html,action,KEY});
// The existing official ledger requires an explicit, repeatably verifiable schedule source.
if(root.TET2ControlledChaosVerifiedSchedule&&root.TET2ControlledChaosVerifiedSchedule.verifyLockedSlot!==verifyLockedSlot){/* existing source takes precedence; do not replace */}
else root.TET2ControlledChaosVerifiedSchedule=Object.freeze({verifyLockedSlot});
return api;
});
