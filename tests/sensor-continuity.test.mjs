import {test} from 'node:test';
import assert from 'node:assert/strict';
import {analyze} from '../dist/engine.js';
import {sample} from '../dist/samples.js';

const has=(rows,rule)=>analyze(rows).findings.some(f=>f.rule===rule);

test('R2 flags three continuous altitude discrepancies',()=>{
 const rows=structuredClone(sample(1));
 for(let i=10;i<13;i++)rows[i].gpsAlt=rows[i].baroAlt+50;
 assert.equal(has(rows,'R2'),true);
});
test('R2 does not bridge a telemetry gap',()=>{
 const rows=structuredClone(sample(1));
 rows[10].gpsAlt=rows[10].baroAlt+50;
 rows[11].gpsAlt=rows[11].baroAlt+50;
 rows[12].gpsAlt=rows[12].baroAlt+50;
 for(let i=12;i<rows.length;i++)rows[i].t+=10;
 assert.equal(has(rows,'R2'),false);
});
test('R2 does not bridge reversed timestamps',()=>{
 const rows=structuredClone(sample(1));
 for(let i=10;i<13;i++)rows[i].gpsAlt=rows[i].baroAlt+50;
 rows[12].t=rows[11].t-1;
 assert.equal(has(rows,'R2'),false);
});
test('R1 does not interpret long recording gaps as continuous movement',()=>{
 const rows=structuredClone(sample(1));
 rows[10].lat+=0.01;
 for(let i=10;i<rows.length;i++)rows[i].t+=100;
 // At the gap itself, speed is not considered reliable; later points may still be abnormal.
 const shortened=rows.slice(0,11);
 assert.equal(has(shortened,'R1'),false);
});
test('R2 requires three valid contiguous readings after a long gap',()=>{
 const rows=structuredClone(sample(1));
 for(let i=10;i<=12;i++)rows[i].gpsAlt=rows[i].baroAlt+50;
 for(let i=10;i<rows.length;i++)rows[i].t+=10;
 assert.equal(has(rows.slice(0,13),'R2'),false);
 rows[13].gpsAlt=rows[13].baroAlt+50;
 assert.equal(has(rows.slice(0,14),'R2'),true);
});
