/* OTG! 8.0.286 — stable hero mount across fast HQ and asynchronous re-render. */
(()=>{'use strict';
const ROOT='otg-e263-list';
function mount(){
 const root=document.getElementById(ROOT);
 if(!root || root.hidden)return;
 const extras=root.querySelector('.e266-extras');
 if(!extras || !extras.parentElement)return; // maintenance and schedule pages have no extras
 // Remove any older hero, avoiding an extra banner and stale styles.
 for(const old of root.querySelectorAll('.e263-hero,.e284-hero,.otg285-banner')){
   if(old.id!=='otg-ratchet-hero-v8286')old.remove();
 }
 if(root.querySelector('#otg-ratchet-hero-v8286'))return;
 const banner=document.createElement('section');
 banner.id='otg-ratchet-hero-v8286';
 banner.className='otg285-banner';
 banner.setAttribute('aria-label','Evil Tournament 2.0 — Lord Ratchet and Ma Lubrication');
 banner.innerHTML='<img src="assets/tournaments/lord-ratchet-ma-tet-v8286.webp?v=8286" alt="Lord Ratchet the raccoon and Ma Lubrication in the Evil Tournament garage" decoding="async" loading="eager">';
 extras.parentElement.insertBefore(banner,extras);
}
function start(){
 const root=document.getElementById(ROOT);
 if(!root){setTimeout(start,80);return;}
 const obs=new MutationObserver(mount);
 obs.observe(root,{childList:true});
 mount();
 // Some old navigation builds toggle hidden without rewriting the markup.
 new MutationObserver(mount).observe(root,{attributes:true,attributeFilter:['hidden','class','style']});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
