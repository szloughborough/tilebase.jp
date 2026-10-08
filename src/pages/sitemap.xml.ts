import type { APIRoute } from 'astro';
import { pages } from '../data/pages';
import { articles } from '../data/articles';
import { site } from '../data/site';
export const GET:APIRoute=()=>{
 const urls=site.stage==='production'?['/',...pages.filter(p=>!p.noindex).map(p=>`/${p.slug}/`),'/blog/',...articles.map(a=>`/blog/${a.slug}/`)]:[];
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url=>`<url><loc>${new URL(url,site.origin).href}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
};
