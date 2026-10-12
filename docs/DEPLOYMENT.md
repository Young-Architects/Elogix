# Hosting this site on the Hostinger VPS — complete walkthrough

Every step, in order, with a verification after each one. Do not skip the
verifications: most VPS migrations fail quietly, and the point of checking as
you go is that you find out at step 6 rather than after DNS has moved.

**Server:** `srv1799405.hstgr.cloud` · `187.127.188.237` · KVM 2
**DNS:** Namecheap (`dns1/dns2.registrar-servers.com`)
**Currently:** Vercel

---

## Why this cannot be a static upload

The site needs a live Node process. Four things depend on it:

| Feature | Where |
| --- | --- |
| On-demand ISR revalidation | `src/app/api/revalidate/route.ts` |
| API routes | `/api/chat`, `/api/revalidate` |
| Dynamic blog routes | `src/app/resources/blogs/[slug]/page.tsx` (`dynamicParams = true`) |
| Generated OG/Twitter images | `opengraph-image` / `twitter-image` (satori, at runtime) |

Uploading a folder of HTML to `public_html` will not work. The deployment is
`next start` behind nginx.

Next.js 16 requires **Node >= 20.9**.

---

## Phase 0 — Before you touch the server

### 0.1 Collect the environment values

Open Vercel → project → Settings → Environment Variables and copy the values
for all seven. You cannot get them later from the running site — they are not
recoverable once the project is deleted.

```
WORDPRESS_API_URL
REVALIDATE_SECRET
N8N_CHAT_WEBHOOK_URL
N8N_CHAT_SECRET
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_GTM_ID
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
```

Paste them somewhere safe now. Step 4.2 needs them.

### 0.2 Write down the rollback

Today's DNS, so you can put it back:

```
expendesk.com        A      216.198.79.1
www.expendesk.com    CNAME  b4a54e8b7be64812.vercel-dns-017.com
```

**Do not delete the Vercel project.** It is the rollback for the whole
migration. Retire it only after the VPS has served production for several days.

---

## Phase 1 — Prepare the server

### 1.1 Set the OS

hPanel → VPS → Manage → OS & Panel → Operating System.

Choose **Ubuntu 24.04 LTS, plain** — not a template with a control panel.
CyberPanel/CloudPanel/Plesk templates install their own nginx or Apache on
port 80 and will fight the configuration below.

If you reinstall, everything on the server is erased. Do it now, not later.

### 1.2 Set the root password

hPanel → Manage → Settings → Root Password. Set it and keep it.

### 1.3 First SSH login

```bash
ssh root@187.127.188.237
```

Accept the host fingerprint. If it refuses, check hPanel shows **Running** and
that SSH access is not disabled under Settings.

**Verify:**
```bash
cat /etc/os-release | head -2      # expect Ubuntu 24.04
free -h                            # note the RAM
df -h /                            # note free disk
```

### 1.4 Update the system

```bash
apt update && apt upgrade -y
```

If it reports a reboot is required:
```bash
reboot
```
Wait ~30s, SSH back in.

### 1.5 Create a non-root user

Running the app as root means any compromise is a full server takeover.

```bash
adduser deploy
```
Set a password, press Enter through the name fields.

```bash
usermod -aG sudo deploy
```

**Verify:**
```bash
su - deploy
sudo echo "sudo works"
exit
```

### 1.6 Give `deploy` your SSH key

**On your Windows machine**, in Git Bash:
```bash
cat ~/.ssh/id_ed25519.pub
```
No such file? Create one: `ssh-keygen -t ed25519 -C "your@email"` then `cat`
again.

**On the server, as root:**
```bash
mkdir -p /home/deploy/.ssh
nano /home/deploy/.ssh/authorized_keys
```
Paste the public key, Ctrl+O, Enter, Ctrl+X.

```bash
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh
```

**Verify — from a NEW terminal on your machine, keep the root session open:**
```bash
ssh deploy@187.127.188.237
```
It must log in without a password. If it asks for one, the key is wrong — fix
it before step 1.7 or you will lock yourself out.

### 1.7 Harden SSH

Only once 1.6 works.

```bash
sudo nano /etc/ssh/sshd_config
```
Set:
```
PermitRootLogin no
PasswordAuthentication no
```
```bash
sudo systemctl restart ssh
```

**Verify:** open another terminal and confirm `ssh deploy@187.127.188.237`
still works before closing your existing session.

### 1.8 Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable            # answer y
sudo ufw status
```
Expect `OpenSSH ALLOW` and `Nginx Full ALLOW`. Allow OpenSSH **before**
enabling, or you lose the connection.

### 1.9 Swap

`next build` is memory-hungry and KVM 2 is tight. Without swap the build is
killed by the kernel with no useful error — it just stops.

```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

**Verify:**
```bash
free -h        # Swap row shows 4.0Gi
```

---

## Phase 2 — Install the runtime

### 2.1 Node 22 LTS

Ubuntu's apt Node is too old for Next 16. Use NodeSource.

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

**Verify:**
```bash
node -v     # must be >= 20.9 — expect v22.x
npm -v
```

### 2.2 git, nginx, certbot

```bash
sudo apt install -y git nginx certbot python3-certbot-nginx
```

**Verify:**
```bash
systemctl status nginx --no-pager | head -3     # active (running)
curl -I http://127.0.0.1                        # 200, nginx default page
```

### 2.3 PM2

```bash
sudo npm install -g pm2
pm2 -v
```

---

## Phase 3 — Get the code onto the server

The repo is private, so the server needs its own read-only key.

### 3.1 Generate a deploy key

As `deploy`:
```bash
ssh-keygen -t ed25519 -C "vps-expendesk" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
```

### 3.2 Register it on GitHub

GitHub → `Young-Architects/Elogix` → Settings → Deploy keys → Add deploy key.
Title `hostinger-vps`, paste the key, **leave "Allow write access" unchecked** —
the server only ever pulls.

**Verify:**
```bash
ssh -T git@github.com
```
Expect `Hi Young-Architects/Elogix! You've successfully authenticated, but
GitHub does not provide shell access.` That message is success.

### 3.3 Clone

```bash
cd ~
git clone git@github.com:Young-Architects/Elogix.git expendesk
cd ~/expendesk
git log --oneline -1
```
The commit should match the top of `main` on GitHub.

---

## Phase 4 — Environment

### 4.1 Create the file

```bash
cp .env.production.example .env.production
nano .env.production
```

### 4.2 Fill in the values from step 0.1

Then lock it down — it holds secrets:
```bash
chmod 600 .env.production
```

### 4.3 Read this before building

Every `NEXT_PUBLIC_*` value is **inlined into the JavaScript bundle during
`next build`**. It is not read when the server starts.

If the file is incomplete when you build, those values are baked in as empty
strings. Nothing errors. The site looks perfect. Google Tag Manager and Search
Console verification simply stop working, and you find out weeks later. This is
the most common way this migration goes wrong.

After changing any `NEXT_PUBLIC_*` value you must **rebuild**, not restart.

Leave `VERCEL_ENV` unset. `src/lib/site.ts` falls back to `NODE_ENV`, so the
build stays indexable. Setting it to anything but `production` applies a
site-wide `noindex`.

**Verify every variable is present and none is empty:**
```bash
grep -c '^[A-Z_]*=.\+' .env.production      # expect 7
grep '^[A-Z_]*=$' .env.production           # expect NO output
```

---

## Phase 5 — Build and run

### 5.1 Install dependencies

```bash
cd ~/expendesk
npm ci
```

`npm ci`, not `npm install` — it installs exactly what `package-lock.json`
pins, so the server builds the tree that was tested locally.

### 5.2 Build

```bash
npm run build
```

Takes a few minutes. Expect `✓ Compiled successfully` and a route table.

Killed with no error, or "JavaScript heap out of memory"? Swap is missing —
go back to 1.9. If swap is present, raise the heap:
```bash
NODE_OPTIONS="--max-old-space-size=3072" npm run build
```

### 5.3 Start under PM2

```bash
pm2 start npm --name expendesk -- start
pm2 status
```
Expect status `online`. `next start` listens on port 3000.

**Verify the app itself, before nginx is involved:**
```bash
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/
```
Expect `200`. Not 200? `pm2 logs expendesk --lines 50`.

### 5.4 Survive reboots

```bash
pm2 save
pm2 startup
```
`pm2 startup` prints a `sudo env PATH=...` command. **Copy and run it.**
Skipping this means the site stays down after any reboot.

**Verify:**
```bash
sudo reboot
# wait ~30s
ssh deploy@187.127.188.237
pm2 status                   # online, without you starting it
```

---

## Phase 6 — nginx

### 6.1 Install the config

```bash
cd ~/expendesk
sudo cp deploy/nginx/expendesk.conf /etc/nginx/sites-available/expendesk
sudo ln -s /etc/nginx/sites-available/expendesk /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
```
`nginx -t` must print `syntax is ok` and `test is successful`. Do not reload
until it does.

```bash
sudo systemctl reload nginx
```

**Verify nginx is proxying to the app:**
```bash
curl -s -o /dev/null -w '%{http_code}\n' -H 'Host: www.expendesk.com' http://127.0.0.1/
```
Expect `200`. A 502 means nginx is up but the app is not — check `pm2 status`.

---

## Phase 7 — Test on a temp subdomain first

Do not point the real domain at an unverified server.

### 7.1 Add a temp DNS record

Namecheap → Domain List → expendesk.com → Manage → Advanced DNS → Add New
Record:

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| A | `vps` | `187.127.188.237` | Automatic |

### 7.2 Wait for propagation

```bash
nslookup vps.expendesk.com 8.8.8.8
```
Repeat until it returns `187.127.188.237`. Usually minutes.

### 7.3 Serve the temp hostname

```bash
sudo nano /etc/nginx/sites-available/expendesk
```
Add `vps.expendesk.com` to the `server_name` line, then:
```bash
sudo nginx -t && sudo systemctl reload nginx
curl -s -o /dev/null -w '%{http_code}\n' http://vps.expendesk.com/
```

### 7.4 Get a certificate for it

```bash
sudo certbot --nginx -d vps.expendesk.com
```
Choose redirect HTTP→HTTPS when asked.

### 7.5 Test the whole site properly

Open `https://vps.expendesk.com` in a browser and click through. Then check the
things that only work because a Node process is running:

```bash
curl -s -o /dev/null -w 'home            %{http_code}\n' https://vps.expendesk.com/
curl -s -o /dev/null -w 'blog list       %{http_code}\n' https://vps.expendesk.com/resources/blogs
curl -s -o /dev/null -w 'og image        %{http_code}\n' https://vps.expendesk.com/opengraph-image
curl -s -o /dev/null -w 'book-a-demo     %{http_code}\n' https://vps.expendesk.com/book-a-demo
curl -s -o /dev/null -w 'thank-you       %{http_code}\n' https://vps.expendesk.com/book-a-demo/thank-you
curl -s -o /dev/null -w 'pricing         %{http_code}\n' https://vps.expendesk.com/pricing
curl -s https://vps.expendesk.com/sitemap.xml | head -5
curl -s https://vps.expendesk.com/robots.txt
```

All must be `200`. A blog post must render with its featured image — that
proves `WORDPRESS_API_URL`, the `next/image` allowlist and sharp all work.

**Also confirm GTM made it into the bundle** (the silent failure from 4.3):
```bash
curl -s https://vps.expendesk.com/ | grep -o 'GTM-[A-Z0-9]*' | head -1
```
Empty output means `NEXT_PUBLIC_GTM_ID` was missing at build time. Fix
`.env.production` and **rebuild**.

Do not proceed until every check passes.

---

## Phase 8 — Cut over the real domain

Only after Phase 7 passes completely.

### 8.1 Lower the TTL first (do this a day ahead if you can)

Namecheap → Advanced DNS → set TTL on the `@` and `www` records to `1 min`.
Wait for the old TTL to expire. This makes a rollback take minutes instead of
hours.

### 8.2 Change the records

Namecheap → Advanced DNS. Current state:

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `216.198.79.1` |
| CNAME | `www` | `b4a54e8b7be64812.vercel-dns-017.com` |

Change to:

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| A | `@` | `187.127.188.237` | 1 min |
| A | `www` | `187.127.188.237` | 1 min |

`www` changes from **CNAME to A**. Delete the CNAME, then add the A record —
Namecheap will not let both exist on the same host.

### 8.3 Watch propagation

```bash
nslookup expendesk.com 8.8.8.8
nslookup www.expendesk.com 8.8.8.8
```
Both must return `187.127.188.237`.

### 8.4 Issue the real certificate

```bash
sudo certbot --nginx -d expendesk.com -d www.expendesk.com
```
Choose redirect when prompted. Certbot edits the nginx file in place to add
the TLS listener.

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### 8.5 Confirm auto-renewal

Certificates last 90 days. A missed renewal takes the site down with a browser
security warning.

```bash
sudo certbot renew --dry-run
systemctl list-timers | grep certbot
```
The dry run must succeed and the timer must be listed.

---

## Phase 9 — Verify production

```bash
curl -s -o /dev/null -w 'www home     %{http_code}\n' https://www.expendesk.com/
curl -sI https://expendesk.com/ | head -2
curl -s -o /dev/null -w 'blogs        %{http_code}\n' https://www.expendesk.com/resources/blogs
curl -s -o /dev/null -w 'og image     %{http_code}\n' https://www.expendesk.com/opengraph-image
curl -s -o /dev/null -w 'book-a-demo  %{http_code}\n' https://www.expendesk.com/book-a-demo
curl -s -o /dev/null -w 'thank-you    %{http_code}\n' https://www.expendesk.com/book-a-demo/thank-you
curl -s https://www.expendesk.com/sitemap.xml | head -5
curl -s https://www.expendesk.com/ | grep -o 'GTM-[A-Z0-9]*' | head -1
```

Required results:

- `https://expendesk.com/` returns **301 to https://www.expendesk.com/**.
  If it serves the site instead, the apex redirect is broken — the apex is now
  a full duplicate competing with www in Google, which undoes the canonical
  work this site already did. Fix before anything else.
- The server header no longer says Vercel.
- GTM id appears.

### 9.1 Re-check the things outside the server

- **WordPress webhook:** publish or update a post and confirm it appears on
  `/resources/blogs` within a minute. If not, `REVALIDATE_SECRET` does not
  match between `.env.production` and the WordPress plugin.
- **Demo funnel:** submit the real form at `/book-a-demo` end to end and
  confirm the lead lands in GHL.
- **Search Console:** no new coverage errors over the next few days.

---

## Phase 10 — Ongoing operation

### Deploying a change

```bash
ssh deploy@187.127.188.237
cd ~/expendesk && ./deploy/deploy.sh
```

It pulls, installs, builds, then reloads — in that order, so a compile error
leaves the previous build serving instead of taking the site down.

There is no push-to-deploy any more. A `git push` changes nothing on the VPS
until you run this.

### Logs and status

```bash
pm2 status
pm2 logs expendesk --lines 100
sudo tail -50 /var/log/nginx/error.log
```

### Monthly

```bash
sudo apt update && sudo apt upgrade -y
sudo certbot renew --dry-run
df -h /
```

---

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| **502 Bad Gateway** | App not running | `pm2 status`, `pm2 logs expendesk` |
| **504 Gateway Timeout on /api/chat** | nginx timeout under the route's `maxDuration = 60` | `proxy_read_timeout 90s` is already in the config — confirm it was not lost when certbot rewrote the file |
| **Build killed, no error** | Out of memory | Add swap (1.9), or `NODE_OPTIONS="--max-old-space-size=3072"` |
| **GTM / Search Console stopped** | `NEXT_PUBLIC_*` empty at build time | Fix `.env.production`, **rebuild** — restart is not enough |
| **Blog images 400** | Host not in the `next/image` allowlist | `WORDPRESS_API_URL` must match the host serving the images |
| **Blog posts not updating** | Webhook secret mismatch | `REVALIDATE_SECRET` must match the WordPress plugin |
| **Site down after reboot** | `pm2 startup` command never run | Run `pm2 startup` and execute the line it prints |
| **http:// links on an https:// site** | `X-Forwarded-Proto` not reaching Next | Check the header block survived certbot's rewrite |
| **Apex serves the site instead of redirecting** | Redirect lost | Restore the `if ($host = expendesk.com)` block |

---

## Rollback

If production is broken and you cannot fix it quickly, put DNS back:

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `216.198.79.1` |
| CNAME | `www` | `b4a54e8b7be64812.vercel-dns-017.com` |

With TTL at 1 minute this takes effect almost immediately. Vercel is still
serving the site the whole time — which is why the project stays alive until
the VPS has proven itself over several days.
