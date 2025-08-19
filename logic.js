
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
    this.start = start;
    this.goal = goal;
    this.grid = this.generateGrid();
  }
  //TODO : set fallback logic for erroneous settings
  // setStart(){}
  // setGoal(){}
  //initializeGrid(){setStart, setGoal, generateGrid}
  // reset()

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
    const neighbors = [];
    const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    for (const [di, dj] of directions) {
      let neighbor = this.getCell(cell.i + di, cell.j + dj);
      if (neighbor && !neighbor.visited) neighbors.push(neighbor);
    }
    return neighbors;
  }

  isGoal(cell) {
    return cell.i === this.goal[0] && cell.j === this.goal[1]
  }

}

// ===== Class: Agent =====
class Agent {
  path = [];
  engine;
  constructor(grid) {
    this.grid = grid;
    this.path.push(grid.getCell(...grid.start))
    this.engine = new DFSEngine(this);
  }

  isFinished(){
    return this.grid.isGoal(this.path.at(-1));
  }

  perceive() {
    // throw new Error("Must implement perceive()");
  }

  act() {
    // throw new Error("Must implement act()");
    let nextStep= this.engine.findNextAction();
    if (nextStep){
    this.path.push(nextStep);
    }
    return nextStep;
  }


}

class Engine {
  constructor(agent) {
    this.agent = agent;
  }

  findNextAction() {
    throw new Error("Must implement findNextAction");
  }
}

class DFSEngine extends Engine {

  visited = new Set();
  stack = [];

  constructor(agent) {
    super(agent)
    this.stack.push(agent.path[0]);
  }


  findNextAction() {
    //return next step, or null if goal reached or no cells to visit

    if (this.stack.length > 0 && !this.agent.isFinished()) {
      // console.log(`stack length : ${this.stack.length}`)
      let current = this.stack.at(-1);
      while (this.visited.has(current)) {
        current = this.stack.pop();
      }
      // current = this.stack.pop();


      this.visited.add(current);

      const neighbors = agent.grid.getNeighbors(current);
      console.log(neighbors)

      for (const neighbor of neighbors) {
        this.stack.push(neighbor);
      }

      return current;
    }
    return null;
  }
}

class Renderer {
  constructor(containerId, model) { }
  render() {

  }
  animateCell(position, cellType) {
  }
}

// ===== Function: Animate =====
function Animate(path, map) {
  const tiles = document.querySelectorAll('.tile');
  const tileMatrix = getGridMatrix(tiles, map.rows, map.cols);
  const getTile = (i, j) => tileMatrix[i][j];

  const goalTile = getTile(...map.goal);
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
    if (tile) tile.style.backgroundColor = 'pink';
    if (prev) prev.style.backgroundColor = '#ccc';

    prev = tile;
    index++;
  }, 100);
}

class Controller {
  constructor(agent, grid) {
    this.agent = agent;
    this.grid = grid;
    // this.renderer = renderer;
  }

  play() {
    const id = setInterval(() => {
      let step = agent.act();
      if (step) {
        console.log(step)
      } else {
        clearInterval(id);
      }
    }, 1000);

  }
}


const grid = new MapGrid(5, 5, [3, 0], [0, 0]);
// console.log(map);

const agent = new Agent(grid);
console.log(`agent is : ${agent}`);

const controller = new Controller(agent, grid)
controller.play();
