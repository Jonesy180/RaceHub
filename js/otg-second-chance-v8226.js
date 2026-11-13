/* OTG! MAIN v8.0.226 — completed small-specialist competition source audit QA; Cup and Ultimate results retained.
   Reads existing FH5 Garage and finished competitions, but NEVER changes rhSpace,
   original results, medals, honours, catalogue, or private data. */
(()=>{'use strict';
const STORE='otg.secondchance.qa.v1:',SCREEN_ID='otg-sc-screen-8220',LAUNCH_ID='otg-sc-launch-8220';
let notice='',currentCup=0,sourceChoice='',bronzeChoice='4',sourceFocus=false;
const editingTimes=new Set();
const editKey=(ci,kind,i,tid)=>[ci,kind,i,tid].join('|');
const clean=x=>String(x??'').trim();
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validMs=n=>Number.isSafeInteger(n)&&n>0&&n<86400000;
function parseMs(value){const s=clean(value).replace(/\D/g,'');if(!s||s.length>9)return null;const a=s.padStart(7,'0'),mil=+a.slice(-3),sec=+a.slice(-5,-3),min=+a.slice(-7,-5),hr=+(a.slice(0,-7)||0);const n=((hr*60+min)*60+sec)*1000+mil;return sec<60&&min<60&&validMs(n)?n:null;}
function fmt(n){if(n===null||n===undefined)return '—';const hr=Math.floor(n/3600000),m=Math.floor(n%3600000/60000),s=Math.floor(n%60000/1000),milli=n%1000;return(hr?String(hr).padStart(2,'0')+':':'')+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')+'.'+String(milli).padStart(3,'0');}
function context(){const space=window.rhSpace?.(),id=space&&(space.id??space.spaceId);if(!space||!clean(id)||space.catalogueKey!=='fh5-catalogue-v1')throw Error('Open your FH5 Catalogue Space first.');const rules=window.rhEvil2Rules181;if(typeof rules?.carsOf!=='function')throw Error('FH5 owned car rules are unavailable.');const cars=rules.carsOf(space);if(!cars.length||new Set(cars.map(c=>c.id)).size!==cars.length)throw Error('Missing or duplicate owned Garage cars.');return{space,id:clean(id),cars};}
function key(id){return STORE+encodeURIComponent(id);}
function fresh(id){return{schema:1,mode:'qa',spaceId:id,honoursEnabled:false,nextTicket:1,tickets:[],cups:[],created:new Date().toISOString()};}
function emptyStage(){return{route:'',times:{}};}
function emptyCup(number){return{number,groups:[],semis:[emptyStage(),emptyStage()],final:emptyStage()};}
function validate(d,id){
 if(!d||d.schema!==1||d.mode!=='qa'||d.spaceId!==id||d.honoursEnabled!==false||!Number.isSafeInteger(d.nextTicket)||d.nextTicket<1||!Array.isArray(d.tickets)||!Array.isArray(d.cups)||d.tickets.length>10000||d.cups.length>1000)throw Error('Invalid QA save structure.');
 const sources=new Set(),byId=new Map(),spent=new Set();
 for(const t of d.tickets){if(!t||!clean(t.id)||!clean(t.sourceId)||!clean(t.carId)||!clean(t.name)||!clean(t.sourceName)||!['demo','finished'].includes(t.kind)||sources.has(t.sourceId)||byId.has(t.id))throw Error('Duplicate or invalid qualifying ticket.');byId.set(t.id,t);sources.add(t.sourceId);}
 function checkStage(stage,ids){if(!stage||typeof stage.route!=='string'||stage.route.length>120||!stage.times||typeof stage.times!=='object'||Array.isArray(stage.times))throw Error('Invalid heat data.');for(const [tid,n]of Object.entries(stage.times))if(!ids.has(tid)||!validMs(n)||!clean(stage.route))throw Error('Invalid time or unconfirmed heat track.');}
 for(let ci=0;ci<d.cups.length;ci++){const cup=d.cups[ci];if(!cup||cup.number!==ci+1||!Array.isArray(cup.groups)||cup.groups.length<1||cup.groups.length>4||!Array.isArray(cup.semis)||cup.semis.length!==2||!cup.final)throw Error('Cup structure invalid.');let cupCars=new Set(),assigned=new Set();
  for(const g of cup.groups){if(!Array.isArray(g.ids)||g.ids.length!==4||new Set(g.ids).size!==4)throw Error('Group must contain exactly four different tickets.');for(const tid of g.ids){const car=byId.get(tid);if(!car||spent.has(tid)||cupCars.has(car.carId))throw Error('Duplicate car in Cup or missing ticket.');spent.add(tid);cupCars.add(car.carId);assigned.add(tid);}checkStage(g,new Set(g.ids));}
  for(const st of [...cup.semis,cup.final])checkStage(st,assigned);if(cup.semis[0].route&&cup.semis[1].route&&cup.semis[0].route.toLowerCase()!==cup.semis[1].route.toLowerCase())throw Error('Knockout semifinals must share one track.');if(ci<d.cups.length-1&&cup.groups.length!==4)throw Error('Premature next Cup.');
 }checkUltimate(d);return d;
}
/* Frozen Ultimate bracket, optional in previous v8.0.223 saves. Never changes a Cup. */
function checkUltimate(d){
 const u=d.ultimate;if(u==null)return;
 if(!u||u.schema!==1||!Array.isArray(u.seeds)||u.seeds.length<2||u.seeds.length>1000||new Set(u.seeds).size!==u.seeds.length||!Array.isArray(u.rounds)||!clean(u.startedAt))throw Error('Invalid Ultimate QA bracket.');
 const qualified=new Set(ultimateQualifiers(d).entrants.map(t=>t.carId));
 if(u.seeds.some(id=>!clean(id)||!qualified.has(id)))throw Error('Ultimate seed has lost its completed Cup qualification.');
 const n=nextPower(u.seeds.length),expected=Math.log2(n);
 if(u.rounds.length!==expected)throw Error('Ultimate bracket round count incorrect.');
 for(let ri=0;ri<u.rounds.length;ri++){
  const round=u.rounds[ri],count=n/(2**(ri+1));
  if(!round||typeof round.route!=='string'||round.route.length>100||!Array.isArray(round.matches)||round.matches.length!==count)throw Error('Invalid Ultimate round.');
  for(const m of round.matches)if(!m||!m.times||typeof m.times!=='object'||Array.isArray(m.times))throw Error('Invalid Ultimate match times.');
 }
 const rounds=grandRounds(d);
 for(let ri=0;ri<rounds.length;ri++){
  const round=u.rounds[ri];for(let mi=0;mi<round.matches.length;mi++){
   const b=rounds[ri].bouts[mi];
   for(const [carId,ms] of Object.entries(round.matches[mi].times))
    if(!round.route||!b.ready||b.ids.length!==2||!b.ids.includes(carId)||!validMs(ms))throw Error('Ultimate time not attached to a valid ready match.');
  }
 }
}
function load(id){const raw=localStorage.getItem(key(id));if(raw===null)return fresh(id);try{return validate(JSON.parse(raw),id);}catch(_){throw Error('Second Chance QA save unreadable or invalid. Refusing changes to protect data.');}}
function save(d){validate(d,d.spaceId);localStorage.setItem(key(d.spaceId),JSON.stringify(d));}
function queue(d){const used=new Set(d.cups.flatMap(c=>c.groups.flatMap(g=>g.ids)));return d.tickets.filter(t=>!used.has(t.id));}
function formGroups(d){let made=0;while(true){let cup=d.cups.at(-1);if(cup?.groups.length===4)cup=null;const reserved=new Set((cup?.groups||[]).flatMap(g=>g.ids).map(tid=>d.tickets.find(t=>t.id===tid)?.carId));const picked=[],seen=new Set(reserved);for(const t of queue(d)){if(!seen.has(t.carId)){picked.push(t.id);seen.add(t.carId);}if(picked.length===4)break;}if(picked.length!==4)break;if(!cup){cup=emptyCup(d.cups.length+1);d.cups.push(cup);}cup.groups.push({ids:picked,route:'',times:{}});made++;}return made;}
function addTicket(d,source,car){if(!clean(source.sourceId)||d.tickets.some(t=>t.sourceId===source.sourceId))throw Error('This source competition has already supplied a ticket.');if(!clean(car?.id)||!clean(car?.name))throw Error('Qualifying owned car not found.');const t={id:'t'+d.nextTicket++,sourceId:source.sourceId,sourceName:source.sourceName,kind:source.kind,carId:car.id,name:car.name,make:car.make||'',place:source.place??null,proof:source.proof||'',at:new Date().toISOString()};d.tickets.push(t);return{ticket:t,formed:formGroups(d)};}
function rank(stage,ids){const rows=ids.map(id=>({id,time:Object.prototype.hasOwnProperty.call(stage.times,id)?stage.times[id]:null})).sort((a,b)=>a.time===null?1:b.time===null?-1:a.time-b.time);const complete=rows.length>1&&rows.every(r=>validMs(r.time));return{rows,complete,tied:complete&&rows[0].time===rows[1].time,winner:complete&&rows[0].time!==rows[1].time?rows[0].id:null};}
function heat(d,ci,kind,i){const cup=d.cups[ci];if(!cup)throw Error('Cup missing.');if(kind==='group'){const g=cup.groups[i];if(!g)throw Error('Group missing.');return{stage:g,ids:g.ids.slice(),ready:true,label:'GROUP '+String.fromCharCode(65+i)};}
 if(kind==='semi'){if(i!==0&&i!==1)throw Error('Invalid semi.');const ids=cup.groups.slice(i*2,i*2+2).map(g=>rank(g,g.ids).winner);return{stage:cup.semis[i],ids:ids.filter(Boolean),ready:ids.length===2&&ids.every(Boolean),label:'SEMIFINAL '+(i+1)};}
 if(kind==='final'){const ids=[0,1].map(j=>{const s=heat(d,ci,'semi',j);return s.ready?rank(s.stage,s.ids).winner:null;});return{stage:cup.final,ids:ids.filter(Boolean),ready:ids.every(Boolean),label:'FINAL'};}
 throw Error('Unsupported Cup stage.');}
const hasTimes=st=>Object.keys(st.times).length>0;
function lockTrack(d,ci,kind,i,name){const x=heat(d,ci,kind,i);if(!x.ready)throw Error('Waiting for qualifiers.');if(hasTimes(x.stage))throw Error('Track locked: times already recorded.');name=clean(name);if(name.length<2||name.length>100)throw Error('Enter a track name (2–100 letters).');if(kind==='semi'){const other=d.cups[ci].semis[1-i];if(other.route&&other.route.toLowerCase()!==name.toLowerCase())throw Error('Both semifinal matches must use the same circuit.');x.stage.route=name;other.route=name;}else x.stage.route=name;}
function enterTime(d,ci,kind,i,tid,time){const x=heat(d,ci,kind,i);if(!x.ready||!x.ids.includes(tid))throw Error('This car is not in this heat.');if(!clean(x.stage.route))throw Error('Lock one shared circuit for this heat first.');if(!validMs(time))throw Error('Invalid race time.');const before=rank(x.stage,x.ids).winner,old=x.stage.times[tid];x.stage.times[tid]=time;const after=rank(x.stage,x.ids).winner;if(kind==='final'&&d.ultimate&&before!==after){if(old===undefined)delete x.stage.times[tid];else x.stage.times[tid]=old;throw Error('Cup champion is frozen into the Ultimate QA bracket.');}let later=false;if(kind==='group')later=hasTimes(d.cups[ci].semis[Math.floor(i/2)]);if(kind==='semi')later=hasTimes(d.cups[ci].final);if(later&&before!==after){if(old===undefined)delete x.stage.times[tid];else x.stage.times[tid]=old;throw Error('Correction would change an entrant after later races have times. No changes saved.');}}
const isDone=x=>['complete','completed','finished'].includes(clean(x?.status).toLowerCase());
function finishedSources(space){const list=[];for(const r of space.runs||[])if(isDone(r)&&clean(r.id))list.push({sourceId:'run:'+r.id,sourceName:clean(r.name)||'Championship',kind:'run',object:r,date:clean(r.completedAt||r.updatedAt)});for(const r of space.raceOffs||[])if(isDone(r)&&clean(r.id))list.push({sourceId:'raceoff:'+r.id,sourceName:clean(r.name)||'Race Off',kind:'raceoff',object:r,date:clean(r.completedAt||r.updatedAt)});return list.sort((a,b)=>a.date.localeCompare(b.date));}
function runQualifier(r,bronze){if(!isDone(r)||!Array.isArray(r.entries)||!Array.isArray(r.rounds)||!Array.isArray(r.results)||!r.rounds.length)throw Error('Not a completed standard championship.');if(r.v8Groups||r.format==='groups-total-time')throw Error('Group championship finals require their own results adapter (not yet connected).');if(r.format==='swiss'||/\bswiss\b/i.test(clean(r.name)))throw Error('Swiss Cups require their own final-position adapter (not yet connected).');const entries=r.entries.map(e=>typeof e==='string'?e:e?.carId),roundIds=r.rounds.map(x=>x.id);if(entries.length<=bronze||entries.some(x=>!clean(x))||new Set(entries).size!==entries.length||roundIds.some(x=>!clean(x))||new Set(roundIds).size!==roundIds.length)throw Error('Insufficient entries or invalid rounds.');const standings=[];for(const id of entries){let total=0;for(const rid of roundIds){const hits=r.results.filter(x=>x.carId===id&&x.roundId===rid);if(hits.length!==1||!Number.isFinite(hits[0].time)||hits[0].time<=0)throw Error('Missing, duplicate or invalid result in completed source.');total+=hits[0].time;}standings.push({id,total});}standings.sort((a,b)=>a.total-b.total);if(standings[bronze].total===standings[bronze-1].total||standings[bronze+1]?.total===standings[bronze].total)throw Error('Source standings have a tie at the qualifying boundary.');return{carId:standings[bronze].id,place:bronze+1,proof:'Combined '+r.rounds.length+' race times: '+standings[bronze].total.toFixed(3)+'s.'};}
/* QUALIFIER AUDIT: one shared route for EVERY car in the medal-cutoff
   knockout round, not merely the eliminated cars. No guessing across tracks.
   Only a finished Race Off can contribute; bronze cutoff is user confirmed. */
function raceOffQualifier(r,bronze){
 if(bronze!==3&&bronze!==4)throw Error('Confirm whether bronze ended at 3rd or 4th.');
 if(!isDone(r)||!clean(r.championCarId)||!Array.isArray(r.rounds))throw Error('Race Off is not fully completed.');
 const target=bronze===4?'quarterfinal':'semifinal';
 const re=bronze===4?/QUARTER(?:\s*[- ]?FINAL)?/i:/SEMI(?:\s*[- ]?FINAL)?/i;
 const choices=r.rounds.filter(x=>re.test(clean(x?.drawPlan?.label||x?.drawPlan?.kind)));
 if(choices.length!==1)throw Error('Expected one '+target+' elimination round; found '+choices.length+'.');
 const stage=choices[0],needed=bronze===4?4:2;
 if(!Array.isArray(stage.matches)||stage.matches.length!==needed)throw Error('Expected '+needed+' '+target+' matches.');
 const losers=[],tracks=new Set(),seen=new Set();
 for(const m of stage.matches){
  if(!isDone(m)||!clean(m.winnerCarId)||!clean(m.loserCarId)||m.winnerCarId===m.loserCarId)throw Error('Incomplete or invalid elimination match.');
  const a=clean(m.carA?.sourceCarId||m.carA?.carId),b=clean(m.carB?.sourceCarId||m.carB?.carId);
  if(!a||!b||a===b||new Set([a,b]).size!==2||![a,b].includes(m.winnerCarId)||![a,b].includes(m.loserCarId))throw Error('Recorded winner/loser does not match this Race Off pairing.');
  if(seen.has(a)||seen.has(b))throw Error('Car appears more than once in the knockout round.');
  seen.add(a);seen.add(b);
  if(!Array.isArray(m.attempts))throw Error('Missing recorded attempts.');
  const attempts=[a,b].map(id=>{
   const hits=m.attempts.filter(t=>t.carId===id);
   if(hits.length!==1||!Number.isFinite(hits[0].time)||hits[0].time<=0)throw Error('Every car must have exactly one valid recorded time in this round.');
   return hits[0];
  });
  for(const attempt of attempts){
   const track=clean(attempt.track),layout=clean(attempt.layout).toLowerCase();
   if(!track)throw Error('Missing circuit name in elimination results.');
   tracks.add((track+'|'+layout).toLowerCase());
  }
  const losingAttempt=attempts.find(t=>t.carId===m.loserCarId);
  losers.push({id:m.loserCarId,time:losingAttempt.time,track:clean(losingAttempt.track)});
 }
 if(tracks.size!==1)throw Error('Race Off round used different tracks/layouts. No cross-track time comparison.');
 losers.sort((a,b)=>a.time-b.time);
 if(bronze===4&&losers[0].time===losers[1].time)throw Error('Two quarterfinal losers tied for fastest time; a tiebreak is required.');
 if(bronze===3&&losers[0].time===losers[1].time)throw Error('Semifinal losers tied; 3rd/4th position cannot be determined.');
 // If both semifinal losers share bronze, quarterfinal winner ranking is relevant.
 // When only 3rd gets bronze, the slower semifinal loser is 4th.
 const pick=bronze===4?losers[0]:losers[1];
 return{carId:pick.id,place:bronze+1,proof:(bronze===4?'Fastest of four quarterfinal losers':'4th place after semifinal bronze comparison')+' · '+pick.track+' · '+pick.time.toFixed(3)+'s.'};
}
/* Read-only proof that the same adapter works with normal saved-match schemas.
   This fixture is never inserted into real raceOffs and never creates medals. */
function raceOffFixture(cars){
 if(cars.length<8)throw Error('At least eight owned cars needed to run the Race Off example.');
 const ids=cars.slice(0,8).map(c=>c.id),q=[];
 for(let j=0;j<4;j++){
  const a=ids[j*2],b=ids[j*2+1];
  q.push({status:'complete',carA:{sourceCarId:a},carB:{sourceCarId:b},winnerCarId:a,loserCarId:b,attempts:[
   {carId:a,time:206+j*4,track:'QA Shared Circuit',layout:''},
   {carId:b,time:220+j*4,track:'QA Shared Circuit',layout:''}
  ]});
 }
 const semis=[0,1].map(j=>{
  const a=ids[j*4],b=ids[j*4+2];
  return{status:'complete',carA:{sourceCarId:a},carB:{sourceCarId:b},winnerCarId:a,loserCarId:b,attempts:[
   {carId:a,time:241+j*5,track:'QA Semifinal Circuit',layout:''},
   {carId:b,time:254+j*7,track:'QA Semifinal Circuit',layout:''}
  ]};
 });
 return{status:'complete',championCarId:ids[0],rounds:[
  {name:'QA Shared Circuit',drawPlan:{label:'QUARTERFINALS'},matches:q},
  {name:'QA Semifinal Circuit',drawPlan:{label:'SEMIFINALS'},matches:semis}
 ]};
}
function previewRaceOffFixture(cars){
 const f=raceOffFixture(cars),bronzeThrough3=raceOffQualifier(f,3),bronzeThrough4=raceOffQualifier(f,4);
 const byId=new Map(cars.map(c=>[c.id,c]));
 return{bronzeThrough3:{...bronzeThrough3,name:byId.get(bronzeThrough3.carId)?.name||bronzeThrough3.carId},bronzeThrough4:{...bronzeThrough4,name:byId.get(bronzeThrough4.carId)?.name||bronzeThrough4.carId}};
}
function raceOffAudit(space,d){
 const all=Array.isArray(space.raceOffs)?space.raceOffs:[],claimed=new Set(d.tickets.map(t=>t.sourceId));
 return{total:all.length,unfinished:all.filter(r=>!isDone(r)).length,finished:all.filter(isDone).length,
 claimed:all.filter(r=>isDone(r)&&claimed.has('raceoff:'+r.id)).length,
 unclaimed:all.filter(r=>isDone(r)&&!claimed.has('raceoff:'+r.id)).length};
}
/* Specialist source adapter for existing stored FH5 championships / Race Offs.
   This ONLY categorises verified completed-source records and previews the
   existing official times. It cannot invent a competition, medal or result. */
function specialistDetails(source,cars){
 const r=source?.object||{},name=clean(source?.sourceName||''),ids=source?.kind==='raceoff'
  ?(Array.isArray(r.entryIds)&&r.entryIds.length?r.entryIds:(r.entrants||[]).map(e=>typeof e==='string'?e:clean(e?.sourceCarId||e?.carId)))
  :Array.isArray(r.entries)?r.entries.map(e=>typeof e==='string'?e:clean(e?.carId||e?.sourceCarId)):[];
 if(!Array.isArray(ids)||ids.length<2||ids.some(id=>!clean(id))||new Set(ids).size!==ids.length)
  return{tags:[],status:'INVALID ROSTER',issue:'Missing, duplicated or invalid source entrant IDs.'};
 const byId=new Map(cars.map(c=>[c.id,c]));const roster=ids.map(id=>byId.get(id));
 if(roster.some(c=>!c))return{tags:[],status:'NOT VERIFIED',issue:'At least one source entrant is no longer found in owned Garage.'};
 const tags=[],issues=[];
 const makes=[...new Set(roster.map(c=>clean(c.make).toLowerCase()))];
 const types=[...new Set(roster.map(c=>clean(c.classType||c.type).toLowerCase()))];
 const make=clean(roster[0].make),type=clean(roster[0].classType||roster[0].type);
 const mentions=(phrase)=>phrase&&name.toLowerCase().includes(phrase.toLowerCase());
 const wheels=/\bhot[\s-]*wheels\b/i.test(name);
 if(wheels){
  if(makes.length===1&&makes[0]==='hot wheels')tags.push('HOT WHEELS');
  else issues.push('Hot Wheels label does not match all entrant manufacturers.');
 }
 if(/\boff[\s-]*road\b|\bcross[\s-]*country\b/i.test(name))tags.push('OFF-ROAD');
 if(/\brally\b/i.test(name))tags.push('RALLY');
 if(makes.length===1&&make&&mentions(make)&&make.toLowerCase()!=='hot wheels')tags.push('MANUFACTURER');
 if(types.length===1&&type&&mentions(type))tags.push('CAR TYPE');
 // A source is not classified as a specialist based on one isolated word like
 // "Ford" without also validating its full stored entrant roster.
 return{tags,status:issues.length?'CHECK ROSTER':tags.length?'CLASSIFIED':'OTHER',issue:issues.join(' '),entrants:ids.length};
}
function specialistAudit(space,cars,d){
 const finished=finishedSources(space);
 const rows=finished.map(s=>({source:s,details:specialistDetails(s,cars)}))
  .filter(x=>x.details.tags.length||x.details.issue);
 return rows.map(({source,details})=>{
  const previews={};
  for(const bronze of [3,4]){
   try{
    if(details.issue)throw Error(details.issue);
    const q=candidate(source,bronze),owned=cars.find(c=>c.id===q.carId);
    if(!owned)throw Error('Calculated qualifier is no longer in owned Garage.');
    previews[bronze]={ok:true,name:owned.name,carId:q.carId,proof:q.proof};
   }catch(e){previews[bronze]={ok:false,error:clean(e.message||e)};}
  }
  return{sourceId:source.sourceId,sourceName:source.sourceName,kind:source.kind,
   tags:details.tags,entrants:details.entrants||0,issue:details.issue||'',
   claimed:d.tickets.some(t=>t.sourceId===source.sourceId),previews};
 });
}
function candidate(source,bronze){bronze=Number(bronze);if(bronze!==3&&bronze!==4)throw Error('Bronze must end at 3rd or 4th.');return source.kind==='raceoff'?raceOffQualifier(source.object,bronze):runQualifier(source.object,bronze);}
function demoTickets(d,cars){const used=new Set(d.tickets.map(t=>t.carId));const four=cars.filter(c=>!used.has(c.id)).slice(0,4);if(four.length!==4)throw Error('Four unused owned FH5 cars are needed for the test.');for(const car of four)addTicket(d,{sourceId:'demo-'+d.nextTicket,sourceName:'SIMULATED COMPLETE EVENT '+d.nextTicket,kind:'demo',proof:'TEST only'},car);return 4;}
/* A completed Cup yields one Grand Championship qualifying CAR. Multiple Cup victories
   for the same car are honoured in the register but grant ONE driving place. */
function ultimateQualifiers(d){
 const roster=new Map(),cupWinners=[];
 for(let ci=0;ci<d.cups.length;ci++){
  const final=heat(d,ci,'final',0);
  if(!final.ready)continue;
  const tid=rank(final.stage,final.ids).winner;
  if(!tid)continue;
  const t=car(d,tid);
  cupWinners.push({cup:ci+1,ticket:tid,carId:t.carId,name:t.name,make:t.make});
  if(!roster.has(t.carId))roster.set(t.carId,{carId:t.carId,name:t.name,make:t.make,cups:[]});
  roster.get(t.carId).cups.push(ci+1);
 }
 return {cupWinners,entrants:Array.from(roster.values())};
}
/* FINALS NIGHT QA: freeze qualified car IDs. The production draw will ONLY begin
   when all Cups have concluded; QA lets us test with two or more winners today.
   Earlier winners earn the documented byes when entrants are not a power of 2. */
function nextPower(n){let p=2;while(p<n)p*=2;return p;}
function seeding(size){let seeds=[1,2];while(seeds.length<size){const next=seeds.length*2+1;seeds=seeds.flatMap(i=>[i,next-i]);}return seeds;}
function startGrand(d){
 if(d.ultimate)throw Error('Ultimate QA draw already started. Existing times are protected.');
 const entrants=ultimateQualifiers(d).entrants;
 if(entrants.length<2)throw Error('At least two different Cup champions are needed.');
 const n=nextPower(entrants.length),rounds=[];
 for(let size=n/2;size>=1;size/=2)rounds.push({route:'',matches:Array.from({length:size},()=>({times:{}}))});
 d.ultimate={schema:1,seeds:entrants.map(x=>x.carId),startedAt:new Date().toISOString(),rounds};
 return entrants.length;
}
/* Each round shares exactly one track. Only genuine TWO-CAR matches need times.
   BYEs are automatic and give no made-up times or medals. Unresolved matches
   cannot be mistaken for BYEs. */
function grandRounds(d){
 if(!d.ultimate)return [];
 const u=d.ultimate,p=nextPower(u.seeds.length),order=seeding(p);
 let previous=null,out=[];
 for(let ri=0;ri<u.rounds.length;ri++){
  const slots=ri===0?order.map(seed=>({id:u.seeds[seed-1]||null,decided:true})):previous;
  const bouts=[];
  for(let mi=0;mi<slots.length/2;mi++){
   const [a,b]=slots.slice(mi*2,mi*2+2),ready=a.decided&&b.decided;
   const ids=[a.id,b.id].filter(Boolean);
   const stage=u.rounds[ri].matches[mi];
   let winner=null,decided=false,tied=false;
   if(ready&&ids.length===1){winner=ids[0];decided=true;}
   if(ready&&ids.length===2){const result=rank(stage,ids);winner=result.winner;tied=result.tied;decided=Boolean(winner);}
   bouts.push({ids,ready,bye:ready&&ids.length===1,winner,decided,tied,stage,match:mi});
  }
  out.push({index:ri,route:u.rounds[ri].route,bouts});
  previous=bouts.map(b=>({id:b.winner,decided:b.decided}));
 }
 return out;
}
function grandWinner(d){if(!d.ultimate)return null;const rounds=grandRounds(d);return rounds.at(-1)?.bouts[0]?.winner||null;}
function lockGrandTrack(d,ri,name){
 const u=d.ultimate,round=u?.rounds[ri];if(!round)throw Error('No such Ultimate round.');
 const bouts=grandRounds(d)[ri].bouts;
 if(bouts.some(b=>Object.keys(b.stage.times).length))throw Error('This round already has saved times.');
 if(!bouts.some(b=>b.ready&&b.ids.length===2))throw Error('Awaiting advancing competitors.');
 name=clean(name);if(name.length<2||name.length>100)throw Error('Enter a track name (2–100 letters).');
 round.route=name;
}
function enterGrandTime(d,ri,mi,carId,ms){
 const round=d.ultimate?.rounds[ri];if(!round)throw Error('Ultimate draw has not started.');
 const bouts=grandRounds(d)[ri].bouts,b=bouts[mi];
 if(!b?.ready||b.ids.length!==2||!b.ids.includes(carId))throw Error('Car is not in this playable Ultimate match.');
 if(!clean(round.route))throw Error('Lock one shared circuit for this round first.');
 if(!validMs(ms))throw Error('Invalid Grand Championship time.');
 const old=b.stage.times[carId],before=b.winner;
 b.stage.times[carId]=ms;
 const updated=grandRounds(d)[ri].bouts[mi];
 if(updated.winner!==before){
  const future=d.ultimate.rounds.slice(ri+1).some(r=>r.matches.some(m=>Object.keys(m.times).length));
  if(future){if(old===undefined)delete b.stage.times[carId];else b.stage.times[carId]=old;throw Error('Cannot change a winner after later Ultimate rounds have saved times.');}
 }
}
function grandCar(d,id){const t=ultimateQualifiers(d).entrants.find(x=>x.carId===id);return t||{carId:id,name:'Unknown car',make:'',cups:[]};}
function grandLabel(round){return round.bouts.length===1?'👑 ULTIMATE FINAL':round.bouts.length===2?'SEMIFINALS':'ROUND OF '+(round.bouts.length*2);}
function grandUi(d){
 if(!d.ultimate)return '';
 const rounds=grandRounds(d),known=ultimateQualifiers(d).entrants.length,n=d.ultimate.seeds.length;
 let out='<div class="sc-grand-state"><b>🏁 FINALS NIGHT QA DRAW · '+n+' CARS</b><p>Entrants were frozen when this test started. '+(known>n?'<strong>'+(known-n)+' newer Cup champions are outside this frozen TEST draw.</strong> ':'')+'Round byes are awarded to earlier qualifying Cup champions. One shared track for every match in each knockout round.</p></div>';
 for(const round of rounds){
  const label=grandLabel(round),active=round.bouts.some(b=>b.ready&&b.ids.length===2&&!b.winner),hasPlay=round.bouts.some(b=>b.ready&&b.ids.length===2);
  out+='<details class="sc-grand-round" '+(active||round.bouts.length===1?'open':'')+'><summary>'+esc(label)+' · '+round.bouts.filter(b=>b.decided).length+'/'+round.bouts.length+' settled</summary>';
  if(hasPlay){if(round.route)out+='<p class="sc-track-label">🏁 <b>'+esc(round.route)+'</b> <small>Shared by every match in this round.</small></p>';
   else out+='<div class="sc-track"><label>Round circuit<input id="sc-grand-route-'+round.index+'" maxlength="100" placeholder="e.g. Playa Azul Circuit" autocomplete="off"></label><button type="button" data-sc="glock" data-r="'+round.index+'">LOCK ROUND TRACK</button></div>';}
  else out+='<p class="sc-muted">Waiting for earlier results.</p>';
  for(const b of round.bouts){
   out+='<div class="sc-grand-match"><b>MATCH '+(b.match+1)+'</b>';
   if(!b.ready)out+='<p class="sc-muted">Awaiting previous round.</p>';
   else if(b.bye)out+='<p class="sc-grand-bye">'+esc(grandCar(d,b.winner).name)+' — BYE / automatically advances</p>';
   else if(b.ids.length===2){
    for(const cid of b.ids){const t=grandCar(d,cid),saved=b.stage.times[cid],isSaved=saved!==undefined,editing=isSaved&&editingTimes.has(editKey('ultimate',round.index,b.match,cid));
     out+='<div class="sc-grand-entry"><div><b>'+esc(t.name)+'</b><small>'+esc(t.make)+'</small></div>';
     if(round.route){
      if(isSaved&&!editing)out+='<div class="sc-saved"><strong>✓ '+fmt(saved)+' SAVED</strong><button type="button" class="sc-secondary" data-sc="gedit" data-r="'+round.index+'" data-m="'+b.match+'" data-t="'+esc(cid)+'">CORRECT</button></div>';
      else out+='<div class="sc-entry-controls"><input class="sc-time" id="sc-grand-time-'+round.index+'-'+b.match+'-'+esc(cid)+'" inputmode="numeric" type="text" pattern="[0-9]*" maxlength="9" value="'+(isSaved?fmt(saved).replace(/\D/g,''):'')+'" placeholder="MMSSmmm" autocomplete="off" aria-label="Time for '+esc(t.name)+'"><button type="button" data-sc="gtime" data-r="'+round.index+'" data-m="'+b.match+'" data-t="'+esc(cid)+'">'+(isSaved?'SAVE CORRECTION':'SAVE')+'</button></div>'+(editing?'<button type="button" class="sc-cancel" data-sc="gcancel" data-r="'+round.index+'" data-m="'+b.match+'" data-t="'+esc(cid)+'">CANCEL CORRECTION</button>':'');
     }
     out+='</div>';
    }
    if(b.tied)out+='<p class="sc-alert">Times tied. Correct before advancing.</p>';
    else if(b.winner)out+='<p class="sc-winner">✅ ADVANCES: '+esc(grandCar(d,b.winner).name)+'</p>';
   }
   out+='</div>';
  }
  out+='</details>';
 }
 const winner=grandWinner(d);
 if(winner)out+='<div class="sc-champion">👑 ULTIMATE SECOND CHANCE CHAMPION — QA<br><strong>'+esc(grandCar(d,winner).name)+'</strong><p>Provisional test result only; no official medal or racing record awarded.</p></div>';
 return out;
}
/* Deliberately limited to one button press for the NEXT three groups after a
   winning Group A. No pre-existing timed group, queue or original result is changed. */
function addRemainingDemoGroups(d,cars,ci){
 const cup=d.cups[ci];
 if(!cup||ci!==d.cups.length-1||cup.groups.length!==1||queue(d).length)
  throw Error('Finish the current Cup Group A first; only an empty B–D set can be added.');
 if(!rank(cup.groups[0],cup.groups[0].ids).winner)
  throw Error('Group A must have a confirmed winner before the next groups are added.');
 const used=new Set(d.tickets.map(t=>t.carId));
 const next=cars.filter(c=>!used.has(c.id)).slice(0,12);
 if(next.length!==12)throw Error('Twelve unused owned FH5 cars are needed for this QA shortcut.');
 for(const c of next)addTicket(d,{sourceId:'demo-'+d.nextTicket,sourceName:'SIMULATED COMPLETE EVENT '+d.nextTicket,kind:'demo',proof:'TEST only'},c);
 if(d.cups[ci]!==cup||cup.groups.length!==4)throw Error('QA B–D groups did not form as expected.');
 return 3;
}
/* QA ONLY: One self-contained block of 16 clearly marked TEST tickets to prove
   that a completed Cup cannot be disturbed by the formation of its successor.
   Failure to find 16 distinct cars aborts without saving the current QA state. */
function addNextDemoCup(d,cars){
 if(d.cups.length<1)throw Error('Finish the first Cup before testing a second Cup.');
 if(queue(d).length)throw Error('There are waiting qualifiers: finish assigning them first.');
 const lastIndex=d.cups.length-1,cup=d.cups[lastIndex];
 if(cup.groups.length!==4)throw Error('The current Cup still needs all four groups.');
 const final=heat(d,lastIndex,'final',0);
 if(!final.ready||!rank(final.stage,final.ids).winner)throw Error('Finish the current Cup final before starting another QA Cup.');
 const prior=new Set(d.tickets.map(t=>t.carId));
 // Distinct across this NEW Cup; previous Cup cars may return only if needed.
 const candidates=[...cars.filter(c=>!prior.has(c.id)),...cars.filter(c=>prior.has(c.id))];
 const next=[],seen=new Set();
 for(const c of candidates){if(c&&clean(c.id)&&!seen.has(c.id)){seen.add(c.id);next.push(c);}if(next.length===16)break;}
 if(next.length!==16)throw Error('Sixteen distinct owned FH5 cars are needed to test another Cup.');
 const start=d.cups.length,baseline=d.cups.map(c=>JSON.stringify(c));
 for(const c of next)addTicket(d,{sourceId:'demo-'+d.nextTicket,sourceName:'SIMULATED COMPLETE EVENT '+d.nextTicket,kind:'demo',proof:'TEST only'},c);
 if(d.cups.length!==start+1||d.cups[start].groups.length!==4)throw Error('Expected one new four-group Cup. Nothing was saved.');
 for(let i=0;i<start;i++)if(JSON.stringify(d.cups[i])!==baseline[i])throw Error('Previous Cup changed unexpectedly. Nothing was saved.');
 return start;
}
/* Optional accelerated B/C/D QA for the NEW Cup only. Does not touch timing
   in finished Cup 1 or any group which has received a real/source ticket. */
function fillNewDemoGroups(d,ci){
 if(ci<1||ci!==d.cups.length-1)throw Error('Only the newest QA Cup can be quick-filled.');
 const cup=d.cups[ci];
 if(!cup||cup.groups.length!==4)throw Error('Four complete test groups are required.');
 for(let j=0;j<4;j++){
  const x=heat(d,ci,'group',j);
  if(hasTimes(x.stage)||x.ids.some(t=>car(d,t).kind!=='demo'))throw Error('Only untouched all-DEMO groups can be filled together.');
 }
 for(let j=0;j<4;j++)demoHeat(d,ci,j);
 return 4;
}
function demoHeat(d,ci,i){const x=heat(d,ci,'group',i);if(hasTimes(x.stage)||x.ids.some(id=>d.tickets.find(t=>t.id===id)?.kind!=='demo'))throw Error('Only an untouched 4-car simulation group can be demo-filled.');x.stage.route=x.stage.route||'QA SIMULATION CIRCUIT';for(let j=0;j<4;j++)x.stage.times[x.ids[j]]=180000+ci*9000+i*2600+j*7101;}
function car(d,tid){return d.tickets.find(t=>t.id===tid)||{name:'Unknown car',make:''};}
function screen(){let el=document.getElementById(SCREEN_ID);if(el)return el;el=document.createElement('section');el.id=SCREEN_ID;el.className='sc-screen';el.hidden=true;document.body.appendChild(el);el.addEventListener('click',onClick);el.addEventListener('change',e=>{const id=e.target.id;if(id==='sc-source'){sourceChoice=e.target.value;bronzeChoice=sourceChoice.startsWith('raceoff:')?'4':'3';paint();}if(id==='sc-bronze'){bronzeChoice=e.target.value;paint();}if(id==='sc-cup'){currentCup=+e.target.value;paint();}});el.addEventListener('input',e=>{if(!e.target.matches('.sc-time'))return;e.target.value=e.target.value.replace(/\D/g,'').slice(0,9);const label=e.target.closest('.sc-entry')?.querySelector('.sc-preview');if(label){const ms=parseMs(e.target.value);label.textContent=ms===null?'Enter a valid time — nothing new saved':'New time: '+fmt(ms)+' (not saved yet)';}});return el;}
function renderHeat(d,ci,kind,i){const x=heat(d,ci,kind,i);let out='<article class="sc-heat"><h4>'+esc(x.label)+'</h4>';if(!x.ready)return '<div class="sc-waiting"><b>'+esc(x.label)+'</b><span>Waiting for advancing cars</span></div>';
 out+='<p class="sc-small">'+(kind==='group'?'Fastest of four advances.':'Fastest of two advances.')+' <b>'+(kind==='semi'?'BOTH semifinals share the same track.':'ONE shared track for this heat.')+'</b></p>';
 if(x.stage.route)out+='<p class="sc-track-label">🏁 <b>'+esc(x.stage.route)+'</b><small>Track locked for every car in this heat.</small></p>';
 else out+='<div class="sc-track"><label>Heat circuit<input maxlength="100" id="sc-route-'+ci+'-'+kind+'-'+i+'" placeholder="e.g. Playa Azul Circuit" autocomplete="off"></label><button type="button" data-sc="lock" data-c="'+ci+'" data-k="'+kind+'" data-i="'+i+'">LOCK TRACK</button></div>';
 for(const tid of x.ids){const t=car(d,tid),saved=x.stage.times[tid],isSaved=saved!==undefined,editing=isSaved&&editingTimes.has(editKey(ci,kind,i,tid));out+='<div class="sc-entry'+(isSaved?' sc-entry-done':'')+'"><div class="sc-entry-name"><b>'+esc(t.name)+'</b><span>'+esc(t.make)+(isSaved?' · Time recorded':' · Waiting for time')+'</span></div>';
 if(x.stage.route){
   if(isSaved&&!editing){out+='<div class="sc-saved"><strong>✓ '+fmt(saved)+' SAVED</strong><button class="sc-secondary" type="button" data-sc="edit" data-c="'+ci+'" data-k="'+kind+'" data-i="'+i+'" data-t="'+esc(tid)+'">CORRECT</button></div>';}
   else{out+='<div class="sc-entry-controls"><input class="sc-time" id="sc-time-'+ci+'-'+kind+'-'+i+'-'+esc(tid)+'" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="9" value="'+(isSaved?fmt(saved).replace(/\D/g,''):'')+'" placeholder="MMSSmmm" autocomplete="off" aria-label="Time for '+esc(t.name)+'"><button type="button" data-sc="time" data-c="'+ci+'" data-k="'+kind+'" data-i="'+i+'" data-t="'+esc(tid)+'">'+(isSaved?'SAVE CORRECTION':'SAVE')+'</button></div><small class="sc-preview">'+(isSaved?'Current saved time: '+fmt(saved):'Enter MMSSmmm then Save')+'</small>'+(editing?'<button type="button" class="sc-cancel" data-sc="cancel" data-c="'+ci+'" data-k="'+kind+'" data-i="'+i+'" data-t="'+esc(tid)+'">CANCEL CORRECTION</button>':'');}
 }
 out+='</div>';}
 const result=rank(x.stage,x.ids);if(result.tied)out+='<p class="sc-alert">⚠️ Fastest times tied. Resolve before advancing.</p>';else if(result.winner)out+='<p class="sc-winner">✅ WINNER: '+esc(car(d,result.winner).name)+' — '+fmt(result.rows[0].time)+'</p>';else out+='<p class="sc-muted">'+Object.keys(x.stage.times).length+' / '+x.ids.length+' times recorded.</p>';
 if(kind==='group'&&!hasTimes(x.stage)&&x.ids.every(tid=>car(d,tid).kind==='demo'))out+='<button class="sc-secondary" type="button" data-sc="fill" data-c="'+ci+'" data-i="'+i+'">FILL THIS GROUP WITH SIMULATED TIMES</button>';
 return out+'</article>';}
function paint(){const el=screen();if(el.hidden)return;let ctx,d;try{ctx=context();d=load(ctx.id);}catch(e){el.innerHTML='<div class="sc-card"><button data-sc="back">← BACK TO FESTIVAL</button><h2>SECOND CHANCE CUPS — QA</h2><p>'+esc(e.message)+'</p></div>';return;}
 const sources=finishedSources(ctx.space).filter(s=>!d.tickets.some(t=>t.sourceId===s.sourceId));if(!sources.some(s=>s.sourceId===sourceChoice)){sourceChoice=sources[0]?.sourceId||'';bronzeChoice=sourceChoice.startsWith('raceoff:')?'4':'3';}
 const waiting=queue(d),ultimate=ultimateQualifiers(d),finished=ultimate.cupWinners.length;
 let out='<div class="sc-card"><button class="sc-back" type="button" data-sc="back">← BACK TO FESTIVAL</button><h2>🎟️ SECOND CHANCE CUPS <small>QA</small></h2>';
 out+='<p class="sc-note">One ticket for <b>every qualifying FINISHED competition</b>, drawn from the car immediately below the lowest bronze place. Four tickets start a group immediately; four groups form one Cup. Group winners advance to two semifinals and one final. Additional cups continue throughout the campaign.</p>';
 out+='<p class="sc-warning">TEST ONLY: this screen saves isolated QA data. It does not award medals, change the Garage, reset history or write official competition results.</p>';
 out+='<div class="sc-stats"><div><b>'+d.tickets.length+'</b><span>tickets</span></div><div><b>'+d.cups.reduce((n,c)=>n+c.groups.length,0)+'</b><span>groups</span></div><div><b>'+d.cups.length+'</b><span>cups</span></div><div><b>'+finished+'</b><span>finished</span></div></div>';
 out+='<details class="sc-inbox" '+(sourceFocus||!d.cups.length?'open':'')+'><summary>🎟️ QUALIFIER INBOX · '+waiting.length+' WAITING</summary><p class="sc-small">Select only a completed competition and confirm where its bronze medals ended. One ticket per source; a car can re-enter a later Cup, but never twice within the same Cup.</p>';
 const special=specialistAudit(ctx.space,ctx.cars,d);
 out+='<details class="sc-specialist-audit"><summary>🏭 SMALL COMPETITION SOURCE CHECK · '+special.length+' FINISHED</summary>';
 out+='<p class="sc-small">Uses real completed Manufacturer, Car Type, Hot Wheels, Rally and Off-Road source results. Names are cross-checked against the saved entrant roster where possible. No source is marked finished early; no medals or tickets are created by opening this panel.</p>';
 if(special.length){for(const s of special){
  out+='<div class="sc-specialist-row"><b>'+esc(s.sourceName)+'</b><small>'+esc((s.tags.join(' · ')||'ROSTER CHECK')+' · '+s.entrants+' cars · '+(s.claimed?'QA TICKET CLAIMED':'NOT CLAIMED'))+'</small>';
  for(const bronze of [3,4]){const p=s.previews[bronze];out+='<div class="sc-specialist-preview">Bronze to '+bronze+'th → '+(p.ok?'<strong>'+esc(p.name)+'</strong>':'<span>INELIGIBLE / BLOCKED</span>')+'</div>';}
  if(s.issue)out+='<p class="sc-warn">'+esc(s.issue)+'</p>';
  if(!s.claimed)out+='<button type="button" class="sc-secondary" data-sc="selectspecial" data-source="'+esc(s.sourceId)+'">SELECT COMPLETED SOURCE</button>';
  out+='</div>';
 }}else out+='<p class="sc-muted">No completed specialist sources detected yet. In-progress championships cannot qualify.</p>';
 out+='<p class="sc-small">Blocked simply means that medal cutoff cannot produce a valid unique car (for example, three entrants and bronze through third). To claim an eligible QA ticket, select the source and confirm its actual medal cutoff below.</p></details>';
 const audit=raceOffAudit(ctx.space,d);
 out+='<details class="sc-source-audit"><summary>🏁 RACE OFF SOURCE CHECK · '+audit.finished+'/'+audit.total+' FINISHED</summary><p>'+audit.unfinished+' unfinished · '+audit.unclaimed+' awaiting qualifier confirmation · '+audit.claimed+' already claimed.</p><p>Race Offs contribute only after their final is complete. The qualifying car is calculated using matching-track knockout times and your confirmed bronze cutoff. Unfinished Race Offs never produce a ticket.</p><button type="button" class="sc-secondary" data-sc="fixture">CHECK EXAMPLE RACE OFF (READ-ONLY)</button></details>';
 if(sources.length){const src=sources.find(s=>s.sourceId===sourceChoice);let proof='';try{const q=candidate(src,bronzeChoice),owned=ctx.cars.find(c=>c.id===q.carId);proof=owned?'Candidate: '+owned.name+' — '+q.proof:'Candidate car not currently present in owned Garage.';}catch(e){proof='Unavailable: '+e.message;}
 out+='<label>Completed competition<select id="sc-source">'+sources.map(s=>'<option value="'+esc(s.sourceId)+'" '+(s.sourceId===sourceChoice?'selected':'')+'>'+esc(s.sourceName)+' ['+esc(s.kind)+']</option>').join('')+'</select></label>';
 out+='<label>Bronze medal ends at<select id="sc-bronze"><option value="3" '+(bronzeChoice==='3'?'selected':'')+'>3rd — qualifier 4th</option><option value="4" '+(bronzeChoice==='4'?'selected':'')+'>4th — qualifier 5th</option></select></label><p class="sc-proof">'+esc(proof)+'</p><button type="button" class="sc-primary" data-sc="source">CONFIRM MEDALS & CLAIM QUALIFIER</button>';
 }else out+='<p class="sc-muted">No unused completed standard championships or Race Offs are available. Other competition source connectors will follow once those mechanics are finished.</p>';
 out+='<div class="sc-demo"><b>Quick phone QA</b><p>Add four clearly marked simulated qualifiers using distinct owned Garage cars. Repeat four times to start four groups. No live competition is marked complete.</p><button type="button" class="sc-secondary" data-sc="demo4">+ ADD FOUR TEST TICKETS</button></div>';
 if(waiting.length)out+='<h4>Waiting for group</h4><div class="sc-queue">'+waiting.slice(0,30).map(t=>'<div><b>'+esc(t.name)+'</b><small>'+esc(t.sourceName)+'</small></div>').join('')+'</div>'+(waiting.length>30?'<p>…plus '+(waiting.length-30)+' more.</p>':'');
 out+='</details>';
 out+='<details class="sc-ultimate" '+(ultimate.entrants.length?'open':'')+'><summary>👑 ULTIMATE CHAMPIONSHIP · '+ultimate.entrants.length+' QUALIFIER'+(ultimate.entrants.length===1?'':'S')+'</summary>';
 out+='<p class="sc-small">Every completed Second Chance Cup crowns a champion. Every champion qualifies for the one Ultimate Second Chance Championship at Finals Night. Repeated wins by one car count as one racing entry.</p>';
 if(ultimate.entrants.length){out+='<div class="sc-ultimate-roster">'+ultimate.entrants.map(t=>'<div><b>'+esc(t.name)+'</b><small>'+esc(t.make)+' · Cup'+(t.cups.length>1?'s ':' ')+t.cups.join(', ')+'</small></div>').join('')+'</div>';}
 else out+='<p class="sc-muted">No Cup champion yet. Finish a Cup final to unlock the first qualifier.</p>';
 if(!d.ultimate&&ultimate.entrants.length>=2)out+='<div class="sc-grand-start"><b>🏁 Ultimate Finals Night — test only</b><p>Start a playable draw using the CURRENT distinct Cup champions. This freezes the test field, so only press once you are ready to test the Grand Final. The official tournament will wait until all qualifying Cups are complete.</p><button class="sc-primary" type="button" data-sc="gstart">BEGIN ULTIMATE FINALS NIGHT QA · '+ultimate.entrants.length+' CARS</button></div>';
 else if(!d.ultimate)out+='<p class="sc-small">At least two distinct completed Cup champions are needed to unlock the playable Finals Night QA.</p>';
 out+=grandUi(d)+'</details>';
 if(d.cups.length){
  const last=d.cups.length-1,finalHeat=heat(d,last,'final',0);
  if(last===d.cups.length-1&&d.cups[last].groups.length===4&&finalHeat.ready&&rank(finalHeat.stage,finalHeat.ids).winner&&!waiting.length){
   out+='<div class="sc-next-cup"><b>🏆 CUP '+d.cups[last].number+' COMPLETE</b><p>Prove the rolling system: start the next independent Cup with 16 labelled TEST entrants. All previous Cups and saved times remain unchanged.</p><button type="button" class="sc-secondary" data-sc="nextcup">+ START CUP '+(d.cups.length+1)+' — 16 TEST QUALIFIERS</button></div>';
  }
  currentCup=Math.min(Math.max(0,currentCup),d.cups.length-1);const cup=d.cups[currentCup];out+='<label class="sc-open-cup">OPEN CUP<select id="sc-cup">'+d.cups.map((c,i)=>'<option value="'+i+'" '+(i===currentCup?'selected':'')+'>SECOND CHANCE CUP '+c.number+' · '+c.groups.length+'/4 GROUPS</option>').join('')+'</select></label>';
 out+='<h3>🏆 SECOND CHANCE CUP '+cup.number+'</h3>';
 if(currentCup>0&&cup.groups.length===4&&cup.groups.every(g=>!hasTimes(g)&&g.ids.every(t=>car(d,t).kind==='demo')))
  out+='<div class="sc-next-cup"><b>🧪 Cup '+cup.number+' test groups ready</b><p>Fill all four simulated groups to proceed directly to the semifinals; regular timing remains available.</p><button type="button" class="sc-secondary" data-sc="fillnew" data-c="'+currentCup+'">FILL CUP '+cup.number+' DEMO GROUP TIMES</button></div>';
 if(cup.groups.length===1&&currentCup===d.cups.length-1&&!waiting.length&&rank(cup.groups[0],cup.groups[0].ids).winner)
  out+='<div class="sc-bcd-qa"><b>✅ Group A complete</b><p>Phone QA shortcut: add the remaining twelve <strong>SIMULATED</strong> entrants as Groups B, C and D, without touching Group A.</p><button type="button" class="sc-secondary" data-sc="demo12" data-c="'+currentCup+'">+ ADD 12 TEST TICKETS — GROUPS B–D</button></div>';
 for(let j=0;j<cup.groups.length;j++)out+=renderHeat(d,currentCup,'group',j);
 if(cup.groups.length<4)out+='<p class="sc-muted">Cup '+cup.number+' has '+cup.groups.length+'/4 groups formed. Later qualifying tickets will complete the remaining groups.</p>';
 out+='<h3>🏁 SEMIFINALS</h3>'+renderHeat(d,currentCup,'semi',0)+renderHeat(d,currentCup,'semi',1)+'<h3>🥇 FINAL</h3>'+renderHeat(d,currentCup,'final',0);
 const f=heat(d,currentCup,'final',0);if(f.ready){const winner=rank(f.stage,f.ids).winner;if(winner)out+='<div class="sc-champion">🏆 QA CUP CHAMPION<br><strong>'+esc(car(d,winner).name)+'</strong><p>Provisional test result only. Official medals remain untouched.</p></div>';}
 }else out+='<p class="sc-muted">No Cup has started. Four qualifying tickets automatically unlock Group A.</p>';
 out+='<p class="sc-message" role="status">'+esc(notice)+'</p><p class="sc-small">Separate FH5 Space QA save. No competitive-career reset or official medal integration until the complete Evil Tournament 2.0 system is approved.</p></div>';el.innerHTML=out;
}
function show(){const el=screen();el.hidden=false;el.style.display='block';document.getElementById('festival')?.classList.add('hidden');notice='';paint();}
function hide(){const el=screen();el.hidden=true;el.style.display='none';document.getElementById('festival')?.classList.remove('hidden');}
function onClick(e){const b=e.target.closest('button[data-sc]');if(!b)return;if(b.dataset.sc==='back'){hide();return;}try{const ctx=context(),d=load(ctx.id),act=b.dataset.sc;if(act==='edit'){editingTimes.add(editKey(+b.dataset.c,b.dataset.k,+b.dataset.i,b.dataset.t));paint();return;}if(act==='cancel'){editingTimes.delete(editKey(+b.dataset.c,b.dataset.k,+b.dataset.i,b.dataset.t));paint();return;}if(act==='demo4'){demoTickets(d,ctx.cars);save(d);currentCup=d.cups.length-1;notice='Four simulated qualifiers added; '+d.cups.reduce((s,c)=>s+c.groups.length,0)+' groups formed.';}
 else if(act==='demo12'){addRemainingDemoGroups(d,ctx.cars,+b.dataset.c);save(d);currentCup=+b.dataset.c;notice='Groups B, C and D added with DEMO entrants. Group A and all saved results are unchanged.';}
 else if(act==='nextcup'){const idx=addNextDemoCup(d,ctx.cars);save(d);currentCup=idx;notice='Cup '+(idx+1)+' created with 16 TEST tickets. Previous Cup results unchanged.';}
 else if(act==='fillnew'){const idx=+b.dataset.c;fillNewDemoGroups(d,idx);save(d);currentCup=idx;notice='All four DEMO groups in Cup '+(idx+1)+' have saved times. Previous Cups unchanged.';}
 else if(act==='gstart'){const count=startGrand(d);save(d);notice='Ultimate QA draw frozen for '+count+' distinct Cup champions. No official results changed.';}
 else if(act==='glock'){const ri=+b.dataset.r,name=document.getElementById('sc-grand-route-'+ri)?.value;lockGrandTrack(d,ri,name);save(d);notice='Ultimate round track locked for all matches: '+clean(name)+'.';}
 else if(act==='gedit'){editingTimes.add(editKey('ultimate',+b.dataset.r,+b.dataset.m,b.dataset.t));paint();return;}
 else if(act==='gcancel'){editingTimes.delete(editKey('ultimate',+b.dataset.r,+b.dataset.m,b.dataset.t));paint();return;}
 else if(act==='gtime'){const ri=+b.dataset.r,mi=+b.dataset.m,id=b.dataset.t,raw=document.getElementById('sc-grand-time-'+ri+'-'+mi+'-'+id)?.value,time=parseMs(raw);if(time===null)throw Error('Enter a valid numeric time, e.g. 0342250 for 03:42.250.');enterGrandTime(d,ri,mi,id,time);save(d);editingTimes.delete(editKey('ultimate',ri,mi,id));notice='Saved Ultimate time '+fmt(time)+' for '+grandCar(d,id).name+'.';}
 else if(act==='selectspecial'){const all=specialistAudit(ctx.space,ctx.cars,d);const selected=all.find(s=>s.sourceId===b.dataset.source&&!s.claimed);if(!selected)throw Error('Completed specialist source is unavailable or already claimed.');sourceChoice=selected.sourceId;bronzeChoice='3';sourceFocus=true;notice='Selected '+selected.sourceName+'. Check the actual bronze cutoff before claiming a QA ticket.';paint();return;}
 else if(act==='fixture'){const q=previewRaceOffFixture(ctx.cars);notice='READ-ONLY EXAMPLE PASS: Bronze ends 3rd → 4th = '+q.bronzeThrough3.name+'; bronze ends 4th → 5th = '+q.bronzeThrough4.name+'. No ticket created.';paint();return;}
 else if(act==='source'){const source=finishedSources(ctx.space).find(s=>s.sourceId===sourceChoice);if(!source)throw Error('Select a finished competition first.');const c=candidate(source,bronzeChoice),owned=ctx.cars.find(x=>x.id===c.carId);if(!owned)throw Error('Qualified car not found in owned Garage. No ticket added.');const a=addTicket(d,{sourceId:source.sourceId,sourceName:source.sourceName,kind:'finished',place:c.place,proof:c.proof},owned);save(d);notice='QA SOURCE TICKET: '+owned.name+' ('+c.place+'th) from FINISHED '+source.sourceName+'. '+a.formed+' new group(s). No official medals changed.';}
 else if(act==='lock'){const ci=+b.dataset.c,k=b.dataset.k,i=+b.dataset.i,name=document.getElementById('sc-route-'+ci+'-'+k+'-'+i)?.value;lockTrack(d,ci,k,i,name);save(d);notice='Shared heat track locked: '+clean(name)+'.';}
 else if(act==='time'){const ci=+b.dataset.c,k=b.dataset.k,i=+b.dataset.i,tid=b.dataset.t;const time=parseMs(document.getElementById('sc-time-'+ci+'-'+k+'-'+i+'-'+tid)?.value);if(time===null)throw Error('Enter a valid digits-only time, e.g. 0342250 = 03:42.250.');enterTime(d,ci,k,i,tid,time);save(d);editingTimes.delete(editKey(ci,k,i,tid));notice='Saved '+fmt(time)+' for '+car(d,tid).name+'.';}
 else if(act==='fill'){demoHeat(d,+b.dataset.c,+b.dataset.i);save(d);notice='Simulated times saved for Group '+String.fromCharCode(65+(+b.dataset.i))+'.';}else return;paint();
 }catch(e){notice='Not saved: '+clean(e.message||e);paint();}}
function mount(){const festival=document.getElementById('festival');if(!festival||festival.classList.contains('hidden')||!festival.children.length||festival.querySelector('#'+LAUNCH_ID))return;const panel=document.createElement('section');panel.id=LAUNCH_ID;panel.className='sc-launch';panel.innerHTML='<details><summary>🎟️ SECOND CHANCE CUPS <small>QA</small></summary><p>Rolling four-car groups, semifinals, final. No official honours yet.</p><button type="button">OPEN SECOND CHANCE TEST</button></details>';
 const jump=festival.querySelector('#otg-longjump-launch-8217');if(jump)jump.insertAdjacentElement('afterend',panel);else festival.appendChild(panel);panel.querySelector('button').addEventListener('click',show);}
let timer=false;function init(){const f=document.getElementById('festival');if(!f)return;new MutationObserver(()=>{if(timer)return;timer=true;setTimeout(()=>{timer=false;mount();},100)}).observe(f,{childList:true,subtree:true});mount();}
window.rhSecondChanceQA8220=window.rhSecondChanceQA8221=window.rhSecondChanceQA8222=window.rhSecondChanceQA8223=window.rhSecondChanceQA8224=window.rhSecondChanceQA8225=window.rhSecondChanceQA8226={fresh,validate,load,save,queue,formGroups,addTicket,rank,heat,lockTrack,enterTime,parseMs,fmt,finishedSources,runQualifier,raceOffQualifier,candidate,demoTickets,demoHeat,ultimateQualifiers,addRemainingDemoGroups,addNextDemoCup,fillNewDemoGroups,startGrand,grandRounds,grandWinner,lockGrandTrack,enterGrandTime,checkUltimate,seeding,raceOffFixture,previewRaceOffFixture,raceOffAudit,specialistDetails,specialistAudit};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
