/* OTG! PERSONAL MAIN v8.0.174 — Jones Mob private portrait exhibit.
 * PRIVATE BY DESIGN: user-selected image is stored only in origin-local IndexedDB,
 * never bundled, uploaded, cached by the service worker or written to racing saves.
 * Exposes a clearly visible working Back button on the Garage Noticeboard.
 */
(()=>{
 'use strict';
 const DB='OTG_Private_Gallery_v1', STORE='portraits', KEY='jones-mob-portrait';
 const MAX_BYTES=12*1024*1024;
 let displayedUrl=null;
 function openDb(){return new Promise((resolve,reject)=>{
   if(!window.indexedDB)return reject(new Error('Local photo storage unavailable'));
   const req=indexedDB.open(DB,1);
   req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE)};
   req.onerror=()=>reject(req.error||new Error('Could not open private gallery storage'));
   req.onsuccess=()=>resolve(req.result);
   req.onblocked=()=>reject(new Error('Private gallery storage busy'));
 });}
 async function getPortrait(){const db=await openDb();try{return await new Promise((resolve,reject)=>{
   const req=db.transaction(STORE,'readonly').objectStore(STORE).get(KEY);
   req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error||new Error('Could not load photo'));
 });}finally{db.close()}}
 async function putPortrait(file){const db=await openDb();try{return await new Promise((resolve,reject)=>{
   const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put({blob:file,filename:file.name,updatedAt:new Date().toISOString()},KEY);
   tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error||new Error('Could not save photo'));
   tx.onabort=()=>reject(tx.error||new Error('Photo save cancelled'));
 });}finally{db.close()}}
 async function removePortrait(){const db=await openDb();try{return await new Promise((resolve,reject)=>{
   const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(KEY);
   tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error||new Error('Could not remove photo'));
 });}finally{db.close()}}
 function imageClean(){if(displayedUrl){URL.revokeObjectURL(displayedUrl);displayedUrl=null}}
 function galleryClose(){imageClean();document.getElementById('otgPrivateGallery8174')?.remove();
   document.getElementById('otgNoticeOverlay8172')?.querySelector('[data-otg-private-open]')?.focus({preventScroll:true});}
 function showStatus(el,msg){el.textContent=msg;}
 async function refreshGallery(modal){
   const target=modal.querySelector('[data-otg-image-slot]'),removal=modal.querySelector('[data-otg-remove]');
   if(!target)return;
   target.replaceChildren();imageClean();
   try{
     const record=await getPortrait();if(!document.getElementById('otgPrivateGallery8174'))return;
     removal.hidden=!record;
     if(!record){const p=document.createElement('p');p.className='otgPrivateEmpty8174';p.textContent='Portrait not added to this device yet. Import the Jones Mob team portrait from your phone to hang it here.';target.appendChild(p);return;}
     displayedUrl=URL.createObjectURL(record.blob);
     const img=document.createElement('img');img.alt='The Jones Mob Racing Team — Financial Fair Play Department';img.src=displayedUrl;
     img.loading='eager';target.appendChild(img);
   }catch(e){showStatus(modal.querySelector('[data-otg-status]'),e.message||'Unable to open private gallery');removal.hidden=true;}
 }
 function openGallery(){
   document.getElementById('otgPrivateGallery8174')?.remove();imageClean();
   const modal=document.createElement('div');modal.id='otgPrivateGallery8174';modal.className='otgPrivateOverlay8174';
   modal.innerHTML=`<section class="otgPrivateSheet8174" role="dialog" aria-modal="true" aria-labelledby="otgPrivateTitle8174">
      <header><button type="button" class="otgPrivateBack8174" data-otg-gallery-back>← BACK</button>
         <div><small>OTG! · PRIVATE HALL OF SHAME EXHIBIT</small><h2 id="otgPrivateTitle8174">THE JONES MOB RACING TEAM</h2></div></header>
      <main><p class="otgPrivateSub8174">Financial Fair Play Department · Approved by Dave & Steve's accountants (allegedly)</p>
      <div class="otgPrivateImage8174" data-otg-image-slot><p class="otgPrivateEmpty8174">Loading private portrait…</p></div>
      <label class="otgPrivateImport8174">📷 IMPORT / REPLACE PORTRAIT FROM PHONE
        <input type="file" data-otg-file accept="image/png,image/jpeg,image/webp" aria-label="Select private team portrait image from this device"></label>
      <button class="otgPrivateRemove8174" type="button" data-otg-remove hidden>REMOVE PRIVATE COPY</button>
      <p class="otgPrivateStatus8174" role="status" data-otg-status></p>
      <p class="otgPrivateNote8174">The image stays only in this browser's private on-device storage. It is <strong>never uploaded to GitHub</strong> or stored in your racing data. OTG! Portable Backups do not include it; keep your own original picture safe. Clearing app data removes this local copy.</p>
      </main></section>`;
   const status=modal.querySelector('[data-otg-status]');
   modal.querySelector('[data-otg-gallery-back]').addEventListener('click',galleryClose);
   modal.addEventListener('click',e=>{if(e.target===modal)galleryClose()});
   modal.addEventListener('keydown',e=>{if(e.key==='Escape')galleryClose()});
   modal.querySelector('[data-otg-file]').addEventListener('change',async e=>{
      const file=e.target.files?.[0];if(!file)return;
      if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>MAX_BYTES){showStatus(status,'Please choose a PNG, JPEG or WebP image under 12 MB.');e.target.value='';return;}
      showStatus(status,'Saving privately on this device…');
      try{await putPortrait(file);showStatus(status,'Portrait installed privately. The racing garage is now legally questionable.');await refreshGallery(modal)}catch(err){showStatus(status,err.message||'Could not save portrait')}finally{e.target.value='';}
   });
   modal.querySelector('[data-otg-remove]').addEventListener('click',async()=>{
      if(!confirm('Remove the private portrait from this device? Your original photo will not be affected.'))return;
      try{await removePortrait();showStatus(status,'Private portrait removed.');await refreshGallery(modal)}catch(err){showStatus(status,err.message||'Could not remove photo')}
   });
   document.body.appendChild(modal);
   modal.querySelector('[data-otg-gallery-back]').focus({preventScroll:true});
   refreshGallery(modal);
 }
 function enhanceNoticeboard(overlay){
   if(!overlay||overlay.querySelector('[data-otg-notice-back-8174]'))return;
   const head=overlay.querySelector('.otgNoticeHead8172');const main=overlay.querySelector('.otgNoticeSheet8172 main');
   if(!head||!main)return;
   const back=document.createElement('button');back.type='button';back.className='otgNoticeBack8174';
   back.setAttribute('data-otg-notice-back-8174','1');back.textContent='← BACK';back.setAttribute('aria-label','Back to Evil Tournament');
   back.addEventListener('click',()=>overlay.remove());head.prepend(back);
   const galleryCard=document.createElement('section');galleryCard.className='otgNoticeCard8172 otgPrivateCard8174';
   galleryCard.innerHTML='<h3>📸 THE JONES MOB · PRIVATE EXHIBIT</h3><p>Our suspiciously wealthy racing crew deserves its own team portrait. Keep the family picture on your device, not on a public web server.</p><button type="button" data-otg-private-open>OPEN PRIVATE TEAM PORTRAIT ↗</button><small>One-time import from your phone. Stored locally on this device only.</small>';
   const foot=main.querySelector('.otgNoticeFoot8172');if(foot)main.insertBefore(galleryCard,foot);else main.appendChild(galleryCard);
   galleryCard.querySelector('[data-otg-private-open]').addEventListener('click',openGallery);
 }
 function init(){
   if(!document.body)return;
   const observer=new MutationObserver(records=>{
     for(const record of records)for(const node of record.addedNodes){
       if(node.nodeType!==1)continue;
       if(node.id==='otgNoticeOverlay8172')enhanceNoticeboard(node);
       else if(node.querySelector){const overlay=node.querySelector('#otgNoticeOverlay8172');if(overlay)enhanceNoticeboard(overlay);}
     }
   });
   observer.observe(document.body,{childList:true});
   enhanceNoticeboard(document.getElementById('otgNoticeOverlay8172'));
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
 window.otgPrivateGalleryQA8174={open:openGallery,enhance:enhanceNoticeboard};
})();
