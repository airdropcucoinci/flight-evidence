import test from 'node:test';
import assert from 'node:assert/strict';
import {parseTelemetry, FIELDS} from '../dist/format.js';
const base=Object.fromEntries(FIELDS.map(k=>[k,1]));
test('rejects non-decimal numeric strings in JSON telemetry',()=>{
 for(const value of ['0x10','0b11','0o12','1_000','Infinity','NaN','1,2']) {
  assert.throws(()=>parseTelemetry(JSON.stringify([{...base,lat:value}]),'json'),/invalid lat/i,value);
 }
});
test('rejects non-decimal numeric strings in CSV telemetry',()=>{
 for(const value of ['0x10','0b11','0o12','1_000']) {
  const csv=FIELDS.join(',')+'\n'+FIELDS.map(k=>k==='lat'?value:'1').join(',');
  assert.throws(()=>parseTelemetry(csv,'csv'),/invalid lat/i,value);
 }
});
test('accepts ordinary decimal and scientific notation',()=>{
 for(const value of ['+1.5','-0.5','.25','1e-3','2E+2']){
  const row=parseTelemetry(JSON.stringify([{...base,lat:value}]),'json')[0];
  assert.equal(row.lat,Number(value));
 }
});
