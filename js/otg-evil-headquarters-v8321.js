/* OTG! MAIN 8.0.321 — NEW Evil Headquarters UI, built independently of old Evil List screens.
   Presentation only: all tournament/draw/racing/progress writes remain in native modules. */
(()=>{'use strict';
const ID='otg-evil-hq-321', TOTAL=2225, PAGE_SIZE=12;
const ART='assets/tournaments/lord-ratchet-ma-lubrication-v8284.webp';
const featureTiles=[
  ['pit','🏁','Pit Wall'],['swiss','⚔️','Swiss War Room'],
  ['medals','🏅','Medal Tables'],['museum','🏆','Career Museum'],
  ['incidents','📁','Incident Archive'],['missions','🤫','Secret Side Missions'],
  ['cones','🚧','Cone Breaks'],['events','📋','Event List']
];
const featureApis={
  pit:['rhPitWall8158','otgPitWall8158','rhPitWall'],
  swiss:['rhSwissWarRoom8160','otgSwissWarRoom8160','rhSwissWarRoom'],
  medals:['rhEvil2Honours8257'],
  museum:['rhCareerMuseum8159','otgCareerMuseum8159','rhCareerMuseum'],
  incidents:['rhPrivateMobIncidents8179','rhIncidentArchive8177','rhPrivateMobIncidents8176'],
  missions:['rhSecretSideMissions8163','rhEvilSecretSideMissions8163'],
  cones:['rhConeBreaks8164','rhConeBreak8172','rhConeBreak8164']
};
const escapeHtml=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const category=r=>r.kind==='EXISTING'?'Original':({
  RESTORED_ARCHIVE:'Archive',RESTORED_LONELY:'Lonely Hearts',NEW_MAKE:'New Make',
  NEW_GAUNTLET:'Gauntlet',LONG_JUMP:'Long Jump',NEW_RELAY:'Relay',
  GRAND_SECOND_CHANCE:'Second Chance'}[r.action]||String(r.kind||'Event'));
let isOpen=false, view='home', plan=null, progress=null, verified=false;
let safeStop='', busy=false, epoch=0, page=1, search='', filter='ALL';
const root=()=>document.getElementById(ID);
function button(label,action,more=''){return `<button type="button" data-otg321="${action}" ${more}>${label}</button>`;}
function base(){return '<div class="otg321-container">';}
function hero(){return `<div class="otg321-hero" aria-label="Evil Tournament 2.0 cinematic artwork"><img src="${ART}" alt="Lord Ratchet, Ma Lubrication and the tournament crew" fetchpriority="high" decoding="async"></div>`;}
function stageDescription(r){
 if(r?.action==='NEW_GAUNTLET')return 'Gauntlet · native race routes';
 if(r?.action==='LONG_JUMP')return 'Long Jump · Aeródromo runway';
 if(r?.action==='NEW_RELAY')return 'Three-car Relay';
 if(r?.action==='ORIGINAL_SWISS')return 'Swiss Cup';
 return [category(r),r?.formatName||r?.format||''].filter(Boolean).join(' · ');
}
function raceVerdict(row){
 try{return window.otgEvilLiveProgress8312?.verdict?.(row)||{ready:false,kind:'hold',text:'Native verification unavailable'};}
 catch(e){return {ready:false,kind:'hold',text:'Native verification blocked: '+String(e.message||e)};}
}
function stageCard(){
 if(safeStop)return `<section class="otg321-current" aria-label="Current Event"><div class="otg321-kicker">CURRENT EVENT <span class="otg321-status">SAFE STOP</span></div><p class="otg321-alert" role="alert">${escapeHtml(safeStop)}</p><p class="otg321-muted">No racing action has been allowed. Your draw and results have not been changed.</p></section>`;
 if(!verified)return '<section class="otg321-current" aria-label="Current Event"><div class="otg321-kicker">CURRENT EVENT <span class="otg321-status">CHECKING</span></div><p class="otg321-pending" role="status">Verifying the locked current stage…</p><button class="otg321-primary" disabled>OPEN CURRENT STAGE</button></section>';
 if(!plan?.active)return '<section class="otg321-current"><div class="otg321-kicker">CURRENT EVENT</div><p class="otg321-alert">SAFE STOP — Tournament is not active. Racing remains locked.</p></section>';
 if(!progress)return '<section class="otg321-current"><div class="otg321-kicker">CURRENT EVENT</div><p class="otg321-alert">SAFE STOP — Verified race progress unavailable.</p></section>';
 const n=progress.next;
 if(!n)return '<section class="otg321-current"><div class="otg321-kicker">TOURNAMENT COMPLETE</div><h2>All stages finished</h2></section>';
 const verdict=raceVerdict(n),done=verdict.ready&&verdict.kind!=='hold';
 const action=done?'bank':'race';const label=done?'✓ MARK STAGE DONE':'🏁 OPEN CURRENT STAGE';
 return `<section class="otg321-current" aria-label="Current Event">
   <div class="otg321-kicker"><span>CURRENT EVENT</span><span class="otg321-status">🔒 DRAW LOCKED</span></div>
   <div class="otg321-stage"><span class="otg321-stage-no">STAGE ${Number(n.position)} / ${TOTAL}</span><h2>${escapeHtml(n.name)}</h2><p>${escapeHtml(stageDescription(n))}</p></div>
   ${done?'<p class="otg321-verified">✓ Saved native results verified</p>':''}
   <button class="otg321-primary" type="button" data-otg321="${action}" ${busy?'disabled':''}>${busy?'WORKING…':label}</button>
 </section>`;
}
function commandCentre(){return `<section class="otg321-command" aria-label="Command Centre"><h2>COMMAND CENTRE</h2>
  <div class="otg321-grid">${featureTiles.map(([id,icon,title])=>`<button type="button" class="otg321-tile" data-otg321="feature" data-feature="${id}"><span class="otg321-icon" aria-hidden="true">${icon}</span><span>${title}</span><span class="otg321-arrow" aria-hidden="true">›</span></button>`).join('')}</div></section>`;}
function renderHome(){
 const target=root();if(!target||!isOpen)return;
 target.innerHTML=base()+hero()+'<div class="otg321-underhero"><span>THE EVIL TOURNAMENT <b>2.0</b></span>'+button('← Dashboard','close','class="otg321-back"')+'</div>'+stageCard()+commandCentre()+'</div>';
}
function entries(){
 if(!verified||!plan?.active||!Array.isArray(plan.rows)||plan.rows.length!==TOTAL)return [];
 const term=search.trim().toLowerCase();
 return plan.rows.filter(row=>(filter==='ALL'||category(row).toUpperCase()===filter)&&(!term||String(row.position)===term||String(row.name||'').toLowerCase().includes(term)));
}
function listRows(all){
 if(!verified)return '<p class="otg321-pending" role="status">Verifying the official draw…</p>';
 if(safeStop)return `<p class="otg321-alert" role="alert">${escapeHtml(safeStop)}</p>`;
 if(!plan?.active)return '<p class="otg321-alert">SAFE STOP — Official draw not active.</p>';
 if(!all.length)return '<p class="otg321-muted">No matching events.</p>';
 const pos=Number(progress?.next?.position)||0,completed=Number(progress?.completed)||0;
 const start=(page-1)*PAGE_SIZE;
 return all.slice(start,start+PAGE_SIZE).map(row=>{
  const done=row.position<=completed,next=row.position===pos;
  return `<div class="otg321-row${next?' otg321-row-next':''}"><b class="otg321-num">#${row.position}</b><span class="otg321-row-text"><strong>${escapeHtml(row.name)}</strong><small>${escapeHtml(category(row))}</small></span><span class="otg321-tag">${done?'✓ DONE':next?'NEXT':'LOCKED'}</span></div>`;
 }).join('');
}
function listBody(){
 if(!verified||safeStop||!plan?.active)return listRows([]);
 const all=entries(),pages=Math.max(1,Math.ceil(all.length/PAGE_SIZE));page=Math.max(1,Math.min(pages,page));
 return `<div class="otg321-list-count">${all.length?`STAGES ${(page-1)*PAGE_SIZE+1}–${Math.min(page*PAGE_SIZE,all.length)} OF ${all.length}`:'NO STAGES'}</div>`+
 listRows(all)+`<nav class="otg321-pager" aria-label="Event list pages">${button('‹ Previous','prev',page===1?'disabled':'')}<span>PAGE ${page} / ${pages}</span>${button('Next ›','next',page>=pages?'disabled':'')}</nav>`;
}
function renderList(){
 if(!isOpen||view!=='list')return;
 root().innerHTML=base()+`<div class="otg321-list-top">${button('← EVIL HQ','home','class="otg321-list-back"')}<div><span>EVIL TOURNAMENT 2.0</span><h1>EVENT LIST</h1></div></div>`+
 `<div class="otg321-list-controls"><label>FIND EVENT<input data-otg321-search type="search" placeholder="Number or name" value="${escapeHtml(search)}"></label><label>FORMAT<select data-otg321-filter>${['ALL','ORIGINAL','ARCHIVE','LONELY HEARTS','NEW MAKE','GAUNTLET','LONG JUMP','RELAY','SECOND CHANCE'].map(x=>`<option value="${x}" ${x===filter?'selected':''}>${x}</option>`).join('')}</select></label></div>`+
 `<div class="otg321-jump"><span>12 EVENTS PER PAGE</span><label>GO TO PAGE <input data-otg321-page type="number" min="1" inputmode="numeric" placeholder="Page"></label>${button('GO','jump')}</div>`+
 `<div data-otg321-list-body>${listBody()}</div></div>`;
}
function refreshListBody(){let host=root()?.querySelector('[data-otg321-list-body]');if(host)host.innerHTML=listBody();}
function showView(which){view=which; if(which==='home')renderHome();else renderList();root()?.scrollTo({top:0,behavior:'instant'});}
function feedback(message){safeStop=message;busy=false;if(view==='home')renderHome();else renderList();}
async function verify(token){
 try{
  const inspector=window.otgEvilRoute8306?.inspect;
  if(typeof inspector!=='function')throw Error('Official draw reader unavailable');
  const loaded=await inspector();
  if(!isOpen||token!==epoch)return;
  if(!loaded||!Array.isArray(loaded.rows)||loaded.rows.length!==TOTAL)throw Error('Official 2,225-stage draw failed verification');
  // Do not imply verified racing readiness until the native progress gate succeeds.
  const result=loaded.active?await window.otgEvilLiveProgress8312?.inspect?.(loaded):null;
  if(!isOpen||token!==epoch)return;
  if(loaded.active&&!result)throw Error('Native current-stage verification unavailable');
  plan=loaded;progress=result;verified=true;safeStop='';
  if(view==='home')renderHome();else renderList();
 }catch(e){if(!isOpen||token!==epoch)return;verified=false;feedback('SAFE STOP — '+String(e.message||e));}
}
function open(){
 if(isOpen){showView('home');return;}
 isOpen=true;busy=false;view='home';search='';filter='ALL';page=1;safeStop='';verified=false;plan=null;progress=null;
 const d=ensureRoot();d.hidden=false;renderHome();const token=++epoch;
 // Render new headquarters NOW; read protected state afterwards. No old page loads.
 requestAnimationFrame(()=>setTimeout(()=>{if(isOpen&&token===epoch)verify(token);},0));
}
function hide(){isOpen=false;epoch++;busy=false;const d=root();if(d)d.hidden=true;}
function close(){hide();const old=document.getElementById('evilcampaign');if(old)old.classList.add('hidden');
 if(typeof oldShow==='function')oldShow('home');else document.querySelectorAll('main > section.screen').forEach(e=>e.classList.toggle('hidden',e.id!=='home'));
}
function launchFeature(id){
 if(id==='events'){showView('list');return;}
 const label=featureTiles.find(t=>t[0]===id)?.[2]||'Feature';
 for(const name of featureApis[id]||[]){const entry=window[name];
   if(typeof entry==='function'){try{entry();hide();return;}catch(e){feedback('Could not open '+label+': '+String(e.message||e));return;}}
   if(entry&&typeof entry==='object')for(const method of ['open','show','render']){
     if(typeof entry[method]==='function'){try{entry[method]();hide();return;}catch(e){feedback('Could not open '+label+': '+String(e.message||e));return;}}
   }
 }
 // Preserve the feature engine and its data. Do not guess a substitute screen.
 feedback(label+' launcher is not available in this installation. No data has changed.');
}
async function doRace(){
 if(!verified||!plan?.active||!progress?.next||busy)return;
 if(typeof window.otgEvilRoute8306?.openStage!=='function')return feedback('SAFE STOP — Native racing launcher unavailable');
 busy=true;renderHome();const token=epoch;
 try{await window.otgEvilRoute8306.openStage(progress.next.position,true,true);
   if(token!==epoch||!isOpen)return;
   // A genuine native race screen is launched before the overlay is hidden.
   requestAnimationFrame(()=>{if(token===epoch)hide();});
 }catch(e){if(token===epoch&&isOpen)feedback('SAFE STOP — '+String(e.message||e));}
}
async function doBank(){
 if(!verified||!plan?.active||!progress?.next||busy)return;
 const row=progress.next,verdict=raceVerdict(row);
 if(!verdict.ready||verdict.kind==='hold')return feedback('SAFE STOP — Native racing results are not verified');
 if(!window.confirm('Bank Stage '+String(row.position).padStart(3,'0')+' — '+row.name+' as DONE and unlock the next stage?'))return;
 busy=true;renderHome();const token=epoch;
 try{const saved=await window.otgEvilLiveProgress8312.bank(plan,row.position);
   if(token!==epoch||!isOpen)return;
   progress=saved;busy=false;renderHome();
 }catch(e){if(token===epoch&&isOpen)feedback('SAFE STOP — '+String(e.message||e));}
}
function onClick(e){const node=e.target.closest('[data-otg321]');if(!node||!root()?.contains(node))return;
 const act=node.dataset.otg321;
 if(act==='close')return close();
 if(act==='home')return showView('home');
 if(act==='feature')return launchFeature(node.dataset.feature);
 if(act==='race')return doRace();
 if(act==='bank')return doBank();
 if(act==='prev'||act==='next'){page+=act==='prev'?-1:1;refreshListBody();return;}
 if(act==='jump'){
  const raw=root().querySelector('[data-otg321-page]')?.value;
  const value=Number(raw);const max=Math.max(1,Math.ceil(entries().length/PAGE_SIZE));
  if(!raw||!Number.isInteger(value)||value<1||value>max){const input=root().querySelector('[data-otg321-page]');if(input){input.setCustomValidity('Choose a page between 1 and '+max);input.reportValidity();input.addEventListener('input',()=>input.setCustomValidity(''),{once:true});}return;}
  page=value;refreshListBody();
 }
}
function ensureRoot(){let d=root();if(d)return d;d=document.createElement('section');d.id=ID;d.hidden=true;d.setAttribute('aria-label','Evil Tournament Headquarters');document.body.append(d);
 d.addEventListener('click',onClick);
 d.addEventListener('input',e=>{if(e.target.matches('[data-otg321-search]')){search=e.target.value;page=1;refreshListBody();}});
 d.addEventListener('change',e=>{if(e.target.matches('[data-otg321-filter]')){filter=e.target.value;page=1;refreshListBody();}});
 return d;}
// Connect the EXISTING dashboard tile to this new page, before legacy Evil rendering.
const oldShow=typeof window.show==='function'?window.show:null;
function routedShow(screen){if(screen==='evilcampaign'){open();return;}if(isOpen)hide();return oldShow?.apply(this,arguments);}
function captureEvilTile(e){
 const home=document.getElementById('home');if(!home||home.classList.contains('hidden')||!home.contains(e.target))return;
 let p=e.target;while(p&&p!==home){
  if(p.matches?.('button,[role="button"],a,[onclick],[data-screen],.tile,.dashboard-tile,.dashTile,.homeTile,.card')){
   const dest=(p.getAttribute('onclick')||'')+' '+(p.dataset?.screen||'')+' '+(p.dataset?.target||'');
   const title=(p.innerText||p.textContent||'').trim();
   if(/evilcampaign/i.test(dest)||(/evil\s+tournament/i.test(title)&&title.length<170)){
    e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();open();return;
   }
  }p=p.parentElement;
 }
}
function init(){ensureRoot();document.addEventListener('click',captureEvilTile,true);
 const legacy=document.getElementById('evilcampaign');if(legacy){
  const observe=()=>{if(!legacy.classList.contains('hidden')&&getComputedStyle(legacy).display!=='none'){legacy.classList.add('hidden');if(!isOpen)open();}};
  new MutationObserver(observe).observe(legacy,{attributes:true,attributeFilter:['class','style']});
 }
 if(oldShow)window.show=routedShow;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.otgEvilHQ8321={open,close,version:'8.0.321'};
// Compatibility entrypoint for existing back-navigation; NOT the retired page.
window.rhEvilList8264={open,close,version:'8.0.321'};
})();
