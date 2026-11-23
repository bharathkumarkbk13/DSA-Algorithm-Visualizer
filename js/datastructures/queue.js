/**
 * Queue Data Structure Visualizer
 * First-In, First-Out (FIFO)
 */

export class QueueVisualizer {
  constructor(containerElement, logCallback) {
    this.container = containerElement;
    this.log = logCallback || (() => {});
    this.items = [10, 20, 30, 40];
    this.maxCapacity = 8;
  }

  render(highlightIndex = null, highlightAction = null) {
    this.container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'ds-queue-wrapper';

    // Queue conveyor stage
    const stage = document.createElement('div');
    stage.className = 'ds-queue-stage';

    // Dequeue End (Front / Left)
    const frontPort = document.createElement('div');
    frontPort.className = 'ds-queue-port front-port';
    frontPort.innerHTML = `
      <div class="port-label">FRONT / EXIT</div>
      <div class="port-arrow">← Dequeue</div>
    `;
    stage.appendChild(frontPort);

    // Queue track container
    const track = document.createElement('div');
    track.className = 'ds-queue-track';

    if (this.items.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'ds-empty-placeholder';
      emptyMsg.innerHTML = '<i class="ph-bold ph-tray"></i> Queue is Empty';
      track.appendChild(emptyMsg);
    } else {
      this.items.forEach((val, idx) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'ds-queue-item';
        if (idx === highlightIndex) {
          itemEl.classList.add(`highlight-${highlightAction || 'active'}`);
        }
        if (idx === 0) itemEl.classList.add('is-front');
        if (idx === this.items.length - 1) itemEl.classList.add('is-rear');

        itemEl.innerHTML = `
          <span class="queue-index">[${idx}]</span>
          <span class="queue-val">${val}</span>
          ${idx === 0 ? '<span class="queue-tag tag-front">FRONT</span>' : ''}
          ${idx === this.items.length - 1 ? '<span class="queue-tag tag-rear">REAR</span>' : ''}
        `;
        track.appendChild(itemEl);
      });
    }

    stage.appendChild(track);

    // Enqueue End (Rear / Right)
    const rearPort = document.createElement('div');
    rearPort.className = 'ds-queue-port rear-port';
    rearPort.innerHTML = `
      <div class="port-label">REAR / ENTRY</div>
      <div class="port-arrow">Enqueue ←</div>
    `;
    stage.appendChild(rearPort);

    wrapper.appendChild(stage);

    // Footer info
    const footer = document.createElement('div');
    footer.className = 'ds-meta-footer';
    footer.innerHTML = `
      <span>Size: <strong>${this.items.length}</strong> / ${this.maxCapacity}</span>
      <span>Principle: First-In-First-Out (FIFO)</span>
    `;
    wrapper.appendChild(footer);

    this.container.appendChild(wrapper);
  }

  enqueue(value) {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      this.log('Invalid value. Please enter a valid number.', 'error');
      return false;
    }
    if (this.items.length >= this.maxCapacity) {
      this.log(`Queue Overflow! Maximum capacity (${this.maxCapacity}) reached.`, 'error');
      return false;
    }

    this.items.push(val);
    this.render(this.items.length - 1, 'enqueue');
    this.log(`Enqueued ${val} at the rear (index ${this.items.length - 1}).`, 'success');
    return true;
  }

  dequeue() {
    if (this.items.length === 0) {
      this.log('Queue Underflow! Cannot dequeue from an empty queue.', 'error');
      return null;
    }

    const frontVal = this.items[0];
    this.render(0, 'dequeue');

    setTimeout(() => {
      this.items.shift();
      this.render();
      this.log(`Dequeued ${frontVal} from the front of the queue.`, 'info');
    }, 350);

    return frontVal;
  }

  peek() {
    if (this.items.length === 0) {
      this.log('Queue is empty. Peek returns null.', 'warning');
      return null;
    }
    const frontVal = this.items[0];
    this.render(0, 'peek');
    this.log(`Peek: Front element is ${frontVal} at index 0.`, 'info');
    return frontVal;
  }

  clear() {
    this.items = [];
    this.render();
    this.log('Queue cleared. All elements removed.', 'info');
  }
}
