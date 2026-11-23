# DSA Algorithm Visualizer

An interactive, high-performance web application built with **HTML5, CSS3, and JavaScript (ES6+ Modules)** to visualize fundamental data structures and algorithms with step-by-step graphical representation, live execution commentary, and time & space complexity analysis.

![DSA Visualizer Banner](https://img.shields.io/badge/Algorithms-Interactive-blue.svg)
![Vanilla JS](https://img.shields.io/badge/Vanilla-JS%20(ES6+)-yellow.svg)
![Web Audio API](https://img.shields.io/badge/Audio-Synthesizer-purple.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

## 🌟 Key Features

### 1. 📊 Sorting Algorithms
- **Supported Algorithms**:
  - **Bubble Sort**: Adjacent element comparison and bubbling.
  - **Selection Sort**: Unsorted sublist scan and minimum element extraction.
  - **Insertion Sort**: Shift-and-insert mechanism for sorted left partitions.
  - **Merge Sort**: Divide-and-conquer sub-array splitting and merging.
  - **Quick Sort**: Partitioning with pivot tracking.
  - **Heap Sort**: Max-Heap construction and iterative root extraction.
- **Visual Features**: Dynamic bar heights, color-coded element states (Comparing, Swapping, Sorted, Pivot, Active Range), and real-time audio pitch generation based on element values.
- **Input Flexibility**: Randomize array, customize array size (6 to 40 elements), adjust animation speed, or supply custom comma-separated numbers.

### 2. 🔍 Searching Algorithms
- **Linear Search**: Sequential step-by-step traversal comparing each element against the search target.
- **Binary Search**: Logarithmic search on sorted arrays showing active search window, `low`, `mid`, and `high` pointer markers, and half-space elimination.

### 3. 🧱 Interactive Data Structures
- **Stack (LIFO)**: Vertical beaker visualizer with `push`, `pop`, `peek`, and `clear` animations, and top-pointer indicators.
- **Queue (FIFO)**: Horizontal track conveyor with `enqueue` (rear) and `dequeue` (front) animations.
- **Linked Lists**:
  - **Singly Linked List**: Head/Tail insertion, deletion, and node traversal with pointer arrows (`➔`).
  - **Doubly Linked List**: Bidirectional pointers (`prev` & `next`), pointer rewiring, and search traversal.
- **Binary Search Tree (BST)**:
  - SVG tree rendering with auto-calculated node coordinate geometry.
  - Interactive operations: Insert node, Delete node (leaf, one child, or two children with in-order successor), and Search.
  - Traversals: In-Order, Pre-Order, Post-Order, and Level-Order traversals.

### 4. 🧭 Pathfinding & 2D Grid Graph
- **Algorithms**:
  - **Breadth-First Search (BFS)**: Unweighted shortest path guarantee.
  - **Depth-First Search (DFS)**: Deep branch exploration.
  - **Dijkstra's Algorithm**: Weighted shortest path navigation.
  - **A\* Search**: Heuristic-guided search utilizing Manhattan distance ($f(n) = g(n) + h(n)$).
- **Interactive Grid**: Click and drag to draw obstacle walls, reposition draggable Start and Target pins, and generate randomized mazes.

### 5. 🕹️ Deterministic Playback Engine
- **Playback Controls**: Play, Pause, Step Forward, and Step Backward.
- **Scrubber Timeline**: Drag the slider back and forth to inspect exact historical states of algorithm execution.
- **Speed Control**: Adjust execution speed smoothly from slow-motion inspection to high-speed completion.

### 6. 🎧 Web Audio API Sound Synthesizer
- Generates procedural sound waves proportional to element values during comparisons, swaps, and searches.
- Includes success fanfare chords and toggleable mute/unmute control.

### 7. ⏱️ Complexity & Educational Inspector
- **Big-O Analysis**: Displays Best-Case, Average-Case, and Worst-Case Time Complexity, Auxiliary Space Complexity, In-Place status, and Stability.
- **Live Pseudocode Highlighting**: Correlates the active visual step directly to its matching pseudocode line.
- **Live Event Log & Commentary**: Step-by-step narrative explaining what is happening at every instant.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Space` | Play / Pause algorithm playback |
| `→` (Right Arrow) | Step Forward one action |
| `←` (Left Arrow) | Step Backward one action |
| `R` | Reset to initial state |
| `M` | Toggle sound on / off |

---

## 🚀 Getting Started

No build tools, compilers, or heavy dependencies required. Runs directly in any modern web browser.

### Option 1: Direct Browser Launch
Simply open `index.html` in your web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local HTTP Server (Recommended for ES6 Modules)
Using Python:
```bash
python -m http.server 8000
```
Then navigate to:
```
http://localhost:8000
```

Or using Node.js `npx serve`:
```bash
npx serve .
```

---

## 📁 Project Architecture

```
DSA-Algorithm-Visualizer/
├── index.html                  # Main application markup & panels
├── README.md                   # Documentation & overview
├── styles/
│   ├── main.css                # Layout, cyber slate theme & inspector styling
│   ├── components.css          # Buttons, sliders, inputs, scrubber timeline
│   └── visualizers.css         # Sorting bars, search cells, DS stages, grid animations
└── js/
    ├── app.js                  # Central application orchestrator & DOM bindings
    ├── state.js                # Playback timeline engine (play, pause, step)
    ├── audio.js                # Web Audio API procedural sound synthesizer
    ├── algorithms/
    │   ├── sorting.js          # Bubble, Selection, Insertion, Merge, Quick, Heap sort
    │   ├── searching.js        # Linear & Binary search step generators
    │   └── pathfinding.js      # BFS, DFS, Dijkstra, A* & maze generation
    ├── datastructures/
    │   ├── stack.js            # LIFO visual container & operations
    │   ├── queue.js            # FIFO conveyor container & operations
    │   ├── linkedlist.js       # Singly & Doubly linked list visualizer
    │   └── bst.js              # Binary Search Tree SVG renderer & traversals
    └── utils/
        └── complexityData.js   # Big-O data, pseudocode & descriptions
```

---

## 📜 License
Distributed under the MIT License.
