/**
 * Self-hosted fonts (SIL OFL 1.1, see docs/ASSET_REGISTER.md). Variable fonts
 * ship unicode-range subsets, so browsers download only the glyph ranges used.
 */
import '@fontsource-variable/cormorant-garamond/wght.css';
import '@fontsource-variable/cormorant-garamond/wght-italic.css';
import '@fontsource-variable/inter/wght.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import '@fontsource/nothing-you-could-do/latin-400.css';
import '@fontsource-variable/caveat/wght.css';
import '@fontsource/unifrakturmaguntia/latin-400.css';
import '@fontsource-variable/noto-serif-jp/wght.css';

/** Families that WebGL canvas textures depend on; awaited before drawing text into textures. */
export const CANVAS_FONTS = [
  '400 64px "UnifrakturMaguntia"',
  '400 64px "Nothing You Could Do"',
  '500 64px "Cormorant Garamond Variable"',
  '500 32px "IBM Plex Mono"',
] as const;

export async function ensureCanvasFonts(): Promise<void> {
  if (!document.fonts) return;
  await Promise.all(CANVAS_FONTS.map((f) => document.fonts.load(f).catch(() => [])));
}
