/* TET2 v8.0.364 — practice-only provisional standings and Race Off progress.
 * Read-only view of exactly the v8.0.363 locked draw and banked results;
 * NEVER awards medals, unlocks results, mutates state, or guesses Evil List slots. */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.TET2PracticeStandings364=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const S=v=>String(v??'').trim();
 const esc=v=>S(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const format=ms=>{if(!Number.isSafeInteger(ms)||ms<=0)return '—';const m=Math.floor(ms/60000),s=Math.floor(ms%60000/1000),n=ms%1000;return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(n).padStart(3,'0')}`};
 const gap=ms=>ms===0?'—':'+'+format(ms);
 function group(b){
   const cars=b.draw.group.map(c=>({id:S(c.id),name:S(c.name)})),tracks=b.tracks;
   let completeTracks=0;
   while(completeTracks<tracks.length && Object.keys(b.saved.group[completeTracks]).length===cars.length)completeTracks++;
   const final=completeTracks===tracks.length;
   const entries=cars.map(c=>{
     const all=tracks.map((name,i)=>({name,time:b.saved.group[i][c.id]??null}));
     const times=all.filter(x=>x.time!==null).length;
     const total=completeTracks?all.slice(0,completeTracks).reduce((sum,t)=>sum+t.time,0):null;
     return {id:c.id,name:c.name,all,times,total};
   });
   const ranked=entries.filter(e=>e.total!==null).sort((a,b)=>a.total-b.total||a.name.localeCompare(b.name));
   ranked.forEach((e,i)=>{e.position=i>0&&e.total===ranked[i-1].total?ranked[i-1].position:i+1;e.gap=e.total-ranked[0].total});
   // When a track is partly finished, show completed-track aggregate only.
   const activeIndex=final?tracks.length-1:completeTracks;
   const totalBanked=b.saved.group.reduce((sum,t)=>sum+Object.keys(t).length,0),required=cars.length*tracks.length;
   const unsaved=cars.find(c=>b.saved.group[activeIndex][c.id]===undefined);
   return {mode:'group',title:final?'FINAL GROUP STANDINGS':completeTracks?'PROVISIONAL GROUP STANDINGS':'GROUP TIME PROGRESS',final,completeTracks,trackCount:tracks.length,activeTrack:tracks[activeIndex],activeTrackNumber:activeIndex+1,banked:totalBanked,required,cars,entries,ranked,unsaved:unsaved?.name||null,tracks,trackSaved:b.saved.group,qualifiersKnown:false};
 }
 function raceoff(b){
   const matches=b.draw.matches.map((m,i)=>{
     const r=b.saved.matches[m.id]||null;
     const carA={id:S(m.carA.id),name:S(m.carA.name)},carB={id:S(m.carB.id),name:S(m.carB.name)};
     const winner=r?(r.winnerId===carA.id?carA:carB):null;
     return {number:i+1,id:m.id,carA,carB,result:r?{a:r.a,b:r.b}:null,winner};
   });
   const banked=matches.filter(m=>m.winner).length;
   return {mode:'raceoff',title:'RACE OFF · SLOT MATCHES',banked,required:matches.length,complete:banked===matches.length,matches,next:matches.find(m=>!m.winner)?.number||null};
 }
 function snapshot(b){
   if(!b||b.source!=='TET2_DRAW_PRACTICE_V8363'||b.schema!==1||!b.draw||!b.saved)throw Error('Locked practice results are unavailable.');
   if(b.draw.mode==='group')return group(b);
   if(b.draw.mode==='raceoff')return raceoff(b);
   throw Error('Unsupported competition results.');
 }
 const empty=()=>`<div class="t2-ps-empty">No times banked yet. The standings will update as each result is saved.</div>`;
 const control=`<div class="t2-ps-actions"><button type="button" class="t2-btn" data-t2-progress-action="resume">↩ RETURN TO RESULTS ENTRY</button><button type="button" class="t2-btn t2-secondary" data-t2-progress-action="race">← RACE CONTROL</button></div>`;
 function rankedTable(s){
   if(!s.completeTracks)return empty();
   return `<div class="t2-ps-scroll" role="region" tabindex="0" aria-label="Group standings, scroll for more cars"><table class="t2-ps-table"><thead><tr><th>POS</th><th>CAR</th><th>COMBINED TIME</th><th>GAP</th></tr></thead><tbody>${s.ranked.map(r=>`<tr class="${r.position===1?'t2-ps-leader':''}"><td>${r.position}</td><td>${esc(r.name)}</td><td>${format(r.total)}</td><td>${gap(r.gap)}</td></tr>`).join('')}</tbody></table></div>`;
 }
 function currentTrackTable(s){
   const idx=s.activeTrackNumber-1,banked=s.trackSaved[idx];
   return `<div class="t2-ps-scroll" role="region" tabindex="0" aria-label="Latest track times, scroll for all cars"><table class="t2-ps-table"><thead><tr><th>CAR</th><th>TRACK ${idx+1} TIME</th><th>STATUS</th></tr></thead><tbody>${s.cars.map(c=>`<tr><td>${esc(c.name)}</td><td>${banked[c.id]!==undefined?format(banked[c.id]):'—'}</td><td class="${banked[c.id]!==undefined?'t2-ps-good':''}">${banked[c.id]!==undefined?'✓ BANKED':'PENDING'}</td></tr>`).join('')}</tbody></table></div>`;
 }
 function groupHTML(s){
   const head=s.completeTracks?`AFTER TRACK ${s.completeTracks} OF ${s.trackCount}`:`TRACK 1 OF ${s.trackCount} · AWAITING COMPLETE RESULTS`;
   return `<section class="t2-ps-box"><h2>${esc(s.title)}</h2><p class="t2-ps-subtitle">${esc(head)}</p>
    <div class="t2-ps-stats"><div><span>TRACKS COMPLETE</span><strong>${s.completeTracks} / ${s.trackCount}</strong></div><div><span>TIMES BANKED</span><strong>${s.banked} / ${s.required}</strong></div></div>
    <p class="t2-ps-note">${s.final?'All tracks recorded. These are final GROUP rankings; no medals are awarded for qualifying groups.':s.completeTracks?'Rankings use completed tracks only. A partially recorded current track never distorts the aggregate.':'No aggregate standings until every car has completed Track 1.'}</p>
    ${rankedTable(s)}
   </section>
   <section class="t2-ps-box"><h2>${s.final?'LAST TRACK RESULTS':'CURRENT TRACK · LIVE TIMES'}</h2><p class="t2-ps-subtitle">${esc(s.activeTrack)} · ${s.activeTrackNumber} of ${s.trackCount}</p>
    ${currentTrackTable(s)}
    ${s.unsaved?`<div class="t2-ps-next">NEXT UNSAVED: <strong>${esc(s.unsaved)}</strong></div>`:'<div class="t2-ps-next">✓ All cars recorded on this track</div>'}
   </section>
   <section class="t2-ps-box"><h2>GROUP SUMMARY</h2><div class="t2-ps-summary"><span>Current leader</span><strong>${s.completeTracks?esc(s.ranked[0].name):'Pending full track'}</strong></div><div class="t2-ps-summary"><span>Fastest combined time</span><strong>${s.completeTracks?format(s.ranked[0].total):'—'}</strong></div><p class="t2-ps-note">Qualifiers depend on the official competition rules, which are not yet scheduled. No medals, records or progression are awarded in this local practice.</p></section>`;
 }
 function raceoffHTML(s){
   return `<section class="t2-ps-box"><h2>CURRENT SLOT · MATCH RESULTS</h2>
   <div class="t2-ps-stats"><div><span>MATCHES BANKED</span><strong>${s.banked} / ${s.required}</strong></div><div><span>REMAINING</span><strong>${s.required-s.banked}</strong></div></div>
   <div class="t2-ps-scroll t2-ps-matches" role="region" tabindex="0" aria-label="Race Off match results, scroll to see all pairings">${s.matches.map(m=>`<article class="t2-ps-match ${m.winner?'t2-ps-match-done':''}"><div class="t2-ps-matchhead"><strong>MATCH ${String(m.number).padStart(2,'0')}</strong><span>${m.winner?'✓ BANKED':'PENDING'}</span></div><div class="t2-ps-pair"><div class="${m.winner?.id===m.carA.id?'t2-ps-win':''}"><span>${esc(m.carA.name)}</span><b>${m.result?format(m.result.a):'—'}</b></div><div class="${m.winner?.id===m.carB.id?'t2-ps-win':''}"><span>${esc(m.carB.name)}</span><b>${m.result?format(m.result.b):'—'}</b></div></div>${m.winner?`<p>WINNER: <strong>${esc(m.winner.name)}</strong></p>`:''}</article>`).join('')}</div>
   <div class="t2-ps-next">${s.complete?'✓ All practice matches banked':`NEXT UNSAVED MATCH: <strong>${String(s.next).padStart(2,'0')}</strong>`}</div>
   </section><section class="t2-ps-box"><h2>NEXT STAGES</h2><div class="t2-ps-stage">Next knockout stage <span>AWAITING FUTURE EVIL LIST DRAW</span></div><div class="t2-ps-stage">Quarterfinals <span>AWAITING FUTURE DRAW</span></div><div class="t2-ps-stage">Semifinals <span>AWAITING FUTURE DRAW</span></div><div class="t2-ps-stage">Bronze-medal duel <span>BEFORE FINAL</span></div><div class="t2-ps-stage">Final <span>AWAITING FUTURE DRAW</span></div><p class="t2-ps-note">Future stages are illustrative only. This practice screen doesn't know the official round, draw future pairings or award medals.</p></section>`;
 }
 function render(){
   let b;try{b=window.TET2Practice363?.read();}catch(err){return `<div class="t2-ps-page"><div class="t2-ps-error" role="alert">${esc(err.message)}</div>${control}</div>`;}
   if(!b)return `<div class="t2-ps-page"><h2>NO LOCKED PRACTICE DRAW</h2><p>Lock one group or current-slot Race Off pairing draw before opening standings.</p><button type="button" class="t2-btn" data-t2-progress-action="race">← RACE CONTROL</button></div>`;
   const s=snapshot(b);
   const hero=s.mode==='group'?'draw-group-header.webp':'draw-raceoff-header.webp';
   return `<div class="t2-ps-page"><div class="t2-ps-hero"><img src="assets/tet2-stage4-v8362/${hero}" alt="Dave, Steve and Chief Tech Penguin at the chaotic draw desk"></div>
   <header class="t2-ps-title"><span>TET2 · CONTROLLED CHAOS</span><h1>${esc(s.mode==='group'?'GROUP STANDINGS':'RACE OFF PROGRESS')}</h1><p>LIVE PRACTICE RESULTS · READ-ONLY · NOT OFFICIAL</p></header>
   ${s.mode==='group'?groupHTML(s):raceoffHTML(s)}${control}</div>`;
 }
 return Object.freeze({snapshot,render,version:'8.0.364'});
});
