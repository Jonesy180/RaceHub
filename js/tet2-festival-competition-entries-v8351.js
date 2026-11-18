/* OTG! MAIN v8.0.351 — presentation-only connections of existing competition launchers.
   Do not copy listeners, save data, change eligibility or run any Second Chance pilot.
   Second Chance is tournament-only and will be wired to the NEW TET2 engine in Stage 5. */
(()=>{
'use strict';
const entries=[
  {id:'otg-relay-festival-8202',key:'relay'},
  {id:'otg-gnt-launch-8211',key:'gauntlet'},
  {id:'otg-longjump-launch-8217',key:'jump'}
];
let queued=false;
function category(grid,key){
  if(key!=='jump')return grid.querySelector(':scope > .otg324-'+key);
  let item=grid.querySelector(':scope > .tet2-351-jump');
  if(item)return item;
  item=document.createElement('details');
  item.className='otg324-category tet2-351-jump';
  const summary=document.createElement('summary');
  // The original Festival layout requires an icon FIRST to provide the grid's first column.
  const icon=document.createElement('img');
  icon.src='assets/ui/festival-icon-longjump-v8351.svg';icon.alt='';
  icon.setAttribute('aria-hidden','true');
  const label=document.createElement('span');label.className='otg324-category-label';label.textContent='AERÓDROMO LONG JUMP';
  const count=document.createElement('strong');count.className='otg324-category-count';count.textContent='1';count.setAttribute('aria-label','1 available');
  const arrow=document.createElement('span');arrow.className='otg324-category-chevron';arrow.textContent='⌄';arrow.setAttribute('aria-hidden','true');
  summary.append(icon,label,count,arrow);
  const content=document.createElement('div');content.className='otg324-category-content';
  item.append(summary,content);grid.append(item);
  return item;
}
function refresh(){
  const festival=document.getElementById('festival');
  if(!festival||festival.classList.contains('hidden'))return;
  const grid=festival.querySelector('.otg324-category-list');if(!grid)return;
  // Do not offer tournament-qualified Second Chance as an ordinary Festival choice.
  // Its legacy 16-car QA implementation must NOT be used for the new TET2 programme.
  const legacy=festival.querySelector('#otg-sc-launch-8220');
  if(legacy){legacy.hidden=true;legacy.setAttribute('aria-hidden','true');}
  for(const item of grid.querySelectorAll(':scope > .tet2-349-chance, :scope > .tet2-349-jump')){
    // Re-home a Long Jump launcher if one is still in a previous format's box.
    if(item.classList.contains('tet2-349-jump')){
      const launcher=item.querySelector('#otg-longjump-launch-8217');
      if(launcher)category(grid,'jump').querySelector('.otg324-category-content').append(launcher);
    }
    item.remove();
  }
  for(const c of entries){
    const launcher=festival.querySelector('#'+c.id);
    if(!launcher)continue;
    const card=category(grid,c.key);if(!card)continue;
    const body=card.querySelector(':scope > .otg324-category-content');if(!body)continue;
    if(launcher.parentElement!==body)body.append(launcher); // MOVE only, preserve existing listener
    card.classList.remove('otg324-zero');
    const count=card.querySelector(':scope > summary .otg324-category-count');
    if(count && count.textContent!=='1')count.textContent='1';
    for(const note of body.querySelectorAll(':scope > .otg324-unavailable'))note.remove();
  }
}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;refresh();});}
function init(){
  const festival=document.getElementById('festival');if(!festival)return;
  new MutationObserver(schedule).observe(festival,{childList:true,subtree:true});
  document.addEventListener('click',e=>{if(e.target.closest?.('[data-screen="festival"]'))schedule();},{passive:true});
  schedule();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
