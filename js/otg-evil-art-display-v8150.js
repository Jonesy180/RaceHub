/* OTG! personal MAIN v8.0.150 — verified Evil-event artwork visibility.
 * Fixes missing category illustration with REAL <img> elements, rather than
 * depending on a CSS custom-property background or a heading that was moved.
 * ONLY approved 13 category assets. No Hall of Shame/secret image usage.
 * Read-only presentation: no writes to OTG state, results, backups or progress.
 */
(()=>{
 'use strict';
 const ART='assets/tournaments/evil-art-v8144-';
 const MAP=Object.freeze({
  'Manufacturer':'manufacturers','Era Championship':'era','Class / Type':'class',
  'Vintage & Classic':'themed','Festival':'mixed','Swiss Cup':'mixed',
  'Hot Wheels':'category','Drag Racing':'category','Forza Edition':'forza-edition',
  'Drift':'drift','Race Cars':'race-cars','Off-Road / Buggy':'off-road',
  'Rally Adventure':'off-road'
 });
 const KEYS=new Set(['manufacturers','era','class','category','themed','mixed','forza-edition','drift','race-cars','off-road','favourite-festival','favourite-race-off','finals']);
 const $=(root,sel)=>root?.querySelector?.(sel)||null;
 const text=v=>String(v??'').trim().replace(/\s+/g,' ').toLowerCase();
 const same=(a,b)=>String(a??'')===String(b??'');
 const currentSpace=()=>{try{return window.rhSpace?.()||null}catch(_){return null}};
 function records(type){
  const s=currentSpace();if(s?.catalogueKey!=='fh5-catalogue-v1')return [];
  if(type==='raceoff')return Array.isArray(s.raceOffs)?s.raceOffs:[];
  // rhCurrentRuns is the authoritative run collection in some legacy code paths.
  const fromSpace=Array.isArray(s.runs)?s.runs:[];
  try{const live=window.rhCurrentRuns?.();if(Array.isArray(live)&&live.length)return live}catch(_){ }
  return fromSpace;
 }
 function markerSlot(rec){
  if(!rec?.evilCampaignR1)return null;
  const marker=rec.evilCampaignR1;
  if(!Number.isInteger(Number(marker.slot))||Number(marker.slot)<1)return null;
  // Only the genuine Evil event. Never use name alone for identity.
  if(!same(marker.eventId,rec.value))return null;
  const slots=window.rhEvilR1QA8103?.slots;
  if(typeof slots!=='function')return null;
  try{return slots().find(s=>Number(s.slot)===Number(marker.slot)&&same(s.eventId,rec.value))||null}catch(_){return null}
 }
 function choice(slot){
  if(!slot)return null;
  if(slot.family==='Favourite Manufacturer'){
   if(/Race Off Night/i.test(slot.event||''))return 'favourite-race-off';
   if(/Festival Night/i.test(slot.event||''))return 'favourite-festival';
   return null;
  }
  if(slot.eventId==='N-ALL-RO'&&Number(slot.slot)>=1184)return 'finals';
  return MAP[slot.family]||null;
 }
 function matchesFromMarkup(root,fn){
  for(const node of root.querySelectorAll('[onclick]')){
   const cmd=node.getAttribute('onclick')||'';
   const found=cmd.match(fn);
   if(found)return found[1];
  }
  return null;
 }
 // A real event identifier is present in Continue/SAVE buttons on the v8 group
 // screens and race result entries. The R1 return button offers a safe fallback
 // for the remaining non-entry pages, after stage transitions and some Race Off rounds.
 function directId(root,type){
  if(type==='festival')return (
   matchesFromMarkup(root,/\brhEnterResult\(\s*['"]([^'"]+)['"]/) ||
   matchesFromMarkup(root,/\brhSaveResultFinal\(\s*['"]([^'"]+)['"]/) ||
   matchesFromMarkup(root,/\brhOpenRun\(\s*['"]([^'"]+)['"]/) ||
   matchesFromMarkup(root,/\brhV8(?:DrawNextGroup|RenderStageSetup|PrepareNextStage|GroupReveal)\(\s*['"]([^'"]+)['"]/) || null
  );
  return (
   matchesFromMarkup(root,/\brhRaceOff(?:SaveMatchResult|EnterNext|OpenRoundSetup|AdvanceRound|RenderRoundProgress|RenderDrawReview|RenderDrawComplete|RenderHistory|RenderChampion|StartRound|AskConfirmChampion)\(\s*['"]([^'"]+)['"]/) ||
   matchesFromMarkup(root,/\brhRenderRaceOffLocked\(\s*['"]([^'"]+)['"]/) || null
  );
 }
 function fromReturnMarker(root,type){
  const m=$ (root,'.rhEvilR1Return8098')?.textContent?.match(/\bSLOT\s*0*(\d+)\b/i);
  if(!m)return null;
  const hits=records(type).filter(r=>Number(r.evilCampaignR1?.slot)===Number(m[1])&&markerSlot(r));
  return hits.length===1?hits[0]:null;
 }
 function fromUniqueName(root,type){
  // Last resort on legitimately marked Evil pages. Never match an ordinary event
  // merely because it shares a name with an Evil event.
  if(!$ (root,'.rhEvilR1Return8098'))return null;
  const title=type==='festival'?
   $(root,'.otgOverviewStrip8146 h1, .rhOverviewHeroV1 h1, .rhChamp34Title h1, .rh5801Context small')?.textContent:
   $(root,'.otgFestivalStrip8146 h1, .rhRaceOffHeroV1 h1, .rhResultEntry .rhEyebrow')?.textContent;
  if(!title)return null;
  const hits=records(type).filter(r=>markerSlot(r)&&text(title).includes(text(r.name)));
  return hits.length===1?hits[0]:null;
 }
 function verifiedRecord(root,type){
  if(!root||root.classList.contains('hidden'))return null;
  if(currentSpace()?.catalogueKey!=='fh5-catalogue-v1')return null;
  const id=directId(root,type);
  if(id){
   const exact=records(type).find(r=>same(r.id,id));
   // If the displayed event ID belongs to an ordinary event, do not fall
   // back to any Evil event from a prior screen.
   return exact&&markerSlot(exact)?exact:null;
  }
  return fromReturnMarker(root,type)||fromUniqueName(root,type);
 }
 function imageInto(hero,slot){
  const key=choice(slot);
  if(!KEYS.has(key)||!hero)return false;
  const url=`${ART}${key}.webp?v=8144`;
  const prior=$(hero,':scope > img.otgActualHero8150');
  if(prior?.dataset.artKey===key)return false;
  if(prior)prior.remove();
  const img=document.createElement('img');
  img.className='otgActualHero8150';img.dataset.artKey=key;
  img.src=url;
  img.alt='';img.setAttribute('aria-hidden','true');
  img.loading='eager';img.decoding='async';
  img.addEventListener('error',()=>{img.dataset.failed='1';console.warn('OTG Evil artwork file could not load:',url)},{once:true});
  hero.insertBefore(img,hero.firstChild);
  hero.classList.add('otgEvilImageFrame8150','otgEvilLiveHero8145');
  hero.dataset.otgEvilActualArt8150=key;
  return true;
 }
 function liveHero(root,type){
  if(type==='festival')return (
   $(root,'.v8GroupPage > .rhOverviewHeroV1') ||
   $(root,'.rhChamp33 .rhChamp34Hero') ||
   $(root,'.rh5801Entry > .rh5801Hero') || null
  );
  return (
   $(root,'.rh5801Entry > .rh5801Hero') ||
   $(root,'.rhRaceOffHeroV1') ||
   $(root,'.rhResultSceneFinal') || null
  );
 }
 function paint(type){
  const root=document.getElementById(type);
  const rec=verifiedRecord(root,type);if(!rec)return false;
  const slot=markerSlot(rec);if(!slot)return false;
  const hero=liveHero(root,type);if(!hero)return false;
  return imageInto(hero,slot);
 }
 function refresh(){paint('festival');paint('raceoff')}
 function init(){
  let pending=false;
  const schedule=()=>{
   if(pending)return;
   pending=true;
   (window.requestAnimationFrame||((fn)=>setTimeout(fn,16)))(()=>{
    pending=false;
    try{refresh()}catch(e){console.warn('OTG Evil visible image update:',e)}
   });
  };
  for(const id of ['festival','raceoff']){
   const root=document.getElementById(id);
   if(root&&typeof MutationObserver==='function'){
    new MutationObserver(schedule).observe(root,{childList:true,subtree:false});
   }
  }
  document.addEventListener('click',()=>setTimeout(schedule,0),{passive:true});
  window.addEventListener('pageshow',schedule);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
  schedule();
 }
 window.rhEvilArtDisplayQA8150={choice,markerSlot,directId,verifiedRecord,paint,refresh};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
