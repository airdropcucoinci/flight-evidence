import test from 'node:test';
import assert from 'node:assert/strict';
import {createReport,RULES} from '../dist/report.js';
import {sample} from '../dist/samples.js';
test('all seven rules have explicit observed data dependencies',()=>{
 const report=createReport(sample(1));
 assert.deepEqual(Object.keys(report.ruleCoverage), [...RULES]);
 for(const rule of RULES) assert.ok(report.ruleCoverage[rule].length>0);
});
test('rule dependencies are exported in deterministic JSON reports',()=>{
 const a=JSON.stringify(createReport(sample(1)).ruleCoverage);
 const b=JSON.stringify(createReport(sample(1)).ruleCoverage);
 assert.equal(a,b);
});
