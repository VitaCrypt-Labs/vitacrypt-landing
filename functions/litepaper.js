// Canonical is /litepaper.html; send the bare path there instead of serving a duplicate.
export const onRequest = ({ request }) => Response.redirect(new URL('/litepaper.html', request.url), 301);
