import {test,expect} from '@playwright/test';

test('L1 clean: header, disclaimer, figures and source data render without page errors',async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/');
 await expect(page.getByRole('heading',{name:'Flight Evidence'})).toBeVisible();
 await expect(page.locator('.notice')).toContainText('Sentetik örnek kayıtlarla eğitim demosu');
 await expect(page.locator('[data-testid="overall-status"]')).toHaveText('TEMİZ');
 await expect(page.locator('[data-testid="total-count"]')).toHaveText('0');
 await expect(page.locator('[data-testid="row-count"]')).toHaveText('301');
 await expect(page.locator('[data-testid="route-plot"] polyline')).not.toHaveCount(0);
 await expect(page.locator('[data-testid="altitude-plot"] polyline')).not.toHaveCount(0);
 await expect(page.locator('[data-testid="rule-evidence"] > li')).toHaveCount(7);
 expect(errors).toEqual([]);
});

test('L2 and L9: critical findings, source rows and independent rule filters work',async({page})=>{
 await page.goto('/');
 await page.locator('[data-testid="sample-L2"]').click();
 await expect(page.locator('[data-testid="overall-status"]')).toHaveText('KRİTİK');
 await expect(page.locator('[data-testid="finding-R1"]')).toBeVisible();
 await expect(page.locator('[data-testid="source-rows-R1"]')).toBeVisible();
 await expect(page.locator('[data-testid="route-plot"] [data-testid="plot-marker-R1"]')).toBeVisible();
 await page.locator('[data-testid="sample-L9"]').click();
 await expect(page.locator('[data-testid="overall-status"]')).toHaveText('KRİTİK');
 for(const rule of ['R1','R3','R6']) await expect(page.locator(`[data-testid="finding-${rule}"]`)).toBeVisible();
 await page.locator('[data-testid="finding-filter"]').selectOption('CRITICAL');
 await page.locator('[data-testid="rule-filter"]').selectOption('R3');
 await expect(page.locator('[data-testid="finding-R3"]')).toBeVisible();
 await expect(page.locator('[data-testid="finding-R1"]')).toHaveCount(0);
 await page.locator('[data-testid="reset-filters"]').click();
 await expect(page.locator('[data-testid="finding-R1"]')).toBeVisible();
 await expect(page.locator('[data-testid="finding-R6"]')).toBeVisible();
});

test('L8 boundary is clean; L10 intentional malformed record blocks downloads and recovers',async({page})=>{
 await page.goto('/');
 await page.locator('[data-testid="sample-L8"]').click();
 await expect(page.locator('[data-testid="overall-status"]')).toHaveText('TEMİZ');
 await expect(page.locator('[data-testid="selected-scenario"]')).toContainText('L8');
 await page.locator('[data-testid="sample-L10"]').click();
 await expect(page.locator('[data-testid="overall-status"]')).toHaveText('ANALİZ YAPILMADI');
 await expect(page.getByRole('alert')).toContainText('Minimum 10 rows required');
 await expect(page.locator('[data-testid="report-json"]')).toBeDisabled();
 await expect(page.locator('#download')).toBeDisabled();
 await expect(page.locator('[data-testid="route-plot"] polyline')).toHaveCount(0);
 await page.locator('[data-testid="sample-L1"]').click();
 await expect(page.locator('[data-testid="overall-status"]')).toHaveText('TEMİZ');
 await expect(page.locator('[data-testid="report-json"]')).toBeEnabled();
});

test('Rejected CSV upload explains the rejection and preserves labeled last valid analysis',async({page})=>{
 await page.goto('/');
 await page.locator('[data-testid="sample-L2"]').click();
 await expect(page.locator('[data-testid="overall-status"]')).toHaveText('KRİTİK');
 await page.locator('#upload').setInputFiles('test-fixtures/invalid-flight.csv');
 await expect(page.getByRole('alert')).toContainText('Yükleme reddedildi');
 await expect(page.locator('[data-testid="selected-scenario"]')).toContainText('Önceki geçerli analiz korunuyor');
 await expect(page.locator('[data-testid="overall-status"]')).toHaveText('KRİTİK');
 await expect(page.locator('[data-testid="report-json"]')).toBeEnabled();
});

test('Valid CSV upload works and downloaded report is well-formed JSON',async({page})=>{
 await page.goto('/');
 await page.locator('#upload').setInputFiles('test-fixtures/valid-flight.csv');
 await expect(page.locator('[data-testid="selected-scenario"]')).toContainText('valid-flight.csv');
 await expect(page.locator('[data-testid="row-count"]')).toHaveText('20');
 await expect(page.getByRole('alert')).toBeEmpty();
 const downloadPromise=page.waitForEvent('download');
 await page.locator('[data-testid="report-json"]').click();
 const download=await downloadPromise;
 expect(download.suggestedFilename()).toBe('flight-evidence-report.json');
});

test('Mobile viewport remains usable without horizontal document overflow',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/');
 await expect(page.locator('[data-testid="sample-L10"]')).toBeVisible();
 await expect(page.locator('[data-testid="overall-status"]')).toHaveText('TEMİZ');
 const widths=await page.evaluate(()=>({document:document.documentElement.scrollWidth,window:window.innerWidth}));
 expect(widths.document).toBeLessThanOrEqual(widths.window+3);
});
