import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {setTimeout as sleep} from 'node:timers/promises';
const port=47000+Math.floor(Math.random()*1000);
const server=spawn(process.execPath,['server.mjs'],{cwd:new URL('../',import.meta.url),env:{...process.env,PORT:String(port)},stdio:'ignore'});
after(()=>server.kill());
async function call(path,options){for(let i=0;i<60;i++){try{return await fetch(`http://127.0.0.1:${port}${path}`,options);}catch{await sleep(40);}}throw Error('server failed to start');}
test('all ten sample identifiers are discoverable',async()=>{const r=await call('/api/samples');assert.equal(r.status,200);const data=await r.json();assert.deepEqual(data.samples.map(s=>s.id),Array.from({length:10},(_,i)=>`L${i+1}`));});
test('unsupported method is rejected and service stays available',async()=>{const r=await call('/api/analyze',{method:'PUT'});assert.equal(r.status,405);assert.equal((await call('/health')).status,200);});
test('unknown route is 404 and does not expose project files',async()=>{const r=await call('/package.json');assert.equal(r.status,404);assert.equal((await call('/tests/smoke.test.mjs')).status,404);});
test('invalid sample ID does not produce a fabricated report',async()=>{const r=await call('/api/report',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({sampleId:11})});assert.equal(r.status,422);assert.match((await r.json()).error,/sampleId/);});
