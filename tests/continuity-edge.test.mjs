import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sample} from '../dist/samples.js';
import {analyze} from '../dist/engine.js';

test('R2 does not count readings across a telemetry gap',()=>{
 const rows=sample(1);
 for(const i of [20,21,22])rows[i].gpsAlt=rows[i].baroAlt+100;
 rows[21].t=rows[20].t+7;
 rows[22].t=rows[21].t+1;
 // Restore monotonically increasing timestamps for the remainder.
 for(let i=23;i<rows.length;i++)rows[i].t=rows[22].t+i-22;
 assert.equal(analyze(rows).findings.some(f=>f.rule==='R2'),false);
});

test('R6 does not infer path through synthetic geofence across a long gap',()=>{
 const rows=sample(1);
 // Two outside points on opposite sides of the synthetic polygon.
 rows[20].lat=39.003;rows[20].lon=32.001;
 rows[21].lat=39.003;rows[21].lon=32.005;
 rows[21].t=rows[20].t+8;
 rows[22].t=rows[21].t+8;
 for(let i=23;i<rows.length;i++)rows[i].t=rows[22].t+i-22;
 // Avoid unrelated original route crossing the polygon.
 for(let i=0;i<rows.length;i++)if(i!==20&&i!==21){rows[i].lat=39.001;rows[i].lon=32.001;}
 assert.equal(analyze(rows).findings.some(f=>f.rule==='R6'),false);
 assert.equal(analyze(rows).findings.some(f=>f.rule==='R4'),true);
});
