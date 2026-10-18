import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {setTimeout as sleep} from 'node:timers/promises';
const port=53000+Math.floor(Math.random()*1000);
const child=spawn(process.execPath,['server.mjs'],{cwd:new URL('../',import.meta.url),env:{...process.env,PORT:String(port)},stdio:'ignore'});
after(()=>child.kill());
async function req(path,options){for(let i=0;i<80;i++){try{return await fetch(`http://127.0.0.1:${port}${path}`,options);}catch{await sleep(50);}}throw Error('server unavailable');}
test('API rejects unsupported HTTP methods',async()=>{const r=await req('/api/analyze',{method:'PUT'});assert.equal(r.status,405);assert.match((await r.json()).error,/method/i);});
test('unknown paths do not disclose repository configuration',async()=>{for(const path of ['/.github/workflows/ci.yml','/package.json','/server.mjs']){const r=await req(path);assert.equal(r.status,404,path);}});
