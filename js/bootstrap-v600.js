// RaceHub v6.0.25 — Stage 9D final League result-entry alignment
state=rhLoad();
rhSync();
if(state&&!state.onboarded){window.rhStartOnboardingIfNeeded?.();}else{show('home');}
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker-v6025.js',{updateViaCache:'none'}).catch(()=>{}));}
