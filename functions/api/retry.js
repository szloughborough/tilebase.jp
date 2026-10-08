import {retryNotifications} from '../../server/inquiries.mjs';
export async function onRequest(context){return retryNotifications(context.request,context.env);}
