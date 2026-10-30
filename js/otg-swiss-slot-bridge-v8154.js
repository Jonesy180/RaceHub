/* OTG! MAIN v8.0.154 — Evil R1 Swiss duplicate-run recovery.
 * Earlier Swiss creation inserted the same run twice. On persistence and reload
 * these are no longer the same object: native racing reads the FIRST copy,
 * while Evil R1 progress reads the LAST copy.
 * Reconcile only duplicates with matching run id and provably contained results.
 * Never invent or erase result times, progress, honours or other competitions.
 */
(()=>{
 'use strict';
 const same=(a,b)=>String(a??'')===String(b??'');
 const isTarget=r=>r?.type==='evil-r1'&&r?.format==='swiss'&&
   /^SW-/.test(String(r.value||''))&&!!r.v8Swiss;
 function resultKey(x){return String(x?.id??'')+'|'+String(x?.carId??'')+'|'+String(x?.roundId??'')+'|'+String(x?.time??'')}
 function depth(r){return (r?.results?.length||0)*1000+
   (r?.v8Swiss?.swissRounds||[]).filter(x=>x.status==='complete').length*10+
   (r?.status==='complete'?1:0)}
 function reconcileSpace(s){
   if(!s||!Array.isArray(s.runs))return {fixed:0,unresolved:0};
   const groups=new Map();
   s.runs.forEach((r,i)=>{if(!isTarget(r))return;
     const k=String(r.id),a=groups.get(k)||[];a.push({r,i});groups.set(k,a)});
   const remove=new Set();let fixed=0,unresolved=0;
   for(const copies of groups.values()){
     if(copies.length<2)continue;
     const eventKey=String(copies[0].r.value);
     if(!copies.every(x=>same(x.r.value,eventKey))){unresolved++;continue}
     const ordered=[...copies].sort((a,b)=>depth(b.r)-depth(a.r)||a.i-b.i);
     const best=ordered[0],have=new Set((best.r.results||[]).map(resultKey));
     const allOthersIncluded=ordered.slice(1).every(({r})=>(r.results||[]).every(y=>have.has(resultKey(y))));
     if(!allOthersIncluded){unresolved++;continue}
     // Keep the richest copy, preserve its complete round/match objects unchanged.
     for(const {i} of copies)if(i!==best.i)remove.add(i);
     fixed+=copies.length-1;
   }
   if(remove.size)s.runs=s.runs.filter((_,i)=>!remove.has(i));
   return {fixed,unresolved};
 }
 function reconcile(){
   const spaces=(typeof state!=='undefined'&&Array.isArray(state?.spaces))?state.spaces:[];
   let fixed=0,unresolved=0;
   for(const s of spaces){if(s?.catalogueKey!=='fh5-catalogue-v1')continue;
     const r=reconcileSpace(s);fixed+=r.fixed;unresolved+=r.unresolved;}
   if(fixed){try{window.rhSave?.()}catch(e){console.error('Swiss dedupe save failed',e)}}
   if(unresolved)console.warn('OTG! Swiss recovery skipped ambiguous duplicate:',unresolved);
   return {fixed,unresolved};
 }
 window.rhSwissSlotRecoveryQA8154={reconcile,reconcileSpace};
 reconcile();
})();
