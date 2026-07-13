// RaceHub v4.3b — Bootstrap

state=load();show('festival');
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));}
