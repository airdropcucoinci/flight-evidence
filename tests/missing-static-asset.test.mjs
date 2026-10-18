import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {request} from 'node:http';

const port=41000+Math.floor(Math.random()*1000);
const server=spawn(process.execPath,['server.mjs'],{cwd:process.cwd(),env:{...process.env,PORT:String(port)},stdio:'ignore'});
function get(path){return new Promise((resolve,reject)=>{const req=request({hostname:'127.0.0.1',port,path},res=>{let body='';res.on('data',c=>body+=c);res.on('end',()=>resolve({status:res.statusCode,body}));});req.on('error',reject);req.end();});}
test('missing allowed static asset is 404, not internal server error',async()=>{
 try{
  let ready=false;
  for(let i=0;i<50;i++){try{const r=await get('/health');if(r.status===200){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,40));}
  assert.ok(ready,'server did not start');
  const missing=await get('/dist/not-present.js');
  assert.equal(missing.status,404);
  assert.deepEqual(JSON.parse(missing.body),{error:'Not found'});
  const healthy=await get('/health');assert.equal(healthy.status,200);
 }finally{server.kill();}
});
