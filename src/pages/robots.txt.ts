import type { APIRoute } from 'astro';
import {site} from '../data/site';
export const GET:APIRoute=()=>new Response(site.indexable?`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${site.origin}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n',{headers:{'Content-Type':'text/plain; charset=utf-8'}});
