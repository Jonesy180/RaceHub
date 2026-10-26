/* OTG! MAIN v8.0.147 — future secret hero roulette bridge.
 * If a sealed art pack is installed and roulette mode is active, a random hero is assigned per Evil event.
 * Until then, the existing fixed category-mapped artwork remains untouched.
 */
(()=>{
 'use strict';
 const q=(r,s)=>r?.querySelector(s)||null;
 const norm=s=>String(s||'').trim().replace(/\s+/g,' ').toLowerCase();
 const eq=(a,b)=>String(a||'')===String(b||'');
 function activeSpace(){try{return typeof window.rhSpace==='function'?window.rhSpace():null}catch(_){return null}}
 function slotFor(record){
   const marker=record?.evilCampaignR1;
   if(!marker||!Number.isInteger(Number(marker.slot))||Number(marker.slot)<1)return null;
   const provider=window.rhEvilR1QA8103?.slots;
   if(typeof provider!=='function')return null;
   let list;try{list=provider()}catch(_){return null}
   if(!Array.isArray(list))return null;
   return list.find(s=>Number(s.slot)===Number(marker.slot)&&eq(s.eventId,record.value))||null;
 }
 function recordByName(records,hero){
   const heading=norm(q(hero,'h1')?.textContent);
   if(!heading)return null;
   const matches=(records||[]).filter(x=>x?.evilCampaignR1&&norm(x.name)===heading);
   return matches.length===1?matches[0]:null;
 }
 function raceTarget(root,space){
   const scene=q(root,'.rhRaceOffDrawSceneV6118, .rhRaceOffRoundSceneV6122, .rhRaceOffRoundSceneV6119');
   if(!scene)return null;
   const hero=q(scene,'.rhRaceOffHeroV1'); if(!hero)return null;
   const ro=recordByName(space.raceOffs,hero); if(!ro)return null;
   return {hero,slot:slotFor(ro)};
 }
 function festivalTarget(root,space){
   const group=q(root,'.v8GroupPage .rhOverviewHeroV1');
   const standard=q(root,'.rhChamp33 .rhChamp34Hero');
   const hero=group||standard; if(!hero)return null;
   if(!q(root,'.rhCurrentCarV1, .v8StageCard, .rhChamp33Current'))return null;
   const r=recordByName(space.runs,hero); if(!r)return null;
   return {hero,slot:slotFor(r)};
 }
 function applySecretArt(target){
   if(!target?.hero||!target?.slot)return;
   const hos=window.rhEvilHallOfShame8147;
   if(!hos||hos.mode()!=='roulette')return;
   hos.syncManifest?.();
   const summary=hos.summary?.();
   if(!summary?.packInstalled)return;
   const id=hos.assignForSlot?.(target.slot); if(!id)return;
   const url=hos.assetUrl?.(id); if(!url)return;
   target.hero.style.setProperty('--otg-evil-live-art8145',`url("${url}")`);
   target.hero.dataset.otgEvilLiveArt8145=id;
   target.hero.classList.add('otgEvilLiveHero8145');
   target.hero.setAttribute('data-otg-evil-illustration',id);
 }
 function refresh(){
   const s=activeSpace(); if(s?.catalogueKey!=='fh5-catalogue-v1')return;
   const race=document.getElementById('raceoff');
   const festival=document.getElementById('festival');
   if(race&&!race.classList.contains('hidden'))applySecretArt(raceTarget(race,s));
   if(festival&&!festival.classList.contains('hidden'))applySecretArt(festivalTarget(festival,s));
 }
 function init(){
   const roots=['raceoff','festival'].map(x=>document.getElementById(x)).filter(Boolean);
   if(!roots.length)return;
   let queued=false;
   const schedule=()=>{ if(queued)return; queued=true; (window.requestAnimationFrame||((fn)=>setTimeout(fn,16)))(()=>{queued=false; try{refresh()}catch(err){console.warn('OTG secret hero roulette:',err)}}); };
   if(typeof MutationObserver==='function') for(const root of roots) new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
   document.addEventListener('click',()=>setTimeout(schedule,0),{passive:true});
   window.addEventListener('pageshow',schedule);
   schedule();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
