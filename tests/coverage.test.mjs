import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createReport} from '../dist/report.js';
import {sample} from '../dist/samples.js';
test('clean uninterrupted sample has complete observation coverage',()=>{const r=createReport(sample(1));assert.equal(r.coverage.complete,true);assert.equal(r.coverage.interruptedIntervalCount,0);});
test('time gap warns that PASS is not full flight clearance',()=>{const rows=sample(1);for(let i=5;i<rows.length;i++)rows[i]={...rows[i],t:rows[i].t+12};const r=createReport(rows);assert.equal(r.coverage.complete,false);assert.ok(r.coverage.interruptedIntervalCount>=1);assert.match(r.coverage.note,/missing or invalid/);});
test('repeated timestamps are explicitly unreliable',()=>{const rows=sample(1);rows[4]={...rows[4],t:rows[3].t};const r=createReport(rows);assert.equal(r.coverage.complete,false);assert.equal(r.dataQuality.hasUnreliableTimeIntervals,true);});
test('coverage is deterministic',()=>assert.deepEqual(createReport(sample(1)).coverage,createReport(sample(1)).coverage));
