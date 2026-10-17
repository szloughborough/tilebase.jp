import {readFileSync,existsSync,writeFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const articles=read('src/data/planned-cluster-articles.json'),ownership=read('src/data/cluster-keyword-ownership.json'),evidence=read('src/data/cluster-editorial-evidence.json');
const errors=[],queries=new Map(),normalize=s=>s.replace(/\s/g,'').normalize('NFKC'),results=[];
for(const a of articles){const chars=[...a.sections.map(s=>s.text||'').join('').replace(/\s/g,'')].length;const file=`dist/blog/${a.slug}/index.html`;const html=readFileSync(file,'utf8');const o=ownership.find(x=>x.url===`/blog/${a.slug}/`),e=evidence.find(x=>x.slug===a.slug);
 if(chars<=1000)errors.push(`${a.slug}: only ${chars} body characters`);
 if(!o||!e)errors.push(`${a.slug}: missing mapping/evidence`);
 if(!html.includes(`href="${o?.parent}"`))errors.push(`${a.slug}: parent missing`);
 if(!e?.diagram.src||!existsSync('public'+e.diagram.src)||!html.includes(e.diagram.src))errors.push(`${a.slug}: illustration missing`);
 if((html.match(/<h1(?:\s|>)/g)||[]).length!==1)errors.push(`${a.slug}: H1 count`);
 if(!html.includes(`href="https://tilebase.jp/blog/${a.slug}/"`))errors.push(`${a.slug}: canonical mismatch`);
 for(const q of [o?.primary,...(o?.aliases||[])].filter(Boolean)){const key=normalize(q);if(queries.has(key)&&queries.get(key)!==o.url)errors.push(`duplicate assigned query: ${q}`);queries.set(key,o.url);}
 results.push({slug:a.slug,bodyCharacters:chars,diagram:e?.diagram.src,parent:o?.parent});
}
const report={articles:results,uniqueAssignedQueries:queries.size,errors};writeFileSync('qa/new-cluster-audit.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(errors.length)process.exitCode=1;
