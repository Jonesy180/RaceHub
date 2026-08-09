// RaceHub v6.0.28 — GT7 Garage import test
state=rhLoad();
rhSync();
if(state&&!state.onboarded){window.rhStartOnboardingIfNeeded?.();}else{show('home');}
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker-v6028.js',{updateViaCache:'none'}).catch(()=>{}));}
