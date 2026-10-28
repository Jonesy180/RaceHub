/* OTG! MAIN v8.0.152 — Evil R1 multi-visit STANDARD Championship guard (hotfix).
 * The Festival result engine sees only currently scheduled rounds. A full visit
 * is NOT a championship final when later Evil R1 visits still exist.
 * Purely derived career honours (Hall of Fame, medals, Lifetime Career) use
 * status==='complete'; reconcile wrongly-finalised partial runs without removing
 * any saved result, round, slot-DONE status, ownership or genuine trophy.
 */
(()=>{
  'use strict';
  const data=()=>window.rhEvilSpecialistR18097;
  const same=(a,b)=>String(a??'')===String(b??'');
  function requiredRounds(run){
    if(!run||run.type!=='evil-r1'||run.evilCampaignR1?.format!=='STANDARD')return 0;
    const d=data(), id=String(run.value??'');
    const event=d?.events?.[id];
    const visits=(d?.slots||[]).filter(s=>same(s.eventId,id)&&s.liveFormat==='STANDARD');
    if(!event||visits.length<2)return 0;
    const planned=Number(event.eligible);
    if(!Number.isInteger(planned)||planned<1)return 0;
    const work=visits.reduce((n,s)=>n+Number(s.workload||0),0);
    const rounds=work/planned;
    // Fail closed on unexpected manifests or impossible schedules.
    return Number.isInteger(rounds)&&rounds>1&&rounds<=12?rounds:0;
  }
  function unfinishedFuture(run){
    const expected=requiredRounds(run);
    return expected>0&&(run.rounds||[]).length<expected;
  }
  window.rhEvilR1HasFutureRound8153=unfinishedFuture;
  function reconcile(){
    const s=typeof state!=='undefined'&&Array.isArray(state?.spaces)?state:null;
    if(!s)return 0;
    let changed=0;
    for(const space of s.spaces){
      if(space?.catalogueKey!=='fh5-catalogue-v1')continue;
      for(const run of space.runs||[]){
        if(run?.status==='complete'&&unfinishedFuture(run)){
          run.status='active';delete run.completedAt;
          // Never change run.results, rounds, entries, or campaign DONE state.
          changed++;
        }
      }
    }
    if(changed){
      try{window.rhSave?.()}catch(err){console.error('Evil R1 championship reconciliation save failed',err)}
    }
    return changed;
  }
  window.rhEvilR1ChampGuardQA8153={requiredRounds,unfinishedFuture,reconcile};
  // Startup: repair previously recorded premature titles (including Slot 20)
  // before the next user navigation / Hall of Fame or Stats calculation.
  reconcile();
})();
