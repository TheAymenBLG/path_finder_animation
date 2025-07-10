
// ===== Class: Cell =====
class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.visited = false;
  }
}

// ===== Class: Map =====
class MapGrid {
  constructor(rows, cols, start, goal) {
    this.rows = rows;
    this.cols = cols;
    this.start = start; // [i, j]
    this.goal = goal;   // [i, j]
    this.grid = this.generateGrid();
  }

  generateGrid() {
    const grid = [];
    for (let i = 0; i < this.rows; i++) {
      const row = [];
      for (let j = 0; j < this.cols; j++) {
        row.push(new Cell(i, j));
      }
      grid.push(row);
    }
    return grid;
  }

  getCell(i, j) {
    return (this.grid[i] && this.grid[i][j]) || null;
  }

  getNeighbors(cell) {
    const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
    const neighbors = [];
    for (const [di, dj] of dirs) {
      const ni = cell.i + di;
      const nj = cell.j + dj;
      const neighbor = this.getCell(ni, nj);
      if (neighbor && !neighbor.visited) neighbors.push(neighbor);
    }
    return neighbors;
  }
}

// ===== Class: Agent =====
class Agent {
  play(map) {
    const path = [];
    const stack = [];

    const startCell = map.getCell(...map.start);
    stack.push(startCell);

    while (stack.length > 0) {
      const current = stack.pop();
      if (current.visited) continue;

      current.visited = true;
      path.push([current.i, current.j]);

      if (current.i === map.goal[0] && current.j === map.goal[1]) break;

      const neighbors = map.getNeighbors(current);
      for (const neighbor of neighbors) {
        stack.push(neighbor);
      }
    }

    return path;
  }
}

function getGridMatrix(tiles, rows, cols) {
  const grid = [];


  for (let i = 0; i < rows; i++) {

    const row = [];
    for (let j = 0; j < cols; j++) {

      row.push(tiles[i * cols + j]); // linear index → 2D
    }
    grid.push(row);
  }

  return grid;
}


// ===== Function: Animate =====
function Animate(path, goal) {
  const tiles = document.querySelectorAll('.tile');
  const tileMatrix = getGridMatrix(tiles, 10, 10);
  const getTile = (i, j) => tileMatrix[i][j];

  const goalTile = getTile(...goal);
  if (goalTile) goalTile.style.backgroundColor = 'green';

  let prev = null;
  let index = 0;

  const interval = setInterval(() => {
    if (index >= path.length) {
      clearInterval(interval);
      return;
    }

    const [i, j] = path[index];
    const tile = getTile(i, j);
    if (tile) tile.style.backgroundColor = 'blue';
    if (prev) prev.style.backgroundColor = '#ccc';

    prev = tile;
    index++;
  }, 100);
}




// const tiles = document.querySelectorAll('.tile');

// currentIndex = 0;
// while (currentIndex < tiles.length) {

//     const i = currentIndex;

//     setTimeout(() => {
//         // console.log(tiles[i])

//         tiles[i].style.backgroundColor = '#aa00aa';
//     }, i * 50); // delay each one by 50ms
//     setTimeout(() => {
//         if (i > 0) tiles[i - 1].style.backgroundColor = '#bcebae';
//     }, i * 50 + 10);

//     prev = tiles[i];
//     currentIndex++;
// }


const map = new MapGrid(10, 10, [0, 0], [5, 5]);
// console.log(map);

const agent = new Agent();
// console.log(agent);


const path = agent.play(map);
// console.log(path);

Animate(path, map.goal);
