import {loadEnv} from 'vite';
import {spawnSync} from 'node:child_process';
import {verifyProductionReadiness} from './production-guard.mjs';
const env={...loadEnv('production',process.cwd(),''),...process.env};
Object.assign(env,{
 SITE_URL:env.SITE_URL||'https://tilebase.jp',
 PUBLIC_CONTACT_EMAIL:env.PUBLIC_CONTACT_EMAIL||'sale@tilebase.jp',
 PUBLIC_SITE_STAGE:'production',
 PUBLIC_SITE_INDEXABLE:'true',
});
verifyProductionReadiness(env);
const result=spawnSync(process.execPath,['node_modules/astro/astro.js','build'],{env,stdio:'inherit'});
if(result.error)throw result.error;
process.exitCode=result.status??1;
