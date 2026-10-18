import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const js=readFileSync(new URL('../dist/browser.js',import.meta.url),'utf8');
test('finding filter offers all, critical and warning choices',()=>{
 assert.match(html,/id="finding-filter"/);
 for(const value of ['ALL','CRITICAL','WARNING'])assert.match(html,new RegExp(`value="${value}"`));
});
test('filter is based on severity without changing analysis result',()=>{
 assert.match(js,/lastFindings\.filter\(/);
 assert.match(js,/f\.severity === filter/);
 assert.match(js,/finding-count/);
});
test('invalid upload clears filtered findings',()=>{
 assert.match(js,/lastFindings = \[\];\s*renderFindings\(\)/);
});
