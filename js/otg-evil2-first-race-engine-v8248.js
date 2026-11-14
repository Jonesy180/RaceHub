/* OTG! MAIN v8.0.248: independently stored, source-backed first Festival GROUP race cards.
 * Pure computation only. No rhSave, active Space writes, medals, browser storage or reset.
 * Stage 1 of old R1 slots 1 and 2; production integration REQUIRES separate approval.
 */
(()=>{'use strict';
const S=v=>String(v??'').trim();
const copy=x=>JSON.parse(JSON.stringify(x));
const error=m=>{throw Error(m);};
const STAGES=[1,2];
// Accept ordinary typed times or digits-only phone-keypad entry: 0312111 -> 03:12.111.
// Digits-only 7 digits = MM : SS . mmm; 9 digits = HH : MM : SS . mmm.
// Never guess from incomplete input or silently pad milliseconds.
function parseTime(x){const v=S(x);let hour=0,minute,second,milli;
 if(/^(?:\d{7}|\d{9})$/.test(v)){
  const ms=v.slice(-3),sec=v.slice(-5,-3),lead=v.slice(0,-5);
  if(lead.length<=2){minute=Number(lead);}else{hour=Number(lead.slice(0,-2));minute=Number(lead.slice(-2));}
  second=Number(sec);milli=Number(ms);
 }else{
  const m=v.match(/^(?:(\d{1,2}):)?([0-5]?\d):([0-5]\d)\.(\d{3})$/);
  if(!m)return null;
  hour=Number(m[1]||0);minute=Number(m[2]);second=Number(m[3]);milli=Number(m[4]);
 }
 if(second>=60||minute>=60||(hour>0&&minute>=60))return null;
 const n=((hour*60+minute)*60+second)*1000+milli;
 return Number.isSafeInteger(n)&&n>0&&n<86400000?n:null;
}
function formatTime(v){if(!Number.isSafeInteger(v)||v<0)return '—';const hr=Math.floor(v/3600000),mn=Math.floor(v%3600000/60000),sc=Math.floor(v%60000/1000),ms=v%1000;
 return (hr?String(hr).padStart(2,'0')+':':'')+String(mn).padStart(2,'0')+':'+String(sc).padStart(2,'0')+'.'+String(ms).padStart(3,'0');}
function seeded(n){let a=n>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};}
function shuffle(xs,r){const a=xs.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function balanced(n,count){if(!Number.isSafeInteger(n)||!Number.isSafeInteger(count)||n<count*2||count<1)error('R1 GROUPS field is too small for the original bracket');
 const q=Math.floor(n/count),r=n%count;return Array.from({length:count},(_,i)=>q+(i<r?1:0));}
function prepare(opts){const {slot,event,garage,spaceId,routes,seed}=opts||{};
 if(!STAGES.includes(Number(slot?.slot))||slot.eventId!==event?.id||slot.liveFormat!=='GROUPS'||slot.mode!=='Festival')error('Only verified opening R1 GROUPS visits are supported');
 const groupMatch=S(slot.doNow).match(/STAGE\s+(\d+)\s+GROUP\s+(\d+)\s*\/\s*(\d+)/i);
 if(!groupMatch||Number(groupMatch[1])!==1||Number(groupMatch[2])!==1)error('Unsupported opening group definition');
 const groupCount=Number(groupMatch[3]);if(groupCount<2||groupCount>100)error('Unreasonable original group count');
 if(!S(spaceId))error('FH5 Space identity missing');
 if(!Array.isArray(garage)||!garage.length)error('Live FH5 Garage unreadable');
 if(!Array.isArray(event.eligibleIds)||!event.eligibleIds.length)error('Original event entrants missing');
 if(!Number.isSafeInteger(seed)||seed<0||seed>0xffffffff)error('Invalid fixed draw seed');
 const byId=new Map(garage.map(x=>[S(x.id),x]));if(byId.size!==garage.length||byId.has(''))error('Garage contains duplicated car identities');
 const available=[];const ids=new Set();for(const v of event.eligibleIds){const id=S(v);if(ids.has(id))error('Duplicate source-event car identity');ids.add(id);
 if(byId.has(id)){const c=byId.get(id);available.push({id,name:S(c.name)||id,make:S(c.make),type:S(c.type)});}}
 const counts=balanced(available.length,groupCount),random=seeded(seed),field=shuffle(available,random),group=field.slice(0,counts[0]);
 if(!Array.isArray(routes)||new Set(routes.map(S)).size<2)error('Two distinct FH5 routes required');
 const safeRoutes=[...new Set(routes.map(S).filter(Boolean))].filter(x=>!/the goliath/i.test(x));
 if(safeRoutes.length<2)error('Not enough valid non-finale FH5 routes');
 const shuffledTracks=shuffle(safeRoutes,seeded(seed^0x52C86D19));
 const d={schema:1,mode:'EVIL2_PRELAUNCH_RACE_CARD',spaceId:S(spaceId),slot:Number(slot.slot),eventId:S(event.id),
  eventName:S(slot.event||event.event),format:'GROUPS',stage:1,group:1,groupCount,seed,garageAtFreeze:garage.length,
  sourceEligible:event.eligibleIds.length,actualEligible:available.length,createdAt:new Date().toISOString(),
  fullFieldIds:field.map(x=>x.id),groupSizes:counts,carIds:group.map(x=>x.id),cars:group,tracks:shuffledTracks.slice(0,2),
  results:Object.fromEntries(group.map(x=>[x.id,[null,null]])),signedOffAt:null,qualifierIds:[],audit:[]};
 check(d);return d;}
function check(d){if(!d||d.schema!==1||d.mode!=='EVIL2_PRELAUNCH_RACE_CARD'||!STAGES.includes(d.slot)||!S(d.spaceId)||!S(d.eventId)||!S(d.eventName)||!Number.isSafeInteger(d.seed))error('Invalid race card identity');
 if(d.format!=='GROUPS'||d.group!==1||d.stage!==1||!Number.isSafeInteger(d.groupCount)||d.groupCount<2)error('Invalid R1 group format');
 if(!Array.isArray(d.groupSizes)||d.groupSizes.length!==d.groupCount||d.groupSizes[0]!==d.carIds?.length||d.groupSizes.some(n=>!Number.isSafeInteger(n)||n<2))error('Invalid balanced group sizes');
 if(!Array.isArray(d.fullFieldIds)||!Array.isArray(d.cars)||!Array.isArray(d.carIds)||!Array.isArray(d.tracks)||d.tracks.length!==2||d.tracks[0]===d.tracks[1]||d.tracks.some(t=>!S(t)))error('Missing race field or two course identities');
 if(!Number.isSafeInteger(d.actualEligible)||d.fullFieldIds.length!==d.actualEligible||d.groupSizes.reduce((a,b)=>a+b,0)!==d.actualEligible||new Set(d.fullFieldIds).size!==d.actualEligible)error('Frozen full field is invalid');
 const ids=d.cars.map(x=>S(x?.id));if(ids.some(x=>!x)||new Set(ids).size!==ids.length||ids.join('|')!==d.carIds.join('|')||ids.some(x=>!d.fullFieldIds.includes(x)))error('Frozen group roster invalid');
 if(!d.results||Object.keys(d.results).length!==ids.length||Object.keys(d.results).some(x=>!ids.includes(x)))error('Invalid per-car results');
 for(const id of ids){const a=d.results[id];if(!Array.isArray(a)||a.length!==2||a.some(v=>v!==null&&(!Number.isSafeInteger(v)||v<=0||v>=86400000)))error('Invalid race time');}
 if(!Array.isArray(d.audit)||!Array.isArray(d.qualifierIds))error('Invalid result audit');
 if(d.signedOffAt){if(d.qualifierIds.length!==2||d.qualifierIds[0]===d.qualifierIds[1]||d.qualifierIds.some(id=>!ids.includes(id)))error('Invalid locked qualifiers');
 const places=standings(d);if(places.some(x=>x.total===null)||places[1]?.total===places[2]?.total||d.qualifierIds.join('|')!==places.slice(0,2).map(x=>x.id).join('|'))error('Signed off standings inconsistent');}
 else if(d.qualifierIds.length)error('Unapproved qualifiers in unfinished group');return true;}
function standings(d){const results=d.results;return d.carIds.map((id,i)=>{const a=results[id],total=a[0]!==null&&a[1]!==null?a[0]+a[1]:null;
 return {id,name:d.cars[i].name,make:d.cars[i].make,total,times:a.slice(),entered:a.filter(x=>x!==null).length};}).sort((a,b)=>(a.total===null?1:0)-(b.total===null?1:0)||(a.total??0)-(b.total??0)||a.name.localeCompare(b.name));}
function next(d){check(d);for(let track=0;track<2;track++)for(const car of d.cars){if(d.results[car.id][track]===null)return {car,track,trackName:d.tracks[track]};}return null;}
function record(original,id,track,ms){check(original);if(original.signedOffAt)error('Completed group is locked');
 if(!original.carIds.includes(S(id))||![0,1].includes(Number(track))||!Number.isSafeInteger(ms)||ms<1||ms>=86400000)error('Invalid car, route or time');
 const d=copy(original),before=d.results[id][track];d.results[id][track]=ms;d.audit.push({at:new Date().toISOString(),type:before===null?'record':'correction',carId:id,route:track,previousMs:before,timeMs:ms});check(d);return d;}
function signOff(original){check(original);if(original.signedOffAt)error('Group already signed off');
 const places=standings(original);if(places.some(x=>x.total===null))error('Every car must complete both routes before sign-off');
 if(places.length<3||places[1].total===places[2].total)error('Second place is tied: resolve before advancing');
 const d=copy(original);d.qualifierIds=places.slice(0,2).map(x=>x.id);d.signedOffAt=new Date().toISOString();d.audit.push({at:d.signedOffAt,type:'stage-signoff',qualifiers:d.qualifierIds});check(d);return d;}
window.rhEvil2FirstRaceEngine8248={prepare,check,parseTime,formatTime,record,next,standings,signOff,balanced};
})();
