/* OTG! MAIN v8.0.382 — historical races & Festival candidate-field rehearsal.
 * Native results-entry + real Garage draw, FIRST HISTORICAL SOURCE VISIT ONLY.
 * Read-only reference cohort counts (from 2026 R1); modern live Garage filter
 * is a CANDIDATE, never misrepresented as the exact 697-car source roster.
 * No old R1 personal owned car IDs embedded. Later visits/bronze are gated.
 * Isolated prelaunch localStorage; no official ledger/rhSave/honours calls.
 */
(function(root,factory){'use strict';const api=factory(root);root.TET2Historical382=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof window!=='undefined'?window:globalThis,function(root){
'use strict';
const SOURCE='TET2_HISTORICAL_REHEARSAL_8382',PREFIX='tet2.prelaunch.historical.v8382.', S=x=>String(x??'').trim();
const esc=x=>S(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone=x=>JSON.parse(JSON.stringify(x));
const fail=x=>{throw Error('Historical stage safe stop: '+x);};
const norm=x=>S(x).toLocaleLowerCase('en-GB').replace(/[&\/\-]/g,' ').replace(/\s+/g,' ');
const alias={'hypercar':'hypercars','modern sports car':'modern sports cars','modern supercar':'modern supercars','classic sports':'classic sports cars','rods and customs':'rods & customs','sports utility':'sports utility heroes','utility':'vans & utility','retro supercars':'retro super cars','offroad':'offroad','utv':'utvs','unlimited offroad':'unlimited offroad'};
function source(eid){const e=root.TET2HistoricalSource382?.[eid];if(!e||!Array.isArray(e.visits)||!e.visits.length)fail('Unverified original competition '+eid);return e;}
function meta(){const info=root.TET2EventRouter375?.inspect?.();
 if(!info?.row||info.row.origin!=='historical'||!['Race Off','Festival'].includes(info.row.mode))fail('Select a historical Race Off or Festival Championship in the Evil List');
 if(!info.stamp||!root.TET2AssembledList379?.snapshot?.()?.audit?.ok)fail('Candidate timetable integrity unavailable');
 const sp=root.rhSpace?.();if(!sp||sp.catalogueKey!=='fh5-catalogue-v1'||!S(sp.id)||!Array.isArray(sp.cars))fail('Original FH5 Garage not active');
 const idList=sp.cars.map(c=>S(c.id));if(idList.some(id=>!id)||new Set(idList).size!==idList.length)fail('Invalid live FH5 car identities');
 const src=source(info.row.eventId);
 const original=src.visits.filter(v=>v.fmt!=='BRONZE');
 const reference=info.row.format==='BRONZE'?null:original[info.row.visit-1]||null;
 // A new TET2 bronze row inserted before the original final shifts the final index.
 const idx=info.row.format==='BRONZE'?-1:info.row.visit-1-(src.visits.length<info.row.visit?1:0);
 const stage=idx>=0?src.visits[idx]:null;
 if(stage&&stage.fmt!==info.row.format)fail('Historical timetable visit format differs from original source');
 if(stage&&Number(stage.workload)!==Number(info.row.workload))fail('Historical source workload changed');
 if(info.row.visit===1&&(!stage||stage.fmt!==info.row.format))fail('First historical stage does not match original source');
 const map=new Map(sp.cars.map(c=>[S(c.id),c]));return {info,sp,src,map,stage};
}
function eligibility(c){
 const row=c.info.row,title=S(row.name),r=c.src.rule,owned=c.sp.cars;
 let selected=null,matcher='';
 const man=r.match(/(?:^|\s)([\w&.\- ]+?) cars only$/i);
 if(row.family==='Manufacturer'){
  const makes=[...new Set(owned.map(x=>S(x.make)).filter(Boolean))].sort((a,b)=>b.length-a.length);
  const found=makes.find(x=>title.startsWith(x+' ')||title===''+x);
  if(found){selected=owned.filter(x=>S(x.make)===found);matcher='Manufacturer: '+found;}
 }else if(row.family==='Era Championship'){
  const m=title.match(/\b(19\d0|20\d0)s\b/);if(m){const y=Number(m[1]);selected=owned.filter(x=>{const v=Number(x.year);return Number.isSafeInteger(v)&&v>=y&&v<y+10});matcher='Year: '+m[1]+'s';}
 }else if(row.family==='Vintage & Classic'){
  const vintage=/^Vintage /i.test(title),classic=/^Classic /i.test(title);
  if(vintage||classic){selected=owned.filter(x=>{const y=Number(x.year);return Number.isSafeInteger(y)&&(vintage?y>0&&y<=1949:y>=1950&&y<=1990);});matcher=vintage?'Vintage years ≤1949':'Classic years 1950–1990';}
 }else if(row.family==='Class / Type'||row.family==='Rally Adventure'||row.family==='Hot Wheels'||row.family==='Drag Racing'||row.family==='Off-Road / Buggy'){
  const matches=r.match(/\bin\s+([\w&\/\- ]+?)(?:\s+cars)?$/i);
  let type=matches?matches[1]:'';
  if(!type&&title.includes('—'))type=title.split('—')[1].replace(/ (Championship|Race Off)$/i,'').trim();
  if(type){const target=norm(alias[norm(type)]||type);selected=owned.filter(x=>norm(x.classType)===target);matcher='Class / Type: '+type;}
 }
 // No synthetic 'all normal' or all Race/FE candidate fields; ecosystem
 // membership was manually curated in 2026 and can't be inferred from make alone.
 if(!selected&&row.family==='Drift'){
  selected=owned.filter(x=>norm(x.classType)==='drift cars');matcher='Class / Type: Drift Cars';
 }
 const resolved=Array.isArray(selected)&&selected.length>=2&&new Set(selected.map(x=>S(x.id))).size===selected.length;
 return {resolved,cars:resolved?selected:[],matcher:matcher||'Not safely derivable from source category',referenceCount:c.src.sourceCount,
  candidateCount:selected?selected.length:null,exact:false,
  warning:'Candidate Garage filter only. Original R1 uses curated ecosystems ('+c.src.ecosystem+'). Equality of counts does NOT verify matching car identities. Late-owned cars and specialist splits require a final eligibility audit.'};
}
function stageSpec(c,pool){const r=c.info.row,v=c.stage;if(r.visit!==1||!v||r.format==='BRONZE')return {ready:false,reason:'Later historical visits need winners or group qualifiers from earlier locked results. Bronze duel always requires losing semifinalists.'};
 const w=Number(v.workload);if(!Number.isInteger(w)||w<2)return {ready:false,reason:'Unsupported original source workload'};
 if(r.mode==='Race Off'){
  if(v.fmt!=='KNOCKOUT'||w%2||w/2>8)return {ready:false,reason:'Source knockout has a non-standard number of pairings; stage needs an adapted bracket'};
  if(pool.cars.length<w)return {ready:false,reason:'Current candidate filter has fewer cars than this original stage requires'};
  return {ready:true,mode:'raceoff',amount:w/2,tracks:1,required:w,stageTitle:'FIRST SOURCE KNOCKOUT VISIT'};
 }
 let tracks=1, cars=w;
 if(v.fmt==='GROUPS'){
   const m=v.action.match(/•\s*(\d+)\s+TRACKS?/i);if(!m)return {ready:false,reason:'Missing original group track count'};
   tracks=Number(m[1]);cars=w/tracks;
 }else if(v.fmt==='STANDARD'){
   let m=v.action.match(/RUN ROUNDS?\s+(\d+)\s*[–-]\s*(\d+)/i);
   tracks=m?Number(m[2])-Number(m[1])+1:1;cars=w/tracks;
 }else return {ready:false,reason:'Unsupported historical Festival stage type: '+v.fmt};
 if(!Number.isInteger(cars)||cars<2||cars>64||!Number.isInteger(tracks)||tracks<1||tracks>3)return {ready:false,reason:'Source stage needs an unsupported group/track split'};
 if(pool.cars.length<cars)return {ready:false,reason:'Candidate pool is smaller than original current group size'};
 return {ready:true,mode:'group',amount:cars,tracks,required:w,stageTitle:'FIRST SOURCE FESTIVAL VISIT'};
}
function key(sp){return PREFIX+encodeURIComponent(S(sp.id));}
function read(c){let raw;try{raw=root.localStorage?.getItem?.(key(c.sp));}catch(_){fail('Cannot read isolated rehearsal storage');}
 if(!raw)return {schema:1,source:SOURCE,spaceId:S(c.sp.id),records:{}};
 let b;try{b=JSON.parse(raw);}catch(_){fail('Existing rehearsal book damaged. Nothing was overwritten');}
 if(b?.schema!==1||b?.source!==SOURCE||b?.spaceId!==S(c.sp.id)||!b.records||typeof b.records!=='object'||Array.isArray(b.records))fail('Saved rehearsal storage does not match this Space');return b;
}
function write(c,b){if(b.spaceId!==S(c.sp.id)||b.source!==SOURCE)fail('Attempt to write into another Space was stopped');try{if(typeof root.localStorage?.setItem!=='function')fail('Local storage unavailable');root.localStorage.setItem(key(c.sp),JSON.stringify(b));}catch(_){fail('Practice save failed. No result accepted');}}
function checkRecord(rec,c,pool,spec){if(!rec)return;
 if(rec.source!==SOURCE||rec.stamp!==c.info.stamp||rec.eventId!==c.info.row.eventId||rec.visit!==1||rec.position!==c.info.row.position||rec.mode!==spec.mode||rec.amount!==spec.amount||rec.trackCount!==spec.tracks||!Array.isArray(rec.ids)||rec.ids.length!==(spec.mode==='raceoff'?spec.amount*2:spec.amount)||new Set(rec.ids).size!==rec.ids.length||rec.ids.some(id=>!c.map.has(id)||!pool.cars.some(v=>S(v.id)===id)))fail('Garage, candidate field or timetable changed since the rehearsal draw. Existing results preserved; no relabelling.');
 if(!Array.isArray(rec.tracks)||rec.tracks.length!==spec.tracks||rec.tracks.some(x=>S(x).length<3)||!rec.saved||typeof rec.saved!=='object')fail('Rehearsal draw schema invalid');
 if(rec.mode==='raceoff'&&Array.isArray(rec.saved))fail('Race Off results must be keyed by match');
 if(rec.mode==='group'&&(!Array.isArray(rec.saved)||rec.saved.length!==spec.tracks||rec.saved.some(x=>!x||typeof x!=='object'||Array.isArray(x))))fail('Festival results must be keyed by track');
 if(rec.mode==='raceoff'){
   for(const [id,v] of Object.entries(rec.saved)){if(!/^m\d+$/.test(id)||!rec.matches?.some(m=>m.id===id)||!Number.isSafeInteger(v.a)||v.a<=0||!Number.isSafeInteger(v.b)||v.b<=0||v.a===v.b||!rec.ids.includes(v.winnerId))fail('A saved match result is inconsistent');}
 }else{
   for(const track of rec.saved)for(const [id,t] of Object.entries(track))if(!rec.ids.includes(id)||!Number.isSafeInteger(t)||t<=0||t>=86400000)fail('Saved Festival result has an invalid time or car ID');
 }
}
function status(){const c=meta(),pool=eligibility(c),spec=stageSpec(c,pool),book=read(c);
 const rec=c.info.row.visit===1?(book.records[c.info.row.eventId]||null):null;
 if(rec){if(!spec.ready)fail('Existing first-visit draw no longer matches source stage');checkRecord(rec,c,pool,spec);}
 const banked=rec?(spec.mode==='raceoff'?Object.keys(rec.saved).length:Object.values(rec.saved).reduce((n,o)=>n+Object.keys(o||{}).length,0)):0;
 return {...c,pool,spec,book,rec,banked};}
let preview=null;
function draw(){const c=status();if(!c.spec.ready||!c.pool.resolved)fail(c.spec.reason||'Eligibility unresolved');if(c.rec)fail('Rehearsal draw already locked');
 if(typeof root.TET2SlotDraw363?.selectFromGarage!=='function')fail('Native current-visit draw engine unavailable');
 const ids=c.pool.cars.map(x=>S(x.id));const d=root.TET2SlotDraw363.selectFromGarage({mode:c.spec.mode, ...(c.spec.mode==='raceoff'?{matches:c.spec.amount}:{count:c.spec.amount}),eligibleCarIds:ids,preview:true});
 const chosen=c.spec.mode==='raceoff'?d.matches?.flatMap(m=>[S(m.carA.id),S(m.carB.id)]):d.group?.map(x=>S(x.id));
 if(d.mode!==c.spec.mode)fail('Native draw changed its required mode');
 const expected=c.spec.mode==='raceoff'?c.spec.amount*2:c.spec.amount;
 if(!Array.isArray(chosen)||chosen.length!==expected||new Set(chosen).size!==expected||chosen.some(x=>!ids.includes(x)))fail('Native draw returned invalid or repeated cars');
 preview={eventId:c.info.row.eventId,stamp:c.info.stamp,position:c.info.row.position,ids:chosen};return clone(preview);
}
function lock(tracks){const c=status();if(!c.spec.ready)fail(c.spec.reason);if(c.rec)fail('This source visit is already locked');
 const routes=tracks.map(S);if(routes.length!==c.spec.tracks||routes.some(t=>t.length<3||t.length>100))fail('Enter '+c.spec.tracks+' real practice route name(s), 3–100 characters each');
 if(!preview||preview.eventId!==c.info.row.eventId||preview.stamp!==c.info.stamp||preview.position!==c.info.row.position)fail('Draw preview expired; draw this visit again');
 const valid=new Set(c.pool.cars.map(x=>S(x.id))),expected=c.spec.mode==='raceoff'?c.spec.amount*2:c.spec.amount;
 if(preview.ids.length!==expected||new Set(preview.ids).size!==expected||preview.ids.some(x=>!valid.has(x)))fail('Draw does not belong to current live candidate field');
 const rec={source:SOURCE,stamp:c.info.stamp,eventId:c.info.row.eventId,position:c.info.row.position,visit:1,mode:c.spec.mode,amount:c.spec.amount,trackCount:c.spec.tracks,tracks:routes,ids:preview.ids.slice(),saved:c.spec.mode==='group'?routes.map(()=>({})): {},
 matches:c.spec.mode==='raceoff'?Array.from({length:c.spec.amount},(_,i)=>({id:'m'+(i+1),cars:preview.ids.slice(i*2,i*2+2)})):undefined};
 c.book.records[rec.eventId]=rec;write(c,c.book);preview=null;return clone(rec);
}
function bank(p){const c=status(),rec=c.rec;if(!rec)fail('Lock the practice visit first');
 if(S(p?.slotId)!=='HISTORICAL-PRACTICE-'+c.info.row.position||S(p?.competitionId)!==c.info.row.eventId||p.mode!==rec.mode)fail('Result belongs to another competition or visit');
 if(rec.mode==='raceoff'){
  const m=rec.matches.find(m=>m.id===S(p.matchId));if(!m||Object.hasOwn(rec.saved,m.id)||S(p.track)!==rec.tracks[0]||S(p.carA)!==m.cars[0]||S(p.carB)!==m.cars[1])fail('Wrong pairing, track or already saved');
  if(!Number.isSafeInteger(p.timeA)||p.timeA<=0||!Number.isSafeInteger(p.timeB)||p.timeB<=0||p.timeA===p.timeB)fail('Two different positive race times required');
  const winner=p.timeA<p.timeB?m.cars[0]:m.cars[1];if(S(p.winnerId)!==winner)fail('Faster car must win in rehearsal');rec.saved[m.id]={a:p.timeA,b:p.timeB,winnerId:winner};
 }else{
  if(!Number.isInteger(p.trackIndex)||p.trackIndex<0||p.trackIndex>=rec.tracks.length||S(p.track)!==rec.tracks[p.trackIndex]||!rec.ids.includes(S(p.carId))||Object.hasOwn(rec.saved[p.trackIndex],S(p.carId))||!Number.isSafeInteger(p.timeMs)||p.timeMs<=0||p.timeMs>=86400000)fail('Invalid or repeated track/car time');
  rec.saved[p.trackIndex][S(p.carId)]=p.timeMs;
 }
 write(c,c.book);return {saved:true};
}
function open(){const c=status(),rec=c.rec;if(!rec)fail('Draw and lock rehearsal visit first');if(typeof root.TET2ResultsEntry360?.openTrial!=='function')fail('Native results entry missing');
 const car=id=>{const x=c.map.get(id);return {id,name:S(x.name)||[x.make,x.model,x.year].filter(Boolean).join(' '),h:x.h===true,e:x.e===true};};
 const config={source:'TET2_DRAW_PRACTICE_V8363',spaceId:S(c.sp.id),slotId:'HISTORICAL-PRACTICE-'+c.info.row.position,competitionId:rec.eventId,label:'HISTORICAL '+c.info.row.mode.toUpperCase()+' · REHEARSAL ONLY',stageRehearsal:true,mode:rec.mode,
 onBank:async p=>bank(p),onExit:()=>root.TET2Stage4UI359?.page('race')};
 if(rec.mode==='raceoff')Object.assign(config,{matches:rec.matches.map(m=>({id:m.id,track:rec.tracks[0],cars:m.cars.map(car)})),saved:clone(rec.saved)});
 else Object.assign(config,{cars:rec.ids.map(car),tracks:rec.tracks.slice(),saved:clone(rec.saved)});
 root.TET2ResultsEntry360.openTrial(config);return {saved:c.banked};
}
function html(info){if(info?.row?.origin!=='historical')return '';
 try{const c=status(),r=c.info.row,rec=c.rec,allowed=c.spec.ready;
 const originalCount=c.src.sourceCount,liveCount=c.pool.candidateCount;
 const figure=liveCount===null?'UNRESOLVED':String(liveCount);
 let content='';
 if(rec){const total=c.spec.mode==='raceoff'?c.spec.amount:c.spec.required;content=`<p class="t2-h382-locked">🔒 First source visit frozen locally · ${c.banked}/${total} saved result${total===1?'':'s'}</p><button type="button" class="t2-btn" data-t2-h382="open">${c.banked===total?'VIEW':'RESUME'} HISTORICAL REHEARSAL RESULTS →</button>`;}
 else if(!allowed){content=`<p class="t2-h382-hold">⛔ ${esc(c.spec.reason)}</p>`;}
 else if(preview?.eventId===r.eventId&&preview.stamp===c.info.stamp&&preview.position===r.position){
  const roster=preview.ids.map((id,i)=>`<li><b>${i+1}.</b> ${esc(c.map.get(id)?.name||id)}</li>`).join('');
  content=`<p>Review this visit's candidate cars before freezing a LOCAL rehearsal draw.</p><ol class="t2-h382-ids">${roster}</ol>${Array.from({length:c.spec.tracks},(_,i)=>`<label class="t2-h382-input">Practice route ${i+1}<input type="text" maxlength="100" data-h382-track="${i}" placeholder="FH5 track name"></label>`).join('')}<button type="button" class="t2-btn" data-t2-h382="lock">🔒 LOCK FIRST-VISIT PRACTICE DRAW</button>`;
 }else{content=`<p>${c.spec.mode==='raceoff'?c.spec.amount+' head-to-head pairings':c.spec.amount+' cars over '+c.spec.tracks+' tracks'} · original visit ${r.visit}/${r.visitTotal}</p><button type="button" class="t2-btn" data-t2-h382="preview">🎲 PREVIEW THIS HISTORICAL SOURCE VISIT</button>`;}
 return `<section class="t2-h382"><h3>${r.mode==='Race Off'?'🏎️ HISTORICAL RACE OFF':'🏆 HISTORICAL FESTIVAL'} · SOURCE LINK</h3>
 <p class="t2-h382-warning">PRELAUNCH ONLY · No official slot, medals, records, qualifications or Garage changes. The old source roster is NOT copied into this public app.</p>
 <div class="t2-h382-kpis"><div><small>Original R1 entrants (2026)</small><strong>${originalCount}</strong></div><div><small>Live category candidates</small><strong>${esc(figure)}</strong></div><div><small>Current source visit workload</small><strong>${esc(String(r.workload||'–'))} entries</strong></div></div>
 <p><b>Source eligibility:</b> ${esc(c.src.rule)} · ${esc(c.src.pool)}</p><p><b>Local candidate selector:</b> ${esc(c.pool.matcher)}</p>
 <p class="t2-h382-caution">${esc(c.pool.warning)}</p><p class="t2-h382-action"><b>Original visit instructions:</b> ${esc(c.stage?.action||'NEW TET2 BRONZE MEDAL DUEL · source semifinals required')}</p>
 <div id="t2-h382-error" role="alert" hidden></div>${content}
 <p class="t2-h382-footer">First-visit Race Off and Festival formats use the native Garage draw and time-entry UI. Subsequent visits stay blocked until qualifiers, byes, historic field changes and medal dependencies are verified.</p></section>`;
 }catch(err){return `<section class="t2-h382"><h3>🏁 HISTORICAL SOURCE LINK</h3><p class="t2-h382-hold" role="alert">${esc(err.message)}</p><p>No previous rehearsal results were overwritten.</p></section>`;}
}
function action(e,go){const btn=e.target?.closest?.('[data-t2-h382]');if(!btn)return false;
 try{const op=btn.dataset.t2H382;if(op==='preview'){draw();go('race');}else if(op==='lock'){const items=[...btn.closest('.t2-h382').querySelectorAll('[data-h382-track]')].sort((a,b)=>Number(a.dataset.h382Track)-Number(b.dataset.h382Track));lock(items.map(x=>x.value));go('race');}else if(op==='open'){open();go('entry');}else fail('Unknown historical action');}
 catch(err){const x=btn.closest('.t2-h382')?.querySelector('#t2-h382-error');if(x){x.hidden=false;x.className='t2-h382-hold';x.textContent=S(err.message);}}return true;
}
return Object.freeze({status,eligibility,stageSpec,draw,lock,bank,open,html,action,version:'8.0.382'});
});
