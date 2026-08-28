/**
 * Icon generator — regenerates every app icon from one master source.
 *
 *   node scripts/generate-icons.mjs
 *
 * ── Why this script exists ──
 *
 * The icon set was hand-exported once and had drifted into three real defects,
 * all invisible until you inspect the pixels:
 *
 *  1. `apple-icon.png` was 87% transparent with fully transparent corners.
 *     iOS does not support alpha in home-screen icons — it composites
 *     transparency to **black**. Anyone adding Expendesk to an iPhone home
 *     screen got a violet mark floating on a black square.
 *  2. The Android icons were transparent and edge-to-edge, so `manifest.ts`
 *     could only declare them `purpose: "any"`. On adaptive-icon launchers
 *     that means letterboxing instead of a properly filled shape.
 *  3. `icon0.png` (16x16) never reached full opacity — its maximum alpha was
 *     221 — so the tab favicon rendered as a washed-out smudge.
 *
 * Rather than hand-fixing exports, everything now derives from one master with
 * documented rules, so the set can be regenerated consistently when the brand
 * mark changes.
 *
 * ── Which icons keep transparency, and which must not ──
 *
 * This is the distinction that was being missed, and it is not a matter of
 * taste:
 *
 *   - **Browser tab icons** (favicon.ico, icon0, icon1) — transparent. Tabs
 *     have light and dark backgrounds; a baked-in white plate looks like a
 *     sticker on a dark tab strip.
 *   - **Apple touch icon** — opaque, always. iOS renders alpha as black and
 *     applies its own rounded corners, so the source must be a full-bleed
 *     opaque square.
 *   - **Android maskable** — opaque and full-bleed, with the mark confined to
 *     the central safe zone, because the launcher crops to an arbitrary shape.
 */
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

/**
 * Masters. Both live outside the set of files this script writes — that is
 * load-bearing, not incidental.
 *
 * The first version of this script read its alpha master from
 * `public/android-chrome-512x512.png`, which is also one of its outputs. A
 * single run was fine, because the reads happened before the write. A *second*
 * run would have read the freshly-written opaque file and baked an opaque
 * plate into the transparent tab icons — a script that quietly corrupts its
 * own inputs on the second invocation. `brand/` is not served by Next and is
 * never an output, so regeneration is idempotent.
 */
/**
 * The single master: the isometric Expendesk symbol, 512x512, transparent
 * background.
 *
 * Note what is deliberately NOT used here. `public/expendesk-mark.jpg` sounds
 * like the right file and is not — despite the name it is the *wordmark*
 * ("ExpenDesk" set in type) on a white circle, sized for a social avatar.
 * Feeding it to an icon generator produces a 180px square containing
 * unreadable four-pixel-tall lettering. An app icon needs the symbol alone;
 * text does not survive being shrunk to a tab favicon.
 */
const MASTER = 'brand/expendesk-mark-master.png';

/**
 * Plate colour for the opaque icons. Identical to `background_color` /
 * `theme_color` in manifest.ts and `viewport.themeColor` in layout.tsx — if
 * these disagree, an installed PWA flashes one colour on the splash screen and
 * another once the icon paints.
 */
const PLATE = { r: 0xf8, g: 0xf9, b: 0xff, alpha: 1 };

/** Trim the master's surrounding transparency/white so padding math starts
 *  from the mark itself rather than from whatever margin the export happened
 *  to carry. */
async function markOnly(source) {
  return sharp(source).trim({ threshold: 10 }).toBuffer();
}

/**
 * Opaque icon: mark centred on a full-bleed plate.
 *
 * `inset` is the fraction of the canvas the mark is allowed to occupy. For
 * maskable icons this must stay inside Android's safe zone — a centred circle
 * 80% of the canvas wide. A square inscribed in that circle is only ~56% of
 * the canvas, so 0.58 is the largest value that is safe under a circular mask.
 */
async function opaqueIcon(size, inset, out) {
  const mark = await markOnly(MASTER);
  const inner = Math.round(size * inset);
  // Resize the transparent symbol first, then composite it over the plate.
  // Flattening before resizing would blend the plate colour into the mark's
  // anti-aliased edges and leave a faint halo once the launcher recolours it.
  const resized = await sharp(mark)
    .resize(inner, inner, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: 'lanczos3',
    })
    .toBuffer();

  await sharp({
    create: { width: size, height: size, channels: 4, background: PLATE },
  })
    .composite([{ input: resized, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`  ${out}  ${size}x${size}  opaque, mark at ${Math.round(inset * 100)}%`);
}

/** Transparent icon for browser tabs — no plate, mark fills the canvas. */
async function transparentIcon(size, out) {
  const mark = await markOnly(MASTER);
  const buf = await sharp(mark)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: 'lanczos3',
    })
    .png({ compressionLevel: 9 })
    .toBuffer();
  writeFileSync(out, buf);
  const { channels } = await sharp(buf).stats();
  console.log(`  ${out}  ${size}x${size}  transparent, peak alpha ${channels[3].max}`);
  return buf;
}

/**
 * Multi-resolution .ico containing 16/32/48 PNG payloads.
 *
 * sharp cannot write .ico, and the format is simple enough not to warrant a
 * dependency: a 6-byte header, then one 16-byte directory entry per image,
 * then the payloads. PNG-inside-ICO is understood by every browser in use.
 *
 * 48x48 is included because Google Search reads the favicon at 48px for the
 * icon beside a mobile result — a 16px-only .ico gets upscaled and looks soft.
 */
async function buildIco(sizes, out) {
  const images = [];
  for (const size of sizes) {
    const mark = await markOnly(MASTER);
    images.push(
      await sharp(mark)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
          kernel: 'lanczos3',
        })
        .png({ compressionLevel: 9 })
        .toBuffer()
    );
  }

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(images.length, 4);

  const entries = [];
  let offset = 6 + images.length * 16;
  images.forEach((png, i) => {
    const e = Buffer.alloc(16);
    // 0 means 256 in the ICO directory; all our sizes are < 256.
    e.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], 0);
    e.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], 1);
    e.writeUInt8(0, 2); // palette colours
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += png.length;
    entries.push(e);
  });

  writeFileSync(out, Buffer.concat([header, ...entries, ...images]));
  console.log(`  ${out}  ${sizes.join('/')}  multi-resolution`);
}

console.log('Browser tab icons (transparent):');
await transparentIcon(16, 'src/app/icon0.png');
await transparentIcon(32, 'src/app/icon1.png');
/**
 * 192x192 for Google Search.
 *
 * Google's favicon guidance asks for a square that is a **multiple of 48px**
 * (48, 96, 144, 192...). The .ico below tops out at exactly 48 — the minimum
 * that qualifies — which leaves Google the least possible to work with when it
 * renders the icon beside a result and gives it nothing to downscale from
 * cleanly on a high-DPI screen.
 *
 * 192 is 48x4, matches the Android icon size, and is emitted by Next as its own
 * `<link rel="icon" sizes="192x192">`. Browsers still pick 16/32 for the tab;
 * this exists for the search result and for anything that wants a larger source.
 *
 * Transparent, like the other tab icons: Google renders result favicons on a
 * light background in light mode and a dark one in dark mode, so a baked-in
 * plate would show as a visible tile in one of the two.
 */
await transparentIcon(192, 'src/app/icon2.png');
await buildIco([16, 32, 48], 'src/app/favicon.ico');

console.log('\nApple touch icon (opaque — iOS renders alpha as black):');
await opaqueIcon(180, 0.72, 'src/app/apple-icon.png');

console.log('\nAndroid / PWA:');
// "any" icons keep a plate too: several launchers and the task switcher draw
// them on white, and a transparent mark disappears on light chrome.
await opaqueIcon(192, 0.78, 'public/android-chrome-192x192.png');
await opaqueIcon(512, 0.78, 'public/android-chrome-512x512.png');
// Maskable: mark inside the 80% safe circle, so no launcher shape clips it.
await opaqueIcon(192, 0.58, 'public/maskable-icon-192x192.png');
await opaqueIcon(512, 0.58, 'public/maskable-icon-512x512.png');

console.log('\nDone. Rebuild to pick up the new hashes: npm run build');
