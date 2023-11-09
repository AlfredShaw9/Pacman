// **Variables**

const grid = document.querySelector('.gameBoard')
const cells = []
const width = 19
const height = 22
const cellCount = width * height
let currentPos = 237
let plDir
let plDirLog
let plNextCell = 236
let ghNextCell
let moveTimer
let current
let pickupTarget = 0
let pickupCount = 0
let ghostTarget
let redSpn
let blueSpn
let pinkSpn
let orngSpn
let score = 0
let lives = 3
let scaredTimer = false
let t = false

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


const ghToggle = {
  Red: false,
  Blue: false,
  Pink: false,
  Orange: false,
}

const ghostPos = {
  Red: 161,
  Blue: 161,
  Pink: 161,
  Orange: 161,
}

const ghDir = {
  Red: 'left',
  Blue: 'left',
  Pink: 'left',
  Orange: 'left',
}

const ghostPath = {
  Red: [],
  Blue: [],
  Pink: [],
  Orange: [],
}

const slowDown = {
  Red: false,
  Blue: false,
  Pink: false,
  Orange: false,
}

const lastMv = {
  Red: 0,
  Blue: 0,
  Pink: 0,
  Orange: 0,
}

//**functions**



//Generate grid
function generateGrid() {
  for (let i = 0; i < cellCount; i++) {
    const cell = document.createElement('div')
    // cell.innerText = i
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
      cell.classList.add('wall')
    } else if (mapDef === '-') {
      cell.classList.add('pellet')
      pickupTarget += 1
    } else if (mapDef === 'O') {
      cell.classList.add('powerUp')
      pickupTarget += 1
    }
  }
}



//character reset
/**resets the player position and stops the player movment running interval */
function charReset() {
  removePlayer()
  removeGhost('Red')
  removeGhost('Blue')
  removeGhost('Pink')
  removeGhost('Orange')
  currentPos = 237
  ghostPos.Red = 161
  ghostPos.Blue = 161
  ghostPos.Pink = 161
  ghostPos.Orange = 161
  addPlayer()
  clearTimeout(redSpn)
  clearTimeout(blueSpn)
  clearTimeout(pinkSpn)
  clearTimeout(orngSpn)
  removeSprites()
  removeGhostSprites('Red')
  removeGhostSprites('Blue')
  removeGhostSprites('Pink')
  removeGhostSprites('Orange')
  cells[180].classList.add('gMvLeftRed')
  cells[198].classList.add('gMvLeftBlue')
  cells[200].classList.add('gMvLeftPink')
  cells[199].classList.add('gMvLeftOrange')
  clearInterval(moveTimer)
}



//game reset
/**resets the game values, called during each new game*/
function gameReset() {
  charReset()
  score = 0
  lives = 3
  document.querySelector('#life1').style.visibility = 'visible'
  document.querySelector('#life2').style.visibility = 'visible'
  document.querySelector('#life3').style.visibility = 'visible'
  placeItems()
}



//start game
function startGame() {
  plDir = 'left'
  ghDir.Red = 'left'

  ghToggle.Red = false
  ghToggle.Blue = false
  ghToggle.Pink = false
  ghToggle.Orange = false
  
  rdy()

  redSpn = setTimeout(function() {
    ghToggle.Red = true
  }, 4000)

  blueSpn = setTimeout(function() {
    ghToggle.Blue = true
  }, 6000)

  pinkSpn = setTimeout(function() {
    ghToggle.Pink = true
  }, 10000)

  orngSpn = setTimeout(function() {
    ghToggle.Orange = true
  }, 14000)

  setTimeout(function() {

    showQuitBtn()

    moveTimer = setInterval(function() {

      ghostTarget = {
        Red: currentPos,
        Blue: currentPos - 4 * width,
        Pink: currentPos + 4,
        Orange: currentPos + 4 * width,
      }

      scaredToggleChk()
      pickupChk('powerUp', 50)
      pickupChk('pellet', 10)
      t = true

      if (ghToggle.Red === true) {
        addGhost('Red')
        cells[180].classList.remove('gMvLeftRed')

        setTimeout(function() {
          getPath('Red', ghostTarget.Red)
          ghostMoveDecide('Red')
          ghostMove('Red')
          ghostHitChk()
        }, 100)
      } else if (ghToggle.Red === false) {
        removeGhost('Red')
        cells[180].classList.add('gMvLeftRed')
      }

      if (ghToggle.Blue === true) {
        addGhost('Blue')
        cells[198].classList.remove('gMvLeftBlue')

        setTimeout(function() {
          getPath('Blue', ghostTarget.Blue)
          ghostMoveDecide('Blue')
          ghostMove('Blue')
          ghostHitChk()
        }, 100)
      } else if (ghToggle.Blue === false) {
        removeGhost('Blue')
        cells[198].classList.add('gMvLeftBlue')
      }
        
      if (ghToggle.Pink === true) {
        addGhost('Pink')
        cells[200].classList.remove('gMvLeftPink')

        setTimeout(function() {
          getPath('Pink', ghostTarget.Pink)
          ghostMoveDecide('Pink')
          ghostMove('Pink')
          ghostHitChk()
        }, 100)
      } else if (ghToggle.Pink === false) {
        removeGhost('Pink')
        cells[200].classList.add('gMvLeftPink')
      }
        
      if (ghToggle.Orange === true) {
        addGhost('Orange')
        cells[199].classList.remove('gMvLeftOrange')

        setTimeout(function() {
          getPath('Orange', ghostTarget.Orange)       
          ghostMoveDecide('Orange')
          ghostMove('Orange')
          ghostHitChk()
        }, 100)
      } else if (ghToggle.Orange === false) {
        removeGhost('Orange')
        cells[199].classList.add('gMvLeftOrange')
      }

      playerMove()
      scoreUpdater()

      ghostTargetVld('Red')
      ghostTargetVld('Blue')
      ghostTargetVld('Pink')
      ghostTargetVld('Orange')

    }, 300)
  }, 2000)
}

function ghostTargetVld(color) {
  if (ghostTarget[color] > cellCount || ghostTarget[color] < 0) {
    ghostTarget[color] = currentPos
    // console.log(color + ' ghost changed target to ' + ghostTarget[color])
  }
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


//Add ghosts to board and define anims
function ghostMoveDecide(color) {
  if (ghostPath[color][1] === ghostPos[color] - width) {
    ghDir[color] = 'up'
  } else if (ghostPath[color][1] === ghostPos[color] + width) {
    ghDir[color] = 'down'
  } else if (ghostPath[color][1] === ghostPos[color] - 1) {
    ghDir[color] = 'left'
  } else if (ghostPath[color][1] === ghostPos[color] + 1) {
    ghDir[color] = 'right'
  }
}

function addGhost(color){
  if (scaredTimer === true) {
    cells[ghostPos[color]].classList.add(`ghScared${color}`)
  }
  cells[ghostPos[color]].classList.add(`ghost${color}`)
  if (ghDir[color] === 'up') {
    cells[ghostPos[color]].classList.add(`gMvUp${color}`)
  } else if (ghDir[color] === 'down') {
    cells[ghostPos[color]].classList.add(`gMvDown${color}`)
  } else if (ghDir[color] === 'left') {
    cells[ghostPos[color]].classList.add(`gMvLeft${color}`)
  } else if (ghDir[color] === 'right') {
    cells[ghostPos[color]].classList.add(`gMvRight${color}`)
  }
}

function removeGhostSprites(color){
  cells[ghostPos[color]].classList.remove(`gMvUp${color}`)
  cells[ghostPos[color]].classList.remove(`gMvDown${color}`)
  cells[ghostPos[color]].classList.remove(`gMvLeft${color}`)
  cells[ghostPos[color]].classList.remove(`gMvRight${color}`)
  if (scaredTimer === true) {
    cells[ghostPos[color]].classList.remove(`ghScared${color}`)
  }
}

function removeGhost(color){
  cells[ghostPos[color]].classList.remove(`ghScared${color}`)
  cells[ghostPos[color]].classList.remove(`ghost${color}`)
  removeGhostSprites(color)
}

function ghostMove(color) {

  if (scaredTimer === true) {
    slowDown[color] = !slowDown[color]
  }

  if (slowDown[color] === true) {
    return
  }

  removeGhost(color)
  if (ghDir[color] === 'up') {
    ghNextCell = ghostPos[color] - width
  } else if (ghDir[color] === 'down') {
    ghNextCell = ghostPos[color] + width
  } else if (ghDir[color] === 'left') {
    ghNextCell = ghostPos[color] - 1
  } else if (ghDir[color] === 'right') {
    ghNextCell = ghostPos[color] + 1
  }
  
  ghostPos[color] = ghNextCell

  addGhost(color)
}



//player item pickup interaction
/**remove pickup from board, add 10 to score for pellet.
apply effect to enemies, switch enemy player interaction, reset timer from pickup
if additional pickup is added during pickup duration, add 50 to score */
function pickupChk(item, points) {
  if (cells[currentPos].classList.contains(`${item}`)){
    score += points
    pickupCount += 1
    cells[currentPos].classList.remove(`${item}`)
    if (pickupCount === pickupTarget) {
      pickupCount = 0
      pickupTarget = 0
      //Win game
      /**Check for all map pickup items and powerups to have been collected
      Will call initialise game AND add all powerups and pickup items again. */
      win()
      setTimeout(function() {
      }, 500)
      clearInterval(moveTimer)
      setTimeout(function() {
        charReset()
        scoreUpdater()
        placeItems()
      }, 2000)
      setTimeout(function() {
        startGame()
      }, 2000)
      
    }
  }
}

// Currently the state does not refresh on extra pickup. Will rectify this at some point if time allows.
function scaredToggleChk() {
  if (cells[currentPos].classList.contains('powerUp')) {
    scaredTimer = true
    const scaredOff = setTimeout(function() {
      scaredTimer = false
      slowDown.Red = false
      slowDown.Blue = false
      slowDown.Pink = false
      slowDown.Orange = false
    }, 10000)
  }
}



//player enemy interaction
function ghostHitChk() {
  if (cells[currentPos].classList.contains('ghScaredRed')) ghostEat('Red')
  else if (cells[currentPos].classList.contains('ghScaredBlue')) ghostEat('Blue')
  else if (cells[currentPos].classList.contains('ghScaredPink')) ghostEat('Pink')
  else if (cells[currentPos].classList.contains('ghScaredOrange')) ghostEat('Orange')
  else if (t === true && cells[currentPos].classList.contains('ghostRed') || cells[currentPos].classList.contains('ghostBlue') || cells[currentPos].classList.contains('ghostPink') || cells[currentPos].classList.contains('ghostOrange')) {
    ghostHit()
    t = false
  }
}

// function ghostEatChk() {

// }


/**INTERACTION 1
IF player & enemy land on the same tile at a given point, we remove 1 life from player AND call board initialise
All values for score are to be left unchanged */
function ghostHit() {
  clearInterval(moveTimer)
  document.querySelector(`#life${lives}`).style.visibility = 'hidden'
  lives--
  hideQuitBtn()
  removeSprites()
  setTimeout(function() {
    dieAnimReload()
    setTimeout(function() {
      cells[currentPos].style.removeProperty('background-image')
      charReset()
      if (lives === 0) {
        //Lose game
        /**Check logic for no lives left, get score and keep in local storage for leaderboard.
        Reset game but dont start it. Bring up game over menu */
        showLose()
        scoreUpdater()
        document.getElementById('scorePrint').innerHTML = score
        gameReset()
      } else {
        setTimeout(function() {
          startGame()
        }, 2000)
      }
    }, 2000)
  }, 100)
}

/**INTERACTION 2
IF enemy has switched states from the powerup, on player enemy collision, enemy will score is added
Referance variable that will check for correct state AND current ammount of this kind of interaction
This interaction count will be wiped at the end of the duration of the state.
For certain interaction counts, the score value will increase to a maximum.
After interaction, ghost state is changed again */
function ghostEat(color) {
  removeGhost(color)
  removeGhostSprites(color)
  ghToggle[color] = false
  ghostPos[color] = 161
  score += 400
  setTimeout(function() {
    ghToggle[color] = true
  }, 8500)
}

//enemy AI behaviour
/**Possibility for unique ais for each ghost like real game
Initial pathfinding is just path to player. Will implement 2 on fastest path and 2 on random path for functionality.
/**EXTRA EXTRA EXTRA */
/**Pathfinding takes locations based on player and other enemy location */

//Main Pathfinding AI
let pathHist = []
let pathComplete = false

function pathStepGen(color, target) {

  const finish = target

  function hscore(dir) {
    const dirloc = cells[dir].getBoundingClientRect()
    const endloc = cells[finish].getBoundingClientRect()
    const hscoreVal = Math.sqrt(Math.pow((endloc.x - dirloc.x),2) + Math.pow((endloc.y - dirloc.y),2))
    return hscoreVal
  }

  function fscoreCalc(dir) {
    let fscoredir
    if ( -1 > dir || dir > cellCount || cells[dir].classList.contains('wall') || dir === lastMv[color] || pathHist.includes(dir)) {
      fscoredir = Infinity
    } else {
      fscoredir = hscore(dir)
    }
    return fscoredir
  }

  const up = current - width
  const down = current + width
  const left = current - 1
  const right = current + 1
  const fscoreUp = fscoreCalc(up)
  const fscoreDown = fscoreCalc(down)
  const fscoreLeft = fscoreCalc(left)
  const fscoreRight = fscoreCalc(right)

  let ans

  ans = Math.min(fscoreUp, fscoreDown, fscoreLeft, fscoreRight)

  if (scaredTimer === true) {
    const dirs = []
    if (fscoreUp !== Infinity) dirs.push(fscoreUp)
    if (fscoreDown !== Infinity) dirs.push(fscoreDown)
    if (fscoreLeft !== Infinity) dirs.push(fscoreLeft)
    if (fscoreRight !== Infinity) dirs.push(fscoreRight)
    const choose = Math.floor(Math.random() * dirs.length)
    ans = dirs[choose]
  }

  pathHist.push(current)
  
  if (pathHist[0] === finish){
    pathHist = []
    pathHist.push(-200, lastMv[color])
    return pathHist
  } else if (pathHist && current === finish || ans === Infinity) {
    lastMv[color] = pathHist[0]
    pathComplete = true
    return pathHist
  } else if (scaredTimer === true && pathHist.length === 3) {
    lastMv[color] = pathHist[0]
    pathComplete = true
    return pathHist
  }

  if (fscoreUp === ans) current = up
  if (fscoreDown === ans) current = down
  if (fscoreLeft === ans) current = left
  if (fscoreRight === ans) current = right

}


function getPath(color, target) {
  current = ghostPos[color]
  while (!pathComplete) {
    ghostPath[color] = pathStepGen(color, target)
  }
  pathHist = []
  pathComplete = false
}



//Score update function
function scoreUpdater() {
  const formatScore = score.toString().padStart(6, '0')
  document.querySelector('#scoreDisp').innerHTML = formatScore
}



//Die animation
function dieAnimReload() {
  const img = document.createElement('img')
  img.src = './assets/pmandie.gif?' + Math.random()
  cells[currentPos].style.backgroundImage = 'url(' + img.src + ')'
}



//Game over toggle
function showLose() {
  document.getElementById('gameOver').classList.remove('hide')
}
function hideLose() {
  document.getElementById('gameOver').classList.add('hide')
}



//Ready toggle
function showRdy() {
  document.getElementById('ready').classList.remove('hide')
}
function hideRdy() {
  document.getElementById('ready').classList.add('hide')
}

function rdy() {
  showRdy()
  setTimeout(function() {
    hideRdy()
  }, 2000)
}



//Win toggle
function showWin() {
  document.getElementById('win').classList.remove('hide')
}
function hideWin() {
  document.getElementById('win').classList.add('hide')
}

function win() {
  showWin()
  setTimeout(function() {
    hideWin()
  }, 2000)
}



//menu toggle
function showMenu() {
  document.querySelector('.toggle').classList.remove('hide')
}
function hideMenu() {
  document.querySelector('.toggle').classList.add('hide')
}



//Quit btn initilisation
function hideQuitBtn() {

  document.querySelector('#quitBar .quit').classList.add('hide')
}
function showQuitBtn() {
  document.querySelector('#quitBar .quit').classList.remove('hide')
}



//**Executions**

//page load
generateGrid()
placeItems()
addPlayer()



//**Events**

//Movment input
document.addEventListener('keydown', dirPress)

//start button
let i
const startBtns = document.querySelectorAll('.start')
i = 0

for (i of startBtns) {
  i.addEventListener('click', () => {
    hideQuitBtn()
    hideMenu()
    hideLose()
    hideRdy()
    hideWin()
    startGame()
  })
}

// quit button
const quitBtns = document.querySelectorAll('.quit')
i = 0

for (i of quitBtns) {
  i.addEventListener('click', () => {
    gameReset()
    showMenu()
    hideLose()
    hideRdy()
    hideWin()
  })
}
