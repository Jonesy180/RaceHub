/* OTG! v8.0.309 — painted HQ first, pages 2–65 = schedule, direct native racing. */
(()=>{'use strict';
const ID='otg-e263-list', api=()=>window.rhEvil2Mixed8262;
let query='',group='ALL',page=0,notice='',opened=false,loading=false,snapshotCache=null,filteredCache=null,searchTimer=null,loadToken=0,firstPageExpanded=false,maintenance=false,drawPreview=null,launchBusy=false; const PAGE=35; // Page 1 is Headquarters; pages 2-65 contain the 2,225 stages.
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const label=r=>r.kind==='EXISTING'?'ORIGINAL':r.action==='RESTORED_ARCHIVE'?'ARCHIVE':r.action==='RESTORED_LONELY'?'LONELY HEARTS':r.action==='NEW_MAKE'?'NEW MAKE':r.action==='NEW_GAUNTLET'?'GAUNTLET':r.action==='LONG_JUMP'?'LONG JUMP':r.action==='NEW_RELAY'?'RELAY':r.action==='GRAND_SECOND_CHANCE'?'SECOND CHANCE':String(r.kind||'OTHER');

// The Evil Extras are immediate navigation, not part of the 2,225-row stage list.
// Legacy feature engines are preserved in the existing installation. Never fabricate
// data or mark an unavailable module as working.
const EXTRAS=[
 ['pit','🏁','Pit Wall','Completed-event archive'],
 ['swiss','⚔️','Swiss War Room','Swiss Cup command centre'],
 ['rivalries','🥊','Rivalry Files','The recurring battles'],
 ['museum','🏆','Career Museum','Lifetime achievements'],
 ['incidents','📁','Incident Archive','Classified Jones Mob files'],
 ['missions','🤫','Secret Side Missions','Sealed discoveries'],
 ['cones','🚧','Cone Breaks','Intermission mayhem'],
 ['medals','🏅','Medal Tables','Car and maker honours']
];
const EXTRA_APIS={
 pit:['rhPitWall8158','otgPitWall8158','rhPitWall'],
 swiss:['rhSwissWarRoom8160','otgSwissWarRoom8160','rhSwissWarRoom'],
 rivalries:['rhRivalryFiles8162','rhRivalryFiles8161','otgRivalryFiles'],
 museum:['rhCareerMuseum8159','otgCareerMuseum8159','rhCareerMuseum'],
 incidents:['rhPrivateMobIncidents8179','rhIncidentArchive8177','rhPrivateMobIncidents8176'],
 missions:['rhSecretSideMissions8163','rhEvilSecretSideMissions8163'],
 cones:['rhConeBreaks8164','rhConeBreak8172','rhConeBreak8164'],
 medals:['rhEvil2Honours8257']
};
function extraPanel(){return '<section class="e266-extras" aria-label="Evil Extras"><div class="e266-extras-head"><h2>🏛️ EVIL EXTRAS</h2><span>COMMAND CENTRE</span></div><div class="e266-extras-grid">'+EXTRAS.map(([id,icon,title,sub])=>'<button type="button" data-e263="extra" data-extra="'+id+'"><span class="e266-icon">'+icon+'</span><strong>'+title+'</strong></button>').join('')+'</div></section>';}
function openExtra(id){
 const title=EXTRAS.find(x=>x[0]===id)?.[2]||'Extra';
 const candidates=EXTRA_APIS[id]||[];
 for(const key of candidates){const feature=window[key];
   if(typeof feature==='function'){try{feature();opened=false;loadToken++;el().hidden=true;return;}catch(e){break;}}
   if(feature&&typeof feature==='object')for(const method of ['open','show','render']){
     if(typeof feature[method]==='function'){try{feature[method]();opened=false;loadToken++;el().hidden=true;return;}catch(e){break;}}
   }
 }
 // Some historical extras are launched by the original Evil screen's controls.
 // Don't guess a route or send the user to an unrelated screen.
 notice=title+' is preserved in the existing installation, but its legacy launcher has not yet been reconnected to this screen. No data has changed.';
 render();
}

function el(){let d=document.getElementById(ID);if(!d){d=document.createElement('div');d.id=ID;d.className='e263-overlay';d.hidden=true;document.body.appendChild(d);d.addEventListener('click',onClick);d.addEventListener('input',e=>{if(e.target.matches('[data-e263-search]')){query=e.target.value;page=1;filteredCache=null;clearTimeout(searchTimer);searchTimer=setTimeout(rowsOnly,140);}});}return d;}
function current(force=false){if(!force&&snapshotCache)return snapshotCache;if(!api()?.snapshot)throw Error('Mixed tournament native coordinator is unavailable.');const s=api().snapshot();if(!s.p||!Array.isArray(s.p.rows))throw Error('Verified stage sequence is unavailable.');snapshotCache=s;filteredCache=null;return s;}
function matches(r){let q=query.trim().toLowerCase();return(group==='ALL'||label(r)===group)&&(!q||String(r.position)===q||r.name.toLowerCase().includes(q)||String(r.kind).toLowerCase().includes(q)||String(r.originalSlot||'').toLowerCase()===q);}
function stageRows(records,s){return records.map(r=>{const done=!!s.b && !!(r.action==='ORIGINAL_SLOT'||r.action==='ORIGINAL_SPECIALIST'||r.action==='ORIGINAL_SWISS'?s.sp.evil2NativeRun8250?.slots?.[r.originalSlot]?.doneAt:s.b?.done?.[r.id]);const next=s.next?.r?.id===r.id;return '<article class="e263-row '+(next?'e263-next ':'')+(done?'e263-done':'')+'"><span class="e263-number">#'+r.position+'</span><div><strong>'+esc(r.name)+'</strong><small>'+esc(label(r))+(r.originalSlot?' · Original slot '+r.originalSlot:'')+'</small></div><span class="e263-flag">'+(done?'✓ DONE':next?'NEXT':'LOCKED')+'</span></article>';}).join('');}
function data(){const s=current();return {s,all:filteredCache||(filteredCache=(drawPreview?.rows||s.p.rows).filter(matches))};}
function pager(count){const pages=1+Math.max(1,Math.ceil(count/PAGE));return '<nav class="e267-pager" aria-label="Tournament pages"><button type="button" aria-label="Previous page" data-e263="prev" '+(page===0?'disabled':'')+'>❮</button><span>PAGE '+(page+1)+' / '+pages+'</span><button type="button" aria-label="Next page" data-e263="next" '+(page>=pages-1?'disabled':'')+'>❯</button></nav>';}
function routeInfo(r,s){
 const res=[];const add=(k,v)=>{if(v!==null&&v!==undefined&&String(v).trim())res.push('<span><b>'+esc(k)+'</b> '+esc(v)+'</span>');};
 const m=/^(.+?) — (Festival|Race Off)$/.exec(r.name||'');
 const isFestival=m?.[2]==='Festival';
 if(r.action==='RESTORED_ARCHIVE'||r.action==='NEW_MAKE'){
   add('Format',isFestival?'Festival · 3 races':'Race Off · knockout');
   const make=m?.[1];
   if(make){let count=(s.sp?.cars||[]).filter(c=>String(c.make||'').trim()===make).length;add('Owned entrants',count||null);}
   // Only show real, already-saved routes. The archived standard engine randomly
   // draws routes on event entry; computing them here would create false previews.
   const book=s.sp?.evil2Restored8261?.stages?.[r.id];
   const savedRun=book&&(s.sp?.runs||[]).find(run=>run.id===book.runId);
   if(savedRun?.rounds?.length){
     const rounds=savedRun.rounds.filter(x=>x?.name);
     if(rounds.length){const results=savedRun.results||[];
       const count=results.length,possible=(savedRun.entries||[]).length*rounds.length;
       add('Progress',possible?count+' / '+possible+' times saved':null);
       res.push('<div class="e268-tracks"><b>Routes</b> '+rounds.map((v,i)=>'<span>'+(i+1)+'. '+esc(v.name)+'</span>').join('')+'</div>');
     }
   }else if(isFestival){add('Routes','Selected when the event starts');}
   else add('Bracket','Generated when the event starts');
 } else if(r.action==='LONG_JUMP'){
   add('Format','One attempt · distance');add('Location','Aeródromo runway');
 }else if(r.action==='NEW_RELAY'){
   add('Format','Three-car relay');add('Round',r.round);add('Group',r.group);
 }else if(r.action==='ORIGINAL_SWISS'){
   add('Format','Swiss Cup');add('Original slot',r.originalSlot);
 }else if(r.action==='NEW_GAUNTLET'){
   add('Format','Gauntlet');add('Routes','Selected by the native race engine');
 }else{
   const known=r.format||r.formatName||r.sourceFormat;
   if(known)add('Format',known);
   const track=r.track||r.trackName||r.routeName;
   if(track)add('Route',track);
   const place=r.location||r.region;if(place)add('Location',place);
 }
 return res.length?'<div class="e268-details">'+res.join('')+'</div>':'<div class="e268-details"><span>Race details available when the event opens.</span></div>';
}
// Evil 1 progress is scheduled for retirement. Until a controlled reset is durable,
// show the real Stage 001 as the NEW campaign starting grid, never mislabel the
// six old QA-completed visits as the new campaign's progress. No writes here.
function eventPanel(s){
 const prelaunch=!drawPreview?.active;
 const n=drawPreview?.active?(drawPreview.first):(drawPreview?.first||s.p?.rows?.[0]);
 if(!n)return '<section class="e267-event"><strong>🏁 NO VERIFIED STAGE AVAILABLE</strong></section>';
 const status=drawPreview?.active?'🔒 OFFICIAL DRAW LOCKED · EVIL 2.0 ACTIVE':(drawPreview?'VERIFIED SHUFFLED DRAFT · RACING LOCKED':'SOURCE ORDER · DRAW NOT LOADED');
 const note=drawPreview?.active?'<small class="e290-startnote">Old Evil retired · final shuffled draw frozen. Native OTG racing and results retained.</small>':(prelaunch?'<small class="e290-startnote">Verified shuffled draw ready. Old Evil retirement requires a one-time launch confirmation.</small>':'');
 return '<section class="e267-event e268-event"><div class="e267-eyebrow"><span>🏎️ '+(prelaunch?'NEW CAMPAIGN STARTING GRID':'CURRENT / NEXT EVENT')+'</span><span>STAGE '+n.position+' / '+s.p.stageCount+'</span></div><h2>'+esc(n.name)+'</h2>'+routeInfo(n,s)+'<div class="e268-eventfoot"><span>'+status+'</span></div>'+note+'</section>';
}
function launchControls(){
 // Show the genuine activation beside CURRENT EVENT, not inside Prelaunch Maintenance.
 // No activation while the verified draw is still loading or missing.
 if(drawPreview?.active){return '<section class="e305-launch" aria-label="Evil 2.0 active"><strong>🔒 OFFICIAL DRAW LOCKED · EVIL 2.0 ACTIVE</strong><button type="button" data-e263="raceactive" '+(launchBusy?'disabled':'')+'>🏁 OPEN CURRENT RACING STAGE</button></section>';}
 if(!drawPreview){return '<section class="e305-launch" aria-label="Evil 2.0 launch"><strong>🎲 FINAL EVIL 2.0 DRAW</strong><button type="button" disabled>VERIFYING SHUFFLED DRAW…</button><small>No reset until the verified draw is ready.</small></section>';}
 const valid=Array.isArray(drawPreview.rows)&&drawPreview.rows.length===2225&&Boolean(drawPreview.first)&&Boolean(drawPreview.sha256);
 return '<section class="e305-launch" aria-label="Evil 2.0 launch"><strong>🎲 FINAL EVIL 2.0 DRAW</strong><button type="button" data-e263="activate303" '+(!valid||launchBusy?'disabled':'')+'>'+(launchBusy?'🔒 ACTIVATING EVIL 2.0…':'🎲 LOCK DRAW · BIN OLD EVIL · LAUNCH 2.0')+'</button><small>'+(valid?'Confirmation and verified backup required before any reset.':'Verified 2,225-stage draw unavailable; activation blocked.')+'</small></section>';
}
function preflightReport(s){
 const rows=s?.p?.rows||[];
 const checks=[
  ['Stage count',rows.length===2225,rows.length+' / 2225'],
  ['Stage numbering',rows.every((r,i)=>r.position===i+1),'Unique sequential positions'],
  ['Format holds',Number(s?.blocked)===0,String(s?.blocked??'unknown')],
  ['Next event in schedule',!!s?.next?.r && rows.some(r=>r.id===s.next.r.id),s?.next?.r?.name||'Missing'],
  ['Original campaign slots',rows.filter(r=>r.kind==='EXISTING').length===1219,rows.filter(r=>r.kind==='EXISTING').length+' / 1219'],
 ];
 return {ok:checks.every(c=>c[1]),checks};
}
function preflightHtml(s){const report=preflightReport(s);
 return '<div class="e269-audit"><strong>'+ (report.ok?'✓ Schedule checks passed':'⚠ Schedule checks incomplete')+'</strong>'+report.checks.map(([name,ok,detail])=>'<div><span>'+(ok?'✓':'✕')+' '+esc(name)+'</span><small>'+esc(detail)+'</small></div>').join('')+'<p>Read-only checks. Does not certify live engine navigation, prizes or results.</p></div>';
}
function qaPanel(s){return '<details class="e268-qa"><summary>🔒 PRELAUNCH QA CONTROLS</summary>'+preflightHtml(s)+'<div class="e270-tools"><strong>Storage quota investigation</strong><p>The previous freeze exceeded browser storage quota. Do not retry freezing until we inspect the read-only report.</p><button type="button" data-e263="storage">🔎 CHECK STORAGE (READ ONLY)</button><div data-e270-report></div></div><div class="e272-migration"><strong>Protected IndexedDB copy test</strong><p>After keeping your private JSON backup, copy and verify the saved state. Original localStorage and live save engine remain unchanged.</p><button type="button" data-e263="idbcopy">🛡️ COPY & VERIFY IN INDEXEDDB (NO SWITCH)</button><div data-e272-result></div></div><div class="e274-rehearsal"><strong>IndexedDB save / reopen rehearsal</strong><p>Tests a separate reversible transaction against the verified copy. It does not switch the live OTG! save engine.</p><button type="button" data-e263="idbrehearse">🧪 REHEARSE IDB SAVE + REOPEN (NO SWITCH)</button><div data-e274-result></div></div><div class="e275-readiness"><strong>Storage-engine integration readiness</strong><p>Check the native save entrypoints and prepare an isolated async adapter. No live storage switch.</p><button type="button" data-e263="idbreadiness">🔍 CHECK SAVE ENGINE (READ ONLY)</button><div data-e275-result></div></div><div class="e276-shadow"><strong>Native save shadow — session QA</strong><p>Optional live rhSave monitoring. Mirrors successful saves to IndexedDB, verifies the copy and NEVER replaces primary localStorage. Not a quota fix.</p><button type="button" data-e263="shadowenable">🛡️ ENABLE VERIFIED SHADOW (THIS SESSION)</button> <button type="button" data-e263="shadowstatus">CHECK SHADOW STATUS</button><div data-e276-status></div></div><div class="e277-checkpoint"><strong>Controlled storage transition checkpoint</strong><p>Verify a modified copy survives closing and reopening OTG!. No live-save switch or racing write.</p><button type="button" data-e263="transwrite">🧪 WRITE TEST CHECKPOINT</button> <button type="button" data-e263="transverify">✓ VERIFY AFTER REOPEN</button><div data-e277-report></div></div><section class="e278-qa"><strong>Save/load cutover preflight</strong><p>Read-only startup gate and isolated three-write persistence test. No live save switch.</p><button type="button" data-e263="cutover278">🛡️ TEST ORDERED IDB WRITES (NO SWITCH)</button><div data-e278-report></div></section><section class="e279-pilot"><strong>🛡️ Native IndexedDB Pilot — isolated TEST ONLY</strong><p>Tests the actual OTG! native save/load flow in a separate verified IndexedDB clone. Your original main save is never replaced. DO NOT ENTER RACES while pilot mode is active.</p><button type="button" data-e263="pilotstart">ENABLE ISOLATED SAVE PILOT</button> <button type="button" data-e263="pilottest">TEST NATIVE SAVE</button> <button type="button" data-e263="pilotverify">VERIFY AFTER REOPEN</button> <button type="button" data-e263="pilotexit">EXIT PILOT / RESTORE ORIGINAL</button><div data-e279-report></div></section><section class="e281-retirement"><strong>🗑️ Old Evil retirement — selective audit</strong><p>Identify old Evil-only fields without binning normal racing, Garage, Spaces, custom events or private archives.</p><button type="button" data-e263="retireaudit">SCAN OLD EVIL (READ ONLY)</button><div data-e281-report></div></section><section class="e291-candidate"><strong>🏁 Clean launch preparation</strong><p>Stage a clean candidate, inspect shared racing-result provenance and rehearse a seeded, constraint-safe mixed draw. No live changes.</p><button type="button" data-e263="launchcandidate">PREPARE CANDIDATE + AUDIT SHUFFLE</button><div data-e291-result></div></section><p>QA freeze remains disabled. No production storage switch.</p></details>';}
function shellStart(){return '<div class="e263-shell"><button class="e263-back" data-e263="close">← DASHBOARD</button>';}
function head(){return '<header class="e263-hero e267-hero e284-hero" aria-label="Evil Tournament 2.0: Lord Ratchet and Ma Lubrication"><img class="e284-hero-art" src="assets/tournaments/lord-ratchet-ma-lubrication-v8284.webp" alt="Lord Ratchet the crowned raccoon tournament director, with fearsome Ma Lubrication supervising in the racing garage" decoding="async" fetchpriority="high"><span class="e284-hero-label">EVIL TOURNAMENT <b>2.0</b></span><span class="e284-hero-credit">LORD RATCHET · MA LUBRICATION</span></header>'; }
function controls(){return '<div class="e263-controls"><label>FIND A STAGE<input data-e263-search type="search" placeholder="Stage number or event" value="'+esc(query)+'"></label><label>FORMAT<select data-e263-group>'+['ALL','ORIGINAL','ARCHIVE','LONELY HEARTS','NEW MAKE','GAUNTLET','LONG JUMP','RELAY','SECOND CHANCE'].map(x=>'<option'+(x===group?' selected':'')+'>'+x+'</option>').join('')+'</select></label></div>';}
function rowsOnly(){const host=el().querySelector('[data-e263-rows]');if(!host)return;
 if(page===0){host.innerHTML=pager(2225);return;}
 let o;try{o=data();}catch(e){host.innerHTML='<p class="e263-warn">SAFE STOP: '+esc(e.message)+'</p>';return;}
 const {s,all}=o;const pages=Math.max(1,Math.ceil(all.length/PAGE));page=Math.max(1,Math.min(page,pages));const off=(page-1)*PAGE;
 host.innerHTML='<div class="e263-row-count">STAGES '+(off+1)+'–'+Math.min(off+PAGE,all.length)+' OF '+all.length+'</div>'+stageRows(all.slice(off,off+PAGE),s)+pager(all.length);
}
function render(){if(maintenance){el().innerHTML=shellStart()+'<div class="e283-tools"><button type="button" class="e283-return" data-e263="backhq">← BACK TO EVIL HEADQUARTERS</button><h1>🔒 PRELAUNCH MAINTENANCE</h1><p>Development tools only · no Evil reset</p>'+qaPanel(snapshotCache||{p:{rows:[]}})+'</div></div>';return;}let o;try{o=data();}catch(e){el().innerHTML=shellStart()+'<h2>SAFE STOP</h2><p>'+esc(e.message)+'</p><p>No data changed.</p></div>';return;}
const {s}=o;let html=shellStart();if(page===0){html+=head()+extraPanel()+eventPanel(s)+launchControls();}else{html+='<header class="e267-listhead"><span>EVIL TOURNAMENT · '+s.p.stageCount+' STAGES</span><h1>TOURNAMENT SCHEDULE</h1><small>Official draw · 35 stages per page</small></header>'+controls();}
if(notice)html+='<p class="e263-notice" role="status">'+esc(notice)+'</p>';
html+='<div data-e263-rows></div>'+(page===0?'<div class="e283-maint-link"><button type="button" data-e263="maintenance">🔒 Prelaunch maintenance</button></div>':'')+(page===0?'<p class="e267-safety">'+(drawPreview?.active?'EVIL 2.0 ACTIVE · FINAL DRAW LOCKED':'PRELAUNCH QA · NO LIVE EVIL RESET')+'</p>':'<p class="e267-safety">Browse the permanently numbered schedule</p>')+'</div>';el().innerHTML=html;rowsOnly();}
// A single vault inspection owns the event briefing. The previous version
// started two inspections and a delayed coordinator render, which alternately
// replaced the correct briefing with the Loading current event placeholder.
function loadDraw(token){
 const inspect=window.otgEvilRoute8306?.inspect;
 if(typeof inspect!=='function'){notice='SAFE STOP — Verified campaign reader unavailable';return;}
 Promise.resolve().then(()=>window.otgEvilRoute8306.inspect()).then(plan=>{
  if(!opened||token!==loadToken)return;
  if(!plan||!Array.isArray(plan.rows)||plan.rows.length!==2225)throw Error('Verified official draw is unavailable');
  drawPreview=plan;filteredCache=null;loading=false;
  if(!maintenance)render();
 }).catch(err=>{
  if(!opened||token!==loadToken)return;
  loading=false;notice='SAFE STOP — '+String(err.message||err);
  // Keep the last verified view if a transient inspection fails.
  if(drawPreview&&!maintenance)render();else{const live=el().querySelector('.e283-loading');if(live)live.textContent=notice;}
 });
}
function show(){
 if(opened)return;
 opened=true;notice='';loading=true;filteredCache=null;page=0;query='';group='ALL';firstPageExpanded=false;maintenance=false;
 const d=el();d.hidden=false;
 // Preserve the most recently verified draw for an immediate stable re-open.
 // The vault is still rechecked once, without any racing-state changes.
 if(snapshotCache&&drawPreview){
  try{render();}catch(_){d.innerHTML=shellStart()+head()+extraPanel()+'<section class="e267-event e268-event"><p class="e283-loading">Loading current event…</p></section></div>';}
 }else{
  d.innerHTML=shellStart()+head()+extraPanel()+'<section class="e267-event e268-event"><div class="e267-eyebrow">🏎️ CURRENT / NEXT EVENT</div><p class="e283-loading" role="status">Loading current event…</p></section><div class="e283-maint-link"><button type="button" data-e263="maintenance">🔒 Prelaunch maintenance</button></div></div>';
 }
 const token=++loadToken;
 window.scrollTo?.(0,0);
 // A microtask starts BEFORE the browser paints. Yield two animation frames
 // plus a task so the hero and extras actually reach the display first.
 requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(()=>{
  if(opened&&token===loadToken)loadDraw(token);
 },0)));

}
function close(){opened=false;loading=false;loadToken++;clearTimeout(searchTimer);el().hidden=true;const old=document.getElementById('evilcampaign');if(old)old.classList.add('hidden');if(originalShow)originalShow('home');else{document.querySelectorAll('main > section.screen').forEach(s=>s.classList.toggle('hidden',s.id!=='home'));}}
function onClick(e){const b=e.target.closest('button[data-e263]');if(!b)return;const act=b.dataset.e263;try{if(act==='close'){close();return;}if(act==='activate303'){if(launchBusy)return;if(!drawPreview||drawPreview.active)throw Error('Inactive verified draw required');if(!window.confirm('FINAL EVIL 2.0 LAUNCH: permanently lock the existing shuffled 2,225-stage draw and retire the Old Evil campaign & QA progress? All Spaces, Garage and unclassified normal racing results will be preserved. A full pre-launch backup is made first.'))return;launchBusy=true;notice='LOCKING DRAW AND RETIRING OLD EVIL…';render();window.otgEvilLaunch8303.activate().then(()=>{launchBusy=false;drawPreview=null;filteredCache=null;loadDraw(loadToken);notice='✓ OLD EVIL RETIRED · SHUFFLED DRAW LOCKED · EVIL 2.0 ACTIVE';render();}).catch(err=>{launchBusy=false;notice='SAFE STOP — '+String(err.message||err);render();});return;}if(act==='raceactive'){
 if(!drawPreview?.active)throw Error('Tournament has not launched');
 if(launchBusy)return;
 launchBusy=true;
 const button=el().querySelector('[data-e263="raceactive"]');
 if(button){button.disabled=true;button.textContent='🏁 OPENING ABARTH FESTIVAL…';}
 // Keep the existing Headquarters visible until the native racing engine has
 // displayed its screen. Never expose an empty body during the async vault read.
 const token=loadToken;
 window.otgEvilRoute8306.openStage(1,true,true).then(()=>{
  if(!opened||token!==loadToken)return;
  // Give the native screen a paint opportunity before retiring Headquarters.
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
   if(!opened||token!==loadToken)return;
   launchBusy=false;opened=false;loadToken++;el().hidden=true;
  }));
 }).catch(err=>{
  if(!opened||token!==loadToken)return;
  launchBusy=false;notice='SAFE STOP — '+String(err.message||err);render();
 });
 return;
}if(act==='maintenance'){maintenance=true;render();el().scrollTop=0;return;}if(act==='backhq'){maintenance=false;drawPreview=null;filteredCache=null;loadDraw(loadToken);render();el().scrollTop=0;return;}if(act==='extra'){openExtra(b.dataset.extra);return;}if(act==='prev'||act==='next'){page+=act==='prev'?-1:1;firstPageExpanded=false;filteredCache=null;render();el().scrollTop=0;return;}if(act==='togglefirst'){firstPageExpanded=!firstPageExpanded;rowsOnly();return;}if(act==='storage'){window.rhStorageCheck8271?.(el().querySelector('[data-e270-report]'));return;}if(act==='idbcopy'){window.rhIDBCopyVerify8272?.(el().querySelector('[data-e272-result]'));return;}if(act==='idbrehearse'){window.rhIDBRehearse8274?.(el().querySelector('[data-e274-result]'));return;}if(act==='idbreadiness'){window.otgStorageReadiness8275?.(el().querySelector('[data-e275-result]'));return;}if(act==='shadowenable'){window.otgNativeShadowEnable8276?.(el().querySelector('[data-e276-status]'));return;}if(act==='shadowstatus'){window.otgNativeShadowStatus8276?.(el().querySelector('[data-e276-status]'));return;}if(act==='transwrite'){window.otgTransitionWrite8277?.(el().querySelector('[data-e277-report]'));return;}if(act==='transverify'){window.otgTransitionVerify8277?.(el().querySelector('[data-e277-report]'));return;}if(act==='cutover278'){window.otgCutoverPreflight8278?.(el().querySelector('[data-e278-report]'));return;}if(act==='launchcandidate'){if(!window.otgEvilLaunchCandidate8301?.prepare)throw Error('Launch candidate module unavailable. Check update installation.');window.otgEvilLaunchCandidate8301.prepare(el().querySelector('[data-e291-result]'));return;}if(act==='retireaudit'){window.otgEvilRetireAudit8281?.(el().querySelector('[data-e281-report]'));return;}if(act==='pilotstart'){window.otgPrimaryPilot279?.activate(el().querySelector('[data-e279-report]'));return;}if(act==='pilottest'){window.otgPrimaryPilot279?.test(el().querySelector('[data-e279-report]'));return;}if(act==='pilotverify'){window.otgPrimaryPilot279?.verify(el().querySelector('[data-e279-report]'));return;}if(act==='pilotexit'){window.otgPrimaryPilot279?.exit();return;}if(act==='freeze'){throw Error('Freeze suspended while browser storage quota is under investigation.');if(!preflightReport(current()).ok)throw Error('Schedule checks failed: QA freeze blocked.');if(!window.confirm('Freeze only the QA stage schedule? No Evil 1 reset, no Garage changes.'))return;api().freeze();current(true);notice='PRELAUNCH QA order frozen. Original Evil 1 untouched.';render();return;}if(act==='race'){let s=current();if(!s.b)throw Error('Freeze the prelaunch schedule before opening a stage.');if(!s.next)throw Error('No next stage.');opened=false;loadToken++;el().hidden=true;api().openStage(s.next.r,s.p);return;}}catch(err){notice='SAFE STOP — '+String(err.message||err);render();}}
// Preserve the EXISTING dashboard Evil Tournament tile and its artwork/position.
// Its existing navigation to evilcampaign is intercepted without changing the card itself.
const originalShow=typeof window.show==='function'?window.show:null;
function route(screen){if(screen==='evilcampaign'){show();return;}if(opened){opened=false;loadToken++;el().hidden=true;}return originalShow?.apply(this,arguments);}
function init(){
 el();
 // The legacy dashboard tile calls a scoped show() rather than window.show().
 // Observe the ACTUAL existing Evil Tournament section becoming active, then
 // replace its screen visually without changing tile DOM or original stored data.
 const old=document.getElementById('evilcampaign');
 if(old){
   const observe=()=>{
     const active=!old.classList.contains('hidden') && getComputedStyle(old).display!=='none';
     if(active){old.classList.add('hidden');if(!opened)show();}
   };
   new MutationObserver(observe).observe(old,{attributes:true,attributeFilter:['class','style']});
   observe();
 }
 // Also support any external code that calls window.show when available.
 if(originalShow)window.show=route;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.rhEvilList8264={open:show,close,version:'8.0.309'};
})();
