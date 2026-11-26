let sharedAudioCtx: AudioContext | null = null;

const getOrCreateAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioCtx();
  }
  return sharedAudioCtx;
};

export const isAudioUnlocked = (): boolean =>
  Boolean(sharedAudioCtx && sharedAudioCtx.state === 'running');

export const unlockAudioContext = async (): Promise<boolean> => {
  try {
    const ctx = getOrCreateAudioContext();
    if (!ctx) return false;
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    return ctx.state === 'running';
  } catch {
    return false;
  }
};

export const playNewOrderChime = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  try {
    const ctx = getOrCreateAudioContext();
    if (!ctx) return false;

    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        return false;
      }
    }

    if (ctx.state !== 'running') {
      return false;
    }

    const now = ctx.currentTime;
    const notes = [
      { freq: 880, start: 0, duration: 0.14 },
      { freq: 1174.66, start: 0.13, duration: 0.22 },
    ];

    notes.forEach(({ freq, start, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + start);

      gain.gain.setValueAtTime(0.001, now + start);
      gain.gain.exponentialRampToValueAtTime(0.14, now + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + duration + 0.02);
    });
    return true;
  } catch {
    return false;
  }
};
