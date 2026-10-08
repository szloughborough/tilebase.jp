import {readFileSync,readdirSync,existsSync,writeFileSync} from 'node:fs';
import path from 'node:path';
const root=path.resolve('dist');
const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(dir,x.name)):[path.join(dir,x.name)]);
const files=walk(root),html=files.filter(f=>f.endsWith('.html'));
const forbidden=['\u4f73\u6da6\u4e1a','jorunns','jiarunye','morcart','[FACT REQUIRED]','/ja/'];
const preview=readFileSync(path.join(root,'robots.txt'),'utf8').includes('Disallow: /\n');
const errors=[],titles=new Set(),descriptions=new Set(),edges=new Map();let linkCount=0;
for(const file of files){if(!/\.(html|js|css|json|xml|txt)$/i.test(file))continue;const source=readFileSync(file,'utf8');for(const term of forbidden)if(source.toLowerCase().includes(term.toLowerCase()))errors.push(`${path.relative(root,file)}: forbidden content ${term}`);}
for(const file of html){
 const source=readFileSync(file,'utf8'),rel=path.relative(root,file).replaceAll('\\','/');
 const url=rel==='index.html'?'/':rel==='404.html'?'/404.html':`/${rel.replace(/index\.html$/,'')}`;
 if((source.match(/<h1(?:\s|>)/g)||[]).length!==1)errors.push(`${url}: must have one H1`);
 const title=source.match(/<title>([^<]+)<\/title>/)?.[1];const description=source.match(/<meta name="description" content="([^"]+)"/)?.[1];
 if(!title||titles.has(title))errors.push(`${url}: missing or duplicate title`);if(!description||descriptions.has(description))errors.push(`${url}: missing or duplicate description`);titles.add(title);descriptions.add(description);
 if(!source.includes('<html lang="ja"'))errors.push(`${url}: missing Japanese language`);
 if(!source.includes('rel="canonical"'))errors.push(`${url}: missing canonical`);
 for(const [,script] of source.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))try{JSON.parse(script);}catch{errors.push(`${url}: invalid JSON-LD`);}
 const outgoing=[];
 for(const [,attribute,value] of source.matchAll(/\b(href|src)="([^"]+)"/g)){
   if(!value.startsWith('/')||value.startsWith('//'))continue;const target=new URL(value,'https://tilebase.jp');const local=decodeURIComponent(target.pathname);linkCount++;
   const exists=local.endsWith('/')?existsSync(path.join(root,local,'index.html')):existsSync(path.join(root,local));
   if(!exists)errors.push(`${url}: missing ${attribute} ${local}`);
   if(attribute==='href')outgoing.push(local);
   if(target.hash&&target.pathname===url&&!source.includes(`id="${target.hash.slice(1)}"`))errors.push(`${url}: missing anchor ${target.hash}`);
 }
 edges.set(url,outgoing);
 for(const [,tag] of source.matchAll(/(<img\b[^>]+>)/g))if(!tag.includes('alt=')||!tag.includes('width=')||!tag.includes('height='))errors.push(`${url}: image lacks alt or dimensions`);
 if(preview&&!source.includes('noindex'))errors.push(`${url}: preview must be noindex`);
}
for(const [url] of edges){if(url==='/'||url==='/404.html')continue;if(![...edges.values()].some(list=>list.includes(url)))errors.push(`${url}: orphan page`);}
const report={generatedAt:new Date().toISOString(),htmlPages:html.length,publicImages:files.filter(f=>f.endsWith('.webp')).length,localReferencesChecked:linkCount,errors,preview};
writeFileSync('qa/static-audit.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(errors.length)process.exitCode=1;
