import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createReport} from '../dist/report.js';
import {sample} from '../dist/samples.js';
test('evidence mirrors each finding and retains source',()=>{const r=createReport(sample(9),'demo-fixture');assert.equal(r.evidence.length,r.findings.length);assert.equal(r.source,'demo-fixture');assert.ok(r.evidence.every(e=>e.observation&&e.interpretation.includes('human review')));});
test('R1 evidence includes measured speed and demo threshold',()=>{const r=createReport(sample(2));const e=r.evidence.find(e=>e.rule==='R1');assert.ok(e);assert.ok(e.contextualMetrics.estimatedSpeedMps>40);assert.equal(e.contextualMetrics.demoThresholdMps,40);});
test('R2 evidence records altitude difference',()=>{const r=createReport(sample(3));const e=r.evidence.find(e=>e.rule==='R2');assert.ok(e);assert.ok(e.contextualMetrics.absoluteAltitudeDifferenceM>30);});
test('clean flight has no evidence flags',()=>{const r=createReport(sample(1));assert.deepEqual(r.evidence,[]);});
test('evidence report is deterministic',()=>assert.deepEqual(createReport(sample(9)),createReport(sample(9))));
