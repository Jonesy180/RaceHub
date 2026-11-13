/* OTG! MAIN 8.0.190 — isolated relay competition QA; only namespaced QA localStorage writes.
   Does not touch rhSave/rhLoad, Evil 1 state, honours, or live racing records. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.rhEvil2RelayCompetition190 = api;
})(typeof globalThis !== 'undefined' ? globalThis : null, function () {
  'use strict';
  const PREFIX = 'otg.evil2.relay.qa.v1:';
  const size = 12;
  let mode = 'maker', seed = 189, page = 0, screen = null, current = null, message = '';
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const maker = c => String(c.make || 'Unknown');
  function space() { return typeof window !== 'undefined' ? window.rhSpace?.() : null; }
  function key(s, m) {
    // Never risk writing another Space's draft if a stable Space identifier is absent.
    const id = s && (s.id || s.spaceId || s.space_id);
    return id == null || String(id).trim() === '' ? null : PREFIX + encodeURIComponent(String(id)) + ':' + m;
  }
  function read(k) {
    if (!k) return null;
    try {
      const v = JSON.parse(localStorage.getItem(k) || 'null');
      if (!v || v.schema !== 1 || !Array.isArray(v.teams) || !Array.isArray(v.results) || !['maker','mixed'].includes(v.mode)) return null;
      if (v.teams.length > 2000 || v.results.length !== v.teams.length) return null;
      return v;
    } catch (_) { return null; }
  }
  function write(k, v) {
    if (!k) throw Error('No stable Space ID: cannot save safely.');
    // A dedicated QA namespace; never write into the live OTG! app state.
    localStorage.setItem(k, JSON.stringify(v));
  }
  function time(value) {
    let digits = String(value ?? '').trim();
    if (!/^[0-9]{1,9}$/.test(digits)) throw Error('Use digits only (example: 0342250).');
    digits = digits.padStart(digits.length > 7 ? 9 : 7, '0');
    const ms = Number(digits.slice(-3)), sec = Number(digits.slice(-5,-3));
    const mins = Number(digits.slice(-7,-5)), hrs = digits.length === 9 ? Number(digits.slice(0,2)) : 0;
    if (sec > 59 || mins > 59 || (hrs === 0 && mins === 0 && sec === 0 && ms === 0)) throw Error('Enter a valid non-zero time; seconds and minutes must be under 60.');
    return (((hrs * 60 + mins) * 60 + sec) * 1000 + ms);
  }
  function format(t) { if (!Number.isSafeInteger(t) || t <= 0) return '—';
    const ms = String(t % 1000).padStart(3,'0'), sec = String(Math.floor(t/1000)%60).padStart(2,'0');
    const min = String(Math.floor(t/60000)%60).padStart(2,'0'), hrs = Math.floor(t/3600000);
    return (hrs ? String(hrs).padStart(2,'0')+':' : '') + min + ':' + sec + '.' + ms;
  }
  function validSaved(saved, m) {
    if (!saved || saved.mode !== m) return false;
    const seen = new Set();
    for (const team of saved.teams) {
      if (!team || !Array.isArray(team.cars) || team.cars.length !== 3) return false;
      const makes = new Set();
      for (const c of team.cars) {
        if (c?.id == null || seen.has(String(c.id))) return false;
        seen.add(String(c.id)); makes.add(maker(c));
      }
      if (makes.size !== (m === 'maker' ? 1 : 3)) return false;
    }
    return true;
  }
  function getData() {
    const s = space(), allowed = s?.catalogueKey === 'fh5-catalogue-v1';
    const storageKey = key(s,mode), stored = read(storageKey);
    if (stored && !validSaved(stored,mode)) return {error:'Saved relay failed validation; no changes were made.',storageKey};
    if (stored) return {locked:true,d:stored,storageKey,allowed};
    if (!allowed) return {error:'Open your FH5 catalogue Space to create a relay.',storageKey};
    const cars = window.rhEvil2Rules181?.carsOf(s);
    if (!Array.isArray(cars)) return {error:'Garage rules engine is unavailable.',storageKey};
    const d = window.rhEvil2MaxRelay189?.draw(cars,mode,seed);
    return {locked:false,d,storageKey,allowed};
  }
  function saveStages(e, index) {
    e.preventDefault();
    const st = current;
    if (!st?.locked || !st.storageKey) return;
    const form = e.currentTarget, values = [...form.querySelectorAll('input[data-stage]')];
    const next = st.d.results.map(a => a.slice());
    try {
      for (const input of values) {
        const n = Number(input.dataset.stage), v = input.value.trim();
        next[index][n] = v === '' ? null : time(v);
      }
      write(st.storageKey, {...st.d,results:next});
      message = 'Stage times saved to isolated Relay QA storage.'; paint();
    } catch (err) { message = String(err.message || err); const alert = screen.querySelector('#erc-message'); if(alert)alert.textContent=message; }
  }
  function paint() {
    if (!screen) return;
    let data;
    try { data = getData(); } catch (err) { data = {error:String(err.message||err)}; }
    current = data;
    const d = data.d, locked = data.locked;
    let h = `<header class="erc-top"><button type="button" id="erc-back">← BACK TO EVIL 2.0</button><small>v8.0.190 · ISOLATED QA</small></header><h2>RELAY COMPETITION GARAGE</h2>`;
    h += '<p class="erc-warning">TEST ENGINE ONLY. Draw locks and stage times are saved separately in this browser. No career honours, live race records, Evil 1.0 changes or campaign Slot 001.</p>';
    h += `<div class="erc-tabs"><button type="button" data-mode="maker" class="${mode==='maker'?'active':''}">🏭 Manufacturer</button><button type="button" data-mode="mixed" class="${mode==='mixed'?'active':''}">🏎️ Mixed</button></div>`;
    h += `<p id="erc-message" role="status">${esc(message)}</p>`;
    if (data.error) h+=`<p class="erc-error" role="alert">${esc(data.error)}</p>`;
    if (d) {
      const teams = d.teams, count = teams.length, pages = Math.max(1,Math.ceil(count/size));page=Math.max(0,Math.min(page,pages-1));
      const filled = locked ? d.results.reduce((n,a)=>n+a.filter(Number.isInteger).length,0) : 0;
      const completed = locked ? d.results.filter(a=>a.every(Number.isInteger)).length : 0;
      h += `<div class="erc-stats"><div><b>${d.eligible}</b><small>Eligible at draw</small></div><div><b>${count}</b><small>Teams</small></div><div><b>${d.entered}</b><small>Cars entered</small></div><div><b>${d.leftovers.length}</b><small>Unused</small></div></div>`;
      if (!locked) {
        h += `<div class="erc-controls"><label>Repeatable seed<input id="erc-seed" type="number" min="1" max="4294967295" inputmode="numeric" value="${seed}"></label><button id="erc-redraw" type="button">🎲 REDRAW TEAMS</button></div>`;
        h += `<button id="erc-lock" class="erc-confirm" type="button" ${!data.storageKey||!count?'disabled':''}>🔒 CONFIRM & LOCK ${count} TEAMS</button>`;
        h += '<p class="erc-note">Confirming freezes all selected teams and stage order in this Space. You cannot redraw while the QA competition is locked.</p>';
      } else {
        h += `<div class="erc-locked">🔒 DRAW LOCKED · ${filled}/${count*3} stages saved · ${completed}/${count} complete teams</div>`;
        h += '<p class="erc-note">Enter a time as digits: <b>0342250 → 03:42.250</b>. Blank means not raced, never a win. SAVE TIMES on each team to persist.</p>';
        if (completed) {
          const standings = teams.map((t,i)=>({i,total:d.results[i].every(Number.isInteger)?d.results[i].reduce((a,b)=>a+b,0):null})).filter(t=>t.total!=null).sort((a,b)=>a.total-b.total||a.i-b.i).slice(0,10);
          h+='<details class="erc-leaders"><summary>Provisional completed-team standings ('+completed+')</summary>';
          standings.forEach((row,j)=>h+=`<div>${j+1}. Team ${String(row.i+1).padStart(3,'0')} — ${format(row.total)}</div>`);
          h+='</details>';
        }
      }
      h += `<div class="erc-pages"><button data-page="-1" ${page===0?'disabled':''}>← PREVIOUS</button><span>Page ${page+1} of ${pages}</span><button data-page="1" ${page+1>=pages?'disabled':''}>NEXT →</button></div>`;
      h += '<section class="erc-cards">';
      for (let i=page*size; i<Math.min(count,(page+1)*size);i++) {
        const t=teams[i], result=locked?d.results[i]:null, done=!!result?.every(Number.isInteger);
        h += `<article class="erc-card"><h3>TEAM ${String(i+1).padStart(3,'0')}${mode==='maker'?' · '+esc(t.make):''}${done?' ✅':''}</h3>`;
        if (locked) h+=`<form data-team="${i}">`;
        t.cars.forEach((c,n)=>{
          h+=`<div class="erc-stage"><b>STAGE ${n+1}</b><span>${esc(c.name)}<small>${esc(maker(c))}</small></span>`;
          if (locked) h+=`<label class="erc-time">Time<input data-stage="${n}" aria-label="Team ${i+1} stage ${n+1} time" inputmode="numeric" type="text" pattern="[0-9]*" maxlength="9" placeholder="0342250" value="${result[n] == null?'':format(result[n]).replace(/\D/g,'').padStart(7,'0')}"></label>`;
          h+='</div>';
        });
        if (locked) h+=`<p>Team total: <strong>${done?format(result.reduce((a,b)=>a+b,0)):'Pending'}</strong></p><button type="submit">💾 SAVE TEAM TIMES</button></form>`;
        h+='</article>';
      }
      h+='</section>';
      h+=`<div class="erc-pages"><button data-page="-1" ${page===0?'disabled':''}>← PREVIOUS</button><span>Teams ${count?1+page*size:0}–${Math.min(count,(page+1)*size)} of ${count}</span><button data-page="1" ${page+1>=pages?'disabled':''}>NEXT →</button></div>`;
      if (locked) h+='<details class="erc-reset"><summary>QA tools — delete this relay TEST ONLY</summary><p>Removes this mode’s isolated QA relay draw and stage times. Does not touch the actual tournament or your Garage.</p><button id="erc-reset" type="button">DELETE THIS QA RELAY</button></details>';
    }
    h+='<button id="erc-back-bottom" type="button">← BACK TO EVIL 2.0</button>';
    screen.innerHTML=h;
    for (const id of ['erc-back','erc-back-bottom'])screen.querySelector('#'+id)?.addEventListener('click',hide);
    screen.querySelectorAll('button[data-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;message='';page=0;paint();}));
    screen.querySelectorAll('button[data-page]').forEach(b=>b.addEventListener('click',()=>{page+=Number(b.dataset.page);paint();screen.scrollTo(0,0);}));
    screen.querySelector('#erc-redraw')?.addEventListener('click',()=>{const v=Number(screen.querySelector('#erc-seed').value);if(!Number.isSafeInteger(v)||v<1||v>4294967295){message='Seed must be an integer from 1 to 4294967295.';paint();return;}seed=v===4294967295?1:v+1;page=0;message='Draw refreshed; no teams have been locked.';paint();});
    screen.querySelector('#erc-lock')?.addEventListener('click',()=>{
      if (!current?.d || current.locked || !current.storageKey)return;
      if(!confirm(`Lock ${current.d.teams.length} ${mode==='maker'?'Manufacturer':'Mixed'} Relay teams for this QA competition? You cannot redraw until this QA draw is explicitly deleted.`))return;
      try {
        const source=current.d;
        const frozen={schema:1,mode,seed,eligible:source.eligible,entered:source.entered,leftovers:source.leftovers.map(c=>({id:String(c.id),name:String(c.name),make:maker(c)})),teams:source.teams.map(t=>({id:t.id,make:t.make||null,cars:t.cars.map(c=>({id:String(c.id),name:String(c.name),make:maker(c)}))})),results:source.teams.map(()=>[null,null,null])};
        write(current.storageKey,frozen);message='Confirmed draw saved. Stage times can now be entered.';page=0;paint();
      } catch(err) {message='Could not save draw: '+String(err.message||err);paint();}
    });
    screen.querySelectorAll('form[data-team]').forEach(form=>form.addEventListener('submit',e=>saveStages(e,Number(form.dataset.team))));
    screen.querySelector('#erc-reset')?.addEventListener('click',()=>{
      if(!current?.locked||!current.storageKey)return;
      if(!confirm('Delete this isolated QA relay and ALL its test stage times? Your live OTG data is unaffected.'))return;
      if(!confirm('Final confirmation: delete this one TEST relay only?'))return;
      try{localStorage.removeItem(current.storageKey);message='QA relay deleted; the live app was not changed.';page=0;paint();}catch(err){message=String(err.message||err);paint();}
    });
  }
  function show() {
    if(typeof document==='undefined')return;
    // Prevent a prior version of the overlay from covering the new QA screen.
    const legacy=document.getElementById('erm-189');if(legacy)legacy.style.display='none';
    screen=document.getElementById('erc-190');
    if(!screen){screen=document.createElement('section');screen.id='erc-190';screen.setAttribute('aria-label','Relay Competition QA');document.body.appendChild(screen);}
    screen.style.display='block';message='';paint();
  }
  function hide(){if(screen)screen.style.display='none';}
  const api={show,hide,time,format,validSaved,key};
  if(typeof window!=='undefined'&&window.rhEvil2RelayPlanner186)window.rhEvil2RelayPlanner186.show=show;
  return api;
});
