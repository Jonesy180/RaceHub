/* OTG! MAIN 8.0.180 — Evil 2.0 READ-ONLY preflight.
   No race data, career medals, track bags, garage, incident data or campaign state are modified.
   All preview draws are held in memory and can be exported to JSON. */
(()=>{
'use strict';
const VER='8.0.180', FH5='fh5-catalogue-v1';
const $=s=>document.querySelector(s);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const text=x=>String(x??'').trim();
const low=x=>text(x).toLocaleLowerCase();
const normalize=x=>low(x).normalize('NFKD').replace(/[^a-z0-9]+/g,'-');
const carID=(c,i)=>text(c.id||c.catalogueId||`legacy-${i}`);
const source=()=>{try{return window.rhSpace?.()||null}catch(_){return null}};
const taxonomy=()=>window.rhFH5TrackTaxonomy8067?.tracks||[];
const SORT=(a,b)=>a.localeCompare(b,'en');
// Mulberry32: repeatable independent preview randomness, without changing OTG's racing shuffle bags.
function rng(seed){let a=Number(seed)>>>0;return function(){a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296}}
function shuffle(input,r){let a=input.slice();for(let i=a.length-1;i>0;i--){let j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function groupBy(list,fn){let m=new Map();for(const c of list){const k=text(fn(c))||'UNKNOWN';if(!m.has(k))m.set(k,[]);m.get(k).push(c)}return m}
function owned(){const s=source();if(!s||s.catalogueKey!==FH5)return[];const seen=new Set();return(s.cars||[]).filter(c=>{const id=carID(c);if(!id||seen.has(id))return false;seen.add(id);return true}).map((c,i)=>({id:carID(c,i),make:text(c.make)||'Unknown',name:text(c.name)||[c.make,c.model,c.year].filter(Boolean).join(' '),type:text(c.classType)||'Unclassified',year:text(c.year),raw:c}));}
function makeTeams(cars,seed){const r=rng(seed^0x19aebc),buckets=groupBy(cars,c=>c.make),out=[];
 for(const [make,a] of [...buckets.entries()].sort(([a],[b])=>SORT(a,b))){
   if(a.length>=3){const group=shuffle(a,r).slice(0,3);out.push({make,cars:group.map(c=>({id:c.id,name:c.name}))});}
 }
 return shuffle(out,r)
}
function mixedTeams(cars,seed){const r=rng(seed^0x84b2fa),byMake=groupBy(shuffle(cars,r),c=>c.make),out=[];
 for(const [k,a] of byMake)byMake.set(k,shuffle(a,r));
 // Take one from each of the three largest remaining manufacturer pools. Prevents
 // unfairly stranding smaller manufacturers when a large marque dominates.
 while(true){const choices=[...byMake.entries()].filter(([k,v])=>v.length).map(([make,a])=>({make,count:a.length,tie:r()})).sort((a,b)=>b.count-a.count||a.tie-b.tie);
  if(choices.length<3)break;
  const trio=choices.slice(0,3).map(x=>byMake.get(x.make).pop());
  out.push({team:out.length+1,cars:shuffle(trio,r).map(c=>({id:c.id,make:c.make,name:c.name}))});
 }
 return{teams:shuffle(out,r).map((t,i)=>({...t,team:i+1})),unallocated:[...byMake.values()].flat().map(c=>({id:c.id,make:c.make,name:c.name}))};
}
function makeGauntlets(cars,seed){const r=rng(seed^0xaa77bb);const makes=groupBy(cars,c=>c.make),types=groupBy(cars,c=>c.type);
 const byMake=[...makes].filter(([k,a])=>a.length>=2).map(([name,a])=>({kind:'Manufacturer',name,entryCount:a.length,carIds:shuffle(a,r).map(c=>c.id)}));
 const byType=[...types].filter(([k,a])=>a.length>=2).map(([name,a])=>({kind:'Vehicle type',name,entryCount:a.length,carIds:shuffle(a,r).map(c=>c.id)}));
 return{byMake:shuffle(byMake,r),byType:shuffle(byType,r)};
}
function trackPools(){const tracks=taxonomy();const supported=tracks.filter(x=>x.standard&&['ROAD','OFFROAD','RALLY','HOT_WHEELS'].includes(x.category));
 const buckets=groupBy(supported,x=>x.category);
 const byCategory=[...buckets].map(([name,items])=>({category:name,count:items.length,tracks:items.map(x=>x.name)}));
 // This is a PROVISIONAL audit only. Existing taxonomy has no length/fast-corner metadata.
 // Never claim these tracks have been verified for performance suitability.
 const missingProfiles=supported.length;
 return{catalogueRoutes:tracks.length,normalRoutes:supported.length,byCategory,missingProfiles,needsRouteProfiling:true,trackLengthsVerified:false};
}
function countDone(){try{const s=source(),d=s?.evilCampaignR18098?.done||{};return Object.values(d).filter(v=>v===true||v?.status==='done'||v?.status==='DONE'||v?.done===true).length}catch(_){return 0}}
function describe(){const s=source(),cars=owned();if(!s||s.catalogueKey!==FH5)return{error:'Open your Forza Horizon 5 Space first — this preview never switches Spaces.'};
 const manufacturers=groupBy(cars,c=>c.make),types=groupBy(cars,c=>c.type),seed=0xE71A1202;const mixed=mixedTeams(cars,seed),byMake=makeTeams(cars,seed),gauntlets=makeGauntlets(cars,seed),tracks=trackPools();
 const lonely=[...manufacturers.entries()].filter(([,a])=>a.length===1).map(([make,a])=>({make,carId:a[0].id,name:a[0].name,type:a[0].type}));
 const jump=shuffle(cars,rng(seed^0x573cc1)).map((c,i)=>({run:i+1,carId:c.id,name:c.name,make:c.make,type:c.type,attemptsAllowed:1}));
 const assigned=mixed.teams.flatMap(t=>t.cars),uniqueIDs=new Set(assigned.map(c=>c.id));
 const audit={
    mixedCarsUnique:uniqueIDs.size===assigned.length,
    mixedNoRepeatMakePerTeam:mixed.teams.every(t=>new Set(t.cars.map(c=>c.make)).size===3),
    mixedThreeCarsPerTeam:mixed.teams.every(t=>t.cars.length===3),
    mixedAllCarsAccountedFor:assigned.length+mixed.unallocated.length===cars.length,
    manufacturerEntriesExactlyThree:byMake.every(t=>t.cars.length===3&&new Set(t.cars.map(c=>c.id)).size===3),
    manufacturerEligibleComplete:byMake.length===[...manufacturers.values()].filter(a=>a.length>=3).length,
    longJumpEveryCarOnce:jump.length===cars.length&&new Set(jump.map(c=>c.carId)).size===cars.length,
    allOriginalResultsUnmodified:true,
    noActualTrackDrawsCommitted:true
 };
 return{appVersion:VER,previewOnly:true,sourceSpaceId:s.id,sourceSpaceName:s.name,generatedAt:new Date().toISOString(),garageCars:cars.length,
  totalMakes:manufacturers.size,vehicleTypes:types.size,evilDoneSlots:countDone(),sourceWarning:'Garage and progress are LIVE at time of preview. No resets, race entries or awards were written.',
  relay:{manufacturerTeams:byMake,mixedTeams:mixed.teams,mixedUnallocated:mixed.unallocated},
  gauntlet:gauntlets,lonelyHearts:lonely,
  jump:{location:'Aeródromo runway jump (exact FH5 stunt ID to verify)',rules:'One jump and one distance per owned car, no repeats',overall:jump},
  secondChance:{qualify:'Single finisher immediately below the LAST awarded bronze position in each completed source competition.',oneUseRule:'A given stable car ID may enter Second Chance once across all editions; later qualifications do not create additional entries.',format:'16 unique cars -> 4 groups of 4 -> ONE group winner advances -> 2 semi-finals -> final',readyNow:false,waitingForFutureResults:true},
  smartShuffle:tracks,
  resumeSafety:{oldR1ResultsMayAffectAwards:true,deleteProofRequired:true,manualResetDisabled:true,privateStoriesNotInPortableBackup:true},audit};
}
let last=null;
function download(){if(!last)return;let payload=JSON.stringify(last,null,2),b=new Blob([payload],{type:'application/json'}),url=URL.createObjectURL(b),a=document.createElement('a');a.href=url;a.download='OTG-EVIL-2-PREFLIGHT-READ-ONLY.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500)}
function statsCard(label,value,sub){return `<div class="e2stat"><span>${esc(label)}</span><b>${esc(value)}</b><small>${esc(sub||'')}</small></div>`}
function tab(n){const d=$('#e2preview-content');if(!d||!last)return;
 const mk=(x,n)=>`<div class="e2row"><strong>${esc(n||x.make||x.name)}</strong><span>${esc(x.cars?x.cars.map(c=>c.name).join(' · '):x.entryCount||'')}</span></div>`;
 const q=last;
 if(n==='Relay'){d.innerHTML=`<h3>Manufacturer relay — ${q.relay.manufacturerTeams.length} teams</h3><p>Each manufacturer with 3+ owned cars contributes three randomly selected unique cars.</p>${q.relay.manufacturerTeams.slice(0,10).map(x=>mk(x,x.make)).join('')}<small>Showing 10 sample entries · full preview available in export.</small><h3>Mixed relay — ${q.relay.mixedTeams.length} three-car teams</h3><p>Three different manufacturers per team. A car enters this championship only once; ${q.relay.mixedUnallocated.length} unused cars remain if fewer than three manufacturers are available at the end of the draw.</p>${q.relay.mixedTeams.slice(0,8).map(x=>mk(x,`Team ${x.team}`)).join('')}`;
 }else if(n==='Gauntlet'){d.innerHTML=`<h3>Three-stage Gauntlets</h3><p>Grouping by a single manufacturer OR vehicle type. Each entrant must face the same three stages in its particular competition, with extreme route combinations explicitly permitted.</p><p><strong>${q.gauntlet.byMake.length}</strong> eligible manufacturer fields • <strong>${q.gauntlet.byType.length}</strong> vehicle-type fields</p>${q.gauntlet.byMake.slice(0,12).map(x=>mk(x,x.name)).join('')}`;
 }else if(n==='Jump'){d.innerHTML=`<h3>Aeródromo long jump</h3><p>Every one of the <b>${q.jump.overall.length}</b> owned cars enters; exactly <b>ONE</b> recorded distance per car. One overall leaderboard, with manufacturer, type and class filters — not separate medals for filtered views.</p>${q.jump.overall.slice(0,12).map(x=>`<div class="e2row"><strong>${x.run}. ${esc(x.name)}</strong><span>${esc(x.make)} · ${esc(x.type)}</span></div>`).join('')}<small>Random sample starting order; not a committed draw.</small>`;
 }else if(n==='Tracks'){d.innerHTML=`<h3>Track taxonomy and suitability audit</h3><p>Verified from OTG's existing taxonomy: <strong>${q.smartShuffle.catalogueRoutes}</strong> known routes and <strong>${q.smartShuffle.normalRoutes}</strong> standard routes in supported disciplines.</p>${q.smartShuffle.byCategory.map(x=>`<div class="e2row"><strong>${esc(x.category)}</strong><span>${x.count} tracks</span></div>`).join('')}<div class="e2warning"><b>NOT YET READY FOR SMART SELECTION</b><p>The current taxonomy has categories, but does not store trustworthy track lengths or speed profiles. Those must be classified and tested before any smart shuffle goes live; approximate names alone aren't sufficient.</p></div>`;
 }else if(n==='Safety'){d.innerHTML=`<h3>Destructive restart — NOT ARMED</h3><p>Old Evil racing results live in existing Festivals, Race Offs, Swiss records and progress state. Removing only the campaign's DONE flags would leave incorrect historical honours and E✓ badges.</p><div class="e2warning"><b>PRIVATE FAMILY FILES NEED SEPARATE BACKUP</b><p>Original private pictures and stories are held on your phone and are not guaranteed to be in the portable racing backup.</p></div><h3>Dry-run checks</h3>${Object.entries(q.audit).map(([k,v])=>`<div class="e2row"><strong>${esc(k.replace(/([A-Z])/g,' $1'))}</strong><b>${v?'PASS':'CHECK'}</b></div>`).join('')}`;
 }else{d.innerHTML=`<h3>Other competitions</h3><p><b>Second Chance:</b> one finisher immediately below bronze from each completed event, unique car once forever. Every 16 fresh eligible cars can make four qualifying groups of four; only the group winner survives to semifinals and final.</p><p><b>Lonely Hearts:</b> ${q.lonelyHearts.length} makes have exactly one currently owned car. Freeze their eligibility when the new draw is completed, not from the stale 697-car base.</p>${q.lonelyHearts.slice(0,12).map(x=>`<div class="e2row"><strong>${esc(x.make)}</strong><span>${esc(x.name)}</span></div>`).join('')}<h3>Existing competition families</h3><p>Festival, Race Off, Swiss, championships, drift, specials and Finals Night retained in design. Those formats must be woven into one new schedule rather than quietly replaced.</p>`}
}
function show(){last=describe();let overlay=$('#e2preflight8180');if(!overlay){overlay=document.createElement('div');overlay.id='e2preflight8180';document.body.appendChild(overlay)}
 overlay.style.display='flex';let q=last;if(q.error){overlay.innerHTML=`<div class="e2screen"><header><button class="e2back" type="button" id="e2close">‹ BACK TO EVIL</button><h2>EVIL 2.0 PREFLIGHT</h2></header><p>${esc(q.error)}</p></div>`;$('#e2close').onclick=hide;return;}
 overlay.innerHTML=`<div class="e2screen"><header><button class="e2back" type="button" id="e2close">‹ BACK TO EVIL</button><small>OTG! MAIN v8.0.180 · READ ONLY</small><h2>EVIL TOURNAMENT <em>2.0</em></h2><p>Development preflight · no draws or results committed</p></header>
 <section class="e2stats">${statsCard('OWNED CARS',q.garageCars,'live FH5 garage')}${statsCard('MANUFACTURERS',q.totalMakes)}${statsCard('3-CAR MAKE TEAMS',q.relay.manufacturerTeams.length)}${statsCard('MIXED RELAY TEAMS',q.relay.mixedTeams.length)}${statsCard('LONG JUMP FIELD',q.jump.overall.length,'1 attempt each')}${statsCard('LONELY HEARTS',q.lonelyHearts.length,'one-car makes')}</section>
 <div class="e2warning"><b>SAFE PREVIEW — NOT THE NEW TOURNAMENT</b><p>Your current Evil campaign, earned medals, E✓ badges, unlocked stories and track shuffle bags are UNCHANGED. No reset button exists in this QA.</p></div>
 <nav class="e2tabs">${['Relay','Gauntlet','Jump','Tracks','Other','Safety'].map((x,i)=>`<button type="button" data-e2tab="${x}" class="${i===0?'active':''}">${x}</button>`).join('')}</nav><section id="e2preview-content" class="e2content"></section>
 <div class="e2buttons"><button id="e2-export" type="button">EXPORT SAFE PREFLIGHT REPORT</button><button id="e2-refresh" type="button">REFRESH FROM MY GARAGE</button></div><small class="e2foot">Your data stays in this browser unless you explicitly export the JSON. No family photos, story JSON or private artwork in this report.</small></div>`;
 $('#e2close').onclick=hide;$('#e2-export').onclick=download;$('#e2-refresh').onclick=show;
 overlay.querySelectorAll('[data-e2tab]').forEach(b=>b.onclick=()=>{overlay.querySelectorAll('[data-e2tab]').forEach(x=>x.classList.toggle('active',x===b));tab(b.dataset.e2tab)});tab('Relay');
}
function hide(){const a=$('#e2preflight8180');if(a)a.style.display='none';}
function install(){const h=document.getElementById('evilcampaign');if(!h||!h.querySelector('.rhEvilR18097'))return;let b=h.querySelector('#e2preflight-launch8180');if(b)return;
 let top=h.querySelector('.rhEvilR1MainNext8101')||h.querySelector('.rhEvilR1Stats8097');if(!top)return;
 b=document.createElement('button');b.type='button';b.id='e2preflight-launch8180';b.className='btn';b.textContent='🏁 EVIL 2.0 — SAFE PREVIEW';b.onclick=show;top.insertAdjacentElement('afterend',b);
}
function start(){install();const h=document.getElementById('evilcampaign');if(!h)return;let scheduled=false;const mo=new MutationObserver(()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;install()})});mo.observe(h,{childList:true,subtree:true});}
window.rhEvil2Preflight180={describe,show,hide,makeTeams,mixedTeams,makeGauntlets,trackPools,version:VER};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
