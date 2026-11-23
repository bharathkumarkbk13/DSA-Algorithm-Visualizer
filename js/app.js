/**
 * Main Application Orchestrator for DSA Algorithm Visualizer
 */

import { ALGORITHM_DATA } from './utils/complexityData.js';
import { soundSynth } from './audio.js';
import { AnimationController } from './state.js';
import {
  generateBubbleSortSteps,
  generateSelectionSortSteps,
  generateInsertionSortSteps,
  generateMergeSortSteps,
  generateQuickSortSteps,
  generateHeapSortSteps
} from './algorithms/sorting.js';
import {
  generateLinearSearchSteps,
  generateBinarySearchSteps
} from './algorithms/searching.js';
import {
  GRID_ROWS,
  GRID_COLS,
  createInitialGrid,
  runBFS,
  runDFS,
  runDijkstra,
  runAStar,
  generateRandomMaze
} from './algorithms/pathfinding.js';
import { StackVisualizer } from './datastructures/stack.js';
import { QueueVisualizer } from './datastructures/queue.js';
import { LinkedListVisualizer } from './datastructures/linkedlist.js';
import { BSTVisualizer } from './datastructures/bst.js';

class App {
  constructor() {
    this.currentCategory = 'sorting';
    this.currentAlgorithm = 'bubble-sort';

    // Sorting & Searching state
    this.arraySize = 25;
    this.array = [];
    this.searchTarget = 42;

    // Grid pathfinding state
    this.grid = [];
    this.isMousePressed = false;
    this.isDraggingStart = false;
    this.isDraggingEnd = false;
    this.startPos = { row: Math.floor(GRID_ROWS / 2), col: 4 };
    this.endPos = { row: Math.floor(GRID_ROWS / 2), col: GRID_COLS - 5 };
    this.pathfindingRunning = false;

    // Data Structure Visualizers
    this.stackVis = null;
    this.queueVis = null;
    this.llVis = null;
    this.bstVis = null;

    // Animation Controller
    this.animController = new AnimationController(
      (step, idx, total) => this.renderStep(step, idx, total),
      (playbackState) => this.updatePlaybackUI(playbackState)
    );

    this.initDOM();
    this.bindEvents();
    this.populateAlgoSelect(this.currentCategory);
    this.generateNewArray();
    this.initPathfindingGrid();
    this.initDataStructures();
    this.updateAlgorithmMeta();
  }

  initDOM() {
    // Nav tabs
    this.categoryTabs = document.querySelectorAll('.nav-tab');

    // Controls
    this.algoSelect = document.getElementById('algo-select');
    this.sizeSlider = document.getElementById('size-slider');
    this.sizeValueLabel = document.getElementById('size-value');
    this.speedSlider = document.getElementById('speed-slider');
    this.btnRandomize = document.getElementById('btn-randomize');
    this.btnCustomInput = document.getElementById('btn-custom-input');
    this.searchTargetInput = document.getElementById('search-target-input');
    this.btnSetTarget = document.getElementById('btn-set-target');

    // Playback buttons
    this.btnPlay = document.getElementById('btn-play');
    this.btnStepBack = document.getElementById('btn-step-back');
    this.btnStepForward = document.getElementById('btn-step-forward');
    this.btnReset = document.getElementById('btn-reset');
    this.timelineScrubber = document.getElementById('timeline-scrubber');
    this.stepCounter = document.getElementById('step-counter');
    this.btnSound = document.getElementById('btn-sound');

    // Containers
    this.sortingStage = document.getElementById('sorting-stage');
    this.searchingStage = document.getElementById('searching-stage');
    this.dsStage = document.getElementById('ds-stage');
    this.pathfindingStage = document.getElementById('pathfinding-stage');

    // DS controls
    this.dsSelect = document.getElementById('ds-select');
    this.dsValueInput = document.getElementById('ds-value-input');
    this.btnDsAction1 = document.getElementById('btn-ds-action1');
    this.btnDsAction2 = document.getElementById('btn-ds-action2');
    this.btnDsAction3 = document.getElementById('btn-ds-action3');
    this.btnDsAction4 = document.getElementById('btn-ds-action4');
    this.btnDsClear = document.getElementById('btn-ds-clear');
    this.dsSuboptions = document.getElementById('ds-suboptions');

    // Pathfinding controls
    this.btnRunPathfinding = document.getElementById('btn-run-pathfinding');
    this.btnClearPath = document.getElementById('btn-clear-path');
    this.btnClearWalls = document.getElementById('btn-clear-walls');
    this.btnGenerateMaze = document.getElementById('btn-generate-maze');

    // Meta elements
    this.algoNameEl = document.getElementById('algo-title');
    this.algoCategoryEl = document.getElementById('algo-category-badge');
    this.algoDescEl = document.getElementById('algo-description');
    this.timeBestEl = document.getElementById('time-best');
    this.timeAvgEl = document.getElementById('time-avg');
    this.timeWorstEl = document.getElementById('time-worst');
    this.spaceEl = document.getElementById('space-complexity');
    this.inPlaceBadge = document.getElementById('in-place-badge');
    this.stableBadge = document.getElementById('stable-badge');
    this.pseudocodeEl = document.getElementById('pseudocode-lines');
    this.liveCommentaryEl = document.getElementById('live-commentary');
    this.eventLogEl = document.getElementById('event-log');
  }

  bindEvents() {
    // Navigation switching
    this.categoryTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const cat = e.currentTarget.dataset.category;
        this.switchCategory(cat);
      });
    });

    // Algorithm selection
    this.algoSelect.addEventListener('change', (e) => {
      this.currentAlgorithm = e.target.value;
      this.updateAlgorithmMeta();
      this.prepareAlgorithmSteps();
    });

    // Array size slider
    this.sizeSlider.addEventListener('input', (e) => {
      this.arraySize = parseInt(e.target.value, 10);
      this.sizeValueLabel.textContent = this.arraySize;
      this.generateNewArray();
    });

    // Speed slider (inverted so right = faster)
    this.speedSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      // Map 1..100 to 1000ms down to 20ms
      const speedMs = Math.round(1020 - (val * 9.8));
      this.animController.setSpeed(speedMs);
    });

    // Randomize array
    this.btnRandomize.addEventListener('click', () => {
      this.generateNewArray();
    });

    // Custom Array Input
    this.btnCustomInput.addEventListener('click', () => {
      const input = prompt('Enter 5 to 40 comma-separated numbers (1 to 100):', this.array.slice(0, 15).join(', '));
      if (input) {
        const parsed = input.split(',')
          .map(s => parseInt(s.trim(), 10))
          .filter(n => !isNaN(n) && n > 0 && n <= 100);

        if (parsed.length >= 3) {
          this.array = parsed;
          this.arraySize = parsed.length;
          this.sizeSlider.value = parsed.length;
          this.sizeValueLabel.textContent = parsed.length;
          this.prepareAlgorithmSteps();
          this.log(`Custom array of ${parsed.length} elements loaded.`, 'info');
        } else {
          alert('Please enter at least 3 valid positive numbers between 1 and 100.');
        }
      }
    });

    // Target search input
    this.btnSetTarget.addEventListener('click', () => {
      const val = parseInt(this.searchTargetInput.value, 10);
      if (!isNaN(val)) {
        this.searchTarget = val;
        this.prepareAlgorithmSteps();
        this.log(`Search target set to: ${this.searchTarget}`, 'info');
      }
    });

    // Playback Controls
    this.btnPlay.addEventListener('click', () => this.animController.togglePlay());
    this.btnStepBack.addEventListener('click', () => this.animController.stepBackward());
    this.btnStepForward.addEventListener('click', () => this.animController.stepForward());
    this.btnReset.addEventListener('click', () => this.animController.reset());

    this.timelineScrubber.addEventListener('input', (e) => {
      const stepIndex = parseInt(e.target.value, 10);
      this.animController.goToStep(stepIndex);
    });

    // Audio Mute Toggle
    this.btnSound.addEventListener('click', () => {
      const isMuted = soundSynth.toggleMute();
      this.btnSound.classList.toggle('muted', isMuted);
      this.btnSound.innerHTML = isMuted
        ? '<i class="ph-bold ph-speaker-slash"></i><span>Sound: Off</span>'
        : '<i class="ph-bold ph-speaker-high"></i><span>Sound: On</span>';
      this.log(`Audio ${isMuted ? 'muted' : 'enabled'}.`, 'info');
    });

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      // Don't trigger when user is typing in an input
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        this.animController.togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        this.animController.stepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        this.animController.stepBackward();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        this.animController.reset();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        this.btnSound.click();
      }
    });

    // Data Structure Selector
    this.dsSelect.addEventListener('change', (e) => {
      this.switchDataStructure(e.target.value);
    });

    // Pathfinding buttons
    this.btnRunPathfinding.addEventListener('click', () => this.runPathfinding());
    this.btnClearPath.addEventListener('click', () => this.clearPath());
    this.btnClearWalls.addEventListener('click', () => this.clearWalls());
    this.btnGenerateMaze.addEventListener('click', () => this.generateMaze());
  }

  switchCategory(category) {
    this.currentCategory = category;
    this.animController.pause();

    // Update active tab styling
    this.categoryTabs.forEach(t => t.classList.toggle('active', t.dataset.category === category));

    // Show/hide stage containers
    this.sortingStage.classList.toggle('hidden', category !== 'sorting');
    this.searchingStage.classList.toggle('hidden', category !== 'searching');
    this.dsStage.classList.toggle('hidden', category !== 'datastructures');
    this.pathfindingStage.classList.toggle('hidden', category !== 'pathfinding');

    // Toggle control panels
    document.getElementById('sorting-controls').classList.toggle('hidden', category !== 'sorting');
    document.getElementById('searching-controls').classList.toggle('hidden', category !== 'searching');
    document.getElementById('ds-controls').classList.toggle('hidden', category !== 'datastructures');
    document.getElementById('pathfinding-controls').classList.toggle('hidden', category !== 'pathfinding');

    // Playback panel: only sorting and searching use frame playback
    const isTimelineVisualizer = category === 'sorting' || category === 'searching';
    document.getElementById('playback-bar').classList.toggle('hidden', !isTimelineVisualizer);

    // Populate algorithm selector options
    this.populateAlgoSelect(category);
    this.updateAlgorithmMeta();

    if (category === 'sorting' || category === 'searching') {
      this.prepareAlgorithmSteps();
    } else if (category === 'datastructures') {
      this.switchDataStructure(this.dsSelect.value);
    } else if (category === 'pathfinding') {
      this.renderGrid();
    }
  }

  populateAlgoSelect(category) {
    this.algoSelect.innerHTML = '';
    const options = {
      'sorting': [
        { value: 'bubble-sort', label: 'Bubble Sort' },
        { value: 'selection-sort', label: 'Selection Sort' },
        { value: 'insertion-sort', label: 'Insertion Sort' },
        { value: 'merge-sort', label: 'Merge Sort' },
        { value: 'quick-sort', label: 'Quick Sort' },
        { value: 'heap-sort', label: 'Heap Sort' }
      ],
      'searching': [
        { value: 'linear-search', label: 'Linear Search' },
        { value: 'binary-search', label: 'Binary Search' }
      ],
      'pathfinding': [
        { value: 'bfs', label: 'Breadth-First Search (BFS)' },
        { value: 'dfs', label: 'Depth-First Search (DFS)' },
        { value: 'dijkstra', label: "Dijkstra's Algorithm" },
        { value: 'astar', label: 'A* Search Algorithm' }
      ]
    };

    const list = options[category] || [];
    list.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.value;
      opt.textContent = item.label;
      this.algoSelect.appendChild(opt);
    });

    if (list.length > 0) {
      this.currentAlgorithm = list[0].value;
      this.algoSelect.value = this.currentAlgorithm;
    }
  }

  generateNewArray() {
    this.array = [];
    for (let i = 0; i < this.arraySize; i++) {
      this.array.push(Math.floor(Math.random() * 88) + 8);
    }
    // Pick a random target for search that might be inside or outside
    if (this.currentCategory === 'searching') {
      if (Math.random() > 0.3) {
        this.searchTarget = this.array[Math.floor(Math.random() * this.array.length)];
      } else {
        this.searchTarget = Math.floor(Math.random() * 95) + 5;
      }
      this.searchTargetInput.value = this.searchTarget;
    }

    this.prepareAlgorithmSteps();
  }

  prepareAlgorithmSteps() {
    let steps = [];

    if (this.currentCategory === 'sorting') {
      switch (this.currentAlgorithm) {
        case 'bubble-sort': steps = generateBubbleSortSteps(this.array); break;
        case 'selection-sort': steps = generateSelectionSortSteps(this.array); break;
        case 'insertion-sort': steps = generateInsertionSortSteps(this.array); break;
        case 'merge-sort': steps = generateMergeSortSteps(this.array); break;
        case 'quick-sort': steps = generateQuickSortSteps(this.array); break;
        case 'heap-sort': steps = generateHeapSortSteps(this.array); break;
        default: steps = generateBubbleSortSteps(this.array);
      }
    } else if (this.currentCategory === 'searching') {
      if (this.currentAlgorithm === 'binary-search') {
        steps = generateBinarySearchSteps(this.array, this.searchTarget);
      } else {
        steps = generateLinearSearchSteps(this.array, this.searchTarget);
      }
    }

    this.animController.setSteps(steps);
  }

  renderStep(step, currentStepIndex, totalSteps) {
    // 1. Render Visual Canvas
    if (this.currentCategory === 'sorting') {
      this.renderSortingStep(step);
    } else if (this.currentCategory === 'searching') {
      this.renderSearchingStep(step);
    }

    // 2. Play sound effects
    if (this.currentCategory === 'sorting') {
      if (step.swapping && step.swapping.length > 0) {
        const val = step.array[step.swapping[0]];
        soundSynth.playSwap(val, val);
      } else if (step.comparing && step.comparing.length > 0) {
        const val = step.array[step.comparing[0]];
        soundSynth.playCompare(val, val);
      }
      if (currentStepIndex === totalSteps - 1) {
        soundSynth.playSuccess();
      }
    } else if (this.currentCategory === 'searching') {
      if (step.foundIndex !== undefined && step.foundIndex !== -1) {
        soundSynth.playTargetFound();
      } else if (step.notFound) {
        soundSynth.playNotFound();
      } else if (step.currentIndex !== undefined && step.currentIndex >= 0) {
        soundSynth.playCompare(step.array[step.currentIndex], this.searchTarget);
      } else if (step.mid !== undefined && step.mid >= 0) {
        soundSynth.playCompare(step.array[step.mid], this.searchTarget);
      }
    }

    // 3. Highlight Pseudocode Line
    this.highlightCodeLine(step.codeLine);

    // 4. Update Live Commentary & Event Log
    if (step.description) {
      this.liveCommentaryEl.innerHTML = `<span class="step-badge">Step ${currentStepIndex + 1}/${totalSteps}</span> ${step.description}`;
      this.log(`[Step ${currentStepIndex + 1}] ${step.description}`);
    }
  }

  renderSortingStep(step) {
    this.sortingStage.innerHTML = '';
    const arr = step.array;
    const maxVal = Math.max(...arr, 100);

    const comparingSet = new Set(step.comparing || []);
    const swappingSet = new Set(step.swapping || []);
    const sortedSet = new Set(step.sorted || []);
    const pivotIdx = step.pivot;
    const range = step.range; // [left, right]

    const barContainer = document.createElement('div');
    barContainer.className = 'bar-stage-inner';

    arr.forEach((val, idx) => {
      const barCol = document.createElement('div');
      barCol.className = 'bar-column';

      const bar = document.createElement('div');
      bar.className = 'sort-bar';
      const heightPercent = Math.max(6, (val / maxVal) * 100);
      bar.style.height = `${heightPercent}%`;

      // Status class
      if (swappingSet.has(idx)) {
        bar.classList.add('bar-swapping');
      } else if (comparingSet.has(idx)) {
        bar.classList.add('bar-comparing');
      } else if (sortedSet.has(idx)) {
        bar.classList.add('bar-sorted');
      } else if (pivotIdx === idx) {
        bar.classList.add('bar-pivot');
      } else if (range && idx >= range[0] && idx <= range[1]) {
        bar.classList.add('bar-in-range');
      }

      // Bar Value text
      if (arr.length <= 36) {
        const valLabel = document.createElement('span');
        valLabel.className = 'bar-value';
        valLabel.textContent = val;
        bar.appendChild(valLabel);
      }

      barCol.appendChild(bar);

      // Index label below
      if (arr.length <= 30) {
        const indexLabel = document.createElement('span');
        indexLabel.className = 'bar-index';
        indexLabel.textContent = idx;
        barCol.appendChild(indexLabel);
      }

      barContainer.appendChild(barCol);
    });

    this.sortingStage.appendChild(barContainer);
  }

  renderSearchingStep(step) {
    this.searchingStage.innerHTML = '';
    const arr = step.array;

    const wrapper = document.createElement('div');
    wrapper.className = 'search-stage-inner';

    // Target display indicator
    const targetBadge = document.createElement('div');
    targetBadge.className = 'search-target-banner';
    targetBadge.innerHTML = `
      <span>Searching for: <strong>${step.target}</strong></span>
      ${step.foundIndex !== undefined && step.foundIndex !== -1 ? '<span class="status-badge status-found">✓ FOUND</span>' : ''}
      ${step.notFound ? '<span class="status-badge status-not-found">✕ NOT FOUND</span>' : ''}
    `;
    wrapper.appendChild(targetBadge);

    // Array Cells
    const cellTrack = document.createElement('div');
    cellTrack.className = 'search-cells-track';

    const isBinary = step.low !== undefined;

    arr.forEach((val, idx) => {
      const cellWrap = document.createElement('div');
      cellWrap.className = 'search-cell-wrap';

      // Pointer Labels Above Cell
      const pointerBox = document.createElement('div');
      pointerBox.className = 'search-pointer-box';

      if (isBinary) {
        if (idx === step.low) pointerBox.innerHTML += '<span class="pointer-pill pill-low">LOW</span>';
        if (idx === step.mid) pointerBox.innerHTML += '<span class="pointer-pill pill-mid">MID</span>';
        if (idx === step.high) pointerBox.innerHTML += '<span class="pointer-pill pill-high">HIGH</span>';
      } else {
        if (idx === step.currentIndex) {
          pointerBox.innerHTML += '<span class="pointer-pill pill-curr">CURRENT</span>';
        }
      }
      cellWrap.appendChild(pointerBox);

      // Cell Element
      const cell = document.createElement('div');
      cell.className = 'search-cell';
      cell.textContent = val;

      // Status
      if (idx === step.foundIndex) {
        cell.classList.add('cell-found');
      } else if (isBinary) {
        if (idx === step.mid) {
          cell.classList.add('cell-mid');
        } else if (idx < step.low || idx > step.high) {
          cell.classList.add('cell-eliminated');
        } else {
          cell.classList.add('cell-active-range');
        }
      } else {
        if (idx === step.currentIndex) {
          cell.classList.add('cell-examining');
        } else if (step.currentIndex !== undefined && idx < step.currentIndex) {
          cell.classList.add('cell-passed');
        }
      }

      cellWrap.appendChild(cell);

      // Index below
      const idxLabel = document.createElement('span');
      idxLabel.className = 'cell-index';
      idxLabel.textContent = `[${idx}]`;
      cellWrap.appendChild(idxLabel);

      cellTrack.appendChild(cellWrap);
    });

    wrapper.appendChild(cellTrack);
    this.searchingStage.appendChild(wrapper);
  }

  updatePlaybackUI({ isPlaying, currentStep, totalSteps, hasSteps }) {
    this.btnPlay.innerHTML = isPlaying
      ? '<i class="ph-bold ph-pause"></i><span>Pause</span>'
      : '<i class="ph-bold ph-play"></i><span>Play</span>';

    this.btnPlay.disabled = !hasSteps;
    this.btnStepBack.disabled = !hasSteps || currentStep === 0;
    this.btnStepForward.disabled = !hasSteps || currentStep >= totalSteps - 1;
    this.btnReset.disabled = !hasSteps;

    this.timelineScrubber.max = Math.max(0, totalSteps - 1);
    this.timelineScrubber.value = currentStep;
    this.stepCounter.textContent = `${totalSteps > 0 ? currentStep + 1 : 0} / ${totalSteps}`;
  }

  highlightCodeLine(lineNumber) {
    const lines = this.pseudocodeEl.querySelectorAll('.code-line');
    lines.forEach((lineEl, idx) => {
      lineEl.classList.toggle('active-line', idx + 1 === lineNumber);
    });
  }

  updateAlgorithmMeta() {
    const data = ALGORITHM_DATA[this.currentAlgorithm] || ALGORITHM_DATA[this.dsSelect?.value] || {};

    if (this.algoNameEl) this.algoNameEl.textContent = data.name || 'Algorithm';
    if (this.algoCategoryEl) this.algoCategoryEl.textContent = data.category || this.currentCategory;
    if (this.algoDescEl) this.algoDescEl.textContent = data.description || '';

    // Complexities
    if (data.timeComplexity) {
      if (this.timeBestEl) this.timeBestEl.textContent = data.timeComplexity.best || '-';
      if (this.timeAvgEl) this.timeAvgEl.textContent = data.timeComplexity.average || '-';
      if (this.timeWorstEl) this.timeWorstEl.textContent = data.timeComplexity.worst || '-';
    }
    if (this.spaceEl) this.spaceEl.textContent = data.spaceComplexity || '-';

    // Badges
    if (this.inPlaceBadge) {
      if (data.inPlace !== undefined) {
        this.inPlaceBadge.textContent = data.inPlace ? 'In-Place: Yes' : 'In-Place: No (Aux Memory)';
        this.inPlaceBadge.className = `meta-pill ${data.inPlace ? 'pill-green' : 'pill-orange'}`;
      } else {
        this.inPlaceBadge.textContent = data.type || '';
        this.inPlaceBadge.className = 'meta-pill';
      }
    }

    if (this.stableBadge) {
      if (data.stable !== undefined) {
        this.stableBadge.textContent = data.stable ? 'Stable: Yes' : 'Stable: No';
        this.stableBadge.className = `meta-pill ${data.stable ? 'pill-green' : 'pill-orange'}`;
      } else if (data.guaranteesShortestPath !== undefined) {
        this.stableBadge.textContent = data.guaranteesShortestPath ? 'Shortest Path: Guaranteed' : 'Shortest Path: Not Guaranteed';
        this.stableBadge.className = `meta-pill ${data.guaranteesShortestPath ? 'pill-green' : 'pill-orange'}`;
      } else {
        this.stableBadge.textContent = 'Structure';
        this.stableBadge.className = 'meta-pill';
      }
    }

    // Pseudocode
    if (this.pseudocodeEl && data.pseudocode) {
      this.pseudocodeEl.innerHTML = '';
      data.pseudocode.forEach((codeLine, idx) => {
        const div = document.createElement('div');
        div.className = 'code-line';
        div.innerHTML = `<span class="line-num">${idx + 1}</span><span class="line-text">${this.escapeHTML(codeLine)}</span>`;
        this.pseudocodeEl.appendChild(div);
      });
    }
  }

  escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  log(message, type = 'info') {
    if (!this.eventLogEl) return;
    const time = new Date().toLocaleTimeString().split(' ')[0];
    const logItem = document.createElement('div');
    logItem.className = `log-entry log-${type}`;
    logItem.innerHTML = `<span class="log-time">${time}</span> <span class="log-msg">${message}</span>`;
    this.eventLogEl.prepend(logItem);

    // Keep log buffer bounded
    if (this.eventLogEl.children.length > 50) {
      this.eventLogEl.removeChild(this.eventLogEl.lastChild);
    }
  }

  // --- DATA STRUCTURES HANDLERS ---
  initDataStructures() {
    const dsCanvas = document.getElementById('ds-canvas-area');
    this.stackVis = new StackVisualizer(dsCanvas, (msg, type) => this.log(msg, type));
    this.queueVis = new QueueVisualizer(dsCanvas, (msg, type) => this.log(msg, type));
    this.llVis = new LinkedListVisualizer(dsCanvas, (msg, type) => this.log(msg, type));
    this.bstVis = new BSTVisualizer(dsCanvas, (msg, type) => this.log(msg, type));
  }

  switchDataStructure(dsType) {
    this.currentAlgorithm = dsType;
    this.updateAlgorithmMeta();

    // Reset button labels based on DS
    const valInput = this.dsValueInput;
    this.dsSuboptions.innerHTML = '';

    if (dsType === 'stack') {
      this.btnDsAction1.textContent = 'Push';
      this.btnDsAction2.textContent = 'Pop';
      this.btnDsAction3.textContent = 'Peek';
      this.btnDsAction4.classList.add('hidden');

      this.btnDsAction1.onclick = () => this.stackVis.push(valInput.value || Math.floor(Math.random() * 90) + 10);
      this.btnDsAction2.onclick = () => this.stackVis.pop();
      this.btnDsAction3.onclick = () => this.stackVis.peek();
      this.btnDsClear.onclick = () => this.stackVis.clear();
      this.stackVis.render();
    } else if (dsType === 'queue') {
      this.btnDsAction1.textContent = 'Enqueue';
      this.btnDsAction2.textContent = 'Dequeue';
      this.btnDsAction3.textContent = 'Peek Front';
      this.btnDsAction4.classList.add('hidden');

      this.btnDsAction1.onclick = () => this.queueVis.enqueue(valInput.value || Math.floor(Math.random() * 90) + 10);
      this.btnDsAction2.onclick = () => this.queueVis.dequeue();
      this.btnDsAction3.onclick = () => this.queueVis.peek();
      this.btnDsClear.onclick = () => this.queueVis.clear();
      this.queueVis.render();
    } else if (dsType === 'singly-linked-list' || dsType === 'doubly-linked-list') {
      const isDoubly = dsType === 'doubly-linked-list';
      this.llVis.setMode(isDoubly ? 'doubly' : 'singly');

      this.btnDsAction1.textContent = 'Insert Head';
      this.btnDsAction2.textContent = 'Insert Tail';
      this.btnDsAction3.textContent = 'Delete Head';
      this.btnDsAction4.textContent = 'Search Node';
      this.btnDsAction4.classList.remove('hidden');

      this.btnDsAction1.onclick = () => this.llVis.insertHead(valInput.value || Math.floor(Math.random() * 90) + 10);
      this.btnDsAction2.onclick = () => this.llVis.insertTail(valInput.value || Math.floor(Math.random() * 90) + 10);
      this.btnDsAction3.onclick = () => this.llVis.deleteHead();
      this.btnDsAction4.onclick = () => this.llVis.search(valInput.value || 25);
      this.btnDsClear.onclick = () => this.llVis.clear();
      this.llVis.render();
    } else if (dsType === 'bst') {
      this.btnDsAction1.textContent = 'Insert Node';
      this.btnDsAction2.textContent = 'Search Node';
      this.btnDsAction3.textContent = 'Delete Node';
      this.btnDsAction4.textContent = 'In-Order';
      this.btnDsAction4.classList.remove('hidden');

      // Traversal selector additions
      const travSelect = document.createElement('select');
      travSelect.className = 'control-select';
      travSelect.innerHTML = `
        <option value="inorder">In-Order Traversal</option>
        <option value="preorder">Pre-Order Traversal</option>
        <option value="postorder">Post-Order Traversal</option>
        <option value="levelorder">Level-Order Traversal</option>
      `;
      travSelect.onchange = (e) => this.bstVis.traverse(e.target.value);
      this.dsSuboptions.appendChild(travSelect);

      this.btnDsAction1.onclick = () => this.bstVis.insert(valInput.value || Math.floor(Math.random() * 90) + 10);
      this.btnDsAction2.onclick = () => this.bstVis.search(valInput.value || 30);
      this.btnDsAction3.onclick = () => this.bstVis.delete(valInput.value || 50);
      this.btnDsAction4.onclick = () => this.bstVis.traverse(travSelect.value);
      this.btnDsClear.onclick = () => this.bstVis.clear();
      this.bstVis.render();
    }
  }

  // --- PATHFINDING HANDLERS ---
  initPathfindingGrid() {
    this.grid = createInitialGrid(GRID_ROWS, GRID_COLS);
    this.renderGrid();
  }

  renderGrid() {
    const gridContainer = document.getElementById('pathfinding-grid');
    if (!gridContainer) return;
    gridContainer.innerHTML = '';
    gridContainer.style.gridTemplateColumns = `repeat(${GRID_COLS}, 1fr)`;

    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const node = this.grid[r][c];
        const cell = document.createElement('div');
        cell.id = `cell-${r}-${c}`;
        cell.className = 'grid-cell';

        if (r === this.startPos.row && c === this.startPos.col) {
          cell.classList.add('cell-start');
          cell.innerHTML = '<i class="ph-fill ph-navigation-arrow"></i>';
        } else if (r === this.endPos.row && c === this.endPos.col) {
          cell.classList.add('cell-end');
          cell.innerHTML = '<i class="ph-fill ph-flag-banner"></i>';
        } else if (node.isWall) {
          cell.classList.add('cell-wall');
        }

        // Mouse interactions for drawing walls and moving start/end
        cell.addEventListener('mousedown', (e) => this.onCellMouseDown(r, c, e));
        cell.addEventListener('mouseenter', () => this.onCellMouseEnter(r, c));

        gridContainer.appendChild(cell);
      }
    }

    window.addEventListener('mouseup', () => {
      this.isMousePressed = false;
      this.isDraggingStart = false;
      this.isDraggingEnd = false;
    });
  }

  onCellMouseDown(r, c, e) {
    e.preventDefault();
    if (this.pathfindingRunning) return;

    if (r === this.startPos.row && c === this.startPos.col) {
      this.isDraggingStart = true;
    } else if (r === this.endPos.row && c === this.endPos.col) {
      this.isDraggingEnd = true;
    } else {
      this.isMousePressed = true;
      this.toggleWall(r, c);
    }
  }

  onCellMouseEnter(r, c) {
    if (this.pathfindingRunning) return;

    if (this.isDraggingStart) {
      if (!this.grid[r][c].isWall && !(r === this.endPos.row && c === this.endPos.col)) {
        this.startPos = { row: r, col: c };
        this.renderGrid();
      }
    } else if (this.isDraggingEnd) {
      if (!this.grid[r][c].isWall && !(r === this.startPos.row && c === this.startPos.col)) {
        this.endPos = { row: r, col: c };
        this.renderGrid();
      }
    } else if (this.isMousePressed) {
      this.toggleWall(r, c);
    }
  }

  toggleWall(r, c) {
    if ((r === this.startPos.row && c === this.startPos.col) ||
        (r === this.endPos.row && c === this.endPos.col)) return;

    const node = this.grid[r][c];
    node.isWall = !node.isWall;
    const cellEl = document.getElementById(`cell-${r}-${c}`);
    if (cellEl) {
      cellEl.classList.toggle('cell-wall', node.isWall);
    }
  }

  clearPath() {
    if (this.pathfindingRunning) return;
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const node = this.grid[r][c];
        node.isVisited = false;
        node.distance = Infinity;
        node.gScore = Infinity;
        node.fScore = Infinity;
        node.previousNode = null;

        const cell = document.getElementById(`cell-${r}-${c}`);
        if (cell) {
          cell.classList.remove('cell-visited', 'cell-shortest-path');
        }
      }
    }
    this.log('Path cleared from grid.', 'info');
  }

  clearWalls() {
    if (this.pathfindingRunning) return;
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        this.grid[r][c].isWall = false;
      }
    }
    this.clearPath();
    this.renderGrid();
    this.log('All walls and obstacles cleared.', 'info');
  }

  generateMaze() {
    if (this.pathfindingRunning) return;
    this.clearWalls();
    const walls = generateRandomMaze(GRID_ROWS, GRID_COLS, this.startPos, this.endPos);
    walls.forEach(({ row, col }) => {
      this.grid[row][col].isWall = true;
    });
    this.renderGrid();
    this.log('Generated random obstacle maze.', 'info');
  }

  runPathfinding() {
    if (this.pathfindingRunning) return;
    this.clearPath();
    this.pathfindingRunning = true;
    this.btnRunPathfinding.disabled = true;

    // Reset nodes
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        this.grid[r][c].isVisited = false;
        this.grid[r][c].distance = Infinity;
        this.grid[r][c].gScore = Infinity;
        this.grid[r][c].fScore = Infinity;
        this.grid[r][c].previousNode = null;
      }
    }

    const startNode = this.grid[this.startPos.row][this.startPos.col];
    const endNode = this.grid[this.endPos.row][this.endPos.col];

    let result = null;
    const algo = this.algoSelect.value || 'bfs';

    if (algo === 'bfs') result = runBFS(this.grid, startNode, endNode);
    else if (algo === 'dfs') result = runDFS(this.grid, startNode, endNode);
    else if (algo === 'dijkstra') result = runDijkstra(this.grid, startNode, endNode);
    else if (algo === 'astar') result = runAStar(this.grid, startNode, endNode);

    if (!result) return;

    this.log(`Running ${algo.toUpperCase()} Pathfinding...`, 'info');

    // Animate visited nodes
    const { visited, path, success } = result;

    for (let i = 0; i <= visited.length; i++) {
      if (i === visited.length) {
        setTimeout(() => {
          this.animateShortestPath(path, success);
        }, 12 * i);
        return;
      }

      setTimeout(() => {
        const { row, col } = visited[i];
        if (!(row === this.startPos.row && col === this.startPos.col) &&
            !(row === this.endPos.row && col === this.endPos.col)) {
          const cell = document.getElementById(`cell-${row}-${col}`);
          if (cell) cell.classList.add('cell-visited');
        }
      }, 12 * i);
    }
  }

  animateShortestPath(path, success) {
    if (!success || path.length === 0) {
      this.log('Target cannot be reached! No path exists.', 'error');
      soundSynth.playNotFound();
      this.pathfindingRunning = false;
      this.btnRunPathfinding.disabled = false;
      return;
    }

    for (let i = 0; i < path.length; i++) {
      setTimeout(() => {
        const { row, col } = path[i];
        if (!(row === this.startPos.row && col === this.startPos.col) &&
            !(row === this.endPos.row && col === this.endPos.col)) {
          const cell = document.getElementById(`cell-${row}-${col}`);
          if (cell) cell.classList.add('cell-shortest-path');
        }
        if (i === path.length - 1) {
          this.log(`Shortest path found! Total path length: ${path.length} steps.`, 'success');
          soundSynth.playSuccess();
          this.pathfindingRunning = false;
          this.btnRunPathfinding.disabled = false;
        }
      }, 30 * i);
    }
  }
}

// Bootstrap on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.dsaApp = new App();
});
