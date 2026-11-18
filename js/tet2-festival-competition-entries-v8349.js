/* TET2 stage 3 / OTG Main 8.0.349: Festival competition wiring only.
   Move existing live native launchers, retaining their listeners and save logic.
   DO NOT promote the existing QA save structures to official results. */
(()=>{
'use strict';
const PREFIX='tet2-349-';
const CONNECTIONS=[
  {id:'otg-relay-festival-8202',target:'relay',name:'Relay Championships'},
  {id:'otg-gnt-launch-8211',target:'gauntlet',name:'Gauntlets'},
  {id:'otg-longjump-launch-8217',target:'jump',name:'Aeródromo Long Jump'},
  {id:'otg-sc-launch-8220',target:'chance',name:'Second Chance Cup'}
];
let queued=false;
function ensureCategory(grid,key,title){
 let detail=grid.querySelector(':scope > .'+PREFIX+key);
 if(detail)return detail;
 detail=document.createElement('details'); detail.className='otg324-category '+PREFIX+key;
 const summary=document.createElement('summary');summary.className=PREFIX+'summary';
 const label=document.createElement('span');label.className='otg324-category-label';label.textContent=title;
 const count=document.createElement('strong');count.className='otg324-category-count';count.textContent='1';
 const chevron=document.createElement('span');chevron.className='otg324-category-chevron';chevron.textContent='⌄';
 summary.append(label,count,chevron);detail.append(summary);
 const content=document.createElement('div');content.className='otg324-category-content';detail.append(content);
 grid.append(detail);return detail;
}
function refresh(){
 const f=document.getElementById('festival');
 if(!f||f.classList.contains('hidden'))return;
 const grid=f.querySelector('.otg324-category-list');if(!grid)return;
 for(const c of CONNECTIONS){
   const source=f.querySelector('#'+c.id);if(!source)continue;
   const target=c.target==='relay'||c.target==='gauntlet'
       ?grid.querySelector(':scope > .otg324-'+c.target)
       :ensureCategory(grid,c.target,c.name.toUpperCase());
   if(!target)continue;
   const content=target.querySelector(':scope > .otg324-category-content');if(!content)continue;
   // Move, do not clone: preserve already-installed click listeners and local saves.
   if(source.parentElement!==content)content.append(source);
   target.classList.remove('otg324-zero');
   const number=target.querySelector(':scope > summary .otg324-category-count');
   if(number){number.textContent='1';number.setAttribute('aria-label','1 entry');}
   for(const note of content.querySelectorAll(':scope > .otg324-unavailable'))note.remove();
 }
}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;refresh();});}
function init(){
 const f=document.getElementById('festival');if(!f)return;
 new MutationObserver(schedule).observe(f,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
 document.addEventListener('click',e=>{if(e.target.closest?.('[data-screen="festival"]'))schedule();},{passive:true});
 schedule();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
