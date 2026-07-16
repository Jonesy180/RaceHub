const CACHE_NAME='racehub-v5-1-2-hall-of-fame';
const ASSETS=["./", "./index.html", "./style.css", "./manifest.webmanifest", "./favicon.png", "./js/seed-data.js", "./js/core.js", "./js/race-director.js", "./js/views.js", "./js/celebrations.js", "./js/garage.js", "./js/control-centre.js", "./js/bootstrap.js", "./icons/icon-192.png", "./icons/icon-512.png"];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',event=>{event.respondWith(fetch(event.request).catch(()=>caches.match(event.request)));});
