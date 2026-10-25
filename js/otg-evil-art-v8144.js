/* OTG! MAIN 8.0.144 — THE EVIL TOURNAMENT: category-specific HERO ART.
 * Purely presentation-only. Does NOT modify localStorage, Space objects,
 * results, Garage, records, campaign slots, medals, draws or any saved data.
 * Original tournament landing-screen artwork remains untouched.
 */
(()=>{
 'use strict';
 const ROOT='assets/tournaments/evil-art-v8144-';
 const MAP=Object.freeze({
  manufacturers:'manufacturers',era:'era',class:'class',category:'category',
  themed:'themed',mixed:'mixed','forza-edition':'forza-edition',
  drift:'drift','race-cars':'race-cars','off-road':'off-road',
  'favourite-festival':'favourite-festival',
  'favourite-race-off':'favourite-race-off',finals:'finals'
 });
 const FAMILY=Object.freeze({
  'Manufacturer':'manufacturers',
  'Era Championship':'era',
  'Class / Type':'class',
  'Vintage & Classic':'themed',
  'Festival':'mixed',
  'Swiss Cup':'mixed',
  'Hot Wheels':'category',
  'Drag Racing':'category',
  'Forza Edition':'forza-edition',
  'Drift':'drift',
  'Race Cars':'race-cars',
  'Off-Road / Buggy':'off-road',
  'Rally Adventure':'off-road'
 });
 function choice(card,header){
  const tag=card?.querySelector(':scope > small')?.textContent||'';
  // Existing R1 UI uses a single separator between real family and event ID.
  const parts=tag.split(' • '),family=(parts[0]||'').trim(),id=(parts.slice(1).join(' • ')||'').trim();
  if(!id)return null; // Fail closed: never guess an event's family.
  const event=card.querySelector('h2')?.textContent||'';
  if(family==='Favourite Manufacturer'){
   if(/Race Off Night/i.test(event))return 'favourite-race-off';
   if(/Festival Night/i.test(event))return 'favourite-festival';
   return null;
  }
  // The concluding All Normal Cars Race Off is the real campaign final boss.
  // 1148 regular-phase slots plus 35 interleaved Swiss visits = 1183;
  // variable favourite visits are inserted AFTER that boundary.
  const headerLabel=(header?.querySelector('h1')?.textContent||'')+' '+(header?.querySelector('p')?.textContent||'');
  const n=Number(headerLabel.match(/\bSLOT\s*0*(\d+)\b/i)?.[1]||0);
  if(id==='N-ALL-RO'&&n>=1184)return 'finals';
  return FAMILY[family]||null;
 }
 function refresh(){
  const root=document.getElementById('evilcampaign');if(!root)return;
  const main=root.querySelector('.rhEvilR1Body8097');
  const card=main?.querySelector('.rhEvilR1SlotCard8097');
  const header=root.querySelector('.rhEvilR1Hero8097');
  if(!card||!header)return;
  // Never insert over the original tournament landing hero, or any generic app screen.
  if(root.querySelector('.rhEvilR1Stats8097'))return;
  const key=choice(card,header);
  if(!key||!MAP[key])return;
  const existing=main.querySelector(':scope > .otgEvilScene8144');
  if(existing){
   if(existing.dataset.scene===key)return;
   existing.remove();
  }
  const figure=document.createElement('figure');
  figure.className='otgEvilScene8144';figure.dataset.scene=key;
  const img=document.createElement('img');
  img.src=ROOT+MAP[key]+'.webp?v=8144';
  img.alt='The Evil Tournament — '+key.replace(/-/g,' ')+' illustrated hero artwork';
  img.width=1672;img.height=941;img.decoding='async';img.loading='lazy';
  figure.appendChild(img);
  main.insertBefore(figure,card);
 }
 function init(){
  const root=document.getElementById('evilcampaign');if(!root)return;
  let pending=false;
  if(typeof MutationObserver!=='undefined'){
   const observer=new MutationObserver(()=>{
    if(pending)return;pending=true;
    const schedule=typeof requestAnimationFrame==='function'?requestAnimationFrame:(fn)=>setTimeout(fn,16);
    schedule(()=>{pending=false;try{refresh()}catch(e){console.warn('OTG art presentation:',e)}});
   });
   observer.observe(root,{childList:true,subtree:true});
  }
  refresh();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
