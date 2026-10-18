import test from 'node:test';
import assert from 'node:assert/strict';
import {createReport} from '../dist/report.js';
import {sample} from '../dist/samples.js';
const withGap=()=>{const rows=sample(1).map(x=>({...x}));for(let i=15;i<rows.length;i++)rows[i].t+=8;return rows;};
test('clean uninterrupted sample has seven PASS states',()=>{const r=createReport(sample(1));assert.equal(r.coverage.complete,true);assert.equal(r.rules.filter(x=>x.state==='PASS').length,7);});
test('time gap makes affected checks indeterminate',()=>{const r=createReport(withGap());assert.equal(r.coverage.complete,false);for(const id of ['R1','R2','R3','R5','R6'])assert.equal(r.rules.find(x=>x.rule===id).state,'INDETERMINATE');});
test('detected finding overrides indeterminate',()=>{const rows=withGap();rows[5].baroAlt=150;const r=createReport(rows);assert.equal(r.rules.find(x=>x.rule==='R7').state,'WARNING');});
test('rule status is deterministic for repeated reports',()=>{assert.deepEqual(createReport(withGap()).rules,createReport(withGap()).rules);});
