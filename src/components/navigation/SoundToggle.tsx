import { useRuntime } from '@/state/runtime';
import { useSettings } from '@/state/settings';
import { SoundIcon } from './icons';

/** Sound is off by default and can be muted instantly (SPEC §12, §15). */
export function SoundToggle({ className = '' }: { className?: string }) {
  const on = useSettings((s) => s.soundEnabled);
  const setSound = useSettings((s) => s.setSound);
  const audioError = useRuntime((s) => s.audioError);

  return (
    <button
      type="button"
      className={`chrome-button ${className}`}
      aria-pressed={on}
      disabled={!!audioError}
      title={audioError ?? undefined}
      onClick={() => setSound(!on)}
    >
      <SoundIcon on={on} />
      <span className="chrome-button__label">
        {audioError ? 'Sound unavailable' : on ? 'Sound on' : 'Sound off'}
      </span>
    </button>
  );
}
