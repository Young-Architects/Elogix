#!/usr/bin/env bash
#
# Pull, build and reload the production site on the VPS.
#
#   ssh deploy@187.127.188.237
#   cd ~/expendesk && ./deploy/deploy.sh
#
# Deliberately builds BEFORE touching the running process: `next build` writes
# to .next/ while the old server keeps serving from the previous build, so a
# compile error leaves production untouched instead of down.

set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Pulling"
git pull --ff-only

# `npm ci` not `npm install`: it installs exactly what package-lock.json
# pins and fails loudly on a mismatch, so the server builds the same tree
# that was tested locally.
echo "==> Installing"
npm ci

# .env.production must already exist and be complete. Every NEXT_PUBLIC_*
# value is inlined into the bundle here and cannot be changed by restarting.
if [ ! -f .env.production ]; then
  echo "ERROR: .env.production is missing." >&2
  echo "Copy .env.production.example and fill it in before deploying." >&2
  exit 1
fi

echo "==> Building"
npm run build

echo "==> Reloading"
# `pm2 reload` restarts with zero downtime; `restart` would drop in-flight
# requests.
pm2 reload expendesk --update-env

echo "==> Done. Verifying..."
sleep 3
code=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/ || echo 000)
if [ "$code" = "200" ]; then
  echo "OK  app responding 200 on :3000"
else
  echo "WARN app returned $code -- check: pm2 logs expendesk --lines 50" >&2
  exit 1
fi
