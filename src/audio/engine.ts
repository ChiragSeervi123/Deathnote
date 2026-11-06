/**
 * Procedural sound design (SPEC §15): every sound is synthesised at runtime
 * with WebAudio — no recordings, no licensing questions. Off by default; the
 * context is created only after the visitor turns sound on.
 */

export type Bed = 'drone' | 'wind' | 'rain' | 'room' | 'hum';
export type Cue = 'page' | 'pencil' | 'close' | 'impact';
export type BedMix = Partial<Record<Bed, number>>;

const BEDS: readonly Bed[] = ['drone', 'wind', 'rain', 'room', 'hum'];

function noiseBuffer(
  ctx: AudioContext,
  seconds: number,
  color: 'white' | 'pink' | 'brown',
): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let b0 = 0,
      b1 = 0,
      b2 = 0,
      last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (color === 'white') d[i] = w * 0.5;
      else if (color === 'pink') {
        b0 = 0.99765 * b0 + w * 0.099046;
        b1 = 0.963 * b1 + w * 0.2965164;
        b2 = 0.57 * b2 + w * 1.0526913;
        d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.11;
      } else {
        last = (last + 0.02 * w) / 1.02;
        d[i] = last * 3.2;
      }
    }
    // Cross-fade the loop seam.
    const fade = Math.floor(ctx.sampleRate * 0.05);
    for (let i = 0; i < fade; i++) {
      const k = i / fade;
      d[i] = d[i]! * k + d[len - fade + i]! * (1 - k);
    }
  }
  return buf;
}

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private beds = new Map<Bed, GainNode>();
  private white: AudioBuffer | null = null;
  private enabled = false;
  private mix: BedMix = { drone: 0.6 };

  /** Throws if WebAudio is unavailable; callers surface the error. */
  private ensure(): AudioContext {
    if (this.ctx) return this.ctx;
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) throw new Error('Web Audio is not supported in this browser.');
    const ctx = new Ctor({ latencyHint: 'playback' });
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 3;
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(comp).connect(ctx.destination);
    this.ctx = ctx;
    this.master = master;
    this.white = noiseBuffer(ctx, 4, 'white');
    this.buildBeds(ctx, master);
    return ctx;
  }

  private loop(ctx: AudioContext, buffer: AudioBuffer): AudioBufferSourceNode {
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    src.start(0, Math.random() * buffer.duration);
    return src;
  }

  private lfo(ctx: AudioContext, freq: number, depth: number, target: AudioParam): void {
    const o = ctx.createOscillator();
    o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.value = depth;
    o.connect(g).connect(target);
    o.start();
  }

  private buildBeds(ctx: AudioContext, out: AudioNode): void {
    const mk = (bed: Bed) => {
      const g = ctx.createGain();
      g.gain.value = 0;
      g.connect(out);
      this.beds.set(bed, g);
      return g;
    };

    // Drone: detuned low partials through a breathing low-pass.
    {
      const g = mk('drone');
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 240;
      lp.Q.value = 0.7;
      lp.connect(g);
      this.lfo(ctx, 0.05, 90, lp.frequency);
      for (const [f, type, v] of [
        [55, 'sawtooth', 0.05],
        [55.35, 'sawtooth', 0.05],
        [82.4, 'triangle', 0.035],
        [36.7, 'sine', 0.18],
      ] as const) {
        const o = ctx.createOscillator();
        o.type = type;
        o.frequency.value = f;
        const og = ctx.createGain();
        og.gain.value = v;
        o.connect(og).connect(lp);
        o.start();
      }
    }

    // Wind: pink noise through a wandering band-pass.
    {
      const g = mk('wind');
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 520;
      bp.Q.value = 0.9;
      const amp = ctx.createGain();
      amp.gain.value = 0.5;
      this.loop(ctx, noiseBuffer(ctx, 6, 'pink'))
        .connect(bp)
        .connect(amp)
        .connect(g);
      this.lfo(ctx, 0.07, 260, bp.frequency);
      this.lfo(ctx, 0.11, 0.25, amp.gain);
    }

    // Rain: bright filtered noise, gently modulated.
    {
      const g = mk('rain');
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 900;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 6500;
      const amp = ctx.createGain();
      amp.gain.value = 0.35;
      this.loop(ctx, noiseBuffer(ctx, 5, 'white'))
        .connect(hp)
        .connect(lp)
        .connect(amp)
        .connect(g);
      this.lfo(ctx, 0.3, 0.05, amp.gain);
    }

    // Room tone: very low brown noise.
    {
      const g = mk('room');
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 180;
      const amp = ctx.createGain();
      amp.gain.value = 0.9;
      this.loop(ctx, noiseBuffer(ctx, 6, 'brown'))
        .connect(lp)
        .connect(amp)
        .connect(g);
    }

    // Electrical hum: monitors and fluorescent rooms.
    {
      const g = mk('hum');
      for (const [f, v] of [
        [100, 0.03],
        [200, 0.012],
        [300, 0.006],
      ] as const) {
        const o = ctx.createOscillator();
        o.frequency.value = f;
        const og = ctx.createGain();
        og.gain.value = v;
        o.connect(og).connect(g);
        o.start();
      }
    }
  }

  async setEnabled(on: boolean): Promise<void> {
    this.enabled = on;
    if (!on) {
      if (!this.ctx || !this.master) return;
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setTargetAtTime(0, t, 0.12);
      window.setTimeout(() => {
        if (!this.enabled) void this.ctx?.suspend();
      }, 700);
      return;
    }
    const ctx = this.ensure();
    if (ctx.state !== 'running') await ctx.resume();
    const t = ctx.currentTime;
    this.master!.gain.cancelScheduledValues(t);
    this.master!.gain.setTargetAtTime(0.55, t, 0.6);
    this.applyMix(1.2);
  }

  setMix(mix: BedMix): void {
    this.mix = mix;
    if (this.enabled) this.applyMix(1.8);
  }

  private applyMix(seconds: number): void {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    for (const bed of BEDS) {
      const g = this.beds.get(bed);
      if (!g) continue;
      g.gain.cancelScheduledValues(t);
      g.gain.setTargetAtTime(this.mix[bed] ?? 0, t, seconds / 3);
    }
  }

  /** Short one-shot cues for interactions (page turns, pencil, closing). */
  cue(kind: Cue): void {
    if (!this.enabled || !this.ctx || !this.master || !this.white) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.white;
    const f = ctx.createBiquadFilter();
    const g = ctx.createGain();
    g.gain.value = 0;
    src.connect(f).connect(g).connect(this.master);
    const off = Math.random() * 3;
    if (kind === 'page') {
      f.type = 'bandpass';
      f.frequency.setValueAtTime(1800, t);
      f.frequency.exponentialRampToValueAtTime(5200, t + 0.18);
      f.Q.value = 0.8;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.32, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
      src.start(t, off, 0.35);
    } else if (kind === 'pencil') {
      f.type = 'bandpass';
      f.frequency.value = 3800;
      f.Q.value = 3;
      for (let i = 0; i < 6; i++) {
        const s = t + i * 0.07;
        g.gain.setValueAtTime(0.0, s);
        g.gain.linearRampToValueAtTime(0.12 + Math.random() * 0.06, s + 0.015);
        g.gain.linearRampToValueAtTime(0.0, s + 0.06);
      }
      src.start(t, off, 0.45);
    } else {
      f.type = 'lowpass';
      f.frequency.value = kind === 'close' ? 420 : 260;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(kind === 'close' ? 0.7 : 0.5, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      src.start(t, off, 0.55);
      const o = ctx.createOscillator();
      o.frequency.setValueAtTime(70, t);
      o.frequency.exponentialRampToValueAtTime(38, t + 0.4);
      const og = ctx.createGain();
      og.gain.setValueAtTime(0.4, t);
      og.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      o.connect(og).connect(this.master);
      o.start(t);
      o.stop(t + 0.5);
    }
  }

  dispose(): void {
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
    this.beds.clear();
  }
}

/** Ambient mix per scene. */
export const SCENE_MIX: Record<string, BedMix> = {
  prologue: { drone: 0.7, wind: 0.55, rain: 0.12 },
  notebook: { room: 0.45, rain: 0.42, drone: 0.15 },
  realm: { drone: 0.8, wind: 0.65 },
  light: { room: 0.5, drone: 0.3 },
  kira: { drone: 0.5, rain: 0.2, hum: 0.2 },
  'l-room': { hum: 0.6, room: 0.4, drone: 0.25 },
  investigation: { hum: 0.4, drone: 0.35 },
  misa: { drone: 0.55, wind: 0.2 },
  confinement: { hum: 0.55, room: 0.45 },
  yotsuba: { room: 0.4, drone: 0.3, wind: 0.15 },
  rain: { rain: 0.85, drone: 0.2 },
  wammy: { room: 0.45, wind: 0.2 },
  'new-kira': { drone: 0.6, hum: 0.2 },
  strategy: { hum: 0.4, drone: 0.4 },
  warehouse: { wind: 0.35, room: 0.5, drone: 0.35 },
  fall: { wind: 0.4, drone: 0.5 },
  archive: { room: 0.35 },
  eyes: { drone: 0.4 },
  legacy: { room: 0.3, drone: 0.25 },
  tribute: { room: 0.35 },
};

let engine: AudioEngine | null = null;
export function getAudioEngine(): AudioEngine {
  engine ??= new AudioEngine();
  return engine;
}

/** Fire-and-forget cue; silent when sound is off. */
export function audioCue(kind: Cue): void {
  engine?.cue(kind);
}
