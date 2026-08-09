// RaceHub v6.0.24 — Stage 9D League delete + entry polish
state=rhLoad();
rhSync();
if(state&&!state.onboarded){window.rhStartOnboardingIfNeeded?.();}else{show('home');}
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker-v6024.js',{updateViaCache:'none'}).catch(()=>{}));}
