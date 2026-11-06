import { useId } from 'react';
import type { QualityPreference } from '@/scenes/shared/quality';
import { useRuntime } from '@/state/runtime';
import { useSettings, type MotionPreference } from '@/state/settings';

/** Visitor controls: sound, motion and render quality (SPEC §11.2, §12). */
export function SettingsPanel() {
  const sound = useSettings((s) => s.soundEnabled);
  const setSound = useSettings((s) => s.setSound);
  const motion = useSettings((s) => s.motion);
  const setMotion = useSettings((s) => s.setMotion);
  const quality = useSettings((s) => s.quality);
  const setQuality = useSettings((s) => s.setQuality);
  const tier = useRuntime((s) => s.tier);
  const webgl = useRuntime((s) => s.webgl);
  const audioError = useRuntime((s) => s.audioError);

  return (
    <section className="settings" aria-label="Settings">
      <p className="settings__title mono-label">Settings</p>

      <Choice<'off' | 'on'>
        legend="Sound"
        value={sound ? 'on' : 'off'}
        options={[
          ['off', 'Off'],
          ['on', 'On'],
        ]}
        disabled={!!audioError}
        hint={audioError ?? 'Original ambient sound design. Off by default.'}
        onChange={(v) => setSound(v === 'on')}
      />

      <Choice<MotionPreference>
        legend="Motion"
        value={motion}
        options={[
          ['system', 'System'],
          ['reduce', 'Reduced'],
          ['full', 'Full'],
        ]}
        hint="Reduced motion removes camera travel and parallax; scenes cross-fade instead."
        onChange={setMotion}
      />

      <Choice<QualityPreference>
        legend="Visual quality"
        value={quality}
        options={[
          ['auto', 'Auto'],
          ['high', 'High'],
          ['balanced', 'Balanced'],
          ['performance', 'Performance'],
        ]}
        disabled={webgl === 'unsupported' || webgl === 'failed'}
        hint={
          webgl === 'unsupported' || webgl === 'failed'
            ? '3D is unavailable in this browser; the illustrated version is shown.'
            : `Currently rendering at “${tier}”.`
        }
        onChange={setQuality}
      />
    </section>
  );
}

function Choice<T extends string>({
  legend,
  value,
  options,
  hint,
  disabled,
  onChange,
}: {
  legend: string;
  value: T;
  options: ReadonlyArray<readonly [T, string]>;
  hint?: string;
  disabled?: boolean;
  onChange: (v: T) => void;
}) {
  const name = useId();
  const hintId = `${name}-hint`;
  return (
    <fieldset className="choice" disabled={disabled} aria-describedby={hint ? hintId : undefined}>
      <legend className="choice__legend">{legend}</legend>
      <div className="choice__options">
        {options.map(([v, label]) => (
          <label key={v} className="choice__option">
            <input
              type="radio"
              name={name}
              value={v}
              checked={value === v}
              onChange={() => onChange(v)}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
      {hint ? (
        <p id={hintId} className="choice__hint">
          {hint}
        </p>
      ) : null}
    </fieldset>
  );
}
