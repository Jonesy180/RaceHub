/* OTG! MAIN v8.0.168 — Evil Race Off compact match view.
 * READ ONLY: all data comes from the current saved Race Off and v8.0.167
 * last-event badge ledger. No draw, result, round, upgrade or slot mutations.
 */
(()=>{
 'use strict';
 const CAMPAIGN='evil-specialist-r1-20261014';
 const CLASS='otgEvilRoCompact8168';
 const BADGE='rhEvilUsedBadge8166';
 const activeSpace=()=>{try{return window.rhSpace?.()||null}catch(_){return null}};
 const isEvil=ro=>!!ro&&(ro.type==='evil-r1'||ro.evilCampaignR1?.campaignId===CAMPAIGN);
 const str=x=>String(x??'');
 const carId=x=>x?.sourceCarId||x?.id||x?.carId||null;
 const name=x=>str(x?.name||[x?.make,x?.model,x?.year].filter(Boolean).join(' ')||'Unknown car');
 const validTime=x=>x!=null&&x!==''&&Number.isFinite(Number(x))&&Number(x)>0;
 function context(host){
  if(!host||host.classList.contains('hidden'))return null;
  const sp=activeSpace();if(!sp||sp.catalogueKey!=='fh5-catalogue-v1')return null;
  const page=host.querySelector('.rhRaceOffDrawSceneV6118,.rh5801Entry');if(!page)return null;
  // The specific Race Off id must be present in a native handler. Never guess
  // an active event from a global pointer or another saved bracket.
  let id=null;
  for(const el of page.querySelectorAll('[onclick]')){
   const handler=el.getAttribute('onclick')||'';
   const match=handler.match(/rhRaceOff(?:EnterNext|StartRound|RenderRoundProgress|RenderDrawComplete|DrawTab|OpenRoundSetup|SaveMatchResult)\s*\(\s*['"]([^'"<>]+)['"]/);
   if(match){id=match[1];break;}
  }
  if(!id)return null;
  const ro=(sp.raceOffs||[]).find(x=>str(x.id)===id&&isEvil(x));
  if(!ro||ro.status==='complete'||ro.status==='abandoned')return null;
  const idx=Number(ro.currentRoundIndex||0);
  const round=ro.rounds?.[idx];
  if(!round)return null;
  const used=typeof window.rhEvilUsedLedger8167==='function'?window.rhEvilUsedLedger8167(sp):new Map();
  return {sp,page,ro,round,used};
 }
 function badge(info){
  if(!info)return null;
  const b=document.createElement('span');b.className=BADGE+' otgRoUsedBadge8168';b.textContent='E✓';
  if(typeof window.rhEvilPaintUsedBadge8167==='function')window.rhEvilPaintUsedBadge8167(b,info);
  return b;
 }
 function addBadge(where,id,used){
  if(!where||!id)return;
  const info=used.get(str(id));if(!info)return;
  const existing=where.querySelector('.'+BADGE);
  const history=where.querySelector('.otgDrawHistory8131');
  if(existing){
   if(typeof window.rhEvilPaintUsedBadge8167==='function')window.rhEvilPaintUsedBadge8167(existing,info);
   if(history&&history.previousElementSibling!==existing)where.insertBefore(existing,history);
   return;
  }
  const b=badge(info);if(b){if(history)where.insertBefore(b,history);else where.appendChild(b);}
 }
 function historyButton(id){
  if(!id||typeof window.rhDrawCarHistory8131!=='function')return null;
  const b=document.createElement('button');b.type='button';b.className='otgRoHistory8168';
  b.textContent='▤';b.title='Car History';b.setAttribute('aria-label','Open Car History for this car');
  b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();window.rhDrawCarHistory8131(str(id));});
  return b;
 }
 function carLine(car,used,label){
  const id=carId(car),line=document.createElement('div');line.className='otgRoNextLine8168';
  const body=document.createElement('div');body.className='otgRoNextName8168';
  const hint=document.createElement('small');hint.textContent=label;
  const title=document.createElement('strong');title.textContent=name(car);
  addBadge(title,id,used);body.append(hint,title);line.append(body);
  const h=historyButton(id);if(h)line.append(h);
  return line;
 }
 function currentMatch(rd){return (rd.matches||[]).find(m=>m&&m.status!=='complete')||null;}
 function highlight(page,rd,used){
  const cards=[...page.querySelectorAll('.rhRaceOffDrawScrollV6118 > .rhRaceOffDrawMatchV6118')];
  const matches=rd.matches||[];
  // Native draw tabs can show STRAIGHT THROUGH instead of matches. Do not
  // associate unrelated DOM rows with cars when the counts do not match.
  if(cards.length!==matches.length)return;
  const next=currentMatch(rd);
  cards.forEach((card,i)=>{
   const match=matches[i];const labels=[...card.children].filter(x=>x.tagName==='B');
   if(labels.length!==2)return;
   addBadge(labels[0],carId(match.carA),used);
   addBadge(labels[1],carId(match.carB),used);
   if(next&&str(match.id)===str(next.id)){
    card.classList.add('otgRoNextMatch8168');
    const k=card.querySelector(':scope > small');
    if(k&&!k.querySelector('.otgRoNextTag8168')){
     const tag=document.createElement('em');tag.className='otgRoNextTag8168';tag.textContent='NEXT';k.appendChild(tag);
    }
   }
  });
 }
 function addNext(page,rd,used){
  if(page.querySelector('.otgRoNextBox8168'))return;
  const m=currentMatch(rd);
  if(!m||!m.carA||!m.carB)return;
  const shell=page.querySelector('.rhRaceOffDrawListShellV6118');if(!shell)return;
  if(validTime(m.resultA?.time)&&validTime(m.resultB?.time))return; // Native tie-break state; never guess who races next.
  const isSecond=validTime(m.resultA?.time);
  const box=document.createElement('section');box.className='otgRoNextBox8168';
  const heading=document.createElement('div');heading.className='otgRoNextHeading8168';
  const a=document.createElement('b');a.textContent='UP NEXT · '+str(m.label||'MATCH');
  const small=document.createElement('span');small.textContent=isSecond?'SECOND RACER NEXT':'FIRST RACER NEXT';
  heading.append(a,small);
  const lines=document.createElement('div');lines.className='otgRoNextCars8168';
  lines.append(carLine(m.carA,used,isSecond?'FIRST CAR · RESULT SAVED':'FIRST CAR'),carLine(m.carB,used,isSecond?'SECOND CAR · NEXT':'SECOND CAR'));
  if(isSecond)lines.lastElementChild.classList.add('otgRoRacingNext8168');
  else lines.firstElementChild.classList.add('otgRoRacingNext8168');
  box.append(heading,lines);shell.insertAdjacentElement('beforebegin',box);
 }
 function decorateEntry(page,rd,used){
  const title=page.querySelector('.rh5801Context > b');if(!title)return;
  const next=currentMatch(rd);if(!next)return;
  const side=validTime(next.resultA?.time)?'B':'A';
  const car=side==='A'?next.carA:next.carB;const id=carId(car);if(!id)return;
  // The native entry heading must match this exact queued car. This prevents
  // a stale read-only badge during a re-render or tie-break transition.
  const heading=str([...title.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.textContent).join('')).trim();
  if(heading&&heading!==name(car))return;
  addBadge(title,id,used);
  const row=page.querySelector('.rh5801Context');
  if(row&&!row.querySelector('.otgRoHistory8168')){
   const b=historyButton(id);if(b){b.classList.add('otgRoEntryHistory8168');row.appendChild(b);}
  }
  page.classList.add(CLASS);
 }
 function decorate(){
  const host=document.getElementById('raceoff');const ctx=context(host);if(!ctx)return;
  const {page,round,used}=ctx;
  if(page.classList.contains('rh5801Entry'))return decorateEntry(page,round,used);
  // For large locked draws and in-progress rounds only. Leave post-race
  // finals, completed match reports and non-Evil Race Off views unchanged.
  if(round.status!=='drawn'&&round.status!=='racing')return;
  if(!page.querySelector('.rhRaceOffDrawListShellV6118'))return;
  page.classList.add(CLASS);
  addNext(page,round,used);
  highlight(page,round,used);
 }
 let queued=false;
 function schedule(){if(queued)return;queued=true;
  (window.requestAnimationFrame||((f)=>setTimeout(f,16)))(()=>{queued=false;try{decorate()}catch(e){console.warn('OTG Race Off display enhancement skipped',e)}});
 }
 function start(){const root=document.getElementById('raceoff');if(!root)return;
  new MutationObserver(schedule).observe(root,{childList:true,subtree:true});schedule();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
 window.otgEvilRaceOffDisplayQA8168=()=>({version:'8.0.168',readonly:true,hasRaceOffScreen:!!document.querySelector('#raceoff .'+CLASS),usesLastEventColour:true});
})();
