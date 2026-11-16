/* OTG! MAIN v8.0.318 — connect the existing H Smart Tiles to the original Car History.
 * UI only: no change to entries, results, saves, Evil draw, or racing logic. */
(function(){
'use strict';
function historyButton(carId,active){
  const hasCar=carId!=null && String(carId)!=='';
  const h=document.createElement(hasCar?'button':'span');
  if(hasCar)h.type='button';
  h.className='otg317-mini'+(active?' history-active':'');
  h.textContent='H';
  h.title=hasCar?'Open Car History':'No car selected';
  if(hasCar){
    h.setAttribute('aria-label','Open Car History');
    h.addEventListener('click',event=>{
      event.preventDefault();event.stopPropagation();
      // Use the original in-draw opener, which preserves Back/scroll behaviour.
      const open=typeof window.rhDrawCarHistory8131==='function'
        ?window.rhDrawCarHistory8131:window.rhOpenCarHistoryV7001;
      if(typeof open==='function')open(String(carId));
    });
  }
  return h;
}
function badges(carId,active){
  const group=document.createElement('span');group.className='otg317-badges';
  const e=document.createElement('span');e.className='otg317-mini otg317-evil';
  e.textContent='E✓';e.title='Evil activity indicator (not yet connected on this screen)';
  group.append(historyButton(carId,active),e);
  return group;
}
function currentRun(id){
  return (typeof window.rhCurrentRuns==='function'?window.rhCurrentRuns():[])
    .find(r=>String(r.id)===String(id));
}
function decorateOverview(id){
  const root=document.querySelector('#festival .rhChamp33');
  const run=currentRun(id);
  if(!root||!run)return;
  const history=new Set((run.results||[]).map(x=>String(x.carId)));
  const next=typeof window.rhNextSlot==='function'?window.rhNextSlot(run):null;
  const current=root.querySelector('.rhChamp33CurrentHead > div');
  if(current && next && !current.querySelector('.otg317-badges')){
    current.classList.add('otg317-current-car');
    current.append(badges(next.carId,history.has(String(next.carId))));
  }
  const remaining=typeof window.rhQueueRemaining==='function'?window.rhQueueRemaining(run):[];
  root.querySelectorAll('.rhChamp33NextRows > div').forEach((row,i)=>{
    if(row.querySelector('.otg317-badges'))return;
    row.classList.add('otg317-car-tile');
    const carId=remaining[i];
    row.append(badges(carId,carId!=null && history.has(String(carId))));
  });
}
function decorateStandings(id){
  const root=document.querySelector('#festival .rhStandings33');
  const run=currentRun(id);
  if(!root||!run)return;
  // Mirror the original standings order, not a guess based on displayed car names.
  const rounds=Array.isArray(run.rounds)?run.rounds:[];
  const cars=(Array.isArray(run.entries)?run.entries:[]).map(carId=>{
    const results=(run.results||[]).filter(x=>String(x.carId)===String(carId));
    return rounds.length && results.length===rounds.length
      ?{carId,total:results.reduce((sum,x)=>sum+Number(x.time||0),0)}:null;
  }).filter(Boolean).sort((a,b)=>a.total-b.total);
  root.querySelectorAll('.rhStandings33Rows > div').forEach((row,i)=>{
    if(row.querySelector('.otg317-badges'))return;
    row.classList.add('otg317-standings-row');
    row.append(badges(cars[i]?.carId,true));
  });
}
const originalRun=window.rhOpenRun;
if(typeof originalRun==='function'){
  window.rhOpenRun=function(id){
    const result=originalRun.apply(this,arguments);
    decorateOverview(id);
    return result;
  };
}
const originalStandings=window.rhShowCurrentStandingsV5834;
if(typeof originalStandings==='function'){
  window.rhShowCurrentStandingsV5834=function(id){
    const result=originalStandings.apply(this,arguments);
    decorateStandings(id);
    return result;
  };
}
})();
