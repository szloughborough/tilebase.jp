import data from './pillars.json';
export type PillarSection={title:string;text:string;columns?:string[];rows?:string[][];catalog?:boolean;links:[string,string][]};
export type Pillar={slug:string;label:string;title:string;description:string;intro:string;family?:'wall'|'floor';cta:[string,string];sections:PillarSection[]};
export const pillars=data as unknown as Record<string,Pillar>;
export const pillarForSlug=(slug:string)=>Object.values(pillars).find(p=>p.slug===slug);
const owners:Record<string,string>={
 'products/wall-tiles/kitchen':'wall','products/floor-tiles/peel-and-stick':'floor','products/floor-tiles/wood-look':'floor','products/floor-tiles/stone-look':'floor',
 'wholesale/samples':'wholesale','wholesale/moq':'wholesale','wholesale/lead-time':'wholesale','oem/private-label':'oem','oem/japanese-packaging':'oem',
 'blog/product-selection/what-is-tile-sticker':'wall','blog/product-selection/what-is-floor-tile':'floor','blog/installation-comparison/lay-only-vs-peel-and-stick':'floor','blog/technical/floor-tile-peeling-causes':'floor','blog/product-selection/floor-tile-20-vs-30':'floor',
 'blog/sourcing-oem/how-to-evaluate-floor-tile-suppliers':'wholesale','blog/sourcing-oem/import-purchasing-checklist':'wholesale','blog/sourcing-oem/tile-sample-evaluation':'wholesale',
 'blog/sourcing-oem/floor-tile-oem-process':'oem','blog/sourcing-oem/tile-sticker-oem-checklist':'oem','blog/sourcing-oem/ai-cmyk-artwork-guide':'oem'
};
export const topicOwner=(slug:string)=>pillars[owners[slug]];

