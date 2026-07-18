// RaceHub v5.2.6 — Statistics Facelift
function statsBestResults(){
 const rows=[];
 state.events.forEach(ev=>bestRows(ev.id).forEach(result=>rows.push({...result,event:ev})));
 return rows;
}
function statsChampionshipCounts(){
 if(typeof dashboardChampionshipCounts==='function')return dashboardChampionshipCounts();
 const options=generatedChampionshipOptions().filter(option=>option.type!=='open');
 const completed=options.filter(option=>option.cars.length&&option.cars.every(car=>carIsComplete(car.id))).length;
 const startedIds=new Set((state.championships||[]).filter(champ=>champ.type!=='open').map(champ=>champ.id));
 const active=options.filter(option=>startedIds.has(option.id)&&!option.cars.every(car=>carIsComplete(car.id))).length;
 return {completed,active};
}
function statsDuration(seconds){
 const total=Math.max(0,Number(seconds)||0);
 const hours=Math.floor(total/3600),minutes=Math.floor((total%3600)/60),secs=Math.floor(total%60);
 if(hours)return `${hours}h ${minutes}m`;
 if(minutes)return `${minutes}m ${secs}s`;
 return `${secs}s`;
}
function statsManufacturerRows(){
 const groups=new Map();
 state.cars.forEach(car=>{
  const make=String(car.make||'Unknown').trim()||'Unknown';
  if(!groups.has(make))groups.set(make,{make,owned:0,completed:0});
  const row=groups.get(make); row.owned++; if(carIsComplete(car.id))row.completed++;
 });
 return [...groups.values()].map(row=>({...row,pct:row.owned?Math.round(row.completed/row.owned*100):0}))
  .filter(row=>row.completed>0)
  .sort((a,b)=>b.pct-a.pct||b.completed-a.completed||a.owned-b.owned||a.make.localeCompare(b.make));
}
function statsRecentMilestones(){
 const items=[];
 (state.recordHistory||[]).forEach(entry=>{
  const ev=eventById(entry.eventId),car=carById(entry.carId);
  items.push({date:entry.date||'',icon:'🏆',title:`New ${ev?ev.name:'Festival'} record`,detail:`${fmt(entry.eventId,entry.value)} · ${car?carName(car):entry.carId}`});
 });
 state.cars.filter(car=>carIsComplete(car.id)).forEach(car=>{
  const results=state.results.filter(r=>r.carId===car.id&&r.date).sort((a,b)=>new Date(b.date)-new Date(a.date));
  if(results[0])items.push({date:results[0].date,icon:'✅',title:'Car completed',detail:carName(car)});
 });
 return items.sort((a,b)=>new Date(b.date||0)-new Date(a.date||0)).slice(0,3);
}
function renderStats(){
 const owned=state.cars.length;
 const completed=state.cars.filter(car=>carIsComplete(car.id)).length;
 const completionPct=owned?completed/owned*100:0;
 const champs=statsChampionshipCounts();
 const resultRows=statsBestResults();
 const timedRows=resultRows.filter(row=>row.event.type!=='distance');
 const totalRaceTime=timedRows.reduce((sum,row)=>sum+Number(row.value||0),0);
 const avgRaceTime=timedRows.length?totalRaceTime/timedRows.length:0;
 const completedRuns=resultRows.length;
 const records=state.events.map(ev=>({ev,leader:festivalEventStats(ev.id).leader})).filter(row=>row.leader);
 const manufacturers=statsManufacturerRows().slice(0,5);
 const milestones=statsRecentMilestones();

 const recordCards=records.map(({ev,leader})=>{
  const car=leader?carById(leader.carId):null;
  return `<div class="statsHighlight"><div class="statsHighlightIcon">${ev.type==='distance'?'📏':'⚡'}</div><div><span>${esc(ev.name)}</span><b>${leader?esc(fmt(ev.id,leader.value)):'—'}</b><small>${leader&&car?esc(carName(car)):'No record yet'}</small></div></div>`;
 }).join('');

 const manufacturerHtml=manufacturers.length?manufacturers.map((row,index)=>`<div class="statsManufacturer" style="--stats-make:${manufacturerAccent(row.make)}">
   <div class="statsManufacturerRank">${index+1}</div>
   <div class="statsManufacturerLogo"><img src="${manufacturerLogoPath(row.make)}" alt="" aria-hidden="true" onerror="this.remove()"></div>
   <div class="statsManufacturerMain"><div class="statsManufacturerHead"><b>${esc(row.make)}</b><span>${row.completed}/${row.owned}</span></div><div class="statsMiniTrack"><i style="width:${row.pct}%"></i></div><small>${row.pct}% completed</small></div>
  </div>`).join(''):`<div class="empty">Complete a car to unlock manufacturer rankings.</div>`;

 const milestoneHtml=milestones.length?milestones.map(item=>`<div class="statsMilestone"><div class="statsMilestoneIcon">${item.icon}</div><div><b>${esc(item.title)}</b><span>${esc(item.detail)}</span><small>${esc(dashboardRelativeTime(item.date))}</small></div></div>`).join(''):`<div class="empty">Your latest records and completed cars will appear here.</div>`;

 $('more').innerHTML=`<div class="statsPage">
  <section class="statsHero">
   <div class="statsHeading"><div><div class="statsEyebrow">📊 FESTIVAL STATISTICS</div><h2>Your RaceHub Story</h2><p>Progress, performance and recent achievements in one place.</p></div><button class="chip" onclick="renderMore()">Settings</button></div>
   <div class="statsHeadlineGrid">
    <div class="statsHeadline cyan"><span>Cars Owned</span><b>${owned}</b><small>Ready to race</small></div>
    <div class="statsHeadline green"><span>Cars Completed</span><b>${completed}</b><small>${completionPct.toFixed(1)}% complete</small></div>
    <div class="statsHeadline brand"><span>Championships</span><b>${champs.completed}</b><small>${champs.active} currently active</small></div>
    <div class="statsHeadline gold"><span>Festival Records</span><b>${records.length}</b><small>Current records held</small></div>
   </div>
  </section>

  <section class="statsPanel statsProgressPanel">
   <div class="statsSectionTitle"><div><div class="statsEyebrow">GARAGE PROGRESS</div><h3>${completed} of ${owned} cars completed</h3></div><strong>${completionPct.toFixed(1)}%</strong></div>
   <div class="statsProgressTrack"><i style="width:${Math.min(100,completionPct)}%"></i></div>
   <p>${Math.max(0,owned-completed)} cars still waiting for a complete race card.</p>
  </section>

  <section class="statsPanel">
   <div class="statsSectionTitle"><div><div class="statsEyebrow">PERFORMANCE HIGHLIGHTS</div><h3>Festival Records</h3></div><button class="chip" onclick="show('hall')">Hall of Fame</button></div>
   <div class="statsHighlightsGrid">${recordCards||'<div class="empty">Set your first Festival Record to see performance highlights.</div>'}</div>
  </section>

  <section class="statsPanel">
   <div class="statsSectionTitle"><div><div class="statsEyebrow">TOP MANUFACTURERS</div><h3>Collection Leaders</h3></div></div>
   <div class="statsManufacturerList">${manufacturerHtml}</div>
  </section>

  <section class="statsPanel">
   <div class="statsSectionTitle"><div><div class="statsEyebrow">RACING ACTIVITY</div><h3>At a Glance</h3></div></div>
   <div class="statsActivityGrid">
    <div><span>Completed event cards</span><b>${completedRuns}</b></div>
    <div><span>Total best-result time</span><b>${statsDuration(totalRaceTime)}</b></div>
    <div><span>Average timed result</span><b>${timedRows.length?formatChampionshipTime(avgRaceTime):'—'}</b></div>
    <div><span>Record history entries</span><b>${(state.recordHistory||[]).length}</b></div>
   </div>
  </section>

  <section class="statsPanel">
   <div class="statsSectionTitle"><div><div class="statsEyebrow">RECENT MILESTONES</div><h3>Latest Achievements</h3></div></div>
   <div class="statsMilestoneList">${milestoneHtml}</div>
  </section>
 </div>`;
}

function renderRecordHistory(){
 const hist=state.recordHistory||[];
 let content=`<div class="card"><h2>🏛️ Festival Record History</h2><p class="small">The absolute best results across the whole garage. Championship records are calculated live within each Championship.</p>`;
 state.events.forEach(ev=>{
  let rows=hist.filter(h=>h.eventId===ev.id).slice().reverse();
  const boardRecord=festivalEventStats(ev.id).leader;
  if(boardRecord && (!rows.length || rows[0].carId!==boardRecord.carId || Number(rows[0].value)!==Number(boardRecord.value))){rows.unshift({id:'fallback-'+ev.id,eventId:ev.id,carId:boardRecord.carId,value:boardRecord.value,date:boardRecord.date||new Date().toISOString(),fallback:true});}
  const current=rows[0];
  content += `<div class="legacyCard"><h3>🏁 ${esc(ev.name)}</h3>`;
  if(current){const stood=daysText(daysBetween(current.date,new Date().toISOString()));content += `<div class="legacyStat"><div><div class="legacyBig">${rows.length}</div><div class="small">record entries</div></div><div><div class="legacyBig">${stood.replace('Held for ','')||'today'}</div><div class="small">current record age</div></div></div>`;} else content += `<div class="empty">No record yet.</div>`;
  rows.forEach((h,i)=>{const car=carById(h.carId),prev=carById(h.previousCarId);content += `<div class="timelineItem ${i?'old':''}"><b>${i===0?'👑 Current Record':'⭐ Previous Record'}</b><br>${esc(car?carName(car):h.carId)}<br><span class="recordValue">${esc(fmt(h.eventId,h.value))}</span><br><span class="small">${new Date(h.date).toLocaleDateString()}</span>${h.fallback?`<br><span class="small">Current leaderboard record</span>`:''}${h.improvement?`<br><span class="small">⚡ ${esc(h.improvement)}</span>`:''}${h.daysStood!=null?`<br><span class="small">⏳ Previous record ${esc(daysText(h.daysStood).toLowerCase())}</span>`:''}${prev?`<br><span class="small">Beat: ${esc(carName(prev))}</span>`:''}</div>`;});
  content += `</div>`;
 });
 content += `</div>`;
 $('more').innerHTML=content+`<div class="card"><button class="btn secondary" onclick="renderStats()">Back to Statistics</button></div>`;
}
function renderMore(){
 const s=state.settings||{sound:true,confetti:true,vibrate:true};
 $('more').innerHTML=`<div class="card"><div class="grid"><button class="btn secondary" onclick="renderStats()">📊 Back to Statistics</button><button class="btn" onclick="renderRecordHistory()">🏛️ Record History</button></div><h2>Settings</h2><h3>Celebrations</h3><div class="resultBox"><label><input type="checkbox" id="setSound" ${s.sound?'checked':''}> 🔊 Celebration sounds</label><label><input type="checkbox" id="setConfetti" ${s.confetti?'checked':''}> 🎉 Confetti</label><label><input type="checkbox" id="setVibrate" ${s.vibrate?'checked':''}> 📳 Vibrate on new record</label><button class="btn" onclick="saveSettings()">Save Settings</button><button class="btn secondary" onclick="testCelebration()">Test Celebration</button></div><h3>Backup</h3><button class="btn secondary" onclick="backup()">Copy Backup</button><label>Restore backup</label><textarea id="restoreBox" rows="7"></textarea><button class="btn" onclick="restore()">Restore</button><button class="btn danger" onclick="clearResults()">Clear All Results</button><section class="racehubAbout" aria-label="About RaceHub"><img src="assets/brand/racehub-shield.svg" alt="RaceHub RH shield"><div class="racehubAboutName">RaceHub</div><div class="racehubAboutTagline">Track • Record • Improve</div><div class="racehubAboutDivider"></div><div class="racehubAboutLabel">Designed &amp; Developed by</div><div class="racehubAboutCreators">Andy Jones <span>&amp;</span> ChatGPT</div><div class="racehubAboutMeta">© 2026 • Version 5.2.8</div></section></div>`;
}
function saveSettings(){state.settings={sound:$('setSound').checked,confetti:$('setConfetti').checked,vibrate:$('setVibrate').checked};save();toast('Settings saved');}
function testCelebration(){saveSettings();showRecordCelebration({scope:'festival',eventName:'Test Event',carName:'RaceHub Test Car',value:'09:24.766',previous:true,previousCar:'Previous Record Holder',previousValue:'09:25.114',continueAction:"closeCelebration()"});}
function backup(){const txt=JSON.stringify(state);navigator.clipboard?.writeText(txt);toast('Backup copied if supported');}
function restore(){try{const raw=JSON.parse($('restoreBox').value);if(!raw.cars||!raw.events)throw Error();state=raw;save();toast('Restored');show('festival')}catch(e){toast('Invalid backup')}}
function clearResults(){if(!confirm('Clear all results? Cars will stay.'))return;state.results=[];state.lastRun=null;save();toast('Results cleared');show('festival')}
