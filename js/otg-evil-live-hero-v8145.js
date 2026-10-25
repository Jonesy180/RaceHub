/* OTG! MAIN v8.0.145 — Evil R1 live RACING header artwork, visual-only.
 * Shows approved v8.0.144 images on the actual Festival / Race Off event screens.
 * The campaign landing and personal original sponsor hero are untouched.
 * No mutation of saved races, results, Spaces, or tournament progression.
 */
(()=>{
 'use strict';
 const ROOT='assets/tournaments/evil-art-v8144-';
 const IMAGES=new Set(['manufacturers','era','class','category','themed','mixed','forza-edition','drift','race-cars','off-road','favourite-festival','favourite-race-off','finals']);
 const FAMILY=Object.freeze({
   'Manufacturer':'manufacturers','Era Championship':'era','Class / Type':'class',
   'Vintage & Classic':'themed','Festival':'mixed','Swiss Cup':'mixed',
   'Hot Wheels':'category','Drag Racing':'category','Forza Edition':'forza-edition',
   'Drift':'drift','Race Cars':'race-cars','Off-Road / Buggy':'off-road',
   'Rally Adventure':'off-road'
 });
 const q=(r,s)=>r?.querySelector(s)||null;
 const norm=s=>String(s||'').trim().replace(/\s+/g,' ').toLowerCase();
 const eq=(a,b)=>String(a||'')===String(b||'');
 function activeSpace(){try{return typeof window.rhSpace==='function'?window.rhSpace():null}catch(_){return null}}
 function slotFor(record){
   // Actual numbered Evil R1 slots, including dynamically inserted Favourite Manufacturer visits.
   const marker=record?.evilCampaignR1;
   if(!marker||!Number.isInteger(Number(marker.slot))||Number(marker.slot)<1)return null;
   const provider=window.rhEvilR1QA8103?.slots;
   if(typeof provider!=='function')return null;
   let list;try{list=provider()}catch(_){return null}
   if(!Array.isArray(list))return null;
   return list.find(s=>Number(s.slot)===Number(marker.slot)&&eq(s.eventId,record.value))||null;
 }
 function artwork(slot){
   if(!slot)return null;
   const family=String(slot.family||''),event=String(slot.event||''),id=String(slot.eventId||'');
   if(family==='Favourite Manufacturer'){
     if(/Race Off Night/i.test(event))return 'favourite-race-off';
     if(/Festival Night/i.test(event))return 'favourite-festival';
     return null;
   }
   // The final N-ALL-RO visit at the back of the personal R1 playlist.
   if(id==='N-ALL-RO'&&Number(slot.slot)>=1184)return 'finals';
   return FAMILY[family]||null;
 }
 function recordByName(records,hero){
   const heading=norm(q(hero,'h1')?.textContent);
   if(!heading)return null;
   const matches=(records||[]).filter(x=>x?.evilCampaignR1&&norm(x.name)===heading);
   // Avoid guessing if two different R1 events happen to share a title.
   return matches.length===1?matches[0]:null;
 }
 function raceTarget(root,space){
   const scene=q(root,'.rhRaceOffDrawSceneV6118, .rhRaceOffRoundSceneV6122, .rhRaceOffRoundSceneV6119');
   if(!scene)return null; // Not the Race Off landing page, old history, or result-entry form.
   const hero=q(scene,'.rhRaceOffHeroV1');if(!hero)return null;
   const ro=recordByName(space.raceOffs,hero);if(!ro)return null;
   return {hero,slot:slotFor(ro)};
 }
 function festivalTarget(root,space){
   // Actual active festival group/standard running pages; never the Festival landing/setup.
   const group=q(root,'.v8GroupPage .rhOverviewHeroV1');
   const standard=q(root,'.rhChamp33 .rhChamp34Hero');
   const hero=group||standard;
   if(!hero)return null;
   if(!q(root,'.rhCurrentCarV1, .v8StageCard, .rhChamp33Current'))return null;
   const r=recordByName(space.runs,hero);if(!r)return null;
   return {hero,slot:slotFor(r)};
 }
 function paint(target){
   if(!target?.hero)return;
   const name=artwork(target.slot);
   if(!IMAGES.has(name))return;
   const hero=target.hero;
   if(hero.dataset.otgEvilLiveArt8145===name)return;
   const url=`${ROOT}${name}.webp?v=8144`;
   // CSS is an override of the existing header photograph, not an extra slot-details card.
   hero.style.setProperty('--otg-evil-live-art8145',`url("${url}")`);
   hero.dataset.otgEvilLiveArt8145=name;
   hero.classList.add('otgEvilLiveHero8145');
   hero.setAttribute('data-otg-evil-illustration',name);
 }
 function refresh(){
   const s=activeSpace();if(s?.catalogueKey!=='fh5-catalogue-v1')return;
   const race=document.getElementById('raceoff');
   const festival=document.getElementById('festival');
   if(race&&!race.classList.contains('hidden'))paint(raceTarget(race,s));
   if(festival&&!festival.classList.contains('hidden'))paint(festivalTarget(festival,s));
 }
 function init(){
   const roots=['raceoff','festival'].map(x=>document.getElementById(x)).filter(Boolean);
   if(!roots.length)return;
   let queued=false;
   const schedule=()=>{
     if(queued)return;queued=true;
     const raf=window.requestAnimationFrame||((fn)=>setTimeout(fn,16));
     raf(()=>{queued=false;try{refresh()}catch(err){console.warn('OTG visual hero:',err)}});
   };
   if(typeof MutationObserver==='function'){
     for(const root of roots)new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
   }
   // Some screens are revisited without a DOM redraw; keep these hooks read-only.
   document.addEventListener('click',()=>setTimeout(schedule,0),{passive:true});
   window.addEventListener('pageshow',schedule);
   schedule();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
