/**
 * Stack Data Structure Visualizer
 * Last-In, First-Out (LIFO)
 */

export class StackVisualizer {
  constructor(containerElement, logCallback) {
    this.container = containerElement;
    this.log = logCallback || (() => {});
    this.items = [15, 32, 48, 64]; // default initial elements
    this.maxCapacity = 7;
  }

  render(highlightIndex = null, highlightAction = null) {
    this.container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'ds-stack-wrapper';

    // Top Pointer Indicator
    const topPointer = document.createElement('div');
    topPointer.className = 'ds-pointer-indicator';
    topPointer.innerHTML = `
      <div class="pointer-badge">
        <span class="pointer-label">TOP</span>
        <span class="pointer-value">${this.items.length > 0 ? `Index ${this.items.length - 1} (${this.items[this.items.length - 1]})` : 'Empty (NULL)'}</span>
      </div>
    `;
    wrapper.appendChild(topPointer);

    // Beaker / Stack Canister
    const beaker = document.createElement('div');
    beaker.className = 'ds-stack-beaker';

    if (this.items.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'ds-empty-placeholder';
      emptyMsg.innerHTML = '<i class="ph-bold ph-tray"></i> Stack is Empty';
      beaker.appendChild(emptyMsg);
    } else {
      // Render from top to bottom or bottom to top
      // We render items stacked from bottom (index 0) to top (index n-1)
      this.items.forEach((val, idx) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'ds-stack-item';
        if (idx === highlightIndex) {
          itemEl.classList.add(`highlight-${highlightAction || 'active'}`);
        }
        if (idx === this.items.length - 1) {
          itemEl.classList.add('is-top');
        }

        itemEl.innerHTML = `
          <span class="stack-index">[${idx}]</span>
          <span class="stack-val">${val}</span>
          ${idx === this.items.length - 1 ? '<span class="top-tag">TOP</span>' : ''}
        `;
        beaker.appendChild(itemEl);
      });
    }

    wrapper.appendChild(beaker);

    // Capacity & Size footer
    const footer = document.createElement('div');
    footer.className = 'ds-meta-footer';
    footer.innerHTML = `
      <span>Size: <strong>${this.items.length}</strong> / ${this.maxCapacity}</span>
      <span>Base (Index 0)</span>
    `;
    wrapper.appendChild(footer);

    this.container.appendChild(wrapper);
  }

  push(value) {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      this.log('Invalid value. Please enter a valid number.', 'error');
      return false;
    }
    if (this.items.length >= this.maxCapacity) {
      this.log(`Stack Overflow! Maximum capacity (${this.maxCapacity}) reached.`, 'error');
      return false;
    }

    this.items.push(val);
    this.render(this.items.length - 1, 'push');
    this.log(`Pushed ${val} onto the top of the stack (index ${this.items.length - 1}).`, 'success');
    return true;
  }

  pop() {
    if (this.items.length === 0) {
      this.log('Stack Underflow! Cannot pop from an empty stack.', 'error');
      return null;
    }

    const poppedVal = this.items[this.items.length - 1];
    // Animate pop highlight first
    this.render(this.items.length - 1, 'pop');

    setTimeout(() => {
      this.items.pop();
      this.render();
      this.log(`Popped ${poppedVal} from the top of the stack.`, 'info');
    }, 350);

    return poppedVal;
  }

  peek() {
    if (this.items.length === 0) {
      this.log('Stack is empty. Peek returns null.', 'warning');
      return null;
    }
    const topVal = this.items[this.items.length - 1];
    this.render(this.items.length - 1, 'peek');
    this.log(`Peek: Top element is ${topVal} at index ${this.items.length - 1}.`, 'info');
    return topVal;
  }

  clear() {
    this.items = [];
    this.render();
    this.log('Stack cleared. All elements removed.', 'info');
  }
}
