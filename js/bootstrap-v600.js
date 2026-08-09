// RaceHub v6.0.12 — Stage 1 Garage foundation startup
state=rhLoad();
rhSync();
if(state&&!state.onboarded){window.rhStartOnboardingIfNeeded?.();}else{show('home');}
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker-v6012.js',{updateViaCache:'none'}).catch(()=>{}));}
