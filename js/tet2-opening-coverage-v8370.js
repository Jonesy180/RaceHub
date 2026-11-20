/* TET2 v8.0.370 — first appearance coverage for the future Controlled Chaos Evil List.
 * No slot IDs, track draws, entrants, dates, results, medals or locks are created.
 * This is a pure, reproducible scheduling constraint module used to preview
 * and later validate the independent-format shakedown. The tournament itself
 * must still be generated and verified from the full competition catalogue.
 */
(function(root,factory){
 'use strict';const api=factory();if(root)root.TET2OpeningCoverage365=api;
 if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 // Audit labels are deliberately *format families*, not finished competitions.
 // An early appearance can be only the first round or first group, not the finale.
 const FORMATS=Object.freeze([
  {id:'festival-championship',title:'Festival Championship',note:'Opening group or first race of a championship',family:'Festival',kind:'group'},
  {id:'festival-single',title:'Festival Single Race',note:'Single-race timing and result',family:'Festival',kind:'single'},
  {id:'festival-top3',title:'Festival Top 3 / Open Event',note:'Standalone top-three results',family:'Festival',kind:'top3'},
  {id:'raceoff',title:'Race Off',note:'One scheduled batch of head-to-head pairings',family:'Race Off',kind:'knockout'},
  {id:'swiss',title:'Swiss Cup',note:'Opening Swiss round; later rounds return when scheduled',family:'Swiss',kind:'swiss'},
  {id:'relay-mixed',title:'Mixed Relay',note:'Three cars per team; different manufacturers',family:'Relay',kind:'mixed'},
  {id:'relay-manufacturer',title:'Manufacturer Relay',note:'Three-car teams from one manufacturer',family:'Relay',kind:'manufacturer'},
  {id:'gauntlet-unified',title:'Unified Gauntlet',note:'8 owned cars per slot, three routes each; shared maker/class/type standings',family:'Gauntlet',kind:'unified'},
  {id:'lonely-hearts',title:'Lonely Hearts',note:'First eligible manufacturer knockout appearance',family:'Lonely Hearts',kind:'knockout'},
  {id:'drift-championship-22',title:'Drift Car Championship',note:'Existing 22-car championship; not Drift Zone Score',family:'Drift',kind:'championship'},
  {id:'aerodromo-doubleheader',title:'Aeródromo Double-Header',note:'Drag first, then Long Jump · one batch per slot',family:'Aeródromo',kind:'dual'}
 ].map(x=>Object.freeze(x)));
 const DELAYED=Object.freeze([
  {id:'second-chance',title:'Second Chance Cup',reason:'Requires genuine eligible bronze-duel winners; no artificial field or 16-car cap'},
  {id:'champion-of-champions',title:'Champion of Champions',reason:'Tournament finale; manufacturer representatives cannot be chosen early'}
 ].map(x=>Object.freeze(x)));
 function hash32(text){let h=2166136261>>>0;for(const c of String(text)){h^=c.codePointAt(0);h=Math.imul(h,16777619)>>>0;}return h>>>0;}
 function rng(seed){let a=hash32(seed)||0x9e3779b9;return ()=>{a=(a+0x6d2b79f5)|0;let t=Math.imul(a^a>>>15,1|a);t^=t+Math.imul(t^t>>>7,61|t);return ((t^t>>>14)>>>0)/4294967296;};}
 function build(seed,formats=FORMATS){
  if(!Array.isArray(formats)||formats.length<1||formats.length>250)throw Error('Opening format registry invalid');
  const unique=new Set();const cards=formats.map((x,i)=>{
    if(!x||typeof x.id!=='string'||!x.id||typeof x.title!=='string'||!x.title||unique.has(x.id))throw Error('Missing or duplicated opening format');
    unique.add(x.id);
    if(DELAYED.some(d=>d.id===x.id))throw Error('Final dependent competition cannot appear in the opening');
    if(x.id==='drag-shootout'||x.id==='long-jump')throw Error('Separate Drag/Long Jump opening slots were retired');
    return {...x,originalOrder:i};
  });
  const random=rng(String(seed));for(let i=cards.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[cards[i],cards[j]]=[cards[j],cards[i]];}
  const coverage=validate(cards,formats);
  if(!coverage.ok)throw Error('Opening coverage failed: '+coverage.issues.join('; '));
  return Object.freeze(cards.map((x,i)=>Object.freeze({id:x.id,title:x.title,note:x.note,kind:x.kind,family:x.family,openingPosition:i+1})));
 }
 function validate(ordered,formats=FORMATS){
  const ids=ordered.map(x=>x.id),expected=formats.map(x=>x.id),issues=[];
  if(ids.length!==expected.length)issues.push('Not every opening format has one appearance');
  if(new Set(ids).size!==ids.length)issues.push('A format has appeared twice');
  for(const id of expected)if(ids.filter(x=>x===id).length!==1)issues.push('Missing or repeated format '+id);
  if(ids.includes('second-chance')||ids.includes('champion-of-champions'))issues.push('Dependent finals scheduled early');
  if(ids.includes('drag-shootout')||ids.includes('long-jump'))issues.push('Drag and jump must share Aeródromo slots');
  if(ids.includes('gauntlet-manufacturer')||ids.includes('gauntlet-type'))issues.push('Separate manufacturer/type Gauntlets were superseded by the one unified all-car Gauntlet');
  if(ids.filter(x=>x==='gauntlet-unified').length!==1)issues.push('Unified Gauntlet missing');
  if(ids.filter(x=>x==='aerodromo-doubleheader').length!==1)issues.push('Double-header missing');
  return {ok:!issues.length,issues,covered:expected.length,lateFinalsExcluded:2};
 }
 const openerSeed='TET2-SHAKEDOWN-COVERAGE-UNIFIED-GAUNTLET-V2';
 return Object.freeze({build,validate,formats:FORMATS,delayed:DELAYED,seed:openerSeed,
   preview:()=>build(openerSeed)});
});
