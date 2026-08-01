/* RaceHub v5.7.98 — Final Standings rebuild + compact Enter Result layout */
(()=>{
 const VERSION='5.7.98';
 const $=id=>document.getElementById(id);
 const safe=v=>typeof esc==='function'?esc(String(v??'')):String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const fmt=v=>typeof rhFmtTime==='function'?rhFmtTime(Number(v)||0):(()=>{const n=Math.max(0,Number(v)||0),m=Math.floor(n/60),s=Math.floor(n%60),ms=Math.round((n-Math.floor(n))*1000);return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(ms).padStart(3,'0')}`})();
 const carLabel=c=>typeof carName==='function'?carName(c):(c?.name||[c?.make,c?.model,c?.year].filter(Boolean).join(' ')||'Unknown car');
 const getRuns=()=>typeof rhCurrentRuns==='function'?(rhCurrentRuns()||[]):[];
 const getEvents=()=>typeof rhSpace==='function'?((rhSpace()?.customEvents)||[]):[];
 const getCar=id=>typeof carById==='function'?carById(id):(typeof rhSpace==='function'?(rhSpace()?.cars||[]).find(c=>String(c.id)===String(id)):null);
 const runRows=r=>(r?.entries||r?.frozenEntryIds||[]).map(id=>{const results=(r.results||[]).filter(x=>String(x.carId)===String(id));const rounds=(r.rounds||r.frozenRounds||[]).length;return results.length===rounds&&rounds?{id,car:getCar(id),total:results.reduce((a,x)=>a+Number(x.time||0),0)}:null}).filter(Boolean).sort((a,b)=>a.total-b.total);
 const eventRows=e=>typeof rhEventLeaderboard==='function'?rhEventLeaderboard(e).map(x=>({id:x.car?.id,car:x.car,total:Number(x.total||0)})):([]);
 const trophyFor=r=>{
   const type=r?.trophy||r?.type||r?.championshipType||'festival';
   if(type==='make'||type==='manufacturer')return 'assets/final/trophy-manufacturer.png';
   if(type==='era')return 'assets/final/trophy-era.png';
   if(type==='favourite')return 'assets/final/trophy-favourite.png';
   return 'assets/final/trophy-festival.png';
 };
 const titleForRun=r=>typeof rhSetupTypeLabel==='function'?rhSetupTypeLabel(r?.type||r?.championshipType||'festival'):'CHAMPIONSHIP';
 const gap=(value,leader)=>value===leader?'—':`+${fmt(value-leader)}`;
 function board(rows,highlightId){
   const leader=rows[0]?.total||0;
   return `<section class="rh598Board" aria-label="Official final classification">
      <div class="rh598BoardTitle"><span>🏆</span><b>OFFICIAL RESULTS</b></div>
      <div class="rh598Cols"><span>POS</span><span>CAR</span><span>TOTAL TIME</span><span>GAP</span></div>
      <div class="rh598BoardScroll" data-rh-scroll-container>
       ${rows.map((x,i)=>`<div class="rh598Row ${String(x.id)===String(highlightId)?'is-highlighted':''}" data-car-id="${safe(x.id)}"><strong>${String(i+1).padStart(2,'0')}</strong><span title="${safe(carLabel(x.car))}">${safe(carLabel(x.car))}</span><b>${fmt(x.total)}</b><em>${gap(x.total,leader)}</em></div>`).join('')}
      </div>
      <div class="rh598ScrollHint">⌄ &nbsp; SCROLL FOR MORE RESULTS &nbsp; ⌄</div>
    </section>`;
 }
 function leaveFinal(destination){
   document.body.classList.remove('rh598FinalOpen');
   if(destination==='events'){
     if(typeof rhRenderEvents==='function')rhRenderEvents();
     if(typeof show==='function')show('events');
   }else{
     if(typeof rhRenderFestival==='function')rhRenderFestival();
     if(typeof show==='function')show('festival');
   }
   window.scrollTo(0,0);
 }
 window.rh598LeaveFinal=leaveFinal;
 function renderFinal({kind,item,rows}){
   if(!item||!rows.length)return leaveFinal(kind==='event'?'events':'festival');
   const isEvent=kind==='event',hostId=isEvent?'event':'festival',host=$(hostId);
   if(!host)return;
   const latest=(item.results||[]).at(-1)?.carId||rows[0]?.id;
   const winner=rows[0];
   const rounds=(item.rounds||item.frozenRounds||[]).length;
   const trophy=isEvent?'':`<img src="${trophyFor(item)}" alt="">`;
   if(typeof show==='function')show(hostId);
   document.body.classList.add('rh598FinalOpen');
   host.innerHTML=`<div class="rh598FinalScreen">
      <div class="rh598Hero">
       <div class="rh598Header"><button aria-label="Back" onclick="rh598LeaveFinal('${isEvent?'events':'festival'}')">‹</button><div><small>FINAL STANDINGS</small><h1>${safe(item.name||'Final Standings')}</h1></div></div>
       <div class="rh598Meta"><div><small>${isEvent?'EVENT':safe(titleForRun(item))}</small><b>${safe(item.name||'')}</b></div><div><small>ROUNDS</small><b>${rounds} OF ${rounds}</b></div></div>
      </div>
      <main class="rh598Body">
       ${board(rows,latest)}
       <section class="rh598Winner">${trophy||'<div class="rh598EventTrophy">🏆</div>'}<div><small>${isEvent?'EVENT WINNER':'CHAMPIONSHIP WINNER'}</small><b>${safe(carLabel(winner.car))}</b><span>TOTAL TIME</span><strong>${fmt(winner.total)}</strong></div></section>
       <div class="rh598Actions">
        <button class="secondary" onclick="${isEvent?"rhRenderRecords();show('hall')":"rhRecordsMode='hall';rhRenderRecords();show('hall')"}">${isEvent?'VIEW RECORDS':'VIEW HALL OF FAME'}</button>
        <button onclick="rh598LeaveFinal('${isEvent?'events':'festival'}')">CONTINUE ›</button>
       </div>
      </main>
    </div>`;
   requestAnimationFrame(()=>{
     host.querySelector('.rh598FinalScreen')?.classList.add('is-on');
     const row=host.querySelector('.rh598Row.is-highlighted');
     row?.scrollIntoView({block:'center'});
   });
 }
 window.rhShowLockedFinalLeaderboard=id=>{const r=getRuns().find(x=>String(x.id)===String(id));renderFinal({kind:'run',item:r,rows:runRows(r)});};
 window.rhChampionshipCompleteTransition=id=>window.rhShowLockedFinalLeaderboard(id);
 window.rhShowCompletedEventLeaderboard=id=>{const e=getEvents().find(x=>String(x.id)===String(id));renderFinal({kind:'event',item:e,rows:eventRows(e)});};
 window.rhEventCompleteTransition=id=>window.rhShowCompletedEventLeaderboard(id);
 const oldOpenRun=window.rhOpenRun;
 if(oldOpenRun)window.rhOpenRun=function(id){const r=getRuns().find(x=>String(x.id)===String(id));if(r?.status==='complete')return window.rhShowLockedFinalLeaderboard(id);return oldOpenRun(id);};
 const oldOpenEvent=window.rhOpenEvent;
 if(oldOpenEvent)window.rhOpenEvent=function(id){const e=getEvents().find(x=>String(x.id)===String(id));if(e?.status==='complete')return window.rhShowCompletedEventLeaderboard(id);return oldOpenEvent(id);};
 const oldSummary=window.rhResultSummary;
 if(oldSummary)window.rhResultSummary=function(run,res){const out=oldSummary(run,res);if(run?.status==='complete'){const btn=$('festival')?.querySelector('.rhResultContinueFinal');if(btn){btn.onclick=()=>window.rhShowLockedFinalLeaderboard(run.id);btn.removeAttribute('onclick');const b=btn.querySelector('b'),s=btn.querySelector('small');if(b)b.textContent='FINAL STANDINGS';if(s)s.textContent='VIEW OFFICIAL CLASSIFICATION';}}return out;};
 const oldEventSummary=window.rhEventResultSummary;
 if(oldEventSummary)window.rhEventResultSummary=function(e,res){const out=oldEventSummary(e,res);if(e?.status==='complete'){const btn=$('event')?.querySelector('.rhResultContinueFinal');if(btn){btn.onclick=()=>window.rhShowCompletedEventLeaderboard(e.id);btn.removeAttribute('onclick');}}return out;};
 // Version authority
 const oldSettings=window.rhRenderSettings;
 if(oldSettings)window.rhRenderSettings=function(){const out=oldSettings();document.querySelectorAll('#more .rhSettingRow span').forEach(s=>{if(/RaceHub v/i.test(s.textContent||''))s.textContent=`RaceHub v${VERSION} • CHECK NOW ›`;});return out;};
})();
