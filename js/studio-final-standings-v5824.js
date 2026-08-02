/* RaceHub v5.8.24 — live UI wired onto the approved Final Standings artwork. */
(()=>{
'use strict';
const q=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=t=>typeof rhFmtTime==='function'?rhFmtTime(Number(t||0)):String(t??'—');
const space=()=>{try{return typeof rhSpace==='function'?rhSpace():null}catch(_){return null}};
const cars=()=>space()?.cars||[];
const carById=id=>cars().find(c=>String(c.id)===String(id));
const carLabel=id=>{const c=carById(id);try{return c&&typeof carName==='function'?carName(c):(c?.name||c?.model||'Unknown car')}catch(_){return c?.name||c?.model||'Unknown car'}};
const runRows=run=>{const n=(run.rounds||[]).length;return (run.entries||[]).map(id=>{const rr=(run.results||[]).filter(x=>String(x.carId)===String(id));return rr.length===n?{id,total:rr.reduce((s,x)=>s+Number(x.time||0),0)}:null}).filter(Boolean).sort((a,b)=>a.total-b.total)};
const eventCars=e=>{try{return typeof rhEventCars==='function'?(rhEventCars(e)||[]):[]}catch(_){return []}};
const eventRounds=e=>{try{return typeof rhEventRounds==='function'?(rhEventRounds(e)||[]):(e.rounds||[])}catch(_){return e.rounds||[]}};
const eventRows=e=>{const n=eventRounds(e).length;return eventCars(e).map(c=>{const rr=(e.results||[]).filter(x=>String(x.carId)===String(c.id));return rr.length===n?{id:c.id,total:rr.reduce((s,x)=>s+Number(x.time||0),0)}:null}).filter(Boolean).sort((a,b)=>a.total-b.total)};
const trophy=item=>{const t=String(item?.trophy||item?.type||item?.championshipType||'festival').toLowerCase();return t==='make'||t==='manufacturer'?'assets/final/trophy-manufacturer.png':t==='era'?'assets/final/trophy-era.png':t==='favourite'?'assets/final/trophy-favourite.png':'assets/final/trophy-festival.png'};
const championLabel=(kind,item)=>kind==='event'?'EVENT WINNER':String(item?.type||item?.championshipType||'festival')==='era'?'ERA CHAMPION':String(item?.type||item?.championshipType||'festival')==='make'?'MANUFACTURER CHAMPION':String(item?.type||item?.championshipType||'festival')==='favourite'?'FAVOURITE CHAMPION':'FESTIVAL CHAMPION';

function rowsHtml(rows,currentId){
 const leader=rows[0]?.total||0;
 return rows.map((x,i)=>`<div class="rhFinal5824Row ${String(x.id)===String(currentId)?'current':''}"><i>${String(i+1).padStart(2,'0')}</i><span>${esc(carLabel(x.id))}</span><strong>${fmt(x.total)}</strong><em>${i===0?'—':'+'+fmt(x.total-leader)}</em></div>`).join('');
}
function page(kind,item,rows,currentId){
 const winner=rows[0];
 const title=item?.name||'Final Standings';
 return `<div class="rhFinal5824Page">
   <div class="rhFinal5824Stage">
     <button id="rhFinal5824TopBack" class="rhFinal5824TopBack" aria-label="Back"></button>
     <div class="rhFinal5824Title">${esc(title)}</div>
     <div class="rhFinal5824Rows" id="rhFinal5824Rows">${rowsHtml(rows,currentId)}</div>
     <img class="rhFinal5824Trophy" src="${trophy(item)}" alt="">
     <div class="rhFinal5824WinnerLabel">${championLabel(kind,item)}</div>
     <div class="rhFinal5824WinnerName">${esc(carLabel(winner?.id))}</div>
     <div class="rhFinal5824WinnerTime">${winner?fmt(winner.total):'—'}</div>
     <button id="rhFinal5824Hall" class="rhFinal5824Hotspot rhFinal5824Hall" aria-label="View Hall of Fame"></button>
     <button id="rhFinal5824Back" class="rhFinal5824Hotspot rhFinal5824Back" aria-label="Back"></button>
   </div>
 </div>`;
}
function mount(kind,item,rows,currentId){
 const host=q('final-standings'); if(!host)return;
 document.body.classList.add('rhFinal5824Active');
 document.querySelectorAll('.screen').forEach(s=>s.classList.add('hidden'));
 host.classList.remove('hidden');
 host.innerHTML=page(kind,item,rows,currentId);
 window.scrollTo(0,0);
 const leave=()=>{
   document.body.classList.remove('rhFinal5824Active');
   host.classList.add('hidden'); host.innerHTML='';
   if(kind==='event'){rhRenderEvents();show('events')}else{rhRenderFestival();show('festival')}
   window.scrollTo(0,0);
 };
 q('rhFinal5824Back')?.addEventListener('click',leave);
 q('rhFinal5824TopBack')?.addEventListener('click',leave);
 q('rhFinal5824Hall')?.addEventListener('click',()=>{
   if(kind==='event')return leave();
   document.body.classList.remove('rhFinal5824Active');
   host.classList.add('hidden'); host.innerHTML='';
   window.rhRecordsMode='hall'; rhRenderRecords(); show('hall'); window.scrollTo(0,0);
 });
 requestAnimationFrame(()=>{const s=q('rhFinal5824Rows'),r=s?.querySelector('.current');if(s&&r)s.scrollTop=Math.max(0,r.offsetTop-(s.clientHeight-r.clientHeight)/2)});
}
function showRun(id,currentId){const run=(typeof rhCurrentRuns==='function'?rhCurrentRuns():[]).find(x=>String(x.id)===String(id));if(run)mount('championship',run,runRows(run),currentId)}
function showEvent(id,currentId){const e=space()?.customEvents?.find(x=>String(x.id)===String(id));if(e)mount('event',e,eventRows(e),currentId)}
window.rhShowFinalStandingsV5824=showRun;
window.rhShowEventFinalStandingsV5824=showEvent;
window.rhChampionshipCompleteTransition=showRun;
window.rhEventCompleteTransition=showEvent;
window.rhShowCompletedEventLeaderboard=showEvent;
})();
