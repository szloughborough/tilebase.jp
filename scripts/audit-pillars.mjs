import {readFileSync,writeFileSync} from 'node:fs';
const pillars=JSON.parse(readFileSync('src/data/pillars.json','utf8').replace(/^\uFEFF/,''));
const html=slug=>readFileSync(`dist/${slug?slug+'/':''}index.html`,'utf8');
const errors=[];let contextualLinks=0;
for(const pillar of Object.values(pillars)){
 const page=html(pillar.slug);let position=-1;
 if(!page.includes(`<h1>${pillar.title}</h1>`))errors.push(`${pillar.slug}: H1 mismatch`);
 for(const section of pillar.sections){const next=page.indexOf(`<h2>${section.title}</h2>`);if(next<=position)errors.push(`${pillar.slug}: section order ${section.title}`);position=next;for(const [href] of section.links){contextualLinks++;if(!page.includes(`href="${href.replaceAll('&','&amp;')}"`))errors.push(`${pillar.slug}: missing link ${href}`);}}
 if(!html('').includes(`href="/${pillar.slug}/"`))errors.push(`${pillar.slug}: missing homepage entry`);
}
const source=readFileSync('src/data/pillar-structure.ts','utf8').split('const owners:')[1].split('};')[0];
const owners=[...source.matchAll(/'([^']+)':'([^']+)'/g)].map(m=>({slug:m[1],owner:pillars[m[2]]}));
for(const {slug,owner} of owners){const page=html(slug);if(!page.includes(`data-topic-owner="${owner.slug}"`))errors.push(`${slug}: missing topic marker`);if(!new RegExp('<ul class="pillar-reading">[\\s\\S]*?href="/'+owner.slug+'/"').test(page))errors.push(`${slug}: missing body backlink`);if(!html(owner.slug).includes(`href="/${slug}/"`))errors.push(`${slug}: missing pillar-to-cluster link`);}
const report={pillars:Object.keys(pillars).length,clusters:owners.length,contextualLinks,errors};writeFileSync('qa/pillar-audit.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(errors.length)process.exitCode=1;
