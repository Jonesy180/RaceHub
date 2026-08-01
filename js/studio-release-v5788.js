/* RaceHub v5.7.88 — locked Final Standings artwork implementation */
(()=>{
 const $=id=>document.getElementById(id);
 const safe=v=>typeof esc==='function'?esc(String(v??'')):String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const time=v=>typeof rhFmtTime==='function'?rhFmtTime(Number(v)||0):String(v||'0:00.000');
 const getRows=r=>(r.entries||[]).map(id=>{
   const results=(r.results||[]).filter(x=>String(x.carId)===String(id));
   return results.length===(r.rounds||[]).length?{id,total:results.reduce((sum,x)=>sum+Number(x.time||0),0)}:null;
 }).filter(Boolean).sort((a,b)=>a.total-b.total);
 const gapTime=ms=>time(ms).replace(/^00:/,'');

 function rowHtml(row,index,leader,currentId){
   const pos=index+1;
   const gap=pos===1?'—':`+${gapTime(row.total-leader)}`;
   const current=String(row.id)===String(currentId)?' is-current':'';
   return `<div class="rh588-result-row${current}" style="--row-delay:${index*50}ms">
     <div class="rh588-pos">${String(pos).padStart(2,'0')}</div>
     <div class="rh588-car">${safe(carName(carById(row.id)))}</div>
     <div class="rh588-time">${time(row.total)}</div>
     <div class="rh588-gap">${gap}</div>
   </div>`;
 }

 window.rhShowLockedFinalLeaderboardV5788=function(runId){
   const run=(rhCurrentRuns?.()||[]).find(x=>String(x.id)===String(runId));
   if(!run)return;
   const rows=getRows(run), winner=rows[0], leader=winner?.total||0;
   const last=(run.results||[]).at(-1), currentId=last?.carId;
   const typeLabel=typeof rhSetupTypeLabel==='function'?rhSetupTypeLabel(run.type||run.championshipType||'festival'):'RaceHub Festival';
   const rounds=(run.rounds||[]).length;
   show('festival');
   const host=$('festival');
   host.innerHTML=`<div class="rh588-final-screen">
     <header class="rh588-hero">
       <div class="rh588-topbar">
         <button class="rh588-circle rh588-back" onclick="rhRenderFestival()" aria-label="Back"><span></span></button>
         <div class="rh588-title"><small>FINAL STANDINGS</small><h1>${safe(run.name)}</h1></div>
         <button class="rh588-circle rh588-help" aria-label="Help">?</button>
       </div>
       <section class="rh588-meta">
         <div><small>CHAMPIONSHIP</small><strong>${safe(typeLabel)}</strong></div>
         <div><small>ROUNDS</small><strong>${rounds} OF ${rounds}</strong></div>
       </section>
     </header>
     <main class="rh588-content">
       <section class="rh588-board" aria-label="Official results">
         <div class="rh588-boot" aria-hidden="true"><b>████████████</b><b>............</b><b>01&nbsp;&nbsp;02&nbsp;&nbsp;03</b></div>
         <div class="rh588-board-title"><span>♜</span><h2>OFFICIAL RESULTS</h2></div>
         <div class="rh588-columns"><b>POS</b><b>CAR</b><b>TOTAL TIME</b><b>GAP</b></div>
         <div class="rh588-results">${rows.map((r,i)=>rowHtml(r,i,leader,currentId)).join('')}</div>
         <div class="rh588-scroll"><i></i><small>SCROLL FOR MORE RESULTS</small></div>
       </section>
       ${winner?`<section class="rh588-winner">
         <div class="rh588-trophy-wrap"><img src="${rhTrophy(run.trophy)}" alt="Championship trophy"></div>
         <div class="rh588-winner-copy"><small>CHAMPIONSHIP WINNER</small><h2>${safe(carName(carById(winner.id)))}</h2><span>TOTAL TIME</span><strong>${time(winner.total)}</strong></div>
         <div class="rh588-winner-art" aria-hidden="true"></div>
       </section>`:''}
       <div class="rh588-actions">
         <button class="rh588-action secondary" onclick="rhRecordsMode='hall';rhRenderRecords();show('hall')"><span>♜</span> VIEW HALL OF FAME</button>
         <button class="rh588-action primary" onclick="rhRenderFestival()">CONTINUE <span>›</span></button>
       </div>
     </main>
   </div>`;
   document.body.classList.add('rh588-final-open');
   requestAnimationFrame(()=>host.querySelector('.rh588-final-screen')?.classList.add('is-on'));
 };

 // Replace every completed-championship route, including legacy inline calls.
 const oldOpen=window.rhOpenRun;
 window.rhOpenRun=function(id){
   const run=(rhCurrentRuns?.()||[]).find(x=>String(x.id)===String(id));
   if(run?.status==='complete')return window.rhShowLockedFinalLeaderboardV5788(id);
   return oldOpen?.(id);
 };
 window.rhChampionshipCompleteTransition=id=>window.rhShowLockedFinalLeaderboardV5788(id);

 // Prevent the legacy complete view from surviving if another path paints it.
 document.addEventListener('click',e=>{
   const btn=e.target.closest?.('button');
   if(!btn)return;
   const text=(btn.textContent||'').toUpperCase();
   if(text.includes('FINAL LEADERBOARD')||text.includes('FINAL STANDINGS')){
     const m=(btn.getAttribute('onclick')||'').match(/['"]([^'"]+)['"]/);
     if(m){e.preventDefault();e.stopImmediatePropagation();window.rhShowLockedFinalLeaderboardV5788(m[1]);}
   }
 },true);
})();
