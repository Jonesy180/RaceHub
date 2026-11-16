/* OTG! 8.0.262 — source-exact playable archived Manufacturer and Lonely Hearts.
 * Only real native OTG Race Off / Festival result entry, no alternate stopwatch.
 * Original Evil 1 and existing R1 results remain unchanged; no medals, reset or launch.
 */
(()=>{'use strict';
const CAM='evil2-native-slot-launch-20261114',KEY='evil2Restored8261',TAG='RESTORED_8261',ID='otg-e2-restored-8261';
const S=v=>String(v??'').trim(),E=v=>S(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const iso=()=>new Date().toISOString(),dup=v=>JSON.parse(JSON.stringify(v)),fail=m=>{throw Error(m);};
function live(){const st=typeof state!=='undefined'&&state?.spaces?state:window.state;if(!st?.spaces?.length)fail('Live OTG Spaces not accessible.');return st;}
const rid=k=>window.rhId?.(k)||('e2restored-'+k+'-'+Date.now()+'-'+Math.random().toString(36).slice(2));
function space(){const x=window.rhSpace?.();if(!x||x.catalogueKey!=='fh5-catalogue-v1'||!x.id||!Array.isArray(x.cars))fail('Select real FH5 Space with owned Garage first.');return x;}
function owned(x){const ids=new Map();for(const c of x.cars){const id=S(c.id);if(!id||ids.has(id))fail('Duplicate/missing Garage car identity.');ids.set(id,c);}return ids;}
function src(){const d=window.rhEvilCampaignData8076;if(!Array.isArray(d?.slots)||d.slots.length<700)fail('Original 708-visit Evil 1 source unavailable.');return d.slots;}
function saved(x){const b=x[KEY];if(b&&(b.schema!==1||b.campaign!==CAM||b.spaceId!==S(x.id)||!b.stages||typeof b.stages!=='object'||Array.isArray(b.stages)))fail('Restored native stage registry differs from this FH5 Space. No overwrite.');return b||null;}
function initBook(x){let b=saved(x);if(!b){b={schema:1,campaign:CAM,spaceId:S(x.id),createdAt:iso(),stages:{},lonelyField:null};x[KEY]=b;}return b;}
let deltaCache=null;

function resetShuffle(list,x,salt){const seed=Number(x?.evil2RandomSeed8314);if(!Number.isSafeInteger(seed)||seed<=0)return list;let s=(seed^0x9e3779b9)>>>0;for(const ch of String(salt))s=Math.imul(s^ch.charCodeAt(0),16777619)>>>0;const rnd=()=>{s=(s+0x6d2b79f5)>>>0;let a=s;a=Math.imul(a^(a>>>15),a|1);a^=a+Math.imul(a^(a>>>7),a|61);return((a^(a>>>14))>>>0)/4294967296};for(let i=list.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[list[i],list[j]]=[list[j],list[i]];}return list;}
function safeDelta(st){
 const x=space(),garage=owned(x),identity=S(x.id)+'|'+S(st.activeSpaceId)+'|'+S(x.evil2RandomSeed8314)+'|'+[...garage.values()].map(c=>S(c.id)+':'+S(c.make)).join('|');
 if(deltaCache?.identity===identity)return deltaCache.value;
 const makes=new Map();for(const c of garage.values()){const make=S(c.make);if(!make)fail('Lonely Hearts car has no catalogue manufacturer.');if(!makes.has(make))makes.set(make,[]);makes.get(make).push(c);}
 const lone=resetShuffle([...makes].filter(([,cs])=>cs.length===1).sort((a,b)=>a[0].localeCompare(b[0],'en-GB')),x,'LONELY-MAKER-GROUPS');if(lone.length<12)fail('Not enough single-car manufacturers for six source groups.');
 const old=src().filter(v=>v.family==='Lonely Hearts'&&/Lonely Hearts Cup/.test(S(v.event)));if(old.length!==9)fail('Original Lonely Hearts template does not contain nine visits.');
 const stages=[];for(let i=0;i<6;i++){const label='ABCDEF'[i],v=old.find(o=>o.event==='Lonely Hearts Cup — Group '+label);if(!v||v.liveFormat!=='MANUAL GROUP')fail('Original Lonely Hearts opening group source missing: '+label);const cars=lone.filter((m,j)=>j%6===i).map(([make,c])=>({make,carId:S(c[0].id)}));if(cars.length<2)fail('Lonely Hearts group has insufficient cars.');stages.push({id:'lonely:group:'+label,name:v.event,oldSourceSlot:Number(v.slot),stage:'OPENING GROUP',cars});}
 for(const label of 'AB'){const v=old.find(o=>o.event==='Lonely Hearts Cup — Stage 2 Group '+label);if(!v||v.liveFormat!=='MANUAL GROUP')fail('Original Lonely Hearts stage-two source missing: '+label);stages.push({id:'lonely:stage2:'+label,name:v.event,oldSourceSlot:Number(v.slot),stage:'SECOND STAGE',cars:[]});}
 const fin=old.find(o=>o.event==='Lonely Hearts Cup — Final');if(!fin||fin.liveFormat!=='MANUAL FINAL')fail('Original Lonely Hearts final source missing.');stages.push({id:'lonely:final',name:fin.event,oldSourceSlot:Number(fin.slot),stage:'FINALS NIGHT',cars:[]});
 const value={lonelyHeartsPreviewGroups:stages};deltaCache={identity,value};return value;
}
function stage(row,st){if(!row||!row.id)fail('Restored stage identity not found.');const garage=owned(space()),id=S(row.id);let format,name,field=[],tracks=[],mode,oldSource=null,kind,groupKey='';
 if(row.kind==='ARCHIVED EXACT SOURCE'){
  const m=/^archive:manufacturer:(festival|race-off):([^:]+):(\d+)$/.exec(id);if(!m)fail('Archive stage has an unrecognised old source identity.');
  const make=decodeURIComponent(m[2]);oldSource=src().find(z=>Number(z.slot)===Number(m[3]));mode=m[1]==='festival'?'Festival':'Race Off';format=mode==='Festival'?'STANDARD':'KNOCKOUT';
  if(!oldSource||S(oldSource.event)!==make||oldSource.mode!==mode||oldSource.family!=='Manufacturer'||oldSource.liveFormat!==format||S(row.name)!==make+' — '+mode)fail('Archived definition does not match its historical source.');
  field=[...garage.values()].filter(c=>S(c.make)===make).map(c=>S(c.id));if(field.length<2)fail('Archived Manufacturer needs at least two owned cars of exact catalogue make '+make+'.');
  kind='ARCHIVE';name=make+' — '+mode;groupKey='archive:'+mode+':'+make;
  if(format==='STANDARD')tracks=pickTracks(oldSource,3);
 }else if(row.kind==='NEW EXACT MAKE THEME'){
  const m=/^newmake:(festival|race-off):(.+)$/.exec(id);
  if(!m)fail('New manufacturer stage does not have a valid exact-catalogue identity.');
  const make=decodeURIComponent(m[2]);mode=m[1]==='festival'?'Festival':'Race Off';
  format=mode==='Festival'?'STANDARD':'KNOCKOUT';
  if(S(row.name)!==make+' — '+mode||row.sourceFormat!==format||row.newRuleSource!=='NEW_EVIL2_TEMPLATE_NOT_HISTORICAL')
   fail('New Evil 2.0 competition template is not authorized by the mixed schedule.');
  field=[...garage.values()].filter(c=>S(c.make)===make).map(c=>S(c.id));
  if(field.length<2)fail('New exact-make competition needs two currently owned cars.');
  kind='NEW_MAKE';name=make+' — '+mode;groupKey='newmake:'+mode+':'+make;
  if(format==='STANDARD')tracks=pickTracks({pool:'ROAD / STREET'},3);
 }else if(row.kind==='LONELY HEARTS — HISTORIC BRACKET'){
  const d=safeDelta(st);
  const q=(d.lonelyHeartsPreviewGroups||[]).find(z=>'lonely:'+z.id===id);if(!q||q.name!==row.name)fail('Unrecognised Lonely Hearts historic bracket stage.');
  oldSource=src().find(z=>Number(z.slot)===q.oldSourceSlot);if(!oldSource||oldSource.event!==row.name||oldSource.family!=='Lonely Hearts'||!['MANUAL GROUP','MANUAL FINAL'].includes(oldSource.liveFormat))fail('Lonely Hearts old round source mismatch.');
  format=oldSource.liveFormat;kind='LONELY';name=row.name;groupKey=q.id;
  if(q.stage==='OPENING GROUP')field=q.cars.map(c=>S(c.carId));
  tracks=oldTracks(oldSource);
 }else fail('This is not a verified archived or Lonely Hearts stage.');
 if(new Set(field).size!==field.length||field.some(c=>!garage.has(c)))fail('A duplicate or no-longer-owned car exists in restored stage field.');
 return{id,kind,name,mode,format,sourceSlot:Number(oldSource?.slot||0),oldId:S(oldSource?.id||''),groupKey,field,tracks,eligibleMake:kind==='ARCHIVE'?S(oldSource.event):kind==='NEW_MAKE'?name.split(' — ')[0]:null,pool:S(oldSource?.pool||'ROAD / STREET'),stage:kind==='NEW_MAKE'?'NEW EVIL 2.0 format · NOT old Evil 1':S(oldSource.doNow)};
}
function legalTracks(){const t=window.rhFH5TrackTaxonomy8067;const a=[...(t?.standardPool?.('ROAD')||[]),...(t?.finalePool?.('ROAD')||[]),...(t?.standardPool?.('OFFROAD')||[])].map(S);if(a.length<5)fail('Official FH5 track taxonomy unavailable.');return new Set(a);}
function oldTracks(s){const list=S(s.track).split(/\s*→\s*/).map(S);if(list.length!==3||new Set(list).size!==3||list.some(n=>!legalTracks().has(n)))fail('Original three-course programme has an unknown track: '+S(s.track));return list;}
function pickTracks(s,n){const cat=/off.road|rally adventure|cross.country/i.test(S(s.pool))?'OFFROAD':'ROAD';const pool=[...new Set((window.rhFH5TrackTaxonomy8067?.standardPool?.(cat)||[]).map(S).filter(Boolean))];if(pool.length<n)fail('Verified FH5 '+cat+' routes unavailable.'); // standard legacy RANDOMISE ALL
 for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}return pool.slice(0,n);}
function lonelyPlan(st){const d=safeDelta(st),groups=d.lonelyHeartsPreviewGroups||[];if(groups.length!==9)fail('Exactly 9 historical Lonely Hearts stages required.');const initial=groups.slice(0,6);let all=[];for(const g of initial)all=all.concat(g.cars.map(c=>S(c.carId)));if(new Set(all).size!==all.length)fail('A Lonely Hearts car appears twice.');return{groupFields:initial.map(g=>({id:g.id,ids:g.cars.map(c=>S(c.carId))})),carIds:all};}
function run(x,spec,ids){const rids=ids.slice();if(!rids.length||new Set(rids).size!==rids.length||rids.some(id=>!owned(x).has(id)))fail('Native stage has invalid frozen car field.');
 const now=iso(),value='e2restored:'+spec.id,base={id:rid(spec.format==='KNOCKOUT'?'raceoff':'run'),name:spec.name,type:spec.format==='KNOCKOUT'?'evil2-native-raceoff':'evil2-native',value,createdAt:now,updatedAt:now,evilCampaignR2:{campaign:CAM,source:TAG,stageId:spec.id,oldSourceSlot:spec.sourceSlot,format:spec.format,createdAt:now}};
 if(spec.format==='KNOCKOUT'){
   const make=c=>({sourceCarId:S(c.id),make:S(c.make),model:S(c.model),year:S(c.year),classType:S(c.classType),name:S(window.carName?.(c)||c.name||[c.make,c.model,c.year].filter(Boolean).join(' '))});
   return{...base,status:'prepared',fieldLockedAt:now,entryIds:rids,entrants:rids.map(id=>make(owned(x).get(id))),rounds:[],currentRoundIndex:0,championCarId:null};
 }
 const tracks=spec.tracks.length===3?spec.tracks:pickTracks({pool:spec.pool},3);
 return{...base,trophy:window.rhTrophyTypeKey?.('festival')||'festival',startedAt:now,status:'active',rounds:tracks.map(name=>({id:rid('round'),name,layout:''})),results:[],entries:rids};
}
function points(r,checkPretend=true){const ids=r.entries||[],rounds=r.rounds||[],seen=new Set(),sums=new Map(ids.map(x=>[S(x),0]));
 if(!ids.length||rounds.length!==3||new Set(ids.map(S)).size!==ids.length||new Set(rounds.map(x=>S(x.id))).size!==3)fail('Restored timed championship identity invalid.');
 for(const v of r.results||[]){const id=S(v.carId),round=S(v.roundId),key=id+'|'+round;if(!sums.has(id)||!rounds.some(z=>S(z.id)===round)||seen.has(key)||!Number.isFinite(Number(v.time))||Number(v.time)<=0)fail('Corrupt or duplicated native restored result.');if(checkPretend&&(v.qaPretend||v.pretend))fail('Pretend results cannot count as verified race completion.');seen.add(key);sums.set(id,sums.get(id)+Number(v.time));}
 const full=seen.size===ids.length*3,ranking=full?[...sums].sort((a,b)=>a[1]-b[1]):[];return{saved:seen.size,total:ids.length*3,complete:full,ranking:ranking.map(v=>v[0]),tiedAtCut:full&&(ranking.length>=2&&ranking[0][1]===ranking[1][1]||ranking.length>2&&ranking[1][1]===ranking[2][1]),scores:ranking};
}
function rankFor(x,key){const b=saved(x),row=b?.stages?.[key],r=(x.runs||[]).find(v=>v.id===row?.runId);if(!row?.doneAt||!r)fail('Required previous Lonely Hearts group is not completed.');const p=points(r);if(!p.complete||p.tiedAtCut||p.ranking.length<2)fail('Previous Lonely Hearts qualifying places are unresolved.');return p.ranking;}
function lonelyEntrants(x,spec,st,b){if(spec.groupKey.startsWith('lonely:group:')){
  const d=lonelyPlan(st),g=d.groupFields.find(z=>z.id===spec.groupKey);if(!g)fail('Opening group not in live exact-make bracket.');if(!b.lonelyField)b.lonelyField=d;else if(JSON.stringify(b.lonelyField)!==JSON.stringify(d))fail('Owned one-car manufacturer roster changed after the Lonely Hearts draw froze.');return g.ids.slice();}
 const lookup=letter=>rankFor(x,'lonely:lonely:group:'+letter);
 if(spec.groupKey==='lonely:stage2:A')return[lookup('A')[0],lookup('B')[1],lookup('C')[0],lookup('D')[1],lookup('E')[0],lookup('F')[1]];
 if(spec.groupKey==='lonely:stage2:B')return[lookup('A')[1],lookup('B')[0],lookup('C')[1],lookup('D')[0],lookup('E')[1],lookup('F')[0]];
 if(spec.groupKey==='lonely:final')return[...rankFor(x,'lonely:lonely:stage2:A').slice(0,2),...rankFor(x,'lonely:lonely:stage2:B').slice(0,2)];
 fail('Unknown restored bracket round.');}
function record(x,spec){const b=saved(x),q=b?.stages?.[spec.id];if(!q)return null;
 const collection=spec.format==='KNOCKOUT'?x.raceOffs:x.runs,r=(collection||[]).find(z=>S(z.id)===S(q.runId||q.raceOffId));
 if(!r||r.evilCampaignR2?.campaign!==CAM||r.evilCampaignR2?.source!==TAG||r.evilCampaignR2?.stageId!==spec.id||r.value!=='e2restored:'+spec.id||r.type!==(spec.format==='KNOCKOUT'?'evil2-native-raceoff':'evil2-native'))fail('Saved restored stage result identity missing or changed.');
 const ids=spec.format==='KNOCKOUT'?r.entryIds:r.entries;if(!Array.isArray(ids)||ids.length!==q.carIds.length||ids.some((id,i)=>S(id)!==q.carIds[i]))fail('Frozen restored entrant list no longer matches the race.');
 if(spec.format!=='KNOCKOUT'&&r.rounds?.length!==3)fail('Restored Festival has wrong number of courses.');
 return{b,q,r};}
function verdict(row,st=live()){const x=space(),spec=stage(row,st),obj=record(x,spec);
 if(!obj)return{kind:spec.kind,ready:false,done:false,saved:0,total:['ARCHIVE','NEW_MAKE'].includes(spec.kind)?(spec.format==='KNOCKOUT'?null:spec.field.length*3):null,text:['ARCHIVE','NEW_MAKE'].includes(spec.kind)?spec.name+' · native '+spec.format+' ready':'Lonely Hearts · source three-course bracket ready'};
 const {q,r}=obj;let complete=false,saved=0,total=0,ranking=[];
 if(spec.format==='KNOCKOUT'){
  let matches=0,seen=new Set(),pretend=false;for(const round of r.rounds||[])for(const match of round.matches||[]){if(match.status!=='complete')continue;const ids=[S(match.carA?.sourceCarId),S(match.carB?.sourceCarId)],win=S(match.winnerCarId);if(ids.some(id=>!q.carIds.includes(id))||ids[0]===ids[1]||!ids.includes(win)||!match.resultA||!match.resultB||match.qaPretend||match.resultA.qaPretend||match.resultB.qaPretend)fail('Saved native Race Off has invalid or pretend results.');const key=S(match.id);if(!key||seen.has(key))fail('Duplicate Race Off matchup identity.');seen.add(key);matches++;}
  saved=matches;total=Math.max(1,q.carIds.length-1);complete=r.status==='complete'&&q.carIds.includes(S(r.championCarId))&&matches>=total;
 }else{const p=points(r),cutoff=spec.kind==='LONELY'&&spec.groupKey!=='lonely:final';saved=p.saved;total=p.total;complete=p.complete&&(!cutoff||!p.tiedAtCut);ranking=p.ranking;}
 return{kind:spec.kind,ready:complete,done:!!q.doneAt&&complete,saved,total,ranking,text:complete?'Complete · verified native '+spec.format+' results ('+saved+'/'+total+')':('Native '+spec.format+' · '+saved+'/'+total+' results'+(spec.kind==='LONELY'?' · top-two qualification verified at finish':''))};
}
function start(row,st=live()){const x=space(),spec=stage(row,st);const existed=record(x,spec);if(existed)return existed;
 const snapshot=JSON.stringify(x),before=JSON.stringify(st.spaces.filter(v=>v.id!==x.id));const b=initBook(x);
 let ids=spec.field.slice();if(spec.kind==='LONELY')ids=lonelyEntrants(x,spec,st,b);ids=resetShuffle(ids,x,'RESTORED:'+spec.id);
 if(ids.length<2||new Set(ids).size!==ids.length||ids.some(id=>!owned(x).has(id)))fail('Restored field does not have enough valid distinct owned cars.');
 const r=run(x,spec,ids);if(spec.format==='KNOCKOUT'){x.raceOffs=Array.isArray(x.raceOffs)?x.raceOffs:[];if(x.raceOffs.some(z=>z.id===r.id))fail('Generated Race Off ID collision.');x.raceOffs.push(r);}else{x.runs=Array.isArray(x.runs)?x.runs:[];if(x.runs.some(z=>z.id===r.id))fail('Generated native run ID collision.');x.runs.push(r);}
 b.stages[spec.id]={runId:spec.format==='KNOCKOUT'?null:r.id,raceOffId:spec.format==='KNOCKOUT'?r.id:null,carIds:ids.slice(),sourceSlot:spec.sourceSlot,createdAt:iso(),format:spec.format};
 try{window.rhSave?.();}catch(err){const prev=JSON.parse(snapshot);for(const k of Object.keys(x))delete x[k];Object.assign(x,prev);throw err;}
 if(JSON.stringify(st.spaces.filter(v=>v.id!==x.id))!==before)fail('A different Space changed while preparing restored stage.');
 return{b,q:b.stages[spec.id],r};}
function finish(row,st=live()){const x=space(),spec=stage(row,st),v=verdict(row,st),b=saved(x),q=b?.stages?.[spec.id];if(!q||!v.ready)fail('Cannot finish restored stage without verified native racing results.');if(q.doneAt)return q;q.doneAt=iso();window.rhSave?.();return q;}
let current=null,note='';function panel(){let p=document.getElementById(ID);if(!p){p=document.createElement('section');p.id=ID;p.style.cssText='position:fixed;z-index:6100;inset:0;overflow:auto;background:#06131e;color:#fff;padding:16px 13px 70px;display:none';document.body.appendChild(p);p.addEventListener('click',click);}return p;}
function show(row){current=row;note='';panel().style.display='block';window.show?.('festival');render();window.scrollTo?.(0,0);}
function render(){const p=panel();if(p.style.display==='none')return;try{const x=space(),spec=stage(current,live()),v=verdict(current,live()),rec=record(x,spec);
 let h='<div style="max-width:680px;margin:auto"><button type="button" data-restored="back">← BACK TO MIXED TOURNAMENT</button><h1>'+E(spec.name)+'</h1><p>'+(spec.kind==='NEW_MAKE'?'NEW EVIL 2.0 manufacturer competition (not an archived Evil 1 event)':'Original source-backed competition · historical source '+spec.sourceSlot)+' · existing OTG '+E(spec.format)+' racing engine</p><p>'+E(spec.stage)+'</p><p><b>'+v.saved+'/'+(v.total??'?')+'</b> genuine results · '+E(v.text)+'</p>';
 if(spec.kind==='LONELY')h+='<p>3 original FH5 tracks: '+E(spec.tracks.join(' → '))+' · one car from each currently single-car manufacturer.</p>';
 else h+='<p>Exact manufacturer: <b>'+E(spec.eligibleMake)+'</b> · '+spec.field.length+' currently owned eligible cars.</p>';
 if(!rec)h+='<button type="button" data-restored="start">🏁 START SOURCE-EXACT NATIVE COMPETITION</button>';
 else{h+='<button type="button" data-restored="native">🏁 OPEN ORIGINAL OTG RESULT ENTRY</button>';if(v.ready)h+='<p>✅ Stage race results complete. Return to the mixed programme to mark this stage DONE.</p>';}
 if(note)h+='<p role="status">'+E(note)+'</p>';p.innerHTML=h+'</div>';
 }catch(err){p.innerHTML='<button type="button" data-restored="back">← BACK</button><h2>SAFE STOP</h2><p>'+E(err.message||err)+'</p>';}}
function openDirect(row){const st=live(),spec=stage(row,st),existing=record(space(),spec);const v=existing||start(row,st);native(v.r,spec);}
function close(){panel().style.display='none';window.show?.('festival');window.rhEvil2Mixed8261?.open?.();}
function native(r,spec){panel().style.display='none';if(spec.format==='KNOCKOUT'){window.show?.('raceoff');window.rhCurrentRaceOffId=r.id;const q=r.rounds?.[r.currentRoundIndex||0];if(q?.status==='drawn'||q?.status==='racing'||q?.status==='raced')window.rhRenderRaceOffLocked?.(r.id);else window.rhRaceOffOpenRoundSetup?.(r.id);}else{window.show?.('festival');window.rhOpenRun?.(r.id);}}
function click(ev){const bt=ev.target.closest('button[data-restored]');if(!bt)return;try{const op=bt.dataset.restored;if(op==='back')return close();const x=space(),spec=stage(current,live());if(op==='start'){const v=start(current,live());note='Source identity and real entrants frozen. Open the established OTG racing screen.';render();return;}if(op==='native'){const v=record(x,spec);if(!v)fail('First freeze this verified source event.');native(v.r,spec);return;}fail('Unknown control.');}catch(err){note='SAFE STOP — '+S(err.message||err);render();}}
const prev=window.rhEligible;if(typeof prev==='function'){window.rhEligible=function(t,v){if(['evil2-native','evil2-native-raceoff'].includes(S(t))&&S(v).startsWith('e2restored:')){const x=window.rhSpace?.(),b=saved(x),sid=S(v).slice('e2restored:'.length),q=b?.stages?.[sid];if(!q)return[];const field=new Set(q.carIds.map(S));return(x.cars||[]).filter(c=>field.has(S(c.id)));}return prev.apply(this,arguments);};try{rhEligible=window.rhEligible;}catch(_){}}
const preset=window.rhFH5Preset8056;if(typeof preset==='function')window.rhFH5Preset8056=function(t,v,context='festival'){if(['evil2-native','evil2-native-raceoff'].includes(S(t))&&S(v).startsWith('e2restored:')){const x=window.rhSpace?.(),b=saved(x),sid=S(v).slice('e2restored:'.length),q=b?.stages?.[sid];if(!q)return preset.apply(this,arguments);const old=src().find(s=>Number(s.slot)===Number(q.sourceSlot)),cat=/OFF-ROAD|RALLY ADVENTURE/i.test(S(old?.pool))?'OFFROAD':'ROAD';const pool=window.rhFH5TrackTaxonomy8067?.standardPool?.(cat)||[];return{type:t,value:v,context,discipline:S(old?.pool)||'Road / Street',tracks:[...pool],pool:[...pool],raceCategory:cat,fixed:false,source:'EVIL 2.0 · HISTORIC '+S(old?.event)};}return preset.apply(this,arguments);};
window.rhEvil2Restored8262=window.rhEvil2Restored8261={stage,start,record,verdict,finish,show,openDirect,points,oldTracks,version:'8.0.261'};
})();
