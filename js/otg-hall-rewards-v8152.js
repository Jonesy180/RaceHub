/* OTG! MAIN v8.0.152 — Hall of Shame EARNED REWARDS, not event-hero roulette.
 * PERSONAL MAIN ONLY. Existing 13 tournament hero images remain untouched.
 * This file contains NO secret image content or descriptive spoilers.
 * Future art packs can install window.rhHosRewardAssets8152 = [{id:'HOS-0001',src:'assets/hall-of-shame/HOS-0001.webp'}, ...].
 * A reward is earned from the controller's VERIFIED slot-done state, never a race result or an unverified click.
 */
(()=>{
 'use strict';
 const KEY='evilHallRewards8152';
 const CAMPAIGN='evil-specialist-r1-20261014';
 const ENGINE='R1-SECRET-REWARDS-1';
 const START=20;
 const LIMIT=1219;
 const PREVIEW_LOCKS=48;
 const $=(r,s)=>r?.querySelector?.(s)||null;
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const now=()=>new Date().toISOString();
 function activeSpace(){try{return typeof window.rhSpace==='function'?window.rhSpace():null}catch(_){return null}}
 function space(){const s=activeSpace();return s?.catalogueKey==='fh5-catalogue-v1'?s:null}
 function persist(){try{window.rhSave?.()}catch(err){console.warn('Hall of Shame save failed',err)}}
 function schedule(){
   // Seeded, durable, deliberately irregular milestone placements: never regenerate a
   // different reward-slot mapping on reboot, after an app update, or offline.
   let seed=0x54B3E91D;
   const random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return (seed>>>0)/4294967296};
   const out=[];
   let at=START;
   while(at<=LIMIT){
     out.push({slot:at,id:`HOS-${String(out.length+1).padStart(4,'0')}`});
     at += random()<0.12?2:(3+Math.floor(random()*7));
   }
   return out;
 }
 const MILESTONES=schedule();
 const BY_SLOT=new Map(MILESTONES.map(x=>[x.slot,x]));
 const BY_ID=new Map(MILESTONES.map(x=>[x.id,x]));
 function ensure(){
   const s=space(); if(!s)return null;
   let h=s[KEY];
   if(!h||typeof h!=='object'||Array.isArray(h)){
     h={version:ENGINE,earnedSlots:{},discovered:{},seen:{},createdAt:now()};
     s[KEY]=h;persist();
   }
   if(!h.earnedSlots||typeof h.earnedSlots!=='object')h.earnedSlots={};
   if(!h.discovered||typeof h.discovered!=='object')h.discovered={};
   if(!h.seen||typeof h.seen!=='object')h.seen={};
   return h;
 }
 function assets(){
   const input=typeof window.rhHosRewardAssets8152==='function'
     ?window.rhHosRewardAssets8152():window.rhHosRewardAssets8152;
   const list=Array.isArray(input)?input:[];
   const byId=new Map();
   for(const item of list){
     if(!item||!BY_ID.has(String(item.id)))continue;
     const src=String(item.src||'');
     // Art must be bundled locally; never fetch remote previews. Fail closed.
     if(!/^assets\/hall-of-shame\/HOS-\d{4}\.(?:webp|png|jpe?g)$/i.test(src))continue;
     byId.set(String(item.id),{id:String(item.id),src,thumb:src});
   }
   return byId;
 }
 function doneMap(){
   const p=space()?.evilCampaignR18098;
   if(!p||p.campaignId!==CAMPAIGN)return null;
   return p.done&&typeof p.done==='object'?p.done:null;
 }
 function reconcile(){
   const h=ensure(),done=doneMap();if(!h||!done)return {earned:0,delivered:0};
   const available=assets();let changed=false,earned=0,delivered=0;
   // Guard against any historical re-numbering or stray status entry: a saved
   // DONE must match the current official slot/event identity.
   let official=null;
   try{const rows=window.rhEvilR1QA8103?.slots?.();if(Array.isArray(rows))official=new Map(rows.map(x=>[Number(x.slot),String(x.eventId)]))}catch(_){}
   for(const m of MILESTONES){
     const mark=done[String(m.slot)];
     if(!mark||mark.eventId==null||(official&&!official.has(m.slot))||(official&&official.get(m.slot)!==String(mark.eventId)))continue;
     if(!h.earnedSlots[String(m.slot)]){
       h.earnedSlots[String(m.slot)]={id:m.id,slot:m.slot,eventId:String(mark.eventId),earnedAt:String(mark.doneAt||now())};
       earned++;changed=true;
     }
   }
   for(const record of Object.values(h.earnedSlots)){
     if(!record?.id||!available.has(record.id)||h.discovered[record.id])continue;
     h.discovered[record.id]={id:record.id,slot:record.slot,firstSeenAt:now(),earnedAt:record.earnedAt};
     delivered++;changed=true;
   }
   if(changed)persist();
   return {earned,delivered};
 }
 function summary(){
   reconcile();
   const h=ensure();if(!h)return {discovered:0,pending:0,packInstalled:false};
   const installed=assets();
   const pending=Object.values(h.earnedSlots).filter(x=>!h.discovered[x.id]).length;
   return {discovered:Object.keys(h.discovered).length,pending,packInstalled:installed.size>0,available:installed.size};
 }
 function slotLabel(n){return String(n).padStart(4,'0')}
 function teaserHTML(){
   const s=summary();
   const line=s.discovered?`${s.discovered} DISCOVERED • MORE CLASSIFIED`:s.packInstalled?'0 DISCOVERED • ALL CLASSIFIED':'VAULT ARMED • CLASSIFIED COLLECTION PENDING';
   const desc=s.packInstalled
     ?'Secret artwork is awarded for surviving selected Evil Tournament slots. Discoveries stay yours.'
     :'Complete selected Evil Tournament slots to bank hidden rewards. Artwork will appear when the classified collection is delivered.';
   return `<section class="otgHosTeaser8147 otgHosEarned8152" aria-label="Hall of Shame"><div><span class="eyebrow">TOP SECRET • EARNED REWARDS</span><h2>HALL OF SHAME</h2><p>${desc}</p><div class="otgHosStatus8147">🔒 ${line}</div></div><button type="button" onclick="rhOpenHallOfShame8147()">OPEN THE VAULT ›</button></section>`;
 }
 function decorateLanding(){
   const root=document.getElementById('evilcampaign');
   const body=$(root,'main.rhEvilR1Body8097');
   if(!body||!$(body,'.rhEvilR1Stats8097'))return;
   const current=$(body,'.otgHosTeaser8147');
   // Never repaint the existing teaser: the old observer feedback loop froze Evil R1.
   if(current)return;
   const anchor=$(body,'.otgHubbsTeaser8123')||$(body,'.rhEvilR1MainNext8101')||$(body,'.rhEvilR1Stats8097');
   anchor?.insertAdjacentHTML('afterend',teaserHTML());
 }
 function previewGrid(){
   const h=ensure();if(!h)return '';
   const available=assets(),unlocked=Object.keys(h.discovered)
     .filter(id=>available.has(id)).sort((a,b)=>Number(a.slice(-4))-Number(b.slice(-4)));
   const cards=unlocked.map(id=>{
     const data=h.discovered[id],art=available.get(id);
     return `<button type="button" class="otgHosCard8147 unlocked otgHosRewardCard8152" onclick="rhViewHallReward8152('${id}')"><img loading="lazy" src="${esc(art.src)}" alt="Hall of Shame reward ${esc(id)}"><div><small>${esc(id)}</small><strong>DISCOVERED</strong><span>EARNED AT SLOT ${slotLabel(data.slot)}</span></div></button>`;
   });
   // The locked wall is intentionally NOT a list of upcoming slot numbers or reward dates.
   // The archive deliberately conceals how many secrets exist and where they unlock.
   const showLocks=Math.max(12, PREVIEW_LOCKS-Math.min(PREVIEW_LOCKS,unlocked.length));
   for(let i=0;i<showLocks;i++){
     cards.push(`<article class="otgHosCard8147 locked"><div class="lock" aria-hidden="true">🔒</div><div><small>SEALED DOSSIER</small><strong>CLASSIFIED</strong><span>KEEP RACING TO UNLOCK</span></div></article>`);
   }
   return cards.join('');
 }
 function pageHTML(){
   const s=summary();
   const status=s.packInstalled?'REWARD COLLECTION ONLINE':'CLASSIFIED ARTWORK DELIVERY PENDING';
   return `<div class="rhEvilR18097 otgHosPage8147 otgHosRewardsPage8152"><button type="button" class="rhEvilR1Back8097" onclick="rhRenderEvilCampaignR18098()"><span>‹</span><b>BACK</b></button><main class="rhEvilR1Body8097"><section class="otgHosHero8147"><small>OUT THE GARAGE! • PRIVATE COLLECTION</small><h2>HALL OF SHAME</h2><p>Earn secret pictures by marking selected Evil Tournament slots DONE. The reward schedule and undiscovered artworks are classified.</p></section><section class="otgHosStats8147"><article><small>DISCOVERED</small><strong>${s.discovered}</strong><span>PERMANENTLY UNLOCKED</span></article><article><small>COLLECTION</small><strong>CLASSIFIED</strong><span>${status}</span></article><article><small>REWARDS</small><strong>UNPREDICTABLE</strong><span>AWARDED AT SLOT COMPLETION</span></article></section><section class="otgHosCopy8147"><p>${s.packInstalled?'Tap an unlocked picture to view it. Everything else stays under wraps.':'The rewards engine is ready. Completed eligible slots are credited even before their artwork arrives; no earned reward will be lost.'}</p></section><section class="otgHosGrid8147">${previewGrid()}</section></main></div>`;
 }
 function openPage(){
   const root=document.getElementById('evilcampaign');if(!root||!space())return;
   summary();
   try{window.show?.('evilcampaign')}catch(_){root.classList.remove('hidden')}
   root.innerHTML=pageHTML();
   window.scrollTo?.(0,0);
   // If art was installed after earlier completions, reveal the FIRST waiting item
   // only on deliberate gallery entry, never unexpectedly on startup.
   const h=ensure(),m=assets();
   const waiting=Object.keys(h?.discovered||{}).find(id=>m.has(id)&&!h.seen[id]);
   if(waiting)setTimeout(()=>showReward(waiting),80);
 }
 function closeReward(){document.getElementById('otgHosRewardOverlay8152')?.remove()}
 function showReward(id){
   const h=ensure(),asset=assets().get(String(id));
   if(!h?.discovered[id]||!asset)return false;
   closeReward();
   const el=document.createElement('div');
   el.id='otgHosRewardOverlay8152';el.className='otgHosRewardOverlay8152';
   el.innerHTML=`<section role="dialog" aria-modal="true" aria-label="Hall of Shame reward"><small>🏆 SECRET REWARD UNLOCKED</small><h2>HALL OF SHAME</h2><div class="otgHosRewardImage8152"><img src="${esc(asset.src)}" alt="New Hall of Shame artwork ${esc(id)}"></div><p>YOU SURVIVED SLOT ${slotLabel(h.discovered[id].slot)}.</p><button type="button" class="otgHosDismiss8152">BACK TO THE EVIL TOURNAMENT</button></section>`;
   el.querySelector('.otgHosDismiss8152').addEventListener('click',closeReward);
   document.body.appendChild(el);
   h.seen[id]=now();persist();
   return true;
 }
 function wrapComplete(){
   const base=window.rhEvilSetR1Status8098;
   if(typeof base!=='function'||base._otgHosRewards8152)return;
   function onSet(n,want){
     const slot=Number(n),reward=BY_SLOT.get(slot);
     const before=!!doneMap()?.[String(slot)];
     const result=base.apply(this,arguments);
     const after=!!doneMap()?.[String(slot)];
     if(want==='done'&&!before&&after&&reward){
       reconcile();
       const h=ensure();
       if(h?.discovered[reward.id]&&!h.seen[reward.id])setTimeout(()=>showReward(reward.id),0);
     }
     return result;
   }
   onSet._otgHosRewards8152=true;
   window.rhEvilSetR1Status8098=onSet;
 }
 function wrapLanding(name){
   const base=window[name];if(typeof base!=='function'||base._otgHosRewards8152)return;
   function onPage(){const result=base.apply(this,arguments);try{decorateLanding()}catch(err){console.warn('Hall of Shame landing',err)}return result}
   onPage._otgHosRewards8152=true;
   window[name]=onPage;
 }
 function init(){
   // No poller and no continuous writes: avoids the v8.0.147 app-freeze regression.
   reconcile();wrapComplete();
   wrapLanding('rhOpenEvilCampaignR18098');wrapLanding('rhRenderEvilCampaignR18098');
   const root=document.getElementById('evilcampaign');
   if(root&&typeof MutationObserver==='function'){
     let pending=false;
     new MutationObserver(()=>{
       if(pending)return;pending=true;
       Promise.resolve().then(()=>{pending=false;decorateLanding()});
     }).observe(root,{childList:true,subtree:true});
   }
   decorateLanding();
 }
 window.rhOpenHallOfShame8147=openPage;
 window.rhViewHallReward8152=showReward;
 window.rhHallRewardsQA8152={schedule:()=>MILESTONES.map(x=>({...x})),summary,reconcile,assets,ensure,openPage,showReward,wrapComplete,storeKey:KEY};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
