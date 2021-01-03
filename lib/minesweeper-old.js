// alert("Good luck!"); // Of course you can remove this (annoying) line ;)

window.addEventListener('load', (event) => {
  const randomNumOfMines = Math.floor(Math.random() * Math.floor(24 / 2));
  gameStart(randomNumOfMines + 1)
});
// game setup logic
// create array of mine and no mine
const


const gameStart = (numOfMines) => {

  let mineArr = []

  while (mineArr.length < numOfMines) {
    let mineIndex = Math.floor(Math.random() * Math.floor(numOfMines));
    if (mineArr.indexOf(mineIndex) === -1) {
      mineArr.push(mineIndex)
    }
    console.log(mineArr)
  }
  document.getElementById("mineNumLeft").insertAdjacentHTML("afterend", `<h2>${numOfMines}</h2>`);
}

// gameStart(7);

// game start and stop logic
//  - game starts when you click on a tile

// onClick reveal 
//  - tile onLeftClick 
//        - if tile doesn't have .mine, it changes to grey
//        - if tile has .mine, it ends game
//  - tile onLeftClick
//        - adds .flag class to tile

// game win logic
//  - win game if all non mine tiles are clicked
