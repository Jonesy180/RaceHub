/* OTG! personal MAIN 8.0.149 — same Evil illustration throughout actual racing.
   Bind by frozen Evil event ID / marker, NOT by DOM heading: the 8.0.146 title-strip
   upgrade moves headings out of the hero before the older 8.0.145 matcher runs.
   This is presentation-only. Does not edit races, draws, results or campaign state.
   Also understands future Hall of Shame roulette once a sealed pack is installed.
*/
(()=>{
 'use strict';
 const ART_ROOT='assets/tournaments/evil-art-v8144-';
 const FAMILIES=Object.freeze({
  'Manufacturer':'manufacturers','Era Championship':'era','Class / Type':'class',
  'Vintage & Classic':'themed','Festival':'mixed','Swiss Cup':'mixed',
  'Hot Wheels':'category','Drag Racing':'category','Forza Edition':'forza-edition',
  'Drift':'drift','Race Cars':'race-cars','Off-Road / Buggy':'off-road',
  'Rally Adventure':'off-road'
 });
 const KNOWN=new Set(['manufacturers','era','class','category','themed','mixed','forza-edition','drift','race-cars','off-road','favourite-festival','favourite-race-off','finals']);
 const q=(r,s)=>r?.querySelector?.(s)||null;
 const same=(a,b)=>String(a??'')===String(b??'');
 const normal=v=>String(v||'').trim().replace(/\s+/g,' ').toLowerCase();
 const space=()=>{try{return window.rhSpace?.()||null}catch(_){return null}};
 const host=type=>document.getElementById(type);
 const active=type=>{const el=host(type);return el&&!el.classList.contains('hidden')?el:null};
 let lastSlotKey='',lastSlot=null;
 function record(type,id){
  const s=space();if(s?.catalogueKey!=='fh5-catalogue-v1')return null;
  const rows=type==='raceoff'?s.raceOffs:s.runs;
  return Array.isArray(rows)?rows.find(x=>same(x.id,id)&&x.evilCampaignR1)||null:null;
 }
 function slotFor(rec){
  const m=rec?.evilCampaignR1;
  if(!m?.eventId||!same(m.eventId,rec.value)||!Number.isInteger(Number(m.slot))||Number(m.slot)<1)return null;
  const cacheKey=[space()?.id,rec.id,m.slot,m.eventId].join('|');
  if(cacheKey===lastSlotKey)return lastSlot;
  let slot=null;
  try{
   const list=window.rhEvilR1QA8103?.slots?.();
   if(Array.isArray(list))slot=list.find(x=>Number(x.slot)===Number(m.slot)&&same(x.eventId,m.eventId))||null;
  }catch(err){console.warn('OTG art R1 slot resolution:',err)}
  lastSlotKey=cacheKey;lastSlot=slot;
  return slot;
 }
 function fixedArt(slot){
  if(!slot)return null;
  const family=String(slot.family||'');
  if(family==='Favourite Manufacturer'){
   if(/Race Off Night/i.test(slot.event||''))return 'favourite-race-off';
   if(/Festival Night/i.test(slot.event||''))return 'favourite-festival';
   return null;
  }
  if(String(slot.eventId)==='N-ALL-RO'&&Number(slot.slot)>=1184)return 'finals';
  return FAMILIES[family]||null;
 }
 function illustration(rec){
  if(!rec)return null;
  const slot=slotFor(rec);if(!slot)return null;
  const hos=window.rhEvilHallOfShame8147;
  // Only an explicitly activated and populated sealed pack overrides fixed categories.
  if(hos?.mode?.()==='roulette'&&hos.summary?.()?.packInstalled){
   const id=hos.assignForSlot?.(slot),src=id&&hos.assetUrl?.(id);
   if(id&&src)return {id,src,secret:true};
  }
  const id=fixedArt(slot);
  return KNOWN.has(id)?{id,src:`${ART_ROOT}${id}.webp?v=8144`,secret:false}:null;
 }
 function paintHero(el,art){
  if(!el||!art)return false;
  if(el.dataset.otgEvilContinuity8149===art.id)return false;
  // Single already-cached hero art file; no extra image nodes or new downloads each render.
  el.style.setProperty('--otg-evil-live-art8145',`url("${art.src}")`);
  el.dataset.otgEvilContinuity8149=art.id;
  el.dataset.otgEvilLiveArt8145=art.id;
  el.setAttribute('data-otg-evil-illustration',art.id);
  el.classList.add('otgEvilLiveHero8145','otgEvilContinuityHero8149');
  return true;
 }
 function entryTitleBelow(hero){
  if(!hero||hero.dataset.otgEvilTitleBelow8149==='1')return;
  const head=q(hero,':scope > .rh5801Head');
  if(!head)return;
  const strip=document.createElement('div');
  strip.className='otgEvilEntryStrip8149';
  hero.insertAdjacentElement('afterend',strip);
  strip.appendChild(head);
  hero.dataset.otgEvilTitleBelow8149='1';
 }
 function showOnScreen(type,rec){
  if(!rec)return;
  const root=active(type);if(!root)return;
  const art=illustration(rec);if(!art)return;
  const entry=q(root,'.rh5801Entry > .rh5801Hero');
  if(entry){
   // Time entry, stopwatch and focus remain exactly where the game renderer put them.
   paintHero(entry,art);entryTitleBelow(entry);
   return;
  }
  if(type==='festival'){
   const group=q(root,'.v8GroupPage .rhOverviewHeroV1');
   const standard=q(root,'.rhChamp33 .rhChamp34Hero');
   const hero=group||standard;
   if(hero){paintHero(hero,art);return}
   // Group result saved / stage transition: keep the event image visible as a banner.
   const result=q(root,'.v8GroupPage .v8TrackResult');
   if(result&&!q(root,'.otgEvilRecapHero8149')){
    const figure=document.createElement('div');
    figure.className='otgEvilRecapHero8149';
    figure.setAttribute('role','img');figure.setAttribute('aria-label','The Evil Tournament event artwork');
    paintHero(figure,art);
    result.insertAdjacentElement('beforebegin',figure);
   }
   return;
  }
  const hero=q(root,'.rhRaceOffHeroV1')||q(root,':scope > .rhScene');
  if(hero)paintHero(hero,art);
 }
 function byId(type,id){
  const rec=record(type,id);
  if(rec)showOnScreen(type,rec);
 }
 function wrap(name,type){
  const original=window[name];
  if(typeof original!=='function'||original._otgContinuity8149)return;
  function wired(...args){
   // A one-time marker lookup uses the real event ID supplied by the renderer.
   const rec=record(type,args[0]);
   const value=original.apply(this,args);
   if(rec)showOnScreen(type,rec);
   return value;
  }
  wired._otgContinuity8149=true;
  window[name]=wired;
 }
 function identifyOnPage(type){
  const root=active(type),s=space();if(!root||!s)return null;
  if(type==='festival'){
   const entry=q(root,'.rh5801Entry');
   // Owner shown on result entry screen, though the hero heading has been moved.
   const shown=normal(entry?q(entry,'.rh5801Context small')?.textContent:q(root,'.otgOverviewStrip8146 h1, .rhOverviewHeroV1 h1, .rhChamp34Title h1')?.textContent);
   if(!shown)return null;
   const found=(s.runs||[]).filter(r=>r.evilCampaignR1&&normal(r.name)===shown);
   return found.length===1?found[0]:null;
  }
  const label=normal(q(root,'.otgFestivalStrip8146 h1, .rhRaceOffHeroV1 h1, .rhRaceOffLockedCard h2')?.textContent);
  if(!label)return null;
  const found=(s.raceOffs||[]).filter(ro=>ro.evilCampaignR1&&normal(ro.name)===label);
  return found.length===1?found[0]:null;
 }
 function refresh(){
  for(const type of ['festival','raceoff']){
   if(!active(type))continue;
   // Only a positively identified Evil event. Never infer from the previous page:
   // an ordinary race may have just replaced the very same festival/raceoff root.
   const rec=identifyOnPage(type);
   if(rec)showOnScreen(type,rec);
  }
 }
 function begin(){
  const schedule=()=>setTimeout(()=>{try{refresh()}catch(e){console.warn('OTG event artwork refresh:',e)}},0);
  // DOM swaps (but NOT styling/attributes) only. paintHero itself makes no childList
  // mutations; entry title migration is guarded by a data flag. No endless loop.
  for(const type of ['festival','raceoff']){
   const root=host(type);
   if(root&&typeof MutationObserver==='function'){
    let pending=false;
    new MutationObserver(()=>{
     if(pending)return;pending=true;
     (window.requestAnimationFrame||((cb)=>setTimeout(cb,16)))(()=>{pending=false;refresh()});
    }).observe(root,{childList:true,subtree:false});
   }
  }
  document.addEventListener('click',schedule,{passive:true});
  window.addEventListener('pageshow',schedule);
  schedule();
 }
 // Public rendering pathways, including direct Continue and entered-results recovery.
 for(const name of ['rhOpenRun','rhEnterResult','rhV8GroupReveal','rhV8GroupRecord',
  'rhV8DrawNextGroup','rhV8RenderStageSetup','rhV8PrepareNextStage','rhSaveResultFinal'])wrap(name,'festival');
 for(const name of ['rhRenderRaceOffLocked','rhRaceOffOpenRoundSetup',
  'rhRaceOffRenderDrawReview','rhRaceOffRenderDrawComplete','rhRaceOffRenderRoundProgress',
  'rhRaceOffEnterNext','rhRaceOffRenderChampion','rhRaceOffRenderHistory',
  'rhRaceOffConfirmChampion','rhRaceOffStartRound'])wrap(name,'raceoff');
 window.rhEvilArtworkContinuityQA8149={slotFor,fixedArt,illustration,showOnScreen,identifyOnPage,refresh};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',begin,{once:true});else begin();
})();
