import test from 'node:test';
import assert from 'node:assert/strict';
import {sample} from '../dist/samples.js';
import {validate, analyze} from '../dist/engine.js';
import {createReport} from '../dist/report.js';

test('5001 rows are rejected before analysis',()=>{
 const rows=Array.from({length:5001},(_,i)=>({...sample(1)[0],t:i}));
 assert.match(validate(rows).join(' '),/Maximum 5000/);
 assert.throws(()=>analyze(rows),/Maximum 5000/);
 assert.throws(()=>createReport(rows),/Maximum 5000/);
});
test('5000 valid rows are accepted by input validation',()=>{
 const rows=Array.from({length:5000},(_,i)=>({...sample(1)[0],t:i}));
 assert.deepEqual(validate(rows),[]);
});
