import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {analyze} from '../dist/engine.js';
import {sample} from '../dist/samples.js';

test('fixture expectations remain stable across all sample IDs',()=>{
 const expected=['CLEAN','CRITICAL','WARNING','CRITICAL','CRITICAL','WARNING','CRITICAL','CLEAN','CRITICAL'];
 expected.forEach((status,i)=>assert.equal(analyze(sample(i+1)).status,status,`L${i+1}`));
});
test('clean flight produces no findings',()=>{
 const result=analyze(sample(1));
 assert.equal(result.status,'CLEAN');
 assert.equal(result.findings.length,0);
});
test('critical flight preserves evidence timestamps and rule codes',()=>{
 const result=analyze(sample(9));
 assert.equal(result.status,'CRITICAL');
 for(const finding of result.findings){
  assert.match(finding.rule,/^R[1-7]$/);
  assert.ok(finding.severity==='CRITICAL'||finding.severity==='WARNING');
 }
});
test('CI workflow keeps smoke tests mandatory',()=>{
 const workflow=readFileSync(new URL('../.github/workflows/ci.yml',import.meta.url),'utf8');
 assert.match(workflow,/npm run test:smoke/);
 assert.match(workflow,/npm run typecheck/);
});
