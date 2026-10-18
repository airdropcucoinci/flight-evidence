import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {request} from 'node:http';
const port=40000+Math.floor(Math.random()*1000);
const server=spawn(process.execPath,['server.mjs'],{cwd:process.cwd(),env:{...process.env,PORT:String(port)},stdio:'ignore'});
function get(path){return new Promise((resolve,reject)=>{const req=request({hostname:'127.0.0.1',port,path},res=>{let body='';res.on('data',c=>body+=c);res.on('end',()=>resolve({status:res.statusCode,body}));});req.on('error',reject);req.end();});}
test('malformed request target returns 400 without stopping server',async()=>{
 try {
  let healthy=false;
  for(let i=0;i<50;i++){try{healthy=(await get('/health')).status===200;if(healthy)break;}catch{}await new Promise(r=>setTimeout(r,30));}
  assert.ok(healthy,'server failed to start');
  const bad=await get('http://[invalid-host]/health');
  assert.equal(bad.status,400);assert.match(JSON.parse(bad.body).error,/Malformed request URL/);
  assert.equal((await get('/health')).status,200);
 } finally {server.kill();}
});
