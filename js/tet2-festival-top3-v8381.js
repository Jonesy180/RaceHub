/* OTG! Main 8.0.381 — Festival Top 3 current-visit rehearsal.
 * The source identifies one approved OPEN EVENT, but does NOT supply a
 * verified official course or participant IDs. This rehearsal asks the
 * existing native FH5 Garage draw engine to pick three cars; a human supplies
 * a rehearsal route. Nothing calls rhSave or official honours/records/ledger.
 * Frozen fields and source integrity are fail-closed after any Garage change.
 */
(function(root,factory){'use strict';const api=factory(root);root.TET2FestivalTop3_381=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof window!=='undefined'?window:globalThis,function(root){
'use strict';
const SOURCE='TET2_FESTIVAL_TOP3_REHEARSAL_8381', EVENT='T2-FESTIVAL-TOP3',PREFIX='tet2.prelaunch.festival-top3.v8381.',S=x=>String(x??'').trim();
const esc=x=>S(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone=x=>JSON.parse(JSON.stringify(x));
const fail=msg=>{throw Error('Festival Top 3 rehearsal safe stop: '+msg);};
let draft=null;
function ctx(){
 const info=root.TET2EventRouter375?.inspect?.();
 if(!info?.row||info.row.eventId!==EVENT||info.row.origin!=='specialist'||info.row.format!=='TOP 3'||info.row.visit!==1||info.row.visitTotal!==1)fail('Choose Festival Top 3 / Open Event in Evil List.');
 if(!info.stamp||!root.TET2AssembledList379?.snapshot?.()?.audit?.ok)fail('Candidate schedule integrity could not be verified.');
 if(typeof root.TET2SlotDraw363?.selectFromGarage!=='function'||typeof root.TET2ResultsEntry360?.openTrial!=='function')fail('Native FH5 draw or saved time-entry engine missing.');
 const sp=root.rhSpace?.();if(!sp||sp.catalogueKey!=='fh5-catalogue-v1'||!S(sp.id)||!Array.isArray(sp.cars)||sp.cars.length<3)fail('Open a real FH5 Space with at least three owned cars.');
 const names=sp.cars.map(c=>S(c.id));if(names.some(id=>!id)||new Set(names).size!==names.length)fail('Garage car IDs are invalid.');
 const map=new Map(sp.cars.map(c=>[S(c.id),c]));return {info,sp,map};
}
function key(sp){return PREFIX+encodeURIComponent(S(sp.id));}
function read(sp){let raw;try{raw=root.localStorage?.getItem?.(key(sp));}catch(_){fail('Isolated rehearsal storage could not be read.');}
 if(!raw)return {schema:1,source:SOURCE,spaceId:S(sp.id),events:{}};
 let book;try{book=JSON.parse(raw);}catch(_){fail('Existing rehearsal record is damaged. Refusing to overwrite it.');}
 if(book?.schema!==1||book?.source!==SOURCE||book?.spaceId!==S(sp.id)||!book.events||Array.isArray(book.events)||typeof book.events!=='object')fail('Previously saved rehearsal record has an unexpected schema.');
 return book;
}
function write(sp,book){if(book.spaceId!==S(sp.id)||book.source!==SOURCE)fail('Rehearsal storage Space mismatch.');
 try{if(typeof root.localStorage?.setItem!=='function')fail('Isolated storage unavailable');root.localStorage.setItem(key(sp),JSON.stringify(book));}catch(_){fail('Unable to save locally. No result was accepted.');}}
function inspectRecord(rec,map,stamp){if(!rec)return;
 if(rec?.source!==SOURCE||rec.stamp!==stamp||!Array.isArray(rec.ids)||rec.ids.length!==3||new Set(rec.ids).size!==3||rec.ids.some(id=>!map.has(id)))fail('Garage or preview timetable changed after draw lock. Existing times are preserved but cannot be relabelled.');
 if(typeof rec.track!=='string'||rec.track.length<3||rec.track.length>100||!rec.saved||typeof rec.saved!=='object'||Array.isArray(rec.saved))fail('Saved rehearsal record is incomplete.');
 for(const [id,t] of Object.entries(rec.saved)){if(!rec.ids.includes(id)||!Number.isSafeInteger(t)||t<=0||t>=86400000)fail('Saved time does not belong to the frozen field.');}
}
function status(){const c=ctx(),book=read(c.sp),rec=book.events[EVENT]||null;inspectRecord(rec,c.map,c.info.stamp);
 return {...c,book,rec,banked:rec?Object.keys(rec.saved).length:0};}
function preview(){const c=status();if(c.rec)fail('This Event draw is already locked in rehearsal.');
 const result=root.TET2SlotDraw363.selectFromGarage({mode:'group',count:3,preview:true,competitionId:EVENT});
 if(!result||result.mode!=='group'||result.group?.length!==3||result.spaceId!==S(c.sp.id))fail('Native Garage draw did not return three unique cars.');
 const ids=result.group.map(x=>S(x.id));if(new Set(ids).size!==3||ids.some(id=>!c.map.has(id)))fail('Native draw included duplicate or non-owned cars.');
 draft={stamp:c.info.stamp,position:c.info.row.position,ids};return clone(draft);
}
function lock(track){const c=status();if(c.rec)fail('This stage has already been locked.');const name=S(track);
 if(name.length<3||name.length>100)fail('Enter a real practice route name (3–100 characters).');
 if(!draft||draft.stamp!==c.info.stamp||draft.position!==c.info.row.position||draft.ids.length!==3||new Set(draft.ids).size!==3||draft.ids.some(id=>!c.map.has(id)))fail('Draw preview expired. Generate a fresh draw before locking.');
 const rec={source:SOURCE,stamp:c.info.stamp,position:c.info.row.position,eventId:EVENT,track:name,ids:draft.ids.slice(),saved:{}};
 c.book.events[EVENT]=rec;write(c.sp,c.book);draft=null;return clone(rec);
}
function bank(p){const c=status(),rec=c.rec;if(!rec)fail('Lock the current rehearsal draw before saving results.');
 if(p?.mode!=='group'||S(p.slotId)!=='FESTIVAL-TOP3-REHEARSAL-'+c.info.row.position||S(p.competitionId)!==EVENT||p.trackIndex!==0||S(p.track)!==rec.track||!rec.ids.includes(S(p.carId))||Object.hasOwn(rec.saved,S(p.carId)))fail('Result belongs to another visit, route or car, or is already saved.');
 if(!Number.isSafeInteger(p.timeMs)||p.timeMs<=0||p.timeMs>=86400000)fail('Time must be a positive valid value.');
 rec.saved[S(p.carId)]=p.timeMs;write(c.sp,c.book);return {banked:Object.keys(rec.saved).length,required:3};
}
function open(){const c=status(),rec=c.rec;if(!rec)fail('Preview and lock this practice group first.');
 const cars=rec.ids.map(id=>{const car=c.map.get(id);return {id,name:S(car.name)||[car.make,car.model,car.year].filter(Boolean).join(' '),h:car.h===true,e:car.e===true};});
 root.TET2ResultsEntry360.openTrial({source:'TET2_DRAW_PRACTICE_V8363',spaceId:S(c.sp.id),slotId:'FESTIVAL-TOP3-REHEARSAL-'+c.info.row.position,competitionId:EVENT,
 label:'FESTIVAL TOP 3 · REHEARSAL ONLY',stageRehearsal:true,mode:'group',cars,tracks:[rec.track],saved:[clone(rec.saved)],onBank:async p=>bank(p),onExit:()=>root.TET2Stage4UI359?.page('race')});return {banked:c.banked,required:3};
}
function standings(rec,map){const all=rec.ids.map(id=>({id,time:rec.saved[id],name:S(map.get(id)?.name)||id})).filter(x=>x.time!==undefined).sort((a,b)=>a.time-b.time),done=all.length===3;
 const tied=all.some((x,i)=>i&&x.time===all[i-1].time);
 const fmt=x=>root.TET2ResultsEntry360?.display?.(x)||String(x);
 const li=all.map((r,i)=>`<li><b>${done&&!tied?['🥇','🥈','🥉'][i]:i+1+'.'} ${esc(r.name)}</b><span>${esc(fmt(r.time))}</span></li>`).join('');
 return `<div class="t2-r381-board"><h4>${done?(tied?'TIE · NO PROVISIONAL PODIUM':'PROVISIONAL TOP THREE · COMPLETE'):'TIMES BANKED · PROVISIONAL ORDER'}</h4><ol>${li||'<li>No saved times yet.</li>'}</ol>${done?`<p>${tied?'Equal times require a competition tie-breaker before standings can be finalised.':'Podium is a rehearsal preview only. No real medals or records awarded.'}</p>`:''}</div>`;
}
function html(info){if(info?.row?.eventId!==EVENT||info.row.origin!=='specialist')return '';
 try{const c=status(),rec=c.rec,active=draft?.stamp===c.info.stamp&&draft.position===c.info.row.position?draft:null;
 let part='';
 if(rec)part=`<p class="t2-r381-locked">🔒 ${esc(rec.track)} · ${c.banked}/3 times banked ${c.banked===3?'· COMPLETE ✓':''}</p>${standings(rec,c.map)}<button class="t2-btn" type="button" data-t2-top3="open">${c.banked===3?'VIEW':'RESUME'} SAVED TOP 3 RESULTS →</button>`;
 else if(active)part=`<p>Review the current three-car draw before locking. No future events are drawn.</p><ol class="t2-r381-roster">${active.ids.map((id,i)=>`<li><b>${i+1}</b> ${esc(c.map.get(id)?.name||id)}</li>`).join('')}</ol><label class="t2-r381-route">Practice track name<input id="t2-r381-track" type="text" maxlength="100" placeholder="FH5 racecourse"></label><button class="t2-btn" type="button" data-t2-top3="lock">🔒 LOCK TOP 3 REHEARSAL DRAW</button>`;
 else part=`<p>Three randomly chosen owned cars · one practice track · individual saved times.</p><button class="t2-btn" type="button" data-t2-top3="preview">🎲 PREVIEW THREE-CAR OPEN EVENT</button>`;
 return `<section class="t2-r381"><h3>🏆 FESTIVAL TOP 3 · OPEN EVENT</h3><p class="t2-r381-safe">PRELAUNCH REHEARSAL ONLY · Draw and times stay in isolated local storage. No live medals, records, official slots or Garage changes.</p><div id="t2-r381-error" role="alert" hidden></div>${part}<p class="t2-r381-foot">The source confirms a Festival Top 3 specialist visit, but its official entrant selection and assigned course are not yet verified. This three-car demonstration is not the final tournament specification.</p></section>`;
 }catch(err){return `<section class="t2-r381"><h3>🏆 FESTIVAL TOP 3 · OPEN EVENT</h3><p class="t2-r381-safe" role="alert">${esc(err.message)}</p><p>Rehearsal unavailable. Previously saved results have not been overwritten.</p></section>`;}
}
function action(ev,go){const b=ev.target?.closest?.('[data-t2-top3]');if(!b)return false;
 try{const act=b.dataset.t2Top3;if(act==='preview'){preview();go('race');}else if(act==='lock'){lock(root.document?.getElementById('t2-r381-track')?.value);go('race');}else if(act==='open'){open();go('entry');}else fail('Unknown action');}
 catch(err){const box=b.closest('.t2-r381')?.querySelector('#t2-r381-error');if(box){box.hidden=false;box.className='t2-r381-safe';box.textContent=S(err.message);}else root.console?.warn?.(err);}return true;
}
return Object.freeze({status,preview,lock,bank,open,html,action,version:'8.0.381'});
});
