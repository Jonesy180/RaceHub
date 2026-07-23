// RaceHub v5.4.17 — Application bootstrap (Guide isolated in js/guide.js)

state=load();
show('festival');

if('serviceWorker' in navigator){
  window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
}
