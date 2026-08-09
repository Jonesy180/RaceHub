// RaceHub v6.0.20 — Stage 9B League Events + Drivers setup-state correction
state=rhLoad();
rhSync();
if(state&&!state.onboarded){window.rhStartOnboardingIfNeeded?.();}else{show('home');}
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker-v6021.js',{updateViaCache:'none'}).catch(()=>{}));}
