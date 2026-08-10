// RaceHub v6.0.33 — Grand Tour Fix #3: Review Classification EDIT RESULTS visual state only
state=rhLoad();
rhSync();
if(state&&!state.onboarded){window.rhStartOnboardingIfNeeded?.();}else{show('home');}
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker-v6033.js',{updateViaCache:'none'}).catch(()=>{}));}
