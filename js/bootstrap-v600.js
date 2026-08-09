// RaceHub v6.0.22 — Stage 9C League mini digital timing correction
state=rhLoad();
rhSync();
if(state&&!state.onboarded){window.rhStartOnboardingIfNeeded?.();}else{show('home');}
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker-v6022.js',{updateViaCache:'none'}).catch(()=>{}));}
