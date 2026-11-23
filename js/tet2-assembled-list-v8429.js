/* OTG! Main v8.0.423 — FROZEN EVIL LIST, LATE OWNERSHIP COMPATIBILITY.
 * All original competition visits retained; NO test-only compulsory opening formats.
 * Visit order stays per competition; bronze BEFORE final; source phase-06 finale
 * remains protected in the late tail. Incomplete Swiss fields are last/pending.
 * Deterministic for the SAME Garage: no randomisation on each screen opening.
 * READ ONLY: never mutate Garage, results, honours, slot ledger, or draws.
 */
(function(root,factory){'use strict';const api=factory(root);root.TET2AssembledList379=api;root.TET2AssembledList373=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof window!=='undefined'?window:globalThis,function(root){
'use strict';
const SEED='TET2-REAL-TOURNAMENT-CONTROLLED-CHAOS-2026-11-22-V422'; // Keep original 2070-visit shuffle unchanged; insert 7 new fields only.
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
 const queues=new Map(),usedIds=new Set(),customKeys=[];
 let historicalBronze=0, protectedExtra=0;
 const add=(id,title,family,mode,origin,rows)=>{
  if(!id||usedIds.has(id)||!Array.isArray(rows)||rows.length<1)throw Error('Duplicate or empty competition '+id);
  usedIds.add(id);
  const q=rows.map((r,i)=>({eventId:id,name:title,family,mode,origin,visit:i+1,visitTotal:rows.length,stage:r.stage||'',workload:r.pending?0:(r.workload||null),pending:!!r.pending,notes:r.notes||'',sourcePhase:r.sourcePhase||'',format:r.format||'',protected:!!r.protected,secondChanceSource:!!r.secondChanceSource,championRepresentativeSource:!!r.championRepresentativeSource}));
  queues.set(id,q);
 };
 const meta=new Map(source.events.map(e=>[e[0],e]));
 const hist=new Map();for(const v of source.visits){const e=meta.get(v[0]);if(!e)throw Error('Historical event ID not in inventory');if(!hist.has(v[0]))hist.set(v[0],[]);hist.get(v[0]).push(v);}
 for(const e of source.events){const list=hist.get(e[0])||[];list.sort((a,b)=>a[1]-b[1]);
  if(!list.length||!list.every((v,i)=>v[1]===i+1&&v[2]===list.length))throw Error('Incomplete source stage order: '+e[0]);
  const rows=list.map(v=>({stage:'Source visit '+v[1]+' of '+v[2],format:v[3],sourcePhase:v[4],protected:String(v[4]).startsWith('06'),workload:v[5],notes:'Historical entrant workload reference, NOT a match count. Native draw and current eligibility still require verification.'}));
  // Source record v[5] is an ENTRANT count, not a number of matches. The
  // existing last 4-entrant stage is semifinals; the final 2-entrant stage
  // already exists. Insert only ONE bronze duel before the existing final.
  // Source fields with two/three entrants have no two losing semifinalists.
  if(e[2]==='Race Off' && Number(e[5])>=4){
    const semi=list.at(-2),final=list.at(-1);
    if(!semi||semi[3]!=='KNOCKOUT'||Number(semi[5])!==4||final[3]!=='KNOCKOUT'||Number(final[5])!==2)
      throw Error('Historical knockout final/semifinal shape cannot be verified: '+e[0]);
    const last=rows.pop();
    rows[rows.length-1].stage='Semifinals · source visit '+semi[1]+' of '+semi[2];
    rows.push({stage:'Bronze-medal duel',format:'BRONZE',sourcePhase:final[4],protected:last.protected,workload:1,
      notes:'ONE extra head-to-head match between losing semifinalists, BEFORE the source final. No medal or Second Chance qualification until actual results.'});
    rows.push({...last,stage:'Final · source visit '+final[1]+' of '+final[2]});
    historicalBronze++;if(last.protected)protectedExtra++;
  }else if(e[2]==='Race Off'){
    const final=list.at(-1);
    if(final[3]!=='KNOCKOUT'||Number(final[5])!==2)throw Error('Small source knockout final not verified: '+e[0]);
    rows[rows.length-1].stage='Final · source visit '+final[1]+' of '+final[2];
  }
  add(e[0],e[1],e[3],e[2],'historical',rows);
 }
 const chunkStages=(stages,prefix,allowSecondChance=false,allowChampion=false)=>{const rows=[];for(const st of stages){for(let i=0;i<st.slots;i++){
  const n=Math.min(8,st.matches-i*8),bronze=/^Bronze-medal duel/.test(st.name),final=st.name==='Final';
  rows.push({stage:st.name+(st.slots>1?' · batch '+(i+1)+'/'+st.slots:''),workload:n,format:bronze?'BRONZE':'KNOCKOUT',
    secondChanceSource:bronze&&allowSecondChance,championRepresentativeSource:final&&allowChampion,
    notes:`${prefix}: ${n} match${n===1?'':'es'} in this scheduled visit; future pairings await their own slot.`});
 }}return rows;};
 for(const m of calc.makerRows){add('T2-FULL-RO-'+queueKey(m.name),m.name+' · Full Manufacturer Race Off','Manufacturer Race Off','Race Off','maker-knockout',chunkStages(m.stages,m.count+'-car full-maker field',m.count>=4,true));}
 // One appearance is ONE relay group. Later groups depend on prior group winners.
 for(const [id,title,ladder] of [['T2-RELAY-MIXED','Mixed Relay Championship',calc.relay.mixed],['T2-RELAY-MANUFACTURER','Manufacturer Relay Championship',calc.relay.maker]]){
  const rows=[];for(const r of ladder.rounds){for(let g=0;g<r.groups;g++)rows.push({stage:`${r.kind==='Final'?'Final':'Qualifying'} · round ${r.round} · group ${g+1}/${r.groups}`,format:'RELAY',workload:r.sizes[g],notes:`${r.sizes[g]} teams, 3 legs per team. The group entrants and cars are drawn only at their scheduled slot.`});}
  add(id,title,'Relay','Relay','relay',rows);
 }
 const swissCups=Math.ceil(cars.length/16);
 const swissVisits=swissCups*8;
 for(let c=0;c<swissCups;c++){
  const field=Math.min(16,cars.length-16*c),pending=field<16;
  const stages=[...Array.from({length:4},(_,i)=>({stage:'Swiss round '+(i+1),format:'SWISS',workload:8,notes:'16-car cup; pairings are decided for this round only.'})),
   {stage:'Quarterfinals',format:'KNOCKOUT',workload:4},{stage:'Semifinals',format:'KNOCKOUT',workload:2},
   {stage:'Bronze-medal duel',format:'BRONZE',workload:1,notes:'Must be run before the final; native Swiss endgame bridge still needs this extra stage.'},
   {stage:'Final',format:'KNOCKOUT',workload:1}];
  add('T2-SWISS-'+(c+1),'Swiss Cup '+String(c+1).padStart(2,'0'),'Swiss','Swiss','swiss',stages.map(s=>({...s,pending,workload:pending?0:s.workload||1,notes:(s.notes||'')+(pending?' Waiting for a complete 16-car field; no races may be drawn.':'')})));
 }
 if(locked.lonely){add('T2-LONELY-HEARTS','Lonely Hearts Cup','Lonely Hearts','Race Off','lonely',chunkStages(locked.lonely.stages,locked.one+' single-car manufacturers',true,false));}
 const gaunt=[];for(let i=0;i<locked.gauntletBatches;i++)gaunt.push({stage:`Batch ${i+1}/${locked.gauntletBatches}`,format:'GAUNTLET',workload:Math.min(8,cars.length-8*i),notes:'Up to 8 eligible cars; three timed routes each; one combined overall/maker/class/type record set.'});
 add('T2-GAUNTLET-ALL','Unified All-Car Gauntlet','Gauntlet','Gauntlet','gauntlet',gaunt);
 const aer=[];for(let i=0;i<locked.aeroBatches;i++)aer.push({stage:`Batch ${i+1}/${locked.aeroBatches}`,format:'DRAG + JUMP',workload:Math.min(16,cars.length-16*i),notes:'Drag first, then one Aeródromo Long Jump per car; two independent results, ONE slot.'});
 add('T2-AERODROMO-DOUBLE','Aeródromo Double-Header','Aeródromo','Drag + Long Jump','aerodromo',aer);
 add('T2-DRIFT-CHAMPIONSHIP','Drift Cars Championship','Drift','Festival','drift',[{stage:'Single championship visit',format:'GROUPS',workload:locked.driftCars,notes:'Existing Drift Cars CLASS/TYPE timed championship, not the retired Drift Zone or Drift Knockout. Its single-visit source precedent must be confirmed in TET2.'}]);
 // Seven new class championships from the exact 902-car workbook. One entry per
 // OWNED car, no knockouts; up to eight timed entrants in each scheduled visit.
 // A smaller Garage without two cars in a recommended tier cannot run that class;
 // fail closed rather than invent entrants or award a meaningless title.
 const classPlan=root.TET2StockClass429?.partition(cars);
 if(!classPlan)throw Error('Stock-aware Custom Upgrade grouping module unavailable');
 const classNames={D:'The Underdogs',C:'Budget Warriors',B:'Street Fighters',A:'Performance Club',S1:'Supercar Warfare',S2:'Hypercar Mayhem',X:'Absolute Lunacy'};
 let customVisits=0;
 for(const cls of root.TET2UpgradeClass424.CLASS_ORDER){
  const field=classPlan[cls];if(field.length<2){if(root.TET2StockClass429?.stockGroupingEnabled?.())continue;throw Error(cls+' Custom Upgrade Championship requires at least two owned eligible cars. No schedule was changed.');}
  const sizes=root.TET2UpgradeClass424.batches(field.length),id='T2-CUSTOM-UPGRADE-'+cls;
  add(id,cls+' Class — '+classNames[cls],'Custom Upgrade','Championship','custom-upgrade',sizes.map((size,i)=>({
   stage:'Timed qualifying · batch '+(i+1)+'/'+sizes.length,format:'GROUPS',workload:size,
   notes:'One genuine FH5 road/street course per car. Factory class groups on new tournament for verified cars; older frozen draws retained. Group maximum PI '+root.TET2UpgradeClass424.PI[cls]+'. Never downgrade.'
  })));
  customKeys.push(id);customVisits+=sizes.length;
 }
 // Preserve the existing 2,070 visit order; do not stir the original tombola
 // again. Insert only these 7 new championship families at seeded positions.
 const customQueues=customKeys.map(key=>[key,queues.get(key)]);
 for(const key of customKeys)queues.delete(key);
 // Protect the original phase-06 reference visits in the late core, without
 // pretending they are the new Champion of Champions competition.
 const roll=rng(SEED),opener=openingApi.build(SEED+'-opening').filter(f=>f.id!=='festival-top3');
 const out=[],history=[],first=[];
 const take=(key,tail=false)=>{const q=queues.get(key);if(!q?.length)throw Error('Required competition stage unavailable: '+key);
  const x=q[0];if(!tail&&x.protected)throw Error('Protected historical finale entered too early');q.shift();
  if(!q.length)queues.delete(key);const row={...x,position:out.length+1,opening:false,tail};out.push(row);history.push(key);if(history.length>5)history.shift();return row;};
 const isOpen=(q,k)=>{const x=q[0];if(!x||x.protected||x.pending||x.visit!==1)return false;
  switch(k){case 'festival-championship':return x.origin==='historical'&&x.mode==='Festival'&&x.format==='GROUPS';
   case 'festival-single':return x.origin==='historical'&&x.mode==='Festival'&&x.format==='STANDARD';
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
 // Opening-format registry remains verified, but it DOES NOT force the first 10
 // slots any more. The old compulsory coverage existed only for the 12-slot QA.
 for(const f of opener){const candidates=[...queues].filter(([,q])=>isOpen(q,f.id)).map(([id])=>id).sort();
  if(!candidates.length)throw Error('Approved format missing from real schedule: '+f.id);
  first.push({format:f.id,eventId:candidates[0]});
 }
 const tailRows=[];
 for(const [key,q] of [...queues]){const idx=q.findIndex(x=>x.protected);if(idx<0)continue;
  if(q.slice(idx).some(x=>!x.protected)||q.slice(0,idx).some(x=>x.protected))throw Error('Historical protected tail not contiguous: '+key);
  const t=q.splice(idx);tailRows.push([key,t]);if(!q.length)queues.delete(key);
 }
 const tails=new Map(tailRows);
 // A Swiss Cup with fewer than 16 entrants has no legal round-one draw. Keep
 // its defined visits visible but at the END, never randomly block live racing
 // before the source finale. These remain explicitly marked PENDING.
 const pendingQueues=new Map();
 for(const [key,q] of [...queues]){if(!q[0]?.pending)continue;
  if(q.some(x=>!x.pending))throw Error('Swiss Cup pending state inconsistent: '+key);
  pendingQueues.set(key,q);queues.delete(key);
 }
 // Real draw: all eligible competition FIRST/NEXT visits participate from slot
 // one, not one of each QA format. A soft variety preference avoids repetitive
 // adjacent families without altering the authentic number of source visits.
 while(queues.size){
  const all=[...queues.keys()],unrepeated=all.filter(k=>!history.includes(k));
  const candidates=unrepeated.length?unrepeated:all;
  const recentFamilies=new Set(out.slice(-2).map(r=>r.family));
  const fresh=candidates.filter(k=>!recentFamilies.has(queues.get(k)[0].family));
  const picks=fresh.length>=2?fresh:candidates;
  take(picks[Math.floor(roll()*picks.length)]);
 }
 // Insert class rounds across the regular core WITHOUT changing the order of
 // any original event. Sort each class's positions so its batches remain ordered.
 const oldCore=out.slice(),inserts=[];
 for(const [key,q] of customQueues){const rollCustom=rng(SEED+'|UPGRADE-CLASS|'+key);
  const positions=q.map(()=>Math.floor(rollCustom()*(oldCore.length+1))).sort((a,b)=>a-b);
  q.forEach((x,i)=>inserts.push({before:positions[i],row:x,key,i}));
 }
 inserts.sort((a,b)=>a.before-b.before||a.key.localeCompare(b.key)||a.i-b.i);
 const combined=[];let ci=0;
 for(let n=0;n<=oldCore.length;n++){
  while(ci<inserts.length&&inserts[ci].before===n)combined.push(inserts[ci++].row);
  if(n<oldCore.length)combined.push(oldCore[n]);
 }
 if(combined.length!==oldCore.length+customVisits)throw Error('Custom Upgrade placement count mismatch');
 out.splice(0,out.length,...combined.map((x,i)=>({...x,position:i+1})));
 const nPreTail=out.length;
 while(tails.size){const keys=[...tails.keys()].filter(k=>!history.includes(k));const set=keys.length?keys:[...tails.keys()];const k=set[Math.floor(roll()*set.length)],q=tails.get(k),x=q.shift();out.push({...x,position:out.length+1,opening:false,tail:true});history.push(k);if(history.length>5)history.shift();if(!q.length)tails.delete(k);}
 // Incomplete 16-car Swiss Cups are not silently discarded; their eight
 // source-defined visits remain visible at the very end, marked unavailable.
 const nPrePending=out.length;
 for(const [key,q] of pendingQueues){for(const x of q){out.push({...x,position:out.length+1,opening:false,tail:false});}}
 const expected=source.visits.length+historicalBronze+calc.summary.makerVisits+calc.summary.relayCards+swissVisits+(locked.lonely?.slots||0)+locked.gauntletBatches+locked.aeroBatches+customVisits+1;
 const problems=[],byEvent=new Map();let legacy=0,maker=0,relay=0,swiss=0,lonely=0,gauntlet=0,aero=0,drift=0,custom=0,top3=0,protectedN=0;
 const stageKinds={historical:'legacy', 'maker-knockout':'maker',relay:'relay',swiss:'swiss',lonely:'lonely',gauntlet:'gauntlet',aerodromo:'aero',drift:'drift',specialist:'top3'};
 for(let i=0;i<out.length;i++){
  const x=out[i];if(x.position!==i+1)problems.push('Broken sequence at '+i);
  byEvent.set(x.eventId,(byEvent.get(x.eventId)||0)+1);
  if(x.origin==='historical')legacy++;else if(x.origin==='maker-knockout')maker++;else if(x.origin==='relay')relay++;else if(x.origin==='swiss')swiss++;else if(x.origin==='lonely')lonely++;else if(x.origin==='gauntlet')gauntlet++;else if(x.origin==='aerodromo')aero++;else if(x.origin==='drift')drift++;else if(x.origin==='custom-upgrade')custom++;else if(x.origin==='specialist')problems.push('Unapproved specialist event: '+x.eventId);
  if(x.protected){protectedN++;if(i<nPreTail)problems.push('Protected R1 phase-06 stage was placed early');}
  if(x.pending&&i<nPrePending)problems.push('Incomplete Swiss Cup scheduled before source tail');
  if(/drift zone score|drift knockout/i.test(x.name)||x.origin==='separate-maker-gauntlet')problems.push('Superseded event reappeared');
 }
 if(out.length!==expected)problems.push('Stage row count '+out.length+' != '+expected);
 const lastVisit=new Map();for(const x of out){const prev=lastVisit.get(x.eventId)||0;if(x.visit!==prev+1)problems.push('Visit chain broken '+x.eventId+' '+x.visit);lastVisit.set(x.eventId,x.visit);}
 for(const [key,n] of byEvent)if(lastVisit.get(key)!==n)problems.push('Incomplete competition '+key);
 if(legacy!==1128+historicalBronze||maker!==calc.summary.makerVisits||relay!==calc.summary.relayCards||swiss!==swissVisits||locked.swissVisits!==swissVisits||locked.swissCups!==swissCups||lonely!==(locked.lonely?.slots||0)||gauntlet!==locked.gauntletBatches||aero!==locked.aeroBatches||drift!==1||custom!==customVisits||top3!==0||protectedN!==14+protectedExtra||first.length!==opener.length)problems.push('Family workload mismatch');
 // Historical Race Off finals are source-backed two-entrant stages; the added
 // bronze duel must immediately precede each 4+-entrant final IN ITS EVENT
 // chain, even though unrelated event slots may separate the two visits.
 const byId=new Map();for(const r of out){if(!byId.has(r.eventId))byId.set(r.eventId,[]);byId.get(r.eventId).push(r);}
 for(const e of source.events.filter(e=>e[2]==='Race Off')){
   const stages=byId.get(e[0])||[],last=stages.at(-1),before=stages.at(-2);
   if(!last||!last.stage.startsWith('Final ·'))problems.push('Missing historical Race Off final '+e[0]);
   if(Number(e[5])>=4 && (!before||before.format!=='BRONZE'||stages.filter(x=>x.format==='BRONZE').length!==1))problems.push('Bronze duel not before final '+e[0]);
   if(Number(e[5])<4 && stages.some(x=>x.format==='BRONZE'))problems.push('False bronze duel on small field '+e[0]);
 }
 const expectedBronze=source.events.filter(e=>e[2]==='Race Off'&&Number(e[5])>=4).length;
 if(historicalBronze!==expectedBronze||historicalBronze!==93)problems.push('Historical bronze reconciliation mismatch');
 const legalSecondChance=out.filter(x=>x.secondChanceSource),legalChampion=out.filter(x=>x.championRepresentativeSource);
 const expectedSecondChance=calc.makerRows.filter(m=>m.count>=4).length+(locked.lonely?1:0);
 if(legalSecondChance.length!==expectedSecondChance||legalChampion.length!==calc.makerRows.length||
    legalSecondChance.some(x=>x.format!=='BRONZE'||!['maker-knockout','lonely'].includes(x.origin))||
    legalChampion.some(x=>x.origin!=='maker-knockout'||x.stage!=='Final'))problems.push('Dependent qualification source mismatch');
 if(out.slice(0,opener.length).some(x=>x.pending||x.protected))problems.push('Protected/pending stage appeared in first 10 slots');
 if(out.some(x=>/second chance|champion of champions/i.test(x.name)))problems.push('Dependent final event scheduled as an unconditional slot');
 const audit={ok:!problems.length,problems,owned:cars.length,openingCount:opener.length,freeDraw:true,pendingVisits:out.length-nPrePending,dependentFinals:2,legacy,maker,relay,swiss,swissCups,swissFieldCars:Math.min(cars.length,swissCups*16),swissPending:cars.length%16?1:0,lonely,gauntlet,aero,drift,custom,customChampionships:customKeys.length,top3,protectedN,count:out.length,
  historicalSourceVisits:source.visits.length,historicalBronze,protectedHistoricalBronze:protectedExtra,
  secondChanceSources:legalSecondChance.length,championRepresentativeSources:legalChampion.length,
  unverifiedHistorical:true,aliasWarnings:locked.aliasWarnings,driftCars:locked.driftCars,producer:'v8429 original core draw retained + stock-aware class championships'};
 if(!audit.ok)throw Error('Integrated timetable failed its integrity checks: '+problems.slice(0,5).join('; '));
 return {rows:out,audit,opening:[],approvedFormats:opener,first,seed:SEED,gate:['Historical 4+ car knockouts now contain the missing bronze-duel VISIT; actual race results, car eligibility and track routing remain unverified.',
 'Drift Cars Championship uses the approved timed class competition and genuine tracks.',
   'Custom Upgrade groups use verified FH5 stock classes on NEW tournaments; unresolved cars have provisional legacy placements. Existing started tournaments retain their original frozen draws and are not repartitioned. Never downgrade a car.',
 'Swiss Cups now cover the entire live Garage in batches of 16; an incomplete last Cup is marked pending until a full field exists. No official results or draws are activated.',
 'Only eligible full-maker and Lonely Hearts bronze-duel winners can feed Second Chance; the cup itself remains unscheduled until genuine results exist.',
 'Champion of Champions stays after all real full-maker winners and automatic single-car representatives; it is NOT in this candidate schedule.',
 ...(locked.aliasWarnings?['Manufacturer label variants need identity approval before a frozen tournament draw.']:[])]};
}
let last=null,lastSignature='',query='',family='all',page=0;
function space(){const sp=typeof root.rhSpace==='function'?root.rhSpace():null;if(!sp||sp.catalogueKey!=='fh5-catalogue-v1'||!Array.isArray(sp.cars))throw Error('Open your live FH5 Catalogue Space first.');return sp;}
function snapshot(){
 const sp=space(),saved=sp.tet2RaceControlV8397;
 if(saved?.startedAt&&(!Array.isArray(saved.baseCars)||!saved.baseCars.length))throw Error('An existing tournament lacks a frozen roster. No Evil List changes were made; restore the matching backup or obtain a safe migration.');
 const cars=Array.isArray(saved?.baseCars)&&saved.baseCars.length?saved.baseCars:sp.cars;
 const sig=cars.map(c=>[c.id,c.make,c.classType,c.performanceClass].map(clean).join(':')).join('|')+'|POLICY:'+String(root.TET2StockClass429?.stockGroupingEnabled?.()||false);
 if(!last||sig!==lastSignature){last=build(cars,root.TET2R1StageInventory366,root.rhEvil2Rules181,root.TET2OpeningCoverage365,root.TET2Workloads368,root.TET2LockedWorkloads379);lastSignature=sig;page=0;}
 if(!saved?.baseCars)return last;
 // Incomplete Swiss cup visits already exist at the schedule tail. They can
 // become playable when newly acquired cars complete a 16-car field, without
 // inserting, renumbering or redrawing ANY existing slot.
 const readyCups=Math.floor(sp.cars.length/16),baselineCups=Math.floor(saved.baseCars.length/16);
 if(readyCups<=baselineCups)return last;
 const rows=last.rows.map(r=>{
  const cup=/^T2-SWISS-(\d+)$/.exec(r.eventId||'');
  if(!r.pending||!cup||+cup[1]>readyCups)return r;
  const n=r.visit;
  return {...r,pending:false,workload:n<=4?8:n===5?4:n===6?2:1};
 });
 return {...last,rows,audit:{...last.audit,swissPending:rows.filter(x=>x.pending).length/8}};
}
function list(d){const q=query.trim().toLowerCase(),subset=d.rows.filter(x=>(family==='all'||x.family===family)&&(!q||[x.name,x.family,x.mode,x.stage,x.eventId].join(' ').toLowerCase().includes(q)));
 const pages=Math.max(1,Math.ceil(subset.length/MAX));page=Math.min(pages-1,Math.max(0,page));const current=subset.slice(page*MAX,(page+1)*MAX);
 const items=current.map(x=>`<li class="t2-s371-item"><div class="t2-s371-heading"><span class="t2-s371-id">PLAN ${String(x.position).padStart(4,'0')}</span>${x.opening?'<span class="t2-s371-badge">OPENING</span>':''}${x.tail?'<span class="t2-s371-badge t2-s371-last">SOURCE TAIL</span>':''}</div><strong>${ESC(x.name)}</strong><small>${ESC(x.family)} · ${ESC(x.mode)} · ${ESC(x.stage)}</small><small class="t2-s371-hint">${x.origin==='historical'?'Historical programme reference — rules audit pending':x.origin==='gauntlet'?'8-car batch · three routes / car':x.origin==='aerodromo'?'16-car batch · Drag → Long Jump':x.origin==='maker-knockout'||x.origin==='lonely'?'Knockout stage · bronze before final':x.origin==='swiss'?'Original Swiss stage + required bronze duel':x.origin==='relay'?'Relay group · native team ladder':x.origin==='drift'?'Existing Drift Cars Championship':x.origin==='custom-upgrade'?'Timed class championship · original stock class verified where available':'Official race stage'}</small></li>`).join('');
 const pager=`<button type="button" data-t2-s371="prev" ${page===0?'disabled':''}>◀ Previous</button><span>Page ${page+1} / ${pages}</span><button type="button" data-t2-s371="next" ${page===pages-1?'disabled':''}>Next ▶</button>`;
 return {items:items||'<li class="t2-empty">No matching scheduled stages.</li>',pager,count:`${num(subset.length)} matches · ${subset.length?(page*MAX+1)+'–'+Math.min(subset.length,(page+1)*MAX):'0'} shown`};
}
function html(){try{const d=snapshot(),a=d.audit,v=list(d),families=[...new Set(d.rows.map(x=>x.family))].sort();
 return `<div class="t2-s371-warning"><strong>APPROVED REAL EVIL LIST — SEE RACE CONTROL FOR CURRENT SLOT.</strong><br>Original real-tournament shuffle preserved, plus stock-aware Custom Upgrade Championships across the core. Each competition retains its original round order, bronze before final, and protected source finale near the end. Official racing uses this order through Race Control.</div>
 <div class="t2-s371-summary"><span><strong>${num(a.count)}</strong><small>Real scheduled visits</small></span><span><strong>${a.openingCount}/10</strong><small>Verified format types</small></span><span><strong>${num(a.gauntlet)}</strong><small>Unified Gauntlet batches</small></span><span><strong>${num(a.aero)}</strong><small>Drag + Jump batches</small></span><span><strong>${num(a.custom)}</strong><small>Custom Upgrade visits · ${a.customChampionships} championships</small></span></div>
 <div class="t2-s371-audit">Integrity: <strong>${a.ok?'✓ PASS':'✖ STOP'}</strong> · ${num(a.owned)} live cars · ${num(a.legacy)} historical visits · ${num(a.maker)} maker knockout visits · ${num(a.relay)} Relay group visits · ${a.swiss} Swiss visits · ${a.lonely} Lonely Hearts visits · 1 Drift Championship · ${a.custom} Custom Upgrade visits · ${a.protectedN} protected source-tail visits.</div>
 <p class="t2-s371-nfinal"><strong>Two dependent competitions are not being fabricated:</strong> Second Chance (qualifiers from actual eligible bronze duels, no field cap) and Champion of Champions (absolute finale). Their future slot workloads are NOT included in ${num(a.count)}.</p>
 <div class="t2-s371-controls"><label>Find a competition<input id="t2-s371-search" type="search" placeholder="BMW, Swiss, Gauntlet…" value="${ESC(query)}" autocomplete="off"></label><label>Family<select id="t2-s371-family"><option value="all">All families</option>${families.map(f=>`<option value="${ESC(f)}" ${f===family?'selected':''}>${ESC(f)}</option>`).join('')}</select></label></div>
 <p class="t2-s371-count" id="t2-s371-count">${v.count}</p><ol class="t2-s371-rows" id="t2-s371-rows">${v.items}</ol><div class="t2-s371-pager" id="t2-s371-pager">${v.pager}</div>
 <details class="t2-s371-gates"><summary>Before Slot 001 is allowed — remaining integration gates</summary><ul>${d.gate.map(s=>`<li>${ESC(s)}</li>`).join('')}</ul><p>The Evil List and tracks are frozen at the first actual draw. Eligible new Garage cars may enter future compatible draws; already-locked draws never change.</p></details>`;
 }catch(e){return `<div class="t2-s371-warning" role="alert">SAFE STOP: combined schedule unavailable. ${ESC(e.message)}</div>`;}}
function refresh(){try{const d=snapshot(),v=list(d),r=document.getElementById('t2-s371-rows'),p=document.getElementById('t2-s371-pager'),c=document.getElementById('t2-s371-count');if(r&&p&&c){r.innerHTML=v.items;p.innerHTML=v.pager;c.textContent=v.count;}}catch(e){const c=document.getElementById('t2-s371-count');if(c)c.textContent='Unavailable: '+e.message;}}
function action(e){const btn=e.target?.closest?.('[data-t2-s371]');if(!btn)return false;page+=btn.dataset.t2S371==='next'?1:-1;refresh();return true;}
function input(e){if(e.target?.id!=='t2-s371-search')return false;query=String(e.target.value||'').slice(0,100);page=0;refresh();return true;}
function change(e){if(e.target?.id!=='t2-s371-family')return false;family=e.target.value||'all';page=0;refresh();return true;}
return Object.freeze({build,snapshot,baselineSnapshot:()=>{snapshot();return last;},html,action,input,change,seed:SEED});
});
