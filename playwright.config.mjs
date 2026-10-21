import {defineConfig,devices} from '@playwright/test';

export default defineConfig({
 testDir:'./e2e',
 fullyParallel:false,
 forbidOnly:!!process.env.CI,
 retries:process.env.CI?1:0,
 reporter:process.env.CI?'list':'line',
 use:{baseURL:'http://127.0.0.1:3300',trace:'retain-on-failure',screenshot:'only-on-failure'},
 projects:[{name:'chromium',use:{...devices['Desktop Chrome']}}],
 webServer:{command:'npm start',url:'http://127.0.0.1:3300/health',reuseExistingServer:!process.env.CI,timeout:30000,env:{PORT:'3300'}},
 timeout:30000,
});
