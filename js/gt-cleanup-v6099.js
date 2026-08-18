/* OTG! v6.0.99 — stable catalogue manufacturer rename, native modal, compact actions. */
(()=>{'use strict';
const safe=s=>typeof esc==='function'?esc(String(s??'')):String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function space(){try{return rhSpace()}catch(_){return null}}
function aliasFor(s,make){return (s.catalogueMakeAliases||{})[make]||make}
function catalogueParts(s){const fh=s.catalogueKey==='fh5';return {catalogue:(fh?window.FH5_CATALOGUE:window.GT7_CATALOGUE)||[],idFn:fh?window.fh5CarId:window.gt7CarId,render:fh?window.fh5RenderCatalogue:window.gt7RenderCatalogue}}
function saveRename(oldMake,next){
 const s=space();if(!s||!s.catalogueOwned)return;const current=aliasFor(s,oldMake);next=String(next||'').trim();if(!next||next===current)return;
 s.catalogueMakeAliases=s.catalogueMakeAliases||{};s.catalogueMakeAliases[oldMake]=next;
 const {catalogue,idFn,render}=catalogueParts(s);const ids=new Set(catalogue.filter(c=>c.make===oldMake).map(c=>String(idFn(c))));
 (s.cars||[]).forEach(c=>{if(c.catalogueId&&ids.has(String(c.catalogueId)))c.make=next});
 if(s.favouriteManufacturer===current||s.favouriteManufacturer===oldMake)s.favouriteManufacturer=next;
 (s.runs||[]).forEach(r=>{if((r.type==='favourite'||r.type==='manufacturer')&&(r.value===current||r.value===oldMake))r.value=next});
 try{rhSave()}catch(_){};try{rhSync()}catch(_){};document.getElementById('rhGT99Rename')?.remove();try{render&&render()}catch(_){}
}
window.rhGT99SaveRename=function(oldMake){saveRename(decodeURIComponent(oldMake),document.getElementById('rhGT99RenameInput')?.value)};
function openRename(oldMake){const s=space();if(!s)return;document.getElementById('rhGT99Rename')?.remove();const current=aliasFor(s,oldMake);document.body.insertAdjacentHTML('beforeend',`<div id="rhGT99Rename" class="rhOverlay"><div class="rhModal rhFormModal"><button class="rhModalX" onclick="document.getElementById('rhGT99Rename').remove()">×</button><h2>RENAME MANUFACTURER</h2><p>Rename this manufacturer across its linked catalogue Garage cars.</p><label>Manufacturer</label><input id="rhGT99RenameInput" class="rhSearch" autocomplete="off" value="${safe(current)}"><div class="rhModalActions"><button class="btn secondary" onclick="document.getElementById('rhGT99Rename').remove()">CANCEL</button><button class="btn" onclick="rhGT99SaveRename('${encodeURIComponent(oldMake)}')">SAVE</button></div></div></div>`);setTimeout(()=>document.getElementById('rhGT99RenameInput')?.focus(),50)}
function lockCatalogueMake(){const s=space(),ed=document.getElementById('rhCarEditor'),i=document.getElementById('rhCarMake');if(!s?.catalogueOwned||!ed||!i)return;const id=ed.dataset?.carId;let car=id?(s.cars||[]).find(c=>String(c.id)===String(id)):null;if(!car?.catalogueId)return;if(!i.readOnly)i.readOnly=true;i.setAttribute('aria-readonly','true');i.title='Rename catalogue manufacturers from the manufacturer heading';const box=document.getElementById('rhMakeSuggestions');if(box&&!box.hidden){box.innerHTML='';box.hidden=true}if(!i.parentElement.querySelector('.rhGT99MakeHint'))i.insertAdjacentHTML('afterend','<small class="rhGT99MakeHint">Rename this manufacturer from its catalogue heading.</small>')}
function polishCatalogue(){
 const s=space();if(!s?.catalogueOwned)return;
 document.querySelectorAll('.rhCatalogueGarageV84 .rhGarageToolsV1 input').forEach(i=>{if(i.placeholder!=='Search manufacturer and car')i.placeholder='Search manufacturer and car'});
 document.querySelectorAll('.rhCatalogueGarageV84 .rhGarageMakeV1').forEach(sec=>{const old=sec.dataset.make||'',head=sec.querySelector('.rhGarageMakeHeadV1'),b=head?.querySelector(':scope > b');if(!old||!head||!b)return;const alias=aliasFor(s,old);if(b.textContent!==alias)b.textContent=alias;if(!head.querySelector('.rhGT99MakeEdit')){const x=document.createElement('span');x.className='rhGT99MakeEdit';x.title='Rename manufacturer';x.setAttribute('role','button');x.setAttribute('aria-label','Rename manufacturer');x.textContent='✎';x.onclick=e=>{e.preventDefault();e.stopPropagation();openRename(old)};const count=head.querySelector('.rhCatalogueMakeCount');head.insertBefore(x,count||head.querySelector('em'))}});
 document.querySelectorAll('.rhCatalogueGarageCar.owned').forEach(row=>{row.querySelector('.rhGT96CatActions')?.remove();row.querySelector('.rhGT97InlineActions')?.remove();row.querySelector('.rhGT98InlineActions')?.remove();const cid=row.dataset.catalogueId,car=(s.cars||[]).find(c=>String(c.catalogueId)===String(cid))||(s.cars||[]).find(c=>String(c.id)===String(s.catalogueOwned[cid]));if(!car)return;const b=row.querySelector('span:last-child > b');if(!b||b.querySelector('.rhGT99InlineActions'))return;const a=document.createElement('span');a.className='rhGT99InlineActions';a.innerHTML=`<button type="button" class="rhGT99Edit" title="Edit car" aria-label="Edit car">✎</button>${String(car.notes||'').trim()?'<button type="button" class="rhGT99Note" title="View car note" aria-label="View car note">✉</button>':''}`;a.querySelector('.rhGT99Edit').onclick=e=>{e.preventDefault();e.stopPropagation();rhOpenCarEditor(car.id);setTimeout(lockCatalogueMake,0)};a.querySelector('.rhGT99Note')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();window.rhGT95ViewCarNote?rhGT95ViewCarNote(car.id):rhOpenCarNotesV6012(car.id)});b.appendChild(a)});
 lockCatalogueMake();
}
let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;polishCatalogue()})}
new MutationObserver(m=>{if(m.some(x=>[...x.addedNodes].some(n=>n.nodeType===1)))schedule()}).observe(document.body,{subtree:true,childList:true});
polishCatalogue();window.RACEHUB_VERSION='6.0.99';
})();
