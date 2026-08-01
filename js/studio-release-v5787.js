/* RaceHub v5.7.87 — locked Official Results timing board implementation */
(()=>{
 const q=id=>document.getElementById(id);
 const safe=v=>esc(String(v??''));
 const fmtTotal=v=>typeof segTime==='function'?segTime(v):rhFmtTime(v);
 const boardFor=r=>(r.entries||[]).map(id=>{const rr=(r.results||[]).filter(x=>x.carId===id);return rr.length===(r.rounds||[]).length?{id,total:rr.reduce((a,b)=>a+Number(b.time||0),0)}:null}).filter(Boolean).sort((a,b)=>a.total-b.total);

 function cleanResultScreen(host){
  if(!host)return;
  host.querySelectorAll('[class*="Wheel"],[class*="wheel"],[class*="Spinner"],[class*="spinner"],.rhPickerQuestionV2,.rhPickerShuffleIconV2,.randomPickerIcon').forEach(el=>el.remove());
  host.querySelectorAll('.rhTimeInputsV5781 input,input[data-rh-result-time]').forEach((el,i)=>{el.setAttribute('autocomplete','off');el.setAttribute('autocorrect','off');el.setAttribute('spellcheck','false');el.removeAttribute('list');el.name=`rh-result-${Date.now()}-${i}`;});
 }

 function finalRows(rows,currentId){
  const leader=rows[0]?.total||0;
  return rows.map((x,i)=>{
   const pos=i+1,gap=pos===1?'—':`+${fmtTotal(Number(x.total)-leader)}`;
   const active=String(x.id)===String(currentId)?' is-current':'';
   return `<div class="rhOfficialRow${active}" style="--rh-row-delay:${i*62}ms"><div class="rhOfficialPos">${String(pos).padStart(2,'0')}</div><div class="rhOfficialCar">${safe(carName(carById(x.id)))}</div><div class="rhOfficialTime">${fmtTotal(x.total)}</div><div class="rhOfficialGap">${gap}</div></div>`;
  }).join('');
 }

 function confettiBurst(){
  const host=q('festival');if(!host||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const layer=document.createElement('div');layer.className='rhLockedConfetti';
  for(let i=0;i<34;i++){const p=document.createElement('i');p.style.setProperty('--x',`${Math.random()*100}%`);p.style.setProperty('--d',`${Math.random()*1.2}s`);p.style.setProperty('--r',`${Math.random()*540-270}deg`);p.style.setProperty('--s',`${5+Math.random()*6}px`);layer.appendChild(p)}
  host.appendChild(layer);setTimeout(()=>layer.remove(),4200);
 }

 window.rhShowLockedFinalLeaderboard=function(runId){
  const r=rhCurrentRuns().find(x=>x.id===runId);if(!r)return;
  const rows=boardFor(r),winner=rows[0];
  const latest=(r.results||[])[(r.results||[]).length-1];
  const currentId=latest?.carId||winner?.id;
  const typeLabel=rhSetupTypeLabel(r.type||r.championshipType||'festival');
  const rounds=(r.rounds||[]).length;
  show('festival');
  q('festival').innerHTML=`<div class="rhLockedFinalScreen rhOfficialFinal">
   <section class="rhLockedFinalHero">
    <div class="rhLockedFinalHead"><button class="rhLockedFinalBack" onclick="rhRenderFestival()" aria-label="Back">‹</button><div><small>FINAL STANDINGS</small><h1>${safe(r.name)}</h1></div><button class="rhOfficialHelp" aria-label="Help">?</button></div>
    <div class="rhLockedFinalMeta"><div><small>CHAMPIONSHIP</small><b>${safe(typeLabel)}</b></div><div><small>ROUNDS</small><b>${rounds} OF ${rounds}</b></div></div>
   </section>
   <main class="rhLockedFinalBody">
    <section class="rhOfficialBoard">
     <div class="rhLockedBoardBoot" aria-hidden="true"><div>████████████</div><div>............</div><div>01&nbsp;&nbsp;02&nbsp;&nbsp;03</div></div>
     <div class="rhOfficialBoardTitle"><span class="rhOfficialCup">♜</span><h2>OFFICIAL RESULTS</h2></div>
     <div class="rhOfficialHeader"><b>POS</b><b>CAR</b><b>TOTAL TIME</b><b>GAP</b></div>
     <div class="rhLockedRows">${finalRows(rows,currentId)}</div>
     <div class="rhOfficialScrollHint">⌄<small>SCROLL FOR MORE RESULTS</small></div>
    </section>
    ${winner?`<section class="rhLockedWinner"><img src="${rhTrophy(r.trophy)}" alt=""><div><small>CHAMPIONSHIP WINNER</small><h2>${safe(carName(carById(winner.id)))}</h2><span>TOTAL TIME</span><strong>${fmtTotal(winner.total)}</strong></div></section>`:''}
    <div class="rhLockedFinalActions"><button class="btn secondary" onclick="rhRecordsMode='hall';rhRenderRecords();show('hall')">♜&nbsp;&nbsp; VIEW HALL OF FAME</button><button class="btn" onclick="rhRenderFestival()">CONTINUE&nbsp;&nbsp; ›</button></div>
   </main>
  </div>`;
  cleanResultScreen(q('festival'));
  requestAnimationFrame(()=>q('festival')?.querySelector('.rhLockedFinalScreen')?.classList.add('is-live'));
  setTimeout(confettiBurst,500);
  try{if(typeof playRecordSound==='function')playRecordSound();if(typeof vibrateRecord==='function')vibrateRecord()}catch(_){ }
 };

 // Completed championships always use the locked final leaderboard.
 const priorOpenRun=window.rhOpenRun;
 window.rhOpenRun=function(id){const r=rhCurrentRuns().find(x=>x.id===id);if(r?.status==='complete')return rhShowLockedFinalLeaderboard(id);return priorOpenRun(id)};
 window.rhChampionshipCompleteTransition=function(id){rhShowLockedFinalLeaderboard(id)};

 // Keep all result screens free of queue-picker / era-wheel remnants.
 const priorEnter=window.rhEnterResult;
 window.rhEnterResult=function(...args){const out=priorEnter(...args);cleanResultScreen(q('festival'));return out};
 const priorSummary=window.rhResultSummary;
 window.rhResultSummary=function(r,res){const out=priorSummary(r,res);cleanResultScreen(q('festival'));if(r?.status==='complete'){const btn=q('festival')?.querySelector('.rhResultContinueFinal');if(btn){btn.onclick=()=>rhShowLockedFinalLeaderboard(r.id);const b=btn.querySelector('b'),s=btn.querySelector('small');if(b)b.textContent='FINAL LEADERBOARD';if(s)s.textContent='VIEW OFFICIAL CLASSIFICATION'}}return out};
 const priorEventResult=window.rhEventResult;
 if(priorEventResult)window.rhEventResult=function(...args){const out=priorEventResult(...args);cleanResultScreen(q('event'));return out};
 const priorEventSummary=window.rhEventResultSummary;
 if(priorEventSummary)window.rhEventResultSummary=function(...args){const out=priorEventSummary(...args);cleanResultScreen(q('event'));return out};
})();
