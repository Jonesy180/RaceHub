/* OTG! MAIN v8.0.317 — shared racing overview Smart Tiles; display only. */
(function(){
'use strict';
function badges(active){
  const group=document.createElement('span');
  group.className='otg317-badges';
  const h=document.createElement('span');
  h.className='otg317-mini'+(active?' history-active':'');
  h.textContent='H';h.title=active?'Saved results in this championship':'No saved result in this championship';
  const e=document.createElement('span');
  e.className='otg317-mini otg317-evil';e.textContent='E✓';
  e.title='Evil activity indicator (not yet connected on this screen)';
  group.append(h,e);
  return group;
}
function connectHistory(section,group){
  // Keep the original History action; only replace its oversized presentation.
  if(!section || !group)return;
  const candidates=[...section.querySelectorAll('button,[role="button"],a')].filter(el=>
    !el.closest('.otg317-badges') &&
    !el.matches('.rhChamp33Continue,.rhChamp33Tools button,.rhChamp33Footer button') &&
    (/history|car.?record|car.?detail/i.test([el.className,el.title,el.getAttribute('aria-label'),el.getAttribute('onclick')].join(' ')) ||
     /^[▤▥▦▧▨▩≡☷📋]{1,3}$/.test(el.textContent.trim()))
  );
  const fallback=[...section.querySelectorAll('button,[role="button"],a')]
    .filter(el=>!el.closest('.otg317-badges') &&
      !el.matches('.rhChamp33Continue,.rhChamp33Tools button,.rhChamp33Footer button'));
  const original=candidates[0]||(fallback.length===1?fallback[0]:null);
  if(!original)return;
  const h=group.firstElementChild;
  const oldLabel=original.getAttribute('aria-label')||original.title||'Open car history';
  const clickable=document.createElement('button');
  clickable.type='button';clickable.className=h.className;
  clickable.textContent='H';clickable.title=oldLabel;clickable.setAttribute('aria-label',oldLabel);
  clickable.addEventListener('click',event=>{event.stopPropagation();original.click();});
  group.replaceChild(clickable,h);
  original.style.display='none';
}
function decorateOverview(id){
  const root=document.querySelector('#festival .rhChamp33');
  if(!root)return;
  const run=(typeof window.rhCurrentRuns==='function'?window.rhCurrentRuns():[])
    .find(r=>String(r.id)===String(id));
  if(!run)return;
  const history=new Set((run.results||[]).map(x=>String(x.carId)));
  const next=typeof window.rhNextSlot==='function'?window.rhNextSlot(run):null;
  const current=root.querySelector('.rhChamp33CurrentHead > div');
  if(current && next && !current.querySelector('.otg317-badges')){
    current.classList.add('otg317-current-car');
    const g=badges(history.has(String(next.carId)));
    current.append(g);
    connectHistory(root.querySelector('.rhChamp33CurrentHead'),g);
  }
  const remaining=typeof window.rhQueueRemaining==='function'?window.rhQueueRemaining(run):[];
  root.querySelectorAll('.rhChamp33NextRows > div').forEach((row,i)=>{
    if(row.querySelector('.otg317-badges'))return;
    row.classList.add('otg317-car-tile');
    const g=badges(remaining[i]!=null && history.has(String(remaining[i])));
    row.append(g);
    connectHistory(row,g);
  });
}
function decorateStandings(){
  const root=document.querySelector('#festival .rhStandings33');
  if(!root)return;
  root.querySelectorAll('.rhStandings33Rows > div').forEach(row=>{
    if(row.querySelector('.otg317-badges'))return;
    row.classList.add('otg317-standings-row');
    row.append(badges(true));
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
  window.rhShowCurrentStandingsV5834=function(){
    const result=originalStandings.apply(this,arguments);
    decorateStandings();
    return result;
  };
}
})();
