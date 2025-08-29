
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
    this.walls = this.#generateWallsCoordinates(rows, cols);
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

  #generateWallsCoordinates(rows, cols, fraction = 0.2) {
    if (fraction < 0 || fraction > 1) {
      throw "Fraction must be between 0 and 1.";
    }

    const cellCount = rows * cols;

    const wallCount = Math.floor(fraction * cellCount);

    const wallsSet = new Set();

    while (wallsSet.size < wallCount) {
      const x = Math.floor(Math.random() * rows);
      const y = Math.floor(Math.random() * cols);

      if (
        (this.start && x === this.start[0] && y === this.start[1]) ||
        (this.goal && x === this.goal[0] && y === this.goal[1])
      ) {
        continue;
      }

      const key = `${x},${y}`;
      wallsSet.add(key);
    }

    const walls = Array.from(wallsSet).map(key => {
      const parts = key.split(',');
      return [parseInt(parts[0], 10), parseInt(parts[1], 10)];
    });

    return walls;
  }
  

  #getCell(i, j) {
    return (this.grid[i] && this.grid[i][j]) || null;
  }
  getStartCell() {
    return grid.#getCell(...grid.start);
  }
  getGoalCell() {
    return grid.#getCell(...grid.goal);
  }
  getWallCells(){
    return Array.from(this.walls).map(value => this.#getCell(...value));
  }

  getNeighbors(cell) {
    const neighbors = [];
    const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    for (const [di, dj] of directions) {
      let neighbor = this.#getCell(cell.i + di, cell.j + dj);
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
    this.path.push(grid.getStartCell())
    this.engine = new DFSEngine(this);
  }

  isFinished() {
    return this.grid.isGoal(this.path.at(-1));
  }

  perceive() {
    // throw new Error("Must implement perceive()");
  }

  act() {
    // throw new Error("Must implement act()");
    let nextStep = this.engine.findNextAction();
    if (nextStep) {
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
  toVisitStack = [];
  walls = null;
  


  constructor(agent) {
    super(agent)
    this.toVisitStack.push(agent.path[0]);
    this.walls = this.agent.grid.getWallCells();
  }


  findNextAction() {
    //return next step, or null if goal reached or no cells to visit

    if (this.toVisitStack.length > 0 && !this.agent.isFinished()) {
      // console.log(`stack length : ${this.stack.length}`)
      let current = this.toVisitStack.at(-1);
      while (this.visited.has(current)) {
        current = this.toVisitStack.pop();
      }
      // current = this.stack.pop();


      this.visited.add(current);

      const neighbors = agent.grid.getNeighbors(current);

      for (const neighbor of neighbors) {
        if(this.walls.includes(neighbor)){
          continue;
        }
        this.toVisitStack.push(neighbor);
      }

      return current;
    }
    return null;
  }
}

class Renderer {
  constructor(containerId, agent) {
    this.containerId = containerId;
    this.grid = agent.grid;
    this.agent = agent;
  }



  getDOMcell(row, column) {
    return document.querySelector(`.row${row}.column${column}`)
  }
  getDOMgoalCell() {
    return this.getDOMcell(...this.grid.goal)
  }
  getDOMwalls(){
    return Array.from(this.grid.walls).map(value => this.getDOMcell(...value));

  }


  renderGrid() {
    this.containerId.style.gridTemplateRows = `repeat(${this.grid.rows}, 1fr)`;
    this.containerId.style.gridTemplateColumns = `repeat(${this.grid.cols}, 1fr)`;

    for (let i = 0; i < this.grid.rows; i++) {
      for (let j = 0; j < this.grid.cols; j++) {
        const cell = document.createElement("div");
        this.containerId.appendChild(cell);
        cell.classList.add(`tile`);
        cell.classList.add(`row${i}`);
        cell.classList.add(`column${j}`);
      }
    }
    this.getDOMgoalCell().style.backgroundColor = "green";
    for (const wallCell of this.getDOMwalls()) {
      wallCell.style.backgroundColor = 'black';
    }
  }

  updatePath() {
    const currentCell = this.agent.path.at(-1);
    const lastCellVisited = this.agent.path.at(-2);
    const currentDOMcell = this.getDOMcell(currentCell.i, currentCell.j);
    const lastDOMcellVisited = this.getDOMcell(lastCellVisited.i, lastCellVisited.j);
    currentDOMcell.style.backgroundColor = "blue";
    lastDOMcellVisited.style.backgroundColor = "lightBlue";
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
  constructor(agent, renderer) {
    this.renderer = renderer;
    this.agent = agent;
    this.grid = agent.grid;
    // this.renderer = renderer;
  }

  play() {
    this.renderer.renderGrid();
    const id = setInterval(() => {
      let step = this.agent.act();
      this.renderer.updatePath();
      if (step) {
        console.log(step)
      } else {
        clearInterval(id);
      }
    }, 200);

  }
}


const grid = new MapGrid(5, 10, [3, 0], [3, 3]);

const agent = new Agent(grid);
// console.log(`agent is : ${agent.toString()}`);

const renderer = new Renderer(document.querySelector("#grid"), agent);

const controller = new Controller(agent, renderer)
controller.play();
