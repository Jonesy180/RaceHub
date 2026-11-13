/* OTG! MAIN v8.0.232 — UNLIMITED SLOT PLANNER / QA ONLY.
   Pure in-memory scheduling model; never writes Garage, Spaces, localStorage,
   racing results, event medals, or private files. Not an official tournament draw. */
(()=>{'use strict';
const s=x=>String(x??'').trim();
function finiteInt(n){return Number.isSafeInteger(n)&&n>=1&&n<=Number.MAX_SAFE_INTEGER;}
function createPlanner(locked=[]){
 if(!Array.isArray(locked))throw Error('Existing locked slots must be an array.');
 const entries=[],slotIds=new Set(),entryIds=new Set();let last=0;
 for(const r of locked){
   if(!r||!finiteInt(r.slot)||r.slot!==last+1||!s(r.entryId)||entryIds.has(r.entryId))throw Error('Locked slot history has an invalid or duplicate identity.');
   last=r.slot;entryIds.add(s(r.entryId));slotIds.add(last);entries.push(Object.freeze({...r,locked:true}));
 }
 const retainedPrefix=JSON.stringify(entries);
 let next=last+1,completedSources=new Set(),enteredCars=new Set(),waiting=[],groups=[],cups=[],deferred=[],lateCount=0;
 function add(entry){
   if(!entry||!s(entry.entryId)||!s(entry.kind)||!s(entry.stage)||entryIds.has(s(entry.entryId)))throw Error('Duplicate/missing event identity or stage.');
   if(!finiteInt(next))throw Error('Slot count exceeds safe numeric range.');
   const item=Object.freeze({slot:next++,entryId:s(entry.entryId),kind:s(entry.kind),stage:s(entry.stage),eventId:s(entry.eventId),phase:s(entry.phase)||'main',locked:false});
   entries.push(item);entryIds.add(item.entryId);slotIds.add(item.slot);return item;
 }
 function defer(entry){
   if(!entry||!s(entry.entryId)||!s(entry.kind)||!s(entry.stage)||entryIds.has(s(entry.entryId))||deferred.some(x=>x.entryId===s(entry.entryId)))throw Error('Invalid/duplicate deferred event.');
   deferred.push({...entry,phase:'finals'});return deferred.length;
 }
 function sourceComplete(t){
   if(!t||t.finished!==true||t.medalsAwarded!==true)return{accepted:false,reason:'Source has not finished and awarded medals.'};
   const sourceId=s(t.sourceId),carId=s(t.carId),type=s(t.kind).toLowerCase();
   if(type==='relay'||type==='mixed relay'||type==='manufacturer relay')return{accepted:false,reason:'Relays never supply Second Chance tickets.'};
   if(!sourceId||!carId)return{accepted:false,reason:'Missing source or car identity.'};
   if(completedSources.has(sourceId))return{accepted:false,reason:'Competition has already provided a ticket.'};
   if(enteredCars.has(carId))return{accepted:false,reason:'Car has already entered Second Chance once.'};
   completedSources.add(sourceId);enteredCars.add(carId);waiting.push({sourceId,carId});
   let groupSlot=null;
   if(waiting.length>=4){
     const tickets=waiting.splice(0,4),n=groups.length+1, cupNumber=Math.ceil(n/4), groupLetter='ABCD'[(n-1)%4];
     groupSlot=add({entryId:`second-chance:cup${cupNumber}:group${groupLetter}`,kind:'Second Chance',stage:`Cup ${cupNumber} Group ${groupLetter}`,eventId:`second-chance:cup${cupNumber}`,phase:'rolling'});
     groups.push({cup:cupNumber,letter:groupLetter,slot:groupSlot.slot,tickets,winnerCarId:null});
   }
   return{accepted:true,groupSlot:groupSlot?.slot||null,waiting:waiting.length};
 }
 function groupFinished(number,winnerCarId){
   const g=groups[number-1];if(!g)throw Error('Group does not exist.');
   if(g.winnerCarId)throw Error('This group result was already recorded.');
   if(!g.tickets.some(t=>t.carId===winnerCarId))throw Error('Winner must be one of the four group entrants.');
   g.winnerCarId=winnerCarId;
   const gs=groups.filter(x=>x.cup===g.cup);
   if(gs.length===4&&gs.every(x=>x.winnerCarId)){
     const cnum=g.cup;
     if(cups.some(x=>x.cup===cnum))throw Error('Cup finals queued twice.');
     const champs=gs.map(x=>x.winnerCarId);
     for(let i=1;i<=2;i++)defer({entryId:`second-chance:cup${cnum}:semi${i}`,kind:'Second Chance',stage:`Cup ${cnum} Semifinal ${i}`,eventId:`second-chance:cup${cnum}`});
     defer({entryId:`second-chance:cup${cnum}:final`,kind:'Second Chance',stage:`Cup ${cnum} Final`,eventId:`second-chance:cup${cnum}`});
     cups.push({cup:cnum,groupWinners:champs,finalsQueued:true});
   }
   return{group:number,cup:g.cup,cupFinalsQueued:cups.some(x=>x.cup===g.cup)};
 }
 function finalizeQueued(){const list=deferred.splice(0);for(const item of list){add(item);lateCount++;}return list.length;}
 function snapshot(){return{total:entries.length,nextSlot:next,lockedCount:locked.length,rollingGroups:groups.length,completedCups:cups.length,pendingQualifiers:waiting.length,finalsQueued:deferred.length,finalsScheduled:lateCount,distinctEntered:enteredCars.size,highestSlot:entries.at(-1)?.slot||0,slots:entries.slice()};}
 function verify(){const a=entries;
   if(entries.some((x,i)=>x.slot!==i+1)||entryIds.size!==a.length||slotIds.size!==a.length||JSON.stringify(a.slice(0,locked.length))!==retainedPrefix)throw Error('Schedule invariant failure: locked slots, unique identity, or consecutive numbers.');
   if(groups.some(g=>g.tickets.length!==4||new Set(g.tickets.map(t=>t.carId)).size!==4))throw Error('Second Chance group contains duplicate cars.');
   return true;
 }
 return{add,defer,sourceComplete,groupFinished,finalizeQueued,snapshot,verify};
}
function inventory(state){
 if(!state||!Array.isArray(state.spaces))throw Error('Saved Space inventory unavailable.');
 const sp=state.spaces.find(x=>x.catalogueKey==='fh5-catalogue-v1');
 if(!sp)return{found:false,note:'No FH5 Catalogue Space found; no production draw can be calculated.'};
 let cars=[];const engine=window.rhEvil2Rules181;
 if(engine&&typeof engine.carsOf==='function')cars=engine.carsOf(sp);
 else {const used=new Set();cars=(sp.cars||[]).filter(c=>{if(!c||!s(c.id)||used.has(c.id))return false;used.add(c.id);return true;});}
 const makers=new Map(),types=new Map();
 for(const c of cars){const mk=s(c.make)||'Unknown',ty=s(c.type||c.classType)||'Unclassified';makers.set(mk,(makers.get(mk)||0)+1);types.set(ty,(types.get(ty)||0)+1);}
 const producerMakers=[...makers.values()].filter(x=>x>=3).length;
 return{found:true,spaceId:sp.id,spaceName:sp.name,ownedCars:cars.length,manufacturerCandidates:producerMakers,typeFields:types.size,manufacturerFields:makers.size,note:'These are live Garage candidate counts, NOT drawn events or a final slot total. Long Jump has one attempt per eligible car, but attempt-to-slot packing has not been finalised.'};
}
function stress(sourceCount=1400){
 if(!Number.isSafeInteger(sourceCount)||sourceCount<20||sourceCount>30000)throw Error('QA fixture source count out of bounds.');
 const frozen=[1,2,3].map(slot=>({slot,entryId:`locked:sample:${slot}`,kind:'Already completed',stage:'Historic QA sample',eventId:`old:${slot}`}));
 const planner=createPlanner(frozen);
 const initial=JSON.stringify(frozen);
 for(let i=0;i<sourceCount;i++){
   const id=`synthetic:source:${i+1}`;
   planner.add({entryId:`qa-round:${i+1}`,eventId:id,kind:i%10===0?'Race Off':i%5===0?'Specialist':'Small completed event',stage:'Completed early final',phase:'main'});
   if(i%13===0)planner.defer({entryId:`qa-extra-final:${i+1}`,eventId:`unrelated-major:${i+1}`,kind:'Major Championship',stage:'Finals Night conclusion'});
   const q=planner.sourceComplete({sourceId:id,carId:`synthetic-car-${i+1}`,finished:true,medalsAwarded:true,kind:'Race Off'});
   if(!q.accepted)throw Error('Synthetic valid source was rejected.');
   if(q.groupSlot){const n=planner.snapshot().rollingGroups;planner.groupFinished(n,`synthetic-car-${i-2}`);}
 }
 const before=planner.snapshot();
 const duplicateCar=planner.sourceComplete({sourceId:'qa-new-event',carId:'synthetic-car-1',finished:true,medalsAwarded:true,kind:'Race Off'});
 const duplicateSource=planner.sourceComplete({sourceId:'synthetic:source:1',carId:'qa-fresh-car',finished:true,medalsAwarded:true,kind:'Race Off'});
 const relay=planner.sourceComplete({sourceId:'qa-relay',carId:'qa-unique-relay-car',finished:true,medalsAwarded:true,kind:'relay'});
 const incomplete=planner.sourceComplete({sourceId:'qa-unfinished',carId:'qa-unique-car',finished:false,medalsAwarded:false,kind:'Race Off'});
 if([duplicateCar,duplicateSource,relay,incomplete].some(x=>x.accepted))throw Error('One-entry/Relay/source-finish guard failure.');
 const late=planner.finalizeQueued(),out=planner.snapshot();
 if(!planner.verify()||JSON.stringify(out.slots.slice(0,3))!==JSON.stringify(frozen.map(x=>({...x,locked:true})))||initial!==JSON.stringify(frozen))throw Error('Locked/completed slot preserved check failed.');
 const result={passed:true,kind:'SYNTHETIC QA ONLY',originalLocked:3,completedSourceFixtures:sourceCount,highestSlot:out.highestSlot,groups:out.rollingGroups,cups:out.completedCups,pendingTickets:out.pendingQualifiers,lateFinals:late,consecutive:true,duplicatesBlocked:true,relaysBlocked:true,overLegacy1219:out.highestSlot>1219,originalResultsWritten:false};
 if(!result.overLegacy1219)throw Error('No-cap stress case failed to exceed legacy 1219.');
 return result;
}
window.rhEvil2SlotPlanner8232={createPlanner,inventory,stress};
})();
