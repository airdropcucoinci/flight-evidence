import {defineConfig, devices} from '@playwright/test';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';

const baseURL = process.env.PORTAL44_BASE_URL || 'http://127.0.0.1:3301';
export default defineConfig({
  testDir: './acceptance',
  testMatch: 'portal44.spec.mjs',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: true,
  timeout: 30000,
  outputDir: 'portal44-results/artifacts',
  reporter: [['list'], ['json', {outputFile: 'portal44-results/results.json'}],
    ['html', {outputFolder: 'portal44-results/html', open: 'never'}]],
  metadata: {
    runner: 'Independent Playwright; NOT TestSprite',
    commit: execFileSync('git', ['rev-parse','HEAD'], {encoding:'utf8'}).trim(),
    sourcePlanSha256: createHash('sha256').update(readFileSync('acceptance/testsprite-plan-20261021.yaml')).digest('hex'),
    target: baseURL,
  },
  use: {baseURL, trace: 'on', screenshot: 'on',
    ...(process.env.PORTAL44_CHROMIUM_PATH ? {launchOptions:{executablePath:process.env.PORTAL44_CHROMIUM_PATH}} : {})},
  projects: [{name:'chromium',use:{...devices['Desktop Chrome']}}],
  ...(process.env.PORTAL44_BASE_URL ? {} : {webServer:{
    command:'npm start', url:baseURL+'/health', reuseExistingServer:false,
    timeout:30000, env:{PORT:'3301'},
  }}),
});
