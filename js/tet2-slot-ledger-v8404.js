/* TET2 8.0.399: native FH5 Space connection + locked-slot results ledger.
   No Evil List generator is installed: this file CANNOT fabricate an official slot.
   It never changes native OTG! racing, car ownership, medals or records. */
(function(root,factory){
 'use strict';const api=factory(root);
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.TET2SlotLedger361=api;root.TET2SlotLedger399=api;
})(typeof window!=='undefined'?window:globalThis,function(root){
 'use strict';
 const KEY='tet2OfficialSlotLedgerV8361',SOURCE='TET2_CONTROLLED_CHAOS_LOCKED_V1';
 const S=x=>String(x??'').trim(),clone=x=>JSON.parse(JSON.stringify(x));
 const fail=msg=>{throw Error('TET2 safe stop: '+msg)};
 let busy=false;
 function space(){
   const x=typeof root.rhSpace==='function'?root.rhSpace():null;
   if(!x||x.catalogueKey!=='fh5-catalogue-v1'||!S(x.id)||!Array.isArray(x.cars))fail('Select your real FH5 Catalogue Space first');
   const ids=x.cars.map(c=>S(c?.id));
   if(ids.some(id=>!id)||new Set(ids).size!==ids.length)fail('Garage car IDs missing or duplicated');
   return x;
 }
 function garage(x){
   return new Map(x.cars.map(c=>[S(c.id),{id:S(c.id),name:S(c.name),make:S(c.make),year:c.year}]));
 }
 function read(x){
   if(x[KEY]===undefined)return {schema:1,spaceId:S(x.id),source:SOURCE,currentId:null,slots:{}};
   const b=x[KEY];
   if(!b||b.schema!==1||b.spaceId!==S(x.id)||b.source!==SOURCE||!b.slots||typeof b.slots!=='object'||Array.isArray(b.slots))fail('Saved TET2 ledger does not match this Space');
   if(b.currentId!==null&&!b.slots[b.currentId])fail('Saved current slot is missing');
   return clone(b);
 }
 function save(x,b){
   if(typeof root.rhSave!=='function')fail('Native save function unavailable');
   const previous=x[KEY];x[KEY]=clone(b);
   try{root.rhSave()}catch(err){if(previous===undefined)delete x[KEY];else x[KEY]=previous;throw err;}
 }
 function definition(spec,g){
   if(!spec||spec.source!==SOURCE||!S(spec.scheduleId)||!S(spec.slotId)||!S(spec.competitionId)||!S(spec.lockHash)||!S(spec.label))fail('Verified slot identity and draw hash required');
   if(!['group','raceoff','relay','aero'].includes(spec.mode))fail('Unsupported competition results format');
   const d={source:SOURCE,scheduleId:S(spec.scheduleId),slotId:S(spec.slotId),competitionId:S(spec.competitionId),lockHash:S(spec.lockHash),label:S(spec.label),mode:spec.mode};
   const cars=ids=>{
     if(!Array.isArray(ids)||ids.length<2||ids.length>64)fail('Invalid entrant count');
     const list=ids.map(S);if(list.some(id=>!g.has(id))||new Set(list).size!==list.length)fail('Draw contains unowned or repeated Garage cars');
     return list;
   };
   if(d.mode==='group'){
     d.carIds=cars(spec.carIds);
     if(!Array.isArray(spec.tracks)||spec.tracks.length<1||spec.tracks.length>3)fail('Group requires 1–3 named tracks');
     d.tracks=spec.tracks.map(S);if(d.tracks.some(t=>!t)||new Set(d.tracks).size!==d.tracks.length)fail('Group tracks missing or repeated');
   }else if(d.mode==='relay'){
     if(!Array.isArray(spec.teams)||spec.teams.length<2||spec.teams.length>8)fail('Relay stage requires 2–8 teams');
     if(!Array.isArray(spec.tracks)||spec.tracks.length!==3||spec.tracks.some(t=>!S(t))||new Set(spec.tracks.map(S)).size!==3)fail('Relay must have three distinct genuine routes');
     d.tracks=spec.tracks.map(S);d.teams=spec.teams.map(t=>({id:S(t.id),label:S(t.label),carIds:cars(t.carIds)}));
     if(d.teams.some(t=>t.carIds.length!==3||!t.id||!t.label)||new Set(d.teams.map(t=>t.id)).size!==d.teams.length||new Set(d.teams.flatMap(t=>t.carIds)).size!==d.teams.length*3)fail('Repeated team or Relay car');
   }else if(d.mode==='aero'){
     d.carIds=cars(spec.carIds);if(d.carIds.length>16)fail('Aeródromo needs batches of at most 16 cars');
     d.track=S(spec.track);d.jumpFacility=S(spec.jumpFacility);
     if(!d.track||d.jumpFacility!=='Aeródromo runway')fail('Aeródromo requires the verified Drag Strip and fixed runway');
   }else{
     if(!Array.isArray(spec.matches)||spec.matches.length<1||spec.matches.length>8)fail('Race Off slot must draw 1–8 matches');
     d.matches=spec.matches.map(m=>{
       const ids=cars(m.carIds);if(ids.length!==2||!S(m.id)||!S(m.track))fail('A Race Off match requires two cars, ID and track');
       return {id:S(m.id),track:S(m.track),carIds:ids};
     });
     const ids=d.matches.flatMap(m=>m.carIds);
     if(new Set(d.matches.map(m=>m.id)).size!==d.matches.length||new Set(ids).size!==ids.length)fail('Repeated match or car in one slot');
   }
   return d;
 }
 function authenticate(spec,x){
   // Future Controlled Chaos scheduler must verify EXACT locked slot and
   // complete field; v361 deliberately has no scheduler and fails closed.
   const verify=root.TET2ControlledChaosVerifiedSchedule?.verifyLockedSlot;
   if(typeof verify!=='function')fail('Official Controlled Chaos schedule is not installed yet');
   const result=verify({spaceId:S(x.id),scheduleId:S(spec.scheduleId),slotId:S(spec.slotId),lockHash:S(spec.lockHash)});
   if(!result||result.verified!==true||!result.definition)fail('Slot is not in the locked tournament schedule');
   if(JSON.stringify(definition(result.definition,garage(x)))!==JSON.stringify(definition(spec,garage(x))))fail('Proposed slot differs from its locked draw');
 }
 function active(x){const b=read(x);return b.currentId?{book:b,slot:b.slots[b.currentId]}:null;}
 function progress(slot){
   const d=slot.definition,required=d.mode==='group'?d.carIds.length*d.tracks.length:d.mode==='relay'?d.teams.length*3:d.mode==='aero'?d.carIds.length*2:d.matches.length;
   const banked=Object.keys(slot.results).length;return {banked,required,allSaved:banked===required};
 }
 function prepare(spec){
   const x=space(),d=definition(spec,garage(x));authenticate(d,x);
   const b=read(x),old=b.slots[d.slotId];
   if(old){if(JSON.stringify(old.definition)!==JSON.stringify(d))fail('Locked draw cannot be changed');if(old.completedAt)fail('Completed slot is immutable');return {alreadyPrepared:true,slotId:d.slotId};}
   if(b.currentId&&b.currentId!==d.slotId&&!b.slots[b.currentId].completedAt)fail('Another Evil List slot is in progress');
   b.slots[d.slotId]={definition:d,results:{},startedAt:new Date().toISOString(),completedAt:null};b.currentId=d.slotId;save(x,b);
   return {alreadyPrepared:false,slotId:d.slotId};
 }
 function validateResult(slot,p){
   const d=slot.definition;
   if(!p||p.mode!==d.mode||S(p.slotId)!==d.slotId||S(p.competitionId)!==d.competitionId)fail('Result source differs from active slot');
   if(d.mode==='group'){
     const i=p.trackIndex,id=S(p.carId),ms=p.timeMs;
     if(!Number.isInteger(i)||i<0||i>=d.tracks.length||!d.carIds.includes(id)||S(p.track)!==d.tracks[i])fail('Wrong car, track or stage');
     if(!Number.isSafeInteger(ms)||ms<=0)fail('Time invalid');
     for(let j=0;j<i;j++)for(const c of d.carIds)if(slot.results[`g:${j}:${c}`]===undefined)fail('Complete earlier track first');
     return {key:`g:${i}:${id}`,value:ms};
   }
   if(d.mode==='relay'){
     const i=p.leg,teamId=S(p.teamId),team=d.teams.find(t=>t.id===teamId),ms=p.timeMs;
     if(!Number.isInteger(i)||i<0||i>2||!team||S(p.carId)!==team.carIds[i]||S(p.track)!==d.tracks[i]||!Number.isSafeInteger(ms)||ms<=0||ms>=86400000)fail('Invalid Relay car, team, leg, track or time');
     for(let j=0;j<i;j++)for(const t of d.teams)if(slot.results[`r:${j}:${t.id}`]===undefined)fail('Complete prior Relay leg first');
     return {key:`r:${i}:${teamId}`,value:ms};
   }
   if(d.mode==='aero'){
     const id=S(p.carId);if(!d.carIds.includes(id))fail('Aeródromo entrant not in official draw');
     if(p.discipline==='drag'){
       if(S(p.track)!==d.track||!Number.isSafeInteger(p.timeMs)||p.timeMs<=0||p.timeMs>=86400000)fail('Invalid Drag Strip/time');
       return {key:`a:drag:${id}`,value:p.timeMs};
     }
     if(p.discipline==='jump'){
       if(S(p.jumpFacility)!==d.jumpFacility||!Number.isSafeInteger(p.distanceCm)||p.distanceCm<0||p.distanceCm>10000000)fail('Invalid one-attempt Aeródromo jump distance');
       for(const c of d.carIds)if(slot.results[`a:drag:${c}`]===undefined)fail('Complete all drag runs before jumping');
       return {key:`a:jump:${id}`,value:p.distanceCm};
     }
     fail('Only Drag and one Aeródromo Long Jump permitted');
   }
   const m=d.matches.find(m=>m.id===S(p.matchId));
   if(!m||S(p.track)!==m.track||S(p.carA)!==m.carIds[0]||S(p.carB)!==m.carIds[1])fail('Pairing differs from confirmed draw');
   if(!Number.isSafeInteger(p.timeA)||!Number.isSafeInteger(p.timeB)||p.timeA<=0||p.timeB<=0||p.timeA===p.timeB)fail('Both valid unequal times are required');
   const winnerId=p.timeA<p.timeB?m.carIds[0]:m.carIds[1];if(p.winnerId!==winnerId)fail('Winner does not match the faster car');
   return {key:`m:${m.id}`,value:{a:p.timeA,b:p.timeB,winnerId}};
 }
 function bank(p){
   if(busy)fail('Concurrent result save blocked');busy=true;
   try{
     const x=space(),c=active(x);if(!c||c.slot.completedAt)fail('No unfinished official slot');
     authenticate(c.slot.definition,x);
     const result=validateResult(c.slot,p);
     if(Object.hasOwn(c.slot.results,result.key))fail('Already banked: recorded result cannot be silently overwritten');
     c.slot.results[result.key]=clone(result.value);save(x,c.book);
     return progress(c.slot);
   }finally{busy=false;}
 }
 function finish(){
   const x=space(),c=active(x);if(!c)fail('No scheduled slot');
   if(c.slot.completedAt)return {alreadyComplete:true};authenticate(c.slot.definition,x);
   if(!progress(c.slot).allSaved)fail('Bank all results before completing a slot');
   c.slot.completedAt=new Date().toISOString();save(x,c.book);
   // Completing a *slot* never awards medals or finishes a multi-slot championship.
   return {completed:true,slotId:c.slot.definition.slotId};
 }
 function entrySpec(x,slot){
   const d=slot.definition,g=garage(x);
   const cars=ids=>ids.map(id=>({...g.get(id),h:false,e:false}));
   const spec={source:'TET2_VERIFIED_SLOT',slotId:d.slotId,competitionId:d.competitionId,spaceId:S(x.id),mode:d.mode,label:d.label,
     onBank:async result=>bank(result),
     onExit:()=>{root.TET2Stage4UI359?.page('race');},
     onDone:()=>{const c=active(space());if(!c||!progress(c.slot).allSaved)fail('Bank every result before MARK AS DONE');
       const result=root.TET2OfficialRace401?.finishCurrent?.();if(!result?.completed)fail('Slot was not marked as done');
       root.TET2Stage4UI359?.page('race');return result;}};
   if(d.mode==='group'){
     spec.cars=cars(d.carIds);spec.tracks=d.tracks;
     spec.saved=d.tracks.map((_,i)=>Object.fromEntries(d.carIds.filter(id=>slot.results[`g:${i}:${id}`]!==undefined).map(id=>[id,slot.results[`g:${i}:${id}`]])));
   }else if(d.mode==='relay'){
     spec.teams=d.teams.map(t=>({...t,cars:cars(t.carIds)}));spec.tracks=d.tracks;
     spec.saved=d.tracks.map((_,i)=>Object.fromEntries(d.teams.filter(t=>slot.results[`r:${i}:${t.id}`]!==undefined).map(t=>[t.id,slot.results[`r:${i}:${t.id}`]])));
   }else if(d.mode==='aero'){
     spec.cars=cars(d.carIds);spec.track=d.track;spec.jumpFacility=d.jumpFacility;
     spec.saved={drag:Object.fromEntries(d.carIds.filter(id=>slot.results[`a:drag:${id}`]!==undefined).map(id=>[id,slot.results[`a:drag:${id}`]])),jump:Object.fromEntries(d.carIds.filter(id=>slot.results[`a:jump:${id}`]!==undefined).map(id=>[id,slot.results[`a:jump:${id}`]]))};
   }else{
     spec.matches=d.matches.map(m=>({id:m.id,track:m.track,cars:cars(m.carIds)}));
     spec.saved=Object.fromEntries(d.matches.filter(m=>slot.results[`m:${m.id}`]).map(m=>[m.id,slot.results[`m:${m.id}`]]));
   }
   return spec;
 }
 function resumeActive(){
   const x=space(),c=active(x);if(!c||c.slot.completedAt)fail('No active official slot to resume');
   authenticate(c.slot.definition,x);
   if(typeof root.TET2ResultsEntry360?.openScheduled!=='function')fail('Results Entry engine not loaded');
   root.TET2ResultsEntry360.openScheduled(entrySpec(x,c.slot));return progress(c.slot);
 }
 function isRegisteredSlot(spec){
   try{const x=space(),c=active(x);if(!c||c.slot.completedAt||S(spec?.slotId)!==c.slot.definition.slotId||S(spec?.competitionId)!==c.slot.definition.competitionId)return false;authenticate(c.slot.definition,x);return true;}catch(_){return false;}
 }
 function status(){
   try{
     const x=space(),c=active(x),p=c?progress(c.slot):null;
     return {connected:true,spaceId:S(x.id),owned:x.cars.length,current:c?{slotId:c.slot.definition.slotId,label:c.slot.definition.label,complete:!!c.slot.completedAt,banked:p.banked,required:p.required}:null};
   }catch(e){return {connected:false,reason:S(e.message)};}
 }
 return Object.freeze({status,prepare,bank,finish,resumeActive,isRegisteredSlot,storageKey:KEY,source:SOURCE});
});
