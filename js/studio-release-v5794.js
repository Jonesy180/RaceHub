/* RaceHub v5.7.94 — isolated Final Standings page */
(()=>{
  const VERSION='5.7.94';
  const safe=v=>typeof esc==='function'?esc(String(v??'')):String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt=v=>typeof rhFmtTime==='function'?rhFmtTime(Number(v)||0):String(v||'0:00.000');
  const shortGap=v=>fmt(v).replace(/^00:/,'');
  const runs=()=>typeof rhCurrentRuns==='function'?(rhCurrentRuns()||[]):[];

  function rowsFor(run){
    const roundCount=(run.rounds||[]).length;
    return (run.entries||[]).map(id=>{
      const rs=(run.results||[]).filter(x=>String(x.carId)===String(id));
      return rs.length===roundCount?{id,total:rs.reduce((n,x)=>n+Number(x.time||0),0)}:null;
    }).filter(Boolean).sort((a,b)=>a.total-b.total);
  }

  function closeFinal(){
    document.getElementById('rh593-final-root')?.remove();
    document.body.classList.remove('rh593-final-open');
    document.querySelectorAll('body > [aria-hidden="true"]').forEach(el=>el.removeAttribute('aria-hidden'));
  }
  window.rhCloseFinalStandingsV5793=closeFinal;

  function goFestival(){ closeFinal(); rhRenderFestival?.(); show?.('festival'); window.scrollTo(0,0); }
  function goHall(){ closeFinal(); window.rhRecordsMode='hall'; rhRenderRecords?.(); show?.('hall'); window.scrollTo(0,0); }

  window.rhShowFinalStandingsV5793=function(runId){
    const run=runs().find(x=>String(x.id)===String(runId));
    if(!run)return;
    closeFinal();
    const rows=rowsFor(run), winner=rows[0], leader=winner?.total||0;
    const latest=(run.results||[]).at(-1), currentId=latest?.carId||winner?.id;
    const roundCount=(run.rounds||[]).length;
    const typeLabel=typeof rhSetupTypeLabel==='function'?rhSetupTypeLabel(run.type||run.championshipType||'festival'):'RaceHub Festival';
    const visible=Math.min(Math.max(rows.length,3),8);
    const root=document.createElement('div');
    root.id='rh593-final-root';
    root.innerHTML=`<article class="rh593-final" style="--visible-rows:${visible}">
      <header class="rh593-hero">
        <button class="rh593-circle rh593-back" aria-label="Back"><i></i></button>
        <div class="rh593-title"><small>FINAL STANDINGS</small><h1>${safe(run.name)}</h1></div>
        <button class="rh593-circle rh593-help" aria-label="Help">?</button>
        <section class="rh593-meta"><div><small>CHAMPIONSHIP</small><strong>${safe(typeLabel)}</strong></div><div><small>ROUNDS</small><strong>${roundCount} OF ${roundCount}</strong></div></section>
      </header>
      <main class="rh593-content">
        <section class="rh593-board">
          <div class="rh593-boot" aria-hidden="true"><b>████████████</b><b>............</b><b>01&nbsp;&nbsp;02&nbsp;&nbsp;03</b></div>
          <div class="rh593-board-title"><span>♜</span><h2>OFFICIAL RESULTS</h2></div>
          <div class="rh593-cols"><b>POS</b><b>CAR</b><b>TOTAL TIME</b><b>GAP</b></div>
          <div class="rh593-results">${rows.map((r,i)=>{
            const current=String(r.id)===String(currentId)?' current':'';
            const gap=i===0?'—':`+${shortGap(r.total-leader)}`;
            return `<div class="rh593-row${current}" style="--delay:${i*40}ms"><span class="pos">${String(i+1).padStart(2,'0')}</span><span class="car">${safe(carName(carById(r.id)))}</span><span class="time">${fmt(r.total)}</span><span class="gap">${gap}</span></div>`;
          }).join('')}</div>
          ${rows.length>8?'<div class="rh593-hint"><i></i><small>SCROLL FOR MORE RESULTS</small></div>':''}
        </section>
        ${winner?`<section class="rh593-winner"><div class="rh593-trophy"><img src="${rhTrophy(run.trophy)}" alt="Championship trophy"></div><div><small>CHAMPIONSHIP WINNER</small><h2>${safe(carName(carById(winner.id)))}</h2><span>TOTAL TIME</span><strong>${fmt(winner.total)}</strong></div><div class="rh593-winner-art" aria-hidden="true"></div></section>`:''}
        <div class="rh593-actions"><button class="hall"><span>♜</span> VIEW HALL OF FAME</button><button class="continue">CONTINUE <span>›</span></button></div>
        <nav class="rh593-nav"><button data-go="festival"><span>♜</span><b>FESTIVAL</b></button><button data-go="events"><span>⚑</span><b>EVENTS</b></button><button data-go="garage"><span>▱</span><b>GARAGE</b></button><button data-go="records"><span>▤</span><b>RECORDS</b></button><button data-go="stats"><span>▥</span><b>STATS</b></button></nav>
      </main>
    </article>`;
    document.body.appendChild(root);
    document.body.classList.add('rh593-final-open');
    document.querySelectorAll('body > :not(#rh593-final-root)').forEach(el=>{ if(el.tagName!=='SCRIPT') el.setAttribute('aria-hidden','true'); });
    root.querySelector('.rh593-back').onclick=goFestival;
    root.querySelector('.rh593-actions .continue').onclick=goFestival;
    root.querySelector('.rh593-actions .hall').onclick=goHall;
    root.querySelectorAll('.rh593-nav button').forEach(btn=>btn.onclick=()=>{
      const dest=btn.dataset.go; closeFinal();
      const fn={festival:'rhRenderFestival',events:'rhRenderEvents',garage:'rhRenderGarage',records:'rhRenderRecords',stats:'rhRenderStats'}[dest];
      window[fn]?.(); show?.(dest); window.scrollTo(0,0);
    });
    root.scrollTop=0; window.scrollTo(0,0);
    requestAnimationFrame(()=>root.querySelector('.rh593-final')?.classList.add('live'));
  };

  window.rhShowFinalStandingsV5792=window.rhShowFinalStandingsV5793;
  window.rhShowLockedFinalLeaderboardV5788=window.rhShowFinalStandingsV5793;
  window.rhShowLockedFinalLeaderboard=window.rhShowFinalStandingsV5793;
  window.rhChampionshipCompleteTransition=window.rhShowFinalStandingsV5793;

  const oldOpen=window.rhOpenRun;
  window.rhOpenRun=function(id){const run=runs().find(x=>String(x.id)===String(id));if(run?.status==='complete')return window.rhShowFinalStandingsV5793(id);return oldOpen?.(id)};

  const oldSummary=window.rhResultSummary;
  if(oldSummary)window.rhResultSummary=function(run,result){
    closeFinal();
    const out=oldSummary(run,result);
    if(run?.status==='complete'){
      const btn=document.querySelector('#festival .rhResultContinueFinal');
      if(btn){btn.onclick=()=>window.rhShowFinalStandingsV5793(run.id);btn.querySelector('b')&&(btn.querySelector('b').textContent='FINAL LEADERBOARD');btn.querySelector('small')&&(btn.querySelector('small').textContent='VIEW OFFICIAL CLASSIFICATION');}
    }
    return out;
  };

  const oldSettings=window.rhRenderSettings;
  if(oldSettings)window.rhRenderSettings=function(){const out=oldSettings();document.querySelectorAll('#more .rhSettingRow span').forEach(s=>{if(/RaceHub v/i.test(s.textContent||''))s.textContent=`RaceHub v${VERSION} • CHECK NOW ›`});const st=document.getElementById('rhUpdateStatus');if(st&&!/Checking|Update available|Could not/i.test(st.textContent||''))st.textContent=`Installed version: ${VERSION}`;return out};
})();
