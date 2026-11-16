/* OTG! MAIN 8.0.314 — ONE-TIME, explicitly consented COMPLETE racing reset.
 * Safety: downloaded full ORIGINAL save + active/progress vault state, cold verified
 * before ANY write. Keep Garage, Spaces, custom/league definitions and private art.
 * Restart real TET2.0 at stage 001 with seeded shuffle of independent competition
 * families, preserving strict original-source and native Relay/Lonely dependencies.
 * NOTHING runs upon loading this script or installing the release.
 */
(()=>{'use strict';
const SAVE='RaceHub_Studio_Final_v5_6',DB='OTG_Evil2_CampaignVault_v1',STORE='drafts',ACTIVE='active-campaign',PROGRESS='active-stage-progress-v8312';
const BACKUP='pre-total-racing-reset-v8314',RECEIPT='total-racing-reset-receipt-v8314',CAM='evil2-native-slot-launch-20261114',ID='otg-total-reset-v8314';
const X=o=>JSON.parse(JSON.stringify(o)),S=x=>String(x??''),E=x=>S(x).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const fail=m=>{throw Error(m)},asArray=x=>Array.isArray(x)?x:[];
const hash=async s=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))),b=>b.toString(16).padStart(2,'0')).join('');
let report=null,backed=false,busy=false,committed=false;
const rng=seed=>{let s=seed>>>0;return()=>{s=(s+0x6d2b79f5)>>>0;let a=s;a=Math.imul(a^(a>>>15),a|1);a^=a+Math.imul(a^(a>>>7),a|61);return((a^(a>>>14))>>>0)/4294967296;};};
function shuffled(a,random){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function seed(){const x=new Uint32Array(1);crypto.getRandomValues(x);return x[0]||194732941;}
function draw(rows,drawSeed){
 if(rows?.length!==2225||!Number.isSafeInteger(drawSeed)||drawSeed<=0)fail('Verified 2,225-stage source and a secure shuffle seed required');
 const original=rows.filter(r=>r.kind==='EXISTING'),extra=rows.filter(r=>r.kind!=='EXISTING');
 if(original.length!==1219||original.some((r,i)=>r.originalSlot!==i+1)||!original.slice(-7).every(r=>/hubbs/i.test(S(r.name))))fail('Source order or seven fixed Hubbs finale stages invalid');
 const encore=original.slice(-7),main=original.slice(0,-7),random=rng(drawSeed);
 const relay=extra.filter(r=>r.action==='NEW_RELAY');
 const lonely=extra.filter(r=>r.action==='RESTORED_LONELY');
 const jumps=extra.filter(r=>r.action==='LONG_JUMP');
 const independent=extra.filter(r=>!['NEW_RELAY','RESTORED_LONELY','LONG_JUMP'].includes(r.action));
 if(relay.length!==98||lonely.length!==9||jumps.length!==704||independent.length!==extra.length-relay.length-lonely.length-jumps.length)fail('Dependent format families changed; shuffling stopped');
 if(independent.some(r=>!['RESTORED_ARCHIVE','NEW_MAKE','NEW_GAUNTLET'].includes(r.action)))fail('Unknown independent format; do not shuffle');
 // Strict dependencies inside these TWO streams: bracket group A–F before
 // Stage 2 A/B, then Final; relay Round 1 groups before later winners/rounds.
 const streams=[main.slice(),shuffled(independent,random),shuffled(jumps,random),lonely.slice(),relay.slice()];
 // Force a random independent stage into the first position so every restart
 // visibly differs from the alphabetically named original source slot 001.
 const starters=[1,2].filter(i=>streams[i].length);const firstStream=starters[Math.floor(random()*starters.length)];
 const output=[streams[firstStream].shift()];let lastStream=firstStream,streak=1;
 while(streams.some(a=>a.length)){
  const live=streams.map((a,i)=>({a,i})).filter(z=>z.a.length);
  const total=live.reduce((n,z)=>n+z.a.length,0);
  let options=live.filter(z=>!(z.i===lastStream&&streak>=3));if(!options.length)options=live;
  const weight=options.reduce((n,z)=>n+z.a.length,0);let v=random()*weight,choice=options.at(-1);
  for(const z of options){v-=z.a.length;if(v<0){choice=z;break;}}
  output.push(choice.a.shift());if(choice.i===lastStream)streak++;else{lastStream=choice.i;streak=1;}
 }
 output.push(...encore);
 const ids=output.map(r=>r.id),input=rows.map(r=>r.id),inputSet=new Set(input);
 if(ids.length!==2225||new Set(ids).size!==2225||inputSet.size!==2225||ids.some(id=>!inputSet.has(id)))fail('Shuffle lost or duplicated stage');
 const order=output.filter(r=>r.kind==='EXISTING');if(order.some((r,i)=>r.id!==original[i].id))fail('Original-native progression order damaged');
 if(output.filter(r=>r.action==='NEW_RELAY').some((r,i)=>r.id!==relay[i].id))fail('Relay native round dependencies damaged');
 if(output.filter(r=>r.action==='RESTORED_LONELY').some((r,i)=>r.id!==lonely[i].id))fail('Lonely Hearts dependency order damaged');
 if(output.at(0).id===original[0].id)fail('Alphabetical starting order survived; draw refused');
 return{seed:drawSeed,ids,first:output.slice(0,12).map(r=>({name:r.name,action:r.action})),method:'SEEDED_FISHER_YATES_INDEPENDENT_FAMILIES_PLUS_DEPENDENCY_INTERLEAVE',independent:independent.length,jumps:jumps.length,originals:original.length,relay:relay.length,lonely:lonely.length};
}
function nativeState(){const s=typeof state!=='undefined'&&state?.spaces?state:window.state;if(!s?.spaces?.length)fail('Live OTG! save not available');return s;}
function stored(){const raw=localStorage.getItem(SAVE);if(!raw)fail('Real OTG! save missing');let data;try{data=JSON.parse(raw);}catch(_){fail('Saved OTG! data damaged');}if(!Array.isArray(data.spaces)||!data.spaces.length)fail('Spaces missing');return{raw,data};}
function fh5(st){const matches=st.spaces.filter(s=>s.catalogueKey==='fh5-catalogue-v1');if(matches.length!==1||!matches[0].id)fail('Exactly one real FH5 catalogue Space required');return matches[0];}
const openDb=()=>new Promise((yes,no)=>{const q=indexedDB.open(DB,1);q.onsuccess=()=>yes(q.result);q.onerror=()=>no(q.error||Error('Evil campaign vault unavailable'));q.onblocked=()=>no(Error('Vault blocked'));});
const get=(db,id)=>new Promise((yes,no)=>{const q=db.transaction(STORE,'readonly').objectStore(STORE).get(id);q.onsuccess=()=>yes(q.result||null);q.onerror=()=>no(q.error||Error('Vault cold-read failed'));});
function putAll(db,records){return new Promise((yes,no)=>{const tx=db.transaction(STORE,'readwrite');for(const item of records)tx.objectStore(STORE).put(item);tx.oncomplete=yes;tx.onabort=()=>no(tx.error||Error('Vault atomic write aborted'));tx.onerror=()=>no(tx.error||Error('Vault atomic write failed'));});}
function blankEvent(orig){const v=X(orig);v.results=[];v.status='setup';
 for(const k of ['completedAt','abandonedAt','championId','championCarId','winnerId','winnerCarId','finishedAt','startedAt','currentRound','currentRoundIndex','lastResultId','trophyAwardedAt','honours','medals','standings','history','raceHistory','resultHistory','v8Swiss','v8Groups','v8Knockout','v8KO'])delete v[k];
 function rounds(r){return asArray(r).map(src=>{const z=X(src);for(const k of ['results','result','winnerId','winnerCarId','championCarId','completedAt','startedAt','finishedAt','scores','standings'])delete z[k];if(Array.isArray(z.matches))z.matches=z.matches.map(m=>{const a=X(m);for(const k of ['resultA','resultB','timeA','timeB','scoreA','scoreB','winnerId','winnerCarId','loserCarId','completedAt','finishedAt'])delete a[k];if(a.status)a.status='setup';return a;});if(z.status)z.status='setup';return z;});}
 v.rounds=rounds(v.rounds);if(Array.isArray(v.frozenRounds))v.frozenRounds=rounds(v.frozenRounds);return v;}
const LISTS=['runs','raceOffs','legacyResults','results','history','recordHistory','raceHistory','resultHistory','recordBookExclusions','recordExclusions','resultAudit8080','racingHistory','raceResults','trackRecordHistory','carRaceHistory'];
const DERIVED=['stats','racingStats','trackUsage','trackRecords','hallOfFame','honoursHistory','medalHistory','records','recordBook','manufacturerMedals','carMedals','trackBestTimes','trackRecordBook','leaderboards','raceStats','competitionHistory','honours','medals','trophyHistory','careerStats'];
const EVIL=['evilCampaign8076','evilCampaignR18098','fh5TrackBags8070','evil2Mixed260','evil2NativeRun8250','evil2NewFormats8256','evil2Honours8257','evil2Specialist8259','evil2Restored8261','evil2Swiss8262'];
const RESERVED=new Set(['evilHallOfShame8147','evilHallRewards8152','evilSecretSideMissions8163','evilConeBreaks8164','championshipDiscoveries','evilIncidentArchive8177','privateIncidents']);
function counts(st){return st.spaces.map(sp=>({name:sp.name||sp.id,cars:asArray(sp.cars).length,runs:asArray(sp.runs).length,raceOffs:asArray(sp.raceOffs).length,customResults:asArray(sp.customEvents).reduce((n,e)=>n+asArray(e.results).length,0),leagueResults:asArray(sp.leagues).reduce((n,l)=>n+asArray(l.events).reduce((m,e)=>m+asArray(e.results).length,0),0),evilLedgers:EVIL.filter(k=>Object.hasOwn(sp,k)&&sp[k]).length}));}
function clear(doc,seedValue){const src=X(doc),n=X(doc),before=counts(src),after=[];
 for(const sp of n.spaces){const old=src.spaces.find(s=>s.id===sp.id);if(!old)fail('Space ID changed');
  for(const k of LISTS)if(Array.isArray(sp[k]))sp[k]=[];
  for(const k of DERIVED)if(Object.hasOwn(sp,k))delete sp[k];
  for(const k of EVIL)delete sp[k];
  if(Array.isArray(sp.customEvents))sp.customEvents=sp.customEvents.map(blankEvent);
  if(Array.isArray(sp.leagues))sp.leagues=sp.leagues.map(l=>{const p=X(l);if(p.status)p.status='setup';delete p.completedAt;delete p.startedAt;delete p.standings;delete p.championId;delete p.championCarId;p.events=asArray(p.events).map(e=>{const v=X(e);v.results=[];v.resultsConfirmed=false;v.status='planned';for(const k of ['confirmedAt','completedAt','startedAt','winnerId','winnerCarId','standings','pointsAwarded','finishedAt'])delete v[k];return v;});return p;});
  if(sp.catalogueKey==='fh5-catalogue-v1')sp.evil2RandomSeed8314=seedValue;
  if(JSON.stringify(sp.cars)!==JSON.stringify(old.cars)||JSON.stringify(sp.catalogueOwned)!==JSON.stringify(old.catalogueOwned)||JSON.stringify(sp.backups)!==JSON.stringify(old.backups))fail('Garage / ownership / backups would change');
  for(const k of RESERVED)if(JSON.stringify(sp[k])!==JSON.stringify(old[k]))fail('Private archive / rewards would change: '+k);
  for(const k of EVIL)if(Object.hasOwn(sp,k))fail('Old tournament engine state survived');
  for(const k of LISTS)if(Array.isArray(sp[k])&&sp[k].length)fail('Result list not cleared: '+k);
  for(const k of DERIVED)if(Object.hasOwn(sp,k))fail('Derived racing stats not cleared: '+k);
  if(asArray(sp.customEvents).some(e=>e.results?.length||e.status==='complete')||asArray(sp.leagues).some(l=>asArray(l.events).some(e=>e.results?.length||e.resultsConfirmed)))fail('Old custom or league results survived');
  after.push(sp.id);
 }
 for(const k of LISTS)if(Array.isArray(n[k]))n[k]=[];
 for(const k of DERIVED)if(Object.hasOwn(n,k))delete n[k];
 if(n.spaces.length!==src.spaces.length||n.spaces.some((s,i)=>s.id!==src.spaces[i].id))fail('Space order/identity changed');
 if(JSON.stringify(n.settings)!==JSON.stringify(src.settings)||JSON.stringify(n.driverName)!==JSON.stringify(src.driverName))fail('Settings changed');
 return{next:n,before,after};
}
const kv=()=>Object.keys(localStorage).filter(k=>/^otg\.evil2\.relay\.qa\.v1:/.test(k)).map(k=>[k,localStorage.getItem(k)]);
async function preview(){
 if(localStorage.getItem('otg.idb.primary.pilot8279')==='yes')fail('Exit isolated IndexedDB pilot first');
 if(typeof window.rhSave!=='function'||!window.crypto?.subtle)fail('Original save or secure hash unavailable');
 const {raw,data}=stored(),live=nativeState(),sf=fh5(data),lf=fh5(live);
 if(String(data.activeSpaceId)!==String(sf.id)||String(live.activeSpaceId)!==String(sf.id)||String(lf.id)!==String(sf.id))fail('Select your saved real FH5 Space first');
 if(JSON.stringify(data.spaces)!==JSON.stringify(live.spaces))fail('Unsaved live Space edits detected. Save/reopen before resetting');
 const oldPlan=await window.otgEvilRoute8306?.inspect?.();if(!oldPlan?.active||oldPlan.rows?.length!==2225||oldPlan.sha256?.length!==64)fail('Verified active 2,225-stage draw missing');
 const oldProgress=await window.otgEvilLiveProgress8312.inspect(oldPlan);
 const db=await openDb();let active,progress,done;try{[active,progress,done]=await Promise.all([get(db,ACTIVE),get(db,PROGRESS),get(db,RECEIPT)]);}finally{db.close();}
 if(done)fail('This complete reset has already been committed. A second reset is deliberately blocked.');
 if(!active||active.mode!=='LIVE_EVIL2'||!active.active||active.drawSha256!==oldPlan.sha256||String(active.spaceId)!==String(sf.id))fail('Live campaign vault does not match FH5 Space');
 if(progress&&(!Array.isArray(progress.done)||progress.done.length!==oldProgress.completed||progress.drawSha256!==active.drawSha256))fail('Progress ledger does not match the live campaign');
 const drawSeed=seed(),newDraw=draw(oldPlan.rows,drawSeed),washed=clear(data,drawSeed);
 const activeNew={...X(active),seed:drawSeed,ids:newDraw.ids,stageOneId:newDraw.ids[0],stageOneName:newDraw.first[0].name,relaunchedAt:new Date().toISOString(),drawMethod:newDraw.method};
 activeNew.drawSha256=await hash(JSON.stringify({sourceSha256:activeNew.sourceSha256,candidateSha256:activeNew.candidateSha256,scheduleSha256:activeNew.scheduleSha256,seed:activeNew.seed,ids:activeNew.ids,stageOneId:activeNew.stageOneId}));
 const progressNew={id:PROGRESS,schema:1,campaign:CAM,spaceId:String(sf.id),drawSha256:activeNew.drawSha256,done:[]};
 if(activeNew.drawSha256===active.drawSha256||activeNew.stageOneId===active.stageOneId&&activeNew.ids.every((v,i)=>v===active.ids[i]))fail('New draw did not differ from old');
 if(localStorage.getItem(SAVE)!==raw)fail('Saved racing data changed during audit');
 return{raw,sha:await hash(raw),state:data,cleaned:washed.next,counts:washed.before,oldPlan,oldProgress,active,progress,newDraw,activeNew,progressNew,kv:kv(),spaceId:sf.id};
}
function download(filename,text){const url=URL.createObjectURL(new Blob([text],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();setTimeout(()=>{a.remove();URL.revokeObjectURL(url);},15000);}
function backupPayload(r){return JSON.stringify({type:'OTG_COMPLETE_PRE_RESET_BACKUP',version:'8.0.314',savedAt:new Date().toISOString(),sourceSha256:r.sha,drawSha256:r.active.drawSha256,sourceSave:r.state,activeCampaign:r.active,activeStageProgress:r.progress,extraLocalStorage:r.kv},null,2);}
async function backup(){if(!report)fail('Run the safe audit first');if(localStorage.getItem(SAVE)!==report.raw)fail('Save changed: run audit again');
 const db=await openDb();try{const prior=await get(db,BACKUP);if(prior&&prior.originalSha!==report.sha)fail('Different backup already exists. No overwrite.');
  const entry={id:BACKUP,createdAt:new Date().toISOString(),originalSha:report.sha,originalRaw:report.raw,active:report.active,progress:report.progress,extraLocalStorage:report.kv};
  await putAll(db,[entry]);const cold=await get(db,BACKUP);if(!cold||cold.originalSha!==report.sha||await hash(cold.originalRaw)!==report.sha||cold.active?.drawSha256!==report.active.drawSha256)fail('Backup cold verification failed');
 }finally{db.close();}
 const file='OTG_BEFORE_FULL_RESET_'+new Date().toISOString().replace(/[:.]/g,'-')+'.json';download(file,backupPayload(report));backed=true;return '✓ ORIGINAL DATA BACKED UP AND COLD VERIFIED. Download requested: '+file+'\nSAVE THE FILE OUTSIDE THE PHONE BEFORE RESET. No racing data changed yet.';
}
function replaceLive(newState){const live=nativeState();for(const k of Object.keys(live))delete live[k];Object.assign(live,X(newState));window.rhSave();}
async function commit(){if(!report||!backed)fail('Audit and externally save full backup first');const input=document.getElementById('otg-reset314-consent');if(S(input?.value).trim()!=='DELETE ALL RACING')fail('Enter DELETE ALL RACING exactly');
 if(!window.confirm('FINAL IRREVERSIBLE ACTION ON THIS DEVICE: delete ALL historical results including Abarth Stage 001, clear stats/Hall of Fame/track use across every Space, and RESTART Evil 2.0 at stage 001 with a different shuffle. Garage, Spaces and private archive stay. Are you certain?'))return 'CANCELLED — NOTHING CHANGED';
 const original=report;if(localStorage.getItem(SAVE)!==original.raw)fail('Results changed since backup; audit again');
 const db=await openDb();try{const b=await get(db,BACKUP);if(!b||b.originalSha!==original.sha||await hash(b.originalRaw)!==original.sha)fail('External backup not verified in campaign vault');
  const nowActive=await get(db,ACTIVE),nowProgress=await get(db,PROGRESS);if(nowActive?.drawSha256!==original.active.drawSha256||JSON.stringify(nowProgress)!==JSON.stringify(original.progress))fail('Progress or active draw changed; audit again');
 }finally{db.close();}
 let saved=false,vaultChanged=false;
 try{
  replaceLive(original.cleaned);saved=true;
  const cold=stored();if(JSON.stringify(cold.data)!==JSON.stringify(original.cleaned))fail('Native save differs from expected complete reset');
  for(const s of cold.data.spaces)if(asArray(s.runs).length||asArray(s.raceOffs).length||asArray(s.customEvents).some(e=>e.results?.length)||asArray(s.leagues).some(l=>asArray(l.events).some(e=>e.results?.length)))fail('Old racing results survived the cold read');
  const db2=await openDb();try{await putAll(db2,[original.activeNew,original.progressNew]);vaultChanged=true;
    const a=await get(db2,ACTIVE),p=await get(db2,PROGRESS);if(a?.drawSha256!==original.activeNew.drawSha256||p?.drawSha256!==a.drawSha256||p?.done?.length!==0)fail('Relaunched campaign/progression cold read failed');
  }finally{db2.close();}
  for(const [k] of original.kv)localStorage.removeItem(k);
  // Independently compile the newly signed draw AND verify no legacy run survives.
  const fresh=await window.otgEvilRoute8306.inspect(),g=await window.otgEvilLiveProgress8312.inspect(fresh);
  if(!fresh.active||fresh.sha256!==original.activeNew.drawSha256||fresh.rows.length!==2225||fresh.rows[0].id!==original.activeNew.stageOneId||g.completed!==0||g.next.position!==1)fail('Rebuilt official order could not be cold verified');
  const receipt={id:RECEIPT,committedAt:new Date().toISOString(),oldSha:original.sha,newSaveSha:await hash(localStorage.getItem(SAVE)),oldDrawSha:original.active.drawSha256,newDrawSha:fresh.sha256,seed:original.newDraw.seed,spaceId:original.spaceId,first:fresh.rows[0].name,removed:original.counts};
  const d=await openDb();try{await putAll(d,[receipt]);if((await get(d,RECEIPT))?.newDrawSha!==fresh.sha256)fail('Reset receipt write verification failed');}finally{d.close();}
  committed=true;report=null;backed=false;
  setTimeout(()=>window.location.reload(),1400);
  return '✓ FULL RESET VERIFIED. ALL OLD RACING TIMES, HOF AND HISTORY REMOVED FROM NATIVE RESULT STORES. 0/2,225 stages DONE; Stage 001 is now '+fresh.rows[0].name+'. The app will reload to rebuild the visible statistics. Keep the downloaded backup.';
 }catch(err){
  let rollback='';try{
    for(const [k,v] of original.kv)localStorage.setItem(k,v);
    const db3=await openDb();try{if(vaultChanged)await putAll(db3,[original.active,original.progress||{id:PROGRESS,schema:1,campaign:CAM,spaceId:String(original.spaceId),drawSha256:original.active.drawSha256,done:[]}]);}finally{db3.close();}
    if(saved){replaceLive(original.state);localStorage.setItem(SAVE,original.raw);}
    rollback='ORIGINAL SAVE AND CAMPAIGN RESTORED.';
  }catch(rescue){rollback='CRITICAL: rollback could not be fully verified ('+S(rescue.message)+'). STOP RACING. Protected original backup remains in IndexedDB.';}
  fail('RESET DID NOT PASS VERIFICATION — '+rollback+' Original error: '+S(err.message||err));
 }
}
function panel(){let p=document.getElementById(ID);if(!p){p=document.createElement('section');p.id=ID;p.hidden=true;p.style.cssText='position:fixed;z-index:9450;inset:0;background:#06121d;color:#eefbff;overflow:auto;padding:18px 12px 80px;font-family:system-ui';document.body.appendChild(p);p.addEventListener('click',clicked);}return p;}
function btn(a,s,enabled=true){return'<button type="button" data-reset314="'+a+'" '+(enabled?'':'disabled')+' style="display:block;width:100%;padding:14px;margin:12px 0;border-radius:12px;background:#164557;border:1px solid #49a0b7;color:white;font-weight:800;font-size:17px">'+s+'</button>';}
function render(msg=''){const p=panel();let h='<div style="max-width:690px;margin:auto">'+btn('close','← BACK TO HEADQUARTERS')+'<h1>🧨 COMPLETE RACING RESTART</h1><p><b>DELETE EVERYTHING RACE-RESULT RELATED, INCLUDING TODAY’S ABARTH STAGE 001.</b> Wipe all Spaces’ saved times, Race Offs, League and custom-event results, historical stats, HOF/medals, record books, track use and tournament ledgers. Restart TET 2.0 from a new Stage 001 using a different seeded draw.</p><p style="color:#b3f1e7"><b>Protected:</b> all Garage car and ownership data, all Space containers, event and League definitions, mechanics, settings, safety backups, private Jones Mob Incident Archive, pictures and discoveries.</p><p style="color:#facc91"><b>Important:</b> some original source visits MUST remain in relative order because their native event engines depend on previous visits. Independent competitions and Long Jump order will be genuinely shuffled, and Lonely Hearts/first-group entrants randomised from a fixed seed. There will be no automatic changes from installing this update.</p>';
 if(report){const r=report;h+='<div style="border:1px solid #3d9caa;padding:14px;border-radius:13px"><b>AUDIT — NO WRITES</b><p>Old sealed completions: '+r.oldProgress.completed+'. Next new Stage 001: <b>'+E(r.newDraw.first[0].name)+'</b>.</p><p>New first 12: '+r.newDraw.first.map((v,i)=>(i+1)+'. '+E(v.name)).join('<br>')+'</p><p>Fresh shuffle seed: '+r.newDraw.seed+'. Independent extra stages shuffled: '+r.newDraw.independent+'; individual Long Jump slots shuffled: '+r.newDraw.jumps+'. Original native/Relay/Lonely dependencies protected.</p>'+r.counts.map(c=>'<p>'+E(c.name)+': '+c.runs+' runs, '+c.raceOffs+' Race Offs, '+c.customResults+' custom results, '+c.leagueResults+' League results, '+c.evilLedgers+' old Evil ledgers identified.</p>').join('')+'</div>';
 h+=btn('backup',backed?'⬇ DOWNLOAD VERIFIED BACKUP AGAIN':'⬇ CREATE + VERIFY + DOWNLOAD COMPLETE BACKUP');
 h+='<label style="display:block;margin:15px 0"><b>After saving that file outside your phone, type DELETE ALL RACING:</b><input id="otg-reset314-consent" autocomplete="off" placeholder="DELETE ALL RACING" style="display:block;width:100%;margin-top:9px;padding:14px;border-radius:9px;border:1px solid #45879b;background:#142c3b;color:white"></label>';
 h+=btn('commit','🧨 DELETE ALL RESULTS AND RELAUNCH THE RANDOMISED TOURNAMENT',backed);
 }else h+=btn('audit','🔍 AUDIT COMPLETE RESET + PREVIEW NEW DRAW · READ ONLY');
 if(msg)h+='<p role="status" style="white-space:pre-wrap;border:1px solid #47869a;border-radius:11px;padding:13px">'+E(msg)+'</p>';h+='</div>';p.innerHTML=h;}
function open(){report=null;backed=false;committed=false;panel().hidden=false;render('Ready. Nothing has changed.');}
function close(){if(busy)return;panel().hidden=true;report=null;backed=false;}
async function clicked(e){const b=e.target.closest('button[data-reset314]');if(!b)return;const action=b.dataset.reset314;if(action==='close'){close();return;}if(busy)return;busy=true;b.disabled=true;let message='';try{
 if(action==='audit'){report=await preview();backed=false;message='✓ SOURCE DATA AUDITED. NEW SHUFFLED DRAW PREVIEW IS READY. Nothing changed.';}
 else if(action==='backup')message=await backup();
 else if(action==='commit')message=await commit();
 }catch(err){if(action==='audit'){report=null;backed=false;}message='⛔ SAFE STOP — '+S(err.message||err);}
 finally{busy=false;render(message);}
}
window.otgEvilTotalRestart8314=Object.freeze({open,draw,clear,version:'8.0.314'});
})();
