import {spawnSync} from 'node:child_process';
import {existsSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
const root=process.cwd();
const checks=[
 ['Node.js regression tests','node',['--test','tests/acceptance-offline.test.mjs']],
 ['TestSprite scenario contract','node',['scripts/check-test-contract.mjs']],
 ['Release secret scanner','node',['scripts/check-release-artifacts.mjs']],
];
const results=[];
for(const [name,cmd,args] of checks){
 const run=spawnSync(cmd,args,{cwd:root,encoding:'utf8',timeout:120000});
 const ok=run.status===0;
 results.push({name,ok,exitCode:run.status,output:(run.stdout||'').slice(-2000),error:(run.stderr||'').slice(-1000)});
 console.log(`${ok?'PASS':'FAIL'} ${name}`);
}
const pending=['Vitest (npm dependencies unavailable here)','Real browser E2E','GitHub CI and TestSprite PR','Public deployment and Discord submission'];
writeFileSync(join(root,'OFFLINE_ACCEPTANCE_RESULT.json'),JSON.stringify({generatedAt:new Date().toISOString(),results,pending},null,2));
if(results.some(r=>!r.ok))process.exitCode=1;
