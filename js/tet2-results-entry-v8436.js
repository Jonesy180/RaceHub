/* TET2 v8.0.436 · event-defined Festival tracks, compact factory badges and custom stock-spec sheet; retains car-first multi-track results; native result-entry compatible with stage rehearsal — Multi-result entry + practice and strictly gated official adapters.
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
   const base={record:null,mode:spec.mode,preview,prepared434:null,matchSteps434:{},trial:spec.source==='TET2_DRAW_PRACTICE_V8363',slotId:S(spec.slotId)||'PREVIEW',competitionId:S(spec.competitionId)||'PREVIEW',
     label:S(spec.label)||'Results Entry',stageRehearsal:spec.stageRehearsal===true,trackIndex:0,drafts:{},segmentDrafts:{},notice:'',error:'',onBank:spec.source==='TET2_DRAW_PRACTICE_V8363'?spec.onBank:(preview?null:spec.onBank),
     onExit:typeof spec.onExit==='function'?spec.onExit:null,onDone:!preview&&typeof spec.onDone==='function'?spec.onDone:null};
   if(spec.mode==='group'){
     const cars=(spec.cars||[]).map(assertCar);unique(cars);
     const tracks=(spec.tracks||[]).map(S);
     if(cars.length<(spec.stageRehearsal===true&&spec.gauntletSingleCarRehearsal===true?1:2)||cars.length>64||tracks.length<1||tracks.some(t=>!t))throw Error('Group requires real cars and the event-defined tracks');
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
 const locationButton=t=>typeof window!=='undefined'?(window.TET2TrackLocation403?.button?.(t)||''):'';
 // The TET2 E✓ is NOT the old Evil-race ledger and NOT an 'entered in draw' flag.
 // Only a successfully banked TET2 Evil List race result earns colour.  The colour
 // represents the most recent slot in which THIS car has a saved result:
 // cyan = road/street, orange = dirt/rally, green = cross-country, purple = drift.
 // A new campaign, even with old OTG! Evil racing history, starts with grey E✓.
 // H remains the original independent OTG! Car History and can reflect OTG! history.
 let badgeEvidence={history:new Set(),evil:new Map()};
 function scanBadgeEvidence(){
   const history=new Set(),evil=new Map();
   if(typeof window==='undefined')return {history,evil};
   let sp;try{sp=window.rhSpace?.();}catch(_){return {history,evil};}
   if(!sp)return {history,evil};
   const id=x=>S(x),positive=x=>x!==null&&x!==undefined&&x!==''&&Number.isFinite(Number(x))&&Number(x)>0;
   const scored=x=>x!==null&&x!==undefined&&x!==''&&Number.isFinite(Number(x));
   const addHistory=c=>{const k=id(c);if(k)history.add(k);};
   // Native history sources are ONLY used to illuminate H, never E✓.
   const historic=(r,car)=>{if(r&&(positive(r.time)||scored(r.score)))addHistory(car||r.carId||r.car?.sourceCarId);};
   for(const run of sp.runs||[])for(const r of run.results||[])historic(r,r.carId);
   for(const ev of sp.customEvents||[]){
     for(const r of ev.results||[])historic(r,r.carId);
     for(const block of [ev.customSwiss?.rounds,ev.swissCompleted?.rounds,ev.customKO?.rounds])for(const round of block||[])for(const m of round.matches||[]){historic(m.resultA,m.carA);historic(m.resultB,m.carB);}
   }
   for(const ro of sp.raceOffs||[])for(const round of ro.rounds||[])for(const m of round.matches||[]){historic(m.resultA,m.carA);historic(m.resultB,m.carB);}
   try{for(const r of window.rhV7RecordsFoundation?.allRows?.()||[])if(positive(r.time))addHistory(r.carId);}catch(_){/* Native records not on this screen. */}
   // Existing OTG! Evil activity may illuminate H, but must NOT make a fresh
   // TET2 E✓ coloured before this tournament has actually been raced.
   try{const old=window.rhEvilUsedLedger8167?.(sp);if(old instanceof Map)for(const id of old.keys())addHistory(id);}catch(_){/* no original ledger */}

   // Read only current, real TET2 official slot results; never read future draws,
   // provisional entrants, preview badges or old EVIL R1/OTG! results for E✓.
   let routes=[];
   try{routes=window.TET2RouteControl396?.snapshot?.()?.assigned||[];}catch(_){/* E✓ stays grey if type not independently verified */}
   const bySlot=new Map(routes.map(r=>[Number(r.position),r]));
   const slotNumber=(id,d)=>{const m=S(d?.slotId||id).match(/^TET2-(\d+)$/);return m?Number(m[1]):0;};
   function eventColour(slotNo,d){
     if(/^T2-CUSTOM-UPGRADE-/.test(S(d.competitionId)))return 'stock';
     if(S(d.competitionId)==='T2-DRIFT-CHAMPIONSHIP')return 'purple';
     const source=bySlot.get(slotNo);
     if(!source||S(source.eventId)!==S(d.competitionId))return null;
     const discipline=S(source.tracks?.[0]?.discipline).toLowerCase(),pool=S(source.pool).toUpperCase();
     if(/cross.country/.test(discipline))return 'green';
     if(/dirt|rally|off.road/.test(discipline)||pool==='OFF-ROAD'||pool==='RALLY ADVENTURE')return 'orange';
     if(/road|street|drag|hot wheels/.test(discipline)||['ROAD / STREET','DRAG','HOT WHEELS'].includes(pool))return 'cyan';
     return null; // Never invent a category solely to colour a badge.
   }
   function savedCars(d,r){
     const found=new Set();
     if(d.mode==='raceoff')for(const m of d.matches||[]){
       const v=r['m:'+m.id];if(!v||!positive(v.a)||!positive(v.b)||v.a===v.b)continue;
       for(const c of m.carIds||[])found.add(id(c));
     }else if(d.mode==='group')for(let i=0;i<(d.tracks||[]).length;i++)for(const c of d.carIds||[]){
       if(positive(r['g:'+i+':'+c]))found.add(id(c));
     }else if(d.mode==='relay')for(let i=0;i<(d.tracks||[]).length;i++)for(const t of d.teams||[]){
       if(positive(r['r:'+i+':'+t.id])&&t.carIds?.[i])found.add(id(t.carIds[i]));
     }else if(d.mode==='aero')for(const c of d.carIds||[]){
       if(positive(r['a:drag:'+c])||r['a:jump:'+c]!==undefined&&scored(r['a:jump:'+c]))found.add(id(c));
     }
     return found;
   }
   const slots=Object.entries(sp.tet2OfficialSlotLedgerV8361?.slots||{}).map(([id,s])=>({s,n:slotNumber(id,s?.definition)}))
     .filter(x=>x.n>0&&x.s?.definition&&x.s.results&&x.s.definition.source==='TET2_CONTROLLED_CHAOS_LOCKED_V1')
     .sort((a,b)=>a.n-b.n);
   for(const {s,n} of slots){
     const d=s.definition,colour=eventColour(n,d);
     for(const c of savedCars(d,s.results)){
       addHistory(c);
       // Newer slot wins, regardless of which of its times was banked first.
       // Unknown classifications stay grey rather than assume a race category.
       evil.set(c,{kind:colour,label:S(d.label)||S(d.competitionId),slot:n});
     }
   }
   return {history,evil};
 }
 // Stock badge only: never substitute a suggested CUSTOM-UPGRADE target.
 const upgradeBadge=car=>{
   let info=null;
   try{const sp=window.rhSpace?.();const owned=sp?.cars?.find(c=>S(c.id)===S(car.id));
       if(owned)info=window.TET2StockClass430?.lookup?.(owned);
   }catch(_){/* Unknown must remain unknown. */}
   if(!info?.verified||!['D','C','B','A','S1','S2','X'].includes(info.level))
     return '<span class="t2-upgrade-badge t2-upgrade-unknown" title="FH5 catalogue car identity not matched; class is not guessed." aria-label="Original stock class unavailable for this Garage identity">?</span>';
   const tier=info.level,title='Original factory FH5 class: '+tier+' · stock PI '+info.pi+'. Keep stock or upgrade within '+tier+' (maximum PI '+window.TET2StockClass430.limits[tier]+'). Current installed tunes may differ.';
   return `<button type="button" class="t2-upgrade-badge t2-stock-tap431" data-tier="${tier}" data-t2-stock-car="${esc(car.id)}" title="${esc(title)}" aria-label="${esc(title)}. Tap for original PI and upgrade room.">${tier}</button>`;
 };
 const badges=car=>{
   const k=S(car.id),h=badgeEvidence.history.has(k)||car.h===true,e=badgeEvidence.evil.get(k),kind=e?.kind||null;
   const label=e?'Last TET2 Evil List event: '+e.label+' (Slot '+e.slot+')'+(kind?'':' · route category unavailable'):'No TET2 Evil List result yet';
   return `<span class="t2-entry-flags" aria-label="Original FH5 stock class, car history, and last TET2 Evil List event">${upgradeBadge(car)}<button type="button" class="t2-entry-h ${h?'is-active':''}" data-t2-history-car="${esc(k)}" title="Open OTG! Car History" aria-label="Open car history for ${esc(car.name)}">H</button><span class="t2-entry-e ${kind?'is-active':''}" ${kind?'data-kind="'+esc(kind)+'"':''} title="${esc(label)}" aria-label="${esc(label)}">E✓</span></span>`;
 };
 // Stock PI is factory reference data, not a read of the installed tune.
 // Overlay lives on document.body rather than inside the results renderer:
 // saving a race may replace the inner screen, but never the custom dialog.
 const stockBands432=Object.freeze({D:[100,500],C:[501,600],B:[601,700],A:[701,800],S1:[801,900],S2:[901,998],X:[999,999]});
 const stockSheetId432='t2-stock-sheet432';
 let stockReturnFocus432=null;
 function closeStockSheet432(){
   document.getElementById(stockSheetId432)?.remove();
   const returnTo=stockReturnFocus432;stockReturnFocus432=null;
   if(returnTo?.isConnected)try{returnTo.focus({preventScroll:true});}catch(_){/* Focus is optional. */}
 }
 function showStockSheet432(car,info,trigger){
   if(typeof document==='undefined')return;
   closeStockSheet432();
   stockReturnFocus432=trigger;
   const level=info?.verified&&stockBands432[info.level]?info.level:null;
   const pi=Number(info?.pi),bounds=level?stockBands432[level]:null;
   const ceiling=level?window.TET2StockClass430?.limits?.[level]:null;
   const valid=level&&Number.isInteger(pi)&&Number.isInteger(ceiling)&&pi>=bounds[0]&&pi<=ceiling;
   const room=valid?ceiling-pi:null;
   const span=valid?ceiling-bounds[0]:0;
   const percent=valid?(span?Math.round((pi-bounds[0])/span*100):100):0;
   const title=car?.name||'Garage car';
   const card=document.createElement('div');card.id=stockSheetId432;card.className='t2-stock-layer432';
   card.innerHTML=`<section class="t2-stock-card432" role="dialog" aria-modal="true" aria-labelledby="t2-stock-name432" aria-describedby="t2-stock-desc432" ${valid?'data-tier="'+level+'"':''}>
       <div class="t2-stock-header432"><span class="t2-stock-brand432"><span class="t2-stock-indicator432"></span> TET2 <em>•</em> GARAGE INTELLIGENCE</span><button type="button" class="t2-stock-x432" aria-label="Close stock specifications" data-t2-stock-close432>×</button></div>
       <div class="t2-stock-body432"><div class="t2-stock-overline432">ORIGINAL FACTORY SPEC</div><h2 id="t2-stock-name432">${esc(title)}</h2>
       ${valid?`<div class="t2-stock-spec-top432"><div class="t2-stock-emblem432" data-tier="${level}" aria-label="Stock class ${level}">${level}</div><div class="t2-stock-factory432"><small>FACTORY PI</small><strong>${pi}</strong></div><div class="t2-stock-class432"><small>CLASS CEILING</small><strong>${ceiling}</strong></div></div>
         <div class="t2-stock-tracklabel432"><span>${level} CLASS · ${bounds[0]}–${ceiling}</span><span>${pi} / ${ceiling}</span></div>
         <div class="t2-stock-track432" role="img" aria-label="Stock PI ${pi}, class ceiling ${ceiling}"><span style="width:${percent}%"></span></div>
         <div class="t2-stock-room432"><div><small>ROOM TO UPGRADE</small><strong>+${room} <span>PI</span></strong></div><p>${room===0?'Already at the class ceiling.':'Keep it stock, or tune it within '+level+' class.'}</p></div>
         <p id="t2-stock-desc432" class="t2-stock-note432">This is the <strong>original FH5 rating</strong>, not the PI of your fitted tune. Upgrades are optional; the app cannot detect your current tune.</p>`:
       `<p id="t2-stock-desc432" class="t2-stock-note432">A verified original FH5 rating is unavailable for this Garage entry. No stock class has been guessed.</p>`}
       <button type="button" class="t2-stock-dismiss432" data-t2-stock-close432>GOT IT <span aria-hidden="true">✓</span></button></div>
     </section>`;
   card.addEventListener('click',e=>{if(e.target===card||e.target.closest?.('[data-t2-stock-close432]'))closeStockSheet432();});
   document.body.appendChild(card);
   card.querySelector('.t2-stock-x432')?.focus({preventScroll:true});
 }
 if(typeof document!=='undefined'){
   document.addEventListener('click',event=>{
     const badge=event.target?.closest?.('#tet2-stage4-app [data-t2-stock-car]');if(!badge)return;
     event.preventDefault();event.stopPropagation();event.stopImmediatePropagation?.();
     const id=S(badge.dataset.t2StockCar);let car=null,info=null;
     try{car=window.rhSpace?.()?.cars?.find(c=>S(c.id)===id)||null;
         if(car)info=window.TET2StockClass430?.lookup?.(car)||null;}
     catch(_){/* Never invent an unknown stock PI. */}
     showStockSheet432(car,info,badge);
   },true);
   document.addEventListener('keydown',e=>{
     const card=document.getElementById(stockSheetId432);if(!card)return;
     if(e.key==='Escape'){e.preventDefault();closeStockSheet432();return;}
     if(e.key!=='Tab')return;
     const controls=[...card.querySelectorAll('button:not([disabled])')];
     if(!controls.length)return;
     const first=controls[0],last=controls[controls.length-1];
     if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
     else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
   },true);
 }
 // The original OTG! history modal must appear over the TET2 full-screen world.
 if(typeof document!=='undefined')document.addEventListener('click',event=>{
   const btn=event.target?.closest?.('#tet2-stage4-app [data-t2-history-car]');if(!btn)return;
   event.preventDefault();event.stopPropagation();event.stopImmediatePropagation?.();
   const open=window.rhDrawCarHistory8131||window.rhOpenCarHistoryV7001;
   if(typeof open!=='function'){window.alert?.('Original OTG! Car History is unavailable.');return;}
   try{open(btn.dataset.t2HistoryCar);const layer=document.getElementById('rhCarHistoryV7001');
     if(layer)layer.style.setProperty('z-index','2147483200','important');}
   catch(err){window.alert?.('Unable to open car history: '+err.message);}
 },true);
 // Compact version of OTG!'s ORIGINAL seven-segment stopwatch entry (studio-enter-result-v8138.js).
 // A visible MM:SS.mmm clock; the three real phone-number inputs sit invisibly
 // over their respective groups. The canonical result is still read by rawFor(),
 // so this does NOT change banking, tournament calculations or saved time units.
 const SEG={0:'abcdef',1:'bc',2:'abdeg',3:'abcdg',4:'bcfg',5:'acdfg',6:'acdefg',7:'abc',8:'abcdefg',9:'abcdfg'};
 const segDigit=ch=>`<i class="t2-seg-digit">${'abcdefg'.split('').map(a=>`<span class="s${a} ${(SEG[ch]||'').includes(a)?'on':''}"></span>`).join('')}</i>`;
 const segGroup=(v,n)=>String(v||'').padStart(n,'0').slice(-n).split('').map(segDigit).join('');
 function clockParts(v){
   const n=normalizeTime(v),m=n.match(/^(\d{1,3}):([0-5]\d)\.(\d{3})$/);
   if(!m)return {min:'',sec:'',ms:''};
   return {min:m[1].padStart(2,'0').slice(-2),sec:m[2],ms:m[3]};
 }
 function digitalField(key,val,name,banked){
   const parts=model?.segmentDrafts?.[key]||clockParts(val);
   const original=clockParts(val),complete=parts.min.length===2&&parts.sec.length===2&&parts.ms.length===3;
   const current=complete?`${parts.min}:${parts.sec}.${parts.ms}`:'';
   const group=(piece,n,label,code)=>`<label class="t2-time-part ${parts[piece]?'has-time':''}" data-t2-time-part="${piece}"><span class="t2-time-segments" aria-hidden="true">${segGroup(parts[piece],n)}</span><input type="tel" inputmode="numeric" pattern="[0-9]*" maxlength="${n}" autocomplete="off" enterkeyhint="next" aria-label="${esc(label)} for ${esc(name)}" data-t2-segment="${piece}" value="${esc(parts[piece])}" ${banked?'disabled':''} onfocus="this.select()"></label>`;
   return `<div class="t2-time-console ${banked?'is-banked':''}" data-t2-digital="${esc(key)}" role="group" aria-label="Race time for ${esc(name)}. Minutes, seconds, milliseconds">
     <input type="hidden" data-t2-time="${esc(key)}" value="${esc(banked?val:current)}">
     <div class="t2-time-digits">${group('min',2,'Minutes')}<span class="t2-time-punct" aria-hidden="true">:</span>${group('sec',2,'Seconds')}<span class="t2-time-punct" aria-hidden="true">.</span>${group('ms',3,'Milliseconds')}</div>
   </div>`;
 }
 const field=digitalField;

 const row=(c,index,key,banked,caption)=>`<div class="t2-entry-car ${banked?'t2-entry-saved':''}"><div class="t2-entry-carname"><strong>${esc(c.name)}</strong>${badges(c)}${banked?'<small class="t2-entry-status">✓ BANKED</small>':''}</div><div class="t2-entry-controls">${field(key,caption,c.name,banked)}${index!==null?`<button type="button" class="t2-entry-smallbtn" data-t2-action="bank-car" data-t2-index="${index}" ${banked?'disabled':''}>${banked?'SAVED':'SAVE'}</button>`:''}</div></div>`;
 // v8.0.431: finish ALL tracks for car 1 before presenting car 2.
 // Canonical bank keys remain g:trackIndex:carId, so official standings and
 // completed-slot proof do not depend on presentation or banking order.
 const earliestPendingTrack=(items,done)=>items.findIndex((_,i)=>!done(i));
 function group(){
   const total=model.cars.length,tracks=model.tracks;
   const finished=model.cars.filter(c=>tracks.every((_,i)=>Object.hasOwn(model.saved[i],c.id)));
   const activeIndex=model.cars.findIndex(c=>tracks.some((_,i)=>!Object.hasOwn(model.saved[i],c.id)));
   const head=`<div class="t2-entry-strip"><span>ONE CAR · ALL ${tracks.length} TRACK${tracks.length===1?'':'S'}</span><span>${finished.length}/${total} CARS COMPLETE</span></div>`;
   const previous=finished.length?`<details class="t2-entry-finished431"><summary>✓ ${finished.length} completed car${finished.length===1?'':'s'} · saved times</summary><ol>${finished.map(c=>`<li><strong>${esc(c.name)}</strong><small>${tracks.map((t,i)=>esc(t)+': '+esc(display(model.saved[i][c.id]))).join(' · ')}</small></li>`).join('')}</ol></details>`:'';
   if(activeIndex<0)return `<section class="t2-panel t2-entry-panel t2-entry-car-first431"><h2>GROUP TIME ENTRY</h2>${head}<div class="t2-entry-done">✓ ALL ${total} CARS · ALL TRACKS BANKED</div>${completedFooter()}${previous}</section>`;
   const car=model.cars[activeIndex];
   const nextTrack=earliestPendingTrack(tracks,i=>Object.hasOwn(model.saved[i],car.id));
   const stages=tracks.map((track,i)=>{
     const banked=Object.hasOwn(model.saved[i],car.id),locked=i>nextTrack;
     const key=`g:${i}:${activeIndex}`,value=banked?display(model.saved[i][car.id]):model.drafts[key]||'';
     const input=banked?`<div class="t2-entry-banked431">✓ SAVED · ${esc(value)}</div>`:locked?'<p class="t2-entry-help">Finish the preceding race first.</p>':
       `<div class="t2-entry-controls">${field(key,value,car.name,false)}<button type="button" class="t2-entry-smallbtn" data-t2-action="bank-car" data-t2-index="${activeIndex}" data-t2-track="${i}">SAVE RACE ${i+1}</button></div>`;
     return `<article class="t2-entry-leg431 ${banked?'is-saved':locked?'is-locked':'is-current'}"><h4>RACE ${i+1} OF ${tracks.length} · ${esc(track)} ${locationButton(track)}</h4>${input}</article>`;
   }).join('');
   return `<section class="t2-panel t2-entry-panel t2-entry-car-first431"><h2>GROUP TIME ENTRY</h2>${head}<article class="t2-entry-active-car431"><div class="t2-entry-carname"><strong>CAR ${activeIndex+1} OF ${total} · ${esc(car.name)}</strong>${badges(car)}</div>${stages}</article>${previous}<p class="t2-entry-help">Race this car on every course before moving to the next car. No changing cars between tracks.</p></section>`;
 }
 function completedFooter(){return model.onDone?'<button type="button" class="t2-btn" data-t2-action="mark-done">✅ MARK AS DONE</button>':'<button class="t2-btn" data-t2-action="exit">FINISH &amp; RETURN TO RACE CONTROL</button>';}
 function allSaved(){if(model.mode==='raceoff')return model.matches.every(m=>!!model.saved[m.id]);
  if(model.mode==='group')return model.tracks.every((_,i)=>model.cars.every(c=>Object.hasOwn(model.saved[i],c.id)));
  if(model.mode==='relay')return model.tracks.every((_,i)=>model.teams.every(t=>Object.hasOwn(model.saved[i],t.id)));
  if(model.mode==='aero')return model.cars.every(c=>Object.hasOwn(model.saved.drag,c.id)&&Object.hasOwn(model.saved.jump,c.id));return false;}
 function raceoff(){
   const done=Object.keys(model.saved).length,total=model.matches.length;
   const pending=model.matches.findIndex(m=>!model.saved[m.id]);
   const routes=[...new Set(model.matches.map(m=>m.track))];
   const routeHeader=`<div class="t2-round-route"><strong>ROUND TRACK${routes.length===1?'':'S'}</strong> ${routes.map(t=>esc(t)+' '+locationButton(t)).join(' · ')}</div>`;
   if(pending<0)return `<section class="t2-panel t2-entry-panel"><h2>RACE OFF — RESULTS</h2><div class="t2-entry-strip"><span>CURRENT SLOT ONLY</span><span>${done}/${total} MATCHES BANKED</span></div>${routeHeader}<div class="t2-entry-done">✓ ALL SLOT MATCHES BANKED</div>${completedFooter()}</section>`;
   const m=model.matches[pending],phase=model.matchSteps434[m.id]||0;
   const saved=model.matches.filter(x=>!!model.saved[x.id]);
   const prior=saved.length?`<details class="t2-entry-finished431"><summary>✓ ${saved.length} completed match${saved.length===1?'':'es'}</summary><ol>${saved.map(x=>`<li>${esc(x.cars[0].name)} vs ${esc(x.cars[1].name)}</li>`).join('')}</ol></details>`:'';
   const a=m.cars[0],b=m.cars[1];
   const key0=`m:${pending}:0`,key1=`m:${pending}:1`;
   const first=phase<2?`<div class="t2-entry-car t2-entry-current434"><div class="t2-entry-carname"><strong>CAR 1 · ${esc(a.name)}</strong>${badges(a)}</div>${field(key0,model.drafts[key0]||'',a.name,false)}<button type="button" class="t2-entry-smallbtn" data-t2-action="raceoff-next434" data-t2-index="${pending}">✓ CAR 1 RACED · NEXT CAR</button><p class="t2-entry-help">Car 1 time is held temporarily until both cars have raced. It is banked only after Car 2.</p></div>`:
   `<div class="t2-entry-car t2-entry-saved"><div class="t2-entry-carname"><strong>CAR 1 · ${esc(a.name)}</strong>${badges(a)}<small>✓ TIME ENTERED</small></div><div class="t2-entry-banked431">${esc(model.drafts[key0]||'')}</div></div><div class="t2-entry-vs">VS</div><div class="t2-entry-car t2-entry-current434"><div class="t2-entry-carname"><strong>CAR 2 · ${esc(b.name)}</strong>${badges(b)}</div>${field(key1,model.drafts[key1]||'',b.name,false)}<button type="button" class="t2-btn t2-entry-bank" data-t2-action="bank-match" data-t2-index="${pending}">BANK BOTH TIMES</button></div>`;
   return `<section class="t2-panel t2-entry-panel"><h2>RACE OFF — CAR-BY-CAR</h2><div class="t2-entry-strip"><span>MATCH ${pending+1} OF ${total}</span><span>${done}/${total} MATCHES BANKED</span></div>${routeHeader}<article class="t2-entry-match"><div class="t2-entry-matchhead"><strong>ONE CAR AT A TIME</strong><span>${phase<2?'CAR 1':'CAR 2'} NEXT</span></div><p class="t2-entry-route">${esc(m.track)}</p>${first}</article>${prior}<p class="t2-entry-help">The pre-race setup reminder appears before each car. No future draw is shown.</p></section>`;
 }
 // Relay team-first: all three legs for team 1, then team 2.
 // Different cars per leg by Relay rules. The r:leg:team ledger is unchanged.
 function relay(){
   const total=model.teams.length,tracks=model.tracks;
   const finished=model.teams.filter(t=>tracks.every((_,i)=>Object.hasOwn(model.saved[i],t.id)));
   const activeIndex=model.teams.findIndex(t=>tracks.some((_,i)=>!Object.hasOwn(model.saved[i],t.id)));
   const head=`<div class="t2-entry-strip"><span>ONE TEAM · ALL THREE LEGS</span><span>${finished.length}/${total} TEAMS COMPLETE</span></div>`;
   const previous=finished.length?`<details class="t2-entry-finished431"><summary>✓ ${finished.length} team${finished.length===1?'':'s'} completed · saved times</summary><ol>${finished.map(t=>`<li><strong>${esc(t.label)}</strong><small>${tracks.map((x,i)=>'Leg '+(i+1)+': '+esc(display(model.saved[i][t.id]))).join(' · ')}</small></li>`).join('')}</ol></details>`:'';
   if(activeIndex<0)return `<section class="t2-panel t2-entry-panel t2-entry-car-first431"><h2>RELAY · OFFICIAL TEAM LEGS</h2>${head}<div class="t2-entry-done">✓ ALL RELAY LEGS SAVED</div>${completedFooter()}${previous}</section>`;
   const team=model.teams[activeIndex],nextLeg=earliestPendingTrack(tracks,i=>Object.hasOwn(model.saved[i],team.id));
   const stages=tracks.map((track,i)=>{
     const c=team.cars[i],saved=Object.hasOwn(model.saved[i],team.id),locked=i>nextLeg;
     const key=`r:${i}:${activeIndex}`,val=saved?display(model.saved[i][team.id]):model.drafts[key]||'';
     const input=saved?`<div class="t2-entry-banked431">✓ SAVED · ${esc(val)}</div>`:locked?'<p class="t2-entry-help">Finish the preceding leg first.</p>':
       `<div class="t2-entry-controls">${field(key,val,c.name,false)}<button type="button" class="t2-entry-smallbtn" data-t2-action="bank-car" data-t2-index="${activeIndex}" data-t2-track="${i}">SAVE LEG ${i+1}</button></div>`;
     return `<article class="t2-entry-leg431 ${saved?'is-saved':locked?'is-locked':'is-current'}"><h4>LEG ${i+1} OF 3 · ${esc(track)} ${locationButton(track)}</h4><div class="t2-entry-carname"><strong>${esc(c.name)}</strong>${badges(c)}</div>${input}</article>`;
   }).join('');
   return `<section class="t2-panel t2-entry-panel t2-entry-car-first431"><h2>RELAY · OFFICIAL TEAM LEGS</h2>${head}<article class="t2-entry-active-car431"><h3>TEAM ${activeIndex+1} OF ${total} · ${esc(team.label)}</h3>${stages}</article>${previous}<p class="t2-entry-help">Complete this team's three different cars and legs before the next team.</p></section>`;
 }
 // Aerodromo is deliberately CAR-FIRST. Each entrant completes its verified
 // Drag Strip run, THEN its one runway jump, before the next car is shown.
 // The underlying ledger still saves the same independent, immutable a:drag
 // and a:jump results; this only changes presentation and entry order.
 function aero(){
   const total=model.cars.length;
   const dragCount=model.cars.filter(c=>Object.hasOwn(model.saved.drag,c.id)).length;
   const jumpCount=model.cars.filter(c=>Object.hasOwn(model.saved.jump,c.id)).length;
   const finished=model.cars.filter(c=>Object.hasOwn(model.saved.drag,c.id)&&Object.hasOwn(model.saved.jump,c.id));
   const activeIndex=model.cars.findIndex(c=>!Object.hasOwn(model.saved.drag,c.id)||!Object.hasOwn(model.saved.jump,c.id));
   const head=`<div class="t2-entry-strip"><span>DRAG → JUMP · ONE CAR</span><span>${finished.length}/${total} CARS COMPLETE</span></div>`;
   // Put the venue details and extended instructions AFTER the active entry.
   // On Samsung's numeric keyboard, they must not push the jump field below the screen.
   const details=`<div class="t2-aero-aux"><div class="t2-aero-venues"><span><strong>DRAG</strong> ${esc(model.track)} ${locationButton(model.track)}</span><span><strong>JUMP</strong> ${esc(model.jumpFacility)}</span></div>
     <p class="t2-entry-help">One Drag run and one Long Jump attempt per car. Finish both before moving to the next car.</p></div>`;
   const previous=finished.length?`<details class="t2-aero-finished"><summary>✓ ${finished.length} car${finished.length===1?'':'s'} completed · view saved results</summary>
     <ol>${finished.map(c=>`<li><span>${esc(c.name)}</span><small>Drag ${esc(display(model.saved.drag[c.id]))} · Jump ${(model.saved.jump[c.id]/100).toFixed(2)} m</small></li>`).join('')}</ol></details>`:'';
   if(activeIndex<0)return `<section class="t2-panel t2-entry-panel t2-aero-entry"><h2>AERÓDROMO DOUBLE-HEADER</h2>${head}<div class="t2-entry-done">✓ ALL ${total} CARS: DRAG AND LONG JUMP BANKED</div>${completedFooter()}${previous}${details}</section>`;
   const car=model.cars[activeIndex],hasDrag=Object.hasOwn(model.saved.drag,car.id),hasJump=Object.hasOwn(model.saved.jump,car.id);
   const dragKey=`a:drag:${activeIndex}`,jumpKey=`a:jump:${activeIndex}`;
   const dragValue=hasDrag?display(model.saved.drag[car.id]):model.drafts[dragKey]||'';
   const jumpValue=hasJump?(model.saved.jump[car.id]/100).toFixed(2):model.drafts[jumpKey]||'';
   const dragSection=hasDrag?
      `<div class="t2-aero-saved"><strong>✓ DRAG SAVED</strong><span>${esc(dragValue)}</span></div>`:
      `<div class="t2-aero-step is-current"><h4>1 · DRAG RUN</h4>${field(dragKey,dragValue,car.name,false)}<button type="button" class="t2-entry-smallbtn" data-t2-action="bank-aero" data-t2-phase="drag" data-t2-index="${activeIndex}">SAVE DRAG TIME</button></div>`;
   const jumpSection=hasDrag?(hasJump?
      `<div class="t2-aero-saved"><strong>✓ LONG JUMP SAVED</strong><span>${esc(jumpValue)} m</span></div>`:
      `<div class="t2-aero-step is-current t2-aero-jump-step"><h4>2 · LONG JUMP (METRES)</h4><input class="t2-aero-metres" type="text" inputmode="decimal" autocomplete="off" data-t2-time="${jumpKey}" aria-label="Long Jump metres for ${esc(car.name)}" placeholder="123.45" value="${esc(jumpValue)}"><button type="button" class="t2-entry-smallbtn" data-t2-action="bank-aero" data-t2-phase="jump" data-t2-index="${activeIndex}">SAVE LONG JUMP</button><p>One attempt per car · enter 123.45 or 0.00 for a failed jump.</p></div>`):
      `<div class="t2-aero-step is-locked"><h4>2 · LONG JUMP (METRES)</h4><p>Save this car’s Drag run first.</p></div>`;
   return `<section class="t2-panel t2-entry-panel t2-aero-entry"><h2>AERÓDROMO DOUBLE-HEADER</h2>${head}
     <article class="t2-aero-car t2-entry-car" aria-label="Car ${activeIndex+1} of ${total}">
       <div class="t2-aero-counter">CAR ${String(activeIndex+1).padStart(2,'0')} OF ${total}</div>
       <div class="t2-entry-carname"><strong>${esc(car.name)}</strong>${badges(car)}</div>
       ${hasDrag?jumpSection+dragSection:dragSection+jumpSection}</article>${previous}${details}</section>`;
 }
 // v8.0.434: next setup is determined by the CURRENT scheduled route,
 // never from the old coloured E✓ (which describes the PREVIOUS result).
 const setup434=Object.freeze({
   stock:{name:'FACTORY STOCK',colour:'stock',icon:'🔒',instruction:'NO UPGRADES. Restore the original factory tune and factory PI before racing.'},
   road:{name:'ROAD / STREET',colour:'road',icon:'🏁',instruction:'Select your ROAD setup before this race.'},
   dirt:{name:'DIRT / RALLY',colour:'dirt',icon:'🟠',instruction:'Select your DIRT or RALLY setup before this race.'},
   cross:{name:'CROSS COUNTRY',colour:'cross',icon:'🌿',instruction:'Select your CROSS COUNTRY setup before this race.'},
   drift:{name:'DRIFT',colour:'drift',icon:'🟣',instruction:'Select your DRIFT setup before this event.'},
   drag:{name:'DRAG',colour:'drag',icon:'🏎️',instruction:'Select the setup you use for DRAG runs.'},
   jump:{name:'LONG JUMP',colour:'jump',icon:'🛫',instruction:'Select your LONG JUMP setup before the attempt.'},
   unknown:{name:'CHECK SETUP',colour:'unknown',icon:'⚠️',instruction:'Track category could not be verified. Check the actual course and fit the correct tune before racing.'}
 });
 function routeKind434(track,index){
   if(/^T2-CUSTOM-UPGRADE-(D|C|B|A|S1|S2|X)$/.test(model.competitionId))return 'stock';
   if(model.competitionId==='T2-DRIFT-CHAMPIONSHIP')return 'drift';
   const num=Number(S(model.slotId).match(/^TET2-(\d+)$/)?.[1]);
   let assignment=null;
   try{assignment=window.TET2RouteControl396?.snapshot?.()?.assigned?.find(r=>Number(r.position)===num&&S(r.eventId)===model.competitionId);}catch(_){}
   const entries=assignment?.tracks||[];
   const target=(model.mode==='group'||model.mode==='relay')?entries[index]:entries.find(t=>S(t.name)===S(track))||entries[0];
   // No route metadata? Do not invent a dirt/road setup based on a car name.
   const d=S(target?.discipline).toLowerCase();
   if(d.includes('cross country'))return 'cross';
   if(d.includes('dirt')||d.includes('rally'))return 'dirt';
   if(d.includes('road')||d.includes('street')||d.includes('hot wheels'))return 'road';
   if(d.includes('drag'))return 'drag';
   return 'unknown';
 }
 function nextRun434(){
   if(model.preview||model.trial)return null; // no new official semantics in practice/demo
   if(model.mode==='group'){
     const n=model.cars.findIndex(c=>model.tracks.some((_,i)=>!Object.hasOwn(model.saved[i],c.id)));
     if(n<0)return null;
     const c=model.cars[n],i=earliestPendingTrack(model.tracks,j=>Object.hasOwn(model.saved[j],c.id));
     return {car:c,kind:routeKind434(model.tracks[i],i),track:model.tracks[i],label:'CAR '+(n+1)+' OF '+model.cars.length+' · RACE '+(i+1)+' OF '+model.tracks.length};
   }
   if(model.mode==='relay'){
     const n=model.teams.findIndex(t=>model.tracks.some((_,i)=>!Object.hasOwn(model.saved[i],t.id)));
     if(n<0)return null;
     const t=model.teams[n],i=earliestPendingTrack(model.tracks,j=>Object.hasOwn(model.saved[j],t.id));
     return {car:t.cars[i],kind:routeKind434(model.tracks[i],i),track:model.tracks[i],label:t.label+' · LEG '+(i+1)+' OF 3'};
   }
   if(model.mode==='raceoff'){
     const n=model.matches.findIndex(m=>!model.saved[m.id]);if(n<0)return null;
     const m=model.matches[n],stage=model.matchSteps434[m.id]||0,idx=stage>=2?1:0;
     return {car:m.cars[idx],kind:routeKind434(m.track,0),track:m.track,label:'MATCH '+(n+1)+' · CAR '+(idx+1)+' OF 2',token:'match:'+m.id+':'+idx};
   }
   if(model.mode==='aero'){
     const n=model.cars.findIndex(c=>!Object.hasOwn(model.saved.drag,c.id)||!Object.hasOwn(model.saved.jump,c.id));if(n<0)return null;
     const c=model.cars[n],phase=Object.hasOwn(model.saved.drag,c.id)?'jump':'drag';
     return {car:c,kind:phase,track:phase==='drag'?model.track:model.jumpFacility,label:'CAR '+(n+1)+' OF '+model.cars.length+' · '+phase.toUpperCase(),token:'aero:'+c.id+':'+phase};
   }
   return null;
 }
 function setupNeeded434(){
   const run=nextRun434();if(!run)return null;
   const token=run.token||run.car.id+'|'+run.kind;
   // The same car continues through adjacent tracks of the same surface
   // without repetitive warnings. New car OR different setup => new warning.
   if(model.prepared434?.token===token)return null;
   return {...run,token};
 }
 function briefing434(run){
   if(!run)return '';
   const setup=setup434[run.kind]||setup434.unknown;
   const last=badgeEvidence.evil.get(S(run.car.id));
   const lastLabel=last?({cyan:'ROAD',orange:'DIRT',green:'CROSS COUNTRY',purple:'DRIFT',stock:'STOCK'}[last.kind]||'UNKNOWN'):'FIRST TET2 RACE';
   const lastClass=last?.kind||'none';
   return `<div class="t2-briefing-mask434" role="presentation"><section class="t2-briefing434" role="dialog" aria-modal="true" aria-labelledby="t2-next-title434">
       <div class="t2-briefing-top434"><span>TET2 · BEFORE YOU RACE</span><strong>SETUP CHECK</strong></div>
       <p class="t2-briefing-step434">${esc(run.label)}</p><h2 id="t2-next-title434">${esc(run.car.name)}</h2>
       <div class="t2-briefing-main434" data-kind="${setup.colour}"><div class="t2-briefing-icon434" aria-hidden="true">${setup.icon}</div><small>FIT THIS SETUP</small><strong>${setup.name}</strong><p>${esc(setup.instruction)}</p></div>
       <div class="t2-briefing-summary434"><span>LAST E✓ <b data-last="${lastClass}">${lastLabel}</b></span><span>NEXT VENUE <b>${esc(run.track)}</b></span></div>
       <p class="t2-briefing-note434">The coloured E✓ shows the <b>previous</b> TET2 race; this card shows the <b>next</b> required setup. TET2 cannot inspect fitted FH5 upgrades.</p>
       <button type="button" class="t2-briefing-ready434" data-t2-action="setup-ready434">✓ SETUP READY — CONTINUE</button>
       <button type="button" class="t2-briefing-back434" data-t2-action="exit">← BACK TO RACE CONTROL</button>
     </section></div>`;
 }
 function render(){
   if(!model)return '<div class="t2-content">No results-entry session selected.</div>';
   badgeEvidence=scanBadgeEvidence();
   const aeroMode=model.mode==='aero';
   const context=`<div class="t2-entry-alert">${model.stageRehearsal?'':(model.trial?'LOCKED PRACTICE DRAW · REAL GARAGE CARS · PRACTICE TIMES SAVED LOCALLY · NO OFFICIAL RESULTS':(model.preview?'':'VERIFIED EVIL LIST SLOT · LIVE RESULTS'))}</div>
      <div class="t2-entry-subtitle">${esc(model.label)}</div>`;
   return `<div class="t2-entry-page ${aeroMode?'t2-entry-aero-page':''}"><div class="t2-entry-banner"><span>TET2 • RACE CONTROL</span><strong>RESULTS ENTRY</strong><button type="button" class="t2-entry-back" data-t2-action="exit">← RACE CONTROL</button></div>
      ${aeroMode?'':context}
      ${model.error?`<div class="t2-entry-error" role="alert">${esc(model.error)}</div>`:''}
      ${model.notice?`<div class="t2-entry-notice" role="status">${esc(model.notice)}</div>`:''}
      ${model.mode==='group'?group():model.mode==='relay'?relay():aeroMode?aero():raceoff()}
      ${briefing434(setupNeeded434())}
      ${aeroMode?`<div class="t2-aero-bottom-details">${context}</div>`:''}
      ${model.record&&typeof window!=='undefined'?window.TET2SlotPresentation414?.recordCard?.(model.record)||'':''}
      ${model.trial&&!model.stageRehearsal?'<button type="button" class="t2-btn" data-t2-action="standings">📊 VIEW LIVE STANDINGS / MATCH PROGRESS</button>':''}
      <p class="t2-entry-foot">OTG! digital stopwatch: tap minutes, seconds or milliseconds. The : and . stay in place. Tap the coloured class badge to see original stock PI and this class’s ceiling (not current tuned PI). H opens the original Car History. E✓ shows the last TET2 race type (including STOCK). Pre-race setup checks show the next race requirements before each car. No car images.</p>
      <button type="button" class="t2-btn t2-secondary" data-t2-action="exit">← BACK TO RACE CONTROL</button>
      </div>`;
 }
 function draft(e){
   if(!model)return;
   const t=e.target;
   if(t?.matches?.('[data-t2-segment]')){
     const consoleNode=t.closest('[data-t2-digital]'),key=consoleNode?.dataset.t2Digital;
     if(!key||!consoleNode)return;
     const piece=t.dataset.t2Segment,n=piece==='ms'?3:2;
     const cleaned=t.value.replace(/\D/g,'').slice(0,n);
     t.value=cleaned;
     const span=t.parentElement.querySelector('.t2-time-segments');
     if(span)span.innerHTML=segGroup(cleaned,n);
     t.parentElement.classList.toggle('has-time',!!cleaned);
     const fields=Object.fromEntries(['min','sec','ms'].map(k=>[k,consoleNode.querySelector(`[data-t2-segment="${k}"]`)]));
     const parts={min:fields.min?.value||'',sec:fields.sec?.value||'',ms:fields.ms?.value||''};
     model.segmentDrafts[key]=parts;
     const complete=parts.min.length===2&&parts.sec.length===2&&parts.ms.length===3;
     const raw=complete?`${parts.min}:${parts.sec}.${parts.ms}`:'';
     const mirror=consoleNode.querySelector('[data-t2-time]');
     if(mirror)mirror.value=raw;
     model.drafts[key]=raw;
     consoleNode.classList.toggle('is-invalid',parts.sec.length===2&&Number(parts.sec)>59);
     // The approved OTG! stopwatch auto-jumps from MIN to SEC to MS.
     if(cleaned.length===n){const next=piece==='min'?'sec':piece==='sec'?'ms':null;
       if(next)fields[next]?.focus();}
     return;
   }
   if(t?.matches?.('[data-t2-time]'))model.drafts[t.dataset.t2Time]=t.value;
 }
 function prettify(e){
   if(!model)return;
   if(e.target?.matches?.('[data-t2-segment]'))return;
   if(!e.target?.matches?.('[data-t2-time]'))return;
   const pretty=normalizeTime(e.target.value);
   if(/^\d{1,3}:[0-5]\d\.\d{3}$/.test(pretty)){e.target.value=pretty;model.drafts[e.target.dataset.t2Time]=pretty;}
 }
 function rawFor(key,rootNode){const el=rootNode.querySelector(`[data-t2-time="${key}"]`);return el?el.value:model.drafts[key]||'';}
 async function act(e,after){
   const btn=e.target.closest?.('[data-t2-action]');if(!btn||!model)return false;
   const action=btn.dataset.t2Action;
   if(action==='setup-ready434'){
     const now=setupNeeded434();if(!now){after();return true;}
     model.prepared434={token:now.token,carId:now.car.id,kind:now.kind};model.error='';after();return true;
   }
   if(action==='raceoff-next434'){
     if(model.mode!=='raceoff'){model.error='Not a Race Off session';after();return true;}
     const n=Number(btn.dataset.t2Index),m=model.matches[n];
     const pending=model.matches.findIndex(x=>!model.saved[x.id]);
     if(n!==pending||!m||(model.matchSteps434[m.id]||0)!==0){model.error='Finish the current car first';after();return true;}
     if(setupNeeded434()){model.error='Confirm the setup before racing';after();return true;}
     try{const raw=rawFor(`m:${n}:0`,e.target.closest('#tet2-stage4-app')||document);timeMs(raw);
         model.drafts[`m:${n}:0`]=normalizeTime(raw);model.matchSteps434[m.id]=2;model.error='';model.notice='Car 1 time held locally — now race Car 2.';}
     catch(err){model.error=err.message||'Enter Car 1 time first';}
     after();return true;
   }
   if(action==='continue-record'){model.record=null;after();return true;}
   if(action==='exit'){
     if(model.onExit){model.onExit();}
     else if(typeof window!=='undefined')window.TET2Stage4UI359?.page('race');
     return true;
   }
   if(action==='mark-done'){
     if(!model.onDone){model.error='This entry is not an official tournament slot';after();return true;}
     if(!allSaved()){model.error='Save every race result before MARK AS DONE';after();return true;}
     try{await model.onDone();}catch(err){model.error=err?.message||'Unable to mark slot as done';after();}
     return true;
   }
   if(action==='standings' && model.trial && !model.stageRehearsal){if(typeof window!=='undefined')window.TET2Stage4UI359?.page('progress');return true;}
   if(inFlight)return true;
   if(['bank-car','bank-match','bank-aero'].includes(action)&&setupNeeded434()){model.error='Confirm the NEXT CAR SETUP first';after();return true;}
   const rootNode=e.target.closest('#tet2-stage4-app')||document;
   model.error='';model.notice='';
   try{
     let payload,update;
     if(action==='bank-car'&&model.mode==='group'){
       const n=Number(btn.dataset.t2Index),i=Number(btn.dataset.t2Track),c=model.cars[n];
       if(!Number.isInteger(i)||i<0||i>=model.tracks.length||!c)throw Error('Unknown car or route');
       const active=model.cars.findIndex(z=>model.tracks.some((_,j)=>!Object.hasOwn(model.saved[j],z.id)));
       if(n!==active)throw Error('Finish the current car before switching cars');
       const next=earliestPendingTrack(model.tracks,j=>Object.hasOwn(model.saved[j],c.id));
       if(i!==next)throw Error('Finish the current car’s preceding race first');
       if(Object.hasOwn(model.saved[i],c.id))throw Error('Result already banked');
       const ms=timeMs(rawFor(`g:${i}:${n}`,rootNode));
       payload={mode:'group',slotId:model.slotId,competitionId:model.competitionId,track:model.tracks[i],trackIndex:i,carId:c.id,timeMs:ms};
       update=()=>{model.saved[i][c.id]=ms;delete model.drafts[`g:${i}:${n}`];delete model.segmentDrafts[`g:${i}:${n}`];};
     }else if(action==='bank-aero'){
       if(model.mode!=='aero')throw Error('Not an Aeródromo session');
       const n=Number(btn.dataset.t2Index),c=model.cars[n],phase=S(btn.dataset.t2Phase);
       if(!c||!['drag','jump'].includes(phase))throw Error('Unknown Aeródromo result type');
       const next=model.cars.findIndex(z=>!Object.hasOwn(model.saved.drag,z.id)||!Object.hasOwn(model.saved.jump,z.id));
       if(n!==next)throw Error('Complete the current car before moving to the next');
       if(phase==='jump'&&!Object.hasOwn(model.saved.drag,c.id))throw Error('Save this car’s Drag time before its Long Jump');
       if(phase==='drag'&&Object.hasOwn(model.saved.drag,c.id))throw Error('Drag run already banked for this car');
       if(Object.hasOwn(model.saved[phase],c.id))throw Error('Attempt already recorded');
       const input=S(rawFor(`a:${phase}:${n}`,rootNode));
       if(phase==='drag'){
         const ms=timeMs(input);payload={mode:'aero',slotId:model.slotId,competitionId:model.competitionId,discipline:'drag',carId:c.id,track:model.track,timeMs:ms};
         update=()=>{model.saved.drag[c.id]=ms;delete model.drafts[`a:drag:${n}`];delete model.segmentDrafts[`a:drag:${n}`];};
       }else{
         if(!/^\d{1,5}(?:\.\d{1,2})?$/.test(input))throw Error('Enter jump metres to 2 decimals, e.g. 123.45');
         const cm=Math.round(Number(input)*100);
         if(!Number.isSafeInteger(cm)||cm<0||cm>10000000)throw Error('Invalid jump distance');
         payload={mode:'aero',slotId:model.slotId,competitionId:model.competitionId,discipline:'jump',carId:c.id,jumpFacility:model.jumpFacility,distanceCm:cm};
         update=()=>{model.saved.jump[c.id]=cm;delete model.drafts[`a:jump:${n}`];};
       }
     }else if(action==='bank-car'&&model.mode==='relay'){
       const n=Number(btn.dataset.t2Index),i=Number(btn.dataset.t2Track),t=model.teams[n];
       if(!Number.isInteger(i)||i<0||i>=3||!t)throw Error('Unknown Relay team or leg');
       const active=model.teams.findIndex(z=>model.tracks.some((_,j)=>!Object.hasOwn(model.saved[j],z.id)));
       if(n!==active)throw Error('Finish the current Relay team before switching teams');
       const next=earliestPendingTrack(model.tracks,j=>Object.hasOwn(model.saved[j],t.id));
       if(i!==next)throw Error('Finish this team’s preceding leg first');
       if(Object.hasOwn(model.saved[i],t.id))throw Error('Relay leg already recorded');
       const ms=timeMs(rawFor(`r:${i}:${n}`,rootNode));
       payload={mode:'relay',slotId:model.slotId,competitionId:model.competitionId,leg:i,teamId:t.id,carId:t.cars[i].id,track:model.tracks[i],timeMs:ms};
       update=()=>{model.saved[i][t.id]=ms;delete model.drafts[`r:${i}:${n}`];delete model.segmentDrafts[`r:${i}:${n}`];};
     }else if(action==='bank-match'){
       if(model.mode!=='raceoff')throw Error('Not a Race Off session');
       const n=Number(btn.dataset.t2Index),m=model.matches[n];
       if(!m||model.saved[m.id])throw Error('Match already banked');
       if((model.matchSteps434[m.id]||0)!==2)throw Error('Race Car 1 and confirm Car 2 setup before banking this match');
       const a=timeMs(rawFor(`m:${n}:0`,rootNode)),b=timeMs(rawFor(`m:${n}:1`,rootNode));
       if(a===b)throw Error('Times are tied. Resolve the tie using the competition rules before banking.');
       const winnerId=(a<b?m.cars[0]:m.cars[1]).id;
       payload={mode:'raceoff',slotId:model.slotId,competitionId:model.competitionId,matchId:m.id,track:m.track,timeA:a,timeB:b,carA:m.cars[0].id,carB:m.cars[1].id,winnerId};
       update=()=>{model.saved[m.id]={a,b,winnerId};delete model.drafts[`m:${n}:0`];delete model.drafts[`m:${n}:1`];delete model.segmentDrafts[`m:${n}:0`];delete model.segmentDrafts[`m:${n}:1`];};
     }else return false;
     inFlight=true;btn.disabled=true;
     const bankProof=typeof model.onBank==='function'?await model.onBank(clone(payload)):null;
     update();model.record=bankProof?.record||null;model.notice=model.stageRehearsal?'✓ STAGE REHEARSAL result saved separately. Not an official tournament result.':(model.trial?'✓ PRACTICE result saved locally. Not an official tournament result.':'✓ Result banked'+(model.preview?' in this temporary preview only.':'.'));
   }catch(err){model.error=err?.message||'Cannot bank result';}
   finally{inFlight=false;after();}
   return true;
 }
 return Object.freeze({normalizeTime,timeMs,display,openDemo,openScheduled,openTrial,render,draft,prettify,act,version:'8.0.436',
   /* QA: read-only copy of in-memory preview; NEVER a tournament write API */
   peek:()=>model?clone({mode:model.mode,preview:model.preview,saved:model.saved,trackIndex:model.trackIndex,error:model.error}):null});
});
