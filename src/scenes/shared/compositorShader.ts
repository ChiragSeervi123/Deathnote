import type { TransitionKind } from '@/chapters/types';
import { NOISE_GLSL } from '@/shaders/noise.glsl.ts';

/** Transition kinds → shader branch index. */
export const TRANSITION_INDEX: Record<TransitionKind, number> = {
  cut: 0,
  fade: 1,
  ink: 2,
  smoke: 3,
  pageTurn: 4,
  redToBlue: 5,
  silhouette: 6,
  close: 7,
  split: 8,
};

export const compositorVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

/**
 * Blends two scene render targets with a narrative transition and applies a
 * per-scene grade. Output stays linear HDR; tone mapping happens in PostFX.
 */
export const compositorFragment = /* glsl */ `
precision highp float;
uniform sampler2D tA;
uniform sampler2D tB;
uniform float uMix;
uniform int uKind;
uniform float uTime;
uniform vec2 uRes;
uniform float uDimA;
uniform float uDimB;
uniform vec3 uGradeA; // exposure, contrast, saturation
uniform vec3 uGradeB;
uniform vec3 uTintA;
uniform vec3 uTintB;
uniform vec3 uLiftA;
uniform vec3 uLiftB;
varying vec2 vUv;

${NOISE_GLSL}

vec3 grade(vec3 c, vec3 g, vec3 tint, vec3 lift) {
  c = max(c * g.x, vec3(0.0));
  float l = luma(c);
  c = mix(vec3(l), c, g.z);
  vec3 lc = log2(c + 1e-4) - log2(0.18);
  c = exp2(lc * g.y + log2(0.18)) - 1e-4;
  return max(c * tint + lift, vec3(0.0));
}

float dissolve(float x, float e, float w) { return smoothstep(e - w, e + w, x); }

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
  vec3 a = grade(texture2D(tA, uv).rgb, uGradeA, uTintA, uLiftA) * (1.0 - uDimA);
  vec3 b = grade(texture2D(tB, uv).rgb, uGradeB, uTintB, uLiftB) * (1.0 - uDimB);
  float t = clamp(uMix, 0.0, 1.0);
  vec3 col = b;

  if (t <= 0.0) {
    col = a;
  } else if (t >= 1.0) {
    col = b;
  } else if (uKind == 0) {
    col = t < 0.5 ? a : b;
  } else if (uKind == 1) {
    float k = smoothstep(0.0, 1.0, t);
    col = mix(a, b, k) * (1.0 - 0.4 * sin(3.14159265 * k));
  } else if (uKind == 2) {
    // Ink: a blot blooms from the centre with a dark, bleeding rim.
    float n = fbm(p * 3.4 + vec2(1.7, uTime * 0.015));
    float field = 1.0 - length(p * vec2(0.85, 1.15)) * 0.95 + (n - 0.5) * 0.8;
    float thr = 1.2 - t * 2.0;
    float m = smoothstep(thr, thr + 0.03, field);
    float rim = smoothstep(thr - 0.12, thr, field) * (1.0 - m);
    col = mix(a, b, m);
    col *= 1.0 - rim * 0.96;
  } else if (uKind == 3) {
    // Smoke: A dissolves upward into darkness; B condenses out of it.
    float h = fbm(vec2(p.x * 2.6, p.y * 1.7 - uTime * 0.05) + 3.0) * 0.8 + (0.5 - uv.y) * 0.35;
    float h2 = fbm(vec2(p.x * 2.2 + 7.0, p.y * 1.5 + uTime * 0.04)) * 0.85 + uv.y * 0.25;
    float ea = mix(-0.2, 1.2, smoothstep(0.0, 0.6, t));
    float eb = mix(-0.2, 1.2, smoothstep(0.4, 1.0, t));
    float keepA = dissolve(h, ea, 0.12);
    float showB = 1.0 - dissolve(h2, eb, 0.12);
    float haze = (1.0 - abs(h - ea) / 0.18) * (1.0 - keepA * 0.5);
    col = mix(a * keepA, b, showB);
    col += vec3(0.035, 0.034, 0.032) * clamp(haze, 0.0, 1.0) * (1.0 - showB);
  } else if (uKind == 4) {
    // Page turn: a slightly diagonal fold sweeps right → left.
    vec2 dir = normalize(vec2(1.0, 0.18));
    float x = dot(vec2(uv.x * aspect, uv.y), dir) / (aspect * 1.02 + 0.18);
    float e = mix(1.08, -0.1, t);
    if (x > e) {
      float shadow = 1.0 - 0.7 * exp(-(x - e) * 16.0);
      col = b * shadow;
    } else {
      float c = clamp((e - x) / 0.07, 0.0, 1.0);
      vec3 back = vec3(0.86, 0.83, 0.77) * 0.09 * (0.6 + 0.4 * c);
      col = mix(back, a, smoothstep(0.0, 1.0, c));
      col += vec3(0.25) * exp(-(e - x) * 90.0);
    }
  } else if (uKind == 5) {
    // Red → blue: a light sweep that turns the scene's temperature.
    float n = fbm(p * 2.0 + 4.0) - 0.5;
    float s = uv.x * 0.8 + 0.1 + n * 0.18;
    float e = mix(-0.25, 1.25, t);
    float m = smoothstep(e - 0.22, e + 0.22, 1.0 - s);
    float band = 1.0 - abs(m - 0.5) * 2.0;
    col = mix(a, b, 1.0 - m);
    vec3 temp = mix(vec3(1.5, 0.32, 0.36), vec3(0.4, 0.62, 1.5), smoothstep(0.2, 0.8, t));
    col = mix(col, col * temp + temp * 0.006, band * 0.65);
  } else if (uKind == 6) {
    // Silhouette reveal: A sinks into black; B's brightest edges (rim light, eyes) appear first.
    float fadeA = 1.0 - smoothstep(0.0, 0.45, t);
    float lb = clamp(luma(b) * 3.0, 0.0, 1.0);
    float e = 1.0 - smoothstep(0.15, 1.0, t) * 1.15;
    float m = smoothstep(e - 0.12, e + 0.12, lb + (fbm(p * 5.0) - 0.5) * 0.15);
    m = max(m, smoothstep(0.8, 1.0, t));
    col = mix(a * fadeA, b, m);
  } else if (uKind == 7) {
    // Close: covers swing in from both sides to the spine, then open onto B.
    float w = 0.5 * (1.0 - abs(2.0 * t - 1.0));
    w = smoothstep(0.0, 0.5, w) * 0.5;
    float dx = abs(uv.x - 0.5);
    vec3 inner = t < 0.5 ? a : b;
    if (dx > 0.5 - w) {
      float edge = (dx - (0.5 - w)) / max(w, 1e-3);
      col = vec3(0.012) * (0.6 + 0.4 * edge) + vec3(0.05) * exp(-edge * 30.0);
    } else {
      float sh = exp(-((0.5 - w) - dx) * 14.0);
      col = inner * (1.0 - 0.75 * sh * step(0.001, w));
    }
  } else if (uKind == 8) {
    // Split: two halves wipe in opposite directions (Near / Mello).
    float n = (fbm(vec2(uv.x * 6.0, uTime * 0.05)) - 0.5) * 0.06;
    float e = mix(-0.1, 1.1, t);
    float mL = smoothstep(e - 0.02, e + 0.02, 1.0 - uv.y + n);
    float mR = smoothstep(e - 0.02, e + 0.02, uv.y + n);
    float m = uv.x < 0.5 ? mL : mR;
    col = mix(a, b, 1.0 - m);
    col += vec3(0.4) * exp(-abs(uv.x - 0.5) * 400.0) * (1.0 - abs(2.0 * t - 1.0));
  }

  gl_FragColor = vec4(col, 1.0);
}
`;
