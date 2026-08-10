// RaceHub v6.0.32 — League Event segmented numeral vertical alignment only
state=rhLoad();
rhSync();
if(state&&!state.onboarded){window.rhStartOnboardingIfNeeded?.();}else{show('home');}
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker-v6032.js',{updateViaCache:'none'}).catch(()=>{}));}
