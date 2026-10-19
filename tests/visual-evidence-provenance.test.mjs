import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sample} from '../dist/samples.js';
import {createReport} from '../dist/report.js';
import {analyze} from '../dist/engine.js';

// Duplicate timestamps are ambiguous; evidence must identify the actual triggering row.
test('R4 duplicate timestamp points at the later offending row, not the first equal time',()=>{
 const rows=sample(1);rows[6].t=rows[5].t;
 const result=analyze(rows);
 const finding=result.findings.find(f=>f.rule==='R4');
 assert.ok(finding);
 assert.equal(finding.sourceRowIndex,6);
 const evidence=createReport(rows).evidence.find(e=>e.rule==='R4');
 assert.equal(evidence.sourceRows.currentIndex,6);
 assert.equal(evidence.sourceRows.previousIndex,5);
});
test('escalated R4 timestamp reversal updates the source row',()=>{
 const rows=sample(1);rows[6].t=rows[5].t;rows[7].t=3;
 const finding=analyze(rows).findings.find(f=>f.rule==='R4');
 assert.equal(finding?.severity,'CRITICAL');
 assert.equal(finding?.sourceRowIndex,7);
 assert.equal(createReport(rows).evidence.find(e=>e.rule==='R4')?.sourceRows.currentIndex,7);
});
test('source indices survive all synthetic valid scenarios',()=>{
 for(let id=1;id<=9;id++){
  const rows=sample(id);
  const report=createReport(rows);
  for(const finding of report.findings){
   assert.ok(Number.isInteger(finding.sourceRowIndex));
   assert.ok(finding.sourceRowIndex>=0&&finding.sourceRowIndex<rows.length);
   assert.equal(rows[finding.sourceRowIndex].t,finding.at);
   const evidence=report.evidence.find(e=>e.rule===finding.rule);
   assert.equal(evidence.sourceRows.currentIndex,finding.sourceRowIndex);
  }
 }
});
test('dashboard offers labeled route and altitude SVG with stable selectors',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const ui=readFileSync(new URL('../src/browser.ts',import.meta.url),'utf8');
 for(const id of ['route-plot','altitude-plot','row-count','total-count']) assert.ok(html.includes(`data-testid="${id}"`),`missing dashboard control: ${id}`);
 assert.match(html,/aria-label="Kaydedilmiş konum/);
 assert.match(ui,/function renderVisuals/);
 assert.match(ui,/renderVisuals\(current,result\.findings\)/);
 assert.match(ui,/if\(!contiguous\(i\)\)flush\(\)/);
 assert.match(ui,/byId\('route-plot'\)\.replaceChildren\(\)/);
 assert.match(ui,/byId\('altitude-plot'\)\.replaceChildren\(\)/);
});
