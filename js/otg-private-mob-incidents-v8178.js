/* OTG! PERSONAL MAIN v8.0.178 — PRIVATE Jones Mob Incident Files (post-activation art replacement fix).
 * Public repo contains NO names of family members, NO family photographs,
 * NO private scripts. Separate user-imported JSON and picture files live
 * exclusively in IndexedDB. Never writes to racing/garage/history state.
 */
((root)=>{
 'use strict';
 const DB='OTG_Private_Mob_Incident_Files_v1', PACK='season-one', PROGRESS='season-one-progress';
 const FORMAT='otg-private-jones-mob-v1', CAMPAIGN='evil-specialist-r1-20261014', FH5='fh5-catalogue-v1';
 const INTERVALS=[2,6,9,14,17,21], MAX_PACK=100000, MAX_ART=10*1024*1024;
 const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const pad=n=>String(n).padStart(4,'0');
 const space=()=>{try{const x=root.rhSpace?.();return x?.catalogueKey===FH5?x:null}catch(_){return null}};
 const campaign=()=>{const c=space()?.evilCampaignR18098;return c?.campaignId===CAMPAIGN?c:null};
 const official=()=>{try{const q=root.rhEvilR1QA8103?.slots?.();return Array.isArray(q)&&q.length>100?new Map(q.map(x=>[Number(x.slot),String(x.eventId)])):null}catch(_){return null}};
 const validatedDone=()=>{const c=campaign(),lookup=official();if(!c||!lookup)return [];
   return Object.entries(c.done||{}).filter(([n,v])=>Number.isSafeInteger(+n)&&+n>0&&lookup.get(+n)===String(v?.eventId)).map(([n])=>+n).sort((a,b)=>a-b);
 };
 function openDb(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);
   r.onupgradeneeded=()=>{for(const n of ['privateContent','privateArt'])if(!r.result.objectStoreNames.contains(n))r.result.createObjectStore(n)};
   r.onerror=()=>reject(r.error||new Error('Cannot open private archive storage'));r.onblocked=()=>reject(new Error('Private archive database is busy'));r.onsuccess=()=>resolve(r.result);
 });}
 async function dbGet(store,key){const d=await openDb();try{return await new Promise((ok,no)=>{const r=d.transaction(store,'readonly').objectStore(store).get(key);r.onsuccess=()=>ok(r.result||null);r.onerror=()=>no(r.error)});}finally{d.close()}}
 async function dbPut(store,key,value){const d=await openDb();try{return await new Promise((ok,no)=>{const t=d.transaction(store,'readwrite');t.objectStore(store).put(value,key);t.oncomplete=()=>ok(true);t.onerror=()=>no(t.error);t.onabort=()=>no(t.error)})}finally{d.close()}}
 function validatePack(x){if(!x||x.format!==FORMAT||x.seriesId!=='jones-mob-series-1'||!Array.isArray(x.episodes)||x.episodes.length!==6)throw new Error('This is not the six-file private Series One pack.');
   const ids=new Set();for(const e of x.episodes){if(!Number.isInteger(e.number)||e.number<1||e.number>6||ids.has(e.number)||typeof e.title!=='string'||e.title.length>140||!Array.isArray(e.cast)||e.cast.length>18||!e.cast.every(y=>typeof y==='string'&&y.length<=45)||!Array.isArray(e.story)||e.story.length<2||e.story.length>6||!e.story.every(y=>typeof y==='string'&&y.length<=1200))throw new Error('A private incident file is incomplete.');ids.add(e.number)}
   if(![1,2,3,4,5,6].every(n=>ids.has(n)))throw new Error('Six incident files are required.');
   return {...x,episodes:x.episodes.sort((a,b)=>a.number-b.number)};
 }
 const newProgress=()=>({version:1,baseline:null,armed:false,unlocked:{},delivered:{},createdAt:new Date().toISOString()});
 async function importPackPayload(value){const pack=validatePack(value),existing=await dbGet('privateContent',PACK);
   if(existing&&existing.seriesId!==pack.seriesId)throw new Error('Another private season is already installed.');
   if(!existing){await dbPut('privateContent',PACK,pack);if(!await dbGet('privateContent',PROGRESS))await dbPut('privateContent',PROGRESS,newProgress());}
   return {alreadyInstalled:!!existing,pack};
 }
 async function importFile(file){if(!file||file.size>MAX_PACK)throw new Error('Private pack must be under 100KB.');const t=await file.text();let data;try{data=JSON.parse(t)}catch(_){throw new Error('Invalid JSON file')};return importPackPayload(data)}
 async function installedArtCount(){let total=0;for(let i=1;i<=6;i++)if(await dbGet('privateArt','art-'+i))total++;return total}
 async function stageArtworkFiles(files){if(!await dbGet('privateContent',PACK))throw new Error('Install the private story pack first.');
   const selected=Array.from(files||[]);if(!selected.length)throw new Error('Select the six private cartoon images.');
   for(const f of selected){const m=String(f.name).match(/^JONES-MOB-0([1-6])\.(png|jpg|jpeg|webp)$/i);if(!m||!['image/png','image/jpeg','image/webp'].includes(f.type)||f.size>MAX_ART)throw new Error('Use names JONES-MOB-01 to JONES-MOB-06 (PNG/JPG/WebP, max 10MB each).');
     await dbPut('privateArt','art-'+Number(m[1]),{blob:f,name:f.name});
   }
   const count=await installedArtCount();let progress=await dbGet('privateContent',PROGRESS);if(!progress)progress=newProgress();
   if(count===6&&!progress.armed){progress.armed=true;progress.baseline=validatedDone().at(-1)||0;progress.armedAt=new Date().toISOString();await dbPut('privateContent',PROGRESS,progress)}
   return {count,armed:!!progress.armed};
 }
 let artUrls=[];
 function revokeArt(){artUrls.forEach(u=>URL.revokeObjectURL(u));artUrls=[]}
 function close(){revokeArt();document.getElementById('otgMobFiles8176')?.remove();document.getElementById('otgNoticeOverlay8172')?.querySelector('[data-otg-mob-open]')?.focus({preventScroll:true});}
 async function getState(){return {pack:await dbGet('privateContent',PACK),progress:await dbGet('privateContent',PROGRESS)}}
 function template(title,body){return `<section class="mobSheet8176" role="dialog" aria-modal="true" aria-labelledby="mobHeading8176"><header class="mobHead8176"><small>🐧 OTG! · PRIVATE · SERIES ONE</small><h2 id="mobHeading8176">${E(title)}</h2></header><main class="mobMain8176">${body}</main><footer class="mobFooter8176"><button type="button" data-mob-back>← BACK TO NOTICEBOARD</button></footer></section>`}
 function mount(title,body){close();const modal=document.createElement('div');modal.id='otgMobFiles8176';modal.className='mobOverlay8176';modal.innerHTML=template(title,body);document.body.appendChild(modal);modal.querySelector('[data-mob-back]').addEventListener('click',()=>{const view=modal.dataset.view;if(view==='episode')openArchive();else close()});modal.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();modal.querySelector('[data-mob-back]')?.click()}});modal.querySelector('[data-mob-back]').focus({preventScroll:true});return modal}
 async function openArchive(){try{const {pack,progress}=await getState(),done=validatedDone();let html='';
   if(!pack){html=`<div class="mobCard8176"><h3>🔐 PRIVATE SEASON NOT INSTALLED</h3><p>The app shell contains no family names, story scripts or personal pictures. Import your separate <b>PRIVATE SERIES ONE.json</b> file from your phone. Never publish that file to GitHub.</p><label class="mobImport8176">📦 IMPORT PRIVATE STORY PACK<input type="file" data-mob-pack accept=".json,application/json"></label><p class="mobInfo8176">Importing begins a fresh six-file award sequence after the Evil slots already completed. Existing Cone Breaks, Hall of Shame rewards, medals and racing records are not touched.</p><p data-mob-message role="status"></p></div>`;}
   else{const count=Object.keys(progress?.unlocked||{}).length,baseline=Number(progress?.baseline)||0,earned=progress?.armed?done.filter(n=>n>baseline).length:0;
    const artCount=await installedArtCount();
    html=`<div class="mobCard8176"><h3>🗃️ SERIES ONE · ${count} / 6 DECLASSIFIED</h3><p>Family incidents are awarded occasionally after <b>newly completed</b> Evil Tournament slots. The cast and story remain sealed until each file is earned.</p>${progress?.armed?`<p class="mobInfo8176">${count===6?'All files discovered.':`Progress since private activation: ${earned} completed slot${earned===1?'':'s'}. Next incident: CLASSIFIED.`}</p><label class="mobImport8176">🖼️ REPLACE PRIVATE ARTWORK (ALL SIX)<input type="file" data-mob-artbatch multiple accept="image/png,image/jpeg,image/webp"></label><p class="mobInfo8176">Select up to six files named JONES-MOB-01.png through JONES-MOB-06.png. Matching pictures are replaced locally; stories, earned incidents, activation baseline and race records stay as they are. Keep original pictures backed up separately.</p><p data-mob-message role="status" aria-live="polite"></p>`:`<p class="mobInfo8176">🔒 SEALED: ${artCount} / 6 illustrations installed privately. No incidents can unlock until all six are installed, so you won't see a story without its picture.</p><label class="mobImport8176">🖼️ IMPORT PRIVATE CARTOON ARTWORK<input type="file" data-mob-artbatch multiple accept="image/png,image/jpeg,image/webp"></label><p class="mobInfo8176">Choose files named JONES-MOB-01.png through JONES-MOB-06.png (JPG/WebP also accepted). The series activates only when all six are stored on this device. No pictures are supplied with this QA update.</p><p data-mob-message role="status"></p>`}</div>`;
    for(let i=1;i<=6;i++){const u=progress?.unlocked?.[String(i)];html+=`<div class="mobEntry8176"><span>${u?`🔓 FILE ${pad(i)} · EARNED AFTER SLOT ${pad(u.slot)}`:`🔒 FILE ${pad(i)} · CLASSIFIED`}</span>${u?`<h3>${E(pack.episodes[i-1].title)}</h3><button type="button" data-mob-episode="${i}">OPEN INCIDENT FILE ›</button>`:`<p>Contents sealed · No spoilers</p>`}</div>`}
    html+=`<p class="mobInfo8176">Private pictures, when added, stay in this device's IndexedDB. Neither the pictures nor these stories are included in your OTG! portable backup. Keep your separate originals and private pack safe; clearing browser data erases local copies.</p>`;
   }
   const m=mount('THE JONES MOB INCIDENT FILES',html);m.dataset.view='archive';
   m.querySelector('[data-mob-pack]')?.addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;const status=m.querySelector('[data-mob-message]');status.textContent='Importing privately…';try{await importFile(f);await openArchive()}catch(err){status.textContent=err?.message||'Private import failed'}finally{e.target.value=''}});
   m.querySelector('[data-mob-artbatch]')?.addEventListener('change',async e=>{const files=e.target.files;if(!files?.length)return;const status=m.querySelector('[data-mob-message]');status.textContent='Saving private pictures on this device…';try{await stageArtworkFiles(files);await openArchive()}catch(err){status.textContent=err?.message||'Private artwork import failed'}finally{e.target.value=''}});
   m.querySelectorAll('[data-mob-episode]').forEach(b=>b.addEventListener('click',()=>openEpisode(Number(b.dataset.mobEpisode))));
  }catch(e){const m=mount('PRIVATE INCIDENT FILES',`<div class="mobCard8176"><p>${E(e?.message||'Could not open archive')}</p></div>`);m.dataset.view='archive';}}
 async function openEpisode(i,{auto=false}={}){if(!Number.isInteger(i)||i<1||i>6)return;const {pack,progress}=await getState(),earned=progress?.unlocked?.[String(i)];if(!pack||!earned)return openArchive();
   revokeArt();const ep=pack.episodes[i-1], art=await dbGet('privateArt','art-'+i);
   const image=art?.blob?'<div class="mobPicture8176" data-mob-art></div>':'<div class="mobMissing8176"><span>📸</span><b>ILLUSTRATION NOT YET INSTALLED</b><p>A separate private picture can be added below. No family photos are shipped with app updates.</p></div>';
   const html=`<div class="mobCard8176"><div class="mobStamp8176">${auto?'🚨 NEW INCIDENT · ':''}SLOT ${pad(earned.slot)} · FILE ${pad(i)}</div>${image}<p class="mobCast8176">CREW ON DUTY: ${E(ep.cast.join(' · '))}</p>${ep.story.map(p=>`<p class="mobStory8176">${E(p)}</p>`).join('')}<blockquote>${E(ep.lastLine||'THE DEPARTMENT DENIES EVERYTHING.')}</blockquote><label class="mobImport8176">🖼️ ${art?'REPLACE':'ADD'} PRIVATE EPISODE ARTWORK<input type="file" data-mob-artfile accept="image/png,image/jpeg,image/webp"></label><p class="mobInfo8176">Images remain private on this device. Never add family photos to the public GitHub Pages repo.</p><p data-mob-message role="status"></p><button class="mobReturn8176" type="button" data-mob-archive>← BACK TO INCIDENT ARCHIVE</button></div>`;
   const m=mount(ep.title,html);m.dataset.view='episode';m.querySelector('[data-mob-back]').textContent='← BACK TO INCIDENT ARCHIVE';
   if(art?.blob){const u=URL.createObjectURL(art.blob);artUrls.push(u);const img=document.createElement('img');img.src=u;img.alt='Private Jones Mob cartoon incident file '+i;m.querySelector('[data-mob-art]')?.appendChild(img)}
   m.querySelector('[data-mob-archive]').addEventListener('click',openArchive);
   m.querySelector('[data-mob-artfile]').addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;const status=m.querySelector('[data-mob-message]');if(!['image/png','image/jpeg','image/webp'].includes(f.type)||f.size>MAX_ART){status.textContent='Use a PNG, JPG or WebP image under 10 MB.';return}try{await dbPut('privateArt','art-'+i,{blob:f,name:f.name});await openEpisode(i)}catch(err){status.textContent=err?.message||'Could not save picture'}finally{e.target.value=''}});
   if(auto){try{const st=await dbGet('privateContent',PROGRESS);if(st&&!st.delivered[String(i)]){st.delivered[String(i)]=new Date().toISOString();await dbPut('privateContent',PROGRESS,st)}}catch(_){/* optional notice */}}
 }
 async function unlockAfterDone(n){const {pack,progress}=await getState();if(!pack||!progress?.armed)return false;
   const now=validatedDone();if(!now.includes(n)||n<=progress.baseline)return false;
   const earned=now.filter(v=>v>progress.baseline).length;
   const idx=INTERVALS.findIndex((at,i)=>earned>=at&&!progress.unlocked[String(i+1)]);
   if(idx<0)return false;
   const i=idx+1;progress.unlocked[String(i)]={slot:n,at:new Date().toISOString()};
   await dbPut('privateContent',PROGRESS,progress);
   scheduleAutoview(i);return true;
 }
 let watch=null;
 function scheduleAutoview(i){if(watch){watch.disconnect?.();clearTimeout(watch.timer);watch=null};const tryOpen=()=>{
    if(document.getElementById('otgMobFiles8176'))return false;
    // Respect existing Cone Break and other modal flows; our story is next in the queue.
    const blockers=[...document.querySelectorAll('[role="dialog"][aria-modal="true"],#otgConeBreakOverlay8164')].filter(x=>!x.closest('#otgMobFiles8176'));
    if(blockers.length)return false;
    cleanup();openEpisode(i,{auto:true}).catch(err=>console.warn('Private Mob incident display:',err));return true;
   };
   const cleanup=()=>{watch?.disconnect?.();if(watch?.timer)clearTimeout(watch.timer);watch=null};
   const obs=new MutationObserver(()=>{if(watch)tryOpen()});obs.observe(document.body,{subtree:false,childList:true});
   watch=obs;watch.timer=setTimeout(cleanup,4*60*1000);setTimeout(tryOpen,120);
 }
 async function afterDone(n){try{await unlockAfterDone(n)}catch(e){console.warn('Optional private Jones Mob intermission failed safely:',e)}}
 function addNotice(overlay){const main=overlay?.querySelector('.otgNoticeSheet8172 main');if(!main||main.querySelector('[data-otg-mob-open]'))return;
   const div=document.createElement('section');div.className='otgNoticeCard8172 mobNotice8176';div.innerHTML='<h3>🗃️ THE JONES MOB INCIDENT FILES</h3><p>Six privately imported family disasters. Unlock occasional classified stories after newly completed Evil Tournament slots.</p><button type="button" data-otg-mob-open>OPEN PRIVATE INCIDENT ARCHIVE ›</button><small>Private story pack and future artwork never go into the public repo.</small>';
   const footer=main.querySelector('.otgNoticeFoot8172');footer?main.insertBefore(div,footer):main.appendChild(div);
   div.querySelector('[data-otg-mob-open]').addEventListener('click',openArchive);
 }
 function install(){const base=root.rhEvilSetR1Status8098;if(typeof base==='function'&&!base._mob176){function wrapped(n,want){const x=Number(n),pre=campaign()?.done?.[String(x)],s=space(),expected=official()?.get(x);const out=base.apply(this,arguments);if(want==='done'&&s&&space()===s&&!pre&&expected&&Number.isSafeInteger(x)&&x>0&&String(campaign()?.done?.[String(x)]?.eventId)===expected){afterDone(x)}return out};wrapped._mob176=true;root.rhEvilSetR1Status8098=wrapped;}
   const obs=new MutationObserver(records=>{for(const r of records)for(const n of r.addedNodes){if(n.nodeType===1){if(n.id==='otgNoticeOverlay8172')addNotice(n);else addNotice(n.querySelector?.('#otgNoticeOverlay8172'))}}});obs.observe(document.body,{childList:true});addNotice(document.getElementById('otgNoticeOverlay8172'));
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
 // Test hooks are deliberately not capable of modifying the app's racing results.
 root.otgPrivateMobQA8176={openArchive,openEpisode,importPackPayload,stageArtworkFiles,installedArtCount,unlockAfterDone,validatedDone,dbGet,dbPut,install,afterDone};
})(window);
