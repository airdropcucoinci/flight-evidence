import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import cases from './portal44-cases.json' with {type:'json'};

// These are independent implementations of the portal's exported plans.
// Keep all original IDs, including repeated workflows in different use cases.
// Do not use the application's analysis engine to calculate expected results.
const expected = {
  1:['TEMİZ',[]], 2:['KRİTİK',['R1']], 3:['DİKKAT',['R2']],
  4:['KRİTİK',['R3']], 5:['KRİTİK',['R4']], 6:['DİKKAT',['R5']],
  7:['KRİTİK',['R6']], 8:['TEMİZ',[]], 9:['KRİTİK',['R1','R3','R6']],
  10:['ANALİZ YAPILMADI',[]],
};
const findings = page => page.locator('#findings [data-testid^="finding-R"]');
async function select(page,id) {
  await page.getByTestId(`sample-L${id}`).click();
  await expect(page.getByTestId('selected-scenario')).toContainText(`L${id} ·`);
  await expect(page.getByTestId(`sample-L${id}`)).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('#examples [aria-pressed="true"]')).toHaveCount(1);
  const [status,rules]=expected[id];
  await expect(page.getByTestId('overall-status')).toHaveText(status);
  await expect(findings(page)).toHaveCount(rules.length);
  for(const rule of rules) await expect(page.getByTestId(`finding-${rule}`)).toBeVisible();
  if(id===10) {
    await expect(page.getByRole('alert')).toContainText('Minimum 10 rows required');
    await expect(page.locator('#download')).toBeDisabled();
    await expect(page.locator('#report-json')).toBeDisabled();
  } else {
    await expect(page.getByRole('alert')).toBeEmpty();
    await expect(page.getByTestId('total-count')).toHaveText(String(rules.length));
    await expect(page.locator('#download')).toBeEnabled();
    await expect(page.locator('#report-json')).toBeEnabled();
  }
}
async function filters(page,rule='R3',count=3) {
  // L9 has three CRITICAL findings. WARNING must yield zero; CRITICAL restores
  // all three, then R3 narrows to one. We do not invent mixed severities in L9.
  await page.getByTestId('finding-filter').selectOption('WARNING');
  await expect(findings(page)).toHaveCount(0);
  await page.getByTestId('finding-filter').selectOption('CRITICAL');
  await page.getByTestId('rule-filter').selectOption(rule);
  await expect(findings(page)).toHaveCount(1);
  await expect(page.getByTestId(`finding-${rule}`)).toContainText('CRITICAL');
  await page.getByTestId('reset-filters').click();
  await expect(page.getByTestId('finding-filter')).toHaveValue('ALL');
  await expect(page.getByTestId('rule-filter')).toHaveValue('ALL');
  await expect(findings(page)).toHaveCount(count);
}
async function upload(page) {
  await page.locator('#upload').setInputFiles('test-fixtures/valid-flight.csv');
  await expect(page.getByTestId('selected-scenario')).toHaveText('Yüklenen dosya: valid-flight.csv');
  await expect(page.getByTestId('row-count')).toHaveText('20');
  await expect(page.getByTestId('overall-status')).toHaveText('TEMİZ');
  await expect(findings(page)).toHaveCount(0);
  await expect(page.getByRole('alert')).toBeEmpty();
}
async function invalidUpload(page) {
  const before={status:await page.getByTestId('overall-status').innerText(),
    rows:await page.getByTestId('row-count').innerText(), findings:await findings(page).allTextContents()};
  await page.locator('#upload').setInputFiles({name:'unsupported.txt',mimeType:'text/plain',buffer:Buffer.from('not a supported flight file')});
  await expect(page.getByRole('alert')).toContainText('Yalnızca CSV veya JSON');
  await expect(page.getByTestId('selected-scenario')).toContainText('Önceki geçerli analiz korunuyor');
  await expect(page.getByTestId('overall-status')).toHaveText(before.status);
  await expect(page.getByTestId('row-count')).toHaveText(before.rows);
  expect(await findings(page).allTextContents()).toEqual(before.findings);
  await expect(page.locator('#download')).toBeEnabled();
  await expect(page.locator('#report-json')).toBeEnabled();
}
async function exports(page,info,rows,rules,{uploaded=false}={}) {
  const contents={};
  for(const [selector,filename,type] of [
    ['#download','flight-evidence-sample.csv','text/csv'],
    ['#report-json','flight-evidence-report.json','application/json'],
  ]) {
    await expect(page.locator(selector)).toBeEnabled();
    const pending=page.waitForEvent('download');
    await page.locator(selector).click();
    const download=await pending;
    expect(await download.failure()).toBeNull();
    expect(download.suggestedFilename()).toBe(filename);
    const path=info.outputPath(filename);
    await download.saveAs(path);
    await info.attach(filename,{path,contentType:type});
    contents[type]=await readFile(path,'utf8');
    expect(contents[type].length).toBeGreaterThan(50);
  }
  const csv=contents['text/csv'].trim().split(/\r?\n/).map(line=>line.split(','));
  expect(csv[0]).toEqual(['t','lat','lon','gpsAlt','baroAlt','ax','gx','motor','voltage']);
  expect(csv).toHaveLength(rows+1);
  expect(csv.slice(1).every(row=>row.length===9&&row.every(value=>value!==''&&Number.isFinite(Number(value))))).toBe(true);
  if(uploaded) {
    const original=(await readFile('test-fixtures/valid-flight.csv','utf8')).trim().split(/\r?\n/).slice(1).map(line=>line.split(',').map(Number));
    expect(csv.slice(1).map(row=>row.map(Number))).toEqual(original);
  }
  const report=JSON.parse(contents['application/json']);
  expect(report).toMatchObject({schemaVersion:'1.0',rowCount:rows,source:'selected-sample-or-upload',status:rules.length?'CRITICAL':'CLEAN'});
  expect(report.rules.map(rule=>rule.rule)).toEqual(['R1','R2','R3','R4','R5','R6','R7']);
  expect(report.findings.map(f=>f.rule).sort()).toEqual([...rules].sort());
  expect(report.firstTimestamp).toBe(Number(csv[1][0]));
  expect(report.lastTimestamp).toBe(Number(csv.at(-1)[0]));
  expect(report.evidence).toHaveLength(rules.length);
  for(const e of report.evidence) {
    expect(e.sourceRows.indexBase).toBe(0);
    expect(e.sourceRows.currentIndex).toBeGreaterThanOrEqual(0);
    expect(e.sourceRows.currentIndex).toBeLessThan(rows);
    expect(e.observation.timestamp).toBe(Number(csv[e.sourceRows.currentIndex+1][0]));
  }
}
async function evidence(page,id) {
  await select(page,id);
  await page.getByTestId('coverage-status').scrollIntoViewIfNeeded();
  await expect(page.getByTestId('coverage-status')).toContainText('Gözlem kapsamı');
  await expect(page.getByTestId('coverage-status')).toHaveAttribute('data-complete','true');
  await expect(page.getByTestId('rule-evidence').locator('> li')).toHaveCount(7);
  for(const rule of expected[id][1]) {
    await page.getByTestId(`source-rows-${rule}`).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(`source-rows-${rule}`)).toHaveText(/Kaynak kayıt \(0 tabanlı\): satır \d+.*t=\d/);
    await expect(page.getByTestId(`rule-${rule}`)).toHaveAttribute('data-state','CRITICAL');
  }
  await page.getByTestId('timeline').scrollIntoViewIfNeeded();
  await expect(page.getByTestId('timeline')).toBeVisible();
  for(const rule of expected[id][1]) await expect(page.getByTestId('timeline')).toContainText(rule);
}

if(cases.length!==44||new Set(cases.map(c=>c.id)).size!==44) throw Error('Expected 44 unique portal case IDs');
for(const c of cases) {
  test(`${c.id} — ${c.name}`,async({page},info)=>{
    info.annotations.push({type:'use case',description:c.useCase},{type:'source',description:'TestSprite plan exported 2026-10-21; independent implementation'});
    await info.attach('original-plan',{body:JSON.stringify(c,null,2),contentType:'application/json'});
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('console',message=>{if(message.type()==='error') errors.push(message.text());});
    await page.goto('/');
    const n=Number(c.id.split('-')[1]);
    await test.step(c.description,async()=>{
      if(n===1) for(let id=1;id<=10;id++) await test.step(`Select and verify L${id}`,()=>select(page,id));
      else if(n===2) await select(page,1);
      else if(n===3) {await select(page,2);await expect(page.getByTestId('finding-R1')).toContainText(/GPS|hız|speed/i);}
      else if(n===4) await select(page,9);
      else if(n===5) {await select(page,9);await filters(page);}
      else if(n===6) await evidence(page,['BUL','OBS'].includes(c.id.split('-')[0])?2:9);
      else if(n===7) {
        await upload(page);
        if(c.id==='FLG-007') await invalidUpload(page);
        await exports(page,info,20,[],{uploaded:true});
      } else if(c.id==='FLG-008') {
        for(const id of [1,2,9]) await select(page,id);
        await page.getByTestId('rule-evidence').scrollIntoViewIfNeeded();
        await exports(page,info,301,['R1','R3','R6']);
        await select(page,1);
      } else if(n===8) {await invalidUpload(page);await select(page,2);}
      else if(n===9) {
        if(c.id!=='UX-009') await select(page,1);
        await select(page,2);
        await filters(page,'R1',1);
        if(['BUL-009','UPL-009'].includes(c.id)) await upload(page);
        if(c.id==='UPL-009') await exports(page,info,20,[],{uploaded:true});
        if(c.id==='OBS-009') await exports(page,info,301,['R1']);
        await select(page,1);
      } else throw Error(`Unmapped portal case ${c.id}`);
    });
    expect(errors,'Browser JavaScript / console errors').toEqual([]);
  });
}
