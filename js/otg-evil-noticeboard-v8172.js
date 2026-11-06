/* OTG! PERSONAL MAIN v8.0.172 — Evil Tournament Garage Noticeboard.
 * READ ONLY: no championship, track bag, results, medals, draw, or save mutations.
 * Shows badge legend, recorded Evil track rotation, campaign pulse & Swiss QA readiness.
 * Existing FH5 Track Directory already tracks all-space track uses; do not duplicate it.
 */
(()=>{
 'use strict';
 const CAMPAIGN='evil-specialist-r1-20261014';
 const E=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const text=x=>String(x??'');
 const space=()=>{try{const v=window.rhSpace?.();return v?.catalogueKey==='fh5-catalogue-v1'?v:null}catch(_){return null}};
 const campaign=sp=>sp?.evilCampaignR18098?.campaignId===CAMPAIGN?sp.evilCampaignR18098:null;
 const evil=x=>!!x&&x.type==='evil-r1'&&x.evilCampaignR1?.campaignId===CAMPAIGN;
 const timed=r=>!!r&&r.time!==null&&r.time!==undefined&&r.time!==''&&Number.isFinite(Number(r.time))&&Number(r.time)>0;
 const canon=t=>{const str=text(t).trim();try{return window.rhFH5TrackTaxonomy8070?.canonical?.(str)||str}catch(_){return str}};
 function officialSlots(){try{const arr=window.rhEvilR1QA8103?.slots?.();return Array.isArray(arr)?arr:[]}catch(_){return []}}
 // One recorded usage per individual event round (track), never per car or lap.
 // The same track used in another Evil event/stage counts once again. No future plans.
 function rotation(sp){
   const uses=new Map(),dedupe=new Set();
   function add(track,stamp){const name=canon(track);if(!name||name==='Round'||name==='Winter Wonderland Circuit'||!stamp||dedupe.has(stamp))return;dedupe.add(stamp);uses.set(name,(uses.get(name)||0)+1)}
   for(const r of sp.runs||[]){
     if(!evil(r))continue;
     const rounds=new Map((r.rounds||[]).map(x=>[text(x.id),x]));
     for(const res of r.results||[]){
       if(!timed(res))continue;
       const rd=rounds.get(text(res.roundId));
       const track=res.roundName||res.track||rd?.name||rd?.trackName;
       const rid=res.roundId||track;
       add(track,`run:${r.id}:round:${rid}`);
     }
     // Some Swiss/KOs save results only in match objects. Use stage only
     // where its matches have an actual time; dedupe with the standard run rounds.
     const swiss=r.v8Swiss;
     if(swiss){
       const ss=[...(swiss.swissRounds||[]),...(swiss.ko?.rounds||[])];
       for(const rd of ss){
         if(!(rd?.matches||[]).some(m=>timed(m.resultA)||timed(m.resultB)))continue;
         add(rd.trackName||rd.name,`run:${r.id}:round:${rd.id||rd.index}`);
       }
     }
   }
   for(const ro of sp.raceOffs||[]){
     if(!evil(ro))continue;
     for(const rd of ro.rounds||[]){
       if(!(rd.matches||[]).some(m=>timed(m.resultA)||timed(m.resultB)||(m.attempts||[]).some(timed)))continue;
       add(rd.name||rd.trackName,`ro:${ro.id}:round:${rd.id||rd.number}`);
     }
   }
   const rows=[...uses].map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name));
   return {rows,total:[...uses.values()].reduce((a,b)=>a+b,0),unique:uses.size};
 }
 function swiss(sp){
   return (sp.runs||[]).filter(r=>evil(r)&&r.format==='swiss'&&r.v8Swiss).map(r=>{
     const state=r.v8Swiss,isKo=state.phase==='ko',rounds=isKo?(state.ko?.rounds||[]):(state.swissRounds||[]);
     const index=Number(isKo?state.ko?.currentRound:state.currentRound)||0,round=rounds[index]||rounds.find(x=>x.status==='racing')||null;
     const matches=round?.matches||[],completed=matches.filter(m=>timed(m.resultA)&&timed(m.resultB)).length;
     return {name:text(r.name||'Swiss Cup'),phase:isKo?'Knockout':'Swiss',label:round?.label||'Round not started',done:completed,total:matches.length,status:round?.status||'waiting'};
   });
 }
 function pulse(sp,slots){
   const p=campaign(sp),done=p?.done||{},known=new Set(slots.map(x=>text(x.slot))),confirmed=slots.filter(x=>text(done[text(x.slot)]?.eventId)===text(x.eventId)).length;
   let cars=0;try{cars=window.rhEvilUsedLedger8167?.(sp)?.size||0}catch(_){ }
   const next=slots.find(x=>text(done[text(x.slot)]?.eventId)!==text(x.eventId));
   return {done:confirmed,total:slots.length,remain:Math.max(0,slots.length-confirmed),cars,next};
 }
 function make(){
   const sp=space(),p=campaign(sp);if(!sp||!p)return;
   const slots=officialSlots(),progress=pulse(sp,slots),rot=rotation(sp),cups=swiss(sp);
   document.getElementById('otgNoticeOverlay8172')?.remove();
   const overlay=document.createElement('div');overlay.id='otgNoticeOverlay8172';overlay.className='otgNoticeOverlay8172';
   overlay.innerHTML=`<section class="otgNoticeSheet8172" role="dialog" aria-modal="true" aria-labelledby="otgNoticeTitle8172">
      <header class="otgNoticeHead8172"><div><small>EVIL TOURNAMENT · GARAGE NOTICEBOARD</small><h2 id="otgNoticeTitle8172">THE SMALL JOBS DEPARTMENT</h2></div><button type="button" data-otg-close aria-label="Close noticeboard">✕</button></header>
      <main>
      <section class="otgNoticeCard8172"><h3>🏁 CAMPAIGN PULSE</h3><div class="otgNoticeStats8172">
       <div><b>${progress.done}<small> / ${progress.total||'—'}</small></b><span>Completed slots</span></div><div><b>${progress.remain}</b><span>Still to go</span></div><div><b>${progress.cars}</b><span>Cars with saved Evil results</span></div></div>
       <p>${progress.next?`Next uncompleted slot: <strong>${String(progress.next.slot).padStart(4,'0')}</strong> · ${E(progress.next.event||progress.next.family||'Next competition')}`:'All saved tournament slots completed or currently unavailable.'}</p><small>Counts confirmed DONE visits, not AI race wins, rankings or levels.</small></section>
      <section class="otgNoticeCard8172"><h3>🎨 THE E✓ LEGEND</h3><p>E✓ means this car has a <strong>previously recorded Evil Tournament result</strong>. It does not confirm any upgrade.</p>
       <div class="otgNoticeLegend8172"><span class="road">E✓ <small>Road / street / normal</small></span><span class="off">E✓ <small>Off-road / dirt / rally</small></span><span class="drift">E✓ <small>Drift</small></span></div>
       <small>Colour comes from the car's most recent saved Evil result, not the next event.</small></section>
      <section class="otgNoticeCard8172"><h3>⌖ EVIL TRACK ROTATION</h3><p><strong>${rot.unique} different tracks</strong> used across <strong>${rot.total} recorded rounds/stages</strong> in this Evil campaign.</p>
       <div class="otgNoticeTracks8172">${rot.rows.length?rot.rows.slice(0,12).map((x,i)=>`<div><span><i>${String(i+1).padStart(2,'0')}</i>${E(x.name)}</span><b>${x.count}×</b></div>`).join(''):'<p>No timed Evil race results yet.</p>'}</div>
       <small>One use = at least one saved timed result in that event round/stage; not each car's run. Drift zones and scheduled future rounds aren't counted. Tracks may repeat across separate stages.</small>
       <button type="button" class="otgNoticeLink8172" data-otg-directory>OPEN EXISTING FH5 TRACK DIRECTORY ↗</button>
       <small>Your Track Directory already shows <strong>USED X TIMES</strong> for all racing in this FH5 Space, including Festival, Race Off and Custom. This panel is <em>Evil-only</em>.</small></section>
      <section class="otgNoticeCard8172"><h3>🇨🇭 SWISS ROUND CHECK</h3>${cups.length?cups.map(x=>`<div class="otgNoticeSwiss8172"><b>${E(x.name)}</b><span>${E(x.phase)} · ${E(x.label)} · ${x.done}/${x.total} pairings completed · ${E(x.status)}</span></div>`).join(''):'<p>No live Evil Swiss Cup saved yet.</p>'}
       <small>Read-only status check. This does not start, advance or finish a Swiss round. The new Swiss screen still needs a real phone screenshot for visual QA.</small></section>
       <p class="otgNoticeFoot8172">Chief Tech Penguin has reviewed the numbers. Dave and Steve have requested that nobody audits the biscuit budget.</p>
      </main></section>`;
   overlay.addEventListener('click',e=>{
     if(e.target===overlay||e.target.closest('[data-otg-close]')){overlay.remove();return}
     if(e.target.closest('[data-otg-directory]')){
       if(typeof window.rhOpenTrackDirectory8073==='function'){
         overlay.remove();window.rhOpenTrackDirectory8073();
       }else alert('Track Directory is unavailable in this Space.');
     }
   });
   overlay.addEventListener('keydown',e=>{if(e.key==='Escape')overlay.remove()});
   document.body.appendChild(overlay);
   overlay.querySelector('[data-otg-close]')?.focus({preventScroll:true});
 }
 function inject(){
   const sp=space();if(!campaign(sp))return;
   const home=document.getElementById('evilcampaign');
   const strip=home?.querySelector('.rhEvilR1Actions8097');
   if(!strip||strip.querySelector('[data-otg-noticeboard]'))return;
   const button=document.createElement('button');button.type='button';button.dataset.otgNoticeboard='1';
   button.innerHTML='<span aria-hidden="true">📋</span><b>GARAGE NOTICEBOARD</b><small>E✓ colours · Evil track rotation · career pulse · Swiss check</small>';
   button.addEventListener('click',make);strip.appendChild(button);
 }
 let pending=false;
 function queue(){if(pending)return;pending=true;(window.requestAnimationFrame||((f)=>setTimeout(f,20)))(()=>{pending=false;try{inject()}catch(e){console.warn('OTG Noticeboard (optional) failed:',e)}})}
 function start(){const el=document.getElementById('evilcampaign');if(!el)return;
   new MutationObserver(queue).observe(el,{childList:true,subtree:false});queue();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
 window.otgEvilNoticeQA8172={rotation,pulse,swiss,open:make,inject};
})();
