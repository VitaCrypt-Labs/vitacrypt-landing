// Litepaper taken down 16 Nov 2026 (FHE-era brief); send it to the Lab Agent page.
export const onRequest = ({ request }) => Response.redirect(new URL('/agent', request.url), 301);
