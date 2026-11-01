/* OTG! MAIN 8.0.159 — THE CAREER MUSEUM.
 * Read-only exhibition of saved racing history across Spaces.
 * No XP, AI-position victories, synthesized dates, mutations or invented champions.
 */
(function(root){
  'use strict';
  const arr=x=>Array.isArray(x)?x:[];
  const txt=x=>String(x??'');
  const esc=x=>txt(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const asTime=x=>x!==null&&x!==undefined&&x!==''&&Number.isFinite(Number(x))&&Number(x)>0?Number(x):null;
  const dateMs=x=>{if(!x)return null;const n=Date.parse(x);return Number.isFinite(n)&&n>0?n:null};
  const fmtTime=v=>{if(asTime(v)===null)return '—';const n=Math.round(Number(v)*1000);return `${String(Math.floor(n/60000)).padStart(2,'0')}:${String(Math.floor(n/1000)%60).padStart(2,'0')}.${String(n%1000).padStart(3,'0')}`};
  const fmtDate=at=>Number.isFinite(at)?new Date(at).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):'Date not recorded';
  const nameCar=(space,id,snapshot)=>{
    if(snapshot?.name)return txt(snapshot.name);
    const c=arr(space.cars).find(x=>txt(x.id)===txt(id));
    if(c){if(typeof root.carName==='function'){try{return root.carName(c)}catch(_){}}
      return [c.year,c.make,c.model].filter(Boolean).join(' ')||c.name||`Car ${id}`;}
    if(snapshot&&typeof snapshot==='object')return [snapshot.year,snapshot.make,snapshot.model].filter(Boolean).join(' ')||'Car not identified';
    return id?'Car ID '+txt(id):'Car not identified';
  };
  const identity=(r,fallback)=>txt(r?.carId??r?.car?.sourceCarId??r?.car?.id??fallback??'');
  const carSnapshot=(r,fallback)=>r?.car||(fallback&&typeof fallback==='object'?fallback:null);
  function resultsForSpace(space){
    const data=[],seen=new Set(),s=space||{};
    function put(r,kind,source,round,fallback,group){
      const duration=asTime(r?.time);
      if(duration===null||r?.advancedTiming)return;
      const cid=identity(r,fallback&&typeof fallback==='object'?(fallback.sourceCarId??fallback.id):fallback);
      const sourceId=txt(source?.id||source?.name||source?.title),roundId=txt(round?.id||round?.name);
      const date=dateMs(r?.date||r?.savedAt||r?.recordedAt||r?.createdAt);
      const rid=txt(r?.id||'');
      // Do not count duplicate records twice within one event/round/car.
      const key=[kind,sourceId,roundId,group||'',rid||`${cid}|${duration}|${txt(date)}`].join('|');
      if(seen.has(key))return;seen.add(key);
      data.push({kind,space:txt(s.name||'Unnamed Space'),spaceId:txt(s.id),sourceId,sourceName:txt(source?.name||source?.title||kind),roundId,group:group||'',carId:cid,car:nameCar(s,cid,carSnapshot(r,fallback)),track:txt(r?.track||round?.name||r?.roundName||''),time:duration,date});
    }
    function timedSource(items,kind){
      for(const e of arr(items)){
        const rounds=arr(kind==='Custom'&&arr(e.frozenRounds).length?e.frozenRounds:e.rounds);
        const lookup=new Map(rounds.map(x=>[txt(x?.id),x]));
        for(const r of arr(e.results))put(r,kind,e,lookup.get(txt(r?.roundId)),null,txt(r?.v8GroupId||r?.groupId||''));
      }
    }
    timedSource(s.runs,'Festival');timedSource(s.customEvents,'Custom');
    for(const ro of arr(s.raceOffs))for(const rd of arr(ro?.rounds))for(const m of arr(rd?.matches)){
      const group=txt(m?.id||m?.label||'');
      put(m?.resultA,'Race Off',ro,rd,m?.carA,group+'|A');
      put(m?.resultB,'Race Off',ro,rd,m?.carB,group+'|B');
    }
    return data;
  }
  function isVerifiedEvilComplete(space,e,slots){
    if(e?.type!=='evil-r1')return true;
    const relevant=arr(slots).filter(x=>txt(x.eventId)===txt(e.value));
    if(!relevant.length||!space?.evilCampaignR18098?.done)return false;
    const done=space.evilCampaignR18098.done;
    return relevant.every(x=>!!done[txt(x.slot)]);
  }
  function careerData(st,qa=root.otgLifetimeCareerQA8142,wall=root.rhPitWallMain8158){
    const spaces=arr(st?.spaces),results=[],honours=[],finishes=[];
    const slotSchedule=(()=>{try{return arr(root.rhEvilR1QA8103?.slots?.())}catch(_){return []}})();
    for(const space of spaces){
      results.push(...resultsForSpace(space));
      const seen=new Set();
      for(const [kind,entries] of [['Festival',space.runs],['Race Off',space.raceOffs]])for(const e of arr(entries)){
        if(e?.status!=='complete'||!isVerifiedEvilComplete(space,e,slotSchedule))continue;
        const key=kind+'|'+txt(e.id||e.name);if(seen.has(key))continue;seen.add(key);
        const completed=dateMs(e.completedAt);
        const podium=kind==='Festival'?(typeof qa?.festivalPodium==='function'?qa.festivalPodium(e):[]):
          (typeof qa?.raceOffPodium==='function'?qa.raceOffPodium(e):null);
        if(kind==='Festival'){
          if(!arr(podium).length)continue;
          honours.push({kind,space:txt(space.name||'Unnamed Space'),event:txt(e.name||'Festival'),at:completed,winner:nameCar(space,podium[0]),silver:podium[1]?nameCar(space,podium[1]):null,bronze:podium[2]?nameCar(space,podium[2]):null});
        }else if(podium?.gold){
          const cid=e.championCarId||e.champion?.sourceCarId||e.champion?.id;
          honours.push({kind,space:txt(space.name||'Unnamed Space'),event:txt(e.name||'Race Off'),at:completed,winner:nameCar(space,cid),silver:null,bronze:null});
        }
        finishes.push({at:completed,kind,space:txt(space.name),event:txt(e.name||kind)});
      }
    }
    // Times in distinct races or routes cannot be compared for "closest".
    // Consider only a Race Off match with two official times, or a standard
    // (non-group) Festival/Custom round containing distinct competitors.
    const battles=[];
    const battle=(a,b,space,event,track,kind)=>{
      if(!a||!b||a.carId===b.carId||!a.carId||!b.carId)return;
      const gap=Math.abs(a.time-b.time);
      if(gap<0.0005)return; // unresolved / tied, no artificial result
      battles.push({gap,a:a.car,b:b.car,space:txt(space.name),event:txt(event),track:txt(track),kind});
    };
    for(const space of spaces){
      for(const ro of arr(space.raceOffs))for(const rd of arr(ro?.rounds))for(const m of arr(rd?.matches)){
        const left=m?.resultA,right=m?.resultB;
        if(asTime(left?.time)===null||asTime(right?.time)===null||left?.advancedTiming||right?.advancedTiming)continue;
        const aId=identity(left,m?.carA?.sourceCarId??m?.carA?.id),bId=identity(right,m?.carB?.sourceCarId??m?.carB?.id);
        battle({carId:aId,car:nameCar(space,aId,m?.carA),time:Number(left.time)},
          {carId:bId,car:nameCar(space,bId,m?.carB),time:Number(right.time)},space,ro.name||'Race Off',rd.name||rd.trackName||'','Race Off');
      }
      for(const [kind,entries] of [['Festival',space.runs],['Custom',space.customEvents]])for(const e of arr(entries)){
        // Groups share track IDs across stages; do not merge them into one race.
        if(e.v8Groups)continue;
        const grouped=new Map();
        for(const r of arr(e.results)){
          if(asTime(r?.time)===null||r?.advancedTiming)continue;
          const roundId=txt(r.roundId),id=identity(r);if(!roundId||!id)continue;
          const key=roundId+'|'+txt(r.v8GroupId||r.groupId||'');
          if(!grouped.has(key))grouped.set(key,new Map());
          // Multiple conflicting recorded attempts for a car are ambiguous.
          const map=grouped.get(key);
          if(map.has(id))map.set(id,null);
          else map.set(id,{carId:id,car:nameCar(space,id,r.car),time:Number(r.time)});
        }
        const rounds=arr(kind==='Custom'&&arr(e.frozenRounds).length?e.frozenRounds:e.rounds);
        for(const [key,group] of grouped){
          const contestants=[...group.values()].filter(Boolean).sort((a,b)=>a.time-b.time);
          const rd=rounds.find(x=>txt(x.id)===key.split('|')[0]);
          for(let i=1;i<contestants.length;i++)battle(contestants[i-1],contestants[i],space,e.name||kind,rd?.name||'',kind);
        }
      }
    }
    battles.sort((a,b)=>a.gap-b.gap);
    const first=results.filter(r=>r.date!==null).sort((a,b)=>a.date-b.date)[0]||null;
    const firstHonour=honours.filter(x=>x.at!==null).sort((a,b)=>a.at-b.at)[0]||null;
    const carCounts=new Map();
    for(const x of results){if(!x.carId)continue;const key=x.spaceId+'|'+x.carId;let c=carCounts.get(key);if(!c){c={name:x.car,space:x.space,count:0};carCounts.set(key,c)}c.count++}
    const topCar=[...carCounts.values()].sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name))[0]||null;
    let expedition=null;
    try{
      const ctx=wall?.context?.();
      if(ctx){const done=wall.completed(ctx);const firstSwiss=done.slice().reverse().find(x=>x.liveFormat==='SWISS');
        const select=new Map();
        const exhibit=(s,tag)=>{if(s)select.set(Number(s.slot),{slot:Number(s.slot),event:txt(s.event),tag})};
        exhibit(done.at(-1),'EARLIEST COMPLETED SLOT');
        if(firstSwiss)exhibit(firstSwiss,'FIRST SWISS VISIT RECORDED');
        for(const slot of [25,100,250,500,750,1000,1219])exhibit(done.find(x=>Number(x.slot)===slot),'EXPEDITION MILESTONE');
        exhibit(done[0],'LATEST COMPLETED SLOT');
        expedition={done:done.length,total:ctx.slots.length,exhibits:[...select.values()].sort((a,b)=>a.slot-b.slot)};
      }
    }catch(e){console.warn('Museum expedition read skipped',e)}
    return {spaces:spaces.length,results:results.length,first,firstHonour,honours,battle:battles[0]||null,topCar,expedition};
  }
  const formatNum=n=>Number(n||0).toLocaleString('en-GB');
  function markup(data){
    const statue=(label,value)=>`<div class="cm159-stat"><small>${esc(label)}</small><strong>${esc(value)}</strong></div>`;
    const plaque=(tag,title,body,sub)=>`<article class="cm159-plaque"><small>${esc(tag)}</small><h4>${esc(title)}</h4><p>${esc(body)}</p>${sub?`<footer>${esc(sub)}</footer>`:''}</article>`;
    const empty=(m)=>`<div class="cm159-empty">${esc(m)}</div>`;
    const d=data;
    const opening=d.first?plaque('THE FIRST DATED LAP',d.first.car,`${d.first.sourceName}${d.first.track?' · '+d.first.track:''} · ${fmtTime(d.first.time)}`,`${d.first.space} · ${fmtDate(d.first.date)}`):empty('No dated race result can be established yet. Older untimestamped results are still counted in career totals.');
    const firstCup=d.firstHonour?plaque('EARLIEST DATED VERIFIED PODIUM',d.firstHonour.winner,d.firstHonour.event,`${d.firstHonour.kind} · ${d.firstHonour.space} · ${fmtDate(d.firstHonour.at)}`):empty('No dated, verified completed-event podium is available yet.');
    const trophy=d.honours.length?d.honours.slice().sort((a,b)=>(b.at??-1)-(a.at??-1)).slice(0,8).map(x=>plaque(x.kind.toUpperCase()+' · CONFIRMED WINNER',x.winner,x.event,`${x.space}${x.at?' · '+fmtDate(x.at):' · Date not recorded'}`)).join(''):empty('The trophy room remains ready for your first verified completed Festival or Race Off victory.');
    const battle=d.battle?plaque('CLOSEST SAVED SAME-RACE BATTLE',`${d.battle.a} / ${d.battle.b}`,`${fmtTime(d.battle.gap)} apart${d.battle.track?' · '+d.battle.track:''}`,`${d.battle.kind} · ${d.battle.event} · ${d.battle.space}`):empty('No suitable two-car comparison has been found in saved race results yet.');
    const machine=d.topCar?plaque('MOST RECORDED TIMED ENTRIES',d.topCar.name,`${formatNum(d.topCar.count)} recorded result${d.topCar.count===1?'':'s'}`,d.topCar.space):empty('Record a timed race and the garage exhibit will begin to populate.');
    const expedition=d.expedition?`<p class="cm159-muted">${formatNum(d.expedition.done)} of ${formatNum(d.expedition.total)} slots completed. Individual results remain in The Pit Wall.</p>`+(d.expedition.exhibits.length?d.expedition.exhibits.map(x=>`<div class="cm159-expedition"><span><small>${esc(x.tag)}</small><b>Slot ${String(x.slot).padStart(4,'0')} · ${esc(x.event)}</b></span><button type="button" data-cm-slot="${x.slot}">PIT WALL ›</button></div>`).join(''):empty('Your first completed Evil Tournament visit will appear here.')):empty('The Evil Expedition gallery appears when the active Space has a recognised Evil Tournament history.');
    return `<div class="cm159-door"><div><small>ONE DRIVER · ALL GAME SPACES</small><h2>🏛️ THE CAREER MUSEUM</h2><p>Real racing milestones. Proper history. Deeply questionable curators.</p></div><button type="button" data-cm-toggle aria-expanded="false">ENTER MUSEUM ›</button></div>
      <div class="cm159-gallery" hidden><div class="cm159-grand"><span>OTG! CAREER COLLECTION · MAIN v8.0.159</span><h3>YOUR RACING LEGACY</h3><p>A museum, not a second results archive. All records are read-only.</p><div class="cm159-stats">${statue('TIMED RESULTS',formatNum(d.results))}${statue('VERIFIED WINNING EVENTS',formatNum(d.honours.length))}${statue('GAME SPACES',formatNum(d.spaces))}</div></div>
      <section class="cm159-room"><h3>01 / WHERE IT BEGAN</h3><p class="cm159-muted">Only entries with actual saved timestamps are labelled first.</p>${opening}${firstCup}</section>
      <section class="cm159-room"><h3>02 / TROPHY ROOM</h3><p class="cm159-muted">Completed-event honours only. No game-AI victories or unfinished championships.</p>${trophy}${d.honours.length>8?`<p class="cm159-muted">Displaying the eight most recent verified winners. Full totals remain in Lifetime Career.</p>`:''}</section>
      <section class="cm159-room"><h3>03 / LEGENDARY BATTLES</h3>${battle}</section>
      <section class="cm159-room"><h3>04 / THE MACHINES</h3>${machine}</section>
      <section class="cm159-room"><h3>05 / THE EVIL EXPEDITION</h3>${expedition}</section>
      <aside class="cm159-curator"><small>FROM THE CURATOR'S OFFICE</small><p>“An impressive collection of verified history. Dave has been informed that polishing the trophies with yoghurt is not an approved conservation method.”</p><footer>— Chief Tech Penguin, under supervision</footer></aside>
      <p class="cm159-legal">ⓘ Read-only exhibition of existing saved racing records. Undated results cannot prove chronological firsts. Closest battles compare competitors from the same recorded race, not different tracks. More details belong in The Pit Wall; current totals remain in Lifetime Career.</p><button type="button" data-cm-toggle aria-expanded="true" class="cm159-close">CLOSE MUSEUM ↑</button></div>`;
  }
  const api={resultsForSpace,careerData,markup,isVerifiedEvilComplete};
  root.otgCareerMuseumQA8159=api;
  if(typeof document==='undefined')return;
  let opened=false;
  function current(){try{return typeof state!=='undefined'&&Array.isArray(state?.spaces)?state:null}catch(_){return null}}
  function paint(){
    const host=document.getElementById('more'),lifetime=host?.querySelector('#otgLifetimeCareer8142');
    if(!host||!lifetime||host.querySelector('#otgCareerMuseum8159'))return;
    const snapshot=current();if(!snapshot)return;
    const panel=document.createElement('section');panel.id='otgCareerMuseum8159';panel.className='cm159';
    panel.setAttribute('aria-label','OTG Career Museum');
    panel.innerHTML=markup(careerData(snapshot));
    lifetime.insertAdjacentElement('beforebegin',panel);
    panel.querySelector('.cm159-gallery').hidden=!opened;
    panel.querySelector('.cm159-door [data-cm-toggle]').setAttribute('aria-expanded',String(opened));
    panel.querySelector('.cm159-door [data-cm-toggle]').textContent=opened?'CLOSE MUSEUM ↑':'ENTER MUSEUM ›';
    panel.querySelectorAll('[data-cm-toggle]').forEach(b=>b.addEventListener('click',()=>{
      opened=!opened;panel.querySelector('.cm159-gallery').hidden=!opened;
      panel.querySelector('.cm159-door [data-cm-toggle]').setAttribute('aria-expanded',String(opened));
      panel.querySelector('.cm159-door [data-cm-toggle]').textContent=opened?'CLOSE MUSEUM ↑':'ENTER MUSEUM ›';
      if(opened){panel.querySelector('.cm159-grand')?.scrollIntoView?.({block:'start',behavior:'smooth'})}
    }));
    panel.querySelectorAll('[data-cm-slot]').forEach(b=>b.addEventListener('click',()=>goToPitWall(Number(b.dataset.cmSlot))));
  }
  function goToPitWall(slot){
    try{
      if(typeof root.show!=='function'||typeof root.rhRenderEvilCampaignR18098!=='function')return;
      root.show('evilcampaign');root.rhRenderEvilCampaignR18098();
      // Pit Wall injects its tile from a MutationObserver after Evil R1 renders.
      // Defer until that observer has run; never alter the underlying slot.
      const attempt=(left)=>{
        const h=document.getElementById('evilcampaign');
        const tile=h?.querySelector('[data-pitwall-open]');
        if(!tile){if(left>0)return setTimeout(()=>attempt(left-1),50);root.toast?.('Open Evil Tournament → The Pit Wall to view the report.');return;}
        tile.click();
        const report=h.querySelector(`[data-pw-view="${slot}"]`);
        if(report)report.click();
        else root.toast?.('That slot is not available in the Pit Wall on this Space.');
      };
      setTimeout(()=>attempt(12),0);
    }catch(e){console.warn('Museum to Pit Wall navigation skipped',e)}
  }
  const oldStats=root.rhRenderStats;
  if(typeof oldStats==='function')root.rhRenderStats=function(...args){const value=oldStats.apply(this,args);try{paint()}catch(e){console.warn('Career Museum render skipped',e)}return value};
  const oldMore=root.rhRenderMore;
  if(typeof oldMore==='function')root.rhRenderMore=function(...args){const value=oldMore.apply(this,args);try{paint()}catch(e){console.warn('Career Museum render skipped',e)}return value};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',paint,{once:true});else paint();
})(typeof window==='undefined'?globalThis:window);
