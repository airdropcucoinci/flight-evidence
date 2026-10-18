import test from 'node:test';
import assert from 'node:assert/strict';
import { analyze } from '../dist/engine.js';
const base = (t,voltage=12,motor=90) => ({t,lat:39.01,lon:32.01,gpsAlt:50,baroAlt:50,ax:t,gx:t,motor,voltage});
const hasR5 = rows => analyze(rows).findings.some(f=>f.rule==='R5');
test('R5 detects 60 seconds of constant voltage after an earlier voltage change',()=>{
 const rows=Array.from({length:100},(_,i)=>base(i,i<20?12:11));
 assert.equal(hasR5(rows),true);
});
test('R5 does not treat two shorter constant-voltage periods as one continuous period',()=>{
 const rows=Array.from({length:70},(_,i)=>base(i,i<35?12:11));
 assert.equal(hasR5(rows),false);
});
test('R5 restarts the observation window when motor command drops below 80 percent',()=>{
 const rows=Array.from({length:80},(_,i)=>base(i,12,i===40?20:90));
 assert.equal(hasR5(rows),false);
});
