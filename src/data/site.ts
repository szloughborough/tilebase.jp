export const site = {
  name: 'Tilebase',
  company: 'Shenzhen Lafubao Trading Co,.Ltd',
  origin: import.meta.env.SITE_URL || 'https://tilebase.jp',
  stage: import.meta.env.PUBLIC_SITE_STAGE || 'preview',
  email: import.meta.env.PUBLIC_CONTACT_EMAIL || 'sale@tilebase.jp',
  address: 'Room B021,Fang Da Da Sha,Nanshan District, Shenzhen, Guangdong, PR China',
  turnstile: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '',
};
export const navigation = [
  { label: '製品', href: '/products/' },
  { label: '用途・市場', href: '/solutions/ecommerce-sellers/' },
  { label: 'OEM・PB', href: '/oem/' },
  { label: '法人・仕入れ', href: '/wholesale/' },
  { label: '品質・仕様', href: '/specifications/' },
  { label: 'ブログ・ガイド', href: '/blog/' },
];
import expanded from './expanded-products.json';
import galleries from './product-galleries.json';
export type Product = { id: string; family: 'wall' | 'floor'; name: string; style: string; color: string; image: string; scene: string; description: string; gallery:string[] };
const catalog: [string, 'wall'|'floor', string, string, string, string][] = [
  ['TB-W-001','wall','オリーブ チェック','チェック','オリーブ・ホワイト','深いオリーブと白を組み合わせた、スクエア柄のウォールデザイン。'],
  ['TB-W-002','wall','ワイン チェック','チェック','ワイン・ホワイト','濃いワイン色をアクセントにした、落ち着いたスクエア柄。'],
  ['TB-W-003','wall','フォレスト オーナメント','装飾柄','グリーン・ゴールド調','線と模様を組み合わせた、装飾的な縦長タイル柄。'],
  ['TB-W-004','wall','ミスト オーナメント','装飾柄','ライトグレー・ゴールド調','淡いグレーを基調に、繊細な模様を重ねたデザイン。'],
  ['TB-W-005','wall','ディープ グリーン','ストーン調','ダークグリーン','深い緑の濃淡で構成された、縦長のストーン調デザイン。'],
  ['TB-W-006','wall','セージ グリーン','ストーン調','セージ・ダークグリーン','やわらかな緑の濃淡を組み合わせたストーン調デザイン。'],
  ['TB-F-001','floor','グリーン ジオメトリー','幾何学柄','グリーン・ホワイト','緑と白のコントラストでつくる、幾何学的なフロア柄。'],
  ['TB-F-002','floor','ブルー ジオメトリー','幾何学柄','ブルー・ホワイト','青と白の幾何学柄。商品シリーズの色展開を検討する際の参考に。'],
  ['TB-F-003','floor','ボタニカル リーフ','植物柄','ブルー・グリーン','白地に小さな葉を配した、軽やかなボタニカル柄。'],
  ['TB-F-004','floor','クラシック ボタニカル','植物柄','グリーン・ホワイト','植物のモチーフと曲線を組み合わせたクラシックな柄。'],
  ['TB-F-005','floor','フラワー ガーデン','植物柄','マルチカラー','花と葉を配置した、彩りのあるフロアデザイン。'],
  ['TB-F-006','floor','ライト セージ','幾何学柄','セージ・ホワイト','淡いセージ色と白で構成された、穏やかな幾何学柄。'],
];
export const products: Product[] = [...catalog.map(([id,family,name,style,color,description]) => ({ id,family,name,style,color,description,image:`/images/${id.toLowerCase()}-main.webp`,scene:`/images/${id.toLowerCase()}-scene.webp` })),...expanded].map(p=>({...p,family:p.family as 'wall'|'floor',gallery:(galleries as Record<string,string[]>)[p.id]||[p.image]}));
export const familyLabels = { wall: 'ウォールタイル', floor: 'フロアタイル' };
