/* RaceHub v5.7.91 — compact result entry + locked Final Standings viewport */
(()=>{
 const VERSION='5.7.91';
 const $=id=>document.getElementById(id);
 function topNow(){
   const host=$('festival');
   try{window.scrollTo(0,0)}catch(_){ }
   if(host){host.scrollTop=0; try{host.scrollTo(0,0)}catch(_){}}
   document.documentElement.scrollTop=0; document.body.scrollTop=0;
 }
 function holdTop(){
   topNow();
   requestAnimationFrame(()=>{topNow();requestAnimationFrame(topNow)});
   [30,90,180,350,650].forEach(ms=>setTimeout(topNow,ms));
 }

 // Result Summary: remove the artificial spacer introduced in v5.7.90.
 const oldSummary=window.rhResultSummary;
 if(oldSummary) window.rhResultSummary=function(run,result){
   const out=oldSummary(run,result);
   const host=$('festival');
   host?.classList.add('rh591-summary-host');
   host?.querySelector('.rhResultsSummaryFinal')?.classList.add('rh591-summary');
   host?.querySelectorAll('.rhOfficialBoard,.rhTimingBoard,.rh588-board,.rhLockedBoardBoot').forEach(el=>el.remove());
   holdTop();
   return out;
 };

 // Final Standings: always use the locked Official Results screen and open at its top.
 const locked=window.rhShowLockedFinalLeaderboardV5788;
 if(locked) window.rhShowLockedFinalLeaderboardV5788=function(runId){
   document.body.classList.remove('rh591-summary-open');
   topNow();
   const out=locked(runId);
   const host=$('festival');
   host?.classList.remove('rh591-summary-host');
   host?.querySelector('.rh588-final-screen')?.classList.add('rh591-final');
   holdTop();
   return out;
 };
 window.rhChampionshipCompleteTransition=id=>window.rhShowLockedFinalLeaderboardV5788?.(id);

 // Ensure every completed run route is intercepted after all previous release layers.
 const openRun=window.rhOpenRun;
 if(openRun) window.rhOpenRun=function(id){
   const run=(window.rhCurrentRuns?.()||[]).find(x=>String(x.id)===String(id));
   if(run?.status==='complete') return window.rhShowLockedFinalLeaderboardV5788?.(id);
   return openRun(id);
 };

 // Settings remains the single visible version authority.
 const oldSettings=window.rhRenderSettings;
 if(oldSettings) window.rhRenderSettings=function(){
   const out=oldSettings();
   document.querySelectorAll('#more .rhSettingRow span').forEach(span=>{
     if(/RaceHub v/i.test(span.textContent||'')) span.textContent=`RaceHub v${VERSION} • CHECK NOW ›`;
   });
   const status=$('rhUpdateStatus');
   if(status && !/Checking|Update available|Could not/i.test(status.textContent||'')) status.textContent=`Installed version: ${VERSION}`;
   return out;
 };
})();
