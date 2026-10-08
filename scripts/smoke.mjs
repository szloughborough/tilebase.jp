import {readdirSync,writeFileSync} from 'node:fs';
import path from 'node:path';
const origin=process.env.PREVIEW_URL||'http://127.0.0.1:4322';
const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(dir,x.name)):[path.join(dir,x.name)]);
const files=walk('dist').filter(p=>p.endsWith('index.html'));
const routes=files.map(file=>{const rel=path.relative('dist',file).replaceAll('\\','/');return rel==='index.html'?'/':`/${rel.replace('index.html','')}`;});
const errors=[];
for(const route of routes){const response=await fetch(`${origin}${route}`);if(response.status!==200)errors.push(`${route}: ${response.status}`);const html=await response.text();if(!html.includes('<h1'))errors.push(`${route}: missing content`);}
const missing=await fetch(`${origin}/not-a-real-tilebase-page/`);if(missing.status!==404)errors.push(`Unknown URL: expected 404, got ${missing.status}`);
const preview=await fetch(`${origin}/api/inquiries`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'preview smoke test, no visitor data'})});if(preview.status!==503)errors.push(`Preview API: expected 503, got ${preview.status}`);
if(!(await preview.json()).message?.includes('確認用'))errors.push('Preview API response unclear');
const report={origin,routes:routes.length,unknownRouteStatus:missing.status,previewInquiryStatus:preview.status,errors};
writeFileSync('qa/http-smoke.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(errors.length)process.exitCode=1;
