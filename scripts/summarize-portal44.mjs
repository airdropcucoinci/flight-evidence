import {readFileSync,writeFileSync,appendFileSync} from 'node:fs';
const report=JSON.parse(readFileSync('portal44-results/results.json','utf8'));
const cases=JSON.parse(readFileSync('acceptance/portal44-cases.json','utf8'));
const specs=[];
function walk(suite) {specs.push(...(suite.specs||[]));for(const child of suite.suites||[])walk(child);}
for(const suite of report.suites)walk(suite);
const rows=cases.map(c=>{
  const matches=specs.filter(s=>s.title.startsWith(c.id+' — '));
  const results=matches.flatMap(s=>s.tests.flatMap(t=>t.results));
  const status=matches.length===1&&results.length===1?results[0].status:'missing-or-ambiguous';
  return {...c,status,durationMs:results.reduce((sum,r)=>sum+r.duration,0)};
});
const passed=rows.filter(r=>r.status==='passed').length;
const summary={runner:'Independent Playwright; NOT TestSprite',metadata:report.config.metadata,
  startedAt:report.stats.startTime,passed,total:44,results:rows};
writeFileSync('portal44-results/summary.json',JSON.stringify(summary,null,2)+'\n');
const md=`# Independent portal scenario equivalents: ${passed}/44 passed\n\n`+
  `These are independently authored Playwright tests, not TestSprite execution results.\n\n`+
  `Commit: \`${summary.metadata.commit}\`\n\nTarget: \`${summary.metadata.target}\`\n\n`+
  `| Case | Result | Scenario |\n|---|---|---|\n`+
  rows.map(r=>`| ${r.id} | ${r.status} | ${r.name} |`).join('\n')+'\n';
writeFileSync('portal44-results/summary.md',md);
if(process.env.GITHUB_STEP_SUMMARY)appendFileSync(process.env.GITHUB_STEP_SUMMARY,md);
console.log(md);
if(passed!==44||specs.length!==44)process.exitCode=1;
