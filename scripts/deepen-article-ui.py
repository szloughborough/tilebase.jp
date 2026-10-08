from pathlib import Path
r=Path(__file__).resolve().parents[1]
p=r/'src/pages/blog/[...slug].astro';s=p.read_text(encoding='utf-8')
s=s.replace('const visual=','const bodyChars=JSON.stringify(article.sections).length;\nconst readingMinutes=Math.max(3,Math.ceil(bodyChars/500));\nconst visual=')
s=s.replace('<p class="article-byline">','<p class="article-reading">約{readingMinutes}分で読めます · 製品仕様は品番別に確認</p><p class="article-byline">')
s=s.replace('<p class="article-summary">{article.summary}</p>','<div class="article-answer"><p class="eyebrow">まず押さえるポイント</p><p class="article-summary">{article.summary}</p></div>')
s=s.replace('</ol></nav>','{article.faq&&<li><a href="#article-faq">よくある質問</a></li>}</ol></nav>')
s=s.replace('<section class="related-section">','''{article.faq&&<section class="faq-section" id="article-faq"><h2>よくある質問</h2>{article.faq.map(([q,a])=><details open><summary>{q}</summary><p>{a}</p></details>)}</section>}<section class="related-section">''')
p.write_text(s,encoding='utf-8')
