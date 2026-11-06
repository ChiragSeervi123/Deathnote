/**
 * Visual review helper — deterministic screenshots of the running site.
 *
 *   node scripts/shoot.mjs [--base http://localhost:4173] [--path /] [--query gate=0]
 *     [--shots prologue:0,notebook:0.35] [--vw 1920] [--vh 1080] [--dpr 1]
 *     [--wait 1800] [--prefix name] [--headed] [--fullpage]
 *
 * A shot is `chapterId:progress` (progress through that chapter's sticky track,
 * 0..1), `y:<pixels>`, or `top`. Screenshots go to .artifacts/. Console errors,
 * failed requests and `window.__DN__` renderer stats (when ?debug) are printed.
 */
import { mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith('--')) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : 'true']);
    return acc;
  }, []),
);

const base = args.base ?? 'http://localhost:4173';
const path = args.path ?? '/';
const query = args.query ?? 'gate=0&debug';
const shots = (args.shots ?? 'top').split(',');
const vw = Number(args.vw ?? 1920);
const vh = Number(args.vh ?? 1080);
const dpr = Number(args.dpr ?? 1);
const wait = Number(args.wait ?? 1800);
const prefix = args.prefix ?? 'shot';
mkdirSync('.artifacts', { recursive: true });

const browser = await chromium.launch({
  channel: 'chrome',
  headless: args.headed !== 'true',
  args: ['--enable-gpu', '--ignore-gpu-blocklist', '--use-angle=d3d11', '--enable-unsafe-swiftshader'],
});
const context = await browser.newContext({
  viewport: { width: vw, height: vh },
  deviceScaleFactor: dpr,
  reducedMotion: args.reduced === 'true' ? 'reduce' : 'no-preference',
});
const page = await context.newPage();
const problems = [];
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') problems.push(`[${m.type()}] ${m.text()}`);
});
page.on('pageerror', (e) => problems.push(`[pageerror] ${e.message}`));
page.on('requestfailed', (r) => problems.push(`[requestfailed] ${r.url()} ${r.failure()?.errorText}`));

const url = `${base}${path}${query ? (path.includes('?') ? '&' : '?') + query : ''}`;
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

const renderer = await page.evaluate(() => {
  const gl = document.createElement('canvas').getContext('webgl2');
  if (!gl) return 'no webgl2';
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
});
console.log(`renderer: ${renderer}`);

for (const shot of shots) {
  const [what, val] = shot.split(':');
  await page.evaluate(
    ({ what, val }) => {
      let y = 0;
      if (what === 'y') y = Number(val);
      else if (what !== 'top') {
        const el = document.querySelector(`#chapter-${what} .chapter__track`) ?? document.getElementById(`chapter-${what}`);
        if (el) {
          const r = el.getBoundingClientRect();
          const top = r.top + window.scrollY;
          const p = Number(val ?? 0);
          y = el.classList.contains('chapter__track') ? top + p * Math.max(0, r.height - window.innerHeight) : top + p * r.height;
        }
      }
      window.scrollTo({ top: y, behavior: 'instant' });
    },
    { what, val },
  );
  await page.waitForTimeout(wait);
  const file = `.artifacts/${prefix}-${what}${val !== undefined ? '-' + val : ''}-${vw}x${vh}.png`;
  await page.screenshot({ path: file, fullPage: args.fullpage === 'true' });
  const stats = await page.evaluate(() => {
    const s = window.__DN__ ? { fps: window.__DN__.fps, calls: window.__DN__.calls, tris: window.__DN__.triangles, a: window.__DN__.a, b: window.__DN__.b, mix: window.__DN__.mix } : null;
    return JSON.stringify({ ...s, cam: window.__DN_CAM__, y: Math.round(window.scrollY) });
  });
  console.log(`${file}  ${stats}`);
}

if (problems.length) {
  console.log('\nConsole problems:');
  for (const p of [...new Set(problems)].slice(0, 30)) console.log('  ' + p);
} else console.log('\nNo console errors or warnings.');
await browser.close();
