/**
 * Binary Search Tree (BST) Visualizer
 * Interactive Node Insert, Delete, Search, and Depth/Breadth Traversals with SVG rendering
 */

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.x = 0;
    this.y = 0;
  }
}

export class BSTVisualizer {
  constructor(containerElement, logCallback) {
    this.container = containerElement;
    this.log = logCallback || (() => {});
    this.root = null;

    // Seed default balanced tree: 50, 30, 70, 20, 40, 60, 80
    [50, 30, 70, 20, 40, 60, 80].forEach(val => this.insertDirect(val));
  }

  insertDirect(val) {
    const newNode = new TreeNode(val);
    if (!this.root) {
      this.root = newNode;
      return;
    }
    let curr = this.root;
    while (true) {
      if (val === curr.value) return; // avoid duplicates
      if (val < curr.value) {
        if (!curr.left) {
          curr.left = newNode;
          break;
        }
        curr = curr.left;
      } else {
        if (!curr.right) {
          curr.right = newNode;
          break;
        }
        curr = curr.right;
      }
    }
  }

  render(highlightedNodeValues = [], highlightType = 'active') {
    this.container.innerHTML = '';

    const width = this.container.clientWidth || 800;
    const height = 400;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('class', 'bst-svg-canvas');

    if (!this.root) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', width / 2);
      text.setAttribute('y', height / 2);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('class', 'bst-empty-text');
      text.textContent = 'Tree is Empty (Root is NULL)';
      svg.appendChild(text);
      this.container.appendChild(svg);
      return;
    }

    // Compute coordinates recursively
    this.calculatePositions(this.root, width / 2, 45, width / 4);

    // Render edges first so they sit behind nodes
    this.renderEdges(svg, this.root);

    // Render nodes
    this.renderNodes(svg, this.root, highlightedNodeValues, highlightType);

    this.container.appendChild(svg);
  }

  calculatePositions(node, x, y, offset) {
    if (!node) return;
    node.x = x;
    node.y = y;

    const nextY = y + 70;
    const nextOffset = Math.max(offset / 2, 28);

    if (node.left) {
      this.calculatePositions(node.left, x - offset, nextY, nextOffset);
    }
    if (node.right) {
      this.calculatePositions(node.right, x + offset, nextY, nextOffset);
    }
  }

  renderEdges(svg, node) {
    if (!node) return;

    if (node.left) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', node.x);
      line.setAttribute('y1', node.y);
      line.setAttribute('x2', node.left.x);
      line.setAttribute('y2', node.left.y);
      line.setAttribute('class', 'bst-edge');
      svg.appendChild(line);
      this.renderEdges(svg, node.left);
    }

    if (node.right) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', node.x);
      line.setAttribute('y1', node.y);
      line.setAttribute('x2', node.right.x);
      line.setAttribute('y2', node.right.y);
      line.setAttribute('class', 'bst-edge');
      svg.appendChild(line);
      this.renderEdges(svg, node.right);
    }
  }

  renderNodes(svg, node, highlightedValues, highlightType) {
    if (!node) return;

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'bst-node-group');

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', node.x);
    circle.setAttribute('cy', node.y);
    circle.setAttribute('r', 20);

    let nodeClass = 'bst-node-circle';
    if (highlightedValues.includes(node.value)) {
      nodeClass += ` highlight-${highlightType}`;
    }
    circle.setAttribute('class', nodeClass);
    g.appendChild(circle);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', node.x);
    text.setAttribute('y', node.y + 5);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('class', 'bst-node-label');
    text.textContent = node.value;
    g.appendChild(text);

    svg.appendChild(g);

    this.renderNodes(svg, node.left, highlightedValues, highlightType);
    this.renderNodes(svg, node.right, highlightedValues, highlightType);
  }

  insert(value) {
    const val = parseInt(value, 10);
    if (isNaN(val)) return this.log('Please enter a valid number to insert.', 'error');

    if (!this.root) {
      this.root = new TreeNode(val);
      this.render([val], 'success');
      this.log(`Inserted root node ${val}.`, 'success');
      return;
    }

    const steps = [];
    let curr = this.root;

    while (curr) {
      steps.push(curr.value);
      if (val === curr.value) {
        this.render([val], 'warning');
        return this.log(`Value ${val} already exists in the BST! Duplicates ignored.`, 'warning');
      }

      if (val < curr.value) {
        if (!curr.left) {
          curr.left = new TreeNode(val);
          break;
        }
        curr = curr.left;
      } else {
        if (!curr.right) {
          curr.right = new TreeNode(val);
          break;
        }
        curr = curr.right;
      }
    }

    // Step-by-step visual playback
    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        this.render([steps[stepIdx]], 'active');
        this.log(`Traversing: comparing ${val} with node ${steps[stepIdx]}...`, 'info');
        stepIdx++;
      } else {
        clearInterval(interval);
        this.render([val], 'success');
        this.log(`Inserted ${val} into the tree.`, 'success');
      }
    }, 400);
  }

  search(value) {
    const val = parseInt(value, 10);
    if (isNaN(val)) return this.log('Please enter a valid number to search.', 'error');
    if (!this.root) return this.log('BST is empty.', 'warning');

    const steps = [];
    let curr = this.root;
    let found = false;

    while (curr) {
      steps.push(curr.value);
      if (curr.value === val) {
        found = true;
        break;
      }
      curr = val < curr.value ? curr.left : curr.right;
    }

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        const isLast = stepIdx === steps.length - 1;
        this.render([steps[stepIdx]], isLast && found ? 'success' : 'active');
        this.log(`Searching: inspecting node ${steps[stepIdx]}...`, 'info');
        stepIdx++;
      } else {
        clearInterval(interval);
        if (found) {
          this.render([val], 'success');
          this.log(`Value ${val} FOUND in BST!`, 'success');
        } else {
          this.render([], 'active');
          this.log(`Value ${val} NOT found in BST.`, 'error');
        }
      }
    }, 450);
  }

  delete(value) {
    const val = parseInt(value, 10);
    if (isNaN(val)) return this.log('Please enter a valid number to delete.', 'error');
    if (!this.root) return this.log('BST is empty.', 'warning');

    let deleted = false;

    const deleteNode = (root, key) => {
      if (!root) return null;
      if (key < root.value) {
        root.left = deleteNode(root.left, key);
      } else if (key > root.value) {
        root.right = deleteNode(root.right, key);
      } else {
        deleted = true;
        // Case 1: Leaf node or single child
        if (!root.left) return root.right;
        if (!root.right) return root.left;

        // Case 2: Two children -> find in-order successor (min in right subtree)
        let minSuccessor = root.right;
        while (minSuccessor.left) {
          minSuccessor = minSuccessor.left;
        }
        root.value = minSuccessor.value;
        root.right = deleteNode(root.right, minSuccessor.value);
      }
      return root;
    };

    this.root = deleteNode(this.root, val);
    this.render();

    if (deleted) {
      this.log(`Deleted ${val} from BST and re-balanced tree pointers.`, 'info');
    } else {
      this.log(`Value ${val} not found in BST. Nothing deleted.`, 'warning');
    }
  }

  traverse(orderType) {
    if (!this.root) return this.log('BST is empty.', 'warning');

    const result = [];
    const inOrder = (node) => {
      if (!node) return;
      inOrder(node.left);
      result.push(node.value);
      inOrder(node.right);
    };

    const preOrder = (node) => {
      if (!node) return;
      result.push(node.value);
      preOrder(node.left);
      preOrder(node.right);
    };

    const postOrder = (node) => {
      if (!node) return;
      postOrder(node.left);
      postOrder(node.right);
      result.push(node.value);
    };

    const levelOrder = (root) => {
      if (!root) return;
      const q = [root];
      while (q.length > 0) {
        const curr = q.shift();
        result.push(curr.value);
        if (curr.left) q.push(curr.left);
        if (curr.right) q.push(curr.right);
      }
    };

    if (orderType === 'inorder') inOrder(this.root);
    else if (orderType === 'preorder') preOrder(this.root);
    else if (orderType === 'postorder') postOrder(this.root);
    else if (orderType === 'levelorder') levelOrder(this.root);

    let idx = 0;
    this.log(`Running ${orderType.toUpperCase()} traversal: [${result.join(', ')}]`, 'info');

    const interval = setInterval(() => {
      if (idx < result.length) {
        this.render([result[idx]], 'active');
        idx++;
      } else {
        clearInterval(interval);
        this.render();
      }
    }, 450);
  }

  clear() {
    this.root = null;
    this.render();
    this.log('Binary Search Tree cleared.', 'info');
  }
}
