import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
const port=39000+Math.floor(Math.random()*1000);
const base=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,['server.mjs'],{env:{...process.env,PORT:String(port)},stdio:'ignore'});
async function wait(){for(let i=0;i<45;i++){try{const r=await fetch(`${base}/health`);if(r.ok)return;}catch{}await delay(100);}throw Error('Server did not start');}
test('Offline HTTP acceptance: health, samples, clean, anomaly, invalid input, report',async()=>{
 try{
  await wait();
  let r=await fetch(`${base}/api/samples`);assert.equal(r.status,200);assert.equal((await r.json()).samples.length,10);
  const post=async(url,body)=>fetch(`${base}${url}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
  r=await post('/api/analyze',{sampleId:1});assert.equal(r.status,200);assert.equal((await r.json()).status,'CLEAN');
  r=await post('/api/analyze',{sampleId:2});assert.equal(r.status,200);assert.equal((await r.json()).status,'CRITICAL');
  r=await post('/api/analyze',{sampleId:99});assert.equal(r.status,422);
  r=await post('/api/report',{sampleId:9});assert.equal(r.status,200);const report=await r.json();assert.ok(report.findings?.length>=3);
  r=await fetch(`${base}/`);assert.equal(r.status,200);assert.match(await r.text(),/Flight Evidence/i);
 }finally{server.kill();}
});
