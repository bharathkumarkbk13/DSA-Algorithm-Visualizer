/**
 * Web Audio API Sound Synthesizer for DSA Algorithm Visualizer
 */

class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.minFreq = 180;
    this.maxFreq = 960;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  setMuted(muted) {
    this.isMuted = muted;
  }

  /**
   * Play tone proportional to normalized value (0 to 1) or absolute value
   */
  playValue(value, min = 5, max = 100, duration = 0.05, type = 'sine') {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const normalized = Math.max(0, Math.min(1, (value - min) / (max - min || 1)));
      const freq = this.minFreq + normalized * (this.maxFreq - this.minFreq);
      this.playTone(freq, duration, type, 0.08);
    } catch (e) {
      // Audio errors should never crash the visualizer
    }
  }

  playTone(freq, duration = 0.05, type = 'sine', volume = 0.08) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio safeguard
    }
  }

  playCompare(val1, val2, min = 5, max = 100) {
    this.playValue(val1, min, max, 0.04, 'triangle');
  }

  playSwap(val1, val2, min = 5, max = 100) {
    this.playValue(val2, min, max, 0.06, 'sawtooth');
  }

  playSuccess() {
    if (this.isMuted) return;
    this.init();
    const notes = [440, 554.37, 659.25, 880]; // A major chord arpeggio
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.12, 'sine', 0.1);
      }, idx * 60);
    });
  }

  playTargetFound() {
    if (this.isMuted) return;
    this.init();
    this.playTone(587.33, 0.1, 'sine', 0.1); // D5
    setTimeout(() => {
      this.playTone(880, 0.2, 'sine', 0.12); // A5
    }, 90);
  }

  playNotFound() {
    if (this.isMuted) return;
    this.init();
    this.playTone(330, 0.15, 'triangle', 0.1);
    setTimeout(() => {
      this.playTone(220, 0.25, 'triangle', 0.1);
    }, 120);
  }
}

export const soundSynth = new SoundSynthesizer();
