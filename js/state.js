/**
 * Visualizer State & Animation Controller
 * Handles deterministic frame playback, play/pause, step navigation, and scrubber timelines.
 */

export class AnimationController {
  constructor(onStepRender, onPlaybackStateChange) {
    this.steps = [];
    this.currentStep = 0;
    this.isPlaying = false;
    this.speed = 150; // ms per step
    this.timer = null;
    this.onStepRender = onStepRender || (() => {});
    this.onPlaybackStateChange = onPlaybackStateChange || (() => {});
  }

  setSteps(steps) {
    this.pause();
    this.steps = steps || [];
    this.currentStep = 0;
    if (this.steps.length > 0) {
      this.renderCurrent();
    }
    this.notifyState();
  }

  setSpeed(speedMs) {
    this.speed = Math.max(15, Math.min(1500, speedMs));
    if (this.isPlaying) {
      this.pause();
      this.play();
    }
  }

  play() {
    if (this.steps.length === 0) return;
    if (this.currentStep >= this.steps.length - 1) {
      // Loop or restart from beginning if at the end
      this.currentStep = 0;
    }

    this.isPlaying = true;
    this.notifyState();
    this.scheduleNext();
  }

  pause() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.notifyState();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  scheduleNext() {
    if (!this.isPlaying) return;

    this.timer = setTimeout(() => {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
        this.renderCurrent();
        this.scheduleNext();
      } else {
        this.pause();
      }
    }, this.speed);
  }

  stepForward() {
    if (this.currentStep < this.steps.length - 1) {
      this.pause();
      this.currentStep++;
      this.renderCurrent();
    }
  }

  stepBackward() {
    if (this.currentStep > 0) {
      this.pause();
      this.currentStep--;
      this.renderCurrent();
    }
  }

  goToStep(index) {
    this.pause();
    const target = Math.max(0, Math.min(this.steps.length - 1, index));
    this.currentStep = target;
    this.renderCurrent();
  }

  reset() {
    this.pause();
    this.currentStep = 0;
    if (this.steps.length > 0) {
      this.renderCurrent();
    }
    this.notifyState();
  }

  renderCurrent() {
    if (this.steps.length === 0) return;
    const step = this.steps[this.currentStep];
    this.onStepRender(step, this.currentStep, this.steps.length);
    this.notifyState();
  }

  notifyState() {
    this.onPlaybackStateChange({
      isPlaying: this.isPlaying,
      currentStep: this.currentStep,
      totalSteps: this.steps.length,
      hasSteps: this.steps.length > 0
    });
  }
}
