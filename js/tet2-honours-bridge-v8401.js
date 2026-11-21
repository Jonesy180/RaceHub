/* OTG! Main 8.0.399 (v8358-compatible interface) — TET2 isolated official-result / medals bridge.
 * Official tournament receipts ONLY. The existing OTG! results and honours are NEVER edited.
 * Requires explicit caller confirmation, not a page scan or legacy result inference.
 */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)Object.defineProperty(root,'tet2HonoursBridge358',{value:api,configurable:false});
})(typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:null,function(){
 'use strict';
 const K='tet2Stage3HonoursV8358';
 const S=x=>String(x??'').trim();
 const clone=v=>JSON.parse(JSON.stringify(v));
 function fail(x){throw Error('TET2 honours: '+x)}
 function ids(list,label){if(!Array.isArray(list))fail(label+' must be an array');const a=list.map(S);if(a.some(x=>!x)||new Set(a).size!==a.length)fail(label+' IDs missing or duplicated');return a}
 function validateReceipt(r,owned){
   if(!r||typeof r!=='object'||r.completed!==true||r.verified!==true)fail('Only verified FINAL receipts are allowed');
   const eventId=S(r.eventId),kind=S(r.kind);if(!eventId||!kind)fail('Missing source event identity or kind');
   const cars=new Map(owned.map(c=>[S(c.id),c]));if(!cars.size||cars.size!==owned.length||cars.has(''))fail('Garage car IDs invalid');
   const field=ids(r.fieldCarIds,'field');if(field.length<2||field.some(id=>!cars.has(id)))fail('Field must contain real Garage cars');
   const medal=r.medals||{},gold=ids(medal.gold||[],'gold'),silver=ids(medal.silver||[],'silver'),bronze=ids(medal.bronze||[],'bronze');
   const isRelay=r.format==='relay-standings';
   if(isRelay){
     const teams=r.teamCarIds,teamCount=r.teamCount;
     if(!['mixed-relay','manufacturer-relay'].includes(kind)||!Array.isArray(teams)||teams.length!==teamCount||teamCount<2||teamCount>4)fail('Relay team standings incomplete');
     if(teams.some(t=>!Array.isArray(t)||t.length!==3||t.some(id=>!field.includes(S(id))))||new Set(teams.flatMap(x=>x.map(S))).size!==field.length)fail('Relay podium roster must contain complete distinct three-car teams');
     if(gold.length!==3||silver.length!==3||bronze.length!==(teamCount>=3?3:0))fail('Relay podium awards complete teams, with bronze only for three-plus teams');
     const corresponds=ids=>teams.some(t=>JSON.stringify(t.map(S).sort())===JSON.stringify([...ids].sort()));
     if(!corresponds(gold)||!corresponds(silver)||(bronze.length&&!corresponds(bronze)))fail('Relay medal winners must be complete teams');
     if(kind==='manufacturer-relay'&&teams.some(t=>new Set(t.map(id=>S(cars.get(id)?.make))).size!==1))fail('Maker Relay teams must each use one manufacturer');
     if(kind==='mixed-relay'&&teams.some(t=>new Set(t.map(id=>S(cars.get(id)?.make))).size!==3))fail('Mixed Relay teams must contain distinct manufacturers');
   }else if(gold.length!==1||silver.length!==1||bronze.length!==(field.length>=3?1:0))fail('Expected one gold, one silver and exactly one bronze for fields of 3+');
   const all=[...gold,...silver,...bronze];if(new Set(all).size!==all.length||all.some(id=>!field.includes(id)))fail('Medals reference duplicate or non-entrant cars');
   let semi=null;
   if(r.format==='knockout'){
     if(field.length>=4){
       const losers=ids(r.semifinalLoserIds,'semifinal losers');
       if(losers.length!==2||losers.some(id=>!field.includes(id)))fail('Two losing semifinalists required');
       if(r.bronzeDuelCompleted!==true||r.semifinalsCompleted!==true||!S(r.bronzeDuelWinnerId))fail('Completed bronze duel required before final');
       if(bronze[0]!==S(r.bronzeDuelWinnerId)||!losers.includes(bronze[0]))fail('Bronze medal must belong to verified bronze-duel winner');
       if(losers.some(id=>gold.includes(id)||silver.includes(id)))fail('Semifinal losers cannot be final gold/silver');
       semi=losers;
     }
   }else if(!['standings','relay-standings'].includes(r.format))fail('Competition must declare knockout, standings or Relay standings format');
   const allowedKind=['manufacturer-raceoff','lonely-hearts-knockout'].includes(kind);
   const scEligible=allowedKind&&r.format==='knockout'&&field.length>=4&&semi!==null;
   const makerGold=S(cars.get(gold[0])?.make);if(!makerGold)fail('Winner manufacturer missing');
   const make=S(r.make);
   if(kind==='manufacturer-raceoff'&&(!make||field.some(id=>S(cars.get(id)?.make)!==make)))fail('Manufacturer Race Off field must be from one named manufacturer');
   if(r.finalBeforeBronze===true)fail('Bronze duel must be raced before final');
   return Object.freeze({eventId,kind,format:r.format,fieldCarIds:field,fieldSize:field.length,
      medals:{gold,silver,bronze},winnerId:gold[0],make:kind==='manufacturer-raceoff'?make:makerGold,
      completed:true,verified:true,semifinalsCompleted:!!semi,bronzeDuelCompleted:!!semi,
      bronzeDuelWinnerId:semi?bronze[0]:null,semifinalLoserIds:semi||[],secondChanceEligible:scEligible,teamCount:isRelay?r.teamCount:null,teamCarIds:isRelay?r.teamCarIds.map(x=>x.map(S)):null,
      proof:S(r.proof)||null});
 }
 function get(space){if(!space||!S(space.id))fail('Real active Space required');const obj=space[K];
   if(!obj)return {schema:1,spaceId:S(space.id),receipts:{}};
   if(obj.schema!==1||obj.spaceId!==S(space.id)||!obj.receipts||Array.isArray(obj.receipts))fail('Saved TET2 receipt ledger invalid');
   return clone(obj);
 }
 function stage(space,owned,receipt){const prev=get(space),rec=validateReceipt(receipt,owned);const old=prev.receipts[rec.eventId];
   if(old){if(JSON.stringify(old)===JSON.stringify(rec))return {state:prev,receipt:rec,duplicate:true};fail('Conflicting result for '+rec.eventId+'; completed results are immutable');}
   if(!rec.proof)fail('Final result provenance/proof required');
   prev.receipts[rec.eventId]=clone(rec);return {state:prev,receipt:rec,duplicate:false};}
 function publish(space,owned,receipt,save){
   if(typeof save!=='function')fail('Real existing save function required');
   const staged=stage(space,owned,receipt);if(staged.duplicate)return staged;
   const previous=space[K];space[K]=staged.state;
   try{save()}catch(e){if(previous===undefined)delete space[K];else space[K]=previous;throw e;}
   return staged;
 }
 function results(space,owned){const all=Object.values(get(space).receipts).map(r=>validateReceipt(r,owned));
   const medalTable={cars:{},manufacturers:{}};
   for(const r of all){for(const colour of ['gold','silver','bronze'])for(const id of r.medals[colour]){
     const car=owned.find(c=>S(c.id)===id),make=S(car.make);
     // Every podium finisher earns a CAR medal. A manufacturer earns only
     // a GOLD for the winning car, and never for manufacturer-only events.
     const carRow=medalTable.cars[id]||(medalTable.cars[id]={gold:0,silver:0,bronze:0});
     carRow[colour]++;
     if(colour==='gold'&&!['manufacturer-raceoff','manufacturer-relay','historical-manufacturer-festival','historical-manufacturer-raceoff'].includes(r.kind)){
       const makerRow=medalTable.manufacturers[make]||(medalTable.manufacturers[make]={gold:0,silver:0,bronze:0});
       makerRow.gold++;
     }
   }}
   return {receipts:all,medalTable,secondChanceSources:all.filter(r=>r.secondChanceEligible),manufacturerWins:all.filter(r=>r.kind==='manufacturer-raceoff')};
 }
 function finalBattles(space,owned){const a=results(space,owned);const engine=typeof window!=='undefined'?window.tet2FinalBattles356:null;
   if(!engine)fail('TET2 Final Battles 356 engine not loaded');
   return {honours:a.medalTable,...engine.finalBattles(owned,a.secondChanceSources,a.manufacturerWins)};
 }
 return Object.freeze({validateReceipt,stage,publish,results,finalBattles,storageKey:K});
});
