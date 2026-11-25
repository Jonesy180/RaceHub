/* OTG! v8.0.438: shared, read-only event → result layout planner.
   This module never reads or mutates a Garage, draw, ledger or results. Source
   controllers remain responsible for verifying entrants, courses and banking.
   No arbitrary UI caps: if an event explicitly lists N participants or tracks,
   its plan contains N participants or tracks. Competition-specific constraints
   (e.g. head-to-head = 2 and relay = 3 legs) remain authoritative. */
(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.OTGAdaptiveResults437=api;})(typeof window!=='undefined'?window:null,function(){
'use strict';
const clean=v=>String(v??'').trim();
const arr=v=>Array.isArray(v)?v:[];
const validIds=(rows,type)=>{if(!rows.length)throw Error(type+' has no entries');const ids=rows.map((x,i)=>clean(x?.id||x?.carId||x?.teamId||('item-'+(i+1))));if(ids.some(x=>!x)||new Set(ids).size!==ids.length)throw Error(type+' has duplicate or missing identities');return ids;};
function plan(event){
 if(!event||typeof event!=='object')throw Error('An event definition is required');
 const kind=clean(event.kind||event.mode),name=clean(event.label||event.name)||'Results';
 if(['group','single','festival','multi-track','custom','pick-my-ride','league'].includes(kind)){
   const entrants=arr(event.entrants||event.cars||event.players);const ids=validIds(entrants,'Entrants');
   const courses=arr(event.courses||event.tracks);if(!courses.length)throw Error('Event has no defined courses');
   const stages=courses.map((course,i)=>({index:i,name:clean(typeof course==='string'?course:course?.name),measure:clean(event.measure||course?.measure)||'time'}));
   if(stages.some(x=>!x.name))throw Error('Event has an unnamed course');
   const mode=stages.length===1?'multi-entrant':'car-first';
   return Object.freeze({kind,name,layout:mode,entrantCount:ids.length,stageCount:stages.length,resultCount:ids.length*stages.length,entrants:entrants.map((e,i)=>({id:ids[i],name:clean(e.name||e.label)||ids[i]})),stages});
 }
 if(['raceoff','swiss','knockout','fixtures','head-to-head'].includes(kind)){
   const fixtures=arr(event.fixtures||event.matches);validIds(fixtures,'Fixtures');
   return Object.freeze({kind,name,layout:'round-fixtures',fixtureCount:fixtures.length,resultCount:fixtures.length*2,roundLabel:clean(event.roundLabel||event.stage||event.round)||'Current round',fixtures:fixtures.map((f,i)=>{
     const entrants=arr(f.cars||f.entrants);if(entrants.length!==2)throw Error('A head-to-head fixture requires exactly two entrants');
     return {id:clean(f.id)||'match-'+(i+1),name:clean(f.name)||'Match '+(i+1),entrants:entrants.map(x=>({id:clean(x.id||x.carId),name:clean(x.name||x.label)})),course:clean(f.track||f.course)};
   })});
 }
 if(kind==='relay'){
   const teams=arr(event.teams);validIds(teams,'Teams');const courses=arr(event.courses||event.tracks);
   const legs=Number(event.legs||courses.length);if(legs!==3||courses.length!==3)throw Error('This Relay format requires its three declared legs');
   if(teams.some(t=>arr(t.cars).length!==legs))throw Error('Every Relay team requires a car for each leg');
   return Object.freeze({kind,name,layout:'team-first',teamCount:teams.length,legCount:legs,resultCount:teams.length*legs});
 }
 if(kind==='aero'){
   const entrants=arr(event.entrants||event.cars);validIds(entrants,'Aeródromo cars');
   return Object.freeze({kind,name,layout:'car-first-mixed',entrantCount:entrants.length,resultCount:entrants.length*2,stages:[{name:'Drag',measure:'time'},{name:'Long Jump',measure:'distance'}]});
 }
 throw Error('Unsupported event kind: '+kind);
}
return Object.freeze({plan,version:'8.0.438'});
});
