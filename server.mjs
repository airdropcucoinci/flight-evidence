import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname,join,extname} from 'node:path';
import {analyze} from './dist/engine.js';
import {createReport} from './dist/report.js';
import {sample} from './dist/samples.js';
import {parseTelemetry} from './dist/format.js';
const root=dirname(fileURLToPath(import.meta.url));
const port=Number(process.env.PORT||3000);
const json=(res,code,obj)=>{res.writeHead(code,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});res.end(JSON.stringify(obj));};
createServer(async(req,res)=>{
 try{
  // Do not trust the client-supplied Host header when parsing request paths.
  let path;
  try { path=new URL(req.url||'/', 'http://localhost').pathname; }
  catch { return json(res,400,{error:'Malformed request URL'}); }
  if(req.method==='GET'&&path==='/health')return json(res,200,{status:'ok',service:'flight-evidence'});
  if(req.method==='GET'&&path==='/api/samples')return json(res,200,{samples:Array.from({length:10},(_,i)=>({id:`L${i+1}`,rows:sample(i+1).length}))});
  if(req.method==='POST'&&(path==='/api/analyze'||path==='/api/report')){
   const contentType=(req.headers['content-type']||'').split(';')[0].trim().toLowerCase();
   if(contentType!=='application/json')return json(res,415,{error:'Content-Type must be application/json'});
   const chunks=[];let bytes=0;
   for await(const chunk of req){bytes+=chunk.length;if(bytes>1_000_000)return json(res,413,{error:'Payload exceeds 1 MB'});chunks.push(chunk);}
   const raw=Buffer.concat(chunks).toString('utf8');
   try{const body=JSON.parse(raw);if(body===null||typeof body!=='object'||Array.isArray(body))return json(res,422,{error:'Expected JSON object'});const supplied=['sampleId','csv','json','rows'].filter(key=>Object.hasOwn(body,key));if(supplied.length!==1)return json(res,422,{error:'Provide exactly one of sampleId, csv, json or rows'});if(body.sampleId!==undefined&&(!Number.isInteger(body.sampleId)||body.sampleId<1||body.sampleId>10))return json(res,422,{error:'sampleId must be an integer from 1 to 10'});const rows=typeof body.csv==='string'?parseTelemetry(body.csv,'csv'):typeof body.json==='string'?parseTelemetry(body.json,'json'):(body.rows!==undefined?parseTelemetry(JSON.stringify(body.rows),'json'):(Number.isInteger(body.sampleId)?sample(body.sampleId):undefined));if(!Array.isArray(rows))return json(res,422,{error:'Provide rows, csv, json or sampleId'});return json(res,200,path==='/api/report'?createReport(rows,'api-submission'):analyze(rows));}catch(e){return json(res,422,{error:e instanceof Error?e.message:'Invalid input'});}
  }
  if(req.method!=='GET')return json(res,405,{error:'Method not allowed'});
  const allowed=path==='/'?'index.html':path.startsWith('/dist/')&&/^\/dist\/[a-z-]+\.js$/.test(path)?path.slice(1):null;
  if(!allowed)return json(res,404,{error:'Not found'});
  let data;
  try { data=await readFile(join(root,allowed)); }
  catch (error) { if(error?.code==='ENOENT') return json(res,404,{error:'Not found'}); throw error; }
  res.writeHead(200,{'content-type':extname(allowed)==='.js'?'text/javascript; charset=utf-8':'text/html; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','referrer-policy':'no-referrer','x-frame-options':'DENY','content-security-policy':"default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"});res.end(data);
 }catch(e){console.error('Unhandled request failure:',e);json(res,500,{error:'Internal server error'});}
}).listen(port,()=>console.log(`Flight Evidence http://localhost:${port}`));
