/* OTG! MAIN v8.0.196 — FH5 relay route allocation QA.
   Non-mutating, deterministic PREVIEW. Never writes to storage, career, track
   directory, Evil campaign or any existing stage time. Route labels verified
   against the official Forza FH5 Routes and Events listing (23 April 2025).
   Names are NOT claimed to be canonical catalogue row IDs. */
(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.rhEvil2RelayTracks196=api;})(typeof globalThis!=='undefined'?globalThis:null,function(){
'use strict';
const STREET=['Bosque Del Sur','Cañón Run','Carretera Chase','Castillo Del Mar','Coast Run','Costa Rocosa','Cruce Del Valle','El Lago Blanco','Festival Gatecrash','Granjas De Tapalpa','Guanajuato Sur','Highland Climb','Hilltop Descent','Horizon Callejera','Jungle Descent','Las Afueras','Las Laderas','Ruta Norte','Tunnel Run','Wetland Charge'];
const SPRINT=['Copper Canyon Sprint','Descansar Dorado Sprint','Dunas Blancas Sprint','Gran Pantano Sprint','Llanuras Sprint','Panorámica Sprint','Reservorio Sprint','Riviera Sprint','Sierra Verde Sprint','Volcán Sprint','Vista Del Mar Sprint','Marigold Sprint','Aeródromo Sprint','Línea Costera Sprint','Cloverleaf Sprint','San Juan Sprint','Valle Del Río Sprint','Rocosa Sprint'];
const FINAL=[{name:'The Marathon',type:'Street Scene'},{name:'The Goliath',type:'Road endurance (final exception)'},{name:'The Colossus',type:'Road Sprint'}];
const POOL=Object.freeze([...STREET.map(name=>Object.freeze({name,type:'Street Scene'})),...SPRINT.map(name=>Object.freeze({name,type:'Road Sprint'}))]);
function hash(s){let h=2166136261;for(const c of String(s)){h^=c.codePointAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function fingerprint(teams){if(!Array.isArray(teams)||teams.length===0)throw Error('No locked teams for route preview.');return teams.map(t=>(t.cars||[]).map(c=>String(c.id)).join('/')).join('|');}
/* A real shuffle bag: finish every route in the current bag before refilling.
   A single deterministic stream runs through all qualifying rounds in a
   championship. Group boundaries never repeat a route inside one group. */
function rngFrom(key){let state=hash(key)||0x9e3779b9;return ()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return (state>>>0)/4294967296;};}
function shuffle(indices,rand){for(let i=indices.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[indices[i],indices[j]]=[indices[j],indices[i]];}return indices;}
function groupCounts(openingCount,round){const counts=[];let size=openingCount;for(let i=1;i<round;i++){counts.push(size);if(size<=1)break;size=Math.ceil(size/4);}return counts;}
function allQualifyingGroups(openingCount){const arr=[];let n=openingCount;for(let i=0;i<12 && n>1;i++){arr.push(n);n=Math.ceil(n/4);}return arr;}
function build(drawKey,round,groupCount,openingCount){
 if(!Number.isInteger(round)||round<1||round>12||!Number.isInteger(groupCount)||groupCount<1||groupCount>500)throw Error('Invalid round or group count.');
 if(openingCount===undefined)openingCount=round===1?groupCount:null;
 if(!Number.isInteger(openingCount)||openingCount<1||openingCount>500)throw Error('Opening group count required for multi-round shuffle continuity.');
 const prior=groupCounts(openingCount,round).reduce((a,b)=>a+b,0);
 const rand=rngFrom('fh5-relay-shuffle-bag-196|'+drawKey);
 let bag=[],previousSignature='',result=[],cycle=0;
 function refill(){bag=shuffle(Array.from({length:POOL.length},(_,i)=>i),rand);cycle++;}
 // Earlier rounds consume from precisely the same seeded bag stream.
 for(let g=0;g<prior+groupCount;g++){
  const selected=[];
  for(let stage=0;stage<3;stage++){
   if(!bag.length)refill();
   let choice=bag.findIndex(id=>!selected.includes(id));
   if(choice<0){ // Can only occur at a bag boundary with fewer than 3 viable routes.
    const carry=bag;refill();bag=carry.concat(bag);
    choice=bag.findIndex(id=>!selected.includes(id));
   }
   if(choice<0)throw Error('Insufficient distinct routes for one group.');
   const [id]=bag.splice(choice,1);selected.push(id);
  }
  // A duplicate exact triple is not meaningful variety. If it occurs, swap
  // the last pick with a different remaining eligible route from the SAME bag.
  let signature=selected.slice().sort((a,b)=>a-b).join('-');
  if(signature===previousSignature){
   const swapIndex=bag.findIndex(x=>!selected.includes(x));
   if(swapIndex>=0){const replacement=bag.splice(swapIndex,1)[0];bag.unshift(selected[2]);selected[2]=replacement;signature=selected.slice().sort((a,b)=>a-b).join('-');}
  }
  previousSignature=signature;
  if(g>=prior)result.push(selected.map(id=>({...POOL[id],routeKey:'fh5-relay-preview:'+hash(POOL[id].type+'|'+POOL[id].name).toString(16)})));
 }
 return result;
}
function forGroup(teams,mode,round,groupIndex,groupCount,isFinal,openingCount){
 if(isFinal)return FINAL.map(x=>({...x,routeKey:'fh5-relay-final-preview:'+hash(x.name).toString(16)}));
 if(!Number.isInteger(groupIndex)||groupIndex<0||groupIndex>=groupCount)throw Error('Invalid group.');
 if(openingCount===undefined)openingCount=Math.ceil(teams.length/4);
 return build(fingerprint(teams)+'|'+mode,round,groupCount,openingCount)[groupIndex];
}
function escapeHTML(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function html(routes,activeStage){return '<div class="ert195-routes"><h3>🛣️ THIS GROUP · THREE ROUTES</h3>'+routes.map((r,i)=>'<div class="ert195-route '+(i===activeStage?'is-current':'')+'"><span>STAGE '+(i+1)+'</span><strong>'+escapeHTML(r.name)+'</strong><small>'+escapeHTML(r.type)+'</small></div>').join('')+'<small class="ert195-warning">STRICT SHUFFLE-BAG QA PREVIEW · All 38 routes are exhausted before each reshuffle. Routes continue across qualifying rounds. Not yet attached to saved race results or official catalogue row IDs. Existing recorded times are NOT retroactively assigned a track.</small></div>';}
return {STREET,SPRINT,FINAL,POOL,hash,fingerprint,build,forGroup,groupCounts,allQualifyingGroups,html};
});
