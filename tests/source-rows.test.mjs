import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createReport} from '../dist/report.js';
import {sample} from '../dist/samples.js';
test('each evidence entry references the exact source sample row',()=>{
  const rows=sample(9); const report=createReport(rows);
  for (const e of report.evidence) {
    assert.equal(e.sourceRows.indexBase,0);
    assert.ok(Number.isInteger(e.sourceRows.currentIndex));
    assert.ok(e.sourceRows.currentIndex>=0 && e.sourceRows.currentIndex<rows.length);
    assert.equal(rows[e.sourceRows.currentIndex].t,e.at);
    assert.equal(e.observation.timestamp,rows[e.sourceRows.currentIndex].t);
  }
});
test('previous index refers to immediately preceding row when present',()=>{
  const report=createReport(sample(2));
  const e=report.evidence.find(e=>e.rule==='R1');
  assert.ok(e); assert.ok(e.sourceRows.currentIndex>0);
  assert.equal(e.sourceRows.previousIndex,e.sourceRows.currentIndex-1);
});
test('source row references remain deterministic',()=>{
  assert.deepEqual(createReport(sample(9)).evidence.map(e=>e.sourceRows),createReport(sample(9)).evidence.map(e=>e.sourceRows));
});
