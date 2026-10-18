import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {setTimeout as sleep} from 'node:timers/promises';
const port=47000+Math.floor(Math.random()*1000);
const server=spawn(process.execPath,['server.mjs'],{cwd:new URL('../',import.meta.url),env:{...process.env,PORT:String(port)},stdio:'ignore'});
after(()=>server.kill());
async function post(body,headers={'content-type':'application/json'}){for(let i=0;i<80;i++){try{return await fetch(`http://127.0.0.1:${port}/api/report`,{method:'POST',headers,body});}catch{await sleep(50);}}throw Error('server did not start');}
test('reject non-JSON content type',async()=>{const r=await post('{"sampleId":1}',{'content-type':'text/plain'});assert.equal(r.status,415);});
test('reject ambiguous multiple input types',async()=>{const r=await post(JSON.stringify({sampleId:1,rows:[]}));assert.equal(r.status,422);});
test('reject empty input object',async()=>{const r=await post('{}');assert.equal(r.status,422);});
test('enforce payload size using UTF-8 bytes',async()=>{const r=await post(JSON.stringify({csv:'ğ'.repeat(510000)}));assert.equal(r.status,413);});
test('successful JSON response has no wildcard CORS header',async()=>{const r=await post('{"sampleId":1}');assert.equal(r.status,200);assert.equal(r.headers.get('access-control-allow-origin'),null);assert.equal(r.headers.get('x-content-type-options'),'nosniff');});
