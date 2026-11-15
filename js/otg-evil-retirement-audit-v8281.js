/* OTG! v8.0.281: OLD EVIL retirement scope auditor.
 READ ONLY. No mutations to live state, persistent save, or IndexedDB.
 Normal racing results, other Spaces, Garage and private features are excluded from deletion plan. */
(()=>{'use strict';
 const KEY='RaceHub_Studio_Final_v5_6';
 const OLD=['evilCampaign8076','evilCampaignR18098','fh5TrackBags8070'];
 const enc=s=>new TextEncoder().encode(s).length;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const read=()=>{const raw=localStorage.getItem(KEY);if(!raw)throw Error('Original OTG! saved state not found. No changes.');const s=JSON.parse(raw);if(!Array.isArray(s.spaces)||!s.spaces.length)throw Error('No OTG! Spaces. No changes.');return {raw,s};};
 function inspect(){
   if(localStorage.getItem('otg.idb.primary.pilot8279')==='yes')throw Error('Exit isolated IDB pilot before auditing the production save.');
   const {raw,s}=read(),copy=JSON.parse(raw),before=enc(raw), rows=[];
   // This dry-run is intentionally limited to known old EVIL-only keys, NOT runs,
   // raceOffs, customEvents, normal results, private incident archives or honours.
   for(let i=0;i<copy.spaces.length;i++){
     const original=s.spaces[i],candidate=copy.spaces[i];
     const isFH5=/forza\s*(horizon)?\s*5|\bfh5\b/i.test([original.name,original.catalogueKey,original.catalogueTitle].join(' '));
     const fields=[];
     if(isFH5)for(const k of OLD)if(Object.prototype.hasOwnProperty.call(candidate,k)){
       fields.push({key:k,bytes:enc(JSON.stringify(candidate[k]))});delete candidate[k];
     }
     rows.push({name:original.name||'Unnamed',id:original.id||'',isFH5,fields,cars:Array.isArray(original.cars)?original.cars.length:0});
   }
   // Exact preservation: compare all other properties including normal racing,
   // Garage, private features, ownership, settings and unrelated Spaces.
   const restored=JSON.parse(JSON.stringify(copy));
   for(let i=0;i<restored.spaces.length;i++)for(const k of OLD)
     if(Object.prototype.hasOwnProperty.call(s.spaces[i],k)&&!Object.prototype.hasOwnProperty.call(restored.spaces[i],k))restored.spaces[i][k]=s.spaces[i][k];
   if(JSON.stringify(restored)!==JSON.stringify(s))throw Error('Preservation invariant failed: dry-run halted.');
   if(localStorage.getItem(KEY)!==raw)throw Error('Saved state changed during audit. Rerun when idle.');
   const after=enc(JSON.stringify(copy));
   return {rows,before,after,saved:before-after,matched:rows.filter(x=>x.isFH5).length,
      note:'Old Evil-linked competitions or honours inside shared runs/results have NOT been classified. No live reset is authorised.'};
 }
 function show(host){if(!host)return;try{const r=inspect();
   host.innerHTML='<div style="padding:12px;border:1px solid #39727a;border-radius:12px;margin-top:12px"><b>✓ OLD EVIL CLEAN-SLATE AUDIT — READ ONLY</b><p>Original main save: '+(r.before/1048576).toFixed(2)+' MiB · projected simple-key cleanup: '+(r.saved/1024).toFixed(1)+' KiB</p>'+r.rows.map(x=>'<div style="padding:7px 0;border-top:1px solid #26424a">'+esc(x.name)+' · '+x.cars+' Garage cars · '+(x.isFH5?x.fields.length+' old Evil-specific keys identified':'not targeted')+'</div>').join('')+'<p style="color:#e6bf83">'+esc(r.note)+'</p><small>NOTHING was deleted, saved, reset or migrated. Original Evil history remains until controlled launch.</small></div>';
 }catch(e){host.textContent='SAFE STOP — '+String(e.message||e);}}
 window.otgEvilRetireAudit8281=show;
})();