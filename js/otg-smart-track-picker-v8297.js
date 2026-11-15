/* OTG! v8.0.297 — Smart Track Picker foundation. PURE / NO WRITES.
  Uses canonical FH5 taxonomy, explicit category, recent-used tracks, and
  event-local uniqueness. Not a substitute for an event engine's start/lock flow.
  Never assigns a route to drag, long jump, or fixed special formats. */
(()=>{'use strict';
const tax=()=>window.rhFH5TrackTaxonomy8067;
const uniq=a=>[...new Set((a||[]).map(v=>String(v||'').trim()).filter(Boolean))];
const categories=new Set(['ROAD','OFFROAD','RALLY','HOT_WHEELS']);
function rand(seed){let s=seed>>>0;return()=>{s=(s+0x6D2B79F5)|0;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}
function choose({category,count=1,recent=[],inEvent=[],seed=1,finale=false}={}){
 const t=tax();if(!t?.standardPool||!t?.finalePool)throw Error('Verified FH5 route taxonomy unavailable');
 if(!categories.has(category))return {ok:false,reason:'FIXED_OR_UNCLASSIFIED_FORMAT',category,tracks:[]};
 if(!Number.isInteger(count)||count<1||count>20)throw Error('Invalid stage route count');
 const standard=uniq(t.standardPool(category)).filter(n=>!/the goliath/i.test(n));const special=uniq(t.finalePool(category));
 if(!standard.length)throw Error('No eligible taxonomy routes for '+category);
 const rng=rand(seed),used=new Set(uniq(inEvent)),avoid=new Set(uniq(recent)),picks=[];
 for(let i=0;i<count;i++){
  const last=!!finale&&i===count-1;
  const pool=last?special:standard;
  if(!pool.length)return {ok:false,reason:'NO_FINALE_POOL',category,tracks:[]};
  const groups=[pool.filter(n=>!used.has(n)&&!avoid.has(n)),pool.filter(n=>!used.has(n)),pool.filter(n=>!avoid.has(n)),pool];
  const choices=groups.find(g=>g.length)||[];
  if(!choices.length)throw Error('Empty route category '+category);
  const chosen=choices[Math.floor(rng()*choices.length)];picks.push(chosen);used.add(chosen);
 }
 return {ok:true,category,tracks:picks,seed,avoidedRecent:picks.filter(n=>!avoid.has(n)).length,categoryPoolSize:standard.length,method:'CANONICAL_CATEGORY_RECENCY_NO_EVENT_DUPLICATES'};
}
function chooseNative({category,count,space,eventKey='',excludeGoliath=true}={}){
 if(!space||space.catalogueKey!=='fh5-catalogue-v1'||!String(space.id||''))throw Error('Native Smart Track: verified FH5 Space required');
 if(!Number.isInteger(count)||count<1||count>4)throw Error('Native Smart Track: invalid source engine round count');
 if(!categories.has(category))throw Error('Native Smart Track: original source category not supported');
 if(!tax()?.standardPool)throw Error('Native Smart Track: official FH5 route directory missing');
 const official=uniq(tax().standardPool(category));
 const allowed=official.filter(name=>!(excludeGoliath&&/the goliath/i.test(name)));
 if(allowed.length<count)throw Error('Native Smart Track: too few distinct official routes');
 const seed=new Uint32Array(1);if(!crypto?.getRandomValues)throw Error('Native Smart Track: secure random unavailable');crypto.getRandomValues(seed);
 // Use original native engine's category and required number of races; choose
 // ONCE before the run is saved. Subsequent resumes use frozen run.rounds.
 const recent=recentFromSpace(space,24).filter(n=>allowed.includes(n));
 const scored=choose({category,count,recent,seed:seed[0]||1});
 if(!scored.ok||scored.tracks.length!==count||new Set(scored.tracks).size!==count||scored.tracks.some(x=>!allowed.includes(x))){
   throw Error('Native Smart Track: source route validation failed');
 }
 return {...scored,source:'NATIVE_SOURCE_CONFIRMED',eventKey:String(eventKey),lockedOnNativeRunCreation:true};
}
function recentFromSpace(space,limit=24){const found=[];const add=x=>{if(typeof x==='string'&&x.trim()&&!found.includes(x.trim()))found.push(x.trim());};
 const all=space?.runs||[];
 for(let i=all.length-1;i>=0&&found.length<limit;i--){const r=all[i];for(const x of r?.rounds||[])add(x?.name);for(const grp of r?.v8Groups?.completedGroups||[])for(const x of grp?.rounds||[])add(x?.name);for(const x of r?.v8Swiss?.swissRounds||[])add(x?.trackName||x?.name);}
 return found.slice(0,limit);
}
// Only format certainty, no guessing category for ambiguous event names.
function classify(stage){
 const name=String(stage?.name||'').trim(),kind=String(stage?.kind||'').trim(),action=String(stage?.action||'').trim();
 const specialist=/\b(drag|drift|long[ -]?jump)\b/i;
 if(action==='LONG_JUMP'||/\blong[ -]?jump\b/i.test(name))return {category:null,reason:'FIXED_AERODROMO_RUNWAY',source:'EXPLICIT_SPECIALIST'};
 if(action==='ORIGINAL_SPECIALIST'||specialist.test(name))return {category:null,reason:'SPECIALIST_ENGINE_TRACK_RULES',source:'EXPLICIT_SPECIALIST'};
 if(action==='ORIGINAL_SWISS'||/\bswiss\b/i.test(name))return {category:'ROAD',count:1,source:'VERIFIED_SWISS_ROAD_ROUND',reason:'SWISS_ROUND_ENGINE_MUST_CONFIRM'};
 // Off-road classification is checked before broad Championship/Race Off rules.
 if(/hot[ -]?wheels/i.test(name))return {category:'HOT_WHEELS',count:3,source:'EXPLICIT_EVENT_CATEGORY'};
 if(/rally adventure/i.test(name))return {category:'RALLY',count:3,source:'EXPLICIT_EVENT_CATEGORY'};
 if(/off[ -]?road|cross[ -]?country|\bdirt\b/i.test(name))return {category:'OFFROAD',count:3,source:'EXPLICIT_EVENT_CATEGORY'};
 // The original Festival and Race Off source engines use FH5 road/street
 // when there is no explicit off-road pool. This is only a PREVIEW: native
 // source presets MUST confirm category and track count at event start.
 const sourceRacing=new Set(['ORIGINAL_SLOT','RESTORED_ARCHIVE','RESTORED_LONELY','NEW_MAKE']);
 const namedFormat=/\b(normal championship|normal race off|festival|race off|championship)\b/i.test(name);
 if(action==='NEW_RELAY')return {category:'ROAD',count:3,source:'RELAY_DEFAULT_PROVISIONAL',reason:'RELAY_NATIVE_ENGINE_MUST_CONFIRM'};
 if(action==='NEW_GAUNTLET')return {category:null,reason:'GAUNTLET_CAR_AND_FORMAT_SUITABILITY_PENDING',source:'SPECIAL_FORMAT'};
 if(sourceRacing.has(action)||namedFormat){
  if(action==='ORIGINAL_SLOT'&&!namedFormat)return {category:null,reason:'ORIGINAL_EVENT_TYPE_UNVERIFIED',source:'UNCLASSIFIED'};
  const match=/\bRace Off\b/i.test(name);
  return {category:'ROAD',count:match?1:3,source:'ORIGINAL_ROAD_DEFAULT_PREVIEW',reason:'NATIVE_SOURCE_POOL_AND_ROUNDS_MUST_CONFIRM'};
 }
 return {category:null,reason:'RACING_FORMAT_NOT_YET_CLASSIFIED',source:'UNCLASSIFIED'};
}

window.otgSmartTrackPicker8297=Object.freeze({choose,chooseNative,recentFromSpace,classify,version:'8.0.297',liveEngineAttached:true});
})();
