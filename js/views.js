// RaceHub v4.3b — Views

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
function renderFestival(){
 const totalCars=state.cars.length;
 const completedCars=state.cars.filter(c=>carIsComplete(c.id)).length;
 const remainingCars=Math.max(0,totalCars-completedCars);
 const festivalPct=totalCars?Math.round((completedCars/totalCars)*100):0;

 const ev=eventById(state.currentEventId||'drag');
 const st=eventStats(ev.id);
 const leader=st.leader;
 const next=waitingCars(ev.id)[0];

 const cc=currentCar();
 const ccDone=cc?carCompletedEvents(cc.id).size:0;
 const ccNext=cc?nextEventForCar(cc.id):null;

 const legendaryHtml=(()=>{
  const leg=legendaryRecord();
  if(!leg)return '';
  const legendaryEvent=eventById(leg.eventId);
  const legendaryCar=carById(leg.carId);
  return `<div class="legacyCard">
    <h3>👑 Legendary Record</h3>
    <b>${esc(legendaryEvent.name)}</b><br>
    ${esc(legendaryCar?carName(legendaryCar):leg.carId)}<br>
    <span class="small">${esc(daysText(leg.held))}</span>
  </div>`;
 })();

 const raceNightHtml=cc?`
  <div class="raceNightPanel">
   <h2>▶️ Race Night In Progress</h2>
   <p><b>${esc(carName(cc))}</b></p>
   <div class="progress" style="${progressTrackStyle()}">
    <div class="bar" style="${progressBarStyle(Math.round(ccDone/7*100),'event')}"></div>
   </div>
   <p class="small">${ccDone}/7 events complete · Next: ${ccNext?esc(ccNext.name):'—'}</p>
   <button class="btn bigStart" onclick="continueCurrentCar()">Continue Current Car</button>
   <button class="btn secondary" onclick="beginDirectorShow(true)">🎲 Draw Different Random Car</button>
  </div>
 `:`
  <div class="raceDirector">
   <h2>🏁 Race Night Mode</h2>
   <p class="small">RaceHub chooses a random car, then guides it through all 7 events.</p>
   <button class="btn bigStart" onclick="beginDirectorShow()">🏁 Start Race Night</button>
  </div>
 `;

 $('festival').innerHTML=`
  <div class="card">
   <h2>Festival Control</h2>

   <div class="grid">
    <div class="resultBox">
     <div class="small">Cars completed</div>
     <h2>${completedCars}</h2>
    </div>
    <div class="resultBox">
     <div class="small">Cars remaining</div>
     <h2>${remainingCars}</h2>
    </div>
   </div>

   <h3>Festival Progress</h3>
   <div class="progress" style="${progressTrackStyle()}">
    <div class="bar" style="${progressBarStyle(festivalPct,'festival')}"></div>
   </div>
   <p class="small">${completedCars} / ${totalCars} cars completed · ${festivalPct}%</p>

   <h3>Current Event</h3>
   <div class="eventCard" onclick="openEvent('${ev.id}','waiting')">
    <div class="eventTop">
     <b>🏁 ${esc(ev.name)}</b>
     <span class="badge">${st.done}/${st.total}</span>
    </div>
    <div class="progress" style="${progressTrackStyle()}">
     <div class="bar" style="${progressBarStyle(st.pct,'event')}"></div>
    </div>
    <div class="small">${leader?'Record: '+esc(fmt(ev.id,leader.value))+' — '+esc(carName(carById(leader.carId))):'No record yet'}</div>
    <div class="small">Next waiting: ${next?esc(carName(next)):'—'}</div>
   </div>

   ${legendaryHtml}
   ${raceNightHtml}
  </div>
 `;
}

function renderEvents(){
 $('events').innerHTML=`<div class="card"><h2>Events</h2><p class="small">Open any event to add results, view the leaderboard or see waiting cars.</p>${state.events.map(e=>{let s=eventStats(e.id), leader=s.leader;return `<div class="eventCard" onclick="openEvent('${e.id}','waiting')"><div class="eventTop"><b>🏁 ${esc(e.name)}</b><span class="badge">${s.done}/${s.total}</span></div><div class="progress" style="${progressTrackStyle()}"><div class="bar" style="${progressBarStyle(s.pct,'event')}"></div></div><div class="small">${leader?'Record: '+esc(fmt(e.id,leader.value))+' — '+esc(carName(carById(leader.carId))):'No record yet'}</div></div>`}).join('')}</div>`;
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



