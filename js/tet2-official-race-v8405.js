/* OTG TET2 v8.0.404 -- operational, provenance-checked knockout slot bridge.
 * Connects native knockout, historical R1 Festival/Race Off, Swiss, Relay, Gauntlet, Aeródromo stages.
 * Uses the v8361 official ledger and v8358 honours publisher. Never touches OTG native results.
 */
(function(root,factory){'use strict';const a=factory(root);root.TET2OfficialRace401=a;root.TET2OfficialRace400=a;if(typeof module==='object'&&module.exports)module.exports=a;})(typeof window!=='undefined'?window:globalThis,function(root){'use strict';
const KEY='tet2RaceControlV8397', LEDGER='tet2OfficialSlotLedgerV8361', SOURCE='TET2_CONTROLLED_CHAOS_LOCKED_V1';
const S=v=>String(v??'').trim(), clone=x=>JSON.parse(JSON.stringify(x));
const esc=v=>S(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hash=v=>{let h=2166136261;for(const c of String(v)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return(h>>>0).toString(16).padStart(8,'0');};
const fail=msg=>{throw Error('TET2 official race: '+msg);};
const isSupported=r=>r.origin==='historical'||(['lonely','maker-knockout'].includes(S(r.origin))&&r.mode==='Race Off')||r.eventId==='T2-GAUNTLET-ALL'||/^T2-SWISS-\d+$/.test(S(r.eventId))||r.origin==='relay'||r.origin==='aerodromo'||r.eventId==='T2-DRIFT-CHAMPIONSHIP';
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
function sameDef(a,b){return !!a&&!!b&&['source','scheduleId','slotId','competitionId','lockHash','label','mode'].every(k=>a[k]===b[k])&&(a.mode==='group'?JSON.stringify([a.carIds,a.tracks])===JSON.stringify([b.carIds,b.tracks]):a.mode==='relay'?JSON.stringify([a.teams,a.tracks])===JSON.stringify([b.teams,b.tracks]):a.mode==='aero'?JSON.stringify([a.carIds,a.track,a.jumpFacility])===JSON.stringify([b.carIds,b.track,b.jumpFacility]):JSON.stringify(a.matches.map(m=>[m.id,m.track,m.carIds]))===JSON.stringify(b.matches.map(m=>[m.id,m.track,m.carIds])));}
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
// Verified timed standings use the SAME official slot ledger, isolated from OTG native runs.
// A group competition always uses exact Garage IDs and canonical routed FH5 tracks.
function groupPlan(b,sp,rows,position,track){
 const row=rows[position-1],isGauntlet=row.eventId==='T2-GAUNTLET-ALL',isDrift=row.eventId==='T2-DRIFT-CHAMPIONSHIP';
 if(!isGauntlet&&!isDrift)fail('Unrecognised timed group format');
 if(row.pending)fail('A complete eligible field has not been verified');
 const visits=rowsFor(rows,row.eventId),event=b.events[row.eventId]||{};
 if(!b.events[row.eventId]){
  const owned=sp.cars.map(c=>S(c.id));if(new Set(owned).size!==owned.length)fail('Duplicate Garage identities');
  event.field=stableShuffle(isDrift?sp.cars.filter(c=>S(c.classType).toLowerCase()==='drift cars').map(c=>S(c.id)):owned,row.eventId+'|'+S(sp.id)+'|'+b.signature);
  if(isDrift&&(row.visitTotal!==1||row.visit!==1||event.field.length!==Number(row.workload)))fail('Timed Drift Championship needs complete exact original Drift Cars roster');
  event.name=row.name;event.roundByes={};b.events[row.eventId]=event;
 }
 if(!Array.isArray(event.field)||new Set(event.field).size!==event.field.length||event.field.some(id=>!sp.cars.some(c=>S(c.id)===id)))fail('Saved group field no longer matches Garage');
 if(isGauntlet&&(row.format!=='GAUNTLET'||row.visitTotal!==visits.length))fail('Gauntlet stage identity invalid');
 let ids;
 if(isDrift)ids=event.field;
 else {
  const prev=visits.slice(0,visits.findIndex(v=>v.position===position));
  const offset=prev.reduce((n,r)=>n+Number(r.workload||0),0),count=Number(row.workload);
  if(!Number.isInteger(count)||count<2||count>8||offset+count>event.field.length)fail('Gauntlet batch cannot be represented safely as a 2–8 car timed group');
  ids=event.field.slice(offset,offset+count);
 }
 if(new Set(ids).size!==ids.length)fail('Repeated car in group');
 const assigned=track.assigned.find(r=>r.position===position&&r.eventId===row.eventId);
 const expected=isDrift?1:3;
 if(!assigned||!Array.isArray(assigned.tracks)||assigned.tracks.length!==expected)fail('The scheduled stage does not have its required genuine FH5 courses');
 const trackNames=assigned.tracks.map(t=>S(t.name));
 if(trackNames.some(t=>!t)||new Set(trackNames).size!==trackNames.length)fail('Stage course names missing or repeated');
 return {source:SOURCE,scheduleId:'TET2-397-'+b.signature,slotId:'TET2-'+position,competitionId:row.eventId,
   lockHash:hash(JSON.stringify({signature:b.signature,row:[row.position,row.eventId,row.visit],ids,tracks:assigned.tracks.map(t=>t.id)})),
   label:'#'+position+' · '+row.name+' · '+row.stage,mode:'group',carIds:ids,tracks:trackNames};
}
function groupResult(b,sp,rows,eventId){
 const event=b.events[eventId],visits=rowsFor(rows,eventId),gauntlet=eventId==='T2-GAUNTLET-ALL',drift=eventId==='T2-DRIFT-CHAMPIONSHIP';
 if(!event||!visits.length||!['T2-GAUNTLET-ALL','T2-DRIFT-CHAMPIONSHIP'].includes(eventId))fail('Not a supported timed championship');
 const ledger=officialLed(sp),records=[];
 for(const r of visits){
  const spec=b.definitions[String(r.position)],slot=ledger.slots['TET2-'+r.position];
  if(!spec||!slot?.completedAt||!sameDef(spec,slot.definition)||spec.mode!=='group')fail('A scheduled timed visit is not complete');
  for(const id of spec.carIds){let total=0;for(let i=0;i<spec.tracks.length;i++){
   const ms=slot.results['g:'+i+':'+id];if(!Number.isSafeInteger(ms)||ms<=0)fail('An official saved time is missing');total+=ms;
  }records.push({id,total});}
 }
 if(new Set(records.map(r=>r.id)).size!==records.length||records.length!==event.field.length)fail('Timed championship field was not covered exactly once');
 const rank=records.sort((a,b)=>a.total-b.total||a.id.localeCompare(b.id));
 if(rank.length<3||rank.slice(0,3).some((r,i)=>i>0&&r.total===rank[i-1].total)||rank.length>3&&rank[2].total===rank[3].total)fail('Podium has an unresolved equal-time tie');
 const proof=hash(JSON.stringify({signature:b.signature,eventId,definitions:visits.map(r=>b.definitions[String(r.position)]),results:visits.map(r=>ledger.slots['TET2-'+r.position]?.results)}));
 return {eventId,kind:gauntlet?'unified-gauntlet':drift?'drift-cars-championship':'timed-championship',format:'standings',completed:true,verified:true,
   fieldCarIds:event.field,medals:{gold:[rank[0].id],silver:[rank[1].id],bronze:[rank[2].id]},proof};
}
// Native Swiss rules: 16 unique cars, four rounds (wins/opponent wins/total time),
// eight-car elimination, and mandatory bronze BEFORE final.
function swissHistory(b,sp,visits,before){
 const ledger=officialLed(sp),out={};
 for(const r of visits.filter(v=>v.visit<before)){
  const d=b.definitions[String(r.position)],slot=ledger.slots['TET2-'+r.position];
  if(!d||!slot?.completedAt||!sameDef(d,slot.definition)||d.mode!=='raceoff')fail('Earlier Swiss stage '+r.visit+' is not complete');
  out[r.visit]=d.matches.map(m=>({...matchProof(slot,m),ids:m.carIds}));
 }
 return out;
}
function swissScores(field,history){
 const map=new Map(field.map(id=>[id,{id,wins:0,opps:[],time:0,oppWins:0}]));
 for(let visit=1;visit<=4;visit++)for(const m of history[visit]||[]){
  const a=map.get(m.ids[0]),b=map.get(m.ids[1]);if(!a||!b||!Number.isSafeInteger(m.a)||!Number.isSafeInteger(m.b))fail('Swiss standing is missing an official match');
  a.opps.push(b.id);b.opps.push(a.id);a.time+=m.a;b.time+=m.b;map.get(m.winner).wins++;
 }
 for(const x of map.values())x.oppWins=x.opps.reduce((n,id)=>n+map.get(id).wins,0);
 return [...map.values()].sort((a,b)=>b.wins-a.wins||b.oppWins-a.oppWins||a.time-b.time||field.indexOf(a.id)-field.indexOf(b.id));
}
function swissPairs(field,history,round,eventId){
 const ordered=round===1?stableShuffle(field,'SWISS-CUP-ROUND-1:'+eventId):swissScores(field,history).map(x=>x.id);
 const seen=(a,b)=>[1,2,3,4].some(i=>(history[i]||[]).some(m=>m.ids.includes(a)&&m.ids.includes(b)));
 const pool=[...ordered],out=[];
 while(pool.length){const a=pool.shift(),ix=pool.findIndex(id=>!seen(a,id)),b=pool.splice(ix<0?0:ix,1)[0];if(!b)fail('Swiss pairing left one car unmatched');out.push([a,b]);}
 return out;
}
function swissPlan(b,sp,rows,position,track){
 const row=rows[position-1],cup=Number(S(row.eventId).slice('T2-SWISS-'.length)),visits=rowsFor(rows,row.eventId);
 if(!Number.isSafeInteger(cup)||cup<1||visits.length!==8||row.visitTotal!==8||visits.some((r,i)=>r.visit!==i+1))fail('Invalid Swiss Cup stage inventory');
 if(row.pending||sp.cars.length<cup*16)fail('Swiss Cup has fewer than sixteen available cars');
 if(!b.events[row.eventId]){
  const full=stableShuffle(sp.cars.map(c=>S(c.id)),'SWISS-FULL-GARAGE:'+S(sp.id)+'|'+b.signature);
  b.events[row.eventId]={field:full.slice((cup-1)*16,cup*16),roundByes:{},name:row.name};
 }
 const field=b.events[row.eventId].field;
 if(field.length!==16||new Set(field).size!==16||field.some(id=>!sp.cars.some(c=>S(c.id)===id)))fail('Swiss Cup roster no longer matches Garage');
 const history=swissHistory(b,sp,visits,row.visit),visit=row.visit;
 if(visit>1&&!history[visit-1])fail('Previous Swiss visit must finish first');
 let pairs=[];
 if(visit<=4)pairs=swissPairs(field,history,visit,row.eventId);
 else if(visit===5){const ranked=swissScores(field,history);if(ranked[7].wins===ranked[8].wins&&ranked[7].oppWins===ranked[8].oppWins&&ranked[7].time===ranked[8].time)fail('Swiss Top Eight cut has unresolved tie');pairs=[[0,7],[1,6],[2,5],[3,4]].map(([a,b])=>[ranked[a].id,ranked[b].id]);}
 else if(visit===6)pairs=[[0,3],[1,2]].map(([a,b])=>[history[5][a].winner,history[5][b].winner]);
 else if(visit===7)pairs=[[history[6][0].loser,history[6][1].loser]];
 else pairs=[[history[6][0].winner,history[6][1].winner]];
 const expect=visit<=4?8:visit===5?4:visit===6?2:1;
 if(pairs.length!==expect||Number(row.workload)!==expect||new Set(pairs.flat()).size!==2*expect||pairs.flat().some(id=>!field.includes(id)))fail('Swiss stage bracket failed verification');
 const assigned=track.assigned.find(r=>r.position===position&&r.eventId===row.eventId);
 if(!assigned||assigned.tracks.length!==1||!S(assigned.tracks[0].name))fail('Swiss stage missing its real FH5 course');
 const matches=pairs.map(([a,c],i)=>({id:'SWISS-R'+visit+'-M'+(i+1),carIds:[a,c],track:assigned.tracks[0].name}));
 return {source:SOURCE,scheduleId:'TET2-397-'+b.signature,slotId:'TET2-'+position,competitionId:row.eventId,
  lockHash:hash(JSON.stringify({signature:b.signature,row:[row.position,row.eventId,row.visit],matches,trackId:assigned.tracks[0].id})),
  label:'#'+position+' · '+row.name+' · '+row.stage,mode:'raceoff',matches};
}
function swissReceipt(b,sp,rows,eventId){
 const visits=rowsFor(rows,eventId),ev=b.events[eventId];if(!ev||visits.length!==8)fail('Swiss Cup has not been drawn');
 const h=swissHistory(b,sp,visits,9),semis=h[6],br=h[7]?.[0],final=h[8]?.[0];
 if(!semis||semis.length!==2||!br||!final||!semis.map(x=>x.loser).includes(br.winner)||!semis.map(x=>x.loser).includes(br.loser)||!semis.map(x=>x.winner).includes(final.winner)||!semis.map(x=>x.winner).includes(final.loser))fail('Swiss semifinals, bronze and final provenance invalid');
 const ledger=officialLed(sp),proof=hash(JSON.stringify({signature:b.signature,eventId,definitions:visits.map(r=>b.definitions[String(r.position)]),results:visits.map(r=>ledger.slots['TET2-'+r.position]?.results)}));
 return {eventId,kind:'swiss-cup',format:'knockout',completed:true,verified:true,fieldCarIds:ev.field,
  medals:{gold:[final.winner],silver:[final.loser],bronze:[br.winner]},semifinalLoserIds:semis.map(x=>x.loser),
  semifinalsCompleted:true,bronzeDuelCompleted:true,bronzeDuelWinnerId:br.winner,proof};
}
// Source-backed three-car Relay: each team races exactly one DIFFERENT car per leg.
function relayParts(row){const m=/^(Qualifying|Final) · round (\d+) · group (\d+)\/(\d+)$/.exec(S(row.stage));
 if(!m)fail('Unsupported native Relay round label');return {type:m[1],round:+m[2],group:+m[3],groups:+m[4]};}
function relayOutcome(sp,slot,spec){if(!slot?.completedAt||!sameDef(slot.definition,spec)||spec.mode!=='relay')fail('Relay group not officially complete');
 const engine=root.rhEvil2Rules181;if(typeof engine?.scoreThreeStages!=='function')fail('Native Relay scoring engine missing');
 const map=new Map(sp.cars.map(c=>[S(c.id),c]));const entries=spec.teams.map(t=>({id:t.id,cars:t.carIds.map(id=>map.get(id))})),results=[];
 for(let i=0;i<3;i++)for(const t of spec.teams){const ms=slot.results['r:'+i+':'+t.id];if(!Number.isSafeInteger(ms)||ms<=0)fail('Relay team leg not banked');results.push({entryId:t.id,carId:t.carIds[i],stage:i+1,timeMs:ms});}
 const rank=engine.scoreThreeStages(entries,results);if(rank.length!==spec.teams.length||rank.some(x=>!Number.isInteger(x.total)))fail('Incomplete Relay standings');
 if(rank.length>1&&rank[0].total===rank[1].total)fail('Relay group victory tied — record an approved resolution before advancing');return rank;
}
function relayPlan(b,sp,rows,position,track){const row=rows[position-1],isMixed=row.eventId==='T2-RELAY-MIXED',isMaker=row.eventId==='T2-RELAY-MANUFACTURER';
 if(!isMixed&&!isMaker||row.format!=='RELAY')fail('Unsupported Relay source');const parts=relayParts(row),visits=rowsFor(rows,row.eventId),count=Number(row.workload);
 if(!Number.isInteger(count)||count<2||count>8||parts.group>parts.groups)fail('Relay stage workload invalid');
 const engine=root.rhEvil2Rules181;if(typeof engine?.drawMixedRelay!=='function'||typeof engine?.drawMakerRelay!=='function')fail('Native Relay drawing engine unavailable');
 const assigned=track.assigned.find(r=>r.position===position&&r.eventId===row.eventId);
 if(!assigned||assigned.tracks.length!==3||new Set(assigned.tracks.map(t=>t.id)).size!==3)fail('Relay stage requires three different real FH5 tracks');
 let teams=[];const seed=Number.parseInt(hash(row.eventId+'|'+row.visit+'|'+b.signature),16)||181;
 if(parts.round===1){
   const prev=visits.filter(r=>r.visit<row.visit&&relayParts(r).round===1),usedCars=new Set(),usedMakers=new Set();
   for(const earlier of prev){const spec=b.definitions[String(earlier.position)],slot=officialLed(sp).slots['TET2-'+earlier.position];
     if(!spec||!slot?.completedAt)fail('Previous first-round Relay groups must be finished');relayOutcome(sp,slot,spec);
     for(const t of spec.teams){for(const id of t.carIds){if(usedCars.has(id))fail('Relay reused a first-round car');usedCars.add(id);}if(isMaker){const make=S(sp.cars.find(c=>S(c.id)===t.carIds[0])?.make);if(usedMakers.has(make))fail('Relay reused a first-round manufacturer');usedMakers.add(make);}}
   }
   const available=sp.cars.filter(c=>!usedCars.has(S(c.id))&&(!isMaker||!usedMakers.has(S(c.make)))).map(c=>({id:S(c.id),make:S(c.make),name:S(c.name)}));
   const pool=isMixed?engine.drawMixedRelay(available,seed).teams:engine.drawMakerRelay(available,seed);
   if(pool.length<count)fail('Not enough eligible three-car Relay teams');
   const before=prev.reduce((n,r)=>n+Number(r.workload),0);
   teams=pool.slice(0,count).map((t,i)=>({id:isMixed?'mixed:'+(before+i+1):'maker:'+S(t.make),label:isMixed?'Mixed '+(before+i+1):S(t.make),carIds:t.cars.map(c=>S(c.id))}));
 }else{
   const prev=visits.filter(r=>relayParts(r).round===parts.round-1).sort((a,b)=>relayParts(a).group-relayParts(b).group);
   if(!prev.length)fail('Relay previous round has no qualifying groups');
   const victors=prev.map(r=>{const spec=b.definitions[String(r.position)],slot=officialLed(sp).slots['TET2-'+r.position];
     if(!spec||!slot)fail('Prior Relay round must be recorded');const standings=relayOutcome(sp,slot,spec),winner=spec.teams.find(t=>t.id===standings[0].entryId);if(!winner)fail('Relay winner missing');return winner;});
   const offset=visits.filter(r=>relayParts(r).round===parts.round&&relayParts(r).group<parts.group).reduce((n,r)=>n+Number(r.workload),0);
   teams=victors.slice(offset,offset+count).map(clone);
   if(teams.length!==count)fail('Advancing Relay group size mismatches source');
 }
 const ids=teams.flatMap(t=>t.carIds),map=new Map(sp.cars.map(c=>[S(c.id),c]));if(ids.length!==count*3||new Set(ids).size!==ids.length||ids.some(id=>!map.has(id))||new Set(teams.map(t=>t.id)).size!==teams.length)fail('Relay duplicated or invented participants');
 for(const t of teams){const makes=new Set(t.carIds.map(id=>S(map.get(id).make)));if(makes.size!==(isMixed?3:1))fail('Relay three-car manufacturer rule violated');}
 if(!b.events[row.eventId])b.events[row.eventId]={name:row.name,field:sp.cars.map(c=>S(c.id)),roundByes:{}};
 const tracks=assigned.tracks.map(t=>S(t.name));return {source:SOURCE,scheduleId:'TET2-397-'+b.signature,slotId:'TET2-'+position,competitionId:row.eventId,
  lockHash:hash(JSON.stringify({signature:b.signature,row:[row.position,row.eventId,row.visit],teams,tracks:assigned.tracks.map(t=>t.id)})),label:'#'+position+' · '+row.name+' · '+row.stage,mode:'relay',teams,tracks};
}
function relayReceipt(b,sp,rows,eventId){const visits=rowsFor(rows,eventId),last=visits.at(-1),parts=relayParts(last);
 if(parts.type!=='Final'||parts.groups!==1)fail('Relay competition must finish with one final group');
 for(const r of visits){const def=b.definitions[String(r.position)],slot=officialLed(sp).slots['TET2-'+r.position];if(!def||!slot?.completedAt)fail('Relay incomplete');relayOutcome(sp,slot,def);}
 const spec=b.definitions[String(last.position)],slot=officialLed(sp).slots['TET2-'+last.position],rank=relayOutcome(sp,slot,spec);
 if(rank.length<2||rank.length>4)fail('Final Relay must contain 2–4 podium-eligible teams');
 if(rank.length>=3&&(rank[1].total===rank[2].total||rank.length>3&&rank[2].total===rank[3].total))fail('Relay podium ties need approved resolution');
 const teams=rank.map(x=>spec.teams.find(t=>t.id===x.entryId)),medals={gold:teams[0].carIds,silver:teams[1].carIds,bronze:teams[2]?.carIds||[]};
 const proof=hash(JSON.stringify({signature:b.signature,eventId,results:visits.map(r=>officialLed(sp).slots['TET2-'+r.position]?.results)}));
 return {eventId,kind:eventId==='T2-RELAY-MIXED'?'mixed-relay':'manufacturer-relay',format:'relay-standings',completed:true,verified:true,teamCount:rank.length,fieldCarIds:spec.teams.flatMap(t=>t.carIds),teamCarIds:spec.teams.map(t=>t.carIds),medals,proof};
}
function aeroPlan(b,sp,rows,position,track){const row=rows[position-1],visits=rowsFor(rows,row.eventId);
 if(row.eventId!=='T2-AERODROMO-DOUBLE'||row.format!=='DRAG + JUMP')fail('Incorrect Aeródromo source');
 const event=b.events[row.eventId]||(b.events[row.eventId]={name:row.name,field:stableShuffle(sp.cars.map(c=>S(c.id)),row.eventId+'|'+b.signature)});
 if(new Set(event.field).size!==sp.cars.length||event.field.length!==sp.cars.length)fail('Aeródromo all-car roster changed');
 const offset=visits.filter(r=>r.visit<row.visit).reduce((n,r)=>n+Number(r.workload),0),count=Number(row.workload);
 if(!Number.isInteger(count)||count<2||count>16||offset+count>event.field.length||visits.reduce((n,r)=>n+Number(r.workload),0)!==event.field.length)fail('One-attempt Aeródromo batches do not cover every Garage car');
 const assigned=track.assigned.find(r=>r.position===position&&r.eventId===row.eventId);
 if(!assigned||assigned.tracks.length!==1||assigned.tracks[0].id!=='fh5-track-v1-0132')fail('Aeródromo requires the fixed canonical Drag Strip track');
 const carIds=event.field.slice(offset,offset+count),dragId=assigned.tracks[0].id;
 return {source:SOURCE,scheduleId:'TET2-397-'+b.signature,slotId:'TET2-'+position,competitionId:row.eventId,
  lockHash:hash(JSON.stringify({signature:b.signature,row:[row.position,row.eventId,row.visit],carIds,dragId})),label:'#'+position+' · '+row.name+' · '+row.stage,
  mode:'aero',carIds,track:S(assigned.tracks[0].name),jumpFacility:'Aeródromo runway'};
}
function aeroReceipt(b,sp,rows,fullEventId){const part=fullEventId.split(':')[1],eventId='T2-AERODROMO-DOUBLE';if(!['drag','jump'].includes(part))fail('Specify completed Drag or Long Jump leaderboard');
 const visits=rowsFor(rows,eventId),event=b.events[eventId],ledger=officialLed(sp),records=[];
 if(!event||!visits.length)fail('Aeródromo event not started');
 for(const r of visits){const spec=b.definitions[String(r.position)],slot=ledger.slots['TET2-'+r.position];
  if(!spec||!slot?.completedAt||!sameDef(spec,slot.definition)||spec.mode!=='aero')fail('Aeródromo slot not completed');
  for(const id of spec.carIds){const value=slot.results['a:'+part+':'+id];if(!Number.isSafeInteger(value)||value<(part==='jump'?0:1))fail('Missing official one-attempt score');records.push({id,value});}
 }
 if(new Set(records.map(r=>r.id)).size!==event.field.length||records.length!==event.field.length)fail('Aeródromo full Garage was not covered exactly once');
 records.sort((a,c)=>part==='drag'?a.value-c.value:a.value-c.value?c.value-a.value:a.id.localeCompare(c.id));
 if(records.length<3||[1,2,3].some(i=>i<records.length&&records[i-1].value===records[i].value))fail('Aeródromo podium has an unresolved time/distance tie');
 return {eventId:fullEventId,kind:part==='drag'?'aerodromo-drag':'aerodromo-long-jump',format:'standings',completed:true,verified:true,fieldCarIds:event.field,
  medals:{gold:[records[0].id],silver:[records[1].id],bronze:[records[2].id]},proof:hash(JSON.stringify({signature:b.signature,fullEventId,results:visits.map(r=>ledger.slots['TET2-'+r.position]?.results)}))};
}
function plan(b,sp,rows,position,track){const row=rows[position-1];if(!row||!isSupported(row))fail('This event format is not yet supported by the official race bridge');
 if(row.pending)fail('Event pending a complete eligible field');if(row.origin==='historical'){if(!root.TET2HistoricalLive401?.plan)fail('The original FH5 competition engine is unavailable');return root.TET2HistoricalLive401.plan({b,sp,rows,position,track,signature:b.signature,source:SOURCE});}if(['T2-GAUNTLET-ALL','T2-DRIFT-CHAMPIONSHIP'].includes(row.eventId))return groupPlan(b,sp,rows,position,track);if(row.origin==='relay')return relayPlan(b,sp,rows,position,track);if(row.origin==='aerodromo')return aeroPlan(b,sp,rows,position,track);if(/^T2-SWISS-\d+$/.test(row.eventId))return swissPlan(b,sp,rows,position,track);const scheduleRows=rowsFor(rows,row.eventId),groups=rounds(scheduleRows),index=groups.findIndex(x=>x.rows.some(y=>y.position===position));if(index<0)fail('Competition visit not found');
 if(!b.events[row.eventId]){if(row.visit!==1)fail('Cannot enter later event stage before its opening draw');b.events[row.eventId]={field:field(sp,row),roundByes:{},name:row.name};}
 const g=groups[index],all=stageMatches(b,sp,groups,index),offset=g.rows.slice(0,g.rows.findIndex(x=>x.position===position)).reduce((n,x)=>n+Number(x.workload||0),0),count=Number(row.workload);
 if(!Number.isInteger(count)||count<1||count>8||offset+count>all.length)fail('A scheduled slot must have between 1 and 8 verified matches');
 const route=track.assigned.find(x=>x.position===position&&x.eventId===row.eventId);
 if(!route||route.tracks.length!==1)fail('One genuine FH5 course is required for the full knockout round');
 const matches=all.slice(offset,offset+count).map((m,i)=>({id:m.id,carIds:m.carIds,track:route.tracks[0].name}));
 if(new Set(matches.flatMap(x=>x.carIds)).size!==matches.length*2)fail('Same car appears twice in one slot');
 const spec={source:SOURCE,scheduleId:'TET2-397-'+b.signature,slotId:'TET2-'+position,competitionId:row.eventId,lockHash:hash(JSON.stringify({signature:b.signature,row:[row.position,row.eventId,row.visit],matches})),label:'#'+position+' · '+row.name+' · '+row.stage,mode:'raceoff',matches};
 return spec;}
function verifyLockedSlot({spaceId,scheduleId,slotId,lockHash}){try{const sp=current(),rows=schedule(),track=routes(),b=state(sp);if(!b||b.signature!==sig(sp,rows,track)||S(spaceId)!==S(sp.id))return {verified:false};
 const d=b.definitions[String(slotId).replace(/^TET2-/,'')];if(!d||d.scheduleId!==scheduleId||d.slotId!==slotId||d.lockHash!==lockHash)return {verified:false};return {verified:true,definition:clone(d)};}catch(_){return {verified:false};}}
function inspect(){const sp=current(),rows=schedule(),track=routes(),signature=sig(sp,rows,track);const existing=state(sp);
 if(existing&&existing.signature!==signature)fail('Garage or approved Evil List changed after official start. No results altered; restore the original state before continuing');
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
function finishCurrent(){const x=inspect(),active=x.ledger.currentId&&x.ledger.slots[x.ledger.currentId];if(!active||active.completedAt)fail('No unfinished slot');const result=root.TET2SlotLedger361.finish();try{const next=inspect();for(const medal of pendingMedals(next)){publishMedal(medal.id);}}catch(e){root.console?.warn?.('TET2 honours: completed race saved; medal publication can be resumed: '+e.message);}return result;}
function receiptFor(b,sp,rows,eventId){
 if(rows.some(r=>r.origin==='historical'&&r.eventId===eventId))return root.TET2HistoricalLive401.receipt({b,sp,rows,eventId,signature:b.signature});
 if(['T2-GAUNTLET-ALL','T2-DRIFT-CHAMPIONSHIP'].includes(eventId))return groupResult(b,sp,rows,eventId);if(eventId==='T2-RELAY-MIXED'||eventId==='T2-RELAY-MANUFACTURER')return relayReceipt(b,sp,rows,eventId);if(eventId.startsWith('T2-AERODROMO-DOUBLE:'))return aeroReceipt(b,sp,rows,eventId);if(/^T2-SWISS-\d+$/.test(eventId))return swissReceipt(b,sp,rows,eventId);
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
 return Object.keys(x.b.events).flatMap(eventId=>eventId==='T2-AERODROMO-DOUBLE'?[eventId+':drag',eventId+':jump']:[eventId]).filter(id=>!existing.includes(id)).flatMap(id=>{try{return [{id,receipt:receiptFor(x.b,x.sp,x.rows,id)}];}catch(_){return [];}});
}
function publishMedal(eventId){const x=inspect(),pending=pendingMedals(x),match=pending.find(p=>p.id===eventId);if(!match)fail('No completed verified competition is eligible for this medal publication');
 const e=root.tet2HonoursBridge358?.publish?.(x.sp,x.sp.cars,match.receipt,root.rhSave);
 if(!e)fail('Official honours publisher unavailable');return e;
}
function locationButton(t){return root.TET2TrackLocation403?.button?.(t)||'';}
function html(){try{const x=inspect();if(!x.next)return `<div class="t2-a388"><h3>✅ ALL SCHEDULED VISITS COMPLETE</h3></div>`;
 const roundRoutes=x.proposal?.mode==='raceoff'?[...new Set(x.proposal.matches.map(m=>S(m.track)))]:[];
 const slot=x.ledger.slots['TET2-'+x.position],support=!!x.proposal,medals=pendingMedals(x),need=slot?(slot.definition.mode==='group'?slot.definition.carIds.length*slot.definition.tracks.length:slot.definition.mode==='relay'?slot.definition.teams.length*3:slot.definition.mode==='aero'?slot.definition.carIds.length*2:slot.definition.matches.length):0,banked=slot?Object.keys(slot.results||{}).length:0,allBanked=!!slot&&banked===need;
 return `<div class="t2-a388"><h3>🏁 OFFICIAL RACING · SLOT ${x.position}</h3><p><b>${esc(x.next.name)}</b> · ${esc(x.next.stage)}</p><p>Completed ${x.completed} / ${x.rows.length} visits. ${x.b.startedAt?'Tournament start recorded':'Tournament not started'}.</p>${support?`<p>✅ Verified ${x.proposal.mode==='group'?x.proposal.carIds.length+' cars · '+x.proposal.tracks.length+' timed route(s)':x.proposal.mode==='relay'?x.proposal.teams.length+' three-car Relay teams · 3 legs':x.proposal.mode==='aero'?x.proposal.carIds.length+' cars · drag + one jump each':x.proposal.matches.length+' head-to-head matches'} with genuine FH5 course identities and actual Garage cars.</p><ol>${['group','aero'].includes(x.proposal.mode)?x.proposal.carIds.map(id=>{const c=x.sp.cars.find(z=>S(z.id)===id);return '<li>'+esc(c?.name||id)+'</li>';}).join(''):x.proposal.mode==='relay'?x.proposal.teams.map(t=>'<li>'+esc(t.label)+' · '+t.carIds.map(id=>esc(x.sp.cars.find(c=>S(c.id)===id)?.name||id)).join(' / ')+'</li>').join(''):x.proposal.matches.slice(0,8).map(m=>{const map=new Map(x.sp.cars.map(c=>[S(c.id),S(c.name)]));return '<li>'+esc(map.get(m.carIds[0])||m.carIds[0])+' vs '+esc(map.get(m.carIds[1])||m.carIds[1])+'</li>';}).join('')}</ol><p>${x.proposal.mode==='raceoff'?'<strong>ROUND TRACK'+(roundRoutes.length===1?'':'S')+':</strong> '+roundRoutes.map(t=>esc(t)+' '+locationButton(t)).join(' · '):['group','relay'].includes(x.proposal.mode)?x.proposal.tracks.map(t=>'<span class="t2-track-choice403">'+esc(t)+' '+locationButton(t)+'</span>').join(' · '):x.proposal.mode==='aero'?esc(x.proposal.track)+' '+locationButton(x.proposal.track)+' · Aeródromo runway':''}</p>${slot?(allBanked?'<p>✅ All '+need+' results banked. You can now mark this slot as done.</p><button class="t2-btn" data-t2-official397="finish">✅ MARK AS DONE · SLOT '+x.position+'</button>':'<p>'+banked+' / '+need+' results saved</p><button class="t2-btn" data-t2-official397="resume">🏁 CONTINUE RACING · SLOT '+x.position+'</button>'):'<button class="t2-btn" data-t2-official397="enter">🏁 ENTER RACE RESULTS · SLOT '+x.position+'</button>'}`:`<p class="t2-a388-status fail">⛔ ${esc(x.block)}</p>`}${medals.map(m=>`<p>🏆 Verified finished competition: ${esc(m.id)} <button class="t2-btn" data-t2-official397="medal" data-t2-medal-id="${esc(m.id)}">PUBLISH VERIFIED MEDALS</button></p>`).join('')}<p><small>Real results are recorded against the current Evil List slot. Completed draws and results are preserved. An event-specific issue will be shown here if it needs attention.</small></p></div>`;
 }catch(e){return `<div class="t2-a388" role="alert">⛔ ${esc(e.message)}</div>`;}}
function action(e,navigate,render){const btn=e.target.closest?.('[data-t2-official397]');if(!btn)return false;try{if(btn.dataset.t2Official397==='enter'||btn.dataset.t2Official397==='start'){start();navigate('entry');}else if(btn.dataset.t2Official397==='resume'){root.TET2SlotLedger361.resumeActive();navigate('entry');}else if(btn.dataset.t2Official397==='finish'){finishCurrent();render();}else if(btn.dataset.t2Official397==='medal'){if(root.confirm&&!root.confirm('Publish verified completed competition medals?'))return true;publishMedal(btn.dataset.t2MedalId);render();}}catch(err){root.alert?.(err.message);render();}return true;}
const api=Object.freeze({inspect,plan,verifyLockedSlot,start,finishCurrent,receiptFor,pendingMedals,publishMedal,html,action,KEY});
// The existing official ledger requires an explicit, repeatably verifiable schedule source.
if(root.TET2ControlledChaosVerifiedSchedule&&root.TET2ControlledChaosVerifiedSchedule.verifyLockedSlot!==verifyLockedSlot){/* Preserve an existing verified slot source. */}
else root.TET2ControlledChaosVerifiedSchedule=Object.freeze({verifyLockedSlot});
return api;
});
