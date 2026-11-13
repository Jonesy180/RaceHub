/* OTG! MAIN v8.0.208 — Relay QA snapshot: safe read-only export.
   Reads ONLY three known relay QA localStorage namespaces for the CURRENT Space.
   No writes/imports; never touches OTG! live race data, Garage, or private artwork. */
(function(){'use strict';
 const FAMILIES=['otg.evil2.relay.qa.v1:','otg.evil2.relay.qa.rounds.v2:','otg.evil2.relay.qa.track-locks.v1:'];
 const TARGET='otg-relay-choices-8202';
 const ID='otg-relay-export-8208';
 function currentSpace(){try{return window.rhSpace?.()||null;}catch(_){return null;}}
 function spaceId(){const s=currentSpace(),id=s&&(s.id||s.spaceId||s.space_id);return id==null?'':String(id);}
 function collect(){
   const id=spaceId();if(!id)throw Error('Open a Space first; no stable Space ID is available.');
   const safe=encodeURIComponent(id),items=[];
   for(let i=0;i<localStorage.length;i++){
     const key=localStorage.key(i);
     const family=FAMILIES.find(x=>key.startsWith(x+safe+':'));
     if(!family)continue;
     // The exact Space separator is essential: do not export other Spaces.
     const suffix=key.slice((family+safe+':').length);
     if(!/^(maker|mixed)(?::[a-f\d]+)?$/.test(suffix))continue;
     if(family===FAMILIES[0]&& !/^(maker|mixed)$/.test(suffix))continue;
     if(family===FAMILIES[1]&& !/^(maker|mixed)$/.test(suffix))continue;
     if(family===FAMILIES[2]&& !/^(maker|mixed):[a-f\d]+$/.test(suffix))continue;
     const raw=localStorage.getItem(key);if(raw==null)continue;
     if(raw.length>2000000)throw Error('A relay QA entry is unusually large. Export cancelled safely.');
     let parsed;try{parsed=JSON.parse(raw);}catch(_){throw Error('A relay QA entry has invalid JSON. Export cancelled without changes.');}
     if(!parsed||typeof parsed!=='object'||Array.isArray(parsed)||!Number.isInteger(parsed.schema))throw Error('A relay QA entry has an unsupported shape.');
     const mode=suffix.split(':')[0];
     if(parsed.mode!==mode)throw Error('A relay entry does not match its stored competition type.');
     if(family===FAMILIES[0]&&(!Array.isArray(parsed.teams)||!Array.isArray(parsed.results)||parsed.teams.length!==parsed.results.length))throw Error('A relay draw has invalid team/results counts.');
     if(family===FAMILIES[1]&&(!Array.isArray(parsed.rounds)||parsed.spaceId!==id))throw Error('Championship round data failed validation.');
     if(family===FAMILIES[2]&&(!parsed.groups||parsed.spaceId!==id))throw Error('Route lock data failed validation.');
     items.push({key,family:family.slice(0,-1),mode,value:parsed});
   }
   return {schema:'otg-relay-qa-snapshot-v1',application:'OTG! MAIN',applicationVersion:'8.0.208',scope:'current-space-only',spaceId:id,createdAt:new Date().toISOString(),warning:'ISOLATED RELAY QA RECORDS ONLY. Does not contain full Garage, private files or the normal OTG! portable backup. No automatic import is provided.',items:items.sort((a,b)=>a.key.localeCompare(b.key))};
 }
 function mount(){
   const choices=document.getElementById(TARGET);
   if(!choices||choices.querySelector('#'+ID))return;
   const btn=document.createElement('button');btn.type='button';btn.id=ID;
   btn.innerHTML='<strong>💾 EXPORT RELAY QA SNAPSHOT</strong><small>Download this Space’s saved relay teams, rounds and route locks. Read-only.</small>';
   const note=choices.querySelector('.otg-relay-qa-8202');
   choices.insertBefore(btn,note||null);
   const status=document.createElement('p');status.id='otg-relay-export-status-8208';status.setAttribute('role','status');status.style.cssText='margin:0 7px;color:#b9e1eb;font-size:13px;line-height:1.4;';
   choices.insertBefore(status,note||null);
   btn.addEventListener('click',()=>{
     try{
       const data=collect();if(!data.items.length){status.textContent='No saved relay QA records found for this Space. Nothing to export.';return;}
       const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
       const url=URL.createObjectURL(blob);const a=document.createElement('a');
       a.href=url;a.download='OTG-RELAY-QA-SNAPSHOT-'+new Date().toISOString().replace(/[:.]/g,'-')+'.json';
       document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
       status.textContent='Snapshot exported: '+data.items.length+' isolated QA record(s), current Space only. Keep this file safe.';
     }catch(err){status.textContent='Export cancelled safely: '+String(err.message||err);}
   });
 }
 let pending=false;
 function queue(){if(pending)return;pending=true;setTimeout(()=>{pending=false;mount();},75);}
 // The Festival UI is created dynamically. Observe only its subtree and do no
 // work on unrelated racing screens. It does not alter the existing controls.
 function start(){const festival=document.getElementById('festival');if(!festival)return;
   new MutationObserver(queue).observe(festival,{childList:true,subtree:true});queue();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
 window.rhRelayQaSnapshot208={collect};
})();
