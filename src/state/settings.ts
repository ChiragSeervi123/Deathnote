import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { QualityPreference } from '@/scenes/shared/quality';
import { safeStorage } from '@/utils/storage';
import { urlFlags } from '@/utils/urlFlags';

export type MotionPreference = 'system' | 'reduce' | 'full';

interface SettingsState {
  quality: QualityPreference;
  motion: MotionPreference;
  spoilerAccepted: boolean;
  /** Sound is OFF by default and never persisted (SPEC §12). */
  soundEnabled: boolean;
  setQuality: (q: QualityPreference) => void;
  setMotion: (m: MotionPreference) => void;
  acceptSpoilers: () => void;
  setSound: (on: boolean) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      quality: urlFlags.quality ?? 'auto',
      motion: urlFlags.motion ?? 'system',
      spoilerAccepted: !urlFlags.gate,
      soundEnabled: false,
      setQuality: (quality) => set({ quality }),
      setMotion: (motion) => set({ motion }),
      acceptSpoilers: () => set({ spoilerAccepted: true }),
      setSound: (soundEnabled) => set({ soundEnabled }),
    }),
    {
      name: 'dn-settings',
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      partialize: (s) => ({ quality: s.quality, motion: s.motion, spoilerAccepted: s.spoilerAccepted }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<SettingsState>;
        return {
          ...current,
          ...p,
          // URL flags always win for QA reproducibility.
          quality: urlFlags.quality ?? p.quality ?? current.quality,
          motion: urlFlags.motion ?? p.motion ?? current.motion,
          spoilerAccepted: !urlFlags.gate || (p.spoilerAccepted ?? false),
          soundEnabled: false,
        };
      },
    },
  ),
);
