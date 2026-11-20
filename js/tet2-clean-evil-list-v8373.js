/* OTG! MAIN v8.0.373 — clean public-facing Evil List preview.
 * Read-only view over the audited 371 candidate: zero writes to user data or racing records.
 * Source-engine audit and rules remain in modules; no developer controls on Evil List.
 */
(function(root,factory){'use strict';const api=factory(root);root.TET2CleanList373=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof window!=='undefined'?window:globalThis,function(root){
'use strict';
const PAGE_SIZE=50;
const e=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nf=n=>Number(n).toLocaleString('en-GB');
let query='',family='all',page=0;
function get(){const a=root.TET2AssembledList373?.snapshot?.();if(!a||!a.audit?.ok||!Array.isArray(a.rows))throw Error('Schedule verification unavailable; no slots have been activated.');return a;}
function view(d){
 const q=query.trim().toLocaleLowerCase('en-GB');
 const numbers=/^(?:(?:slot|plan|preview|#)\s*)?(\d{1,6})$/i.exec(q);
 const exactNum=numbers?Number(numbers[1]):null;
 const filtered=d.rows.filter(r=>{
   if(family!=='all'&&r.family!==family)return false;
   if(!q)return true;
   if(exactNum!==null && r.position===exactNum)return true;
   return [r.name,r.family,r.mode,r.stage,r.eventId, String(r.position).padStart(4,'0')].join(' ').toLocaleLowerCase('en-GB').includes(q);
 });
 const totalPages=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE));page=Math.max(0,Math.min(page,totalPages-1));
 const pageRows=filtered.slice(page*PAGE_SIZE,(page+1)*PAGE_SIZE);
 const rows=pageRows.map(r=>`<li class="t2-s372-row">
   <span class="t2-s372-num" aria-label="Preview position ${r.position}">${String(r.position).padStart(4,'0')}</span>
   <span class="t2-s372-main"><b>${e(r.name)}</b><small>${e(r.origin==='historical' && r.format!=='BRONZE' && !r.stage.startsWith('Final ·') && !r.stage.startsWith('Semifinals ·')?('Visit '+r.visit+' of '+r.visitTotal):(r.stage||r.mode))} · ${e(r.family)}</small></span>
   <span class="t2-s372-state">${r.opening?'<b class="t2-s372-opening">OPENING</b>':''}<em>UPCOMING</em></span>
 </li>`).join('')||'<li class="t2-s372-none">No matching events found.</li>';
 const start=filtered.length?page*PAGE_SIZE+1:0, end=Math.min(filtered.length,(page+1)*PAGE_SIZE);
 const pager=`<button type="button" data-t2-s372="prev" ${page===0?'disabled':''} aria-label="Previous 50 events">◀ PREV</button><span>Page ${page+1} / ${totalPages}</span><button type="button" data-t2-s372="next" ${page===totalPages-1?'disabled':''} aria-label="Next 50 events">NEXT ▶</button>`;
 return {rows,pager,status:`${nf(filtered.length)} events · showing ${nf(start)}–${nf(end)}`,totalPages};
}
function html(){try{
 const d=get(),v=view(d),families=[...new Set(d.rows.map(r=>r.family))].sort();
 return `<div class="t2-s372">
   <div class="t2-s372-preview" role="status"><strong>EVIL LIST PREVIEW</strong> — schedule not yet activated. These positions are provisional; no races or results can be started here.</div>
   <div class="t2-s372-metrics" aria-label="Tournament overview">
     <div><strong>${nf(d.rows.length)}</strong><span>Planned visits</span></div>
     <div><strong>0</strong><span>Completed</span></div>
     <div><strong>—</strong><span>Current slot</span></div>
     <div><strong>${nf(d.rows.length)}</strong><span>Remaining in preview</span></div>
   </div>
   <div class="t2-s372-controls">
     <label>Find event or preview number<input id="t2-s372-search" type="search" placeholder="BMW, Swiss, 0042…" value="${e(query)}" autocomplete="off"></label>
     <label>Competition type<select id="t2-s372-family"><option value="all">All competition types</option>${families.map(f=>`<option value="${e(f)}" ${family===f?'selected':''}>${e(f)}</option>`).join('')}</select></label>
   </div>
   <div class="t2-s372-topline"><strong>TOURNAMENT SCHEDULE</strong><span id="t2-s372-count">${v.status}</span></div>
   <nav class="t2-s372-pager" id="t2-s372-pager-top" aria-label="Schedule pages">${v.pager}</nav>
   <ol class="t2-s372-list" id="t2-s372-rows">${v.rows}</ol>
   <nav class="t2-s372-pager" id="t2-s372-pager-bottom" aria-label="Schedule pages">${v.pager}</nav>
   <p class="t2-s372-foot">The opening order is randomised but covers every independently runnable format once. Future rounds stay spaced through Controlled Chaos; Second Chance and Champion of Champions are not assigned fake slots. Race Control will activate only after the final schedule and competition rules are verified.</p>
 </div>`;
 }catch(err){return `<div class="t2-s372-safe" role="alert">EVIL LIST SAFE STOP: ${e(err.message)}</div>`;}}
function refresh(){try{const v=view(get());const row=document.getElementById('t2-s372-rows');if(!row)return;row.innerHTML=v.rows;
 for(const id of ['t2-s372-pager-top','t2-s372-pager-bottom']){const x=document.getElementById(id);if(x)x.innerHTML=v.pager;}
 const count=document.getElementById('t2-s372-count');if(count)count.textContent=v.status;
 }catch(err){const count=document.getElementById('t2-s372-count');if(count)count.textContent='Schedule unavailable: '+err.message;}}
function action(ev){const b=ev.target?.closest?.('[data-t2-s372]');if(!b)return false;const name=b.dataset.t2S372;if(name==='next')page++;if(name==='prev')page--;refresh();return true;}
function input(ev){if(ev.target?.id!=='t2-s372-search')return false;query=String(ev.target.value||'').slice(0,120);page=0;refresh();return true;}
function change(ev){if(ev.target?.id!=='t2-s372-family')return false;family=String(ev.target.value||'all');page=0;refresh();return true;}
function reset(){query='';family='all';page=0;}
return Object.freeze({html,view,action,input,change,reset});
});
