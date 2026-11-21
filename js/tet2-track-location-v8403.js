/* TET2 v8.0.403 — connect TET2 track names to ORIGINAL OTG! WHERE THE FUCK IS IT? guide.
   The original fh5-track-directory-v8103.js remains the source of all clues.
   No synthetic clues, no extra pages, no writes to Garage or saved results. */
(function(root){'use strict';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const norm=v=>String(v??'').trim();
 const button=track=>{
  const t=norm(track);if(!t)return '';
  // The runway jump is a facility, not a separately catalogued course.
  if(/^Aeródromo runway$/i.test(t))return '';
  return `<button type="button" class="t2-track-location403" data-t2-location-track="${esc(t)}" aria-label="Location clue for ${esc(t)}">⌖ LOCATION</button>`;
 };
 const open=track=>{
  const name=norm(track),directory=root.rhFH5TrackDirectory8087||root.rhFH5TrackDirectory8073;
  if(!name||!directory?.meta?.(name)||typeof root.rhOpenTrackLocation8073!=='function'){
   root.alert?.('The original OTG! location clue for this track is unavailable.');return false;
  }
  root.rhOpenTrackLocation8073(name);
  // Original OTG! modal uses z-index 10060. TET2's full-screen world is
  // above 2.1 billion; raise the ORIGINAL modal so it is actually visible.
  const layer=root.document?.getElementById?.('rhTrackLocation8073');
  if(layer)layer.style.zIndex='2147483200';
  return true;
 };
 function onClick(event){
  const el=event.target?.closest?.('[data-t2-location-track]');if(!el)return;
  event.preventDefault();event.stopPropagation();event.stopImmediatePropagation?.();
  open(el.dataset.t2LocationTrack);
 }
 if(root.document)root.document.addEventListener('click',onClick,true);
 root.TET2TrackLocation403=Object.freeze({button,open});
})(typeof window!=='undefined'?window:globalThis);
