/* OTG! MAIN 8.0.163 — Secret Side Missions.
 * Personal Evil Tournament bonus fiction: opt-in readable dossiers, not extra races.
 * TRIGGER: exact, official, verified DONE slot + campaign identity.
 * DATA: one new Space-owned collection only, no race/result/event/medal writes.
 * Never exposes future cases, dates, slot schedule or story contents in the UI.
 */
(()=>{
 'use strict';
 const KEY='evilSecretSideMissions8163',CAMPAIGN='evil-specialist-r1-20261014';
 const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const now=()=>new Date().toISOString();
 const CASES=[
  {id:'FILE-001',slot:26,format:'newspaper',eyebrow:'THE AFTERNOON EXTRA',title:'THE BIN THAT DEMANDED EQUAL RIGHTS',subtitle:'Council meeting interrupted by uninvited wheeled delegate',
   body:['A wheelie bin entered the meeting shortly after the agenda was approved. It had no invitation, no voting rights, and an unusually confident attitude toward parking regulations.','Three traffic cones immediately objected. They claimed an earlier verbal agreement entitled them to exclusive representation of stationary roadside objects. The bin responded by rolling six inches forward and requesting the minutes be corrected.'],
   evidence:'WITNESS: “It was the most movement we have seen from local government in years.”',
   question:'What goes into the official minutes?',choices:['Recognise the bin as an observer','Refer the entire dispute to the penguin','Declare a temporary parking ceasefire'],
   replies:['The bin has received a lanyard. It is wearing it incorrectly.','The penguin has requested an expense account and an emergency whistle.','Both sides have agreed to stop shouting until somebody moves them.']},
  {id:'FILE-002',slot:57,format:'memo',eyebrow:'INTERNAL MEMORANDUM / NOT FOR DISTRIBUTION',title:'OPERATION EMPTY STAPLER',subtitle:'A security breach in stationery procurement',
   body:['A confidential purchasing order has been discovered authorising forty-seven replacement staplers for an office with no paper. Every stapler is listed as “mission critical.”','The Head of Procurement denies involvement. The office stapler refuses to comment without legal representation.'],
   evidence:'ENCLOSURE B: One invoice. No staples. No satisfactory explanation.',question:'Which department takes the case?',choices:['Internal Affairs','Facilities Maintenance','The mysterious third department'],
   replies:['Internal Affairs has arrested the hole punch.','Maintenance reports the stapler is “making a funny noise.”','The third department has denied its own existence. Twice.']},
  {id:'FILE-003',slot:102,format:'advert',eyebrow:'SPECIAL ADVERTISEMENT / CLAIMS UNVERIFIED',title:'INTRODUCING THE SELF-WINDING WINDMILL',subtitle:'For people who are tired of waiting for weather',
   body:['Are ordinary windmills too dependent on the atmosphere? Our revolutionary new model includes a small electric fan pointed directly at the blades.','Each unit comes with a reassuring certificate from the Department of Extremely Optimistic Physics. Electricity sold separately.'],
   evidence:'SMALL PRINT: Actual energy output may be less than whatever you started with.',question:'Approve this product for sale?',choices:['Approve with a warning label','Demand an independent test','Order one for Steve'],
   replies:['The warning label is now larger than the windmill.','The independent tester has walked away shaking their head.','Steve has ordered twelve and begun advertising renewable stupidity.']},
  {id:'FILE-004',slot:159,format:'transmission',eyebrow:'INTERCEPTED TRANSMISSION / 02:17 AM',title:'SOMEONE HAS BEEN TALKING TO THE VENDING MACHINE',subtitle:'Source signal: corridor near the garages',
   body:['VOICE A: Have you got the package?\nVOICE B: Depends. Are you paying in exact change?\nVOICE A: This is not the time for snacks.','The recording ends with three loud clunks, a microwave beep and someone saying, “That is definitely not the envelope.” The machine has subsequently been unplugged but continues to demand sixty pence.'],
   evidence:'AUDIO NOTE: The background whistling may be a kettle, or a very small conspiracy.',question:'How should the recording be classified?',choices:['Possible intelligence','Snack-related misunderstanding','High-priority nonsense'],
   replies:['The analysts have requested a second packet of crisps.','The machine has filed a counterclaim for damages.','The file has been stamped VERY SILLY in red ink.']},
  {id:'FILE-005',slot:216,format:'incident',eyebrow:'INCIDENT REPORT / FORM 14-B',title:'THE GREAT CAR PARK UPRISING',subtitle:'Unauthorised assembly of shopping trolleys',
   body:['Four shopping trolleys were found parked nose-to-nose in a supermarket car park. A fifth trolley had stationed itself at the exit and was charging drivers in abandoned pound coins.','The wheelie bin claims to have known nothing about the gathering. It nevertheless requested honorary membership during questioning.'],
   evidence:'EVIDENCE: One bent token, three receipts and a suspiciously polished wheel.',question:'What is the official explanation?',choices:['Unlicensed trolley convention','Organised rebellion','Wind'],
   replies:['The convention has already booked the same car park next year.','Security has issued a dispersal notice to an empty basket.','The weather office has refused to accept responsibility.']},
  {id:'FILE-006',slot:286,format:'minutes',eyebrow:'MINUTES / EMERGENCY COMMITTEE',title:'THE RUBBER DUCK HAS THE FLOOR',subtitle:'Annual safety meeting collapses after unexpected quorum',
   body:['The committee convened to determine whether rubber ducks count as maritime personnel. The question became complicated when the duck produced a tiny clipboard.','Dave proposed an amendment. Steve proposed a bath. Neither proposal was seconded by the duck, which maintained a dignified silence throughout.'],
   evidence:'ACTION ITEM 7: Establish how the duck obtained a visitor pass.',question:'Record the outcome?',choices:['Duck appointed honorary captain','Motion deferred indefinitely','Replace the chairman with a bath plug'],
   replies:['The duck has requested a uniform.','The question will return every year until morale improves.','The bath plug has already begun issuing instructions.']},
  {id:'FILE-007',slot:352,format:'notice',eyebrow:'OFFICIAL NOTICE / PUBLIC WORKS',title:'THE ROAD SIGN HAS GONE ON STRIKE',subtitle:'Directional assistance suspended until further notice',
   body:['A road sign has refused to point left after complaints that the right-hand destinations receive more attention. A temporary compromise has left the arrow facing directly upwards.','Motorists are confused. The cones have claimed this is evidence of a wider campaign against immobile infrastructure.'],
   evidence:'PUBLIC ADVICE: Please do not attempt to negotiate with municipal signage.',question:'Authorise a remedy?',choices:['Offer equal pointing opportunities','Rotate the road itself','Ask the bin to mediate'],
   replies:['The sign now points everywhere, which is not an improvement.','The engineering estimate is approximately the size of the national debt.','The bin has accepted, subject to provision of an executive parking bay.']},
  {id:'FILE-008',slot:421,format:'classified',eyebrow:'EVIDENCE LOCKER / RESTRICTED',title:'THE UNLABELLED BOX',subtitle:'Contents withheld under Rule 0',
   body:['An unlabelled cardboard box has arrived at headquarters addressed to “WHOEVER IS IN CHARGE OF THE NONSENSE.” No sender is recorded. The box appears to contain something metallic, although this may simply be a spoon.','Three separate employees have offered to open it. Each withdrew their offer upon hearing the noise from inside, which one described as “a disappointed bicycle bell.”'],
   evidence:'CHAIN OF CUSTODY: Received. Moved. Moved again. Denied ever receiving.',question:'Give the box an official designation?',choices:['Object of Possible Importance','Box of Regrettable Decisions','Leave it exactly where it is'],
   replies:['The box has been promoted above Steve.','Dave has requested the box for his birthday.','The box has moved to a different shelf by itself. Apparently.']},
  {id:'FILE-009',slot:488,format:'telegram',eyebrow:'URGENT TELEGRAM / DELIVER BY HAND',title:'THE GARDEN GNOME HAS VANISHED',subtitle:'Urgent inquiry into unauthorised horticultural travel',
   body:['STOP. GARDEN GNOME ABSENT FROM POST. STOP. FOOTPRINTS LEAD TO BUS STOP. STOP. BUS DRIVER REPORTS PASSENGER WITH POINTED HAT AND UNREASONABLY LARGE SUITCASE. STOP.','LAST KNOWN DESTINATION: UNKNOWN. GNOME OWES TWO POUNDS FIFTY IN BUS FARE. STOP.'],
   evidence:'ATTACHMENT: A tiny postcard reading “DON’T LOOK FOR ME.”',question:'What should the search team do?',choices:['Issue a missing-garden bulletin','Check the nearest seaside resort','Respect the gnome’s holiday'],
   replies:['Every lawn ornament in the county has been put on alert.','A sunburnt gnome has reportedly been seen ordering chips.','The gnome has sent a second postcard: “THANK YOU.”']},
  {id:'FILE-010',slot:556,format:'advert',eyebrow:'PAID ANNOUNCEMENT / PLEASE READ SMALL PRINT',title:'DAVE & STEVE’S ANTI-GRAVITY LADDER',subtitle:'Go up. Stay up. Possibly forever.',
   body:['Introducing the ladder designed for people who simply cannot be bothered coming back down. Our patented Gravity Optional Technology is nearly ready for independent examination.','Each ladder includes a free instruction leaflet consisting of three arrows and an apology. Not recommended for people who have a particular preference for remaining on the ground.'],
   evidence:'CUSTOMER REVIEW: “I went up a ladder once. This was worse.”',question:'Select the marketing tagline?',choices:['Progress, but vertically','No refunds above ground level','Please use the stairs'],
   replies:['Marketing has printed 50,000 posters upside down.','The lawyers have resigned in alphabetical order.','Sales have been suspended pending the invention of stairs.']},
  {id:'FILE-011',slot:623,format:'evidence',eyebrow:'FORENSIC EXHIBIT / HANDLE WITH TONGS',title:'A BISCUIT TIN FULL OF QUESTIONS',subtitle:'Evidence recovered from beneath Chief Tech Penguin’s desk',
   body:['Inside the tin: one paperclip, eleven biscuit crumbs, a map with a red circle, and a note reading “THE SPOON KNOWS.”','The penguin insists the tin is not his. The spoon insists nothing, being an ordinary spoon. At least, that is what the official report claims.'],
   evidence:'LAB REPORT: No fingerprints. Significant traces of custard cream.',question:'Who gets first interview?',choices:['The penguin','The spoon','The biscuit tin'],
   replies:['The penguin has asked for legal fish.','The spoon has requested a bigger drawer.','The biscuit tin has refused to open without a warrant.']},
  {id:'FILE-012',slot:701,format:'transmission',eyebrow:'RADIO LOG / FREQUENCY UNKNOWN',title:'THE WEATHER REPORT THAT NEVER HAPPENED',subtitle:'Emergency broadcast from a suspiciously cheerful umbrella',
   body:['FORECASTER: Today will bring scattered chairs, light drizzle of paperwork, and a 70 percent chance of misplaced dignity.\nCONTROL: Is that an approved forecast?\nFORECASTER: Define approved.','The studio subsequently discovered that the weather presenter was an umbrella standing next to an unattended microphone.'],
   evidence:'CONTROL NOTE: Please check which household objects have broadcasting licences.',question:'Release a correction?',choices:['Correct the forecast','Promote the umbrella','Stop recording household objects'],
   replies:['Tomorrow is now officially described as “probably weather.”','The umbrella has demanded a dressing room.','The microwave has already submitted a pilot programme.']},
  {id:'FILE-013',slot:777,format:'memo',eyebrow:'PERSONNEL FILE / STRICTLY INTERNAL',title:'THE TOASTER APPLIES FOR MANAGEMENT',subtitle:'Candidate demonstrates unusual confidence',
   body:['A toaster has submitted an application for the position of Deputy Chief of Operations. Its CV lists “reliability under pressure,” “excellent browning record,” and “four years’ experience handling bread.”','The interviews were suspended after the candidate announced it was taking over the office kitchen. The kettle has lodged a grievance.'],
   evidence:'HR ASSESSMENT: Promising candidate. Limited handshake capability.',question:'Record the hiring decision?',choices:['Offer a probationary contract','Recommend a kitchen role','Refer to Chief Tech Penguin'],
   replies:['The toaster now runs meetings at breakfast.','The toaster considers this a demotion.','The penguin has asked whether the toaster can do spreadsheets.']},
  {id:'FILE-014',slot:844,format:'minutes',eyebrow:'TRANSCRIPT / COURT OF OBJECTS',title:'THE PEOPLE VERSUS THE WHEELIE BIN',subtitle:'The tribunal considers a charge of excessive wheel confidence',
   body:['The prosecution presented evidence that the defendant had rolled across a marked line without first seeking permission from the cones. The defence argued that the line was painted in the wrong place.','Proceedings were interrupted when the courtroom clock declared itself an expert witness on matters of timing. The judge, a folding chair, called for order.'],
   evidence:'COURT CLERK: “Nobody present is legally qualified to be furniture.”',question:'Enter a verdict?',choices:['Not guilty','Guilty of being a bin','Mistrial on grounds of nonsense'],
   replies:['The bin has performed a tiny victory lap.','The bin is sentenced to community recycling.','The folding chair has folded itself in protest.']},
  {id:'FILE-015',slot:919,format:'notice',eyebrow:'SAFETY BULLETIN / REVISION 9',title:'PLEASE STOP FEEDING THE PRINTER',subtitle:'Unusual behaviour reported in the records office',
   body:['The printer has begun producing receipts for events that have not happened. One reads “ONE (1) MYSTERY, PAID IN FULL.” Another appears to be an invoice for twelve emergency rubber ducks.','Staff are reminded that electrical office equipment should not be offered biscuits, jam or promises of promotion.'],
   evidence:'NOTE: The machine has printed this warning 314 times without being asked.',question:'Select the new office policy?',choices:['Ban snacks near printers','Install a second printer as witness','Place the printer on leave'],
   replies:['The printer has requested a packed lunch exemption.','The second printer has immediately joined the conspiracy.','The printer has sent its holiday photos by fax.']},
  {id:'FILE-016',slot:1002,format:'classified',eyebrow:'ARCHIVE ACCESS / LEVEL ODD',title:'A VERY SMALL KEY FOR A VERY LARGE DOOR',subtitle:'Object received without operating instructions',
   body:['A key measuring barely one centimetre has been delivered for a door large enough to accommodate a bus. The key fits no known lock. The door exists only on an architectural drawing.','A handwritten note beside the drawing reads: “IF THE DEPARTMENT ASKS, THE DEPARTMENT DOES NOT EXIST.” A second note says: “ALSO, WHO TOOK THE SPOON?”'],
   evidence:'SECURITY CATALOGUE: Item is simultaneously missing and in storage.',question:'Where does the key belong?',choices:['The evidence locker','Chief Tech Penguin’s keyring','Somewhere that definitely isn’t the door'],
   replies:['Security has purchased a padlock for the locker.','The penguin now has thirty-nine keys and knows what none of them do.','The department reports that everything is proceeding as expected. This is concerning.']},
  {id:'FILE-017',slot:1081,format:'telegram',eyebrow:'SEALED MESSAGE / DO NOT FORWARD',title:'THE TROLLEY SENDS A POSTCARD',subtitle:'A message from somewhere definitely not on the route',
   body:['HELLO FROM THE SEASIDE. STOP. HAVE MET A FLAMINGO WITH AN INFLATABLE QUALIFICATION. STOP. THE BIN WOULD LOVE IT HERE BUT THERE ARE NO KERBS. STOP.','AM RETURNING ONCE I HAVE DECIDED WHETHER THE SPOON IS FOLLOWING ME. STOP.'],
   evidence:'POSTMARK: Smudged beyond all recognition. Smells faintly of chips.',question:'How should headquarters respond?',choices:['Enjoy your holiday','Return the office stationery','Who is the flamingo?'],
   replies:['The trolley has sent a photograph of a slightly damp pavement.','The office has received a postcard containing a single staple.','The reply was returned stamped: “CLASSIFIED FLAMINGO.”']},
  {id:'FILE-018',slot:1142,format:'incident',eyebrow:'FINAL REVIEW / INTERNAL AFFAIRS',title:'THE COMMITTEE HAS LOST THE COMMITTEE',subtitle:'Unscheduled disappearance during a scheduled meeting',
   body:['The emergency committee has adjourned indefinitely after discovering it has no members left in the room. Everyone assumed that someone else was chairing the meeting.','An empty chair moved a motion to investigate. The motion passed unanimously because nobody was present to object.'],
   evidence:'MINUTE 000: The meeting was called to disorder.',question:'Who is now acting chair?',choices:['The empty chair','The wheelie bin','Nobody: meeting cancelled'],
   replies:['The chair has immediately scheduled another committee meeting.','The bin has installed a reversing alarm in the boardroom.','The cancellation notice has been referred to a subcommittee.']},
  {id:'FILE-019',slot:1219,format:'newspaper',eyebrow:'THE FINAL EXTRA / PRIVATE EDITION',title:'HEADQUARTERS FINALLY ADMITS NOTHING',subtitle:'Extraordinary claims of closure immediately denied',
   body:['Following a lengthy investigation, headquarters issued a statement that all unusual activity had been explained. The statement was later withdrawn after a spoon, a toaster and a municipal wheelie bin appeared together at a press conference.','Chief Tech Penguin declined to comment. Dave and Steve issued conflicting reports. The three traffic cones claimed they had been warning everyone from the beginning.'],
   evidence:'EDITOR’S NOTE: This newspaper accepts no responsibility for any future sequels.',question:'File the final public statement?',choices:['Case closed, probably','The investigation continues','Give the bin a commemorative badge'],
   replies:['The official stamp reads “CLOSED UNTIL REOPENED.”','A new folder has appeared on the shelf without explanation.','The bin has accepted the award and requested a motorcade.']}
 ];
 const BY_ID=new Map(CASES.map(c=>[c.id,c]));
 const official=()=>{try{const s=window.rhEvilR1QA8103?.slots?.();return Array.isArray(s)&&s.length>=100?new Map(s.map(x=>[Number(x.slot),String(x.eventId)])):null}catch(_){return null}};
 const activeSpace=()=>{try{const s=window.rhSpace?.();return s?.catalogueKey==='fh5-catalogue-v1'?s:null}catch(_){return null}};
 const campaign=()=>{const p=activeSpace()?.evilCampaignR18098;return p?.campaignId===CAMPAIGN?p:null};
 const save=()=>{try{window.rhSave?.()}catch(err){console.warn('Secret side missions save failed',err)}};
 const yearSlot=n=>`SLOT ${String(n).padStart(4,'0')}`;
 function ensure(){
  const s=activeSpace();if(!s||!campaign())return null;
  let h=s[KEY];
  if(!h||typeof h!=='object'||Array.isArray(h)){
   h={version:'1',earned:{},opened:{},choices:{},createdAt:now()};s[KEY]=h;save();
  }
  if(!h.earned||typeof h.earned!=='object')h.earned={};
  if(!h.opened||typeof h.opened!=='object')h.opened={};
  if(!h.choices||typeof h.choices!=='object')h.choices={};
  return h;
 }
 function sync(){
  const p=campaign(),slots=official();if(!p||!slots)return {earned:0,unread:0,ready:false};
  const h=ensure();if(!h)return {earned:0,unread:0,ready:false};
  let changed=false;
  for(const c of CASES){
   const mark=p.done?.[String(c.slot)];
   if(!mark||mark.eventId==null||slots.get(c.slot)!==String(mark.eventId))continue;
   if(!h.earned[c.id]){h.earned[c.id]={slot:c.slot,eventId:String(mark.eventId),earnedAt:String(mark.doneAt||now())};changed=true}
  }
  if(changed)save();
  const ids=CASES.filter(c=>h.earned[c.id]).map(c=>c.id);
  return {earned:ids.length,unread:ids.filter(id=>!h.opened[id]).length,ready:true};
 }
 let archiveOpen=false;
 function panelHTML(){
  const s=sync(),h=ensure();
  const ids=CASES.filter(c=>h?.earned?.[c.id]);
  const cards=archiveOpen?ids.map(c=>`<button class="ssm163-file" type="button" data-ssm-open="${c.id}"><span class="ssm163-fileIcon">▤</span><span><strong>${E(c.id)} · ${h.opened[c.id]?'FILE ARCHIVED':'NEW CLASSIFIED FILE'}</strong><small>${yearSlot(c.slot)} · ${h.choices[c.id]!==undefined?'DECISION RECORDED':h.opened[c.id]?'OPENED':'UNREAD'}</small></span><b>OPEN ›</b></button>`).join(''):'';
  const firstUnread=ids.find(c=>!h.opened[c.id]);
  return `<section class="ssm163-panel" id="otgSecretDossiers8163" aria-label="Secret side missions"><div class="ssm163-heading"><span class="ssm163-eye">OTG! • RESTRICTED DEPARTMENT</span><h3>CLASSIFIED SIDE MISSIONS</h3><p>Strange paperwork occasionally surfaces as you complete the Evil Tournament. Nothing to race, nothing to earn twice, and nothing here affects your results.</p></div><div class="ssm163-dashboard"><div><b>${s.earned}</b><small>FILES RECOVERED</small></div><div><b>${s.unread}</b><small>UNREAD FILES</small></div><div><b>?</b><small>MORE CLASSIFIED</small></div></div><div class="ssm163-actions">${firstUnread?`<button type="button" class="ssm163-primary" data-ssm-open="${firstUnread.id}">⚠ OPEN UNREAD FILE</button>`:''}<button type="button" class="ssm163-secondary" data-ssm-archive="1">${archiveOpen?'CLOSE ARCHIVE':'VIEW FILE ARCHIVE'} ›</button></div>${archiveOpen?`<div class="ssm163-archive">${cards||'<p>No recovered files yet. The archives are still sealed.</p>'}</div>`:''}</section>`;
 }
 function decorateGallery(){
  const main=document.querySelector('#evilcampaign .otgHosRewardsPage8152 main.rhEvilR1Body8097');
  if(!main)return;
  const original=main.querySelector('#otgSecretDossiers8163');
  if(original)return;
  const spot=main.querySelector('.otgHosGrid8147');
  if(!spot)return;
  spot.insertAdjacentHTML('beforebegin',panelHTML());
  bindPanel();
 }
 function bindPanel(){
  const p=document.getElementById('otgSecretDossiers8163');if(!p)return;
  p.addEventListener('click',e=>{
   const opened=e.target.closest('[data-ssm-open]');if(opened){openFile(opened.dataset.ssmOpen);return}
   if(e.target.closest('[data-ssm-archive]')){archiveOpen=!archiveOpen;paintPanel()}
  });
 }
 function paintPanel(){
  const old=document.getElementById('otgSecretDossiers8163');if(!old)return;
  old.outerHTML=panelHTML();bindPanel();
 }
 function closeFile(){document.getElementById('otgSecretOverlay8163')?.remove();paintPanel()}
 function openFile(id){
  const c=BY_ID.get(String(id));if(!c||!campaign()||!official())return false;
  const h=ensure();if(!h?.earned[c.id])return false;
  if(!h.opened[c.id]){h.opened[c.id]=now();save()}
  closeFile();
  const previous=h.choices[c.id];
  const el=document.createElement('div');el.id='otgSecretOverlay8163';el.className='ssm163-overlay';
  el.innerHTML=`<div class="ssm163-sheet ssm163-${E(c.format)}" role="dialog" aria-modal="true" aria-label="Classified side mission"><div class="ssm163-sheetTop"><span>OTG! · HALL OF SHAME</span><button type="button" data-ssm-close="1" aria-label="Close file">✕</button></div><div class="ssm163-stamp">${E(c.id)} · EARNED ${yearSlot(c.slot)}</div><p class="ssm163-kicker">${E(c.eyebrow)}</p><h2>${E(c.title)}</h2><h3>${E(c.subtitle)}</h3><div class="ssm163-story">${c.body.map(x=>`<p>${E(x).replace(/\n/g,'<br>')}</p>`).join('')}</div><blockquote>${E(c.evidence)}</blockquote><div class="ssm163-decision"><b>YOUR CLASSIFIED DECISION</b><p>${E(c.question)}</p><div class="ssm163-choiceList">${c.choices.map((x,i)=>`<button type="button" data-ssm-choice="${i}" ${previous===i?'aria-pressed="true"':''}>${E(x)}</button>`).join('')}</div><div class="ssm163-reply" id="ssm163Reply">${Number.isInteger(previous)?`<strong>FILED ✓</strong><p>${E(c.replies[previous])}</p>`:'<span>Optional: record a decision in this private file. It has absolutely no effect on racing.</span>'}</div></div><button class="ssm163-return" type="button" data-ssm-close="1">← BACK TO THE HALL OF SHAME</button></div>`;
  el.addEventListener('click',e=>{
   if(e.target.closest('[data-ssm-close]')||e.target===el){closeFile();return}
   const select=e.target.closest('[data-ssm-choice]');if(!select)return;
   const i=Number(select.dataset.ssmChoice);if(!Number.isInteger(i)||i<0||i>=c.choices.length)return;
   const fresh=ensure();if(!fresh?.earned[c.id])return;
   fresh.choices[c.id]=i;save();
   el.querySelectorAll('[data-ssm-choice]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.ssmChoice)===i)));
   const msg=el.querySelector('#ssm163Reply');if(msg)msg.innerHTML=`<strong>FILED ✓</strong><p>${E(c.replies[i])}</p>`;
  });
  document.body.appendChild(el);
  return true;
 }
 function init(){
  const base=window.rhOpenHallOfShame8147;
  if(typeof base!=='function'||base._ssm163)return;
  function wrapped(){const r=base.apply(this,arguments);try{decorateGallery()}catch(err){console.warn('Secret files gallery decoration failed',err)}return r}
  wrapped._ssm163=true;window.rhOpenHallOfShame8147=wrapped;
  // No interval/observer or forced gallery opening. Recovery is done on demand;
  // historically verified DONE slots are credited on first Hall of Shame visit.
 }
 window.otgSecretSideMissionsQA8163={sync,ensure,openFile,decorateGallery,caseCount:()=>CASES.length,storeKey:KEY};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
