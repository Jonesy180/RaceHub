// RaceHub v5.1.0 — Control Centre
function renderRecordHistory(){
 const hist=state.recordHistory||[];
 let content=`<div class="card"><h2>🏛️ Festival Record History</h2><p class="small">The absolute best results across the whole garage. Championship records are calculated live within each Championship.</p>`;
 state.events.forEach(ev=>{
   let rows=hist.filter(h=>h.eventId===ev.id).slice().reverse();
   const boardRecord=festivalEventStats(ev.id).leader;
   // Fallback: if a current leaderboard record exists but history is empty/missing, show it here.
   if(boardRecord && (!rows.length || rows[0].carId!==boardRecord.carId || Number(rows[0].value)!==Number(boardRecord.value))){
     rows.unshift({
       id:'fallback-'+ev.id,
       eventId:ev.id,
       carId:boardRecord.carId,
       value:boardRecord.value,
       date:boardRecord.date||new Date().toISOString(),
       fallback:true
     });
   }
   const current=rows[0];
   content += `<div class="legacyCard"><h3>🏁 ${esc(ev.name)}</h3>`;
   if(current){
     const stood=daysText(daysBetween(current.date,new Date().toISOString()));
     content += `<div class="legacyStat"><div><div class="legacyBig">${rows.length}</div><div class="small">record entries</div></div><div><div class="legacyBig">${stood.replace('Held for ','')||'today'}</div><div class="small">current record age</div></div></div>`;
   } else {
     content += `<div class="empty">No record yet.</div>`;
   }
   rows.forEach((h,i)=>{
     const car=carById(h.carId), prev=carById(h.previousCarId);
     content += `<div class="timelineItem ${i?'old':''}">
       <b>${i===0?'👑 Current Record':'⭐ Previous Record'}</b><br>
       ${esc(car?carName(car):h.carId)}<br>
       <span class="recordValue">${esc(fmt(h.eventId,h.value))}</span><br>
       <span class="small">${new Date(h.date).toLocaleDateString()}</span>
       ${h.fallback?`<br><span class="small">Current leaderboard record</span>`:''}
       ${h.improvement?`<br><span class="small">⚡ ${esc(h.improvement)}</span>`:''}
       ${h.daysStood!=null?`<br><span class="small">⏳ Previous record ${esc(daysText(h.daysStood).toLowerCase())}</span>`:''}
       ${prev?`<br><span class="small">Beat: ${esc(carName(prev))}</span>`:''}
     </div>`;
   });
   content += `</div>`;
 });
 content += `</div>`;
 $('more').innerHTML=content+`<div class="card"><button class="btn secondary" onclick="renderMore()">Back to More</button></div>`;
}

function renderMore(){
 const s=state.settings||{sound:true,confetti:true,vibrate:true};
 $('more').innerHTML=`<div class="card"><h2>More</h2>
 <button class="btn" onclick="renderRecordHistory()">🏛️ Record History</button>
 <h3>Celebrations</h3>
 <div class="resultBox">
   <label><input type="checkbox" id="setSound" ${s.sound?'checked':''}> 🔊 Celebration sounds</label>
   <label><input type="checkbox" id="setConfetti" ${s.confetti?'checked':''}> 🎉 Confetti</label>
   <label><input type="checkbox" id="setVibrate" ${s.vibrate?'checked':''}> 📳 Vibrate on new record</label>
   <button class="btn" onclick="saveSettings()">Save Settings</button>
   <button class="btn secondary" onclick="testCelebration()">Test Celebration</button>
 </div>
 <h3>Backup</h3>
 <button class="btn secondary" onclick="backup()">Copy Backup</button>
 <label>Restore backup</label><textarea id="restoreBox" rows="7"></textarea>
 <button class="btn" onclick="restore()">Restore</button>
 <button class="btn danger" onclick="clearResults()">Clear All Results</button></div>`;
}
function saveSettings(){
 state.settings={sound:$('setSound').checked,confetti:$('setConfetti').checked,vibrate:$('setVibrate').checked};
 save();
 toast('Settings saved');
}
function testCelebration(){
 saveSettings();
 showRecordCelebration({
   scope:'festival',
   eventName:'Test Event',
   carName:'RaceHub Test Car',
   value:'09:24.766',
   previous:true,
   previousCar:'Previous Record Holder',
   previousValue:'09:25.114',
   continueAction:"closeCelebration()"
 });
}
function backup(){const txt=JSON.stringify(state);navigator.clipboard?.writeText(txt);toast('Backup copied if supported');}
function restore(){try{const raw=JSON.parse($('restoreBox').value);if(!raw.cars||!raw.events)throw Error();state=raw;save();toast('Restored');show('festival')}catch(e){toast('Invalid backup')}}
function clearResults(){if(!confirm('Clear all results? Cars will stay.'))return;state.results=[];state.lastRun=null;save();toast('Results cleared');show('festival')}
