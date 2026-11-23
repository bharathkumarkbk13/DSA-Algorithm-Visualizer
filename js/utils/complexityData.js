/**
 * Algorithm and Data Structure Complexity & Educational Metadata
 */

export const ALGORITHM_DATA = {
  // --- SORTING ---
  'bubble-sort': {
    name: 'Bubble Sort',
    category: 'Sorting',
    type: 'comparison',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    stable: true,
    inPlace: true,
    description: 'Bubble Sort is a simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted. The algorithm gets its name because smaller or larger elements "bubble" to the top of the list.',
    pseudocode: [
      'procedure bubbleSort(A : list of sortable items)',
      '    n := length(A)',
      '    repeat',
      '        swapped := false',
      '        for i := 1 to n - 1 inclusive do',
      '            if A[i - 1] > A[i] then',
      '                swap(A[i - 1], A[i])',
      '                swapped := true',
      '            end if',
      '        end for',
      '        n := n - 1',
      '    until not swapped',
      'end procedure'
    ]
  },
  'selection-sort': {
    name: 'Selection Sort',
    category: 'Sorting',
    type: 'comparison',
    timeComplexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    stable: false,
    inPlace: true,
    description: 'Selection Sort divides the input list into two parts: a sorted sublist built up from left to right and an unsorted sublist. In each iteration, it finds the smallest (or largest) element in the unsorted sublist, swaps it with the leftmost unsorted element, and moves the sublist boundary one element to the right.',
    pseudocode: [
      'procedure selectionSort(A : list of sortable items)',
      '    n := length(A)',
      '    for i := 0 to n - 2 do',
      '        minIndex := i',
      '        for j := i + 1 to n - 1 do',
      '            if A[j] < A[minIndex] then',
      '                minIndex := j',
      '            end if',
      '        end for',
      '        if minIndex != i then',
      '            swap(A[i], A[minIndex])',
      '        end if',
      '    end for',
      'end procedure'
    ]
  },
  'insertion-sort': {
    name: 'Insertion Sort',
    category: 'Sorting',
    type: 'comparison',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    stable: true,
    inPlace: true,
    description: 'Insertion Sort builds the final sorted array one item at a time. It iterates through an input array and removes one element per iteration, finding the location it belongs to within the sorted sublist and inserting it there. Highly efficient for small datasets or nearly sorted arrays.',
    pseudocode: [
      'procedure insertionSort(A : list of sortable items)',
      '    for i := 1 to length(A) - 1 do',
      '        key := A[i]',
      '        j := i - 1',
      '        while j >= 0 and A[j] > key do',
      '            A[j + 1] := A[j]',
      '            j := j - 1',
      '        end while',
      '        A[j + 1] := key',
      '    end for',
      'end procedure'
    ]
  },
  'merge-sort': {
    name: 'Merge Sort',
    category: 'Sorting',
    type: 'divide-and-conquer',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)'
    },
    spaceComplexity: 'O(n)',
    stable: true,
    inPlace: false,
    description: 'Merge Sort is an efficient, general-purpose, divide-and-conquer comparison-based sorting algorithm. It divides the unsorted list into n sublists each containing one element, then repeatedly merges sublists to produce new sorted sublists until there is only one remaining.',
    pseudocode: [
      'procedure mergeSort(A, left, right)',
      '    if left < right then',
      '        mid := floor((left + right) / 2)',
      '        mergeSort(A, left, mid)',
      '        mergeSort(A, mid + 1, right)',
      '        merge(A, left, mid, right)',
      '    end if',
      'end procedure',
      'procedure merge(A, left, mid, right)',
      '    // Merge sorted halves into auxiliary buffer',
      '    // Copy back sorted elements into A[left..right]',
      'end procedure'
    ]
  },
  'quick-sort': {
    name: 'Quick Sort',
    category: 'Sorting',
    type: 'divide-and-conquer',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(log n)',
    stable: false,
    inPlace: true,
    description: 'Quick Sort is a divide-and-conquer algorithm. It selects a "pivot" element from the array and partitions the other elements into two sub-arrays according to whether they are less than or greater than the pivot. The sub-arrays are then sorted recursively.',
    pseudocode: [
      'procedure quickSort(A, low, high)',
      '    if low < high then',
      '        pivotIndex := partition(A, low, high)',
      '        quickSort(A, low, pivotIndex - 1)',
      '        quickSort(A, pivotIndex + 1, high)',
      '    end if',
      'end procedure',
      'procedure partition(A, low, high)',
      '    pivot := A[high]',
      '    i := low - 1',
      '    for j := low to high - 1 do',
      '        if A[j] < pivot then',
      '            i := i + 1; swap(A[i], A[j])',
      '        end if',
      '    end for',
      '    swap(A[i + 1], A[high])',
      '    return i + 1',
      'end procedure'
    ]
  },
  'heap-sort': {
    name: 'Heap Sort',
    category: 'Sorting',
    type: 'selection-based',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)'
    },
    spaceComplexity: 'O(1)',
    stable: false,
    inPlace: true,
    description: 'Heap Sort is a comparison-based sorting technique based on a Binary Heap data structure. It divides its input into a sorted and an unsorted region, iteratively shrinks the unsorted region by extracting the maximum element and moving it to the sorted region.',
    pseudocode: [
      'procedure heapSort(A : list of sortable items)',
      '    n := length(A)',
      '    for i := floor(n / 2) - 1 down to 0 do',
      '        heapify(A, n, i)',
      '    end for',
      '    for i := n - 1 down to 1 do',
      '        swap(A[0], A[i])',
      '        heapify(A, i, 0)',
      '    end for',
      'end procedure'
    ]
  },

  // --- SEARCHING ---
  'linear-search': {
    name: 'Linear Search',
    category: 'Searching',
    type: 'sequential',
    timeComplexity: {
      best: 'O(1)',
      average: 'O(n)',
      worst: 'O(n)'
    },
    spaceComplexity: 'O(1)',
    stable: true,
    inPlace: true,
    description: 'Linear Search sequentially checks each element of the list until a match is found or the entire list has been searched. Does not require the array to be sorted.',
    pseudocode: [
      'procedure linearSearch(A, target)',
      '    for i := 0 to length(A) - 1 do',
      '        if A[i] = target then',
      '            return i // Found at index i',
      '        end if',
      '    end for',
      '    return -1 // Target not found',
      'end procedure'
    ]
  },
  'binary-search': {
    name: 'Binary Search',
    category: 'Searching',
    type: 'interval-halving',
    timeComplexity: {
      best: 'O(1)',
      average: 'O(log n)',
      worst: 'O(log n)'
    },
    spaceComplexity: 'O(1)',
    stable: true,
    inPlace: true,
    description: 'Binary Search works on sorted arrays. It repeatedly divides the search interval in half by comparing the target value to the middle element. If unequal, the half in which the target cannot lie is eliminated, reducing search time logarithmically.',
    pseudocode: [
      'procedure binarySearch(A, target)',
      '    low := 0',
      '    high := length(A) - 1',
      '    while low <= high do',
      '        mid := floor((low + high) / 2)',
      '        if A[mid] = target then return mid',
      '        else if A[mid] < target then low := mid + 1',
      '        else high := mid - 1',
      '    end while',
      '    return -1 // Target not found',
      'end procedure'
    ]
  },

  // --- DATA STRUCTURES ---
  'stack': {
    name: 'Stack (LIFO)',
    category: 'Data Structures',
    type: 'linear',
    timeComplexity: {
      best: 'Push: O(1)',
      average: 'Pop: O(1)',
      worst: 'Search: O(n)'
    },
    spaceComplexity: 'O(n)',
    description: 'A Stack is a linear data structure following the Last-In-First-Out (LIFO) principle. Elements can only be added (pushed) or removed (popped) from the top.',
    pseudocode: [
      'push(element): Add element to top of stack (increment top)',
      'pop(): Remove and return top element (decrement top)',
      'peek(): Inspect top element without removing it',
      'isEmpty(): Return true if stack has no elements'
    ]
  },
  'queue': {
    name: 'Queue (FIFO)',
    category: 'Data Structures',
    type: 'linear',
    timeComplexity: {
      best: 'Enqueue: O(1)',
      average: 'Dequeue: O(1)',
      worst: 'Search: O(n)'
    },
    spaceComplexity: 'O(n)',
    description: 'A Queue is a linear data structure that follows the First-In-First-Out (FIFO) principle. Elements enter at the rear (enqueue) and leave from the front (dequeue).',
    pseudocode: [
      'enqueue(element): Insert element at rear of queue',
      'dequeue(): Remove and return element from front of queue',
      'peek(): Inspect front element without removing it',
      'isEmpty(): Check if front index exceeds rear index'
    ]
  },
  'singly-linked-list': {
    name: 'Singly Linked List',
    category: 'Data Structures',
    type: 'linear',
    timeComplexity: {
      best: 'Insert Head: O(1)',
      average: 'Insert Tail: O(n) / O(1)',
      worst: 'Search: O(n)'
    },
    spaceComplexity: 'O(n)',
    description: 'A Singly Linked List consists of nodes where each node contains data and a pointer (next) to the subsequent node in sequence.',
    pseudocode: [
      'insertHead(val): newNode.next := head; head := newNode',
      'insertTail(val): traverse to tail; tail.next := newNode',
      'delete(val): prev.next := curr.next; free(curr)',
      'search(val): iterate from head comparing node.val = val'
    ]
  },
  'doubly-linked-list': {
    name: 'Doubly Linked List',
    category: 'Data Structures',
    type: 'linear',
    timeComplexity: {
      best: 'Insert/Delete Ends: O(1)',
      average: 'Delete Node (given ref): O(1)',
      worst: 'Search: O(n)'
    },
    spaceComplexity: 'O(n)',
    description: 'A Doubly Linked List is a sequence of elements where each node stores two pointers: one pointing forward to the next node, and one pointing backward to the previous node.',
    pseudocode: [
      'insertHead(val): newNode.next := head; head.prev := newNode; head := newNode',
      'deleteNode(node): node.prev.next := node.next; node.next.prev := node.prev',
      'traverseForward / traverseBackward'
    ]
  },
  'bst': {
    name: 'Binary Search Tree (BST)',
    category: 'Data Structures',
    type: 'hierarchical',
    timeComplexity: {
      best: 'O(log n)',
      average: 'O(log n)',
      worst: 'O(n) [unbalanced]'
    },
    spaceComplexity: 'O(n)',
    description: 'A Binary Search Tree is a node-based binary tree data structure where each node has at most two children. For any node, all keys in its left subtree are less than its key, and all keys in its right subtree are greater.',
    pseudocode: [
      'insert(node, val):',
      '    if val < node.val then node.left := insert(node.left, val)',
      '    else if val > node.val then node.right := insert(node.right, val)',
      'search(node, val):',
      '    if node is null or node.val = val then return node',
      '    if val < node.val then return search(node.left, val)',
      '    else return search(node.right, val)'
    ]
  },

  // --- PATHFINDING & GRAPH ---
  'bfs': {
    name: 'Breadth-First Search (BFS)',
    category: 'Pathfinding',
    type: 'graph-traversal',
    timeComplexity: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)'
    },
    spaceComplexity: 'O(V)',
    guaranteesShortestPath: true,
    description: 'Breadth-First Search explores all neighbor nodes at the present depth before moving on to the nodes at the next depth level. It uses a queue and guarantees finding the shortest path on unweighted graphs.',
    pseudocode: [
      'procedure BFS(start, target)',
      '    queue.enqueue(start); visited.add(start)',
      '    while queue is not empty do',
      '        current := queue.dequeue()',
      '        if current = target then return reconstructPath(target)',
      '        for neighbor in getNeighbors(current) do',
      '            if neighbor not in visited and not neighbor.isWall then',
      '                visited.add(neighbor); parent[neighbor] := current',
      '                queue.enqueue(neighbor)',
      '            end if',
      '        end for',
      '    end while',
      'end procedure'
    ]
  },
  'dfs': {
    name: 'Depth-First Search (DFS)',
    category: 'Pathfinding',
    type: 'graph-traversal',
    timeComplexity: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)'
    },
    spaceComplexity: 'O(V)',
    guaranteesShortestPath: false,
    description: 'Depth-First Search explores as far as possible along each branch before backtracking. It uses a stack (or recursion) and does NOT guarantee the shortest path, but visits deep branches quickly.',
    pseudocode: [
      'procedure DFS(start, target)',
      '    stack.push(start); visited.add(start)',
      '    while stack is not empty do',
      '        current := stack.pop()',
      '        if current = target then return reconstructPath(target)',
      '        for neighbor in getNeighbors(current) do',
      '            if neighbor not in visited and not neighbor.isWall then',
      '                visited.add(neighbor); parent[neighbor] := current',
      '                stack.push(neighbor)',
      '            end if',
      '        end for',
      '    end while',
      'end procedure'
    ]
  },
  'dijkstra': {
    name: "Dijkstra's Algorithm",
    category: 'Pathfinding',
    type: 'shortest-path',
    timeComplexity: {
      best: 'O(V + E log V)',
      average: 'O((V + E) log V)',
      worst: 'O(V²)'
    },
    spaceComplexity: 'O(V)',
    guaranteesShortestPath: true,
    description: "Dijkstra's algorithm finds the shortest path between nodes in a graph with non-negative edge weights. It maintains tentative distances from the source and continually expands the lowest-distance unvisited node using a priority queue.",
    pseudocode: [
      'procedure Dijkstra(start, target)',
      '    dist[start] := 0; pq.insert(start, 0)',
      '    while pq is not empty do',
      '        curr := pq.extractMin()',
      '        if curr = target then return reconstructPath(target)',
      '        for neighbor in getNeighbors(curr) do',
      '            alt := dist[curr] + weight(curr, neighbor)',
      '            if alt < dist[neighbor] then',
      '                dist[neighbor] := alt; parent[neighbor] := curr',
      '                pq.insertOrUpdate(neighbor, alt)',
      '            end if',
      '        end for',
      '    end while',
      'end procedure'
    ]
  },
  'astar': {
    name: 'A* Search Algorithm',
    category: 'Pathfinding',
    type: 'informed-search',
    timeComplexity: {
      best: 'O(E)',
      average: 'O(E log V)',
      worst: 'O(V²)'
    },
    spaceComplexity: 'O(V)',
    guaranteesShortestPath: true,
    description: 'A* (A-Star) is an informed search algorithm combining Dijkstra’s algorithm and Greedy Best-First-Search. It evaluates nodes by f(n) = g(n) + h(n), where g(n) is the exact cost from start and h(n) is an admissible heuristic estimate to the goal (e.g. Manhattan distance).',
    pseudocode: [
      'procedure AStar(start, target)',
      '    gScore[start] := 0',
      '    fScore[start] := heuristic(start, target)',
      '    openSet.insert(start, fScore[start])',
      '    while openSet is not empty do',
      '        curr := openSet.extractMin()',
      '        if curr = target then return reconstructPath(target)',
      '        for neighbor in getNeighbors(curr) do',
      '            tentativeG := gScore[curr] + cost(curr, neighbor)',
      '            if tentativeG < gScore[neighbor] then',
      '                parent[neighbor] := curr',
      '                gScore[neighbor] := tentativeG',
      '                fScore[neighbor] := tentativeG + heuristic(neighbor, target)',
      '                openSet.insertOrUpdate(neighbor, fScore[neighbor])',
      '            end if',
      '        end for',
      '    end while',
      'end procedure'
    ]
  }
};
