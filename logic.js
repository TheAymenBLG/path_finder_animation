
// to inject cells without copy paste
// const grid = document.getElementById('grid');
// for (let i = 0; i < 100; i++) {
//   grid.appendChild(document.createElement('div')).classList.add('tile');
// } 
const tiles = document.querySelectorAll('.tile');


let grid = [];
let dim = 10;

for (let row = 0; row < dim; row++) {
    grid.push([]);
    for (let col = 0; col < dim; col++) {
        grid[row].push('');

    }
}
// console.log(grid)

// console.log(tiles);
currentIndex = 0;
while (currentIndex < tiles.length) {

    const i = currentIndex;

    setTimeout(() => {
        console.log(tiles[i])

        tiles[i].style.backgroundColor = '#aa00aa';
    }, i * 50); // delay each one by 50ms
    setTimeout(() => {
        if (i > 0) tiles[i - 1].style.backgroundColor = '#bcebae';
    }, i * 50 + 10);

    prev = tiles[i];
    currentIndex++;
}