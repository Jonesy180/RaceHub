/* TET2 v8.0.389: approved pages + official-slot ledger interface, using existing native FH5 Space; read-only until a locked Controlled Chaos schedule supplies a slot.
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
    world='tet2';page=(allowed.includes(next)||next==='entry'||next==='draw'||next==='progress')?next:'hq';write(KEY,'tet2');tab.hidden=true;el.hidden=false;
    document.body.style.overflow='hidden';render(true);
  }
  function chooser(){world='choose';tab.hidden=true;el.hidden=false;document.body.style.overflow='hidden';el.innerHTML=`<div class="t2-world"><img class="t2-world-art" src="${art('world')}" alt="A single split garage: pristine cyan OTG! on the left, spectacular red TET2 chaos on the right"><button type="button" class="t2-world-choice t2-world-otg" data-t2-world="otg" aria-label="Enter OTG! world"></button><button type="button" class="t2-world-choice t2-world-tet2" data-t2-world="tet2" aria-label="Enter TET2 world"></button></div>`;}
  function hero(name){
    return `<div class="t2-hero"><img src="${art(name)}" alt="Approved ${esc(name==='hq'?'Command Centre':labels[name])} artwork"><button type="button" class="t2-top-button t2-top-left" data-t2-page="hq" aria-label="Command Centre">⌂</button><button type="button" class="t2-top-button t2-top-right" data-t2-world="otg">SWITCH TO OTG!</button></div>`;
  }
  function garageLink(){
    const status=window.TET2SlotLedger361?.status?.();
    if(!status?.connected)return panel('Tournament Garage connection',`<p>Not connected: ${esc(status?.reason||'Open your real FH5 Catalogue Space first.')}</p><p>Your existing Garage is safe. No tournament will be started automatically.</p>`);
    return panel('Tournament Garage connection',`<div class="t2-row"><span>Active FH5 Space</span><strong class="t2-cyan">CONNECTED ✓</strong></div><div class="t2-row"><span>Owned cars available</span><strong>${status.owned}</strong></div><p>Live, read-only link to your existing Garage. No cars or racing results have been changed.</p>`);
  }
  function slotPanel(){
    const st=window.TET2SlotLedger361?.status?.();
    if(!st?.connected)return '';
    if(!st.current)return panel('Verified tournament slot',`<p>Awaiting the locked Controlled Chaos Evil List. No unofficial slots, results or medals will be created.</p>`);
    const x=st.current;
    return panel('Verified tournament slot',`<h3 class="t2-cyan">${esc(x.label)}</h3><div class="t2-row"><span>Slot</span><b>${esc(x.slotId)}</b></div><div class="t2-row"><span>Results recorded</span><b>${x.banked} / ${x.required}</b></div><div class="t2-row"><span>Status</span><b>${x.complete?'Completed · locked':'In progress'}</b></div>${x.complete?'':`<button type="button" class="t2-btn" data-t2-ledger="resume">RESUME VERIFIED SLOT</button>`}`);
  }
  function command(){
    const tiles=allowed.filter(k=>k!=='hq').map(k=>`<button type="button" class="t2-tile" data-t2-page="${k}" aria-label="Open ${esc(labels[k])}"><img src="${art('tile-'+k)}" alt="${esc(labels[k])} approved character tile"></button>`).join('');
    return `${hero('hq')}<div class="t2-content">${panel('Current mission',`<h3 class="t2-gold">TOURNAMENT NOT STARTED</h3><p>The real Controlled Chaos Evil List will supply the current slot and next race when built. No sample results are treated as live.</p><button type="button" class="t2-btn" data-t2-page="race">OPEN RACE CONTROL</button>`)}<div class="t2-grid">${tiles}</div><label class="t2-toggle"><input type="checkbox" id="t2-always" ${read(ALWAYS)==='yes'?'checked':''}> Always show the World Selector at startup</label><p class="t2-footer">Six departments of disaster · Existing OTG! screens and Garage remain unchanged.</p></div>`;
  }
  function trialPanel(){
    let s;try{s=window.TET2Practice363?.status();}catch(err){return panel('Local practice draw',`<p class="t2-entry-error">${esc(err.message)}</p>`);}
    if(!s)return '';
    let next='All results recorded';
    try{const p=window.TET2PracticeStandings364?.snapshot(window.TET2Practice363.read());
      if(p?.mode==='group' && p.unsaved)next='Track '+p.activeTrackNumber+' · '+p.unsaved;
      if(p?.mode==='raceoff' && p.next)next='Match '+p.next+' · '+p.matches[p.next-1].carA.name+' vs '+p.matches[p.next-1].carB.name;
    }catch(_){next='Practice draw ready';}
    return panel('🔒 Locked local practice · not official',`<p>${s.mode==='group'?'ONE GROUP':'RACE OFF PAIRINGS'} · ${s.count} ${s.mode==='group'?'cars':'matches'}</p><div class="t2-row"><span>Practice results saved</span><strong>${s.banked} / ${s.required}</strong></div><div class="t2-row"><span>Next Up</span><strong>${esc(next)}</strong></div><p>Only this browser and this FH5 Space. No official slots, honours, track records or other OTG! data changed.</p><button type="button" class="t2-btn" data-t2-trial-resume="yes">${s.complete?'VIEW':'RESUME'} LOCKED PRACTICE RESULTS</button><button type="button" class="t2-btn" data-t2-page="progress">📊 LIVE PRACTICE ${s.mode==='group'?'STANDINGS':'MATCH PROGRESS'}</button><button type="button" class="t2-btn t2-secondary" data-t2-draw-open="yes">VIEW LOCKED DRAW</button>`);
  }
  function practiceAvailable(){try{return !!window.TET2Practice363?.status();}catch(_){return false;}}
  function race(){return `${hero('race')}<div class="t2-content">
    ${panel('Planned event → race engine',window.TET2EventRouter375?.html?.()||empty('Candidate event routing unavailable. No official slot has been started.'))}
    ${garageLink()}
    ${panel('FINAL BATTLES · QUALIFICATION',window.TET2FinalGates386?.html?.()||empty('Final battles readiness module unavailable.'))}
    ${panel('TRACK ASSIGNMENTS · VALIDATION',window.TET2TrackValidation389?.html?.()||empty('Track catalogue inspection unavailable. Official routes remain unassigned.'))}
    ${panel('FH5 ROUTE ENGINE · CONTROLLED PREVIEW',window.TET2TrackAssignment390?.html?.()||empty('Route assignment preview unavailable. Official start locked.'))}
    ${panel('SCHEDULE ↔ VERIFIED ROUTE PREVIEW',window.TET2TrackIntegration391?.html?.()||empty('Read-only schedule track integration unavailable.'))}
    ${panel('FH5 ROUTE CATALOGUE · RECONCILIATION',window.TET2RouteReconciliation392?.html?.()||empty('Route catalogue reconciliation unavailable. Official start locked.'))}
    ${panel('TRACK ASSIGNMENT · READINESS',window.TET2TrackReadiness393?.html?.()||empty('Track readiness unavailable. Slot 001 locked.'))}
    ${panel('OFFICIAL TRACK ASSIGNMENT · PREFLIGHT',window.TET2OfficialTrackPreflight394?.html?.()||empty('Track preflight unavailable. Slot 001 locked.'))}
    ${panel('SLOT 001 · LAUNCH READINESS',window.TET2LaunchAudit388?.html?.()||empty('Schedule audit unavailable. Official start remains locked.'))}
    ${slotPanel()}
    <details class="t2-r374-practice"><summary>Earlier local practice trials (separate from the Evil List)</summary>
      <p>The previous practice results, if any, have not been deleted. They remain independent of this candidate timetable and cannot be promoted into official results.</p>
      ${trialPanel()}
      ${panel('Local draw trial',`<button type="button" class="t2-btn" data-t2-draw-open="yes">OPEN ORIGINAL PRACTICE DRAW</button>`)}
      ${practiceAvailable()?panel('Local practice standings',`<button type="button" class="t2-btn" data-t2-page="progress">VIEW PRACTICE STANDINGS</button>`):''}
    </details>
  </div>`;}
  function openingCoverage(){
    const plan=window.TET2OpeningCoverage365;
    if(!plan)return empty('Opening coverage module unavailable. No official tournament slots have been created.');
    try{
      const rows=plan.preview(),audit=plan.validate(rows);
      if(!audit.ok)throw Error(audit.issues.join('; '));
      return `<div class="t2-open-strap">✅ ${audit.covered} independent format appearances covered · Randomised order</div>
        <div class="t2-open-info"><strong>PLANNING ONLY — NOT THE ACTUAL EVIL LIST.</strong><br>Each independent format gets one early appearance in a randomly ordered opening. These are <strong>coverage positions</strong>, NOT live slot numbers, draws or racing instructions. Entrants, tracks and results remain unset. Later rounds can return whenever Controlled Chaos schedules them.</div>
        <ol class="t2-open-list">${rows.map(x=>`<li class="t2-open-item"><span class="t2-open-n">${x.openingPosition.toString().padStart(2,'0')}</span><span><strong>${esc(x.title)}</strong><small>${esc(x.note)}</small></span></li>`).join('')}</ol>
        <p class="t2-open-note">This is the opening-format coverage blueprint, not an exhaustive competition-category inventory. The final generator must reconcile every approved event and eligibility pool before the official schedule is locked.</p>`;
    }catch(e){return `<div class="t2-open-info" role="alert">Coverage check failed; official schedule remains disabled. ${esc(e.message)}</div>`;}
  }
  function evil(){return `${hero('evil')}<div class="t2-content">
    ${panel('EVIL LIST',window.TET2CleanList375?.html?.()||empty('Tournament schedule preview unavailable. No racing has been activated.'))}
    </div>`;}

  function medals(){return `${hero('medals')}<div class="t2-content">${window.TET2Honours387?.html?.()||panel('Official medals',empty('Verified TET2 honours module unavailable. No medals can be inferred from rehearsals.'))}</div>`;}
  function pit(){return `${hero('pit')}<div class="t2-content">${panel('Tournament results archive',`<p>Search completed events by slot number or event name. Once an event is complete, its record is locked and read-only.</p><input aria-label="Search completed events" disabled placeholder="Search slot or event name" style="width:100%;padding:12px;color:#fff;border:1px solid #eb3446;border-radius:8px;background:#101116">`)}${panel('Completed events',empty('No completed TET2 slots yet.'))}${panel('Event detail',empty('Select a completed event to see its entrants, results, standings and awarded medals.'))}</div>`;}
  function swiss(){return `${hero('swiss')}<div class="t2-content">${panel('Select Swiss Cup',empty('No TET2 Swiss Cups scheduled yet.'))}${panel('Competition status',`<p>Each Swiss Cup will retain its pairings, standings and round history across separated Evil List slots.</p>`)}${panel('Swiss standings',empty('A cup must be selected to view standings.'))}${panel('Round history & next appearance',empty('Once scheduled, the next appearance slot and previous rounds will be shown here.'))}</div>`;}
  function hall(){const items=[['Gallery','Artwork and rewards'],['Secret side missions','Unlockable discoveries'],['Incident archive','Illustrated chapters'],['Random rewards','Paints, themes, surprises'],['Unlocked content','All discovered items'],['The shame files','The best of the worst']];
    return `${hero('hall')}<div class="t2-content">${panel('Hall of Shame collections',`<div class="t2-grid">${items.map(([name,desc])=>`<div class="t2-panel" style="margin:0;min-height:116px"><h3 style="color:#ffd36c;text-transform:uppercase">${esc(name)}</h3><p>${esc(desc)}</p></div>`).join('')}</div>`)}${panel('Existing rewards preserved',`<p>Your original OTG! rewards, art and private incident archives have not been reset or imported. Their TET2 presentation and unlock connections are part of the next integration step.</p>`)}</div>`;}
  const pages={hq:command,race,evil,medals,pit,swiss,hall,entry:()=>window.TET2ResultsEntry360?.render()||empty('Results entry code unavailable.'),draw:()=>window.TET2SlotDraw363?.render()||empty('Draw engine unavailable.'),progress:()=>window.TET2PracticeStandings364?.render()||empty('Practice standings unavailable.')};
  function render(resetScroll=false){if(world!=='tet2')return;const y=resetScroll?0:el.scrollTop;el.innerHTML=`<div class="t2-page">${pages[page]()}</div>`;el.scrollTop=y;}
  function dispatch(e){
    if(page==='evil'&&window.TET2CleanList375?.action(e))return;
    const worldBtn=e.target.closest('[data-t2-world]');if(worldBtn){if(worldBtn.dataset.t2World==='otg')backToOTG();else enterTET2();return;}
    if(page==='race'&&window.TET2HistoricalProgress383?.action(e,(next)=>enterTET2(next)))return;
    if(page==='race'&&window.TET2Historical382?.action(e,(next)=>enterTET2(next)))return;
    if(page==='race'&&window.TET2FestivalTop3_381?.action(e,(next)=>enterTET2(next)))return;
    if(page==='race'&&window.TET2Lonely380?.action(e,(next)=>enterTET2(next)))return;
    if(page==='race'&&window.TET2Swiss379?.action(e,(next)=>enterTET2(next)))return;
    if(page==='race'&&window.TET2Relay378?.action(e,(next)=>enterTET2(next)))return;
    if(page==='race'&&window.TET2Aerodromo377?.action(e,(next)=>enterTET2(next)))return;
    if(page==='race'&&window.TET2UnifiedGauntlet376?.action(e,(next)=>enterTET2(next)))return;
    if(page==='race'&&window.TET2StageRehearsal375?.action(e,(next)=>enterTET2(next)))return;
    if(page==='race'&&window.TET2EventRouter375?.action(e,()=>render()))return;
    const ledgerBtn=e.target.closest('[data-t2-ledger]');
    if(ledgerBtn&&ledgerBtn.dataset.t2Ledger==='resume'){
      try {window.TET2SlotLedger361.resumeActive();enterTET2('entry');}
      catch(error){console.warn('TET2 official slot unavailable',error);render();}
      return;
    }
    const trialBtn=e.target.closest('[data-t2-trial-resume]');
    if(trialBtn){try{window.TET2Practice363.open();enterTET2('entry');}catch(error){console.warn('Practice results unavailable',error);render();}return;}
    const drawBtn=e.target.closest('[data-t2-draw-open]');
    if(drawBtn){enterTET2('draw');return;}
    if(page==='draw'&&e.target.closest('[data-t2-draw-action]')){
      window.TET2SlotDraw363?.action(e,()=>enterTET2('race'),(next)=>{if(next==='entry')enterTET2('entry');else render();});return;
    }
    const previewBtn=e.target.closest('[data-t2-entry]');
    if(previewBtn){try{window.TET2ResultsEntry360?.openDemo(previewBtn.dataset.t2Entry);enterTET2('entry');}catch(error){console.warn('TET2 entry preview unavailable',error);}return;}
    if(page==='entry'&&e.target.closest('[data-t2-action]')){window.TET2ResultsEntry360?.act(e,render);return;}
    const progressBtn=e.target.closest('[data-t2-progress-action]');
    if(progressBtn){
      if(progressBtn.dataset.t2ProgressAction==='race'){enterTET2('race');return;}
      if(progressBtn.dataset.t2ProgressAction==='resume'){
        try{window.TET2Practice363.open();enterTET2('entry');}
        catch(error){console.warn('Practice results unavailable',error);enterTET2('race');}
        return;
      }
    }
    const pageBtn=e.target.closest('[data-t2-page]');if(pageBtn){enterTET2(pageBtn.dataset.t2Page);return;}
  }
  function init(){
    if(document.getElementById('tet2-stage4-app'))return;
    el=document.createElement('div');el.id='tet2-stage4-app';el.hidden=true;el.setAttribute('role','main');el.setAttribute('aria-label','The Evil Tournament 2 World');
    tab=document.createElement('button');tab.id='tet2-open-tab';tab.type='button';tab.textContent='😈 TET2';tab.setAttribute('aria-label','Switch to TET2 world');tab.hidden=true;
    document.body.append(el,tab);
    tab.addEventListener('click',()=>enterTET2());el.addEventListener('click',dispatch);
    el.addEventListener('input',e=>{if(page==='evil')window.TET2CleanList375?.input(e);if(page==='entry')window.TET2ResultsEntry360?.draft(e)});
    el.addEventListener('focusout',e=>{if(page==='entry')window.TET2ResultsEntry360?.prettify(e)},true);
    el.addEventListener('change',e=>{
      if(e.target.id==='t2-always')write(ALWAYS,e.target.checked?'yes':'no');
      if(page==='evil')window.TET2CleanList375?.change(e);
      if(page==='draw'&&e.target.id==='t2-draw-format'){
        const sizes=el.querySelector('#t2-draw-size'),match=e.target.value==='raceoff';
        if(sizes){sizes.replaceChildren(...(match?[1,2,4,8]:[3,6,8,16]).map(n=>new Option(n+(match?' match'+(n>1?'es':''):' cars'),String(n))));}
        const label=el.querySelector('label[for="t2-draw-size"]');if(label)label.textContent=match?'Number of matches':'Cars in this group';
      }
    });
    const stored=read(KEY);
    if(read(ALWAYS)==='yes'||(stored!=='otg'&&stored!=='tet2'))chooser();
    else if(stored==='tet2')enterTET2();
    else {world='otg';tab.hidden=false;}
    window.TET2Stage4UI359=Object.freeze({open:()=>enterTET2(),chooser,returnToOTG:backToOTG,page:(id)=>{if(allowed.includes(id)||id==='hq'||id==='progress')enterTET2(id)},openScheduledEntry:(spec)=>{if(!window.TET2SlotLedger361?.isRegisteredSlot(spec))throw Error('TET2 slot is not in the verified ledger');window.TET2SlotLedger361.resumeActive();enterTET2('entry');}});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
