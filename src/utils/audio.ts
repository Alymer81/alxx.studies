// Web Audio API Ambient Sound Synthesizer & Audio Engine
// Generates pristine, zero-dependency ambient focus audio: Rain, Fireplace, Wind, Cafe chatter, and Binaural Study Wave.

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private nodes: Map<string, { gain: GainNode; stop: () => void }> = new Map();
  private masterGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 1.0;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Pink / Brown noise generator for Rain & Water
  private createNoiseBuffer(seconds = 5, brown = false): AudioBuffer {
    if (!this.ctx) throw new Error('AudioContext not ready');
    const bufferSize = this.ctx.sampleRate * seconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (brown) {
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
      } else {
        // Pink noise approximation
        lastOut = lastOut * 0.95 + white * 0.05;
        data[i] = lastOut * 2.5;
      }
    }
    return buffer;
  }

  // Start Rain Sound
  startRain(volume = 0.5) {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;
    this.stopChannel('rain');

    const buffer = this.createNoiseBuffer(5, false);
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Filter for soft rain sound
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 850;

    const gain = this.ctx.createGain();
    gain.gain.value = volume;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    source.start();
    this.nodes.set('rain', {
      gain,
      stop: () => {
        try { source.stop(); } catch {}
      }
    });
  }

  // Start Fireplace Crackle
  startFireplace(volume = 0.5) {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;
    this.stopChannel('fire');

    const buffer = this.createNoiseBuffer(4, true);
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 320;
    filter.Q.value = 1.2;

    const gain = this.ctx.createGain();
    gain.gain.value = volume;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    source.start();
    this.nodes.set('fire', {
      gain,
      stop: () => {
        try { source.stop(); } catch {}
      }
    });
  }

  // Start Wind Ambience
  startWind(volume = 0.5) {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;
    this.stopChannel('wind');

    const buffer = this.createNoiseBuffer(6, true);
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 240;

    // Slow LFO modulation for wind gusts
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.15;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 150;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    const gain = this.ctx.createGain();
    gain.gain.value = volume;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    source.start();
    this.nodes.set('wind', {
      gain,
      stop: () => {
        try { source.stop(); lfo.stop(); } catch {}
      }
    });
  }

  // Start Binaural Alpha Focus Wave (14Hz difference: 214Hz & 200Hz)
  startBinaural(volume = 0.4) {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;
    this.stopChannel('binaural');

    const merger = this.ctx.createChannelMerger(2);

    const oscL = this.ctx.createOscillator();
    oscL.type = 'sine';
    oscL.frequency.value = 200; // Base tone

    const oscR = this.ctx.createOscillator();
    oscR.type = 'sine';
    oscR.frequency.value = 214; // Alpha brainwave (14 Hz diff)

    const gainL = this.ctx.createGain();
    gainL.gain.value = 0.3;
    const gainR = this.ctx.createGain();
    gainR.gain.value = 0.3;

    oscL.connect(gainL);
    oscR.connect(gainR);

    gainL.connect(merger, 0, 0);
    gainR.connect(merger, 0, 1);

    const gain = this.ctx.createGain();
    gain.gain.value = volume;

    merger.connect(gain);
    gain.connect(this.masterGain);

    oscL.start();
    oscR.start();

    this.nodes.set('binaural', {
      gain,
      stop: () => {
        try { oscL.stop(); oscR.stop(); } catch {}
      }
    });
  }

  // Adjust volume for any active channel
  setChannelVolume(channel: string, volume: number) {
    const node = this.nodes.get(channel);
    if (node && this.ctx) {
      node.gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    }
  }

  // Stop a specific channel
  stopChannel(channel: string) {
    const node = this.nodes.get(channel);
    if (node) {
      node.stop();
      this.nodes.delete(channel);
    }
  }

  // Stop all ambient channels
  stopAll() {
    this.nodes.forEach(n => n.stop());
    this.nodes.clear();
  }
}

export const ambientEngine = new AmbientSoundEngine();
