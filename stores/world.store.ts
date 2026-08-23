import { create } from 'zustand';

export type Weather = 'clear' | 'rain' | 'storm';
export type AvatarMode = 'work' | 'travel' | 'creator';
export type CloudStyle = 'classic' | 'sunset' | 'storm';
export type CompanionKey = 'airplane' | 'birds' | 'aiCompanion';

export type AvatarState =
  | 'idle'
  | 'work-enter' | 'work-loop' | 'work-exit'
  | 'travel-enter' | 'travel-loop' | 'travel-exit'
  | 'creator-enter' | 'creator-loop' | 'creator-exit'
  | 'ai-listening'
  | 'celebrate'
  | 'footer-idle';

export interface WorldState {
  cloudDensity: number;
  cloudSize: number;
  cloudStyle: CloudStyle;
  weather: Weather;
  companions: {
    airplane: boolean;
    birds: boolean;
    aiCompanion: boolean;
  };
  avatarMode: AvatarMode;
  avatarState: AvatarState;

  setCloudDensity: (density: number) => void;
  setCloudSize: (size: number) => void;
  setCloudStyle: (style: CloudStyle) => void;
  setWeather: (weather: Weather) => void;
  setAvatarMode: (mode: AvatarMode) => void;
  setAvatarState: (state: AvatarState) => void;
  toggleCompanion: (companion: CompanionKey) => void;
  surpriseMe: () => void;
  reset: () => void;
}

const defaultState = {
  cloudDensity: 0.5,
  cloudSize: 1.0,
  cloudStyle: 'classic' as CloudStyle,
  weather: 'clear' as Weather,
  companions: {
    airplane: true,
    birds: true,
    aiCompanion: true,
  },
  avatarMode: 'work' as AvatarMode,
  avatarState: 'idle' as AvatarState,
};

const weathers: Weather[] = ['clear', 'rain', 'storm'];
const modes: AvatarMode[] = ['work', 'travel', 'creator'];
const styles: CloudStyle[] = ['classic', 'sunset', 'storm'];

export const useWorldStore = create<WorldState>((set) => ({
  ...defaultState,

  setCloudDensity: (density) => set({ cloudDensity: Math.max(0, Math.min(1, density)) }),
  setCloudSize: (size) => set({ cloudSize: Math.max(0.5, Math.min(2, size)) }),
  setCloudStyle: (style) => set({ cloudStyle: style }),
  setWeather: (weather) => set({ weather }),
  setAvatarMode: (mode) => set({ avatarMode: mode }),
  setAvatarState: (state) => set({ avatarState: state }),

  toggleCompanion: (companion) =>
    set((s) => ({
      companions: {
        ...s.companions,
        [companion]: !s.companions[companion],
      },
    })),

  surpriseMe: () =>
    set({
      cloudDensity: Math.random(),
      cloudSize: 0.5 + Math.random() * 1.5,
      cloudStyle: styles[Math.floor(Math.random() * styles.length)],
      weather: weathers[Math.floor(Math.random() * weathers.length)],
      companions: {
        airplane: Math.random() > 0.3,
        birds: Math.random() > 0.3,
        aiCompanion: Math.random() > 0.3,
      },
      avatarMode: modes[Math.floor(Math.random() * modes.length)],
    }),

  reset: () => set(defaultState),
}));
