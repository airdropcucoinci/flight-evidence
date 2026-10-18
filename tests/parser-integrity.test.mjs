import test from 'node:test';
import assert from 'node:assert/strict';
import {parseTelemetry,FIELDS} from '../dist/format.js';
const valid=FIELDS.map((_,i)=>i===0?'0':'1').join(',');
test('rejects duplicate CSV headers instead of silently overriding fields',()=>{
 const header=[...FIELDS,'lat'].join(',');
 assert.throws(()=>parseTelemetry(`${header}\n${valid},2`,'csv'),/Duplicate CSV column/);
});
test('accepts 5000 and rejects 5001 rows in direct parser',()=>{
 const row={t:0,lat:0,lon:0,gpsAlt:1,baroAlt:1,ax:0,gx:0,motor:20,voltage:12};
 assert.equal(parseTelemetry(JSON.stringify(Array(5000).fill(row)),'json').length,5000);
 assert.throws(()=>parseTelemetry(JSON.stringify(Array(5001).fill(row)),'json'),/Maximum 5000/);
});

test('accepts UTF-8 BOM CSV header exported by spreadsheet tools',()=>{
 const csv='\uFEFF'+FIELDS.join(',')+'\n'+valid;
 const rows=parseTelemetry(csv,'csv');
 assert.equal(rows.length,1);
 assert.equal(rows[0].t,0);
});
