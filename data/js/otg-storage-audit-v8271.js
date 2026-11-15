/* OTG 8.0.271 - Read-only capacity audit, no localStorage writes. */
(()=>{'use strict';
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>(n/1048576).toFixed(2)+' MiB';
const bytes=s=>String(s||'').length*2; // conservative UTF-16 quota proxy
async function inspect(host){if(!host)return;host.textContent='Inspecting existing local storage. No writes…';try{
let keys=[],total=0,mainRaw=null;for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i),v=localStorage.getItem(key)||'',size=bytes(key)+bytes(v);total+=size;keys.push({key,size});if(key==='RaceHub_Studio_Final_v5_6')mainRaw=v;}
keys.sort((a,b)=>b.size-a.size);
let sections=[],stateError='';if(mainRaw){try{const st=JSON.parse(mainRaw);for(const [k,v] of Object.entries(st)){const size=bytes(JSON.stringify(v));sections.push({name:k,size});}sections.sort((a,b)=>b.size-a.size);}catch(err){stateError='Main state could not be parsed: '+String(err.message||err);}}
let estimate=null;try{estimate=await navigator.storage?.estimate?.();}catch(_){}
const report={mainStorageKey:'RaceHub_Studio_Final_v5_6',appVersion:'8.0.271',time:new Date().toISOString(),localStorageApproxMiB:+(total/1048576).toFixed(3),mainStateApproxMiB:+(bytes(mainRaw)/1048576).toFixed(3),localStorageKeys:keys.map(k=>({name:k.key,approxMiB:+(k.size/1048576).toFixed(3)})),mainStateTopLevel:sections.map(k=>({name:k.name,approxMiB:+(k.size/1048576).toFixed(3)})),browserStorageEstimate:estimate?{usageMiB:+(estimate.usage/1048576).toFixed(3),quotaMiB:+(estimate.quota/1048576).toFixed(3)}:null,parseError:stateError};
window.rhStorageAuditReport8270=report;
host.innerHTML='<p><strong>Read-only storage report ready. Main save key verified (lowercase v).</strong></p><p>Approximate localStorage footprint: <b>'+fmt(total)+'</b> · OTG main state: <b>'+fmt(bytes(mainRaw))+'</b></p>'+(estimate?'<p>Browser origin estimate (includes caches and IndexedDB): '+fmt(estimate.usage)+' used / '+fmt(estimate.quota)+' quota. This is NOT the localStorage quota.</p>':'')+'<p><b>Largest localStorage entries:</b></p><div class="e270-data">'+keys.slice(0,8).map(k=>'<div><span>'+E(k.key)+'</span><b>'+fmt(k.size)+'</b></div>').join('')+'</div><p><b>Main app state categories:</b></p><div class="e270-data">'+sections.slice(0,12).map(k=>'<div><span>'+E(k.name)+'</span><b>'+fmt(k.size)+'</b></div>').join('')+'</div>'+(stateError?'<p>'+E(stateError)+'</p>':'')+'<button type="button" data-e270-download>DOWNLOAD SIZE REPORT (NO PERSONAL DATA)</button><button type="button" data-e270-backup>EXPORT EXACT SAVED STATE (PRIVATE BACKUP)</button><p>Neither action deletes or modifies stored data. Keep the private backup off public GitHub.</p>';
host.querySelector('[data-e270-download]').addEventListener('click',()=>download(JSON.stringify(report,null,2),'OTG_STORAGE_REPORT_v8.0.271.json'));
host.querySelector('[data-e270-backup]').disabled=!mainRaw;host.querySelector('[data-e270-backup]').addEventListener('click',()=>{if(!mainRaw)return alert('No saved main state found — no export made.');try{JSON.parse(mainRaw);}catch(_){return alert('Saved state is not valid JSON — export stopped.');}download(mainRaw,'OTG_PRIVATE_MAIN_STATE_BACKUP_'+new Date().toISOString().slice(0,10)+'.json');});
}catch(err){host.textContent='Read-only storage check unavailable: '+String(err.message||err);}}
function download(data,name){const blob=new Blob([data],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),10000);}
window.rhStorageCheck8271=inspect;
})();
