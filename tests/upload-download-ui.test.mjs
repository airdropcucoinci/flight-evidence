import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../src/browser.ts',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');

test('sample selection has a separate visible identity for L8 and L10',()=>{
 assert.match(html,/data-testid="selected-scenario"/);
 assert.match(source,/Seçili senaryo: L\$\{i\}/);
});
test('uploaded file is validated before replacing current analysis',()=>{
 const handler=source.slice(source.indexOf("byId('upload').addEventListener"),source.indexOf("byId('download').addEventListener"));
 assert.match(handler,/const next=parseTelemetry/);
 assert.ok(handler.indexOf('analyze(next)')<handler.indexOf('current=next'));
 assert.match(handler,/Yalnızca CSV veya JSON/);
 assert.match(handler,/byId\('error'\)\.textContent/);
});
test('both browser downloads defer blob URL cleanup',()=>{
 assert.match(source,/flight-evidence-sample\.csv/);
 assert.match(source,/flight-evidence-report\.json/);
 const occurrences=source.match(/setTimeout\(\(\)=>URL\.revokeObjectURL\(/g)||[];
 assert.equal(occurrences.length,2);
});

test('CSV fixtures include valid and invalid deterministic inputs',async()=>{
 const {parseTelemetry}=await import('../dist/format.js');
 const valid=readFileSync(new URL('../test-fixtures/valid-flight.csv',import.meta.url),'utf8');
 const invalid=readFileSync(new URL('../test-fixtures/invalid-flight.csv',import.meta.url),'utf8');
 const rows=parseTelemetry(valid,'csv');
 assert.equal(rows.length,20);
 assert.throws(()=>parseTelemetry(invalid,'csv'),/invalid lat/);
});
