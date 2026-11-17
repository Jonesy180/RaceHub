/* OTG! MAIN v8.0.330 — read-only Car History visual decorator.
   Native Car History builds every statistic. This script only introduces a
   compact car identification strip and applies approved Smart Tile styling. */
(()=>{'use strict';
 const text=v=>String(v??'').trim();
 function enhance(id){
  const root=document.getElementById('rhCarHistoryV7001');
  const page=root?.querySelector('.v7CarHistoryPage');
  const header=page?.querySelector(':scope > header');
  if(!page||!header||page.querySelector('.otg330-carhero'))return;
  const sp=typeof window.rhSpace==='function'?window.rhSpace():null;
  const car=(sp?.cars||[]).find(c=>text(c?.id)===text(id));
  const oldName=header.querySelector('small')?.textContent||'Your car';
  const year=text(car?.year),category=text(car?.classType);
  const name=car?[car.make,car.model].map(text).filter(Boolean).join(' ')||oldName:oldName;
  const title=header.querySelector('h1');
  if(title){title.innerHTML='<em>OTG!</em> / CAR HISTORY';}
  const hero=document.createElement('section');hero.className='otg330-carhero';
  const icon=document.createElement('span');icon.className='otg330-car-symbol';icon.setAttribute('aria-hidden','true');
  icon.innerHTML='<svg viewBox="0 0 38 30"><path d="M6 21h26l-2.5-9a5 5 0 0 0-4.7-3.6H13.2A5 5 0 0 0 8.5 12L6 21Z"/><path d="M5 20H3v-5h4M33 20h2v-5h-4M7 21v5M31 21v5M12 17h14"/><circle cx="11" cy="22" r="1"/><circle cx="27" cy="22" r="1"/></svg>';
  const copy=document.createElement('div');copy.className='otg330-car-copy';
  const nm=document.createElement('strong');nm.textContent=name;
  const details=document.createElement('small');details.textContent=[year,category].filter(Boolean).join(' • ')||'CAR HISTORY';
  copy.append(nm,details);
  const badges=document.createElement('span');badges.className='otg330-history-badges';
  const h=document.createElement('span');h.textContent='H';h.title='Saved car history';
  const e=document.createElement('span');e.textContent='E✓';e.title='Last verified Evil race type';
  // Borrow the EXACT visible state of this car's existing Garage mini-tiles.
  // If the Garage has not been rendered, never invent an Evil result colour.
  let source=null;
  if(car){
    const rows=document.querySelectorAll('#garage .otg327-car-row');
    for(const row of rows){
      if(car.catalogueId&&text(row.dataset.catalogueId)===text(car.catalogueId)){source=row;break;}
      const action=row.querySelector('.v7HistoryBtn[onclick]')?.getAttribute('onclick')||'';
      if(action.includes('rhOpenCarHistoryV7001')&&action.includes("'"+text(id)+"'")){source=row;break;}
    }
  }
  if(source){
    const oldH=source.querySelector('.otg327-mini-h'),oldE=source.querySelector('.otg327-mini-e');
    if(oldH?.classList.contains('otg327-h-active'))h.classList.add('otg330-h-active');
    if(oldE?.dataset.kind)e.dataset.kind=oldE.dataset.kind;
    if(oldE?.title)e.title=oldE.title;
  }else if(typeof window.rhV7RecordsFoundation?.allRows==='function'){
    // Source not visible: current Space's genuine timed history is safe for H.
    try{if(window.rhV7RecordsFoundation.allRows().some(r=>text(r.carId)===text(id)&&Number(r.time)>0))h.classList.add('otg330-h-active');}catch(_){/* neutral */}
  }
  badges.append(h,e);hero.append(icon,copy,badges);
  header.insertAdjacentElement('afterend',hero);
  const note=document.createElement('aside');note.className='otg330-note';
  note.innerHTML='<b aria-hidden="true">ⓘ</b><span>Car History tracks genuine racing activity, Championship results, honours and personal bests for this car.</span>';
  page.appendChild(note);
  root.classList.add('otg330-history-ready');
 }
 const open=window.rhOpenCarHistoryV7001;
 if(typeof open==='function')window.rhOpenCarHistoryV7001=function(id){
   const r=open.apply(this,arguments);
   try{enhance(id);}catch(err){console.warn('OTG! Car History styling skipped',err);}
   return r;
 };
})();
