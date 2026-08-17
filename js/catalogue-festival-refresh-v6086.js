/* OTG! v6.0.86 — catalogue Festival on-demand refresh.
   The catalogue remains lazy during ownership changes. When Festival is opened,
   exact immutable owned IDs are reconciled into the editable Garage copies once,
   then the existing Festival renderer derives all manufacturer/era/class counts
   from that current Garage. No Championship/run is created by this refresh. */
(()=>{
'use strict';

function catalogueDefForSpace(s){
  if(!s)return null;
  if(s.catalogueKey==='fh5-catalogue-v1' && typeof FH5_CATALOGUE!=='undefined'){
    return {list:FH5_CATALOGUE,id:fh5CarId,key:'fh5-catalogue-v1'};
  }
  if(s.catalogueKey==='gt7-catalogue-v1' && typeof GT7_CATALOGUE!=='undefined'){
    return {list:GT7_CATALOGUE,id:gt7CarId,key:'gt7-catalogue-v1'};
  }
  return null;
}
function masterFields(row){
  return {
    make:row.make||'',
    model:row.model||'',
    year:String(row.year||''),
    classType:row.classType||'',
    name:row.full||[row.make,row.model,row.year].filter(Boolean).join(' ')
  };
}
function refreshCatalogueGarageForFestival(){
  const s=rhSpace(),d=catalogueDefForSpace(s);
  if(!s||!d)return;
  const owned=s.catalogueOwned&&typeof s.catalogueOwned==='object'?s.catalogueOwned:{};
  const rows=new Map(d.list.map(row=>[d.id(row),row]));
  const existingByCid=new Map();

  (s.cars||[]).forEach(car=>{
    const cid=String(car.catalogueId||'');
    if(cid && rows.has(cid) && !existingByCid.has(cid))existingByCid.set(cid,car);
  });

  const nonCatalogue=(s.cars||[]).filter(car=>{
    const cid=String(car.catalogueId||'');
    return !cid || !rows.has(cid);
  });

  const catalogueCars=[];
  Object.keys(owned).forEach(cid=>{
    const row=rows.get(cid);
    if(!row)return;
    let car=existingByCid.get(cid);
    if(!car){
      car=normaliseCar({id:cid,catalogueId:cid,catalogueKey:d.key,...masterFields(row)});
    }else{
      // Preserve user-edited Garage fields. Fill only genuinely missing master fields.
      if(!String(car.make||'').trim())car.make=row.make||'';
      if(!String(car.model||'').trim())car.model=row.model||'';
      if(!String(car.year||'').trim())car.year=String(row.year||'');
      if(!String(car.classType||'').trim())car.classType=row.classType||'';
    }
    car.catalogueId=cid;
    car.catalogueKey=d.key;
    catalogueCars.push(car);
  });

  s.cars=[...nonCatalogue,...catalogueCars];
  state.cars=s.cars;
  // No save required merely to calculate Festival; the ownership toggle already saved.
}
window.rhRefreshCatalogueGarageForFestival=refreshCatalogueGarageForFestival;

const originalFestival=window.rhRenderFestival;
if(typeof originalFestival==='function'){
  window.rhRenderFestival=function(){
    refreshCatalogueGarageForFestival();
    return originalFestival.apply(this,arguments);
  };
  try{rhRenderFestival=window.rhRenderFestival}catch(_){}
}
})();