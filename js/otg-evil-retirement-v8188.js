/* OTG! MAIN v8.0.188 — reversible Evil 1.0 UI retirement. NO storage writes. */
(()=>{'use strict';
 const doc=document, id=x=>doc.getElementById(x);
 let lastOpen=0;
 function home(){const fn=window.show;if(typeof fn==='function'){fn('home');return;}doc.querySelectorAll('main > .screen').forEach(s=>s.classList.add('hidden'));id('home')?.classList.remove('hidden');}
 function enter(){
  const p=id('evilcampaign');if(!p)return;
  doc.querySelectorAll('main > .screen').forEach(s=>s.classList.add('hidden'));
  p.classList.remove('hidden');
  // Retire the old view in memory only; all source scripts and persisted data stay intact.
  // Avoid using the old Evil renderer and its expensive slot listing during normal navigation.
  p.innerHTML=`<section class="e2r-panel" aria-labelledby="e2r-title">
   <button type="button" id="e2r-back">← BACK TO DASHBOARD</button>
   <p class="e2r-kicker">OTG! 8.0.188 · DEVELOPMENT MODE</p>
   <h2 id="e2r-title">EVIL TOURNAMENT 2.0</h2>
   <p class="e2r-highlight">The original campaign is retired from this screen — not deleted.</p>
   <p>Its saved slots and results are retained. The established Festival, Race Off and Swiss competition engines remain installed. No Slot 001 restart has occurred.</p>
   <div class="e2r-actions"><button type="button" id="e2r-relay">🏎️ RELAY GARAGE — QA</button><button type="button" id="e2r-cockpit">🏁 RACING COCKPIT — QA</button></div>
   <p class="e2r-note">Both tools are development previews. No old tournament resets, career-medal changes or Garage edits are made by this retirement screen.</p>
   <button type="button" id="e2r-back-bottom">← BACK TO DASHBOARD</button>
  </section>`;
  id('e2r-back').addEventListener('click',home);id('e2r-back-bottom').addEventListener('click',home);
  id('e2r-relay').addEventListener('click',()=>{
    const planner=window.rhEvil2RelayPlanner186;
    if(typeof planner?.show!=='function'){
      alert('Relay Garage module did not load. Check that the v8.0.186 planner script is present in the app folder.');
      return;
    }
    // Paint a real visible page before drawing many relay teams. No saved data writes.
    const b=id('e2r-relay');b.disabled=true;b.textContent='OPENING RELAY GARAGE…';
    requestAnimationFrame(()=>setTimeout(()=>{
      try{planner.show();}
      catch(err){console.error('[OTG Relay Garage]',err);alert('Relay Garage could not open: '+(err?.message||'Unknown error')+' — no Garage data was changed.');}
      finally{b.disabled=false;b.textContent='🏎️ RELAY GARAGE — QA';}
    },0));
  });
  id('e2r-cockpit').addEventListener('click',()=>{if(window.rhEvil2Trials182?.show)window.rhEvil2Trials182.show();else alert('Racing Cockpit is unavailable. Return to dashboard and verify app update.');});
  lastOpen=performance.now();
 }
 function dashboardEvilClick(event){
  const t=event.target;if(!(t instanceof Element)||!t.closest('#home'))return;
  const b=t.closest('button,a,[role="button"],.tile');if(!b)return;
  const val=[b.textContent,b.id,b.getAttribute('onclick'),b.getAttribute('data-screen')].join(' ');
  if(!/evil(?:\s+tournament|\s+campaign|\s+list)?/i.test(val))return;
  event.preventDefault();event.stopImmediatePropagation();enter();
 }
 // Dashboard capture is a fast path: avoids invoking the legacy 1,219-slot renderer.
 doc.addEventListener('click',dashboardEvilClick,true);
 // Intercept normal named app navigation too. Original function is retained for every other screen.
 const originalShow=window.show;
 if(typeof originalShow==='function'){
   const wrapped=function(screen,...args){if(screen==='evilcampaign'){enter();return;}return originalShow.call(this,screen,...args)};
   window.show=wrapped;
 }
 window.rhEvil2Retirement187={open:enter,goHome:home,getStatus:()=>({mode:'reversible-ui-retirement',legacyDataDeleted:false,lastOpened:lastOpen})};
})();
