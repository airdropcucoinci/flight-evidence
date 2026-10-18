import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createReport} from '../dist/report.js';
import {sample} from '../dist/samples.js';

test('source row references exist for each synthetic finding',()=>{
 const report=createReport(sample(9));
 assert.ok(report.evidence.length>=3);
 for(const e of report.evidence){
  assert.ok(Number.isInteger(e.sourceRows.currentIndex));
  assert.equal(e.observation.timestamp, sample(9)[e.sourceRows.currentIndex].t);
 }
});
test('browser includes stable source-row test identifier and row indices',()=>{
 const js=readFileSync(new URL('../dist/browser.js',import.meta.url),'utf8');
 assert.match(js,/source-rows-\$\{rule\.rule\}/);
 assert.match(js,/sourceRows\.currentIndex/);
 assert.match(js,/sourceRows\.previousIndex/);
});
