/* OTG! Main v8.0.386 — local-only, source-grounded historical Garage reconciliation.
 * Uses original R1 event ecosystem and original anonymous eligibility rule.
 * Does NOT include the user's historical car IDs, source backup, saved roster,
 * or an exported list of ownership. All membership is recomputed on the phone.
 * Only confident exclusions are automatically applied; uncertain identities
 * remain explicitly provisional, never certified by count equality alone.
 */
(function(root,factory){'use strict';const api=factory(root);root.TET2Eligibility385=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof window!=='undefined'?window:globalThis,function(root){
'use strict';
const S=x=>String(x??'').trim();
const E=x=>S(x).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const norm=x=>S(x).toLocaleLowerCase('en-GB').replace(/[&/_\-]/g,' ').replace(/\s+/g,' ').trim();
const OFFROAD=new Set(['pickups 4x4','rally monsters','unlimited offroad','retro rally','classic rally','modern rally','unlimited buggies','offroad','utvs','utv','buggies','trucks']);
const TRACK=new Set(['track toys','extreme track toys','classic racers','vintage racers']);
const VALID=new Set(['NORMAL','RACE','DRIFT','OFF-ROAD / BUGGY','FORZA EDITION']);
function classify(c){
 const make=S(c.make),model=S(c.model),name=S(c.name),label=[make,model].join(' ').trim()||name;
 const t=norm(c.classType), n=norm(label);
 if(/\bforza edition\b|\bfe\b/i.test(label))return {ecosystem:'FORZA EDITION',certainty:'high',reason:'Explicit Forza Edition / FE variant'};
 if(t==='drift cars')return {ecosystem:'DRIFT',certainty:'high',reason:'FH5 class is Drift Cars'};
 if(OFFROAD.has(t))return {ecosystem:'OFF-ROAD / BUGGY',certainty:'high',reason:'FH5 rally, off-road, buggy or truck class'};
 if(t==='vintage racers')return {ecosystem:'RACE',certainty:'high',reason:'FH5 Vintage Racers class'};
 const marker=/#\d{1,5}\b|\b(?:gte|gtlm|lmp|gt3 r|amr pro|super trofeo|competizione|fxx|ccgt|bt62|scv12)\b/i;
 if(TRACK.has(t)&&marker.test(label))return {ecosystem:'RACE',certainty:'high',reason:'Clearly competition-designated racing model in a mixed track class'};
 if(TRACK.has(t))return {ecosystem:'NORMAL',certainty:'review',reason:'Track / classic racer category mixes road-going and dedicated race cars in original R1 classification'};
 // Classic / road categories may still have special curated exceptions.
 return {ecosystem:'NORMAL',certainty:'high',reason:'Road-car category after explicit specialist filters'};
}

// Where the older 382 selector could not read a source rule, decode only
// explicit R1 category / decade / maker constraints. No historical car IDs.
function derivedBase(c,base){
 if(base?.resolved)return base;
 const rule=S(c?.src?.rule),ecosystem=S(c?.src?.ecosystem);
 const cars=c?.sp?.cars;if(!Array.isArray(cars))return base;
 let xs=null,descriptor='';
 const selectClass=x=>{const target=norm(x),aliases={'hypercar':['hypercars'],'hypercars':['hypercar'],
 'classic sports':['classic sports cars'],'classic sports cars':['classic sports'],
 'retro supercars':['retro super cars'],'retro super cars':['retro supercars'],
 'modern supercar':['modern supercars'],'modern supercars':['modern supercar'],
 'modern sports car':['modern sports cars'],'modern sports cars':['modern sports car'],
 'sports utility':['sports utility heroes'],'sports utility heroes':['sports utility'],
 'utility':['vans utility'],'vans utility':['utility']};
 const allowed=new Set([target,...(aliases[target]||[])]);return cars.filter(x=>allowed.has(norm(x.classType)));};
 const selectGroup=term=>{const t=S(term),dec=t.match(/\b((?:19|20)\d0)s\b/i);
 if(dec){const y=Number(dec[1]);return {cars:cars.filter(x=>Number(x.year)>=y&&Number(x.year)<y+10),hint:'Source decade '+dec[1]+'s'};}
 const normalTypes=['Classic Racers','Vintage Racers','Extreme Track Toys','Track Toys','GT Cars','Hypercar','Modern Supercar','Modern Sports Car','Retro Supercars'];
 if(normalTypes.some(x=>norm(x)===norm(t)))return {cars:selectClass(t),hint:'Source class '+t};
 const makerList=[...new Set(cars.map(x=>S(x.make)).filter(Boolean))].sort((a,b)=>b.length-a.length);
 const maker=makerList.find(x=>norm(x)===norm(t));
 if(maker)return {cars:cars.filter(x=>S(x.make)===maker),hint:'Source manufacturer '+maker};
 return null;};
 let m;
 if(/^all normal cars only$/i.test(rule)){xs=cars;descriptor='All normal ecosystem cars';}
 else if(/^all RACE ecosystem cars$/i.test(rule)){xs=cars;descriptor='All dedicated race ecosystem candidates';}
 else if((m=rule.match(/^OFF-ROAD \/ BUGGY (Classic Rally|Retro Rally|Modern Rally|Rally Monsters)$/i))){xs=selectClass(m[1]);descriptor='Rally Adventure class '+m[1];}
 else if((m=rule.match(/^normal cars in (.+)$/i))){xs=selectClass(m[1]);descriptor='Class / Type '+m[1];}
 else if((m=rule.match(/^normal (.+?) cars$/i))){xs=selectClass(m[1]);descriptor='Class / Type '+m[1];}
 else if((m=rule.match(/^RACE ecosystem: (.+)$/i))){
 const t=m[1].replace(/^Race Cars\s*[—–-]\s*/i,'');
 if(/^all race cars$/i.test(t)){xs=cars;descriptor='All dedicated race cars';}
 else{const s=selectGroup(t);if(s){xs=s.cars;descriptor=s.hint;}}
 }
 else if((m=rule.match(/^OFF-ROAD \/ BUGGY ecosystem: (.+)$/i))){
 const t=m[1].replace(/^Off-Road\s*[—–-]\s*/i,'');
 if(/^all off-road \/ buggy$/i.test(t)){xs=cars;descriptor='All off-road / buggy ecosystem cars';}
 else{const s=selectGroup(t);if(s){xs=s.cars;descriptor=s.hint;}}
 }
 else if(ecosystem==='FORZA EDITION'&&/^(ROAD|OFF-ROAD) FE only$/i.test(rule)){
 const off=/^OFF-ROAD/i.test(rule);xs=cars.filter(x=>{const label=[x.make,x.model,x.name].join(' ');if(!/\bforza edition\b|\bfe\b/i.test(label))return false;return OFFROAD.has(norm(x.classType))===off;});
 descriptor=off?'Off-road Forza Edition cars':'Road Forza Edition cars';
 }
 if(!xs)return base;
 const ids=xs.map(x=>S(x.id));const resolved=xs.length>=2&&ids.every(Boolean)&&new Set(ids).size===ids.length;
 return {...base,resolved,cars:resolved?xs:[],candidateCount:xs.length,matcher:'R1 rule: '+descriptor};
}

function audit(c,provided){
 const base=derivedBase(c,provided);
 const src=c?.src||{},eco=S(src.ecosystem),ref=Number(src.sourceCount);
 const candidates=base?.resolved&&Array.isArray(base.cars)?base.cars:[];
 const valid=VALID.has(eco),annotated=candidates.map(car=>({car,cat:classify(car)}));
 const included=valid?annotated.filter(x=>x.cat.ecosystem===eco||x.cat.certainty==='review'):annotated;
 const excluded=valid?annotated.filter(x=>x.cat.ecosystem!==eco&&x.cat.certainty==='high'):[];
 const unresolved=included.filter(x=>x.cat.certainty==='review');
 const confirmed=included.filter(x=>x.cat.ecosystem===eco&&x.cat.certainty==='high');
 const possible=included.filter(x=>x.cat.certainty==='review');
 const minCount=base?.resolved?confirmed.length:null;
 const maxCount=base?.resolved?confirmed.length+possible.length:null;
 const withinRange=Number.isInteger(ref)&&minCount!==null&&ref>=minCount&&ref<=maxCount;
 const gap=valid&&base?.resolved?included.length-ref:null;
 const aligned=gap===0;
 // No source-owned IDs ship in this build. Count parity alone never proves exact membership.
 const confidence= !base?.resolved?'SOURCE RULE UNRESOLVED':!valid?'UNKNOWN ECOSYSTEM':
   possible.length?(aligned?'COUNT ALIGNED — MIXED CLASSIFICATION NEEDS REVIEW':withinRange?'COUNT POSSIBLE — MIXED CLASSIFICATION NEEDS REVIEW':'COUNT OUTSIDE PROVISIONAL RANGE — REVIEW REQUIRED'):
   !aligned?'COUNT MISMATCH — GARAGE / R1 FIELD DIFFERENT':'COUNT ALIGNED — MEMBERSHIP UNVERIFIED';
 return {ecosystem:eco,sourceCount:ref,baseCount:base?.candidateCount??null,
  count:base?.resolved?included.length:null,cars:included.map(x=>x.car),included,excluded,unresolved,
  gap,aligned,minCount,maxCount,withinRange,confidence,mode:base?.matcher||'Source selector not available',
  sourceReady:valid&&base?.resolved===true,
  // Only qualified as provisional: even counts that align cannot certify an R1 roster.
  certified:false};
}
function enrich(c,provided){
 const base=derivedBase(c,provided);
 const a=audit(c,base);
 if(!a.sourceReady)return {...base,sourceRuleAudit:a};
 return {...base,cars:a.cars,candidateCount:a.count,sourceRuleAudit:a,exact:false,
  warning:'R1 ecosystem filter: '+a.ecosystem+'. '+a.confidence+'. '+a.excluded.length+' clearly nonmatching car(s) excluded; '+a.unresolved.length+' category exception(s) need review. Count agreement is NOT evidence of identical historic car IDs. Rehearsal only; official draws stay locked.'};
}
function html(info){if(info?.row?.origin!=='historical')return '';
 try{
  const sp=root.rhSpace?.(),src=root.TET2HistoricalSource382?.[info.row.eventId];
  if(!sp||sp.catalogueKey!=='fh5-catalogue-v1'||!Array.isArray(sp.cars)||!src)throw Error('Historical source or active FH5 Space unavailable');
  const b=root.TET2Historical382?.eligibility?.({sp,src,info});if(!b)throw Error('Historical candidate selector unavailable');
  const a=b.sourceRuleAudit||audit({src},b);
  const excluded=a.excluded.map(x=>`<li>${E(S(x.car.name)||[x.car.make,x.car.model,x.car.year].filter(Boolean).join(' '))} <small>— ${E(x.cat.reason)}</small></li>`).join('');
  const uncertain=a.unresolved.map(x=>`<li>${E(S(x.car.name)||[x.car.make,x.car.model,x.car.year].filter(Boolean).join(' '))} <small>— needs road/race classification review</small></li>`).join('');
  const headline=!a.sourceReady?'🔒 HISTORICAL RULE NEEDS REVIEW':a.unresolved.length?'🟡 MIXED ROAD/RACE CLASSIFICATION TO REVIEW':a.aligned?'🟡 CANDIDATE COUNT ALIGNED':'🔒 SOURCE MEMBERSHIP NOT RESOLVED';
  return `<section class="t2-e384" aria-label="Historical eligibility audit"><h3>🔎 HISTORICAL GARAGE ELIGIBILITY</h3><div class="t2-e384-counts"><div><small>Original 2026 source</small><strong>${Number.isInteger(a.sourceCount)?a.sourceCount:'?'}</strong></div><div><small>Raw live category</small><strong>${a.baseCount??'?'}</strong></div><div><small>After R1 ecosystem filter</small><strong>${a.count??'?'}</strong></div></div><p class="t2-e384-state">${headline}</p><p><strong>Source:</strong> ${E(src.rule)} · <strong>Ecosystem:</strong> ${E(a.ecosystem||'Unspecified')}</p><p class="t2-e385-range"><strong>Membership bounds:</strong> ${a.sourceReady?E(a.minCount)+' definite class matches · '+E(a.maxCount)+' possible with mixed road/race classes':'Unresolved source selector'} · Historic source identity still requires proof.</p><p>${a.sourceReady?`Excluded ${a.excluded.length} clearly unrelated car(s) and flagged ${a.unresolved.length} possible road/race classification exception(s).`:'A safe category filter cannot be derived for this event. No arbitrary entrants have been substituted.'}</p><details class="t2-e384-detail"><summary>Inspect candidate differences (${a.excluded.length} excluded · ${a.unresolved.length} to review)</summary>${excluded?`<h4>Excluded by clear specialist rules</h4><ul>${excluded}</ul>`:'<p>No clear specialist exclusions.</p>'}${uncertain?`<h4>Mixed road/race categories to review</h4><ul>${uncertain}</ul>`:''}</details><p class="t2-e384-note">⚠️ Historic source car IDs are intentionally NOT bundled into this public app. Even when counts match, original identities cannot be certified automatically. This does not approve an official draw, discard old saves, or modify your Garage.</p></section>`;
 }catch(err){return `<section class="t2-e384"><h3>🔎 HISTORICAL GARAGE ELIGIBILITY</h3><p class="t2-e384-state">🔒 ${E(err.message)}</p></section>`;}
}
return Object.freeze({classify,audit,enrich,html,version:'8.0.386'});
});
