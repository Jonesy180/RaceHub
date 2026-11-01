/* OTG! MAIN v8.0.160 — SWISS CUP WAR ROOM.
 * Display-only view of existing FH5 Evil Tournament Swiss Cup records.
 * NEVER call rhSave, mutate saved objects, generate draws or advance rounds.
 */
(function(root){
  'use strict';
  const FH5='fh5-catalogue-v1',CAMPAIGN='evil-specialist-r1-20261014';
  const arr=v=>Array.isArray(v)?v:[];
  const str=v=>String(v??'');
  const eq=(a,b)=>str(a)===str(b);
  const esc=v=>str(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pad=n=>String(Number(n)||0).padStart(4,'0');
  const validTime=n=>n!==null&&n!==undefined&&n!==''&&Number.isFinite(Number(n))&&Number(n)>0;
  function fmt(n){if(!validTime(n))return '—';const ms=Math.round(Number(n)*1000);return `${String(Math.floor(ms/60000)).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}.${String(ms%1000).padStart(3,'0')}`;}
  const stageName=stage=>stage<=4?`SWISS ROUND ${stage}`:stage===5?'QUARTER-FINAL':stage===6?'SEMI-FINAL':'FINAL';
  function context(){
    const space=root.rhSpace?.(),qa=root.rhEvilR1QA8103;
    if(!space||space.catalogueKey!==FH5||space.evilCampaignR18098?.campaignId!==CAMPAIGN||typeof qa?.slots!=='function')return null;
    const slots=arr(qa.slots()).filter(s=>s.liveFormat==='SWISS'&&Number(s.swissStage8121)>=1&&Number(s.swissStage8121)<=7);
    const cups=new Map();for(const s of slots){let cup=cups.get(str(s.eventId));if(!cup){cup={id:str(s.eventId),name:str(s.event||s.eventId),visits:[]};cups.set(cup.id,cup)}cup.visits.push(s)}
    for(const cup of cups.values())cup.visits.sort((a,b)=>Number(a.swissStage8121)-Number(b.swissStage8121));
    const cars=new Map();for(const c of arr(root.rhEvilSpecialistR18097?.cars))cars.set(str(c.id),c);
    for(const c of arr(space.cars))cars.set(str(c.id),c);
    return {space,campaign:space.evilCampaignR18098,cups:[...cups.values()],cars};
  }
  function car(ctx,id){const c=ctx?.cars?.get(str(id));if(!c)return id==null?'—':`Car ${str(id)}`;
    try{if(typeof root.carName==='function')return str(root.carName(c))}catch(_){}
    return str(c.name||[c.year,c.make,c.model].filter(Boolean).join(' ')||id);
  }
  function findRun(ctx,cup){
    const candidates=arr(ctx?.space?.runs).filter(r=>r?.type==='evil-r1'&&r?.format==='swiss'&&eq(r.value,cup.id)&&r.v8Swiss&&!r.abandonedAt);
    if(!candidates.length)return {run:null,ambiguous:false};
    if(candidates.length===1)return {run:candidates[0],ambiguous:false};
    // A duplicated same-ID run can occur on older installations. Select only
    // if every other saved result is identically contained in the richest run.
    const k=r=>str(r?.id||'')+'|'+str(r?.carId||'')+'|'+str(r?.roundId||'')+'|'+str(r?.time||'');
    const copies=[...candidates].sort((a,b)=>arr(b.results).length-arr(a.results).length);
    const best=copies[0],known=new Set(arr(best.results).map(k));
    if(!copies.every(r=>eq(r.id,best.id)&&arr(r.results).every(x=>known.has(k(x)))))return {run:null,ambiguous:true};
    return {run:best,ambiguous:false};
  }
  function stageRecord(run,stage){if(!run?.v8Swiss)return null;
    return stage<=4?arr(run.v8Swiss.swissRounds)[stage-1]||null:arr(run.v8Swiss.ko?.rounds)[stage-5]||null;
  }
  function roundDetails(rd){
    const matches=arr(rd?.matches);
    const completeMatches=matches.filter(m=>m&&m.winnerId!=null&&validTime(m.resultA?.time)&&validTime(m.resultB?.time));
    const banked=matches.reduce((n,m)=>n+(validTime(m?.resultA?.time)?1:0)+(validTime(m?.resultB?.time)?1:0),0);
    const fullyRecorded=matches.length>0&&completeMatches.length===matches.length;
    return {matches,completeMatches,banked,fullyRecorded,complete:rd?.status==='complete'&&fullyRecorded};
  }
  function stageStatus(ctx,cup,run,stage){
    const visit=cup.visits.find(x=>Number(x.swissStage8121)===stage)||null,marked=!!ctx.campaign.done?.[str(visit?.slot)],rd=stageRecord(run,stage),detail=roundDetails(rd);
    let label='SCHEDULED';
    if(marked)label=detail.fullyRecorded||!run?'SLOT DONE':'SLOT DONE · CHECK SAVED RESULTS';
    else if(detail.complete)label='ROUND COMPLETE · SLOT NOT DONE';
    else if(detail.banked)label='IN PROGRESS';
    else if(rd?.status==='setup')label='SETUP / NOT RACED';
    else if(rd?.status==='racing')label='AWAITING RESULTS';
    return {visit,marked,rd,detail,label};
  }
  function standings(run){
    if(!run?.v8Swiss)return [];
    const ids=arr(run.entries),s=new Map();
    for(const id of ids){const key=str(id);if(!s.has(key))s.set(key,{id,wins:0,oppWins:0,time:0,opponents:[],bye:false,results:0});}
    for(const rd of arr(run.v8Swiss.swissRounds)){
      for(const m of arr(rd?.matches)){
        const a=s.get(str(m.carA)),b=s.get(str(m.carB));
        if(a&&validTime(m.resultA?.time)){a.time+=Number(m.resultA.time);a.results++;}
        if(b&&validTime(m.resultB?.time)){b.time+=Number(m.resultB.time);b.results++;}
        if(a&&b&&m.winnerId!=null&&validTime(m.resultA?.time)&&validTime(m.resultB?.time)&&
           (eq(m.winnerId,m.carA)||eq(m.winnerId,m.carB))){
          const w=s.get(str(m.winnerId));w.wins++;a.opponents.push(str(m.carB));b.opponents.push(str(m.carA));
        }
      }
      if(rd?.status==='complete'&&rd.byeId!=null){const b=s.get(str(rd.byeId));if(b){b.wins++;b.bye=true}}
    }
    for(const x of s.values())x.oppWins=x.opponents.reduce((total,id)=>total+(s.get(id)?.wins||0),0);
    return [...s.values()].sort((a,b)=>b.wins-a.wins||b.oppWins-a.oppWins||a.time-b.time||str(a.id).localeCompare(str(b.id)));
  }
  function swissStageComplete(run){return !!run&&arr(run.v8Swiss?.swissRounds).length>=4&&[0,1,2,3].every(i=>roundDetails(run.v8Swiss.swissRounds[i]).complete)}
  function qualified(ctx,cup,run){const stage4=cup.visits.find(x=>Number(x.swissStage8121)===4);
    return !!(stage4&&ctx.campaign.done?.[str(stage4.slot)]&&swissStageComplete(run));}
  function champion(ctx,cup,run){const last=cup.visits.find(x=>Number(x.swissStage8121)===7);
    if(!last||!ctx.campaign.done?.[str(last.slot)]||run?.status!=='complete')return null;
    const final=stageRecord(run,7),detail=roundDetails(final);
    const win=detail.completeMatches.length===1?detail.completeMatches[0].winnerId:null;
    return win!=null&&eq(win,run.v8Swiss?.championId)?win:null;
  }
  function aggregate(ctx,cup){
    const {run,ambiguous}=findRun(ctx,cup);
    const visits=cup.visits.map(s=>stageStatus(ctx,cup,run,Number(s.swissStage8121)));
    const done=visits.filter(v=>v.marked).length,next=visits.find(v=>!v.marked)||null;
    return {cup,run,ambiguous,visits,done,next,table:standings(run),cut:Number(run?.v8Swiss?.knockoutSize)||8,qualified:qualified(ctx,cup,run),champion:champion(ctx,cup,run)};
  }
  function sectionTitle(text,sub=''){return `<div class="wr160-h"><h2>${esc(text)}</h2>${sub?`<p>${esc(sub)}</p>`:''}</div>`;}
  const frame=(body,backLabel='BACK',backAction='data-wr-home')=>`<div class="rhEvilR18097 wr160"><button class="rhEvilR1Back8097" type="button" ${backAction}><span>‹</span><b>${esc(backLabel)}</b></button><header class="rhEvilR1Hero8097"><small>EVIL TOURNAMENT · READ ONLY</small><h1>SWISS WAR ROOM</h1><p>THE SEVEN-VISIT CAMPAIGNS</p><strong>MAIN v8.0.160 · NO ROUND CONTROLS</strong></header><main class="rhEvilR1Body8097">${body}</main></div>`;
  function listMarkup(ctx){
    return frame(`<section class="wr160-intro"><b>EVERY SWISS CUP, ONE PLACE.</b><p>Real schedule, saved match results and standings. A marked DONE visit remains complete even when the championship continues elsewhere.</p></section>`+
      ctx.cups.map(c=>{const d=aggregate(ctx,c);return `<button class="wr160-cup" data-wr-cup="${esc(c.id)}" type="button"><span><b>${esc(c.name)}</b><small>${d.done} / ${c.visits.length} visits marked DONE${d.next?` · Next scheduled slot ${pad(d.next.visit.slot)}`:' · All visits done'}</small></span><strong>VIEW ›</strong></button>`}).join('')+`<p class="wr160-legal">A read-only window into saved competitions. This screen cannot start a round, change a pairing or award a trophy.</p>`);
  }
  function tableMarkup(ctx,d){
    if(!d.table.length)return `<div class="wr160-empty">No frozen entrant standings recorded for this Cup yet.</div>`;
    const qualify=d.qualified;
    return `<section class="wr160-panel">${sectionTitle('SWISS STANDINGS',qualify?`Top ${d.cut} confirmed after four signed-off rounds`:`Wins → opponent wins → total time · ${d.visits.filter(v=>v.marked&&Number(v.visit?.swissStage8121)<=4).length} of 4 Swiss visits signed off`)}<div class="wr160-table">`+
      d.table.map((s,i)=>`<div class="wr160-standing"><b>${i+1}</b><span><strong>${esc(car(ctx,s.id))}</strong><small>${s.wins} W · OPP WINS ${s.oppWins} · TOTAL ${s.results?fmt(s.time):'—'}${s.bye?' · BYE ✓':''}</small></span>${qualify&&i<d.cut?'<em>QUALIFIED</em>':''}</div>`).join('')+`</div>${!qualify?'<p class="wr160-advisory">Standings are current, not final qualification. No Swiss Cup winner is awarded here.</p>':''}</section>`;
  }
  function visitsMarkup(d){return `<section class="wr160-panel">${sectionTitle('SCHEDULED VISITS','These slot numbers are taken from your actual Evil Tournament schedule.')}`+
    `<div class="wr160-visit-grid">${d.visits.map((v,i)=>`<button type="button" data-wr-stage="${i+1}" class="wr160-visit"><b>${esc(stageName(i+1))}</b><small>SLOT ${pad(v.visit?.slot)} · VISIT ${i+1}/7</small><span class="${v.marked?'done':''}">${esc(v.label)}</span></button>`).join('')}</div></section>`;}
  function roundMarkup(ctx,d,stage){
    const v=d.visits[stage-1];if(!v)return '';
    const rd=v.rd,detail=v.detail;
    let chunks=`<section class="wr160-panel wr160-round">${sectionTitle(stageName(stage),`Slot ${pad(v.visit?.slot)} · ${v.marked?'MARKED DONE':'NOT MARKED DONE'}${rd?.trackName?' · '+str(rd.trackName):''}`)}`;
    if(!rd||!detail.matches.length){chunks+=`<div class="wr160-empty">${v.marked?'This visit is marked DONE, but its individual saved match details are unavailable.':'No pairings recorded for this visit yet.'}</div>`;}
    else {chunks+=`<p class="wr160-count">${detail.completeMatches.length} / ${detail.matches.length} MATCHES COMPLETE · ${detail.banked} RESULT ENTRIES</p>`;
      chunks+=detail.matches.map((m,i)=>{
        const a=validTime(m.resultA?.time),b=validTime(m.resultB?.time),complete=a&&b&&m.winnerId!=null&&(eq(m.winnerId,m.carA)||eq(m.winnerId,m.carB));
        return `<div class="wr160-pair"><small>MATCH ${i+1} · ${complete?'COMPLETE':'WAITING'}</small><div class="${complete&&eq(m.winnerId,m.carA)?'winner':''}"><span>${esc(car(ctx,m.carA))}</span><b>${a?fmt(m.resultA.time):'—'}</b></div><div class="${complete&&eq(m.winnerId,m.carB)?'winner':''}"><span>${esc(car(ctx,m.carB))}</span><b>${b?fmt(m.resultB.time):'—'}</b></div>${complete?`<p>WINNER: ${esc(car(ctx,m.winnerId))}</p>`:''}</div>`;
      }).join('');
    }
    if(rd?.byeId!=null)chunks+=`<div class="wr160-bye">ROUND BYE: ${esc(car(ctx,rd.byeId))}${rd.status==='complete'?' · RECORDED':''}</div>`;
    chunks+=`</section>`;return chunks;
  }
  function detailMarkup(ctx,d,stage){
    const next=d.next?.visit;
    const summary=`<section class="wr160-intro"><h2>${esc(d.cup.name)}</h2><div class="wr160-stats"><div><small>VISITS DONE</small><b>${d.done} / 7</b></div><div><small>NEXT SWISS VISIT</small><b>${next?pad(next.slot):'—'}</b></div><div><small>ENTRANTS</small><b>${d.run?arr(d.run.entries).length:'—'}</b></div></div><p>${d.champion?`CHAMPION: ${esc(car(ctx,d.champion))}`:next?`The competition continues at Slot ${pad(next.slot)}. Finish only the current Evil Tournament visit when you reach it.`:'No champion shown unless the final has been verified and signed off.'}</p></section>`;
    const missing=d.ambiguous?'<section class="wr160-warning">Saved Swiss runs conflict. To protect your results, this view will not choose one arbitrarily. Do not reset or abandon anything.</section>':!d.run?'<section class="wr160-note">No saved Swiss Cup run found yet. Scheduled visits are shown without invented results.</section>':'';
    return frame(`<button type="button" class="wr160-localback" data-wr-list>← ALL SWISS CUPS</button>${summary}${missing}${visitsMarkup(d)}${!d.ambiguous&&d.run?tableMarkup(ctx,d):''}${!d.ambiguous&&d.run?roundMarkup(ctx,d,stage):''}<p class="wr160-legal">Swiss wins, opponent wins, total time and match results come from saved records. Round pointers, slot progress, and career honours are never changed here.</p><button type="button" class="wr160-localback" data-wr-list>← ALL SWISS CUPS</button>`,'BACK TO EVIL','data-wr-home');
  }
  const api={context,findRun,stageRecord,roundDetails,standings,stageStatus,aggregate,qualified,champion,listMarkup,detailMarkup};
  root.rhSwissWarRoomQA8160=api;
  if(typeof document==='undefined')return;
  const host=()=>document.getElementById('evilcampaign');
  let active=false,selected=null,stageSelected=1;
  function openList(){const ctx=context(),h=host();if(!ctx||!h)return;active=true;selected=null;
    try{root.show?.('evilcampaign')}catch(_){}h.innerHTML=listMarkup(ctx);root.scrollTo?.(0,0);}
  function openCup(id,stage){const ctx=context(),h=host();if(!ctx||!h)return;const cup=ctx.cups.find(x=>x.id===id);if(!cup)return openList();
    const d=aggregate(ctx,cup);active=true;selected=id;
    // Latest finished signed-off stage (not the advanced Swiss round pointer).
    if(stage==null){const last=d.visits.filter(x=>x.marked).at(-1);stageSelected=last?Number(last.visit.swissStage8121):1;}
    else stageSelected=Math.max(1,Math.min(7,Number(stage)||1));
    h.innerHTML=detailMarkup(ctx,d,stageSelected);
    const chosen=h.querySelector(`[data-wr-stage="${stageSelected}"]`);chosen?.setAttribute('aria-current','true');
    root.scrollTo?.(0,0);
  }
  function close(){active=false;selected=null;root.rhRenderEvilCampaignR18098?.();}
  function inject(){const h=host(),strip=h?.querySelector('.rhEvilR1Actions8097');if(!strip||strip.querySelector('[data-wr-open]'))return;
    const b=document.createElement('button');b.type='button';b.dataset.wrOpen='1';b.innerHTML='<span aria-hidden="true">🧀</span><b>SWISS WAR ROOM</b><small>Seven-visit schedules · standings · head-to-heads</small>';
    b.addEventListener('click',openList);strip.prepend(b);
  }
  function attach(){const h=host();if(!h||h.dataset.wr8160Attached)return;
    h.dataset.wr8160Attached='1';h.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!h.contains(b)||!active)return;
      if(b.hasAttribute('data-wr-home'))return close();
      if(b.hasAttribute('data-wr-list'))return openList();
      if(b.hasAttribute('data-wr-cup'))return openCup(b.dataset.wrCup);
      if(b.hasAttribute('data-wr-stage'))return openCup(selected,b.dataset.wrStage);
    });
    const observer=new MutationObserver(()=>{if(active&&!h.querySelector('.wr160'))active=false;if(!active)inject();});
    observer.observe(h,{childList:true,subtree:false});inject();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attach,{once:true});else attach();
})(typeof window==='undefined'?globalThis:window);
