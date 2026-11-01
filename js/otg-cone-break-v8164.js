/* OTG! MAIN v8.0.164 — CONE BREAK.
 * One optional, brief, consequence-free comedy intermission ONLY after a new,
 * verified Evil R1 Mark as Done action. No racing, standings, medals, or slot writes.
 * Practice is never treated as a real DONE slot or recorded in saved history.
 */
((root)=>{
 'use strict';
 const KEY='evilConeBreaks8164', CAMPAIGN='evil-specialist-r1-20261014',FH5='fh5-catalogue-v1';
 const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const date=()=>new Date().toISOString();
 const SCENES=[
  ['THE UNAUTHORISED PARKING BAY','The wheelie bin has occupied the cones’ reserved parking triangle. It claims that technically a triangle is not a parking space.',
   ['Issue a diplomatic warning','Form an intimidating triangle','Declare the bin a roundabout'],
   ['The bin has asked whether the warning comes with a parking permit. Nobody knows.','All three cones stand perfectly still. The bin rolls four inches forward and wins.','Traffic immediately forms around the bin. Steve gives way to a watering can.']],
  ['THE MANAGEMENT INTERVIEW','A shopping trolley with one spectacularly dodgy wheel has arrived for a senior management interview. Its only reference is a supermarket receipt.',
   ['Appoint it immediately','Ask for a practical demonstration','Let the penguin interview it'],
   ['The trolley is now Head of Forward Planning. It can only turn left.','The trolley completes half a circle and files an expenses claim for motion sickness.','The penguin appoints the trolley as an unpaid consultant. The trolley appoints the penguin as its assistant.']],
  ['THE BREAK ROOM COUP','The toaster has declared itself acting Prime Minister during the tea break. The kettle is forming a shadow cabinet.',
   ['Demand an election','Establish a coalition','Unplug parliament'],
   ['The toaster wins all four seats in the bread aisle. The kettle demands a recount.','A historic agreement is signed. It lasts until someone requests a crumpet.','Government business is suspended. Dave calls it the most productive afternoon on record.']],
  ['OPERATION GARDEN GNOME','A garden gnome has been found lurking beside the filing cabinet. It has no identification and looks disturbingly pleased with itself.',
   ['Recruit the gnome','Question its garden connections','Disguise a cone as a gnome'],
   ['The gnome accepts and immediately requests annual leave for the winter.','The gnome refuses to answer unless someone waters the begonias.','The undercover cone blows its cover by shouting “I AM A CONE” at a pigeon.']],
  ['THE GREAT SPOON DISPUTE','A teaspoon has claimed ownership of the boardroom because nobody can prove who last used it.',
   ['Take the case to arbitration','Offer the spoon a promotion','Move the meeting to the sink'],
   ['Arbitration concludes the spoon is technically a fork with ambition.','The spoon is made Head of Stirring. The office has never been less settled.','Everyone arrives at the sink. The sponge refuses entry without an appointment.']],
  ['BOLLARD AT LARGE','A traffic bollard claims to be the cones’ long-lost cousin. The cones demand a DNA test from the roadworks department.',
   ['Welcome the cousin','Investigate its family tree','Assign a security escort'],
   ['Family photographs are taken. Nobody can remember which cone is which.','The family tree is revealed to be an actual tree. Dave waters it.','The bollard is escorted to lunch and is immediately stuck in the doorway.']],
  ['THE DAMP MOP SITUATION','An office mop is conducting unauthorised patrols. It insists it is cleaning up crime, despite there being no crime.',
   ['Give it a badge','Ask who authorised this','Deploy an anti-mop squad'],
   ['The badge slides down the handle. The mop calls this operational camouflage.','Dave confesses to absolutely nothing, then admits it was his idea.','The cones form a blockade. The mop cleans around them and submits a victory report.']],
  ['THE PHOTOCOPIER REBELLION','The photocopier is reproducing pictures of itself and leaving them on the director’s chair. It claims this is an election campaign.',
   ['Audit the campaign budget','Demand a live debate','Offer it a newspaper column'],
   ['Its declared campaign budget is three paperclips and a very strong opinion.','The printer arrives as opposition leader. All they produce is a paper jam.','The photocopier writes 800 identical columns. Steve calls them insightful.']],
  ['THE SUSPICIOUS BANANA','A banana has appeared on the security desk wearing a tiny high-visibility vest. Nobody remembers hiring it.',
   ['Check its credentials','Promote it to supervisor','Ask the bin to investigate'],
   ['Its credentials are a sticker reading “PRODUCT OF A COUNTRY”. Clearance denied.','It is assigned to oversee a slippery investigation. Disaster is immediate.','The bin refuses to answer questions without a fruit bowl present.']],
  ['THE DUCKLING AUDIT','A rubber duck has requested access to classified financial records. It claims to be the independent auditor.',
   ['Grant limited access','Demand an audit of the duck','Let Steve translate'],
   ['The duck approves the budget with a single squeak. Dave interprets this as a bonus.','The duck’s entire accounting history consists of bath time.','Steve reports that the duck has identified £14 million in missing breadcrumbs.']],
  ['THE CHAIR OF CHAIRS','An empty folding chair has appointed itself chair of the emergency committee. The committee has been missing for hours.',
   ['Second the motion','Challenge the appointment','Sit on the evidence'],
   ['The meeting begins with 14 minutes of respectful silence.','The chair calls a vote and wins by sitting very firmly.','The chair collapses. Chief Tech Penguin describes it as a constitutional crisis.']],
  ['THE SOCK OF DOOM','A single sock has emerged from the laundry room claiming to know where all missing socks go.',
   ['Offer witness protection','Demand a map','Allow the bin to negotiate'],
   ['The sock is given a confidential drawer. Its location is immediately leaked.','The map leads to another washing machine. The investigation grows.','The bin claims the sock is valuable evidence and refuses to give it back.']],
  ['THE PARKING METER STRIKE','A parking meter has gone on strike and is charging office staff to sit down. Dave has paid for the whole week.',
   ['Open negotiations','Pay in foreign coins','Send the cones to picket'],
   ['Talks collapse over the phrase “two hours maximum stay”.','The meter accepts a chocolate button and declares the debt settled.','The cones start picketing the wrong pavement. The bin joins in out of spite.']],
  ['THE OMINOUS CARDBOARD BOX','A cardboard box in the corridor is making suspicious rustling noises. It is labelled “NOT A SHOPPING TROLLEY”.',
   ['Open the box','Interview the box','Deliver it to headquarters'],
   ['Inside is a smaller box labelled “STILL NOT A SHOPPING TROLLEY”.','The box declines to comment and rustles more aggressively.','The delivery department returns it to sender. The sender is the box.']],
  ['THE FLAMINGO INCIDENT','A plastic flamingo has arrived carrying a clipboard and says it is conducting an inspection of local wetlands. The only wetland is Steve’s spilled tea.',
   ['Approve the inspection','Ask for environmental proof','Invite the mop to help'],
   ['The flamingo gives headquarters two stars and a warning about teabag disposal.','The flamingo produces a photograph of a puddle and calls it a national park.','The mop removes the wetland. The flamingo launches a formal protest.']],
  ['THE KETTLE INCIDENT','The kettle has been boiling for twenty minutes without water. It insists it is conducting a stress test on management.',
   ['Call an emergency tea meeting','Consult the toaster','Turn it off'],
   ['The meeting is postponed when nobody can agree who gets the last biscuit.','The toaster suggests a cabinet reshuffle. Steve actually rearranges the cupboards.','The kettle declares the experiment a success. Management is visibly stressed.']],
  ['THE OFFICE PLANT ULTIMATUM','A potted fern has demanded daylight, fresh soil and representation on the staff council. Its roots have occupied the meeting room.',
   ['Offer a windowsill','Appoint a plant liaison','Call the wheelie bin'],
   ['The fern agrees, but only if the blinds stay open during confidential briefings.','The gnome volunteers. Nobody is surprised.','The bin declines the assignment on grounds of compost-related jurisdiction.']],
  ['THE VENDING MACHINE CRISIS','The vending machine is dispensing paperclips instead of crisps. Dave describes this as an improvement to office efficiency.',
   ['Request a refund','Ask Steve to repair it','Install the cones as guards'],
   ['The machine refunds a paperclip and charges a handling fee.','Steve fixes the crisps but starts dispensing office stationery from the photocopier.','The cones stop every snack. Office morale briefly reaches zero.']],
  ['THE DISGRUNTLED UMBRELLA','An umbrella has applied for the role of Head of Weather. Its opening statement is “I TOLD YOU SO.”',
   ['Hire it','Conduct a rain simulation','Ask the penguin to check forecasts'],
   ['The umbrella is immediately promoted after predicting that Dave would spill his coffee.','Steve sprays it with a watering can. The umbrella demands hazard pay.','The penguin reports a 100% chance of paperwork and occasional biscuits.']],
  ['THE MYSTERIOUS TRAFFIC LIGHT','A portable traffic light has turned up inside the office and refuses to show green. The kettle has been waiting at red for three hours.',
   ['Reset the light','Establish a diversion','Declare everyone a pedestrian'],
   ['The light flashes amber and requests an annual performance review.','The cones guide staff through the stationery cupboard. Nobody returns.','The kettle crosses the corridor. The light files a traffic violation.']],
  ['THE BROOM BRIGADE','A broom has formed its own security force consisting of one brush, a dustpan and a highly suspicious feather duster.',
   ['Recognise the unit','Hold a parade','Ask who is in charge'],
   ['The new force arrests a pile of leaves for loitering.','The parade is halted because the feather duster is allergic to dust.','The dustpan points at the broom. The broom points at Steve.']],
  ['A CRISIS IN MEASUREMENT','The office tape measure insists the building is three inches too small. It recommends making all the employees shorter.',
   ['Commission a new survey','Ask the cones to stretch','Consult the wheelie bin'],
   ['The new survey finds the building is actually a shed.','One cone tips over. The other two submit a grievance.','The bin measures itself, becomes offended and requests a wider doorway.']],
  ['THE CURIOUS DOORSTOP','An owl-shaped doorstop has declared that nobody may leave the meeting until it has heard everyone’s opinions on carpet.',
   ['Start carpet discussion','Declare the meeting adjourned','Distract it with the gnome'],
   ['Four hours later, the mop has been elected Minister for Flooring.','The doorstop objects. Dave attempts to climb through a window.','The gnome gives a detailed talk on garden paths. Everyone escapes.']],
  ['THE COMPOST DIPLOMAT','The brown food-waste caddy has arrived to negotiate a cultural exchange with the wheelie bin. The bin refuses to disclose its colour.',
   ['Arrange a neutral venue','Appoint the cones as mediators','Call for a confidentiality agreement'],
   ['They meet in the kitchen. The toaster claims ownership of the venue.','The cones demand to know whether they will get diplomatic biscuits.','The bin signs with a tyre track. Nobody can read it, but negotiations proceed.']],
  ['THE LOST POST-IT','A yellow sticky note has been found attached to an entire wall. It says “DO NOT FORGET THIS” but gives no other information.',
   ['Set up a task force','Ask Dave what it means','File it as evidence'],
   ['The task force produces seventeen more sticky notes. None contain instructions.','Dave says he remembers perfectly, but cannot explain what.','The evidence locker is now covered in notes saying “EVIDENCE INSIDE”.']],
  ['THE FRIDGE INVESTIGATION','The office fridge has sealed its own door and declared everything inside classified. The smell suggests a serious incident.',
   ['Negotiate access','Ask the penguin to investigate','Declare a quarantine'],
   ['The fridge permits one supervised yoghurt inspection. Dave is banned for life.','The penguin emerges with a sandwich and refuses further comment.','The quarantine holds for six minutes until Steve wants milk.']],
  ['PIGEON FROM HEAD OFFICE','A pigeon has arrived with a message tied to its leg. The message reads “WRONG OFFICE. SORRY.”',
   ['Send it back','Appoint the pigeon courier','Ask for an explanation'],
   ['The pigeon returns with a second message reading “STILL WRONG.”','The pigeon accepts the role, then immediately takes a three-day holiday.','The pigeon gives you a look normally reserved for very stupid questions.']],
  ['THE TROLLEY PARKING TREATY','The shopping trolley wants a permanent bay beside the wheelie bin. The cones insist the entire corridor is a no-parking zone.',
   ['Draft a treaty','Hold a site inspection','Draw a white line'],
   ['All parties sign. The trolley immediately rolls into the wrong bay.','Chief Tech Penguin finds that the corridor is technically a stairwell.','Steve draws a line with toothpaste. The mop declares war.']],
  ['THE BELL THAT NEVER RINGS','The reception bell has started ringing when nobody touches it. It says this is an attempt to improve customer service.',
   ['Investigate the bell','Install CCTV made of cones','Promote the bell'],
   ['The bell admits it is bored and wants a holiday to the seaside.','The cones stand facing the wrong direction. The bell escapes.','The bell is named Head of Customer Satisfaction, despite having no customers.']],
  ['THE PAPER SHREDDER TRIBUNAL','The shredder has shredded its own instruction manual and demanded immunity from all future document-destruction inquiries.',
   ['Grant immunity','Make it reconstruct the manual','Consult the bin'],
   ['Immunity is granted provided it stops eating the budget. It refuses.','The shredder produces enough confetti for a small wedding.','The bin claims the shredded evidence belongs to its department.']],
  ['THE EXTERNAL CONSULTANT','A traffic cone from another building has arrived with a business card reading “STRATEGICALLY ORANGE”. The other cones are furious.',
   ['Ask for its strategy','Offer it a temporary contract','Send it to negotiate with the bin'],
   ['Its entire strategy is to stand slightly further to the left.','The temporary contract accidentally makes it Head of Infrastructure.','The bin welcomes the visitor and demands that the original cones apologise.']],
  ['THE BISCUIT EMBARGO','The biscuit tin has declared an embargo on all snacks until someone replaces the missing chocolate digestives.',
   ['Offer a peace treaty','Question Dave and Steve','Call in the gnome'],
   ['The tin agrees to release two custard creams under armed supervision.','Dave blames Steve; Steve blames the pigeon; the pigeon leaves.','The gnome announces biscuits are bad for flower beds. Everyone ignores him.']]
 ];
 const LOC=['during a mandatory tea break','under the stairwell','beside the trophy cabinet','in the suspiciously quiet boardroom','behind the vending machine','under Chief Tech Penguin’s desk','outside the emergency biscuit cupboard','at the world’s least important press conference'];
 const todaySlot=n=>`SLOT ${String(n).padStart(4,'0')}`;
 const space=()=>{try{const s=root.rhSpace?.();return s?.catalogueKey===FH5?s:null}catch(_){return null}};
 const campaign=()=>{const p=space()?.evilCampaignR18098;return p?.campaignId===CAMPAIGN?p:null};
 const official=()=>{try{const s=root.rhEvilR1QA8103?.slots?.();return Array.isArray(s)&&s.length>=100?new Map(s.map(v=>[Number(v.slot),String(v.eventId)])):null}catch(_){return null}};
 const save=()=>{try{root.rhSave?.()}catch(err){console.warn('Cone Break: optional intermission save failed',err)}};
 function recordStore(create=false){const s=space();if(!s||!campaign())return null;let d=s[KEY];
  if((!d||typeof d!=='object'||Array.isArray(d))&&create){d={version:1,enabled:true,entries:{}};s[KEY]=d;save()}
  if(!d||typeof d!=='object'||Array.isArray(d))return null;
  if(!d.entries||typeof d.entries!=='object'||Array.isArray(d.entries)){if(!create)return {...d,entries:{}};d.entries={};save()}
  return d;
 }
 const sceneFor=n=>{const x=Number(n)||1;const idx=((x*11+3)%SCENES.length+SCENES.length)%SCENES.length;return {id:idx,scene:SCENES[idx],place:LOC[(x*13+5)%LOC.length]}};
 let active=null,fromArchive=false;
 function dismiss(){document.getElementById('otgConeBreakOverlay8164')?.remove();active=null;fromArchive=false}
 function persist(n,eventId,sceneId,choice,skipped){const p=campaign(),ids=official();if(!p||!ids||!ids.has(n)||ids.get(n)!==String(eventId)||String(p.done?.[String(n)]?.eventId)!==String(eventId))return false;
  const st=recordStore(true);if(!st)return false;
  const key=String(n);if(st.entries[key])return false;
  st.entries[key]={eventId:String(eventId),sceneId,choice:skipped?null:choice,skipped:!!skipped,at:date()};save();return true;
 }
 function contentMarkup(n,trial=false,old=null){const card=sceneFor(n),[title,story,choices,replies]=card.scene;
  const previous=old?.skipped?null:(Number.isInteger(old?.choice)?old.choice:null);
  const isFinal=previous!==null;
  return `<div class="cb164-sheet" role="dialog" aria-modal="true" aria-labelledby="cb164Title"><div class="cb164-head"><span>🚧 OTG! · OFFICIAL BREAK TIME</span><button type="button" data-cb-exit aria-label="${trial?'Close practice':'Skip this break'}">✕</button></div><div class="cb164-strap">${trial?'TRAINING EXERCISE · NOTHING RECORDED':old?'PREVIOUS BREAK · VIEW ONLY':`${todaySlot(n)} COMPLETE · CLOCK OFF`}</div><div class="cb164-characters" aria-hidden="true">🚧 🚧 🚧 <span>⚡</span> 🗑️</div><h2 id="cb164Title">THE CONE BREAK</h2><p class="cb164-ep">${E(title)}</p><p class="cb164-story">${E(story)}</p><p class="cb164-location">INCIDENT REPORTED ${E(card.place.toUpperCase())}.</p><div class="cb164-choose"><b>THE CONES REQUIRE A DECISION:</b>${choices.map((txt,i)=>`<button type="button" data-cb-choice="${i}" ${old?'disabled':''} ${previous===i?'aria-pressed="true"':''}><span>${String.fromCharCode(65+i)}</span>${E(txt)}</button>`).join('')}</div><div class="cb164-result" id="cb164Result" ${isFinal?'':'hidden'} aria-live="polite">${isFinal?`<strong>OFFICIAL OUTCOME · QUESTIONABLE SUCCESS</strong><p>${E(replies[previous])}</p>`:''}</div><div class="cb164-foot"><button type="button" class="cb164-continue" data-cb-finish>${old?'RETURN TO BREAK ROOM':trial?'CLOSE TRAINING':isFinal?'BACK TO THE EVIL TOURNAMENT':'SKIP BREAK → NEXT UP'}</button><small>For entertainment only. No racing result, medal, slot status or Hall of Shame award changes.</small></div></div>`
 }
 function openBreak(n,{trial=false,old=null}={}){
  if(!trial&&!old&&(!campaign()||!official()))return false;
  dismiss();fromArchive=!!old;
  const x=document.createElement('div');x.id='otgConeBreakOverlay8164';x.className='cb164-overlay';x.innerHTML=contentMarkup(n,trial,old);
  active={n,trial,old,choice:Number.isInteger(old?.choice)?old.choice:null,eventId:!trial&&!old?campaign()?.done?.[String(n)]?.eventId:null};
  x.addEventListener('click',e=>{
   const choice=e.target.closest('[data-cb-choice]');
   if(choice&&!active?.old){const i=Number(choice.dataset.cbChoice),a=active;if(!Number.isInteger(i)||i<0||i>2||a.choice!==null)return;
    a.choice=i;
    if(!a.trial)persist(a.n,a.eventId,sceneFor(a.n).id,i,false);
    const result=x.querySelector('#cb164Result');const lines=sceneFor(a.n).scene[3];
    if(result){result.hidden=false;result.innerHTML=`<strong>OFFICIAL OUTCOME · QUESTIONABLE SUCCESS</strong><p>${E(lines[i])}</p>`}
    x.querySelectorAll('[data-cb-choice]').forEach(b=>{b.disabled=true;b.setAttribute('aria-pressed',String(Number(b.dataset.cbChoice)===i))});
    const done=x.querySelector('[data-cb-finish]');if(done)done.textContent=a.trial?'CLOSE TRAINING':'BACK TO THE EVIL TOURNAMENT';return;
   }
   if(e.target.closest('[data-cb-exit]')||e.target.closest('[data-cb-finish]')){
    const a=active;if(a&&!a.trial&&!a.old&&a.choice===null)persist(a.n,a.eventId,sceneFor(a.n).id,null,true);
    const returnArchive=!!a?.old;dismiss();if(returnArchive)openArchive();return;
   }
  });
  document.body.appendChild(x);
  x.querySelector('[data-cb-choice]')?.focus({preventScroll:true});return true;
 }
 function inject(){const h=document.getElementById('evilcampaign'),strip=h?.querySelector('.rhEvilR1Actions8097');if(!strip||strip.querySelector('[data-cb-archive]'))return;
  const b=document.createElement('button');b.type='button';b.dataset.cbArchive='1';b.innerHTML='<span aria-hidden="true">🚧</span><b>THE CONE BREAK ROOM</b><small>Optional post-slot nonsense · incident archive</small>';
  b.addEventListener('click',openArchive);strip.appendChild(b);
 }
 function openArchive(){const h=document.getElementById('evilcampaign'),p=campaign();if(!h||!p)return;
  const s=recordStore(false),items=Object.entries(s?.entries||{}).filter(([n,v])=>Number.isSafeInteger(+n)&&String(p.done?.[n]?.eventId)===String(v?.eventId)).sort((a,b)=>Number(b[0])-Number(a[0]));
  const enabled=s?.enabled!==false;
  h.innerHTML=`<div class="rhEvilR18097 cb164-archiveScreen"><button class="rhEvilR1Back8097" type="button" data-cb-home><span>‹</span><b>BACK</b></button><header class="rhEvilR1Hero8097"><small>BREAK ROOM · COMPLETELY UNOFFICIAL</small><h1>THE CONE BREAK</h1><p>THREE CONES. ONE WHEELIE BIN.</p><strong>NO QUALIFICATIONS REQUIRED</strong></header><main class="rhEvilR1Body8097"><section class="cb164-archiveCard"><h2>🚧 THE OFFICE OF EXTREMELY BAD IDEAS</h2><p>A tiny nonsense mission after each newly completed Evil Tournament slot. You may skip it, and nothing changes your racing career.</p><div class="cb164-archiveActions"><button type="button" data-cb-practice>▶ PRACTICE A BREAK</button><button type="button" data-cb-toggle>POP-UPS: ${enabled?'ON':'OFF'}</button></div><small>Practice never records a completion, result or decision. Changing the pop-up preference affects future slots only.</small></section><section class="cb164-archiveCard"><h2>PAST INCIDENTS <em>${items.length}</em></h2>${items.length?items.map(([n,v])=>`<div class="cb164-incident"><span>${todaySlot(n)} · ${v.skipped?'SKIPPED':'INCIDENT FILED'}</span><b>${E(sceneFor(Number(n)).scene[0])}</b>${v.skipped?'<small>Skipped; no decision recorded.</small>':`<button type="button" data-cb-revisit="${E(n)}">REVIEW OUTCOME ›</button>`}</div>`).join(''):'<p>No incidents filed yet. Your existing DONE slots are left alone; the intermissions begin with your next newly completed slot.</p>'}</section><button class="cb164-home" type="button" data-cb-home>← BACK TO EVIL TOURNAMENT</button></main></div>`;
  h.querySelectorAll('[data-cb-home]').forEach(b=>b.addEventListener('click',()=>root.rhRenderEvilCampaignR18098?.()));
  h.querySelector('[data-cb-practice]')?.addEventListener('click',()=>openBreak(7,{trial:true}));
  h.querySelector('[data-cb-toggle]')?.addEventListener('click',()=>{const d=recordStore(true);if(d){d.enabled=d.enabled===false;save();openArchive()}});
  h.querySelectorAll('[data-cb-revisit]').forEach(b=>b.addEventListener('click',()=>{const n=Number(b.dataset.cbRevisit),e=recordStore(false)?.entries?.[String(n)];if(e&&!e.skipped&&campaign()?.done?.[String(n)]?.eventId===e.eventId)openBreak(n,{old:e})}));
  root.scrollTo?.(0,0);
 }
 function afterDone(n){const p=campaign(),id=official()?.get(n),mark=p?.done?.[String(n)];if(!id||!mark||String(mark.eventId)!==id)return false;
  const s=recordStore(false);if(s?.enabled===false||s?.entries?.[String(n)])return false;
  return openBreak(n);
 }
 function install(){const base=root.rhEvilSetR1Status8098;
  if(typeof base!=='function'||base._cb164)return;
  function wrapped(n,want){
   const x=Number(n),s=space(),p=campaign(),pre=p?.done?.[String(x)],expected=official()?.get(x);
   // The original action is ALWAYS run first. Never change its eligibility logic.
   const out=base.apply(this,arguments);
   if(want==='done'&&s&&expected&&!pre&&Number.isSafeInteger(x)&&x>0&&campaign()&&space()===s){
    const done=campaign()?.done?.[String(x)];
    if(done&&String(done.eventId)===expected){try{afterDone(x)}catch(err){console.warn('Optional Cone Break failed; slot remains saved',err)}}
   }
   return out;
  }
  wrapped._cb164=true;root.rhEvilSetR1Status8098=wrapped;
  const h=document.getElementById('evilcampaign');if(!h)return;
  h.addEventListener('click',e=>{if(e.target.closest('[data-cb-archive]'))return});
  if(typeof MutationObserver!=='undefined'){
   new MutationObserver(()=>{try{inject()}catch(err){console.warn('Cone Break tile failed',err)}}).observe(h,{childList:true,subtree:false});
  }
  inject();
 }
 root.otgConeBreakQA8164={afterDone,sceneFor,recordStore,openBreak,openArchive,install,sceneCount:()=>SCENES.length,key:KEY};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})(typeof window==='undefined'?globalThis:window);
