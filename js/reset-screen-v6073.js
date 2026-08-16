/* OTG! v6.0.73 — destructive reset screen renderer. Locked artwork retained. */
(()=>{
 const safe=s=>esc(String(s??''));
 const prior=window.rhConfirm;
 window.rhConfirm=function(opts={}){
   const {title='',copy='',detail='',safeguard='',confirmLabel='CONFIRM',cancelLabel='CANCEL',danger=false,severity='',onConfirm=''}=opts;
   const sev=severity||(danger?'destructive':'cyan');
   const isReset=/^(RESET RACING DATA\?|FULL RESET OTG!\?)$/i.test(String(title).trim());
   if(!(sev==='destructive'&&isReset)) return prior(opts);
   document.getElementById('rhConfirmOverlay')?.remove();
   const racing=/RESET RACING DATA/i.test(title);
   const bottomTitle=racing?'RACING DATA WILL BE PERMANENTLY DELETED':'OWNED AND RACING DATA WILL BE PERMANENTLY DELETED';
   const retained=racing?'Your Garage and OTG! backups are retained.':'The dedicated catalogue and OTG! backups are retained.';
   document.body.insertAdjacentHTML('beforeend',`<div id="rhConfirmOverlay" class="rhReset6040 ${racing?'racing6073':'full6073'}">
     <img class="rhResetArt6040" src="assets/final/hubs-reset-approved-v6040.png?v=6060" alt="">
     <div class="rhHatFix6073">OTG<i>!</i></div>
     <div class="rhTabletFix6073">
       <div class="warn">⚠ WARNING</div>
       <h2>${safe(title)}</h2>
       <p class="copy">${safe(copy)}</p>
       ${detail?`<div class="detail">${safe(detail)}</div>`:''}
       ${safeguard?`<div class="keep">◇ ${safe(safeguard)}</div>`:''}
     </div>
     <div class="rhBottomFix6073">
       <div><div class="dangerTitle">${bottomTitle}</div><div class="retain">${retained}</div><div class="undo">This cannot be undone.</div></div>
       <div class="actions"><button class="cancel" onclick="$('rhConfirmOverlay').remove()">${safe(cancelLabel)}</button><button class="confirm" onclick="$('rhConfirmOverlay').remove();${onConfirm}">${safe(confirmLabel)}</button></div>
     </div>
     <button class="rhBackLive6073" aria-label="Back" onclick="$('rhConfirmOverlay').remove()"></button>
   </div>`);
 };
})();
