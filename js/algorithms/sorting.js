/**
 * Sorting Algorithm Step Generators
 * Each generator produces a deterministic sequence of state snapshots and visual metadata.
 */

// Deep copy helper
const clone = (arr) => [...arr];

/**
 * Bubble Sort Step Generator
 */
export function generateBubbleSortSteps(initialArray) {
  const steps = [];
  const arr = clone(initialArray);
  const n = arr.length;
  const sortedIndices = [];

  steps.push({
    array: clone(arr),
    comparing: [],
    swapping: [],
    sorted: [],
    codeLine: 1,
    description: `Starting Bubble Sort on array of ${n} elements.`
  });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      // Comparison step
      steps.push({
        array: clone(arr),
        comparing: [j, j + 1],
        swapping: [],
        sorted: clone(sortedIndices),
        codeLine: 5,
        description: `Comparing elements at index ${j} (${arr[j]}) and index ${j + 1} (${arr[j + 1]}).`
      });

      if (arr[j] > arr[j + 1]) {
        // Swap step
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;

        steps.push({
          array: clone(arr),
          comparing: [],
          swapping: [j, j + 1],
          sorted: clone(sortedIndices),
          codeLine: 6,
          description: `Swapped elements: ${arr[j + 1]} was greater than ${arr[j]}.`
        });
      }
    }
    // Element at n - 1 - i is now in its final sorted position
    sortedIndices.push(n - 1 - i);
    steps.push({
      array: clone(arr),
      comparing: [],
      swapping: [],
      sorted: clone(sortedIndices),
      codeLine: 10,
      description: `Element ${arr[n - 1 - i]} at index ${n - 1 - i} is now sorted.`
    });

    if (!swapped) {
      steps.push({
        array: clone(arr),
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: n }, (_, idx) => idx),
        codeLine: 11,
        description: `No swaps occurred in this pass. Array is already completely sorted!`
      });
      break;
    }
  }

  // Final sorted state
  steps.push({
    array: clone(arr),
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, idx) => idx),
    codeLine: 12,
    description: `Bubble Sort complete! All elements are sorted.`
  });

  return steps;
}

/**
 * Selection Sort Step Generator
 */
export function generateSelectionSortSteps(initialArray) {
  const steps = [];
  const arr = clone(initialArray);
  const n = arr.length;
  const sortedIndices = [];

  steps.push({
    array: clone(arr),
    comparing: [],
    swapping: [],
    sorted: [],
    codeLine: 1,
    description: `Starting Selection Sort on array of ${n} elements.`
  });

  for (let i = 0; i < n; i++) {
    let minIdx = i;
    steps.push({
      array: clone(arr),
      comparing: [i],
      swapping: [],
      sorted: clone(sortedIndices),
      special: { minIndex: minIdx },
      codeLine: 4,
      description: `Searching for minimum element starting at index ${i} (current min: ${arr[minIdx]}).`
    });

    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: clone(arr),
        comparing: [j, minIdx],
        swapping: [],
        sorted: clone(sortedIndices),
        special: { minIndex: minIdx },
        codeLine: 6,
        description: `Comparing index ${j} (${arr[j]}) with current minimum at index ${minIdx} (${arr[minIdx]}).`
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          array: clone(arr),
          comparing: [j],
          swapping: [],
          sorted: clone(sortedIndices),
          special: { minIndex: minIdx },
          codeLine: 7,
          description: `Found new minimum element: ${arr[minIdx]} at index ${minIdx}.`
        });
      }
    }

    if (minIdx !== i) {
      steps.push({
        array: clone(arr),
        comparing: [],
        swapping: [i, minIdx],
        sorted: clone(sortedIndices),
        codeLine: 11,
        description: `Swapping element at index ${i} (${arr[i]}) with minimum element at index ${minIdx} (${arr[minIdx]}).`
      });
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
    }

    sortedIndices.push(i);
    steps.push({
      array: clone(arr),
      comparing: [],
      swapping: [],
      sorted: clone(sortedIndices),
      codeLine: 13,
      description: `Element at index ${i} (${arr[i]}) placed in its final sorted position.`
    });
  }

  steps.push({
    array: clone(arr),
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, idx) => idx),
    codeLine: 14,
    description: `Selection Sort complete! All elements are sorted.`
  });

  return steps;
}

/**
 * Insertion Sort Step Generator
 */
export function generateInsertionSortSteps(initialArray) {
  const steps = [];
  const arr = clone(initialArray);
  const n = arr.length;

  steps.push({
    array: clone(arr),
    comparing: [],
    swapping: [],
    sorted: [0],
    codeLine: 1,
    description: `Starting Insertion Sort. Initial element at index 0 is trivially sorted.`
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    steps.push({
      array: clone(arr),
      comparing: [i],
      swapping: [],
      sorted: Array.from({ length: i }, (_, idx) => idx),
      special: { keyIndex: i, keyValue: key },
      codeLine: 3,
      description: `Picked key element ${key} at index ${i} to insert into sorted left portion.`
    });

    while (j >= 0 && arr[j] > key) {
      steps.push({
        array: clone(arr),
        comparing: [j, j + 1],
        swapping: [],
        sorted: [],
        special: { keyIndex: i, keyValue: key },
        codeLine: 6,
        description: `Element ${arr[j]} at index ${j} is greater than key ${key}. Shifting it right.`
      });

      arr[j + 1] = arr[j];
      steps.push({
        array: clone(arr),
        comparing: [],
        swapping: [j, j + 1],
        sorted: [],
        special: { keyIndex: i, keyValue: key },
        codeLine: 6,
        description: `Shifted ${arr[j + 1]} to index ${j + 1}.`
      });

      j--;
    }

    arr[j + 1] = key;
    steps.push({
      array: clone(arr),
      comparing: [],
      swapping: [j + 1],
      sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
      codeLine: 8,
      description: `Inserted key ${key} at position ${j + 1}. Subarray [0..${i}] is now sorted.`
    });
  }

  steps.push({
    array: clone(arr),
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, idx) => idx),
    codeLine: 10,
    description: `Insertion Sort complete! All elements are sorted.`
  });

  return steps;
}

/**
 * Merge Sort Step Generator
 */
export function generateMergeSortSteps(initialArray) {
  const steps = [];
  const arr = clone(initialArray);
  const n = arr.length;

  steps.push({
    array: clone(arr),
    comparing: [],
    swapping: [],
    sorted: [],
    codeLine: 1,
    description: `Starting Merge Sort. Divide and conquer approach.`
  });

  function merge(left, mid, right) {
    const leftPart = arr.slice(left, mid + 1);
    const rightPart = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    steps.push({
      array: clone(arr),
      comparing: [],
      swapping: [],
      sorted: [],
      range: [left, right],
      codeLine: 9,
      description: `Merging sub-arrays [${left}..${mid}] and [${mid + 1}..${right}].`
    });

    while (i < leftPart.length && j < rightPart.length) {
      steps.push({
        array: clone(arr),
        comparing: [left + i, mid + 1 + j],
        swapping: [],
        sorted: [],
        range: [left, right],
        codeLine: 10,
        description: `Comparing ${leftPart[i]} (left) and ${rightPart[j]} (right).`
      });

      if (leftPart[i] <= rightPart[j]) {
        arr[k] = leftPart[i];
        i++;
      } else {
        arr[k] = rightPart[j];
        j++;
      }

      steps.push({
        array: clone(arr),
        comparing: [],
        swapping: [k],
        sorted: [],
        range: [left, right],
        codeLine: 11,
        description: `Placed ${arr[k]} into position ${k}.`
      });
      k++;
    }

    while (i < leftPart.length) {
      arr[k] = leftPart[i];
      steps.push({
        array: clone(arr),
        comparing: [],
        swapping: [k],
        sorted: [],
        range: [left, right],
        codeLine: 11,
        description: `Placed remaining left element ${arr[k]} into position ${k}.`
      });
      i++;
      k++;
    }

    while (j < rightPart.length) {
      arr[k] = rightPart[j];
      steps.push({
        array: clone(arr),
        comparing: [],
        swapping: [k],
        sorted: [],
        range: [left, right],
        codeLine: 11,
        description: `Placed remaining right element ${arr[k]} into position ${k}.`
      });
      j++;
      k++;
    }
  }

  function mergeSortHelper(left, right) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);

    steps.push({
      array: clone(arr),
      comparing: [mid],
      swapping: [],
      sorted: [],
      range: [left, right],
      codeLine: 3,
      description: `Dividing range [${left}..${right}] at mid index ${mid}.`
    });

    mergeSortHelper(left, mid);
    mergeSortHelper(mid + 1, right);
    merge(left, mid, right);
  }

  mergeSortHelper(0, n - 1);

  steps.push({
    array: clone(arr),
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, idx) => idx),
    codeLine: 12,
    description: `Merge Sort complete! All sub-arrays merged into fully sorted order.`
  });

  return steps;
}

/**
 * Quick Sort Step Generator
 */
export function generateQuickSortSteps(initialArray) {
  const steps = [];
  const arr = clone(initialArray);
  const n = arr.length;
  const sortedIndices = new Set();

  steps.push({
    array: clone(arr),
    comparing: [],
    swapping: [],
    sorted: [],
    codeLine: 1,
    description: `Starting Quick Sort with pivot partitioning.`
  });

  function partition(low, high) {
    const pivot = arr[high];
    let i = low - 1;

    steps.push({
      array: clone(arr),
      comparing: [],
      swapping: [],
      sorted: Array.from(sortedIndices),
      pivot: high,
      range: [low, high],
      codeLine: 8,
      description: `Chosen pivot: ${pivot} at index ${high}. Partitioning range [${low}..${high}].`
    });

    for (let j = low; j < high; j++) {
      steps.push({
        array: clone(arr),
        comparing: [j, high],
        swapping: [],
        sorted: Array.from(sortedIndices),
        pivot: high,
        range: [low, high],
        codeLine: 11,
        description: `Comparing element at index ${j} (${arr[j]}) with pivot (${pivot}).`
      });

      if (arr[j] < pivot) {
        i++;
        if (i !== j) {
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;

          steps.push({
            array: clone(arr),
            comparing: [],
            swapping: [i, j],
            sorted: Array.from(sortedIndices),
            pivot: high,
            range: [low, high],
            codeLine: 12,
            description: `${arr[i]} < pivot (${pivot}). Swapped with element at boundary index ${i}.`
          });
        }
      }
    }

    // Place pivot in its correct sorted position
    const temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;

    const pivotPos = i + 1;
    sortedIndices.add(pivotPos);

    steps.push({
      array: clone(arr),
      comparing: [],
      swapping: [pivotPos, high],
      sorted: Array.from(sortedIndices),
      pivot: pivotPos,
      codeLine: 15,
      description: `Pivot ${arr[pivotPos]} swapped to its finalized sorted position at index ${pivotPos}.`
    });

    return pivotPos;
  }

  function quickSortHelper(low, high) {
    if (low < high) {
      const pi = partition(low, high);
      quickSortHelper(low, pi - 1);
      quickSortHelper(pi + 1, high);
    } else if (low === high) {
      sortedIndices.add(low);
    }
  }

  quickSortHelper(0, n - 1);

  steps.push({
    array: clone(arr),
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, idx) => idx),
    codeLine: 16,
    description: `Quick Sort complete! All partitions recursively sorted.`
  });

  return steps;
}

/**
 * Heap Sort Step Generator
 */
export function generateHeapSortSteps(initialArray) {
  const steps = [];
  const arr = clone(initialArray);
  const n = arr.length;
  const sortedIndices = [];

  steps.push({
    array: clone(arr),
    comparing: [],
    swapping: [],
    sorted: [],
    codeLine: 1,
    description: `Starting Heap Sort. First phase: build a Max-Heap.`
  });

  function heapify(size, root) {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size) {
      steps.push({
        array: clone(arr),
        comparing: [left, largest],
        swapping: [],
        sorted: clone(sortedIndices),
        codeLine: 4,
        description: `Checking left child at index ${left} (${arr[left]}) against current largest at index ${largest} (${arr[largest]}).`
      });
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    if (right < size) {
      steps.push({
        array: clone(arr),
        comparing: [right, largest],
        swapping: [],
        sorted: clone(sortedIndices),
        codeLine: 4,
        description: `Checking right child at index ${right} (${arr[right]}) against current largest at index ${largest} (${arr[largest]}).`
      });
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest !== root) {
      const temp = arr[root];
      arr[root] = arr[largest];
      arr[largest] = temp;

      steps.push({
        array: clone(arr),
        comparing: [],
        swapping: [root, largest],
        sorted: clone(sortedIndices),
        codeLine: 9,
        description: `Swapped index ${root} (${arr[root]}) with larger child at index ${largest} (${arr[largest]}). Sifting down.`
      });

      heapify(size, largest);
    }
  }

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    steps.push({
      array: clone(arr),
      comparing: [i],
      swapping: [],
      sorted: [],
      codeLine: 3,
      description: `Heapifying non-leaf node at index ${i} (${arr[i]}).`
    });
    heapify(n, i);
  }

  steps.push({
    array: clone(arr),
    comparing: [],
    swapping: [],
    sorted: [],
    codeLine: 6,
    description: `Max-Heap constructed! Root element (${arr[0]}) is the maximum.`
  });

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    steps.push({
      array: clone(arr),
      comparing: [],
      swapping: [0, i],
      sorted: clone(sortedIndices),
      codeLine: 8,
      description: `Swapping maximum element (${arr[0]}) at root with last unsorted element (${arr[i]}) at index ${i}.`
    });

    const temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;

    sortedIndices.unshift(i);

    steps.push({
      array: clone(arr),
      comparing: [],
      swapping: [],
      sorted: clone(sortedIndices),
      codeLine: 9,
      description: `Element ${arr[i]} at index ${i} is now in its finalized sorted position.`
    });

    heapify(i, 0);
  }

  sortedIndices.unshift(0);

  steps.push({
    array: clone(arr),
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, idx) => idx),
    codeLine: 11,
    description: `Heap Sort complete! All elements sorted.`
  });

  return steps;
}
