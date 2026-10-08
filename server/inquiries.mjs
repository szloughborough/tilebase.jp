const types=new Set(['sample','quote','oem','wholesale','general']);
const categories=new Set(['wall','floor','both','undecided']);
const modelIds=new Set(["TB-W-001","TB-W-002","TB-W-003","TB-W-004","TB-W-005","TB-W-006","TB-F-001","TB-F-002","TB-F-003","TB-F-004","TB-F-005","TB-F-006","TB-F-007","TB-F-008","TB-F-009","TB-F-010","TB-F-011","TB-F-012","TB-F-013","TB-F-014","TB-F-015","TB-F-016","TB-F-017","TB-F-018","TB-F-019","TB-F-020","TB-F-021","TB-F-022","TB-F-023","TB-F-024","TB-F-025","TB-F-026","TB-F-027","TB-F-028","TB-F-029","TB-F-030","TB-F-031","TB-F-032","TB-F-033","TB-F-034","TB-F-035","TB-F-036","TB-F-037","TB-F-038","TB-F-039","TB-F-040","TB-F-041","TB-F-042","TB-F-043","TB-F-044","TB-F-045","TB-F-046","TB-F-047","TB-F-048","TB-F-049","TB-F-050","TB-F-051","TB-F-052","TB-F-053","TB-F-054","TB-F-055","TB-F-056","TB-F-057","TB-F-058","TB-F-059","TB-F-060","TB-F-061","TB-F-062","TB-F-063","TB-F-064","TB-F-065","TB-F-066","TB-F-067","TB-F-068","TB-F-069","TB-F-070","TB-F-071","TB-F-072","TB-F-073","TB-F-074","TB-F-075","TB-F-076","TB-F-077","TB-F-078","TB-F-079","TB-F-080","TB-F-081","TB-F-082","TB-F-083","TB-F-084","TB-F-085","TB-F-086","TB-F-087","TB-F-088","TB-F-089","TB-F-090","TB-F-091","TB-F-092","TB-F-093","TB-F-094","TB-F-095","TB-F-096","TB-F-097","TB-F-098","TB-F-099","TB-F-100","TB-F-101","TB-F-102","TB-F-103","TB-F-104","TB-F-105","TB-F-106","TB-F-107","TB-F-108","TB-F-109","TB-F-110","TB-F-111","TB-F-112","TB-F-113","TB-W-007","TB-W-008","TB-W-009","TB-W-010","TB-W-011","TB-W-012","TB-W-013","TB-W-014","TB-W-015","TB-W-016","TB-W-017","TB-W-018","TB-W-019","TB-W-020","TB-W-021","TB-W-022","TB-W-023","TB-W-024","TB-W-025","TB-W-026","TB-W-027","TB-W-028","TB-W-029","TB-W-030","TB-W-031","TB-W-032","TB-W-033","TB-W-034","TB-W-035","TB-W-036","TB-W-037","TB-W-038","TB-W-039","TB-W-040","TB-W-041","TB-W-042","TB-W-043","TB-W-044","TB-W-045","TB-W-046"]);
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const reply=(status,data)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const error=(status,message)=>reply(status,{message});
export function validateInquiry(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('入力内容をご確認ください。');
 const text=(name,max,required=false)=>{if(input[name]!==undefined&&typeof input[name]!=='string')throw new Error('入力形式をご確認ください。');const value=(input[name]||'').trim();if(value.length>max||(required&&!value))throw new Error('必須項目と文字数をご確認ください。');return value;};
 if(input.schemaVersion!==1||!uuid.test(input.submissionId||''))throw new Error('ページを再読み込みしてお試しください。');
 if(!types.has(input.inquiryType)||!categories.has(input.productCategory)||input.privacyAccepted!==true)throw new Error('ご相談の種類、製品カテゴリー、プライバシー確認をご確認ください。');
 const email=text('email',254,true);if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||/[\r\n]/.test(email))throw new Error('メールアドレスをご確認ください。');
 const message=text('message',4000,true);if(message.length<5)throw new Error('ご相談内容を5文字以上でご記入ください。');
 const selected=input.modelIds??[];if(!Array.isArray(selected)||selected.length>12||selected.some(id=>!modelIds.has(id)))throw new Error('品番をご確認ください。');
 const sourcePath=text('sourcePath',200);if(sourcePath&&(!sourcePath.startsWith('/')||sourcePath.startsWith('//')||sourcePath.includes('?')))throw new Error('ページ情報をご確認ください。');
 const utm={};for(const key of ['source','medium','campaign']){const v=input.utm?.[key]??'';if(typeof v!=='string'||v.length>200)throw new Error('入力形式をご確認ください。');utm[key]=v;}
 return {schemaVersion:1,submissionId:input.submissionId,inquiryType:input.inquiryType,company:text('company',160,true),contactName:text('contactName',100,true),email,productCategory:input.productCategory,modelIds:[...new Set(selected)],quantity:text('quantity',100),channel:text('channel',100),targetDate:text('targetDate',100),packaging:text('packaging',300),message,privacyAccepted:true,sourcePath,utm};
}
async function readBody(request){
 if(!request.headers.get('content-type')?.includes('application/json'))throw new Error('CONTENT_TYPE');
 if(Number(request.headers.get('content-length'))>20000)throw new Error('BODY_SIZE');
 const reader=request.body?.getReader();if(!reader)throw new Error('JSON');let length=0;const chunks=[];
 for(;;){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>20000){await reader.cancel();throw new Error('BODY_SIZE');}chunks.push(value);}
 const bytes=new Uint8Array(length);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 return JSON.parse(new TextDecoder().decode(bytes));
}
export async function sendNotification(env,inquiryId,payload,fetcher=fetch){
 const response=await fetcher('https://api.resend.com/emails',{method:'POST',headers:{'Authorization':`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`tilebase-${inquiryId}`},body:JSON.stringify({from:env.FROM_EMAIL,to:[env.INQUIRY_EMAIL],subject:`Tilebase inquiry ${inquiryId} (${payload.inquiryType})`,text:`Inquiry: ${inquiryId}\n\n${JSON.stringify(payload,null,2)}`})});
 if(!response.ok)throw new Error('NOTIFICATION_FAILED');
}
export async function handleInquiry(request,env,context={},dependencies={}){
 const fetcher=dependencies.fetch??fetch;
 if(request.method!=='POST')return reply(405,{message:'POSTをご利用ください。'});
 // Preview never accepts or transmits a visitor's personal information.
 if(env.SITE_STAGE!=='production')return error(503,'確認用サイトでは送信を受け付けていません。下書きを保存してください。');
 if(!env.DB||!env.SITE_URL||!env.TURNSTILE_SECRET_KEY||!env.RATE_LIMIT_SALT||!env.RESEND_API_KEY||!env.INQUIRY_EMAIL||!env.FROM_EMAIL)return error(503,'受付の準備中です。時間をおいてご確認ください。');
 let origin;try{origin=new URL(env.SITE_URL).origin;}catch{return error(503,'受付の準備中です。');}
 if(request.headers.get('origin')!==origin)return error(403,'送信元を確認できませんでした。');
 let input,payload;try{input=await readBody(request);if(input.websiteTrap)return error(400,'入力内容をご確認ください。');payload=validateInquiry(input);}catch(e){if(e.message==='BODY_SIZE')return error(413,'入力内容が長すぎます。');if(e.message==='CONTENT_TYPE')return error(415,'入力形式をご確認ください。');return error(400,e instanceof SyntaxError?'入力形式をご確認ください。':e.message);}
 try{
   const ip=request.headers.get('cf-connecting-ip')||'unknown';
   const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(`${env.RATE_LIMIT_SALT}:${ip}`));const client=Array.from(new Uint8Array(digest),v=>v.toString(16).padStart(2,'0')).join('');const window=Math.floor(Date.now()/600000);
   const limit=await env.DB.prepare('INSERT INTO inquiry_limits (client_hash, window, attempts) VALUES (?, ?, 1) ON CONFLICT(client_hash, window) DO UPDATE SET attempts = attempts + 1 RETURNING attempts').bind(client,window).first();
   if(limit.attempts>10)return error(429,'送信回数が多くなっています。しばらくしてからお試しください。');
   const token=typeof input.turnstileToken==='string'?input.turnstileToken:'';if(!token||token.length>2048)return error(400,'送信前の確認を完了してください。');
   const verification=await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret:env.TURNSTILE_SECRET_KEY,response:token,remoteip:ip})});
   if(!verification.ok)return error(503,'確認サービスに接続できませんでした。再度お試しください。');
   const result=await verification.json();if(!result.success||result.hostname!==new URL(origin).hostname||result.action!=='inquiry')return error(400,'送信前の確認をやり直してください。');
   const inquiryId=`TB-${crypto.randomUUID()}`;const now=new Date().toISOString();
   const inserted=await env.DB.prepare('INSERT INTO inquiries (inquiry_id, submission_id, payload, created_at, status, notification_status, notification_attempts, next_retry_at) VALUES (?, ?, ?, ?, ?, ?, 0, ?) ON CONFLICT(submission_id) DO NOTHING RETURNING inquiry_id').bind(inquiryId,payload.submissionId,JSON.stringify(payload),now,'new','pending',now).first();
   if(!inserted){const existing=await env.DB.prepare('SELECT inquiry_id FROM inquiries WHERE submission_id = ?').bind(payload.submissionId).first();return reply(200,{inquiryId:existing.inquiry_id,deduplicated:true});}
   const notify=async()=>{try{await sendNotification(env,inquiryId,payload,fetcher);await env.DB.prepare("UPDATE inquiries SET notification_status = 'sent', notification_attempts = 1 WHERE inquiry_id = ?").bind(inquiryId).run();}catch{await env.DB.prepare("UPDATE inquiries SET notification_status = 'failed', notification_attempts = 1, next_retry_at = ? WHERE inquiry_id = ?").bind(new Date(Date.now()+300000).toISOString(),inquiryId).run();}};
   if(context.waitUntil)context.waitUntil(notify());else await notify();
   return reply(201,{inquiryId});
 }catch{return error(503,'保存できませんでした。入力内容を残したまま、再度お試しください。');}
}
export async function retryNotifications(request,env,fetcher=fetch){
 if(request.method!=='POST')return error(405,'POST required');
 if(!env.RETRY_TOKEN||request.headers.get('Authorization')!==`Bearer ${env.RETRY_TOKEN}`)return error(401,'Unauthorized');
 if(env.SITE_STAGE!=='production'||!env.DB||!env.RESEND_API_KEY||!env.FROM_EMAIL||!env.INQUIRY_EMAIL)return error(503,'Not configured');
 try{
   const now=new Date().toISOString();const {results}=await env.DB.prepare("SELECT inquiry_id, payload, notification_attempts FROM inquiries WHERE notification_status IN ('pending','failed') AND notification_attempts < 5 AND next_retry_at <= ? LIMIT 20").bind(now).all();let sent=0;
   for(const row of results){try{await sendNotification(env,row.inquiry_id,JSON.parse(row.payload),fetcher);await env.DB.prepare("UPDATE inquiries SET notification_status = 'sent', notification_attempts = notification_attempts + 1 WHERE inquiry_id = ?").bind(row.inquiry_id).run();sent++;}catch{await env.DB.prepare("UPDATE inquiries SET notification_status = 'failed', notification_attempts = notification_attempts + 1, next_retry_at = ? WHERE inquiry_id = ?").bind(new Date(Date.now()+300000*2**row.notification_attempts).toISOString(),row.inquiry_id).run();}}
   await env.DB.prepare('DELETE FROM inquiry_limits WHERE window < ?').bind(Math.floor(Date.now()/600000)-6).run();
   return reply(200,{processed:results.length,sent});
 }catch{return error(503,'Retry unavailable');}
}
