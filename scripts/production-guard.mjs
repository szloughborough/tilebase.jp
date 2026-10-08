import {readFileSync} from 'node:fs';
export function verifyProductionReadiness(environment=process.env){
 if(environment.PUBLIC_SITE_STAGE!=='production')return;
 const checks=JSON.parse(readFileSync(new URL('../launch-readiness.json',import.meta.url),'utf8'));
 const incomplete=Object.entries(checks).filter(([,value])=>value!==true).map(([key])=>key);
 for(const key of ['PUBLIC_CONTACT_EMAIL','PUBLIC_TURNSTILE_SITE_KEY'])if(!environment[key])incomplete.push(key);
 if(!environment.SITE_URL?.startsWith('https://'))incomplete.push('SITE_URL');
 if(incomplete.length)throw new Error(`Production publication blocked: ${incomplete.join(', ')}. Complete the business facts and services; preview builds remain available.`);
}
