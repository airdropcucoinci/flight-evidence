import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {setTimeout as sleep} from 'node:timers/promises';
const port=51000+Math.floor(Math.random()*1000);
const server=spawn(process.execPath,['server.mjs'],{cwd:new URL('../',import.meta.url),env:{...process.env,PORT:String(port)},stdio:'ignore'});
after(()=>server.kill());
async function request(path,options){for(let i=0;i<80;i++){try{return await fetch(`http://127.0.0.1:${port}${path}`,options);}catch{await sleep(50);}}throw Error('server unavailable');}
test('homepage serves HTML with scenario selectors',async()=>{const r=await request('/');assert.equal(r.status,200);assert.match(r.headers.get('content-type'),/text\/html/);const html=await r.text();assert.match(html,/id="examples"/);assert.match(html,/overall-status/);});
test('browser bundle is served as javascript',async()=>{const r=await request('/dist/browser.js');assert.equal(r.status,200);assert.match(r.headers.get('content-type'),/javascript/);assert.ok((await r.text()).length>100);});
test('unknown and traversal paths do not expose files',async()=>{for(const path of ['/package.json','/README.md','/dist/../server.mjs']){const r=await request(path);assert.equal(r.status,404,path);}});
test('health responds with JSON and no-store',async()=>{const r=await request('/health');assert.equal(r.status,200);assert.equal(r.headers.get('cache-control'),'no-store');assert.equal((await r.json()).status,'ok');});
