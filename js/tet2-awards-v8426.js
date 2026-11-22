/* OTG! MAIN v8.0.426 — ARTWORK ONLY. Trophies follow verified competition identity.
 * No new tournament, receipt, medal or unlock definitions; original honours bridge is sovereign.
 * Art approved Nov 22. Dave and Steve's original familiar look retained. */
(function(root,factory){'use strict';const api=factory();root.TET2AwardArt426=api;if(typeof module==='object'&&module.exports)module.exports=api;})
(typeof window!=='undefined'?window:globalThis,function(){'use strict';
const BASE='assets/tet2-awards-v8426/';
const NAMES={festival:'Festival', 'race-off':'Race Off','favourite-manufacturer':'Favourite Manufacturer','vintage-classic':'Vintage & Classic',era:'Era','class-type':'Class / Type',drag:'Drag','long-jump':'Long Jump',manufacturers:'Manufacturers',relay:'Relay',gauntlet:'Gauntlet',swiss:'Swiss Cup','lonely-hearts':'Lonely Hearts','custom-upgrade':'Custom Upgrade','second-chance':'Second Chance','champion-of-champions':'Champion of Champions'};
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function artwork(key){return BASE+key+'.webp';}
function variant(row){return row?.origin==='historical'?(row.mode==='Race Off'?'raceoff':'festival'):'tet2';}
function forRow(row){
 if(!row)return null;
 const orig=String(row.origin||''),family=String(row.family||''),name=String(row.name||''),event=String(row.eventId||'');let keys=[];
 if(orig==='aerodromo'||event==='T2-AERODROMO-DOUBLE')keys=['drag','long-jump'];
 else if(orig==='custom-upgrade'||/^T2-CUSTOM-UPGRADE-(D|C|B|A|S1|S2|X)$/.test(event))keys=['custom-upgrade'];
 else if(orig==='relay')keys=['relay'];
 else if(orig==='gauntlet')keys=['gauntlet'];
 else if(orig==='swiss')keys=['swiss'];
 else if(orig==='lonely')keys=['lonely-hearts'];
 else if(orig==='maker-knockout')keys=['manufacturers'];
 else if(orig==='drift')keys=['class-type']; // Approved Drift Cars type, never a new Drift Zone cup.
 else if(orig==='historical'){
  if(/favourit(e|es)|favorite/i.test(name))keys=['favourite-manufacturer'];
  else if(family==='Vintage & Classic')keys=['vintage-classic'];
  else if(family==='Era Championship')keys=['era'];
  else if(family==='Manufacturer')keys=['manufacturers'];
  else if(['Class / Type','Hot Wheels','Forza Edition','Race Cars','Off-Road / Buggy','Rally Adventure'].includes(family))keys=['class-type'];
  else if(family==='Festival'&&row.mode==='Race Off')keys=['race-off'];
  else if(family==='Festival'&&row.mode==='Festival')keys=['festival'];
  else return null; // No unverified tournament mappings.
 }else if(/second.chance/i.test(event)||/second.chance/i.test(name))keys=['second-chance'];
 else if(/champion.of.champions/i.test(event)||/champion.of.champions/i.test(name))keys=['champion-of-champions'];
 else return null;
 return {keys,variant:variant(row),eventId:event,cls:event.replace('T2-CUSTOM-UPGRADE-','')};
}
function receipt(rec,rows){
 if(!rec||!rec.completed||!rec.verified)return null;
 const id=String(rec.eventId||''),base=id.split(':')[0];let row=(rows||[]).find(r=>r.eventId===base)||null;
 let d=forRow(row);
 if(rec.kind==='aerodromo-drag')d={keys:['drag'],variant:'tet2',eventId:id};
 else if(rec.kind==='aerodromo-long-jump')d={keys:['long-jump'],variant:'tet2',eventId:id};
 else if(rec.kind==='upgrade-class-championship')d={keys:['custom-upgrade'],variant:'tet2',eventId:id,cls:id.replace('T2-CUSTOM-UPGRADE-','')};
 else if(!d&&/second.chance/i.test(id))d={keys:['second-chance'],variant:'tet2',eventId:id};
 else if(!d&&/champion.of.champions/i.test(id))d={keys:['champion-of-champions'],variant:'tet2',eventId:id};
 return d;
}
function preview(row){const a=forRow(row);if(!a)return '';const all=a.keys.map(key=>'<img class="t2-award-thumb426" loading="lazy" decoding="async" src="'+artwork(key)+'" alt="'+esc(NAMES[key])+' trophy design">').join('');
 return '<span class="t2-award-list-art426 t2-award-'+esc(a.variant)+'426" aria-label="Trophy artwork preview, not yet awarded">'+all+'</span>';
}
function medalImage(colour,variant){return BASE+'medal-'+colour+'-'+(variant==='festival'?'festival':'raceoff')+'.webp';}
function podium(rec,sp,rows){const a=receipt(rec,rows);if(!a)return '';const names=new Map((sp?.cars||[]).map(c=>[String(c.id),String(c.name||c.id)]));
 const title=a.keys.map(k=>NAMES[k]).join(' & ')+(a.cls&&['D','C','B','A','S1','S2','X'].includes(a.cls)?' · '+a.cls:'');
 const t=a.keys.map(k=>'<img src="'+artwork(k)+'" loading="lazy" alt="'+esc(NAMES[k])+' winner trophy" class="t2-award-winner-trophy426">').join('');
 const m=['gold','silver','bronze'].filter(k=>(rec.medals?.[k]||[]).length).map(k=>'<div class="t2-award-medal426"><img loading="lazy" src="'+medalImage(k,a.variant)+'" alt="'+k+' medal"><span><strong>'+k.toUpperCase()+'</strong><small>'+esc((rec.medals[k]||[]).map(id=>names.get(String(id))||String(id)).join(' · '))+'</small></span></div>').join('');
 return '<section class="t2-award-winner426 t2-award-'+esc(a.variant)+'426"><h3>🏆 '+esc(title)+' · VERIFIED WINNERS</h3><div class="t2-award-trophies426">'+t+'</div><div class="t2-award-medals426">'+m+'</div></section>';
}
function gallery(receipts,sp,rows){const a=(receipts||[]).map(r=>podium(r,sp,rows)).filter(Boolean);return a.length?'<div class="t2-award-gallery426">'+a.join('')+'</div>':'<p>No completed competitions yet. Trophies appear here when the final results are verified.</p>';}
return Object.freeze({artwork,forRow,receipt,preview,podium,gallery,medalImage,NAMES});
});
