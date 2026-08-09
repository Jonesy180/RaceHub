// RaceHub v6.0.3 — Stage 1 Garage foundation startup
state=rhLoad();
rhSync();
if(state&&!state.onboarded){window.rhStartOnboardingIfNeeded?.();}else{show('home');}
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker-v603.js',{updateViaCache:'none'}).catch(()=>{}));}
