/* OTG! MAIN 8.0.431 — real, opt-in TET2 campaign fresh start.
 * The 8.0.421 test reset was gated to EXACTLY 12 fake test slots and is
 * intentionally never reused. This resets the real, partially completed
 * tournament ONLY in the active FH5 catalogue Space after backup+confirmation.
 * Deletes exactly three dedicated Space keys and the TET2-only course lock.
 * Preserves ownership, every other Space, OTG runs, OTG history, settings,
 * native backups, safety backups, and world-choice settings.
 */
(function(root){'use strict';
 const KEYS=Object.freeze(['tet2RaceControlV8397','tet2OfficialSlotLedgerV8361','tet2Stage3HonoursV8358','tet2RecordAwardsV8439']);
 const ROUTE_KEY='tet2-fh5-course-lock-v8396';
 const SOURCE='TET2_CONTROLLED_CHAOS_LOCKED_V1';
 const E=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const clone=x=>JSON.parse(JSON.stringify(x));
 const fail=s=>{throw Error('TET2 fresh start: '+s);};
 let downloaded=null, completed=false;
 const storeKey=()=>typeof RH_FINAL_STORE!=='undefined'?RH_FINAL_STORE:null;
 const getRaw=()=>{const key=storeKey();if(!key)fail('Native OTG! storage key unavailable; no data changed');
   const value=root.localStorage?.getItem(key);if(!value)fail('Native saved data missing; no data changed');return value;};
 const parse=raw=>{let obj;try{obj=JSON.parse(raw)}catch(_){fail('Saved data is not valid JSON');}
   if(!obj||!Array.isArray(obj.spaces))fail('Saved Spaces structure is invalid');return obj;};
 const has=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
 function inspect(){
   const sp=root.rhSpace?.();
   if(!sp||sp.catalogueKey!=='fh5-catalogue-v1'||!sp.id||!Array.isArray(sp.cars)||!sp.cars.length)
     fail('Open your original FH5 Catalogue Space first');
   if(typeof root.rhSave!=='function')fail('Native OTG! save function unavailable');
   const raw=getRaw(),full=parse(raw);
   const matches=full.spaces.filter(s=>String(s.id)===String(sp.id));
   if(matches.length!==1)fail('The FH5 Space is not unique in your saved data');
   const stored=matches[0];
   const keys=KEYS.filter(k=>has(sp,k)||has(stored,k));
   if(!keys.length)return {sp,full,raw,keys,space:stored,count:0,completed:0};
   for(const k of KEYS){
     if(has(sp,k)!==has(stored,k)||has(sp,k)&&JSON.stringify(sp[k])!==JSON.stringify(stored[k]))
       fail('Live and saved tournament data differ for '+k+'; save or reopen OTG! before restarting');
   }
   if(has(sp,KEYS[0])){
     const b=sp[KEYS[0]];
     if(!b||b.schema!==1||String(b.spaceId)!==String(sp.id)||!b.events||!b.definitions||!b.signature)
       fail('Race Control data does not match the known isolated TET2 format');
   }
   if(has(sp,KEYS[1])){
     const l=sp[KEYS[1]];
     if(!l||l.schema!==1||String(l.spaceId)!==String(sp.id)||l.source!==SOURCE||!l.slots||Array.isArray(l.slots))
       fail('Official slot ledger is not a compatible TET2 campaign');
   }
   if(has(sp,KEYS[2])){
     const m=sp[KEYS[2]];
     if(!m||m.schema!==1||String(m.spaceId)!==String(sp.id)||!m.receipts||Array.isArray(m.receipts))
       fail('TET2 honours data is not in the expected isolated format');
   }
   if(has(sp,'tet2RecordAwardsV8439')){const a=sp.tet2RecordAwardsV8439;if(a?.schema!==1||String(a.spaceId)!==String(sp.id)||!a.items||!a.seen)fail('TET2 record awards are not in the expected isolated format');}
   const slots=Object.values(sp[KEYS[1]]?.slots||{});
   return {sp,full,space:stored,raw,keys,count:slots.length,completed:slots.filter(s=>!!s.completedAt).length};
 }
 function download(){
   const x=inspect();if(!x.keys.length)fail('No TET2 campaign to reset');
   const stamp=new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
   const url=root.URL.createObjectURL(new Blob([x.raw],{type:'application/json'}));
   const a=root.document.createElement('a');a.href=url;a.download='OTG_FULL_BACKUP_BEFORE_FRESH_TET2_'+stamp+'.json';
   root.document.body.appendChild(a);a.click();a.remove();
   setTimeout(()=>root.URL.revokeObjectURL(url),60000);
   downloaded={spaceId:String(x.sp.id),raw:x.raw,routeKey:root.localStorage.getItem(ROUTE_KEY)};
   return a.download;
 }
 function withoutTET2(full,id){
   const saved=clone(full),sp=saved.spaces.find(s=>String(s.id)===id);
   if(!sp)fail('Original FH5 Space disappeared during reset');
   for(const k of KEYS)delete sp[k];return saved;
 }
 function perform(){
   if(!downloaded)fail('Download and check the full OTG! backup first');
   const x=inspect();
   if(!x.keys.length)fail('Nothing remains to reset');
   if(downloaded.spaceId!==String(x.sp.id)||downloaded.raw!==x.raw||downloaded.routeKey!==root.localStorage.getItem(ROUTE_KEY))
     fail('Saved state changed after backup; download a fresh backup first');
   if(!root.confirm('START OVER FROM EVIL LIST SLOT 001?\n\nThis permanently discards the current TET2-only slots, race times, frozen draws, medals, awards and TET2 track lock.\n\nYour Garage, ordinary OTG! history/results, other Spaces and settings will stay untouched. Have you checked the backup is in Downloads?'))
     return {cancelled:true};
   if(root.prompt('Type START TET2 to confirm wiping this TET2 tournament ONLY:','')!=='START TET2')return {cancelled:true};
   const originals=Object.fromEntries(KEYS.filter(k=>has(x.sp,k)).map(k=>[k,clone(x.sp[k])]));
   let saved=false;
   try{
     for(const k of KEYS)delete x.sp[k];
     root.rhSave();saved=true;
     const after=parse(getRaw()),s=after.spaces.find(q=>String(q.id)===String(x.sp.id));
     if(!s||KEYS.some(k=>has(s,k)||has(x.sp,k)))fail('Tournament keys were not cleared');
     if(JSON.stringify(after)!==JSON.stringify(withoutTET2(x.full,String(x.sp.id))))
       fail('Unexpected change outside the isolated TET2 keys — reset cancelled');
     // This is a TET2-ONLY global course lock, not OTG! track metadata.
     if(downloaded.routeKey!==null){
       root.localStorage.removeItem(ROUTE_KEY);
       if(root.localStorage.getItem(ROUTE_KEY)!==null)fail('Old TET2 course lock could not be cleared');
     }
     completed=true;downloaded=null;
     return {ok:true,completed:x.completed,started:x.count};
   }catch(err){
     for(const k of KEYS){if(has(originals,k))x.sp[k]=originals[k];else delete x.sp[k];}
     if(saved){try{root.rhSave();}catch(rollbackErr){root.console?.error?.('TET2 rollback failed; recover using downloaded full OTG backup',rollbackErr);}}
     if(downloaded?.routeKey!==null&&root.localStorage.getItem(ROUTE_KEY)===null){
       try{root.localStorage.setItem(ROUTE_KEY,downloaded.routeKey);}catch(_){/* Backup remains downloadable. */}
     }
     downloaded=null;throw err;
   }
 }
 function html(){
   if(completed)return '<section class="t2-reset421"><h3>✅ FRESH TOURNAMENT READY</h3><p>Old TET2 slots and results cleared. Open Race Control for <strong>Slot 001</strong>, with the corrected original FH5 stock-class championships. OTG! Garage and regular racing were preserved.</p></section>';
   let x;try{x=inspect()}catch(e){return `<section class="t2-reset421" role="alert"><h3>🔒 TET2 START-OVER CHECK</h3><p>${E(e.message)}</p></section>`;}
   if(!x.keys.length)return '';
   return `<section class="t2-reset421"><h3>🏁 FRESH EVIL TOURNAMENT · SLOT 001</h3><p><b>${x.completed} completed slot${x.completed===1?'':'s'}, ${x.count} started</b> · full original FH5 classes are ready. Start fresh to rebuild the Custom Upgrade groups correctly.</p><p>Only TET2 race times, locked draws, TET2 medals and the old TET2 track lock are discarded. Your Garage, normal racing and settings stay.</p><button type="button" class="t2-reset421-backup" data-t2-start431="backup">⬇ 1. DOWNLOAD FULL OTG! BACKUP</button><button type="button" class="t2-reset421-clear" data-t2-start431="reset" ${downloaded?.spaceId===String(x.sp.id)?'':'disabled'}>🏁 2. START AGAIN AT SLOT 001</button><small>The backup needs to be saved on your phone before resetting. A final confirmation is required. No reset happens automatically on install.</small></section>`;
 }
 function action(e,render){
   const btn=e.target.closest?.('[data-t2-start431]');if(!btn)return false;
   try{
     if(btn.dataset.t2Start431==='backup'){
       const name=download();root.alert?.('Full OTG! backup download requested: '+name+'\nCheck your Downloads folder before pressing START AGAIN.');
     }else if(btn.dataset.t2Start431==='reset'){
       const r=perform();if(r?.ok)root.alert?.('Fresh TET2 tournament ready. Slot 001 is next. The original OTG! Garage, other Spaces and regular racing are unchanged.');
     }
   }catch(ex){root.alert?.(ex.message+'\nNo automatic data reset was performed. If a save failed, the backup is available for recovery.');}
   render();return true;
 }
 root.TET2FreshStart431=Object.freeze({html,action,inspect,keys:[...KEYS],routeKey:ROUTE_KEY});
})(typeof window!=='undefined'?window:globalThis);
