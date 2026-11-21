/* TET2 v8.0.401: real ledger views only, no new result stores */
(function(root){'use strict';
 const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const s=v=>String(v??'');
 function read(){const sp=root.rhSpace?.();if(!sp||sp.catalogueKey!=='fh5-catalogue-v1'||!Array.isArray(sp.cars))return null;
  const b=sp.tet2OfficialSlotLedgerV8361, d=root.TET2AssembledList379?.snapshot?.();
  if(!d?.rows)return null;
  const slots=b&&b.spaceId===s(sp.id)&&b.source==='TET2_CONTROLLED_CHAOS_LOCKED_V1'&&b.slots?b.slots:{};
  return {sp,slots,rows:d.rows}; }
 const carName=(sp,id)=>sp.cars.find(c=>s(c.id)===s(id))?.name||id;
 function line(view,r){const record=view.slots['TET2-'+r.position],finished=!!record?.completedAt;
  const status=finished?'🏁 DONE':record?'⏱ IN PROGRESS':'UPCOMING';
  return `<details class="t2-archive-item" data-search="${E((r.position+' '+r.name+' '+r.stage).toLowerCase())}"><summary><strong>#${r.position} · ${E(r.name)}</strong><small> ${E(r.stage)} · ${status}</small></summary>${record?detail(view,record):'<p>Not raced yet.</p>'}${finished?(root.TET2SlotPresentation414?.summaryLink?.('TET2-'+r.position)||''):''}</details>`; }
 function detail(view,slot){const def=slot.definition||{},res=slot.results||{},g=view.sp;
  const track=def.mode==='raceoff'?def.matches?.map(x=>x.track):def.mode==='aero'?[def.track,def.jumpFacility]:def.tracks||[];
  const hits=Object.entries(res).map(([key,value])=>{const match=def.matches?.find(m=>'m:'+m.id===key);
   if(match){return '<li>'+match.carIds.map(id=>E(carName(g,id))).join(' vs ')+' — '+E(value.a)+' / '+E(value.b)+' ms · Winner: '+E(carName(g,value.winnerId))+'</li>';}
   const parts=key.split(':'),id=parts.at(-1);return '<li>'+E(carName(g,id))+' — '+E(key)+' — '+E(value)+' '+(key.startsWith('a:jump:')?'cm':'ms')+'</li>';}).join('');
  return `<p>${slot.completedAt?'Completed · permanent':'Results banked · event in progress'}</p><p>Track(s): ${track.map(E).join(' · ')||'Assigned by event rules'}</p><ol>${hits||'<li>No results recorded.</li>'}</ol>`; }
 function archiveHtml(){try{const v=read();if(!v)return '<p>Open your existing FH5 Garage Space to see tournament results.</p>';
  const done=v.rows.filter(r=>v.slots['TET2-'+r.position]?.completedAt);
  return `<p>${done.length} completed Evil List slots</p><input id="t2-pit-search" type="search" placeholder="Search slot number or event name" aria-label="Search completed slots" style="width:100%;padding:12px;color:#fff;background:#101116;border:1px solid #ea344b;border-radius:8px"><div id="t2-pit-results">${done.length?done.slice().reverse().map(r=>line(v,r)).join(''):'<p>No completed events yet. Finished results will appear here automatically.</p>'}</div>`;
 }catch(e){return '<p>'+E(e.message)+'</p>';}}
 function swissHtml(){try{const v=read();if(!v)return '<p>Open your existing FH5 Garage Space.</p>';
  const cupMap=new Map();for(const r of v.rows.filter(r=>r.origin==='swiss')){if(!cupMap.has(r.eventId))cupMap.set(r.eventId,[]);cupMap.get(r.eventId).push(r);}
  const started=[...cupMap].filter(([,rows])=>rows.some(r=>v.slots['TET2-'+r.position]));
  return `<p>${cupMap.size} scheduled Swiss Cups · ${started.length} started</p>${(started.length?started:[...cupMap].slice(0,2)).map(([id,rows])=>{
    const completed=rows.filter(r=>v.slots['TET2-'+r.position]?.completedAt).length;
    return `<details class="t2-archive-item"><summary><strong>${E(rows[0].name)}</strong> — ${completed}/${rows.length} stages</summary>${rows.map(r=>line(v,r)).join('')}</details>`;}).join('')}`;
 }catch(e){return '<p>'+E(e.message)+'</p>';}}
 function input(e){if(e.target?.id!=='t2-pit-search')return false;const q=e.target.value.trim().toLowerCase();for(const item of document.querySelectorAll('#t2-pit-results .t2-archive-item'))item.hidden=!!q&&!item.dataset.search.includes(q);return true;}
 root.TET2LiveViews401=Object.freeze({archiveHtml,swissHtml,input});
})(typeof window!=='undefined'?window:globalThis);