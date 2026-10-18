import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {setTimeout as sleep} from 'node:timers/promises';
const port=46000+Math.floor(Math.random()*1000);
const server=spawn(process.execPath,['server.mjs'],{cwd:new URL('../',import.meta.url),env:{...process.env,PORT:String(port)},stdio:'ignore'});
after(()=>server.kill());
async function post(path,body){for(let i=0;i<60;i++){try{return await fetch(`http://127.0.0.1:${port}${path}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});}catch{await sleep(50);}}throw Error('server failed to start');}
test('report endpoint exposes evidence, coverage and traceable rule results',async()=>{const r=await post('/api/report',{sampleId:2});assert.equal(r.status,200);const data=await r.json();assert.equal(data.schemaVersion,'1.0');assert.equal(data.status,'CRITICAL');assert.ok(data.evidence.some(e=>e.rule==='R1'&&Number.isInteger(e.sourceRows.currentIndex)));assert.equal(data.rules.length,7);assert.equal(typeof data.coverage.complete,'boolean');});
test('clean sample has zero findings and full coverage',async()=>{const r=await post('/api/report',{sampleId:1});assert.equal(r.status,200);const d=await r.json();assert.equal(d.status,'CLEAN');assert.equal(d.findings.length,0);assert.equal(d.coverage.complete,true);});
test('invalid sample returns 422 instead of fabricated report',async()=>{const r=await post('/api/report',{sampleId:10});assert.equal(r.status,422);assert.ok((await r.json()).error);});
test('legacy analyze response remains unchanged',async()=>{const r=await post('/api/analyze',{sampleId:2});assert.equal(r.status,200);const d=await r.json();assert.equal(d.status,'CRITICAL');assert.equal(d.schemaVersion,undefined);});
