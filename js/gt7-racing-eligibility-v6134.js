// OTG! v6.0.134 — include GT7 manual/special Garage cars in all racing eligibility.
(()=>{
  'use strict';
  const GT7_KEY='gt7-catalogue-v1';
  const currentGt7=()=>{try{const s=rhSpace();return s&&s.catalogueKey===GT7_KEY?s:null}catch(_){return null}};
  const allCars=()=>{
    const s=currentGt7();
    if(!s)return (rhSpace()?.cars||[]);
    try{window.gt7IntegrateManualCars?.()}catch(_){}
    // Use the actual GT7 Space Garage as the single source of truth. Manual/special
    // cars live here alongside catalogue-owned cars but remain outside catalogueOwned.
    const seen=new Set(), out=[];
    (s.cars||[]).forEach(c=>{if(!c)return;const id=String(c.id||'');if(id&&seen.has(id))return;if(id)seen.add(id);out.push(c)});
    return out;
  };
  const eligible=(type,value)=>{
    const cars=allCars();
    if(type==='festival')return cars;
    if(type==='make'||type==='favourite')return cars.filter(c=>String(c.make||'')===String(value||''));
    if(type==='era')return cars.filter(c=>Math.floor(Number(c.year)/10)*10===Number(value));
    if(type==='classType'){const key=String(value||'').trim().toLocaleLowerCase();return key?cars.filter(c=>String(c.classType||'').trim().toLocaleLowerCase()===key):[]}
    if(type==='vintage')return cars.filter(c=>{const y=Number(c.year);return Number.isFinite(y)&&y>0&&y<=1949});
    if(type==='classic')return cars.filter(c=>{const y=Number(c.year);return Number.isFinite(y)&&y>=1950&&y<=1990});
    return cars;
  };
  window.gt7RacingCars=allCars;
  window.rhEligible=eligible;
  try{rhEligible=eligible}catch(_){}

  // Festival "new cars" on an existing run must also see manual/special Garage cars.
  if(typeof window.rhFestivalNewCars==='function'){
    const old=window.rhFestivalNewCars;
    window.rhFestivalNewCars=function(r){
      if(currentGt7()&&r&&(r.type==='festival'||r.championshipType==='festival')){
        const existing=new Set(Array.isArray(r.entries)?r.entries:[]);
        return allCars().filter(c=>!existing.has(c.id));
      }
      return old.apply(this,arguments);
    };
    try{rhFestivalNewCars=window.rhFestivalNewCars}catch(_){}
  }
})();
