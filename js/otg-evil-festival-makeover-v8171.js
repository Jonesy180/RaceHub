/* OTG! personal MAIN v8.0.171 — Evil Festival race screen makeover.
 * Presentation only. Keeps original UI actions, car order, event results,
 * history buttons, and all persisted state intact. Race Off inspired style.
 */
(()=>{
 'use strict';
 const PAGE_CLASS='otgFestRaceOffStyle8171';
 const DUPLICATE='otgFestCurrentDuplicate8171';
 const BANNER='otgFestNowBanner8171';
 const NOTE='otgFestQueueHint8171';
 function cleanLabel(node){
   if(!node)return '';
   const copy=node.cloneNode(true);
   copy.querySelectorAll('button,.v7HistoryBtn,.rhEvilUsedBadge8166,.otgEvilUsedMark8167').forEach(x=>x.remove());
   return copy.textContent.replace(/\s+/g,' ').trim().toLocaleLowerCase();
 }
 function decorate(){
   const root=document.getElementById('festival');
   const page=root?.querySelector(':scope > .rhChamp33.otgEvilQueueCompact8167');
   if(!page||root.classList.contains('hidden'))return;
   const current=page.querySelector('.rhChamp33Current');
   const head=current?.querySelector('.rhChamp33CurrentHead');
   const title=head?.querySelector('h2');
   const queue=page.querySelector('.rhChamp33NextRows');
   const queueHead=page.querySelector('.rhChamp34NextHead h2');
   if(!current||!head||!title||!queue||!queueHead)return;
   if(!page.classList.contains(PAGE_CLASS))page.classList.add(PAGE_CLASS);

   // Put the existing car-position counter in a slim header above the car name.
   // This moves a passive text element only; the native buttons are NOT moved.
   let banner=current.querySelector(':scope > .'+BANNER);
   if(!banner){
     banner=document.createElement('div');banner.className=BANNER;
     const label=document.createElement('b');label.textContent='UP NEXT · FESTIVAL';
     banner.appendChild(label);
     current.insertBefore(banner,head);
   }
   const counter=head.querySelector(':scope > strong');
   if(counter)banner.appendChild(counter);

   if(queueHead.textContent!=='RUNNING ORDER')queueHead.textContent='RUNNING ORDER';
   const rows=[...queue.children].filter(x=>x.tagName==='DIV');
   const queuing=page.querySelector('.rhChamp33Next');
   let hint=queuing?.querySelector(':scope > .'+NOTE);
   if(!hint){
     hint=document.createElement('p');hint.className=NOTE;
     hint.textContent='Remaining cars in their saved racing order';
     const heading=queuing.querySelector('.rhChamp34NextHead');
     heading?.insertAdjacentElement('afterend',hint);
   }
   // Current car appears once in the UP NEXT panel. If row one is the SAME
   // car, replace only its visual duplicate with a short reference, as Race Off.
   // Keep its native DOM/ID/order intact and never assume first row is current.
   if(rows.length){
     const row=rows[0];
     const name=row.querySelector(':scope > b');
     const isDuplicate=!!name&&cleanLabel(title)!==''&&cleanLabel(title)===cleanLabel(name);
     if(row.classList.contains(DUPLICATE)!==isDuplicate)row.classList.toggle(DUPLICATE,isDuplicate);
     let memo=row.querySelector(':scope > .otgFestShownAbove8171');
     if(isDuplicate&&!memo){
       memo=document.createElement('span');memo.className='otgFestShownAbove8171';
       memo.textContent='CURRENT CAR · SHOWN ABOVE ↑';
       row.appendChild(memo);
     }else if(!isDuplicate&&memo)memo.remove();
   }
 }
 let scheduled=false;
 function schedule(){
  if(scheduled)return; scheduled=true;
  (window.requestAnimationFrame||((cb)=>setTimeout(cb,16)))(()=>{
    scheduled=false;
    try{decorate();}catch(e){console.warn('OTG! Evil Festival makeover skipped:',e);}
  });
 }
 function start(){
   const root=document.getElementById('festival');if(!root)return;
   new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
   schedule();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
 window.otgFestivalMakeoverQA8171=()=>({version:'8.0.171',displayOnly:true,
  active:!!document.querySelector('#festival .'+PAGE_CLASS),
  duplicateQueueRow:!!document.querySelector('#festival .'+DUPLICATE),
  queueRows:document.querySelectorAll('#festival .'+PAGE_CLASS+' .rhChamp33NextRows > div').length});
})();
