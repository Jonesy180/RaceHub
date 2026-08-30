// OTG! v8.0.14 — startup + automatic update discovery
state=rhLoad();
rhSync();
if(state&&!state.onboarded){window.rhStartOnboardingIfNeeded?.();}else{show('home');}
if('serviceWorker' in navigator){window.addEventListener('load',async()=>{
  try{await navigator.serviceWorker.register('./service-worker-v8014.js',{updateViaCache:'none'});}catch(_){ }
  setTimeout(()=>window.rhAutoCheckForUpdateV8014?.(),1200);
});}
