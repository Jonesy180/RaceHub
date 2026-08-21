/* OTG! v6.0.125 — authoritative race-end flow + locked no-Hubs record celebration. */
(()=>{
  'use strict';
  const VERSION='6.0.125';
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
  function eventCars(event){try{return typeof rhEventCars==='function'?(rhEventCars(event)||[]):[]}catch(_){return []}}
  function partialEventRows(event){
    return eventCars(event).map(c=>{const rr=(event.results||[]).filter(x=>String(x.carId)===String(c.id));return rr.length?{id:c.id,total:rr.reduce((s,x)=>s+Number(x.time||0),0),count:rr.length}:null}).filter(Boolean).sort((a,b)=>a.total-b.total);
  }
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

  function runningAverage(owner,res){
    const prior=(owner?.results||[]).filter(x=>String(x.id)!==String(res?.id)&&Number.isFinite(Number(x.time))&&Number(x.time)>0);
    if(!prior.length)return null;
    const avg=prior.reduce((sum,x)=>sum+Number(x.time),0)/prior.length;
    return {avg,diff:Number(res.time)-avg,count:prior.length};
  }
  function averageTile(hist){
    if(!hist)return `<section class="rhPodiumAverageV5837 neutral"><div><small>CHAMPIONSHIP AVERAGE</small><b>—</b><span>No prior results</span></div><div><small>YOUR DIFFERENCE</small><b>—</b><span>First recorded result</span></div></section>`;
    const faster=hist.diff<0,slower=hist.diff>0,state=faster?'good':slower?'bad':'neutral';
    const sign=faster?'−':slower?'+':'±';
    const label=faster?'Faster than Avg':slower?'Slower than Avg':'Equal to Avg';
    return `<section class="rhPodiumAverageV5837 ${state}"><div><small>CHAMPIONSHIP AVERAGE</small><b>${fmt(hist.avg)}</b><span>Before this result • ${hist.count} result${hist.count===1?'':'s'}</span></div><div><small>YOUR DIFFERENCE</small><b>${sign}${fmt(Math.abs(hist.diff))}</b><span>${label}</span></div></section>`;
  }
  function summaryHtml(o){
    return `<div class="rhPodiumSummaryV5804"><section class="rhPodiumHeroV5804"><div class="rhPodiumHeaderV5804"><button aria-label="Back" id="rhSummaryBack">‹</button><div><h1>RESULT SUMMARY</h1><p>${esc(o.roundName)}</p></div></div></section><main class="rhPodiumBodyV5804">${averageTile(o.average)}${board(o.rows,o.carId)}<button class="rhPodiumContinueV5804" id="rhSummaryContinue"><b>${esc(o.label)}</b><small>${esc(o.sub)}</small></button></main></div>`;
  }
  function mountSummary(hostId,o){
    if(typeof show==='function')show(hostId);
    const host=byId(hostId); if(!host)return;
    host.innerHTML=summaryHtml(o);
    byId('rhSummaryBack')?.addEventListener('click',o.back);
    byId('rhSummaryContinue')?.addEventListener('click',o.next);
    window.scrollTo(0,0);
  }

  function previousBest(owner,res,kind,scope){
    let pool=[];
    if(kind==='event'){
      if(scope==='local') pool=(owner.results||[]);
      else pool=(currentSpace()?.customEvents||[]).flatMap(x=>x.results||[]);
    }else{
      if(scope==='local') pool=(owner.results||[]);
      else pool=(typeof rhCurrentRuns==='function'?rhCurrentRuns():[]).flatMap(x=>x.results||[]);
    }
    const prior=pool.filter(x=>String(x.id)!==String(res.id) && String(x.roundName)===String(res.roundName) && Number(x.time||0)>0);
    if(!prior.length)return null;
    return Math.min(...prior.map(x=>Number(x.time||0)));
  }
  const SEG6125={0:'abcdef',1:'bc',2:'abdeg',3:'abcdg',4:'bcfg',5:'acdfg',6:'acdefg',7:'abc',8:'abcdefg',9:'abcdfg'};
  function segDigit6125(ch){return `<i class="rhSegDigit">${'abcdefg'.split('').map(x=>`<span class="s${x} ${(SEG6125[ch]||'').includes(x)?'on':''}"></span>`).join('')}</i>`;}
  function digitalTime6125(value){
    const text=fmt(value),m=text.match(/(\d{1,2}):(\d{2})\.(\d{3})/);
    if(!m)return `<strong class="rhRecordDigitalFallbackV6125">${esc(text)}</strong>`;
    const group=v=>String(v).split('').map(segDigit6125).join('');
    return `<div class="rhRecordDigitalV6125" aria-label="${esc(text)}"><span>${group(m[1].padStart(2,'0'))}</span><b>:</b><span>${group(m[2])}</span><b>.</b><span class="ms">${group(m[3])}</span></div>`;
  }
  function recordMedals6125(res,kind){
    const localLabel=kind==='event'?'EVENT RECORD':'CHAMPIONSHIP RECORD';
    return `<div class="rhRecordMedalsV6125">${res.championshipRecord?`<article class="silver"><span>★</span><b>${localLabel}</b></article>`:'<i></i>'}${res.allTime?`<article class="gold"><span>★</span><b>ALL-TIME OTG!<br>RECORD</b></article>`:'<i></i>'}</div>`;
  }
  function showHubs(kind,owner,res,viewStandings,continueAction){
    const hostId=kind==='event'?'event':'festival';
    if(typeof show==='function')show(hostId);
    const host=byId(hostId); if(!host)return;
    const localPrev=previousBest(owner,res,kind,'local');
    const allPrev=previousBest(owner,res,kind,'all');
    const previous=res.allTime?allPrev:localPrev;
    const improvement=previous!=null?Math.max(0,previous-Number(res.time||0)):null;
    const localLabel=kind==='event'?'EVENT RECORD':'CHAMPIONSHIP RECORD';
    const headline=res.championshipRecord?localLabel:'ALL-TIME OTG! RECORD';
    host.innerHTML=`<div class="rhRecordPageV6125">
      <button class="rhRecordBackV6125" id="rhHubs29Back">BACK</button>
      <main class="rhRecordMainV6125">
        <header><small>${res.championshipRecord?`NEW ${localLabel}!`:'NEW ALL-TIME RECORD!'}</small><h1>${headline}</h1></header>
        <section class="rhRecordHeroV6125">${recordMedals6125(res,kind)}<img src="assets/final/record-celebration-car-podium-v6125.png?v=6125" alt="Neutral OTG! record celebration car on winner podium"></section>
        <section class="rhRecordBestV6125"><small>YOUR NEW BEST TIME</small>${digitalTime6125(res.time)}</section>
        ${previous!=null?`<section class="rhRecordStatV6125 previous"><span class="icon">◷</span><div><small>PREVIOUS BEST</small><b>${fmt(previous)}</b></div></section><section class="rhRecordStatV6125 improvement"><span class="icon">↗</span><div><small>IMPROVEMENT</small><b>−${fmt(improvement)}</b></div></section>`:''}
      </main>
      <footer class="rhRecordActionsV6125"><button id="rhHubs29Standings"><span>🏆</span><b>VIEW CURRENT STANDINGS</b></button><button id="rhHubs29Continue"><span>🏁</span><b>${owner.status==='complete'?'FINAL STANDINGS':kind==='event'?'CONTINUE EVENT':'CONTINUE CHAMPIONSHIP'}</b></button></footer>
    </div>`;
    byId('rhHubs29Back')?.addEventListener('click',viewStandings);
    byId('rhHubs29Standings')?.addEventListener('click',viewStandings);
    byId('rhHubs29Continue')?.addEventListener('click',continueAction);
    window.scrollTo(0,0);
  }

  function runSummary(run,res){
    const rows=partialRunRows(run);
    const done=run.status==='complete';
    let label='CONTINUE',sub='RETURN TO CHAMPIONSHIP',directNext=()=>rhOpenRun(run.id);
    if(done){label='FINAL STANDINGS';sub='VIEW OFFICIAL CLASSIFICATION';directNext=()=>window.rhChampionshipCompleteTransition?.(run.id,res.carId)}
    else {try{const n=rhNextSlot(run),carDone=rhRunCarIsComplete(run,res.carId);if(carDone&&n&&String(n.carId)!==String(res.carId)){label='CAR COMPLETE';sub='VIEW TOTAL & NEXT CAR';directNext=()=>rhRunCarCompleteTransition(run.id,res.carId)}}catch(_){}}
    const viewStandings=()=>rhOpenRun(run.id);
    const next=(res.championshipRecord||res.allTime)?()=>showHubs('championship',run,res,viewStandings,directNext):directNext;
    mountSummary('festival',{roundName:res.roundName,title:typeLabel(run.type||run.championshipType),carLine:`${getName(res.carId)} • ${fmt(res.time)}`,rows,carId:res.carId,average:runningAverage(run,res),label,sub,back:viewStandings,next});
  }
  function eventSummary(event,res){
    const done=event.status==='complete';
    const viewStandings=()=>rhOpenEvent(event.id);
    const directNext=done?()=>window.rhEventCompleteTransition?.(event.id,res.carId):viewStandings;
    const next=(res.championshipRecord||res.allTime)?()=>showHubs('event',event,res,viewStandings,directNext):directNext;
    mountSummary('event',{roundName:res.roundName,title:event.name,carLine:`${getName(res.carId)} • ${fmt(res.time)}`,rows:partialEventRows(event),carId:res.carId,average:runningAverage(event,res),label:done?'FINAL STANDINGS':'CONTINUE EVENT',sub:done?'VIEW OFFICIAL CLASSIFICATION':'RETURN TO EVENT',back:viewStandings,next});
  }
  function accepted(owner,res,kind='festival'){
    const hostId=kind==='events'?'event':'festival';
    const host=byId(hostId); if(!host)return;
    const text=owner.status==='complete'?(kind==='events'?'EVENT COMPLETE':'CHAMPIONSHIP COMPLETE'):'RESULT RECORDED';
    host.innerHTML=`<div class="rhAccepted ${kind==='events'?'rhAcceptedEvents':'rhAcceptedChamp'} rhAcceptedFinal"><div class="rhAcceptedShadeFinal"></div><div class="rhAcceptedGlass rhAcceptedGlassFinal"><div class="rhAcceptedTick">✓</div><h1>RESULT SAVED</h1><p>${text}</p><small>${esc(res.roundName)} complete</small></div></div>`;
    setTimeout(()=>{try{kind==='events'?eventSummary(owner,res):runSummary(owner,res)}catch(err){console.error('OTG! result summary failed',err);kind==='events'?rhOpenEvent(owner.id):rhOpenRun(owner.id)}},750);
  }

  window.rhResultAccepted=accepted;
  window.rhResultSummary=runSummary;
  window.rhEventResultSummary=eventSummary;
  window.RACEHUB_VERSION=VERSION;
})();
