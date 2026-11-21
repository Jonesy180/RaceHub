/* TET2 v8.0.399 · native result-entry compatible with stage rehearsal — Multi-result entry + practice and strictly gated official adapters.
 * DEMO previews are volatile; local PRACTICE callback uses isolated browser storage. NO rhSave() or honours,
 * NO existing OTG! results changes. An official caller must provide a verified
 * slot identity and its own transactional onBank callback before any live write.
 */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.TET2ResultsEntry360=api;
})(typeof window!=='undefined'?window:null,function(){
 'use strict';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const S=v=>String(v??'').trim();
 const clone=v=>JSON.parse(JSON.stringify(v));
 let model=null;
 let inFlight=false;
 function normalizeTime(raw){
   const s=S(raw);
   if(/^\d{4,8}$/.test(s)){
     const n=s.padStart(5,'0');
     return `${(n.slice(0,-5)||'0').padStart(2,'0')}:${n.slice(-5,-3)}.${n.slice(-3)}`;
   }
   return s;
 }
 function timeMs(raw){
   const n=normalizeTime(raw), m=n.match(/^(\d{1,3}):([0-5]\d)\.(\d{3})$/);
   if(!m)throw Error('Enter a time as 0336784 or 03:36.784.');
   const ms=((Number(m[1])*60+Number(m[2]))*1000+Number(m[3]));
   if(ms<=0)throw Error('Recorded time must be greater than zero.');
   return ms;
 }
 function display(ms){if(!Number.isInteger(ms)||ms<=0)throw Error('Invalid banked time');
   const minutes=Math.floor(ms/60000),s=Math.floor(ms%60000/1000),millis=ms%1000;
   return `${String(minutes).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(millis).padStart(3,'0')}`;}
 function assertCar(c){if(!c||!S(c.id)||!S(c.name))throw Error('Real entrant id and full name required');return{id:S(c.id),name:S(c.name),h:c.h===true,e:c.e===true};}
 function unique(list){const ids=list.map(c=>c.id);if(new Set(ids).size!==ids.length)throw Error('Duplicate entrants in results screen');}
 function initialise(spec,preview){
   if(!spec||!['group','raceoff','relay','aero'].includes(spec.mode))throw Error('Unknown result entry format');
   if(!preview){
     if(spec.source!=='TET2_VERIFIED_SLOT'||!S(spec.slotId)||!S(spec.competitionId)||typeof spec.onBank!=='function')
       throw Error('Official results require a verified slot and the controller bank callback');
     if(!S(spec.spaceId)||typeof window==='undefined'||S(window.rhSpace?.()?.id)!==S(spec.spaceId))
       throw Error('Official slot is not bound to the active Garage Space');
   }
   const base={mode:spec.mode,preview,trial:spec.source==='TET2_DRAW_PRACTICE_V8363',slotId:S(spec.slotId)||'PREVIEW',competitionId:S(spec.competitionId)||'PREVIEW',
     label:S(spec.label)||'Results Entry',stageRehearsal:spec.stageRehearsal===true,trackIndex:0,drafts:{},notice:'',error:'',onBank:spec.source==='TET2_DRAW_PRACTICE_V8363'?spec.onBank:(preview?null:spec.onBank),
     onExit:typeof spec.onExit==='function'?spec.onExit:null};
   if(spec.mode==='group'){
     const cars=(spec.cars||[]).map(assertCar);unique(cars);
     const tracks=(spec.tracks||[]).map(S);
     if(cars.length<(spec.stageRehearsal===true&&spec.gauntletSingleCarRehearsal===true?1:2)||cars.length>64||tracks.length<1||tracks.length>3||tracks.some(t=>!t))throw Error('Group requires real cars and 1–3 named tracks');
     base.cars=cars;base.tracks=tracks;base.saved=Array.from({length:tracks.length},()=>({}));
     if(spec.saved){
       for(let i=0;i<tracks.length;i++)for(const [id,ms] of Object.entries(spec.saved[i]||{})){
         if(!cars.some(c=>c.id===id)||!Number.isInteger(ms)||ms<=0)throw Error('Invalid supplied group results');
         base.saved[i][id]=ms;
       }
     }
   }else if(spec.mode==='relay'){
     const teams=(spec.teams||[]).map(t=>({id:S(t.id),label:S(t.label),cars:(t.cars||[]).map(assertCar)}));
     const tracks=(spec.tracks||[]).map(S);
     if(teams.length<2||teams.length>8||tracks.length!==3||new Set(tracks).size!==3||teams.some(t=>!t.id||!t.label||t.cars.length!==3))throw Error('Relay teams or three tracks invalid');
     if(new Set(teams.map(t=>t.id)).size!==teams.length||new Set(teams.flatMap(t=>t.cars.map(c=>c.id))).size!==teams.length*3)throw Error('Duplicate Relay team or car');
     base.teams=teams;base.tracks=tracks;base.saved=tracks.map((_,i)=>({...spec.saved?.[i]}));
     for(const m of base.saved)for(const [id,ms] of Object.entries(m))if(!teams.some(t=>t.id===id)||!Number.isSafeInteger(ms)||ms<=0)throw Error('Invalid saved Relay leg time');
   }else if(spec.mode==='aero'){
     const cars=(spec.cars||[]).map(assertCar);unique(cars);
     if(cars.length<2||cars.length>16||!S(spec.track)||S(spec.jumpFacility)!=='Aeródromo runway')throw Error('Aeródromo requires 2–16 cars, verified Drag Strip and fixed runway');
     base.cars=cars;base.track=S(spec.track);base.jumpFacility=S(spec.jumpFacility);
     base.saved={drag:{...(spec.saved?.drag||{})},jump:{...(spec.saved?.jump||{})}};
     for(const [id,ms] of Object.entries(base.saved.drag))if(!cars.some(c=>c.id===id)||!Number.isSafeInteger(ms)||ms<=0)throw Error('Saved Drag time invalid');
     for(const [id,cm] of Object.entries(base.saved.jump))if(!cars.some(c=>c.id===id)||!Number.isSafeInteger(cm)||cm<0||cm>10000000)throw Error('Saved Long Jump distance invalid');
   }else{
     const matches=(spec.matches||[]).map((m,i)=>{
       const cars=(m?.cars||[]).map(assertCar);unique(cars);
       if(cars.length!==2||!S(m.track))throw Error('Every Race Off match needs two real cars and a track');
       return{id:S(m.id)||String(i+1),track:S(m.track),cars};
     });
     if(matches.length<1||matches.length>8||new Set(matches.map(m=>m.id)).size!==matches.length)throw Error('Slot supports 1–8 unique matches');
     base.matches=matches;base.saved={};
     for(const [id,r] of Object.entries(spec.saved||{})){
       const m=matches.find(m=>m.id===id);
       if(!m||!r||!Number.isInteger(r.a)||r.a<=0||!Number.isInteger(r.b)||r.b<=0||r.a===r.b)throw Error('Invalid supplied Race Off result');
       base.saved[id]={a:r.a,b:r.b,winnerId:r.a<r.b?m.cars[0].id:m.cars[1].id};
     }
   }
   if(Number.isInteger(spec.trackIndex)&&spec.trackIndex>=0&&base.mode==='group'&&spec.trackIndex<base.tracks.length)base.trackIndex=spec.trackIndex;
   model=base;return true;
 }
 function openDemo(mode){
   if(mode==='group')return initialise({mode,label:'Three-track group · layout preview',
     tracks:['Playa Azul Circuit','Horizon Festival Circuit','Las Afueras Circuit'],
     cars:[{id:'demo-f40',name:'Ferrari F40 (1987)',h:true,e:true},{id:'demo-gt',name:'Ford GT (2005)',h:true,e:true},{id:'demo-959',name:'Porsche 959 (1987)',h:true,e:false}]},true);
   if(mode==='raceoff')return initialise({mode,label:'Race Off · slot pairings preview',
     matches:[{id:'match-01',track:'Horizon Festival Circuit',cars:[{id:'demo-f40',name:'Ferrari F40 (1987)',h:true,e:true},{id:'demo-gt',name:'Ford GT (2005)',h:true,e:true}]},
     {id:'match-02',track:'Horizon Festival Circuit',cars:[{id:'demo-mclaren',name:'McLaren F1 GT (1997)',h:true,e:true},{id:'demo-959',name:'Porsche 959 (1987)',h:true,e:false}]}]},true);
   throw Error('Unknown preview kind');
 }
 function openScheduled(spec){return initialise(spec,false);}
 function openTrial(spec){
   if(!spec||spec.source!=='TET2_DRAW_PRACTICE_V8363'||!S(spec.spaceId)||typeof window==='undefined'||S(window.rhSpace?.()?.id)!==S(spec.spaceId)||typeof spec.onBank!=='function'||typeof spec.onExit!=='function')throw Error('Practice entry requires a locked draw, active Garage, and saving adapter');
   return initialise(spec,true);
 }
 const badges=car=>`<span class="t2-entry-flags">${car.h?'<span class="t2-entry-h" title="H">H</span>':''}${car.e?'<span class="t2-entry-e" title="E confirmed">E✓</span>':''}</span>`;
 const field=(key,val,name,banked)=>`<input class="t2-entry-time" type="text" inputmode="numeric" pattern="[0-9:.]*" autocomplete="off" spellcheck="false" data-t2-time="${esc(key)}" aria-label="Time for ${esc(name)}" placeholder="03:36.784" value="${esc(val||'')}" ${banked?'disabled':''} />`;
 const row=(c,index,key,banked,caption)=>`<div class="t2-entry-car ${banked?'t2-entry-saved':''}"><div class="t2-entry-carname"><strong>${esc(c.name)}</strong>${badges(c)}${banked?'<small class="t2-entry-status">✓ BANKED</small>':''}</div><div class="t2-entry-controls">${field(key,caption,c.name,banked)}${index!==null?`<button type="button" class="t2-entry-smallbtn" data-t2-action="bank-car" data-t2-index="${index}" ${banked?'disabled':''}>${banked?'SAVED':'SAVE'}</button>`:''}</div></div>`;
 function group(){
   const i=model.trackIndex,saved=model.saved[i],complete=model.cars.every(c=>saved[c.id]!==undefined);
   let heading=`<div class="t2-entry-strip"><span>TRACK ${i+1} OF ${model.tracks.length}</span><span>${Object.keys(saved).length}/${model.cars.length} TIMES BANKED</span></div><h3 class="t2-entry-track">${esc(model.tracks[i])}</h3>`;
   const list=model.cars.map((c,n)=>{
     const b=saved[c.id]!==undefined,k=`g:${i}:${n}`,val=b?display(saved[c.id]):model.drafts[k]||'';
     return row(c,n,k,b,val);
   }).join('');
   let footer='';
   if(complete){
     footer=model.trackIndex+1<model.tracks.length?'<button class="t2-btn" data-t2-action="next-track">ALL TIMES BANKED · NEXT TRACK →</button>':'<div class="t2-entry-done">✓ ALL TRACKS RECORDED</div><button class="t2-btn" data-t2-action="exit">FINISH & RETURN TO RACE CONTROL</button>';
   }else footer='<p class="t2-entry-help">Save each car once. The next track opens only after all times for this track are banked.</p>';
   return `<section class="t2-panel t2-entry-panel"><h2>GROUP TIME ENTRY</h2>${heading}<div class="t2-entry-list">${list}</div>${footer}<p class="t2-entry-help">Track by track is a reversible trial. No medals for qualifying groups.</p></section>`;
 }
 function raceoff(){
   const done=Object.keys(model.saved).length;
   return `<section class="t2-panel t2-entry-panel"><h2>RACE OFF — RESULTS</h2><div class="t2-entry-strip"><span>CURRENT SLOT ONLY</span><span>${done}/${model.matches.length} MATCHES BANKED</span></div>
   ${model.matches.map((m,idx)=>{
     const saved=model.saved[m.id],p=idx+1;
     const times=saved?[saved.a,saved.b]:[null,null];
     const cars=m.cars.map((c,n)=>row(c,null,`m:${p-1}:${n}`,!!saved,times[n]?display(times[n]):model.drafts[`m:${p-1}:${n}`]||'')).join('<div class="t2-entry-vs">VS</div>');
     return `<article class="t2-entry-match"><div class="t2-entry-matchhead"><strong>MATCH ${String(p).padStart(2,'0')}</strong><span>${saved?'✓ SAVED':'PENDING'}</span></div><p class="t2-entry-route">${esc(m.track)}</p>${cars}${saved?`<div class="t2-entry-winner">WINNER: ${esc(m.cars.find(c=>c.id===saved.winnerId)?.name)}</div>`:`<button type="button" class="t2-btn t2-entry-bank" data-t2-action="bank-match" data-t2-index="${idx}">BANK BOTH TIMES</button>`}</article>`;
   }).join('')}
   ${done===model.matches.length?'<div class="t2-entry-done">✓ ALL SLOT MATCHES BANKED</div><button class="t2-btn" data-t2-action="exit">FINISH & RETURN TO RACE CONTROL</button>':'<p class="t2-entry-help">Both times are required for each match. No draw for future Evil List slots.</p>'}</section>`;
 }
 function relay(){
   const i=model.trackIndex,done=model.teams.every(t=>Object.hasOwn(model.saved[i],t.id));
   const listing=model.teams.map((t,n)=>{
     const c=t.cars[i],saved=Object.hasOwn(model.saved[i],t.id),key=`r:${i}:${n}`,val=saved?display(model.saved[i][t.id]):model.drafts[key]||'';
     return `<article class="t2-entry-match"><h4>${esc(t.label)} · LEG ${i+1}</h4>${row(c,n,key,saved,val)}</article>`;
   }).join('');
   return `<section class="t2-panel t2-entry-panel"><h2>RELAY · OFFICIAL TEAM LEGS</h2><div class="t2-entry-strip"><span>LEG ${i+1} / 3</span><span>${Object.keys(model.saved[i]).length}/${model.teams.length} SAVED</span></div><h3>${esc(model.tracks[i])}</h3>${listing}${done?(i<2?'<button class="t2-btn" data-t2-action="next-track">NEXT RELAY LEG →</button>':'<button class="t2-btn" data-t2-action="exit">ALL THREE LEGS BANKED · FINISH</button>'):'<p>Each team races one different car per leg; save every team before the next leg.</p>'}</section>`;
 }
 function aero(){
   const drag=model.cars.every(c=>Object.hasOwn(model.saved.drag,c.id)),jump=model.cars.every(c=>Object.hasOwn(model.saved.jump,c.id));
   const phase=drag?'jump':'drag',done=phase==='jump'?jump:drag;
   const entries=model.cars.map((c,n)=>{
     const banked=Object.hasOwn(model.saved[phase],c.id),key=`a:${phase}:${n}`,
       value=banked?(phase==='drag'?display(model.saved.drag[c.id]):(model.saved.jump[c.id]/100).toFixed(2)):model.drafts[key]||'';
     return `<div class="t2-entry-car ${banked?'t2-entry-saved':''}"><div class="t2-entry-carname"><strong>${esc(c.name)}</strong>${badges(c)}${banked?'<small>✓ BANKED</small>':''}</div><input type="text" inputmode="decimal" data-t2-time="${key}" placeholder="${phase==='drag'?'03:36.784':'123.45'}" value="${esc(value)}" ${banked?'disabled':''}><button type="button" class="t2-entry-smallbtn" data-t2-action="bank-aero" data-t2-index="${n}" ${banked?'disabled':''}>${banked?'SAVED':'SAVE'}</button></div>`;
   }).join('');
   return `<section class="t2-panel t2-entry-panel"><h2>AERÓDROMO DOUBLE-HEADER</h2><div class="t2-entry-strip"><span>${phase==='drag'?'DRAG TIME':'LONG JUMP · METRES'}</span><span>${Object.keys(model.saved[phase]).length}/${model.cars.length} BANKED</span></div><h3>${esc(phase==='drag'?model.track:model.jumpFacility)}</h3><p>${phase==='drag'?'One verified Drag Strip run per car.':'ONE runway jump attempt per car. Record metres to 2 decimal places; 0.00 allowed for a failed jump.'}</p>${entries}${done&&phase==='jump'?'<button class="t2-btn" data-t2-action="exit">ALL DRAG & JUMP RESULTS BANKED · FINISH</button>':''}</section>`;
 }
 function render(){
   if(!model)return '<div class="t2-content">No results-entry session selected.</div>';
   return `<div class="t2-entry-page"><div class="t2-entry-banner"><span>TET2 • RACE CONTROL</span><strong>MULTI-RESULT ENTRY</strong><button type="button" class="t2-entry-back" data-t2-action="exit">← RACE CONTROL</button></div>
      <div class="t2-entry-alert">${model.stageRehearsal?'PRELAUNCH STAGE REHEARSAL · ISOLATED SAVED RESULTS · NO OFFICIAL TOURNAMENT RESULTS':(model.trial?'LOCKED PRACTICE DRAW · REAL GARAGE CARS · PRACTICE TIMES SAVED LOCALLY · NO OFFICIAL RESULTS':(model.preview?'PHONE LAYOUT TRIAL · EXAMPLE CARS · NOTHING IS SAVED TO YOUR GARAGE OR TOURNAMENT':'VERIFIED EVIL LIST SLOT · LIVE RESULTS'))}</div>
      <div class="t2-entry-subtitle">${esc(model.label)}</div>
      ${model.error?`<div class="t2-entry-error" role="alert">${esc(model.error)}</div>`:''}
      ${model.notice?`<div class="t2-entry-notice" role="status">${esc(model.notice)}</div>`:''}
      ${model.mode==='group'?group():model.mode==='relay'?relay():model.mode==='aero'?aero():raceoff()}
      ${model.trial&&!model.stageRehearsal?'<button type="button" class="t2-btn" data-t2-action="standings">📊 VIEW LIVE STANDINGS / MATCH PROGRESS</button>':''}
      <p class="t2-entry-foot">Phone time keypad: 0336784 → 03:36.784. Every car has its own H / E✓ badges where applicable. No car images.</p>
      <button type="button" class="t2-btn t2-secondary" data-t2-action="exit">← BACK TO RACE CONTROL</button>
      </div>`;
 }
 function draft(e){if(!model||!e.target?.matches?.('[data-t2-time]'))return;model.drafts[e.target.dataset.t2Time]=e.target.value;}
 function prettify(e){if(!model||!e.target?.matches?.('[data-t2-time]'))return;const pretty=normalizeTime(e.target.value);if(/^\d{1,3}:[0-5]\d\.\d{3}$/.test(pretty)){e.target.value=pretty;model.drafts[e.target.dataset.t2Time]=pretty;}}
 function rawFor(key,rootNode){const el=rootNode.querySelector(`[data-t2-time="${key}"]`);return el?el.value:model.drafts[key]||'';}
 async function act(e,after){
   const btn=e.target.closest?.('[data-t2-action]');if(!btn||!model)return false;
   const action=btn.dataset.t2Action;
   if(action==='exit'){
     if(model.onExit){model.onExit();}
     else if(typeof window!=='undefined')window.TET2Stage4UI359?.page('race');
     return true;
   }
   if(action==='standings' && model.trial && !model.stageRehearsal){if(typeof window!=='undefined')window.TET2Stage4UI359?.page('progress');return true;}
   if(action==='next-track'){
     if(model.mode==='group'&&!model.cars.every(c=>model.saved[model.trackIndex][c.id]!==undefined))return true;
     if(model.mode==='relay'&&!model.teams.every(t=>model.saved[model.trackIndex][t.id]!==undefined))return true;
     if(!['group','relay'].includes(model.mode))return true;
     if(model.trackIndex+1<model.tracks.length){model.trackIndex++;model.error='';model.notice='Next track ready.';after(true);}
     return true;
   }
   if(inFlight)return true;
   const rootNode=e.target.closest('#tet2-stage4-app')||document;
   model.error='';model.notice='';
   try{
     let payload,update;
     if(action==='bank-car'&&model.mode==='group'){
       if(model.mode!=='group')throw Error('Not a group session');
       const n=Number(btn.dataset.t2Index),c=model.cars[n],i=model.trackIndex;
       if(!c||model.saved[i][c.id]!==undefined)throw Error('Result already banked');
       const ms=timeMs(rawFor(`g:${i}:${n}`,rootNode));
       payload={mode:'group',slotId:model.slotId,competitionId:model.competitionId,track:model.tracks[i],trackIndex:i,carId:c.id,timeMs:ms};
       update=()=>{model.saved[i][c.id]=ms;delete model.drafts[`g:${i}:${n}`];};
     }else if(action==='bank-aero'){
       if(model.mode!=='aero')throw Error('Not an Aeródromo session');
       const n=Number(btn.dataset.t2Index),c=model.cars[n],phase=model.cars.every(z=>Object.hasOwn(model.saved.drag,z.id))?'jump':'drag';
       if(!c||Object.hasOwn(model.saved[phase],c.id))throw Error('Attempt already recorded');
       const input=S(rawFor(`a:${phase}:${n}`,rootNode));
       if(phase==='drag'){
         const ms=timeMs(input);payload={mode:'aero',slotId:model.slotId,competitionId:model.competitionId,discipline:'drag',carId:c.id,track:model.track,timeMs:ms};
         update=()=>{model.saved.drag[c.id]=ms;delete model.drafts[`a:drag:${n}`];};
       }else{
         if(!/^\d{1,5}(?:\.\d{1,2})?$/.test(input))throw Error('Enter jump metres to 2 decimals, e.g. 123.45');
         const cm=Math.round(Number(input)*100);
         if(!Number.isSafeInteger(cm)||cm<0||cm>10000000)throw Error('Invalid jump distance');
         payload={mode:'aero',slotId:model.slotId,competitionId:model.competitionId,discipline:'jump',carId:c.id,jumpFacility:model.jumpFacility,distanceCm:cm};
         update=()=>{model.saved.jump[c.id]=cm;delete model.drafts[`a:jump:${n}`];};
       }
     }else if(action==='bank-car'&&model.mode==='relay'){
       const n=Number(btn.dataset.t2Index),i=model.trackIndex,t=model.teams[n];
       if(!t||Object.hasOwn(model.saved[i],t.id))throw Error('Relay leg already recorded');
       const ms=timeMs(rawFor(`r:${i}:${n}`,rootNode));
       payload={mode:'relay',slotId:model.slotId,competitionId:model.competitionId,leg:i,teamId:t.id,carId:t.cars[i].id,track:model.tracks[i],timeMs:ms};
       update=()=>{model.saved[i][t.id]=ms;delete model.drafts[`r:${i}:${n}`];};
     }else if(action==='bank-match'){
       if(model.mode!=='raceoff')throw Error('Not a Race Off session');
       const n=Number(btn.dataset.t2Index),m=model.matches[n];
       if(!m||model.saved[m.id])throw Error('Match already banked');
       const a=timeMs(rawFor(`m:${n}:0`,rootNode)),b=timeMs(rawFor(`m:${n}:1`,rootNode));
       if(a===b)throw Error('Times are tied. Resolve the tie using the competition rules before banking.');
       const winnerId=(a<b?m.cars[0]:m.cars[1]).id;
       payload={mode:'raceoff',slotId:model.slotId,competitionId:model.competitionId,matchId:m.id,track:m.track,timeA:a,timeB:b,carA:m.cars[0].id,carB:m.cars[1].id,winnerId};
       update=()=>{model.saved[m.id]={a,b,winnerId};delete model.drafts[`m:${n}:0`];delete model.drafts[`m:${n}:1`];};
     }else return false;
     inFlight=true;btn.disabled=true;
     if(typeof model.onBank==='function')await model.onBank(clone(payload));
     update();model.notice=model.stageRehearsal?'✓ STAGE REHEARSAL result saved separately. Not an official tournament result.':(model.trial?'✓ PRACTICE result saved locally. Not an official tournament result.':'✓ Result banked'+(model.preview?' in this temporary preview only.':'.'));
   }catch(err){model.error=err?.message||'Cannot bank result';}
   finally{inFlight=false;after();}
   return true;
 }
 return Object.freeze({normalizeTime,timeMs,display,openDemo,openScheduled,openTrial,render,draft,prettify,act,version:'8.0.376',
   /* QA: read-only copy of in-memory preview; NEVER a tournament write API */
   peek:()=>model?clone({mode:model.mode,preview:model.preview,saved:model.saved,trackIndex:model.trackIndex,error:model.error}):null});
});
