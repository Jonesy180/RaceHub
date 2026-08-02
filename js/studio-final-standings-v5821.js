/* RaceHub v5.8.21 — dedicated Final Standings page. */
(()=>{
'use strict';
const q=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=t=>typeof rhFmtTime==='function'?rhFmtTime(Number(t||0)):String(t??'—');
const space=()=>{try{return typeof rhSpace==='function'?rhSpace():null}catch(_){return null}};
const carById=id=>(space()?.cars||[]).find(c=>String(c.id)===String(id));
const carLabel=id=>{const c=carById(id);try{return c&&typeof carName==='function'?carName(c):(c?.name||c?.model||'Unknown car')}catch(_){return c?.name||c?.model||'Unknown car'}};
const runRows=run=>{const n=(run.rounds||[]).length;return (run.entries||[]).map(id=>{const rr=(run.results||[]).filter(x=>String(x.carId)===String(id));return rr.length===n?{id,total:rr.reduce((s,x)=>s+Number(x.time||0),0)}:null}).filter(Boolean).sort((a,b)=>a.total-b.total)};
const eventCars=e=>{try{return typeof rhEventCars==='function'?(rhEventCars(e)||[]):[]}catch(_){return []}};
const eventRounds=e=>{try{return typeof rhEventRounds==='function'?(rhEventRounds(e)||[]):(e.rounds||[])}catch(_){return e.rounds||[]}};
const eventRows=e=>{const n=eventRounds(e).length;return eventCars(e).map(c=>{const rr=(e.results||[]).filter(x=>String(x.carId)===String(c.id));return rr.length===n?{id:c.id,total:rr.reduce((s,x)=>s+Number(x.time||0),0)}:null}).filter(Boolean).sort((a,b)=>a.total-b.total)};
const trophy=item=>{const t=String(item?.trophy||item?.type||'festival').toLowerCase();return t==='make'||t==='manufacturer'?'assets/final/trophy-manufacturer.png':t==='era'?'assets/final/trophy-era.png':t==='favourite'?'assets/final/trophy-favourite.png':'assets/final/trophy-festival.png'};
const label=(kind,item)=>kind==='event'?'EVENT WINNER':String(item?.type||item?.championshipType||'festival')==='era'?'ERA CHAMPION':String(item?.type||item?.championshipType||'festival')==='make'?'MANUFACTURER CHAMPION':String(item?.type||item?.championshipType||'festival')==='favourite'?'FAVOURITE CHAMPION':'FESTIVAL CHAMPION';
function page(kind,item,rows,currentId){
 const leader=rows[0]?.total||0,winner=rows[0],rounds=kind==='event'?eventRounds(item).length:(item.rounds||[]).length;
 return `<div class="rhFinal5821"><header class="rhFinal5821Header"><small>FINAL STANDINGS</small><h1>${esc(item.name)}</h1><p>${kind==='event'?'EVENT':'CHAMPIONSHIP'} • ${rounds} ROUND${rounds===1?'':'S'} COMPLETE</p></header><section class="rhFinal5821Board"><div class="rhFinal5821BoardTitle"><span>◆◆</span><h2>OFFICIAL RESULTS</h2><span>◆◆</span></div><div class="rhFinal5821Cols"><span>POS</span><span>CAR</span><span>TOTAL TIME</span><span>GAP</span></div><div class="rhFinal5821Scroll" id="rhFinal5821Scroll">${rows.map((x,i)=>`<div class="rhFinal5821Row ${String(x.id)===String(currentId)?'current':''}"><i>${String(i+1).padStart(2,'0')}</i><span>${esc(carLabel(x.id))}</span><strong>${fmt(x.total)}</strong><em>${i===0?'—':'+'+fmt(x.total-leader)}</em></div>`).join('')}</div>${rows.length>5?'<div class="rhFinal5821More">⌄ &nbsp; SCROLL FOR MORE RESULTS</div>':''}</section><section class="rhFinal5821Winner">${kind==='event'?'<div class="rhFinal5821EventTrophy">🏁</div>':`<img src="${trophy(item)}" alt="">`}<div><small>${label(kind,item)}</small><b>${esc(carLabel(winner?.id))}</b><span>TOTAL TIME</span><strong>${winner?fmt(winner.total):'—'}</strong></div></section><div class="rhFinal5821Actions"><button id="rhFinal5821Secondary" class="secondary">${kind==='event'?'BACK TO EVENTS':'VIEW HALL OF FAME'}</button><button id="rhFinal5821Back" class="primary">${kind==='event'?'BACK TO EVENTS':'BACK TO CHAMPIONSHIPS'}</button></div></div>`;
}
function mount(kind,item,rows,currentId){
 const host=q('final-standings'); if(!host)return;
 document.body.classList.add('rhFinal5821Active');
 document.querySelectorAll('.screen').forEach(s=>s.classList.add('hidden'));
 host.classList.remove('hidden');
 host.innerHTML=page(kind,item,rows,currentId);
 window.scrollTo(0,0);
 const leave=()=>{document.body.classList.remove('rhFinal5821Active');host.classList.add('hidden');host.innerHTML='';if(kind==='event'){rhRenderEvents();show('events')}else{rhRenderFestival();show('festival')}window.scrollTo(0,0)};
 q('rhFinal5821Back')?.addEventListener('click',leave);
 q('rhFinal5821Secondary')?.addEventListener('click',()=>{if(kind==='event')leave();else{document.body.classList.remove('rhFinal5821Active');host.classList.add('hidden');host.innerHTML='';window.rhRecordsMode='hall';rhRenderRecords();show('hall');window.scrollTo(0,0)}});
 requestAnimationFrame(()=>{const s=q('rhFinal5821Scroll'),r=s?.querySelector('.current');if(s&&r)s.scrollTop=Math.max(0,r.offsetTop-(s.clientHeight-r.clientHeight)/2)});
}
function showRun(id,currentId){const run=(typeof rhCurrentRuns==='function'?rhCurrentRuns():[]).find(x=>String(x.id)===String(id));if(run)mount('championship',run,runRows(run),currentId)}
function showEvent(id,currentId){const e=space()?.customEvents?.find(x=>String(x.id)===String(id));if(e)mount('event',e,eventRows(e),currentId)}
window.rhChampionshipCompleteTransition=showRun;
window.rhEventCompleteTransition=showEvent;
window.rhShowFinalStandingsV5810=showRun;
window.rhShowEventFinalStandingsV5810=showEvent;
window.rhShowFinalStandingsV5821=showRun;
window.rhShowEventFinalStandingsV5821=showEvent;
const oldRun=window.rhOpenRun;if(oldRun)window.rhOpenRun=function(id){const r=(typeof rhCurrentRuns==='function'?rhCurrentRuns():[]).find(x=>String(x.id)===String(id));if(r?.status==='complete')return showRun(id,r.results?.at(-1)?.carId);return oldRun(id)};
const oldEvent=window.rhOpenEvent;if(oldEvent)window.rhOpenEvent=function(id){const e=space()?.customEvents?.find(x=>String(x.id)===String(id));if(e?.status==='complete')return showEvent(id,e.results?.at(-1)?.carId);return oldEvent(id)};
window.rhShowCompletedEventLeaderboard=showEvent;
})();
