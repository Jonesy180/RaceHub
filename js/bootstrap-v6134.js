// OTG! v6.0.134 — GT7 manual/special Garage integration
state=rhLoad();
rhSync();
if(state&&!state.onboarded){window.rhStartOnboardingIfNeeded?.();}else{show('home');}
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker-v6134.js',{updateViaCache:'none'}).catch(()=>{}));}
