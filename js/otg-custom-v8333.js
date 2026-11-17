/* OTG! MAIN v8.0.333 — display-only Custom Racing refinement.
   Preserve native render, League button handlers, event formats and persistence. */
(()=>{
'use strict';
const oldEvents=window.rhRenderEvents;
if(typeof oldEvents==='function'){
 window.rhRenderEvents=function(...args){
  const ret=oldEvents.apply(this,args);
  const hero=document.querySelector('#events .rhEventsHeroV1');
  if(hero){
   const back=hero.querySelector('.rhEventsBackV1');
   if(back){back.textContent='‹ BACK';back.setAttribute('aria-label','Back to dashboard');}
   const h1=hero.querySelector('.rhEventsHeadV1 h1');
   if(h1)h1.innerHTML='<span class="otg3333">OTG! / </span>CUSTOM RACING';
   if(!hero.querySelector('.rh3333HeroWord')){
    const title=document.createElement('div');title.className='rh3333HeroWord';
    title.innerHTML='<strong>EVENTS</strong><small>YOUR RACING</small>';
    hero.appendChild(title);
   }
  }
  return ret;
 };
}
const oldCreate=window.rhCreateEvent;
if(typeof oldCreate==='function'){
 window.rhCreateEvent=function(...args){
  const ret=oldCreate.apply(this,args);
  const picker=document.querySelector('#rhEventEditor .rhFormatPick8025');
  const count=document.querySelector('#rhEventEditor .rhNumberPicker');
  // Presentation only: place the existing four-format selector after racer count.
  // Moving the existing node retains every format click handler and hidden value.
  if(picker && count && picker.previousElementSibling!==count)count.insertAdjacentElement('afterend',picker);
  return ret;
 };
}
})();
