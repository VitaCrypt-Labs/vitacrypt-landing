// Parity with vercel.json: /index.html → / as 301 (Pages default would be 308).
export const onRequest = ({ request }) => Response.redirect(new URL('/', request.url), 301);
