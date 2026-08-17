/* OTG! v6.0.87 — robust update-wire override */
(()=>{
'use strict';
const CURRENT=document.querySelector('meta[name="racehub-version"]')?.content||'6.0.87';
function status(text,cls=''){
 const el=document.getElementById('rhUpdateStatus');
 if(el){el.textContent=text;el.className='rhUpdateStatusV5783 '+cls}
}
window.rhCheckForUpdate=async function(){
 const button=document.getElementById('rhCheckUpdateButton');
 if(button)button.disabled=true;
 status(`Installed version: ${CURRENT} • Checking latest version…`,'checking');
 try{
   const stamp=Date.now();
   const response=await fetch(`./index.html?otg-update=${stamp}`,{
     method:'GET',cache:'no-store',
     headers:{'Cache-Control':'no-cache, no-store, max-age=0','Pragma':'no-cache'}
   });
   if(!response.ok)throw new Error('index');
   const html=await response.text();
   const remote=html.match(/name=["']racehub-version["']\s+content=["']([^"']+)/i)?.[1];
   if(!remote)throw new Error('version');
   if(remote!==CURRENT){
     status(`Installed version: ${CURRENT} • Latest version: ${remote} — applying…`,'found');
     const regs=await navigator.serviceWorker?.getRegistrations?.()||[];
     await Promise.all(regs.map(r=>r.update().catch(()=>{})));
     regs.forEach(r=>{if(r.waiting)r.waiting.postMessage({type:'SKIP_WAITING'})});
     setTimeout(()=>location.reload(true),700);
   }else{
     status(`Installed version: ${CURRENT} • Latest version: ${remote} — up to date.`,'current');
   }
 }catch(_){
   status(`Installed version: ${CURRENT} • Latest version unavailable. Try again later.`,'error');
 }finally{
   if(button)button.disabled=false;
 }
};
})();