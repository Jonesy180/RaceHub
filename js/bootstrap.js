// RaceHub v5.4.12 — Bootstrap / Guide Page 1

const GUIDE_PROGRESS_KEY='RaceHub_Guide_Progress';

function openGuideWelcome(){
  const welcome=document.getElementById('guideWelcome');
  if(!welcome)return;
  welcome.classList.remove('hidden');
  welcome.setAttribute('aria-hidden','false');
  document.documentElement.style.overflow='hidden';
  document.body.style.overflow='hidden';
}

function closeGuideWelcome(){
  const welcome=document.getElementById('guideWelcome');
  if(!welcome)return;
  welcome.classList.add('hidden');
  welcome.setAttribute('aria-hidden','true');
  document.documentElement.style.overflow='';
  document.body.style.overflow='';
}


function developmentRestartGuide(){
  // DEVELOPMENT ONLY: reset Guide progress and nothing else.
  // Never clear RaceHub storage, Garage, results, events, settings, records or stats here.
  localStorage.removeItem(GUIDE_PROGRESS_KEY);
  show('festival');
  openGuideWelcome();
}

function startRaceHubGuide(){
  // Page 1 is complete. Page 2 will consume this progress value at its checkpoint.
  localStorage.setItem(GUIDE_PROGRESS_KEY,'1');
  closeGuideWelcome();
  show('festival');
}

state=load();
show('festival');

const guideStart=document.getElementById('guideWelcomeStart');
if(guideStart)guideStart.addEventListener('click',startRaceHubGuide);

const guideDevRestart=document.getElementById('guideDevRestart');
if(guideDevRestart)guideDevRestart.addEventListener('click',developmentRestartGuide);

if(Number(localStorage.getItem(GUIDE_PROGRESS_KEY)||'0')<1){
  openGuideWelcome();
}

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));}
