import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source=ts.transpileModule(readFileSync('src/scripts/analytics.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
function boot(enabled=true,saved=null){
 const scripts=[],events={},buttons={},storage=new Map();let reloads=0;
 if(saved)storage.set('tilebase-analytics-v1',JSON.stringify({choice:saved,at:Date.now()}));
 for(const name of ['[data-analytics-accept]','[data-analytics-reject]','[data-analytics-settings]'])buttons[name]={addEventListener:(event,fn)=>buttons[name][event]=fn};
 const banner={dataset:{enabled:String(enabled)},hidden:true,querySelector:s=>buttons[s]};
 const document={querySelector:s=>s==='[data-analytics-consent]'?banner:buttons[s],createElement:()=>({}),head:{append:s=>scripts.push(s.src)}};
 const window={addEventListener:(name,fn)=>events[name]=fn};
 const context={exports:{},window,document,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},location:{origin:'https://tilebase.jp',pathname:'/quote/',reload:()=>reloads++},Date,JSON};
 vm.runInNewContext(source,context);context.exports.setupAnalytics();return {scripts,buttons,window,events,banner,reloads:()=>reloads};
}
 test('preview loads no analytics even with saved consent',()=>{const x=boot(false,'accepted');assert.equal(x.scripts.length,0);});
 test('no choice and rejection load no third-party scripts',()=>{const x=boot();assert.equal(x.scripts.length,0);x.buttons['[data-analytics-reject]'].click();assert.equal(x.scripts.length,0);assert.equal(x.banner.hidden,true);});
 test('accept loads each tag once and sends only approved inquiry fields',()=>{const x=boot();x.buttons['[data-analytics-accept]'].click();x.buttons['[data-analytics-accept]'].click();assert.equal(x.scripts.length,2);assert.ok(x.scripts.some(s=>s.includes('G-HFRW01HH6E')));assert.ok(x.scripts.some(s=>s.endsWith('yviuathbm8')));x.events['tilebase:analytics']({detail:{name:'quote_request_submit',inquiry_type:'quote',email:'private@example.com'}});const event=x.window.dataLayer.at(-1);assert.equal(event[0],'event');assert.equal(event[2].email,undefined);});
 test('revocation denies analytics and reloads',()=>{const x=boot(true,'accepted');x.buttons['[data-analytics-reject]'].click();assert.equal(x.reloads(),1);assert.equal(x.window.dataLayer.at(-1)[2].analytics_storage,'denied');assert.equal(x.window.clarity.q.at(-1)[1].analytics_Storage,'denied');});
