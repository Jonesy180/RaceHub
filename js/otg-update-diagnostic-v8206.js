/* OTG! v8.0.206 - manual update-check diagnostics. No storage writes. */
(function(){'use strict';
 const status=(s)=>{const el=document.getElementById('rhUpdateStatus');if(el)el.textContent=s;};
 const current=()=>document.querySelector('meta[name="racehub-version"]')?.content||'8.0.206';
 const compare=(a,b)=>{const x=String(a).split('.').map(Number),y=String(b).split('.').map(Number);for(let i=0;i<3;i++){let d=(x[i]||0)-(y[i]||0);if(d)return d;}return 0;};
 let checking=false;
 async function test(){
   if(checking)return;checking=true;
   const button=document.getElementById('rhCheckUpdateButton');if(button)button.disabled=true;
   status('Installed version: '+current()+' • Contacting update server…');
   const url=new URL('update-manifest.json',document.baseURI);
   let last=null;
   for(let attempt=0;attempt<3;attempt++){
     try{
       url.searchParams.set('otg_manual',Date.now()+'-'+attempt);
       const r=await fetch(url.href,{cache:'no-store',headers:{Accept:'application/json'}});
       if(!r.ok)throw new Error('HTTP '+r.status);
       const m=await r.json();
       if(!m||!/^\d+\.\d+\.\d+$/.test(String(m.version||'')))throw new Error('invalid manifest version');
       if(compare(m.version,current())>0){
         status('Installed version: '+current()+' • Version '+m.version+' available. Opening protected update…');
         if(typeof window.rhCheckForUpdate==='function')await window.rhCheckForUpdate();
       } else {
         status('Installed version: '+current()+' • Latest published version: '+m.version+' • Up to date.');
       }
       last=null;break;
     }catch(e){last=e;if(attempt<2)await new Promise(resolve=>setTimeout(resolve,500*(attempt+1)));}
   }
   if(last)status('Installed version: '+current()+' • Could not reach update manifest ('+String(last.message||last)+'). Existing data is safe.');
   if(button)button.disabled=false;checking=false;
 }
 document.addEventListener('click',event=>{
   const target=event.target.closest?.('#rhCheckUpdateButton');
   if(!target)return;
   event.preventDefault();event.stopImmediatePropagation();
   test();
 },true);
})();
