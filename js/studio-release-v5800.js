/* RaceHub v5.8.00 — emergency functional recovery.
   Restores the proven completion/final-leaderboard routes from the locked UI layer.
   Keeps the Settings update checker. No visual redesign in this recovery build. */
(()=>{
 const VERSION='5.8.00';
 function updateStatus(text,state=''){
   const el=document.getElementById('rhUpdateStatus');
   if(!el)return;
   el.textContent=text;
   el.dataset.state=state;
 }
 window.rhCheckForUpdate=async function(){
   const button=document.getElementById('rhCheckUpdateButton');
   if(button)button.disabled=true;
   updateStatus('Checking RaceHub…','checking');
   try{
     const registration=await navigator.serviceWorker?.getRegistration();
     if(registration)await registration.update();
     const response=await fetch(`./index.html?update-check=${Date.now()}`,{cache:'no-store',headers:{'Cache-Control':'no-cache'}});
     if(!response.ok)throw new Error('Update check failed');
     const html=await response.text();
     const match=html.match(/<meta\s+name=["']racehub-version["']\s+content=["']([0-9]+\.[0-9]+\.[0-9]+)["']/i);
     const remote=match?.[1]||VERSION;
     if(remote!==VERSION){
       updateStatus(`Update ${remote} found — applying…`,'found');
       if(registration?.waiting)registration.waiting.postMessage({type:'SKIP_WAITING'});
       setTimeout(()=>window.location.reload(),500);
     }else updateStatus(`RaceHub ${VERSION} is up to date.`,'current');
   }catch(_){updateStatus('Could not check right now. Check your connection and try again.','error');}
   finally{if(button)button.disabled=false;}
 };
 const oldSettings=window.rhRenderSettings;
 if(oldSettings)window.rhRenderSettings=function(){
   const out=oldSettings();
   const content=document.querySelector('#more .rhContent');
   if(!content)return out;
   content.querySelectorAll('.rhSettingRow span').forEach(span=>{
     if(/RaceHub v/i.test(span.textContent||''))span.textContent=`RaceHub v${VERSION} • CHECK NOW ›`;
   });
   const danger=content.querySelector('.rhDangerFinal');
   if(danger&&!document.getElementById('rhUpdatePanel')){
     danger.insertAdjacentHTML('beforebegin',`<section id="rhUpdatePanel" class="rhSection rhSettingPanel rhUpdatePanelV5783"><h2>APP UPDATE</h2><p>Check for the latest RaceHub build without closing the app.</p><button id="rhCheckUpdateButton" class="rhSettingRow" onclick="rhCheckForUpdate()"><b>CHECK FOR LATEST UPDATE</b><span>RaceHub v${VERSION} • CHECK NOW ›</span></button><div id="rhUpdateStatus" class="rhUpdateStatusV5783" aria-live="polite">Installed version: ${VERSION}</div></section>`);
   }
   const status=document.getElementById('rhUpdateStatus');
   if(status&&!/Checking|Update .*found|Could not/i.test(status.textContent||''))status.textContent=`Installed version: ${VERSION}`;
   return out;
 };
})();
