// OTG! MAIN v8.0.440 — Shared event-driven results phase 1: verified current-slot fixtures and single-race all-car screen; preserve all saved data.
// Caches ONLY versioned files delivered with this release; legacy rehearsal files
// are NOT install requirements. Older caches are preserved for rollback safety.
const CACHE_NAME='otg-v8.0.440-tet2-controlled-chaos-real-draw';
const CRITICAL=["./js/otg-native-adaptive-results-v8440.js","./style-otg-native-adaptive-v8440.css","./js/tet2-record-engine-v8439.js","./style-tet2-record-celebrations-v8439.css","./assets/tet2-records-v8439/pb-art.webp","./assets/tet2-records-v8439/event-art.webp","./assets/tet2-records-v8439/track-art.webp","./assets/tet2-records-v8439/double-art.webp","./assets/tet2-records-v8439/triple-art.webp","./index-v8440.html","./js/bootstrap-v8440.js","./js/update-wire-v8440.js","./js/tet2-opening-coverage-v8370.js","./js/tet2-r1-stage-inventory-v8366.js","./js/tet2-competition-audit-v8367.js","./js/tet2-workloads-v8368.js","./js/tet2-locked-workloads-v8379.js","./js/tet2-custom-upgrade-v8424.js","./js/tet2-stock-classes-v8430.js","./style-tet2-stock-classes-v8430.css","./js/tet2-assembled-list-v8434.js","./js/tet2-evil-list-v8426.js","./js/tet2-slot-presentations-v8439.js","./js/tet2-live-views-v8424.js","./style-otg-adaptive-results-v8438.css","./js/otg-adaptive-results-v8438.js","./js/tet2-results-entry-v8438.js","./js/tet2-slot-ledger-v8439.js","./js/tet2-official-race-v8434.js","./js/tet2-honours-bridge-v8401.js","./js/tet2-worlds-v8439.js","./js/tet2-historical-live-v8436.js","./js/tet2-route-control-v8436.js","./js/tet2-track-location-v8403.js","./js/tet2-historical-source-v8382.js","./js/tet2-historical-source-v8383.js","./style-tet2-pit-wall-v8416.css","./assets/tet2-neutral-record-hero-v8417.webp","./style-tet2-facelift-v8420.css","./style-tet2-results-car-first-v8431.css","./style-tet2-stock-info-v8432.css","./style-tet2-setup-briefing-v8434.css","./js/tet2-fresh-start-v8439.js","./style-tet2-upgrade-badges-v8425.css","./js/tet2-awards-v8434.js","./style-tet2-awards-v8426.css","./style-tet2-current-trophy-v8427.css","./assets/tet2-awards-v8426/champion-of-champions.webp","./assets/tet2-awards-v8426/class-type.webp","./assets/tet2-awards-v8426/custom-upgrade.webp","./assets/tet2-awards-v8426/drag.webp","./assets/tet2-awards-v8426/era.webp","./assets/tet2-awards-v8426/favourite-manufacturer.webp","./assets/tet2-awards-v8426/festival.webp","./assets/tet2-awards-v8426/gauntlet.webp","./assets/tet2-awards-v8426/lonely-hearts.webp","./assets/tet2-awards-v8426/long-jump.webp","./assets/tet2-awards-v8426/manufacturers.webp","./assets/tet2-awards-v8426/medal-bronze-festival.webp","./assets/tet2-awards-v8426/medal-bronze-pair.webp","./assets/tet2-awards-v8426/medal-bronze-raceoff.webp","./assets/tet2-awards-v8426/medal-gold-festival.webp","./assets/tet2-awards-v8426/medal-gold-pair.webp","./assets/tet2-awards-v8426/medal-gold-raceoff.webp","./assets/tet2-awards-v8426/medal-silver-festival.webp","./assets/tet2-awards-v8426/medal-silver-pair.webp","./assets/tet2-awards-v8426/medal-silver-raceoff.webp","./assets/tet2-awards-v8426/race-off.webp","./assets/tet2-awards-v8426/relay.webp","./assets/tet2-awards-v8426/second-chance.webp","./assets/tet2-awards-v8426/swiss.webp","./assets/tet2-awards-v8426/vintage-classic.webp"];
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE_NAME);
    for(const file of CRITICAL){
      const response=await fetch(file,{cache:'no-store'});
      if(!response.ok)throw Error('Required 8.0.440 file not found: '+file);
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
    const latest=new URL('./index-v8440.html',self.registration.scope);
    const scope=new URL(self.registration.scope);
    const stale=/\/index-v\d+\.html$/i.test(url.pathname)&&url.pathname!==latest.pathname&&url.pathname.startsWith(scope.pathname);
    if(stale){latest.search=url.search;event.respondWith(Promise.resolve(Response.redirect(latest.href,302)));return;}
    event.respondWith(fetch(request,{cache:'no-store'}).then(r=>{
      if(!r.ok)throw Error('Page unavailable');return r;
    }).catch(()=>caches.match('./index-v8440.html').then(r=>r||Response.error())));return;
  }
  event.respondWith(caches.match(request).then(hit=>hit||fetch(request,{cache:'no-store'}).then(res=>{
    if(res.ok){const clone=res.clone();caches.open(CACHE_NAME).then(cache=>cache.put(request,clone)).catch(()=>{});}
    return res;
  })));
});
self.addEventListener('message',event=>{
  if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting();
});
