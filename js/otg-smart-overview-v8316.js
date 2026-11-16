/* OTG! v8.0.316 — Shared overview Smart Tiles. Presentation only. */
(function(){
'use strict';
const escText=s=>String(s??'');
function badgeGroup(hasRace){
  const wrap=document.createElement('span');
  wrap.className='otg316-badges';
  const history=document.createElement('span');
  history.className='otg316-mini'+(hasRace?' is-history':'');
  history.textContent='H';
  history.title=hasRace?'Recorded racing history':'No recorded racing history';
  history.setAttribute('aria-label',history.title);
  const evil=document.createElement('span');
  evil.className='otg316-mini otg316-evil';
  evil.textContent='E✓';
  evil.title='No verified Evil category shown here';
  evil.setAttribute('aria-label',evil.title);
  wrap.append(history,evil);
  return wrap;
}
function decorateOverview(id){
  const root=document.querySelector('#festival .rhChamp33');
  if(!root) return;
  const runs=typeof window.rhCurrentRuns==='function'?window.rhCurrentRuns():[];
  const run=runs.find(r=>String(r.id)===String(id));
  if(!run)return;
  const races=Array.isArray(run.results)?run.results:[];
  const hasHistory=carId=>races.some(x=>String(x.carId)===String(carId));
  const next=typeof window.rhNextSlot==='function'?window.rhNextSlot(run):null;
  const title=root.querySelector('.rhChamp33CurrentHead > div');
  if(title && next && !title.querySelector('.otg316-badges')){
    title.classList.add('otg316-car-header');
    title.append(badgeGroup(hasHistory(next.carId)));
  }
  const waiting=typeof window.rhQueueRemaining==='function'?window.rhQueueRemaining(run):[];
  root.querySelectorAll('.rhChamp33NextRows > div').forEach((row,i)=>{
    if(row.querySelector('.otg316-badges'))return;
    row.classList.add('otg316-car-row');
    row.append(badgeGroup(waiting[i]?hasHistory(waiting[i]):false));
  });
}
function decorateStandings(id){
  const root=document.querySelector('#festival .rhStandings33');
  if(!root)return;
  root.querySelectorAll('.rhStandings33Rows > div').forEach(row=>{
    if(row.querySelector('.otg316-badges'))return;
    row.classList.add('otg316-standing-row');
    row.append(badgeGroup(true)); // Every ranked car has completed recorded rounds.
  });
}
const open=window.rhOpenRun;
if(typeof open==='function'){
  window.rhOpenRun=function(id){
    const result=open.apply(this,arguments);
    decorateOverview(id);
    return result;
  };
}
const standings=window.rhShowCurrentStandingsV5834;
if(typeof standings==='function'){
  window.rhShowCurrentStandingsV5834=function(id){
    const result=standings.apply(this,arguments);
    decorateStandings(id);
    return result;
  };
}
})();
