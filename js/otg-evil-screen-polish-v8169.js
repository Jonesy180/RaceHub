/* OTG! personal MAIN 8.0.169 — Evil Festival / Race Off screen refinements.
 * PRESENTATION ONLY. No racing data, draw, result, navigation or persistence mutations.
 * Keeps the native Evil R1 back-button element and click handler intact.
 */
(()=>{
 'use strict';
 const DOCK='otgEvilReturnDock8169';
 const COMPACT='otgRoNextOnly8169';
 const HINT='otgRoNextAbove8169';
 function makeDock(root){
  if(!root || root.classList.contains('hidden'))return;
  const returnButton=root.querySelector('.rhEvilR1Return8098');
  if(!returnButton)return;
  // Only move the button on recognizable Evil Festival/Race Off screens.
  // Other views retain their native navigation untouched.
  const scene=root.querySelector(':scope > .rhChamp33, :scope > .rhFestivalV1, :scope > .rhOverviewV1')
      || root.querySelector(':scope > div.rhChamp33, :scope > div.rhFestivalV1');
  if(!scene)return;
  const anchor=scene.querySelector(':scope > .rhFestivalHeroV1, :scope > .rhOverviewHeroV1, :scope > .rhChamp34Hero, :scope > header');
  const target=anchor?.parentElement===scene?anchor.nextElementSibling:null;
  // On .rhChamp33, insert before its body; on Race Off, after the real hero.
  const existing=scene.querySelector(':scope > .'+DOCK);
  if(existing){
   if(returnButton.parentElement!==existing)existing.appendChild(returnButton);
   return;
  }
  const dock=document.createElement('div');
  dock.className=DOCK;
  dock.setAttribute('role','navigation');
  dock.setAttribute('aria-label','Return to Evil Tournament slot');
  if(anchor)scene.insertBefore(dock,target);
  else scene.insertBefore(dock,scene.firstChild);
  // Move, DON'T clone. This preserves the app's actual button onclick handler.
  dock.appendChild(returnButton);
 }
 function compactRepeat(root){
  if(!root||root.classList.contains('hidden'))return;
  const page=root.querySelector('.rhRaceOffDrawSceneV6118.otgEvilRoCompact8168');
  if(!page || !page.querySelector('.otgRoNextBox8168'))return;
  // Scope narrowly to exactly the match native v8.0.168 identified as NEXT.
  const cards=[...page.querySelectorAll('.rhRaceOffDrawScrollV6118 > .rhRaceOffDrawMatchV6118.otgRoNextMatch8168')];
  if(cards.length!==1)return;
  const card=cards[0];
  const small=card.querySelector(':scope > small');
  // The native card contains only a label, two car names and VS. If it has
  // controls or unexpected markup, leave the card entirely unchanged.
  if(!small || [...card.children].filter(x=>x.tagName==='B').length!==2)return;
  if([...card.children].some(x=>x.tagName==='BUTTON' || x.tagName==='INPUT' || x.tagName==='A'))return;
  if(!card.classList.contains(COMPACT))card.classList.add(COMPACT);
  if(!small.querySelector('.'+HINT)){
   const hint=document.createElement('span');
   hint.className=HINT;
   hint.textContent='PAIR SHOWN IN UP NEXT ↑';
   small.appendChild(hint);
  }
 }
 let pending=false;
 function schedule(){
  if(pending)return;
  pending=true;
  (window.requestAnimationFrame||((fn)=>setTimeout(fn,16)))(()=>{
   pending=false;
   try{makeDock(document.getElementById('festival'));makeDock(document.getElementById('raceoff'));
       compactRepeat(document.getElementById('raceoff'));}
   catch(e){console.warn('OTG! Evil screen polish skipped:',e)}
  });
 }
 function start(){
  for(const id of ['festival','raceoff']){
   const root=document.getElementById(id);
   if(root)new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
  }
  schedule();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
 window.otgEvilScreenPolishQA8169=()=>({version:'8.0.169',readonly:true,
  festivalDock:!!document.querySelector('#festival .'+DOCK),
  raceOffDock:!!document.querySelector('#raceoff .'+DOCK),
  duplicateMatchCompacted:!!document.querySelector('#raceoff .'+COMPACT)});
})();
