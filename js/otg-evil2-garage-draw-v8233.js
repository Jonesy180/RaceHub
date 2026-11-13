/* OTG! MAIN v8.0.233 — live FH5 Garage-backed competition-entry rehearsal.
   QA READ ONLY. No localStorage, IndexedDB, state mutation, medal writes,
   actual draw locking, results reset, or tournament activation. */
(()=>{'use strict';
 const s=v=>String(v??'').trim();
 const cmp=(a,b)=>a.localeCompare(b,'en');
 const stable=(a,b)=>cmp(a.id,b.id);
 const rng=(seed)=>{let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};};
 const shuffle=(list,r)=>{const a=list.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 const key=v=>encodeURIComponent(v);
 function garage(state){
   const spaces=state?.spaces;
   if(!Array.isArray(spaces))throw Error('Saved OTG Spaces are unavailable. Draw not generated.');
   const space=spaces.find(x=>x.catalogueKey==='fh5-catalogue-v1');
   if(!space)throw Error('No FH5 Catalogue Space found. Other Spaces will NOT be used.');
   if(!s(space.id))throw Error('FH5 Space has no stable identity. Draw blocked.');
   const seen=new Set(),cars=[];
   for(const c of space.cars||[]){
     const id=s(c?.id||c?.catalogueId),make=s(c?.make),type=s(c?.classType)||'Unclassified';
     if(!id||!make||seen.has(id))throw Error('FH5 car ID or manufacturer missing/duplicated. Draw blocked.');
     seen.add(id);
     cars.push({id,make,type,name:s(c?.name)||[c?.make,c?.model,c?.year].filter(Boolean).join(' ')});
   }
   if(!cars.length)throw Error('FH5 Garage is empty. No draw created.');
   return{spaceId:s(space.id),spaceName:s(space.name),cars:cars.sort(stable)};
 }
 function group(cars,field){
   const map=new Map();for(const car of cars){const k=car[field];if(!map.has(k))map.set(k,[]);map.get(k).push(car);}
   return [...map.entries()].sort((a,b)=>cmp(a[0],b[0]));
 }
 function create(state,seed=0xE710233){
   if(!Number.isSafeInteger(seed)||seed<0||seed>0xffffffff)throw Error('Invalid QA seed');
   const {spaceId,spaceName,cars}=garage(state);
   const makeGroups=group(cars,'make'),typeGroups=group(cars,'type');
   const makeRng=rng(seed^0xA1A1),mixedRng=rng(seed^0xB2B2),jumpRng=rng(seed^0xC3C3);
   const makerRelays=makeGroups.filter(([,a])=>a.length>=3).map(([make,list])=>({id:'relay:manufacturer:'+key(make),make,carIds:shuffle(list,makeRng).slice(0,3).map(x=>x.id)}));
   const shuffledPool=new Map(makeGroups.map(([make,list])=>[make,shuffle(list,mixedRng)]));
   let mixedTeams=[];
   while(true){
     const remaining=[...shuffledPool.entries()].filter(([,a])=>a.length).map(([make,a])=>({make,count:a.length,tie:mixedRng()})).sort((a,b)=>b.count-a.count||a.tie-b.tie||cmp(a.make,b.make));
     if(remaining.length<3)break;
     const trio=remaining.slice(0,3).map(({make})=>shuffledPool.get(make).pop());
     mixedTeams.push({id:'relay:mixed:'+String(mixedTeams.length+1),cars:shuffle(trio,mixedRng).map(c=>({id:c.id,make:c.make,name:c.name}))});
   }
   mixedTeams=shuffle(mixedTeams,mixedRng);
   // Mixed team identity follows its content, not transient display position.
   const mixedUsed=mixedTeams.flatMap(t=>t.cars.map(c=>c.id));
   const mixedLeftovers=[...shuffledPool.values()].flat().sort(stable).map(x=>x.id);
   const makeGauntlets=makeGroups.filter(([,a])=>a.length>=2).map(([name,items])=>({id:'gauntlet:make:'+key(name),name,carIds:items.map(x=>x.id),entrantCount:items.length}));
   const typeGauntlets=typeGroups.filter(([,a])=>a.length>=2).map(([name,items])=>({id:'gauntlet:type:'+key(name),name,carIds:items.map(x=>x.id),entrantCount:items.length}));
   const jump=shuffle(cars,jumpRng).map((x,i)=>({id:'jump:'+key(x.id),carId:x.id,name:x.name,make:x.make,order:i+1,attemptsAllowed:1}));
   const oneCarMakes=makeGroups.filter(([,a])=>a.length===1).map(([make,list])=>({make,carId:list[0].id}));
   // A job is an UNCOMMITTED competition start / individual jump attempt.
   // This is not an official race slot, event fixture or a complete tournament.
   const streams=[
     makeGauntlets.map(g=>({entryId:g.id,kind:'Manufacturer Gauntlet',stage:'Provisional start',eventId:g.id,entrants:g.entrantCount})),
     typeGauntlets.map(g=>({entryId:g.id,kind:'Car Type Gauntlet',stage:'Provisional start',eventId:g.id,entrants:g.entrantCount})),
     makerRelays.map(g=>({entryId:g.id,kind:'Manufacturer Relay',stage:'Provisional start',eventId:g.id,entrants:3})),
     mixedTeams.map(g=>({entryId:g.id,kind:'Mixed Relay',stage:'Provisional start',eventId:g.id,entrants:3})),
     jump.map(g=>({entryId:g.id,kind:'Aeródromo Long Jump',stage:g.name,eventId:g.id,entrants:1}))
   ];
   const q=[],ptr=streams.map(()=>0);
   while(streams.some((x,i)=>ptr[i]<x.length))for(let i=0;i<streams.length;i++){if(ptr[i]<streams[i].length){const o=streams[i][ptr[i]++];q.push({...o,previewNumber:q.length+1});}}
   const ids=q.map(x=>x.entryId);
   const checks={
     carIdentityUnique:cars.length===new Set(cars.map(c=>c.id)).size,
     manufacturerRelaysExactlyThree:makerRelays.every(t=>t.carIds.length===3&&new Set(t.carIds).size===3),
     allEligibleMakesRepresented:makerRelays.length===makeGroups.filter(([,a])=>a.length>=3).length,
     mixedTeamMakesDistinct:mixedTeams.every(t=>t.cars.length===3&&new Set(t.cars.map(c=>c.make)).size===3),
     mixedEachCarOnce:new Set(mixedUsed).size===mixedUsed.length,
     mixedCarsAccountedFor:mixedUsed.length+mixedLeftovers.length===cars.length&&new Set([...mixedUsed,...mixedLeftovers]).size===cars.length,
     longJumpEachCarOnce:jump.length===cars.length&&new Set(jump.map(x=>x.carId)).size===cars.length,
     uniquePreviewJobIds:new Set(ids).size===ids.length,
     sequentialPreviewNumbers:q.every((x,i)=>x.previewNumber===i+1),
     notAProductionDraw:true
   };
   if(!Object.values(checks).every(Boolean))throw Error('Garage-backed draw invariant failed. No data changed.');
   return{
     previewOnly:true,completeTournament:false,sourceSpaceId:spaceId,sourceSpaceName:spaceName,
     seed,carCount:cars.length,makeCount:makeGroups.length,typeCount:typeGroups.length,
     manufacturerRelayCount:makerRelays.length,mixedRelayCount:mixedTeams.length,mixedUnallocated:mixedLeftovers.length,
     manufacturerGauntletCount:makeGauntlets.length,typeGauntletCount:typeGauntlets.length,
     jumpAttempts:jump.length,lonelyHeartMakers:oneCarMakes.length,previewJobs:q.length,
     firstJobs:q.slice(0,20).map(x=>({number:x.previewNumber,kind:x.kind,eventId:x.eventId,stage:x.stage,entrants:x.entrants})),
     makerRelaySample:makerRelays.slice(0,4).map(t=>({make:t.make,carIds:t.carIds})),
     makeGauntletSample:makeGauntlets.slice(0,4).map(g=>({name:g.name,entrants:g.entrantCount})),
     checks,
     unresolved:[
       'This is an uncommitted real-Garage entrant roster, NOT the tournament draw or final slot count.',
       'Race Off field counts, classic Group Championships, Swiss draws, manufacturer/type specials, Hot Wheels, Rally, Off-Road and other legacy events still need approved event-by-event roster generation.',
       'Relay qualification rounds, exact Gauntlet stage-to-slot packing, jump attempt batching, track assignments, early-final placement and Finals Nights require the full scheduler.',
       'Second Chance Cups must spawn from genuinely completed, medalled events only; they cannot be pre-filled from a speculative draw.',
       'Entrant freeze, official medal publication, complete all-Space reset/restore and explicit launch approval are still required.'
     ]
   };
 }
 window.rhEvil2GarageDraw8233={create,garage};
})();
