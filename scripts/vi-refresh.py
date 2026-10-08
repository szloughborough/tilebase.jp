from pathlib import Path
r=Path(__file__).resolve().parents[1]
p=r/'src/layouts/Base.astro';s=p.read_text(encoding='utf-8');start=s.index('<a href="/" class="brand" aria-label=');end=s.index('</a>',start)+4;s=s[:start]+'<a href="/" class="brand" aria-label="Tilebase ホーム"><img src="/logo.svg" alt="tilebase.jp" width="290" height="58" /></a>'+s[end:];s=s.replace('<a href="/" class="brand">Tilebase<span class="brand-dot">.</span></a>','<a href="/" class="brand"><img src="/logo.svg" alt="tilebase.jp" width="290" height="58" /></a>');p.write_text(s,encoding='utf-8')
p=r/'src/pages/index.astro';s=p.read_text(encoding='utf-8');start=s.index('  <section class="home-hero');end=s.index('  <div class="intro-strip',start)
s=s[:start]+'''  <section class="vi-hero"><div class="container vi-hero-inner"><div class="vi-hero-copy"><p class="eyebrow">WALL & FLOOR / FOR YOUR BUSINESS</p><h1>空間をつくる素材で、<br />ビジネスの可能性を広げる。</h1><p class="vi-hero-description">壁と床に、新しい選択を。<br />ウォール・フロアタイルの卸売、OEM・PB、法人調達。</p><div class="button-row"><a href="/products/" class="button">製品一覧 <span aria-hidden="true">→</span></a><a href="/quote/" class="button button-outline">見積について相談 <span aria-hidden="true">→</span></a></div><p class="vi-hero-foot">DESIGN · MATERIAL · SOURCING</p></div><div class="vi-hero-media"><img class="vi-space" src="/images/tb-f-046-gallery-1.webp" alt="ストーン調フロアデザインの室内展示イメージ" width="1200" height="1200" fetchpriority="high" /><div class="vi-materials"><img src="/images/tb-f-039-main.webp" alt="木目柄のデザイン候補" width="720" height="720" /><img src="/images/tb-f-046-main.webp" alt="ストーン調のデザイン候補" width="720" height="720" /><span>FOR<br />BETTER<br />SPACES</span></div><p class="vi-caption">使用イメージ。仕様・適合条件は品番ごとに確認。</p></div></div></section>
  <section class="container vi-paths" aria-label="法人調達のメニュー">{[
    ['/products/','製品一覧','ウォール・フロアのデザイン','/images/tb-f-046-main.webp'],
    ['/oem/','OEM・プライベートブランド','デザインから商品企画へ','/images/tb-w-037-gallery-1.webp'],
    ['/wholesale/','卸売・法人仕入れ','数量・包装・供給条件を確認','/images/tb-f-051-gallery-1.webp'],
    ['/wholesale/samples/','サンプル相談','色・質感を実物で確かめる','/images/tb-f-039-main.webp'],
    ['/specifications/','仕様・資料','寸法・構造・包装を確認','/images/tb-w-003-main.webp'],
  ].map(([href,title,copy,image])=><a class="vi-path" href={href}><img src={image} alt="" width="720" height="720" loading="lazy" /><div><h2>{title}</h2><p>{copy}</p><span aria-hidden="true">→</span></div></a>)}</section>
'''.replace('\n+','\n')+s[end:]
s=s.replace('/images/tb-w-003-scene.webp','/images/tb-w-037-gallery-1.webp').replace('/images/tb-f-001-scene.webp','/images/tb-f-039-gallery-1.webp').replace('装飾柄のウォールタイル展示イメージ','淡い色のウォールタイル展示イメージ').replace('グリーンの幾何学柄フロアタイル展示イメージ','木目柄フロアタイル展示イメージ')
p.write_text(s,encoding='utf-8')
