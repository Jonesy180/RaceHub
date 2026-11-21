/* OTG! v8.0.394 — inspect-only consolidated track preflight. No state mutations. */
(function(root,factory){'use strict';const api=factory(root);root.TET2OfficialTrackPreflight394=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof window!=='undefined'?window:globalThis,function(root){'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function evaluate(readiness,routeReport,routePreview,join){
 const issues=[];
 const fail=(message)=>{if(!issues.includes(message))issues.push(message);};
 if(!readiness||readiness.readOnly!==true||readiness.officialStartLocked!==true||readiness.officialWrites!==0||!readiness.totals)fail('Readiness report unavailable or not safely locked');
 if(!routeReport||routeReport.blocked!==true||routeReport.officialWrites!==0||!routeReport.totals||!Array.isArray(routeReport.issues))fail('Catalogue reconciliation report unavailable or not safely locked');
 if(!routePreview||routePreview.blocked!==true||routePreview.officialWrites!==0||!Array.isArray(routePreview.assigned)||!Array.isArray(routePreview.unassigned))fail('Route proposals unavailable or not safely locked');
 if(!join||join.officialStartLocked!==true||join.officialWrites!==0||!Array.isArray(join.rows))fail('Schedule-to-route join unavailable or not safely locked');
 const t=readiness?.totals||{},n=t.visits;
 if(!Number.isInteger(n)||n<1)fail('Verified schedule visit count missing');
 if(readiness?.integrityOK!==true)fail('Readiness cross-check integrity not confirmed');
 if((readiness?.errors||[]).length)fail('Readiness cross-check found errors');
 if(routeReport?.issues?.length)fail('Catalogue reconciliation found unresolved integrity issues');
 if(join?.ok!==true)fail('Schedule join integrity not confirmed');
 if(Number.isInteger(n)&&join?.rows?.length!==n)fail('Schedule join count mismatch');
 if(Number.isInteger(n)&&routeReport?.totals?.visits!==n)fail('Reconciliation count mismatch');
 if(Number.isInteger(n)&&t.verifiedExisting+t.previewReady+t.blocked!==n)fail('Track readiness totals do not balance');
 if((t.missingFamily||0)>0)fail('Some visits have missing or ambiguous race categories');
 if((t.missingCatalogue||0)>0||!readiness?.source)fail('Some visits lack a verified FH5 track catalogue');
 if((t.invalidExisting||0)>0||(t.wrongFamily||0)>0||(t.invalidProposal||0)>0)fail('Route IDs or race categories have conflicts');
 if((t.missingProposal||0)>0)fail('Some visits have no valid track proposal');
 if((t.recentRepeat||0)>0)fail('Proposed route repetition requires review');
 if((t.blocked||0)>0)fail('Unresolved scheduled visits remain blocked');
 if((routePreview?.unassigned||[]).length)fail('Track engine left scheduled visits unassigned');
 if(!readiness?.completePreview)fail('Full track preview coverage has not passed');
 // This version ONLY assesses evidence; there is deliberately no commit/approve route.
 const evidenceComplete=issues.length===0;
 return Object.freeze({readOnly:true,officialStartLocked:true,officialWrites:0,canAssignOfficially:false,evidenceComplete,visits:Number.isInteger(n)?n:0,source:readiness?.source||null,totals:{existing:t.verifiedExisting||0,proposed:t.previewReady||0,blocked:t.blocked||0,repeats:t.recentRepeat||0},issues,firstBlocked:Array.isArray(readiness?.blockedExamples)?readiness.blockedExamples.slice(0,8):[]});
}
function snapshot(){let r,p,j,c;try{r=root.TET2TrackReadiness393?.snapshot?.();}catch(e){return evaluate(null,null,null,null);}try{c=root.TET2RouteReconciliation392?.snapshot?.();}catch(_){}try{p=root.TET2TrackAssignment390?.snapshot?.();}catch(_){}try{j=root.TET2TrackIntegration391?.snapshot?.();}catch(_){}return evaluate(r,c,p,j);}
function html(){const r=snapshot(),t=r.totals;return `<div class="t2-a388"><p class="t2-a388-status fail">🔒 OFFICIAL TRACK PREFLIGHT · READ ONLY · NO RELEASE</p><div class="t2-a388-metrics"><div><strong>${r.visits}</strong><small>Scheduled visits</small></div><div><strong>${t.existing+t.proposed}</strong><small>Validated route evidence</small></div><div><strong>${t.blocked}</strong><small>Blocked</small></div><div><strong>${r.issues.length}</strong><small>Preflight issues</small></div></div><p>Catalogue: ${esc(r.source||'NOT VERIFIED')} · Existing: ${t.existing} · Preview: ${t.proposed} · Recent repeats: ${t.repeats}.</p><p>${r.evidenceComplete?'✓ Evidence-only preflight complete. Official assignment still disabled.':'⛔ Evidence preflight incomplete. No official assignments permitted.'}</p><details><summary>Preflight blockers (${r.issues.length})</summary>${r.issues.length?`<ol>${r.issues.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`:'<p>Evidence checks passed; official release remains unavailable.</p>'}</details><details><summary>Sample blocked schedule visits</summary>${r.firstBlocked.length?`<ol>${r.firstBlocked.map(x=>`<li>#${esc(x.position)} ${esc(x.name)} · ${esc(x.reason)}</li>`).join('')}</ol>`:'<p>No blocked examples reported.</p>'}</details><p class="t2-a388-foot">INSPECTION ONLY · NO APPROVE BUTTON · NO OFFICIAL ROUTE WRITES · SLOT 001 LOCKED</p></div>`;}
return Object.freeze({evaluate,snapshot,html});
});
