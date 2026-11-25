/* TET2 v8.0.435 — four-track historical Festival stage fix; late-roster bracket safety. Uses ONLY the source-backed
   R1 rule/visits, the live FH5 Garage and official v8361 results ledger.
   No rehearsal or diagnostic data is written. No invented event IDs. */
(function(root,factory){'use strict';const api=factory(root);root.TET2HistoricalLive401=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof window!=='undefined'?window:globalThis,function(root){'use strict';
const S=x=>String(x??'').trim(), lower=x=>S(x).toLocaleLowerCase('en-GB').replace(/[&\/_\-]/g,' ').replace(/\s+/g,' ').trim();
const clone=x=>JSON.parse(JSON.stringify(x));const fail=s=>{throw Error('Historical event: '+s);};
const hash=s=>{let h=2166136261;for(const x of String(s)){h^=x.charCodeAt(0);h=Math.imul(h,16777619);}return(h>>>0).toString(16);};
const stable=(ids,seed)=>[...ids].sort((a,b)=>hash(seed+'|'+a).localeCompare(hash(seed+'|'+b))||a.localeCompare(b));
const offroad=new Set(['pickups 4x4','rally monsters','unlimited offroad','retro rally','classic rally','modern rally','unlimited buggies','offroad','utvs','buggies','trucks']);
const raceTypes=new Set(['vintage racers']);const mixedTypes=new Set(['track toys','extreme track toys','classic racers']);
const aliases={'hypercar':'hypercars','hypercars':'hypercar','classic sports':'classic sports cars','modern supercar':'modern supercars','modern sports car':'modern sports cars','retro supercars':'retro super cars','rods customs':'rods and customs','sports utility':'sports utility heroes','utility':'vans utility'};
function ecosystem(c){const name=[c.make,c.model,c.name].join(' '),type=lower(c.classType),marker=/#\d{1,5}\b|\b(?:gte|gtlm|lmp|gt3 r|amr pro|super trofeo|competizione|fxx|ccgt|bt62|scv12)\b/i;
 if(/\bforza edition\b|\bfe\b/i.test(name))return 'FORZA EDITION';if(type==='drift cars')return 'DRIFT';if(offroad.has(type))return 'OFF-ROAD / BUGGY';if(raceTypes.has(type)||(mixedTypes.has(type)&&marker.test(name)))return 'RACE';return 'NORMAL';}
function isEco(c,expected){if(!expected)return true;const eco=ecosystem(c);return eco===expected||(eco==='NORMAL'&&expected==='RACE'&&mixedTypes.has(lower(c.classType)));}
function srcFor(row){const src=root.TET2HistoricalSource382?.[row.eventId];if(!src||!Array.isArray(src.visits)||!src.visits.length)fail('Unrecognised R1 event identity '+row.eventId);return src;}
function roster(sp,row,src){const rule=S(src.rule),family=S(row.family),name=S(row.name),orig=sp.cars, allTypes=[...new Set(orig.map(c=>lower(c.classType)))];let candidate=orig,hint='';
 const maker=[...new Set(orig.map(c=>S(c.make)).filter(Boolean))].sort((a,b)=>b.length-a.length).find(m=>name.toLowerCase().startsWith(m.toLowerCase()+' ')||lower(name)===lower(m));
 if(family==='Manufacturer'&&maker){candidate=candidate.filter(c=>S(c.make)===maker);hint='Manufacturer '+maker;}
 else {const decade=(name+' '+rule).match(/\b(19\d0|20\d0)s\b/);if(decade){const y=Number(decade[1]);candidate=candidate.filter(c=>Number(c.year)>=y&&Number(c.year)<y+10);hint='Source decade '+decade[1]+'s';}
 else if(/^Vintage\b/i.test(name)){candidate=candidate.filter(c=>Number(c.year)>0&&Number(c.year)<=1949);hint='Vintage ≤1949';}
 else if(/^Classic\b/i.test(name)){candidate=candidate.filter(c=>Number(c.year)>=1950&&Number(c.year)<=1990);hint='Classic 1950–1990';}
 else {let typ=rule.match(/\bcars in (.+)$/i)?.[1]||rule.match(/^normal (.+?) cars$/i)?.[1]||rule.match(/OFF-ROAD \/ BUGGY (.+)$/i)?.[1]||rule.match(/(?:Race Cars|Off-Road)\s*[—–-]\s*([^,]+)$/i)?.[1];
   if(!typ&&family==='Class / Type')typ=name.replace(/\s+(Normal|Race|Festival|Race Off|Championship).*$/i,'');
   if(typ){typ=lower(typ.replace(/\s+(Championship|Race Off)$/i,''));const types=new Set([typ,lower(aliases[typ]||'')]);const actual=allTypes.filter(t=>types.has(t));if(actual.length){candidate=candidate.filter(c=>types.has(lower(c.classType)));hint='FH5 Class/Type '+typ;}}
 }
 }
 if(src.ecosystem){const eco=candidate.filter(c=>isEco(c,src.ecosystem));if(eco.length>=2)candidate=eco;}
 const ids=candidate.map(c=>S(c.id));if(ids.length<2||new Set(ids).size!==ids.length)fail('No valid original-category Garage field for '+row.name+' ('+S(src.rule)+'). Review this competition when reached.');
 return {ids,rule:rule,hint:hint||'Source ecosystem '+S(src.ecosystem),sourceCount:Number(src.sourceCount)};}
function rowsFor(rows,eventId){return rows.filter(r=>r.eventId===eventId).sort((a,b)=>a.visit-b.visit);}
function sourceRows(visits,src){let i=0;return visits.map(r=>{if(r.format==='BRONZE')return {row:r,source:null,phase:'Bronze',br:true};const v=src.visits[i++];if(!v||v.fmt!==r.format||Number(v.workload)!==Number(r.workload))fail('R1 visit shape changed for '+r.eventId+' visit '+r.visit);
 const a=S(v.action).toUpperCase(),phase=r.mode==='Race Off'?(a.startsWith('PRELIMINARY')?'Preliminary':a.startsWith('QUARTER')?'Quarterfinals':a.startsWith('SEMI')?'Semifinals':a.startsWith('FINAL')?'Final':a.match(/^ROUND OF \d+/)?.[0]||a.split(' •')[0]):(a.match(/STAGE \d+/)?.[0]||'Standard rounds');return {row:r,source:v,phase,br:false};});}
function phases(rows,src){const chunks=[];for(const item of sourceRows(rows,src)){let c=chunks.at(-1);if(!c||c.label!==item.phase){c={label:item.phase,items:[]};chunks.push(c);}c.items.push(item);}return chunks;}
function slotOf(sp,r){return sp.tet2OfficialSlotLedgerV8361?.slots?.['TET2-'+r.position];}
function matchResults(sp,b,phase){const out=[];for(const item of phase.items){const r=item.row,spec=b.definitions[String(r.position)],slot=slotOf(sp,r);if(!slot?.completedAt||!spec||spec.mode!=='raceoff'||!slot.definition||slot.definition.lockHash!==spec.lockHash)fail('Earlier '+phase.label+' stage must be raced first');for(const m of spec.matches){const v=slot.results?.['m:'+m.id];if(!v||!Number.isSafeInteger(v.a)||!Number.isSafeInteger(v.b)||v.a<=0||v.b<=0||v.a===v.b||v.winnerId!==(v.a<v.b?m.carIds[0]:m.carIds[1]))fail('Missing verified match result');out.push({winner:v.winnerId,loser:m.carIds.find(x=>x!==v.winnerId)});}}return out;}
function timings(sp,b,items){const out=[];for(const item of items){const r=item.row,spec=b.definitions[String(r.position)],slot=slotOf(sp,r);if(!spec||!slot?.completedAt||spec.mode!=='group'||!slot.definition||slot.definition.lockHash!==spec.lockHash)fail('Earlier Festival results not complete');for(const id of spec.carIds){let total=0;for(let i=0;i<spec.tracks.length;i++){const t=slot.results?.['g:'+i+':'+id];if(!Number.isSafeInteger(t)||t<=0)fail('Saved Festival time missing');total+=t;}out.push({id,total});}}return out;}
function unique(list){if(new Set(list).size!==list.length)fail('Duplicate entrant in source-defined stage');return list;}
function sourceTracks(assign,count){if(!assign||!Array.isArray(assign.tracks)||assign.tracks.length<count)fail('Verified FH5 routes missing for this stage ('+count+' required)');return assign.tracks.slice(0,count).map(t=>S(t.name));}
function ensureEvent(b,sp,row,src){if(!b.events[row.eventId]){const r=roster(sp,row,src);
  if(row.mode==='Race Off'&&Array.isArray(b.baseCars)){
   const base=roster({...sp,cars:b.baseCars},row,src);
   if(base.ids.length!==r.ids.length)fail('Late Garage car changes the fixed historical Race Off bracket size for '+row.name+'. Existing slots stay protected; a qualifying-stage extension is needed before starting this knockout.');
  }
  b.events[row.eventId]={name:row.name,field:stable(r.ids,row.eventId+'|'+S(sp.id)+'|'+b.signature),sourceRule:r.rule,selection:r.hint,sourceCount:r.sourceCount,roundByes:{}};}const e=b.events[row.eventId];if(!Array.isArray(e.field)||e.field.length<2||new Set(e.field).size!==e.field.length||e.field.some(id=>!sp.cars.some(c=>S(c.id)===id)))fail('Original competition roster no longer matches owned Garage');return e;}
function phaseIndex(groups,position){return groups.findIndex(g=>g.items.some(x=>x.row.position===position));}
function koPlan(b,sp,row,visits,src,assign){const event=ensureEvent(b,sp,row,src),groups=phases(visits,src),idx=phaseIndex(groups,row.position),grp=groups[idx];if(idx<0)fail('Stage not in source');
 let ids;if(idx===0)ids=[...event.field];else if(grp.label==='Bronze'){const semi=groups.find(g=>g.label==='Semifinals');if(!semi)fail('Source has no semifinals for bronze');ids=matchResults(sp,b,semi).map(m=>m.loser);}
 else if(grp.label==='Final'){const semi=groups.find(g=>g.label==='Semifinals');if(semi){ids=matchResults(sp,b,semi).map(m=>m.winner);const bronze=groups.find(g=>g.label==='Bronze');if(bronze)matchResults(sp,b,bronze);}else ids=matchResults(sp,b,groups[idx-1]).map(m=>m.winner);}
 else{const prev=groups[idx-1],wins=matchResults(sp,b,prev).map(m=>m.winner);ids=[...(event.roundByes?.[prev.label]||[]),...wins];}
 unique(ids);const expected=grp.label==='Bronze'?2:grp.items.reduce((n,x)=>n+Number(x.row.workload||0),0);if(expected%2||expected<2||ids.length<expected)fail('Source knockout phase requires '+expected+' entrants, but only '+ids.length+' are available. Review this event when reached.');
 const seed=row.eventId+'|'+grp.label+'|'+b.signature;
 const ordered=stable(ids,seed),byes=ordered.slice(0,ids.length-expected),paired=ordered.slice(ids.length-expected);
 if(!event.roundByes)event.roundByes={};if(event.roundByes[grp.label]&&JSON.stringify(event.roundByes[grp.label])!==JSON.stringify(byes))fail('Saved knockout byes differ');event.roundByes[grp.label]=byes;
 const offsets=grp.label==='Bronze'?0:grp.items.filter(x=>x.row.visit<row.visit).reduce((n,x)=>n+Number(x.row.workload)/2,0),count=grp.label==='Bronze'?1:Number(row.workload)/2;
 if(!Number.isInteger(count)||count<1||count>8)fail('Source visit requires '+count+' matches; Race Control supports up to eight');
 const carIds=paired.slice(offsets*2,(offsets+count)*2);if(carIds.length!==count*2)fail('Source phase pairing count mismatch');
 const course=sourceTracks(assign,1)[0];const matches=Array.from({length:count},(_,i)=>({id:'H'+(idx+1)+'M'+(offsets+i+1),carIds:carIds.slice(2*i,2*i+2),track:course}));
 return {mode:'raceoff',matches};}
function groupStageName(action){const a=S(action).toUpperCase();return a.match(/STAGE \d+/)?.[0]||'Standard rounds';}
function groupParams(srcRow,assign){const v=srcRow.source,action=S(v.action);if(v.fmt==='GROUPS'){const m=action.match(/•\s*(\d+)\s+TRACKS?/i);if(!m)fail('R1 group stage missing track count');const nt=Number(m[1]);if(v.workload%nt)fail('R1 source group workload/track count mismatch');return {cars:v.workload/nt,tracks:nt};}
 const m=action.match(/RUN ROUNDS?\s+(\d+)\s*[–-]\s*(\d+)/i);const nt=m?Number(m[2])-Number(m[1])+1:1;if(v.workload%nt)fail('R1 standard workload/track count mismatch');return {cars:v.workload/nt,tracks:nt};}
function groupPlan(b,sp,row,visits,src,assign){const event=ensureEvent(b,sp,row,src),items=sourceRows(visits,src),thisItem=items.find(x=>x.row.position===row.position),p=groupParams(thisItem,assign);
 if(!Number.isInteger(p.cars)||p.cars<2||p.cars>64||p.tracks<1||p.tracks>4)fail('Original Festival stage size unsupported');
 let ids;
 if(row.format==='STANDARD'){
  // One existing field runs the source round(s). The same cars are used for
  // all STANDARD rounds — results accumulate before the podium.
  ids=event.field.slice(0,p.cars);if(ids.length!==p.cars)fail('Original Festival round has too few eligible cars');
 }else if(row.format==='GROUPS'){
  const stage=thisItem.phase,stages=[...new Set(items.map(x=>x.phase))],index=stages.indexOf(stage),current=items.filter(x=>x.phase===stage);
  const offset=current.filter(x=>x.row.visit<row.visit).reduce((n,x)=>n+groupParams(x,assign).cars,0),total=current.reduce((n,x)=>n+groupParams(x,assign).cars,0);
  if(index===0)ids=event.field.slice(offset,offset+p.cars);
  else{const prev=items.filter(x=>x.phase===stages[index-1]),ranked=prev.map(x=>{const scores=timings(sp,b,[x]).sort((a,b)=>a.total-b.total||a.id.localeCompare(b.id));return scores;});
    const wanted=total;if(wanted<2||wanted>ranked.reduce((n,a)=>n+a.length,0))fail('Source final/group qualifiers exceed the preceding stage');
    const nBase=Math.floor(wanted/ranked.length),extra=wanted%ranked.length;
    let qualifiers=[];for(let i=0;i<ranked.length;i++)qualifiers.push(...ranked[i].slice(0,nBase+(i<extra?1:0)).map(x=>x.id));
    ids=qualifiers.slice(offset,offset+p.cars);
  }
  if(ids.length!==p.cars)fail('Group roster/count mismatch for source event '+row.eventId);
 }else fail('Only source STANDARD or GROUPS Festival stages are supported');
 unique(ids);return {mode:'group',carIds:ids,tracks:sourceTracks(assign,p.tracks)};}
function plan({b,sp,rows,position,track,signature,source}){const row=rows[position-1];if(!row||row.origin!=='historical')fail('Not a scheduled historical event');const src=srcFor(row),visits=rowsFor(rows,row.eventId),assigned=track.assigned.find(x=>x.position===position&&x.eventId===row.eventId);
 if(!assigned)fail('Genuine FH5 tracks are unavailable for '+row.name);
 const p=row.mode==='Race Off'?koPlan(b,sp,row,visits,src,assigned):row.mode==='Festival'?groupPlan(b,sp,row,visits,src,assigned):fail('Unknown original historical mode '+row.mode);
 const data={source,scheduleId:'TET2-397-'+signature,slotId:'TET2-'+position,competitionId:row.eventId,
  lockHash:hash(JSON.stringify({signature,row:[row.position,row.eventId,row.visit],p})),label:'#'+position+' · '+row.name+' · '+row.stage,...p};return data;}
function receipt({b,sp,rows,eventId,signature}){const visits=rowsFor(rows,eventId),row=visits[0];if(!row||row.origin!=='historical')fail('Not an original competition');const src=srcFor(row),event=b.events[eventId];if(!event?.field?.length)fail('Original competition roster not locked');
 const items=sourceRows(visits,src);if(row.mode==='Race Off'){
  const groups=phases(visits,src),final=groups.at(-1);if(final.label!=='Final')fail('Original knockout final not found');const finalResult=matchResults(sp,b,final);if(finalResult.length!==1)fail('Final incomplete');
  const semi=groups.find(g=>g.label==='Semifinals'),bronze=groups.find(g=>g.label==='Bronze');let bronzeWinner=null,losers=[];
  if(event.field.length>=4){if(!semi||!bronze)fail('Missing required knockout bronze duel');const semis=matchResults(sp,b,semi),br=matchResults(sp,b,bronze);if(semis.length!==2||br.length!==1)fail('Semifinal and bronze requirements not satisfied');losers=semis.map(x=>x.loser);bronzeWinner=br[0].winner;
   if(!losers.includes(bronzeWinner)||!semis.map(x=>x.winner).includes(finalResult[0].winner))fail('Bronze/final winners do not follow semifinals');}
  return {eventId,kind:row.family==='Manufacturer'?'historical-manufacturer-raceoff':'historical-raceoff',format:'knockout',completed:true,verified:true,fieldCarIds:event.field,
    medals:{gold:[finalResult[0].winner],silver:[finalResult[0].loser],bronze:bronzeWinner?[bronzeWinner]:[]},semifinalLoserIds:losers,semifinalsCompleted:!!bronzeWinner,bronzeDuelCompleted:!!bronzeWinner,bronzeDuelWinnerId:bronzeWinner,
    proof:hash(JSON.stringify({eventId,signature,results:visits.map(r=>slotOf(sp,r)?.results)}))};
 }
 // A Festival Championship winner is decided by its final stage, with any
 // earlier qualifiers verified by their use in the final-stage locked field.
 const last=items.at(-1),finalItems=items.filter(x=>x.phase===last.phase),ranked=[];
 if(last.source?.fmt==='STANDARD'){const totals=new Map();for(const x of items){for(const t of timings(sp,b,[x]))totals.set(t.id,(totals.get(t.id)||0)+t.total);}for(const [id,total] of totals)ranked.push({id,total});}
 else{ranked.push(...timings(sp,b,finalItems));}
 ranked.sort((a,b)=>a.total-b.total||a.id.localeCompare(b.id));if(ranked.length<2||ranked.length>=3&&ranked[1].total===ranked[2].total||ranked.length>3&&ranked[2].total===ranked[3].total)fail('Final podium time tie needs a result correction');
 return {eventId,kind:row.family==='Manufacturer'?'historical-manufacturer-festival':'historical-festival',format:'standings',completed:true,verified:true,fieldCarIds:event.field,
 medals:{gold:[ranked[0].id],silver:[ranked[1].id],bronze:ranked[2]?[ranked[2].id]:[]},proof:hash(JSON.stringify({eventId,signature,results:visits.map(r=>slotOf(sp,r)?.results)}))};
}
return Object.freeze({plan,receipt,roster,phases,ecosystem});
});
