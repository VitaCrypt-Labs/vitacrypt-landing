// Canonical is /platform.html; send the bare path there instead of serving a duplicate.
export const onRequest = ({ request }) => Response.redirect(new URL('/platform.html', request.url), 301);
