/* OTG! MAIN v8.0.147 — Evil Hero Roulette / Hall of Shame foundations.
 * SECRET MACHINERY ONLY: no hidden artwork is bundled here.
 * Safe, data-light scaffolding for future sealed art packs.
 * Does not alter race results, records, car ownership, slot counts, or current fixed hero artwork.
 */
(()=>{
 'use strict';
 const STORE='evilHallOfShame8147';
 const RESERVED_COUNT=60;
 const DEFAULT_MODE='fixed'; // Current visible artwork remains category-based until a secret pack is installed.
 const LOCKED_LABEL='CLASSIFIED';
 const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const q=(r,s)=>r?.querySelector(s)||null;
 const qa=(r,s)=>Array.from(r?.querySelectorAll?.(s)||[]);
 const now=()=>new Date().toISOString();
 const space=()=>{try{return typeof window.rhSpace==='function'?window.rhSpace():null}catch(_){return null}};
 const save=()=>{try{window.rhSave?.()}catch(_){}}
 const show=t=>{try{window.show?.(t)}catch(_){}}
 function ensure(){
  const s=space();
  if(!s||s.catalogueKey!=='fh5-catalogue-v1')return null;
  let store=s[STORE];
  if(!store||typeof store!=='object'){
   store=s[STORE]={
    version:'8.0.147',
    mode:DEFAULT_MODE,
    packInstalled:false,
    packVersion:'',
    reservedCount:RESERVED_COUNT,
    ids:[],
    bag:[],
    nextIndex:0,
    eventAssignments:{},
    discovered:{},
    createdAt:now(),
    updatedAt:now()
   };
   save();
  }
  if(!Array.isArray(store.ids))store.ids=[];
  if(!Array.isArray(store.bag))store.bag=[];
  if(!store.eventAssignments||typeof store.eventAssignments!=='object')store.eventAssignments={};
  if(!store.discovered||typeof store.discovered!=='object')store.discovered={};
  if(!Number.isInteger(Number(store.reservedCount))||Number(store.reservedCount)<0)store.reservedCount=RESERVED_COUNT;
  if(typeof store.mode!=='string')store.mode=DEFAULT_MODE;
  return store;
 }
 function manifest(){
  const src=window.rhSecretHeroManifest8147;
  const list=typeof src==='function'?src():src;
  if(!Array.isArray(list))return [];
  return list
   .filter(x=>x&&typeof x==='object'&&x.id&&x.src)
   .map(x=>({id:String(x.id),src:String(x.src),thumb:String(x.thumb||x.src)}));
 }
 function shuffle(a){
  const out=[...a];
  for(let i=out.length-1;i>0;i--){
   const j=Math.floor(Math.random()*(i+1));
   [out[i],out[j]]=[out[j],out[i]];
  }
  return out;
 }
 function syncManifest(){
  const st=ensure(); if(!st)return null;
  const m=manifest();
  if(!m.length){
   st.packInstalled=false;
   st.packVersion='';
   st.updatedAt=now();
   return st;
  }
  const ids=m.map(x=>x.id);
  const changed = ids.join('|') !== st.ids.join('|');
  st.packInstalled=true;
  st.packVersion=String(window.rhSecretHeroManifestVersion8147||'secret-pack-v1');
  st.reservedCount=ids.length;
  if(changed){
   st.ids=[...ids];
   st.bag=shuffle(ids);
   st.nextIndex=0;
   for(const key of Object.keys(st.eventAssignments)){
    const item=st.eventAssignments[key];
    if(!item||!ids.includes(String(item.id)))delete st.eventAssignments[key];
   }
   for(const key of Object.keys(st.discovered))if(!ids.includes(String(key)))delete st.discovered[key];
   st.updatedAt=now();
   save();
  }
  return st;
 }
 function summary(){
  const st=syncManifest()||ensure();
  const discovered=Object.keys(st?.discovered||{}).length;
  const total=Number(st?.reservedCount||0);
  return {discovered,total,packInstalled:!!st?.packInstalled,mode:st?.mode||DEFAULT_MODE,packVersion:st?.packVersion||''};
 }
 function eventKey(slot){
  if(slot?.eventId)return `event:${slot.eventId}`;
  if(Number.isInteger(Number(slot?.slot)))return `slot:${Number(slot.slot)}`;
  return null;
 }
 function metadataFromSlot(slot){
  return {
   slot:Number.isInteger(Number(slot?.slot))?Number(slot.slot):null,
   eventId:String(slot?.eventId||''),
   family:String(slot?.family||''),
   event:String(slot?.event||''),
   mode:String(slot?.mode||''),
   visit:String(slot?.visit||''),
   assignedAt:now()
  };
 }
 function nextId(st){
  if(!st?.ids?.length)return null;
  if(!Array.isArray(st.bag)||st.bag.length!==st.ids.length||st.nextIndex>=st.bag.length){
   st.bag=shuffle(st.ids);
   st.nextIndex=0;
  }
  const id=st.bag[st.nextIndex]||null;
  st.nextIndex=Math.min(st.bag.length,Number(st.nextIndex||0)+1);
  return id;
 }
 function assignForSlot(slot){
  const st=syncManifest();
  if(!st?.packInstalled||st.mode!=='roulette')return null;
  const key=eventKey(slot); if(!key)return null;
  const existing=st.eventAssignments[key];
  if(existing?.id)return existing.id;
  const id=nextId(st); if(!id)return null;
  st.eventAssignments[key]={id,...metadataFromSlot(slot)};
  if(!st.discovered[id])st.discovered[id]={firstSeenAt:now(),firstSlot:Number(slot?.slot)||null,eventId:String(slot?.eventId||''),event:String(slot?.event||''),family:String(slot?.family||'')};
  st.updatedAt=now(); save();
  return id;
 }
 function assignmentForSlot(slot){
  const st=syncManifest()||ensure();
  const key=eventKey(slot); if(!st||!key)return null;
  return st.eventAssignments[key]||null;
 }
 function manifestEntry(id){return manifest().find(x=>x.id===String(id))||null}
 function assetUrl(id){return manifestEntry(id)?.src||null}
 function cardLabel(i){return `${LOCKED_LABEL} ${String(i+1).padStart(3,'0')}`}
 function teaserHTML(){
  const s=summary();
  const status=s.packInstalled?`${s.discovered} / ${s.total} DISCOVERED`:'VAULT READY • SEALED COLLECTION PENDING';
  const copy=s.packInstalled
   ? 'Random secret heroes will unlock here as you naturally encounter them in the Evil Tournament.'
   : 'The classified vault framework is armed. Secret artwork remains sealed until a future private pack is installed.';
  return `<section class="otgHosTeaser8147" aria-label="Hall of Shame"><div><span class="eyebrow">CLASSIFIED VAULT</span><h2>HALL OF SHAME</h2><p>${copy}</p><div class="otgHosStatus8147">${esc(status)}</div></div><button type="button" onclick="rhOpenHallOfShame8147()">OPEN THE VAULT ›</button></section>`;
 }
 function decorateLanding(){
  const root=document.getElementById('evilcampaign'); if(!root) return;
  const body=q(root,'main.rhEvilR1Body8097');
  const stats=q(body,'.rhEvilR1Stats8097');
  if(!body||!stats)return;
  const existing=q(body,'.otgHosTeaser8147');
  if(existing){
   existing.outerHTML=teaserHTML();
   return;
  }
  const anchor=q(body,'.otgHubbsTeaser8123')||q(body,'.rhEvilR1MainNext8101')||stats;
  anchor?.insertAdjacentHTML('afterend',teaserHTML());
 }
 function gridHTML(){
  const s=summary();
  const total=Math.max(s.total||0, s.packInstalled ? 0 : 12);
  const discovered=s.packInstalled?ensure().discovered:{};
  const cards=[];
  for(let i=0;i<total;i++){
   const id=s.packInstalled ? ensure().ids[i] : null;
   const unlocked=id&&discovered[id];
   if(unlocked){
    const art=manifestEntry(id);
    cards.push(`<article class="otgHosCard8147 unlocked"><img src="${esc(art?.thumb||art?.src||'')}" alt="Unlocked Hall of Shame artwork ${esc(id)}" loading="lazy"><div><small>${esc(id)}</small><strong>DISCOVERED</strong><span>FIRST SEEN • SLOT ${esc(unlocked.firstSlot??'—')}</span></div></article>`);
   }else{
    cards.push(`<article class="otgHosCard8147 locked"><div class="lock">🔒</div><div><small>${esc(id||cardLabel(i))}</small><strong>CLASSIFIED</strong><span>UNLOCK BY ENCOUNTERING IT IN THE TOURNAMENT</span></div></article>`);
   }
  }
  return cards.join('');
 }
 function pageHTML(){
  const s=summary();
  const packText=s.packInstalled?`SEALED COLLECTION ONLINE • ${s.total} CLASSIFIED FILES`:'SEALED COLLECTION NOT INSTALLED YET';
  const modeText=s.packInstalled?'ROULETTE ARMED • ONE RANDOM HERO PER NEW EVENT':'FIXED HEROES ACTIVE • ROULETTE STANDBY';
  return `<div class="rhEvilR18097 otgHosPage8147"><button type="button" class="rhEvilR1Back8097" onclick="rhRenderEvilCampaignR18098()"><span>‹</span><b>BACK</b></button><main class="rhEvilR1Body8097"><section class="otgHosHero8147"><small>OUT THE GARAGE! • PRIVATE DOSSIER</small><h2>THE HALL OF SHAME</h2><p>A spoiler-safe archive for classified Evil Tournament hero artwork. Locked files remain hidden until first encountered naturally during play.</p></section><section class="otgHosStats8147"><article><small>DISCOVERED</small><strong>${s.discovered}</strong><span>OF ${s.total||'—'}</span></article><article><small>VAULT</small><strong>${esc(packText)}</strong><span>${s.packVersion?esc(s.packVersion):'PENDING FUTURE PACK'}</span></article><article><small>STATUS</small><strong>${esc(modeText)}</strong><span>NO SPOILERS • NO REPEATS WHEN ACTIVE</span></article></section><section class="otgHosCopy8147"><p>${s.packInstalled?'Unlocked artwork appears below; undiscovered files stay classified.':'The vault is ready, but no secret artwork pack has been installed yet. Your current category heroes remain exactly as they are until the sealed collection arrives.'}</p></section><section class="otgHosGrid8147">${gridHTML()}</section></main></div>`;
 }
 function openPage(){
  const root=document.getElementById('evilcampaign'); if(!root)return;
  syncManifest();
  show('evilcampaign');
  root.innerHTML=pageHTML();
  try{window.scrollTo(0,0)}catch(_){}
 }
 function wrap(name,after){
  const base=window[name]; if(typeof base!=='function'||base._otgHos8147)return;
  function wrapped(){const out=base.apply(this,arguments); try{after();}catch(err){console.warn('Hall of Shame decorate:',err)} return out;}
  wrapped._otgHos8147=true;
  window[name]=wrapped;
 }
 function watch(){
  const root=document.getElementById('evilcampaign'); if(!root||typeof MutationObserver==='undefined')return;
  let pending=false;
  new MutationObserver(()=>{
   if(pending)return; pending=true;
   Promise.resolve().then(()=>{pending=false;decorateLanding();});
  }).observe(root,{childList:true,subtree:true});
 }
 window.rhOpenHallOfShame8147=openPage;
 window.rhEvilHallOfShame8147={ensure,syncManifest,summary,assignForSlot,assignmentForSlot,assetUrl,manifest,storeKey:STORE,mode:()=>ensure()?.mode||DEFAULT_MODE,setMode(mode){const st=ensure(); if(!st)return null; st.mode=String(mode||DEFAULT_MODE); st.updatedAt=now(); save(); return st.mode;}};
 wrap('rhOpenEvilCampaignR18098',decorateLanding);
 wrap('rhRenderEvilCampaignR18098',decorateLanding);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{ensure();syncManifest();decorateLanding();watch();},{once:true});
 else {ensure();syncManifest();decorateLanding();watch();}
})();
