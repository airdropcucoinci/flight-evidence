import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createReport,RULES} from '../dist/report.js';
import {sample} from '../dist/samples.js';
test('clean report includes all seven passing rules',()=>{const r=createReport(sample(1));assert.equal(r.status,'CLEAN');assert.equal(r.rules.length,7);assert.ok(r.rules.every(x=>x.state==='PASS'));assert.equal(r.findings.length,0);});
test('multi-finding report keeps exact rule evidence',()=>{const r=createReport(sample(9));assert.equal(r.status,'CRITICAL');assert.deepEqual(r.rules.filter(x=>x.state==='CRITICAL').map(x=>x.rule),['R1','R3','R6']);assert.equal(r.schemaVersion,'1.0');});
test('report is deterministic for identical input',()=>{assert.deepEqual(createReport(sample(2)),createReport(sample(2)));});
test('invalid input cannot produce a report',()=>assert.throws(()=>createReport(sample(10))));
test('rule inventory is complete and unique',()=>assert.equal(new Set(RULES).size,7));
