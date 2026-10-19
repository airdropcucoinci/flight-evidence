import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {setTimeout as sleep} from 'node:timers/promises';

test('web assets use restrictive security headers without blocking module script',async()=>{
 const port=34000+Math.floor(Math.random()*10000);
 const child=spawn(process.execPath,['server.mjs'],{env:{...process.env,PORT:String(port)},stdio:'ignore'});
 try {
  let response;
  for(let i=0;i<120;i++){
   try {response=await fetch(`http://127.0.0.1:${port}/`);break;}catch{await sleep(100);}
  }
  assert.ok(response,'server did not start');
  assert.equal(response.status,200);
  const csp=response.headers.get('content-security-policy');
  assert.ok(csp?.includes("script-src 'self'"));
  assert.ok(csp.includes("style-src 'self' 'unsafe-inline'"));
  assert.equal(response.headers.get('x-content-type-options'),'nosniff');
  assert.equal(response.headers.get('x-frame-options'),'DENY');
  assert.equal(response.headers.get('referrer-policy'),'no-referrer');
  const script=await fetch(`http://127.0.0.1:${port}/dist/browser.js`);
  assert.equal(script.status,200);
  assert.match(script.headers.get('content-type'),/javascript/);
 }finally{child.kill();}
});
