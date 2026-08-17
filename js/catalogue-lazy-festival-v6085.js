/* OTG! v6.0.85 — lazy Festival eligibility for catalogue spaces.
   Catalogue ticks update only ownership/Garage data. Festival availability is
   derived from the current Garage when Festival is opened. */
(()=>{
'use strict';

function def(kind){
  if(kind==='fh5') return {
    list:FH5_CATALOGUE, ensure:()=>fh5EnsureSpace(true,true), id:fh5CarId,
    key:'fh5-catalogue-v1', total:FH5_CATALOGUE.length
  };
  return {
    list:GT7_CATALOGUE, ensure:()=>gt7EnsureSpace(true), id:gt7CarId,
    key:'gt7-catalogue-v1', total:GT7_CATALOGUE.length
  };
}
function rowFor(d,cid){ return d.list.find(c=>d.id(c)===cid)||null; }
function makeEditableCar(d,row,cid){
  const car=normaliseCar({
    id:cid,
    catalogueId:cid,
    catalogueKey:d.key,
    make:row.make||'',
    model:row.model||'',
    year:String(row.year||''),
    classType:row.classType||'',
    name:row.full||[row.make,row.model,row.year].filter(Boolean).join(' ')
  });
  car.catalogueId=cid;
  car.catalogueKey=d.key;
  return car;
}
function patchVisible(row,cid,adding,s,d){
  const host=$('garage');
  if(!host)return;
  const el=[...host.querySelectorAll('.rhCatalogueGarageCar')].find(x=>x.dataset.catalogueId===cid);
  if(el){
    el.classList.toggle('owned',adding);
    el.classList.toggle('unowned',!adding);
    const box=el.querySelector('input[type="checkbox"]');
    if(box)box.checked=adding;
  }
  const totalEl=host.querySelector('#rhCatalogueOwnedTotal');
  if(totalEl){
    const n=Object.keys(s.catalogueOwned||{}).length;
    totalEl.innerHTML=`${n}<small>/ ${d.total} OWNED</small>`;
  }
  const makeCount=[...host.querySelectorAll('.rhCatalogueMakeCount')].find(x=>x.dataset.make===row.make);
  if(makeCount){
    const total=d.list.filter(c=>c.make===row.make).length;
    const owned=d.list.filter(c=>c.make===row.make && Object.prototype.hasOwnProperty.call(s.catalogueOwned||{},d.id(c))).length;
    makeCount.textContent=`${owned}/${total}`;
  }
}
function toggle(kind,cid){
  const d=def(kind),s=d.ensure();
  if(!s)return;
  const row=rowFor(d,cid);
  if(!row)return;
  cid=d.id(row);
  if(!s.catalogueOwned||typeof s.catalogueOwned!=='object')s.catalogueOwned={};
  const ref=s.catalogueOwned[cid];
  const adding=!ref;

  if(adding){
    let car=(s.cars||[]).find(c=>c.catalogueId===cid);
    if(!car){
      car=makeEditableCar(d,row,cid);
      (s.cars||(s.cars=[])).push(car);
    }
    car.catalogueId=cid;
    car.catalogueKey=d.key;
    s.catalogueOwned[cid]=car.id;
  }else{
    delete s.catalogueOwned[cid];
    s.cars=(s.cars||[]).filter(c=>c.catalogueId!==cid && String(c.id)!==String(ref));
  }

  // Deliberately no Festival discovery/availability scan here.
  // Nothing Championship-shaped is created or updated by a catalogue tick.
  try{fh5OwnedSet=null}catch(_){}
  rhSync();
  rhSave();

  // Update only the visible row and counts; do not rebuild the entire catalogue.
  patchVisible(row,cid,adding,s,d);
}
window.fh5Toggle=cid=>toggle('fh5',cid);
window.gt7Toggle=cid=>toggle('gt7',cid);
})();