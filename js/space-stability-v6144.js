/* OTG! v6.0.144 — active Space stability guard.
   Background GT7 work and Festival rendering must never change the selected Space. */
(()=>{
'use strict';
function valid(id){try{return !!id&&Array.isArray(state?.spaces)&&state.spaces.some(s=>String(s?.id)===String(id))}catch(_){return false}}
function restore(id){
  if(!valid(id)||String(state.activeSpaceId)===String(id))return false;
  state.activeSpaceId=id;
  try{rhSync()}catch(_){}
  try{rhSave()}catch(_){}
  return true;
}
const base=window.rhRenderFestival;
if(typeof base==='function'){
  let rerendering=false;
  window.rhRenderFestival=function(){
    const before=state?.activeSpaceId, keep=valid(before);
    const result=base.apply(this,arguments);
    if(keep&&restore(before)&&!rerendering){
      rerendering=true;
      try{return base.apply(this,arguments)}finally{rerendering=false}
    }
    return result;
  };
  try{rhRenderFestival=window.rhRenderFestival}catch(_){}
}
})();
