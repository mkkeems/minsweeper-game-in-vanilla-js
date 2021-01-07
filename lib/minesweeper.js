document.getElementById("newGame").addEventListener("click", () => {
  location.reload();
})

let width = 10
const minesweeper = document.querySelector('#minesweeper');
for (let i = 0; i < width; i += 1) {
  const row = document.createElement('tr');
  row.dataset.row = i;
  for (let j = 0; j < width; j += 1) {
    row.insertAdjacentHTML('beforeend', `<td class="unopened"></td>`);
  }
  minesweeper.append(row);
}

const getGrid = document.querySelectorAll('td');
// array of all cells. Now that it's in an array, we can use indexes to target events and add/remove class
const gridArr = Array.from(getGrid);
const minesArr = [];
const notMineArr = [];
const numOfMines = Math.floor(width * width / 5);
document.getElementById("mineNumLeft").innerText = numOfMines
// get unique random numbers to spread the mines on the gridArr
while (minesArr.length < numOfMines) {
  let mineIndex = Math.floor(Math.random() * Math.floor(width * width - 1));
  // The indexOf() method returns the first index at which a given element can be found in the array, or -1 if it is not present.
  if (minesArr.indexOf(mineIndex) === -1) {
    minesArr.push(mineIndex)
  }
}

// surrounding mine logic for non-mine cells, mapped into an array of objects with information about each cell
const gridMineObjArr = gridArr.map((cell, index) => {
  let numSurroundingMines = 0;
  const cellObj = {
    index: index,
    cell: cell,
    numSurroundingMines: 0,
    isMine: false,
    flagged: false,
    open: false,
    isEmpty: false,
  }

  if (minesArr.includes(index)) {
    cellObj.isMine = true;
    // cell.classList.add('mine')
  }
  return cellObj
});

gridMineObjArr.forEach((cell, index) => {
  if (cell.isMine) {
    return
  }
  if (!cell.isMine) {
    // check if mine exists below cell
    if (gridArr[index + width] !== undefined && gridMineObjArr[index + width].isMine) {
      cell.numSurroundingMines += 1
      // console.log(cell.cell)
      // cell.cell.classList.add(`mine-neighbour-1`)
    }

    // // check if mine exists above cell
    if (gridArr[index - width] !== undefined && gridMineObjArr[index - width].isMine) {
      cell.numSurroundingMines += 1
      // console.log(cell.cell)
      // cell.cell.classList.add(`mine-neighbour-1`)
    }

    // check if mine exists in right cell
    if (gridArr[index + 1] !== undefined && gridMineObjArr[index + 1].isMine) {
      if ((index + 1) % width === 0 && gridMineObjArr[index + 1].isMine) {
        cell.numSurroundingMines
      } else {
        cell.numSurroundingMines += 1;
        // console.log(cell.cell)
        // cell.cell.classList.add(`mine-neighbour-1`)
      }
    }

    if (gridArr[index - 1] !== undefined && gridMineObjArr[index - 1].isMine) {
      if (index % width === 0 && gridMineObjArr[index - 1].isMine) {
        cell.numSurroundingMines
      } else {
        cell.numSurroundingMines += 1;
        // console.log(cell.cell)
        // cell.cell.classList.add(`mine-neighbour-1`)
      }
    }

    // exclude far right and bottom row cells from condition
    // check if mine exists bottom right to cell
    if ((index + 1) % width !== 0 && index < gridArr.length - width) {
      if (gridArr[index + width + 1] !== undefined && gridMineObjArr[index + width + 1].isMine) {
        cell.numSurroundingMines += 1;
        // console.log(cell.cell)
        // cell.cell.classList.add(`mine-neighbour-1`)
      }
    }

    // exclude far left and bottom row cells from condition
    // check if mine exists bottom left to cell
    if ((index) % width !== 0 && index < gridArr.length - width) {
      if (gridArr[index + width - 1] !== undefined && gridMineObjArr[index + width - 1].isMine) {
        cell.numSurroundingMines += 1;
        // console.log(cell.cell)
        // cell.cell.classList.add(`mine-neighbour-1`)
      }
    }

    // exclude top row and far right cells from condition
    // check if mine exists top right to cell
    if ((index + 1) % width !== 0 && index > width + 1) {
      if (gridArr[index - width + 1] && gridMineObjArr[index - width + 1].isMine) {
        cell.numSurroundingMines += 1;
        // console.log(cell.cell)
        // cell.cell.classList.add(`mine-neighbour-1`)
      }
    }

    // exclude top row and far left cells from condition
    // check if mine exists top left to cell
    if (index % width !== 0 && index > width - 1) {
      if (gridArr[index - width - 1] && gridMineObjArr[index - width - 1].isMine) {
        cell.numSurroundingMines += 1;
        // console.log(cell.cell)
        // cell.cell.classList.add(`mine-neighbour-1`)
      }
    }
    if (cell.numSurroundingMines === 0) {
      cell.isEmpty = true;
    }
    notMineArr.push(cell)
  }

  // cell.cell.classList.add(`mine-neighbour-${cell.numSurroundingMines}`)
});

const showAllGrid = () => gridMineObjArr.forEach((cellobj) => {
  if (cellobj.isMine) {
    cellobj.cell.classList.add('mine');
  } else if (!cellobj.isMine && cellobj.numSurroundingMines === 0) {
    cellobj.cell.classList.add('opened');
  }
  cellobj.cell.classList.add(`mine-neighbour-${cellobj.numSurroundingMines}`)
})

// ===============game logic================//
const numOfFlags = () => {
  let flags = 0;
  gridMineObjArr.forEach((obj) => {
    if (obj.flagged) {
      flags += 1
    }
  })
  // console.log(flags)
  return flags
}

// evaluate how clicked cell should expose
const emptyCellIsland = (index) => {

  const id = index
  const isLeftEdge = (id % width === 0)
  const isRightEdge = (id % width === width - 1)
  const isTopEdge = (id <= 0 && id < width - 1)
  const isBottomEdge = (id < gridArr.length - 1 && id > width * (width - 1) - 1)

  // check to the right
  if (id > 0 && !isRightEdge) {
    const newId = id + 1
    if (gridMineObjArr[newId]) {
      exposeCell(gridMineObjArr[newId])
    }
  }
  // check to the left
  if (id < gridArr.length - 1 && !isLeftEdge) {
    const newId = id - 1
    if (gridMineObjArr[newId]) {
      exposeCell(gridMineObjArr[newId])
    }
  }
  // check to the top
  if (id < gridArr.length && !isTopEdge) {
    const newId = id - width
    if (gridMineObjArr[newId]) {
      exposeCell(gridMineObjArr[newId])
    }
  }
  // check to the bottom
  if (id >= 0 && !isBottomEdge) {
    const newId = id + width
    if (gridMineObjArr[newId]) {
      exposeCell(gridMineObjArr[newId])
    }
  }
}

const exposeCell = (cell) => {
  const square = cell.cell
  const isMine = cell.isMine
  const neighbors = cell.numSurroundingMines
  const flagged = cell.flagged
  const open = cell.open
  console.log(cell)
  if (!flagged) {
    if (isMine) {
      square.classList.add('mine')
      // setTimeout(checkGrid(cell), 2000)
    }
    if (cell.isEmpty && !cell.open) {
      square.classList.add('opened')
      cell.open = true
      emptyCellIsland(cell.index);
    }

    square.classList.add(`mine-neighbour-${neighbors}`)
    cell.open = true
  }

  // If cell clicked is a mine, end game 
  if (isMine) {
    document.getElementById("results").innerHTML = "<h1>💥 You clicked a mine 😖 You lose 💥</h1>";
    showAllGrid();
    window.clearInterval();
  }
  checkGrid(cell)
}

const flagCell = (cell) => {
  const square = cell.cell
  const flagged = cell.flagged

  flagged ? square.classList.remove(`flagged`) : square.classList.add(`flagged`)
  cell.flagged = !cell.flagged
  if (cell.flagged) {
    cell.open = true
  } else {
    cell.open = false
  }
  checkGrid();
}


// Add eventListener to cells and evaluate what to show
gridMineObjArr.forEach((cell) => {
  cell.cell.addEventListener("click", () => {
    exposeCell(cell)
  })
  cell.cell.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    flagCell(cell)
  })
});

const nonMinesFound = (obj) => {
  return obj.open && !obj.isMine
}

const anyCellClicked = (obj) => {
  return obj.open
}

const startTimer = () => {
  let seconds = 0
  document.getElementById("timepassed").innerHTML = `${seconds} seconds`;
  if (gridMineObjArr.some(anyCellClicked)) {
    seconds += 1
    document.getElementById("timepassed").innerHTML = `${seconds} seconds`
  }
}


window.setInterval(startTimer, 1000);

const checkGrid = () => {
  const flags = numOfFlags()

  if (flags > 0) {
    document.getElementById("mineNumLeft").innerText = (numOfMines - flags);
  }

  if (gridMineObjArr.filter(nonMinesFound).length == notMineArr.length) {
    document.getElementById("results").innerHTML = "<h1>🥳 You win!! 🥳</h1>";
  }
}
