const CACHE_NAME='otg-v8.0.384-tet2-historical-eligibility';
const ASSETS=['./index-v8384.html','./js/tet2-final-battles-v8356.js?v=8356','./js/tet2-honours-bridge-v8358.js?v=8358','./js/tet2-results-entry-v8376.js?v=8376','./style-tet2-results-entry-v8360.css?v=8360','./js/tet2-slot-ledger-v8361.js?v=8361','./js/tet2-slot-draw-v8377.js?v=8377','./js/tet2-practice-bridge-v8363.js?v=8363','./style-tet2-draw-v8363.css?v=8363','./assets/tet2-stage4-v8362/draw-group-header.webp','./assets/tet2-stage4-v8362/draw-raceoff-header.webp','./js/tet2-practice-standings-v8364.js?v=8364','./style-tet2-practice-standings-v8364.css?v=8364','./js/tet2-opening-coverage-v8370.js?v=8370','./js/tet2-r1-stage-inventory-v8366.js?v=8366','./js/tet2-candidate-schedule-v8366.js?v=8366','./js/tet2-competition-audit-v8367.js?v=8367','./js/tet2-workloads-v8368.js?v=8368','./js/tet2-locked-workloads-v8379.js?v=8379','./js/tet2-assembled-list-v8379.js?v=8379','./js/tet2-event-router-v8384.js?v=8384','./js/tet2-lonely-hearts-v8380.js?v=8380','./style-tet2-lonely-rehearsal-v8380.css?v=8380','./js/tet2-stage-rehearsal-v8375.js?v=8375','./js/tet2-unified-gauntlet-v8376.js?v=8376','./js/tet2-aerodromo-v8377.js?v=8377','./js/tet2-relay-v8378.js?v=8378','./js/tet2-swiss-v8379.js?v=8379','./style-tet2-relay-rehearsal-v8378.css?v=8378','./style-tet2-swiss-rehearsal-v8379.css?v=8379','./js/tet2-historical-source-v8382.js?v=8382','./js/tet2-historical-eligibility-v8384.js?v=8384','./js/tet2-historical-v8384.js?v=8384','./style-tet2-historical-eligibility-v8384.css?v=8384','./js/tet2-historical-source-v8383.js?v=8383','./js/tet2-historical-progress-v8383.js?v=8383','./style-tet2-historical-progress-v8383.css?v=8383','./style-tet2-historical-v8382.css?v=8382','./js/tet2-festival-top3-v8381.js?v=8381','./style-tet2-festival-top3-v8381.css?v=8381','./js/tet2-clean-evil-list-v8379.js?v=8379','./style-tet2-clean-list-v8372.css?v=8372','./style-tet2-stage-router-v8374.css?v=8374','./style-tet2-stage-rehearsal-v8375.css?v=8375','./style-tet2-gauntlet-rehearsal-v8376.css?v=8376','./style-tet2-aerodromo-rehearsal-v8377.css?v=8377','./js/tet2-worlds-v8384.js?v=8384','./style-tet2-worlds-v8359.css?v=8359','./assets/tet2-stage4-v8359/world.webp','./assets/tet2-stage4-v8359/hq.webp','./style-tet2-stage1-clean-v8348.css?v=8348','./js/bootstrap-v8384.js?v=8384','./js/update-wire-v8384.js?v=8384','./style-tet2-festival-v8351.css?v=8351','./js/tet2-festival-competition-entries-v8355.js?v=8354','./assets/ui/festival-icon-drag-v8355.svg','./style-tet2-drag-icon-v8355.css?v=8355'];






















// Offline repair 02: require every current v8.0.152 HTML dependency before activation.
// These are assets referenced by index-v8152.html but absent from the earlier cache manifest.
const OFFLINE_REQUIRED_8152=[
  "./manifest.webmanifest?v=6069",
  "./icons/icon-v6069-192.png?v=6069",
  "./style-v595.css?v=7031",
  "./style-v6034.css?v=6034",
  "./style-gt7-v6066-main.css?v=6066",
  "./style-fh5-v6069-main.css?v=6069",
  "./style-catalogue-garage-v6084.css?v=6084",
  "./style-v6123.css?v=7029",
  "./style-v8077.css?v=8077",
  "./assets/brand/otg-mark-clean.svg",
  "./js/core.js?v=6017",
  "./js/studio-locked-ui-v5780.js?v=7031",
  "./js/studio-v6-garage-foundation-v600.js?v=6017",
  "./js/studio-release-v595.js?v=6017",
  "./js/studio-grand-tour-v6043.js?v=6063?v=6044",
  "./js/studio-final-standings-v7023.js?v=7023",
  "./js/studio-champ-overview-v7022.js?v=7022",
  "./js/studio-beta-feedback-v595-no-legacy-update.js?v=8020b",
  "./js/catalogue-garage-ui-v6084.js?v=6138",
  "./js/gt7-specials-v6135.js?v=6138",
  "./js/catalogue-stability-v6088.js?v=6088",
  "./js/reset-action-v6089.js?v=6089",
  "./js/reset-functional-v6090.js?v=6090",
  "./js/grand-tour-repair-v6092.js?v=6092",
  "./style-v6093.css?v=6093",
  "./js/grand-tour-polish-v6093.js?v=6093",
  "./js/grand-tour-final-fixes-v6094.js?v=6094",
  "./js/raceoff-stage8-v6123.js?v=7029",
  "./style-v6096.css?v=6096",
  "./js/gt-cleanup-v6103.js?v=6106",
  "./js/abandon-events-v6150.js?v=7029",
  "./style-v7010.css?v=7010",
  "./style-v7016.css?v=7016",
  "./style-v7027.css?v=7027",
  "./js/v7-smart-text-v7028.js?v=7028",
  "./style-v8039.css?v=8039",
  "./style-v8092.css?v=8092"
];
// Anonymous, locally bundled Hall of Shame art pack 01.


// v8.0.153: versioned page and update plumbing.


// Anonymous art pack 02: no image details in the app code.

// v182 locally verified critical assets: pre-cache UI before activating.
self.addEventListener('install',e=>{e.waitUntil((async()=>{
  const cache=await caches.open(CACHE_NAME);
  const critical=['./index-v8384.html','./js/tet2-final-battles-v8356.js?v=8356','./js/tet2-honours-bridge-v8358.js?v=8358','./js/tet2-results-entry-v8376.js?v=8376','./style-tet2-results-entry-v8360.css?v=8360','./js/tet2-slot-ledger-v8361.js?v=8361','./js/tet2-slot-draw-v8377.js?v=8377','./js/tet2-practice-bridge-v8363.js?v=8363','./style-tet2-draw-v8363.css?v=8363','./assets/tet2-stage4-v8362/draw-group-header.webp','./assets/tet2-stage4-v8362/draw-raceoff-header.webp','./js/tet2-practice-standings-v8364.js?v=8364','./style-tet2-practice-standings-v8364.css?v=8364','./js/tet2-opening-coverage-v8370.js?v=8370','./js/tet2-r1-stage-inventory-v8366.js?v=8366','./js/tet2-candidate-schedule-v8366.js?v=8366','./js/tet2-competition-audit-v8367.js?v=8367','./js/tet2-workloads-v8368.js?v=8368','./js/tet2-locked-workloads-v8379.js?v=8379','./js/tet2-assembled-list-v8379.js?v=8379','./js/tet2-event-router-v8384.js?v=8384','./js/tet2-lonely-hearts-v8380.js?v=8380','./style-tet2-lonely-rehearsal-v8380.css?v=8380','./js/tet2-stage-rehearsal-v8375.js?v=8375','./js/tet2-unified-gauntlet-v8376.js?v=8376','./js/tet2-aerodromo-v8377.js?v=8377','./js/tet2-relay-v8378.js?v=8378','./js/tet2-swiss-v8379.js?v=8379','./style-tet2-relay-rehearsal-v8378.css?v=8378','./style-tet2-swiss-rehearsal-v8379.css?v=8379','./js/tet2-historical-source-v8382.js?v=8382','./js/tet2-historical-eligibility-v8384.js?v=8384','./js/tet2-historical-v8384.js?v=8384','./style-tet2-historical-eligibility-v8384.css?v=8384','./js/tet2-historical-source-v8383.js?v=8383','./js/tet2-historical-progress-v8383.js?v=8383','./style-tet2-historical-progress-v8383.css?v=8383','./style-tet2-historical-v8382.css?v=8382','./js/tet2-festival-top3-v8381.js?v=8381','./style-tet2-festival-top3-v8381.css?v=8381','./js/tet2-clean-evil-list-v8379.js?v=8379','./style-tet2-clean-list-v8372.css?v=8372','./style-tet2-stage-router-v8374.css?v=8374','./style-tet2-stage-rehearsal-v8375.css?v=8375','./style-tet2-gauntlet-rehearsal-v8376.css?v=8376','./style-tet2-aerodromo-rehearsal-v8377.css?v=8377','./js/tet2-worlds-v8384.js?v=8384','./style-tet2-worlds-v8359.css?v=8359','./assets/tet2-stage4-v8359/world.webp','./assets/tet2-stage4-v8359/hq.webp','./style-tet2-stage1-clean-v8348.css?v=8348','./js/bootstrap-v8384.js?v=8384','./js/update-wire-v8384.js?v=8384','./style-tet2-festival-v8351.css?v=8351'];
  for(const url of critical){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error('Critical update asset failed: '+url);await cache.put(url,r.clone());}
  // Other historical assets load on demand; large installs must not block activation.

})());});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const keys=await caches.keys();void keys; /* Keep prior version caches for safe rollback. */await self.clients.claim();})());});
// v8.0.238 retained navigation repair: once an upgrade activates, version-pinned old pages must not
// reappear on controllerchange reload. This also rescues older updater scripts
// that still use location.reload() instead of navigating to the new entrypoint.
self.addEventListener('fetch',e=>{
 const requestUrl=new URL(e.request.url);
 if(requestUrl.pathname.endsWith('/update-manifest.json')){
   e.respondWith(fetch(e.request,{cache:'no-store'}));return;
 }
 if(e.request.mode==='navigate'){
   const latestEntry=new URL('./index-v8384.html',self.registration.scope);
   const scopeUrl=new URL(self.registration.scope);
   const isOldEntry=/\/index-v\d+\.html$/i.test(requestUrl.pathname) && requestUrl.pathname!==latestEntry.pathname;
   if(isOldEntry && requestUrl.origin===latestEntry.origin && requestUrl.pathname.startsWith(scopeUrl.pathname)){
     latestEntry.search=requestUrl.search;
     // Hash fragments are browser-only and will be retained by redirect navigation.
     e.respondWith(Promise.resolve(Response.redirect(latestEntry.href,302)));
     return;
   }
   e.respondWith(fetch(e.request,{cache:'no-store'})
     .then(r=>r.ok?r:Promise.reject(new Error('navigation unavailable')))
     .catch(()=>caches.match('./index-v8384.html').then(c=>c||Response.error())));
   return;
 }
 e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request,{cache:'no-store'}).then(r=>{
   const copy=r.clone();
   caches.open(CACHE_NAME).then(cache=>cache.put(e.request,copy)).catch(()=>{});
   return r;
 })));
});
self.addEventListener('message',e=>{if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting();});
