import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
const root = process.cwd();
const blocked = /(^|\/)(\.env(?:\..+)?|id_rsa|id_ed25519|\.npmrc|\.pypirc|credentials\.json|service-account\.json)$/i;
const allowedEnvExample = /(^|\/)\.env\.example$/i;
const secretPattern = /(-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9_]{30,}|github_pat_[A-Za-z0-9_]{30,})/;
const issues = [];
function scan(dir) {
  for (const entry of readdirSync(dir, {withFileTypes:true})) {
    const full=join(dir,entry.name), rel=relative(root,full).replaceAll('\\','/');
    if (entry.isSymbolicLink()) { issues.push(`Symbolic link not allowed in release: ${rel}`); continue; }
    if (entry.isDirectory()) {
      if (['node_modules','.git'].includes(entry.name)) {issues.push(`Excluded directory included: ${rel}`); continue;}
      scan(full); continue;
    }
    if (!entry.isFile()) continue;
    if (blocked.test(rel) && !allowedEnvExample.test(rel)) issues.push(`Sensitive filename: ${rel}`);
    if (statSync(full).size > 2_000_000) {issues.push(`Oversized release file: ${rel}`);continue;}
    if (/\.(?:mjs|js|ts|json|md|html|yml|yaml|txt|css)$/i.test(rel)) {
      const content=readFileSync(full,'utf8');
      if (secretPattern.test(content)) issues.push(`Potential secret marker: ${rel}`);
    }
  }
}
scan(root);
if (issues.length) { for(const issue of issues) console.error('FAIL',issue);process.exitCode=1; }
else console.log('PASS Release artifact security scan');
