// Canonical is /investor.html; send the bare path there instead of serving a duplicate.
export const onRequest = ({ request }) => Response.redirect(new URL('/investor.html', request.url), 301);
