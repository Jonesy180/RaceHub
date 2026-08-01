/* RaceHub v5.7.90 — result-summary cleanup + final standings viewport repair */
(()=>{
 const CURRENT_VERSION='5.7.90';

 function resetViewport(){
  try{window.scrollTo({top:0,left:0,behavior:'instant'});}catch(_){window.scrollTo(0,0);}
  const active=document.querySelector('.screen.active,.page.active,#festival');
  if(active)active.scrollTop=0;
  document.documentElement.scrollTop=0;
  document.body.scrollTop=0;
 }

 // Result Summary must never paint the Final Standings board in its empty centre area.
 const previousSummary=window.rhResultSummary;
 if(previousSummary){
  window.rhResultSummary=function(run,result){
   const out=previousSummary(run,result);
   const host=document.getElementById('festival');
   host?.querySelectorAll('.rhOfficialBoard,.rhLockedBoard,.rh588-board,.rhLockedBoardBoot').forEach(el=>el.remove());
   const summary=host?.querySelector('.rhSummaryOfficial');
   if(summary)summary.classList.add('rh590-summary-clean');
   resetViewport();
   return out;
  };
 }

 // Final Standings always opens at the top of the locked artwork instead of inheriting
 // the Result Summary scroll position and appearing to be a different cropped layout.
 const previousLocked=window.rhShowLockedFinalLeaderboardV5788;
 if(previousLocked){
  window.rhShowLockedFinalLeaderboardV5788=function(runId){
   document.body.classList.remove('rh588-final-open');
   resetViewport();
   const out=previousLocked(runId);
   resetViewport();
   requestAnimationFrame(()=>{ resetViewport(); requestAnimationFrame(resetViewport); });
   setTimeout(resetViewport,80);
   return out;
  };
 }

 window.rhChampionshipCompleteTransition=id=>window.rhShowLockedFinalLeaderboardV5788?.(id);

 // Keep Settings as the single version authority.
 const previousSettings=window.rhRenderSettings;
 if(previousSettings){
  window.rhRenderSettings=function(){
   const out=previousSettings();
   document.querySelectorAll('#more .rhSettingRow span').forEach(span=>{
    if(/RaceHub v/i.test(span.textContent||''))span.textContent=`RaceHub v${CURRENT_VERSION} • CHECK NOW ›`;
   });
   const status=document.getElementById('rhUpdateStatus');
   if(status&&!/Checking|Update|Could not/i.test(status.textContent||''))status.textContent=`Installed version: ${CURRENT_VERSION}`;
   return out;
  };
 }
})();
