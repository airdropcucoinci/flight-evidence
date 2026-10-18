#!/usr/bin/env node
// Verifies a user-supplied deployment URL. Does not modify remote state.
const target = process.argv[2] || process.env.FLIGHT_EVIDENCE_URL;
if (!target) { console.error('Usage: node scripts/verify-deployment.mjs https://your-app.example'); process.exit(2); }
let base;
try { base = new URL(target); if (!['http:', 'https:'].includes(base.protocol)) throw Error('HTTP(S) required'); } catch { console.error('Invalid HTTP(S) URL'); process.exit(2); }
const checks = [];
async function check(label, action) {
  try { await action(); checks.push({label, ok:true}); console.log('PASS', label); }
  catch (e) { checks.push({label, ok:false}); console.error('FAIL', label, '-', e.message); }
}
const assert = (value, message) => { if (!value) throw Error(message); };
async function request(path, options) { const response = await fetch(new URL(path, base), {signal:AbortSignal.timeout(10000), ...options}); const json = await response.json(); return {response,json}; }
await check('Health endpoint', async () => { const {response,json}=await request('/health'); assert(response.status===200 && json.status==='ok','health must return 200/ok'); });
await check('Ten samples listed', async () => { const {response,json}=await request('/api/samples'); assert(response.status===200 && Array.isArray(json.samples) && json.samples.length===10,'expected ten samples'); });
await check('Clean sample', async () => { const {response,json}=await request('/api/analyze',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({sampleId:1})}); assert(response.status===200 && json,'expected successful analysis'); assert(json.status==='CLEAN' && Array.isArray(json.findings) && json.findings.length===0,'expected CLEAN with zero findings'); });
await check('GPS jump sample', async () => { const {response,json}=await request('/api/analyze',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({sampleId:2})}); assert(response.status===200 && json.status==='CRITICAL' && json.findings?.some(f=>f.rule==='R1'),'expected L2 critical R1'); });
await check('Multi-finding sample', async () => { const {response,json}=await request('/api/analyze',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({sampleId:9})}); const rules=new Set(json.findings?.map(f=>f.rule)); assert(response.status===200 && json.status==='CRITICAL' && ['R1','R3','R6'].every(r=>rules.has(r)),'expected L9 R1/R3/R6'); });
await check('Evidence report consistency', async () => { const options={method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({sampleId:2})}; const {response,json}=await request('/api/report',options); assert(response.status===200 && json.schemaVersion==='1.0' && json.findings?.some(f=>f.rule==='R1') && json.evidence?.some(e=>e.rule==='R1' && e.sourceRows?.currentIndex!==null),'expected traceable R1 evidence'); });
await check('Malformed input rejected', async () => { const {response}=await request('/api/analyze',{method:'POST',headers:{'content-type':'application/json'},body:'{"'}); assert(response.status===422,'expected 422'); });
console.log(`Deployment checks: ${checks.filter(c=>c.ok).length}/${checks.length} PASS`);
if (checks.some(c=>!c.ok)) process.exitCode=1;
