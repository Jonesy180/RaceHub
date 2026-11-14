/* OTG! v8.0.243 — read-only rolling Second Chance placement forecast.
   IMPORTANT: 5–6 finals is a useful PLAN WINDOW, never an eligibility quota.
   A Group is scheduled ONLY after four genuine, unique below-bronze qualifiers.
   If the immediately-below-bronze car has already had its one Second Chance
   entry, offer that source's ONE ticket to the next ranked finisher, and so on.
   Past slot numbers/results, medals, sources and Garage are never changed. */
(()=>{'use strict';
 const S=x=>String(x??'').trim();
 function plan(sources,ownedCars){
  if(!Array.isArray(sources)||!Array.isArray(ownedCars))throw Error('Sources and owned cars required');
  const before=JSON.stringify(sources),allow=new Set(ownedCars.map(c=>S(typeof c==='object'?c.id:c)));
  if(allow.size!==ownedCars.length||allow.has(''))throw Error('Duplicate or missing owned car identities');
  const seenSources=new Set(),usedCars=new Set(),tickets=[],groups=[],skipped=[],timeline=[];
  let awaiting=[],finalNumber=0,fallbacks=0;
  for(const f of sources){
   const id=S(f.id),family=S(f.family).toLowerCase();
   if(!id||seenSources.has(id))throw Error('Missing or duplicate competition source');
   seenSources.add(id);
   // Final identity is counted for scheduling even when it yields no ticket.
   const isComplete=f.complete===true && f.medalsAwarded===true;
   if(!isComplete){skipped.push({id,why:'unfinished / medals not awarded'});continue;}
   finalNumber++;
   timeline.push({kind:'FINISHED SOURCE',id,finalNumber});
   if(/relay/.test(family)){skipped.push({id,why:'Relay excluded'});continue;}
   const rank=Number(f.lastBronzeRank),standings=f.standings;
   if(![3,4].includes(rank)||f.rankingVerified!==true||!Array.isArray(standings)||standings.length<rank+1){
    skipped.push({id,why:'no valid final placing below bronze'});continue;
   }
   if(family.includes('race off') && f.sameCourseWithinEliminationRounds!==true){
    skipped.push({id,why:'Race Off elimination ranks unverified by shared round course'});continue;
   }
   const ids=standings.map(x=>S(typeof x==='object'?x.carId:x));
   if(ids.some(x=>!allow.has(x))||new Set(ids).size!==ids.length){
    skipped.push({id,why:'bad or duplicate race placing identity'});continue;
   }
   let chosen=null,chosenRank=0;
   for(let i=rank;i<ids.length;i++)if(!usedCars.has(ids[i])){chosen=ids[i];chosenRank=i+1;break;}
   if(!chosen){skipped.push({id,why:'every finisher below bronze has already entered'});continue;}
   usedCars.add(chosen);
   if(chosenRank>rank+1)fallbacks++;
   const t={sourceId:id,carId:chosen,rank:chosenRank,originalRank:rank+1,finalNumber};
   tickets.push(t);awaiting.push(t);
   timeline.push({kind:'SECOND CHANCE TICKET',sourceId:id,carId:chosen,rank:chosenRank,finalNumber});
   if(awaiting.length===4){
    const g={number:groups.length+1,afterFinal:finalNumber,sourceIds:awaiting.map(x=>x.sourceId),cars:awaiting.map(x=>x.carId)};
    groups.push(g);
    timeline.push({kind:'SECOND CHANCE GROUP',afterFinal:finalNumber,number:g.number,cars:g.cars.slice()});
    awaiting=[];
   }
  }
  const checks={
   singleCarEntry:new Set(tickets.map(x=>x.carId)).size===tickets.length,
   oneTicketPerSource:new Set(tickets.map(x=>x.sourceId)).size===tickets.length,
   groupsOfFour:groups.every(x=>x.cars.length===4&&new Set(x.cars).size===4),
   noEagerGroup:groups.length===Math.floor(tickets.length/4),
   originalInputsUnchanged:JSON.stringify(sources)===before
  };
  if(Object.values(checks).some(v=>!v))throw Error('Rolling Second Chance safety invariant failed');
  return{readOnly:true,qaOnly:true,finalsObserved:finalNumber,tickets,groups,awaiting:awaiting.length,
   fallbackTickets:fallbacks,skipped,timeline,checks,launchReady:false};
 }
 function fixture(st){
   const before=JSON.stringify(st);
   const g=window.rhEvil2GarageDraw8233?.garage(st);
   if(!g?.cars||g.cars.length<360)throw Error('Need a large live owned FH5 Garage for read-only synthetic final fixture');
   const cars=g.cars.map(x=>S(x.id)),chosen=[],events=[],skipAt=new Map([[3,'Relay'],[8,'Only 3'],[10,'Relay'],[15,'Only 3']]);
   for(let n=1;n<=16;n++){
     const skip=skipAt.get(n),top=[cars[(n*3)%240],cars[(n*3+1)%240],cars[(n*3+2)%240]];
     let ranks=top.slice();
     if(skip==='Relay')ranks.push(cars[300+n]);
     else if(skip==='Only 3'){} // no rank below bronze
     else {
       const repeated=[7,14].includes(n)&&chosen.length;
       if(repeated)ranks.push(chosen[0]);
       ranks.push(cars[300+n]);
       ranks.push(cars[330+n]);
       chosen.push(cars[300+n]);
     }
     events.push({id:'qa-only-finish-'+n,family:skip==='Relay'?'Manufacturer Relay':'Manufacturer Festival',complete:true,
       medalsAwarded:true,lastBronzeRank:3,rankingVerified:true,standings:ranks});
   }
   const p=plan(events,g.cars),expected=[5,11,16];
   if(p.groups.length!==3||p.groups.some((x,i)=>x.afterFinal!==expected[i])||p.fallbackTickets!==2)
    throw Error('Synthetic five/six-finals cadence QA mismatch');
   if(JSON.stringify(st)!==before)throw Error('Live saved Spaces mutated');
   return{...p,ownedLiveCars:g.cars.length,expectedSpacing:'5 finals → group; 6 more → group; 5 more → group',
    note:'All 16 finals and finishing orders in this demonstration are FAKE QA fixtures, NOT actual tournament results. Actual group creation follows four verified unique tickets, not a rigid 5–6 finals timer.'};
 }
 window.rhEvil2RollingFinals8243={plan,fixture};
})();
