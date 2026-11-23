/**
 * Linked List Data Structure Visualizer
 * Supports Singly and Doubly Linked List modes with interactive operations & animated traversals
 */

class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

export class LinkedListVisualizer {
  constructor(containerElement, logCallback) {
    this.container = containerElement;
    this.log = logCallback || (() => {});
    this.mode = 'singly'; // 'singly' or 'doubly'
    this.head = null;
    this.size = 0;
    this.maxNodes = 9;

    // Seed default list: 12 -> 25 -> 47 -> 68
    this.initDefault();
  }

  initDefault() {
    this.head = null;
    this.size = 0;
    [12, 25, 47, 68].forEach(val => this.insertTailDirect(val));
  }

  setMode(mode) {
    this.mode = mode;
    this.render();
    this.log(`Switched to ${mode === 'doubly' ? 'Doubly' : 'Singly'} Linked List mode.`, 'info');
  }

  insertTailDirect(val) {
    const newNode = new ListNode(val);
    if (!this.head) {
      this.head = newNode;
    } else {
      let curr = this.head;
      while (curr.next) {
        curr = curr.next;
      }
      curr.next = newNode;
      newNode.prev = curr;
    }
    this.size++;
  }

  render(highlightIndex = null, highlightAction = null) {
    this.container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'ds-ll-wrapper';

    // List nodes conveyor
    const listStage = document.createElement('div');
    listStage.className = 'ds-ll-stage';

    if (!this.head) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'ds-empty-placeholder';
      emptyMsg.innerHTML = '<i class="ph-bold ph-link-break"></i> Linked List is Empty (HEAD = NULL)';
      listStage.appendChild(emptyMsg);
    } else {
      let curr = this.head;
      let idx = 0;

      while (curr) {
        const nodeCard = document.createElement('div');
        nodeCard.className = 'ds-ll-node-card';
        if (idx === highlightIndex) {
          nodeCard.classList.add(`highlight-${highlightAction || 'active'}`);
        }

        // Pointer Badges: HEAD / TAIL
        let pointerBadges = '';
        if (idx === 0) pointerBadges += '<span class="ll-tag tag-head">HEAD</span>';
        if (!curr.next) pointerBadges += '<span class="ll-tag tag-tail">TAIL</span>';

        if (this.mode === 'doubly') {
          nodeCard.innerHTML = `
            ${pointerBadges ? `<div class="ll-badges">${pointerBadges}</div>` : ''}
            <div class="ll-node doubly">
              <span class="ll-prev-ptr">${curr.prev ? '•' : 'Ø'}</span>
              <span class="ll-node-val">${curr.value}</span>
              <span class="ll-next-ptr">${curr.next ? '•' : 'Ø'}</span>
            </div>
            <div class="ll-node-index">Node ${idx}</div>
          `;
        } else {
          nodeCard.innerHTML = `
            ${pointerBadges ? `<div class="ll-badges">${pointerBadges}</div>` : ''}
            <div class="ll-node singly">
              <span class="ll-node-val">${curr.value}</span>
              <span class="ll-next-ptr">${curr.next ? '•' : 'Ø'}</span>
            </div>
            <div class="ll-node-index">Node ${idx}</div>
          `;
        }

        listStage.appendChild(nodeCard);

        // Connector Arrow to next
        if (curr.next) {
          const arrowEl = document.createElement('div');
          arrowEl.className = `ds-ll-arrow ${this.mode === 'doubly' ? 'arrow-doubly' : 'arrow-singly'}`;
          arrowEl.innerHTML = this.mode === 'doubly' ? '⇄' : '➔';
          listStage.appendChild(arrowEl);
        } else {
          // NULL indicator
          const nullEl = document.createElement('div');
          nullEl.className = 'ds-ll-null';
          nullEl.innerHTML = '<span class="null-arrow">➔</span><span class="null-box">NULL</span>';
          listStage.appendChild(nullEl);
        }

        curr = curr.next;
        idx++;
      }
    }

    wrapper.appendChild(listStage);

    // Meta footer
    const footer = document.createElement('div');
    footer.className = 'ds-meta-footer';
    footer.innerHTML = `
      <span>Length: <strong>${this.size}</strong> nodes</span>
      <span>Structure: ${this.mode === 'doubly' ? 'Doubly Linked List (Prev & Next Pointers)' : 'Singly Linked List (Next Pointer)'}</span>
    `;
    wrapper.appendChild(footer);

    this.container.appendChild(wrapper);
  }

  insertHead(value) {
    const val = parseInt(value, 10);
    if (isNaN(val)) return this.log('Please enter a valid numeric value.', 'error');
    if (this.size >= this.maxNodes) return this.log(`Capacity limit reached (${this.maxNodes} nodes).`, 'error');

    const newNode = new ListNode(val);
    newNode.next = this.head;
    if (this.head) {
      this.head.prev = newNode;
    }
    this.head = newNode;
    this.size++;

    this.render(0, 'insert');
    this.log(`Inserted ${val} at the HEAD of the list. New head points to previous head.`, 'success');
  }

  insertTail(value) {
    const val = parseInt(value, 10);
    if (isNaN(val)) return this.log('Please enter a valid numeric value.', 'error');
    if (this.size >= this.maxNodes) return this.log(`Capacity limit reached (${this.maxNodes} nodes).`, 'error');

    const newNode = new ListNode(val);
    if (!this.head) {
      this.head = newNode;
    } else {
      let curr = this.head;
      while (curr.next) curr = curr.next;
      curr.next = newNode;
      newNode.prev = curr;
    }
    this.size++;

    this.render(this.size - 1, 'insert');
    this.log(`Inserted ${val} at the TAIL of the list.`, 'success');
  }

  deleteHead() {
    if (!this.head) return this.log('Cannot delete from an empty list.', 'error');

    const deletedVal = this.head.value;
    this.render(0, 'delete');

    setTimeout(() => {
      this.head = this.head.next;
      if (this.head) this.head.prev = null;
      this.size--;
      this.render();
      this.log(`Deleted HEAD node (${deletedVal}).`, 'info');
    }, 350);
  }

  deleteTail() {
    if (!this.head) return this.log('Cannot delete from an empty list.', 'error');

    if (!this.head.next) {
      const val = this.head.value;
      this.head = null;
      this.size = 0;
      this.render();
      return this.log(`Deleted last remaining node (${val}). List is now empty.`, 'info');
    }

    this.render(this.size - 1, 'delete');
    setTimeout(() => {
      let curr = this.head;
      while (curr.next && curr.next.next) {
        curr = curr.next;
      }
      const val = curr.next.value;
      curr.next = null;
      this.size--;
      this.render();
      this.log(`Deleted TAIL node (${val}).`, 'info');
    }, 350);
  }

  search(value) {
    const val = parseInt(value, 10);
    if (isNaN(val)) return this.log('Please enter a valid numeric value to search.', 'error');
    if (!this.head) return this.log('List is empty. Search returns not found.', 'warning');

    let curr = this.head;
    let idx = 0;
    const animateStep = () => {
      if (!curr) {
        this.render();
        this.log(`Value ${val} NOT found in the linked list.`, 'error');
        return;
      }

      this.render(idx, 'search');
      this.log(`Checking Node ${idx} (value: ${curr.value})...`, 'info');

      if (curr.value === val) {
        setTimeout(() => {
          this.render(idx, 'found');
          this.log(`Found value ${val} at Node ${idx}!`, 'success');
        }, 300);
        return;
      }

      curr = curr.next;
      idx++;
      setTimeout(animateStep, 450);
    };

    animateStep();
  }

  clear() {
    this.head = null;
    this.size = 0;
    this.render();
    this.log('Linked list cleared.', 'info');
  }
}
