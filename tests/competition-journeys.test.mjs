import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {setTimeout as delay} from 'node:timers/promises';
const port=35000+process.pid%20000;
let server;
async function request(path,body){const r=await fetch(`http://127.0.0.1:${port}${path}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});return {code:r.status,data:await r.json()};}
test('competition journeys: API status, determinism and failure handling',async()=>{
 server=spawn(process.execPath,['server.mjs'],{env:{...process.env,PORT:String(port)},stdio:'ignore'});
 try{
  let ready=false;
  for(let i=0;i<40;i++){try{const r=await fetch(`http://127.0.0.1:${port}/health`);ready=r.ok;if(ready)break;}catch{}await delay(100);}
  assert.ok(ready,'server failed to start');
  const expected={1:'CLEAN',2:'CRITICAL',3:'WARNING',4:'CRITICAL',5:'CRITICAL',6:'WARNING',7:'CRITICAL',8:'CLEAN',9:'CRITICAL'};
  for(const [id,status] of Object.entries(expected)){
   const a=await request('/api/analyze',{sampleId:Number(id)});
   assert.equal(a.code,200,`L${id} status code`);
   assert.equal(a.data.status,status,`L${id} verdict`);
   const b=await request('/api/analyze',{sampleId:Number(id)});
   assert.deepEqual(b.data,a.data,`L${id} deterministic`);
  }
  // L8 is deliberately a valid, near-threshold CLEAN flight, not a missing scenario.
  const l8=await request('/api/analyze',{sampleId:8});
  assert.equal(l8.code,200);
  assert.equal(l8.data.status,'CLEAN');
  assert.deepEqual(l8.data.findings,[]);
  const l8Report=await request('/api/report',{sampleId:8});
  assert.equal(l8Report.code,200);
  assert.equal(l8Report.data.assessment.code,'CLEAN');
  // L10 is deliberately invalid and must never be silently relabeled CLEAN.
  const l10=await request('/api/analyze',{sampleId:10});
  assert.equal(l10.code,422);
  assert.match(JSON.stringify(l10.data),/Minimum 10 rows required/);
  const l10Report=await request('/api/report',{sampleId:10});
  assert.equal(l10Report.code,422);
  const multi=await request('/api/analyze',{sampleId:9});
  assert.deepEqual(new Set(multi.data.findings.map(f=>f.rule)),new Set(['R1','R3','R6']));
  const invalid=await request('/api/analyze',{sampleId:10});
  assert.equal(invalid.code,422);
  const conflicting=await request('/api/analyze',{sampleId:1,rows:[]});
  assert.equal(conflicting.code,422);
  const report=await request('/api/report',{sampleId:2});
  assert.equal(report.code,200);
  assert.ok(JSON.stringify(report.data).includes('R1'));
 }finally{server?.kill();if(server)await once(server,'exit').catch(()=>{});}
});
