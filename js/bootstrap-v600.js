// RaceHub v6.0.30 — GT7 torture test import tile removed
state=rhLoad();
rhSync();
if(state&&!state.onboarded){window.rhStartOnboardingIfNeeded?.();}else{show('home');}
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker-v6030.js',{updateViaCache:'none'}).catch(()=>{}));}
