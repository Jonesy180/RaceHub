const CACHE_NAME='racehub-v5.8.24-final-standings-live-ui';
const ASSETS=[
  './','./index.html','./style-v5824.css?v=5824','./manifest.webmanifest?v=5824','./favicon.png',
  './js/seed-data.js?v=5799','./js/core.js?v=5799','./js/race-director.js?v=5799','./js/views.js?v=5799',
  './js/celebrations.js?v=5799','./js/garage.js?v=5799','./js/control-centre.js?v=5799','./js/studio-final-v5808.js?v=5808',
  './js/studio-locked-ui-v5780.js?v=5799','./js/studio-polish-v5782.js?v=5799','./js/studio-release-v5809.js?v=5824',
  './js/studio-enter-result-v5803.js?v=5803','./js/studio-result-summary-v5809.js?v=5824','./js/studio-race-flow-v5809.js?v=5824',
  './js/bootstrap-v5809.js?v=5824','./js/studio-race-end-v5810.js?v=5824','./js/studio-final-standings-v5824.js?v=5824',
  './assets/final/final-standings-stadium-ui-v5824.png?v=5824','./assets/final/trophy-festival.png','./assets/final/trophy-manufacturer.png','./assets/final/trophy-era.png','./assets/final/trophy-favourite.png'
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))))});
