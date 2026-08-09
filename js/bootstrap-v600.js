// RaceHub v6.0.23 — Stage 9D League standings and permanent history
state=rhLoad();
rhSync();
if(state&&!state.onboarded){window.rhStartOnboardingIfNeeded?.();}else{show('home');}
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker-v6023.js',{updateViaCache:'none'}).catch(()=>{}));}
