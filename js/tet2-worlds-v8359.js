/* TET2 Stage 4 v8.0.359: eight approved visual-page shells; no tournament writes.
   Strict isolation: NEVER call rhSave/rhLoad setters, alter OTG screens, or create fake race records. */
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
    world='tet2';page=allowed.includes(next)?next:'hq';write(KEY,'tet2');tab.hidden=true;el.hidden=false;
    document.body.style.overflow='hidden';render();
  }
  function chooser(){world='choose';tab.hidden=true;el.hidden=false;document.body.style.overflow='hidden';el.innerHTML=`<div class="t2-world"><img class="t2-world-art" src="${art('world')}" alt="A single split garage: pristine cyan OTG! on the left, spectacular red TET2 chaos on the right"><button type="button" class="t2-world-choice t2-world-otg" data-t2-world="otg" aria-label="Enter OTG! world"></button><button type="button" class="t2-world-choice t2-world-tet2" data-t2-world="tet2" aria-label="Enter TET2 world"></button></div>`;}
  function hero(name){
    return `<div class="t2-hero"><img src="${art(name)}" alt="Approved ${esc(name==='hq'?'Command Centre':labels[name])} artwork"><button type="button" class="t2-top-button t2-top-left" data-t2-page="hq" aria-label="Command Centre">⌂</button><button type="button" class="t2-top-button t2-top-right" data-t2-world="otg">SWITCH TO OTG!</button></div>`;
  }
  function command(){
    const tiles=allowed.filter(k=>k!=='hq').map(k=>`<button type="button" class="t2-tile" data-t2-page="${k}" aria-label="Open ${esc(labels[k])}"><img src="${art('tile-'+k)}" alt="${esc(labels[k])} approved character tile"></button>`).join('');
    return `${hero('hq')}<div class="t2-content">${panel('Current mission',`<h3 class="t2-gold">TOURNAMENT NOT STARTED</h3><p>The real Controlled Chaos Evil List will supply the current slot and next race when built. No sample results are treated as live.</p><button type="button" class="t2-btn" data-t2-page="race">OPEN RACE CONTROL</button>`)}<div class="t2-grid">${tiles}</div><label class="t2-toggle"><input type="checkbox" id="t2-always" ${read(ALWAYS)==='yes'?'checked':''}> Always show the World Selector at startup</label><p class="t2-footer">Six departments of disaster · Existing OTG! screens and Garage remain unchanged.</p></div>`;
  }
  function race(){return `${hero('race')}<div class="t2-content">
    ${panel('Current event',`<h3 class="t2-cyan">No active TET2 slot yet</h3><p>Once the Evil List is generated, the matching competition trophy, format, status and progress will appear here. No second event logo.</p>`)}
    ${panel('Next up',`<p>Full-width race instructions will show entrants, track, restrictions and the result required.</p>${empty('Awaiting the first scheduled competition')}<button class="t2-btn" disabled>START / ENTER RESULT — NOT YET LINKED</button>`)}
    ${panel('Competition progress',empty('Standings, match pairings or leaderboards will be shown for the active event.'))}
    ${panel('Event instructions',`<p>Competition-specific format, scoring, and medal rules will appear here.</p>`)}
    <button class="t2-btn" disabled>CONFIRM EVENT COMPLETE — UNAVAILABLE</button></div>`;}
  function evil(){return `${hero('evil')}<div class="t2-content">${panel('Tournament overview',`<div class="t2-row"><span>Planned Evil List slots</span><strong class="t2-gold">1,219</strong></div><div class="t2-row"><span>Generated schedule</span><strong>Not yet</strong></div><div class="t2-row"><span>Completed TET2 slots</span><strong>—</strong></div>`)}
    ${panel('Full Evil List',`<p>Controlled Chaos has not generated the definitive schedule. When ready, it will be displayed in pages with slot number, event, format and completion status.</p>${empty('No schedule to browse yet')}`)}
    <div class="t2-subnav"><button class="t2-btn" disabled>JUMP TO SLOT</button><button class="t2-btn" disabled>FIND EVENT</button><button class="t2-btn" disabled>FILTER TYPE</button><button class="t2-btn" disabled>TOURNAMENT SUMMARY</button></div></div>`;}
  function medals(){let table=(label,first)=>panel(label,`<table class="t2-table"><thead><tr><th>${first}</th><th>Gold</th><th>Silver</th><th>Bronze</th><th>Total</th></tr></thead></table>${empty('No completed TET2 competitions have supplied verified medals yet.')}`);
    return `${hero('medals')}<div class="t2-content">${table('Manufacturer medal table','Manufacturer')}${table('Car medal table','Car (year)')}${panel('Medal summary',`<p>Only verified TET2 results will populate these tables. Manufacturer and car medals will follow our locked rules.</p>`)}<div class="t2-subnav"><button class="t2-btn" disabled>FIND ENTRY</button><button class="t2-btn" disabled>TOURNAMENT BREAKDOWN</button></div></div>`;}
  function pit(){return `${hero('pit')}<div class="t2-content">${panel('Tournament results archive',`<p>Search completed events by slot number or event name. Once an event is complete, its record is locked and read-only.</p><input aria-label="Search completed events" disabled placeholder="Search slot or event name" style="width:100%;padding:12px;color:#fff;border:1px solid #eb3446;border-radius:8px;background:#101116">`)}${panel('Completed events',empty('No completed TET2 slots yet.'))}${panel('Event detail',empty('Select a completed event to see its entrants, results, standings and awarded medals.'))}</div>`;}
  function swiss(){return `${hero('swiss')}<div class="t2-content">${panel('Select Swiss Cup',empty('No TET2 Swiss Cups scheduled yet.'))}${panel('Competition status',`<p>Each Swiss Cup will retain its pairings, standings and round history across separated Evil List slots.</p>`)}${panel('Swiss standings',empty('A cup must be selected to view standings.'))}${panel('Round history & next appearance',empty('Once scheduled, the next appearance slot and previous rounds will be shown here.'))}</div>`;}
  function hall(){const items=[['Gallery','Artwork and rewards'],['Secret side missions','Unlockable discoveries'],['Incident archive','Illustrated chapters'],['Random rewards','Paints, themes, surprises'],['Unlocked content','All discovered items'],['The shame files','The best of the worst']];
    return `${hero('hall')}<div class="t2-content">${panel('Hall of Shame collections',`<div class="t2-grid">${items.map(([name,desc])=>`<div class="t2-panel" style="margin:0;min-height:116px"><h3 style="color:#ffd36c;text-transform:uppercase">${esc(name)}</h3><p>${esc(desc)}</p></div>`).join('')}</div>`)}${panel('Existing rewards preserved',`<p>Your original OTG! rewards, art and private incident archives have not been reset or imported. Their TET2 presentation and unlock connections are part of the next integration step.</p>`)}</div>`;}
  const pages={hq:command,race,evil,medals,pit,swiss,hall};
  function render(){if(world!=='tet2')return;el.innerHTML=`<div class="t2-page">${pages[page]()}</div>`;el.scrollTop=0;}
  function dispatch(e){
    const worldBtn=e.target.closest('[data-t2-world]');if(worldBtn){if(worldBtn.dataset.t2World==='otg')backToOTG();else enterTET2();return;}
    const pageBtn=e.target.closest('[data-t2-page]');if(pageBtn){enterTET2(pageBtn.dataset.t2Page);return;}
  }
  function init(){
    if(document.getElementById('tet2-stage4-app'))return;
    el=document.createElement('div');el.id='tet2-stage4-app';el.hidden=true;el.setAttribute('role','main');el.setAttribute('aria-label','The Evil Tournament 2 World');
    tab=document.createElement('button');tab.id='tet2-open-tab';tab.type='button';tab.textContent='😈 TET2';tab.setAttribute('aria-label','Switch to TET2 world');tab.hidden=true;
    document.body.append(el,tab);
    tab.addEventListener('click',()=>enterTET2());el.addEventListener('click',dispatch);
    el.addEventListener('change',e=>{if(e.target.id==='t2-always')write(ALWAYS,e.target.checked?'yes':'no');});
    const stored=read(KEY);
    if(read(ALWAYS)==='yes'||(stored!=='otg'&&stored!=='tet2'))chooser();
    else if(stored==='tet2')enterTET2();
    else {world='otg';tab.hidden=false;}
    window.TET2Stage4UI359=Object.freeze({open:()=>enterTET2(),chooser,returnToOTG:backToOTG,page:(id)=>{if(allowed.includes(id)||id==='hq')enterTET2(id)}});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
