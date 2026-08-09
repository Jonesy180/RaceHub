/* RaceHub v6.0.13 — Stage 8A Advanced Timing presentation foundation only.
   Presentation shell + global preference. No lap persistence, calculations or result-flow changes. */
(()=>{
  'use strict';
  const enabled=()=>state?.settings?.advancedTiming===true;
  const safe=v=>typeof window.esc==='function'?window.esc(String(v??'')):String(v??'');

  function ensurePreference(){
    if(!state.settings||typeof state.settings!=='object')state.settings={};
    if(typeof state.settings.advancedTiming!=='boolean')state.settings.advancedTiming=false;
  }

  window.rhSetAdvancedTimingV6013=function(value){
    ensurePreference();
    state.settings.advancedTiming=!!value;
    if(typeof window.rhSave==='function')window.rhSave();
    else if(typeof window.save==='function')window.save();
  };

  window.rhToggleAdvancedTimingPanelV6013=function(button){
    const panel=button?.closest?.('.rhAdvancedTimingV6013');
    if(!panel)return;
    const open=panel.classList.toggle('open');
    button.setAttribute('aria-expanded',open?'true':'false');
    const body=panel.querySelector('.rhAdvancedTimingBodyV6013');
    if(body)body.hidden=!open;
  };

  function settingsPanel(){
    return `<section class="rhSection rhAdvancedTimingSettingsV6013">
      <h2>Advanced Timing</h2>
      <label class="rhToggle rhAdvancedTimingToggleV6013">
        <span><b>Advanced Timing</b><small>Show optional lap-timing tools on Enter Result.</small></span>
        <input id="rhAdvancedTimingSettingV6013" type="checkbox" ${enabled()?'checked':''} onchange="rhSetAdvancedTimingV6013(this.checked)">
      </label>
    </section>`;
  }

  const renderSettings=window.rhRenderSettings;
  if(typeof renderSettings==='function')window.rhRenderSettings=function(){
    ensurePreference();
    const out=renderSettings.apply(this,arguments);
    const content=document.querySelector('#more .rhContent');
    if(!content||content.querySelector('.rhAdvancedTimingSettingsV6013'))return out;
    const sections=Array.from(content.querySelectorAll(':scope > .rhSection'));
    const celebrations=sections.find(section=>/^celebrations$/i.test(section.querySelector('h2')?.textContent?.trim()||''));
    if(celebrations)celebrations.insertAdjacentHTML('afterend',settingsPanel());
    else content.insertAdjacentHTML('afterbegin',settingsPanel());
    return out;
  };

  function collapsedTimingTile(){
    return `<section class="rhAdvancedTimingV6013">
      <button type="button" class="rhAdvancedTimingHeadV6013" aria-expanded="false" onclick="rhToggleAdvancedTimingPanelV6013(this)">
        <span class="rhAdvancedTimingIconV6013" aria-hidden="true">◷</span>
        <span><small>OPTIONAL</small><b>ADVANCED TIMING</b></span>
        <em>EXPAND</em>
      </button>
      <div class="rhAdvancedTimingBodyV6013" hidden>
        <div class="rhAdvancedTimingShellV6013">
          <small>LAP TIMING</small>
          <b>Record more detail when you want it.</b>
          <p>Advanced Timing adds optional lap timing alongside the existing total race time.</p>
        </div>
      </div>
    </section>`;
  }

  function discoverabilityTile(){
    return `<aside class="rhAdvancedTimingDiscoverV6013" aria-label="Advanced Timing available">
      <span class="rhAdvancedTimingIconV6013" aria-hidden="true">◷</span>
      <span><b>ADVANCED TIMING</b><small>Want to record lap timing too? Enable Advanced Timing in Settings.</small></span>
    </aside>`;
  }

  function decorateResultEntry(hostId){
    ensurePreference();
    const host=document.getElementById(hostId);
    const main=host?.querySelector('.rh5801Entry');
    if(!main)return;
    main.querySelectorAll('.rhAdvancedTimingV6013,.rhAdvancedTimingDiscoverV6013').forEach(x=>x.remove());
    if(enabled()){
      const controls=main.querySelector('.rh5801Controls');
      if(controls)controls.insertAdjacentHTML('afterbegin',collapsedTimingTile());
    }else{
      const position=main.querySelector('.rh5801Position');
      if(position)position.insertAdjacentHTML('afterend',discoverabilityTile());
    }
  }

  const enterResult=window.rhEnterResult;
  if(typeof enterResult==='function')window.rhEnterResult=function(){
    const out=enterResult.apply(this,arguments);
    decorateResultEntry('festival');
    return out;
  };
  const eventResult=window.rhEventResult;
  if(typeof eventResult==='function')window.rhEventResult=function(){
    const out=eventResult.apply(this,arguments);
    decorateResultEntry('event');
    return out;
  };

  ensurePreference();
})();
