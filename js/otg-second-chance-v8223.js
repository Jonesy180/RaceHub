/* OTG! MAIN v8.0.223 — independent rolling Cup 2 QA; v222 results and registry retained.
   Reads existing FH5 Garage and finished competitions, but NEVER changes rhSpace,
   original results, medals, honours, catalogue, or private data. */
(()=>{'use strict';
const STORE='otg.secondchance.qa.v1:',SCREEN_ID='otg-sc-screen-8220',LAUNCH_ID='otg-sc-launch-8220';
let notice='',currentCup=0,sourceChoice='',bronzeChoice='4';
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
 }return d;
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
function enterTime(d,ci,kind,i,tid,time){const x=heat(d,ci,kind,i);if(!x.ready||!x.ids.includes(tid))throw Error('This car is not in this heat.');if(!clean(x.stage.route))throw Error('Lock one shared circuit for this heat first.');if(!validMs(time))throw Error('Invalid race time.');const before=rank(x.stage,x.ids).winner,old=x.stage.times[tid];x.stage.times[tid]=time;const after=rank(x.stage,x.ids).winner;let later=false;if(kind==='group')later=hasTimes(d.cups[ci].semis[Math.floor(i/2)]);if(kind==='semi')later=hasTimes(d.cups[ci].final);if(later&&before!==after){if(old===undefined)delete x.stage.times[tid];else x.stage.times[tid]=old;throw Error('Correction would change an entrant after later races have times. No changes saved.');}}
const isDone=x=>['complete','completed','finished'].includes(clean(x?.status).toLowerCase());
function finishedSources(space){const list=[];for(const r of space.runs||[])if(isDone(r)&&clean(r.id))list.push({sourceId:'run:'+r.id,sourceName:clean(r.name)||'Championship',kind:'run',object:r,date:clean(r.completedAt||r.updatedAt)});for(const r of space.raceOffs||[])if(isDone(r)&&clean(r.id))list.push({sourceId:'raceoff:'+r.id,sourceName:clean(r.name)||'Race Off',kind:'raceoff',object:r,date:clean(r.completedAt||r.updatedAt)});return list.sort((a,b)=>a.date.localeCompare(b.date));}
function runQualifier(r,bronze){if(!isDone(r)||!Array.isArray(r.entries)||!Array.isArray(r.rounds)||!Array.isArray(r.results)||!r.rounds.length)throw Error('Not a completed standard championship.');if(r.v8Groups||r.format==='groups-total-time')throw Error('Group championship finals require their own results adapter (not yet connected).');const entries=r.entries.map(e=>typeof e==='string'?e:e?.carId),roundIds=r.rounds.map(x=>x.id);if(entries.length<=bronze||entries.some(x=>!clean(x))||new Set(entries).size!==entries.length||roundIds.some(x=>!clean(x))||new Set(roundIds).size!==roundIds.length)throw Error('Insufficient entries or invalid rounds.');const standings=[];for(const id of entries){let total=0;for(const rid of roundIds){const hits=r.results.filter(x=>x.carId===id&&x.roundId===rid);if(hits.length!==1||!Number.isFinite(hits[0].time)||hits[0].time<=0)throw Error('Missing, duplicate or invalid result in completed source.');total+=hits[0].time;}standings.push({id,total});}standings.sort((a,b)=>a.total-b.total);if(standings[bronze].total===standings[bronze-1].total||standings[bronze+1]?.total===standings[bronze].total)throw Error('Source standings have a tie at the qualifying boundary.');return{carId:standings[bronze].id,place:bronze+1,proof:'Combined '+r.rounds.length+' race times: '+standings[bronze].total.toFixed(3)+'s.'};}
function raceOffQualifier(r,bronze){if(!isDone(r)||!clean(r.championCarId)||!Array.isArray(r.rounds))throw Error('Race Off is unfinished.');const stage=r.rounds.find(x=>(bronze===4?/QUARTER/i:/SEMI/i).test(clean(x?.drawPlan?.label||x?.drawPlan?.kind)));const needed=bronze===4?4:2;if(!stage||!Array.isArray(stage.matches)||stage.matches.length!==needed)throw Error('Required '+(bronze===4?'quarterfinal':'semifinal')+' elimination round is missing.');const losers=stage.matches.map(m=>{if(!isDone(m)||!clean(m.loserCarId))throw Error('Source elimination match unfinished.');const attempts=(m.attempts||[]).filter(a=>a.carId===m.loserCarId);if(attempts.length!==1||!Number.isFinite(attempts[0].time)||attempts[0].time<=0)throw Error('Missing or ambiguous eliminated-car race time.');return{id:m.loserCarId,time:attempts[0].time,track:clean(attempts[0].track||stage.name)};});if(new Set(losers.map(x=>x.id)).size!==needed||losers.some(x=>!x.track)||new Set(losers.map(x=>x.track.toLowerCase())).size!==1)throw Error('Eliminated cars did not use exactly one shared round track. Cannot compare times.');losers.sort((a,b)=>a.time-b.time);if(losers[0].time===losers[1].time)throw Error('Elimination times tied; source tiebreak needed.');const pick=bronze===4?losers[0]:losers[1];return{carId:pick.id,place:bronze+1,proof:(bronze===4?'Fastest quarterfinal loser':'Slower semifinal loser (after bronze 3rd)')+' · '+pick.track+' · '+pick.time.toFixed(3)+'s.'};}
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
 out+='<details class="sc-inbox" '+(d.cups.length?'':'open')+'><summary>🎟️ QUALIFIER INBOX · '+waiting.length+' WAITING</summary><p class="sc-small">Select only a completed competition and confirm where its bronze medals ended. One ticket per source; a car can re-enter a later Cup, but never twice within the same Cup.</p>';
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
 out+='<p class="sc-small">Grand Championship bracket is not active in this build. It will be scheduled when the Cup progression mechanics are approved; no finalist or medal is awarded here.</p></details>';
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
 else if(act==='source'){const source=finishedSources(ctx.space).find(s=>s.sourceId===sourceChoice);if(!source)throw Error('Select a finished competition first.');const c=candidate(source,bronzeChoice),owned=ctx.cars.find(x=>x.id===c.carId);if(!owned)throw Error('Qualified car not found in owned Garage. No ticket added.');const a=addTicket(d,{sourceId:source.sourceId,sourceName:source.sourceName,kind:'finished',place:c.place,proof:c.proof},owned);save(d);notice='Claimed test ticket: '+owned.name+' — '+source.sourceName+'. '+a.formed+' new group(s).';}
 else if(act==='lock'){const ci=+b.dataset.c,k=b.dataset.k,i=+b.dataset.i,name=document.getElementById('sc-route-'+ci+'-'+k+'-'+i)?.value;lockTrack(d,ci,k,i,name);save(d);notice='Shared heat track locked: '+clean(name)+'.';}
 else if(act==='time'){const ci=+b.dataset.c,k=b.dataset.k,i=+b.dataset.i,tid=b.dataset.t;const time=parseMs(document.getElementById('sc-time-'+ci+'-'+k+'-'+i+'-'+tid)?.value);if(time===null)throw Error('Enter a valid digits-only time, e.g. 0342250 = 03:42.250.');enterTime(d,ci,k,i,tid,time);save(d);editingTimes.delete(editKey(ci,k,i,tid));notice='Saved '+fmt(time)+' for '+car(d,tid).name+'.';}
 else if(act==='fill'){demoHeat(d,+b.dataset.c,+b.dataset.i);save(d);notice='Simulated times saved for Group '+String.fromCharCode(65+(+b.dataset.i))+'.';}else return;paint();
 }catch(e){notice='Not saved: '+clean(e.message||e);paint();}}
function mount(){const festival=document.getElementById('festival');if(!festival||festival.classList.contains('hidden')||!festival.children.length||festival.querySelector('#'+LAUNCH_ID))return;const panel=document.createElement('section');panel.id=LAUNCH_ID;panel.className='sc-launch';panel.innerHTML='<details><summary>🎟️ SECOND CHANCE CUPS <small>QA</small></summary><p>Rolling four-car groups, semifinals, final. No official honours yet.</p><button type="button">OPEN SECOND CHANCE TEST</button></details>';
 const jump=festival.querySelector('#otg-longjump-launch-8217');if(jump)jump.insertAdjacentElement('afterend',panel);else festival.appendChild(panel);panel.querySelector('button').addEventListener('click',show);}
let timer=false;function init(){const f=document.getElementById('festival');if(!f)return;new MutationObserver(()=>{if(timer)return;timer=true;setTimeout(()=>{timer=false;mount();},100)}).observe(f,{childList:true,subtree:true});mount();}
window.rhSecondChanceQA8220=window.rhSecondChanceQA8221=window.rhSecondChanceQA8222=window.rhSecondChanceQA8223={fresh,validate,load,save,queue,formGroups,addTicket,rank,heat,lockTrack,enterTime,parseMs,fmt,finishedSources,runQualifier,raceOffQualifier,candidate,demoTickets,demoHeat,ultimateQualifiers,addRemainingDemoGroups,addNextDemoCup,fillNewDemoGroups};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
