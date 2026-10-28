// Builds web-ready WebP copies of the raw photos in ./assets into ./public/media.
// Run with `npm run assets`. Safe to re-run; existing outputs are overwritten.
// Pass output prefixes to rebuild only part of it, e.g. `npm run assets -- config/ editorial/servicing`.
import sharp from 'sharp';
import { mkdir, copyFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(root, 'assets');
const OUT = join(root, 'public', 'media');
const AR = 'Archive-20261027T165403Z-1-001/Archive';
const WATCHES = 'Watches-20261027T170848Z-1-001/Watches';

// Variant slug -> folder / file prefixes used in the raw archive.
const VARIANTS = {
  'astral-blue': { folder: 'Astral Blue', light: 'AstralBlueLight.jpeg', lume: 'AstralBlueLumeIMG_5700.jpeg' },
  'aurora-mint': { folder: 'Aurora Mint', light: 'AuroraMintLight.jpeg', lume: 'AuroraMintLume.jpeg' },
  'eclipse-black': { folder: 'Eclipse Black', light: 'EclipseBlackLight.jpeg', lume: 'EclipseBlackLume.jpeg' },
  'frost-silver': { folder: 'Frost Silver', light: 'FrostSilverLight.jpeg', lume: 'FrostSilverLume.jpeg' },
  'nova-red': { folder: 'Nova Red', light: 'NovaRedLight.jpeg', lume: 'NovaRedLume.jpeg' },
  'sunseeker-yellow': { folder: 'Sunseeker Yellow', light: 'SunseekerYellowLight.jpeg', lume: 'SunseekerYellowLume.jpeg' },
};

// "Combo 2" shots: every dial photographed on the same six straps, always in this order.
const STRAPS = ['red', 'black', 'grey', 'yellow', 'blue', 'olive'];
const COMBOS = {
  'astral-blue': [2322, 2330, 2336, 2342, 2344, 2354],
  'aurora-mint': [2323, 2331, 2337, 2343, 2349, 2355],
  'eclipse-black': [2319, 2326, 2334, 2339, 2346, 2352],
  'frost-silver': [2321, 2329, 2332, 2341, 2348, 2353],
  'nova-red': [2318, 2327, 2333, 2338, 2345, 2351],
  'sunseeker-yellow': [2320, 2328, 2335, 2340, 2347, 2350],
};

/** [source relative to assets, output relative to public/media, max width, quality, optional crop] */
const jobs = [];
const add = (src, out, width, quality = 78, extract) => jobs.push({ src, out, width, quality, extract });

for (const [slug, v] of Object.entries(VARIANTS)) {
  add(`${AR}/${v.folder}.png`, `watch/${slug}.webp`, 1100, 85); // transparent front cut-out
  add(`${AR}/${v.light}`, `lume/${slug}-light.webp`, 2000);
  add(`${AR}/${v.lume}`, `lume/${slug}-lume.webp`, 2000);
  COMBOS[slug].forEach((n, i) => add(`${AR}/Website Update/Combo 2/${v.folder}/IMG_${n}.png`, `combo/${slug}-${STRAPS[i]}.webp`, 820, 82));
}

// Editorial / gallery photography.
add(`${AR}/Home/Main Image.png`, 'editorial/red-lume-cutout.webp', 900, 85);
add(`${AR}/Home/IMG_9928.png`, 'editorial/red-caseback-cutout.webp', 1000, 85);
add(`${AR}/About Us/IMG_9719.jpeg`, 'editorial/founders.webp', 1300);
add(`${AR}/Website Update/New Assets/IMG_3645.jpeg`, 'editorial/hand-red.webp', 1080);
add(`${AR}/Website Update/New Assets/IMG_3647.jpeg`, 'editorial/hand-yellow.webp', 1080);
add(`${AR}/Website Update/New Assets/IMG_3651.png`, 'editorial/hand-mint.webp', 1080);
add(`${AR}/Website Update/New Assets/IMG_3654.png`, 'editorial/eclipse-dark.webp', 1080);
add(`${AR}/Website Update/New Assets/IMG_3655.png`, 'editorial/hand-blue.webp', 1080);
add(`${AR}/Website Update/New Assets/IMG_3658.jpeg`, 'editorial/frost-titanium.webp', 1080);
add(`${WATCHES}/Frost Silver/IMG_4135.jpeg`, 'editorial/frost-dial-macro.webp', 2200);
add(`${WATCHES}/Frost Silver/IMG_4059.jpeg`, 'editorial/frost-hand.webp', 2200);
add(`${WATCHES}/Astral Blue/IMG_4136.jpeg`, 'editorial/blue-dial-macro.webp', 1600);
add(`${WATCHES}/Aurora Mint/IMG_4134.jpeg`, 'editorial/mint-dial-macro.webp', 1600);
add(`${WATCHES}/Eclipse Black/IMG_4137.jpeg`, 'editorial/eclipse-dial-macro.webp', 1600);
add(`${WATCHES}/Nova Red/IMG_4132.jpeg`, 'editorial/red-dial-macro.webp', 1600);
add(`${WATCHES}/Sunseeker Yellow/IMG_4133.jpeg`, 'editorial/yellow-dial-macro.webp', 1600);
add(`${WATCHES}/IMG_4123.jpeg`, 'editorial/streak-warm.webp', 2400);
add(`${WATCHES}/IMG_4124.jpeg`, 'editorial/streak-cool.webp', 2400);
add(`${WATCHES}/IMG_4166.png`, 'editorial/workbench.webp', 2400);
add('images/servicing-1.webp', 'editorial/servicing-bench.webp', 1200);
add('images/servicing-3.webp', 'editorial/servicing-loupe.webp', 700);

// Configurator layers: case, dial and strap renders that stack on one canvas.
// All share one crop (the union of their visible pixels) so they stay aligned.
const CFG = 'Configurator-20261027T170832Z-1-001/Configurator';
const LAYER_CROP = { left: 640, top: 360, width: 2080, height: 3030 };
const toSlug = (s) => s.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
for (const c of ['Black', 'Gold', 'Silver']) add(`${CFG}/Case/Case ${c}.png`, `config/case/${toSlug(c)}.webp`, 900, 84, LAYER_CROP);
for (const d of ['Black', 'Light Blue', 'Mint', 'Navy Blue', 'Orange', 'Purple', 'Red', 'Silver', 'Teal', 'Yellow']) {
  add(`${CFG}/Dial/Dial ${d}.png`, `config/dial/${toSlug(d)}.webp`, 900, 84, LAYER_CROP);
}
for (const [band, accent] of [['Black', 'Black'], ['Black', 'Grey'], ['Black', 'Silver'], ...['Black', 'Blue', 'Grey', 'Light Blue', 'Orange', 'Purple', 'Red', 'Silver', 'Teal', 'Yellow'].map((a) => ['Grey', a])]) {
  add(`${CFG}/Straps/Strap ${band} _ ${accent}.png`, `config/strap/${toSlug(band)}-${toSlug(accent)}.webp`, 900, 84, LAYER_CROP);
}

const videos = [
  ['videos/hero-bg-video.mp4', 'video/hero.mp4'],
  ['videos/sec-video.mp4', 'video/film.mp4'],
];

const only = process.argv.slice(2);
const selected = only.length ? jobs.filter((job) => only.some((prefix) => job.out.startsWith(prefix))) : jobs;

let done = 0;
for (const job of selected) {
  const out = join(OUT, job.out);
  await mkdir(dirname(out), { recursive: true });
  let image = sharp(join(SRC, job.src)).rotate(); // honour EXIF orientation from phone photos
  if (job.extract) image = sharp(await image.extract(job.extract).toBuffer());
  const info = await image
    .resize({ width: job.width, withoutEnlargement: true })
    .webp({ quality: job.quality, alphaQuality: 90, effort: 5 })
    .toFile(out);
  done++;
  console.log(`${String(done).padStart(3)}/${selected.length} ${job.out} ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB`);
}
for (const [src, out] of only.length ? [] : videos) {
  await mkdir(dirname(join(OUT, out)), { recursive: true });
  await copyFile(join(SRC, src), join(OUT, out));
  console.log('copied', out);
}
