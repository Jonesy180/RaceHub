/* OTG! MAIN v8.0.332 — Garage Intelligence Back label correction.
   Native Garage Intelligence owns all logic, filters, results and calculations.
   Stable car IDs are obtained from its existing read-only analyse method.
   Ambiguous car labels remain neutral rather than assigning guessed badges. */
(()=>{'use strict';
 const host=document.getElementById('garage');if(!host)return;
 const normal=v=>String(v??'').trim();
 const kindOf=v=>{
   const k=normal(v).toLowerCase();
   if(k==='cyan'||k==='road'||k==='street')return 'cyan';
   if(k==='green'||k==='cross country'||k==='cross-country')return 'green';
   if(k==='orange'||k==='offroad'||k==='off-road'||k==='dirt'||k==='rally')return 'orange';
   if(k==='purple'||k==='drift')return 'purple';
   return '';
 };
 function update(){
  const page=host.querySelector(':scope > .otgIntel8122');if(!page)return;
  const head=page.querySelector('.otgIntelHead8122');
  // Native Garage Back action is retained. Only restore its visible label.
  const back=head?.querySelector(':scope > button.rhBack');
  if(back && back.textContent.trim()!=='‹ BACK') back.textContent='‹ BACK';
  if(head&&!head.querySelector('.otg331-dash')){
    const btn=document.createElement('button');btn.type='button';btn.className='otg331-dash';
    btn.textContent='⌂ DASHBOARD';btn.setAttribute('aria-label','Return to dashboard');
    btn.addEventListener('click',()=>{
      if(typeof window.rhShow==='function')window.rhShow('home');
      else window.show?.('home');
    });
    head.appendChild(btn);
  }
  const cards=[...page.querySelectorAll('.otgIntelCar8122,.otgIntelWinner8122,.otgIntelCompareCar8122')]
    .filter(el=>!el.querySelector(':scope > .otg331-badges'));
  if(!cards.length)return;
  const sp=typeof window.rhSpace==='function'?window.rhSpace():null;
  let rows=[];
  try{rows=window.otgGarageIntelQA8122?.analyse?.(sp)||[];}catch(_){/* stay neutral */}
  const names=new Map();
  for(const row of rows){
    const name=normal(row.name);if(!name)continue;
    names.set(name,names.has(name)?null:row);
  }
  let ledger=null;
  try{ledger=window.rhEvilUsedLedger8167?.(sp)||null;}catch(_){/* no verified Evil state */}
  for(const card of cards){
    const name=normal(card.querySelector(':scope > b')?.textContent);
    if(!name)continue;
    const row=names.get(name)||null;
    const badges=document.createElement('span');badges.className='otg331-badges';
    let H;
    if(row?.id && typeof window.rhOpenCarHistoryV7001==='function'){
      H=document.createElement('button');H.type='button';
      H.setAttribute('aria-label','Open Car History for '+name);
      H.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();window.rhOpenCarHistoryV7001(row.id)});
    }else H=document.createElement('span');
    H.textContent='H';H.title=row?'Car History':'Car History unavailable for ambiguous car';
    if(row?.starts>0)H.classList.add('otg331-active');
    const E=document.createElement('span');E.textContent='E✓';
    E.title='No verified Evil race type';
    if(row?.id && ledger instanceof Map){
      const item=ledger.get(String(row.id))||ledger.get(row.id);
      const k=kindOf(item?.kind);
      if(k){E.dataset.kind=k;E.title='Last verified Evil race type: '+k;H.classList.add('otg331-active');}
    }
    badges.append(H,E);card.appendChild(badges);
  }
 }
 let pending=false;
 new MutationObserver(()=>{
   if(pending)return;pending=true;
   queueMicrotask(()=>{pending=false;try{update()}catch(err){console.warn('OTG! Garage Intelligence visual layer skipped',err)}});
 }).observe(host,{childList:true,subtree:true});
 update();
})();
