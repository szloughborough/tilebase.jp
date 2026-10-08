import {readFileSync} from 'node:fs';
const form=readFileSync('dist/quote/index.html','utf8');
const optional=form.match(/<details class="inquiry-options">([\s\S]*?)<\/details>/)?.[1]||'';
if(!optional||/\brequired\b/.test(optional))throw Error('Optional section missing or contains required fields');
for(const field of ['quantity','channel','targetDate','packaging'])if(!optional.includes(`name="${field}"`))throw Error(`Missing ${field}`);
for(const slug of ['how-to-evaluate-floor-tile-suppliers','import-purchasing-checklist']){
 const html=readFileSync(`dist/blog/sourcing-oem/${slug}/index.html`,'utf8');
 if(!html.includes('/quote/?type=wholesale'))throw Error(`Wrong inquiry route: ${slug}`);
}
console.log('Optional fields preserved; procurement articles link to wholesale inquiry.');
