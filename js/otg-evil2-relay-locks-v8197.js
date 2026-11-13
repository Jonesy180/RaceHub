/* OTG! MAIN 8.0.197 — isolated FH5 relay route-lock ledger.
   Persisted to NEW QA-only keys. No changes to old results, Garage,
   career awards, campaign data or private files. IDs here identify the
   verified route-list entries, NOT official FH5 catalogue row IDs. */
(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.rhEvil2RelayLocks197=api;})(typeof globalThis!=='undefined'?globalThis:null,function(){
'use strict';
const PREFIX='otg.evil2.relay.qa.track-locks.v1:';
const TRACKS_VERSION='fh5-relay-route-pool-v8196';
function safeName(x){return String(x??'');}
function fingerprint(teams){return window.rhEvil2RelayTracks196.fingerprint(teams);}
function key(spaceId,mode,teams){if(!spaceId||!['maker','mixed'].includes(mode))throw Error('Missing safe Space or relay mode.');return PREFIX+encodeURIComponent(String(spaceId))+':'+mode+':'+window.rhEvil2RelayTracks196.hash(fingerprint(teams)).toString(16);}
function validateRoutes(routes,isFinal){const pool=window.rhEvil2RelayTracks196;if(!Array.isArray(routes)||routes.length!==3)throw Error('Three routes required.');const expected=isFinal?pool.FINAL:pool.POOL;
 const keys=new Set();return routes.map((r,i)=>{const route=expected.find(x=>x.name===r.name&&x.type===r.type);if(!route)throw Error('Unknown or ineligible route: '+safeName(r.name));if(!isFinal&&keys.has(r.name))throw Error('Repeated route in group.');keys.add(r.name);
 const routeKey=(isFinal?'fh5-relay-final-preview:':'fh5-relay-preview:')+pool.hash((isFinal?'':r.type+'|')+r.name).toString(16);
 if(r.routeKey!==routeKey)throw Error('Track identity mismatch.');return {routeKey,name:route.name,type:route.type};});}
function read(spaceId,mode,teams){try{const raw=localStorage.getItem(key(spaceId,mode,teams));if(!raw)return {schema:1,mode,spaceId:String(spaceId),fingerprint:fingerprint(teams),poolVersion:TRACKS_VERSION,groups:{}};
 const d=JSON.parse(raw);if(!d||d.schema!==1||d.mode!==mode||d.spaceId!==String(spaceId)||d.fingerprint!==fingerprint(teams)||d.poolVersion!==TRACKS_VERSION||!d.groups||typeof d.groups!=='object'||Array.isArray(d.groups))throw Error('Route lock ledger validation failed. No data modified.');
 for(const [k,v] of Object.entries(d.groups)){if(!/^r\d{1,2}-g\d{1,3}$/.test(k)||!v||typeof v!=='object'||!Number.isInteger(v.round)||!Number.isInteger(v.group)||!Array.isArray(v.routes))throw Error('Malformed locked group.');validateRoutes(v.routes,v.isFinal===true);}
 return d;}catch(err){throw Error('Saved route locks unavailable: '+err.message);}}
function groupKey(round,group){if(!Number.isInteger(round)||round<1||round>12||!Number.isInteger(group)||group<0||group>=500)throw Error('Invalid round/group.');return 'r'+round+'-g'+group;}
function get(spaceId,mode,teams,round,group){const d=read(spaceId,mode,teams);return d.groups[groupKey(round,group)]||null;}
function lock(spaceId,mode,teams,round,group,groupCount,openingCount,isFinal,hasExistingTimes){if(hasExistingTimes)throw Error('This group already has times from before track locking. Routes cannot be attached retroactively.');const api=window.rhEvil2RelayTracks196;
 const d=read(spaceId,mode,teams),id=groupKey(round,group);if(d.groups[id])return d.groups[id];
 const routes=validateRoutes(api.forGroup(teams,mode,round,group,groupCount,isFinal,openingCount),!!isFinal);
 const frozen={round,group,isFinal:!!isFinal,routePack:TRACKS_VERSION,routes,lockedAt:new Date().toISOString(),identityNote:'Stable OTG relay route-list identity; not official catalogue row ID'};
 const updated={...d,groups:{...d.groups,[id]:frozen}};localStorage.setItem(key(spaceId,mode,teams),JSON.stringify(updated));return frozen;}
function hasTimes(resultArrays){return resultArrays.some(row=>row.some(v=>v!==null));}
function status(spaceId,mode,teams,round,group,groupCount,openingCount,isFinal,results){const existing=get(spaceId,mode,teams,round,group);const legacy=!existing&&hasTimes(results);
 const proposed=existing?existing.routes:validateRoutes(window.rhEvil2RelayTracks196.forGroup(teams,mode,round,group,groupCount,isFinal,openingCount),!!isFinal);
 return {existing,legacy,proposed,canLock:!existing&&!legacy,canSave:!!existing||legacy};}
function html(data){const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const state=data.existing?'🔒 LOCKED ROUTES · SAVED WITH THIS QA CHAMPIONSHIP':data.legacy?'⚠️ PRE-LOCK TIMES · ROUTES NOT ATTRIBUTED':'🛣️ ROUTE PREVIEW · NOT YET LOCKED';
 let out='<section class="er197-lock"><strong>'+state+'</strong><div class="er197-route-list">'+data.proposed.map((r,i)=>'<div><span>STAGE '+(i+1)+'</span><b>'+esc(r.name)+'</b><small>'+esc(r.type)+'</small></div>').join('')+'</div>';
 if(data.canLock)out+='<button id="er197-lock-group" class="erc-confirm" type="button">🔒 CONFIRM & LOCK THESE 3 ROUTES</button><small>Required before new QA stage times. Group route identities will be saved separately; no career records or track statistics.</small>';
 if(data.legacy)out+='<small>Older QA times remain unchanged and are not linked to these preview routes. New groups can be locked normally.</small>';
 if(data.existing)out+='<small>Saved route lock cannot be redrawn. Route IDs are stable within the relay route pack, pending official catalogue-ID mapping.</small>';
 return out+'</section>';}
return {key,read,get,lock,status,html,validateRoutes,hasTimes,groupKey,TRACKS_VERSION};
});
