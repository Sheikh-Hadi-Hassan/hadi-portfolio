"use client";

import { Volume1, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type AudioEngine = {
  context: AudioContext;
  musicGain: GainNode;
  sfxGain: GainNode;
  padOscillators: OscillatorNode[];
  sources: AudioScheduledSourceNode[];
  intervals: number[];
};

const VOLUME_STEPS = [0.18, 0.34, 0.5, 0.66];
const PAD_CHORDS = [
  [55, 82.41, 110, 164.81],
  [49, 73.42, 98, 146.83],
  [43.65, 65.41, 87.31, 130.81],
  [55, 82.41, 110, 138.59],
];

function voiceLine(message: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const line = new SpeechSynthesisUtterance(message);
  line.rate = 0.9;
  line.pitch = 0.82;
  line.volume = 0.62;
  window.speechSynthesis.speak(line);
}

function envelopeTone(
  context: AudioContext,
  destination: AudioNode,
  frequency: number,
  start: number,
  duration: number,
  level: number,
  type: OscillatorType = "sine",
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(level, start + Math.min(0.09, duration * 0.22));
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

export function SoundDock() {
  const engineRef = useRef<AudioEngine | null>(null);
  const musicEnabledRef = useRef(true);
  const volumeIndexRef = useRef(1);
  const arrivalSpokenRef = useRef(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [volumeIndex, setVolumeIndex] = useState(1);
  const [started, setStarted] = useState(false);

  const setMusicLevel = useCallback((engine: AudioEngine, enabled = musicEnabledRef.current, index = volumeIndexRef.current) => {
    const now = engine.context.currentTime;
    engine.musicGain.gain.cancelScheduledValues(now);
    engine.musicGain.gain.setTargetAtTime(enabled ? VOLUME_STEPS[index] : 0.0001, now, 0.18);
  }, []);

  const createEngine = useCallback(() => {
    const context = new AudioContext();
    const musicGain = context.createGain();
    const sfxGain = context.createGain();
    const compressor = context.createDynamicsCompressor();
    const musicFilter = context.createBiquadFilter();
    const padOscillators: OscillatorNode[] = [];
    const sources: AudioScheduledSourceNode[] = [];
    const intervals: number[] = [];

    musicGain.gain.value = 0.0001;
    sfxGain.gain.value = 0.42;
    compressor.threshold.value = -17;
    compressor.knee.value = 18;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.01;
    compressor.release.value = 0.24;
    musicFilter.type = "lowpass";
    musicFilter.frequency.value = 980;
    musicFilter.Q.value = 0.65;

    musicFilter.connect(musicGain).connect(compressor).connect(context.destination);
    sfxGain.connect(compressor);

    PAD_CHORDS[0].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = index === 0 ? "sine" : "triangle";
      oscillator.frequency.value = frequency;
      oscillator.detune.value = index * 2.5 - 3;
      gain.gain.value = index === 0 ? 0.09 : 0.026;
      oscillator.connect(gain).connect(musicFilter);
      oscillator.start();
      padOscillators.push(oscillator);
      sources.push(oscillator);
    });

    const lfo = context.createOscillator();
    const lfoGain = context.createGain();
    lfo.type = "sine";
    lfo.frequency.value = 0.055;
    lfoGain.gain.value = 210;
    lfo.connect(lfoGain).connect(musicFilter.frequency);
    lfo.start();
    sources.push(lfo);

    const noiseBuffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const noise = noiseBuffer.getChannelData(0);
    for (let index = 0; index < noise.length; index += 1) noise[index] = (Math.random() * 2 - 1) * 0.34;
    const noiseSource = context.createBufferSource();
    const noiseFilter = context.createBiquadFilter();
    const noiseGain = context.createGain();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 420;
    noiseFilter.Q.value = 0.45;
    noiseGain.gain.value = 0.008;
    noiseSource.connect(noiseFilter).connect(noiseGain).connect(musicFilter);
    noiseSource.start();
    sources.push(noiseSource);

    let chordIndex = 0;
    intervals.push(window.setInterval(() => {
      chordIndex = (chordIndex + 1) % PAD_CHORDS.length;
      const now = context.currentTime;
      padOscillators.forEach((oscillator, index) => {
        oscillator.frequency.exponentialRampToValueAtTime(PAD_CHORDS[chordIndex][index], now + 3.2);
      });
    }, 11800));

    const shimmer = [220, 277.18, 329.63, 415.3, 329.63, 246.94];
    let shimmerIndex = 0;
    intervals.push(window.setInterval(() => {
      if (context.state !== "running") return;
      envelopeTone(context, musicFilter, shimmer[shimmerIndex % shimmer.length], context.currentTime, 3.4, 0.018, "sine");
      shimmerIndex += 1;
    }, 4300));

    const engine = { context, musicGain, sfxGain, padOscillators, sources, intervals };
    engineRef.current = engine;
    setStarted(true);
    return engine;
  }, []);

  const ensureEngine = useCallback(async () => {
    const engine = engineRef.current ?? createEngine();
    if (engine.context.state === "suspended") await engine.context.resume();
    setMusicLevel(engine);
    return engine;
  }, [createEngine, setMusicLevel]);

  const playClick = useCallback((engine: AudioEngine, clientX = window.innerWidth / 2) => {
    const { context, sfxGain } = engine;
    const now = context.currentTime;
    const pan = context.createStereoPanner();
    pan.pan.value = Math.max(-0.55, Math.min(0.55, (clientX / window.innerWidth) * 1.1 - 0.55));
    pan.connect(sfxGain);

    const low = context.createOscillator();
    const lowGain = context.createGain();
    low.type = "sine";
    low.frequency.setValueAtTime(540, now);
    low.frequency.exponentialRampToValueAtTime(330, now + 0.085);
    lowGain.gain.setValueAtTime(0.075, now);
    lowGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.105);
    low.connect(lowGain).connect(pan);
    low.start(now);
    low.stop(now + 0.11);

    envelopeTone(context, pan, 1120, now + 0.012, 0.12, 0.032, "sine");
  }, []);

  const playSuccess = useCallback((engine: AudioEngine) => {
    const now = engine.context.currentTime;
    [392, 523.25, 659.25].forEach((frequency, index) => {
      envelopeTone(engine.context, engine.sfxGain, frequency, now + index * 0.105, 0.48, 0.075, index === 0 ? "triangle" : "sine");
    });
  }, []);

  useEffect(() => {
    const savedPreference = window.localStorage.getItem("hadi-music-enabled-v3");
    const savedVolumePreference = window.localStorage.getItem("hadi-sound-volume-v3");
    const savedVolume = Number(savedVolumePreference);
    const initialEnabled = savedPreference !== "off";
    const initialVolume = savedVolumePreference !== null && Number.isInteger(savedVolume) && savedVolume >= 0 && savedVolume < VOLUME_STEPS.length ? savedVolume : 1;
    const frame = window.requestAnimationFrame(() => {
      musicEnabledRef.current = initialEnabled;
      volumeIndexRef.current = initialVolume;
      setMusicEnabled(initialEnabled);
      setVolumeIndex(initialVolume);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    musicEnabledRef.current = musicEnabled;
    window.localStorage.setItem("hadi-music-enabled-v3", musicEnabled ? "on" : "off");
    if (engineRef.current) setMusicLevel(engineRef.current, musicEnabled, volumeIndexRef.current);
  }, [musicEnabled, setMusicLevel]);

  useEffect(() => {
    volumeIndexRef.current = volumeIndex;
    window.localStorage.setItem("hadi-sound-volume-v3", String(volumeIndex));
    if (engineRef.current) setMusicLevel(engineRef.current, musicEnabledRef.current, volumeIndex);
  }, [volumeIndex, setMusicLevel]);

  useEffect(() => {
    const activate = (event: PointerEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && !["Enter", " ", "Tab"].includes(event.key)) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest(".sound-dock")) return;

      void ensureEngine().then((engine) => {
        const interactive = target?.closest("a, button, summary");
        if (interactive) playClick(engine, event instanceof PointerEvent ? event.clientX : window.innerWidth / 2);

        const contactLink = target?.closest('a[href="/contact"]');
        if (contactLink && !arrivalSpokenRef.current) {
          arrivalSpokenRef.current = true;
          voiceLine("Project room ready.");
        }
      });
    };

    const success = () => {
      void ensureEngine().then((engine) => {
        playSuccess(engine);
        voiceLine("Brief delivered. Thank you.");
      });
    };

    document.addEventListener("pointerdown", activate, { capture: true });
    document.addEventListener("keydown", activate, { capture: true });
    window.addEventListener("hadi:sound-success", success);
    return () => {
      document.removeEventListener("pointerdown", activate, { capture: true });
      document.removeEventListener("keydown", activate, { capture: true });
      window.removeEventListener("hadi:sound-success", success);
    };
  }, [ensureEngine, playClick, playSuccess]);

  useEffect(() => () => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.intervals.forEach((interval) => window.clearInterval(interval));
    engine.sources.forEach((source) => {
      try { source.stop(); } catch { /* source already stopped */ }
    });
    void engine.context.close();
  }, []);

  const toggleMusic = async () => {
    const engine = await ensureEngine();
    playClick(engine);
    const next = !musicEnabledRef.current;
    musicEnabledRef.current = next;
    setMusicEnabled(next);
    setMusicLevel(engine, next, volumeIndexRef.current);
  };

  const changeVolume = async (difference: number) => {
    const next = Math.max(0, Math.min(VOLUME_STEPS.length - 1, volumeIndexRef.current + difference));
    if (next === volumeIndexRef.current) return;
    const engine = await ensureEngine();
    playClick(engine);
    volumeIndexRef.current = next;
    setVolumeIndex(next);
    setMusicLevel(engine, musicEnabledRef.current, next);
  };

  const status = musicEnabled ? (started ? `Music level ${volumeIndex + 1}` : "Starts on first interaction") : "Music muted · interactions live";

  return (
    <aside className={`sound-dock${musicEnabled ? " is-on" : ""}`} aria-label="Sound experience controls">
      <button className="sound-toggle" type="button" onClick={toggleMusic} aria-pressed={musicEnabled} title={status}>
        {!musicEnabled ? <VolumeX aria-hidden="true" /> : volumeIndex < 2 ? <Volume1 aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
        <span><strong>Music</strong><small>{status}</small></span>
      </button>
      <div className="sound-level" aria-label={`Music volume level ${volumeIndex + 1} of ${VOLUME_STEPS.length}`}>
        {VOLUME_STEPS.map((_, index) => <span className={musicEnabled && index <= volumeIndex ? "active" : ""} key={index} />)}
      </div>
      <div className="sound-volume">
        <button type="button" onClick={() => void changeVolume(-1)} aria-label="Turn music down">−</button>
        <button type="button" onClick={() => void changeVolume(1)} aria-label="Turn music up">+</button>
      </div>
      <span className="sfx-status" aria-label="Interaction sounds remain active">SFX LIVE</span>
    </aside>
  );
}
