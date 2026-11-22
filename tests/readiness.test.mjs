import {test} from 'node:test';
import assert from 'node:assert/strict';
import {verifyProductionReadiness} from '../scripts/production-guard.mjs';
test('preview builds are allowed without pretending services are configured',()=>{assert.doesNotThrow(()=>verifyProductionReadiness({PUBLIC_SITE_STAGE:'preview'}));});
const production={PUBLIC_SITE_STAGE:'production',SITE_URL:'https://tilebase.jp',PUBLIC_CONTACT_EMAIL:'sale@tilebase.jp',PUBLIC_TURNSTILE_SITE_KEY:'test-key'};
test('production remains blocked when any required readiness evidence is missing',()=>{
 for(const flag of ['companyDetailsVerified','productFactsVerified','assetUsageApproved','commercialTermsApproved','privacyPolicyFinalized','domainConfigured','inquiryServiceVerified'])assert.throws(()=>verifyProductionReadiness(production,{[flag]:false}),new RegExp(flag));
});
test('verified production still requires the frontend contact, domain and Turnstile configuration',()=>{
 assert.doesNotThrow(()=>verifyProductionReadiness(production,{inquiryServiceVerified:true}));
 for(const flag of ['PUBLIC_CONTACT_EMAIL','PUBLIC_TURNSTILE_SITE_KEY','SITE_URL'])assert.throws(()=>verifyProductionReadiness({...production,[flag]:''},{inquiryServiceVerified:true}),new RegExp(flag));
});
