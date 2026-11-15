/* OTG! v8.0.265 — Prelaunch Evil List. No reset, no speculative medals/results. */
(()=>{'use strict';
const ID='otg-e263-list', api=()=>window.rhEvil2Mixed8262;
let query='',group='ALL',page=0,notice='',opened=false,loading=false,snapshotCache=null,filteredCache=null,searchTimer=null,loadToken=0;const PAGE=35;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const label=r=>r.kind==='EXISTING'?'ORIGINAL':r.action==='RESTORED_ARCHIVE'?'ARCHIVE':r.action==='RESTORED_LONELY'?'LONELY HEARTS':r.action==='NEW_MAKE'?'NEW MAKE':r.action==='NEW_GAUNTLET'?'GAUNTLET':r.action==='LONG_JUMP'?'LONG JUMP':r.action==='NEW_RELAY'?'RELAY':r.action==='GRAND_SECOND_CHANCE'?'SECOND CHANCE':String(r.kind||'OTHER');

// The Evil Extras are immediate navigation, not part of the 2,225-row stage list.
// Legacy feature engines are preserved in the existing installation. Never fabricate
// data or mark an unavailable module as working.
const EXTRAS=[
 ['pit','🏁','Pit Wall','Completed-event archive'],
 ['swiss','⚔️','Swiss War Room','Swiss Cup command centre'],
 ['rivalries','🥊','Rivalry Files','The recurring battles'],
 ['museum','🏆','Career Museum','Lifetime achievements'],
 ['incidents','📁','Incident Archive','Classified Jones Mob files'],
 ['missions','🤫','Secret Side Missions','Sealed discoveries'],
 ['cones','🚧','Cone Breaks','Intermission mayhem']
];
const EXTRA_APIS={
 pit:['rhPitWall8158','otgPitWall8158','rhPitWall'],
 swiss:['rhSwissWarRoom8160','otgSwissWarRoom8160','rhSwissWarRoom'],
 rivalries:['rhRivalryFiles8162','rhRivalryFiles8161','otgRivalryFiles'],
 museum:['rhCareerMuseum8159','otgCareerMuseum8159','rhCareerMuseum'],
 incidents:['rhPrivateMobIncidents8179','rhIncidentArchive8177','rhPrivateMobIncidents8176'],
 missions:['rhSecretSideMissions8163','rhEvilSecretSideMissions8163'],
 cones:['rhConeBreaks8164','rhConeBreak8172','rhConeBreak8164']
};
function extraPanel(){return '<section class="e266-extras" aria-label="Evil Extras"><div class="e266-extras-head"><h2>🏛️ EVIL EXTRAS</h2><span>COMMAND CENTRE</span></div><div class="e266-extras-grid">'+EXTRAS.map(([id,icon,title,sub])=>'<button type="button" data-e263="extra" data-extra="'+id+'"><span class="e266-icon">'+icon+'</span><strong>'+title+'</strong><small>'+sub+'</small></button>').join('')+'</div></section>';}
function openExtra(id){
 const title=EXTRAS.find(x=>x[0]===id)?.[2]||'Extra';
 const candidates=EXTRA_APIS[id]||[];
 for(const key of candidates){const feature=window[key];
   if(typeof feature==='function'){try{feature();opened=false;loadToken++;el().hidden=true;return;}catch(e){break;}}
   if(feature&&typeof feature==='object')for(const method of ['open','show','render']){
     if(typeof feature[method]==='function'){try{feature[method]();opened=false;loadToken++;el().hidden=true;return;}catch(e){break;}}
   }
 }
 // Some historical extras are launched by the original Evil screen's controls.
 // Don't guess a route or send the user to an unrelated screen.
 notice=title+' is preserved in the existing installation, but its legacy launcher has not yet been reconnected to this screen. No data has changed.';
 render();
}

function el(){let d=document.getElementById(ID);if(!d){d=document.createElement('div');d.id=ID;d.className='e263-overlay';d.hidden=true;document.body.appendChild(d);d.addEventListener('click',onClick);d.addEventListener('input',e=>{if(e.target.matches('[data-e263-search]')){query=e.target.value;page=0;filteredCache=null;clearTimeout(searchTimer);searchTimer=setTimeout(rowsOnly,140);}});}return d;}
function current(force=false){if(!force&&snapshotCache)return snapshotCache;if(!api()?.snapshot)throw Error('Mixed tournament native coordinator is unavailable.');const s=api().snapshot();if(!s.p||!Array.isArray(s.p.rows))throw Error('Verified stage sequence is unavailable.');snapshotCache=s;filteredCache=null;return s;}
function matches(r){let q=query.trim().toLowerCase();return(group==='ALL'||label(r)===group)&&(!q||String(r.position)===q||r.name.toLowerCase().includes(q)||String(r.kind).toLowerCase().includes(q)||String(r.originalSlot||'').toLowerCase()===q);}
function rowsOnly(){const host=document.querySelector('#'+ID+' [data-e263-rows]');if(!host)return;let s;try{s=current();}catch(e){host.innerHTML='<p class="e263-warn">SAFE STOP: '+esc(e.message)+'</p>';return;}const all=filteredCache||(filteredCache=s.p.rows.filter(matches)),count=all.length,offset=page*PAGE;host.innerHTML='<div class="e263-row-count">'+count+' matching stages · displaying '+(count?offset+1:0)+'–'+Math.min(offset+PAGE,count)+'</div>'+all.slice(offset,offset+PAGE).map(r=>{const done=!!(r.action==='ORIGINAL_SLOT'||r.action==='ORIGINAL_SPECIALIST'||r.action==='ORIGINAL_SWISS'?s.sp.evil2NativeRun8250?.slots?.[r.originalSlot]?.doneAt:s.b?.done?.[r.id]);const next=s.next?.r?.id===r.id;return '<article class="e263-row '+(next?'e263-next ':'')+(done?'e263-done':'')+'"><span class="e263-number">#'+r.position+'</span><div><strong>'+esc(r.name)+'</strong><small>'+esc(label(r))+(r.originalSlot?' · Original slot '+r.originalSlot:'')+'</small></div><span class="e263-flag">'+(done?'✓ DONE':next?'NEXT':'LOCKED')+'</span></article>';}).join('')+'<div class="e263-pager"><button data-e263="prev" '+(page===0?'disabled':'')+'>← Previous</button><span>Page '+(page+1)+' / '+Math.max(1,Math.ceil(count/PAGE))+'</span><button data-e263="next" '+((offset+PAGE)>=count?'disabled':'')+'>Next →</button></div>';
}
function render(){let s;try{s=current();}catch(e){el().innerHTML='<div class="e263-shell"><button data-e263="close">← BACK</button><h2>SAFE STOP</h2><p>'+esc(e.message)+'</p><p>No data has been changed.</p></div>';return;}
const n=s.next?.r,st=s.b?'FROZEN PRELAUNCH QA':'ORDER NOT YET FROZEN';let html='<div class="e263-shell"><button class="e263-back" data-e263="close">← BACK TO DASHBOARD</button><header class="e263-hero"><span class="e263-kicker">OUT THE GARAGE! · FH5</span><h1>THE EVIL LIST <em>2.0</em></h1><p>The complete mixed tournament. Every visit has a place. Every result must be earned.</p><div class="e263-tease">⚠️ A NEW PRESENCE IS APPROACHING THE GRID…</div></header>'+extraPanel()+'<div class="e263-stats"><span><b>'+s.p.stageCount+'</b> STAGES</span><span><b>'+s.complete+'</b> VERIFIED</span><span><b>'+s.blocked+'</b> FORMAT HOLDS</span></div><div class="e263-status">🔒 '+esc(st)+' · NO LIVE EVIL RESET</div>';
if(notice)html+='<p class="e263-notice" role="status">'+esc(notice)+'</p>';
if(n){html+='<section class="e263-now"><small>NEXT UP · STAGE '+n.position+' OF '+s.p.stageCount+'</small><h2>'+esc(n.name)+'</h2><p>'+esc(s.next.v.text)+'</p>'+(s.b?'<button data-e263="race">🏁 OPEN NATIVE RACING ENGINE</button>':'<button data-e263="freeze">🔐 FREEZE QA SCHEDULE ONLY</button>')+'</section>';}
html+='<div class="e263-controls"><label>FIND A STAGE<input data-e263-search type="search" placeholder="Stage number or event name" value="'+esc(query)+'"></label><label>FILTER BY FAMILY<select data-e263-group>'+['ALL','ORIGINAL','ARCHIVE','LONELY HEARTS','NEW MAKE','GAUNTLET','LONG JUMP','RELAY','SECOND CHANCE'].map(x=>'<option'+(x===group?' selected':'')+'>'+x+'</option>').join('')+'</select></label></div><div data-e263-rows></div><p class="e263-foot">PRELAUNCH LIST PREVIEW — stage search and browsing do not alter results, Garage ownership or live Evil 1. Only the next authorised stage may open.</p></div>';el().innerHTML=html;rowsOnly();}
function show(){
 if(opened)return;
 opened=true;notice='';loading=true;snapshotCache=null;filteredCache=null;page=0;query='';group='ALL';
 const d=el();d.hidden=false;
 d.innerHTML='<div class="e263-shell"><button data-e263="close">← BACK TO DASHBOARD</button><div class="e263-status" role="status">🏁 Preparing the 2,225-stage Evil List…</div><p class="e263-foot">Your Garage and results are not being changed.</p></div>';
 const token=++loadToken;
 // Allow browser to paint the loading state before the full source validation.
 setTimeout(()=>{if(!opened||token!==loadToken)return;try{current(true);}catch(err){notice='SAFE STOP — '+String(err.message||err);}loading=false;render();},80);
 window.scrollTo?.(0,0);
}
function close(){opened=false;loading=false;loadToken++;clearTimeout(searchTimer);el().hidden=true;const old=document.getElementById('evilcampaign');if(old)old.classList.add('hidden');if(originalShow)originalShow('home');else{document.querySelectorAll('main > section.screen').forEach(s=>s.classList.toggle('hidden',s.id!=='home'));}}
function onClick(e){const b=e.target.closest('button[data-e263]');if(!b)return;const act=b.dataset.e263;try{if(act==='close'){close();return;}if(act==='extra'){openExtra(b.dataset.extra);return;}if(act==='prev'||act==='next'){page+=act==='prev'?-1:1;rowsOnly();return;}if(act==='freeze'){if(!window.confirm('Freeze only the QA stage schedule? No Evil 1 reset, no Garage changes.'))return;api().freeze();current(true);notice='PRELAUNCH QA order frozen. Original Evil 1 untouched.';render();return;}if(act==='race'){let s=current();if(!s.b)throw Error('Freeze the prelaunch schedule before opening a stage.');if(!s.next)throw Error('No next stage.');opened=false;loadToken++;el().hidden=true;api().openStage(s.next.r,s.p);return;}}catch(err){notice='SAFE STOP — '+String(err.message||err);render();}}
// Preserve the EXISTING dashboard Evil Tournament tile and its artwork/position.
// Its existing navigation to evilcampaign is intercepted without changing the card itself.
const originalShow=typeof window.show==='function'?window.show:null;
function route(screen){if(screen==='evilcampaign'){show();return;}if(opened){opened=false;loadToken++;el().hidden=true;}return originalShow?.apply(this,arguments);}
function init(){
 el();
 // The legacy dashboard tile calls a scoped show() rather than window.show().
 // Observe the ACTUAL existing Evil Tournament section becoming active, then
 // replace its screen visually without changing tile DOM or original stored data.
 const old=document.getElementById('evilcampaign');
 if(old){
   const observe=()=>{
     const active=!old.classList.contains('hidden') && getComputedStyle(old).display!=='none';
     if(active){old.classList.add('hidden');if(!opened)show();}
   };
   new MutationObserver(observe).observe(old,{attributes:true,attributeFilter:['class','style']});
   observe();
 }
 // Also support any external code that calls window.show when available.
 if(originalShow)window.show=route;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.rhEvilList8264={open:show,close,version:'8.0.266'};
})();
