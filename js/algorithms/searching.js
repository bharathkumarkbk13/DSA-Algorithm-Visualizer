/**
 * Searching Algorithm Step Generators
 * Linear Search and Binary Search with pointer and target tracking.
 */

const clone = (arr) => [...arr];

/**
 * Linear Search Step Generator
 */
export function generateLinearSearchSteps(initialArray, target) {
  const steps = [];
  const arr = clone(initialArray);
  const n = arr.length;

  steps.push({
    array: clone(arr),
    currentIndex: -1,
    foundIndex: -1,
    target: target,
    codeLine: 1,
    description: `Starting Linear Search for target value: ${target}.`
  });

  let found = false;

  for (let i = 0; i < n; i++) {
    steps.push({
      array: clone(arr),
      currentIndex: i,
      foundIndex: -1,
      target: target,
      codeLine: 3,
      description: `Checking index ${i}: element value is ${arr[i]}. Does it equal target ${target}?`
    });

    if (arr[i] === target) {
      found = true;
      steps.push({
        array: clone(arr),
        currentIndex: i,
        foundIndex: i,
        target: target,
        codeLine: 4,
        description: `Target ${target} FOUND at index ${i} after ${i + 1} comparisons!`
      });
      break;
    }
  }

  if (!found) {
    steps.push({
      array: clone(arr),
      currentIndex: -1,
      foundIndex: -1,
      target: target,
      notFound: true,
      codeLine: 7,
      description: `Target ${target} was NOT found in the array after checking all ${n} elements.`
    });
  }

  return steps;
}

/**
 * Binary Search Step Generator
 * Requires sorted array
 */
export function generateBinarySearchSteps(initialArray, target) {
  const steps = [];
  // Ensure array is sorted for binary search
  const arr = clone(initialArray).sort((a, b) => a - b);
  const n = arr.length;

  steps.push({
    array: clone(arr),
    low: 0,
    high: n - 1,
    mid: -1,
    foundIndex: -1,
    target: target,
    codeLine: 1,
    description: `Starting Binary Search for target value: ${target} on sorted array.`
  });

  let low = 0;
  let high = n - 1;
  let found = false;
  let comparisons = 0;

  while (low <= high) {
    comparisons++;
    const mid = Math.floor((low + high) / 2);

    steps.push({
      array: clone(arr),
      low: low,
      high: high,
      mid: mid,
      foundIndex: -1,
      target: target,
      codeLine: 5,
      description: `Current search window: [${low}..${high}]. Midpoint is index ${mid} (value: ${arr[mid]}).`
    });

    if (arr[mid] === target) {
      found = true;
      steps.push({
        array: clone(arr),
        low: low,
        high: high,
        mid: mid,
        foundIndex: mid,
        target: target,
        codeLine: 6,
        description: `Target ${target} FOUND at mid index ${mid} after ${comparisons} comparison(s)!`
      });
      break;
    } else if (arr[mid] < target) {
      steps.push({
        array: clone(arr),
        low: low,
        high: high,
        mid: mid,
        foundIndex: -1,
        target: target,
        codeLine: 7,
        description: `${arr[mid]} < ${target}. Target must be in right half. Updating low := ${mid + 1}.`
      });
      low = mid + 1;
    } else {
      steps.push({
        array: clone(arr),
        low: low,
        high: high,
        mid: mid,
        foundIndex: -1,
        target: target,
        codeLine: 8,
        description: `${arr[mid]} > ${target}. Target must be in left half. Updating high := ${mid - 1}.`
      });
      high = mid - 1;
    }
  }

  if (!found) {
    steps.push({
      array: clone(arr),
      low: low,
      high: high,
      mid: -1,
      foundIndex: -1,
      target: target,
      notFound: true,
      codeLine: 10,
      description: `Target ${target} was NOT found in the array (low (${low}) > high (${high})).`
    });
  }

  return steps;
}
