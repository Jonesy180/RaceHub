/* OTG! 8.0.421 — One-time, explicitly initiated TET2 fake-results reset.
 * Only these THREE keys in the currently selected, validated FH5 Space may be removed:
 *   tet2RaceControlV8397, tet2OfficialSlotLedgerV8361, tet2Stage3HonoursV8358.
 * No normal OTG! car ownership, races, records, backups, worlds, route lock or schedule writes.
 * Never auto-run. A verified full-app backup download is required first.
 */
(function(root){'use strict';
 const KEYS=['tet2RaceControlV8397','tet2OfficialSlotLedgerV8361','tet2Stage3HonoursV8358'];
 const SOURCE='TET2_CONTROLLED_CHAOS_LOCKED_V1';
 const E=x=>String(x??'').replace(/[&<>\"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[ch]));
 const clone=x=>JSON.parse(JSON.stringify(x));
 const fail=s=>{throw Error('TET2 reset: '+s);};
 let downloaded=null, completed=false;
 const storeKey=()=>typeof RH_FINAL_STORE!=='undefined'?RH_FINAL_STORE:null;
 const getRaw=()=>{const key=storeKey();if(!key)fail('Native persisted OTG storage key is unavailable; nothing changed');const raw=root.localStorage?.getItem(key);if(!raw)fail('Native OTG saved data unavailable; nothing changed');return raw;};
 const parse=raw=>{const s=JSON.parse(raw);if(!s||!Array.isArray(s.spaces))fail('Native saved Spaces structure is invalid');return s;};
 function inspect(){
   const sp=root.rhSpace?.();if(!sp||sp.catalogueKey!=='fh5-catalogue-v1'||!sp.id||!Array.isArray(sp.cars)||!sp.cars.length)fail('Open your real FH5 Catalogue Space first');
   if(typeof root.rhSave!=='function')fail('Native save function is missing');
   const full=parse(getRaw()),onDisk=full.spaces.find(x=>String(x.id)===String(sp.id));
   if(!onDisk||full.spaces.filter(x=>String(x.id)===String(sp.id)).length!==1)fail('FH5 Space identity is not unique in saved state');
   const led=sp[KEYS[1]];
   if(!led||led.schema!==1||String(led.spaceId)!==String(sp.id)||led.source!==SOURCE||!led.slots||typeof led.slots!=='object')fail('Expected TET2 official test ledger not present; no action available');
   const ids=Object.keys(led.slots),done=ids.filter(k=>!!led.slots[k]?.completedAt);
   if(ids.length!==12||done.length!==12||!Array.from({length:12},(_,i)=>'TET2-'+(i+1)).every(k=>done.includes(k)))fail('Expected exactly 12 completed test slots and no extra started slots; reset blocked to protect other results');
   for(const key of KEYS){if(!Object.hasOwn(sp,key)||!Object.hasOwn(onDisk,key)||JSON.stringify(sp[key])!==JSON.stringify(onDisk[key]))fail('TET2 state mismatch for '+key+'; reset blocked');}
   const race=sp[KEYS[0]],honours=sp[KEYS[2]];
   if(race?.schema!==1||String(race.spaceId)!==String(sp.id)||!race.events||!race.definitions)fail('Test draw is missing or malformed');
   if(honours?.schema!==1||String(honours.spaceId)!==String(sp.id)||!honours.receipts)fail('TET2 medals ledger is missing or malformed');
   if(Object.keys(led.slots).some(k=>!led.slots[k]?.completedAt))fail('Unexpected uncompleted TET2 slot');
   return {sp,full,space:onDisk,done:done.length,carCount:sp.cars.length,raw:getRaw()};
 }
 function download(){
   const x=inspect();const raw=x.raw;
   const stamp=new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
   const blob=new Blob([raw],{type:'application/json'}),url=root.URL.createObjectURL(blob);
   const anchor=root.document.createElement('a');anchor.href=url;anchor.download='OTG_FULL_BACKUP_PRE_TET2_RESET_'+stamp+'.json';
   root.document.body.appendChild(anchor);anchor.click();anchor.remove();setTimeout(()=>root.URL.revokeObjectURL(url),60000);
   downloaded={spaceId:String(x.sp.id),raw};
   return anchor.download;
 }
 function withoutTET2(obj,spaceId){
   const copy=clone(obj),sp=copy.spaces.find(x=>String(x.id)===spaceId);
   if(!sp)fail('Saved Space disappeared during verification');
   for(const k of KEYS)delete sp[k];return JSON.stringify(copy);
 }
 function perform(){
   if(!downloaded)fail('Download a fresh full OTG backup first');
   const x=inspect();if(downloaded.spaceId!==String(x.sp.id)||downloaded.raw!==x.raw)fail('Saved state changed since the backup. Download a new backup first');
   const okay=root.confirm('CHECK YOUR DOWNLOADS FIRST. Have you saved the full OTG backup file? This removes only the 12 fake TET2 slots, their draws and TET2 medals/records. All normal OTG data stays. Continue?');
   if(!okay)return {cancelled:true};
   const typed=root.prompt('Final confirmation: type RESET TET2 (exactly) to clear the 12 TEST slots only:','');
   if(typed!=='RESET TET2')return {cancelled:true};
   // Snapshot exact values for a best-effort rollback if native save/verification fails.
   const old=Object.fromEntries(KEYS.map(k=>[k,clone(x.sp[k])])) ;
   try{
     for(const k of KEYS)delete x.sp[k];
     root.rhSave();
     const after=parse(getRaw()),active=after.spaces.find(s=>String(s.id)===String(x.sp.id));
     if(!active||KEYS.some(k=>Object.hasOwn(active,k))||KEYS.some(k=>Object.hasOwn(x.sp,k)))fail('TET2 keys still present after native save');
     if(JSON.stringify(after)!==withoutTET2(x.full,String(x.sp.id)))fail('Saved OTG data outside the three TET2 keys changed unexpectedly');
     completed=true;downloaded=null;
     return {ok:true,done:x.done,carCount:x.carCount};
   }catch(e){
     for(const k of KEYS)x.sp[k]=old[k];
     try{root.rhSave();}catch(restoreError){root.console?.error?.('TET2 reset rollback failed',restoreError);}
     downloaded=null;throw e;
   }
 }
 function html(){
   if(completed)return '<section class="t2-reset421"><h3>✅ 12 TEST SLOTS CLEARED</h3><p>The official TET2 ledger, test draws and TET2-only honours have been reset. Your Garage and OTG! races are unchanged. <strong>Next: Evil List shuffle. Do not start a new TET2 race yet.</strong></p></section>';
   let x;try{x=inspect();}catch(_){return '';}
   return `<section class="t2-reset421"><h3>🧹 CLEAN START · TET2 ONLY</h3><p><strong>${x.done} fake test slots completed</strong> · ${x.carCount} Garage cars untouched. Save your full-app backup before clearing the TET2 practice campaign.</p><button type="button" class="t2-reset421-backup" data-t2-reset421="backup">⬇ DOWNLOAD FULL OTG BACKUP</button><button type="button" class="t2-reset421-clear" data-t2-reset421="reset" ${downloaded?.spaceId===String(x.sp.id)?'':'disabled'}>🧹 CLEAR 12 TET2 TEST SLOTS</button><small>Removes only TET2 results, frozen draws, progress and TET2 medals/records. Preserves original Garage, OTG history, settings, route catalogue and competition definitions.</small></section>`;
 }
 function action(e,render){const btn=e.target.closest?.('[data-t2-reset421]');if(!btn)return false;
   try{if(btn.dataset.t2Reset421==='backup'){const filename=download();root.alert?.('Backup download requested: '+filename+' — verify it is in Downloads BEFORE clearing anything.');}
     else if(btn.dataset.t2Reset421==='reset'){const result=perform();if(result?.ok)root.alert?.('12 fake TET2 slots cleared. OTG! Garage and normal records preserved. Next step: controlled Evil List shuffle.');}}
   catch(ex){root.alert?.(ex.message+' No additional action taken automatically.');}
   render();return true;
 }
 root.TET2CleanReset421=Object.freeze({html,action,inspect,keys:[...KEYS]});
})(typeof window!=='undefined'?window:globalThis);
