// RaceHub v6.0.19 — Stage 9B League Events + driver management
state=rhLoad();
rhSync();
if(state&&!state.onboarded){window.rhStartOnboardingIfNeeded?.();}else{show('home');}
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker-v6019.js',{updateViaCache:'none'}).catch(()=>{}));}
