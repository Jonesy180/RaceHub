// RaceHub v4.3b — Celebrations
function playRecordSound(){
  if(!state.settings || !state.settings.sound) return;
  try{
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.18, now+0.03);
    master.gain.exponentialRampToValueAtTime(0.0001, now+1.15);
    master.connect(ctx.destination);

    function tone(freq, start, dur, type='sine'){
      const o=ctx.createOscillator();
      const g=ctx.createGain();
      o.type=type;
      o.frequency.setValueAtTime(freq, now+start);
      g.gain.setValueAtTime(0.0001, now+start);
      g.gain.exponentialRampToValueAtTime(0.85, now+start+0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, now+start+dur);
      o.connect(g); g.connect(master);
      o.start(now+start); o.stop(now+start+dur+0.04);
    }
    // short achievement fanfare
    tone(392,0.00,0.18,'triangle');
    tone(523.25,0.16,0.18,'triangle');
    tone(659.25,0.32,0.22,'triangle');
    tone(783.99,0.54,0.32,'triangle');
    tone(1046.5,0.78,0.34,'sine');
  }catch(e){}
}
function vibrateRecord(){
  if(state.settings && state.settings.vibrate && navigator.vibrate) navigator.vibrate([80,40,120,40,180]);
}

function launchConfetti(){
  if(state.settings && state.settings.confetti===false) return;
  const overlay=document.getElementById('celebrationOverlay');
  if(!overlay)return;
  const colors=['#ff2bd6','#7b2cff','#34d7ff','#ffd84d','#ff8a00','#ffffff'];
  for(let i=0;i<140;i++){
    const p=document.createElement('div');
    p.className='confettiPiece';
    p.style.left=(Math.random()*100)+'vw';
    p.style.top=(-20-Math.random()*80)+'px';
    p.style.background=colors[Math.floor(Math.random()*colors.length)];
    p.style.animationDelay=(Math.random()*0.5)+'s';
    p.style.animationDuration=(2.0+Math.random()*2.0)+'s';
    p.style.width=(6+Math.random()*8)+'px';
    p.style.height=(10+Math.random()*14)+'px';
    p.style.transform='rotate('+Math.floor(Math.random()*360)+'deg)';
    overlay.appendChild(p);
  }
}

function daysBetween(a,b){
  if(!a||!b)return null;
  const d1=new Date(a), d2=new Date(b);
  if(isNaN(d1)||isNaN(d2))return null;
  return Math.max(0,Math.floor((d2-d1)/86400000));
}
function daysText(days){
  if(days==null)return '';
  if(days===0)return 'Held for today';
  if(days===1)return 'Held for 1 day';
  if(days<365)return `Held for ${days} days`;
  const y=Math.floor(days/365), rem=days%365, m=Math.floor(rem/30);
  return `Held for ${y} year${y>1?'s':''}${m?`, ${m} month${m>1?'s':''}`:''}`;
}
function improvementText(eventId,newValue,oldValue){
  if(oldValue==null||!isFinite(oldValue))return '';
  const diff=isLong(eventId)?newValue-oldValue:oldValue-newValue;
  if(!isFinite(diff))return '';
  if(isLong(eventId))return `${diff.toFixed(2)} ft farther`;
  return `${diff.toFixed(3)} seconds faster`;
}
function latestRecordForEvent(eventId){
  const hist=(state.recordHistory||[]).filter(h=>h.eventId===eventId);
  return hist.length?hist[hist.length-1]:null;
}
function addRecordHistory(eventId,carId,value,previousRecord){
  state.recordHistory=state.recordHistory||[];
  const now=new Date().toISOString();
  const entry={
    id:'rh'+Date.now(),
    eventId,carId,value,date:now,
    previousCarId:previousRecord?previousRecord.carId:null,
    previousValue:previousRecord?previousRecord.value:null,
    previousDate:previousRecord?previousRecord.date:null,
    daysStood:previousRecord?daysBetween(previousRecord.date,now):null,
    improvement:previousRecord?improvementText(eventId,value,previousRecord.value):''
  };
  state.recordHistory.push(entry);
  return entry;
}
function legendaryRecord(){
  const hist=state.recordHistory||[];
  let best=null;
  hist.forEach(h=>{
    const held = h.daysStood!=null ? h.daysStood : daysBetween(h.date,new Date().toISOString());
    if(held!=null && (!best || held>best.held)) best={...h,held};
  });
  return best;
}


function showMiniRecordBanner(data){
  const old=document.getElementById('recordBannerMini');
  if(old)old.remove();
  const parts=['🏆 Record Shattered!'];
  if(data.improvement)parts.push('⚡ '+data.improvement);
  if(data.heldText)parts.push('⏳ '+data.heldText);
  document.body.insertAdjacentHTML('beforeend',`<div id="recordBannerMini" class="recordBannerMini">${esc(parts.join(' • '))}</div>`);
  setTimeout(()=>{
    const b=document.getElementById('recordBannerMini');
    if(b)b.classList.add('fadeOut');
    setTimeout(()=>{const x=document.getElementById('recordBannerMini'); if(x)x.remove();},550);
  },2200);
}
function autoCloseCelebration(data){
  setTimeout(()=>{
    const o=document.getElementById('celebrationOverlay');
    if(o){
      o.classList.add('fadeOut');
      setTimeout(()=>{closeCelebration(); showMiniRecordBanner(data);},600);
    }
  },3000);
}

function showRecordCelebration(data){
  const previous=data.previous ? `<div class="previousRecord"><div class="small">Previous Record</div><b>${esc(data.previousCar)}</b><br>${esc(data.previousValue)}</div>` : `<div class="previousRecord"><div class="small">First record for this event</div></div>`;
  const html=`<div id="celebrationOverlay" class="celebrationOverlay">
    <div class="celebrationCard">
      <div style="font-size:54px">🏆</div>
      <div class="recordTitle">${data.previous?'RECORD SHATTERED!':'NEW EVENT RECORD!'}</div>
      <div class="small">${esc(data.eventName)}</div>
      <div class="recordCar">${esc(data.carName)}</div>
      <div class="recordTime">${esc(data.value)}</div>${data.improvement?`<div class="legacyCard">⚡ ${esc(data.improvement)}</div>`:'' }${data.heldText?`<div class="legacyCard">⏳ ${esc(data.heldText)}</div>`:'' }
      ${previous}
      <div class="grid">
        <button class="btn" onclick="closeCelebration();${data.continueAction}">▶️ ${data.nextEventName?`Start ${esc(data.nextEventName)}`:'Continue'}</button>
        <button class="btn secondary" onclick="closeCelebration();eventTab='leaderboard';renderEvent()">View Leaderboard</button>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend',html);
  playRecordSound();
  vibrateRecord();
  launchConfetti();
  autoCloseCelebration(data);
}
function closeCelebration(){
  const o=document.getElementById('celebrationOverlay');
  if(o)o.remove();
}


function safeShowRecordCelebration(payload){
  try{
    showRecordCelebration(payload);
  }catch(e){
    // fallback if any animation setting fails
    const title = payload.previous ? 'RECORD SHATTERED!' : 'NEW EVENT RECORD!';
    document.body.insertAdjacentHTML('beforeend', `<div id="celebrationOverlay" class="celebrationOverlay"><div class="celebrationCard"><div style="font-size:54px">🏆</div><div class="recordTitle">${title}</div><div class="recordCar">${esc(payload.carName)}</div><div class="recordTime">${esc(payload.value)}</div><button class="btn" onclick="closeCelebration();${payload.continueAction}">Continue</button></div></div>`); playRecordSound(); vibrateRecord(); launchConfetti(); autoCloseCelebration(payload);
  }
}

function saveResult(){
 const ev=eventById(currentEventId), carId=$('carSelect').value, value=parseResult(ev.id,$('resultInput').value);
 if(!carId||!isFinite(value)){toast('Enter a valid result');return;}
 const before=eventStats(ev.id).leader;
 const isRecord=!before || (isLong(ev.id)?value>before.value:value<before.value);
 const r={id:'r'+Date.now(),eventId:ev.id,carId,value,date:new Date().toISOString()};
 state.results.push(r);
 state.lastCarId=carId;
 state.currentCarId=carId;
 if(carIsComplete(carId)) state.currentCarId=null;
 save();
 const car=carById(carId);
 const nextEv=nextEventForCar(carId);
 const runStats=allPendingRuns();
 let actionButtons='';
 if(nextEv){
   actionButtons += `<button class="btn" onclick="directorNextEvent('${carId}','${nextEv.id}')">➡️ Next Event: ${esc(nextEv.name)}</button>`;
 } else {
   actionButtons += `<button class="btn" onclick="showCarComplete('${carId}')">🏁 Finish This Car</button>`;
 }
 actionButtons += `<button class="btn secondary" onclick="eventTab='leaderboard';renderEvent()">View Leaderboard</button>`;
 $('event').innerHTML=`<div class="card"><h2>Result Saved</h2>
 ${isRecord?`<div class="recordBox">🏆 ${before?'RECORD SHATTERED!':'NEW EVENT RECORD!'}<br>${esc(carName(car))}<br><span style="font-size:24px">${esc(fmt(ev.id,value))}</span>${before?`<br><span class="small">Previous: ${esc(fmt(ev.id,before.value))} — ${esc(carName(carById(before.carId)))}</span>`:''}</div>`:`<div class="resultBox">✅ Saved<br><b>${esc(carName(car))}</b><br>${esc(ev.name)} — ${esc(fmt(ev.id,value))}</div>`}
 <div class="resultBox"><b>${nextEv?'Same car continues':'Car complete'}</b><br><span class="small">${nextEv?`Next unfinished event for this car is ${esc(nextEv.name)}.`:'All 7 events complete for this car.'}</span></div>
 <div class="grid">${actionButtons}</div>
 <button class="btn secondary" onclick="openEvent('${ev.id}','waiting')">Back to Waiting</button>
 <p class="small">${runStats.remaining} total event runs remaining.</p></div>`;

 if(isRecord){
   const recordEntry=addRecordHistory(ev.id,carId,value,before);
   save();
   setTimeout(()=>safeShowRecordCelebration({
     eventName: ev.name,
     carName: carName(car),
     value: fmt(ev.id,value),
     previous: !!before,
     previousCar: before ? carName(carById(before.carId)) : '',
     previousValue: before ? fmt(ev.id,before.value) : '',
     improvement: recordEntry.improvement || '',
     heldText: recordEntry.daysStood!=null ? daysText(recordEntry.daysStood) : '',
     continueAction: nextEv ? `directorNextEvent('${carId}','${nextEv.id}')` : `showCarComplete('${carId}')`,
     nextEventName: nextEv ? nextEv.name : ''
   }),250);
 }

}

function editResult(id){const r=state.results.find(x=>x.id===id);if(!r)return;const raw=prompt('Edit result',fmt(r.eventId,r.value));if(raw===null)return;const v=parseResult(r.eventId,raw);if(!isFinite(v)){toast('Invalid result');return;}r.value=v;r.date=new Date().toISOString();save();toast('Result updated');renderEvent();}
function deleteResult(id){const r=state.results.find(x=>x.id===id);if(!r)return;if(!confirm('Delete this result?'))return;state.results=state.results.filter(x=>x.id!==id);save();toast('Deleted');renderEvent();}

