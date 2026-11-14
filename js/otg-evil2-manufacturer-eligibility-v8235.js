/* OTG! MAIN v8.0.235 — exact Lonely Hearts + normal manufacturer dual-mode eligibility.
   IN MEMORY ONLY: not the final draw, event schedule, or permission to start/reset.
   A normal manufacturer with 2 owned cars may enter manufacturer-themed Festival and
   Race Off selections; teams of 3 retain a natural 3-car roster minimum for relays. */
(()=>{'use strict';
const s=x=>String(x??'').trim();
const cmp=(a,b)=>a.localeCompare(b,'en');
const key=x=>encodeURIComponent(x);
function create(saved){
 const g=window.rhEvil2GarageDraw8233;
 const p=window.rhEvil2ScheduleBlueprint8234;
 if(!g||typeof g.garage!=='function'||!p||typeof p.create!=='function')throw Error('Garage and schedule audits must be installed before manufacturer eligibility.');
 const untouched=JSON.stringify(saved);
 const snap=g.garage(saved),blueprint=p.create(saved),buckets=new Map();
 for(const c of snap.cars){
   if(!s(c.id)||!s(c.make))throw Error('Missing car identity or manufacturer; abort.');
   if(!buckets.has(c.make))buckets.set(c.make,[]);
   buckets.get(c.make).push(c);
 }
 const makers=[...buckets].sort((a,b)=>cmp(a[0],b[0]));
 const singles=[],normal=[],twoCar=[],relayEligible=[];
 const proposedDualModes=[];
 for(const [make,cars] of makers){
   const entry={make,owned:cars.length,carIds:cars.map(x=>x.id),carNames:cars.map(x=>x.name)};
   if(cars.length===1){
     singles.push(entry);
     continue; // Lonely Hearts for exactly one car per manufacturer, never two.
   }
   normal.push(entry);
   if(cars.length===2)twoCar.push(entry);
   if(cars.length>=3)relayEligible.push(entry);
   // Separate candidate identities for the two FORMAT options. Reconcile with old
   // campaign events before any official slot creation; NOT new scheduled races.
   proposedDualModes.push({id:'manufacturer:festival:'+key(make),make,format:'Festival',owned:cars.length,carIds:entry.carIds.slice()});
   proposedDualModes.push({id:'manufacturer:raceoff:'+key(make),make,format:'Race Off',owned:cars.length,carIds:entry.carIds.slice()});
 }
 const normalCarIds=normal.flatMap(x=>x.carIds),singletonCarIds=singles.flatMap(x=>x.carIds);
 const ids=proposedDualModes.map(x=>x.id),u=new Set(ids);
 const checks={
    exactlyOneCarInLonelyHearts:singles.every(x=>x.owned===1),
    noTwoCarMakerInLonelyHearts:!singles.some(x=>x.owned>=2),
    twoOrMoreInNormalCompetition:normal.every(x=>x.owned>=2)&&twoCar.every(x=>x.owned===2),
    everyOwnedCarAccountedFor:normalCarIds.length+singletonCarIds.length===snap.cars.length&&new Set([...normalCarIds,...singletonCarIds]).size===snap.cars.length,
    normalMakeFieldsMatchExistingBlueprint:normal.length===blueprint.manufacturerGauntletFields,
    threeCarRelayTeamMinimumKept:relayEligible.length===blueprint.manufacturerRelayTeams,
    dualModesForEachEligibleMake:proposedDualModes.length===normal.length*2&&u.size===ids.length&&normal.every(x=>proposedDualModes.some(y=>y.make===x.make&&y.format==='Festival')&&proposedDualModes.some(y=>y.make===x.make&&y.format==='Race Off')),
    noLonelyHeartInNormalManufacturerModes:proposedDualModes.every(x=>x.owned>=2),
    noLiveStateWrites:JSON.stringify(saved)===untouched
 };
 if(!Object.values(checks).every(Boolean))throw Error('Manufacturer eligibility contract failed: '+Object.entries(checks).filter(x=>!x[1]).map(x=>x[0]).join(', '));
 return{
  readOnly:true,officialDraw:false,productionScheduleCommitted:false,
  sourceSpaceId:snap.spaceId,sourceGarageCars:snap.cars.length,manufacturerCount:makers.length,
  lonelyHeartsManufacturers:singles.length,lonelyHeartsCars:singles.length,
  normalManufacturers:normal.length,exactlyTwoCarManufacturers:twoCar.length,
  relayEligibleManufacturers:relayEligible.length,
  festivalThemeCandidates:normal.length,raceOffThemeCandidates:normal.length,
  pairedFormatCandidates:proposedDualModes.length,
  lonelySamples:singles.slice(0,12).map(x=>({name:x.make,car:x.carNames[0]})),
  twoCarSamples:twoCar.slice(0,12).map(x=>({name:x.make,cars:x.carNames.slice()})),
  pairedSamples:proposedDualModes.slice(0,12).map(x=>({id:x.id,name:x.make,format:x.format,owned:x.owned})),
  checks,
  remaining:[
   'The old Evil event manifest must be reconciled first so paired manufacturer themes are not duplicated where both versions already exist.',
   'These are eligibility candidates, NOT 2 new races per manufacturer and NOT the final Evil 2.0 slot count.',
   'A two-car maker is eligible for ordinary manufacturer competitions, but an actual Relay team still needs 3 cars.',
   'Lonely Hearts consists ONLY of exactly-one-car manufacturers; their actual format and slots still need scheduling.',
   'A car can participate in multiple original tournament formats; the ONE ENTRY PER CAR restriction applies to Second Chance only.'
  ]
 };
}
window.rhEvil2ManufacturerEligibility8235={create};
})();
