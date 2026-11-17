/* OTG! MAIN v8.0.326 — Race Off landing makeover, seven pink Smart Tiles.
 * Presentation only. We move the live native catalogue cards, their existing
 * click targets, and all ongoing Race Offs; no state writes or racing changes.
 */
(()=>{
  'use strict';
  const ICON='assets/ui/raceoff-icon-';
  const CATEGORIES=[
    ['general','GENERAL RACE OFFS'],
    ['fav','FAVOURITE MANUFACTURER'],
    ['lonely','LONELY HEARTS RACE OFFS'],
    ['vintage','VINTAGE & CLASSIC RACE OFFS'],
    ['era','ERA RACE OFFS'],
    ['class','CLASS / TYPE RACE OFFS'],
    ['make','MANUFACTURER RACE OFFS']
  ];
  const number=v=>{const q=Number.parseInt(String(v??'').trim(),10);return Number.isFinite(q)&&q>=0?q:0};
  function decorate(){
    const root=document.querySelector('#raceoff > .rhFestivalV1.rhRaceOffV1');
    const body=root?.querySelector(':scope > .rhFestivalBodyV1');
    if(!body || root.classList.contains('otg326-landing') || root.classList.contains('rhHistoryPageV8065'))return;
    // Only the catalogue landing has this original heading. Don't touch setup,
    // draws, result entry, winner, archive or the frozen in-progress race pages.
    const children=[...body.children];
    const title=el=>String(el?.querySelector(':scope > h2, :scope > summary')?.textContent||'').trim().toUpperCase();
    if(!children.some(el=>el.matches('section.rhFestivalSectionV1')&&/^OTG! RACE OFFS$/.test(title(el))))return;
    const claimed=new Set();
    const take=predicate=>{
      const el=children.find(x=>!claimed.has(x)&&predicate(x));
      if(el)claimed.add(el);
      return el||null;
    };
    const sources={
      general:take(e=>e.matches('section.rhFestivalSectionV1')&&/^OTG! RACE OFFS$/.test(title(e))),
      fav:take(e=>e.classList.contains('rhRaceOffFavouriteV1')),
      lonely:take(e=>e.classList.contains('rhLonelyHeartsRaceOff8062')),
      vintage:take(e=>e.classList.contains('rhFestivalHeritageV6')),
      era:take(e=>e.matches('details.rhFestivalSectionV1')&&/^ERA RACE OFFS/.test(title(e))),
      class:take(e=>e.classList.contains('rhFestivalClassTypeV6')),
      make:take(e=>e.matches('details.rhFestivalSectionV1')&&/^MANUFACTURER RACE OFFS/.test(title(e)))
    };
    const specialists=children.filter(e=>e.classList.contains('rhFH5RaceOffSpecial8056'));
    specialists.forEach(x=>claimed.add(x));
    const info=take(e=>e.classList.contains('rhFestivalInfoV1'));
    const banner=take(e=>e.classList.contains('rhRaceOffContinue'));
    const headTitle=root.querySelector('.otgFestivalStrip8146 h1, .rhFestivalHeadV1 h1');
    if(headTitle)headTitle.textContent='RACE OFF';
    root.classList.add('otg326-landing');
    const label=document.createElement('div');label.className='otg326-category-heading';label.textContent='RACE OFF EVENTS';
    const grid=document.createElement('div');grid.className='otg326-category-list';
    function countFor(key,source){
      if(!source)return 0;
      if(key==='general'||key==='fav'||key==='lonely')return source.querySelector('.rhRaceOffLaunchCard')?1:0;
      const nativeNumber=source.querySelector(':scope > summary > span');
      if(nativeNumber)return number(nativeNumber.textContent);
      return source.querySelectorAll('.rhRaceOffLaunchCard').length;
    }
    function moveNative(source,into){
      if(!source)return;
      for(const el of [...source.children]){
        if(el.matches('h2, summary'))continue;
        into.appendChild(el); // real existing nodes, preserving delegated and inline handlers
      }
      source.remove();
    }
    for(const [key,heading] of CATEGORIES){
      const source=sources[key]||null,available=countFor(key,source);
      const detail=document.createElement('details');
      detail.className='otg326-category otg326-'+key+(available?'':' otg326-zero');
      const summary=document.createElement('summary');
      const img=document.createElement('img');img.src=ICON+key+'-v8326.svg';img.alt='';img.setAttribute('aria-hidden','true');
      const name=document.createElement('span');name.className='otg326-category-label';name.textContent=heading;
      const count=document.createElement('strong');count.className='otg326-category-count';count.textContent=available;
      count.setAttribute('aria-label',available+' available');
      const chevron=document.createElement('span');chevron.className='otg326-category-chevron';chevron.textContent='⌄';chevron.setAttribute('aria-hidden','true');
      summary.append(img,name,count,chevron);detail.appendChild(summary);
      const content=document.createElement('div');content.className='otg326-category-content';
      moveNative(source,content);
      // Keep existing FH5 specialist knockouts accessible, without making
      // separate FH5-exclusive categories on the game-neutral Race Off home.
      if(key==='class'&&specialists.length){
        const small=document.createElement('p');small.className='otg326-special-note';
        small.textContent='Additional specialist Race Off presets for this Space';
        content.appendChild(small);
        specialists.forEach(el=>content.appendChild(el));
      }
      if(!source){
        const message=document.createElement('p');message.className='otg326-unavailable';
        message.textContent=key==='lonely'?'Available when two or more one-car manufacturers are eligible.':'No eligible Race Offs in this category yet.';
        content.appendChild(message);
      }
      detail.appendChild(content);grid.appendChild(detail);
    }
    body.insertBefore(label,body.firstChild);
    label.insertAdjacentElement('afterend',grid);
    if(banner)body.insertBefore(banner,label);
    if(info)body.appendChild(info);
    // Preserve any other native interface (e.g. recovery or future extensions).
    for(const x of children){
      if(!claimed.has(x)&&x.parentElement===body)body.appendChild(x);
    }
  }
  const original=window.rhRenderRaceOff;
  if(typeof original==='function'){
    window.rhRenderRaceOff=function(){
      const output=original.apply(this,arguments);
      try{decorate()}catch(error){console.warn('OTG! Race Off landing styling skipped:',error)}
      return output;
    };
  }
})();
