/* OTG! MAIN 8.0.189 — maximum-participation relay PREVIEW. No writes.
   Replaces only the Relay Garage's show handler; old preview engine untouched. */
(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.rhEvil2MaxRelay189=api;})(typeof globalThis!=='undefined'?globalThis:null,function(){
 'use strict';
 const make=x=>String(x??'').trim()||'Unknown';
 function random(seed){let a=Number(seed)>>>0;return function(){a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};}
 function shuffle(src,r){let a=src.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 function inventory(input){const seen=new Set();return (input||[]).filter(c=>{const id=String(c?.id??'');if(!id||seen.has(id))return false;seen.add(id);return true;});}
 function draw(input,mode,seed=189){if(mode!=='maker'&&mode!=='mixed')throw Error('Unknown relay type');const cars=inventory(input),r=random(seed);const g=new Map();for(const c of cars){const k=make(c.make);if(!g.has(k))g.set(k,[]);g.get(k).push(c);}for(const [k,a] of g)g.set(k,shuffle(a,r));const teams=[];
 if(mode==='maker'){
   // Multiple teams per manufacturer: all complete triples, no one-team cap.
   for(const [k,a] of [...g.entries()].sort((x,y)=>x[0].localeCompare(y[0]))){let n=1;while(a.length>=3){teams.push({id:'maker:'+k+':'+n++,make:k,cars:[a.pop(),a.pop(),a.pop()]});}}
 }else{
   // Highest remaining counts first is an optimal packing for 3 distinct makes.
   // Random tie-breakers and seeded shuffled car pools preserve variety.
   while(true){const available=[...g].filter(([,a])=>a.length).map(([k,a])=>({k,n:a.length,tie:r()})).sort((a,b)=>b.n-a.n||a.tie-b.tie||a.k.localeCompare(b.k));if(available.length<3)break;
    const cs=available.slice(0,3).map(x=>g.get(x.k).pop());teams.push({id:'mixed:'+(teams.length+1),cars:shuffle(cs,r)});
   }
 }
 const ordered=shuffle(teams,r);const used=new Set(), leftovers=[...g.values()].flat();
 for(const t of ordered){if(t.cars.length!==3)throw Error('Incomplete team');const makes=new Set(t.cars.map(c=>make(c.make)));if(makes.size!==(mode==='maker'?1:3))throw Error('Wrong manufacturer mix');for(const c of t.cars){if(used.has(c.id))throw Error('Duplicate car');used.add(c.id);}}
 if(used.size+leftovers.length!==cars.length)throw Error('Garage allocation mismatch');
 if(mode==='maker'&&[...g.values()].some(a=>a.length>=3))throw Error('Possible manufacturer team unallocated');
 if(mode==='mixed'&&[...g.values()].filter(a=>a.length).length>=3)throw Error('Possible mixed team unallocated');
 // A maximum team count is also bounded by the maker distribution.
 const counts=[...inventory(input).reduce((m,c)=>(m.set(make(c.make),(m.get(make(c.make))||0)+1),m),new Map()).values()].sort((a,b)=>b-a),N=cars.length;
 let max=mode==='maker'?counts.reduce((s,n)=>s+Math.floor(n/3),0):Math.floor(N/3);
 if(mode==='mixed'){while(max>0&&counts.reduce((s,n)=>s+Math.min(n,max),0)<3*max)max--;}
 if(ordered.length!==max)throw Error('Participation optimum check failed');
 return {teams:ordered,leftovers,eligible:N,entered:used.size,maximum:max,mode,seed};
 }
 // In-browser preview: render one page at a time to avoid a 200+ team DOM freeze.
 let mode='maker',seed=189,page=0,screen=null,last=null;const pageSize=12;
 function escape(x){return String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
 function status(){const s=window.rhSpace?.();return {valid:s?.catalogueKey==='fh5-catalogue-v1',cars:window.rhEvil2Rules181?.carsOf(s)||[]};}
 function paint(){if(!screen)return;const {valid,cars}=status();let d=null,error='';try{if(valid)d=draw(cars,mode,seed)}catch(e){error=String(e?.message||e)}last=d;
 const total=d?.teams.length||0, pages=Math.max(1,Math.ceil(total/pageSize));page=Math.min(page,pages-1);
 let h=`<div class="erm-head"><button id="erm-back" type="button">← BACK TO EVIL 2.0</button><span>v8.0.189 · READ-ONLY</span></div><h2>RELAY GARAGE — MAXIMUM PARTICIPATION</h2><p class="erm-warning">QA PREVIEW ONLY · No confirmed draw, saved competition, track assignments, race results, or career honours. Nothing here changes your Garage.</p>`;
 if(!valid)h+='<p>Switch to the FH5 catalogue Space to preview its owned Garage.</p>';
 else if(error)h+=`<p role="alert">Draw blocked safely: ${escape(error)}</p>`;
 else{
 h+=`<div class="erm-stats"><div><strong>${d.eligible}</strong><small>Eligible Garage cars</small></div><div><strong>${total}</strong><small>Complete 3-car teams</small></div><div><strong>${d.entered}</strong><small>Cars entered</small></div><div><strong>${d.leftovers.length}</strong><small>Unused cars</small></div></div>`;
 h+=`<div class="erm-tabs"><button type="button" data-erm-mode="maker" class="${mode==='maker'?'active':''}">🏭 Manufacturer</button><button type="button" data-erm-mode="mixed" class="${mode==='mixed'?'active':''}">🏎️ Mixed</button></div>`;
 h+=`<div class="erm-controls"><label>Repeatable seed <input id="erm-seed" type="number" inputmode="numeric" min="1" max="4294967295" value="${seed}"></label><button type="button" id="erm-reseed">🎲 REDRAW TEAMS</button></div>`;
 h+=`<p class="erm-note">${mode==='maker'?'Each manufacturer may enter multiple independent teams; every full set of three eligible cars is used.':'Each team uses three different manufacturers; the algorithm maximises complete teams before randomising selection.'} No car appears twice.</p>`;
 if(total){h+=`<div class="erm-pages"><button id="erm-prev" ${page===0?'disabled':''}>← PREVIOUS</button><span>Teams ${page*pageSize+1}–${Math.min(total,(page+1)*pageSize)} of ${total}</span><button id="erm-next" ${page+1>=pages?'disabled':''}>NEXT →</button></div>`;
 h+='<div class="erm-cards">';for(let i=page*pageSize;i<Math.min(total,(page+1)*pageSize);i++){const t=d.teams[i];h+=`<article class="erm-card"><h3>TEAM ${String(i+1).padStart(3,'0')}${mode==='maker'?' · '+escape(t.make):''}</h3>`;t.cars.forEach((c,j)=>h+=`<div class="erm-stage"><b>STAGE ${j+1}</b><span>${escape(c.name)}<small>${escape(c.make)}</small></span></div>`);h+='</article>';}h+='</div>';
 h+=`<div class="erm-pages"><button id="erm-prev-bottom" ${page===0?'disabled':''}>← PREVIOUS</button><span>Page ${page+1} of ${pages}</span><button id="erm-next-bottom" ${page+1>=pages?'disabled':''}>NEXT →</button></div>`;}
 if(d.leftovers.length){const by=new Map();for(const c of d.leftovers)by.set(make(c.make),(by.get(make(c.make))||0)+1);h+=`<details class="erm-left"><summary>${d.leftovers.length} unused cars — manufacturer breakdown</summary><p>${[...by].sort((a,b)=>a[0].localeCompare(b[0])).map(([k,n])=>escape(k)+': '+n).join(' · ')}</p></details>`;}
 }
 h+='<button type="button" id="erm-back-bottom">← BACK TO EVIL 2.0</button>';
 screen.innerHTML=h;
 for(const id of ['erm-back','erm-back-bottom'])screen.querySelector('#'+id)?.addEventListener('click',hide);
 screen.querySelectorAll('[data-erm-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.ermMode;page=0;paint()}));
 screen.querySelector('#erm-reseed')?.addEventListener('click',()=>{const v=Number(screen.querySelector('#erm-seed').value);if(!Number.isSafeInteger(v)||v<1||v>4294967295){alert('Seed must be a whole number from 1 to 4294967295.');return;}seed=(v+1)>>>0;if(!seed)seed=1;page=0;paint()});
 for(const id of ['erm-prev','erm-prev-bottom','erm-next','erm-next-bottom'])screen.querySelector('#'+id)?.addEventListener('click',()=>{page+=id.includes('prev')?-1:1;paint();screen.scrollIntoView({block:'start'});});
 }
 function show(){if(typeof document==='undefined')return;screen=document.getElementById('erm-189');if(!screen){screen=document.createElement('section');screen.id='erm-189';screen.setAttribute('aria-label','Relay Garage QA');document.body.appendChild(screen);}screen.style.display='block';paint();}
 function hide(){if(screen)screen.style.display='none';}
 const api={draw,show,hide,inspect:()=>last};
 // Attach to existing proven landing only; avoid touching storage or retired old campaign.
 if(typeof window!=='undefined'&&window.rhEvil2RelayPlanner186)window.rhEvil2RelayPlanner186.show=show;
 return api;
});
