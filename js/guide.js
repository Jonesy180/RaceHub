// RaceHub v5.4.17 — isolated Development Guide controller
(() => {
  'use strict';

  const KEY = 'RaceHub_Guide_Progress';
  const DRAFT_DRIVER = 'RaceHub_Guide_Driver_Name';
  const DRAFT_HUB = 'RaceHub_Guide_RaceHub_Name';

  const pages = {
    1: document.getElementById('guideWelcome'),
    2: document.getElementById('guideHubsIntro'),
    3: document.getElementById('guideDriverProfile')
  };

  const driverInput = document.getElementById('rhGuideDriverName');
  const hubInput = document.getElementById('rhGuideRaceHubName');

  function lockScroll(locked){
    document.documentElement.style.overflow = locked ? 'hidden' : '';
    document.body.style.overflow = locked ? 'hidden' : '';
  }

  function hideAll(){
    Object.values(pages).forEach(page => {
      if(!page) return;
      page.classList.add('hidden');
      page.setAttribute('aria-hidden','true');
    });
  }

  function open(pageNumber){
    hideAll();
    const page = pages[pageNumber];
    if(!page) return;
    page.classList.remove('hidden');
    page.setAttribute('aria-hidden','false');
    lockScroll(true);

    if(pageNumber === 3){
      if(driverInput && !driverInput.value) driverInput.value = localStorage.getItem(DRAFT_DRIVER) || '';
      if(hubInput && !hubInput.value) hubInput.value = localStorage.getItem(DRAFT_HUB) || '';
    }
  }

  function finish(){
    hideAll();
    lockScroll(false);
    if(typeof window.show === 'function') window.show('festival');
  }

  document.getElementById('rhGuideP1Next')?.addEventListener('click', () => {
    localStorage.setItem(KEY,'1');
    open(2);
  });

  document.getElementById('rhGuideP2Back')?.addEventListener('click', () => open(1));

  document.getElementById('rhGuideP2Next')?.addEventListener('click', () => {
    localStorage.setItem(KEY,'2');
    open(3);
  });

  document.getElementById('rhGuideP3Back')?.addEventListener('click', () => open(2));

  driverInput?.addEventListener('input', () => localStorage.setItem(DRAFT_DRIVER, driverInput.value));
  hubInput?.addEventListener('input', () => localStorage.setItem(DRAFT_HUB, hubInput.value));

  document.getElementById('rhGuideP3Next')?.addEventListener('click', () => {
    const driver = (driverInput?.value || '').trim();
    const hub = (hubInput?.value || '').trim();
    if(!driver || !hub) return;

    localStorage.setItem(DRAFT_DRIVER, driver);
    localStorage.setItem(DRAFT_HUB, hub);
    localStorage.setItem(KEY,'3');
    finish();
  });

  // Deterministic startup for every possible progress value.
  const progress = Number(localStorage.getItem(KEY) || '0');
  if(progress < 1) open(1);
  else if(progress < 2) open(2);
  else if(progress < 3) open(3);
  else finish();

  // Development convenience API; the visible reset button also has an inline fallback.
  window.RaceHubGuide = {
    open,
    reset(){
      localStorage.removeItem(KEY);
      location.reload();
    }
  };
})();
