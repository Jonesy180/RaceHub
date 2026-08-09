// RaceHub v6.0.29 — GT7 import stray text fix
state=rhLoad();
rhSync();
if(state&&!state.onboarded){window.rhStartOnboardingIfNeeded?.();}else{show('home');}
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker-v6029.js',{updateViaCache:'none'}).catch(()=>{}));}
