/* OTG! MAIN v8.0.325 — Festival landing: approved compact Smart Tile presentation.
   The original renderers, event cards and their click handlers remain authoritative.
   No new competitions, results, draw logic or writes to saved state. */
(()=>{
  'use strict';
  const ICON='assets/ui/festival-icon-';
  const CATEGORIES=[
    ['championship','FESTIVAL CHAMPIONSHIPS'],
    ['fav','FAVOURITE MANUFACTURER'],
    ['vintage','VINTAGE & CLASSIC CHAMPIONSHIPS'],
    ['era','ERA CHAMPIONSHIPS'],
    ['class','CLASS / TYPE CHAMPIONSHIPS'],
    ['make','MANUFACTURER CHAMPIONSHIPS'],
    ['relay','RELAY CHAMPIONSHIPS'],
    ['gauntlet','GAUNTLETS'],
    ['swiss','SWISS CUPS'],
    ['lonely','LONELY HEARTS CUP']
  ];
  const n=v=>{const q=Number.parseInt(String(v||'').trim(),10);return Number.isFinite(q)&&q>=0?q:0};
  function decorate(){
    const root=document.querySelector('#festival > .rhFestivalV1');
    const body=root?.querySelector(':scope > .rhFestivalBodyV1');
    // A live championship, a completed history view and a setup screen aren't the Festival landing.
    if(!body || root.classList.contains('rhHistoryPageV8065') || root.classList.contains('otg324-landing'))return;
    const children=[...body.children];
    const claimed=new Set();
    const take=predicate=>{
      const item=children.find(el=>!claimed.has(el)&&predicate(el));
      if(item)claimed.add(item);
      return item||null;
    };
    const directTitle=el=>String(el.querySelector(':scope > h2, :scope > summary')?.textContent||'').toUpperCase();
    const sources={
      championship:take(e=>e.matches('section.rhFestivalSectionV1')&&/^OTG! CHAMPIONSHIPS/.test(directTitle(e))),
      fav:take(e=>e.classList.contains('rhFestivalFavouriteV1')),
      vintage:take(e=>e.classList.contains('rhFestivalHeritageV6')),
      era:take(e=>e.matches('details.rhFestivalSectionV1')&&/^ERA CHAMPIONSHIPS/.test(directTitle(e))),
      class:take(e=>e.classList.contains('rhFestivalClassTypeV6')),
      make:take(e=>e.matches('details.rhFestivalSectionV1')&&/^MANUFACTURER CHAMPIONSHIPS/.test(directTitle(e))),
      lonely:take(e=>e.classList.contains('rhLonelyHearts8062'))
    };
    const special=children.filter(e=>e.classList.contains('rhFH5Special8056'));
    special.forEach(e=>claimed.add(e));
    const guide=take(e=>e.classList.contains('rhFestivalInfoV1'));
    const originalHeader=root.querySelector('.rhFestivalHeadV1 h1, .otgFestivalStrip8146 h1');
    if(originalHeader)originalHeader.textContent='FESTIVAL EVENTS';
    root.classList.add('otg324-landing');
    const header=document.createElement('div');
    header.className='otg324-category-header';
    header.textContent='CHOOSE YOUR CHAMPIONSHIP';
    const grid=document.createElement('div');
    grid.className='otg324-category-list';
    function countFor(source){
      if(!source)return 0;
      const direct=source.querySelector(':scope > summary > span');
      if(direct)return n(direct.textContent);
      return source.querySelectorAll('.rhChampCard').length;
    }
    function moveNative(source,into){
      if(!source)return;
      const items=[...source.children];
      for(const node of items){
        if(node.matches('h2, summary'))continue;
        into.appendChild(node); // move original nodes, retaining handlers and live content
      }
      source.remove();
    }
    for(const [key,label] of CATEGORIES){
      const source=sources[key]||null;
      const available=countFor(source);
      const detail=document.createElement('details');
      detail.className='otg324-category otg324-'+key+(available?'':' otg324-zero');
      const summary=document.createElement('summary');
      summary.innerHTML='<img src="'+ICON+key+'-v8325.svg" alt="" aria-hidden="true">'+
        '<span class="otg324-category-label">'+label+'</span>'+
        '<strong class="otg324-category-count" aria-label="'+available+' available">'+available+'</strong>'+
        '<span class="otg324-category-chevron" aria-hidden="true">⌄</span>';
      detail.appendChild(summary);
      const content=document.createElement('div');
      content.className='otg324-category-content';
      if(source)moveNative(source,content);
      if(key==='class' && special.length){
        const separator=document.createElement('p');
        separator.className='otg324-special-note';
        separator.textContent='Additional presets for this Game Space';
        content.append(separator);
        special.forEach(el=>content.appendChild(el));
      }
      if(!source && !['relay','gauntlet','swiss'].includes(key)){
        const p=document.createElement('p');
        p.className='otg324-unavailable';
        p.textContent=key==='lonely'?'This Cup appears when at least two one-car manufacturers are eligible.':'No eligible Championships in your Garage yet.';
        content.append(p);
      }
      // These three approved catalogue headings are future Festival formats.
      // Their existing separate Evil/QA engines are deliberately NOT presented as official races.
      if(['relay','gauntlet','swiss'].includes(key)){
        const p=document.createElement('p');
        p.className='otg324-unavailable';
        p.textContent='Official Festival competitions of this type are not available in the current build.';
        content.append(p);
      }
      detail.append(content);
      grid.append(detail);
    }
    const banner=body.querySelector(':scope > .rhFestivalContinueV1');
    body.insertBefore(header,banner?.nextSibling||body.firstChild);
    header.insertAdjacentElement('afterend',grid);
    if(guide)body.appendChild(guide);
    // Do not discard unrecognised legacy content, including saved-run recovery panels.
    // Hidden retired QA launchers stay hidden under the pre-existing Festival cleanup rules.
    for(const extra of children){
      if(claimed.has(extra)||extra===banner||extra===guide||!extra.isConnected)continue;
      if(extra.parentElement===body)body.appendChild(extra);
    }
  }
  const base=window.rhRenderFestival;
  if(typeof base==='function'){
    window.rhRenderFestival=function(){
      const result=base.apply(this,arguments);
      try{decorate();}catch(e){console.warn('OTG! Festival visual makeover skipped:',e);}
      return result;
    };
  }
})();
