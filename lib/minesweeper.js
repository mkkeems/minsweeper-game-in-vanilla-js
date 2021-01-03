// window.addEventListener('load', (event) => {
//   gameStart();
// })
const width = 10
// gameStart = () => {
const minesweeper = document.querySelector('#minesweeper');
for (let i = 0; i < width; i += 1) {
  const row = document.createElement('tr');
  row.dataset.row = i;
  for (let j = 0; j < width; j += 1) {
    row.insertAdjacentHTML('beforeend', `<td class="unopened"></td>`);
  }
  minesweeper.append(row);
}
// }

document.getElementById("newGame").addEventListener("click", () => {
  location.reload();
})

const getGrid = document.querySelectorAll('td');
// array of all cells. Now that it's in an array, we can use indexes to target events and add/remove class
const gridArr = Array.from(getGrid);
const minesArr = [];
const numOfMines = Math.floor(width * width / 5);
document.getElementById("mineNumLeft").innerText = numOfMines
// get unique randome numbers to spread the mines on the gridArr
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
    open: false
  }

  if (minesArr.includes(index)) {
    cellObj.isMine = true;
    cell.classList.add('mine')
  }
  return cellObj
});

gridMineObjArr.forEach((cell, index) => {
  if (cell.isMine) {
    return
  } else {
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
  }
  cell.cell.classList.add(`mine-neighbour-${cell.numSurroundingMines}`)
});

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
const exposeCell = (cell) => {
  const square = cell.cell
  const isMine = cell.isMine
  const neighbors = cell.numSurroundingMines

  if (isMine) {
    square.classList.add('mine')
    setTimeout(checkGrid(cell), 2000)
  }
  if (neighbors === 0) {
    square.classList.add('opened')
  }
  square.classList.add(`mine-neighbour-${neighbors}`)
  cell.open = true
  // setTimeout(checkGrid(cell), 2000)
}

const flagCell = (cell) => {
  const square = cell.cell
  const flagged = cell.flagged
  // square.classList.add(`flagged`)
  flagged ? square.classList.remove(`flagged`) : square.classList.add(`flagged`)
  cell.flagged = !cell.flagged
  if (cell.flagged) {
    cell.open = true
  } else {
    cell.open = false
  }
  checkGrid(cell)
  // setTimeout(numOfFlags(), 500)
}


// Add eventListener to cells and evaluate what to show
gridMineObjArr.forEach((cell) => {
  if (!cell.flagged) {
    cell.cell.addEventListener("click", () => {
      exposeCell(cell)
    })
  }
  cell.cell.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    flagCell(cell)
  })
});


const nonMinesFound = (obj) => {
  return obj.open
}



const checkGrid = (cell) => {
  if (cell.cell.classList.contains("mine")) {
    document.getElementById("results").innerHTML = "<h3>You clicked a mine :( You lose!</h3>";
    // location.reload();
  }
  // console.log(numOfFlags())
  const flags = numOfFlags()
  console.log(flags)
  // console.log(numOfMines - numOfFlags)
  if (flags > 0) {
    console.log(numOfMines - flags)
    document.getElementById("mineNumLeft").innerText = (numOfMines - flags);
  }

  if (gridMineObjArr.every(nonMinesFound) && flags === numOfMines) {
    document.getElementById("results").innerHTML = "<h3>You win!! :)</h3>";
    // location.reload();
  }
}




// if (gridMineObjArr.every(nonMinesFound)) {
//   alert("you win!")
// }


// const isBelowThreshold = (currentValue) => currentValue < 40;

// const array1 = [1, 30, 39, 29, 10, 13];

// console.log(array1.every(isBelowThreshold));
// // expected output: true
