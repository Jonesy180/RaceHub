/* TET2 v8.0.352 — Formula Drift Zone Score, official entry using the existing FH5 Garage and rhSave.
 * Exactly 15 owned Formula Drift cars; one score per car; Los Campos only.
 * Displayed in three five-car sessions, ranked together. No old Drift Knockout.
 * Medal/history publication is deferred to the agreed universal result pathway.
 */
(()=>{'use strict';
const ROOT='tet2-drift-v8352',SCREEN='tet2-drift-screen-v8352',KEY='tet2FormulaDriftScoreV352';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let error='',opened=false;
function current(){const sp=window.rhSpace?.();if(!sp||sp.catalogueKey!=='fh5-catalogue-v1'||!String(sp.id||'').trim()||!Array.isArray(sp.cars))throw Error('Open the FH5 Garage Space first.');return sp;}
function field(sp){const a=sp.cars.filter(c=>String(c.make||'').trim().toLowerCase()==='formula drift').map(c=>({id:String(c.id),name:String(c.name||[c.make,c.model,c.year].filter(Boolean).join(' '))}));
 if(a.length!==15||a.some(c=>!c.id)||new Set(a.map(c=>c.id)).size!==15)throw Error('Expected exactly 15 unique owned Formula Drift cars. Found '+a.length+'. No results changed.');
 return a.sort((a,b)=>a.name.localeCompare(b.name)||a.id.localeCompare(b.id));}
function validate(d,sp){if(!d)return null;if(d.schema!==1||d.kind!=='FORMULA_DRIFT_ZONE_SCORE'||d.spaceId!==String(sp.id)||d.zone!=='Los Campos'||!Array.isArray(d.field)||d.field.length!==15||!Array.isArray(d.scores)||d.scores.length!==15)throw Error('Stored Drift Score event has invalid structure. No changes made.');
 const ids=new Set();for(let i=0;i<15;i++){const x=d.field[i],v=d.scores[i];if(typeof x?.id!=='string'||!x.id||typeof x.name!=='string'||ids.has(x.id)||!(v===null||(Number.isSafeInteger(v)&&v>=0&&v<=9999999999)))throw Error('Stored Drift Score data failed validation.');ids.add(x.id);}return d;}
function state(){const sp=current();return {sp,d:validate(sp[KEY],sp)};}
function begin(){const {sp,d}=state();if(d)throw Error('Drift Score already started. Continue the existing event.');const order=field(sp);const x={schema:1,kind:'FORMULA_DRIFT_ZONE_SCORE',spaceId:String(sp.id),zone:'Los Campos',createdAt:new Date().toISOString(),field:order,scores:Array(15).fill(null)};
 sp[KEY]=x; if(typeof window.rhSave!=='function'){delete sp[KEY];throw Error('Main save engine unavailable. Nothing saved.');}window.rhSave();return x;}
function next(d){return d.scores.findIndex(x=>x===null)}
function rank(d){return d.field.map((c,i)=>({...c,score:d.scores[i]})).sort((a,b)=>a.score===null&&b.score===null?a.name.localeCompare(b.name):a.score===null?1:b.score===null?-1:b.score-a.score||a.name.localeCompare(b.name));}
function saveScore(raw){const {sp,d}=state();if(!d)throw Error('Start the competition first.');const i=next(d);if(i<0)throw Error('All 15 scores are already recorded.');const s=String(raw??'').trim();if(!/^\d{1,10}$/.test(s))throw Error('Enter a whole, non-negative Drift Zone score.');const n=Number(s);if(!Number.isSafeInteger(n)||n>9999999999)throw Error('Score is out of range.');
 if(!window.confirm('Save the ONE Los Campos attempt for '+d.field[i].name+' — '+n.toLocaleString()+' points?'))return false;
 d.scores[i]=n;try{window.rhSave();}catch(e){d.scores[i]=null;throw Error('Save failed: '+String(e.message||e));}return true;}
function host(){let h=document.getElementById(SCREEN);if(h)return h;h=document.createElement('section');h.id=SCREEN;h.className='tet2-drift-screen';h.hidden=true;document.body.append(h);h.addEventListener('click',e=>{const b=e.target.closest('[data-tet2-drift]');if(!b)return;try{if(b.dataset.tet2Drift==='back'){close();return;}if(b.dataset.tet2Drift==='begin')begin();if(b.dataset.tet2Drift==='save')saveScore(h.querySelector('#tet2-drift-score-input')?.value);error='';render();}catch(ex){error=String(ex.message||ex);render();}});return h;}
function open(){opened=true;host().hidden=false;document.getElementById('festival')?.classList.add('hidden');render();window.scrollTo?.(0,0);}
function close(){opened=false;host().hidden=true;window.show?.('festival');}
function render(){if(!opened)return;const h=host();let body='<button type="button" data-tet2-drift="back">← BACK TO FESTIVAL</button><h1>FORMULA DRIFT ZONE SCORE</h1><p>Los Campos · 15 Formula Drift cars · three sessions of five · ONE attempt per car.</p>';
 try{const {sp,d}=state();if(!d){const c=field(sp);body+='<p>Garage field ready: '+c.length+' owned Formula Drift cars.</p><button type="button" data-tet2-drift="begin">START COMPETITION</button>';}
 else{const i=next(d);if(i>=0){const car=d.field[i];body+='<h2>SESSION '+(Math.floor(i/5)+1)+' OF 3 · CAR '+(i+1)+' OF 15</h2><p><strong>'+esc(car.name)+'</strong></p><label for="tet2-drift-score-input">Los Campos score</label><input id="tet2-drift-score-input" type="number" min="0" step="1" inputmode="numeric"><button type="button" data-tet2-drift="save">SAVE ONE ATTEMPT</button>';}
 else body+='<h2>ALL 15 SCORES RECORDED ✓</h2><p>Global leaderboard complete. Tournament medals will use the shared TET2 results system.</p>';
 body+='<h2>GLOBAL STANDINGS</h2><ol>'+rank(d).filter(c=>c.score!==null).map(c=>'<li>'+esc(c.name)+' — '+Number(c.score).toLocaleString()+'</li>').join('')+'</ol>';
 if(i>=0)body+='<p>Recorded: '+i+'/15. Complete standings combine all three sessions.</p>';}}
 catch(ex){body+='<p class="tet2-drift-error">'+esc(ex.message||ex)+'</p>';}
 if(error)body+='<p class="tet2-drift-error">'+esc(error)+'</p>';
 h.innerHTML='<div class="tet2-drift-inner">'+body+'</div>';}
function mount(){const f=document.getElementById('festival');if(!f||f.classList.contains('hidden')||!f.children.length)return;let b=f.querySelector('#'+ROOT);if(b)return;
 b=document.createElement('section');b.id=ROOT;b.className='tet2-specialist-entry';b.innerHTML='<button type="button">🏁 FORMULA DRIFT ZONE SCORE <span>Los Campos · 15 cars · 3 sessions of 5</span></button>';b.querySelector('button').addEventListener('click',open);f.append(b);}
function init(){const f=document.getElementById('festival');if(!f)return;let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;setTimeout(()=>{queued=false;mount();},180);}).observe(f,{childList:true});mount();}
window.TET2FormulaDriftScore352={open,rank,version:'8.0.352'};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();