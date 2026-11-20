/* OTG! Main 8.0.387 — TET2 official-honours projection and read-only Medal Tables.
 * NO writes of any kind. Rehearsal / candidate schedule data are NEVER imported.
 * Pure validators support a future locked official result publisher. The real
 * official receipt bridge v8358 remains the only source of displayed medals.
 */
(function(root,factory){'use strict';
 const api=factory(root);
 if(root)root.TET2Honours387=api;
 if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis,function(root){
'use strict';
const S=x=>String(x??'').trim();
const esc=x=>S(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const copy=x=>JSON.parse(JSON.stringify(x));
function stop(why){throw Error('TET2 honours safe stop: '+why);}
function required(s,label){const v=S(s);if(!v)stop(label+' is missing');return v;}
function uniqueIds(arr,label,min=0){if(!Array.isArray(arr)||arr.length<min)stop(label+' must contain at least '+min+' entries');
 const v=arr.map(x=>required(x,label+' car ID'));if(new Set(v).size!==v.length)stop(label+' repeats a car');return v;}
function scalar(x,label,allowZero=false){if(!Number.isSafeInteger(x)||(allowZero?x<0:x<=0))stop(label+' is not a valid integer result');return x;}
function ranking(field,entries,direction){
 const f=uniqueIds(field,'Competition field',2);if(!Array.isArray(entries)||entries.length!==f.length)stop('Final standings do not include every entrant');
 if(!['low','high'].includes(direction))stop('Unknown timing/scoring direction');
 const map=new Map();for(const r of entries){const id=required(r?.carId,'Standing car ID');
  if(!f.includes(id)||map.has(id))stop('Standings contain a duplicate or non-entrant car');
  map.set(id,scalar(r.value,'Final standing value',direction==='high'));}
 const sorted=[...map].sort((a,b)=>direction==='low'?a[1]-b[1]:b[1]-a[1]);
 if(sorted.some((row,i)=>i>0&&row[1]===sorted[i-1][1]))stop('Tied final standings require an actual tie resolution before medals');
 return sorted.map(([carId,value])=>({carId,value}));
}
function medalsFromPositions(ids){return Object.freeze({gold:[ids[0]],silver:[ids[1]],bronze:ids.length>=3?[ids[2]]:[]});}
/* Non-final groups and incomplete competitions cannot award anything. */
function standingsMedals(spec){
 if(spec?.eventFinished!==true||spec?.phase!=='final')stop('No medals for qualifying groups, provisional positions, or incomplete events');
 const ordered=ranking(spec.fieldCarIds,spec.results,spec.direction||'low');
 return Object.freeze({format:'standings',medals:medalsFromPositions(ordered.map(r=>r.carId)),ordered:copy(ordered),publishAllowed:false});
}
function matchResult(m,field,label){
 if(!m||!Array.isArray(m.cars)||m.cars.length!==2)stop(label+' must contain two cars');
 const cars=uniqueIds(m.cars,label,2);if(cars.some(id=>!field.includes(id)))stop(label+' uses a non-entrant');
 if(!Array.isArray(m.times)||m.times.length!==2)stop(label+' is missing both race times');
 const a=scalar(m.times[0],label+' time A'),b=scalar(m.times[1],label+' time B');if(a===b)stop(label+' cannot decide a winner from tied times');
 const order=scalar(m.order,label+' race sequence');
 return {winner:a<b?cars[0]:cars[1],loser:a<b?cars[1]:cars[0],order};
}
function knockoutMedals(spec){
 if(spec?.eventFinished!==true||spec?.phase!=='final')stop('Knockout medals require the completed final');
 const field=uniqueIds(spec.fieldCarIds,'Knockout field',2),n=field.length;
 if(n===3)stop('Three-car knockout medal format needs an explicit source tiebreak rule; no invented bronze');
 const final=matchResult(spec.final,field,'Final');let bronzeId=null,semiLosers=[];
 if(n>=4){if(!Array.isArray(spec.semifinals)||spec.semifinals.length!==2)stop('Two completed semifinal matches are required');
  const semis=spec.semifinals.map((m,i)=>matchResult(m,field,'Semifinal '+(i+1)));
  const semiCars=spec.semifinals.flatMap(m=>m.cars.map(S));if(new Set(semiCars).size!==4)stop('Semifinal cars must be four unique entrants');
  if(new Set(semis.map(x=>x.winner)).size!==2||![final.winner,final.loser].every(id=>semis.some(x=>x.winner===id)))stop('Finalists must be the two winning semifinalists');
  semiLosers=semis.map(x=>x.loser);const bronze=matchResult(spec.bronze,field,'Bronze duel');
  if(new Set(spec.bronze.cars.map(S)).size!==2||!spec.bronze.cars.every(id=>semiLosers.includes(S(id))))stop('Bronze duel must use exactly the two losing semifinalists');
  if(semis.some(x=>x.order>=bronze.order)||bronze.order>=final.order)stop('Bronze duel must be completed after the semifinals and BEFORE the final');
  bronzeId=bronze.winner;
 }else if(spec.bronze||spec.semifinals?.length)stop('Two-car knockout only has a direct final');
 return Object.freeze({format:'knockout',medals:Object.freeze({gold:[final.winner],silver:[final.loser],bronze:bronzeId?[bronzeId]:[]}),
   semifinalLoserIds:semiLosers,bronzeDuelWinnerId:bronzeId,publishAllowed:false});
}
/* All-car Gauntlet and Long Jump have category standings, but their medal
 * deciding point is the COMPLETED competition, NEVER an individual batch.
 * A 1-car manufacturer feeds Lonely Hearts, not a one-car auto-gold table.
 */
function categoryStandings(spec){
 if(spec?.eventFinished!==true||spec?.phase!=='final')stop('Category medals only after the complete all-car competition');
 const cars=spec.cars;if(!Array.isArray(cars)||cars.length<2)stop('Full category standings absent');
 const ids=uniqueIds(cars.map(c=>c.carId),'Category standings',2);const by=new Map();
 for(const c of cars){const id=required(c.carId,'Category car ID');
  by.set(id,{carId:id,make:required(c.make,'Car manufacturer'),performanceClass:required(c.performanceClass,'Car performance class'),type:required(c.type,'Car type'),value:scalar(c.value,'Category result',spec.direction==='high')});}
 const direction=spec.direction||'low';const makers=new Map();for(const c of by.values())makers.set(c.make,(makers.get(c.make)||0)+1);
 const groups=new Map([['Overall',[...ids]]]);
 for(const c of by.values()){
  const labels=[['Performance class: '+c.performanceClass,'class'],['Car type: '+c.type,'type']];
  if(makers.get(c.make)>=2)labels.push(['Manufacturer: '+c.make,'make']);
  else labels.push(['Lonely Hearts','lonely']);
  for(const [k] of labels){if(!groups.has(k))groups.set(k,[]);groups.get(k).push(c.carId);}
 }
 const awards=[];for(const [name,carIds] of groups){
  if(carIds.length<2)continue;
  const ordered=ranking(carIds,carIds.map(id=>({carId:id,value:by.get(id).value})),direction);
  awards.push({category:name,count:carIds.length,medals:medalsFromPositions(ordered.map(r=>r.carId))});
 }
 return Object.freeze({awards,publishAllowed:false});
}
/* Compute three independent, TET2-only record badges from frozen, officially
 * verified race runs. A track and discipline must be uniquely identified.
 * No database/storage writes: return a NEW record projection. Existing OTG!
 * Track Records remain entirely untouched.
 */
function projectRecords(spec){
 if(spec?.officialChainLocked!==true||spec?.allRunsVerified!==true)stop('Records need a frozen official schedule and verified run provenance');
 const all=spec.runs;if(!Array.isArray(all)||!all.length)stop('No verified race runs supplied');
 const prev=spec.previous||{track:{},competition:{},car:{}};
 for(const k of ['track','competition','car'])if(!prev[k]||typeof prev[k]!=='object'||Array.isArray(prev[k]))stop('Record baseline unavailable: '+k);
 const next=copy(prev),seen=new Set(),badges=[];
 for(const r of all){
  const slot=required(r.slotId,'Frozen slot'),visit=required(r.visitId,'Race visit'),car=required(r.carId,'Car ID'),event=required(r.eventId,'Competition ID'),route=required(r.routeId,'Verified track/route ID');
  if(!['time','distance'].includes(r.discipline))stop('Unknown record discipline');
  if(S(r.unit)!==(r.discipline==='time'?'ms':'mm'))stop('Record values must be normalised to milliseconds or millimetres before comparison');
  if(r.verified!==true||r.locked!==true)stop('Unverified run cannot set a record');
  const value=scalar(r.value,'Run value',r.discipline==='distance');
  const key=JSON.stringify([slot,visit,car,route,r.discipline]);if(seen.has(key))stop('Run appears twice in one result chain');seen.add(key);
  const core=JSON.stringify([r.discipline,route]);
  const keys={track:core,competition:JSON.stringify([event,core]),car:JSON.stringify([car,core])};
  const badge={slotId:slot,carId:car,eventId:event,routeId:route,discipline:r.discipline,value,
    trackRecord:false,competitionRecord:false,carPersonalBest:false};
  for(const [table,k] of [['track','trackRecord'],['competition','competitionRecord'],['car','carPersonalBest']]){
   const old=next[table][keys[table]];
   if(old!==undefined)scalar(old,'Existing '+table+' record',r.discipline==='distance');
   if(old===undefined||(r.discipline==='time'?value<old:value>old)){
     next[table][keys[table]]=value;badge[k]=true;
   }
  }
  badges.push(badge);
 }
 return Object.freeze({badges,proposedRecords:next,committed:false});
}
function officialSnapshot(){
 const space=root.rhSpace?.();if(!space||space.catalogueKey!=='fh5-catalogue-v1'||!S(space.id)||!Array.isArray(space.cars))stop('Real FH5 Catalogue Garage not connected');
 const source=root.tet2HonoursBridge358;if(typeof source?.results!=='function')stop('Isolated verified official-result bridge unavailable');
 const ledger=source.results(space,space.cars);
 if(!Array.isArray(ledger.receipts)||!ledger.medalTable?.cars||!ledger.medalTable?.manufacturers)stop('Validated honours receipt index unavailable');
 // Never read local rehearsal keys, legacy OTG honours, or candidate standings.
 return Object.freeze({verifiedCompetitions:ledger.receipts.length,medalTable:ledger.medalTable,garage:space.cars,
    scheduleLocked:false,recordBridgeConnected:false});
}
function medalRows(map,labels){return Object.entries(map).map(([id,r])=>({id,name:S(labels?.get(id))||id,
 gold:scalar(r.gold,'Gold count',true),silver:scalar(r.silver,'Silver count',true),bronze:scalar(r.bronze,'Bronze count',true)}))
 .map(r=>({...r,total:r.gold+r.silver+r.bronze}))
 .sort((a,b)=>b.gold-a.gold||b.silver-a.silver||b.bronze-a.bronze||a.name.localeCompare(b.name));}
function table(rows,head){const body=rows.length?rows.map((r,i)=>`<tr><td>${i+1}</td><td>${esc(r.name)}</td><td>${r.gold}</td><td>${r.silver}</td><td>${r.bronze}</td><td>${r.total}</td></tr>`).join(''):
 '<tr><td colspan="6" class="t2-h387-empty">No verified completed TET2 competitions yet.</td></tr>';
 return `<div class="t2-h387-scroll"><table class="t2-h387-table"><thead><tr><th>#</th><th>${esc(head)}</th><th>🥇</th><th>🥈</th><th>🥉</th><th>Total</th></tr></thead><tbody>${body}</tbody></table></div>`;}
function html(){try{const s=officialSnapshot(),carNames=new Map(s.garage.map(c=>[S(c.id),S(c.name)||[c.year,c.make,c.model].filter(Boolean).join(' ')]));
 const makers=medalRows(s.medalTable.manufacturers),cars=medalRows(s.medalTable.cars,carNames);
 return `<section class="t2-h387-summary"><h2>🏆 VERIFIED TOURNAMENT HONOURS</h2><div class="t2-h387-stats"><div><b>${s.verifiedCompetitions}</b><span>Finished competitions</span></div><div><b>${cars.length}</b><span>Medal-winning cars</span></div><div><b>${makers.length}</b><span>Manufacturers represented</span></div></div>
 <p>Only <strong>completed, validated TET2 competition receipts</strong> appear below. Qualifying groups, provisional results, practice sessions and OTG! racing never award TET2 medals.</p>
 <p class="t2-h387-guard">🔒 Official Slot 001 is still locked. These tables read the existing isolated TET2 receipt bridge; no awards have been published or imported.</p></section>
 <section class="t2-h387-card"><h2>🏭 Manufacturer medal table</h2>${table(makers,'Manufacturer')}</section>
 <section class="t2-h387-card"><h2>🚗 Car medal table</h2>${table(cars,'Car')}</section>
 <section class="t2-h387-card"><h2>⏱️ Racing records</h2><p>The validated results engine can compare <strong>track records</strong>, <strong>competition records</strong> and <strong>individual car personal bests</strong> separately. For Long Jump, the longest distance wins; for timed routes, the lowest time wins.</p><p class="t2-h387-guard">🔒 Record publishing awaits a locked Evil List, authoritative track IDs and verified official runs. No provisional record badges or OTG! records have been changed.</p></section>`;
 }catch(err){return `<section class="t2-h387-card" role="alert"><h2>🔒 MEDAL TABLES</h2><p>${esc(err.message)}</p><p>No unofficial medals have been substituted.</p></section>`;}}
return Object.freeze({standingsMedals,knockoutMedals,categoryStandings,projectRecords,officialSnapshot,medalRows,html});
});
