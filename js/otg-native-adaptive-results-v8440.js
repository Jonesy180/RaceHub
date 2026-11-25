/* OTG! MAIN v8.0.440 — Native OTG! adaptive result views.
   Read-only presentation adapter over existing Festival/Pick My Drive,
   Custom Events and League result handlers. Original functions still bank
   every time, position and finishing status; no data shape/storage changes.
   Never rewrites TET2 results or any saved result. */
(function(){'use strict';
const root=window, planner=root.OTGAdaptiveResults437;
if(!planner||typeof planner.plan!=='function')return;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arr=x=>Array.isArray(x)?x:[];
const space=()=>{try{return typeof root.rhSpace==='function'?root.rhSpace():null}catch{return null}};
const displayCar=id=>{try{const c=space()?.cars?.find(c=>String(c.id)===String(id));return c?(typeof root.carName==='function'?root.carName(c):[c.make,c.model,c.year].filter(Boolean).join(' ')):String(id)}catch{return String(id)}};
const displayTime=x=>{try{return typeof root.rhFmtTime==='function'?root.rhFmtTime(Number(x)):Number(x).toFixed(3)}catch{return String(x)}};
const resultFor=(rows,id,rid)=>arr(rows).find(x=>String(x.carId)===String(id)&&String(x.roundId)===String(rid));
const nativePlan=(name,ids,rounds,kind)=>planner.plan({name,kind,entrants:ids.map(id=>({id:String(id),name:displayCar(id)})),courses:rounds.map(r=>({name:r.name||r.label||'Race',id:r.id}))});
const heading=(p,done,mode)=>`<div class="otg440-head"><b>${esc(mode==='multi-entrant'?'ALL CARS · ONE RACE':'ONE CAR · ALL '+p.stageCount+' RACES')}</b><span>${done} / ${p.resultCount} SAVED</span></div>`;
const line=(name,value,active,idx)=>`<div class="otg440-line ${active?'is-current':''}"><b>${esc(name)}</b><span>${value===null?(active?'ENTER TIME BELOW':'UP NEXT'):esc(value)}</span></div>`;
function festivalDecorate(runId,carId,roundId){
 const r=typeof root.rhCurrentRuns==='function'?arr(root.rhCurrentRuns()).find(x=>String(x.id)===String(runId)):null;
 const box=document.querySelector('#festival .rhResultEntry');
 if(!r||!box||box.dataset.otg440==='yes'||!arr(r.rounds).length||!arr(r.entries).length)return;
 // Native championship/PMD result screens only. Match identity from the frozen run.
 if(!arr(r.entries).some(id=>String(id)===String(carId))||!arr(r.rounds).some(q=>String(q.id)===String(roundId)))return;
 let p;try{p=nativePlan(r.name,r.entries,r.rounds,r.pickMyDrive?'pick-my-ride':'festival')}catch{return}
 const current=String(carId),currentRound=String(roundId);
 let rows='';
 if(p.layout==='multi-entrant'){
  const rd=r.rounds[0];rows=p.entrants.map((e,i)=>{const res=resultFor(r.results,e.id,rd.id);return line((i+1)+'. '+e.name,res?displayTime(res.time):null,e.id===current,i)}).join('');
 }else{
  const index=p.entrants.findIndex(e=>e.id===current);
  const who=p.entrants[index];
  rows=p.stages.map((stage,i)=>{const rd=r.rounds[i];const res=resultFor(r.results,current,rd.id);return line('RACE '+(i+1)+' · '+stage.name,res?displayTime(res.time):null,String(rd.id)===currentRound,i)}).join('');
  rows='<div class="otg440-car">CAR '+(index+1)+' OF '+p.entrantCount+' · '+esc(who?.name||displayCar(current))+'</div>'+rows;
 }
 const done=arr(r.results).filter(x=>arr(r.entries).some(id=>String(x.carId)===String(id))&&arr(r.rounds).some(q=>String(x.roundId)===String(q.id))).length;
 box.insertAdjacentHTML('afterbegin','<div class="otg440-roster">'+heading(p,done,p.layout)+rows+'</div>');
 box.dataset.otg440='yes';
}
const oldRun=root.rhEnterResult;
if(typeof oldRun==='function')root.rhEnterResult=function(runId,carId,roundId){const ret=oldRun.apply(this,arguments);try{festivalDecorate(runId,carId,roundId)}catch(e){console.warn('OTG native adaptive Festival view unavailable',e)}return ret;};
function customDecorate(eventId){
 const e=arr(space()?.customEvents).find(x=>String(x.id)===String(eventId));
 const box=document.querySelector('#rhEventResultEditor .rhModal');
 if(!e||!box||box.dataset.otg440==='yes')return;
 // Let specialist group, Swiss, knockout editors own their results completely.
 const format=String(e.format||e.eventFormat||'').toLowerCase();
 if(/swiss|knockout|groups|relay|bracket/.test(format))return;
 const ids=arr(Array.isArray(e.frozenCarIds)?e.frozenCarIds:e.carIds);
 const rounds=arr(Array.isArray(e.frozenRounds)&&e.frozenRounds.length?e.frozenRounds:e.rounds);
 let p;try{p=nativePlan(e.name,ids,rounds,'custom')}catch{return}
 if(!p.entrants.length)return;
 const next=typeof root.rhEventNextPair==='function'?root.rhEventNextPair(e):null;
 if(!next)return;
 const done=arr(e.results).length;
 const entries=p.layout==='multi-entrant'?p.entrants.map((c,i)=>line((i+1)+'. '+c.name,resultFor(e.results,c.id,rounds[0].id)?.time!=null?displayTime(resultFor(e.results,c.id,rounds[0].id).time):null,String(c.id)===String(next.car.id),i)).join(''):
 '<div class="otg440-car">'+esc(displayCar(next.car.id))+'</div>'+p.stages.map((r,i)=>line('RACE '+(i+1)+' · '+r.name,resultFor(e.results,next.car.id,rounds[i].id)?.time!=null?displayTime(resultFor(e.results,next.car.id,rounds[i].id).time):null,String(rounds[i].id)===String(next.round.id),i)).join('');
 const toolbar='<div class="otg440-roster">'+heading(p,done,p.layout)+entries+'</div>';
 const context=box.querySelector('.rhResultContext');
 if(context)context.insertAdjacentHTML('afterend',toolbar);else box.insertAdjacentHTML('afterbegin',toolbar);
 box.dataset.otg440='yes';
}
const oldCustom=root.rhEventResult;
if(typeof oldCustom==='function')root.rhEventResult=function(eventId){const ret=oldCustom.apply(this,arguments);try{customDecorate(eventId)}catch(e){console.warn('OTG native adaptive Custom view unavailable',e)}return ret;};
// League already has its correct all-drivers-in-one-event editor. Register its
// event with the same planner, but do not replace its validated DNF/DNS,
// position, scoring, confirmation or saved-history controls.
const oldLeague=root.rhEnterLeagueResultsV6021;
if(typeof oldLeague==='function')root.rhEnterLeagueResultsV6021=function(lid,eid){const ret=oldLeague.apply(this,arguments);try{
 const l=arr(space()?.leagues).find(x=>String(x.id)===String(lid)),e=l?.events?.find(x=>String(x.id)===String(eid));
 const host=document.querySelector('#events .rhLeaguePageV6018');
 if(!l||!e||!host||host.querySelector('.otg440-league-label'))return ret;
 const participants=arr(l.drivers).filter(x=>x.active!==false),track=String(e.raceName||e.name||'League Event');
 const p=planner.plan({kind:'league',name:e.name,entrants:participants.map(d=>({id:String(d.id),name:d.name})),courses:[track]});
 const summary=document.createElement('div');summary.className='otg440-league-label';summary.textContent='ADAPTIVE EVENT · '+p.entrantCount+' DRIVERS · ONE EVENT · ORIGINAL LEAGUE SCORING';
 const form=host.querySelector('.rhLeagueBodyV6018')||host;form.insertBefore(summary,form.firstChild);
 }catch(e){console.warn('OTG native adaptive League view unavailable',e)}return ret;};
root.OTGNativeAdaptive440=Object.freeze({version:'8.0.440',scopes:['festival','pick-my-drive','custom-single/multi','league-native']});
})();
