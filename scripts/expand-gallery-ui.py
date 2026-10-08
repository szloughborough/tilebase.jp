from pathlib import Path
p=Path(__file__).resolve().parents[1]/'src/components/Products.astro'
s=p.read_text(encoding='utf-8')
s=s.replace('<div class="product-grid">','''{filters&&<label class="catalog-search">品番・デザイン名で検索<input type="search" data-catalog-search placeholder="例：TB-F-025、グリーン" /></label>}
  <div class="product-grid">''')
s=s.replace('<div class="dialog-grid"><img src={p.image} alt={`${p.name}の製品画像`} width="720" height="720" loading="lazy" />','''<div class="dialog-grid"><div class="product-gallery"><img data-gallery-main src={p.image} alt={`${p.name}の製品画像`} width="720" height="720" loading="lazy" />{p.gallery.length>1&&<div class="gallery-thumbs" role="group" aria-label="製品画像を切り替える">{p.gallery.map((src,i)=><button data-gallery-src={src} data-gallery-alt={`${p.name} ${i===0?'製品画像':`使用イメージ ${i}`}`} aria-label={i===0?'製品画像':`使用イメージ ${i}`} aria-pressed={i===0?'true':'false'}><img src={src} alt="" width="100" height="100" loading="lazy" /></button>)}</div>}</div>''')
s=s.replace('  <p class="catalog-note">','''  {filters&&<div class="catalog-pagination"><p data-page-status aria-live="polite"></p><button class="button button-outline" data-load-more hidden>さらに24件を見る</button></div>}
  <p class="catalog-note">''')
start=s.index("    catalog.querySelectorAll<HTMLButtonElement>('[data-filter]')")
end=s.index("    catalog.querySelectorAll<HTMLButtonElement>('[data-open-product]')",start)
s=s[:start]+'''    const cards=Array.from(catalog.querySelectorAll<HTMLElement>('.product-card'));
    const search=catalog.querySelector<HTMLInputElement>('[data-catalog-search]');
    const more=catalog.querySelector<HTMLButtonElement>('[data-load-more]');
    let filter='all',visible=24;
    const update=()=>{
      const query=search?.value.trim().toLowerCase()||'';
      const matches=cards.filter(card=>(filter==='all'||card.dataset.family===filter)&&(!query||card.textContent?.toLowerCase().includes(query)));
      cards.forEach(card=>card.hidden=!matches.slice(0,more?visible:cards.length).includes(card));
      const count=catalog.querySelector('[data-count]');if(count)count.textContent=String(matches.length);
      const status=catalog.querySelector('[data-page-status]');if(status)status.textContent=`${matches.length}件中 ${Math.min(visible,matches.length)}件を表示`;
      if(more)more.hidden=visible>=matches.length;
    };
    catalog.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
      filter=button.dataset.filter||'all';visible=24;
      catalog.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});update();
    }));
    search?.addEventListener('input',()=>{visible=24;update();});
    more?.addEventListener('click',()=>{visible+=24;update();});update();
''' +s[end:]
s=s.replace("    dialog.querySelector('[data-close-dialog]')",'''    dialog.querySelectorAll<HTMLButtonElement>('[data-gallery-src]').forEach(button=>button.addEventListener('click',()=>{
      const image=dialog.querySelector<HTMLImageElement>('[data-gallery-main]');if(image){image.src=button.dataset.gallerySrc||'';image.alt=button.dataset.galleryAlt||'';}
      dialog.querySelectorAll('[data-gallery-src]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    }));
    dialog.querySelector('[data-close-dialog]')''')
p.write_text(s,encoding='utf-8')
