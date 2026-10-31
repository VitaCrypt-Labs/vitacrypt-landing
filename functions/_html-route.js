// Pages auto-redirects /x.html → /x, but sitemap, canonicals and internal links use /x.html
// (Vercel served it 200). Serve the asset 200 at the .html path instead.
export function serveAt(path) {
  return async ({ request, env }) => {
    const url = new URL(request.url);
    url.pathname = path;
    const res = await env.ASSETS.fetch(new Request(url, request));
    if (!url.hostname.endsWith('.pages.dev')) return res;
    const out = new Response(res.body, res);
    out.headers.set('X-Robots-Tag', 'noindex');
    return out;
  };
}
