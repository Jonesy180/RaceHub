// OTG! v8.0.225 — Safety-gated, version-pinned worker bootstrap.
state=rhLoad();
rhSync();
if(state&&!state.onboarded){window.rhStartOnboardingIfNeeded?.();}else{show('home');}
if('serviceWorker' in navigator){window.addEventListener('load',async()=>{
  try{
    const gated=await window.rhStartupUpdateGate8062?.();
    if(gated)return;
    const reg=await navigator.serviceWorker.register('./otg-service-worker-v8225.js',{scope:'./',updateViaCache:'none'});
    // If an already accepted update remains waiting behind an old controller,
    // activate it without offering the same update a second time.
    if(reg.waiting && reg.waiting.scriptURL.includes('otg-service-worker-v8225.js')){
      reg.waiting.postMessage({type:'SKIP_WAITING'});
    }
    try{localStorage.setItem('otgUpdateAcceptedVersion','8.0.225')}catch(_){ }
    setTimeout(()=>window.rhAutoCheckForUpdateV8021?.(),250);
  }catch(_){ window.rhAutoCheckForUpdateV8021?.(); }
});}
