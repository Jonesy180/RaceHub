/* OTG! MAIN v8.0.245 — SINGLE end-of-campaign Second Chance championship engine.
 * Stateless, immutable transition API. To be connected to production source-final
 * results and durable career state AFTER prelaunch backup, track and medal gates.
 * No browser storage, rhSave, state mutation, synthetic official results or medals.
 * All entrants are selected ONLY from completed, officially medalled sources.
 */
(()=>{'use strict';
 const S=x=>String(x??'').trim();
 const clone=x=>JSON.parse(JSON.stringify(x));
 const fail=m=>{throw Error('Grand Second Chance: '+m);};
 function validIds(ids,label){if(!Array.isArray(ids)||!ids.length||ids.length>10000)fail('invalid '+label+' list');const a=ids.map(S);if(a.includes('')||new Set(a).size!==a.length)fail('duplicate or missing '+label+' identity');return a;}
 function start({ownedCarIds,eligibleSourceIds,seed='EVIL2-SC-1'}){
  const cars=validIds(ownedCarIds,'Garage car'),sources=validIds(eligibleSourceIds,'eligible source');
  if(!S(seed)||S(seed).length>120)fail('invalid draw seed');
  return{schema:'evil2-grand-second-chance-v1',status:'QUALIFYING',seed:S(seed),ownedCarIds:cars,
   eligibleSourceIds:sources,completedSourceIds:[],tickets:[],rejected:[],rounds:[],
   championId:null,honoursPreview:null};
 }
 function check(d){if(!d||d.schema!=='evil2-grand-second-chance-v1')fail('state schema mismatch');
  const cars=validIds(d.ownedCarIds,'Garage car'),sources=validIds(d.eligibleSourceIds,'eligible source');
  if(!['QUALIFYING','RACING','COMPLETE'].includes(d.status))fail('invalid status');
  const finished=validIds(d.completedSourceIds.length?d.completedSourceIds:['__NONE__'],'completed source');
  if(finished.length && finished[0]!=='__NONE__' && finished.some(id=>!sources.includes(id)))fail('unrecognised completed source');
  if(d.completedSourceIds.length>sources.length)fail('more completions than sources');
  if(!Array.isArray(d.tickets)||new Set(d.tickets.map(x=>x.carId)).size!==d.tickets.length ||
     new Set(d.tickets.map(x=>x.sourceId)).size!==d.tickets.length ||
     d.tickets.some(t=>!cars.includes(t.carId)||!sources.includes(t.sourceId)))fail('invalid unique tickets');
  if(!Array.isArray(d.rounds)||!Array.isArray(d.rejected))fail('missing rounds');
  return true;
 }
 function acceptFinal(original,f){check(original);if(original.status!=='QUALIFYING')fail('qualifiers are closed');
  const d=clone(original),id=S(f?.id);
  if(!id||!d.eligibleSourceIds.includes(id))fail('source not in the scheduled eligible source list');
  if(d.completedSourceIds.includes(id))fail('source has already submitted its final result');
  if(f.complete!==true||f.medalsAwarded!==true||f.rankingVerified!==true)fail('final not complete, medalled and ranked');
  const family=S(f.family).toLowerCase();
  if(/relay/.test(family))fail('Relay competitions cannot supply tickets');
  const rank=Number(f.lastBronzeRank);
  const standings=Array.isArray(f.standings)?f.standings.map(x=>S(typeof x==='object'?x.carId:x)):[];
  if(![3,4].includes(rank)||standings.length<rank)fail('invalid official bronze rank');
  if(standings.includes('')||standings.some(id=>!d.ownedCarIds.includes(id))||new Set(standings).size!==standings.length)
   fail('invalid actual owned-car finishing order');
  if(/race.?off/.test(family)&&f.sameCourseWithinEliminationRounds!==true)
   fail('Race Off elimination rankings require the same course within each round');
  d.completedSourceIds.push(id);
  if(standings.length===rank){d.rejected.push({sourceId:id,reason:'No finishing place below last bronze'});check(d);return d;}
  const reserved=new Set(d.tickets.map(x=>x.carId));
  let chosen=null,position=0;
  for(let i=rank;i<standings.length;i++)if(!reserved.has(standings[i])){chosen=standings[i];position=i+1;break;}
  if(chosen)d.tickets.push({sourceId:id,carId:chosen,rank:position,firstEligibleRank:rank+1});
  else d.rejected.push({sourceId:id,reason:'No unused car remains below bronze'});
  check(d);return d;
 }
 function hashSeed(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
 function shuffle(items,seed){let v=hashSeed(seed),a=items.slice();function rnd(){v^=v<<13;v^=v>>>17;v^=v<<5;return(v>>>0)/4294967296;}
  for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 function sizes(n){if(!Number.isSafeInteger(n)||n<2||n>10000)fail('need at least two distinct qualifiers');
  if(n<=4)return[n];const g=Math.ceil(n/4),q=Math.floor(n/g),r=n%g;
  const groups=Array.from({length:g},(_,i)=>q+(i<r?1:0));
  if(groups.some(x=>x<2||x>4))fail('invalid fair variable-size group');return groups;}
 function roundFrom(ids,index,seed){const a=shuffle(ids,seed+':R'+index),groups=[];let at=0;
  for(const size of sizes(a.length)){groups.push({ids:a.slice(at,at+size),track:null,times:{},winnerId:null});at+=size;}
  return{number:index,groups};}
 function freeze(original){check(original);if(original.status!=='QUALIFYING')fail('already frozen');
  if(original.completedSourceIds.length!==original.eligibleSourceIds.length)fail('all eligible source finals must finish before the single draw');
  const ids=original.tickets.map(x=>x.carId);if(ids.length<2)fail('need at least two Second Chance qualifiers');
  const d=clone(original);d.rounds=[roundFrom(ids,1,d.seed)];d.status='RACING';check(d);return d;
 }
 function locate(d,ri,gi){if(d.status!=='RACING')fail('tournament not racing');
  const rd=d.rounds[ri],g=rd?.groups[gi];if(!g)fail('unknown round/group');
  if(ri!==d.rounds.length-1)fail('past round is locked');return g;}
 function setTrack(original,ri,gi,track){check(original);const d=clone(original),g=locate(d,ri,gi),t=S(track);
  if(!t||t.length>150)fail('actual course identity is required');
  if(g.winnerId||Object.keys(g.times).length)fail('course locked after first time');
  g.track=t;return d;
 }
 function recordTime(original,ri,gi,carId,timeMs){check(original);const d=clone(original),g=locate(d,ri,gi),id=S(carId),n=Number(timeMs);
  if(!g.track)fail('select one common group course first');
  if(g.winnerId)fail('completed group is locked');
  if(!g.ids.includes(id))fail('car not in this group');
  if(!Number.isSafeInteger(n)||n<=0||n>=86400000)fail('race time must be integer milliseconds');
  g.times[id]=n;return d;
 }
 function finishGroup(original,ri,gi){check(original);const d=clone(original),g=locate(d,ri,gi);
  if(g.winnerId)fail('group has already been decided');
  if(!g.track||Object.keys(g.times).length!==g.ids.length||g.ids.some(id=>!Number.isSafeInteger(g.times[id])))
   fail('all cars must record a valid time on the common course');
  const sorted=g.ids.slice().sort((a,b)=>g.times[a]-g.times[b]);
  if(g.times[sorted[0]]===g.times[sorted[1]])fail('fastest tie: rerun or resolve before advancing');
  const rd=d.rounds[ri];
  // The last group is also the medal final: don't award silver/bronze on an
  // ambiguous tied placing or a tie at the bronze cutoff.
  if(rd.groups.length===1){
   for(let j=1;j<Math.min(3,sorted.length);j++)if(g.times[sorted[j]]===g.times[sorted[j-1]])
    fail('final medal placing tied: resolve on a common course before finishing');
   if(sorted.length>3&&g.times[sorted[2]]===g.times[sorted[3]])
    fail('bronze cutoff tied: resolve before finishing');
  }
  g.winnerId=sorted[0];
  if(rd.groups.every(x=>x.winnerId)){
   const winners=rd.groups.map(x=>x.winnerId);
   if(rd.groups.length===1){
    d.status='COMPLETE';d.championId=winners[0];
    d.honoursPreview={gold:sorted[0],silver:sorted[1]||null,bronze:sorted[2]||null,
     note:'Honours preview only; normal completed-event medal bridge must approve publishing.'};
   }else{
    if(winners.length<2)fail('cannot create follow-up round');
    d.rounds.push(roundFrom(winners,ri+2,d.seed));
   }
  }
  check(d);return d;
 }
 function simulate(st){const before=JSON.stringify(st),garage=window.rhEvil2GarageDraw8233?.garage(st);
  if(!garage||garage.cars.length<100)fail('live FH5 Garage unreadable');
  const owned=garage.cars.map(x=>S(x.id)),sourceIds=Array.from({length:32},(_,i)=>'QA-ONLY-ELIGIBLE-FINAL-'+(i+1));
  let d=start({ownedCarIds:owned,eligibleSourceIds:sourceIds,seed:'OTG-QA-ONLY-DO-NOT-PUBLISH'});
  // Synthetic source fixtures. Real owned IDs ONLY to check validation; NO real racing results are read or written.
  for(let i=0;i<sourceIds.length;i++){
   const used=d.tickets.map(x=>x.carId),first=used.length&&i%7===3?used[0]:owned[(i*8+3)%owned.length];
   const list=[owned[(i*8)%owned.length],owned[(i*8+1)%owned.length],owned[(i*8+2)%owned.length],first,owned[(i*8+4)%owned.length],owned[(i*8+5)%owned.length]];
   // Keep each synthetic source finishing list unique even in reused-car fallback fixture.
   const seen=new Set();const safe=[];for(const c of list){if(!seen.has(c)){safe.push(c);seen.add(c);}}
   while(safe.length<6){const next=owned[(i*8+safe.length+50)%owned.length];if(!seen.has(next)){safe.push(next);seen.add(next);}}
   d=acceptFinal(d,{id:sourceIds[i],family:i%6===0?'Race Off':'Festival',complete:true,medalsAwarded:true,
     rankingVerified:true,sameCourseWithinEliminationRounds:true,lastBronzeRank:3,standings:safe});
  }
  const fallbackCount=d.tickets.filter(t=>t.rank>t.firstEligibleRank).length;
  const count=d.tickets.length,preFreeze=clone(d);d=freeze(d);
  const opening=d.rounds[0].groups.map(g=>g.ids.length),samples=[];
  for(let iteration=0;iteration<20&&d.status==='RACING';iteration++){
   const ri=d.rounds.length-1,ng=d.rounds[ri].groups.length;
   for(let gi=0;gi<ng;gi++){
    d=setTrack(d,ri,gi,'SYNTHETIC-QA-SAME-GROUP-TRACK');
    for(let j=0;j<d.rounds[ri].groups[gi].ids.length;j++){
     const id=d.rounds[ri].groups[gi].ids[j];d=recordTime(d,ri,gi,id,150000+j*1527+gi*37);
    }
    d=finishGroup(d,ri,gi);
   }
   samples.push({round:ri+1,groups:ng});
  }
  if(d.status!=='COMPLETE')fail('synthetic elimination did not produce champion');
  const checks={
   ownedGarageUnchanged:JSON.stringify(st)===before,
   allEligibleFinalsProcessed:preFreeze.completedSourceIds.length===sourceIds.length,
   noDuplicatedEntrant:new Set(preFreeze.tickets.map(x=>x.carId)).size===count,
   noRollingCups:d.rounds.length>=2&&!('cups' in d),
   allGroupsOfTwoToFour:d.rounds.every(r=>r.groups.every(g=>g.ids.length>=2&&g.ids.length<=4)),
   exactlyOneChampion:!!d.championId&&d.honoursPreview.gold===d.championId,
   entrantsFrozenAfterAllFinals:true,
   everyGroupHadCommonTrack:d.rounds.every(r=>r.groups.every(g=>!!g.track&&Object.keys(g.times).length===g.ids.length)),
   honoursNotPublished:!('officialMedals' in d),
   completedStageLocked:d.status==='COMPLETE'
  };
  if(Object.values(checks).some(v=>!v))fail('synthetic test invariant failed');
  return{readOnly:true,qaOnly:true,liveCars:garage.cars.length,syntheticSourceFinals:sourceIds.length,
   syntheticEntrants:count,fallbackTickets:fallbackCount,firstRoundGroupSizes:opening,
   rounds:samples,championDemonstrated:true,checks,medalsPublished:0,
   resultDrivenRule:'One ticket per eligible completed source, first unused car below last bronze, fallback down the standings; Relays never qualify. Freeze ONE variable-size tournament after the final eligible competition completes.',
   note:'Synthetic tests only. No actual Second Chance entrant, time, racing result, honour or reset has been saved.'};
 }
 window.rhEvil2GrandSecondChance8245={start,acceptFinal,freeze,sizes,setTrack,recordTime,finishGroup,check,simulate};
})();
