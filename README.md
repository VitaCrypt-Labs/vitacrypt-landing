# VitaCrypt Landing

Landing page for **[VitaCrypt](https://vitacrypt.xyz)** — Personal Health Intelligence, private by design.

**Live:** [vitacrypt.xyz](https://vitacrypt.xyz)

## About VitaCrypt

VitaCrypt builds a unified health profile from environmental data, genetics, wearables, labs and self-reports, and answers questions against it.

Data is encrypted at rest under per-user keys. The master key is still server-side, so the platform is not blind today. A standalone blind-compute proof runs on Zama Concrete ML (client-held key, server computes on ciphertext alone); production blind compute is on the roadmap.

### What makes it different

| | Traditional Apps | VitaCrypt |
|---|---|---|
| Encryption | At rest, vendor-held keys | At rest, per-user keys |
| Personalization | Generic segments | Unified Profile, hyper-personalized |
| Data Ownership | Company owned | User-controlled |
| Intelligence | Siloed analysis | Real-time bio-environmental |

## Status of this repository

⚠️ This repository is the **June 2026 snapshot** of the landing page and no longer
matches the live site at vitacrypt.xyz. The HTML here still carries the old
present-tense FHE copy; the live site does not. Treat the site as the source of
truth until this repository is resynced.

## Stack

Static HTML · deployed on Cloudflare Pages (`./deploy-pages.sh`, form = `functions/api/waitlist.js`).

## Links

- Product: [vitacrypt.xyz](https://vitacrypt.xyz)
- Litepaper: [VitaCrypt-Litepaper](https://github.com/VitaCrypt-Labs/VitaCrypt-Litepaper)
- Join waitlist: see the site
