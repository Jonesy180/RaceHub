/* RaceHub v6.0.14 — Stage 8B Advanced Timing lap-entry interaction foundation.
   Builds only on passed v6.0.13 Stage 8A. Adds optional lap-count/time entry inside the expanded shell.
   No lap persistence, derived calculations or result-flow changes in this checkpoint. */
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


  function clampInt(value,min,max){
    const digits=String(value??'').replace(/\D/g,'');
    if(!digits)return min;
    const parsed=parseInt(digits,10);
    return Math.max(min,Math.min(max,Number.isFinite(parsed)?parsed:min));
  }

  function lapRow(index){
    const n=index+1;
    return `<div class="rhAdvancedTimingLapRowV6014" data-lap="${n}">
      <span class="rhAdvancedTimingLapLabelV6014">LAP ${String(n).padStart(2,'0')}</span>
      <div class="rhAdvancedTimingLapTimeV6014" aria-label="Lap ${n} time">
        <label><input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" autocomplete="off" placeholder="00" data-part="min" aria-label="Lap ${n} minutes" oninput="rhAdvancedTimingSanitiseTimeV6014(this,99)"><small>MIN</small></label>
        <b>:</b>
        <label><input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" autocomplete="off" placeholder="00" data-part="sec" aria-label="Lap ${n} seconds" oninput="rhAdvancedTimingSanitiseTimeV6014(this,59)"><small>SEC</small></label>
        <b>.</b>
        <label class="ms"><input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="3" autocomplete="off" placeholder="000" data-part="ms" aria-label="Lap ${n} milliseconds" oninput="rhAdvancedTimingSanitiseTimeV6014(this,999)"><small>MS</small></label>
      </div>
    </div>`;
  }

  function renderLapRows(panel,count){
    const holder=panel?.querySelector('.rhAdvancedTimingLapsV6014');
    if(!holder)return;
    const existing=Array.from(holder.querySelectorAll('.rhAdvancedTimingLapRowV6014')).map(row=>({
      min:row.querySelector('[data-part="min"]')?.value||'',
      sec:row.querySelector('[data-part="sec"]')?.value||'',
      ms:row.querySelector('[data-part="ms"]')?.value||''
    }));
    holder.innerHTML=Array.from({length:count},(_,i)=>lapRow(i)).join('');
    Array.from(holder.querySelectorAll('.rhAdvancedTimingLapRowV6014')).forEach((row,i)=>{
      const prior=existing[i];
      if(!prior)return;
      row.querySelector('[data-part="min"]').value=prior.min;
      row.querySelector('[data-part="sec"]').value=prior.sec;
      row.querySelector('[data-part="ms"]').value=prior.ms;
    });
    const progress=panel.querySelector('.rhAdvancedTimingProgressV6014 span');
    if(progress)progress.textContent=`${count} LAP${count===1?'':'S'} READY`;
  }

  window.rhAdvancedTimingSetLapCountV6014=function(input){
    const count=clampInt(input?.value,1,99);
    input.value=String(count);
    renderLapRows(input.closest('.rhAdvancedTimingV6013'),count);
  };

  window.rhAdvancedTimingStepLapsV6014=function(button,delta){
    const panel=button?.closest?.('.rhAdvancedTimingV6013');
    const input=panel?.querySelector('.rhAdvancedTimingLapCountV6014');
    if(!input)return;
    const count=Math.max(1,Math.min(99,clampInt(input.value,1,99)+(delta>0?1:-1)));
    input.value=String(count);
    renderLapRows(panel,count);
  };

  window.rhAdvancedTimingSanitiseTimeV6014=function(input,max){
    const raw=String(input?.value??'').replace(/\D/g,'').slice(0,input?.maxLength>0?input.maxLength:3);
    if(!raw){input.value='';return;}
    input.value=String(Math.min(Number(raw),Number(max)));
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
          <div class="rhAdvancedTimingEntryV6014">
            <div class="rhAdvancedTimingCountRowV6014">
              <label>NUMBER OF LAPS</label>
              <div class="rhAdvancedTimingCountControlV6014">
                <button type="button" aria-label="Remove lap" onclick="rhAdvancedTimingStepLapsV6014(this,-1)">−</button>
                <input class="rhAdvancedTimingLapCountV6014" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" autocomplete="off" value="1" aria-label="Number of laps" oninput="rhAdvancedTimingSetLapCountV6014(this)">
                <button type="button" aria-label="Add lap" onclick="rhAdvancedTimingStepLapsV6014(this,1)">+</button>
              </div>
            </div>
            <div class="rhAdvancedTimingLapsV6014" aria-live="polite"></div>
            <div class="rhAdvancedTimingProgressV6014"><span>1 LAP READY</span><em>Optional lap detail</em></div>
          </div>
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
      if(controls){controls.insertAdjacentHTML('afterbegin',collapsedTimingTile());const panel=controls.querySelector('.rhAdvancedTimingV6013');renderLapRows(panel,1);}
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
