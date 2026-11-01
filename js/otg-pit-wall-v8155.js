/* OTG! MAIN v8.0.155 Pit Wall — read-only racing archive. READ ONLY.
   Only finished Evil R1 slots; search only event title and slot number.
   No localStorage/sessionStorage writes, rhSave, event status changes, or result corrections.
*/
(function (root) {
  'use strict';
  const FH5='fh5-catalogue-v1', CAMPAIGN='evil-specialist-r1-20261014';
  const safe=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const same=(a,b)=>String(a??'')===String(b??'');
  const arr=v=>Array.isArray(v)?v:[];
  const finite=v=>v!==null&&v!==undefined&&v!==''&&Number.isFinite(Number(v));
  const pad=n=>String(Number(n)||0).padStart(4,'0');
  const fmtTime=v=>{
    if(!finite(v)||Number(v)<0)return '—'; const ms=Math.round(Number(v)*1000);
    return String(Math.floor(ms/60000)).padStart(2,'0')+':'+String(Math.floor(ms/1000)%60).padStart(2,'0')+'.'+String(ms%1000).padStart(3,'0');
  };
  const fmtScore=v=>finite(v)?Number(v).toLocaleString('en-GB'):'—';
  function context(){
    const space=root.rhSpace?.();const qa=root.rhEvilR1QA8103;
    if(!space||!qa||typeof qa.slots!=='function')return null;
    const state=space.evilCampaignR18098;
    if(space.catalogueKey!==FH5||state?.campaignId!==CAMPAIGN)return null;
    const slots=arr(qa.slots()).slice().sort((a,b)=>Number(a.slot)-Number(b.slot));
    const cars=new Map();for(const c of arr(root.rhEvilSpecialistR18097?.cars))cars.set(String(c.id),c);
    for(const c of arr(space.cars))cars.set(String(c.id),c);
    return {space,state,slots,cars};
  }
  function carName(ctx,id,snapshot){
    if(snapshot?.name)return String(snapshot.name);
    const c=ctx.cars.get(String(id));
    if(c){if(typeof root.carName==='function'){try{return root.carName(c)}catch(_){}}
      return c.name||[c.year,c.make,c.model].filter(Boolean).join(' ')||String(id);}
    return id===null||id===undefined?'Unknown competitor':String(id);
  }
  function completed(ctx){
    const done=ctx.state.done||{};
    return ctx.slots.filter(s=>Object.prototype.hasOwnProperty.call(done,String(s.slot))&&!!done[String(s.slot)])
      .map(s=>({...s,doneAt:done[String(s.slot)]?.doneAt||null}))
      .sort((a,b)=>Number(b.slot)-Number(a.slot));
  }
  function searchSlots(slots,query){
    const raw=String(query||'').trim().toLocaleLowerCase();
    if(/^\d+$/.test(raw)){const exact=slots.filter(s=>Number(s.slot)===Number(raw));if(exact.length)return exact;}
    const terms=raw.split(/\s+/).filter(Boolean);
    return !terms.length?slots:slots.filter(s=>{const hay=[String(s.slot),pad(s.slot),String(s.event||'')].join(' ').toLocaleLowerCase();return terms.every(t=>hay.includes(t));});
  }
  function visitWindow(s,slots){
    const group=slots.filter(x=>same(x.eventId,s.eventId));
    const prior=group.filter(x=>Number(x.slot)<Number(s.slot));
    const before=prior.reduce((sum,x)=>sum+(Number(x.workload)||0),0);
    const current=Number(s.workload)||0;
    const index=prior.length;
    return {before,current,index,total:group.length,final:index===group.length-1};
  }
  function matchesAsRows(ctx,matches,track,group){
    const rows=[],pairs=[];
    for(const [i,m] of arr(matches).entries()){
      const a=m.carA?.sourceCarId??m.carA?.id??m.carA??m.a;
      const b=m.carB?.sourceCarId??m.carB?.id??m.carB??m.b;
      const left=m.resultA,right=m.resultB;
      const first=left?{id:String(a),car:carName(ctx,a,m.carA),time:left.time,score:null,track:track||left.track||'',group:group||'',source:left}:null;
      const second=right?{id:String(b),car:carName(ctx,b,m.carB),time:right.time,score:null,track:track||right.track||'',group:group||'',source:right}:null;
      if(first)rows.push(first);if(second)rows.push(second);
      pairs.push({name:m.label||`PAIR ${i+1}`,first,second,winner:m.winnerId??m.winnerCarId??null});
    }
    return {rows,pairs};
  }
  function report(ctx,s){
    const w=visitWindow(s,ctx.slots),notes=[],rows=[],pairs=[],groups=[];
    const run=[...arr(ctx.space.runs)].reverse().find(r=>r?.type==='evil-r1'&&same(r.value,s.eventId)&&!r.abandonedAt);
    const ro=[...arr(ctx.space.raceOffs)].reverse().find(r=>r?.type==='evil-r1'&&same(r.value,s.eventId)&&r.status!=='abandoned');
    const drift=ctx.state.driftEvents?.[s.eventId];
    const addResult=(r,track,group)=>{
      if(!r)return;
      rows.push({id:String(r.carId??r.car?.sourceCarId??r.car?.id??''),car:carName(ctx,r.carId??r.car?.sourceCarId??r.car?.id,r.car),time:finite(r.time)?Number(r.time):null,score:finite(r.score)?Number(r.score):null,track:String(track||r.track||r.roundName||''),group:String(group||''),source:r});
    };
    if(s.liveFormat==='SWISS'){
      const stage=Number(s.swissStage8121)||w.index+1;
      const rd=stage<=4?run?.v8Swiss?.swissRounds?.[stage-1]:run?.v8Swiss?.ko?.rounds?.[stage-5];
      if(rd){const p=matchesAsRows(ctx,rd.matches,rd.trackName||'',rd.label||'SWISS');rows.push(...p.rows);pairs.push(...p.pairs)}
      else notes.push('Saved Swiss pairing detail was not found for this visit.');
      groups.push({title:stage<=4?`SWISS ROUND ${stage} OF 4`:stage===5?'QUARTER-FINAL':stage===6?'SEMI-FINAL':'FINAL',label:rd?.trackName||'',rows:rows.slice(),pairs:pairs.slice()});
    }else if(s.liveFormat==='DRIFT SCORE'){
      const n=Math.max(1,arr(root.rhEvilR1QA8103?.events?.()?.[s.eventId]?.eligibleIds).length||Number(s.eligible)||1);
      const start=Math.floor(w.before/n),end=Math.ceil((w.before+w.current)/n);
      for(const rd of arr(drift?.rounds).filter(x=>Number(x.index)>start&&Number(x.index)<=end)){
        const part=[];for(const [id,score] of Object.entries(rd.scores||{})){
          if(!finite(score))continue;
          const row={id:String(id),car:carName(ctx,id),time:null,score:Number(score),track:rd.zone||'',group:`ROUND ${rd.index}`,source:null};rows.push(row);part.push(row);
        }
        groups.push({title:`ROUND ${rd.index}`,label:rd.zone||'',rows:part,pairs:[]});
      }
    }else if(s.liveFormat==='DRIFT KNOCKOUT'){
      const all=arr(drift?.rounds).flatMap(r=>arr(r.matches).map(m=>({m,round:r}))),from=Math.floor(w.before/2),to=from+Math.ceil(w.current/2);
      for(const {m,round} of all.slice(from,to)){
        const a=m.a,b=m.b;const first=finite(m.scoreA)?{id:String(a),car:carName(ctx,a),score:Number(m.scoreA),time:null,track:m.zone||round.zone||'',group:round.label||'',source:null}:null;
        const second=finite(m.scoreB)?{id:String(b),car:carName(ctx,b),score:Number(m.scoreB),time:null,track:m.zone||round.zone||'',group:round.label||'',source:null}:null;
        if(first)rows.push(first);if(second)rows.push(second);
        pairs.push({name:round.label||'DRIFT PAIR',first,second,winner:m.winnerId});
      }
    }else if(s.mode==='Race Off'){
      const all=arr(ro?.rounds).flatMap(rd=>arr(rd.matches).map(m=>({m,rd}))),from=Math.floor(w.before/2),to=from+Math.ceil(w.current/2);
      for(const {m,rd} of all.slice(from,to)){
        const p=matchesAsRows(ctx,[m],rd.name||rd.trackName||'',rd.drawPlan?.label||rd.label||'');rows.push(...p.rows);pairs.push(...p.pairs);
      }
    }else if(s.liveFormat==='GROUPS'){
      const match=String(s.doNow||'').match(/STAGE\s+(\d+)\s+GROUP\s+(\d+)/i);
      const final=/RUN THE FINAL/i.test(String(s.doNow||''));
      const group=arr(run?.v8Groups?.completedGroups).find(g=>final?!!g.final:match&&Number(g.stage)===Number(match[1])&&Number(g.index)===Number(match[2]));
      if(group){const ids=new Set(arr(group.rounds).map(rd=>String(rd.id)));
        const chosen=arr(run?.results).filter(r=>same(r.v8GroupId??r.groupId,group.id)&&(!ids.size||ids.has(String(r.roundId))));
        for(const r of chosen){const rd=arr(group.rounds).find(x=>same(x.id,r.roundId));addResult(r,rd?.name,`STAGE ${group.stage||'?'} · GROUP ${group.index||'FINAL'}`)}
        groups.push({title:final?'FINAL':`STAGE ${group.stage} · GROUP ${group.index}`,label:arr(group.rounds).map(x=>x.name).filter(Boolean).join(' / '),rows:rows.slice(),pairs:[]});
      }else notes.push('Saved group detail could not be matched confidently to this visit.');
    }else{
      const count=arr(run?.entries).length||Math.max(1,Number(s.eligible)||1);
      const from=Math.floor(w.before/count),to=Math.ceil((w.before+w.current)/count);
      const rounds=arr(run?.rounds).slice(from,to),ids=new Set(rounds.map(r=>String(r.id)));
      const chosen=arr(run?.results).filter(r=>ids.has(String(r.roundId)));
      for(const r of chosen){const rd=rounds.find(x=>same(x.id,r.roundId));addResult(r,rd?.name||r.roundName)}
      for(const rd of rounds)groups.push({title:rd.name||'RACE',label:'',rows:rows.filter(r=>r.source&&same(r.source.roundId,rd.id)),pairs:[]});
      if(!rounds.length)notes.push('Saved round detail was not found for this slot.');
    }
    if(!rows.length&&!notes.length)notes.push('No individual results are available in the saved records for this slot.');
    const final=w.final&&((s.mode==='Race Off'&&(s.liveFormat==='DRIFT KNOCKOUT'?!!drift?.complete:ro?.status==='complete'))||
      (s.liveFormat==='SWISS'?run?.status==='complete':(s.liveFormat==='DRIFT SCORE'?true:run?.status==='complete')));
    const high=highlights(rows,pairs);
    const doneAt=ctx.state.done?.[String(s.slot)]?.doneAt||null;
    return {slot:Number(s.slot),event:s.event||'Unnamed event',mode:s.mode||'',format:s.liveFormat||'',visit:s.visit||'',doneAt,final:!!final,multiVisit:w.total>1,results:rows,pairs,groups,highlights:high,notes};
  }
  function highlights(rows,pairs){
    const out=[],validTimes=rows.filter(r=>finite(r.time)&&Number(r.time)>0),validScores=rows.filter(r=>finite(r.score));
    if(validTimes.length){
      const routes=new Set(validTimes.map(r=>[r.group,r.track,r.source?.roundId??''].join('|')));
      if(routes.size===1){const fastest=validTimes.reduce((a,b)=>Number(a.time)<=Number(b.time)?a:b);
      out.push({head:'QUICKEST RECORDED ENTRY',body:`${fastest.car} — ${fmtTime(fastest.time)}${fastest.track?' · '+fastest.track:''}`});}
      else out.push({head:'RECORDED RACING',body:`${validTimes.length} times across ${routes.size} separate race/round groups. Times from different routes are not ranked together.`});
    }else if(validScores.length){const best=validScores.reduce((a,b)=>Number(a.score)>=Number(b.score)?a:b);
      out.push({head:'HIGHEST DRIFT SCORE',body:`${best.car} — ${fmtScore(best.score)}${best.track?' · '+best.track:''}`});}
    const gaps=arr(pairs).filter(p=>p.first&&p.second&&finite(p.first.time)&&finite(p.second.time)).map(p=>({p,g:Math.abs(Number(p.first.time)-Number(p.second.time))}));
    if(!gaps.length){
      // Only compare within exactly the same track/round; never compare different routes.
      const sets=new Map();for(const r of validTimes){const key=[r.group,r.track,r.source?.roundId??''].join('|');if(!sets.has(key))sets.set(key,[]);sets.get(key).push(r)}
      for(const set of sets.values()){const x=set.slice().sort((a,b)=>Number(a.time)-Number(b.time));for(let i=1;i<x.length;i++)gaps.push({p:{first:x[i-1],second:x[i]},g:Number(x[i].time)-Number(x[i-1].time)})}
    }
    if(gaps.length){const best=gaps.reduce((a,b)=>a.g<=b.g?a:b);out.push({head:'CLOSEST RECORDED BATTLE',body:`${best.p.first.car} / ${best.p.second.car} — ${fmtTime(best.g)} apart`})}
    if(rows.length)out.push({head:'RESULTS RETAINED',body:`${rows.length} recorded ${validScores.length?'scores':'times'} available for this visit.`});
    return out;
  }
  const api={context,completed,searchSlots,visitWindow,report,fmtTime,highlights};
  root.rhPitWallMain8155=api;
  if(typeof document==='undefined')return;
  let active=false,lastSearch='';
  function host(){return document.getElementById('evilcampaign')}
  function inject(){
    const ctx=context(),h=host();if(!ctx||!h||ctx.space.catalogueKey!==FH5)return;
    const action=h.querySelector('.rhEvilR1Actions8097');if(!action||action.querySelector('[data-pitwall-open]'))return;
    const b=document.createElement('button');b.type='button';b.dataset.pitwallOpen='1';b.innerHTML='<span aria-hidden="true">📺</span><b>THE PIT WALL</b><small>Completed slot reports · search by title or slot</small>';
    b.addEventListener('click',()=>open(false));action.prepend(b);
  }
  function open(preserveSearch=false){const ctx=context(),h=host();if(!ctx||!h)return;active=true;if(!preserveSearch)lastSearch='';try{root.show?.('evilcampaign')}catch(_){};
    h.innerHTML=`<div class="rhEvilR18097 pw8155"><button class="rhEvilR1Back8097" type="button" data-pw-back><span>‹</span><b>BACK</b></button><header class="rhEvilR1Hero8097"><small>EVIL TOURNAMENT · MAIN v8.0.155</small><h1>THE PIT WALL</h1><p>PERMANENT RACE REPORTS</p><strong>READ ONLY · NO RESULTS CAN BE CHANGED</strong></header><main class="rhEvilR1Body8097"><section class="pw8155-intro"><b>EVERY FINISHED SLOT, ONE REPORT.</b><p>Search by event name or slot number. Results are read directly from saved racing records; unavailable history is never invented.</p></section><label class="pw8155-label" for="pw8155-search">FIND A COMPLETED SLOT</label><input id="pw8155-search" class="pw8155-search" type="search" autocomplete="off" placeholder="e.g. Ferrari Race Off or 20"><div id="pw8155-list" aria-live="polite"></div></main></div>`;
    const inp=document.getElementById('pw8155-search');if(inp)inp.value=lastSearch;renderList();root.scrollTo?.(0,0);
  }
  function renderList(){const ctx=context(),container=document.getElementById('pw8155-list');if(!ctx||!container)return;
    const rows=searchSlots(completed(ctx),lastSearch);
    container.innerHTML=`<p class="pw8155-count">${rows.length} COMPLETED SLOT${rows.length===1?'':'S'} ${lastSearch?'MATCH':'RECORDED'}</p>`+(rows.length?rows.map(s=>`<button type="button" class="pw8155-report-link" data-pw-view="${Number(s.slot)}"><span class="pw8155-slot">${pad(s.slot)}</span><span class="pw8155-title"><b>${safe(s.event)}</b><small>${safe(s.liveFormat||s.mode||'')} · ${safe(s.visit||'VISIT 1')}</small></span><strong>VIEW ›</strong></button>`).join(''):'<div class="pw8155-empty">No completed slots match that title or number.</div>');
  }
  function grouped(reportData){
    const r=reportData;const chunks=[];
    if(r.pairs.length){
      chunks.push(`<section class="pw8155-panel"><h2>PAIRINGS & RESULTS</h2>${r.pairs.map(p=>`<div class="pw8155-pair"><small>${safe(p.name)}</small><div><span>${safe(p.first?.car||'—')}</span><strong>${p.first?(finite(p.first.time)?fmtTime(p.first.time):fmtScore(p.first.score)):'—'}</strong></div><div><span>${safe(p.second?.car||'—')}</span><strong>${p.second?(finite(p.second.time)?fmtTime(p.second.time):fmtScore(p.second.score)):'—'}</strong></div></div>`).join('')}</section>`);
    }else if(r.groups.length){
      for(const group of r.groups){chunks.push(`<section class="pw8155-panel"><h2>${safe(group.title)}</h2><p class="pw8155-sub">${safe(group.label)}</p>${resultTable(group.rows)}</section>`)}
    }else if(r.results.length)chunks.push(`<section class="pw8155-panel"><h2>OFFICIAL RESULTS</h2>${resultTable(r.results)}</section>`);
    return chunks.join('');
  }
  function resultTable(rows){
    if(!rows.length)return '<p class="pw8155-sub">No individual times or scores saved for this round.</p>';
    return `<div class="pw8155-result-table">${rows.map(x=>`<div class="pw8155-result"><span>${safe(x.car)}</span><strong>${finite(x.time)?fmtTime(x.time):fmtScore(x.score)}</strong></div>`).join('')}</div>`;
  }
  function view(n){const ctx=context(),h=host();if(!ctx||!h)return;
    const s=completed(ctx).find(s=>Number(s.slot)===Number(n));if(!s)return open(true);const r=report(ctx,s);
    h.innerHTML=`<div class="rhEvilR18097 pw8155"><button type="button" class="rhEvilR1Back8097" data-pw-list><span>‹</span><b>ALL REPORTS</b></button><header class="rhEvilR1Hero8097 slot"><small>PIT WALL · COMPLETED SLOT</small><h1>SLOT ${pad(r.slot)}</h1><p>${safe(r.event)}</p><strong>${r.multiVisit?(r.final?'COMPETITION COMPLETED':'THIS VISIT COMPLETE · COMPETITION CONTINUES'):'SLOT COMPLETE'}</strong></header><main class="rhEvilR1Body8097"><section class="pw8155-intro"><b>${safe(r.format||r.mode)} · ${safe(r.visit||'VISIT 1')}</b><p>${r.doneAt?'Marked done: '+safe(new Date(r.doneAt).toLocaleDateString('en-GB')):'Completed visit'} · Results are read-only.</p></section>${grouped(r)}${r.highlights.length?`<section class="pw8155-panel"><h2>📺 PIT WALL ANALYSIS</h2>${r.highlights.map(x=>`<div class="pw8155-highlight"><small>${safe(x.head)}</small><p>${safe(x.body)}</p></div>`).join('')}<p class="pw8155-sub">Times from different tracks are not treated as directly comparable. AI finishing positions never count as career honours.</p></section>`:''}${r.notes.map(x=>`<section class="pw8155-note">${safe(x)}</section>`).join('')}<button type="button" class="pw8155-bottom-back" data-pw-list>← BACK TO REPORTS</button></main></div>`;root.scrollTo?.(0,0);
  }
  function back(){active=false;root.rhRenderEvilCampaignR18098?.();}
  function attach(){const h=host();if(!h||h.dataset.pw8155Attached)return;
    h.dataset.pw8155Attached='1';h.addEventListener('click',e=>{const target=e.target.closest('button');if(!target||!h.contains(target))return;
      if(target.hasAttribute('data-pw-back'))return back();if(target.hasAttribute('data-pw-list'))return open(true);
      if(target.hasAttribute('data-pw-view'))return view(target.getAttribute('data-pw-view'));
    });
    h.addEventListener('input',e=>{if(e.target?.id==='pw8155-search'){lastSearch=e.target.value;renderList()}});
    const obs=new MutationObserver(()=>{if(active&&!h.querySelector('.pw8155'))active=false;if(!active)inject();});obs.observe(h,{childList:true,subtree:false});inject();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attach,{once:true});else attach();
})(typeof window==='undefined'?globalThis:window);
