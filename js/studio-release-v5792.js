/* RaceHub v5.7.92 — complete Final Standings page rebuild */
(()=>{
  const VERSION='5.7.92';
  const $=id=>document.getElementById(id);
  const safe=v=>typeof esc==='function'?esc(String(v??'')):String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const formatTime=v=>typeof rhFmtTime==='function'?rhFmtTime(Number(v)||0):String(v||'0:00.000');
  const shortGap=v=>formatTime(v).replace(/^00:/,'');
  const runs=()=>typeof rhCurrentRuns==='function'?(rhCurrentRuns()||[]):[];

  function standings(run){
    const rounds=(run.rounds||[]).length;
    return (run.entries||[]).map(id=>{
      const results=(run.results||[]).filter(x=>String(x.carId)===String(id));
      return results.length===rounds?{id,total:results.reduce((n,x)=>n+Number(x.time||0),0)}:null;
    }).filter(Boolean).sort((a,b)=>a.total-b.total);
  }

  function rowMarkup(row,index,leader,currentId){
    const gap=index===0?'—':`+${shortGap(row.total-leader)}`;
    const current=String(row.id)===String(currentId)?' is-current':'';
    return `<div class="rh592-row${current}" style="--delay:${index*42}ms">
      <span class="rh592-pos">${String(index+1).padStart(2,'0')}</span>
      <span class="rh592-car">${safe(carName(carById(row.id)))}</span>
      <span class="rh592-time">${formatTime(row.total)}</span>
      <span class="rh592-gap">${gap}</span>
    </div>`;
  }

  function resetViewport(host){
    try{window.scrollTo({top:0,left:0,behavior:'instant'})}catch(_){window.scrollTo(0,0)}
    document.documentElement.scrollTop=0; document.body.scrollTop=0;
    if(host){host.scrollTop=0; try{host.scrollTo(0,0)}catch(_){}}
  }

  function navMarkup(){
    return `<nav class="rh592-nav" aria-label="Primary navigation">
      <button onclick="rhRenderFestival();show('festival')"><span>♜</span><b>FESTIVAL</b></button>
      <button onclick="rhRenderEvents();show('events')"><span>⚑</span><b>EVENTS</b></button>
      <button onclick="rhRenderGarage();show('garage')"><span>▱</span><b>GARAGE</b></button>
      <button onclick="rhRenderRecords();show('records')"><span>▤</span><b>RECORDS</b></button>
      <button class="is-active" onclick="rhRenderStats();show('stats')"><span>▥</span><b>STATS</b></button>
    </nav>`;
  }

  window.rhShowFinalStandingsV5792=function(runId){
    const run=runs().find(x=>String(x.id)===String(runId));
    if(!run)return;
    const rows=standings(run);
    const winner=rows[0];
    const leader=winner?.total||0;
    const latest=(run.results||[]).at(-1);
    const currentId=latest?.carId||winner?.id;
    const rounds=(run.rounds||[]).length;
    const typeLabel=typeof rhSetupTypeLabel==='function'?rhSetupTypeLabel(run.type||run.championshipType||'festival'):'RaceHub Festival';
    show('festival');
    const host=$('festival');
    if(!host)return;
    host.className='screen active rh592-host';
    host.innerHTML=`<article class="rh592-final">
      <header class="rh592-header">
        <button class="rh592-circle rh592-back" onclick="rhRenderFestival()" aria-label="Back"><i></i></button>
        <div class="rh592-heading"><small>FINAL STANDINGS</small><h1>${safe(run.name)}</h1></div>
        <button class="rh592-circle rh592-help" aria-label="Help">?</button>
        <section class="rh592-meta">
          <div><small>CHAMPIONSHIP</small><strong>${safe(typeLabel)}</strong></div>
          <div><small>ROUNDS</small><strong>${rounds} OF ${rounds}</strong></div>
        </section>
      </header>

      <main class="rh592-main">
        <section class="rh592-board">
          <div class="rh592-boot" aria-hidden="true"><b>████████████</b><b>............</b><b>01&nbsp;&nbsp;02&nbsp;&nbsp;03</b></div>
          <div class="rh592-board-title"><span>♜</span><h2>OFFICIAL RESULTS</h2></div>
          <div class="rh592-columns"><b>POS</b><b>CAR</b><b>TOTAL TIME</b><b>GAP</b></div>
          <div class="rh592-scrollbox">${rows.map((r,i)=>rowMarkup(r,i,leader,currentId)).join('')}</div>
          <div class="rh592-scrollhint"><i></i><small>SCROLL FOR MORE RESULTS</small></div>
        </section>

        ${winner?`<section class="rh592-winner">
          <div class="rh592-trophy"><img src="${rhTrophy(run.trophy)}" alt="Championship trophy"></div>
          <div class="rh592-winner-copy"><small>CHAMPIONSHIP WINNER</small><h2>${safe(carName(carById(winner.id)))}</h2><span>TOTAL TIME</span><strong>${formatTime(winner.total)}</strong></div>
          <div class="rh592-car-art" aria-hidden="true"></div>
        </section>`:''}

        <div class="rh592-actions">
          <button class="secondary" onclick="rhRecordsMode='hall';rhRenderRecords();show('hall')"><span>♜</span> VIEW HALL OF FAME</button>
          <button class="primary" onclick="rhRenderFestival()">CONTINUE <span>›</span></button>
        </div>
        ${navMarkup()}
      </main>
    </article>`;
    document.body.classList.add('rh592-final-open');
    resetViewport(host);
    requestAnimationFrame(()=>{
      resetViewport(host);
      host.querySelector('.rh592-final')?.classList.add('is-live');
    });
  };

  // Final override after all legacy release layers.
  window.rhShowLockedFinalLeaderboardV5788=window.rhShowFinalStandingsV5792;
  window.rhShowLockedFinalLeaderboard=window.rhShowFinalStandingsV5792;
  window.rhChampionshipCompleteTransition=window.rhShowFinalStandingsV5792;

  const previousOpen=window.rhOpenRun;
  window.rhOpenRun=function(id){
    const run=runs().find(x=>String(x.id)===String(id));
    if(run?.status==='complete')return window.rhShowFinalStandingsV5792(id);
    return previousOpen?.(id);
  };

  // Replace the final-summary button action regardless of which older renderer created it.
  const previousSummary=window.rhResultSummary;
  if(previousSummary)window.rhResultSummary=function(run,result){
    const out=previousSummary(run,result);
    if(run?.status==='complete'){
      const host=$('festival');
      const btn=host?.querySelector('.rhResultContinueFinal');
      if(btn){
        btn.onclick=()=>window.rhShowFinalStandingsV5792(run.id);
        const b=btn.querySelector('b'),s=btn.querySelector('small');
        if(b)b.textContent='FINAL LEADERBOARD';
        if(s)s.textContent='VIEW OFFICIAL CLASSIFICATION';
      }
    }
    return out;
  };

  const oldSettings=window.rhRenderSettings;
  if(oldSettings)window.rhRenderSettings=function(){
    const out=oldSettings();
    document.querySelectorAll('#more .rhSettingRow span').forEach(span=>{
      if(/RaceHub v/i.test(span.textContent||''))span.textContent=`RaceHub v${VERSION} • CHECK NOW ›`;
    });
    const status=$('rhUpdateStatus');
    if(status&&!/Checking|Update available|Could not/i.test(status.textContent||''))status.textContent=`Installed version: ${VERSION}`;
    return out;
  };
})();
