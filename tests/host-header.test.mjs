import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {request} from 'node:http';
const port=39000+Math.floor(Math.random()*1000);
const server=spawn(process.execPath,['server.mjs'],{cwd:process.cwd(),env:{...process.env,PORT:String(port)},stdio:'ignore'});
async function get(host){
 return new Promise((resolve,reject)=>{const req=request({hostname:'127.0.0.1',port,path:'/health',headers:{host}},res=>{let body='';res.on('data',c=>body+=c);res.on('end',()=>resolve({status:res.statusCode,body}));});req.on('error',reject);req.end();});
}
test('malformed Host header does not crash health endpoint',async()=>{
 try{
  let result;
  for(let i=0;i<40;i++){try{result=await get('%%%bad host');break;}catch{await new Promise(r=>setTimeout(r,50));}}
  assert.ok(result,'server did not start');assert.equal(result.status,200);
  assert.equal(JSON.parse(result.body).status,'ok');
  const second=await get('localhost');assert.equal(second.status,200);
 }finally{server.kill();}
});
