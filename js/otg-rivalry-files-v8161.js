/* OTG! MAIN v8.0.161 — RIVALRY FILES.
 * Read-only career records; reuses the existing v8.0.126 verified rivalry collector.
 * Never saves state, creates a tournament, awards medals, or alters a completed slot.
 */
(function(root){
 'use strict';
 const arr=x=>Array.isArray(x)?x:[];
 const val=x=>String(x??'');
 const eq=(a,b)=>val(a)===val(b);
 const esc=x=>val(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const id=x=>val(x&&typeof x==='object'?(x.sourceCarId??x.id??x.carId??''):x);
 const positive=x=>x!==null&&x!==undefined&&x!==''&&Number.isFinite(Number(x))&&Number(x)>0;
 const ms=x=>Math.round(Number(x)*1000);
 const pair=(a,b)=>[id(a),id(b)].sort().join('¦');
 const fmtGap=n=>Number.isFinite(Number(n))?`${Number(n).toFixed(3)}s`:'—';
 const dateText=x=>{const t=Date.parse(x||'');return Number.isFinite(t)?new Date(t).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):'Date not recorded';};
 const label=(space,carId)=>{const car=arr(space?.cars).find(x=>eq(x.id,carId))||arr(root.rhEvilSpecialistR18097?.cars).find(x=>eq(x.id,carId));
   if(!car)return `Car ${carId}`;
   try{if(typeof root.carName==='function')return val(root.carName(car))}catch(_){}
   return val(car.name||[car.year,car.make,car.model].filter(Boolean).join(' ')||carId);
 };
 function currentSpace(){try{return root.rhSpace?.()||null}catch(_){return null}}
 function legacyMeetings(space){
   let items=[];try{items=arr(root.otgLegendsQA8118?.rivalryMeetings?.(space))}catch(e){return []}
   const swissIds=new Set(arr(space?.runs).filter(r=>r?.v8Swiss).map(r=>val(r.id)));
   return items.filter(m=>m&&id(m.a)&&id(m.b)&&id(m.a)!==id(m.b)&&
     !(m.kind==='FESTIVAL'&&swissIds.has(val(m.eventId)))&&
     Number.isFinite(Number(m.gap))&&Number(m.gap)>=0).map(m=>({...m,a:id(m.a),b:id(m.b),key:pair(m.a,m.b)}));
 }
 // Evil Swiss is stored as Swiss match records, rather than ordinary Festival races.
 // Read ONLY signed-off visits from the existing, phone-tested War Room resolver.
 function evilSwissMeetings(space){
   const qa=root.rhSwissWarRoomQA8160,ctx=qa?.context?.();
   if(!ctx||!eq(ctx.space?.id,space?.id))return [];
   const out=[];
   for(const cup of arr(ctx.cups)){
     const resolved=qa.findRun(ctx,cup);if(resolved.ambiguous||!resolved.run)continue;
     for(const v of arr(cup.visits)){
       const stage=Number(v.swissStage8121);
       if(!Number.isInteger(stage)||stage<1||stage>7||!ctx.campaign?.done?.[val(v.slot)])continue;
       const rd=qa.stageRecord(resolved.run,stage);
       for(const [i,m] of arr(rd?.matches).entries()){
         const a=id(m?.carA),b=id(m?.carB),win=id(m?.winnerId);
         if(!a||!b||a===b||!positive(m?.resultA?.time)||!positive(m?.resultB?.time)||!win)continue;
         const aMs=ms(m.resultA.time),bMs=ms(m.resultB.time);
         if(aMs===bMs||!eq(win,aMs<bMs?a:b))continue; // fail closed on contradictory winners
         out.push({id:`evil-swiss:${cup.id}:${stage}:${val(m.id||i)}`,key:pair(a,b),a,b,winner:win,
           gap:Math.abs(aMs-bMs)/1000,kind:stage<=4?'SWISS':'SWISS KNOCKOUT',event:val(cup.name),
           track:val(rd?.trackName),date:val(rd?.completedAt||m.resultB?.date||m.resultA?.date),
           slot:Number(v.slot),races:1});
       }
     }
   }
   return out;
 }
 function collect(space){
   if(!space)return [];
   const all=legacyMeetings(space).concat(evilSwissMeetings(space));
   const result=[],seen=new Set();
   for(const m of all){const unique=val(m.id);if(!unique||seen.has(unique))continue;seen.add(unique);result.push(m)}
   return result;
 }
 function aggregate(space){
   const grouped=new Map();
   for(const m of collect(space)){
     const [a,b]=m.key.split('¦');if(!a||!b)continue;
     let r=grouped.get(m.key);
     if(!r){r={key:m.key,a,b,nameA:label(space,a),nameB:label(space,b),meetings:0,aWins:0,bWins:0,ties:0,closest:Infinity,history:[]};grouped.set(m.key,r)}
     r.meetings++;
     if(eq(m.winner,a))r.aWins++;else if(eq(m.winner,b))r.bWins++;else r.ties++;
     r.closest=Math.min(r.closest,Number(m.gap));r.history.push(m);
   }
   return [...grouped.values()].sort((x,y)=>y.meetings-x.meetings||x.closest-y.closest||x.nameA.localeCompare(y.nameA,'en-GB')||x.nameB.localeCompare(y.nameB,'en-GB'));
 }
 function filterFiles(rows,q,repeated=false){
   const terms=val(q).trim().toLocaleLowerCase('en-GB').split(/\s+/).filter(Boolean);
   return rows.filter(r=>(!repeated||r.meetings>=2)&&terms.every(t=>(r.nameA+' '+r.nameB).toLocaleLowerCase('en-GB').includes(t)));
 }
 function summaryRow(r){
   return `<button type="button" class="rv161-file" data-rv-file="${esc(r.key)}"><div class="rv161-filetag">${r.meetings>=2?'ESTABLISHED RIVALRY':'FIRST MEETING'} · ${r.meetings} MEETING${r.meetings!==1?'S':''}</div><strong>${esc(r.nameA)}</strong><small>VERSUS</small><strong>${esc(r.nameB)}</strong><div class="rv161-score"><span>${r.aWins} — ${r.bWins}${r.ties?' · '+r.ties+' DRAWN':''}</span><span>Closest ${fmtGap(r.closest)}</span></div><span class="rv161-view">OPEN FILE ›</span></button>`;
 }
 function detailPage(space,r){
   const list=[...r.history].sort((a,b)=>{const x=Date.parse(a.date||'')||0,y=Date.parse(b.date||'')||0;return y-x});
   const rows=list.map(m=>`<article class="rv161-meeting"><div><small>${esc(m.kind||'RACING')} · ${esc(dateText(m.date))}${m.slot?' · SLOT '+String(m.slot).padStart(4,'0'):''}</small><strong>${esc(m.event||'Unnamed event')}</strong><p>${esc(m.track||'Track not recorded')}</p></div><div class="rv161-result"><b>${esc(m.winner?label(space,m.winner):'TIED')}</b><small>${m.winner?'FASTER RECORDED TIME':'NO DECISIVE TIME'} · ${fmtGap(m.gap)} gap</small></div></article>`).join('');
   return `<div class="rv161-wrap"><button type="button" class="rv161-back" data-rv-list>← ALL RIVALRIES</button><section class="rv161-head"><small>OTG! · VERIFIED RACING HISTORY</small><h1>RIVALRY FILE</h1><p>${esc(space?.name||'Current Space')} · ${r.meetings} documented meeting${r.meetings!==1?'s':''}</p></section>
     <section class="rv161-duel"><div><small>CAR A</small><h2>${esc(r.nameA)}</h2><b>${r.aWins} WIN${r.aWins!==1?'S':''}</b></div><span>VS</span><div><small>CAR B</small><h2>${esc(r.nameB)}</h2><b>${r.bWins} WIN${r.bWins!==1?'S':''}</b></div></section>
     <div class="rv161-stats"><div><small>MEETINGS</small><b>${r.meetings}</b></div><div><small>DRAWN</small><b>${r.ties}</b></div><div><small>CLOSEST GAP</small><b>${fmtGap(r.closest)}</b></div></div>
     <section class="rv161-panel"><h2>RECORDED MEETINGS</h2>${rows}</section>
     <section class="rv161-panel rv161-plan"><h2>⚔️ SETTLE THE SCORE</h2><p>Want to stage a rematch? These are the two cars from your saved rivalry. A future optional event builder can turn them into a separate mini-event without changing Evil Tournament results.</p><button type="button" data-rv-plan>VIEW REMATCH IDEA ›</button><div data-rv-plan-body hidden><p><b>${esc(r.nameA)}</b> versus <b>${esc(r.nameB)}</b></p><p>Suggested independent challenge: best of three races on three chosen routes. Use a separate Custom event; no result or tournament is created here.</p></div></section>
     <p class="rv161-note">Timing-based comparison from saved matches or the same Festival competition. An individual Festival's shared routes count as one competition meeting. Not game-AI finishing positions. Read-only; no racing data is modified.</p><button type="button" class="rv161-back" data-rv-list>← ALL RIVALRIES</button></div>`;
 }
 function listPage(space,rows){
   const established=rows.filter(r=>r.meetings>=2).length;
   return `<div class="rv161-wrap"><button type="button" class="rv161-back" data-rv-close>← BACK TO STATS</button><section class="rv161-head"><small>ONE SPACE · REAL RECORDED BATTLES</small><h1>⚔️ RIVALRY FILES</h1><p>${esc(space?.name||'Current Space')} · ${rows.length} recorded matchups · ${established} repeat rivalries</p></section>
     <div class="rv161-search"><label for="rv161-query">FIND A RIVALRY BY CAR NAME</label><input id="rv161-query" type="search" autocomplete="off" placeholder="e.g. McLaren, Ferrari, Nissan"/><div class="rv161-filters"><button type="button" data-rv-filter="all" aria-pressed="true">ALL MATCHUPS</button><button type="button" data-rv-filter="repeated" aria-pressed="false">REPEAT RIVALS</button></div><p class="rv161-subline" data-rv-count></p></div>
     <div class="rv161-list" data-rv-results></div><p class="rv161-note">Rivalries are based on saved comparable racing results within this Space. Same competition and pairings only, never unrelated tracks. A rematch plan does not create an event.</p><button type="button" class="rv161-back" data-rv-close>← BACK TO STATS</button></div>`;
 }
 const api={legacyMeetings,evilSwissMeetings,collect,aggregate,filterFiles,label,detailPage,listPage};
 root.otgRivalryFilesQA8161=api;
 if(typeof document==='undefined')return;
 let active=false,origin='stats',space=null,rows=[],filter='all',query='';
 const host=()=>document.getElementById('more');
 function paintRows(){const h=host();if(!h||!active)return;
   const match=filterFiles(rows,query,filter==='repeated');const container=h.querySelector('[data-rv-results]');if(!container)return;
   container.innerHTML=match.length?match.slice(0,120).map(summaryRow).join(''):'<div class="rv161-empty">No matching recorded rivalries yet. Try another car or ALL MATCHUPS.</div>';
   const count=h.querySelector('[data-rv-count]');if(count)count.textContent=`Showing ${Math.min(match.length,120)} of ${match.length} matching files${match.length>120?' · search to narrow the list':''}`;
   for(const b of h.querySelectorAll('[data-rv-filter]'))b.setAttribute('aria-pressed',String(b.dataset.rvFilter===filter));
 }
 function open(originScreen='stats'){
   space=currentSpace();if(!space)return;
   rows=aggregate(space);origin=originScreen;filter='all';query='';
   // Navigating here from Garage can re-render STATS; mark active only after
   // show('more') returns so the normal Stats render does not clear our state.
   try{if(originScreen==='garage')root.show?.('more')}catch(_){}
   const h=host();if(!h)return;active=true;h.innerHTML=listPage(space,rows);paintRows();h.scrollTop=0;root.scrollTo?.(0,0);
 }
 function close(){active=false;const from=origin;origin='stats';
   if(from==='garage'){try{root.show?.('garage')}catch(_){}return}
   if(typeof root.rhRenderStats==='function')root.rhRenderStats();else root.show?.('more');
 }
 function openFile(key){const r=rows.find(x=>x.key===key),h=host();if(!r||!h)return;
   h.innerHTML=detailPage(space,r);h.scrollTop=0;root.scrollTo?.(0,0);
 }
 function backList(){const h=host();if(!h)return;h.innerHTML=listPage(space,rows);h.querySelector('#rv161-query').value=query;paintRows();h.scrollTop=0;root.scrollTo?.(0,0)}
 function injectStats(){const h=host();if(!h||active||h.querySelector('#otgRivalryTile8161')||!h.querySelector('.v7StatsScene'))return;
   const b=document.createElement('button');b.type='button';b.id='otgRivalryTile8161';b.className='rv161-tile';b.innerHTML='<span aria-hidden="true">⚔️</span><span><strong>RIVALRY FILES</strong><small>Every verified matchup · head-to-head history</small><em>OPEN THE ARCHIVE ›</em></span>';
   b.addEventListener('click',()=>open('stats'));
   (h.querySelector('#otgLegendsTile8118')||h.querySelector('.v7StatsCards')||h.querySelector('.v7StatsScene')).insertAdjacentElement('afterend',b);
 }
 function injectGarage(){const g=document.getElementById('garage'),section=g?.querySelector('.otgIntel8122');if(!section||section.querySelector('.rv161-garage-link'))return;
   const b=document.createElement('button');b.type='button';b.className='rv161-garage-link';b.textContent='⚔️ OPEN RIVALRY FILES ›';b.addEventListener('click',()=>open('garage'));section.appendChild(b);
 }
 function attach(){const h=host(),g=document.getElementById('garage');
   if(h&&!h.dataset.rv161Attached){h.dataset.rv161Attached='1';h.addEventListener('click',e=>{if(!active)return;const b=e.target.closest('button');if(!b||!h.contains(b))return;
       if(b.hasAttribute('data-rv-close'))return close();if(b.hasAttribute('data-rv-list'))return backList();
       if(b.hasAttribute('data-rv-file'))return openFile(b.dataset.rvFile);
       if(b.hasAttribute('data-rv-filter')){filter=b.dataset.rvFilter;return paintRows()}
       if(b.hasAttribute('data-rv-plan')){const plan=h.querySelector('[data-rv-plan-body]');if(plan)plan.hidden=!plan.hidden}
     });h.addEventListener('input',e=>{if(active&&e.target.id==='rv161-query'){query=e.target.value;paintRows()}});
   }
   injectStats();injectGarage();
   if(g&&typeof MutationObserver!=='undefined'){let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;(root.requestAnimationFrame||((fn)=>setTimeout(fn,16)))(()=>{queued=false;injectGarage()})}).observe(g,{childList:true,subtree:true})}
 }
 const oldStats=root.rhRenderStats;if(typeof oldStats==='function')root.rhRenderStats=function(...args){const out=oldStats.apply(this,args);active=false;injectStats();return out};
 const oldMore=root.rhRenderMore;if(typeof oldMore==='function')root.rhRenderMore=function(...args){const out=oldMore.apply(this,args);if(!active)injectStats();return out};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attach,{once:true});else attach();
})(typeof window==='undefined'?globalThis:window);
