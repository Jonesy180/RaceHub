/* OTG! PERSONAL MAIN v8.0.170 — Evil Swiss live-round layout.
 * DISPLAY-ONLY. Swiss pairings, results, slots, standings, track and round state
 * are read from the saved run and NEVER changed by this script.
 */
(()=>{
 'use strict';
 const EVIL='evil-specialist-r1-20261014';
 const PAGE_CLASS='otgSwissCompact8170';
 const BADGE='rhEvilUsedBadge8166';
 const text=x=>String(x??'');
 const plainName=el=>[...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join(' ').trim();
 const validTime=x=>x!==null&&x!==undefined&&x!==''&&Number.isFinite(Number(x))&&Number(x)>0;
 const sp=()=>{try{return window.rhSpace?.()||null}catch(_){return null}};
 const fmt=n=>{if(!validTime(n))return '—';const t=Math.round(Number(n)*1000);return `${String(Math.floor(t/60000)).padStart(2,'0')}:${String(Math.floor(t/1000)%60).padStart(2,'0')}.${String(t%1000).padStart(3,'0')}`;};
 function getId(handler,fn){
  const regex=new RegExp('(?:^|\\W)'+fn+'\\s*\\(\\s*[\\x27\\x22]([^\\x27\\x22<>]+)[\\x27\\x22]');
  return (text(handler).match(regex)||[])[1]||null;
 }
 function findContext(page){
  const space=sp();if(!space||space.catalogueKey!=='fh5-catalogue-v1'||!page)return null;
  const btn=page.querySelector('[onclick*="rhV8051SwissResult("], [onclick*="rhV8051KOResult("], [onclick*="rhV8051SaveSwissResult("], [onclick*="rhV8051SaveKOResult("]');
  if(!btn)return null;
  const handler=btn.getAttribute('onclick');
  const id=getId(handler,'rhV8051SwissResult')||getId(handler,'rhV8051KOResult')||getId(handler,'rhV8051SaveSwissResult')||getId(handler,'rhV8051SaveKOResult');
  if(!id)return null;
  const run=(space.runs||[]).find(x=>text(x.id)===id&&x.format==='swiss'&&x.type==='evil-r1'&&x.evilCampaignR1?.campaignId===EVIL);
  if(!run||run.status!=='active'||!run.v8Swiss)return null;
  const isKo=run.v8Swiss.phase==='ko',state=run.v8Swiss;
  const idx=Number(isKo?state.ko?.currentRound:state.currentRound)||0;
  const round=(isKo?state.ko?.rounds:state.swissRounds)?.[idx];
  if(!round||round.status!=='racing'||!Array.isArray(round.matches))return null;
  const ledger=typeof window.rhEvilUsedLedger8167==='function'?window.rhEvilUsedLedger8167(space):new Map();
  const carMap=new Map((space.cars||[]).map(c=>[text(c.id),c]));
  for(const car of window.rhEvilSpecialistR18097?.cars||[]){if(!carMap.has(text(car.id)))carMap.set(text(car.id),car);}
  return {run,round,isKo,ledger,carMap,page};
 }
 function carName(ctx,id){
  const c=ctx.carMap.get(text(id));if(!c)return 'Car '+text(id);
  try{if(typeof window.carName==='function')return text(window.carName(c))}catch(_){}
  return text(c.name||[c.make,c.model,c.year].filter(Boolean).join(' ')||id);
 }
 function makeBadge(ctx,id){
  const info=ctx.ledger.get(text(id));if(!info)return null;
  const b=document.createElement('span');b.className=BADGE+' otgSwissE8170';b.textContent='E✓';
  if(typeof window.rhEvilPaintUsedBadge8167==='function')window.rhEvilPaintUsedBadge8167(b,info);
  return b;
 }
 function badgeTo(ctx,el,id){
  if(!el||!id)return;
  const existing=el.querySelector(':scope > .'+BADGE);
  if(existing)return;
  const badge=makeBadge(ctx,id);
  if(badge)el.appendChild(badge);
 }
 function history(id){
  if(!id||typeof window.rhDrawCarHistory8131!=='function')return null;
  const b=document.createElement('button');b.type='button';b.className='otgSwissHistory8170';b.textContent='▤';
  b.title='Car History';b.setAttribute('aria-label','Car History: '+text(id));
  b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();window.rhDrawCarHistory8131(text(id))});
  return b;
 }
 function line(ctx,id,which,now,result){
  const box=document.createElement('div');box.className='otgSwissPairCar8170';if(now)box.classList.add('otgSwissPairActive8170');
  const label=document.createElement('small');label.textContent=which+(now?' · RACING NEXT':validTime(result?.time)?' · RESULT SAVED':'');
  const name=document.createElement('strong');name.textContent=carName(ctx,id);badgeTo(ctx,name,id);
  const content=document.createElement('div');content.className='otgSwissPairName8170';content.append(label,name);
  if(validTime(result?.time)){const t=document.createElement('span');t.className='otgSwissSavedTime8170';t.textContent=fmt(result.time);content.append(t)}
  box.append(content);const btn=history(id);if(btn)box.append(btn);
  return box;
 }
 function current(round){return (round.matches||[]).find(m=>m&&(!m.resultA||!m.resultB))||null}
 function label(ctx){return ctx.isKo?'SWISS KNOCKOUT':'SWISS ROUND';}
 function addNext(ctx){
  const {page,round}=ctx,match=current(round);if(!match||!match.carA||!match.carB)return;
  if(page.querySelector('.otgSwissNext8170'))return;
  const boards=page.querySelector('.v8TrackBoards'),cur=page.querySelector('.rhCurrentCarV1');if(!boards||!cur)return;
  const index=round.matches.indexOf(match)+1,second=!!match.resultA;
  const shell=document.createElement('section');shell.className='otgSwissNext8170';
  const h=document.createElement('div');h.className='otgSwissNextHead8170';
  const title=document.createElement('b');title.textContent='UP NEXT · '+label(ctx)+' · MATCH '+String(index).padStart(2,'0');
  const hint=document.createElement('span');hint.textContent=second?'SECOND RACER NEXT':'FIRST RACER NEXT';h.append(title,hint);
  const grid=document.createElement('div');grid.className='otgSwissNextGrid8170';
  grid.append(line(ctx,match.carA,'FIRST CAR',!second,match.resultA),line(ctx,match.carB,'SECOND CAR',second,match.resultB));
  shell.append(h,grid);cur.insertAdjacentElement('afterend',shell);
 }
 function decorateMatches(ctx){
  const cards=[...ctx.page.querySelectorAll('.v8TrackBoards > .rhKOMatch8037')];
  if(!cards.length||cards.length!==ctx.round.matches.length)return;
  const next=current(ctx.round);
  cards.forEach((card,i)=>{
   const m=ctx.round.matches[i],racers=[...card.querySelectorAll(':scope > .rhKOMatchBody8037 > .rhKORacer8037')];
   if(racers.length!==2)return;
   for(const [j,id] of [m.carA,m.carB].entries()){
    const span=racers[j].querySelector(':scope > span');badgeTo(ctx,span,id);
    // Individual Car History remains accessible even for past matches.
    if(!racers[j].querySelector('.otgSwissHistory8170')){
     const b=history(id);if(b)racers[j].append(b);
    }
   }
   if(m===next){
    card.classList.add('otgSwissNextRow8170');
    if(ctx.page.querySelector('.otgSwissNext8170')){
     card.classList.add('otgSwissRepeat8170');
     const mark=card.querySelector(':scope > .rhKOMatchNo8037');
     if(mark&&!card.querySelector('.otgSwissRepeatText8170')){
      const s=document.createElement('span');s.className='otgSwissRepeatText8170';s.textContent='PAIR SHOWN IN UP NEXT ↑';mark.append(s);
     }
    }
   }
  });
 }
 function decorateRace(ctx){
  const {page}=ctx;if(!page.querySelector('.rhCurrentCarV1, .v8TrackBoards'))return;
  page.classList.add(PAGE_CLASS);
  const m=current(ctx.round),nextId=m?(m.resultA?m.carB:m.carA):null;
  const currentName=page.querySelector('.rhCurrentCarMetaV1 > div:first-child > b');
  // Exact car-ID and visible-name check: never badge a track or an unrelated label.
  if(nextId&&currentName&&plainName(currentName)===carName(ctx,nextId).trim())badgeTo(ctx,currentName,nextId);
  addNext(ctx);decorateMatches(ctx);
 }
 function decorateEntry(ctx){
  const page=ctx.page,match=current(ctx.round);if(!match)return;
  const id=match.resultA?match.carB:match.carA;
  const heading=page.querySelector('.rh5801Context > b');if(!heading)return;
  // Verify the native result page still refers to the car we are about to mark.
  if(plainName(heading)!==carName(ctx,id).trim())return;
  page.classList.add(PAGE_CLASS,'otgSwissEntry8170');
  badgeTo(ctx,heading,id);
  const section=page.querySelector('.rh5801Context');
  if(section&&!section.querySelector('.otgSwissEntryHistory8170')){
   const b=history(id);if(b){b.classList.add('otgSwissEntryHistory8170');section.appendChild(b)}
  }
 }
 function decorate(){
  const host=document.getElementById('festival');if(!host||host.classList.contains('hidden'))return;
  const page=host.querySelector(':scope > .rhOverviewV1.v8GroupPage, :scope > .rh5801Entry');
  const ctx=findContext(page);if(!ctx)return;
  if(page.classList.contains('rh5801Entry'))return decorateEntry(ctx);
  decorateRace(ctx);
 }
 let pending=false;
 function schedule(){if(pending)return;pending=true;
  (window.requestAnimationFrame||((f)=>setTimeout(f,16)))(()=>{pending=false;try{decorate()}catch(e){console.warn('OTG Swiss display skipped',e)}});
 }
 function start(){const root=document.getElementById('festival');if(root)new MutationObserver(schedule).observe(root,{childList:true,subtree:true});schedule()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
 window.otgSwissCompactQA8170=()=>({version:'8.0.170',displayOnly:true,livePair:!!document.querySelector('#festival .otgSwissNext8170'),
  compactNext:!!document.querySelector('#festival .otgSwissRepeat8170'),badges:document.querySelectorAll('#festival .otgSwissE8170').length});
})();
