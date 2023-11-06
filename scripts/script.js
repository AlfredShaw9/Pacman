// **Variables**

const grid = document.querySelector('.gameBoard')
const cells = []
const width = 19
const height = 22
const cellCount = width * height
let currentPos = 237
let ghDir
let plDir
let plDirLog
let plNextCell
let ghNextCell
let moveTimer

const map =
[ '@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@',
  '@', '-', '-', '-', '-', '-', '-', '-', '-', '@', '-', '-', '-', '-', '-', '-', '-', '-', '@',
  '@', 'O', '@', '@', '-', '@', '@', '@', '-', '@', '-', '@', '@', '@', '-', '@', '@', 'O', '@',
  '@', '-', '@', '@', '-', '@', '@', '@', '-', '@', '-', '@', '@', '@', '-', '@', '@', '-', '@',
  '@', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '@',
  '@', '-', '@', '@', '-', '@', '-', '@', '@', '@', '@', '@', '-', '@', '-', '@', '@', '-', '@',
  '@', '-', '-', '-', '-', '@', '-', '-', '-', '@', '-', '-', '-', '@', '-', '-', '-', '-', '@',
  '@', '@', '@', '@', '-', '@', '@', '@', '-', '@', '-', '@', '@', '@', '-', '@', '@', '@', '@',
  '@', '@', '@', '@', '-', '@', '-', '-', '-', '-', '-', '-', '-', '@', '-', '@', '@', '@', '@',
  '@', '@', '@', '@', '-', '@', '-', '@', '@', '^', '@', '@', '-', '@', '-', '@', '@', '@', '@',
  '-', '-', '-', '-', '-', '-', '-', '@', 'G', 'G', 'G', '@', '-', '-', '-', '-', '-', '-', '-',
  '@', '@', '@', '@', '-', '@', '-', '@', '@', '@', '@', '@', '-', '@', '-', '@', '@', '@', '@',
  '@', '@', '@', '@', '-', '@', '-', '-', '-', 'P', '-', '-', '-', '@', '-', '@', '@', '@', '@',
  '@', '@', '@', '@', '-', '@', '-', '@', '@', '@', '@', '@', '-', '@', '-', '@', '@', '@', '@',
  '@', '-', '-', '-', '-', '-', '-', '-', '-', '@', '-', '-', '-', '-', '-', '-', '-', '-', '@',
  '@', '-', '@', '@', '-', '@', '@', '@', '-', '@', '-', '@', '@', '@', '-', '@', '@', '-', '@',
  '@', 'O', '-', '@', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '@', '-', 'O', '@',
  '@', '@', '-', '@', '-', '@', '-', '@', '@', '@', '@', '@', '-', '@', '-', '@', '-', '@', '@',
  '@', '-', '-', '-', '-', '@', '-', '-', '-', '@', '-', '-', '-', '@', '-', '-', '-', '-', '@',
  '@', '-', '@', '@', '@', '@', '@', '@', '-', '@', '-', '@', '@', '@', '@', '@', '@', '-', '@',
  '@', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '@',
  '@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@' ]

let score = 0
let lives = 3
let fruit = 0

//enemy 1 - 4 location


//**functions**



//menu visibility toggle
//leaderboard visibility toggle
//instructions visibility toggle
/**The visibility toggle is simply a class that will set the ENTIRE div visibility
This will also include the css pointer events property to solidify and stop any bugs happening */


//Generate grid
function generateGrid() {
  for (let i = 0; i < cellCount; i++) {
    const cell = document.createElement('div')
    //cell.innerText = i
    cell.id = i
    cell.style.width = `${100 / width}%`
    grid.append(cell)
    cells.push(cell)
  }
}

//Add layout of maze and items on grid
/**hardcoded maze and item locations */
function placeItems() {
  for (let i = 1; i <= cellCount; i++) {
    const cell = document.querySelector(`.gameBoard div:nth-of-type(${i})`)
    const mapDef = map[i - 1]
    if (mapDef === '@') {
      cell.classList.add('wall')
    } else if (mapDef === '^') {
      cell.classList.add('ghostWall')
    } else if (mapDef === '-') {
      cell.classList.add('pellet')
    } else if (mapDef === 'O') {
      cell.classList.add('powerUp')
    }
  }
}




//character reset
/**resets the player position and stops the player movment running interval */
function charReset() {
  removePlayer()
  removeGhost('Red')
  currentPos = 237
  ghCurrentPos = 200
  addPlayer()
  addGhost('Red')
  removeSprites()
  removeGhostSprites('Red')
  clearInterval(moveTimer)
}

//game reset
/**resets the game values, called during each new game*/
function gameReset() {
  charReset()
  score = 0
  lives = 3
  fruit = 0
  document.querySelector('#life1').style.visibility = 'visible'
  document.querySelector('#life2').style.visibility = 'visible'
  document.querySelector('#life3').style.visibility = 'visible'
  document.querySelector('#chry').style.visibility = 'hidden'
  document.querySelector('#strb').style.visibility = 'hidden'
  document.querySelector('#orng').style.visibility = 'hidden'
  document.querySelector('#apple').style.visibility = 'hidden'
  scoreUpdater()
  placeItems()
}

//start game
function startGame() {
  plDir = 'left'
  ghDir = 'left'
  moveTimer = setInterval(function() {
    pickupChk('powerUp', 50)
    pickupChk('pellet', 10)
    playerMove()
    ghostMove('Red')
    ghostHitChk()
    scoreUpdater()
  }, 150)
}




//Add / remove player
/**place player at next movment area.*/
function addPlayer(){
  cells[currentPos].classList.add('player')
  if (plDir === 'up') {
    cells[currentPos].classList.add('pMvUp')
  } else if (plDir === 'down') {
    cells[currentPos].classList.add('pMvDown')
  } else if (plDir === 'left') {
    cells[currentPos].classList.add('pMvLeft')
  } else if (plDir === 'right') {
    cells[currentPos].classList.add('pMvRight')
  }
}
function removePlayer(){
  cells[currentPos].classList.remove('player')
  removeSprites()
}

function removeSprites(){
  cells[currentPos].classList.remove('pMvUp')
  cells[currentPos].classList.remove('pMvDown')
  cells[currentPos].classList.remove('pMvLeft')
  cells[currentPos].classList.remove('pMvRight')
}

//direction availability
/**take player direction and location and finds next valid input */
function teleCheck(next) {
  if (next === 209) {
    next = 190
  } else if (next === 189) {
    next = 208
  }
  plNextCell = next
}

function wallChk() {
  if (cells[plNextCell].classList.contains('wall') || cells[plNextCell].classList.contains('ghostWall')) {
    plDir = plDirLog
  } else {
    currentPos = plNextCell
    plDirLog = plDir
  }
}

//player movment
/**move player to new location based on previous location and available inputs */
function dirPress(evt){
  const key = evt.code
  if (key === 'ArrowUp') {
    plDir = 'up'
  } else if (key === 'ArrowDown') {
    plDir = 'down'
  } else if (key === 'ArrowLeft') {
    plDir = 'left'
  } else if (key === 'ArrowRight') {
    plDir = 'right'
  //TESTING GHOST MOVMENT
  }  else if (key === 'KeyW') {
    ghDir = 'up'
  } else if (key === 'KeyS') {
    ghDir = 'down'
  } else if (key === 'KeyA') {
    ghDir = 'left'
  } else if (key === 'KeyD') {
    ghDir = 'right'
  }
}

function playerMove() {
  removePlayer()
  if (plDir === 'up') {
    plNextCell = currentPos - width
    wallChk()
  } else if (plDir === 'down') {
    plNextCell = currentPos + width
    wallChk()
  } else if (plDir === 'left') {
    plNextCell = currentPos - 1
    teleCheck(plNextCell)
    wallChk()
  } else if (plDir === 'right') {
    plNextCell = currentPos + 1
    teleCheck(plNextCell)
    wallChk()
  }

  addPlayer()
}


//Add ghosts to board
/** */

// class Ghost {
//   constructor(startingPosition, cssClass) {
//     this.startingPosition = startingPosition
//     this.cssClass = cssClass
//   }

//   scared() {
//     console.log('AAAHHHH')
//   }
// }

// const redGhost = new Ghost(200, 'redGhost')
// const blueGhost = new Ghost(25, 'blueGhost')

// redGhost.scared()
/**THIS IS MY CLASS DEMONSTRATION, need to get to grips with these... */

class Ghost {
  constructor(ghostStartPosition, color) {
    this.ghostStartPosition
    this.color
  }

}

let ghCurrentPos = 200

function addGhost(color){
  cells[ghCurrentPos].classList.add(`ghost${color}`)
  if (ghDir === 'up') {
    cells[ghCurrentPos].classList.add(`gMvUp${color}`)
  } else if (ghDir === 'down') {
    cells[ghCurrentPos].classList.add(`gMvDown${color}`)
  } else if (ghDir === 'left') {
    cells[ghCurrentPos].classList.add(`gMvLeft${color}`)
  } else if (ghDir === 'right') {
    cells[ghCurrentPos].classList.add(`gMvRight${color}`)
  }
}

function removeGhostSprites(color){
  cells[ghCurrentPos].classList.remove(`gMvUp${color}`)
  cells[ghCurrentPos].classList.remove(`gMvDown${color}`)
  cells[ghCurrentPos].classList.remove(`gMvLeft${color}`)
  cells[ghCurrentPos].classList.remove(`gMvRight${color}`)
}

function removeGhost(color){
  cells[ghCurrentPos].classList.remove(`ghost${color}`)
  removeGhostSprites(color)
}

function ghostMove(color) {
  removeGhost(color)
  if (ghDir === 'up') {
    ghNextCell = ghCurrentPos - width
  } else if (ghDir === 'down') {
    ghNextCell = ghCurrentPos + width
  } else if (ghDir === 'left') {
    ghNextCell = ghCurrentPos - 1
  } else if (ghDir === 'right') {
    ghNextCell = ghCurrentPos + 1
  }
  ghCurrentPos = ghNextCell

  addGhost(color)
}




//add fruit to board
/**This will be an event that will occur after a timer. The location may be random or pre determined */
/**EXTRA EXTRA EXTRA */
/**use a basic AI to make the fruit move randomly around the board */


//player item pickup interaction
/**remove pickup from board, add 10 to score for pellet.
apply effect to enemies, switch enemy player interaction, reset timer from pickup
if additional pickup is added during pickup duration, add 50 to score */
function pickupChk(item, points) {
  if (cells[currentPos].classList.contains(`${item}`)){
    score += points
    cells[currentPos].classList.remove(`${item}`)
    if (item === 'powerUp') {
      //change ghost state and start a timer / refresh it if timer is already running
      return
    }
  }
}



//player fruit pickup interaction
/**add fruit to fruit div 
for 1st fruit, add 100pts
for 2nd fruit, add 300pts
for 3rd fruit, add 500pts
for 4th furit, add 700pts */
/**EXTRA EXTRA EXTRA */
/**add more fruits if i have time */



//player enemy interaction
function ghostHitChk() {
  if (cells[currentPos].classList.contains('ghostRed')) {
    ghostHit()
  }
}


/**INTERACTION 1
IF player & enemy land on the same tile at a given point, we remove 1 life from player AND call board initialise
All values for score are to be left unchanged */
function ghostHit() {
  clearInterval(moveTimer)
  document.querySelector(`#life${lives}`).style.visibility = 'hidden'
  lives--
  console.log(lives)
  removeSprites()
  setTimeout(function() {
    dieAnimReload()
    setTimeout(function() {
      cells[currentPos].style.removeProperty('background-image')
      charReset()
      if (lives === 0) {
        console.log('game over')
        gameReset()
        //bring up new menu
      } else {
        setTimeout(function() {
          startGame()
        }, 2000)
      }
    }, 2000)
  }, 1000)
}

/**INTERACTION 2
IF enemy has switched states from the powerup, on player enemy collision, enemy will score is added
Referance variable that will check for correct state AND current ammount of this kind of interaction
This interaction count will be wiped at the end of the duration of the state.
For certain interaction counts, the score value will increase to a maximum.
After interaction, ghost state is changed again */



//Win game
/**Check for all map pickup items and powerups to have been collected (excluding fruit)
Will call initialise game AND add all powerups and pickup items again. */


//Lose game
/**Check logic for no lives left, get score and keep in local storage for leaderboard.
Reset game but dont start it. Bring up game over menu */


//enemy AI behaviour 1 (chase)
/**Possibility for unique ais for each ghost like real game
Initial pathfinding is just path to player. Will implement 2 on fastest path and 2 on random path for functionality.
/**EXTRA EXTRA EXTRA */
/**Pathfinding takes locations based on player and other enemy location */



//enemy AI behaviour 2 (roam)
/**each ghost goes to a different roam location. AI takes concentration of player. */



//enemy AI behaviour 3 (scared)
/**use RNG to generate ghost behaviour. Travel direction will reverse the moment this is activated */



//enemy AI behaviour 4 (eaten)
/**head back to ghost box at speed. Fastest path to ghost box */

//enemy movement


//Condition logic for AIs to be acitve / inactive
/**The longer the game goes on, the longer the AIs will stay on chase mode and the shorter they will go to roam.
Top difficulty will be defined by player points held, this will cause chase mode to be on permenantly. */
function scoreUpdater() {
  const formatScore = score.toString().padStart(6, '0')
  document.querySelector('#scoreDisp').innerHTML = formatScore
}

//die animation
function dieAnimReload() {
  const img = document.createElement('img')
  img.src = '/assets/pmandie.gif?' + Math.random()
  cells[currentPos].style.backgroundImage = 'url(' + img.src + ')'
}


//**Executions**

//page load
generateGrid()
placeItems()
addPlayer()


//**Events**

addGhost('Red')

//start game button



//leaderboard button



//instruction button



//Movment input

document.addEventListener('keydown', dirPress)


//pause game / reset button

document.querySelector('#start').addEventListener('click', startGame)

document.querySelector('#loseLife').addEventListener('click', ghostHit)

document.querySelector('#reset').addEventListener('click', gameReset)

//lose game
