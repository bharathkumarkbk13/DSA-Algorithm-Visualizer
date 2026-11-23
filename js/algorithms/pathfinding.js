/**
 * Grid-based Pathfinding Algorithms (BFS, DFS, Dijkstra, A*) & Maze Generation
 */

export const GRID_ROWS = 18;
export const GRID_COLS = 38;

export function createInitialGrid(rows = GRID_ROWS, cols = GRID_COLS) {
  const grid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        isStart: r === Math.floor(rows / 2) && c === 4,
        isEnd: r === Math.floor(rows / 2) && c === cols - 5,
        isWall: false,
        distance: Infinity,
        gScore: Infinity,
        fScore: Infinity,
        isVisited: false,
        previousNode: null
      });
    }
  }
  return grid;
}

function getNeighbors(node, grid, rows, cols) {
  const neighbors = [];
  const { row, col } = node;
  // Up, Down, Left, Right
  const directions = [
    [-1, 0], // Up
    [1, 0],  // Down
    [0, -1], // Left
    [0, 1]   // Right
  ];

  for (const [dr, dc] of directions) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
      neighbors.push(grid[nr][nc]);
    }
  }
  return neighbors;
}

function reconstructPath(endNode) {
  const path = [];
  let curr = endNode;
  while (curr !== null) {
    path.unshift({ row: curr.row, col: curr.col });
    curr = curr.previousNode;
  }
  return path;
}

/**
 * BFS Pathfinding
 */
export function runBFS(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  const queue = [startNode];
  startNode.isVisited = true;

  while (queue.length > 0) {
    const current = queue.shift();
    visitedNodesInOrder.push({ row: current.row, col: current.col });

    if (current.row === endNode.row && current.col === endNode.col) {
      return {
        visited: visitedNodesInOrder,
        path: reconstructPath(current),
        success: true
      };
    }

    const neighbors = getNeighbors(current, grid, grid.length, grid[0].length);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.isVisited = true;
        neighbor.previousNode = current;
        queue.push(neighbor);
      }
    }
  }

  return {
    visited: visitedNodesInOrder,
    path: [],
    success: false
  };
}

/**
 * DFS Pathfinding
 */
export function runDFS(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  const stack = [startNode];

  while (stack.length > 0) {
    const current = stack.pop();

    if (current.isVisited || current.isWall) continue;
    current.isVisited = true;
    visitedNodesInOrder.push({ row: current.row, col: current.col });

    if (current.row === endNode.row && current.col === endNode.col) {
      return {
        visited: visitedNodesInOrder,
        path: reconstructPath(current),
        success: true
      };
    }

    const neighbors = getNeighbors(current, grid, grid.length, grid[0].length);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.previousNode = current;
        stack.push(neighbor);
      }
    }
  }

  return {
    visited: visitedNodesInOrder,
    path: [],
    success: false
  };
}

/**
 * Dijkstra's Algorithm
 */
export function runDijkstra(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = [];

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      unvisitedNodes.push(grid[r][c]);
    }
  }

  while (unvisitedNodes.length > 0) {
    unvisitedNodes.sort((a, b) => a.distance - b.distance);
    const closestNode = unvisitedNodes.shift();

    if (closestNode.isWall) continue;
    if (closestNode.distance === Infinity) {
      return { visited: visitedNodesInOrder, path: [], success: false };
    }

    closestNode.isVisited = true;
    visitedNodesInOrder.push({ row: closestNode.row, col: closestNode.col });

    if (closestNode.row === endNode.row && closestNode.col === endNode.col) {
      return {
        visited: visitedNodesInOrder,
        path: reconstructPath(closestNode),
        success: true
      };
    }

    const neighbors = getNeighbors(closestNode, grid, grid.length, grid[0].length);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        const alt = closestNode.distance + 1; // Unweighted grid step weight = 1
        if (alt < neighbor.distance) {
          neighbor.distance = alt;
          neighbor.previousNode = closestNode;
        }
      }
    }
  }

  return { visited: visitedNodesInOrder, path: [], success: false };
}

/**
 * A* (A-Star) Algorithm
 */
export function runAStar(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  const openSet = [startNode];

  startNode.gScore = 0;
  startNode.fScore = manhattanDistance(startNode, endNode);

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.fScore - b.fScore);
    const current = openSet.shift();

    if (current.isWall) continue;
    current.isVisited = true;
    visitedNodesInOrder.push({ row: current.row, col: current.col });

    if (current.row === endNode.row && current.col === endNode.col) {
      return {
        visited: visitedNodesInOrder,
        path: reconstructPath(current),
        success: true
      };
    }

    const neighbors = getNeighbors(current, grid, grid.length, grid[0].length);
    for (const neighbor of neighbors) {
      if (neighbor.isVisited || neighbor.isWall) continue;

      const tentativeGScore = current.gScore + 1;
      if (tentativeGScore < neighbor.gScore) {
        neighbor.previousNode = current;
        neighbor.gScore = tentativeGScore;
        neighbor.fScore = tentativeGScore + manhattanDistance(neighbor, endNode);

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return { visited: visitedNodesInOrder, path: [], success: false };
}

function manhattanDistance(nodeA, nodeB) {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

/**
 * Random Maze Generator (Dense and connected)
 */
export function generateRandomMaze(rows, cols, startNode, endNode) {
  const walls = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if ((r === startNode.row && c === startNode.col) ||
          (r === endNode.row && c === endNode.col)) {
        continue;
      }
      // ~30% chance of a wall
      if (Math.random() < 0.28) {
        walls.push({ row: r, col: c });
      }
    }
  }
  return walls;
}
