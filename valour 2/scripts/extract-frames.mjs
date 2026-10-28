// Turns assets/videos/scroll-video.mp4 into a WebP image sequence for the scroll-scrubbed
// section (public/media/sequence/0001.webp ...). No ffmpeg needed: it drives a headless
// Chrome over the DevTools protocol, seeks the video and saves canvas snapshots.
// Run with `npm run frames`. Set CHROME_PATH if Chrome is installed elsewhere.
import { spawn } from 'node:child_process';
import { mkdir, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const VIDEO = join(root, 'assets', 'videos', 'scroll-video.mp4');
const OUT = join(root, 'public', 'media', 'sequence');
// 15 frames per second, blended together in the browser, reads as continuous motion.
const FPS = 15;
const WIDTH = 1280;
const QUALITY = 0.66;
const MANIFEST = join(root, 'src', 'data', 'sequence.json');
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9335;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const profile = await mkdtemp(join(tmpdir(), 'valour-frames-'));
const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--allow-file-access-from-files', '--mute-audio',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, 'about:blank',
], { stdio: 'ignore' });

try {
  let targets;
  for (let i = 0; i < 50 && !targets; i++) {
    try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); } catch { await sleep(200); }
  }
  if (!targets) throw new Error('Could not reach headless Chrome. Is CHROME_PATH correct?');

  const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0;
  const pending = new Map();
  ws.onmessage = (e) => { const m = JSON.parse(e.data); pending.get(m.id)?.(m); pending.delete(m.id); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const evaluate = async (expression) => {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (res.result.exceptionDetails) throw new Error(res.result.exceptionDetails.exception?.description);
    return res.result.result.value;
  };

  // A blank file:// page so the file:// video is same-origin and the canvas stays readable.
  const blank = join(profile, 'blank.html');
  await writeFile(blank, '<!doctype html><title>frames</title>');
  await send('Page.navigate', { url: pathToFileURL(blank).href });
  await sleep(500);

  const duration = await evaluate(`new Promise((resolve, reject) => {
    const v = window.v = document.createElement('video');
    v.muted = true; v.preload = 'auto';
    v.onloadeddata = () => resolve(v.duration);
    v.onerror = () => reject(new Error('video failed to load'));
    v.src = ${JSON.stringify(pathToFileURL(VIDEO).href)};
  })`);

  const count = Math.floor(duration * FPS);
  await rm(OUT, { recursive: true, force: true }); // never leave frames from an earlier run behind
  await mkdir(OUT, { recursive: true });
  for (let i = 0; i < count; i++) {
    const t = Math.min(i / FPS, duration - 0.05);
    const dataUrl = await evaluate(`new Promise((resolve) => {
      const v = window.v;
      v.onseeked = () => {
        const c = document.createElement('canvas');
        c.width = ${WIDTH}; c.height = Math.round(${WIDTH} * v.videoHeight / v.videoWidth);
        c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/webp', ${QUALITY}));
      };
      v.currentTime = ${t};
    })`);
    const file = join(OUT, `${String(i + 1).padStart(4, '0')}.webp`);
    await writeFile(file, Buffer.from(dataUrl.split(',')[1], 'base64'));
    if ((i + 1) % 20 === 0 || i === count - 1) console.log(`${i + 1}/${count} frames`);
  }
  // The Sequence component reads the frame count from here, so it can't drift from the files.
  await writeFile(MANIFEST, JSON.stringify({ count, fps: FPS, width: WIDTH }, null, 2) + '\n');
  console.log(`Done: ${count} frames at ${FPS}fps from ${duration.toFixed(2)}s of video -> ${OUT}`);
  ws.close();
} finally {
  chrome.kill();
  await sleep(300);
  await rm(profile, { recursive: true, force: true }).catch(() => {});
}
