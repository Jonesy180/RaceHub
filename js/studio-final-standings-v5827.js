/* RaceHub v5.8.27 — Final Standings rebuilt from the approved blank artwork. */
(()=>{
'use strict';
const q=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=t=>typeof rhFmtTime==='function'?rhFmtTime(Number(t||0)):String(t??'—');
const activeSpace=()=>{try{return typeof rhSpace==='function'?rhSpace():null}catch(_){return null}};
const allCars=()=>activeSpace()?.cars||[];
const carById=id=>allCars().find(c=>String(c.id)===String(id));
const carLabel=id=>{const c=carById(id);if(!c)return 'Unknown car';try{return typeof carName==='function'?carName(c):(c.name||c.model||'Unknown car')}catch(_){return c.name||c.model||'Unknown car'}};
const runRows=run=>{const rounds=(run.rounds||[]).length;return (run.entries||[]).map(id=>{const results=(run.results||[]).filter(r=>String(r.carId)===String(id));return results.length===rounds?{id,total:results.reduce((s,r)=>s+Number(r.time||0),0)}:null}).filter(Boolean).sort((a,b)=>a.total-b.total)};
const eventCars=e=>{try{return typeof rhEventCars==='function'?(rhEventCars(e)||[]):[]}catch(_){return []}};
const eventRounds=e=>{try{return typeof rhEventRounds==='function'?(rhEventRounds(e)||[]):(e.rounds||[])}catch(_){return e.rounds||[]}};
const eventRows=e=>{const rounds=eventRounds(e).length;return eventCars(e).map(c=>{const results=(e.results||[]).filter(r=>String(r.carId)===String(c.id));return results.length===rounds?{id:c.id,total:results.reduce((s,r)=>s+Number(r.time||0),0)}:null}).filter(Boolean).sort((a,b)=>a.total-b.total)};
const trophy=item=>{const type=String(item?.trophy||item?.type||item?.championshipType||'festival').toLowerCase();if(type==='make'||type==='manufacturer')return 'assets/final/trophy-manufacturer.png';if(type==='era')return 'assets/final/trophy-era.png';if(type==='favourite')return 'assets/final/trophy-favourite.png';return 'assets/final/trophy-festival.png'};
const championLabel=(kind,item)=>{if(kind==='event')return 'EVENT WINNER';const type=String(item?.type||item?.championshipType||'festival').toLowerCase();if(type==='era')return 'ERA CHAMPION';if(type==='make'||type==='manufacturer')return 'MANUFACTURER CHAMPION';if(type==='favourite')return 'FAVOURITE CHAMPION';return 'FESTIVAL CHAMPION'};
function rowsMarkup(rows){const leader=rows[0]?.total||0;return rows.map((row,index)=>`<div class="rhFS25Row"><span class="rhFS25Pos">${String(index+1).padStart(2,'0')}</span><span class="rhFS25Car">${esc(carLabel(row.id))}</span><span class="rhFS25Time">${fmt(row.total)}</span><span class="rhFS25Gap">${index===0?'—':'+'+fmt(row.total-leader)}</span></div>`).join('')}
function leave(kind,host){document.body.classList.remove('rhFS25Active');host.classList.add('hidden');host.innerHTML='';if(kind==='event'){rhRenderEvents();show('events')}else{rhRenderFestival();show('festival')}window.scrollTo(0,0)}
function mount(kind,item,rows){const host=q('final-standings');if(!host)return;const winner=rows[0];document.body.classList.add('rhFS25Active');document.querySelectorAll('.screen').forEach(s=>s.classList.add('hidden'));host.classList.remove('hidden');host.innerHTML=`<div class="rhFS25Page"><div class="rhFS25Stage"><img class="rhFS25Art" src="assets/final/final-standings-stadium-ui-ready-v5826.png?v=5827" alt=""><button id="rhFS25TopBack" class="rhFS25Hot rhFS25TopBack" aria-label="Back"></button><div class="rhFS25Subtitle">${esc(item?.name||'Final Standings')}</div><div id="rhFS25Rows" class="rhFS25Rows">${rowsMarkup(rows)}</div><div class="rhFS25TrophyMask"><img class="rhFS25Trophy" src="${trophy(item)}" alt=""></div><div class="rhFS25ChampionLabel">${esc(championLabel(kind,item))}</div><div class="rhFS25WinnerName">${esc(winner?carLabel(winner.id):'—')}</div><div class="rhFS25WinnerTime">${winner?fmt(winner.total):'—'}</div><button id="rhFS25Hall" class="rhFS25Hot rhFS25Hall" aria-label="View Hall of Fame"></button><button id="rhFS25Back" class="rhFS25Hot rhFS25Back" aria-label="Back"></button></div></div>`;window.scrollTo(0,0);q('rhFS25Back')?.addEventListener('click',()=>leave(kind,host));q('rhFS25TopBack')?.addEventListener('click',()=>leave(kind,host));q('rhFS25Hall')?.addEventListener('click',()=>{if(kind==='event'){leave(kind,host);return}document.body.classList.remove('rhFS25Active');host.classList.add('hidden');host.innerHTML='';window.rhRecordsMode='hall';rhRenderRecords();show('hall');window.scrollTo(0,0)});}
function showRun(id){const run=(typeof rhCurrentRuns==='function'?rhCurrentRuns():[]).find(r=>String(r.id)===String(id));if(run)mount('championship',run,runRows(run))}
function showEvent(id){const event=activeSpace()?.customEvents?.find(e=>String(e.id)===String(id));if(event)mount('event',event,eventRows(event))}
window.rhShowFinalStandingsV5827=showRun;
window.rhShowEventFinalStandingsV5827=showEvent;
window.rhChampionshipCompleteTransition=showRun;
window.rhEventCompleteTransition=showEvent;
window.rhShowCompletedEventLeaderboard=showEvent;
})();
