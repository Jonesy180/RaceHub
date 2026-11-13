/* OTG! v8.0.185 — Manufacturer/Mixed Relay LINEUP PLANNER. Read-only, no storage. */
(()=>{'use strict';
const E=window.rhEvil2Rules181;if(!E)return;
const $=s=>document.querySelector(s);
const esc=x=>String(x??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
let mode='maker',seed=185,size=4,view=null,spaceId=null;
const orders=[4,8,12,16];
function read(){const s=window.rhSpace?.();return {s,cars:E.carsOf(s)};}
function state(){const {s,cars}=read();return {s,cars,valid:s?.catalogueKey==='fh5-catalogue-v1'};}
function plan(){const {s,cars,valid}=state();const available=new Set(cars.map(c=>c.id));
 const all=valid?(mode==='maker'?E.drawMakerRelay(cars,seed):E.drawMixedRelay(cars,seed).teams):[];
 const teams=all.slice(0,size);const used=teams.flatMap(t=>t.cars.map(c=>c.id));
 const unique=used.length===new Set(used).size;
 const good=teams.every(t=>t.cars.length===3&&t.cars.every(c=>available.has(c.id))&&
  (mode==='maker'?new Set(t.cars.map(c=>c.make)).size===1:new Set(t.cars.map(c=>c.make)).size===3));
 return {s,cars,valid,all,teams,used,ok:unique&&good,complete:teams.length===size};}
function html(){const p=plan();const actual=p.cars.length;const counts=new Map();for(const c of p.cars)counts.set(c.make,(counts.get(c.make)||0)+1);
 const qualified=[...counts.entries()].filter(([,n])=>n>=3).length;
 const a=`<div class="e2p-summary"><b>${actual}</b><span>FH5 cars read from current Space</span></div><div class="e2p-summary"><b>${qualified}</b><span>Makes with 3+ cars</span></div><div class="e2p-summary"><b>${p.all.length}</b><span>Possible ${mode==='maker'?'manufacturer':'mixed'} teams</span></div>`;
 let h=`<div class="e2p-head"><button type="button" id="e2p-back">← BACK TO EVIL TOURNAMENT</button><small>8.0.185 · READ-ONLY RELAY PLANNER</small><h2>EVIL 2.0 — RELAY GARAGE</h2><p>Prepare three-car teams before any official draw.</p></div><div class="e2p-alert"><strong>PLANNING ONLY — NO SAVE OR TOURNAMENT START</strong><br>Nothing here modifies slots, career honours, Garage ownership, old Evil progress, or private data. Closing this page discards the preview.</div>`;
 if(!p.valid){return h+'<div class="e2p-alert">Open the FH5 Catalogue Space to inspect its owned Garage cars.</div><button id="e2p-back-bottom">← BACK</button>'}
 h+=`<div class="e2p-stats">${a}</div><div class="e2p-tabs"><button type="button" data-mode="maker" class="${mode==='maker'?'on':''}">Manufacturer Relay</button><button type="button" data-mode="mixed" class="${mode==='mixed'?'on':''}">Mixed Relay</button></div>`;
 h+=`<div class="e2p-controls"><label>Preview teams <select id="e2p-size">${orders.map(n=>`<option value="${n}" ${size===n?'selected':''}>${n}</option>`).join('')}</select></label><label>Repeatable test seed <input id="e2p-seed" type="number" min="1" max="4294967295" step="1" inputmode="numeric" value="${seed}"></label><button type="button" id="e2p-redraw">REDRAW PREVIEW</button></div>`;
 h+=`<div class="e2p-audit ${p.ok&&p.complete?'pass':'warn'}"><strong>${p.ok&&p.complete?'✓ READY FOR MANUAL QA':'⚠ PREVIEW ONLY — INCOMPLETE'}</strong><br>${p.teams.length} of ${size} requested teams · ${p.used.length} cars selected · ${new Set(p.used).size} unique IDs. ${p.ok?'Each team has three distinct owned cars and valid manufacturer composition.':'Selection did not pass the eligibility check.'}</div>`;
 if(!p.complete)h+='<p class="e2p-alert">Not enough eligible teams for the requested count. No extra teams or cars have been invented.</p>';
 if(mode==='maker')h+='<p>Manufacturer Relay: all three cars in a team share one manufacturer. Each car runs exactly one of the three stages.</p>';
 else h+='<p>Mixed Relay: each team contains three different manufacturers. No car appears in two teams in this draw.</p>';
 h+='<div class="e2p-teams">';
 for(let i=0;i<p.teams.length;i++){const t=p.teams[i];h+=`<section class="e2p-team"><h3>TEAM ${String(i+1).padStart(2,'0')} <small>${esc(mode==='maker'?t.make:'Mixed manufacturers')}</small></h3>${t.cars.map((c,j)=>`<div class="e2p-stage"><b>STAGE ${j+1}</b><span>${esc(c.name)}<small>${esc(c.make)}</small></span></div>`).join('')}<p>Track selection: <b>UNASSIGNED</b> — verified route profiles required.</p></section>`;}
 h+='</div><p class="e2p-foot">Preview uses a deterministic seed; re-enter the same seed to reproduce the same draw on the same Garage inventory. These are candidate lineups, not frozen entrants. No score, medal or result is awarded.</p><button id="e2p-back-bottom" type="button">← BACK TO EVIL TOURNAMENT</button>';
 return h;}
function render(){if(!view||view.style.display==='none')return;view.querySelector('.e2p-screen').innerHTML=html();
 view.querySelectorAll('#e2p-back,#e2p-back-bottom').forEach(b=>b.onclick=hide);
 view.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;render()});
 const s=$('#e2p-size');if(s)s.onchange=()=>{size=Number(s.value);render()};
 const draw=$('#e2p-redraw');if(draw)draw.onclick=()=>{const v=Number($('#e2p-seed')?.value);if(!Number.isSafeInteger(v)||v<1||v>4294967295){alert('Enter a whole-number test seed between 1 and 4294967295.');return;}seed=v;render()};}
function hide(){if(view)view.style.display='none'}
function show(){view=$('#e2p-185');if(!view){view=document.createElement('section');view.id='e2p-185';view.innerHTML='<div class="e2p-screen"></div>';document.body.appendChild(view);}view.style.display='block';render()}
function install(){const home=$('#evilcampaign');if(!home||!home.querySelector('.rhEvilR18097')||$('#e2p-launch'))return;const ref=$('#e2trial-launch182');if(!ref)return;const b=document.createElement('button');b.id='e2p-launch';b.type='button';b.textContent='🔧 EVIL 2.0 — RELAY GARAGE (QA)';b.onclick=show;ref.insertAdjacentElement('afterend',b)}
function start(){install();const home=$('#evilcampaign');if(!home)return;let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;install()})}).observe(home,{childList:true,subtree:true})}
window.rhEvil2RelayPlanner185={show,hide,plan};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
