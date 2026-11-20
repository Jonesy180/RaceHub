/* OTG! Main v8.0.371 — ONE integrated TET2 candidate timetable.
 * All stages in a single ordered, searchable list; the first 11 slots actually
 * reserve one randomly ordered early appearance of every independent format.
 * READ-ONLY. Historical source visits are NOT assumed compatible with all new
 * medal rules. NO writes to Garage, runs, draws, honours or official slots.
 */
(function(root,factory){'use strict';const api=factory(root);root.TET2AssembledList371=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof window!=='undefined'?window:globalThis,function(root){
'use strict';
const SEED='TET2-INTEGRATED-OPENING-2026-11-20-V371';
const MAX=50, ESC=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean=x=>String(x??'').trim(),num=x=>Number(x).toLocaleString('en-GB');
function hash(s){let h=2166136261>>>0;for(const c of String(s)){h^=c.codePointAt(0);h=Math.imul(h,16777619)>>>0;}return h>>>0;}
function rng(seed){let a=hash(seed)||0x9e3779b9;return ()=>{a=a+0x6d2b79f5|0;let t=Math.imul(a^a>>>15,1|a);t^=t+Math.imul(t^t>>>7,61|t);return ((t^t>>>14)>>>0)/4294967296;};}
const sum=a=>a.reduce((n,x)=>n+x,0);
function queueKey(name){return clean(name).toUpperCase()+'#'+hash(name).toString(36);}
function build(cars,source,engine,openingApi,workloadApi,lockedApi){
 if(!Array.isArray(cars)||cars.length<1||!source||source.events?.length!==214||source.visits?.length!==1128)throw Error('The verified FH5 Garage and original 214-event / 1,128-visit inventory are required');
 if(!engine?.drawMixedRelay||!openingApi?.build||!workloadApi?.compile||!lockedApi?.compute)throw Error('A verified native competition rules module is missing');
 const calc=workloadApi.compile(cars,source,engine),locked=lockedApi.compute(cars,source,engine);
 const queues=new Map(),usedIds=new Set();
 const add=(id,title,family,mode,origin,rows)=>{
  if(!id||usedIds.has(id)||!Array.isArray(rows)||rows.length<1)throw Error('Duplicate or empty competition '+id);
  usedIds.add(id);
  const q=rows.map((r,i)=>({eventId:id,name:title,family,mode,origin,visit:i+1,visitTotal:rows.length,stage:r.stage||'',workload:r.workload||null,notes:r.notes||'',sourcePhase:r.sourcePhase||'',format:r.format||'',protected:!!r.protected}));
  queues.set(id,q);
 };
 const meta=new Map(source.events.map(e=>[e[0],e]));
 const hist=new Map();for(const v of source.visits){const e=meta.get(v[0]);if(!e)throw Error('Historical event ID not in inventory');if(!hist.has(v[0]))hist.set(v[0],[]);hist.get(v[0]).push(v);}
 for(const e of source.events){const list=hist.get(e[0])||[];list.sort((a,b)=>a[1]-b[1]);
  if(!list.length||!list.every((v,i)=>v[1]===i+1&&v[2]===list.length))throw Error('Incomplete source stage order: '+e[0]);
  add(e[0],e[1],e[3],e[2],'historical',list.map(v=>({stage:'Source visit '+v[1]+' of '+v[2],format:v[3],sourcePhase:v[4],protected:String(v[4]).startsWith('06'),workload:v[5],notes:'Historical workload reference; compatibility with the updated TET2 result/bronze rules must be verified.'})));
 }
 const chunkStages=(stages,prefix)=>{const rows=[];for(const st of stages){for(let i=0;i<st.slots;i++){
  const n=Math.min(8,st.matches-i*8);rows.push({stage:st.name+(st.slots>1?' · batch '+(i+1)+'/'+st.slots:''),workload:n,format:'KNOCKOUT',notes:`${prefix}: ${n} match${n===1?'':'es'} in this scheduled visit; future pairings await their own slot.`});
 }}return rows;};
 for(const m of calc.makerRows){add('T2-FULL-RO-'+queueKey(m.name),m.name+' · Full Manufacturer Race Off','Manufacturer Race Off','Race Off','maker-knockout',chunkStages(m.stages,m.count+'-car full-maker field'));}
 // One appearance is ONE relay group. Later groups depend on prior group winners.
 for(const [id,title,ladder] of [['T2-RELAY-MIXED','Mixed Relay Championship',calc.relay.mixed],['T2-RELAY-MANUFACTURER','Manufacturer Relay Championship',calc.relay.maker]]){
  const rows=[];for(const r of ladder.rounds){for(let g=0;g<r.groups;g++)rows.push({stage:`${r.kind==='Final'?'Final':'Qualifying'} · round ${r.round} · group ${g+1}/${r.groups}`,format:'RELAY',workload:r.sizes[g],notes:`${r.sizes[g]} teams, 3 legs per team. The group entrants and cars are drawn only at their scheduled slot.`});}
  add(id,title,'Relay','Relay','relay',rows);
 }
 const swissNames=['Swiss Cup 01','Swiss Cup 02','Swiss Cup 03','Swiss Cup 04','Swiss Cup 05'];
 for(let c=0;c<5;c++){
  const stages=[...Array.from({length:4},(_,i)=>({stage:'Swiss round '+(i+1),format:'SWISS',workload:8,notes:'16-car cup; pairings are decided for this round only.'})),
   {stage:'Quarterfinals',format:'KNOCKOUT',workload:4},{stage:'Semifinals',format:'KNOCKOUT',workload:2},
   {stage:'Bronze-medal duel',format:'BRONZE',workload:1,notes:'Must be run before the final; native Swiss endgame bridge still needs this extra stage.'},
   {stage:'Final',format:'KNOCKOUT',workload:1}];
  add('T2-SWISS-'+(c+1),swissNames[c],'Swiss','Swiss','swiss',stages);
 }
 if(locked.lonely){add('T2-LONELY-HEARTS','Lonely Hearts Cup','Lonely Hearts','Race Off','lonely',chunkStages(locked.lonely.stages,locked.one+' single-car manufacturers'));}
 const gaunt=[];for(let i=0;i<locked.gauntletBatches;i++)gaunt.push({stage:`Batch ${i+1}/${locked.gauntletBatches}`,format:'GAUNTLET',workload:Math.min(8,cars.length-8*i),notes:'Up to 8 eligible cars; three timed routes each; one combined overall/maker/class/type record set.'});
 add('T2-GAUNTLET-ALL','Unified All-Car Gauntlet','Gauntlet','Gauntlet','gauntlet',gaunt);
 const aer=[];for(let i=0;i<locked.aeroBatches;i++)aer.push({stage:`Batch ${i+1}/${locked.aeroBatches}`,format:'DRAG + JUMP',workload:Math.min(16,cars.length-16*i),notes:'Drag first, then one Aeródromo Long Jump per car; two independent results, ONE slot.'});
 add('T2-AERODROMO-DOUBLE','Aeródromo Double-Header','Aeródromo','Drag + Long Jump','aerodromo',aer);
 add('T2-FESTIVAL-TOP3','Festival Top 3 / Open Event','Festival','Festival','specialist',[{stage:'Open Event',format:'TOP 3',notes:'Approved Festival Top 3 specialist; final native connection pending.'}]);
 add('T2-DRIFT-CHAMPIONSHIP','Drift Cars Championship','Drift','Festival','drift',[{stage:'Single championship visit',format:'GROUPS',workload:locked.driftCars,notes:'Existing Drift Cars CLASS/TYPE timed championship, not the retired Drift Zone or Drift Knockout. Its single-visit source precedent must be confirmed in TET2.'}]);
 // Protect the original phase-06 reference visits in the late core, without
 // pretending they are the new Champion of Champions competition.
 const roll=rng(SEED),opener=openingApi.build(SEED+'-opening');
 const out=[],history=[],first=[];
 const take=(key,tail=false)=>{const q=queues.get(key);if(!q?.length)throw Error('Required competition stage unavailable: '+key);
  const x=q[0];if(!tail&&x.protected)throw Error('Protected historical finale entered too early');q.shift();
  if(!q.length)queues.delete(key);const row={...x,position:out.length+1,opening:out.length<opener.length,tail};out.push(row);history.push(key);if(history.length>5)history.shift();return row;};
 const isOpen=(q,k)=>{const x=q[0];if(!x||x.protected||x.visit!==1)return false;
  switch(k){case 'festival-championship':return x.origin==='historical'&&x.mode==='Festival'&&x.format==='GROUPS';
   case 'festival-single':return x.origin==='historical'&&x.mode==='Festival'&&x.format==='STANDARD';
   case 'festival-top3':return x.eventId==='T2-FESTIVAL-TOP3';
   case 'raceoff':return x.origin==='historical'&&x.mode==='Race Off';
   case 'swiss':return x.origin==='swiss';
   case 'relay-mixed':return x.eventId==='T2-RELAY-MIXED';
   case 'relay-manufacturer':return x.eventId==='T2-RELAY-MANUFACTURER';
   case 'gauntlet-unified':return x.origin==='gauntlet';
   case 'lonely-hearts':return x.origin==='lonely';
   case 'drift-championship-22':return x.origin==='drift';
   case 'aerodromo-doubleheader':return x.origin==='aerodromo';
   default:return false;
  }
 };
 for(const f of opener){const candidates=[...queues].filter(([,q])=>isOpen(q,f.id)).map(([id])=>id).sort();
  if(!candidates.length)throw Error('Opening family has no runnable first visit: '+f.id);
  const chosen=candidates[Math.floor(roll()*candidates.length)];first.push({format:f.id,eventId:chosen});take(chosen);
 }
 const tailRows=[];
 for(const [key,q] of [...queues]){const idx=q.findIndex(x=>x.protected);if(idx<0)continue;
  if(q.slice(idx).some(x=>!x.protected)||q.slice(0,idx).some(x=>x.protected))throw Error('Historical protected tail not contiguous: '+key);
  const t=q.splice(idx);tailRows.push([key,t]);if(!q.length)queues.delete(key);
 }
 const tails=new Map(tailRows);
 while(queues.size){const keys=[...queues.keys()].filter(k=>!history.includes(k));const set=keys.length?keys:[...queues.keys()];const key=set[Math.floor(roll()*set.length)];take(key);}
 const nPreTail=out.length;
 while(tails.size){const keys=[...tails.keys()].filter(k=>!history.includes(k));const set=keys.length?keys:[...tails.keys()];const k=set[Math.floor(roll()*set.length)],q=tails.get(k),x=q.shift();out.push({...x,position:out.length+1,opening:false,tail:true});history.push(k);if(history.length>5)history.shift();if(!q.length)tails.delete(k);}
 const expected=source.visits.length+calc.summary.makerVisits+calc.summary.relayCards+locked.swissVisits+(locked.lonely?.slots||0)+locked.gauntletBatches+locked.aeroBatches+2;
 const problems=[],byEvent=new Map(),openingFound=new Set();let legacy=0,maker=0,relay=0,swiss=0,lonely=0,gauntlet=0,aero=0,drift=0,top3=0,protectedN=0;
 const stageKinds={historical:'legacy', 'maker-knockout':'maker',relay:'relay',swiss:'swiss',lonely:'lonely',gauntlet:'gauntlet',aerodromo:'aero',drift:'drift',specialist:'top3'};
 for(let i=0;i<out.length;i++){
  const x=out[i];if(x.position!==i+1)problems.push('Broken sequence at '+i);
  byEvent.set(x.eventId,(byEvent.get(x.eventId)||0)+1);
  if(x.origin==='historical')legacy++;else if(x.origin==='maker-knockout')maker++;else if(x.origin==='relay')relay++;else if(x.origin==='swiss')swiss++;else if(x.origin==='lonely')lonely++;else if(x.origin==='gauntlet')gauntlet++;else if(x.origin==='aerodromo')aero++;else if(x.origin==='drift')drift++;else if(x.origin==='specialist')top3++;
  if(x.protected){protectedN++;if(i<nPreTail)problems.push('Protected R1 phase-06 stage was placed early');}
  if(i<opener.length){if(!x.opening||openingFound.has(opener[i].id))problems.push('Opening family duplicated or missing');openingFound.add(opener[i].id);}
  if(/drift zone score|drift knockout/i.test(x.name)||x.origin==='separate-maker-gauntlet')problems.push('Superseded event reappeared');
 }
 if(out.length!==expected)problems.push('Stage row count '+out.length+' != '+expected);
 const lastVisit=new Map();for(const x of out){const prev=lastVisit.get(x.eventId)||0;if(x.visit!==prev+1)problems.push('Visit chain broken '+x.eventId+' '+x.visit);lastVisit.set(x.eventId,x.visit);}
 for(const [key,n] of byEvent)if(lastVisit.get(key)!==n)problems.push('Incomplete competition '+key);
 if(legacy!==1128||maker!==calc.summary.makerVisits||relay!==calc.summary.relayCards||swiss!==40||lonely!==(locked.lonely?.slots||0)||gauntlet!==locked.gauntletBatches||aero!==locked.aeroBatches||drift!==1||top3!==1||protectedN!==14||openingFound.size!==opener.length)problems.push('Family workload mismatch');
 if(!out.slice(0,opener.length).every(x=>x.visit===1))problems.push('Opening took a later visit');
 if(out.some(x=>/second chance|champion of champions/i.test(x.name)))problems.push('Dependent final event scheduled as an unconditional slot');
 const audit={ok:!problems.length,problems,owned:cars.length,openingCount:opener.length,dependentFinals:2,legacy,maker,relay,swiss,lonely,gauntlet,aero,drift,top3,protectedN,count:out.length,
  unverifiedHistorical:true,aliasWarnings:locked.aliasWarnings,driftCars:locked.driftCars,producer:'V371 source+native workload integration'};
 if(!audit.ok)throw Error('Integrated timetable failed its integrity checks: '+problems.slice(0,5).join('; '));
 return {rows:out,audit,opening:opener,first,seed:SEED,gate:['Historical donor visits still require current medal/bronze/endgame reconciliation — NOT a playable slot list.',
 'Festival Top 3 and the existing 22-car Drift Championship require final active-engine routing.',
 'Swiss Cup extra bronze duel, late entrant allocation, and actual route/eligibility draws require live adapters.',
 'Second Chance Cup cannot be assigned final stages until genuine bronze-duel winners qualify; it has no 16-car cap.',
 'Champion of Champions must be the very last competition, after all maker representatives are known.',
 ...(locked.aliasWarnings?['Manufacturer label variants need identity approval before a frozen tournament draw.']:[])]};
}
let last=null,lastSignature='',query='',family='all',page=0;
function live(){const sp=typeof root.rhSpace==='function'?root.rhSpace():null;if(!sp||sp.catalogueKey!=='fh5-catalogue-v1'||!Array.isArray(sp.cars))throw Error('Open your live FH5 Catalogue Space first.');return sp.cars;}
function snapshot(){const cars=live(),sig=cars.map(c=>[c.id,c.make,c.classType,c.performanceClass].map(clean).join(':')).join('|');
 if(!last||sig!==lastSignature){last=build(cars,root.TET2R1StageInventory366,root.rhEvil2Rules181,root.TET2OpeningCoverage365,root.TET2Workloads368,root.TET2LockedWorkloads370);lastSignature=sig;page=0;}
 return last;
}
function list(d){const q=query.trim().toLowerCase(),subset=d.rows.filter(x=>(family==='all'||x.family===family)&&(!q||[x.name,x.family,x.mode,x.stage,x.eventId].join(' ').toLowerCase().includes(q)));
 const pages=Math.max(1,Math.ceil(subset.length/MAX));page=Math.min(pages-1,Math.max(0,page));const current=subset.slice(page*MAX,(page+1)*MAX);
 const items=current.map(x=>`<li class="t2-s371-item"><div class="t2-s371-heading"><span class="t2-s371-id">PLAN ${String(x.position).padStart(4,'0')}</span>${x.opening?'<span class="t2-s371-badge">OPENING</span>':''}${x.tail?'<span class="t2-s371-badge t2-s371-last">SOURCE TAIL</span>':''}</div><strong>${ESC(x.name)}</strong><small>${ESC(x.family)} · ${ESC(x.mode)} · ${ESC(x.stage)}</small><small class="t2-s371-hint">${x.origin==='historical'?'Historical programme reference — rules audit pending':x.origin==='gauntlet'?'8-car batch · three routes / car':x.origin==='aerodromo'?'16-car batch · Drag → Long Jump':x.origin==='maker-knockout'||x.origin==='lonely'?'Knockout stage · bronze before final':x.origin==='swiss'?'Original Swiss stage + required bronze duel':x.origin==='relay'?'Relay group · native team ladder':x.origin==='drift'?'Existing Drift Cars Championship':'Approved specialist · engine link pending'}</small></li>`).join('');
 const pager=`<button type="button" data-t2-s371="prev" ${page===0?'disabled':''}>◀ Previous</button><span>Page ${page+1} / ${pages}</span><button type="button" data-t2-s371="next" ${page===pages-1?'disabled':''}>Next ▶</button>`;
 return {items:items||'<li class="t2-empty">No matching scheduled stages.</li>',pager,count:`${num(subset.length)} matches · ${subset.length?(page*MAX+1)+'–'+Math.min(subset.length,(page+1)*MAX):'0'} shown`};
}
function html(){try{const d=snapshot(),a=d.audit,v=list(d),families=[...new Set(d.rows.map(x=>x.family))].sort();
 return `<div class="t2-s371-warning"><strong>FULL COMBINED CANDIDATE — NOT LIVE SLOTS.</strong><br>All currently <em>modelled</em> competition visits now share one ordered timetable, with the random 11-format shakedown actually placed at the start. This is a stage assembly preview. Official result entry and tournament locks remain OFF until the final rule and eligibility checks pass.</div>
 <div class="t2-s371-summary"><span><strong>${num(a.count)}</strong><small>Sequenced preview visits</small></span><span><strong>${a.openingCount}/11</strong><small>Random opening covered</small></span><span><strong>${num(a.gauntlet)}</strong><small>Unified Gauntlet batches</small></span><span><strong>${num(a.aero)}</strong><small>Drag + Jump batches</small></span></div>
 <div class="t2-s371-audit">Integrity: <strong>${a.ok?'✓ PASS':'✖ STOP'}</strong> · ${num(a.owned)} live cars · ${num(a.legacy)} historical visits · ${num(a.maker)} maker knockout visits · ${num(a.relay)} Relay group visits · ${a.swiss} Swiss visits · ${a.lonely} Lonely Hearts visits · 1 Drift Championship · 1 Festival Top 3 · ${a.protectedN} protected source-tail visits.</div>
 <p class="t2-s371-nfinal"><strong>Two dependent competitions are not being fabricated:</strong> Second Chance (qualifiers from actual eligible bronze duels, no field cap) and Champion of Champions (absolute finale). Their future slot workloads are NOT included in ${num(a.count)}.</p>
 <div class="t2-s371-controls"><label>Find a competition<input id="t2-s371-search" type="search" placeholder="BMW, Swiss, Gauntlet…" value="${ESC(query)}" autocomplete="off"></label><label>Family<select id="t2-s371-family"><option value="all">All families</option>${families.map(f=>`<option value="${ESC(f)}" ${f===family?'selected':''}>${ESC(f)}</option>`).join('')}</select></label></div>
 <p class="t2-s371-count" id="t2-s371-count">${v.count}</p><ol class="t2-s371-rows" id="t2-s371-rows">${v.items}</ol><div class="t2-s371-pager" id="t2-s371-pager">${v.pager}</div>
 <details class="t2-s371-gates"><summary>Before Slot 001 is allowed — remaining integration gates</summary><ul>${d.gate.map(s=>`<li>${ESC(s)}</li>`).join('')}</ul><p>The preview order is seeded and reproducible for inspection. It is NOT frozen against late Garage entrants or official competition outcomes; there is no racing from this screen yet.</p></details>`;
 }catch(e){return `<div class="t2-s371-warning" role="alert">SAFE STOP: combined schedule unavailable. ${ESC(e.message)}</div>`;}}
function refresh(){try{const d=snapshot(),v=list(d),r=document.getElementById('t2-s371-rows'),p=document.getElementById('t2-s371-pager'),c=document.getElementById('t2-s371-count');if(r&&p&&c){r.innerHTML=v.items;p.innerHTML=v.pager;c.textContent=v.count;}}catch(e){const c=document.getElementById('t2-s371-count');if(c)c.textContent='Unavailable: '+e.message;}}
function action(e){const btn=e.target?.closest?.('[data-t2-s371]');if(!btn)return false;page+=btn.dataset.t2S371==='next'?1:-1;refresh();return true;}
function input(e){if(e.target?.id!=='t2-s371-search')return false;query=String(e.target.value||'').slice(0,100);page=0;refresh();return true;}
function change(e){if(e.target?.id!=='t2-s371-family')return false;family=e.target.value||'all';page=0;refresh();return true;}
return Object.freeze({build,snapshot,html,action,input,change,seed:SEED});
});
