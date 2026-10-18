import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createReport} from '../dist/report.js';
import {sample} from '../dist/samples.js';
test('clean report contains no timeline or data gaps',()=>{const r=createReport(sample(1));assert.equal(r.timeline.length,0);assert.equal(r.dataQuality.gapCount,0);});
test('report includes sensor findings in timeline',()=>{const r=createReport(sample(2));assert.ok(r.timeline.some(e=>e.rule==='R1'&&e.kind==='FINDING'));});
test('report explicitly discloses unknown path during a gap',()=>{const rows=sample(1);for(let i=10;i<rows.length;i++)rows[i].t+=20;const r=createReport(rows);assert.equal(r.dataQuality.hasUnobservedIntervals,true);assert.ok(r.timeline.some(e=>e.kind==='DATA_GAP'));});
test('report captures backwards timestamp quality issue',()=>{const rows=sample(1);rows[8].t=rows[7].t-1;const r=createReport(rows);assert.ok(r.dataQuality.timeErrorCount>0);});
test('report is deterministic',()=>assert.deepEqual(createReport(sample(9)),createReport(sample(9))));
