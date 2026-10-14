#!/usr/bin/env bash
#
# Read-only. Inspects the Traefik container already running on this box and
# prints the exact config needed to route a domain to the pm2-managed Next.js
# app on the host. Changes nothing.
#
#   bash /opt/expendesk/deploy/traefik-discover.sh [domain] [port]
#   bash /opt/expendesk/deploy/traefik-discover.sh www.expendesk.com 3001

set -euo pipefail

DOMAIN="${1:-www.expendesk.com}"
APP_PORT="${2:-3001}"

b()  { printf '\n\033[1;35m== %s\033[0m\n' "$*"; }
kv() { printf '   %-22s %s\n' "$1" "$2"; }

CT=$(docker ps --filter "ancestor=traefik" --format '{{.Names}}' | head -1)
[ -n "$CT" ] || CT=$(docker ps --format '{{.Names}}' | grep -i traefik | head -1)
[ -n "$CT" ] || { echo "No Traefik container running."; exit 1; }

b "Traefik container"
kv "name" "$CT"
kv "image" "$(docker inspect "$CT" --format '{{.Config.Image}}')"

# Traefik's static flags live in either Entrypoint or Cmd depending on the image.
ARGS=$(docker inspect "$CT" --format '{{json .Config.Entrypoint}} {{json .Config.Cmd}}' \
       | python3 -c "
import sys,json
out=[]
for chunk in sys.stdin.read().split('] ['):
    chunk=chunk.strip()
    if not chunk.startswith('['): chunk='['+chunk
    if not chunk.endswith(']'):   chunk=chunk+']'
    try:
        v=json.loads(chunk)
        if v: out+= [str(x) for x in v]
    except Exception: pass
print('\n'.join(out))")

b "Entrypoints"
EPS=$(echo "$ARGS" | grep -oE 'entr[yY][pP]oints\.[A-Za-z0-9_-]+\.address=[^ ]*' | sed 's/entr[yY][pP]oints\.//' || true)
if [ -n "$EPS" ]; then echo "$EPS" | sed 's/^/   /'; else
  echo "   (none declared explicitly -> Traefik defaults: web :80, websecure :443)"; fi

b "Certificate resolver"
RESOLVER=$(echo "$ARGS" | grep -oE 'certificatesresolvers\.[A-Za-z0-9_-]+' | head -1 | cut -d. -f2 || true)
if [ -n "$RESOLVER" ]; then
  kv "name" "$RESOLVER"
  kv "acme config" "$(echo "$ARGS" | grep -E 'certificatesresolvers' | sed 's/^--//' | paste -sd' ' -)"
else
  kv "name" "NONE FOUND -- Traefik is serving its self-signed default cert"
fi

b "File provider (needed to route a non-container service)"
FILEDIR=$(echo "$ARGS" | grep -oE 'providers\.file\.(directory|filename)=[^ ]*' | cut -d= -f2 | head -1 || true)
if [ -n "$FILEDIR" ]; then kv "already enabled" "$FILEDIR"; else kv "status" "NOT enabled -- must be added"; fi

b "Compose project"
WD=$(docker inspect "$CT" --format '{{index .Config.Labels "com.docker.compose.project.working_dir"}}' 2>/dev/null || true)
kv "working dir" "${WD:-unknown}"
kv "service" "$(docker inspect "$CT" --format '{{index .Config.Labels "com.docker.compose.service"}}' 2>/dev/null || echo unknown)"
[ -n "$WD" ] && ls "$WD" 2>/dev/null | sed 's/^/   /' || true

b "Host address as seen from inside Traefik"
GW=$(docker network inspect bridge --format '{{(index .IPAM.Config 0).Gateway}}' 2>/dev/null || echo 172.17.0.1)
kv "gateway" "$GW"
if docker exec "$CT" wget -q -T3 -O /dev/null "http://${GW}:${APP_PORT}/" 2>/dev/null \
   || docker exec "$CT" sh -c "command -v curl >/dev/null && curl -sf -m3 -o /dev/null http://${GW}:${APP_PORT}/" 2>/dev/null; then
  kv "reaches app?" "YES -- http://${GW}:${APP_PORT} is reachable from the container"
else
  kv "reaches app?" "could not confirm (the container may lack curl/wget; not necessarily a problem)"
fi

b "Is the app running where we think?"
kv "pm2" "$(pm2 jlist 2>/dev/null | python3 -c "
import sys,json
try:
  for p in json.load(sys.stdin):
    if p['name']=='expendesk':
      print(p['pm2_env']['status'], 'restarts='+str(p['pm2_env'].get('restart_time')))
      break
  else: print('not found')
except Exception: print('pm2 not readable')" 2>/dev/null || echo unknown)"
kv "local check" "$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:${APP_PORT}/" || echo 000)"

cat <<EOF

=====================================================================
 WHAT TO DO WITH THIS
=====================================================================

Traefik routes by Docker labels, and the site is a host process, so it
needs the FILE provider. Steps, using the values found above:

1. Create the dynamic config:

   mkdir -p /opt/traefik-dynamic
   cat > /opt/traefik-dynamic/expendesk.yml <<'YAML'
   http:
     routers:
       expendesk:
         rule: "Host(\`${DOMAIN}\`)"
         entryPoints: [websecure]
         service: expendesk
         tls:
           certResolver: ${RESOLVER:-REPLACE_WITH_RESOLVER_NAME}
     services:
       expendesk:
         loadBalancer:
           servers:
             - url: "http://${GW}:${APP_PORT}"
   YAML

2. In ${WD:-<compose dir>}/docker-compose.yml, on the traefik service add:

     volumes:
       - /opt/traefik-dynamic:/dynamic:ro      # ADD (keep existing ones)
     command:
       - --providers.file.directory=/dynamic   # ADD (keep existing flags)
       - --providers.file.watch=true

3. Apply. This briefly interrupts n8n/Supabase:

     cd ${WD:-<compose dir>} && docker compose up -d traefik

4. BEFORE pointing the real domain here, remove VERCEL_ENV=preview from
   /opt/expendesk/.env.production and REBUILD -- the current build serves
   robots.txt "Disallow: /", which is right for staging and disastrous
   for production:

     cd /opt/expendesk
     sed -i '/^VERCEL_ENV=/d' .env.production
     npm run build && pm2 reload expendesk
     curl -s http://127.0.0.1:${APP_PORT}/robots.txt   # must NOT disallow

EOF
