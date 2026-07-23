// RaceHub v5.4.14 — Bootstrap / Guide Pages 2-3

const GUIDE_PROGRESS_KEY='RaceHub_Guide_Progress';

function setGuideScrollLock(locked){
  document.documentElement.style.overflow=locked?'hidden':'';
  document.body.style.overflow=locked?'hidden':'';
}

function hideGuidePages(){
  ['guideWelcome','guideHubsIntro','guideDriverProfile'].forEach(id=>{
    const el=document.getElementById(id);
    if(!el)return;
    el.classList.add('hidden');
    el.setAttribute('aria-hidden','true');
  });
}

function openGuidePage(id){
  hideGuidePages();
  const page=document.getElementById(id);
  if(!page)return;
  page.classList.remove('hidden');
  page.setAttribute('aria-hidden','false');
  setGuideScrollLock(true);
}

function closeRaceHubGuide(){
  hideGuidePages();
  setGuideScrollLock(false);
}

function openGuideWelcome(){ openGuidePage('guideWelcome'); }
function openGuideHubsIntro(){ openGuidePage('guideHubsIntro'); }
function openGuideDriverProfile(){ openGuidePage('guideDriverProfile'); }

function developmentRestartGuide(){
  // DEVELOPMENT ONLY: reset Guide progress and nothing else.
  // Never clear RaceHub storage, Garage, results, events, settings, records or stats here.
  localStorage.removeItem(GUIDE_PROGRESS_KEY);
  show('festival');
  openGuideWelcome();
}

function startRaceHubGuide(){
  // Page 1 complete: continue directly to Page 2.
  localStorage.setItem(GUIDE_PROGRESS_KEY,'1');
  openGuideHubsIntro();
}

function backToGuideWelcome(){
  // Navigation only: do not touch RaceHub data or Guide completion state.
  openGuideWelcome();
}

function completeGuideHubsIntro(){
  // Page 2 complete: continue directly to Page 3.
  localStorage.setItem(GUIDE_PROGRESS_KEY,'2');
  openGuideDriverProfile();
}


function saveGuideProfile(){
  const driver=(document.getElementById('guideDriverNameInput')?.value||'').trim();
  const hub=(document.getElementById('guideRaceHubNameInput')?.value||'').trim();

  // Both fields are required before continuing.
  if(!driver || !hub) return;

  // Keep Guide/profile values separate from legacy RaceHub data during Development.
  localStorage.setItem('RaceHub_Guide_Driver_Name',driver);
  localStorage.setItem('RaceHub_Guide_RaceHub_Name',hub);
  localStorage.setItem(GUIDE_PROGRESS_KEY,'3');

  closeRaceHubGuide();
  show('festival');
}

state=load();
show('festival');

const guideStart=document.getElementById('guideWelcomeStart');
if(guideStart)guideStart.addEventListener('click',startRaceHubGuide);

const guideHubsBack=document.getElementById('guideHubsBack');
if(guideHubsBack)guideHubsBack.addEventListener('click',backToGuideWelcome);

const guideHubsNext=document.getElementById('guideHubsNext');
if(guideHubsNext)guideHubsNext.addEventListener('click',completeGuideHubsIntro);

const guideProfileBack=document.getElementById('guideProfileBack');
if(guideProfileBack)guideProfileBack.addEventListener('click',openGuideHubsIntro);

const guideProfileNext=document.getElementById('guideProfileNext');
if(guideProfileNext)guideProfileNext.addEventListener('click',saveGuideProfile);

const guideDevRestart=document.getElementById('guideDevRestart');
if(guideDevRestart)guideDevRestart.addEventListener('click',developmentRestartGuide);

const guideProgress=Number(localStorage.getItem(GUIDE_PROGRESS_KEY)||'0');
if(guideProgress<1){
  openGuideWelcome();
}else if(guideProgress<2){
  openGuideHubsIntro();
}else if(guideProgress<3){
  openGuideDriverProfile();
}

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));}
