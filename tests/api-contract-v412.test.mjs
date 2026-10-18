import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {setTimeout as sleep} from 'node:timers/promises';
const port=56000+Math.floor(Math.random()*1000);
const child=spawn(process.execPath,['server.mjs'],{cwd:new URL('../',import.meta.url),env:{...process.env,PORT:String(port)},stdio:'ignore'});
after(()=>child.kill());
async function request(path,options){for(let i=0;i<80;i++){try{return await fetch(`http://127.0.0.1:${port}${path}`,options);}catch{await sleep(50);}}throw Error('server unavailable');}
test('health contract includes non-cacheable JSON and nosniff',async()=>{const r=await request('/health');assert.equal(r.status,200);assert.match(r.headers.get('content-type'),/application\/json/);assert.equal(r.headers.get('cache-control'),'no-store');assert.equal(r.headers.get('x-content-type-options'),'nosniff');assert.equal((await r.json()).status,'ok');});
test('sample listing has ten unique IDs and nonnegative row counts',async()=>{const r=await request('/api/samples');assert.equal(r.status,200);const data=await r.json();assert.equal(data.samples.length,10);assert.deepEqual(data.samples.map(x=>x.id),Array.from({length:10},(_,i)=>`L${i+1}`));assert.ok(data.samples.every(x=>Number.isInteger(x.rows)&&x.rows>=0));});
test('bad JSON and missing payload fail without exposing stack traces',async()=>{for(const body of ['{bad','{}']){const r=await request('/api/analyze',{method:'POST',headers:{'content-type':'application/json'},body});assert.equal(r.status,422);const data=await r.json();assert.equal(typeof data.error,'string');assert.doesNotMatch(data.error,/\n\s+at |node:internal|\/mnt\/data/);}});
test('static asset responses include restrictive browser security headers',async()=>{const r=await request('/');assert.equal(r.status,200);assert.equal(r.headers.get('x-frame-options'),'DENY');assert.match(r.headers.get('content-security-policy'),/default-src 'none'/);});
