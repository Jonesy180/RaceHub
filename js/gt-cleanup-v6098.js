/* OTG! v6.0.98 — catalogue manufacturer-level rename + compact inline actions + search fit. */
(()=>{'use strict';
const safe=s=>typeof esc==='function'?esc(String(s??'')):String(s??'');
function space(){try{return rhSpace()}catch(_){return null}}
function aliasFor(s,make){return (s.catalogueMakeAliases||{})[make]||make}
function originalMakeFromHeading(section){return section?.dataset?.make||''}
function renameMake(oldMake){
 const s=space(); if(!s||!s.catalogueOwned)return;
 const current=aliasFor(s,oldMake); const raw=prompt('Rename manufacturer',current); if(raw==null)return;
 const next=String(raw).trim(); if(!next||next===current)return;
 s.catalogueMakeAliases=s.catalogueMakeAliases||{}; s.catalogueMakeAliases[oldMake]=next;
 // Rename every linked Garage copy belonging to this catalogue manufacturer, preserving immutable catalogue IDs.
 const catalogue=(s.catalogueKey==='fh5'?window.FH5_CATALOGUE:window.GT7_CATALOGUE)||[];
 const idFn=s.catalogueKey==='fh5'?window.fh5CarId:window.gt7CarId;
 const ids=new Set(catalogue.filter(c=>c.make===oldMake).map(c=>String(idFn(c))));
 (s.cars||[]).forEach(c=>{if(c.catalogueId&&ids.has(String(c.catalogueId)))c.make=next});
 // A rename is identity-preserving: Favourite and existing championship/run grouping follows it, never deletes progress.
 if(s.favouriteManufacturer===current||s.favouriteManufacturer===oldMake)s.favouriteManufacturer=next;
 (s.runs||[]).forEach(r=>{if((r.type==='favourite'||r.type==='manufacturer')&&(r.value===current||r.value===oldMake))r.value=next});
 try{rhSave()}catch(_){}; try{rhSync()}catch(_){};
 try{s.catalogueKey==='fh5'?fh5RenderCatalogue():gt7RenderCatalogue()}catch(_){try{rhRenderGarage()}catch(__){}}
}
function polishCatalogue(){
 const s=space(); if(!s||!s.catalogueOwned)return;
 document.querySelectorAll('.rhCatalogueGarageV84 .rhGarageToolsV1 input').forEach(i=>i.placeholder='Search manufacturer and car');
 document.querySelectorAll('.rhGarageMakeV1').forEach(sec=>{
   const old=originalMakeFromHeading(sec),head=sec.querySelector('.rhGarageMakeHeadV1'),b=head?.querySelector('b'); if(!old||!head||!b)return;
   b.textContent=aliasFor(s,old);
   if(!sec.querySelector('.rhGT98MakeEdit')){const x=document.createElement('button');x.type='button';x.className='rhGT98MakeEdit';x.title='Rename manufacturer';x.setAttribute('aria-label','Rename manufacturer');x.textContent='✎';x.onclick=e=>{e.preventDefault();e.stopPropagation();renameMake(old)};head.insertAdjacentElement('afterend',x)}
 });
 document.querySelectorAll('.rhCatalogueGarageCar.owned').forEach(row=>{
   row.querySelector('.rhGT96CatActions')?.remove(); row.querySelector('.rhGT97InlineActions')?.remove();
   const cid=row.dataset.catalogueId,car=(s.cars||[]).find(c=>String(c.catalogueId)===String(cid))||(s.cars||[]).find(c=>String(c.id)===String(s.catalogueOwned[cid])); if(!car)return;
   const b=row.querySelector('span:last-child > b'); if(!b||b.querySelector('.rhGT98InlineActions'))return;
   const a=document.createElement('span');a.className='rhGT98InlineActions';a.innerHTML=`<button type="button" class="rhGT98Edit" title="Edit car" aria-label="Edit car">✎</button>${String(car.notes||'').trim()?'<button type="button" class="rhGT98Note" title="View car note" aria-label="View car note">✉</button>':''}`;
   a.querySelector('.rhGT98Edit').onclick=e=>{e.preventDefault();e.stopPropagation();rhOpenCarEditor(car.id);setTimeout(lockCatalogueMake,0)};
   a.querySelector('.rhGT98Note')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();window.rhGT95ViewCarNote?rhGT95ViewCarNote(car.id):rhOpenCarNotesV6012(car.id)}); b.appendChild(a);
 });
}
function lockCatalogueMake(){const s=space(),ed=document.getElementById('rhCarEditor'),i=document.getElementById('rhCarMake');if(!s?.catalogueOwned||!ed||!i)return;const id=ed.dataset?.carId;let car=id?(s.cars||[]).find(c=>String(c.id)===String(id)):null;if(!car){const val=i.value;car=(s.cars||[]).find(c=>c.catalogueId&&c.make===val)}if(!car?.catalogueId)return;i.readOnly=true;i.setAttribute('aria-readonly','true');i.title='Rename catalogue manufacturers from the manufacturer heading';const box=document.getElementById('rhMakeSuggestions');if(box){box.innerHTML='';box.hidden=true}if(!i.parentElement.querySelector('.rhGT98MakeHint'))i.insertAdjacentHTML('afterend','<small class="rhGT98MakeHint">Rename this manufacturer from its catalogue heading.</small>')}
let queued=false;function run(){queued=false;polishCatalogue();lockCatalogueMake()}
new MutationObserver(()=>{if(!queued){queued=true;requestAnimationFrame(run)}}).observe(document.body,{subtree:true,childList:true});run();
window.RACEHUB_VERSION='6.0.98';
})();
