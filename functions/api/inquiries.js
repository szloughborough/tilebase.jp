import {handleInquiry} from '../../server/inquiries.mjs';
export async function onRequest(context){return handleInquiry(context.request,context.env,{waitUntil:context.waitUntil.bind(context)});}
