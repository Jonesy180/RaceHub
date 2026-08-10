// RaceHub v6.0.36 — Grand Tour: Garage Hubs placement
state=rhLoad();
rhSync();
if(state&&!state.onboarded){window.rhStartOnboardingIfNeeded?.();}else{show('home');}
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker-v6036.js',{updateViaCache:'none'}).catch(()=>{}));}
