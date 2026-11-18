/* TET2 Stage 3 — production endgame qualification + knockout scheduling primitives.
 * No UI, no storage, no historical data mutation, no obsolete 16-car Cup assumptions.
 * Receipts come from the shared FINAL results pathway; never infer medals from times.
 */
(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object' && module.exports) module.exports=api;
  if(root) Object.defineProperty(root,'tet2FinalBattles356',{value:api,configurable:false});
})(typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:null,function(){
 'use strict';
 const clean=x=>String(x??'').trim();
 function requireId(x,name){const s=clean(x);if(!s)throw Error('Missing '+name);return s;}
 function carsOf(owned){if(!Array.isArray(owned))throw Error('Expected owned Garage car records.');
   const ids=new Set();const cars=owned.map(c=>{const id=requireId(c?.id,'car ID'),make=requireId(c?.make,'manufacturer');if(ids.has(id))throw Error('Duplicate Garage car '+id);ids.add(id);return{id,make,name:clean(c.name)||id};});return cars;}
 function manufacturers(owned){const map=new Map();for(const car of carsOf(owned)){if(!map.has(car.make))map.set(car.make,[]);map.get(car.make).push(car);}return map;}
 // A normalized *completed* result receipt must include an explicit bronze-duel
 // winner. Semifinal loser, ordinary bronze finisher, relay medal, or unverified
 // historical placement is NOT a qualifying ticket.
 function secondChance(owned,receipts){
   const cars=carsOf(owned),byId=new Map(cars.map(c=>[c.id,c]));
   if(!Array.isArray(receipts))throw Error('Expected completed event receipts.');
   const sources=new Set(),entered=new Set(),qualifiers=[],rejections=[];
   for(const r of receipts){
     const sourceId=requireId(r?.eventId,'event ID');
     if(sources.has(sourceId))throw Error('Duplicate competition result '+sourceId);sources.add(sourceId);
     const kind=clean(r?.kind);
     if(!['manufacturer-raceoff','lonely-hearts-knockout'].includes(kind))continue;
     if(r.completed!==true){rejections.push({eventId:sourceId,reason:'Competition unfinished'});continue;}
     if(!Number.isInteger(r.fieldSize)||r.fieldSize<4){rejections.push({eventId:sourceId,reason:'Field under four'});continue;}
     if(r.semifinalsCompleted!==true||r.bronzeDuelCompleted!==true){rejections.push({eventId:sourceId,reason:'Bronze duel not proven complete'});continue;}
     const id=clean(r.bronzeDuelWinnerId),car=byId.get(id);
     if(!car){rejections.push({eventId:sourceId,reason:'Bronze winner not in owned Garage'});continue;}
     if(!Array.isArray(r.semifinalLoserIds)||r.semifinalLoserIds.length!==2||new Set(r.semifinalLoserIds.map(clean)).size!==2||!r.semifinalLoserIds.map(clean).includes(id)){
       rejections.push({eventId:sourceId,reason:'Bronze winner does not match losing semifinalists'});continue;
     }
     if(entered.has(id)){rejections.push({eventId:sourceId,reason:'Duplicate car already qualified'});continue;}
     entered.add(id);qualifiers.push({carId:id,make:car.make,name:car.name,sourceEventId:sourceId});
   }
   return {qualifiers,rejections,fieldSize:qualifiers.length,ready:qualifiers.length>=2};
 }
 // One and only one representative per manufacturer. A make owning exactly
 // one car auto-qualifies. Every make with 2+ cars requires its completed
 // MANUFACTURER RACE OFF winner; Festival gold is not a substitute.
 function champions(owned,receipts){
   const byMake=manufacturers(owned),byId=new Map(carsOf(owned).map(c=>[c.id,c]));
   if(!Array.isArray(receipts))throw Error('Expected manufacturer Race Off receipts.');
   const wins=new Map();
   for(const r of receipts){
     if(clean(r?.kind)!=='manufacturer-raceoff')continue;
     const make=requireId(r.make,'manufacturer receipt make');
     if(wins.has(make))throw Error('Multiple Manufacturer Race Off result receipts for '+make);
     wins.set(make,r);
   }
   const entrants=[],pending=[];
   for(const [make,cars] of byMake){
     if(cars.length===1){entrants.push({make,carId:cars[0].id,name:cars[0].name,sourceEventId:null,automatic:true});continue;}
     const r=wins.get(make),id=clean(r?.winnerId),winner=byId.get(id);
     if(!r||r.completed!==true||!winner||winner.make!==make){pending.push({make,reason:'Completed Manufacturer Race Off winner required'});continue;}
     entrants.push({make,carId:id,name:winner.name,sourceEventId:requireId(r.eventId,'source event ID'),automatic:false});
   }
   const uniques=new Set(entrants.map(e=>e.carId));if(uniques.size!==entrants.length)throw Error('Duplicate Champion of Champions entrant');
   return{entrants,pending,manufacturerCount:byMake.size,ready:pending.length===0&&entrants.length>=2};
 }
 // One elimination bracket with round by round byes. No fixed field cap;
 // number of Evil List visits is determined by workload (max eight actual
 // head-to-head matches per slot), plus mandatory bronze duel before FINAL.
 // Returns a *structural* schedule: later rounds must wait for winners and are
 // never assigned cars speculatively.
 function knockoutPlan(count,options){
   if(!Number.isSafeInteger(count)||count<2)throw Error('Knockout needs at least two entrants');
   const max=options?.maxMatchesPerSlot??8;
   if(!Number.isSafeInteger(max)||max<1||max>8)throw Error('Invalid slot workload');
   const rounds=[],visits=[];let remaining=count,round=1;
   while(remaining>1){
     const next=2**Math.floor(Math.log2(remaining-1));
     const matches=remaining-next;const byes=remaining-2*matches;
     rounds.push({round,entrants:remaining,matches,byes,advancing:next});
     let left=matches,visit=0;
     while(left){const work=Math.min(max,left);visits.push({kind:'knockout',round,visit:++visit,matches:work});left-=work;}
     remaining=next;round++;
   }
   // A duel between the losing semifinalists, before the gold/silver final.
   // The final round is guaranteed a single match; insert bronze immediately
   // before it, never after the tournament finale.
   if(count>=4){
     const idx=visits.findIndex(v=>v.kind==='knockout'&&v.round===rounds.length);
     if(idx<0)throw Error('Final missing');
     visits.splice(idx,0,{kind:'bronze-duel',round:rounds.length,matches:1});
   }
   return{entrantCount:count,rounds,visits,totalVisits:visits.length,totalMatches:rounds.reduce((n,r)=>n+r.matches,0)+(count>=4?1:0)};
 }
 function finalBattles(owned,secondChanceReceipts,manufacturerRaceOffReceipts){
   const second=secondChance(owned,secondChanceReceipts),champion=champions(owned,manufacturerRaceOffReceipts);
   return{secondChance:{...second,plan:second.ready?knockoutPlan(second.fieldSize):null},championOfChampions:{...champion,plan:champion.ready?knockoutPlan(champion.entrants.length):null},order:['SECOND_CHANCE','CHAMPION_OF_CHAMPIONS']};
 }
 return Object.freeze({secondChance,champions,knockoutPlan,finalBattles});
});
