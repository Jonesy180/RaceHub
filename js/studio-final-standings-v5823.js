/* RaceHub v5.8.23 — Final Standings total rebuild, artwork checkpoint. */
(()=>{
  'use strict';
  const host=()=>document.getElementById('final-standings');
  function mount(){
    const el=host(); if(!el)return;
    document.body.classList.add('rhFinal5823Active');
    document.querySelectorAll('.screen').forEach(s=>s.classList.add('hidden'));
    el.classList.remove('hidden');
    el.innerHTML='<div class="rhFinal5823Artwork"><img src="assets/final/final-standings-stadium-locked-v5817.png?v=5823" alt="Final Standings approved artwork"></div>';
    window.scrollTo(0,0);
  }
  function showRun(){mount()}
  function showEvent(){mount()}
  window.rhShowFinalStandingsV5823=showRun;
  window.rhShowEventFinalStandingsV5823=showEvent;
  window.rhChampionshipCompleteTransition=showRun;
  window.rhEventCompleteTransition=showEvent;
})();
