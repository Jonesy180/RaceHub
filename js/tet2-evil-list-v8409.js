/* OTG! v8.0.409 — Evil List status colours; no changes to saved results, draws or racing. */
(function(root){'use strict';let q='',family='all',page=0;const PAGE=50;
const E=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function get(){const d=root.TET2AssembledList379?.snapshot?.();if(!d?.audit?.ok)throw Error('Current approved Evil List is unavailable');return d;}
function readSlots(){const sp=root.rhSpace?.();const b=sp?.tet2OfficialSlotLedgerV8361;return b&&b.spaceId===String(sp.id)&&b.source==='TET2_CONTROLLED_CHAOS_LOCKED_V1'&&b.slots&&typeof b.slots==='object'?b.slots:{};}
function rows(d){
 const slots=readSlots();
 // 'Current' is the first UNFINISHED scheduled visit. It need not have a saved
 // slot yet (the user can open Race Control before recording any result).
 const current=d.rows.find(r=>!slots['TET2-'+r.position]?.completedAt)?.position??null;
 const a=d.rows.filter(r=>(family==='all'||r.family===family)&&(!q||[r.position,r.name,r.stage,r.family,r.eventId].join(' ').toLowerCase().includes(q)));
 page=Math.max(0,Math.min(page,Math.ceil(a.length/PAGE)-1));
 const html=a.slice(page*PAGE,(page+1)*PAGE).map(r=>{
  const done=!!slots['TET2-'+r.position]?.completedAt;
  const status=done?'done':r.position===current?'current':'upcoming';
  const label=done?'✓ DONE':status==='current'?'▶ CURRENT':'UPCOMING';
  return `<li class="t2-list-item409 t2-list-${status}" data-status="${status}"><div class="t2-list-top409"><strong class="t2-list-id409">SLOT ${String(r.position).padStart(4,'0')}</strong><span class="t2-list-chip409">${label}</span></div><strong class="t2-list-name409">${E(r.name)}</strong><small class="t2-list-stage409">${E(r.family)} · ${E(r.stage)}</small></li>`;
 }).join('');
 return {html:html||'<li class="t2-list-empty409">No matching events.</li>',count:a.length,page,total:Math.max(1,Math.ceil(a.length/PAGE))};
}
function html(){try{const d=get(),r=rows(d),families=[...new Set(d.rows.map(x=>x.family))].sort();
return `<div class="t2-s371-summary t2-list-summary409"><span><strong>${d.rows.length.toLocaleString('en-GB')}</strong><small>Scheduled visits</small></span><span><strong>${d.audit.openingCount}</strong><small>Different opening formats</small></span></div><div class="t2-list-legend409" aria-label="Evil List colour key"><span class="t2-legend-done409">● DONE</span><span class="t2-legend-current409">● CURRENT</span><span class="t2-legend-upcoming409">● UPCOMING</span></div><div class="t2-s371-controls"><label>Find an event<input id="t2-list-search" type="search" placeholder="Slot number or event name" value="${E(q)}"></label><label>Category<select id="t2-list-family"><option value="all">All</option>${families.map(f=>`<option value="${E(f)}" ${f===family?'selected':''}>${E(f)}</option>`).join('')}</select></label></div><p id="t2-list-count" class="t2-list-count409">${r.count} events found</p><ol id="t2-list-rows" class="t2-s371-rows t2-list-rows409">${r.html}</ol><div id="t2-list-pager" class="t2-s371-pager"><button data-t2-list="prev" ${!r.page?'disabled':''}>Previous</button> Page ${r.page+1}/${r.total} <button data-t2-list="next" ${r.page+1>=r.total?'disabled':''}>Next</button></div>`;
}catch(e){return '<p>'+E(e.message)+'</p>';}}
function refresh(){try{const r=rows(get()),n=document.getElementById('t2-list-rows'),c=document.getElementById('t2-list-count'),p=document.getElementById('t2-list-pager');if(n)n.innerHTML=r.html;if(c)c.textContent=r.count+' events found';if(p)p.innerHTML=`<button data-t2-list="prev" ${!r.page?'disabled':''}>Previous</button> Page ${r.page+1}/${r.total} <button data-t2-list="next" ${r.page+1>=r.total?'disabled':''}>Next</button>`;}catch(_) {}}
function input(e){if(e.target.id==='t2-list-search'){q=e.target.value.toLowerCase().slice(0,120);page=0;refresh();return true;}return false;}
function change(e){if(e.target.id==='t2-list-family'){family=e.target.value;page=0;refresh();return true;}return false;}
function action(e){const el=e.target.closest?.('[data-t2-list]');if(!el)return false;page+=el.dataset.t2List==='next'?1:-1;refresh();return true;}
root.TET2EvilList401=Object.freeze({html,input,change,action});
})(typeof window!=='undefined'?window:globalThis);
