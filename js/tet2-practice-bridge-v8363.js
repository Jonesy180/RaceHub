/* TET2 v8.0.363 — isolated LOCAL PRACTICE draw lock + results bridge.
   No official Evil List or competition identity is forged. No rhSave, no honours,
   no record or garage mutation. Storage is scoped to the active FH5 Space ID. */
(function(root,factory){
 'use strict';const api=factory(root);
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.TET2Practice363=api;
})(typeof window!=='undefined'?window:globalThis,function(root){
 'use strict';
 const PREFIX='tet2.practice.draw.v8363.',SOURCE='TET2_DRAW_PRACTICE_V8363';
 const S=x=>String(x??'').trim(),clone=x=>JSON.parse(JSON.stringify(x));
 const fail=msg=>{throw Error('TET2 practice: '+msg)};
 function space(){
   const x=typeof root.rhSpace==='function'?root.rhSpace():null;
   if(!x||x.catalogueKey!=='fh5-catalogue-v1'||!S(x.id)||!Array.isArray(x.cars))fail('Select your real FH5 Catalogue Space');
   const ids=x.cars.map(c=>S(c?.id));if(ids.some(id=>!id)||new Set(ids).size!==ids.length)fail('Invalid Garage car IDs');
   return x;
 }
 function key(x){return PREFIX+encodeURIComponent(S(x.id));}
 function store(){const ls=root.localStorage;if(!ls||typeof ls.getItem!=='function'||typeof ls.setItem!=='function')fail('Local practice storage unavailable');return ls;}
 function garage(x){return new Map(x.cars.map(c=>[S(c.id),c]));}
 function validate(b,x){
   if(!b||b.schema!==1||b.source!==SOURCE||b.spaceId!==S(x.id)||!b.draw||!['group','raceoff'].includes(b.draw.mode)||!b.saved||typeof b.saved!=='object'||Array.isArray(b.saved))fail('Saved practice draw is invalid for this Garage');
   const byId=garage(x),ids=[];
   const check=c=>{
     if(!c||!S(c.id)||!byId.has(S(c.id)))fail('Drawn car is missing from the active Garage');
     ids.push(S(c.id));return byId.get(S(c.id));
   };
   if(b.draw.mode==='group'){
     if(!Array.isArray(b.draw.group)||b.draw.group.length<2||b.draw.group.length>64||!Array.isArray(b.tracks)||![1,3].includes(b.tracks.length))fail('Practice group settings invalid');
     b.draw.group.forEach(check);
     if(!Array.isArray(b.saved.group)||b.saved.group.length!==b.tracks.length)fail('Group saved times invalid');
     for(const record of b.saved.group){
       if(!record||typeof record!=='object'||Array.isArray(record))fail('Invalid saved group record');
       for(const [id,ms] of Object.entries(record))if(!b.draw.group.some(c=>S(c.id)===id)||!Number.isSafeInteger(ms)||ms<=0)fail('Invalid saved group result');
     }
     for(let i=1;i<b.saved.group.length;i++)if(Object.keys(b.saved.group[i]).length>0&&Object.keys(b.saved.group[i-1]).length!==b.draw.group.length)fail('Practice track order invalid');
   }else{
     if(!Array.isArray(b.draw.matches)||b.draw.matches.length<1||b.draw.matches.length>8||!S(b.tracks?.[0]))fail('Practice Race Off settings invalid');
     const mid=new Set();
     for(const m of b.draw.matches){if(!m||!S(m.id)||mid.has(S(m.id)))fail('Repeated practice match');mid.add(S(m.id));check(m.carA);check(m.carB);}
     for(const [id,r] of Object.entries(b.saved.matches||{})){
       const m=b.draw.matches.find(m=>S(m.id)===id);
       if(!m||!r||!Number.isSafeInteger(r.a)||!Number.isSafeInteger(r.b)||r.a<=0||r.b<=0||r.a===r.b||r.winnerId!==(r.a<r.b?m.carA.id:m.carB.id))fail('Invalid banked match');
     }
   }
   if(new Set(ids).size!==ids.length)fail('Draw has duplicate car IDs');
   return b;
 }
 function read(){const x=space(),ls=store();let raw;try{raw=ls.getItem(key(x));}catch(e){fail('Local storage cannot be read');}if(!raw)return null;
   let b;try{b=JSON.parse(raw);}catch(e){fail('Saved practice data cannot be read');}return validate(b,x);
 }
 function write(b){const x=space();validate(b,x);try{store().setItem(key(x),JSON.stringify(b));}catch(e){fail('Could not save practice draw — no results were banked');}}
 function locked(){return !!read();}
 function lock(draw){
   const x=space();if(read())fail('A practice draw is already locked. Return to that draw or explicitly clear the practice trial');
   if(!draw||draw.spaceId!==S(x.id)||draw.preview!==true||!['group','raceoff'].includes(draw.mode))fail('A fresh current-Garage preview draw is required');
   const d=clone(draw),b={schema:1,source:SOURCE,spaceId:S(x.id),createdAt:new Date().toISOString(),draw:d,
     tracks:d.mode==='group'?['Playa Azul Circuit','Horizon Festival Circuit','Las Afueras Circuit']:['Horizon Festival Circuit'],
     saved:d.mode==='group'?{group:[{},{},{}]}:{matches:{}}};
   if(d.mode==='raceoff')d.matches.forEach((m,i)=>{m.id='practice-match-'+String(i+1).padStart(2,'0');});
   validate(b,x);write(b);return status();
 }
 function status(){
   const b=read();if(!b)return null;
   const required=b.draw.mode==='group'?b.draw.group.length*b.tracks.length:b.draw.matches.length;
   const banked=b.draw.mode==='group'?b.saved.group.reduce((n,r)=>n+Object.keys(r).length,0):Object.keys(b.saved.matches).length;
   return {mode:b.draw.mode,spaceId:b.spaceId,createdAt:b.createdAt,banked,required,complete:banked===required,count:b.draw.mode==='group'?b.draw.group.length:b.draw.matches.length};
 }
 function bank(p){
   const b=read();if(!b)fail('No locked practice draw to save into');
   if(!p||p.mode!==b.draw.mode||S(p.slotId)!=='PRACTICE-CURRENT'||S(p.competitionId)!=='PRACTICE-ONLY')fail('Result is not from the locked practice draw');
   if(b.draw.mode==='group'){
     const i=p.trackIndex,id=S(p.carId),ms=p.timeMs;
     if(!Number.isInteger(i)||i<0||i>=b.tracks.length||!b.draw.group.some(c=>S(c.id)===id)||S(p.track)!==b.tracks[i]||!Number.isSafeInteger(ms)||ms<=0)fail('Wrong group car, track or time');
     if(Object.hasOwn(b.saved.group[i],id))fail('This result is already saved');
     for(let j=0;j<i;j++)if(Object.keys(b.saved.group[j]).length!==b.draw.group.length)fail('Complete earlier tracks first');
     b.saved.group[i][id]=ms;
   }else{
     const m=b.draw.matches.find(m=>m.id===S(p.matchId));
     if(!m||S(p.track)!==b.tracks[0]||S(p.carA)!==S(m.carA.id)||S(p.carB)!==S(m.carB.id)||!Number.isSafeInteger(p.timeA)||!Number.isSafeInteger(p.timeB)||p.timeA<=0||p.timeB<=0||p.timeA===p.timeB||p.winnerId!==(p.timeA<p.timeB?m.carA.id:m.carB.id))fail('Match results do not match the locked draw');
     if(Object.hasOwn(b.saved.matches,m.id))fail('This match is already saved');
     b.saved.matches[m.id]={a:p.timeA,b:p.timeB,winnerId:p.winnerId};
   }
   write(b);return status();
 }
 function flags(c){
   // Only use explicit live per-car markers; do not invent ownership/medal badges.
   return {id:S(c.id),name:S(c.name)||[c.make,c.model,c.year].filter(Boolean).join(' '),h:c.h===true,e:c.e===true};
 }
 function open(){
   const b=read();if(!b)fail('Generate and lock a practice draw first');
   const g=garage(space()),api=root.TET2ResultsEntry360;if(typeof api?.openTrial!=='function')fail('Multi-result entry trial adapter unavailable');
   const base={source:SOURCE,spaceId:b.spaceId,slotId:'PRACTICE-CURRENT',competitionId:'PRACTICE-ONLY',mode:b.draw.mode,
     label:'REAL GARAGE PRACTICE • '+(b.draw.mode==='group'?'ONE GROUP':'ONE RACE OFF SLOT')+' • NOT OFFICIAL',
     onBank:async result=>bank(result),onExit:()=>root.TET2Stage4UI359?.page('race')};
   if(b.draw.mode==='group'){
     base.cars=b.draw.group.map(c=>flags(g.get(S(c.id))));base.tracks=b.tracks;
     base.saved=clone(b.saved.group);
     // Resume at first incomplete track; completed tracks and their times remain stored.
     const first=b.saved.group.findIndex(m=>Object.keys(m).length<b.draw.group.length);
     base.trackIndex=first<0?b.tracks.length-1:first;
   }else{
     base.matches=b.draw.matches.map(m=>({id:m.id,track:b.tracks[0],cars:[flags(g.get(S(m.carA.id))),flags(g.get(S(m.carB.id)))]}));
     base.saved=clone(b.saved.matches);
   }
   api.openTrial(base);return status();
 }
 function clear(){const x=space();try{store().removeItem(key(x));}catch(e){fail('Could not remove practice draw');}}
 return Object.freeze({lock,locked,status,open,bank,clear,read,version:'8.0.363'});
});
