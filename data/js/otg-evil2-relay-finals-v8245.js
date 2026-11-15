/* OTG! MAIN v8.0.245 — native Relay round packing & Finals Night windows.
   All stage cards are a READ-ONLY planning forecast. No real round slots, entrant
   freezes, tracked results, medal records or schedule are created or updated.
   Group partitioning follows v8.0.194/197 Relay progression: groups of <=4,
   every group supplies ONE winner, repeat until the remaining group is FINAL.
   Existing Relay timing is 3 car-leg stages per TEAM per round, not one slot
   per member or manufacturer. The future winning teams are unknown. */
(()=>{'use strict';
 const S=x=>String(x??'').trim();
 function nativeSizes(n){
   if(!Number.isSafeInteger(n)||n<1||n>2000)throw Error('Invalid Relay team count');
   const g=Math.ceil(n/4),q=Math.floor(n/g),r=n%g;
   return Array.from({length:g},(_,i)=>q+(i<r?1:0));
 }
 function ladder(count,label){
   if(!Number.isSafeInteger(count)||count<2||count>2000)throw Error('Relay has invalid team count');
   const rounds=[];let entrants=count;
   for(let n=1;n<=12;n++){
     const sizes=nativeSizes(entrants),final=sizes.length===1;
     const round={round:n,kind:final?'FINAL':'QUALIFICATION',teams:entrants,
       groupSizes:sizes,groups:sizes.length,teamLegAttempts:entrants*3,
       winnersAfter:final?1:sizes.length};
     rounds.push(round);
     if(final)break;
     if(sizes.length===entrants)throw Error('Relay cannot advance from single-team groups');
     entrants=sizes.length;
   }
   if(rounds.at(-1)?.kind!=='FINAL')throw Error('Relay round count exceeded');
   const totalGroupCards=rounds.reduce((a,r)=>a+r.groups,0);
   return{label,openingTeams:count,rounds,totalGroupCards,
     teamLegAttempts:rounds.reduce((a,r)=>a+r.teamLegAttempts,0)};
 }
 function create(st){
   if(!st?.spaces?.length)throw Error('Saved Spaces missing; no Relay preview created');
   const before=JSON.stringify(st);
   const exact=window.rhEvil2ExactSchedule8245?.build(st);
   const draw=window.rhEvil2GarageDraw8233?.create(st);
   if(!exact?.readOnly||!draw?.previewOnly||exact.liveCars!==draw.carCount)
      throw Error('Existing exact-make stage pack and current Garage roster not available');
   const relays=[ladder(draw.manufacturerRelayCount,'Manufacturer Relay'),ladder(draw.mixedRelayCount,'Mixed Relay')];
   const cards=[];const base=exact.proposedStagePackRows;
   // Every planning anchor is measured against the EXISTING provisional pack.
   // These are NOT locked original slot IDs or a running production draw.
   for(const relay of relays){
     const qualifying=relay.rounds.filter(x=>x.kind==='QUALIFICATION').length;
     let previousAnchor=0;
     for(let r=0;r<relay.rounds.length;r++){
       const stage=relay.rounds[r];const isFinal=stage.kind==='FINAL';
       // Earlier qualifiers in distributed windows. Relay finals near the end.
       // Groups for round N are placeholders until all round N-1 results exist.
       const low=isFinal?(relay.label==='Mixed Relay'?.979:.956):(.12+r*.20);
       const high=isFinal?low:(.31+r*.20);
       if(!isFinal&&high>.90)throw Error('Qualifying cannot overlap Finals Night reserve');
       for(let g=0;g<stage.groups;g++){
         const ratio=stage.groups===1?.5:(g+.5)/stage.groups;
         const anchor=Math.max(1,Math.min(base,Math.round(base*(low+(high-low)*ratio))));
         const id=(relay.label==='Mixed Relay'?'relay:mixed':'relay:manufacturer')+':round:'+stage.round+':group:'+(g+1);
         cards.push({id,championship:relay.label,round:stage.round,group:g+1,groups:stage.groups,
           groupTeams:stage.groupSizes[g],teamLegAttempts:stage.groupSizes[g]*3,
           isFinal,stage:isFinal?'FINALS NIGHT — GRAND FINAL':'QUALIFYING GROUP — 3 LEGS PER TEAM',
           anchor,entrantIdentities:isFinal?'QUALIFIERS TO BE DETERMINED':'UNLOCKED ROSTER NOT FROZEN'});
       }
       const start=Math.round(base*low);
       if(start<=previousAnchor)throw Error('Round timing forecast is not ordered');
       previousAnchor=start;
     }
   }
   const byId=new Set();for(const c of cards){if(byId.has(c.id))throw Error('Duplicate Relay group card');byId.add(c.id);}
   const planned=cards.slice().sort((a,b)=>a.anchor-b.anchor||Number(a.isFinal)-Number(b.isFinal)||a.id.localeCompare(b.id));
   for(let i=0;i<planned.length;i++)planned[i]={...planned[i],previewPosition:planned[i].anchor+i+1};
   const finalCards=planned.filter(x=>x.isFinal);
   const existingIds=new Set();for(const c of planned){if(existingIds.has(c.previewPosition))throw Error('Duplicate provisional row');existingIds.add(c.previewPosition);}
   const expectedCards=relays.reduce((sum,x)=>sum+x.totalGroupCards,0);
   const native=window.rhEvil2RelayRounds194;
   const nativeCompatible=relays.every(x=>x.rounds.every(r=>{
     if(!native?.groupSizes)return true;const ns=native.groupSizes(r.teams);
     return JSON.stringify(Array.from(ns))===JSON.stringify(r.groupSizes);
   }));
   const check={
     ownedCarsIntact:exact.liveCars===draw.carCount,
     exactStagePackAlreadyPassed:Object.values(exact.checks).every(Boolean),
     relayFamilyCountExactlyTwo:relays.length===2,
     noTeamMistakenForOwnEvent:cards.length===expectedCards && cards.length<draw.manufacturerRelayCount+draw.mixedRelayCount,
     nativeGroupSizesAgree:nativeCompatible,
     eachGroupHasTwoToFourTeams:cards.every(x=>x.groupTeams>=2&&x.groupTeams<=4),
     threeLegsPerTeam:cards.every(x=>x.teamLegAttempts===x.groupTeams*3),
     nextRoundAlwaysUsesGroupWinners:relays.every(x=>x.rounds.slice(1).every((r,i)=>r.teams===x.rounds[i].winnersAfter)),
     finalsNightHasTwoGrandFinals:finalCards.length===2 && finalCards.every(x=>x.anchor>Math.round(base*.93)),
     qualifyingBeforeFinal:relays.every(x=>{const e=cards.filter(c=>c.championship===x.label);return Math.max(...e.filter(c=>!c.isFinal).map(c=>c.anchor))<Math.min(...e.filter(c=>c.isFinal).map(c=>c.anchor));}),
     allRelayCardIdsUnique:byId.size===cards.length,
     provisionalPositionsSequentialAfterInsert:planned.every((c,i)=>c.previewPosition===c.anchor+i+1),
     noSecondChanceSourceFromRelays:true,
     originalLiveStateUnchanged:JSON.stringify(st)===before
   };
   if(Object.values(check).some(v=>!v))throw Error('Relay stage packing FAILED: '+Object.entries(check).filter(([,v])=>!v).map(([k])=>k).join(', '));
   const earlyWindows=[.12,.28,.44,.60,.76].map((pct,i)=>({name:'EARLY FINALS WINDOW '+(i+1),
      aroundBaseRow:Math.round(base*pct),note:'Reserve only. Actual completed smaller events and medals determine Second Chance tickets.'}));
   return{readOnly:true,qaOnly:true,liveCars:draw.carCount,baseProvisionalRows:base,
     relayGroupCards:cards.length,afterRelayProvisionalRows:base+cards.length,
     makerTeams:draw.manufacturerRelayCount,mixedTeams:draw.mixedRelayCount,
     relayChampionships:relays,relayTeamLegAttempts:relays.reduce((sum,x)=>sum+x.teamLegAttempts,0),
     finalsNightCards:finalCards.map(c=>({...c})),earlyWindows,
     provisionalRelayCards:planned.map(c=>({...c})),
     groupSamples:planned.slice(0,9).map(c=>({...c})),
     endSamples:planned.slice(-8).map(c=>({...c})),
     resultDrivenSecondChance:'Each completed eligible medalled source contributes at most one unused car below bronze to ONE list. There are no rolling mini-Cups. Freeze and run the single Grand Second Chance Tournament only after every eligible source final is complete.',
     openWork:['Results are not known; Relay future-round team identities stay UNLOCKED until real qualifying results.',
       'Original non-Relay finals and native new Gauntlet stage durations are not assigned production slot IDs.',
       'Four unsourced manufacturer themes still require an approved format.',
       'Grand Second Chance entrants accumulate from completed source finals. Its bracket is NOT known until the source pool closes.',
       'Production medals and the destructive all-Space reset are NOT enabled.'],
     check,liveSlotsCommitted:0,ticketsIssued:0,medalsIssued:0,racingHistoryReset:false};
 }
 window.rhEvil2RelayFinals8245={create,ladder,nativeSizes};
})();
