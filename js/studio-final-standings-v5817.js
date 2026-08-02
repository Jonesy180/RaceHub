/* RaceHub v5.8.17 — clean standalone Final Standings presentation. */
(()=>{
'use strict';
const byId=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=t=>typeof rhFmtTime==='function'?rhFmtTime(Number(t||0)):String(t??'—');
const space=()=>{try{return typeof rhSpace==='function'?rhSpace():null}catch(_){return null}};
const cars=()=>space()?.cars||[];
const car=id=>cars().find(c=>String(c.id)===String(id));
const name=id=>{const c=car(id);try{return c&&typeof carName==='function'?carName(c):(c?.name||c?.model||'Unknown car')}catch(_){return c?.name||c?.model||'Unknown car'}};
const runRows=run=>{const rounds=(run.rounds||[]).length;return (run.entries||[]).map(id=>{const rr=(run.results||[]).filter(x=>String(x.carId)===String(id));return rr.length===rounds?{id,total:rr.reduce((s,x)=>s+Number(x.time||0),0)}:null}).filter(Boolean).sort((a,b)=>a.total-b.total)};
const eventCars=e=>{try{return typeof rhEventCars==='function'?(rhEventCars(e)||[]):[]}catch(_){return []}};
const eventRounds=e=>{try{return typeof rhEventRounds==='function'?(rhEventRounds(e)||[]):(e.rounds||[])}catch(_){return e.rounds||[]}};
const eventRows=e=>{const rounds=eventRounds(e).length;return eventCars(e).map(c=>{const rr=(e.results||[]).filter(x=>String(x.carId)===String(c.id));return rr.length===rounds?{id:c.id,total:rr.reduce((s,x)=>s+Number(x.time||0),0)}:null}).filter(Boolean).sort((a,b)=>a.total-b.total)};
const trophy=item=>{const t=String(item?.trophy||item?.type||'festival').toLowerCase();return t==='make'||t==='manufacturer'?'assets/final/trophy-manufacturer.png':t==='era'?'assets/final/trophy-era.png':t==='favourite'?'assets/final/trophy-favourite.png':'assets/final/trophy-festival.png'};
const championLabel=(kind,item)=>kind==='event'?'EVENT WINNER':String(item?.type||item?.championshipType||'festival')==='era'?'ERA CHAMPION':String(item?.type||item?.championshipType||'festival')==='make'?'MANUFACTURER CHAMPION':String(item?.type||item?.championshipType||'festival')==='favourite'?'FAVOURITE CHAMPION':'FESTIVAL CHAMPION';
function html(kind,item,rows,currentId){
 const leader=rows[0]?.total||0,winner=rows[0],rounds=kind==='event'?eventRounds(item).length:(item.rounds||[]).length;
 return `<div class="rhFinal5817">
  <div class="rhFinal5817Bg" aria-hidden="true"></div>
  <header class="rhFinal5817Header"><small>FINAL STANDINGS</small><h1>${esc(item.name)}</h1><p>${kind==='event'?'EVENT':'CHAMPIONSHIP'} • ${rounds} ROUND${rounds===1?'':'S'} COMPLETE</p></header>
  <section class="rhFinal5817Board">
   <div class="rhFinal5817BoardTitle"><span>◆◆</span><h2>OFFICIAL RESULTS</h2><span>◆◆</span></div>
   <div class="rhFinal5817Cols"><span>POS</span><span>CAR</span><span>TOTAL TIME</span><span>GAP</span></div>
   <div class="rhFinal5817Scroll" id="rhFinal5817Scroll">${rows.map((x,i)=>`<div class="rhFinal5817Row ${String(x.id)===String(currentId)?'current':''}"><i>${String(i+1).padStart(2,'0')}</i><span>${esc(name(x.id))}</span><strong>${fmt(x.total)}</strong><em>${i===0?'—':'+'+fmt(x.total-leader)}</em></div>`).join('')}</div>
   ${rows.length>5?'<div class="rhFinal5817More">⌄ &nbsp; SCROLL FOR MORE RESULTS</div>':''}
  </section>
  <section class="rhFinal5817Winner">${kind==='event'?'<div class="rhFinal5817EventTrophy">🏁</div>':`<img src="${trophy(item)}" alt="">`}<div><small>${championLabel(kind,item)}</small><b>${esc(name(winner?.id))}</b><span>TOTAL TIME</span><strong>${winner?fmt(winner.total):'—'}</strong></div></section>
  <div class="rhFinal5817Actions"><button id="rhFinal5817Secondary" class="secondary">${kind==='event'?'BACK TO EVENTS':'VIEW HALL OF FAME'}</button><button id="rhFinal5817Back" class="primary">${kind==='event'?'BACK TO EVENTS':'BACK TO CHAMPIONSHIPS'}</button></div>
 </div>`;
}
function mount(kind,item,rows,currentId){
 const hostId=kind==='event'?'event':'festival'; if(typeof show==='function')show(hostId); const host=byId(hostId); if(!host)return;
 document.body.classList.add('rhFinal5817Active'); host.innerHTML=html(kind,item,rows,currentId); window.scrollTo(0,0);
 const back=()=>{document.body.classList.remove('rhFinal5817Active'); if(kind==='event'){rhRenderEvents();show('events')}else{rhRenderFestival();show('festival')} window.scrollTo(0,0)};
 byId('rhFinal5817Back')?.addEventListener('click',back);
 byId('rhFinal5817Secondary')?.addEventListener('click',()=>{if(kind==='event')back();else{document.body.classList.remove('rhFinal5817Active');window.rhRecordsMode='hall';rhRenderRecords();show('hall');window.scrollTo(0,0)}});
 requestAnimationFrame(()=>{const s=byId('rhFinal5817Scroll'),r=s?.querySelector('.current');if(s&&r)s.scrollTop=Math.max(0,r.offsetTop-(s.clientHeight-r.clientHeight)/2)});
}
function showRun(id,currentId){const run=(typeof rhCurrentRuns==='function'?rhCurrentRuns():[]).find(x=>String(x.id)===String(id));if(run)mount('championship',run,runRows(run),currentId)}
function showEvent(id,currentId){const e=space()?.customEvents?.find(x=>String(x.id)===String(id));if(e)mount('event',e,eventRows(e),currentId)}
window.rhChampionshipCompleteTransition=showRun;
window.rhEventCompleteTransition=showEvent;
window.rhShowFinalStandingsV5810=showRun;
window.rhShowEventFinalStandingsV5810=showEvent;
window.rhShowFinalStandingsV5817=showRun;
window.rhShowEventFinalStandingsV5817=showEvent;
})();
