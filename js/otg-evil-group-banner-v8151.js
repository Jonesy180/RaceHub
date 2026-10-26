/* OTG! MAIN v8.0.151 — reliable R1 Festival group image, independent of legacy hero CSS.
 * A standalone <figure><img> above a VERIFIED live Evil Festival group header.
 * No changing the existing 13 approved images, no data writes, no Hall of Shame changes.
 */
(()=>{
 'use strict';
 const ROOT='assets/tournaments/evil-art-v8144-';
 const FAMILIES=Object.freeze({
  'Manufacturer':'manufacturers','Era Championship':'era','Class / Type':'class',
  'Vintage & Classic':'themed','Festival':'mixed','Swiss Cup':'mixed',
  'Hot Wheels':'category','Drag Racing':'category','Forza Edition':'forza-edition',
  'Drift':'drift','Race Cars':'race-cars','Off-Road / Buggy':'off-road','Rally Adventure':'off-road'
 });
 const KNOWN=new Set(['manufacturers','era','class','category','themed','mixed',
  'forza-edition','drift','race-cars','off-road','favourite-festival','favourite-race-off','finals']);
 const norm=v=>String(v??'').trim().replace(/\s+/g,' ').toLowerCase();
 const eq=(a,b)=>String(a??'')===String(b??'');
 const activeSpace=()=>{try{return typeof window.rhSpace==='function'?window.rhSpace():null}catch(_){return null}};
 function runs(){
  const s=activeSpace();
  if(s?.catalogueKey!=='fh5-catalogue-v1')return [];
  const spaceRuns=Array.isArray(s.runs)?s.runs:[];
  try{const live=window.rhCurrentRuns?.();if(Array.isArray(live)&&live.length)return live}catch(_){ }
  return spaceRuns;
 }
 function slots(){try{const x=window.rhEvilR1QA8103?.slots?.();return Array.isArray(x)?x:[]}catch(_){return []}}
 function runAndSlot(r){
  const m=r?.evilCampaignR1;
  if(!m||!eq(m.eventId,r.value)||!Number.isInteger(Number(m.slot))||Number(m.slot)<1)return null;
  const sl=slots().find(s=>Number(s.slot)===Number(m.slot)&&eq(s.eventId,m.eventId));
  return sl?{run:r,slot:sl}:null;
 }
 function artFor(slot){
  if(!slot)return null;
  if(slot.family==='Favourite Manufacturer'){
   if(/Race Off Night/i.test(slot.event||''))return 'favourite-race-off';
   if(/Festival Night/i.test(slot.event||''))return 'favourite-festival';
   return null;
  }
  if(String(slot.eventId)==='N-ALL-RO'&&Number(slot.slot)>=1184)return 'finals';
  const art=FAMILIES[slot.family];
  return KNOWN.has(art)?art:null;
 }
 function badgeSlot(root){
  const badge=root.querySelector('.rhEvilR1Return8098');
  const number=badge?.textContent?.match(/\bSLOT\s*0*(\d+)\b/i);
  return number?Number(number[1]):null;
 }
 function eventIdFromControls(root){
  for(const node of root.querySelectorAll('[onclick]')){
   const cmd=node.getAttribute('onclick')||'';
   const m=cmd.match(/\b(?:rhEnterResult|rhOpenRun|rhV8DrawNextGroup|rhV8PrepareNextStage|rhV8RenderStageSetup)\s*\(\s*['"]([^'"]+)['"]/);
   if(m)return m[1];
  }
  return null;
 }
 function resolve(root,preferredId){
  const group=root.querySelector('.v8GroupPage');
  if(!group||!group.querySelector(':scope > .rhOverviewHeroV1'))return null;
  // Prefer the authenticated return badge: the existing R1 controller only adds it
  // to actual Evil events, carrying the numbered slot. No title guessing needed.
  const marker=badgeSlot(root);
  if(marker!=null){
   const matches=runs().map(runAndSlot).filter(x=>x&&Number(x.slot.slot)===marker);
   if(matches.length===1)return matches[0];
   return null; // A conflicting marker must never be overridden with a stale run.
  }
  // The renderer's own inline run ID is the next strongest source of identity.
  const domId=eventIdFromControls(root);
  if(domId){
   const record=runs().find(r=>eq(r.id,domId));
   return runAndSlot(record);
  }
  // During initial synchronous render (before the R1 return badge is appended),
  // accept an explicit rhOpenRun(id) if the visible title agrees with that run.
  const h=group.querySelector('.otgOverviewStrip8146 h1, .rhOverviewHeroV1 h1')
    ||root.querySelector('.otgOverviewStrip8146 h1');
  const shown=norm(h?.textContent);
  if(preferredId){
   const direct=runAndSlot(runs().find(r=>eq(r.id,preferredId)));
   if(direct&&shown===norm(direct.run.name))return direct;
  }
  if(shown){
   const matches=runs().map(runAndSlot).filter(x=>x&&norm(x.run.name)===shown);
   if(matches.length===1)return matches[0];
  }
  return null;
 }
 function mount(resolved){
  const host=document.getElementById('festival');
  const group=host?.querySelector('.v8GroupPage');
  const header=group?.querySelector(':scope > .rhOverviewHeroV1');
  if(!group||!header||!resolved)return false;
  const key=artFor(resolved.slot);if(!key)return false;
  const url=`${ROOT}${key}.webp?v=8144`;
  const old=group.querySelector(':scope > .otgEvilGroupBanner8151');
  if(old?.dataset.artKey===key)return false;
  old?.remove();
  const figure=document.createElement('figure');
  figure.className='otgEvilGroupBanner8151';
  figure.dataset.artKey=key;
  figure.dataset.eventId=String(resolved.slot.eventId);
  figure.dataset.slot=String(resolved.slot.slot);
  const img=document.createElement('img');
  img.src=url;img.alt='';img.setAttribute('aria-hidden','true');
  img.decoding='async';img.loading='eager';
  figure.appendChild(img);
  group.insertBefore(figure,header);
  group.classList.add('otgEvilGroupArtMounted8151');
  return true;
 }
 function refresh(preferredId){
  const root=document.getElementById('festival');
  if(!root||root.classList.contains('hidden'))return false;
  const found=resolve(root,preferredId);return found?mount(found):false;
 }
 function wrap(name){
  const base=window[name];if(typeof base!=='function'||base._otgGroupArt8151)return;
  function wired(...args){
   const out=base.apply(this,args);
   try{refresh(args[0]);}catch(e){console.warn('OTG group art render:',e)}
   return out;
  }
  wired._otgGroupArt8151=true;
  window[name]=wired;
 }
 function init(){
  // Observe the R1 return button appearing after the group renderer's own timer.
  // The observer watches ONLY direct festival children: inserting inside the group
  // cannot retrigger it and cannot recreate the Hall of Shame freeze.
  const root=document.getElementById('festival');
  if(root&&typeof MutationObserver==='function'){
   let queued=false;
   new MutationObserver(()=>{
    if(queued)return;queued=true;
    (window.requestAnimationFrame||((cb)=>setTimeout(cb,16)))(()=>{queued=false;try{refresh()}catch(e){console.warn('OTG group art observer:',e)}});
   }).observe(root,{childList:true,subtree:false});
  }
  document.addEventListener('click',()=>setTimeout(()=>refresh(),0),{passive:true});
  window.addEventListener('pageshow',()=>refresh());
  refresh();
 }
 for(const name of ['rhOpenRun','rhV8DrawNextGroup','rhV8RenderStageSetup',
  'rhV8PrepareNextStage','rhV8GroupReveal'])wrap(name);
 window.rhEvilGroupArtQA8151={resolve,refresh,artFor,runAndSlot};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
