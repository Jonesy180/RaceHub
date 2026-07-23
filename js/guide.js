// RaceHub v5.4.17 — isolated Development Guide controller
(() => {
  'use strict';

  const KEY = 'RaceHub_Guide_Progress';
  const DRAFT_DRIVER = 'RaceHub_Guide_Driver_Name';
  const DRAFT_HUB = 'RaceHub_Guide_RaceHub_Name';

  const pages = {
    1: document.getElementById('guideWelcome'),
    2: document.getElementById('guideHubsIntro'),
    3: document.getElementById('guideDriverProfile'),
    4: document.getElementById('guideFavouriteManufacturer')
  };

  const driverInput = document.getElementById('rhGuideDriverName');
  const hubInput = document.getElementById('rhGuideRaceHubName');
  const manufacturerSearch = document.getElementById('rhGuideManufacturerSearch');
  const manufacturerSelection = document.getElementById('rhGuideManufacturerSelection');
  const manufacturerRows = [...document.querySelectorAll('.rhGuideManufacturerRow')];
  const FAVOURITE_KEY = 'RaceHub_Guide_Favourite_Manufacturer';
  let selectedManufacturer = localStorage.getItem(FAVOURITE_KEY) || 'Ferrari';

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

    if(pageNumber === 4){
      renderManufacturerSelection();
    }
  }

  function renderManufacturerSelection(){
    manufacturerRows.forEach(row => row.classList.toggle('selected', row.dataset.make === selectedManufacturer));
    if(!manufacturerSelection) return;

    if(!selectedManufacturer){
      manufacturerSelection.classList.add('hidden');
      manufacturerSelection.setAttribute('aria-hidden','true');
      return;
    }

    const selectedRow = manufacturerRows.find(row => row.dataset.make === selectedManufacturer);
    if(!selectedRow) return;

    const pageFrame = selectedRow.closest('.rhGuideFrame');
    const rowRect = selectedRow.getBoundingClientRect();
    const frameRect = pageFrame.getBoundingClientRect();

    manufacturerSelection.textContent = selectedManufacturer;
    manufacturerSelection.style.left = `${((rowRect.left-frameRect.left)/frameRect.width)*100}%`;
    manufacturerSelection.style.top = `${((rowRect.top-frameRect.top)/frameRect.height)*100}%`;
    manufacturerSelection.style.width = `${(rowRect.width/frameRect.width)*100}%`;
    manufacturerSelection.style.height = `${(rowRect.height/frameRect.height)*100}%`;
    manufacturerSelection.classList.remove('hidden');
    manufacturerSelection.setAttribute('aria-hidden','false');
  }

  function chooseManufacturer(make){
    selectedManufacturer = make;
    localStorage.setItem(FAVOURITE_KEY, make);
    renderManufacturerSelection();
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
    open(4);
  });

  document.getElementById('rhGuideP4Back')?.addEventListener('click', () => open(3));

  manufacturerRows.forEach(row => {
    row.addEventListener('click', () => chooseManufacturer(row.dataset.make || ''));
  });

  manufacturerSearch?.addEventListener('input', () => {
    const q = manufacturerSearch.value.trim().toLowerCase();
    const match = manufacturerRows.find(row => (row.dataset.make || '').toLowerCase().startsWith(q));
    if(q && match) chooseManufacturer(match.dataset.make || '');
  });

  document.getElementById('rhGuideP4Continue')?.addEventListener('click', () => {
    if(selectedManufacturer) localStorage.setItem(FAVOURITE_KEY, selectedManufacturer);
    localStorage.setItem(KEY,'4');
    finish();
  });

  document.getElementById('rhGuideP4Skip')?.addEventListener('click', () => {
    localStorage.removeItem(FAVOURITE_KEY);
    selectedManufacturer = '';
    localStorage.setItem(KEY,'4');
    finish();
  });

  // Deterministic startup for every possible progress value.
  const progress = Number(localStorage.getItem(KEY) || '0');
  if(progress < 1) open(1);
  else if(progress < 2) open(2);
  else if(progress < 3) open(3);
  else if(progress < 4) open(4);
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
