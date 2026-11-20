// OTG! v8.0.368 — Safety-gated, version-pinned worker bootstrap.
state=rhLoad();
// Stage 1 clean slate: retire saved, IN-PROGRESS Evil 2.0 test runs only.
// These runs cause the orphaned Festival CONTINUE RACING banner after Evil List removal.
// Never alter Garage cars, catalogue links, settings, other Spaces or completed competitions.
try {
  const space = typeof rhSpace === 'function' ? rhSpace() : null;
  if (space && Array.isArray(space.runs)) {
    const before = space.runs.length;
    space.runs = space.runs.filter(run => {
      const name = String(run?.name || '');
      const status = String(run?.status || '').toLowerCase();
      return !(status === 'active' && /^evil\s*(?:2(?:\.0)?|tournament)/i.test(name));
    });
    if (before !== space.runs.length) {
      if (typeof rhSetup !== 'undefined') rhSetup = null;
      rhSave();
    }
  }
} catch (error) { console.warn('Stage 1 legacy Evil continuation cleanup skipped:', error); }
rhSync();
if(state&&!state.onboarded){window.rhStartOnboardingIfNeeded?.();}else{show('home');}
if('serviceWorker' in navigator){window.addEventListener('load',async()=>{
  try{
    const gated=await window.rhStartupUpdateGate8063?.();
    if(gated)return;
    const reg=await navigator.serviceWorker.register('./otg-service-worker-v8368.js',{scope:'./',updateViaCache:'none'});
    // If an already accepted update remains waiting behind an old controller,
    // activate it without offering the same update a second time.
    if(reg.waiting && reg.waiting.scriptURL.includes('otg-service-worker-v8368.js')){
      reg.waiting.postMessage({type:'SKIP_WAITING'});
    }
    try{localStorage.setItem('otgUpdateAcceptedVersion','8.0.368')}catch(_){ }
    setTimeout(()=>window.rhAutoCheckForUpdateV8021?.(),250);
  }catch(_){ window.rhAutoCheckForUpdateV8021?.(); }
});}
