import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {setTimeout as sleep} from 'node:timers/promises';
const port=48000+Math.floor(Math.random()*1000);
const server=spawn(process.execPath,['server.mjs'],{cwd:new URL('../',import.meta.url),env:{...process.env,PORT:String(port)},stdio:'ignore'});
after(()=>server.kill());
async function post(rows,path='/api/analyze'){
 const body=JSON.stringify({rows});
 for(let i=0;i<80;i++){
  try{return await fetch(`http://127.0.0.1:${port}${path}`,{method:'POST',headers:{'content-type':'application/json'},body});}
  catch{await sleep(50);}
 }
 throw Error('server did not start');
}
const row=i=>({t:i,lat:39,lon:32,gpsAlt:100,baroAlt:100,ax:0,gx:0,motor:30,voltage:12});
test('API accepts 5000 valid rows',async()=>{
 const r=await post(Array.from({length:5000},(_,i)=>row(i)));
 assert.equal(r.status,200);
 assert.equal((await r.json()).status!==undefined,true);
});
test('API rejects 5001 rows with HTTP 422',async()=>{
 const r=await post(Array.from({length:5001},(_,i)=>row(i)));
 assert.equal(r.status,422);
 assert.match((await r.json()).error,/Maximum 5000/);
});
test('report API rejects 5001 rows with HTTP 422',async()=>{
 const r=await post(Array.from({length:5001},(_,i)=>row(i)),'/api/report');
 assert.equal(r.status,422);
 assert.match((await r.json()).error,/Maximum 5000/);
});
