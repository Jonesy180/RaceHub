// RaceHub v6.0.17 — Stage 8C Race Notes release
state=rhLoad();
rhSync();
if(state&&!state.onboarded){window.rhStartOnboardingIfNeeded?.();}else{show('home');}
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker-v6017.js',{updateViaCache:'none'}).catch(()=>{}));}
