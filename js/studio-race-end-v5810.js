/* RaceHub v5.8.10 — authoritative race-end flow (Result Summary + Final Standings). */
(()=>{
  'use strict';
  const VERSION='5.8.17';
  const byId=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt=t=>typeof rhFmtTime==='function'?rhFmtTime(Number(t||0)):String(t??'—');
  const currentSpace=()=>{try{return typeof rhSpace==='function'?rhSpace():null}catch(_){return null}};
  const allCars=()=>currentSpace()?.cars||[];
  const getCar=id=>allCars().find(c=>String(c.id)===String(id))||null;
  const getName=id=>{const c=getCar(id);try{return c&&typeof carName==='function'?carName(c):(c?.name||c?.model||'Unknown car')}catch(_){return c?.name||c?.model||'Unknown car'}};
  const typeLabel=t=>t==='make'?'MANUFACTURER CHAMPIONSHIP':t==='era'?'ERA CHAMPIONSHIP':t==='favourite'?'FAVOURITE MANUFACTURER CHAMPIONSHIP':'FESTIVAL CHAMPIONSHIP';

  function partialRunRows(run){
    return (run.entries||[]).map(id=>{
      const rr=(run.results||[]).filter(x=>String(x.carId)===String(id));
      return rr.length?{id,total:rr.reduce((s,x)=>s+Number(x.time||0),0),count:rr.length}:null;
    }).filter(Boolean).sort((a,b)=>a.total-b.total);
  }
  function finalRunRows(run){
    const rounds=(run.rounds||[]).length;
    return partialRunRows(run).filter(x=>x.count===rounds);
  }
  function eventCars(event){try{return typeof rhEventCars==='function'?(rhEventCars(event)||[]):[]}catch(_){return []}}
  function eventRounds(event){try{return typeof rhEventRounds==='function'?(rhEventRounds(event)||[]):(event.rounds||[])}catch(_){return event.rounds||[]}}
  function partialEventRows(event){
    return eventCars(event).map(c=>{const rr=(event.results||[]).filter(x=>String(x.carId)===String(c.id));return rr.length?{id:c.id,total:rr.reduce((s,x)=>s+Number(x.time||0),0),count:rr.length}:null}).filter(Boolean).sort((a,b)=>a.total-b.total);
  }
  function finalEventRows(event){const n=eventRounds(event).length;return partialEventRows(event).filter(x=>x.count===n)}
  function context(rows,id){
    if(!rows.length)return [];
    let at=rows.findIndex(x=>String(x.id)===String(id)); if(at<0)at=0;
    const start=Math.max(0,Math.min(at-2,Math.max(0,rows.length-5)));
    return rows.slice(start,start+5).map((x,i)=>({...x,pos:start+i+1}));
  }
  function board(rows,id){
    const leader=rows[0]?.total||0;
    return `<section class="rhPodiumClassificationV5804"><div class="rhPodiumClassHeadV5804"><b>CURRENT CLASSIFICATION</b></div><div class="rhPodiumColsV5804"><span>POS</span><span>CAR</span><span>TOTAL TIME</span><span>GAP</span></div><div class="rhPodiumRowsV5804">${context(rows,id).map(x=>`<div class="rhPodiumRowV5804 ${String(x.id)===String(id)?'current':''}"><b>${String(x.pos).padStart(2,'0')}</b><span>${esc(getName(x.id))}</span><strong>${fmt(x.total)}</strong><em>${x.pos===1?'—':'+'+fmt(x.total-leader)}</em></div>`).join('')||'<div class="rhPodiumRowV5804 current"><b>01</b><span>Result recorded</span><strong>—</strong><em>—</em></div>'}</div></section>`;
  }
  function summaryHtml(o){
    return `<div class="rhPodiumSummaryV5804"><section class="rhPodiumHeroV5804"><div class="rhPodiumHeaderV5804"><button aria-label="Back" id="rhSummaryBack">‹</button><div><h1>RESULT SUMMARY</h1><p>${esc(o.roundName)}</p></div></div></section><main class="rhPodiumBodyV5804"><section class="rhPodiumMetaV5804"><small>${esc(o.title)}</small><b>${esc(o.carLine)}</b></section><section class="rhPodiumAcceptedV5804"><span>✓</span><div><small>RESULT ACCEPTED</small><b>CURRENT CLASSIFICATION</b></div></section>${board(o.rows,o.carId)}<button class="rhPodiumContinueV5804" id="rhSummaryContinue"><b>${esc(o.label)}</b><small>${esc(o.sub)}</small></button></main></div>`;
  }
  function mountSummary(hostId,o){
    if(typeof show==='function')show(hostId);
    const host=byId(hostId); if(!host)return;
    host.innerHTML=summaryHtml(o);
    byId('rhSummaryBack')?.addEventListener('click',o.back);
    byId('rhSummaryContinue')?.addEventListener('click',o.next);
    window.scrollTo(0,0);
  }
  function runSummary(run,res){
    const rows=partialRunRows(run);
    const done=run.status==='complete';
    let label='CONTINUE',sub='RETURN TO CHAMPIONSHIP',next=()=>rhOpenRun(run.id);
    if(done){label='FINAL STANDINGS';sub='VIEW OFFICIAL CLASSIFICATION';next=()=>showFinalRun(run.id,res.carId)}
    else {try{const n=rhNextSlot(run),carDone=rhRunCarIsComplete(run,res.carId);if(carDone&&n&&String(n.carId)!==String(res.carId)){label='CAR COMPLETE';sub='VIEW TOTAL & NEXT CAR';next=()=>rhRunCarCompleteTransition(run.id,res.carId)}}catch(_){}}
    mountSummary('festival',{roundName:res.roundName,title:typeLabel(run.type||run.championshipType),carLine:`${getName(res.carId)} • ${fmt(res.time)}`,rows,carId:res.carId,label,sub,back:()=>rhOpenRun(run.id),next});
  }
  function eventSummary(event,res){
    const done=event.status==='complete';
    mountSummary('event',{roundName:res.roundName,title:event.name,carLine:`${getName(res.carId)} • ${fmt(res.time)}`,rows:partialEventRows(event),carId:res.carId,label:done?'FINAL STANDINGS':'CONTINUE EVENT',sub:done?'VIEW OFFICIAL CLASSIFICATION':'RETURN TO EVENT',back:()=>rhOpenEvent(event.id),next:done?()=>showFinalEvent(event.id,res.carId):()=>rhOpenEvent(event.id)});
  }
  function accepted(owner,res,kind='festival'){
    const hostId=kind==='events'?'event':'festival';
    const host=byId(hostId); if(!host)return;
    let text=owner.status==='complete'?(kind==='events'?'EVENT COMPLETE':'CHAMPIONSHIP COMPLETE'):'RESULT RECORDED';
    host.innerHTML=`<div class="rhAccepted ${kind==='events'?'rhAcceptedEvents':'rhAcceptedChamp'} rhAcceptedFinal"><div class="rhAcceptedShadeFinal"></div><div class="rhAcceptedGlass rhAcceptedGlassFinal"><div class="rhAcceptedTick">✓</div><h1>RESULT SAVED</h1><p>${text}</p><small>${esc(res.roundName)} complete</small></div></div>`;
    setTimeout(()=>{try{kind==='events'?eventSummary(owner,res):runSummary(owner,res)}catch(err){console.error('RaceHub result summary failed',err);kind==='events'?rhOpenEvent(owner.id):rhOpenRun(owner.id)}},750);
  }

  function trophy(run){const t=String(run?.trophy||run?.type||'festival').toLowerCase();return t==='make'||t==='manufacturer'?'assets/final/trophy-manufacturer.png':t==='era'?'assets/final/trophy-era.png':t==='favourite'?'assets/final/trophy-favourite.png':'assets/final/trophy-festival.png'}
  function finalHtml(kind,item,rows,currentId){
    const leader=rows[0]?.total||0,winner=rows[0],rounds=kind==='event'?eventRounds(item).length:(item.rounds||[]).length;
    return `<div class="rhFinal5799"><header class="rhFinal5799Head"><div><small>FINAL STANDINGS</small><h1>${esc(item.name)}</h1><p>${kind==='event'?'EVENT':'CHAMPIONSHIP'} • ${rounds} ROUND${rounds===1?'':'S'} COMPLETE</p></div></header><section class="rhFinal5799Board"><div class="rhFinal5799Title"><small>RACEHUB ${kind==='event'?'EVENT':'FESTIVAL'}</small><h2>OFFICIAL RESULTS</h2></div><div class="rhFinal5799Cols"><span>POS</span><span>CAR</span><span>TOTAL TIME</span><span>GAP</span></div><div class="rhFinal5799Scroll" id="rhFinalScroll">${rows.map((x,i)=>`<div class="rhFinal5799Row ${i<3?'podium ':''}${String(x.id)===String(currentId)?'current':''}"><i>${String(i+1).padStart(2,'0')}</i><span>${esc(getName(x.id))}</span><strong>${fmt(x.total)}</strong><em>${i===0?'LEADER':'+'+fmt(x.total-leader)}</em></div>`).join('')}</div></section><section class="rhFinal5799Winner">${kind==='event'?'<div class="rhFinal5799EventTrophy">🏁</div>':`<img src="${trophy(item)}" alt="">`}<div><small>${kind==='event'?'EVENT WINNER':'CHAMPIONSHIP WINNER'}</small><b>${esc(getName(winner?.id))}</b><strong>${winner?fmt(winner.total):'—'}</strong></div></section><div class="rhFinal5799Actions"><button class="secondary" id="rhFinalSecondary">${kind==='event'?'VIEW EVENTS':'VIEW HALL OF FAME'}</button><button class="primary" id="rhFinalBack">${kind==='event'?'BACK TO EVENTS':'BACK TO CHAMPIONSHIPS'}</button></div></div>`;
  }
  function mountFinal(kind,item,rows,currentId){
    const hostId=kind==='event'?'event':'festival'; if(typeof show==='function')show(hostId); const host=byId(hostId);if(!host)return;
    host.innerHTML=finalHtml(kind,item,rows,currentId);
    const back=()=>{if(kind==='event'){rhRenderEvents();show('events')}else{rhRenderFestival();show('festival')}window.scrollTo(0,0)};
    byId('rhFinalBack')?.addEventListener('click',back);
    byId('rhFinalSecondary')?.addEventListener('click',()=>{if(kind==='event')back();else{window.rhRecordsMode='hall';rhRenderRecords();show('hall')}});
    requestAnimationFrame(()=>{const s=byId('rhFinalScroll'),r=s?.querySelector('.current');if(s&&r)s.scrollTop=Math.max(0,r.offsetTop-(s.clientHeight-r.clientHeight)/2)});
  }
  function showFinalRun(id,currentId){const run=(typeof rhCurrentRuns==='function'?rhCurrentRuns():[]).find(x=>String(x.id)===String(id));if(run)mountFinal('championship',run,finalRunRows(run),currentId)}
  function showFinalEvent(id,currentId){const e=currentSpace()?.customEvents?.find(x=>String(x.id)===String(id));if(e)mountFinal('event',e,finalEventRows(e),currentId)}

  window.rhResultAccepted=accepted;
  window.rhResultSummary=runSummary;
  window.rhEventResultSummary=eventSummary;
  window.rhChampionshipCompleteTransition=showFinalRun;
  window.rhEventCompleteTransition=showFinalEvent;
  window.rhShowFinalStandingsV5810=showFinalRun;
  window.rhShowEventFinalStandingsV5810=showFinalEvent;
  window.RACEHUB_VERSION=VERSION;
})();
