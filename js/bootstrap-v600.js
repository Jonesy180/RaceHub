// RaceHub v6.0.18 — Stage 9A League Organiser foundation
state=rhLoad();
rhSync();
if(state&&!state.onboarded){window.rhStartOnboardingIfNeeded?.();}else{show('home');}
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker-v6018.js',{updateViaCache:'none'}).catch(()=>{}));}
