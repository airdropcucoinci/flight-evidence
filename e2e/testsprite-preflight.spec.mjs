import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {sample} from '../dist/samples.js';

// Based on actual categories reported in the 19 October TestSprite 44-case report.
// Independent local/CI coverage; these cases are NOT TestSprite portal results.
const validCases=[
 [1,'TEMİZ',[]],
 [2,'KRİTİK',['R1']],
 [3,'DİKKAT',['R2']],
 [4,'KRİTİK',['R3']],
 [5,'KRİTİK',['R4']],
 [6,'DİKKAT',['R5']],
 [7,'KRİTİK',['R6']],
 [8,'TEMİZ',[]],
 [9,'KRİTİK',['R1','R3','R6']],
];
for(const [id,status,rules] of validCases){
 test(`TS-preflight: L${id} selects unambiguously and displays ${status}`,async({page})=>{
  await page.goto('/');
  await page.locator(`[data-testid="sample-L${id}"]`).click();
  await expect(page.locator('[data-testid="selected-scenario"]')).toContainText(`L${id} ·`);
  await expect(page.locator(`[data-testid="sample-L${id}"]`)).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('#examples [aria-pressed="true"]')).toHaveCount(1);
  await expect(page.locator('[data-testid="overall-status"]')).toHaveText(status);
  await expect(page.locator('[data-testid="total-count"]')).toHaveText(String(rules.length));
  for(const rule of rules){
   await expect(page.locator(`[data-testid="finding-${rule}"]`)).toBeVisible();
   await expect(page.locator(`[data-testid="source-rows-${rule}"]`)).toBeVisible();
  }
  await expect(page.getByRole('alert')).toBeEmpty();
  await expect(page.locator('[data-testid="report-json"]')).toBeEnabled();
 });
}

test('TS-preflight: L10 is intentionally invalid, visibly selected, without exports',async({page})=>{
 await page.goto('/');
 await page.locator('[data-testid="sample-L10"]').click();
 await expect(page.locator('[data-testid="selected-scenario"]')).toContainText('L10 ·');
 await expect(page.locator('[data-testid="sample-L10"]')).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('[data-testid="overall-status"]')).toHaveText('ANALİZ YAPILMADI');
 await expect(page.getByRole('alert')).toContainText('Minimum 10 rows required');
 await expect(page.locator('[data-testid="rule-evidence"] > li')).toHaveCount(0);
 await expect(page.locator('[data-testid="report-json"]')).toBeDisabled();
 await expect(page.locator('#download')).toBeDisabled();
});

test('TS-preflight: L8 → L10 → L8 is deterministic and restores downloads',async({page})=>{
 await page.goto('/');
 for(const [id,status] of [[8,'TEMİZ'],[10,'ANALİZ YAPILMADI'],[8,'TEMİZ']]){
  await page.locator(`[data-testid="sample-L${id}"]`).click();
  await expect(page.locator('[data-testid="overall-status"]')).toHaveText(status);
  await expect(page.locator(`[data-testid="sample-L${id}"]`)).toHaveAttribute('aria-pressed','true');
 }
 await expect(page.getByRole('alert')).toBeEmpty();
 await expect(page.locator('#download')).toBeEnabled();
});

test('TS-preflight: switching scenarios resets prior finding filters',async({page})=>{
 await page.goto('/');
 await page.locator('[data-testid="sample-L9"]').click();
 await page.locator('[data-testid="finding-filter"]').selectOption('CRITICAL');
 await page.locator('[data-testid="rule-filter"]').selectOption('R3');
 await expect(page.locator('[data-testid="finding-R3"]')).toBeVisible();
 await page.locator('[data-testid="sample-L2"]').click();
 await expect(page.locator('[data-testid="finding-filter"]')).toHaveValue('ALL');
 await expect(page.locator('[data-testid="rule-filter"]')).toHaveValue('ALL');
 await expect(page.locator('[data-testid="finding-R1"]')).toBeVisible();
});

test('TS-preflight: valid CSV upload enables CSV export with actual row content',async({page})=>{
 await page.goto('/');
 await page.locator('#upload').setInputFiles('test-fixtures/valid-flight.csv');
 await expect(page.locator('[data-testid="row-count"]')).toHaveText('20');
 const promised=page.waitForEvent('download');
 await page.locator('#download').click();
 const download=await promised;
 expect(download.suggestedFilename()).toBe('flight-evidence-sample.csv');
 const csv=await readFile(await download.path(),'utf8');
 expect(csv.trim().split(/\r?\n/)).toHaveLength(21);
 expect(csv.split('\n')[0]).toContain('gpsAlt,baroAlt');
});

test('TS-preflight: valid CSV report download contains actual source and row count',async({page})=>{
 await page.goto('/');
 await page.locator('#upload').setInputFiles('test-fixtures/valid-flight.csv');
 const promised=page.waitForEvent('download');
 await page.locator('[data-testid="report-json"]').click();
 const download=await promised;
 expect(download.suggestedFilename()).toBe('flight-evidence-report.json');
 const json=JSON.parse(await readFile(await download.path(),'utf8'));
 expect(json.rowCount).toBe(20);
 expect(json.source).toBe('selected-sample-or-upload');
 expect(json.rules.map(rule=>rule.rule)).toEqual(['R1','R2','R3','R4','R5','R6','R7']);
});

test('TS-preflight: valid JSON file can be uploaded and reviewed',async({page})=>{
 await page.goto('/');
 await page.locator('#upload').setInputFiles({name:'valid-fixture.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(sample(2)))});
 await expect(page.locator('[data-testid="selected-scenario"]')).toContainText('valid-fixture.json');
 await expect(page.locator('[data-testid="overall-status"]')).toHaveText('KRİTİK');
 await expect(page.locator('[data-testid="finding-R1"]')).toBeVisible();
});

test('TS-preflight: invalid CSV upload retains prior L2 evidence and labels retained data',async({page})=>{
 await page.goto('/');
 await page.locator('[data-testid="sample-L2"]').click();
 await page.locator('#upload').setInputFiles('test-fixtures/invalid-flight.csv');
 await expect(page.getByRole('alert')).toContainText('Yükleme reddedildi');
 await expect(page.locator('[data-testid="selected-scenario"]')).toContainText('Önceki geçerli analiz korunuyor');
 await expect(page.locator('[data-testid="finding-R1"]')).toBeVisible();
 await expect(page.locator('[data-testid="report-json"]')).toBeEnabled();
});

test('TS-preflight: invalid JSON after L10 does not pretend a prior valid report exists',async({page})=>{
 await page.goto('/');
 await page.locator('[data-testid="sample-L10"]').click();
 await page.locator('#upload').setInputFiles({name:'broken.json',mimeType:'application/json',buffer:Buffer.from('{"not":"rows"}')});
 await expect(page.getByRole('alert')).toContainText('Geçerli analiz yok');
 await expect(page.locator('[data-testid="overall-status"]')).toHaveText('ANALİZ YAPILMADI');
 await expect(page.locator('#download')).toBeDisabled();
 await expect(page.locator('[data-testid="report-json"]')).toBeDisabled();
});

test('TS-preflight: unsupported file extension is rejected visibly without breaking UI',async({page})=>{
 await page.goto('/');
 await page.locator('#upload').setInputFiles({name:'wrong.txt',mimeType:'text/plain',buffer:Buffer.from('hello')});
 await expect(page.getByRole('alert')).toContainText('Yalnızca CSV veya JSON');
 await expect(page.locator('[data-testid="overall-status"]')).toHaveText('TEMİZ');
 await page.locator('[data-testid="sample-L9"]').click();
 await expect(page.locator('[data-testid="overall-status"]')).toHaveText('KRİTİK');
});

test('TS-preflight: valid CSV can replace an invalid selected L10 state',async({page})=>{
 await page.goto('/');
 await page.locator('[data-testid="sample-L10"]').click();
 await page.locator('#upload').setInputFiles('test-fixtures/valid-flight.csv');
 await expect(page.locator('[data-testid="row-count"]')).toHaveText('20');
 await expect(page.getByRole('alert')).toBeEmpty();
 await expect(page.locator('[data-testid="report-json"]')).toBeEnabled();
});

test('TS-preflight: switching all ten scenarios produces no JavaScript exceptions',async({page})=>{
 const jsErrors=[];page.on('pageerror',e=>jsErrors.push(e.message));
 await page.goto('/');
 for(let id=1;id<=10;id++){
  await page.locator(`[data-testid="sample-L${id}"]`).click();
  await expect(page.locator(`[data-testid="sample-L${id}"]`)).toHaveAttribute('aria-pressed','true');
 }
 await page.locator('[data-testid="sample-L1"]').click();
 await expect(page.locator('[data-testid="overall-status"]')).toHaveText('TEMİZ');
 expect(jsErrors).toEqual([]);
});

test('TS-preflight: API health and all sample ids are available',async({request})=>{
 const h=await request.get('/health');expect(h.status()).toBe(200);
 expect((await h.json()).status).toBe('ok');
 const r=await request.get('/api/samples');expect(r.status()).toBe(200);
 const ids=(await r.json()).samples.map(item=>item.id);
 expect(ids).toEqual(Array.from({length:10},(_,i)=>`L${i+1}`));
});

for(const [id,status] of [[1,'CLEAN'],[2,'CRITICAL'],[3,'WARNING'],[8,'CLEAN'],[9,'CRITICAL']]){
 test(`TS-preflight: API sample ${id} status ${status} is deterministic`,async({request})=>{
  const a=await request.post('/api/analyze',{data:{sampleId:id}});
  const b=await request.post('/api/analyze',{data:{sampleId:id}});
  expect(a.status()).toBe(200);expect(b.status()).toBe(200);
  expect((await a.json()).status).toBe(status);
  expect(await a.json()).toEqual(await b.json());
 });
}

test('TS-preflight: report L2 includes measured R1 speed and source rows',async({request})=>{
 const r=await request.post('/api/report',{data:{sampleId:2}});
 expect(r.status()).toBe(200);
 const data=await r.json();
 const e=data.evidence.find(e=>e.rule==='R1');
 expect(e.sourceRows.currentIndex).toBeGreaterThan(0);
 expect(e.contextualMetrics.estimatedSpeedMps).toBeGreaterThan(40);
});

test('TS-preflight: L10 API report explicitly rejects invalid sample, not 200',async({request})=>{
 const r=await request.post('/api/report',{data:{sampleId:10}});
 expect(r.status()).toBe(422);
 expect((await r.json()).error).toContain('Minimum 10 rows required');
});

test('TS-preflight: API rejects conflicting input representations',async({request})=>{
 const r=await request.post('/api/analyze',{data:{sampleId:1,rows:[]}});
 expect(r.status()).toBe(422);
 expect((await r.json()).error).toContain('exactly one');
});

test('TS-preflight: API rejects unsupported media types',async({request})=>{
 const r=await request.post('/api/report',{data:'hello',headers:{'content-type':'text/plain'}});
 expect(r.status()).toBe(415);
});

test('TS-preflight: API rejects invalid JSON syntax',async({request})=>{
 const r=await request.post('/api/analyze',{data:'{no',headers:{'content-type':'application/json'}});
 expect(r.status()).toBe(422);
});

test('TS-preflight: API rejects body bigger than 1MB',async({request})=>{
 const r=await request.post('/api/report',{data:'z'.repeat(1_000_030),headers:{'content-type':'application/json'}});
 expect(r.status()).toBe(413);
});

test('TS-preflight: static file paths remain restricted',async({request})=>{
 for(const path of ['/package.json','/README.md','/test-fixtures/valid-flight.csv']){
  const r=await request.get(path);expect(r.status()).toBe(404);
 }
});

for(const width of [360,768]){
 test(`TS-preflight: responsive viewport ${width}px has no horizontal overflow`,async({page})=>{
  await page.setViewportSize({width,height:780});
  await page.goto('/');
  const sizes=await page.evaluate(()=>({content:document.documentElement.scrollWidth,viewport:innerWidth}));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport+3);
  await expect(page.locator('[data-testid="sample-L10"]')).toBeVisible();
 });
}
