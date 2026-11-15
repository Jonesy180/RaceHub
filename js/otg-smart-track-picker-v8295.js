/* OTG! v8.0.295 — Smart Track Picker foundation. PURE / NO WRITES.
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
 const standard=uniq(t.standardPool(category));const special=uniq(t.finalePool(category));
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
function recentFromSpace(space,limit=24){const found=[];const add=x=>{if(typeof x==='string'&&x.trim()&&!found.includes(x.trim()))found.push(x.trim());};
 const all=space?.runs||[];
 for(let i=all.length-1;i>=0&&found.length<limit;i--){const r=all[i];for(const x of r?.rounds||[])add(x?.name);for(const grp of r?.v8Groups?.completedGroups||[])for(const x of grp?.rounds||[])add(x?.name);for(const x of r?.v8Swiss?.swissRounds||[])add(x?.trackName||x?.name);}
 return found.slice(0,limit);
}
// Only format certainty, no guessing category for ambiguous event names.
function classify(stage){const name=String(stage?.name||'');
 if(stage?.action==='LONG_JUMP')return {category:null,reason:'FIXED_AERODROMO_RUNWAY'};
 if(/\b(drag|drift|long jump)\b/i.test(name))return {category:null,reason:'SPECIALIST_TRACK_LOCK'};
 if(/off[ -]?road|cross.country|dirt/i.test(name))return {category:'OFFROAD',count:3};
 if(/rally adventure/i.test(name))return {category:'RALLY',count:3};
 if(/hot wheels/i.test(name))return {category:'HOT_WHEELS',count:3};
 if(/\bFestival\b/i.test(name))return {category:'ROAD',count:3,reason:'ROAD_DEFAULT_REQUIRES_EVENT_START_CHECK'};
 return {category:null,reason:'RACING_FORMAT_NOT_YET_CLASSIFIED'};
}
window.otgSmartTrackPicker8295=Object.freeze({choose,recentFromSpace,classify,version:'8.0.295',liveEngineAttached:false});
})();
