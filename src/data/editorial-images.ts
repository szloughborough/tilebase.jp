export type EditorialImage = {src:string;alt:string;caption:string};
const scene=(id:string,caption:string):EditorialImage=>({src:`/images/${id.toLowerCase()}-gallery-1.webp`,alt:caption,caption:`${caption}。掲載画像は使用イメージです。適合する下地・用途は品番ごとに確認してください。`});
const detail=(id:string,caption:string):EditorialImage=>({src:`/images/${id.toLowerCase()}-main.webp`,alt:caption,caption:`${caption}。色・質感は実物サンプルで確認してください。`});
export const articleVisuals=[
 {cover:scene('TB-F-039','木目柄のフロアデザインを組み合わせた空間'),images:[detail('TB-F-039','木目柄の形状と柄の向き'),detail('TB-F-010','ストーン調のチェック柄')]},
 {cover:scene('TB-W-001','チェック柄を用いた壁面のデザイン'),images:[detail('TB-W-001','ウォールデザインの配色と形状'),detail('TB-W-003','装飾柄のウォールデザイン')]},
 {cover:scene('TB-F-026','柄の方向とつながりを確認するフロアの使用イメージ'),images:[detail('TB-F-026','方向性のあるフロア柄'),detail('TB-F-009','複数枚で検討するチェック柄')]},
 {cover:scene('TB-F-011','下地と使用環境を確認して選ぶフロアデザイン'),images:[detail('TB-F-011','表面と端部を実物で確認するためのデザイン'),detail('TB-F-012','配列と合わせ目を確認する柄')]},
 {cover:scene('TB-F-051','シリーズ構成を検討するストーン調の空間'),images:[detail('TB-F-051','ストーン調の候補デザイン'),detail('TB-F-044','色展開を比較する候補デザイン')]},
 {cover:scene('TB-F-028','植物柄のフロアを使った商品企画のイメージ'),images:[detail('TB-F-027','植物柄の配色候補'),detail('TB-F-028','同系統の色違いを比較')]},
 {cover:scene('TB-W-037','ウォールの配色と空間を検討する商品企画'),images:[detail('TB-W-037','ウォールの表面と配色の候補'),detail('TB-W-038','シリーズの色展開を比較')]},
 {cover:scene('TB-F-095','販売する空間を考えながら選ぶ装飾柄のフロア'),images:[detail('TB-F-095','装飾柄の商品候補'),detail('TB-F-096','関連するデザインの比較')]},
];
export const collectionVisuals:Record<string,EditorialImage>={
 products:scene('TB-W-001','壁と床の商品選定'),designs:scene('TB-F-095','配色と柄から考えるデザイン選定'),
 oem:scene('TB-W-037','ブランドの配色と空間を考える'),'oem/private-label':scene('TB-F-028','シリーズを企画するための使用イメージ'),
 'oem/japanese-packaging':detail('TB-W-003','包装と販売単位を検討するデザイン'),
 wholesale:scene('TB-F-051','用途と供給条件を確認するフロア商品'), 'wholesale/samples':detail('TB-W-001','実物で比較するデザイン候補'),
 specifications:detail('TB-F-010','寸法と構造を確認するフロアデザイン'),'quality-control':detail('TB-W-003','外観と表面を確認するウォールデザイン'),
 resources:scene('TB-F-039','商品選定と調達に役立つガイド'),
 'solutions/ecommerce-sellers':scene('TB-W-037','商品ページと空間イメージの検討'),
 'solutions/distributors':scene('TB-F-051','用途に合わせたフロアの商品選定'),
 'solutions/private-label-brands':scene('TB-F-028','ブランドのシリーズ企画'),
};
