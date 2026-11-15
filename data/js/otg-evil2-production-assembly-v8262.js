/* OTG! MAIN 8.0.262 — full source-derived production manifest and CLEAN-SLATE REHEARSAL.
 * This module intentionally has NO live reset function, does not call rhSave,
 * and never creates a race, award or Evil 2.0 DONE marker.
 * Distinguishes supported native routes from forecast-only work orders.
 */
(()=>{'use strict';
const VERSION='8.0.262',ID='otg-e2-production-8258',TILE='otg-e2-production-launch-8258';
const S=v=>String(v??'').trim(),E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone=v=>JSON.parse(JSON.stringify(v));
const RECORD_LISTS=['runs','raceOffs','legacyResults','recordExclusions','recordBookExclusions','resultAudit8080'];
const CAMPAIGN_KEYS=['evilCampaign8076','evilCampaignR18098','fh5TrackBags8070','evil2NativeRun8250','evil2NewFormats8256','evil2Honours8257','evil2Specialist8259','evil2Mixed260','evil2Restored8261','evil2Swiss8262'];
const SAFE_PRESERVED=['id','name','cars','catalogueKey','catalogueTitle','catalogueOwned','catalogueLibrary','catalogueIdentityVersion','catalogueRepairVersion','catalogueMakeAliases','garageEntryMemory','backups','safetyBackup','evilHallOfShame8147','evilHallRewards8152','evilSecretSideMissions8163','evilConeBreaks8164','championshipDiscoveries','favouriteManufacturer','createdAt','fh6Planning','fh6SpecialistPrep','fh6ExactLegacyLinked','customEvents','raceSetups'];
const possible=/race|result|record|tim(e|ing)|stat|medal|honou?r|campaign|event|round|trophy|history|leader|gauntlet|relay|jump|swiss|evil2/i;
const privateKey=/private|personal|incident|discovery|discover|reward|hall|cone|garage|catalogue|backup|art|photo|asset/i;
function live(){const q=(typeof state!=='undefined'&&state&&Array.isArray(state.spaces))?state:window.state;if(!q||!Array.isArray(q.spaces)||!q.spaces.length)throw Error('The live OTG Spaces are not available.');return q;}
function cleanDraft(src){if(!src||!Array.isArray(src.spaces)||!src.spaces.length)throw Error('All-Space reset needs a valid state.');const x=clone(src);for(const space of x.spaces){for(const k of RECORD_LISTS)if(Object.hasOwn(space,k))space[k]=[];for(const k of CAMPAIGN_KEYS)delete space[k];}return x;}
function auditReset(src){const text=JSON.stringify(src),draft=cleanDraft(src),stats=[],risks=[];
 const spaceIds=new Set();for(let i=0;i<src.spaces.length;i++){
  const before=src.spaces[i],after=draft.spaces[i],id=S(before.id);if(!id||spaceIds.has(id))throw Error('Space IDs are missing or duplicated.');spaceIds.add(id);
  for(const k of SAFE_PRESERVED)if(JSON.stringify(before[k])!==JSON.stringify(after[k]))throw Error('Unsafe rehearsal: protected '+k+' changed in '+id);
  for(const k of RECORD_LISTS)if(Array.isArray(after[k])&&after[k].length)throw Error('Incomplete racing history rehearsal: '+k);
  for(const k of CAMPAIGN_KEYS)if(Object.hasOwn(after,k))throw Error('Incomplete legacy/test campaign clear: '+k);
  const unknown=Object.keys(before).filter(k=>!SAFE_PRESERVED.includes(k)&&!RECORD_LISTS.includes(k)&&!CAMPAIGN_KEYS.includes(k)&&possible.test(k));
  for(const k of unknown)risks.push(S(before.name)+': unknown racing/history field '+k);
  for(const k of ['leagues'])if(Array.isArray(before[k])&&before[k].length)risks.push(S(before.name)+': nonempty '+k+' needs result-specific mapping');
  if(Array.isArray(before.customEvents)&&before.customEvents.some(v=>v&&typeof v==='object'&&Object.keys(v).some(k=>/result|time|record|finish|medal/i.test(k))))risks.push(S(before.name)+': customEvents may contain embedded racing history; definition must stay');
  if(Array.isArray(before.raceSetups)&&before.raceSetups.some(v=>v&&typeof v==='object'&&Object.keys(v).some(k=>/result|finish|medal/i.test(k))))risks.push(S(before.name)+': raceSetups contain possible results; preserve configuration');
  const results=(before.runs||[]).reduce((n,r)=>n+(r.results||[]).length,0)+(before.raceOffs||[]).reduce((n,r)=>n+(r.rounds||[]).reduce((m,rd)=>m+(rd.matches||[]).reduce((p,t)=>p+(t.attempts||[]).length,0),0),0);
  stats.push({id,name:S(before.name),cars:(before.cars||[]).length,owned:Object.keys(before.catalogueOwned||{}).length,runs:(before.runs||[]).length,raceOffs:(before.raceOffs||[]).length,legacy:(before.legacyResults||[]).length,results,oldCampaign:Object.keys(before.evilCampaignR18098?.done||{}).length,evil2TestRows:Object.keys(before.evil2NativeRun8250?.slots||{}).length,willClear:RECORD_LISTS.filter(k=>Object.hasOwn(before,k)).concat(CAMPAIGN_KEYS.filter(k=>Object.hasOwn(before,k))),protectedFields:SAFE_PRESERVED.filter(k=>Object.hasOwn(before,k))});
 }
 for(const k of Object.keys(src)){if(k==='spaces')continue;if(JSON.stringify(src[k])!==JSON.stringify(draft[k]))throw Error('Top-level data changed during rehearsal: '+k);}
 if(JSON.stringify(src)!==text)throw Error('LIVE state changed during dry-run audit.');
 return {readOnly:true,spaces:stats,totalCars:stats.reduce((n,x)=>n+x.cars,0),resultsToClear:stats.reduce((n,x)=>n+x.results,0),testR2VisitRowsToClear:stats.reduce((n,x)=>n+x.evil2TestRows,0),unknownRisks:[...new Set(risks)],preservedAllSpaceIdentities:true,corePreserved:true,cloneClearedKnownRacingHistory:true,realStateUnchanged:true,resetExecuted:false,launchAllowed:false,note:'No live reset code exists in v8.0.262. Rehearsal alone is not approval to wipe racing history.'};
}
function classify(row,sourceCount){const kind=S(row.kind),ev=S(row.name);
 if(kind==='EXISTING'){
  const slot=row.originalSlot||0;
  let source,score=false;if(slot>=1&&slot<=6){source={preconfiguredNative:true};}else{try{source=window.rhEvil2Universal8255?.spec(slot);}catch(_){source=null;}}
  if(!source){try{source=window.rhEvil2Specialist8259?.spec(slot);score=!!source;}catch(_){source=null;}}
  if(!source){try{source=window.rhEvil2Swiss8262?.spec(slot);if(source)return {route:'ORIGINAL SOURCE · NATIVE SWISS CUP',action:'ORIGINAL_SWISS',reason:'Five original seven-visit Swiss Cups use the proven OTG Swiss rounds, Top 8 bracket and native result entry.',sourceSlot:slot,eventId:S(row.sourceEventId)};}catch(_){source=null;}}
  return {route:source?(score?'NATIVE ORIGINAL DRIFT/DRAG SOURCE ENGINE':'NATIVE EXISTING ENGINE'):'SOURCE FORMAT HOLD',action:source?(score?'ORIGINAL_SPECIALIST':'ORIGINAL_SLOT'):'HOLD',reason:source?(score?'Original drift-score/knockout or native OTG Drag result source with frozen event identity.':'Source-backed Festival / Race Off native route.'):'Source rules missing; cannot open an unverified format.',sourceSlot:slot,eventId:S(row.sourceEventId)};
 }
 if(kind==='NEW EXACT MAKE THEME')return{route:'NEW EVIL 2.0 EXACT-MAKE FESTIVAL / RACE OFF',action:'NEW_MAKE',reason:'No historical source existed. Explicit NEW competition with existing native STANDARD / KNOCKOUT rules and current exact-make Garage.'};
 if(kind==='ARCHIVED EXACT SOURCE')return{route:'NATIVE HISTORIC FESTIVAL / RACE OFF',action:'RESTORED_ARCHIVE',reason:'Source-exact archived Manufacturer Festival/Race Off; existing native OTG race entry, original live owned make and verified rounds.'};
 if(kind==='LONELY HEARTS — HISTORIC BRACKET')return{route:'NATIVE LONELY HEARTS 3-COURSE GROUPS / FINAL',action:'RESTORED_LONELY',reason:'Exact historical three-course stages, live one-car makers and result-ranked qualifiers through all nine visits.'};
 if(kind==='MANUFACTURER GAUNTLET WORK ORDER'||kind==='TYPE GAUNTLET WORK ORDER')return{route:'NATIVE GAUNTLET ENGINE AVAILABLE · SLOT BINDING PENDING',action:'NEW_GAUNTLET',reason:'Real native three-track Gauntlet works, but this work-order row is not yet its numbered production race.'};
 if(kind==='LONG JUMP ATTEMPT')return{route:'NATIVE DISTANCE ENGINE AVAILABLE · SLOT BINDING PENDING',action:'LONG_JUMP',reason:'One full-Garage long-jump competition exists; individual provisional positions are not independent finishable slots.'};
 if(kind==='RELAY QUALIFYING GROUP'||kind==='RELAY FINALS NIGHT')return{route:'NATIVE RELAY ENGINE AVAILABLE · ROUND BINDING PENDING',action:'NEW_RELAY',reason:'Two native Relay ladders exist; real groups/winners must map to stage cards as they complete.'};
 return{route:'UNCLASSIFIED HOLD',action:'HOLD',reason:'Unknown category — cannot launch.'};
}
function programme(st){const before=JSON.stringify(st),master=window.rhEvil2MasterSequence8245?.plan(st);if(!master?.readOnly||!master?.checks||Object.values(master.checks).some(v=>v!==true)||!master.provisionalRows?.length)throw Error('The verified master schedule source is not available.');
 const originals=master.originalVisits,rows=master.provisionalRows.map((row,i)=>({...row,sourcePosition:i+1,...classify(row,originals)}));
 // The seven Hubbs encore source visits must close the MAIN race programme,
 // with no Gauntlet/Long-Jump/Relay work orders interrupting them.
 const finalSource=rows.filter(r=>r.kind==='EXISTING'&&r.originalSlot>=originals-6);
 const hubbs=finalSource.length===7&&finalSource.every((r,i)=>r.originalSlot===originals-6+i&&/hubbs/i.test(r.name))?finalSource:[];
 // Never reclassify a different competition as Hubbs just because it appears last.
 // Historic 698-car fixture has 1177 visits without the later Hubbs encore.
 const rest=rows.filter(r=>!hubbs.includes(r));const ordered=rest.concat(hubbs).map((r,i)=>({...r,position:i+1}));
 const ids=new Set(ordered.map(r=>r.id));if(ids.size!==rows.length)throw Error('Duplicate stage ID in programme.');
 const previous=ordered.filter(r=>r.kind==='EXISTING').map(r=>r.originalSlot);if(previous.length!==originals||previous.some((n,i)=>n!==i+1))throw Error('Original source order lost.');
 const countBy=key=>{const m={};for(const r of ordered)m[r[key]]=(m[r[key]]||0)+1;return m;};
 const byRoute=countBy('route'),native=ordered.filter(r=>r.action==='ORIGINAL_SLOT'||r.action==='ORIGINAL_SPECIALIST'||r.action==='ORIGINAL_SWISS').length,blocked=ordered.filter(r=>r.action==='HOLD').length;
 const sourceHolds=ordered.filter(r=>r.kind==='EXISTING'&&r.action==='HOLD').length;
 const fp=String(ordered.length)+'|'+ordered.slice(0,2).map(v=>v.id).join('|')+'|'+ordered.slice(-7).map(v=>v.id).join('|');
 if(JSON.stringify(st)!==before)throw Error('Source state modified during manifest compilation.');
 return {version:VERSION,readOnly:true,productionReady:false,garageCars:master.liveCars,sourceVisits:originals,archivedVisits:master.archivalStageVisits,lonelyHeartVisits:master.lonelyHeartVisits,gauntletOrders:master.gauntletWorkOrders,longJumpVisits:master.longJumpAttempts,relayGroupVisits:master.relayGroupVisits,originalNative:native,originalSpecialistHolds:sourceHolds,otherHeld:blocked-sourceHolds,stageCount:ordered.length,grandGate:{...master.secondChanceAtEnd,afterProvisionalPosition:ordered.length},hubbsEncoreContiguous:hubbs.length===7,phaseOrder:hubbs.length?'Main schedule → seven Hubbs encore source visits → ONE Grand Second Chance (only after all qualifying finals closed)':'Main schedule → ONE Grand Second Chance (Hubbs encore NOT VERIFIED in this original source)',unresolvedNewMakeThemes:master.unsourcedManufacturerThemes,routeCounts:byRoute,fingerprint:fp,stageRows:ordered,unblockedNativeEnginesAreNotAutomaticallyNumbered:true,noWrites:true,noReset:true};
}
function linkAction(r){if(!r)return;switch(r.action){case'ORIGINAL_SWISS':window.rhEvil2Swiss8262?.show(r.originalSlot);break;case'ORIGINAL_SLOT': case'ORIGINAL_SPECIALIST': if(typeof window.rhEvil2OriginalGateway8259?.open==='function')window.rhEvil2OriginalGateway8259.open(r.originalSlot);else throw Error('Complete original source router unavailable');break;
 case'NEW_MAKE':window.rhEvil2Restored8262?.show(r);break;
 case'NEW_GAUNTLET':window.rhEvil2NewRaces8256?.show('gauntlet');break;
 case'LONG_JUMP':window.rhEvil2NewRaces8256?.show('jump');break;
 case'NEW_RELAY':window.rhEvil2NewRaces8256?.show('relay');break;
 default:throw Error('This source is held. Cannot open unsupported race format.');}}
let last=null,lastReset=null,view='overview',filter='ALL',page=0,note='';
const button=(key,label)=>'<button type="button" data-e2prod="'+E(key)+'" style="width:100%;padding:12px;margin:6px 0;background:#164d61;color:#f7fcff;border:1px solid #3986a2;border-radius:12px;font-size:15px;font-weight:bold">'+label+'</button>';
function panel(){let d=document.getElementById(ID);if(!d){d=document.createElement('div');d.id=ID;d.style.cssText='position:fixed;z-index:6100;inset:0;background:#06121d;color:#fff;overflow:auto;padding:16px 13px 80px;display:none';document.body.appendChild(d);d.addEventListener('click',click);}return d;}
function screen(){const d=panel();let h='<div style="max-width:680px;margin:auto">'+button('close','← BACK TO FESTIVAL')+'<small>EVIL TOURNAMENT 2.0 · STEP 4 · MASTER ASSEMBLY</small><h1>😈 The entire bloody programme</h1><p>Full source-based stage inventory and all-Spaces clean-slate rehearsal. The original racing screens remain intact. <strong>NOT the final launch.</strong></p>';
 if(note)h+='<p style="background:#123d37;padding:12px;border-radius:10px">'+E(note)+'</p>';
 if(!last){h+=button('build','🏗️ ASSEMBLE COMPLETE MASTER PROGRAMME — READ ONLY');h+=button('reset','🛡️ REHEARSE CLEAN SLATE — NO DATA CHANGED');}
 else {const m=last;h+='<section style="background:#12283a;padding:14px;border-radius:12px"><h2>'+m.stageCount+' provisional stage positions</h2><p><strong>'+m.garageCars+'</strong> FH5 owned cars · <strong>'+m.sourceVisits+'</strong> original visits · '+m.archivedVisits+' archived · '+m.lonelyHeartVisits+' Lonely Hearts · '+m.gauntletOrders+' Gauntlets · '+m.longJumpVisits+' Long Jumps · '+m.relayGroupVisits+' Relay group cards</p><p><strong>'+m.originalNative+'</strong> original source visits route through working native engines. <strong>'+m.originalSpecialistHolds+'</strong> original source-format visits remain held (original Drift/Drag now routed). <strong>'+m.unresolvedNewMakeThemes+'</strong> new manufacturer themes supplied by explicit NEW STANDARD / KNOCKOUT templates.</p><p>'+(m.hubbsEncoreContiguous?'✅ Hubbs Memorial final seven original visits form a contiguous encore without Long Jump interruptions.':'⚠️ Hubbs encore not verified at the end of this source; no blind reordering performed.')+'</p><p>😈 ONE giant Second Chance phase is last; no imaginary entrants or Cup rounds are generated.</p><p style="color:#ffca92">⚠️ This is NOT yet a fully numbered, finishable production programme. Archive, Lonely Hearts, Gauntlet, Relay and Long Jump work orders still need binding to real DONE/progression and official source awards.</p></section>';
 h+=button('reset','🛡️ REHEARSE CLEAN SLATE — NO DATA CHANGED')+button('export','📋 EXPORT FULL ASSEMBLY AUDIT JSON');
 h+='<h2>Inspect the stage manifest</h2><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px">'+['ALL','ORIGINAL_SLOT','HOLD','NEW_GAUNTLET','LONG_JUMP','NEW_RELAY'].map(t=>'<button type="button" data-e2prod="filter:'+t+'" style="padding:9px;background:'+(t===filter?'#256e7d':'#132d3f')+';color:#fff;border:1px solid #42758a;border-radius:9px">'+E(t.replaceAll('_',' '))+'</button>').join('')+'</div>';
 const items=m.stageRows.filter(r=>filter==='ALL'||r.action===filter),start=page*15,visible=items.slice(start,start+15);h+='<p>'+items.length+' matching stages · page '+(page+1)+' / '+Math.max(1,Math.ceil(items.length/15))+'</p>';
 for(const r of visible)h+='<article style="border:1px solid #29465b;padding:11px;margin:8px 0;border-radius:11px"><strong>#'+r.position+' — '+E(r.name)+'</strong><br><small>'+E(r.kind)+' · '+E(r.route)+'</small>'+(r.kind==='EXISTING'?'<br><small>Original Slot '+r.originalSlot+'</small>':'')+'<p style="font-size:12px">'+E(r.reason)+'</p>'+(r.action!=='HOLD'?button('route:'+r.position,'OPEN AVAILABLE ENGINE (PRELAUNCH)'):'')+'</article>';
 h+='<div style="display:flex;gap:6px">'+button('previous','← PREVIOUS')+button('next','NEXT →')+'</div>';
 }
 if(lastReset){const z=lastReset;h+='<section style="border:2px solid #a77948;padding:13px;border-radius:14px"><h2>🛡️ Clean slate rehearsal — PASS (READ ONLY)</h2><p><strong>'+z.spaces.length+'</strong> Spaces, <strong>'+z.totalCars+'</strong> cars preserved; '+z.resultsToClear+' recorded result entries identified; '+z.testR2VisitRowsToClear+' native R2 test-visit markers identified for removal.</p>';
 for(const sp of z.spaces)h+='<p>'+E(sp.name)+': '+sp.cars+' cars / '+sp.owned+' owned flags protected; '+sp.runs+' old/test runs, '+sp.raceOffs+' Race Offs, '+sp.legacy+' legacy results would clear.</p>';
 if(z.unknownRisks.length)h+='<p style="color:#ffd19b"><b>NOT CLEARED:</b> '+E(z.unknownRisks.slice(0,12).join('; '))+'</p>';
 h+='<p><strong>NO racing history has been deleted.</strong> Private incident/discovery content, all Garage ownership and Space identity were preserved on a CLONE. Final backup/restore and launch controls are still required.</p></section>';
 }
 return h+'</div>';}
function render(){panel().innerHTML=screen();}
function download(m,z){const content=JSON.stringify({kind:'OTG_EVIL2_STAGE_ASSEMBLY_AUDIT_ONLY',version:VERSION,createdAt:new Date().toISOString(),rehearsal:z,programme:{...m,stageRows:m.stageRows}},null,2);const blob=new Blob([content],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='OTG_EVIL2_MASTER_STAGE_AUDIT_v8258.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);}
function click(ev){const b=ev.target.closest('button[data-e2prod]');if(!b)return;try{const act=b.dataset.e2prod;if(act==='close'){panel().style.display='none';window.show?.('festival');return;}if(act==='build'){last=programme(live());note='ASSEMBLY PASS ✓ Source-derived programme compiled, zero racing data written.';filter='ALL';page=0;}
 else if(act==='reset'){lastReset=auditReset(live());note='CLEAN-SLATE REHEARSAL PASS ✓ On a clone only; your live data was NOT touched.';}
 else if(act==='export'){if(!last)throw Error('Build the complete master programme first.');download(last,lastReset);note='Saved audit JSON only. This is NOT an importable OTG recovery backup.';}
 else if(act.startsWith('filter:')){filter=act.slice(7);page=0;}
 else if(act==='next'){const size=last?.stageRows?.filter(r=>filter==='ALL'||r.action===filter).length||0;page=Math.min(Math.ceil(size/15)-1,page+1);page=Math.max(0,page);}else if(act==='previous'){page=Math.max(0,page-1);}
 else if(act.startsWith('route:')){const n=Number(act.slice(6)),r=last?.stageRows.find(x=>x.position===n);if(!r)throw Error('Stage not available');panel().style.display='none';linkAction(r);return;}
 render();}catch(err){note='SAFE STOP: '+S(err.message||err);render();}}
function open(){note='';panel().style.display='block';window.show?.('festival');render();window.scrollTo?.(0,0);}
function mount(){const fest=document.getElementById('festival');if(!fest||fest.classList.contains('hidden')||fest.querySelector('#'+TILE))return;const card=document.createElement('section');card.id=TILE;card.className='e2slot-launch';card.innerHTML='<details><summary>🏁 EVIL 2.0 — COMPLETE MASTER ASSEMBLY & CLEAN-SLATE QA <small>ALL STAGES · ALL SPACES · READ ONLY</small></summary><p>Build the whole source-derived stage list, identify genuine wiring gaps, rehearse wiping ALL old and pretend results on a clone. No live reset or dashboard switch.</p><button type="button">OPEN MASTER ASSEMBLY</button></details>';card.querySelector('button').addEventListener('click',open);fest.appendChild(card);}
function init(){const f=document.getElementById('festival');if(!f)return;let busy=false;new MutationObserver(()=>{if(busy)return;busy=true;setTimeout(()=>{busy=false;mount();},120)}).observe(f,{childList:true,subtree:true});mount();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.rhEvil2Production8258={programme,auditReset,cleanDraft,open,version:VERSION};
})();
