/* v8.0.428 — Stock FH5 badges verified from prior in-game checks.
   All other cars retain the original editorial upgrade suggestion; never claim
   a recommendation is official stock PI. This module is read-only. */
(function(root){'use strict';
const verified=Object.freeze({
  184:Object.freeze({level:'S1',stockPI:824}),
  189:Object.freeze({level:'S1',stockPI:802}),
  223:Object.freeze({level:'S1',stockPI:null}),
  225:Object.freeze({level:'S1',stockPI:838}),
  226:Object.freeze({level:'S1',stockPI:null})
});
function lookup(car){
  let entry;try{entry=root.TET2UpgradeClass424?.resolve?.(car);}catch(_){return null;}
  if(!entry)return null;
  const verifiedEntry=verified[entry.index];
  if(verifiedEntry)return Object.freeze({level:verifiedEntry.level,pi:verifiedEntry.stockPI,verified:true,index:entry.index});
  return Object.freeze({level:entry.level,pi:entry.pi,verified:false,index:entry.index});
}
root.TET2StockBadge428=Object.freeze({lookup,verifiedCount:5,totalCount:902});
})(typeof window!=='undefined'?window:globalThis);
