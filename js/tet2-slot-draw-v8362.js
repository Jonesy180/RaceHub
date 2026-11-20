/* TET2 v8.0.362 — real FH5 Garage, current-slot-scoped draw foundation.
   Preview mode: no schedule invented, no saved data or official draw, no honours.
   The future Controlled Chaos scheduler can pass exact eligible IDs and slot
   limits to selectFromGarage; it alone will authorize immutable official draws. */
(function(root,factory){
 'use strict';const api=factory(root);
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.TET2SlotDraw362=api;
})(typeof window!=='undefined'?window:globalThis,function(root){
 'use strict';
 const S=v=>String(v??'').trim();
 const esc=s=>S(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const error=s=>{throw Error('TET2 draw safe stop: '+s)};
 let current=null;
 function garage(){
   const space=typeof root.rhSpace==='function'?root.rhSpace():null;
   if(!space||space.catalogueKey!=='fh5-catalogue-v1'||!S(space.id)||!Array.isArray(space.cars))error('Open the original FH5 Catalogue Space first');
   const cars=space.cars.map(c=>({id:S(c?.id),name:S(c?.name)||[c?.make,c?.model,c?.year].filter(Boolean).join(' '),make:S(c?.make),year:c?.year}));
   if(cars.some(c=>!c.id||!c.name)||new Set(cars.map(c=>c.id)).size!==cars.length)error('Garage has invalid or duplicate car IDs');
   return {spaceId:S(space.id),cars};
 }
 function rngIndex(upper){
   if(!Number.isSafeInteger(upper)||upper<=0)error('Invalid random draw bound');
   if(upper===1)return 0;
   const crypto=root.crypto||globalThis.crypto;
   if(!crypto||typeof crypto.getRandomValues!=='function')error('Secure lottery unavailable on this device');
   const max=4294967296;
   const limit=max-(max%upper);
   const box=new Uint32Array(1);
   do{crypto.getRandomValues(box);}while(box[0]>=limit);
   return box[0]%upper;
 }
 function selectFromGarage(spec){
   const g=garage();
   if(!spec||!['group','raceoff'].includes(spec.mode))error('Choose a supported draw type');
   const count=spec.mode==='group'?Number(spec.count):Number(spec.matches)*2;
   if(!Number.isInteger(count)||(spec.mode==='group'&&(count<2||count>64))||(spec.mode==='raceoff'&&(!Number.isInteger(spec.matches)||spec.matches<1||spec.matches>8)))error('Unsupported group size or match count');
   const byId=new Map(g.cars.map(c=>[c.id,c]));
   let pool;
   if(spec.eligibleCarIds===undefined){pool=g.cars.slice();}
   else {
     if(!Array.isArray(spec.eligibleCarIds)||!spec.eligibleCarIds.length)error('No eligible car IDs provided by competition');
     if(new Set(spec.eligibleCarIds.map(S)).size!==spec.eligibleCarIds.length)error('Repeated eligible car IDs');
     pool=spec.eligibleCarIds.map(id=>byId.get(S(id)));
     if(pool.some(c=>!c))error('Competition includes a car that is not in your owned FH5 Garage');
   }
   if(spec.excludedCarIds!==undefined){
     if(!Array.isArray(spec.excludedCarIds))error('Excluded ID list invalid');
     const excluded=new Set(spec.excludedCarIds.map(S));
     pool=pool.filter(c=>!excluded.has(c.id));
   }
   if(pool.length<count)error('Not enough eligible owned cars for this slot');
   // Full random Fisher–Yates, then consume only the CURRENT slot. Later slots
   // are never drawn now, so eligible late entrants can appear in later draws.
   for(let i=pool.length-1;i>0;i--){const j=rngIndex(i+1);[pool[i],pool[j]]=[pool[j],pool[i]];}
   const chosen=pool.slice(0,count).map(c=>({...c}));
   const draw={spaceId:g.spaceId,mode:spec.mode,count,available:pool.length,slotId:S(spec.slotId)||null,competitionId:S(spec.competitionId)||null,preview:spec.preview!==false,createdAt:new Date().toISOString()};
   if(spec.mode==='group'){draw.group=chosen;}
   else{draw.matches=Array.from({length:count/2},(_,i)=>({number:i+1,carA:chosen[i*2],carB:chosen[i*2+1]}));}
   return draw;
 }
 function preview(mode,count){
   const spec=mode==='group'?{mode,count,preview:true}:{mode,matches:count,preview:true};
   current=selectFromGarage(spec);return current;
 }
 function snapshot(){return current?JSON.parse(JSON.stringify(current)):null;}
 function safeCurrent(){
   if(!current)return null;
   try{if(garage().spaceId!==current.spaceId){current=null;return null;}}catch(_){current=null;return null;}
   return current;
 }
 function render(){
   const c=safeCurrent();const gState=(()=>{try{return garage()}catch(e){return {error:e.message}}})();
   const badge='<strong class="t2-cyan">CONNECTED ✓</strong>';
   const imageKind=(c?.mode==='raceoff'?'raceoff':'group');
   const head=`<div class="t2-draw-hero"><img src="assets/tet2-stage4-v8362/draw-${imageKind}-header.webp" alt="Dave, Steve and Chief Tech Penguin at the Controlled Chaos draw machine"></div><div class="t2-entry-banner"><span>TET2 • CONTROLLED CHAOS</span><strong>COMPETITION DRAW</strong><button type="button" class="t2-entry-back" data-t2-draw-action="back">← RACE CONTROL</button></div>`;
   if(gState.error)return `<div class="t2-entry-page">${head}<section class="t2-panel"><h2>Garage required</h2><p>${esc(gState.error)}</p><p>No draw has been made. Your owned cars and OTG! records are unchanged.</p></section></div>`;
   let rows='';
   if(c){
     rows=c.mode==='group'?`<div class="t2-draw-list">${c.group.map((car,i)=>`<div class="t2-draw-row"><strong>${String(i+1).padStart(2,'0')}</strong><span>${esc(car.name)}</span></div>`).join('')}</div>`
       :`<div class="t2-draw-list">${c.matches.map(m=>`<div class="t2-draw-match"><strong>MATCH ${String(m.number).padStart(2,'0')}</strong><div>${esc(m.carA.name)}</div><em>VS</em><div>${esc(m.carB.name)}</div></div>`).join('')}</div>`;
   }
   return `<div class="t2-entry-page t2-draw-page">${head}
   <div class="t2-entry-alert">REAL OWNED GARAGE CARS · DRAW PREVIEW ONLY · NO OFFICIAL SLOT SAVED</div>
   <section class="t2-panel"><h2>Live Garage · Current-slot draw trial</h2>
     <div class="t2-row"><span>Active FH5 Space</span>${badge}</div><div class="t2-row"><span>Owned cars currently available for preview</span><strong>${gState.cars.length}</strong></div>
     <p>This test uses real car names from your Garage. The official Evil List has not assigned the slot or eligibility rules yet; this preview does not lock entrants or change records.</p>
     <label class="t2-draw-label" for="t2-draw-format">Preview type</label>
     <select id="t2-draw-format" class="t2-draw-select" data-t2-draw-select="mode"><option value="group" ${c?.mode==='group'?'selected':''}>ONE GROUP (only this slot)</option><option value="raceoff" ${c?.mode==='raceoff'?'selected':''}>RACE OFF (only this slot)</option></select>
     <label class="t2-draw-label" for="t2-draw-size">${c?.mode==='raceoff'?'Number of matches':'Cars in this group'}</label>
     <select id="t2-draw-size" class="t2-draw-select" data-t2-draw-select="size">${(c?.mode==='raceoff'?[1,2,4,8]:[3,6,8,16]).map(n=>`<option value="${n}" ${c&&((c.mode==='raceoff'?c.count/2:c.count)===n)?'selected':''}>${n} ${c?.mode==='raceoff'?'match'+(n>1?'es':''):'cars'}</option>`).join('')}</select>
     <button class="t2-btn" type="button" data-t2-draw-action="generate">🎲 ${c?'REDRAW CURRENT SLOT':'GENERATE DRAW'}</button>
   </section>
   ${c?`<section class="t2-panel"><h2>${c.mode==='group'?'GROUP DRAW · ONE GROUP':'RACE OFF · CURRENT SLOT PAIRINGS'}</h2><div class="t2-entry-strip"><span>${c.mode==='group'?'GROUP PREVIEW':'ROUND PREVIEW'}</span><span>${c.mode==='group'?c.count+' CARS':c.matches.length+' MATCHES'}</span></div>${rows}<p class="t2-entry-help">No manufacturer logos, car pictures or H/E badges on draw screens.</p><div class="t2-locked"><strong>NOT LOCKED</strong><p>Confirmation and permanent slot locking will activate only when the verified Controlled Chaos Evil List supplies this slot's eligibility and scheduling instructions.</p></div><button type="button" class="t2-btn" disabled>CONFIRM &amp; LOCK DRAW — AWAITING EVIL LIST</button></section>`
   :`<section class="t2-panel"><h2>Draw not generated</h2><p>Draw one group or up to eight Race Off matches in a single operation. Future slots are left untouched.</p></section>`}
   <button type="button" class="t2-btn t2-secondary" data-t2-draw-action="back">← BACK TO RACE CONTROL</button>
   </div>`;
 }
 function action(e,goBack,update){
   const btn=e.target.closest?.('[data-t2-draw-action]');if(!btn)return false;
   if(btn.dataset.t2DrawAction==='back'){goBack();return true;}
   if(btn.dataset.t2DrawAction==='generate'){
     const el=e.target.closest('#tet2-stage4-app')||document;
     const mode=el.querySelector('#t2-draw-format')?.value;
     const n=Number(el.querySelector('#t2-draw-size')?.value);
     try{preview(mode,n);update();}catch(err){const alert=el.querySelector('.t2-entry-alert');if(alert){alert.textContent=err.message;alert.setAttribute('role','alert');}}
     return true;
   }
   return false;
 }
 // The future scheduler will pass exact eligible IDs and a slot number to
 // selectFromGarage. No adapter can use this module to bypass the v361 ledger's
 // independent authenticate() gate: there is intentionally no official lock API.
 return Object.freeze({garage,selectFromGarage,preview,snapshot,render,action,version:'8.0.362'});
});
