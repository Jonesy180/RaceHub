/* OTG! MAIN 8.0.247 (explicit mobile save hotfix; keep original v8246 storage keys) — first raceable Evil 2.0 source cards in isolated prelaunch storage.
 * ONLY adds/reads otg.evil2.prelaunch.race.v8246:* localStorage keys. Not official.
 * Deliberately does not call rhSave, edit Space, affect honours, or open/reset live Evil tile. */
(()=>{'use strict';
const LAUNCH='otg-e2-first-race-launch-v8246',SCREEN='otg-e2-first-race-screen-v8246';
const PREFIX='otg.evil2.prelaunch.race.v8246:',ENGINE=()=>window.rhEvil2FirstRaceEngine8246;
const h=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const caps=v=>String(v||'');
let slotSelected=1,flash='',pending=false;
function active(){const sp=window.rhSpace?.();if(!sp||sp.catalogueKey!=='fh5-catalogue-v1'||!sp.id)throw Error('Open your FH5 Catalogue Space before launching this cockpit.');
 const data=window.rhEvilSpecialistR18097;if(!data?.events||!Array.isArray(data.slots))throw Error('Original Evil R1 event definitions unavailable.');
 const garage=(sp.cars||[]).map(c=>({id:String(c.id||c.catalogueId||''),name:String(c.name||[c.make,c.model,c.year].filter(Boolean).join(' ')),make:String(c.make||''),type:String(c.classType||'Unclassified')}));
 if(!garage.length||new Set(garage.map(c=>c.id)).size!==garage.length||garage.some(c=>!c.id))throw Error('Owned Garage contains missing or duplicate IDs: no draw permitted.');
 const routes=window.rhFH5TrackTaxonomy8067?.standardPool?.('ROAD');if(!Array.isArray(routes)||routes.length<2)throw Error('Live FH5 Road/Street route catalogue unavailable.');
 const source=typeof window.rhEvilR1QA8103?.slots==='function'?window.rhEvilR1QA8103.slots():data.slots;
 return{space:sp,garage,routes,source,data};}
function src(x,number){const slot=x.source.find(s=>Number(s.slot)===number),event=x.data.events[slot?.eventId];if(!slot||!event||slot.liveFormat!=='GROUPS'||slot.mode!=='Festival')throw Error('Original GROUPS visit '+number+' cannot be verified.');return{slot,event};}
function key(spaceId,n){return PREFIX+encodeURIComponent(spaceId)+':'+String(n);}
function load(id,n){const raw=localStorage.getItem(key(id,n));if(raw===null)return null;
 let d;try{d=JSON.parse(raw);ENGINE().check(d);}catch(_){throw Error('Saved first-race card is unreadable or invalid. It has NOT been overwritten.');}
 if(d.spaceId!==String(id)||d.slot!==n)throw Error('Frozen result belongs to a different FH5 Space / source slot.');return d;}
function save(d){ENGINE().check(d);const k=key(d.spaceId,d.slot),before=localStorage.getItem(k);if(before){const old=load(d.spaceId,d.slot);if(old?.signedOffAt&&JSON.stringify(old)!==JSON.stringify(d))throw Error('Already completed card cannot be changed.');}
 localStorage.setItem(k,JSON.stringify(d));if(localStorage.getItem(k)!==JSON.stringify(d))throw Error('Phone failed to retain the race result.');}
function pickSeed(){try{return crypto.getRandomValues(new Uint32Array(1))[0];}catch(_){return Date.now()>>>0;}}
function startPilot(){const x=active();if(load(x.space.id,slotSelected))throw Error('This first-race draw is already frozen. Resume instead.');const o=src(x,slotSelected);
 const d=ENGINE().prepare({...o,garage:x.garage,spaceId:x.space.id,routes:x.routes,seed:pickSeed()});save(d);return d;}
function el(){let e=document.getElementById(SCREEN);if(!e){e=document.createElement('section');e.id=SCREEN;e.className='e2first-screen';e.style.display='none';e.setAttribute('role','region');e.setAttribute('aria-label','Evil 2.0 first race cockpit');document.body.appendChild(e);}return e;}
function title(x,n){const {slot,event}=src(x,n);const owned=new Set(x.garage.map(c=>c.id));const real=event.eligibleIds.filter(id=>owned.has(String(id))).length;
 return'<b>'+h(slot.event)+'</b><span>'+real+' eligible owned cars · '+h(slot.doNow)+'</span>';}
function resultRows(d){return ENGINE().standings(d).map((r,i)=>'<div class="e2first-row"><span>'+((r.total!==null)?(i+1)+'. ':'– ')+h(r.name)+'</span><b>'+h(r.total===null?(r.entered+'/2 routes'):ENGINE().formatTime(r.total))+'</b></div>').join('');}
function output(){const root=el();if(root.style.display==='none')return;let x,d=null;let s='<div class="e2first-wrap"><button type="button" data-first="back" class="e2first-back">← BACK TO FESTIVAL</button><small class="e2first-kicker">EVIL TOURNAMENT 2.0 · FIRST PLAYABLE RACE CONTROLS</small><h2>THE FIRST STARTING GRID 🏁</h2><p class="e2first-warning"><b>PRELAUNCH RACE PILOT — NOT OFFICIAL EVIL 2.0.</b> You can enter real FH5 times and save this group on your phone, but these trial results are separate from your existing Garage, race history, medals and Evil Tournament. This is NOT the final master slot list.</p>';
 try{x=active();s+='<p class="e2first-count">'+x.garage.length+' FH5 cars in the live Garage · original R1 events verified</p>';
 if(flash)s+='<p role="status" aria-live="polite" class="e2first-flash">'+h(flash)+'</p>';
 s+='<div class="e2first-tabs">'+[1,2].map(n=>'<button type="button" data-first="select" data-slot="'+n+'" class="'+(slotSelected===n?'selected':'')+'">SOURCE SLOT '+n+'<small>'+h(src(x,n).slot.event)+'</small></button>').join('')+'</div>';
 d=load(x.space.id,slotSelected);s+='<div class="e2first-card"><h3>'+title(x,slotSelected)+'</h3>';
 if(!d){s+='<p>The first GROUPS visit from the original Evil list. Freeze its real owned-car draw, then record each entrant on <b>two genuine FH5 Road/Street routes</b>. The two lowest combined times qualify.</p><p class="e2first-small">No old race result is copied. Starting saves only a new, separate prelaunch card; it never resets a Space.</p><button type="button" data-first="freeze" class="e2first-primary">🎲 FREEZE THIS PRELAUNCH GROUP DRAW</button>'}
 else{const next=ENGINE().next(d),done=d.carIds.reduce((sum,id)=>sum+d.results[id].filter(t=>t!==null).length,0),all=d.carIds.length*2;
 s+='<p><b>GROUP 1 OF '+d.groupCount+'</b> · '+d.carIds.length+' cars × 2 tracks · <b>'+done+' / '+all+' saved</b></p>';
 s+='<div class="e2first-routes"><div><small>RACE 1 — FIXED ROUTE</small><b>'+h(d.tracks[0])+'</b></div><div><small>RACE 2 — FIXED ROUTE</small><b>'+h(d.tracks[1])+'</b></div></div>';
 if(d.signedOffAt){s+='<div class="e2first-done"><h3>🏆 GROUP SIGNED OFF — LOCKED</h3><p>Top two qualifiers: <b>'+h(d.cars.find(c=>c.id===d.qualifierIds[0])?.name)+'</b> and <b>'+h(d.cars.find(c=>c.id===d.qualifierIds[1])?.name)+'</b>.</p><p>This pilot does not award official medals or unlock the next main-tournament slot.</p></div>'}
 else if(next){s+='<form class="e2first-next" data-first-form="record"><small>UP NEXT · RACE '+(next.track+1)+' · CAR '+(d.carIds.indexOf(next.car.id)+1)+' OF '+d.carIds.length+'</small><h3>'+h(next.car.name)+'</h3><p>'+h(next.car.make)+' · '+h(next.trackName)+'</p><input type="hidden" name="car" value="'+h(next.car.id)+'"><input type="hidden" name="track" value="'+next.track+'"><label>FH5 lap / event time <input required name="time" inputmode="decimal" autocomplete="off" placeholder="03:42.250" aria-label="Race time"></label><button class="e2first-primary" type="button" data-first="record">SAVE THIS TIME →</button></form>'}
 else{s+='<div class="e2first-done"><b>ALL TIMES BANKED.</b> Check the provisional order below, then sign off. A tie at the qualification cutoff must be resolved first.</div><button type="button" data-first="sign" class="e2first-primary">🏁 SIGN OFF GROUP — LOCK RESULTS</button>'}
 s+='<h3>GROUP STANDINGS</h3><div class="e2first-list">'+resultRows(d)+'</div>';
 if(!d.signedOffAt){s+='<details class="e2first-details"><summary>CORRECT A TYPED TIME (BEFORE SIGN-OFF)</summary><p>Only for correcting an incorrectly transcribed time — not a second racing attempt. All edits are logged in the separate pilot record.</p>';
 for(const c of d.cars){const times=d.results[c.id];s+='<div class="e2first-correction"><b>'+h(c.name)+'</b>'+times.map((ms,i)=>ms!==null?'<form data-first-form="correct"><input name="car" type="hidden" value="'+h(c.id)+'"><input name="track" type="hidden" value="'+i+'"><span>R'+(i+1)+' '+ENGINE().formatTime(ms)+'</span><input name="time" required inputmode="decimal" placeholder="MM:SS.mmm" aria-label="Correct recorded time"><button type="button" data-first="correct">CORRECT</button></form>':'').join('')+'</div>';}s+='</details>';}
 s+='<button type="button" data-first="export" class="e2first-secondary">💾 EXPORT THIS PRELAUNCH CARD (JSON)</button>';
 s+='<p class="e2first-small">Draw and results are stored under <code>otg.evil2.prelaunch.race.v8246</code> for this FH5 Space, not in the official portable backup. Export a copy if you race it. No official results, medals, progression, or Space history change.</p>';}
 s+='</div>';
 }catch(err){s+='<div class="e2first-error"><b>NOT READY:</b> '+h(err.message)+'</div>';}
 s+='<button type="button" data-first="back" class="e2first-back">← BACK TO FESTIVAL</button></div>';root.innerHTML=s;}
function show(){const box=el();box.style.display='block';document.getElementById('festival')?.classList.add('hidden');flash='';output();try{window.scrollTo(0,0)}catch(_){}}
function hide(){el().style.display='none';document.getElementById('festival')?.classList.remove('hidden');}
function download(d){const file={format:'OTG_EVIL2_FIRST_RACE_PRELAUNCH_V8246',source:'PERSONAL_ISOLATED_PRELAUNCH_ONLY',exportedAt:new Date().toISOString(),official:false,card:d};
 const blob=new Blob([JSON.stringify(file,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='OTG_EVIL2_PRELAUNCH_SLOT_'+d.slot+'_'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
function recordForm(f){
 if(!f||!f.matches('form[data-first-form]'))throw Error('Race entry form is no longer available.');
 const x=active(),d=load(x.space.id,slotSelected);if(!d)throw Error('No frozen group to record.');
 const id=f.querySelector('input[name="car"]')?.value;
 const route=f.querySelector('input[name="track"]')?.value;
 const raw=f.querySelector('input[name="time"]')?.value||'';
 const track=Number(route),ms=ENGINE().parseTime(raw);
 if(ms===null)throw Error('Enter a full race time such as 03:42.250 (MM:SS.mmm). The result was NOT saved.');
 if(f.dataset.firstForm==='correct'&&!confirm('Correct a TYPING ERROR only? This is NOT permission to rerun a car.'))return;
 const saved=ENGINE().record(d,id,track,ms);save(saved);
 flash=(f.dataset.firstForm==='correct'?'CORRECTED':'SAVED')+' ✓ '+ENGINE().formatTime(ms)+' · '+saved.cars.find(c=>c.id===id)?.name+' · Race '+(track+1)+' — result retained on this phone.';
 output();
}
function clicked(ev){const btn=ev.target.closest('button[data-first]');if(!btn)return;try{const action=btn.dataset.first;
 if(action==='back'){hide();return;}if(action==='select'){slotSelected=Number(btn.dataset.slot);flash='';output();return;}
 if(action==='record'||action==='correct'){recordForm(btn.closest('form[data-first-form]'));return;}
 if(action==='freeze'){if(!confirm('Freeze a SEPARATE prelaunch group draw? This saves a trial card only, never resets official OTG data.'))return;const d=startPilot();flash='Prelaunch draw frozen for '+d.cars.length+' cars. Two FH5 tracks selected.';output();return;}
 const x=active(),d=load(x.space.id,slotSelected);if(!d)throw Error('Freeze a group first.');
 if(action==='export'){download(d);flash='Separate prelaunch card exported. Official backup unchanged.';output();return;}
 if(action==='sign'){if(!confirm('SIGN OFF and permanently LOCK this prelaunch group? Check every time first.'))return;const saved=ENGINE().signOff(d);save(saved);flash='Group locked in the isolated pilot only. Existing tournaments untouched.';output();return;}
 }catch(err){flash='NOT SAVED: '+String(err.message||err);output();}}
function submitted(ev){const f=ev.target.closest('form[data-first-form]');if(!f)return;ev.preventDefault();try{recordForm(f);}catch(err){flash='NOT SAVED: '+String(err.message||err);output();}}
function launch(){const festival=document.getElementById('festival');if(!festival||festival.classList.contains('hidden')||!festival.children.length||festival.querySelector('#'+LAUNCH))return;
 const panel=document.createElement('section');panel.id=LAUNCH;panel.className='e2first-launch';panel.innerHTML='<details><summary>🏁 EVIL 2.0 — FIRST PLAYABLE RACE CARDS <small>PRELAUNCH</small></summary><p>Original opening GROUPS races, actual FH5 cars and tracks, manual timing and separately saved progress. No career changes.</p><button type="button">OPEN FIRST RACE COCKPIT</button></details>';
 const safe=festival.querySelector('#otg-evil2-launch-safety-8231')||festival.querySelector('.e2safe-launch');if(safe)safe.insertAdjacentElement('afterend',panel);else festival.appendChild(panel);
 panel.querySelector('button').addEventListener('click',show);}
function init(){const f=document.getElementById('festival');if(!f)return;const box=el();box.addEventListener('click',clicked);box.addEventListener('submit',submitted);
 new MutationObserver(()=>{if(pending)return;pending=true;setTimeout(()=>{pending=false;launch();},140)}).observe(f,{childList:true,subtree:true});launch();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.rhEvil2FirstRaceCockpit8246={show,hide,load,key};
})();
