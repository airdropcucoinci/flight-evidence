import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const scanner = resolve('scripts/check-release-artifacts.mjs');
function withFixture(files, check) {
  const dir = mkdtempSync(join(tmpdir(), 'flight-release-scan-'));
  try {
    for (const [name, content] of Object.entries(files)) {
      const path = join(dir, name);
      mkdirSync(resolve(path, '..'), { recursive: true });
      writeFileSync(path, content);
    }
    const result = spawnSync(process.execPath, [scanner], { cwd: dir, encoding: 'utf8' });
    check(result);
  } finally { rmSync(dir, { recursive: true, force: true }); }
}
test('release scan accepts benign project files', () => withFixture({ 'README.md': 'Flight Evidence', '.env.example': 'TOKEN=placeholder' }, r => assert.equal(r.status, 0, r.stderr)));
test('release scan blocks .env files', () => withFixture({ '.env': 'TOKEN=example' }, r => assert.equal(r.status, 1)));
test('release scan blocks embedded private key headers', () => withFixture({ 'src/config.ts': ['-----BEGIN', 'PRIVATE KEY-----'].join(' ') }, r => assert.equal(r.status, 1)));
test('release scan blocks node_modules', () => withFixture({ 'node_modules/example.txt': 'x' }, r => assert.equal(r.status, 1)));
