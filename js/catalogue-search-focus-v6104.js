/* OTG! v6.0.104 — preserve catalogue search focus/caret during live filtering. */
(()=>{
  'use strict';
  document.addEventListener('input',e=>{
    const input=e.target;
    if(!(input instanceof HTMLInputElement))return;
    if(!input.closest('.rhCatalogueGarageV84 .rhGarageToolsV1'))return;
    const value=input.value;
    const start=Number.isInteger(input.selectionStart)?input.selectionStart:value.length;
    const end=Number.isInteger(input.selectionEnd)?input.selectionEnd:start;
    queueMicrotask(()=>{
      const next=document.querySelector('.rhCatalogueGarageV84 .rhGarageToolsV1 input');
      if(!next)return;
      // The catalogue renderer replaces the input on each keystroke. Restore focus and caret
      // to the freshly-rendered field without changing its filtering/result behaviour.
      try{
        next.focus({preventScroll:true});
        const max=next.value.length;
        next.setSelectionRange(Math.min(start,max),Math.min(end,max));
      }catch(_){/* focus restoration is best-effort only */}
    });
  },true);
  window.RACEHUB_VERSION='6.0.104';
})();
