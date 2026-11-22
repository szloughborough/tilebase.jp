// Retire the temporary verification URL, including any stale static asset.
export async function onRequest() {
  return new Response('確認用ページの公開は終了しました。', {
    status:410,
    headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'},
  });
}
