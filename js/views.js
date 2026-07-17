// RaceHub v5.2.4 — Dashboard Facelift Views

function progressBarStyle(percent,type='event'){
  const pct=Math.max(0,Math.min(100,Number(percent)||0));
  if(type==='festival'){
    let colour='#34d7ff';
    let glow='rgba(52,215,255,.55)';
    if(pct>=100){colour='#ffd84d';glow='rgba(255,216,77,.65)';}
    else if(pct>=75){colour='#c45cff';glow='rgba(196,92,255,.58)';}
    else if(pct>=50){colour='#ff9f2f';glow='rgba(255,159,47,.58)';}
    else if(pct>=25){colour='#29ff8a';glow='rgba(41,255,138,.58)';}
    return `width:${pct}%;height:100%;background:${colour};box-shadow:0 0 14px ${glow},0 0 24px ${glow};border-radius:999px;transition:width .35s ease`;
  }
  return `width:${pct}%;height:100%;background:linear-gradient(90deg,#ff2bd6,#7b2cff,#34d7ff);box-shadow:0 0 12px rgba(123,44,255,.7),0 0 20px rgba(52,215,255,.45);border-radius:999px;transition:width .35s ease`;
}

function progressTrackStyle(){
  return 'height:14px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.16);border-radius:999px;overflow:hidden;margin:10px 0';
}

function formatChampionshipTime(totalSeconds){
 const total=Math.max(0,Number(totalSeconds)||0);
 const hours=Math.floor(total/3600);
 const minutes=Math.floor((total%3600)/60);
 const seconds=(total%60).toFixed(3).padStart(6,'0');
 return hours>0
  ?`${hours}:${String(minutes).padStart(2,'0')}:${seconds}`
  :`${String(minutes).padStart(2,'0')}:${seconds}`;
}

function dashboardRelativeTime(date){
 if(!date)return '';
 const when=new Date(date);
 if(Number.isNaN(when.getTime()))return '';
 const diff=Math.max(0,Date.now()-when.getTime());
 const minutes=Math.floor(diff/60000);
 const hours=Math.floor(diff/3600000);
 const days=Math.floor(diff/86400000);
 if(minutes<1)return 'Just now';
 if(minutes<60)return `${minutes} minute${minutes===1?'':'s'} ago`;
 if(hours<24)return `${hours} hour${hours===1?'':'s'} ago`;
 if(days===1)return 'Yesterday';
 if(days<30)return `${days} days ago`;
 try{return when.toLocaleDateString(undefined,{day:'numeric',month:'short',year:when.getFullYear()===new Date().getFullYear()?undefined:'numeric'});}
 catch(e){return when.toLocaleDateString();}
}

function dashboardChampionshipCounts(){
 const options=generatedChampionshipOptions().filter(option=>option.type!=='open');
 const completed=options.filter(option=>option.cars.length&&option.cars.every(car=>carIsComplete(car.id))).length;
 const startedIds=new Set((state.championships||[]).filter(champ=>champ.type!=='open').map(champ=>champ.id));
 const active=options.filter(option=>startedIds.has(option.id)&&!option.cars.every(car=>carIsComplete(car.id))).length;
 return {completed,active};
}

function renderFestival(){
 const active=activeChampionship();
 const activeCars=championshipCars(active);
 const totalCars=activeCars.length;
 const completedCars=activeCars.filter(car=>carIsComplete(car.id)).length;
 const festivalPct=totalCars?Math.round((completedCars/totalCars)*100):0;
 const ownedCars=state.cars.length;
 const allCompleted=state.cars.filter(car=>carIsComplete(car.id)).length;
 const allCompletedPct=ownedCars?((allCompleted/ownedCars)*100).toFixed(1):'0.0';
 const champCounts=dashboardChampionshipCounts();

 const current=currentCar();
 const nextCar=current||unfinishedCars()[0]||null;
 const nextEvent=nextCar?nextEventForCar(nextCar.id):null;
 const nextDone=nextCar?carCompletedEvents(nextCar.id).size:0;

 const latestRecord=(state.recordHistory||[]).slice().sort((a,b)=>new Date(b.date||0)-new Date(a.date||0))[0]||null;
 const latestEvent=latestRecord?eventById(latestRecord.eventId):null;
 const latestCar=latestRecord?carById(latestRecord.carId):null;
 const latestRecordHtml=latestRecord&&latestEvent?`
  <div class="dashboardRecordBody">
   <div class="dashboardRecordEvent">${esc(latestEvent.name)}</div>
   <div class="dashboardRecordValue">${esc(fmt(latestEvent.id,latestRecord.value))}</div>
   <div class="dashboardRecordCar">${esc(latestCar?carName(latestCar):latestRecord.carId)}</div>
   <div class="small dashboardRecordDate">${esc(dashboardRelativeTime(latestRecord.date))}</div>
  </div>`:`<div class="empty dashboardEmpty">Set your first Festival Record to see it here.</div>`;

 const actionLabel=current?'Continue Current Car':'Start Race Night';
 const actionIcon=current?'▶️':'🏁';
 const actionHandler=current?'continueCurrentCar()':'beginDirectorShow()';

 $('festival').innerHTML=`
  <div class="dashboardPage">
   <section class="dashboardHero">
    <div class="dashboardHeroTop">
     <div>
      <div class="dashboardEyebrow">🏁 CURRENT CHAMPIONSHIP</div>
      <h2>${esc(activeChampionshipName())}</h2>
     </div>
     <span class="dashboardPercent">${festivalPct}%</span>
    </div>
    <div class="progress dashboardProgress" style="${progressTrackStyle()}">
     <div class="bar" style="${progressBarStyle(festivalPct,'festival')}"></div>
    </div>
    <div class="dashboardHeroMeta"><b>${completedCars} of ${totalCars}</b> cars completed</div>
    ${nextCar&&nextEvent?`<div class="dashboardHeroNext"><span>Next up</span><b>${esc(carName(nextCar))}</b><small>${esc(nextEvent.name)} · ${nextDone}/${state.events.length} events complete</small></div>`:'<div class="dashboardHeroNext complete"><span>Championship complete</span><b>Every eligible car has finished</b></div>'}
    <button class="btn dashboardPrimary" onclick="${actionHandler}">${actionIcon} ${actionLabel}</button>
    <div class="dashboardHeroLinks"><button class="chip" onclick="showChampionshipHub('${esc(active.id)}')">View Cars</button><button class="chip" onclick="showChampionshipSelector()">Change Championship</button></div>
   </section>

   <section class="dashboardStats">
    <div class="dashboardStat dashboardStatCars">
     <div class="dashboardStatIcon">🚗</div><div class="small">Cars Owned</div><div class="dashboardStatValue">${ownedCars}</div><div class="dashboardStatNote">Ready to race</div>
    </div>
    <div class="dashboardStat dashboardStatComplete">
     <div class="dashboardStatIcon">✅</div><div class="small">Cars Completed</div><div class="dashboardStatValue">${allCompleted}</div><div class="dashboardStatNote">${allCompletedPct}% complete</div>
    </div>
    <div class="dashboardStat dashboardStatChampionships">
     <div class="dashboardStatIcon">🏁</div><div class="small">Championships Completed</div><div class="dashboardStatValue">${champCounts.completed}</div><div class="dashboardStatNote">${champCounts.active} currently active</div>
    </div>
   </section>

   <section class="dashboardRecord">
    <div class="dashboardSectionHeading"><div><div class="dashboardEyebrow">🏆 LATEST FESTIVAL RECORD</div><h3>Most Recent Record Change</h3></div><button class="chip" onclick="show('hall')">Hall of Fame</button></div>
    ${latestRecordHtml}
   </section>

   <section class="dashboardContinue">
    <div class="dashboardSectionHeading"><div><div class="dashboardEyebrow">🎯 CONTINUE RACING</div><h3>${nextCar?'Your next run':'Ready for another race night?'}</h3></div></div>
    ${nextCar&&nextEvent?`<div class="dashboardNextCar"><div><b>${esc(carName(nextCar))}</b><span>${esc(nextEvent.name)}</span></div><span class="badge">${nextDone}/${state.events.length}</span></div>`:'<p class="small">All cars in this Championship are complete. Choose another Championship or enjoy the Hall of Fame.</p>'}
    <button class="btn secondary" onclick="${actionHandler}">${actionIcon} ${actionLabel}</button>
   </section>
  </div>`;
}


function showChampionshipSelector(){
 const old=document.getElementById('championshipSelectorOverlay');
 if(old)old.remove();
 const active=activeChampionship();
 const started=new Map((state.championships||[]).map(c=>[c.id,c]));
 const options=generatedChampionshipOptions();
 const sections=[
  ['Open',options.filter(o=>o.type==='open')],
  ['Era Championships',options.filter(o=>o.type==='era')],
  ['Make Championships',options.filter(o=>o.type==='make')]
 ];
 const body=sections.map(([title,list])=>list.length?`<h3>${esc(title)}</h3>${list.map(option=>{
  const existing=started.get(option.id);
  const selected=active.id===option.id;
  const count=option.cars.length;
  return `<div class="row" style="border-color:${selected?'#ffd84d':'rgba(255,255,255,.12)'}">
   <div class="rank">${selected?'✅':'🏁'}</div>
   <div class="grow"><b>${esc(option.name)}</b><br><span class="small">${count} eligible car${count===1?'':'s'} · updates with garage</span></div>
   <button class="chip" onclick="showChampionshipHub('${esc(option.id)}')">View</button>
   <button class="chip" onclick="startChampionship('${esc(option.id)}')">${selected?'Active':'Select'}</button>
  </div>`;
 }).join('')}`:'').join('');
 const html=`<div id="championshipSelectorOverlay" class="directorOverlay">
  <div class="directorCard" style="max-height:92vh;overflow:auto;text-align:left">
   <button class="btn secondary" style="float:right;min-height:38px;padding:8px 12px" onclick="closeChampionshipSelector()">✕</button>
   <div style="text-align:center"><div style="font-size:54px">🏆</div><div class="directorTitle">Choose Active Festival</div>
   <p class="small">Championships are generated live from your garage. Matching cars added later join automatically. Results are stored once and count in every Championship the car qualifies for.</p></div>
   ${body}
  </div>
 </div>`;
 document.body.insertAdjacentHTML('beforeend',html);
}

function championshipOptionById(optionId){
 return generatedChampionshipOptions().find(o=>o.id===optionId)||null;
}
function filterChampionshipCars(){
 const q=String(($('championshipCarSearch')||{}).value||'').trim().toLowerCase();
 document.querySelectorAll('#championshipEligibleList .championshipCarRow').forEach(row=>{
  row.style.display=!q||String(row.dataset.search||'').includes(q)?'flex':'none';
 });
}
function showChampionshipHub(optionId){
 const option=championshipOptionById(optionId);
 if(!option){toast('Championship unavailable');return;}
 const old=document.getElementById('championshipHubOverlay');
 if(old)old.remove();
 const cars=[...option.cars].sort((a,b)=>{
  const ac=carIsComplete(a.id),bc=carIsComplete(b.id);
  if(ac!==bc)return ac?1:-1;
  return carName(a).localeCompare(carName(b));
 });
 const completed=cars.filter(c=>carIsComplete(c.id)).length;
 const remaining=cars.length-completed;
 const pct=cars.length?Math.round(completed/cars.length*100):0;
 const rows=cars.map(car=>{
  const done=carCompletedEvents(car.id).size;
  const complete=done>=state.events.length;
  return `<div class="row championshipCarRow" data-search="${esc(carName(car).toLowerCase())}" style="border-color:${complete?'rgba(41,255,138,.35)':'rgba(255,255,255,.12)'}">
   <div class="rank">${complete?'✅':'○'}</div>
   <div class="grow"><b>${esc(carName(car))}</b><br><span class="small">${done}/${state.events.length} events complete${complete?' · Finished':''}</span></div>
   ${complete?'':`<button class="chip" onclick="chooseChampionshipCar('${esc(option.id)}','${esc(car.id)}')">Choose</button>`}
  </div>`;
 }).join('');
 const html=`<div id="championshipHubOverlay" class="directorOverlay">
  <div class="directorCard" style="max-height:92vh;overflow:auto;text-align:left">
   <button class="btn secondary" style="float:right;min-height:38px;padding:8px 12px" onclick="closeChampionshipHub()">✕</button>
   <div style="text-align:center"><div style="font-size:54px">🏆</div><div class="directorTitle">${esc(option.name)}</div>
    <p class="small">${cars.length} eligible car${cars.length===1?'':'s'} · ${completed} complete · ${remaining} remaining</p>
   </div>
   <div class="progress" style="${progressTrackStyle()}"><div class="bar" style="${progressBarStyle(pct,'festival')}"></div></div>
   <p class="small" style="text-align:center">Championship progress: ${completed}/${cars.length} · ${pct}%</p>
   <div class="grid">
    <button class="btn bigStart" onclick="randomChampionshipCar('${esc(option.id)}')" ${remaining?'':'disabled'}>🎲 Random Unfinished Car</button>
    <button class="btn secondary" onclick="startChampionship('${esc(option.id)}')">${activeChampionship().id===option.id?'Keep Active':'Make Active'}</button>
   </div>
   <label for="championshipCarSearch">Find an eligible car</label>
   <input id="championshipCarSearch" type="search" placeholder="Search make, model or year" oninput="filterChampionshipCars()">
   <h3>Eligible Cars</h3>
   <div id="championshipEligibleList">${rows||'<div class="empty">No eligible cars.</div>'}</div>
  </div>
 </div>`;
 document.body.insertAdjacentHTML('beforeend',html);
}
function closeChampionshipHub(){const o=document.getElementById('championshipHubOverlay');if(o)o.remove();}

function closeChampionshipSelector(){const o=document.getElementById('championshipSelectorOverlay');if(o)o.remove();}

function championshipGapText(seconds){
 const gap=Math.max(0,Number(seconds)||0);
 if(gap<60)return `+${gap.toFixed(3)}`;
 const mins=Math.floor(gap/60);
 const secs=(gap-mins*60).toFixed(3).padStart(6,'0');
 return `+${String(mins).padStart(2,'0')}:${secs}`;
}

function showChampionship(){
 const rows=championshipRows();

 const old=document.getElementById('championshipOverlay');
 if(old)old.remove();

 if(!rows.length){
  const html=`<div id="championshipOverlay" class="directorOverlay">
   <div class="directorCard" style="max-height:92vh;overflow:auto;text-align:center">
    <button class="btn secondary" style="float:right;min-height:38px;padding:8px 12px" onclick="closeChampionship()">✕</button>
    <div style="font-size:64px">🏆</div>
    <div class="directorTitle">${esc(activeChampionshipName())}</div>
    <div class="legacyCard" style="border-color:#ffd84d;box-shadow:0 0 22px rgba(255,216,77,.16)">
     <h3>No cars have completed the Festival yet.</h3>
     <p class="small">Complete all seven events with your first car to begin the Championship.</p>
    </div>
    <button class="btn bigStart" onclick="closeChampionship()">Back to Festival</button>
   </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend',html);
  return;
 }

 const podiumIcon=position=>position===1?'🥇':position===2?'🥈':position===3?'🥉':position;
 const standings=rows.map(row=>`
  <div class="row">
   <div class="rank">${podiumIcon(row.position)}</div>
   <div class="grow">
    <b>${esc(carName(row.car))}</b><br>
    <span class="small">Total: ${esc(formatChampionshipTime(row.totalTime))}</span><br>
    <span class="small">Long Jump: ${esc(Number(row.longJump).toLocaleString(undefined,{maximumFractionDigits:2}))} ft</span>
   </div>
   <div style="text-align:right;font-weight:900;color:${row.position===1?'#ffd84d':'#ffffff'}">
    ${row.position===1?'LEADER':esc(championshipGapText(row.gap))}
   </div>
  </div>
 `).join('');

 const html=`<div id="championshipOverlay" class="directorOverlay">
  <div class="directorCard" style="max-height:92vh;overflow:auto;text-align:left">
   <button class="btn secondary" style="float:right;min-height:38px;padding:8px 12px" onclick="closeChampionship()">✕</button>
   <div style="text-align:center">
    <div style="font-size:54px">🏆</div>
    <div class="directorTitle">${esc(activeChampionshipName())}</div>
    <div class="small">${rows.length} of ${championshipCarCount()} cars qualified</div>
   </div>
   <div class="legacyCard" style="text-align:center">
    <div class="small">Current Leader</div>
    <div class="recordCar">${esc(carName(rows[0].car))}</div>
    <div class="recordTime">${esc(formatChampionshipTime(rows[0].totalTime))}</div>
   </div>
   <div>${standings}</div>
   <button class="btn bigStart" onclick="closeChampionship()">Back to Festival</button>
  </div>
 </div>`;

 document.body.insertAdjacentHTML('beforeend',html);
}

function closeChampionship(){
 const overlay=document.getElementById('championshipOverlay');
 if(overlay)overlay.remove();
}

function renderEvents(){
 $('events').innerHTML=`<div class="card"><h2>Events</h2><p class="small">Open any event to add results, view the leaderboard or see waiting cars.</p>${state.events.map(e=>{let s=eventStats(e.id), leader=s.leader;return `<div class="eventCard" onclick="openEvent('${e.id}','waiting')"><div class="eventTop"><b>🏁 ${esc(e.name)}</b><span class="badge">${s.done}/${s.total}</span></div><div class="progress" style="${progressTrackStyle()}"><div class="bar" style="${progressBarStyle(s.pct,'event')}"></div></div><div class="small">${leader?esc(activeRecordLabel())+': '+esc(fmt(e.id,leader.value))+' — '+esc(carName(carById(leader.carId))):'No record yet'}</div></div>`}).join('')}</div>`;
}

function podium(rows){return `<div class="podium"><div class="pod">${rows[1]?`🥈<br><b>${esc(carName(carById(rows[1].carId)))}</b><br>${esc(fmt(rows[1].eventId,rows[1].value))}`:''}</div><div class="pod first">${rows[0]?`🥇<br><b>${esc(carName(carById(rows[0].carId)))}</b><br>${esc(fmt(rows[0].eventId,rows[0].value))}`:''}</div><div class="pod">${rows[2]?`🥉<br><b>${esc(carName(carById(rows[2].carId)))}</b><br>${esc(fmt(rows[2].eventId,rows[2].value))}`:''}</div></div>`}

function renderEvent(){
 const ev=eventById(currentEventId), st=eventStats(ev.id);
 const tabs=`<div class="grid"><button class="btn secondary" onclick="eventTab='waiting';renderEvent()">Waiting</button><button class="btn secondary" onclick="eventTab='add';selectedRun=null;renderEvent()">Add Result</button></div><button class="btn secondary" onclick="eventTab='leaderboard';renderEvent()">Leaderboard</button>`;
 let body='';
 if(eventTab==='waiting'){
   const list=waitingCars(ev.id);
   body=`<h3>Waiting Cars</h3><p class="small">${list.length} cars still waiting.</p>${list.slice(0,140).map(c=>`<div class="row"><div class="rank">⏳</div><div class="grow">${esc(carName(c))}</div><button class="chip" onclick="selectedRun={eventId:'${ev.id}',carId:'${c.id}'};eventTab='add';renderEvent()">Run</button></div>`).join('')}${list.length>140?'<p class="small">Showing first 140 waiting cars.</p>':''}`;
 }
 if(eventTab==='leaderboard'){
   const rows=st.rows;
   body=`<h3>Leaderboard</h3>${rows.length?podium(rows):'<div class="empty">No results yet.</div>'}${rows.map((r,i)=>`<div class="row"><div class="rank">${i+1}</div><div class="grow">${esc(carName(carById(r.carId)))}<br><span class="small">${esc(fmt(ev.id,r.value))}</span></div><button class="chip" onclick="editResult('${r.id}')">Edit</button><button class="chip" onclick="deleteResult('${r.id}')">Delete</button></div>`).join('')}`;
 }
 if(eventTab==='add'){
   const chosen=selectedRun&&selectedRun.eventId===ev.id?carById(selectedRun.carId):waitingCars(ev.id)[0];
   body=`<h3>Add Result</h3>${selectedRun?`<div class="resultBox"><b>Selected Car</b><br>${esc(carName(chosen))}</div>`:''}<label>Car</label><select id="carSelect" ${selectedRun?'disabled':''}>${waitingCars(ev.id).map(c=>`<option value="${c.id}" ${chosen&&chosen.id===c.id?'selected':''}>${esc(carName(c))}</option>`).join('')}</select><label>${isLong(ev.id)?'Distance':'Time'}</label><input id="resultInput" inputmode="numeric" pattern="[0-9.]*" placeholder="${isLong(ev.id)?'1448.31':(ev.name==='Drag'?'27494 → 27.494':'924766 → 09:24.766')}"><p class="small">${isLong(ev.id)?'Long Jump: enter distance.':'Numbers only works on Samsung keyboards.'}</p><button class="btn" onclick="saveResult()">Save Result</button>${selectedRun?'<button class="btn secondary" onclick="startRaceDirector()">Skip Car / Pick Another</button>':''}`;
 }
 $('event').innerHTML=`<a class="small" onclick="show('events')">← Events</a><div class="card"><h2>🏁 ${esc(ev.name)}</h2><div class="progress" style="${progressTrackStyle()}"><div class="bar" style="${progressBarStyle(st.pct,'event')}"></div></div><p class="small">${st.done}/${st.total} complete · ${st.waiting} waiting</p>${tabs}${body}</div>`;
}





function hallDateText(date){
 if(!date)return 'Date unavailable';
 const d=new Date(date);
 if(Number.isNaN(d.getTime()))return 'Date unavailable';
 try{return d.toLocaleDateString(undefined,{day:'numeric',month:'long',year:'numeric'});}
 catch(e){return d.toLocaleDateString();}
}
function hallRecordCard(ev,record,scopeLabel){
 if(!record)return `<div class="hallRecordCard emptyRecord"><div class="hallEvent">${esc(ev.name)}</div><div class="small">No ${esc(scopeLabel.toLowerCase())} yet</div></div>`;
 const car=carById(record.carId);
 const held=typeof daysBetween==='function'?daysBetween(record.date,new Date().toISOString()):null;
 const heldText=held==null?'':` · ${typeof daysText==='function'?daysText(held):`${held} day${held===1?'':'s'}`}`;
 return `<div class="hallRecordCard">
  <div class="hallEvent">${esc(ev.name)}</div>
  <div class="hallCar">${esc(car?carName(car):record.carId)}</div>
  <div class="hallValue">${esc(fmt(ev.id,record.value))}</div>
  <div class="small">Held since ${esc(hallDateText(record.date))}${esc(heldText)}</div>
 </div>`;
}
function hallFestivalLeader(eventId){
 if(typeof festivalEventStats==='function')return festivalEventStats(eventId).leader;
 if(typeof bestRows==='function')return bestRows(eventId)[0]||null;
 return null;
}
function hallChampionshipLeader(eventId,champ){
 if(typeof championshipEventStats==='function')return championshipEventStats(eventId,champ).leader;
 if(typeof eventStats==='function')return eventStats(eventId).leader;
 return null;
}
let hallOpenChampionshipId=null;
let hallOpenGroups={era:true,make:true};

function toggleHallGroup(type){
 hallOpenGroups[type]=!hallOpenGroups[type];
 renderHallOfFame();
}
function toggleHallChampionship(optionId){
 hallOpenChampionshipId=hallOpenChampionshipId===optionId?null:optionId;
 renderHallOfFame();
 requestAnimationFrame(()=>{
  const row=document.getElementById(`hallChampionship-${optionId}`);
  if(row)row.scrollIntoView({block:'nearest',behavior:'smooth'});
 });
}
function hallChampionshipBrowserSection(title,type,icon,options,activeId){
 const open=hallOpenGroups[type]!==false;
 const rows=options.map(option=>{
  const expanded=hallOpenChampionshipId===option.id;
  const active=activeId===option.id;
  const records=expanded
   ?`<div class="hallChampionshipRecords"><div class="hallGrid">${state.events.map(ev=>hallRecordCard(ev,hallChampionshipLeader(ev.id,option),'Championship Record')).join('')}</div></div>`
   :'';
  return `<div id="hallChampionship-${esc(option.id)}" class="hallChampionshipItem ${expanded?'expanded':''} ${active?'activeChampionship':''}">
   <button class="hallChampionshipButton" type="button" onclick="toggleHallChampionship('${esc(option.id)}')" aria-expanded="${expanded?'true':'false'}">
    <span class="hallChampionshipChevron">${expanded?'▾':'▸'}</span>
    <span class="hallChampionshipName">${esc(option.name)}</span>
    <span class="hallChampionshipMeta">${option.cars.length} car${option.cars.length===1?'':'s'}</span>
    ${active?'<span class="hallActiveBadge">ACTIVE</span>':''}
   </button>
   ${records}
  </div>`;
 }).join('');
 return `<div class="card hallBrowserGroup hallBrowserGroup-${type}">
  <button class="hallGroupHeader" type="button" onclick="toggleHallGroup('${type}')" aria-expanded="${open?'true':'false'}">
   <span><b>${icon} ${esc(title)}</b><small>${options.length} available</small></span>
   <span class="hallGroupChevron">${open?'▾':'▸'}</span>
  </button>
  ${open?`<div class="hallChampionshipList">${rows||'<div class="empty">No Championships available yet.</div>'}</div>`:''}
 </div>`;
}
function renderHallOfFame(){
 try{
  const active=typeof activeChampionship==='function'?activeChampionship():null;
  const activeId=active&&active.id;
  const events=Array.isArray(state&&state.events)?state.events:[];
  const festivalCards=events.map(ev=>hallRecordCard(ev,hallFestivalLeader(ev.id),'Festival Record')).join('');
  const options=typeof generatedChampionshipOptions==='function'?generatedChampionshipOptions():[];
  const eras=options.filter(option=>option.type==='era').sort((a,b)=>Number(a.value)-Number(b.value));
  const makes=options.filter(option=>option.type==='make').sort((a,b)=>b.cars.length-a.cars.length||a.name.localeCompare(b.name));
  if(hallOpenChampionshipId===null&&active&&active.type!=='open'&&options.some(option=>option.id===active.id))hallOpenChampionshipId=active.id;
  $('hall').innerHTML=`<div class="card hallHero">
    <div class="hallTrophy">🏆</div><h2>Hall of Fame</h2>
    <p class="small">Browse every RaceHub record without changing your active Championship.</p>
   </div>
   <div class="card hallFestivalSection"><h2>👑 Festival Records</h2><p class="small">The absolute best result ever recorded in every event.</p><div class="hallGrid">${festivalCards||'<div class="empty">No events available.</div>'}</div></div>
   ${hallChampionshipBrowserSection('Era Championships','era','🗓️',eras,activeId)}
   ${hallChampionshipBrowserSection('Manufacturer Championships','make','🏭',makes,activeId)}`;
 }catch(error){
  console.error('Hall of Fame render failed',error);
  $('hall').innerHTML=`<div class="card"><h2>🏆 Hall of Fame</h2><div class="empty">The Hall of Fame could not load. Close RaceHub and reopen it to finish the update.</div></div>`;
 }
}
