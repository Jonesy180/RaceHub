/* OTG! MAIN v8.0.249: REAL existing OTG! Enter Result UI, isolated prelaunch adapter.
 * Does NOT call native save. Does NOT write official Space, rhSave, medals, or reset.
 * Native UI called at runId prefix only; all native functions left unchanged for genuine runs. */
(()=>{'use strict';
const PREFIX='otg.evil2.prelaunch.native.v8249:';
let native=null;
const cockpit=()=>window.rhEvil2FirstRaceCockpit8246;
const safeId=x=>String(x??'');
const fn=t=>typeof window[t]==='function';
const normalRuns=window.rhCurrentRuns;
const normalSaveFinal=window.rhSaveResultFinal;
const normalSave=window.rhSaveResult;
const normalLeave=window.rhLeaveEnterResult;
const normalOpenRun=window.rhOpenRun;
function activeFor(id){return !!(native&&safeId(id)===native.runId&&safeId(id).startsWith(PREFIX));}
function close(){native=null;window.rhFestivalEntryContext8080=null;}
function error(err){const msg=String(err?.message||err);close();try{window.show?.('festival')}catch(_){}cockpit()?.failedNative(msg);}
// The detached run exists ONLY in memory and is never appended to rhSpace().runs.
// Put next car/round first to honour native save integrity guards from v8082.
function runFor(d,n){const ids=[n.car.id,...d.carIds.filter(id=>id!==n.car.id)];
 const rounds=[n.track,1-n.track].map(i=>({id:PREFIX+d.slot+':route:'+i,name:d.tracks[i],trackIndex:i}));
 const results=[];for(const id of d.carIds)for(let i=0;i<2;i++)if(d.results[id][i]!==null)
  results.push({id:'pilot-'+id+'-'+i,carId:id,roundId:PREFIX+d.slot+':route:'+i,roundName:d.tracks[i],time:d.results[id][i]/1000,position:null});
 return {id:PREFIX+encodeURIComponent(d.spaceId)+':'+d.slot,name:'EVIL 2.0 PRELAUNCH — '+d.eventName,
  type:'festival',format:'evil2-prelaunch-native-entry',status:'active',entries:ids,rounds,results,
  pilotOnly:true,evil2Prelaunch:true,sourceSlot:d.slot,createdAt:d.createdAt};}
function open(target){try{
 if(!target?.card||!target.next||!target.space)throw Error('Source-backed pilot target missing');
 if(native)throw Error('Finish or leave the current pilot entry first');
 if(!fn('rhEnterResult')||typeof normalRuns!=='function'||typeof normalSaveFinal!=='function')throw Error('Existing OTG! Festival result-entry API is unavailable');
 const {card:d,next:n,space}=target;
 if(space.id!==d.spaceId||!space.cars?.some(c=>safeId(c.id)===safeId(n.car.id)))throw Error('Pilot car is not in active Space Garage');
 const r=runFor(d,n),runId=r.id,roundId=PREFIX+d.slot+':route:'+n.track;
 const oldRuns=normalRuns();if(oldRuns.some(x=>safeId(x.id)===runId))throw Error('Prelaunch ID collides with official run');
 native={runId,spaceId:d.spaceId,slot:d.slot,carId:n.car.id,track:n.track,roundId,cardCreatedAt:d.createdAt,run:r};
 // Hide pilot body, but present the existing native Festival Enter Result markup / Advanced Timing.
 const pilot=document.getElementById('otg-e2-first-race-screen-v8246');if(pilot)pilot.style.display='none';
 window.rhEnterResult(runId,n.car.id,roundId);
 // Guard against silent native no-op or screen mismatch.
 const nativeFields=document.getElementById('rhMin')&&document.getElementById('rhSec')&&document.getElementById('rhMs');
 if(!nativeFields)throw Error('Native Enter Result stopwatch did not open; no time was saved');
 const host=document.querySelector('#festival .rh5801Entry')||document.querySelector('#festival .rhResultEntry')||document.getElementById('festival');
 if(host){const banner=document.createElement('div');banner.id='e2native-notice-v8249';banner.setAttribute('role','status');
 banner.innerHTML='<b>EVIL 2.0 — PRELAUNCH ONLY</b><small>This is the existing OTG! result screen. Save writes ONLY to isolated test card. No official records or medals.</small><button type="button" id="e2native-back-v8249">← RETURN TO PRELAUNCH CARD</button>';
 host.prepend(banner);banner.querySelector('button').addEventListener('click',()=>{close();try{window.show?.('festival')}catch(_){}cockpit()?.show()});}
 }catch(err){error(err);}
}
// Existing native rhCurrentRuns API sees one additional ephemeral pilot run ONLY
// while testing. All existing runs are returned unmodified.
if(typeof normalRuns==='function')window.rhCurrentRuns=function(){const runs=normalRuns.apply(this,arguments);return native?Array.isArray(runs)?runs.concat([native.run]):runs:runs;};
function readStopwatch(){const q=id=>document.getElementById(id);
 const raw=[q('rhMin')?.value,q('rhSec')?.value,q('rhMs')?.value];
 if(raw.some(v=>v==null||!/^\d{1,3}$/.test(String(v))))throw Error('Complete minutes, seconds and milliseconds on the native stopwatch');
 const [min,sec,milli]=raw.map(Number);if(sec>=60||milli>=1000||min>999)throw Error('Native stopwatch time is invalid');
 const ms=(min*60+sec)*1000+milli;if(ms<1||ms>=86400000)throw Error('Enter a valid positive race time');
 const rawPos=q('rhPosition')?.value||'';let position=null;if(/^\d+$/.test(rawPos)&&Number(rawPos)>0)position=Number(rawPos);
 const panel=document.querySelector('#festival .rhAdvancedTimingV6013');const laps=[];
 if(panel&&panel.classList.contains('open')){for(const row of panel.querySelectorAll('.rhATLapRowV6015')){
 const p=['Min','Sec','Ms'].map(s=>row.querySelector('[data-part="'+s+'"]')?.value||'');
 if(p.some(v=>!/^\d+$/.test(v)))throw Error('Complete every Advanced Timing lap before saving');
 if(Number(p[1])>=60||Number(p[2])>=1000)throw Error('Invalid Advanced Timing lap');
 laps.push((Number(p[0])*60+Number(p[1]))*1000+Number(p[2]));}
 if(laps.length&&laps.reduce((a,b)=>a+b,0)!==ms)throw Error('Advanced Timing laps must add up to total time');}
 return{ms,position,laps};}
function saveNative(runId,carId,roundId){if(!activeFor(runId))return;
 try{
 if(safeId(carId)!==safeId(native.carId)||safeId(roundId)!==safeId(native.roundId))throw Error('Pilot car or track changed; no result saved');
 const {card,next,space}=cockpit().nativeTarget();
 if(card.spaceId!==native.spaceId||card.slot!==native.slot||card.createdAt!==native.cardCreatedAt||space.id!==native.spaceId||safeId(next.car.id)!==safeId(carId)||next.track!==native.track)throw Error('Pilot target no longer matches frozen draw');
 const t=readStopwatch();const saved=cockpit().recordFromNative({...t,slot:card.slot,carId,track:native.track});
 if(saved.results[carId][native.track]!==t.ms)throw Error('Pilot confirmation failed');close();
 try{window.show?.('festival')}catch(_){}cockpit()?.show(true);
 }catch(err){const msg=String(err?.message||err);const b=document.getElementById('e2native-notice-v8249');if(b){
 const warn=document.getElementById('e2native-error-v8249')||document.createElement('p');warn.id='e2native-error-v8249';warn.textContent='NOT SAVED — '+msg;b.appendChild(warn);}
 else error(err);
 }
}
if(typeof normalSaveFinal==='function')window.rhSaveResultFinal=function(runId,carId,roundId){if(activeFor(runId))return saveNative(runId,carId,roundId);return normalSaveFinal.apply(this,arguments);};
if(typeof normalSave==='function')window.rhSaveResult=function(runId,carId,roundId){if(activeFor(runId))return saveNative(runId,carId,roundId);return normalSave.apply(this,arguments);};
if(typeof normalLeave==='function')window.rhLeaveEnterResult=function(runId){if(activeFor(runId)){close();try{window.show?.('festival')}catch(_){}return cockpit()?.show();}return normalLeave.apply(this,arguments);};
if(typeof normalOpenRun==='function')window.rhOpenRun=function(runId){if(activeFor(runId)){close();try{window.show?.('festival')}catch(_){}return cockpit()?.show();}return normalOpenRun.apply(this,arguments);};
document.addEventListener('click',ev=>{if(native&&ev.target.closest('nav button,[data-screen]'))close();},true);
window.addEventListener('pagehide',close);
window.rhEvil2NativeEntryBridge8249={open,isPilotActive:()=>!!native,close};
})();
