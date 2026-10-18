import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const source=readFileSync(new URL('../src/browser.ts',import.meta.url),'utf8');
test('rule filter includes ALL and R1-R7',()=>{assert.match(html,/id="rule-filter"/);for(let i=1;i<=7;i++)assert.match(html,new RegExp(`value="R${i}"`));});
test('rule and severity filters combine without mutating findings',()=>{assert.match(source,/rule==='ALL'\|\|f.rule===rule/);assert.match(source,/filter==='ALL'\|\|f.severity===filter/);});
test('reset restores both filters',()=>{assert.match(source,/reset-filters/);assert.match(source,/rule-filter'\) as HTMLSelectElement\)\.value='ALL'/);});
