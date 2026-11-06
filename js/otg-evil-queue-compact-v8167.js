/* OTG! personal MAIN v8.0.167 — live Evil Festival race-ready queue.
 * DISPLAY ONLY: extends the native Championship in Progress two-row preview
 * to a scrollable full remaining queue; never changes the saved car order.
 * E✓ is based on saved Evil results, never merely a draw or upgrade assumption.
 */
(()=>{
 'use strict';
 const EVIL='evil-specialist-r1-20261014';
 const FLAG='otgEvilQueueCompact8167';
 const MARK='rhEvilUsedBadge8166';
 const NATIVE='rhChamp33';
 function space(){try{return typeof window.rhSpace==='function'?window.rhSpace():null}catch(_){return null;}}
 function evil(x){return !!x&&(x.type==='evil-r1'||x.evilCampaignR1?.campaignId===EVIL);}
 const isTime=x=>Number.isFinite(Number(x))&&Number(x)>0;
 const isScore=x=>x!==null&&x!==undefined&&x!==''&&Number.isFinite(Number(x));
 function racedIds(sp){
  const ids=new Set();
  const mark=(id,yes)=>{if(id!==undefined&&id!==null&&id!==''&&yes)ids.add(String(id));};
  for(const run of sp.runs||[]){
   if(!evil(run))continue;
   for(const result of run.results||[])mark(result.carId,isTime(result.time)||isScore(result.score));
  }
  for(const ro of sp.raceOffs||[]){
   if(!evil(ro))continue;
   for(const round of ro.rounds||[])for(const match of round.matches||[]){
    for(const result of [match.resultA,match.resultB,...(match.attempts||[])]){
     if(result)mark(result.carId??result.car?.sourceCarId,isTime(result.time));
    }
   }
  }
  for(const drift of Object.values(sp.evilCampaignR18098?.driftEvents||{})){
   for(const rd of drift?.rounds||[]){
    for(const [id,score] of Object.entries(rd.scores||{}))mark(id,isScore(score));
    for(const match of rd.matches||[]){
     mark(match.a,isScore(match.scoreA));mark(match.b,isScore(match.scoreB));
    }
   }
  }
  return ids;
 }
 function getRun(page,sp){
  // Restrict all changes to the current, displayed evil Festival run.
  const btn=page.querySelector('.rhChamp33Tools button[onclick*="rhRandomPickQueue"]')
         ||page.querySelector('.rhChamp33Continue[onclick*="rhEnterResult"]')
         ||page.querySelector('.rhQueueActionV1[onclick*="rhRandomPickQueue"]');
  const code=btn?.getAttribute('onclick')||'';
  const m=code.match(/rh(?:RandomPickQueue|EnterResult)\s*\(\s*['"]([^'"]+)['"]/);
  if(!m)return null;
  const run=(sp.runs||[]).find(x=>String(x.id)===m[1]);
  return evil(run)?run:null;
 }
 function remainingEntries(run){
  const entries=Array.isArray(run.entries)?run.entries:[];
  const rounds=Array.isArray(run.rounds)?run.rounds:[];
  const results=Array.isArray(run.results)?run.results:[];
  return entries.filter(id=>rounds.some(rd=>!results.some(x=>String(x.carId)===String(id)&&String(x.roundId)===String(rd.id))));
 }
 function carLabel(id,byId){
  const car=byId.get(String(id));
  if(!car)return 'Unknown car';
  try{if(typeof window.carName==='function')return window.carName(car);}catch(_){}
  return car.name||[car.make,car.model,car.year].filter(Boolean).join(' ')||'Unknown car';
 }
 function putBadge(el,id,used){
  const info=id&&used.get(String(id));
  if(!el||!info||el.querySelector('.'+MARK))return;
  const b=document.createElement('span');b.className=MARK+' otgEvilUsedMark8167';
  b.textContent='E✓';
  if(typeof window.rhEvilPaintUsedBadge8167==='function')window.rhEvilPaintUsedBadge8167(b,info);
  else{b.dataset.otgEvilLast='road';b.title='Previously raced in Evil Tournament; upgrades not verified';}
  el.appendChild(b);
 }
 function currentId(run,remaining){
  try{if(typeof window.rhNextSlot==='function'){
   const next=window.rhNextSlot(run);
   if(next?.carId&&remaining.some(id=>String(id)===String(next.carId)))return next.carId;
  }}catch(_){}
  // Native runs are car-major: first remaining car has the next unrecorded round.
  return remaining[0]||null;
 }
 function createRow(id,index,byId){
  const row=document.createElement('div');row.className='otgEvilExtraQueueRow8167';
  row.dataset.otgEvilQueueId8167=String(id);
  const no=document.createElement('i');no.textContent=String(index+1);
  const label=document.createElement('b');label.textContent=carLabel(id,byId);
  row.append(no,label);
  return row;
 }
 function decorateCurrent(page,run,remaining,used){
  const header=page.querySelector('.rhChamp33CurrentHead h2');
  putBadge(header,currentId(run,remaining),used);
 }
 function decorateQueue(page,run,remaining,used,byId){
  const holder=page.querySelector('.rhChamp33NextRows');
  if(!holder)return;
  // The original app renders exactly two preview rows, even for six cars.
  // Extend that native preview; never change run.entries, results or handlers.
  const rows=[...holder.children].filter(x=>x.tagName==='DIV');
  // If another plug-in has rebuilt this section, don't guess about its order.
  if(rows.length<2||rows.length>Math.max(2,remaining.length))return;
  for(let i=rows.length;i<remaining.length;i++)holder.appendChild(createRow(remaining[i],i,byId));
  if(remaining.length<2){
   // Eliminate the native empty placeholder, if present.
   const placeholder=holder.children[1];
   if(placeholder&&/^[-—]\s*(?:▤)?\s*$/.test(placeholder.textContent.trim()))placeholder.remove();
  }
  const displayRows=[...holder.children].filter(x=>x.tagName==='DIV');
  // Row 1 and 2 are rendered by the app. Added rows use matching indices.
  for(let i=0;i<Math.min(displayRows.length,remaining.length);i++){
   putBadge(displayRows[i].querySelector(':scope > b'),remaining[i],used);
  }
 }
 function decorate(){
  const festival=document.getElementById('festival');
  const sp=space();if(!festival||!sp||sp.catalogueKey!=='fh5-catalogue-v1')return;
  const page=festival.querySelector('.'+NATIVE);
  if(!page||!page.querySelector('.rhChamp33NextRows'))return;
  const run=getRun(page,sp);if(!run)return;
  page.classList.add(FLAG);
  const used=typeof window.rhEvilUsedLedger8167==='function'
   ?window.rhEvilUsedLedger8167(sp)
   :new Map([...racedIds(sp)].map(id=>[id,{kind:'road',eventLabel:'Evil Tournament'}]));
  const remaining=remainingEntries(run);
  const byId=new Map((sp.cars||[]).filter(x=>x&&x.id).map(x=>[String(x.id),x]));
  decorateCurrent(page,run,remaining,used);
  decorateQueue(page,run,remaining,used,byId);
 }
 let scheduled=false;
 function schedule(){if(scheduled)return;scheduled=true;
  (window.requestAnimationFrame||((fn)=>setTimeout(fn,16)))(()=>{scheduled=false;
   try{decorate();}catch(err){console.warn('OTG! Evil Festival queue display skipped',err);}
  });
 }
 function start(){const root=document.getElementById('festival');if(!root)return;
  new MutationObserver(schedule).observe(root,{childList:true,subtree:true});schedule();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
 window.rhEvilQueueQA8167=()=>({version:'8.0.167',displayOnly:true,fullQueue:true});
})();
