import test from 'node:test';
import assert from 'node:assert/strict';
import {sample} from '../dist/samples.js';
import {createReport} from '../dist/report.js';

test('every evidence entry corresponds to an actual finding and source row',()=>{
 for(let id=1;id<=9;id++){
  const rows=sample(id),report=createReport(rows,`L${id}`);
  assert.equal(report.evidence.length,report.findings.length);
  for(const evidence of report.evidence){
   assert.ok(report.findings.some(f=>f.rule===evidence.rule&&f.at===evidence.at));
   const index=evidence.sourceRows.currentIndex;
   assert.ok(Number.isInteger(index)&&index>=0&&index<rows.length);
   assert.equal(rows[index].t,evidence.at);
  }
 }
});

test('incomplete assessment is not described as clean clearance',()=>{
 const rows=sample(1).map(r=>({...r}));
 rows[5].t=rows[4].t+8;
 const report=createReport(rows);
 assert.equal(report.assessment.complete,false);
 assert.ok(report.coverage.interruptedIntervalCount>0);
 assert.notEqual(report.assessment.code,'CLEAN');
});

test('rule list is stable and includes all seven rules',()=>{
 const report=createReport(sample(1));
 assert.deepEqual(report.rules.map(r=>r.rule),['R1','R2','R3','R4','R5','R6','R7']);
});
