// RaceHub v6.0.16 — Stage 8B lap separator alignment release
state=rhLoad();
rhSync();
if(state&&!state.onboarded){window.rhStartOnboardingIfNeeded?.();}else{show('home');}
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker-v6016.js',{updateViaCache:'none'}).catch(()=>{}));}
