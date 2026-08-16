/* OTG! v6.0.74 — structural rebuild of destructive reset screens.
   Existing locked Hubs/garage artwork only. Live HTML owns tablet/actions. */
(()=>{
  const safe=s=>esc(String(s??''));
  const oldConfirm=window.rhConfirm;
  window.rhConfirm=function({title,copy,detail='',safeguard='',confirmLabel='CONFIRM',cancelLabel='CANCEL',danger=false,severity='',onConfirm=''}){
    const sev=severity||(danger?'destructive':'cyan');
    const reset=/^(RESET RACING DATA\?|FULL RESET OTG!\?)$/i.test(String(title||'').trim());
    if(!(sev==='destructive'&&reset)) return oldConfirm.apply(this,arguments);

    document.getElementById('rhConfirmOverlay')?.remove();
    const racing=/^RESET RACING DATA/i.test(title);
    const irreversible=racing?'RACING DATA WILL BE PERMANENTLY DELETED':'OWNED AND RACING DATA WILL BE PERMANENTLY DELETED';
    const retained=racing?'Your Garage and OTG! backups are retained.':'The dedicated catalogue and OTG! backups are retained.';
    const detailHtml=detail?`<div class="rhReset74Detail">${safe(detail)}</div>`:'';

    document.body.insertAdjacentHTML('beforeend',`
      <div id="rhConfirmOverlay" class="rhReset74 ${racing?'racing':'full'}">
        <img class="rhReset74Art" src="assets/final/hubs-reset-approved-v6040.png?v=6074" alt="Hubs">
        <button class="rhReset74Back" aria-label="Back" onclick="$('rhConfirmOverlay').remove()">‹ <span>BACK</span></button>
        <div class="rhReset74Cap" aria-hidden="true"><span>OTG</span><b>!</b></div>

        <section class="rhReset74Tablet" aria-label="${safe(title)}">
          <div class="rhReset74Warn">△ <span>WARNING</span></div>
          <h2>${safe(title)}</h2>
          <p>${safe(copy)}</p>
          ${detailHtml}
          ${safeguard?`<div class="rhReset74Keep">◇ ${safe(safeguard)}</div>`:''}
        </section>

        <section class="rhReset74Actions">
          <h3>${irreversible}</h3>
          <strong>${retained}</strong>
          <p>This cannot be undone.</p>
          <div class="rhReset74Buttons">
            <button class="rhReset74Cancel" onclick="$('rhConfirmOverlay').remove()">${safe(cancelLabel)}</button>
            <button class="rhReset74Confirm" onclick="$('rhConfirmOverlay').remove();${onConfirm}">${safe(confirmLabel)}</button>
          </div>
        </section>
      </div>`);
  };
})();
