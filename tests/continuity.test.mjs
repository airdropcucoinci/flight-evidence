import {test} from 'node:test';
import assert from 'node:assert/strict';
import {analyze} from '../dist/engine.js';
import {sample} from '../dist/samples.js';
function stableHighPower(){const rows=structuredClone(sample(1)); for(const r of rows){r.motor=90;r.voltage=12.5;} return rows.filter(r=>r.t<=100);}
test('R5 detects uninterrupted 60 seconds of constant voltage at high command',()=>{const rows=stableHighPower(); assert.ok(rows.at(-1).t>=60);assert.ok(analyze(rows).findings.some(f=>f.rule==='R5'));});
test('R5 does not bridge telemetry gaps over five seconds',()=>{const rows=stableHighPower(); const mid=Math.floor(rows.length/2); for(let i=mid;i<rows.length;i++)rows[i].t+=10;assert.ok(!analyze(rows).findings.some(f=>f.rule==='R5'));});
test('R5 does not bridge nonincreasing timestamps',()=>{const rows=stableHighPower();const mid=Math.floor(rows.length/2);for(let i=mid;i<rows.length;i++)rows[i].t-=rows[mid].t;assert.ok(!analyze(rows).findings.some(f=>f.rule==='R5'));});
