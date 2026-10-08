import {test} from 'node:test';
import assert from 'node:assert/strict';
import {verifyProductionReadiness} from '../scripts/production-guard.mjs';
test('preview builds are allowed without pretending services are configured',()=>{assert.doesNotThrow(()=>verifyProductionReadiness({PUBLIC_SITE_STAGE:'preview'}));});
test('production from any resolved environment is blocked until business facts are approved',()=>{assert.throws(()=>verifyProductionReadiness({PUBLIC_SITE_STAGE:'production',SITE_URL:'https://tilebase.jp',PUBLIC_CONTACT_EMAIL:'sale@tilebase.jp',PUBLIC_TURNSTILE_SITE_KEY:'test-key'}),/companyDetailsVerified/);});
