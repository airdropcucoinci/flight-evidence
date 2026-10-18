import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildTimeline} from '../dist/timeline.js';
import {sample} from '../dist/samples.js';
test('clean sample has no timeline events',()=>assert.deepEqual(buildTimeline(sample(1)),[]));
test('GPS jump is exposed in timeline',()=>assert.ok(buildTimeline(sample(2)).some(e=>e.kind==='FINDING'&&e.rule==='R1')));
test('long gap is explicitly recorded',()=>{const r=sample(1);for(let i=5;i<r.length;i++)r[i].t+=20;const events=buildTimeline(r);assert.ok(events.some(e=>e.kind==='DATA_GAP'&&e.description.includes('route unknown')));});
test('backwards timestamp is flagged',()=>{const r=sample(1);r[6].t=r[5].t-1;assert.ok(buildTimeline(r).some(e=>e.kind==='TIME_ERROR'&&e.severity==='CRITICAL'));});
test('timeline is deterministic',()=>assert.deepEqual(buildTimeline(sample(9)),buildTimeline(sample(9))));
