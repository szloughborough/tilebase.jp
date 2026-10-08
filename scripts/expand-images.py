import json, pathlib, math
from PIL import Image, ImageOps, ImageDraw
root=pathlib.Path(__file__).resolve().parents[1]
files=[pathlib.Path(p) for p in json.loads((root/'private/new-image-inventory.json').read_text(encoding='utf-8-sig'))]
for start in range(0,len(files),40):
    batch=files[start:start+40]
    sheet=Image.new('RGB',(1200,math.ceil(len(batch)/8)*170),'#eeeeee'); draw=ImageDraw.Draw(sheet)
    for i,p in enumerate(batch):
        im=Image.open(p).convert('RGB'); im.thumbnail((146,145)); x=(i%8)*150;y=(i//8)*170
        sheet.paste(im,(x+(150-im.width)//2,y));draw.text((x+4,y+146),p.stem,fill='black')
    sheet.save(root/f'qa/catalog-review-{start//40+1}.jpg')
print(len(files))
existing=json.loads((root/'private/asset-map.json').read_text(encoding='utf-8-sig'))
known={p['sourceModel'].lower():p['id'] for p in existing}
counts={'wall':6,'floor':6}; extra=[]; scenes=[]
for p in files:
    model=p.stem.removesuffix('-main'); family='wall' if model.startswith('mt') else 'floor'
    pid=known.get(model)
    if not pid:
        counts[family]+=1; pid=f"TB-{'W' if family=='wall' else 'F'}-{counts[family]:03}"
        extra.append({'id':pid,'family':family,'name':f"{'ウォール' if family=='wall' else 'フロア'} デザイン {pid.split('-')[-1]}",'style':'タイル柄','color':'画像でご確認ください','description':'商品シリーズの柄・配色を検討するためのデザイン。実物サンプルで色と質感をご確認ください。','image':f'/images/{pid.lower()}-main.webp','scene':f'/images/{pid.lower()}-main.webp'})
        existing.append({'id':pid,'sourceModel':model.upper(),'source':str(p),'status':'needs_confirmation'})
    for source,target in [(p,root/f'public/images/{pid.lower()}-main.webp')]:
        im=Image.open(source).convert('RGB'); im=ImageOps.pad(im,(720,720),color='white'); im.save(target,'WEBP',quality=84,method=4)
    candidates=sorted(p.parent.glob('*-scene*.webp'))[:2]
    gallery=[f'/images/{pid.lower()}-main.webp']
    for i,s in enumerate(candidates):
        target=root/f'public/images/{pid.lower()}-gallery-{i+1}.webp'
        im=Image.open(s).convert('RGB'); im.thumbnail((1200,1200)); im.save(target,'WEBP',quality=82,method=4)
        gallery.append('/images/'+target.name); scenes.append((pid,s))
    for item in extra:
        if item['id']==pid:item['gallery']=gallery;item['scene']=gallery[-1]
    known[model]=pid
(root/'src/data/expanded-products.json').write_text(json.dumps(extra,ensure_ascii=False,indent=2),encoding='utf-8')
(root/'src/data/product-galleries.json').write_text(json.dumps({known[p.stem.removesuffix('-main')]:['/images/'+known[p.stem.removesuffix('-main')].lower()+'-main.webp']+['/images/'+known[p.stem.removesuffix('-main')].lower()+f'-gallery-{i+1}.webp' for i,s in enumerate(sorted(p.parent.glob('*-scene*.webp'))[:2])] for p in files},ensure_ascii=False),encoding='utf-8')
(root/'private/asset-map.json').write_text(json.dumps(existing,ensure_ascii=False,indent=2),encoding='utf-8')
for start in range(0,len(scenes),60):
    batch=scenes[start:start+60]; sheet=Image.new('RGB',(1500,math.ceil(len(batch)/10)*125),'white'); draw=ImageDraw.Draw(sheet)
    for i,(pid,p) in enumerate(batch):
        im=Image.open(p).convert('RGB');im.thumbnail((145,105));x=i%10*150;y=i//10*125;sheet.paste(im,(x,y));draw.text((x,y+106),f'{pid} {i%2+1}',fill='black')
    sheet.save(root/f'qa/scene-review-{start//60+1}.jpg')
print('new designs',len(extra),'scene images',len(scenes))
