// Pages auto-redirects /litepaper.html → /litepaper; sitemap + canonical use the .html URL, so serve it 200 as Vercel did.
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  url.pathname = '/litepaper';
  return env.ASSETS.fetch(new Request(url, request));
}
