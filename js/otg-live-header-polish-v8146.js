/* OTG! MAIN v8.0.146 — artwork-first racing titles (display only).
 * Existing title nodes move directly BELOW illustrated headers. Back buttons remain
 * over the image, fully working; original click handlers and race data are untouched.
 * Scoped to Festival/Race Off illustrated headers and active championship artworks.
 */
(()=>{
 'use strict';
 const $=(root,s)=>root.querySelector(s);
 // Generic Festival and Race Off banners, including live knockout round headers.
 function separateFestivalHeader(hero){
   if(hero.dataset.otgTitleBelow8146==='1')return;
   const head=$(hero,':scope > .rhFestivalHeadV1');
   if(!head)return;
   const identity=Array.from(head.children).find(el=>el.tagName==='DIV'&&el.querySelector('h1'));
   if(!identity)return;
   const strip=document.createElement('div');
   strip.className='otgLiveTitleStrip8146 otgFestivalStrip8146';
   strip.appendChild(identity); // move the ORIGINAL node, not a copy
   hero.insertAdjacentElement('afterend',strip);
   hero.dataset.otgTitleBelow8146='1';
   hero.parentElement?.classList.add('otgSeparatedHeader8146');
 }
 // Group and championship running banners that have an actual artwork background.
 function separateOverviewHero(hero){
   if(hero.dataset.otgTitleBelow8146==='1')return;
   const title=$(hero,':scope > .rhOverviewBrandV1');
   if(!title)return;
   const strip=document.createElement('div');
   strip.className='otgLiveTitleStrip8146 otgOverviewStrip8146';
   strip.appendChild(title);
   hero.insertAdjacentElement('afterend',strip);
   hero.dataset.otgTitleBelow8146='1';
 }
 function separateChampHero(hero){
   if(hero.dataset.otgTitleBelow8146==='1')return;
   const title=$(hero,':scope > .rhChamp34Title');
   if(!title)return;
   title.classList.add('otgLiveTitleStrip8146','otgChampStrip8146');
   hero.insertAdjacentElement('afterend',title);
   hero.dataset.otgTitleBelow8146='1';
 }
 function refresh(){
   for(const id of ['raceoff','festival','event']){
     const root=document.getElementById(id);
     if(!root||root.classList.contains('hidden'))continue;
     // The illustrated Festival and Race Off views keep back controls on the hero.
     if(id!=='event')root.querySelectorAll('.rhFestivalV1 > .rhFestivalHeroV1').forEach(separateFestivalHeader);
     // Group headers with ACTUAL image backgrounds, not plain text-only group pages.
     root.querySelectorAll('.rhOverviewHeroV1.otgEvilLiveHero8145').forEach(separateOverviewHero);
     // All active championship-image hero cards (Evil and ordinary championships).
     root.querySelectorAll('.rhChamp33 > .rhChamp34Hero').forEach(separateChampHero);
   }
 }
 function init(){
   const roots=['raceoff','festival','event'].map(x=>document.getElementById(x)).filter(Boolean);
   if(!roots.length)return;
   let pending=false;
   const schedule=()=>{
     if(pending)return;
     pending=true;
     (window.requestAnimationFrame||((fn)=>setTimeout(fn,16)))(()=>{
       pending=false;
       try{refresh()}catch(e){console.warn('OTG hero text layout:',e)}
     });
   };
   if(typeof MutationObserver==='function'){
     for(const root of roots)new MutationObserver(schedule).observe(root,{subtree:true,childList:true});
   }
   document.addEventListener('click',()=>setTimeout(schedule,0),{passive:true});
   window.addEventListener('pageshow',schedule);
   schedule();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
 else init();
})();
