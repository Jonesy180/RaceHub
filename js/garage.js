// RaceHub v5.2.3 — Wordmarks & Manufacturer Accents
function manufacturerLogoSlug(make){
 return String(make||'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}
function manufacturerLogoPath(make){return `assets/logos/${manufacturerLogoSlug(make)}.svg`;}

// Curated brand accents for the most recognisable manufacturers.
// Every other manufacturer receives a stable colour from RaceHub's premium palette.
const MANUFACTURER_ACCENTS={
 'Abarth':'#d91f2b','Alfa Romeo':'#b71c2c','Aston Martin':'#0b7a5a','Audi':'#c7ccd3',
 'BMW':'#2f8fd8','Bugatti':'#4f79a7','Chevrolet':'#f2c230','Dodge':'#d72638',
 'Ferrari':'#e32636','Ford':'#2f6fb2','Honda':'#d71920','Hyundai':'#2d6fb7',
 'Jaguar':'#9fb6ad','Jeep':'#74855b','Koenigsegg':'#f0b429','Lamborghini':'#d8a928',
 'Lancia':'#3d72a4','Land Rover':'#2d7650','Lexus':'#c9cdd1','Lotus':'#f0cf26',
 'Maserati':'#355c9a','Mazda':'#c7253e','McLaren':'#ff7a18','Mercedes-AMG':'#bfc5cc',
 'Mercedes-Benz':'#bfc5cc','Mini':'#d64b4b','Mitsubishi':'#e21f26','Nissan':'#c8243f',
 'Pagani':'#4aa0b8','Peugeot':'#315fa8','Porsche':'#c5a15a','Renault':'#f3c928',
 'Rimac':'#3b9dbf','Subaru':'#3979bd','Toyota':'#e32636','Volkswagen':'#4f8fbd',
 'VW':'#4f8fbd','Volvo':'#4c82ad'
};
const MANUFACTURER_ACCENT_PALETTE=['#4f8fbd','#b56f9a','#55a58a','#bd8652','#8c7bc2','#b75f65','#5c9da8','#9a9f57'];
function manufacturerAccent(make){
 if(MANUFACTURER_ACCENTS[make])return MANUFACTURER_ACCENTS[make];
 const text=String(make||'');let hash=0;for(let i=0;i<text.length;i++)hash=((hash<<5)-hash+text.charCodeAt(i))|0;
 return MANUFACTURER_ACCENT_PALETTE[Math.abs(hash)%MANUFACTURER_ACCENT_PALETTE.length];
}
function rhGarageDetailValue(value){
 const text=String(value??'').trim();
 return text?esc(text):'<span class="rhUnknown">UNKNOWN</span>';
}
function rhGarageNeedsDetails(car){return !String(car?.year??'').trim()||!String(car?.classType??'').trim();}
function rhGarageDetailSearchText(car){return [carName(car),car?.make,car?.model,car?.year,car?.classType].map(v=>String(v||'').toLowerCase()).join(' ');}
function rhGarageSetNeedsDetailsFilter(on){window.rhGarageNeedsDetailsOnly=Boolean(on);garageMake='All';garageSearch='';renderGarage();}

function renderGarage(){
 const makes=['All',...Array.from(new Set(state.cars.map(c=>c.make))).sort((a,b)=>String(a).localeCompare(String(b)))];
 const needsDetailsCount=state.cars.filter(rhGarageNeedsDetails).length, needsOnly=Boolean(window.rhGarageNeedsDetailsOnly);
 let list=state.cars.filter(c=>(garageMake==='All'||c.make===garageMake)&&(!garageSearch||rhGarageDetailSearchText(c).includes(garageSearch.toLowerCase()))&&(!needsOnly||rhGarageNeedsDetails(c)));
 const groups={};list.forEach(c=>(groups[c.make]??=[]).push(c));
 $('garage').innerHTML=`<div class="garagePage rhGarageV6">
 <section class="card garageHero"><div class="garageHeroTop"><div><div class="garageEyebrow">Your collection</div><h2>Garage</h2><p class="small">Browse, add or update the cars in your RaceHub collection.</p></div><div class="garageCompletion"><strong>${state.cars.length}</strong><span>cars</span></div></div>
 <div class="rhGarageGuidance"><strong>MORE DETAILS = MORE CHAMPIONSHIPS</strong><span>Add Year and Class/Type when you know them. Missing details stay UNKNOWN and are never treated as real data.</span></div></section>
 <div class="garageTools"><section class="card garageToolCard garageAddCard"><div class="garageToolHeading"><span>＋</span><div><h3>Add a car</h3><p class="small">Manufacturer and model are required. Details can be added later.</p></div></div>
 <label>Manufacturer</label><input id="newMake" autocomplete="off" placeholder="Lotus"><label>Model</label><input id="newModel" autocomplete="off" placeholder="Evija"><label>Year</label><input id="newYear" autocomplete="off" inputmode="numeric" maxlength="4" placeholder="UNKNOWN"><label>Class / Type</label><input id="newClassType" autocomplete="off" placeholder="UNKNOWN"><button class="btn" onclick="addCar()">Add Car</button></section>
 <section class="card garageToolCard garageSearchCard"><div class="garageToolHeading"><span>⌕</span><div><h3>Find a car</h3><p class="small">Search your Garage details.</p></div></div><label>Search</label><input id="garageSearch" autocomplete="off" value="${esc(garageSearch)}" placeholder="Make, model, year or Class/Type"><div class="grid"><button class="btn" onclick="garageSearch=$('garageSearch').value;window.rhGarageNeedsDetailsOnly=false;renderGarage()">Search</button><button class="btn secondary" onclick="garageSearch='';garageMake='All';window.rhGarageNeedsDetailsOnly=false;renderGarage()">Clear</button></div><button class="btn secondary rhNeedsDetailsBtn ${needsOnly?'on':''}" onclick="rhGarageSetNeedsDetailsFilter(!window.rhGarageNeedsDetailsOnly)">Cars Need Details <span>${needsDetailsCount}</span></button></section></div>
 <section class="card garageCollection"><div class="garageCollectionHeading"><div><h3>${needsOnly?'Cars Need Details':'Collection'}</h3><p class="small">${list.length} ${list.length===1?'car':'cars'} shown</p></div></div>${needsOnly?'':`<div class="chips garageFilters">${makes.map(m=>`<button class="chip ${m===garageMake?'on':''}" onclick="garageMake='${esc(m)}';renderGarage()">${esc(m)}</button>`).join('')}</div>`}<div class="garageGroups">${Object.keys(groups).sort((a,b)=>a.localeCompare(b)).map(m=>`<div class="makeGroup garageMakeGroup" style="--manufacturer-accent:${manufacturerAccent(m)}"><div class="garageMakeContent"><div class="makeHead"><b>${esc(m)}</b><span>${groups[m].length}</span></div>${groups[m].map(c=>`<div class="row garageCarRow ${rhGarageNeedsDetails(c)?'rhCarNeedsDetails':''}"><div class="garageCarIcon">🚗</div><div class="grow garageCarInfo"><strong>${esc(c.model||carName(c))}</strong><div class="rhCarMeta"><span><small>YEAR</small>${rhGarageDetailValue(c.year)}</span><span><small>CLASS / TYPE</small>${rhGarageDetailValue(c.classType)}</span></div></div><button class="chip garageEditButton ${rhGarageNeedsDetails(c)?'rhAddDetails':''}" onclick="editCar('${c.id}')">${rhGarageNeedsDetails(c)?'ADD DETAILS':'Edit'}</button></div>`).join('')}</div></div>`).join('')||'<div class="empty garageEmpty">No cars found.</div>'}</div></section></div>`;
}
function addCar(){
 const make=$('newMake').value.trim(),model=$('newModel').value.trim(),year=$('newYear').value.trim(),classType=$('newClassType').value.trim();
 if(!make||!model){toast('Enter manufacturer and model');return;} if(year&&!/^\d{4}$/.test(year)){toast('Year must be four digits');return;}
 const name=`${make} ${model}${year?' '+year:''}`.replace(/\s+/g,' ').trim(), base=name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 let id=base||rhId('car'),n=2;while(state.cars.some(c=>c.id===id))id=`${base}-${n++}`;
 if(state.cars.some(c=>carName(c).toLowerCase()===name.toLowerCase())){toast('Car already exists');return;}
 state.cars.push({id,make,model,year:year||'',classType:classType||'',name});garageMake=make;garageSearch='';window.rhGarageNeedsDetailsOnly=false;save();toast('Car added');renderGarage();
}
function editCar(id){
 const car=carById(id);if(!car)return;closeCarEditor();document.body.insertAdjacentHTML('beforeend',`<div id="carEditorOverlay" class="carEditorOverlay"><div class="carEditorCard"><h2>${rhGarageNeedsDetails(car)?'ADD DETAILS':'Edit Car'}</h2><p class="small">Changing details keeps this car's existing RaceHub ID, results, records and progress.</p><label>Manufacturer</label><input id="editCarMake" autocomplete="off" value="${esc(car.make||'')}"><label>Model</label><input id="editCarModel" autocomplete="off" value="${esc(car.model||'')}"><label>Year</label><input id="editCarYear" autocomplete="off" inputmode="numeric" maxlength="4" value="${esc(car.year||'')}" placeholder="UNKNOWN"><label>Class / Type</label><input id="editCarClassType" autocomplete="off" value="${esc(car.classType||'')}" placeholder="UNKNOWN"><p class="small rhUnknownHelp">Leave Year or Class/Type blank to show <span class="rhUnknown">UNKNOWN</span>. UNKNOWN is display-only.</p><div class="grid"><button class="btn" onclick="saveCarEdit('${car.id}')">Save Changes</button><button class="btn secondary" onclick="closeCarEditor()">Cancel</button></div></div></div>`);
}
function closeCarEditor(){const o=$('carEditorOverlay');if(o)o.remove();}
function saveCarEdit(id){
 const car=carById(id);if(!car)return;const cleanMake=$('editCarMake').value.trim(),cleanModel=$('editCarModel').value.trim(),cleanYear=$('editCarYear').value.trim(),cleanClassType=$('editCarClassType').value.trim();
 if(!cleanMake||!cleanModel){toast('Manufacturer and model are required');return;}if(cleanYear&&!/^\d{4}$/.test(cleanYear)){toast('Year must be four digits');return;}
 const newName=`${cleanMake} ${cleanModel}${cleanYear?' '+cleanYear:''}`.replace(/\s+/g,' ').trim();if(state.cars.some(c=>c.id!==id&&carName(c).toLowerCase()===newName.toLowerCase())){toast('That car already exists');return;}
 car.make=cleanMake;car.model=cleanModel;car.year=cleanYear||'';car.classType=cleanClassType||'';car.name=newName;garageMake=cleanMake;save();closeCarEditor();toast('Car updated');renderGarage();
}

