// RaceHub v6.0.34 — Grand Tour Fix #4: Records historical Final Standings overlay
state=rhLoad();
rhSync();
if(state&&!state.onboarded){window.rhStartOnboardingIfNeeded?.();}else{show('home');}
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker-v6034.js',{updateViaCache:'none'}).catch(()=>{}));}
