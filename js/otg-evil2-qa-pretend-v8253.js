/* OTG! MAIN v8.0.253 — QA-only pretend result entry.
 * Fills ONLY missing results of the current verified R2 native slot (003–006).
 * Race Off must have its actual normal locked draw first. No hidden draw replacement.
 * Never intercepts official SAVE RESULT, awards honours or rewrites real times.
 */
(()=>{'use strict';
const CAMPAIGN='evil2-native-slot-launch-20261114',STATE='evil2NativeRun8250';
const native=()=>window.rhEvil2NativeNext8252;
const s=x=>String(x??'');
const id=(k)=>typeof window.rhId==='function'?window.rhId(k):'e2qa-'+k+'-'+Date.now()+'-'+Math.random().toString(36).slice(2);
const sp=()=>{const z=window.rhSpace?.();if(!z||z.catalogueKey!=='fh5-catalogue-v1')throw Error('Choose your FH5 Space.');return z;};
const book=z=>{const b=z?.[STATE];if(!b||b.campaign!==CAMPAIGN||!b.slots)throw Error('Evil 2.0 native slots have not started.');return b;};
const find=(z,n)=>{const b=book(z),e=b.slots[n];if(!e)throw Error('START this numbered slot in the native race engine first.');
 if(e.doneAt)throw Error('This slot is already DONE; pretend results are disabled.');
 for(let i=1;i<n;i++)if(!b.slots[i]?.doneAt)throw Error('Finish earlier numbered slots before testing this one.');
 const row=(n===6?z.runs:z.raceOffs||[]).find(x=>s(x.id)===s(n===6?e.runId:e.raceOffId));
 if(!row||row.evilCampaignR2?.campaign!==CAMPAIGN||Number(row.evilCampaignR2.slot)!==n)throw Error('Native slot identity missing/mismatched. No pretend results were added.');return row;};
const snap=(row)=>JSON.parse(JSON.stringify(row));
const restore=(row,prior)=>{for(const k of Object.keys(row))delete row[k];Object.assign(row,prior);};
const qaStamp=()=>new Date().toISOString();
function fillRaceOff(z,n,row){const ctl=native(),progress=ctl?.progress(z,n);if(!progress||progress.over)throw Error('Race Off progress not valid.');
 if(progress.ready)return{added:0,total:progress.target};
 const idx=Number(row.currentRoundIndex||0),rnd=row.rounds?.[idx];
 if(!rnd||!Array.isArray(rnd.matches)||!rnd.matches.length||!rnd.drawLockedAt||!rnd.drawPlan){
  throw Error('Open the normal Race Off, select a track and START THE DRAW first. Then tap ADD PRETEND RESULTS. The proper frozen draw must exist.');}
 if(idx!==0)throw Error('QA filler only supports verified preliminary Round 1 visits.');
 if(!rnd.name||!Array.isArray(row.entrants)||!Array.isArray(row.entryIds))throw Error('Draw track or frozen field missing.');
 const ids=new Set(row.entryIds.map(s));if(ids.size!==row.entryIds.length)throw Error('Frozen entrants have duplicate IDs.');
 const pre=new Set();for(const m of rnd.matches){const a=s(m.carA?.sourceCarId||m.carA?.id),b=s(m.carB?.sourceCarId||m.carB?.id);if(!a||!b||a===b||!ids.has(a)||!ids.has(b)||pre.has(a)||pre.has(b))throw Error('Native draw contains invalid/repeated car identities.');pre.add(a);pre.add(b);}
 const oldCount=ctl.pairings(row).length,remaining=progress.target-oldCount;
 if(remaining<1)return{added:0,total:progress.target};
 const unresolved=rnd.matches.filter(m=>!(m.status==='complete'&&m.resultA&&m.resultB&&m.winnerCarId));
 if(unresolved.length<remaining||oldCount+remaining>rnd.matches.length)throw Error('Native draw does not have enough unfinished matches for this slot.');
 if(rnd.matches.length!==progress.target&&n!==3)throw Error('Unexpected number of preliminary pairings — refusing to improvise the bracket.');
 if(unresolved.some(m=>m.resultA||m.resultB||(m.attempts||[]).length||m.winnerCarId))throw Error('A pairing has a partially saved real result. Finish it normally; pretend entry will not overwrite it.');
 const timestamp=qaStamp();let added=0;
 for(const m of unresolved.slice(0,remaining)){
  const a=s(m.carA?.sourceCarId||m.carA?.id),b=s(m.carB?.sourceCarId||m.carB?.id);const offset=oldCount+added;
  const mk=(car,carId,time)=>({id:id('raceoff-result'),carId,car:JSON.parse(JSON.stringify(car)),time,date:timestamp,track:s(rnd.name),layout:s(rnd.layout),roundLabel:s(rnd.drawPlan.label||'PRELIMINARY ROUND'),matchLabel:s(m.label||'PRELIMINARY'),raceOffRecord:false,trackRecord:false,personalBest:false,qaPretend:true});
  const ra=mk(m.carA,a,210.250+offset*2),rb=mk(m.carB,b,213.750+offset*2);
  m.attempts=[ra,rb];m.resultA=ra;m.resultB=rb;m.winnerCarId=a;m.loserCarId=b;m.status='complete';m.completedAt=timestamp;m.qaPretend=true;added++;
 }
 if(rnd.matches.every(m=>m.status==='complete')){rnd.status='raced';rnd.completedAt=timestamp;}
 row.status=row.status==='prepared'?'racing':row.status;row.updatedAt=timestamp;
 row.evil2QAPretend={...(row.evil2QAPretend||{}),count:(Number(row.evil2QAPretend?.count)||0)+added,lastUsedAt:timestamp,kind:'PRELAUNCH QA ONLY'};
 const after=ctl.progress(z,n);if(after.count!==progress.target||after.over)throw Error('Generated Race Off result count mismatch; rolled back.');
 return{added,total:after.target};
}
function fillFestival(z,n,row){const ctl=native(),progress=ctl?.progress(z,n);if(!progress||progress.over)throw Error('Festival progress invalid.');
 if(progress.ready)return{added:0,total:progress.target};
 const entries=row.entries||[],rounds=row.rounds||[],old=row.results||[];if(!Array.isArray(entries)||!Array.isArray(rounds)||!Array.isArray(old)||rounds.length!==2||new Set(entries.map(s)).size!==entries.length||entries.length*2!==progress.target)throw Error('Native Festival field or routes invalid.');
 const known=new Set(entries.map(s)),route=new Set(rounds.map(x=>s(x.id))),done=new Set();for(const r of old){const car=s(r.carId),rd=s(r.roundId);if(!known.has(car)||!route.has(rd)||done.has(car+'|'+rd))throw Error('Existing real Festival results contain a conflict: refusing pretend data.');done.add(car+'|'+rd);}
 const stamp=qaStamp();let added=0;
 for(let i=0;i<entries.length;i++)for(let j=0;j<rounds.length;j++){const car=s(entries[i]),rd=s(rounds[j].id),key=car+'|'+rd;if(done.has(key))continue;
  old.push({id:id('result'),carId:car,roundId:rd,roundName:s(rounds[j].name),time:220.500+i*2+j*.750,position:null,date:stamp,championshipRecord:false,trackRecord:false,allTime:false,qaPretend:true});done.add(key);added++;}
 row.results=old;row.updatedAt=stamp;row.evil2QAPretend={...(row.evil2QAPretend||{}),count:(Number(row.evil2QAPretend?.count)||0)+added,lastUsedAt:stamp,kind:'PRELAUNCH QA ONLY'};
 const after=ctl.progress(z,n);if(after.count!==progress.target||after.over)throw Error('Generated Festival result count mismatch; rolled back.');return{added,total:after.target};
}
function fill(n){n=Number(n);if(![3,4,5,6].includes(n))throw Error('Pretend results are currently available only for prelaunch Slots 003–006.');
 const z=sp(),row=find(z,n),old=snap(row);
 try{const ret=n===6?fillFestival(z,n,row):fillRaceOff(z,n,row);if(typeof window.rhSave!=='function')throw Error('Native OTG save function unavailable.');window.rhSave();return ret;}catch(e){restore(row,old);throw e;}
}
let status='';
function testButton(n){const b=document.createElement('button');b.type='button';b.className='e2slot-secondary e2qa-pretend';b.dataset.qaPretendSlot=s(n);b.style.cssText='display:block;width:100%;margin-top:12px;border:1px dashed #efc66e;border-radius:12px;padding:14px;color:#ffdd90;background:#25200f;font-weight:800;';b.textContent='🎭 ADD PRETEND RESULTS — QA ONLY';return b;}
function mountPanel(){const host=document.getElementById('e2-native-next-screen-v8251');if(!host||host.style.display==='none')return;const card=host.querySelector('.e2slot-card');if(!card)return;
 const slot=Number(card.querySelector('h1')?.textContent?.match(/SLOT\s*(\d+)/i)?.[1]);if(![3,4,5,6].includes(slot)||card.querySelector('[data-e2n="done"]')||card.textContent.includes('— LOCKED')||card.textContent.includes('SLOT '+String(slot).padStart(3,'0')+' DONE'))return;
 if(!card.querySelector('.e2qa-pretend')){const b=testButton(slot);card.appendChild(b);const info=document.createElement('p');info.className='small e2qa-explain';info.textContent='QA TEST ONLY: fills unfinished native results with labelled pretend times. Existing real times stay untouched. Race Off requires its normal draw first. This is NOT for live racing.';card.appendChild(info);}
}
function mountRace(){const host=document.getElementById('raceoff');if(!host||host.classList.contains('hidden')||host.querySelector('.e2qa-pretend'))return;
 const z=window.rhSpace?.(),booked=z?.[STATE];if(booked?.campaign!==CAMPAIGN)return;
 const idNow=s(window.rhCurrentRaceOffId),n=[3,4,5].find(i=>booked.slots?.[i]?.raceOffId&&s(booked.slots[i].raceOffId)===idNow&&!booked.slots[i].doneAt);
 if(!n)return;const row=(z.raceOffs||[]).find(x=>s(x.id)===idNow);if(!row||!row.rounds?.[0]?.drawLockedAt||!row.rounds?.[0]?.matches?.length)return;
 const progress=native()?.progress(z,n);if(!progress||progress.ready||progress.over)return;
 const container=host.querySelector('.rhFestivalBodyV1, .rhContent, main')||host;
 const b=testButton(n);b.style.maxWidth='700px';container.insertBefore(b,container.firstChild);
}
function showStatus(message,ok=false){let p=document.getElementById('e2qa-message-8253');if(!p){p=document.createElement('div');p.id='e2qa-message-8253';p.style.cssText='position:fixed;z-index:999999;top:calc(env(safe-area-inset-top, 0px) + 12px);left:12px;right:12px;padding:14px;border-radius:12px;background:#4a1c20;color:white;border:2px solid #ee8990;font-size:14px;font-weight:750;box-shadow:0 8px 24px #0008;';document.body.appendChild(p);p.addEventListener('click',()=>p.remove());}
 p.style.background=ok?'#124436':'#4a1c20';p.style.borderColor=ok?'#79dab4':'#ee8990';p.textContent=message+'  ·  TAP TO DISMISS';}
function handle(e){const b=e.target.closest('button[data-qa-pretend-slot]');if(!b)return;e.preventDefault();e.stopPropagation();const n=Number(b.dataset.qaPretendSlot);
 if(!window.confirm('QA ONLY — This will add labelled PRETEND race times to Slot '+String(n).padStart(3,'0')+' in your REAL OTG! Space. They are NOT genuine track records. Existing entered times will not be overwritten. Continue?'))return;
 try{const {added,total}=fill(n);native().open(n);showStatus('🎭 QA RESULTS ADDED: '+added+'. Slot '+String(n).padStart(3,'0')+' now has '+total+'/'+total+'. Review and MARK DONE.',true);}catch(err){showStatus('PRETEND RESULTS NOT ADDED — '+s(err.message||err));}
}
let queued=false;function queue(){if(queued)return;queued=true;setTimeout(()=>{queued=false;mountPanel();mountRace();},80);}
function init(){document.addEventListener('click',handle,true);const root=document.body;if(root)new MutationObserver(queue).observe(root,{childList:true,subtree:true});queue();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.rhEvil2QAPretend8253={fill,fillRaceOff,fillFestival,version:'8.0.253'};
})();
