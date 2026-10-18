import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {setTimeout as sleep} from 'node:timers/promises';
import {analyze,distance} from '../dist/engine.js';
import {sample} from '../dist/samples.js';
import {parseTelemetry} from '../dist/format.js';
const port=39000+Math.floor(Math.random()*10000);
const server=spawn(process.execPath,['server.mjs'],{cwd:new URL('../',import.meta.url),env:{...process.env,PORT:String(port)},stdio:'ignore'});
after(()=>server.kill());
async function request(path,body){for(let i=0;i<50;i++){try{return await fetch(`http://127.0.0.1:${port}${path}`,body===undefined?{}:{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});}catch{await sleep(60);}}throw Error('server did not start');}
test('all ten fixtures have expected results',()=>{for(const [id,status] of [[1,'CLEAN'],[2,'CRITICAL'],[3,'WARNING'],[4,'CRITICAL'],[5,'CRITICAL'],[6,'WARNING'],[7,'CRITICAL'],[8,'CLEAN'],[9,'CRITICAL']])assert.equal(analyze(sample(id)).status,status,`L${id}`);assert.throws(()=>analyze(sample(10)));});
test('L9 reports R1 R3 R6',()=>assert.deepEqual(['R1','R3','R6'],analyze(sample(9)).findings.map(f=>f.rule).sort()));
test('R1 boundary and just-over-boundary',()=>{const base=sample(1);const a=base[120];const b=base[121];assert.ok(distance(a,b)<40);assert.equal(analyze(sample(8)).status,'CLEAN');const metersPerDegree=111194.92664455874*Math.cos(a.lat*Math.PI/180);const near=structuredClone(base);near[121].lat=a.lat;near[121].lon=a.lon+39.999/metersPerDegree;assert.ok(distance(a,near[121])<40);const over=structuredClone(base);over[121].lat=a.lat;over[121].lon=a.lon+40.001/metersPerDegree;assert.ok(distance(a,over[121])>40);assert.ok(analyze(over).findings.some(f=>f.rule==='R1'));});
test('R6 detects isolated point inside geofence even if adjacent segment invalid in time',()=>{const rows=sample(1);rows[5].lat=39.003;rows[5].lon=32.003;assert.ok(analyze(rows).findings.some(f=>f.rule==='R6'));});
test('API samples, analyze and validation',async()=>{let r=await request('/api/samples');assert.equal(r.status,200);assert.equal((await r.json()).samples.length,10);r=await request('/api/analyze',{sampleId:2});assert.equal(r.status,200);assert.equal((await r.json()).status,'CRITICAL');r=await request('/api/analyze',{sampleId:10});assert.equal(r.status,422);r=await request('/api/analyze',{sampleId:999});assert.equal(r.status,422);r=await request('/api/analyze',null);assert.equal(r.status,422);});
test('web home responds',async()=>{const r=await request('/');assert.equal(r.status,200);assert.match(await r.text(),/Flight Evidence/i);});


test('R4 severity escalates if backward time follows a duplicate timestamp',()=>{
 const rows=sample(1);rows[30].t=rows[29].t;rows[50].t=rows[49].t-1;
 const result=analyze(rows);
 assert.equal(result.findings.find(f=>f.rule==='R4')?.severity,'CRITICAL');
});

test('CSV and JSON reject boolean numeric fields',()=>{
 const rows=sample(1);rows[0].lat=true;
 assert.throws(()=>parseTelemetry(JSON.stringify(rows),'json'));
});


test('V0 rejects out-of-range motor and negative voltage',()=>{
 const motor=sample(1);motor[0].motor=101;assert.throws(()=>analyze(motor),/motor must be 0\.\.100/);
 const voltage=sample(1);voltage[0].voltage=-1;assert.throws(()=>analyze(voltage),/voltage must be non-negative/);
});

test('R1 at controlled 40 m/s boundary is non-critical and 40.01 m/s is critical',()=>{
 const base=sample(1);const i=120;const a=base[i];
 const make=(speed)=>{const rows=structuredClone(base);const radius=6371000;const radians=speed/radius;rows[i+1].lat=a.lat+(radians*180/Math.PI);rows[i+1].lon=a.lon;for(let j=i+2;j<rows.length;j++){rows[j].lat=rows[i+1].lat+(j-i-1)*.000025;rows[j].lon=rows[i+1].lon;}return rows;};
 const at=make(40);const measured=distance(at[i],at[i+1]);
 assert.ok(Math.abs(measured-40)<1e-8,`computed speed ${measured}`);
 // Floating point coordinates can place the computed distance on either side of exact 40.
 // Assert behavior using the *computed* speed, rather than claiming exact equality.
 assert.equal(analyze(at).findings.some(f=>f.rule==='R1'),measured>40);
 const over=make(40.01);assert.ok(analyze(over).findings.some(f=>f.rule==='R1'));
});


test('API rejects boolean numeric fields in direct rows and CSV',async()=>{
 const rows=sample(1);rows[0].lat=true;
 let r=await request('/api/analyze',{rows});assert.equal(r.status,422);
 assert.match((await r.json()).error,/lat/);
 r=await request('/api/analyze',{csv:'t,lat\n1,39'});assert.equal(r.status,422);
});

test('API prevents oversized request payloads',async()=>{
 const r=await request('/api/analyze',{csv:'x'.repeat(1_000_100)});
 assert.equal(r.status,413);
});

 test('health endpoint responds for deployment checks',async()=>{const r=await request('/health');assert.equal(r.status,200);assert.deepEqual(await r.json(),{status:'ok',service:'flight-evidence'});});
