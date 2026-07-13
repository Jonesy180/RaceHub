// RaceHub v4.3b — Race Director
const directorLines=[
  'Good evening, drivers...',
  'The garage has spoken...',
  'A new challenger approaches...',
  'This should be interesting...',
  'Let’s see what this one can do...',
  'RaceHub is taking control...'
];
function directorSpeak(text){
  const el=$('directorLine');
  if(!el)return;
  el.textContent='';
  let i=0;
  const timer=setInterval(()=>{
    el.textContent += text.charAt(i++);
    if(i>=text.length)clearInterval(timer);
  },26);
}
function directorOverlay(html){
  closeDirector();
  document.body.insertAdjacentHTML('beforeend',`<div id="directorOverlay" class="directorOverlay">${html}</div>`);
}
function closeDirector(){
  const o=$('directorOverlay');
  if(o)o.remove();
}
function skipDirectorToRun(eventId,carId){
  closeDirector();
  selectedRun={eventId,carId};
  currentEventId=eventId;
  state.currentEventId=eventId;
  state.currentCarId=carId;
  save();
  eventTab='add';
  show('event');
}
function beginDirectorShow(forceNew=false){
  const c=currentCar();
  if(c && !forceNew){continueCurrentCar();return;}
  if(forceNew){state.currentCarId=null;save();}
  const car=chooseRandomCar();
  if(!car){toast('All cars complete');return;}
  const ev=nextEventForCar(car.id);
  if(!ev){toast('Car already complete');return;}
  state.lastCarId=car.id;
  state.currentCarId=car.id;
  state.currentEventId=ev.id;
  save();
  const line=directorLines[Math.floor(Math.random()*directorLines.length)];
  directorOverlay(`<button class="skipBtn" onclick="skipDirectorToRun('${ev.id}','${car.id}')">Skip</button><div class="directorCard">
    <div style="font-size:54px">🏁</div>
    <div class="directorTitle">RACEHUB</div>
    <div class="directorLine" id="directorLine">Race Director Initialising...</div>
    <div class="checkList">
      ✓ Garage Connected<br>
      ✓ ${state.cars.length} Cars Ready<br>
      ✓ ${state.events.length} Events Loaded<br>
      ✓ Record Database Loaded<br>
      ✓ Race Director Online
    </div>
  </div>`);
  setTimeout(()=>directorSpeak(line),600);
  setTimeout(()=>directorCarSlot(car,ev),2300);
}
function directorCarSlot(car,ev){
  const names=state.cars.slice(0,80).map(carName);
  directorOverlay(`<button class="skipBtn" onclick="skipDirectorToRun('${ev.id}','${car.id}')">Skip</button><div class="directorCard">
    <div class="directorLine">Tonight's randomly selected car is...</div>
    <div class="slotBox"><div class="slotText" id="slotText">Selecting...</div></div>
  </div>`);
  let i=0;
  const slot=$('slotText');
  const spin=setInterval(()=>{
    if(slot)slot.textContent=names[Math.floor(Math.random()*names.length)];
    i++;
    if(i>22){
      clearInterval(spin);
      if(slot)slot.textContent=carName(car);
      if(navigator.vibrate)navigator.vibrate(60);
      setTimeout(()=>directorEventReveal(car,ev),900);
    }
  },80);
}
function directorEventReveal(car,ev){
  directorOverlay(`<button class="skipBtn" onclick="skipDirectorToRun('${ev.id}','${car.id}')">Skip</button><div class="directorCard">
    <div class="directorLine">Your opening challenge is...</div>
    <div class="directorBig">🚗 ${esc(carName(car))}</div>
    <div class="directorTitle">🏁 ${esc(ev.name)}</div>
    <div class="directorActions">
      <button class="btn bigStart" onclick="skipDirectorToRun('${ev.id}','${car.id}')">▶ Start Event</button>
    </div>
  </div>`);
}
function directorNextEvent(carId,eventId){
  const car=carById(carId), ev=eventById(eventId);
  directorOverlay(`<button class="skipBtn" onclick="skipDirectorToRun('${eventId}','${carId}')">Skip</button><div class="directorCard">
    <div style="font-size:44px">✅</div>
    <div class="directorLine">Result accepted.</div>
    <div class="directorLine">Preparing next challenge...</div>
    <div class="directorBig">🚗 ${esc(carName(car))}</div>
    <div class="directorTitle">🏁 ${esc(ev.name)}</div>
    <div class="directorActions"><button class="btn bigStart" onclick="skipDirectorToRun('${eventId}','${carId}')">▶ Start ${esc(ev.name)}</button></div>
  </div>`);
}

function startRaceNight(){
  const c=currentCar();
  if(c){continueCurrentCar();return;}
  startRaceDirector();
}
function carCompletionStats(carId){
  const rows=state.results.filter(r=>r.carId===carId);
  let records=0,bestFinish=null;
  state.events.forEach(ev=>{
    const board=bestRows(ev.id);
    const pos=board.findIndex(r=>r.carId===carId);
    if(pos===0)records++;
    if(pos>=0 && (bestFinish==null || pos<bestFinish.pos)) bestFinish={pos,event:ev.name};
  });
  return {results:rows.length,records,bestFinish};
}
function showCarComplete(carId){
  const car=carById(carId), stats=carCompletionStats(carId);
  const best=stats.bestFinish?`${stats.bestFinish.pos+1}${['st','nd','rd'][stats.bestFinish.pos]||'th'} in ${stats.bestFinish.event}`:'—';
  $('event').innerHTML=`<div class="card"><h2>🏁 Race Night Complete</h2>
    <div class="completedCar"><h3>Car Completed</h3><h2>${esc(carName(car))}</h2><p class="small">All 7 events complete</p></div>
    <div class="grid"><div class="resultBox"><div class="legacyBig">${stats.records}</div><div class="small">event records held</div></div><div class="resultBox"><div class="legacyBig">${best}</div><div class="small">best finish</div></div></div>
    <button class="btn bigStart" onclick="beginDirectorShow(true)">🎲 Pick Next Random Car</button>
    <button class="btn secondary" onclick="show('festival')">Back to Festival</button>
  </div>`;
}

