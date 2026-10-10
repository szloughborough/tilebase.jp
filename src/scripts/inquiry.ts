type Turnstile = { render:(element:string,options:Record<string,unknown>)=>string; reset:(id:string)=>void };
declare global { interface Window { turnstile?:Turnstile; tilebaseTurnstileReady?:()=>void; dataLayer?:Record<string,unknown>[] } }
export function setupInquiryForm() {
 const form=document.querySelector<HTMLFormElement>('.inquiry-form');if(!form)return;
 const params=new URLSearchParams(location.search);
 const model=form.elements.namedItem('modelId') as HTMLSelectElement;
 const inquiry=form.elements.namedItem('inquiryType') as HTMLSelectElement;
 const category=form.elements.namedItem('productCategory') as HTMLSelectElement;
 if(params.get('model')&&Array.from(model.options).some(o=>o.value===params.get('model'))){model.value=params.get('model')!;category.value=model.value.startsWith('TB-W')?'wall':'floor';}
 if(['oem','wholesale','quote','sample','general'].includes(params.get('type')||''))inquiry.value=params.get('type')!;
 const preview=form.dataset.preview==='true';
 const status=form.querySelector<HTMLElement>('.form-status')!;
 const button=form.querySelector<HTMLButtonElement>('button[type=submit]')!;
 let submissionId=crypto.randomUUID();let token='';let widget='';let started=false;
 const event=(name:string)=>{window.dispatchEvent(new CustomEvent('tilebase:analytics',{detail:{name,inquiry_type:inquiry.value}}));};
 form.addEventListener('focusin',()=>{if(!started){started=true;event(inquiry.value==='sample'?'sample_request_start':'quote_request_start');}});
 const show=(text:string,error=false)=>{status.hidden=false;status.textContent=text;status.classList.toggle('error',error);};
 if(!preview&&form.dataset.turnstileKey){
   window.tilebaseTurnstileReady=()=>{widget=window.turnstile!.render('#turnstile-widget',{sitekey:form.dataset.turnstileKey,action:'inquiry',callback:(value:string)=>token=value,'expired-callback':()=>token='','error-callback':()=>{token='';show('確認を読み込めませんでした。再読み込みしてください。',true);}});};
   const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?onload=tilebaseTurnstileReady&render=explicit';script.async=true;document.head.append(script);
 }
 form.addEventListener('submit',async e=>{
   e.preventDefault();if(!form.reportValidity())return;
   const fields=new FormData(form);
   const get=(key:string)=>String(fields.get(key)||'').trim();
   const payload={schemaVersion:1,submissionId,inquiryType:get('inquiryType'),company:get('company'),contactName:get('contactName'),email:get('email'),productCategory:get('productCategory'),modelIds:get('modelId')?[get('modelId')]:[],quantity:get('quantity'),channel:get('channel'),targetDate:get('targetDate'),packaging:get('packaging'),message:get('message'),privacyAccepted:fields.has('privacyAccepted'),websiteTrap:get('websiteTrap'),sourcePath:location.pathname,utm:{source:params.get('utm_source')||'',medium:params.get('utm_medium')||'',campaign:params.get('utm_campaign')||''}};
   if(preview){
     const blob=new Blob([JSON.stringify({status:'draft_not_sent',...payload},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='tilebase-inquiry-draft.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
     show('下書きファイルを端末に保存しました。Tilebaseへの送信は行われていません。');return;
   }
   if(!token){show('送信前の確認を完了してください。',true);return;}
   button.disabled=true;button.textContent='送信中…';
   try {
     const response=await fetch('/api/inquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,turnstileToken:token})});
     const result=await response.json();
     if(!response.ok)throw new Error(result.message||'送信できませんでした。時間をおいて再度お試しください。');
     show(`ご相談を受け付けました。受付番号：${result.inquiryId}`);event(inquiry.value==='sample'?'sample_request_submit':inquiry.value==='oem'?'oem_inquiry_submit':inquiry.value==='wholesale'?'wholesale_inquiry_submit':'quote_request_submit');form.reset();submissionId=crypto.randomUUID();started=false;
   }catch(error){show(error instanceof Error?error.message:'送信に失敗しました。再度お試しください。',true);}
   finally{button.disabled=false;button.textContent='相談内容を送信する';token='';if(widget)window.turnstile?.reset(widget);}
 });
}

