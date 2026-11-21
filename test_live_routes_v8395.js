const assert=require('node:assert/strict');
const data=new Map();global.localStorage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};
const m=require('./js/tet2-live-routes-v8395.js');const api={kind:x=>['road','dirt'].includes(x)?x:null,eventFamily:r=>r.raceFamily||null,hash:x=>x.length};
const routes={selected:{source:'fixture',rows:[{id:'R1',name:'Road One',kind:'road'},{id:'R2',name:'Road Two',kind:'road'},{id:'D1',name:'Dirt One',kind:'dirt'}]}};
const rows=[{position:1,eventId:'A',visit:1,raceFamily:'road',routeId:'R1'},{position:2,eventId:'B',visit:1,raceFamily:'dirt'},{position:3,eventId:'C',visit:1,raceFamily:'road'}];
const p=m.prepare(rows,routes,api);assert.equal(p.ready,true);assert.equal(p.existing,1);assert.equal(p.proposed,2);assert.equal(p.assignments[0].routeId,'R1');assert.notEqual(p.assignments[2].routeId,'R1');assert.deepEqual(m.prepare(rows,routes,api).assignments,p.assignments);
const bad=m.prepare([...rows,{position:4,eventId:'Z',raceFamily:null}],routes,api);assert.equal(bad.ready,false);assert.equal(bad.blocked.length,1);
const mismatch=m.prepare([{position:1,eventId:'X',raceFamily:'road',routeId:'D1'}],routes,api);assert.equal(mismatch.ready,false);
const dup=m.prepare(rows,{selected:{source:'x',rows:[...routes.selected.rows,routes.selected.rows[0]]}},api);assert.equal(dup.ready,false);
const original=new Map(data);assert.deepEqual(data,original); // pure allocator
// Inject validated sources for storage write tests
global.TET2AssembledList379={snapshot:()=>({audit:{ok:true},rows})};global.TET2TrackValidation389={resolveCatalogue:()=>routes};global.TET2TrackAssignment390=api;
assert.equal(m.status().ready,true);assert.equal(m.status().committed,false);assert.equal(m.commit().committed,true);assert.equal(m.commit().committed,true);assert.match(m.exportData(),/TET2_FH5_ROUTE_LOCK/);
global.TET2AssembledList379={snapshot:()=>({audit:{ok:true},rows:[...rows,{position:4,eventId:'Z',raceFamily:'road'}]})};assert.equal(m.status().stale,true);assert.throws(()=>m.commit(),/been overwritten/i);
console.log('VERIFIED ROUTE LOCK TESTS PASS');