#!/usr/bin/env bash
# Deploy static site + functions/ to Cloudflare Pages project vitacrypt-landing.
# Usage: CLOUDFLARE_API_TOKEN=... ./deploy-pages.sh [branch]   (branch=main → production)
set -euo pipefail
cd "$(dirname "$0")"
OUT=$(mktemp -d)
trap 'rm -rf "$OUT"' EXIT
# Same file set Vercel served: repo minus .vercelignore entries, functions, configs.
rsync -a --exclude-from=.vercelignore --exclude='.*' --exclude=api --exclude=functions \
  --exclude=vercel.json --exclude=deploy-pages.sh "./" "$OUT/"
CLOUDFLARE_ACCOUNT_ID=a7e9c308efff0b6c92c2b4a3fff30cf3 \
  npx --yes wrangler@4.144.0 pages deploy "$OUT" --project-name vitacrypt-landing --branch "${1:-preview}" --commit-dirty=true
