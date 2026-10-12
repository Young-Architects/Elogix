# Self-hosting on a VPS

How to run this site on the Hostinger VPS (`srv1799405.hstgr.cloud`,
`187.127.188.237`, KVM 2) instead of Vercel.

## Why this needs a Node server

The site cannot be shipped as static files. Four things require a live
process, and all four are load-bearing:

| Feature | Where |
| --- | --- |
| On-demand ISR revalidation | `src/app/api/revalidate/route.ts` (`revalidateTag`) |
| API routes | `/api/chat`, `/api/revalidate` |
| Dynamic blog routes | `src/app/resources/blogs/[slug]/page.tsx` (`dynamicParams = true`) |
| Generated OG/Twitter images | `opengraph-image` / `twitter-image` (satori, at runtime) |

So the deployment is `next start` behind nginx. `next export` is not an
option without removing the blog and the social cards.

Next.js 16 requires **Node >= 20.9**. Ubuntu's apt default is older; use
NodeSource.

## What you take on by leaving Vercel

Push-to-deploy, the global CDN, automatic TLS renewal, preview deploys and
DDoS absorption all stop being someone else's problem. For a marketing site at
this traffic level the VPS performs fine — this is a trade of convenience for
control and a fixed bill, not a performance upgrade. **Keep the Vercel project
alive for at least a few days after cutover**; it is the rollback.

## First-time setup

```bash
# 1. Non-root user
ssh root@187.127.188.237
adduser deploy && usermod -aG sudo deploy && su - deploy

# 2. Node 22 LTS + nginx
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs nginx git
node -v                      # must be >= 20.9

# 3. Deploy key -> GitHub repo Settings -> Deploy keys (read-only)
ssh-keygen -t ed25519 -C "vps-expendesk" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
git clone git@github.com:Young-Architects/Elogix.git ~/expendesk
cd ~/expendesk

# 4. Environment — see the warning below
cp .env.production.example .env.production
nano .env.production

# 5. Swap. `next build` is memory-hungry and KVM 2 is tight; without this
#    the build is killed by the OOM reaper with no useful error.
sudo fallocate -l 4G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 6. Build and supervise
npm ci && npm run build
sudo npm i -g pm2
pm2 start npm --name expendesk -- start      # :3000
pm2 save && pm2 startup                      # run the command it prints

# 7. nginx
sudo cp deploy/nginx/expendesk.conf /etc/nginx/sites-available/expendesk
sudo ln -s /etc/nginx/sites-available/expendesk /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# 8. TLS + firewall
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d expendesk.com -d www.expendesk.com
sudo ufw allow OpenSSH && sudo ufw allow 'Nginx Full' && sudo ufw enable
```

### Environment variables — the migration's usual failure

Values live in `.env.production` on the server, listed in
`.env.production.example`. Copy the real ones out of Vercel → Settings →
Environment Variables.

Every `NEXT_PUBLIC_*` value is **inlined into the client bundle during
`next build`**, not read at startup. Build with an incomplete file and those
values are baked in empty — GTM and Search Console verification stop working
and nothing visibly breaks, so it is easy to ship and not notice for weeks.
Fill the file in *before* the first build, and **rebuild** (not restart) after
changing any of them.

Leave `VERCEL_ENV` unset. `src/lib/site.ts` falls back to `NODE_ENV`, so a
production build stays indexable. Setting it to anything but `production`
applies a site-wide `noindex`.

## Cutover

Test before pointing the real domain: add an A record for a throwaway
subdomain (`vps.expendesk.com` → `187.127.188.237`), run certbot for it, and
verify there. Only then move the real records.

Verify on the VPS, not from memory:

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://www.expendesk.com/
curl -sI https://expendesk.com/ | head -3            # expect 301 -> www
curl -s https://www.expendesk.com/sitemap.xml | head
curl -s https://www.expendesk.com/robots.txt
curl -s -o /dev/null -w '%{http_code}\n' https://www.expendesk.com/opengraph-image
curl -s -o /dev/null -w '%{http_code}\n' https://www.expendesk.com/resources/blogs
```

The blog routes and the OG image are the meaningful checks — they are the ones
that only work because a Node process is running.

## Routine deploys

```bash
ssh deploy@187.127.188.237
cd ~/expendesk && ./deploy/deploy.sh
```

It builds before touching the running process, so a compile error leaves the
old build serving rather than taking the site down.

## Gotchas specific to this site

**The apex redirect is yours now.** Vercel handled `expendesk.com` →
`www.expendesk.com`. It is in `deploy/nginx/expendesk.conf`; if it is ever
dropped, the apex serves a full duplicate of the site and competes with www in
Google for every query.

**`X-Forwarded-Proto` must reach Next.** Without it, anything deriving an
absolute URL from the request emits `http://` links on an `https://` site.
Already set in the nginx config.

**The revalidation webhook.** WordPress POSTs to `/api/revalidate` with an
`x-revalidate-secret` header (`wordpress/blog-to-json-webhook.php`). The URL
does not change at cutover, but `REVALIDATE_SECRET` must match on both sides or
published posts silently stop appearing.

**`/api/chat` declares `maxDuration = 60`.** nginx's `proxy_read_timeout` is
set to 90s to clear it; a shorter timeout returns 504 while the route is still
working.

**The Vercel `headers()` block in `next.config.ts` becomes dead code.** It
matches on `*.vercel.app` to `noindex` preview deploys. Harmless, but delete it
once Vercel is retired so nobody has to work out whether it still matters.

**`next/image` needs sharp.** It ships as an optional dependency of `next`, so
`npm ci` pulls the Linux binary automatically. The Next self-hosting guide
notes glibc systems can need [jemalloc tuning](https://sharp.pixelplumbing.com/install#linux-memory-allocator)
if memory climbs over days — only worth doing if you observe it.

**ISR cache lives on local disk.** Fine for one instance. If this ever runs on
more than one, they will serve divergent cached pages until a shared
`cacheHandler` is configured.
