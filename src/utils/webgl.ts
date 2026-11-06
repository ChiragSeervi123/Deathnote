/**
 * WebGL2 capability probe. The stage requires WebGL2 (float render targets,
 * MSAA targets). Anything less gets the designed 2D fallback (SPEC §11.4).
 */
export type WebGLSupport = { ok: true; renderer: string } | { ok: false; reason: string };

let cached: WebGLSupport | null = null;

export function probeWebGL2(): WebGLSupport {
  if (cached) return cached;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false });
    if (!gl) {
      cached = { ok: false, reason: 'WebGL2 is not available in this browser.' };
      return cached;
    }
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = ext
      ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL))
      : String(gl.getParameter(gl.RENDERER));
    const hasFloatRT =
      !!gl.getExtension('EXT_color_buffer_float') ||
      !!gl.getExtension('EXT_color_buffer_half_float');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    cached = hasFloatRT
      ? { ok: true, renderer }
      : { ok: false, reason: 'This GPU cannot render to floating-point targets.' };
    return cached;
  } catch (err) {
    cached = { ok: false, reason: err instanceof Error ? err.message : 'WebGL probe failed.' };
    return cached;
  }
}

/** Software rasterisers are functional but slow — treat them as low-end. */
export function isSoftwareRenderer(renderer: string): boolean {
  return /swiftshader|llvmpipe|software|basic render/i.test(renderer);
}
