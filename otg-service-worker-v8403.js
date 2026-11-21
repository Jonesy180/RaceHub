// OTG! MAIN v8.0.403 — clean TET2 service worker.
// Caches ONLY versioned files delivered with this release; legacy rehearsal files
// are NOT install requirements. Older caches are preserved for rollback safety.
const CACHE_NAME='otg-v8.0.403-recover-core-competition-audit';
const CRITICAL=["./index-v8403.html","./js/bootstrap-v8403.js","./js/update-wire-v8403.js","./js/tet2-opening-coverage-v8370.js","./js/tet2-r1-stage-inventory-v8366.js","./js/tet2-competition-audit-v8367.js","./js/tet2-workloads-v8368.js","./js/tet2-locked-workloads-v8379.js","./js/tet2-assembled-list-v8401.js","./js/tet2-evil-list-v8401.js","./js/tet2-live-views-v8401.js","./js/tet2-results-entry-v8403.js","./js/tet2-slot-ledger-v8401.js","./js/tet2-official-race-v8403.js","./js/tet2-honours-bridge-v8401.js","./js/tet2-worlds-v8401.js","./js/tet2-historical-live-v8401.js","./js/tet2-route-control-v8403.js","./js/tet2-track-location-v8403.js","./js/tet2-historical-source-v8382.js","./js/tet2-historical-source-v8383.js"];
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE_NAME);
    for(const file of CRITICAL){
      const response=await fetch(file,{cache:'no-store'});
      if(!response.ok)throw Error('Required 8.0.403 file not found: '+file);
      await cache.put(file,response.clone());
    }
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  if(url.pathname.endsWith('/update-manifest.json')){
    event.respondWith(fetch(request,{cache:'no-store'}));return;
  }
  if(request.mode==='navigate'){
    const latest=new URL('./index-v8403.html',self.registration.scope);
    const scope=new URL(self.registration.scope);
    const stale=/\/index-v\d+\.html$/i.test(url.pathname)&&url.pathname!==latest.pathname&&url.pathname.startsWith(scope.pathname);
    if(stale){latest.search=url.search;event.respondWith(Promise.resolve(Response.redirect(latest.href,302)));return;}
    event.respondWith(fetch(request,{cache:'no-store'}).then(r=>{
      if(!r.ok)throw Error('Page unavailable');return r;
    }).catch(()=>caches.match('./index-v8403.html').then(r=>r||Response.error())));return;
  }
  event.respondWith(caches.match(request).then(hit=>hit||fetch(request,{cache:'no-store'}).then(res=>{
    if(res.ok){const clone=res.clone();caches.open(CACHE_NAME).then(cache=>cache.put(request,clone)).catch(()=>{});}
    return res;
  })));
});
self.addEventListener('message',event=>{
  if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting();
});
