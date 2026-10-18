import {test} from 'node:test';
import assert from 'node:assert/strict';
import {analyze} from '../dist/engine.js';
import {sample} from '../dist/samples.js';
const flags=(rows)=>analyze(rows).findings.map(f=>f.rule);
function crossing(){
 const rows=structuredClone(sample(1));
 for(const row of rows){row.lat=39.003;row.lon=32.000;}
 for(let i=10;i<rows.length;i++)rows[i].lon=32.006;
 return rows;
}
test('R6 detects continuous segment crossing the synthetic zone',()=>{
 const rows=crossing();
 assert.ok(flags(rows).includes('R6'));
});
test('R6 does not invent a path through a recording gap',()=>{
 const rows=crossing();
 for(let i=10;i<rows.length;i++)rows[i].t+=20;
 assert.ok(flags(rows).includes('R4'));
 assert.ok(!flags(rows).includes('R6'));
});
test('R6 still flags a directly observed point within the zone after a gap',()=>{
 const rows=crossing();
 for(let i=10;i<rows.length;i++)rows[i].t+=20;
 rows[10].lon=32.003;
 assert.ok(flags(rows).includes('R6'));
});
test('R6 does not invent a segment on reversed timestamps',()=>{
 const rows=crossing();
 rows[10].t=rows[9].t-1;
 assert.ok(flags(rows).includes('R4'));
 assert.ok(!flags(rows).includes('R6'));
});
