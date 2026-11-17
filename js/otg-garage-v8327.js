/* OTG! MAIN v8.0.327 — Garage Smart Tile makeover.
 * Read-only presentation layer over native Garage; original ownership toggles,
 * car editors, History, Space data, searches and intelligence remain intact.
 */
(()=>{'use strict';
 const STORE={view:'home',make:'',spaceId:''};
 const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const key=v=>String(v??'');
 const storeRoot=()=>document.querySelector('#garage > .rhGarageV1');
 const space=()=>typeof window.rhSpace==='function'?window.rhSpace():null;
 const validTime=x=>x!==null&&x!==undefined&&x!==''&&Number.isFinite(Number(x))&&Number(x)>0;
 function activity(sp){
   const ids=new Set(),evil=new Map();
   function timed(r,id){const k=key(id??r?.carId??r?.car?.sourceCarId);if(r&&validTime(r.time)&&k)ids.add(k);}
   for(const run of sp?.runs||[])for(const r of run.results||[])timed(r,r.carId);
   for(const ev of sp?.customEvents||[]){
     for(const r of ev.results||[])timed(r,r.carId);
     for(const block of [ev.customSwiss?.rounds,ev.swissCompleted?.rounds,ev.customKO?.rounds])for(const rd of block||[])for(const m of rd.matches||[]){timed(m.resultA,m.carA);timed(m.resultB,m.carB);}
   }
   for(const ro of sp?.raceOffs||[])for(const rd of ro.rounds||[])for(const m of rd.matches||[]){timed(m.resultA,m.carA);timed(m.resultB,m.carB);}
   // Reuse the established R1 Evil ledger. A coloured badge requires a SAVED
   // scored/timed result, never a draw assignment or merely owning a car.
   try{const source=window.rhEvilUsedLedger8167?.(sp);if(source instanceof Map)for(const [id,x] of source)evil.set(key(id),{kind:x.kind,at:x.at||0,label:x.eventLabel||'',slot:x.slot||0});}catch(_){/* neutral badges if unavailable */}
   const classify=(meta,name)=>{
     const t=[meta?.kind,meta?.ecosystem,meta?.pool,meta?.type,meta?.stage,name].filter(Boolean).join(' ').toLowerCase();
     if(/drift/.test(t))return 'purple';
     if(/cross[ -]?country/.test(t))return 'green';
     if(/off[ -]?road|dirt|rally/.test(t))return 'orange';
     if(/road|street/.test(t))return 'cyan';
     return 'unknown'; // Saved Evil race, but no independently verified event category.
   };
   function recordE(id,run,r,meta){
     if(!validTime(r?.time))return;
     const car=key(id??r?.carId??r?.car?.sourceCarId);if(!car)return;
     const at=Date.parse(r?.date||r?.savedAt||run?.updatedAt||run?.startedAt||run?.createdAt||'')||0;
     const slot=Number(meta?.slot)||0;
     const before=evil.get(car);
     if(before&&(before.at>at||(before.at===at&&(before.slot||0)>slot)))return;
     evil.set(car,{kind:classify(meta,run?.name||''),label:run?.name||'Evil Tournament',at,slot});
   }
   for(const run of sp?.runs||[])if(run?.evilCampaignR2){for(const r of run.results||[])recordE(r.carId,run,r,run.evilCampaignR2);}
   for(const run of sp?.raceOffs||[])if(run?.evilCampaignR2){for(const rd of run.rounds||[])for(const m of rd.matches||[]){recordE(m.carA,run,m.resultA,run.evilCampaignR2);recordE(m.carB,run,m.resultB,run.evilCampaignR2);}}
   for(const [id,x] of evil){if(x.kind==='road')x.kind='cyan';else if(x.kind==='drift')x.kind='purple';else if(x.kind==='offroad')x.kind=/cross[ -]?country/i.test(x.label)?'green':'orange';
     ids.add(id); // Scored Evil events also establish genuine recorded racing activity.
   }
   return{ids,evil};
 }
 function metrics(sp,root){
   const cat=root.classList.contains('rhCatalogueGarageV84');
   let total=sp?.cars?.length||0,owned=total;
   if(cat){const g=root.querySelector('.rhGarageSummaryV1 strong');const text=g?.textContent||'';const parts=text.match(/\d[\d,]*/g)||[];
     if(parts.length>=2){owned=Number(parts[0].replaceAll(',',''));total=Number(parts[1].replaceAll(',',''));}}
   let name=String(sp?.name||'Your Space');
   if(sp?.catalogueKey==='fh5-catalogue-v1')name='Forza Horizon 5';
   if(sp?.catalogueKey==='gt7-catalogue-v1')name='Gran Turismo 7';
   return{cat,total,owned,name};
 }
 function home(root,stats){
   const body=root.querySelector('.rhGarageBodyV1');if(!body)return;
   const intro=document.createElement('section');intro.className='otg327-welcome';
   intro.innerHTML=`<p>YOUR COLLECTION • YOUR HISTORY • YOUR CARS</p>`;
   body.prepend(intro);
   const tile=document.createElement('button');tile.type='button';tile.className='otg327-catalogue-link';
   tile.innerHTML=`<span class="otg327-home-icon" aria-hidden="true">⌂</span><span class="otg327-catalogue-name"><strong>${stats.cat?'CATALOGUE':'YOUR CARS'}</strong><small>${E(stats.name)} · Browse, search and manage your cars</small></span><span class="otg327-owned"><b>${stats.owned}</b><small>${stats.cat?'/ '+stats.total+' OWNED':'CARS'}</small></span><span class="otg327-arrow">›</span>`;
   tile.addEventListener('click',()=>go('catalogue'));
   intro.insertAdjacentElement('afterend',tile);
   const note=document.createElement('div');note.className='otg327-home-note';note.textContent='Browse, search and manage your cars. The Garage is always available.';
   const intel=body.querySelector('#otgIntelTileSet8122');if(intel){intel.insertAdjacentElement('afterend',note);}else tile.insertAdjacentElement('afterend',note);
 }
 function nav(root,stats){
   const body=root.querySelector('.rhGarageBodyV1');if(!body)return;
   const controls=document.createElement('div');controls.className='otg327-subnav';
   controls.innerHTML=`<button type="button" class="otg327-subback" aria-label="Back to previous Garage page">‹ BACK</button><div class="otg327-subcopy"><strong>CATALOGUE MANUFACTURERS</strong><small>${E(stats.name)} • ${stats.owned} ${stats.cat?'OF '+stats.total+' OWNED':'CARS'}</small></div>`;
   controls.querySelector('button').addEventListener('click',()=>go(STORE.view==='make'?'catalogue':'home'));
   body.prepend(controls);
   const empty=document.createElement('p');empty.className='otg327-no-match';empty.textContent='No matching cars in this manufacturer.';
   body.appendChild(empty);
   root.addEventListener('click',ev=>{
     const head=ev.target.closest('.rhGarageMakeHeadV1');
     if(!head||!root.contains(head)||STORE.view!=='catalogue')return;
     ev.preventDefault();ev.stopImmediatePropagation();
     const group=head.closest('.rhGarageMakeV1');if(group)go('make',group.dataset.make||'');
   },true);
 }
 function embellishRows(root,sp){
   const carIndex=new Map((sp?.cars||[]).filter(c=>c&&c.catalogueId).map(c=>[key(c.catalogueId),c]));
   const {ids,evil}=activity(sp);
   for(const row of root.querySelectorAll('.rhCatalogueGarageCar,.rhGarageCarV1')){
     if(row.classList.contains('otg327-car-row'))continue;
     const catalogue=row.matches('.rhCatalogueGarageCar:not(.rhManualSpecialCar)');
     let car=null;
     if(catalogue){car=carIndex.get(key(row.dataset.catalogueId));}
     else{
       const edit=row.querySelector('button[onclick*="rhOpenCarEditor"]');
       const match=edit?.getAttribute('onclick')?.match(/rhOpenCarEditor\('([^']+)'\)/);
       car=(sp?.cars||[]).find(c=>key(c.id)===key(match?.[1]))||null;
     }
     const active=!!car&&ids.has(key(car.id));
     const state=car?evil.get(key(car.id)):null;
     const group=document.createElement('span');group.className='otg327-badges';
     let H=row.querySelector('.v7HistoryBtn');
     if(H){H.textContent='H';H.classList.add('otg327-mini-h');H.setAttribute('aria-label','Open Car History');H.title='Open Car History';}
     else if(car){
       H=document.createElement('button');H.type='button';H.className='v7HistoryBtn otg327-mini-h';H.textContent='H';H.title='Open Car History';H.setAttribute('aria-label','Open Car History');
       H.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();window.rhOpenCarHistoryV7001?.(String(car.id));});
     }else{H=document.createElement('span');H.className='otg327-mini-h';H.textContent='H';H.title='No racing history (car not owned)';}
     H.classList.toggle('otg327-h-active',active);
     const Ebadge=document.createElement('span');Ebadge.className='otg327-mini-e';Ebadge.textContent='E✓';
     if(state){if(state.kind!=='unknown')Ebadge.dataset.kind=state.kind;Ebadge.title=`Last saved Evil result: ${state.label||'Evil Tournament'}`+(state.kind==='unknown'?' (event type unverified)':'');}
     else Ebadge.title='No saved Evil result';
     group.append(H,Ebadge);
     group.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();});
     if(catalogue)row.append(group);else{const edit=row.querySelector('button[onclick*="rhOpenCarEditor"]');if(edit)row.insertBefore(group,edit);else row.append(group);}row.classList.add('otg327-car-row');
     // Never rely on guessed text to attach badges: car identity comes from
     // the original catalogue-ID or the original edit button's stable car ID.
   }
 }
 function selected(root){
   const make=STORE.make;let found=false,visible=false;
   for(const group of root.querySelectorAll('.rhGarageMakeV1')){
     const yes=STORE.view==='make'&&key(group.dataset.make)===make;
     group.classList.toggle('otg327-selected',yes);
     if(yes){found=true;const list=group.querySelector('.rhGarageCarsV1');if(list){list.hidden=false;visible=[...list.querySelectorAll('.rhCatalogueGarageCar,.rhGarageCarV1')].some(r=>!r.hidden);}}
   }
   const sub=root.querySelector('.otg327-subcopy strong');const stat=root.querySelector('.otg327-subcopy small');
   if(sub)sub.textContent=STORE.view==='make'?make: 'CATALOGUE MANUFACTURERS';
   if(stat&&STORE.view==='make'){
     const group=[...root.querySelectorAll('.rhGarageMakeV1')].find(g=>key(g.dataset.make)===make);
     stat.textContent=group?.querySelector('.rhGarageMakeHeadV1 span')?.textContent||'Cars in this manufacturer';
   }
   root.querySelector('.otg327-no-match')?.classList.toggle('otg327-show',STORE.view==='make'&&found&&!visible);
   if(STORE.view==='make'&&!found){STORE.view='catalogue';root.dataset.otg327View=STORE.view;}
 }
 function go(view,make=''){
   if(!['home','catalogue','make'].includes(view))return;
   STORE.view=view;STORE.make=make;
   const root=storeRoot();if(!root)return;
   root.dataset.otg327View=view;selected(root);
   // Clear the manufacturer-search string on returning to the directory;
   // this touches only the visible filter (never persistent Garage data).
   if(view==='catalogue'&&root.querySelector('.rhGarageToolsV1 input')?.value){
     const input=root.querySelector('.rhGarageToolsV1 input');input.value='';
     if(root.classList.contains('rhCatalogueGarageV84')){
       try{window.otgCatalogueFilterLive?.(String(space()?.catalogueKey).includes('fh5')?'fh5':'gt7',input);}catch(_){}
     }else try{window.rhGarageFilterLive?.('');}catch(_){}
   }
   const nav=root.querySelector('.otg327-subnav');if(nav)nav.querySelector('.otg327-subback').textContent=view==='make'?'‹ MANUFACTURERS':'‹ GARAGE';
   const input=root.querySelector('.rhGarageToolsV1 input');if(input)input.placeholder=view==='make'?`Search ${make}...`:'Search manufacturer or car...';
   window.scrollTo(0,0);
 }
 function enhance(){
   const root=storeRoot();if(!root||root.classList.contains('otg327-ready'))return;
   const sp=space();if(!sp)return;
   if(STORE.spaceId!==key(sp.id)){STORE.view='home';STORE.make='';STORE.spaceId=key(sp.id);}
   const stats=metrics(sp,root);
   root.classList.add('otg327-ready');root.dataset.otg327View=STORE.view;
   root.dataset.otg327Catalogue=stats.cat?'yes':'no';
   const banner=document.createElement('header');banner.className='otg327-top';
   banner.innerHTML='<button type="button" aria-label="Back to dashboard">‹ BACK</button><h1><em>OTG!</em> / GARAGE</h1><span class="otg327-chequer" aria-hidden="true">▰▰</span>';
   banner.querySelector('button').addEventListener('click',()=>{
     if(STORE.view==='make')return go('catalogue');
     if(STORE.view==='catalogue')return go('home');
     if(typeof window.rhShow==='function')window.rhShow('home');else window.show?.('home');
   });
   root.prepend(banner);
   home(root,stats);nav(root,stats);embellishRows(root,sp);selected(root);
   const note=document.createElement('div');note.className='otg327-legend';note.innerHTML='<b>H</b> Car History <b>E✓</b> Last saved Evil race type · grey = no saved activity';
   root.querySelector('.rhGarageBodyV1')?.appendChild(note);
 }
 const old=window.rhRenderGarage;
 if(typeof old==='function')window.rhRenderGarage=function(...args){const output=old.apply(this,args);try{enhance()}catch(e){console.warn('OTG! Garage visual layer skipped',e)}return output;};
 // Other native flows (e.g. catalogue searches and ownership toggles) may call
 // the underlying catalogue renderer directly. Reapply only on full replacement.
 const host=document.getElementById('garage');
 if(host){let pending=false;new MutationObserver(()=>{
   if(pending)return;const root=storeRoot();if(!root||root.classList.contains('otg327-ready'))return;
   pending=true;queueMicrotask(()=>{pending=false;try{enhance()}catch(e){console.warn('Garage enhancement skipped',e)}});
 }).observe(host,{childList:true,subtree:false});}
 window.otg327GarageView=go;
})();
