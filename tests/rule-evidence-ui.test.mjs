import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const ui=readFileSync('index.html','utf8');const js=readFileSync('dist/browser.js','utf8');
test('rule evidence panel has stable test selector',()=>assert.match(ui,/data-testid="rule-evidence"/));
test('all seven rule rows use deterministic selectors',()=>assert.match(js,/rule-\$\{rule.rule\}/));
test('measured metrics use deterministic selectors',()=>assert.match(js,/metrics-\$\{rule.rule\}/));
test('invalid upload clears evidence panel',()=>assert.match(js,/byId\('rule-evidence'\)\.replaceChildren\(\)/));
test('invalid upload prevents stale report download',()=>assert.match(js,/setAttribute\('disabled', ''\)/));
