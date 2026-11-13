/* OTG! 8.0.186 — passive, volatile Evil opening probe. No storage or app hooks. */
(()=>{'use strict';
 let start=0, last=null, timer=null, longTasks=0;
 try{if(window.PerformanceObserver && PerformanceObserver.supportedEntryTypes?.includes('longtask')){
  new PerformanceObserver(list=>{if(start)for(const item of list.getEntries())if(item.startTime>=start)longTasks++;}).observe({entryTypes:['longtask']});
 }}catch(_){/* unsupported on some phones */}
 function evilVisible(){const el=document.getElementById('evilcampaign');if(!el)return false;
   const style=getComputedStyle(el);return !el.classList.contains('hidden') && style.display!=='none' && style.visibility!=='hidden';}
 function sample(){if(!start)return; if(evilVisible()){
   last={openingMs:Math.round(performance.now()-start),longTasks,at:new Date().toLocaleTimeString()};
   start=0;clearInterval(timer);timer=null;
   console.info('[OTG v8.0.186] Evil screen open:',last);
 }}
 function tap(ev){
   // Observe only clicks in the home dashboard. Never intercept navigation or modify state.
   const t=ev.target;if(!(t instanceof Element)||!t.closest('#home'))return;
   const button=t.closest('button,a,[role="button"],.tile');if(!button)return;
   const info=(button.textContent||'')+' '+(button.id||'')+' '+(button.getAttribute('onclick')||'');
   if(!/evil/i.test(info) || evilVisible())return;
   start=performance.now();longTasks=0;
   clearInterval(timer);timer=setInterval(sample,150);
   setTimeout(()=>{if(start){start=0;clearInterval(timer);timer=null;}},20000);
 }
 document.addEventListener('click',tap,true);
 window.otgEvilOpenSpeed186=()=>last?{...last}:{status:'Open Evil Tournament from dashboard to measure; this probe makes no changes.'};
})();
