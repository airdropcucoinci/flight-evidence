import test from 'node:test';
import assert from 'node:assert/strict';
import {analyze} from '../dist/engine.js';
const base=Array.from({length:12},(_,i)=>({t:i,lat:39.01,lon:32.01,gpsAlt:100,baroAlt:100,ax:i,gx:i,motor:20,voltage:12}));
const hasR2=(rows)=>analyze(rows).findings.some(f=>f.rule==='R2');
test('R2 requires three continuous samples',()=>{
 const rows=structuredClone(base); for(let i=2;i<=4;i++)rows[i].gpsAlt=150;
 assert.equal(hasR2(rows),true);
});
test('R2 does not bridge repeated timestamps',()=>{
 const rows=structuredClone(base); for(let i=2;i<=4;i++)rows[i].gpsAlt=150;
 rows[3].t=rows[2].t; rows[4].t=rows[2].t+1;
 assert.equal(hasR2(rows),false);
});
test('R2 does not bridge time gaps',()=>{
 const rows=structuredClone(base); for(let i=2;i<=4;i++)rows[i].gpsAlt=150;
 rows[3].t=rows[2].t+10; rows[4].t=rows[3].t+1;
 for(let i=5;i<rows.length;i++)rows[i].t=rows[4].t+(i-4);
 assert.equal(hasR2(rows),false);
});
