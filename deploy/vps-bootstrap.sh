#!/usr/bin/env bash
#
# One-shot bootstrap: takes a bare Ubuntu VPS to a running Expendesk instance
# on port 3000, with no domain, no TLS and no nginx.
#
#   ssh root@187.127.188.237
#   curl -fsSL https://raw.githubusercontent.com/Young-Architects/Elogix/main/deploy/vps-bootstrap.sh -o bootstrap.sh
#   bash bootstrap.sh
#
# Safe to re-run. Every step checks whether it has already been done, so if it
# fails halfway you fix the cause and run it again rather than unpicking it.

set -euo pipefail

REPO="https://github.com/Young-Architects/Elogix.git"
APP_DIR="/opt/expendesk"
APP_NAME="expendesk"
PORT="3000"
NODE_MAJOR="22"

say()  { printf '\n\033[1;35m==> %s\033[0m\n' "$*"; }
ok()   { printf '    \033[0;32mok\033[0m  %s\n' "$*"; }
skip() { printf '    \033[0;33m--\033[0m  %s (already done)\n' "$*"; }
die()  { printf '\n\033[0;31mFAILED: %s\033[0m\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "Run this as root."

# ---------------------------------------------------------------- 1. packages
say "Installing packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq curl git ca-certificates >/dev/null
ok "curl, git"

if command -v node >/dev/null 2>&1 && [ "$(node -p 'process.versions.node.split(".")[0]')" -ge 20 ]; then
  skip "Node $(node -v)"
else
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash - >/dev/null 2>&1
  apt-get install -y -qq nodejs >/dev/null
  ok "Node $(node -v)"
fi

# Next.js 16 refuses to run on anything older.
[ "$(node -p 'process.versions.node.split(".")[0]')" -ge 20 ] || die "Node >= 20.9 required, got $(node -v)"

command -v pm2 >/dev/null 2>&1 && skip "pm2" || { npm install -g pm2 >/dev/null 2>&1; ok "pm2"; }

# -------------------------------------------------------------------- 2. swap
# `next build` is memory-hungry. On a small VPS without swap the kernel kills
# it with no error at all -- it simply stops, which looks like a hang.
say "Swap"
if swapon --show | grep -q .; then
  skip "swap active ($(free -h | awk '/Swap/{print $2}'))"
else
  fallocate -l 4G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile >/dev/null
  swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  ok "4G swap enabled"
fi

# ------------------------------------------------------- 3. (no key needed)
# The repo is public, so it clones over HTTPS with no credentials. The
# earlier version of this script set up an SSH deploy key, which failed for
# anyone who had not added one -- and was never necessary. If the repo is ever
# made private, switch REPO back to the git@github.com: form and add a
# read-only deploy key.

# -------------------------------------------------------------------- 4. code
say "Source"
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" fetch --quiet origin
  git -C "$APP_DIR" reset --hard --quiet origin/main
  skip "repo present, reset to origin/main"
else
  git clone --quiet "$REPO" "$APP_DIR"
  ok "cloned"
fi
cd "$APP_DIR"
ok "at $(git log --oneline -1)"

# --------------------------------------------------------------------- 5. env
say "Environment"
if [ -f .env.production ]; then
  skip ".env.production exists (left untouched)"
else
  cat > .env.production <<'ENVEOF'
# Staging box: reachable by IP, so it must never be indexed.
#
# src/lib/site.ts checks VERCEL_ENV first and only treats "production" as
# indexable. Anything else flips the whole site to noindex AND makes
# robots.txt serve "Disallow: /". Read at BUILD time, not at startup -- so
# changing this needs a rebuild, not a restart.
VERCEL_ENV=preview

# Everything else has a working fallback in the code, so the site runs
# without it. Add these only when the backend dev needs those routes:
#   N8N_CHAT_WEBHOOK_URL=   \
#   N8N_CHAT_SECRET=         > /api/chat returns 500 until both are set
#   REVALIDATE_SECRET=      -- /api/revalidate returns 500 until set
ENVEOF
  chmod 600 .env.production
  ok "wrote .env.production (VERCEL_ENV=preview -> noindex)"
fi

# ------------------------------------------------------------------- 6. build
say "Building (a few minutes)"
npm ci --no-audit --no-fund
npm run build
ok "build complete"

# --------------------------------------------------------------------- 7. run
say "Starting"
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 reload "$APP_NAME" --update-env >/dev/null
  ok "reloaded"
else
  PORT="$PORT" pm2 start npm --name "$APP_NAME" -- start >/dev/null
  ok "started on :$PORT"
fi
pm2 save >/dev/null
pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || true
ok "will restart on reboot"

# ----------------------------------------------------------------- 8. firewall
say "Firewall"
if command -v ufw >/dev/null 2>&1; then
  ufw allow OpenSSH >/dev/null 2>&1 || true
  ufw allow "${PORT}/tcp" >/dev/null 2>&1 || true
  ufw --force enable >/dev/null 2>&1 || true
  ok "ufw allows SSH and ${PORT}/tcp"
fi

# -------------------------------------------------------------------- 9. check
say "Verifying"
sleep 4
code=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:${PORT}/" || echo 000)
[ "$code" = "200" ] || die "App returned $code. Run: pm2 logs $APP_NAME --lines 50"
ok "home page 200"

robots=$(curl -s "http://127.0.0.1:${PORT}/robots.txt" | tr -d '\r')
echo "$robots" | grep -qi "Disallow: /" \
  && ok "robots.txt disallows crawlers (noindex active)" \
  || printf '    \033[0;31m!!\033[0m  robots.txt is NOT disallowing - check VERCEL_ENV then rebuild\n'

IP=$(curl -s -4 --max-time 5 ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')
cat <<DONE

  ------------------------------------------------------------------
  Running:   http://${IP}:${PORT}

  If that does not load from outside, open port ${PORT} in
  hPanel -> VPS -> Manage -> Firewall. Hostinger filters above ufw.

  For the backend dev:
    pm2 status
    pm2 logs ${APP_NAME} --lines 100
    pm2 restart ${APP_NAME}
    cd ${APP_DIR} && ./deploy/deploy.sh      # pull + rebuild + reload
  ------------------------------------------------------------------

DONE
