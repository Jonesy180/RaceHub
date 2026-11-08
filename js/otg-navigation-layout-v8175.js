/* OTG! PERSONAL MAIN v8.0.175 — navigation rescue + Evil home layout.
 * Presentational DOM changes only. No reads/writes to racing state or private image data.
 * Shows permanently accessible Back buttons in the portrait/noticeboard sheets.
 * Moves existing Evil home utility tile group directly above the Hubbs trophy card.
 */
(()=>{
  'use strict';
  const HOME_ID='evilcampaign';
  const TILES='.rhEvilR1Actions8097';
  let scheduled=false;
  const normal=s=>String(s||'').replace(/\s+/g,' ').trim().toUpperCase();
  function closeDialog(overlay,buttonSelector){
    const existing=overlay.querySelector(buttonSelector);
    if(existing){ existing.click(); return; }
    overlay.remove();
  }
  function ensureBack(overlay,type){
    if(!overlay||overlay.querySelector('[data-otg-persistent-back-8175]'))return;
    const sheet=overlay.querySelector(type==='gallery'?'.otgPrivateSheet8174':'.otgNoticeSheet8172');
    if(!sheet)return;
    const footer=document.createElement('footer');
    footer.className='otgPersistentFooter8175';
    footer.setAttribute('data-otg-persistent-back-8175',type);
    const b=document.createElement('button');
    b.type='button';
    b.className='otgPersistentBack8175';
    b.textContent=type==='gallery'?'← BACK TO NOTICEBOARD':'← BACK TO EVIL TOURNAMENT';
    b.setAttribute('aria-label',b.textContent);
    b.addEventListener('click',()=>closeDialog(overlay,type==='gallery'?'[data-otg-gallery-back]':'[data-otg-notice-back-8174], [data-otg-close]'));
    footer.appendChild(b);
    sheet.appendChild(footer); // outside scrollable main: ALWAYS visible, even below full-size portrait
  }
  function textNode(root,phrase){
    const target=normal(phrase);
    const priority='h1,h2,h3,h4,h5,h6';
    const matches=[...root.querySelectorAll(priority)].filter(el=>normal(el.textContent).includes(target));
    if(matches.length)return matches.sort((a,b)=>a.textContent.length-b.textContent.length)[0];
    // Existing Evil home may render headings as divs, not semantic headings.
    const all=[...root.querySelectorAll('strong,b,span,div,p,header')].filter(el=>normal(el.textContent).includes(target));
    return all.sort((a,b)=>a.textContent.length-b.textContent.length)[0]||null;
  }
  function locateHubbsCard(root,strip){
    const title=textNode(root,'HUBBS MEMORIAL TROPHY');
    if(!title||strip.contains(title))return null;
    let firstWithCta=null;
    for(let el=title;el&&el!==root;el=el.parentElement){
      if(el.contains(strip))return null; // Don't move a parent inside its own child.
      const text=normal(el.textContent);
      if(!text.includes('HUBBS MEMORIAL TROPHY')||!text.includes('THE TROPHY & RACE PLAN'))continue;
      if(!firstWithCta)firstWithCta=el;
      // This footer identifies the entire dedicated Hubbs card in the actual UI.
      if(text.includes('LIVE ON THE TET LIST'))return el;
    }
    if(!firstWithCta)return null;
    // Fallback for older presentation variants without the dedicated card footer.
    // Prefer the closest named/card wrapper; do not relocate entire Evil home.
    for(let el=firstWithCta;el&&el!==root;el=el.parentElement){
      if(el.contains(strip))break;
      if(/hubbs|memorial|trophy/i.test(String(el.className||'')))return el;
      if(el.tagName==='SECTION'||el.tagName==='ARTICLE')return el;
    }
    return firstWithCta;
  }
  function moveTiles(){
    const root=document.getElementById(HOME_ID);
    if(!root)return false;
    const strip=root.querySelector(TILES);
    if(!strip||!strip.children.length)return false;
    const card=locateHubbsCard(root,strip);
    if(!card||!card.parentElement||card.contains(strip)||strip.contains(card))return false;
    // Some app renders insert another wrapper around this group; retain the group intact.
    if(strip.parentElement===card.parentElement&&strip.nextElementSibling===card)return true;
    card.parentElement.insertBefore(strip,card);
    strip.dataset.otgRelocated8175='1';
    return true;
  }
  function apply(){
    ensureBack(document.getElementById('otgPrivateGallery8174'),'gallery');
    ensureBack(document.getElementById('otgNoticeOverlay8172'),'noticeboard');
    moveTiles();
  }
  function queue(){
    if(scheduled)return;
    scheduled=true;
    (window.requestAnimationFrame||((fn)=>setTimeout(fn,30)))(()=>{scheduled=false;try{apply()}catch(e){console.warn('OTG! v8.0.175 optional navigation/layout:',e)}});
  }
  function start(){
    queue();
    // Watch newly created overlay dialogs and regenerated Evil home blocks.
    const bodyObs=new MutationObserver(records=>{
      if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&(n.id==='otgPrivateGallery8174'||n.id==='otgNoticeOverlay8172'))))queue();
    });
    bodyObs.observe(document.body,{childList:true});
    const root=document.getElementById(HOME_ID);
    if(root)new MutationObserver(queue).observe(root,{childList:true,subtree:true});
    // In-app navigation normally redraws Evil home. If it doesn't, this still checks on return.
    document.addEventListener('click',e=>{
      if(e.target.closest('[data-screen="evilcampaign"],[data-otg-noticeboard]'))queue();
    },{capture:true});
    window.addEventListener('pageshow',queue);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  window.otgNavigationLayoutQA8175={apply,moveTiles,locateHubbsCard,ensureBack};
})();
