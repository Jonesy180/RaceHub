/* TET2 v8.0.413: approved pages + official-slot ledger interface, using existing native FH5 Space; read-only until a locked Controlled Chaos schedule supplies a slot.
   Strict isolation: practice draw uses its own browser key, never rhSave or fake OTG racing records. */
(function(){
  'use strict';
  const ROOT='assets/tet2-stage4-v8359/';
  const KEY='tet2Stage4WorldChoiceV8359';
  const ALWAYS='tet2Stage4AlwaysChooseV8359';
  const allowed=['hq','race','evil','medals','pit','swiss','hall'];
  const labels={race:'Race Control',evil:'Evil List',medals:'Medal Tables',pit:'Pit Wall',swiss:'Swiss War Room',hall:'Hall of Shame'};
  const esc=(s)=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]||'&#39;'));
  const art=(name)=>ROOT+name+'.webp';
  const panel=(title,html)=>`<section class="t2-panel"><h2>${esc(title)}</h2>${html}</section>`;
  const empty=(msg)=>`<div class="t2-empty">${esc(msg)}</div>`;
  let world=null, page='hq', el, tab;
  function read(k){try{return localStorage.getItem(k);}catch(_){return null}}
  function write(k,v){try{localStorage.setItem(k,v)}catch(_){}}
  function backToOTG(){world='otg';write(KEY,'otg');el.hidden=true;tab.hidden=false;document.body.style.removeProperty('overflow');try{if(typeof window.show==='function')window.show('home')}catch(_){}}
  function enterTET2(next='hq'){
    world='tet2';page=(allowed.includes(next)||next==='entry'||next==='summary')?next:'hq';write(KEY,'tet2');tab.hidden=true;el.hidden=false;
    document.body.style.overflow='hidden';render(true);
    // The user's ENTER RACE RESULTS gesture should start in MINUTES, not
    // wherever their finger last landed on an invisible digit segment.
    if(page==='entry')focusNextMinutes();
  }
  function chooser(){world='choose';tab.hidden=true;el.hidden=false;document.body.style.overflow='hidden';el.innerHTML=`<div class="t2-world"><img class="t2-world-art" src="${art('world')}" alt="A single split garage: pristine cyan OTG! on the left, spectacular red TET2 chaos on the right"><button type="button" class="t2-world-choice t2-world-otg" data-t2-world="otg" aria-label="Enter OTG! world"></button><button type="button" class="t2-world-choice t2-world-tet2" data-t2-world="tet2" aria-label="Enter TET2 world"></button></div>`;}
  // Each approved header already has TWO navigation controls printed in its
  // artwork. Make those controls clickable without putting another button on
  // top. Command Centre alone has a "SWITCH TO OTG!" label; every other TET2
  // page has a "COMMAND CENTRE" label in the right-hand artwork.
  function hero(name){
    const isHQ=name==='hq';
    const rightAction=isHQ?'data-t2-world="otg"':'data-t2-page="hq"';
    const rightLabel=isHQ?'Switch to OTG!':'Back to Command Centre';
    return `<div class="t2-hero"><img src="${art(name)}" alt="Approved ${esc(isHQ?'Command Centre':labels[name])} artwork"><button type="button" class="t2-art-nav-hotspot412 t2-art-nav-left413" data-t2-page="hq" aria-label="Back to Command Centre" title="Back to Command Centre"></button><button type="button" class="t2-art-nav-right413" ${rightAction} aria-label="${rightLabel}" title="${rightLabel}"></button></div>`;
  }
  function command(){
    const tiles=allowed.filter(k=>k!=='hq').map(k=>`<button type="button" class="t2-tile" data-t2-page="${k}" aria-label="Open ${esc(labels[k])}"><img src="${art('tile-'+k)}" alt="${esc(labels[k])}"></button>`).join('');
    let line='Open Race Control to see your next Evil List event.';
    try{const x=window.TET2OfficialRace401?.inspect?.();if(x?.next)line=`Slot ${x.position} · ${esc(x.next.name)} · ${x.completed} completed`;else if(x)line='All currently scheduled visits are complete.';}catch(e){line=esc(e.message);}
    return `${hero('hq')}<div class="t2-content">${panel('Current event',`<p>${line}</p><button type="button" class="t2-btn" data-t2-page="race">OPEN RACE CONTROL</button>`)}<div class="t2-grid">${tiles}</div><label class="t2-toggle"><input type="checkbox" id="t2-always" ${read(ALWAYS)==='yes'?'checked':''}> Always show the World Selector at startup</label></div>`;
  }
  function race(){return `${hero('race')}<div class="t2-content">
    ${panel('RACE CONTROL',window.TET2OfficialRace401?.html?.()||empty('Current event is unavailable.'))}
  </div>`;}
  function evil(){return `${hero('evil')}<div class="t2-content">
    ${panel('THE EVIL LIST',window.TET2EvilList401?.html?.()||empty('Unable to open the Evil List.'))}
    </div>`;}

  function medals(){
    let content='';
    try{
      const space=window.rhSpace?.();
      const saved=window.tet2HonoursBridge358?.results?.(space,space?.cars||[]);
      if(!saved)throw Error('Open your existing FH5 Catalogue Space to view TET2 medals.');
      const names=new Map((space.cars||[]).map(car=>[String(car.id),String(car.name||car.id)]));
      const makeRows=Object.entries(saved.medalTable.manufacturers||{}).sort((a,b)=>(b[1].gold||0)-(a[1].gold||0)||a[0].localeCompare(b[0]));
      const carRows=Object.entries(saved.medalTable.cars||{}).sort((a,b)=>(b[1].gold||0)-(a[1].gold||0)||(b[1].silver||0)-(a[1].silver||0)||(b[1].bronze||0)-(a[1].bronze||0)||a[0].localeCompare(b[0]));
      const table=(rows,car)=>rows.length?`<table class="t2-h387-table" style="width:100%;text-align:left"><thead><tr><th>${car?'Car':'Manufacturer'}</th><th>🥇</th><th>🥈</th><th>🥉</th></tr></thead><tbody>${rows.map(([id,row])=>`<tr><td>${esc(car?(names.get(id)||id):id)}</td><td>${Number(row.gold||0)}</td><td>${Number(row.silver||0)}</td><td>${Number(row.bronze||0)}</td></tr>`).join('')}</tbody></table>`:'<p>No medals awarded yet.</p>';
      content=panel('VERIFIED TOURNAMENT MEDALS',`<p>${saved.receipts.length} completed competition result${saved.receipts.length===1?'':'s'} awarded so far. No provisional results or practice runs appear here.</p>`)+panel('MANUFACTURER MEDALS',table(makeRows,false))+panel('CAR MEDALS',table(carRows,true));
    }catch(e){content=panel('OFFICIAL MEDALS',`<p>${esc(e.message)}</p>`);}
    return `${hero('medals')}<div class="t2-content">${content}</div>`;
  }
  function pit(){return `${hero('pit')}<div class="t2-content">${panel('PIT WALL · COMPLETED EVENTS',window.TET2LiveViews401?.archiveHtml?.()||empty('No completed races.'))}</div>`;}
  function swiss(){return `${hero('swiss')}<div class="t2-content">${panel('SWISS WAR ROOM',window.TET2LiveViews401?.swissHtml?.()||empty('Swiss records unavailable.'))}</div>`;}
  function hall(){
    let content='<p>No tournament awards recorded yet.</p>';
    try{const sp=window.rhSpace?.();const b=window.tet2HonoursBridge358?.results?.(sp,sp?.cars||[]);const r=b?.receipts||[];if(r.length)content=`<p>${r.length} verified completed competitions with honours.</p><ol>${r.map(x=>`<li>${esc(x.eventId)} · Gold ${esc((x.medals?.gold||[]).length)} · Silver ${esc((x.medals?.silver||[]).length)} · Bronze ${esc((x.medals?.bronze||[]).length)}</li>`).join('')}</ol>`;}catch(_){ }
    return `${hero('hall')}<div class="t2-content">${panel('HALL OF SHAME · COMPLETED HONOURS',content)}</div>`;
  }
  const pages={hq:command,race,evil,medals,pit,swiss,hall,summary:()=>window.TET2SlotPresentation414?.summaryHtml?.()||empty('Slot results unavailable.'),entry:()=>window.TET2ResultsEntry360?.render()||empty('Official results entry unavailable.')};
  function render(resetScroll=false){if(world!=='tet2')return;const y=resetScroll?0:el.scrollTop;el.innerHTML=`<div class="t2-page">${pages[page]()}</div>`;el.scrollTop=y;}
  // Entry UX: one predictable first field (MM). The numeric keyboard may be
  // opened by the user's ENTER RACE RESULTS tap; no automatic numbers are entered.
  function focusNextMinutes(){
    if(page!=='entry'||!el)return;
    const first=el.querySelector('.t2-time-console:not(.is-banked) [data-t2-segment="min"]:not(:disabled)');
    if(!first)return;
    try{first.focus({preventScroll:true});}catch(_){first.focus();}
    first.select?.();
  }
  // On a BLANK stopwatch, the first touch anywhere on that display should
  // begin in minutes. Later deliberate taps on seconds/ms are still allowed.
  function firstTouchStartsMinutes(event){
    if(page!=='entry')return;
    const clock=event.target?.closest?.('.t2-time-console:not(.is-banked)');
    if(!clock||clock.dataset.t2FirstTouched==='yes')return;
    const minutes=clock.querySelector('[data-t2-segment="min"]');
    const parts=clock.querySelectorAll('[data-t2-segment]');
    if(!minutes||[...parts].some(input=>input.value))return;
    clock.dataset.t2FirstTouched='yes';
    if(event.target!==minutes){
      event.preventDefault();
      try{minutes.focus({preventScroll:true});}catch(_){minutes.focus();}
      minutes.select?.();
    }
  }
  // After a confirmed save, put the NEXT unbanked result entry near the top
  // of the TET2 scrolling screen. No keyboard auto-open, no automatic banking.
  // This works for Race Off pairs, grouped car times, Relay legs, and Aero.
  function showNextResultAtTop(){
    if(page!=='entry'||!el)return;
    const next=el.querySelector(
      '[data-t2-action="bank-match"],'+
      '[data-t2-action="bank-car"]:not(:disabled),'+
      '[data-t2-action="bank-aero"]:not(:disabled),'+
      '[data-t2-action="next-track"],'+
      '[data-t2-action="mark-done"]');
    if(!next)return;
    const target=next.closest('.t2-entry-match, .t2-entry-car')||next;
    const containerRect=el.getBoundingClientRect();
    const targetRect=target.getBoundingClientRect();
    const desired=Math.max(0,el.scrollTop+targetRect.top-containerRect.top-12);
    el.scrollTop=desired;
    // The first empty MM entry is ready for the next fake time.
    focusNextMinutes();
  }
  function dispatch(e){
    const worldBtn=e.target.closest('[data-t2-world]');if(worldBtn){if(worldBtn.dataset.t2World==='otg')backToOTG();else enterTET2();return;}
    if(page==='race'&&window.TET2OfficialRace401?.action(e,(next)=>enterTET2(next),()=>render()))return;
    if(page==='evil'&&window.TET2EvilList401?.action(e))return;
    const summaryBtn=e.target.closest('[data-t2-summary-slot]');if(summaryBtn){window.TET2SlotPresentation414?.openSummary?.(summaryBtn.dataset.t2SummarySlot);enterTET2('summary');return;}
    if(page==='entry'&&e.target.closest('[data-t2-action]')){
      const act=e.target.closest('[data-t2-action]').dataset.t2Action;
      const isBank=['bank-match','bank-car','bank-aero'].includes(act);
      window.TET2ResultsEntry360?.act(e,(resetScroll)=>{
        render(resetScroll);
        // Errors must stay in view. Scroll only after an accepted and banked
        // result, not after invalid times or a failed storage callback.
        if((isBank&&!window.TET2ResultsEntry360?.peek?.()?.error||act==='continue-record')&&!el.querySelector('[data-t2-record-screen]')){
          requestAnimationFrame(showNextResultAtTop);
        }
      });
      return;
    }
    const pageBtn=e.target.closest('[data-t2-page]');if(pageBtn){enterTET2(pageBtn.dataset.t2Page);return;}
  }
  function init(){
    if(document.getElementById('tet2-stage4-app'))return;
    el=document.createElement('div');el.id='tet2-stage4-app';el.hidden=true;el.setAttribute('role','main');el.setAttribute('aria-label','The Evil Tournament 2 World');
    tab=document.createElement('button');tab.id='tet2-open-tab';tab.type='button';tab.textContent='😈 TET2';tab.setAttribute('aria-label','Switch to TET2 world');tab.hidden=true;
    document.body.append(el,tab);
    tab.addEventListener('click',()=>enterTET2());el.addEventListener('click',dispatch);
    el.addEventListener('pointerdown',firstTouchStartsMinutes,true);
    el.addEventListener('input',e=>{if(page==='evil')window.TET2EvilList401?.input(e);if(page==='pit')window.TET2LiveViews401?.input(e);if(page==='entry')window.TET2ResultsEntry360?.draft(e)});
    el.addEventListener('focusout',e=>{if(page==='entry')window.TET2ResultsEntry360?.prettify(e)},true);
    el.addEventListener('change',e=>{if(e.target.id==='t2-always')write(ALWAYS,e.target.checked?'yes':'no');if(page==='evil')window.TET2EvilList401?.change(e)});
    const stored=read(KEY);
    if(read(ALWAYS)==='yes'||(stored!=='otg'&&stored!=='tet2'))chooser();
    else if(stored==='tet2')enterTET2();
    else {world='otg';tab.hidden=false;}
    window.TET2Stage4UI359=Object.freeze({open:()=>enterTET2(),chooser,returnToOTG:backToOTG,page:(id)=>{if(allowed.includes(id)||id==='summary')enterTET2(id)},openScheduledEntry:(spec)=>{if(!window.TET2SlotLedger361?.isRegisteredSlot(spec))throw Error('TET2 slot is not in the verified ledger');window.TET2SlotLedger361.resumeActive();enterTET2('entry');}});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
