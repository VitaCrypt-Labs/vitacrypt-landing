#!/usr/bin/env bash
# Rebuild media/vitacrypt-deck.pdf from docs/deck/deck.html (needs Google Chrome and network for Google Fonts).
set -euo pipefail
cd "$(dirname "$0")"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
"$CHROME" --headless=new --disable-gpu --user-data-dir="$(mktemp -d)" --no-first-run --no-pdf-header-footer --virtual-time-budget=15000 \
  --print-to-pdf="../../media/vitacrypt-deck.pdf" "file://$PWD/deck.html"
