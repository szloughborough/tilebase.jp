declare global {interface Window {gtag?:(...args:unknown[])=>void;clarity?:((...args:unknown[])=>void)&{q?:unknown[][]};dataLayer?:Record<string,unknown>[]}}
export function setupAnalytics(){
 const banner=document.querySelector<HTMLElement>('[data-analytics-consent]');if(!banner||banner.dataset.enabled!=='true')return;
 const key='tilebase-analytics-v1';let started=false;
 const get=()=>{try{const stored=JSON.parse(localStorage.getItem(key)||'null');return stored&&Date.now()-stored.at<180*86400000?stored.choice:null;}catch{return null;}};
 const set=(choice:string)=>{try{localStorage.setItem(key,JSON.stringify({choice,at:Date.now()}));}catch{}};
 const load=(src:string)=>{const s=document.createElement('script');s.async=true;s.src=src;document.head.append(s);};
 const start=()=>{if(started)return;started=true;
  window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer!.push(arguments as unknown as Record<string,unknown>);};
  window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  window.gtag('js',new Date());window.gtag('config','G-HFRW01HH6E',{page_location:location.origin+location.pathname,allow_google_signals:false,allow_ad_personalization_signals:false});
  load('https://www.googletagmanager.com/gtag/js?id=G-HFRW01HH6E');
  const clarity=(...args:unknown[])=>{(clarity.q=clarity.q||[]).push(args);};clarity.q=[] as unknown[][];window.clarity=clarity;
  clarity('consentv2',{analytics_Storage:'granted',ad_Storage:'denied'});load('https://www.clarity.ms/tag/yviuathbm8');
 };
 banner.hidden=get()!==null;if(get()==='accepted')start();
 banner.querySelector('[data-analytics-accept]')?.addEventListener('click',()=>{set('accepted');banner.hidden=true;start();});
 banner.querySelector('[data-analytics-reject]')?.addEventListener('click',()=>{set('rejected');banner.hidden=true;if(started){window.gtag?.('consent','update',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});window.clarity?.('consentv2',{analytics_Storage:'denied',ad_Storage:'denied'});location.reload();}});
 document.querySelector('[data-analytics-settings]')?.addEventListener('click',()=>banner.hidden=false);
 window.addEventListener('tilebase:analytics',(e)=>{if(get()!=='accepted'||!started)return;const {name,inquiry_type}=(e as CustomEvent).detail||{};if(!['sample_request_start','quote_request_start','sample_request_submit','oem_inquiry_submit','wholesale_inquiry_submit','quote_request_submit'].includes(name))return;window.gtag?.('event',name,{inquiry_type});});
}
