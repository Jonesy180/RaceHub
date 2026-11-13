/* OTG! MAIN 8.0.200 — standalone relay roster ENTRY QA.
 * This release adds independent home-screen launch buttons into the EXISTING,
 * isolated relay competition engine. Deliberately no data migration, storage
 * mutations, racing-history writes, career medals, or activation of Evil 2.0.
 */
(function(){'use strict';
  const HOME_ID='otg-relay-roster-8200';
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function open(mode){
    const planner=window.rhEvil2RelayPlanner186;
    const race=window.rhEvil2RelayCompetition194;
    if(!planner || !race || typeof planner.show!=='function'){
      alert('Relay Race Control is not available. Your data has not changed.');return;
    }
    try{
      planner.show();
      const screen=document.getElementById('erc-194');
      if(!screen||screen.style.display==='none')throw Error('Race Control did not open');
      if(mode==='mixed'){
        const tab=screen.querySelector('[data-mode="mixed"]');
        if(!tab)throw Error('Mixed Relay tab unavailable');
        tab.click();
      }else{
        const tab=screen.querySelector('[data-mode="maker"]');
        if(tab)tab.click();
      }
      // Navigation label only; event handlers and state remain owned by the
      // already accepted v8.0.197 relay engine.
      ['erc-back','erc-back-bottom'].forEach(id=>{
        const btn=screen.querySelector('#'+id);
        if(btn)btn.textContent='← BACK TO COMPETITION ROSTER';
      });
      screen.dataset.rosterLaunch8200='1';
    }catch(e){
      try{race.hide?.();}catch(_){}
      alert('Relay could not open: '+esc(e.message)+'. No saved data was changed.');
    }
  }
  function mount(){
    const home=document.getElementById('home');
    if(!home||home.querySelector('#'+HOME_ID)||home.classList.contains('hidden')||!home.children.length)return;
    const card=document.createElement('section');
    card.id=HOME_ID;
    card.className='otg-relay-roster-card-8200';
    card.setAttribute('aria-label','Standalone Relay Championships');
    card.innerHTML='<div class="otg-relay-roster-head-8200"><h2>🏁 RELAY CHAMPIONSHIPS</h2><span>STANDALONE · QA</span></div>'+
      '<p>Launch a relay independently of Evil Tournament. Each championship has three-car teams and four-team qualifying groups.</p>'+
      '<div class="otg-relay-roster-actions-8200">'+
      '<button type="button" data-roster-relay-8200="maker">🏭 <strong>MANUFACTURER RELAY</strong><small>Three cars from the same maker</small></button>'+
      '<button type="button" data-roster-relay-8200="mixed">🏎️ <strong>MIXED RELAY</strong><small>Three different manufacturers</small></button></div>'+
      '<p class="otg-relay-roster-caution-8200">QA access: uses existing isolated relay test saves. No official race history, career medals or permanent records yet. FH5 catalogue Space required.</p>';
    card.querySelectorAll('[data-roster-relay-8200]').forEach(b=>b.addEventListener('click',()=>open(b.dataset.rosterRelay8200)));
    home.appendChild(card);
  }
  function start(){
    const home=document.getElementById('home');if(!home)return;
    // Observe only immediate home children and coalesce rebuilds into a single
    // frame; this avoids the expensive subtree observer that hurt Evil 1.0.
    let queued=false;
    const queue=()=>{
      if(queued)return;queued=true;
      requestAnimationFrame(()=>{queued=false;mount();});
    };
    new MutationObserver(queue).observe(home,{childList:true,attributes:true,attributeFilter:['class']});
    document.addEventListener('click',e=>{
      if(e.target.closest?.('[data-screen="home"]'))queue();
    },{passive:true});
    queue();
    window.rhStandaloneRelayRoster8200=Object.freeze({open,mount});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
