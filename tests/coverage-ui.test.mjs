import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const js=readFileSync(new URL('../dist/browser.js',import.meta.url),'utf8');
test('coverage is accessible and has stable TestSprite selector',()=>{assert.match(html,/id="coverage" data-testid="coverage-status" role="status"/);});
test('coverage UI distinguishes complete and interrupted observations',()=>{assert.match(js,/Gözlem kapsamı SINIRLI/);assert.match(js,/zaman kesintisi tespit edilmedi/);});
test('invalid input clears prior coverage',()=>{assert.match(js,/veri geçersiz, değerlendirilemedi/);assert.match(js,/dataset.complete = ['"]invalid['"]/);});
