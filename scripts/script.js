// **Variables**

const grid = document.querySelector('.gameBoard')
const cells = []
const width = 19
const height = 22
const cellCount = width * height
let currentPos = 237
// let ghDir
let plDir
let plDirLog
let plNextCell
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
let fruit = 0
let scaredTimer = false

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


const ghToggle = {
  Red: false,
  Blue: false,
  Pink: false,
  Orange: false,
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
  fruit = 0
  document.querySelector('#life1').style.visibility = 'visible'
  document.querySelector('#life2').style.visibility = 'visible'
  document.querySelector('#life3').style.visibility = 'visible'
  resetFruit()
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
        Blue: currentPos - 2 * width,
        Pink: currentPos + 4,
        Orange: currentPos + 4 * width,
      }

      // cells[ghostTarget.Red].classList.remove('targetMark')
      // cells[ghostTarget.Blue].classList.remove('targetMark')
      // cells[ghostTarget.Pink].classList.remove('targetMark')
      // cells[ghostTarget.Orange].classList.remove('targetMark')

      scaredToggleChk()
      // ghostHitChk()
      ghostEatChk('Red')
      ghostEatChk('Blue')
      ghostEatChk('Pink')
      ghostEatChk('Orange')
      pickupChk('powerUp', 50)
      pickupChk('pellet', 10)

      if (ghToggle.Red === true) {
        addGhost('Red')
        cells[180].classList.remove('gMvLeftRed')

        setTimeout(function() {
          getPath('Red', ghostTarget.Red)
          ghostMoveDecide('Red')
          ghostMove('Red')
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

      // cells[ghostTarget.Red].classList.add('targetMark')
      // cells[ghostTarget.Blue].classList.add('targetMark')
      // cells[ghostTarget.Pink].classList.add('targetMark')
      // cells[ghostTarget.Orange].classList.add('targetMark')

    }, 300)
  }, 2000)
}

function ghostTargetVld(color) {
  if (ghostTarget[color] > cellCount || ghostTarget[color] < 0) {
    ghostTarget[color] = currentPos
    console.log(color + ' ghost changed target to ' + ghostTarget[color])
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
//TESTING GHOST MOVMENT
//   }  else if (key === 'KeyW') {
//     ghDir.Red = 'up'
//   } else if (key === 'KeyS') {
//     ghDir.Red = 'down'
//   } else if (key === 'KeyA') {
//     ghDir.Red = 'left'
//   } else if (key === 'KeyD') {
//     ghDir.Red = 'right'
//   }
// }

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

function ghostMoveDecide(color) {
  
  // if (!ghostPath[color]) {
  //   ghDir[color] = ''
  // } else
  // if (!ghostPath[color]) {
  //   ghDir[color] = 'left'
  // } else
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
  // console.log(color)
  // console.log(ghostPos.Red)
  // console.log(ghostPos[color])
  if (scaredTimer === true) {
    cells[ghostPos[color]].classList.add('ghScared')
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
    cells[ghostPos[color]].classList.remove('ghScared')
  }
}

function removeGhost(color){
  cells[ghostPos[color]].classList.remove('ghScared')
  cells[ghostPos[color]].classList.remove(`ghost${color}`)
  removeGhostSprites(color)
}

function ghostMove(color) {
  removeGhost(color)
  // if (scaredTimer === true) {
  //   const randomDir = [ 'up', 'down', 'left', 'right']
  //   ghDir[color] = randomDir[Math.floor(Math.random() * 4)]
  // }
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




//add fruit to board
/**This will be an event that will occur after a score. The location may be random or pre determined */
/**EXTRA EXTRA EXTRA */
/**use a basic AI to make the fruit move randomly around the board */
// pickupCount = 189

//player item pickup interaction
/**remove pickup from board, add 10 to score for pellet.
apply effect to enemies, switch enemy player interaction, reset timer from pickup
if additional pickup is added during pickup duration, add 50 to score */
function pickupChk(item, points) {
  if (cells[currentPos].classList.contains(`${item}`)){
    score += points
    pickupCount += 1
    // console.log('count ' + pickupCount)
    // console.log('target ' + pickupTarget)
    cells[currentPos].classList.remove(`${item}`)
    if (pickupCount === pickupTarget) {
      pickupCount = 0
      pickupTarget = 0
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

// let scaredRefreshToggle = false

function scaredToggleChk() {
  if (cells[currentPos].classList.contains('powerUp')) {
    console.log('powerup collected')
    scaredTimer = true
    // if (scaredRefreshToggle === true) {
    //   clearTimeout(scaredOff)
    // }
    // scaredRefreshToggle = true
    const scaredOff = setTimeout(function() {
      scaredTimer = false
      // scaredRefreshToggle = false
    }, 10000)
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
  if (cells[currentPos].classList.contains('ghScared')) {
    return
  } else if (cells[currentPos].classList.contains('ghostRed') || cells[currentPos].classList.contains('ghostBlue') || cells[currentPos].classList.contains('ghostPink') || cells[currentPos].classList.contains('ghostOrange')) {
    ghostHit()
  }
}

function ghostEatChk(color) {
  if (cells[currentPos].classList.contains('ghScared')) {
    ghostEat(color)
  }
}


/**INTERACTION 1
IF player & enemy land on the same tile at a given point, we remove 1 life from player AND call board initialise
All values for score are to be left unchanged */
function ghostHit() {
  clearInterval(moveTimer)
  document.querySelector(`#life${lives}`).style.visibility = 'hidden'
  lives--
  // console.log(lives)
  hideQuitBtn()
  removeSprites()
  setTimeout(function() {
    dieAnimReload()
    setTimeout(function() {
      cells[currentPos].style.removeProperty('background-image')
      charReset()
      if (lives === 0) {
        // console.log('game over')
        showLose()
        scoreUpdater()
        // console.log(score)
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
  }, 6000)
}

//   removeGhost('Red')
//   removeGhost('Blue')
//   removeGhost('Pink')
//   removeGhost('Orange')
//   currentPos = 237
//   ghostPos.Red = 161
//   ghostPos.Blue = 161
//   ghostPos.Pink = 161
//   ghostPos.Orange = 161
//   addPlayer()
//   clearTimeout(redSpn)
//   clearTimeout(blueSpn)
//   clearTimeout(pinkSpn)
//   clearTimeout(orngSpn)
//   removeSprites()
//   removeGhostSprites('Red')
//   removeGhostSprites('Blue')
//   removeGhostSprites('Pink')
//   removeGhostSprites('Orange')
//   cells[180].classList.add('gMvLeftRed')
//   cells[198].classList.add('gMvLeftBlue')
//   cells[200].classList.add('gMvLeftPink')
//   cells[199].classList.add('gMvLeftOrange')

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


const lastMv = {
  Red: 0,
  Blue: 0,
  Pink: 0,
  Orange: 0,
}

const ghostPath = {
  Red: [],
  Blue: [],
  Pink: [],
  Orange: [],
}

let pathHist = []
let pathComplete = false

function pathStepGen(color, target) {

  const finish = target
  // console.log(current)

  function hscore(dir) {
    const dirloc = cells[dir].getBoundingClientRect()
    const endloc = cells[finish].getBoundingClientRect()
    const hscoreVal = Math.sqrt(Math.pow((endloc.x - dirloc.x),2) + Math.pow((endloc.y - dirloc.y),2))
    return hscoreVal
  }

  function fscoreCalc(dir) {
    let fscoredir
    // console.log('loc ' + dir)
    if ( -1 > dir || dir > cellCount || cells[dir].classList.contains('wall') || dir === lastMv[color] || pathHist.includes(dir)) {
      fscoredir = Infinity
    } else {
      fscoredir = hscore(dir)
      //console.log('locked out cell ' + lastMv[color])
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

  // console.log('fscore up ' + fscoreUp)
  // console.log('fscore down ' + fscoreDown)
  // console.log('fscore left ' + fscoreLeft)
  // console.log('fscore right ' + fscoreRight)

  let ans

  ans = Math.min(fscoreUp, fscoreDown, fscoreLeft, fscoreRight)
  // console.log(ans)

  if (scaredTimer === true) {
    const dirs = []
    if (fscoreUp !== Infinity) dirs.push(fscoreUp)
    if (fscoreDown !== Infinity) dirs.push(fscoreDown)
    if (fscoreLeft !== Infinity) dirs.push(fscoreLeft)
    if (fscoreRight !== Infinity) dirs.push(fscoreRight)
    console.log(dirs)
    // const dirs = [fscoreUp, fscoreDown, fscoreLeft, fscoreRight]
    const choose = Math.floor(Math.random() * dirs.length)
    // console.log(dirs[choose])
    ans = dirs[choose]
  }


  // if (!ans) ans = lastMv[color]
  // console.log(lastMv[color])
  pathHist.push(current)
  // console.log(pathHist)
  // console.log('target: ' + target)

  
  if (pathHist[0] === finish){
    pathHist = []
    pathHist.push(-200, lastMv[color])
    // console.log('target hit')
    return pathHist
  } else if (pathHist && current === finish || ans === Infinity) {
    // console.log('point to remove ' + pathHist[0])
    lastMv[color] = pathHist[0]
    pathComplete = true
    return pathHist
  } else if (scaredTimer === true && pathHist.length === 2) {
    pathComplete = true
    return pathHist
  }

  if (fscoreUp === ans) current = up
  if (fscoreDown === ans) current = down
  if (fscoreLeft === ans) current = left
  if (fscoreRight === ans) current = right

  // console.log('location after calc ' + current)
}



function getPath(color, target) {
  current = ghostPos[color]
  while (!pathComplete) {
    // console.log(pathStepGen(color, target))
    ghostPath[color] = pathStepGen(color, target)
  }
  pathHist = []
  pathComplete = false
}



// const pg = setInterval(function() {
//   test = fscore(currentPos)
//   console.log(test)
// }, 1)


// let pathHist = []
// let pathComplete

// function fscore(target) {

//   // let current
//   const finish = target
//   // console.log('loc started at: ' + current)

//   function fscoreCalc(dir) {

//     function hscore(dir) {
//       const dirloc = cells[dir].getBoundingClientRect()
//       const endloc = cells[finish].getBoundingClientRect()
//       const hscoreVal = Math.sqrt(Math.pow((endloc.x - dirloc.x),2) + Math.pow((endloc.y - dirloc.y),2))
//       return hscoreVal
//     }
    
//     let fscoredir
//     if ( -1 > dir || dir > cellCount || cells[dir].classList.contains('wall') || pathHist.includes(dir) || cells[dir] === ghMvHis) {
//       fscoredir = Infinity
//     } else {
//       fscoredir = hscore(dir)
//     }
//     return fscoredir
//   }

//   const up = current - width
//   const down = current + width
//   const left = current - 1
//   const right = current + 1
//   const fscoreUp = fscoreCalc(up)
//   const fscoreDown = fscoreCalc(down)
//   const fscoreLeft = fscoreCalc(left)
//   const fscoreRight = fscoreCalc(right)

//   // console.log('fscore up ' + fscoreUp)
//   // console.log('fscore down ' + fscoreDown)
//   // console.log('fscore left ' + fscoreLeft)
//   // console.log('fscore right ' + fscoreRight)

//   const ans = Math.min(fscoreUp, fscoreDown, fscoreLeft, fscoreRight)

//   if (current === finish || ans === Infinity) {
//     pathComplete = true
//     //clearInterval(pathGen)
//     console.log('target ' + finish)
//     return pathHist
//   }

//   pathHist.push(current)

//   if (fscoreUp === ans) current = up
//   if (fscoreDown === ans) current = down
//   if (fscoreLeft === ans) current = left
//   if (fscoreRight === ans) current = right

//   // console.log('loc moved to: ' + current)

// }

// let test

// function generatePath(target) {
//   while (!pathComplete) {
//     test = fscore(target)
//     console.log(test)
//   }
//   pathHist = []
//   pathComplete = false
// }

// const pathGen = setInterval(function() {
//   test = fscore(currentPos)
//   console.log(test)
// }, 1)

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


//game over toggle
function showLose() {
  document.getElementById('gameOver').classList.remove('hide')
}
function hideLose() {
  document.getElementById('gameOver').classList.add('hide')
}


//ready toggle
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


//win toggle
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


//quit btn initilisation
function hideQuitBtn() {

  document.querySelector('#quitBar .quit').classList.add('hide')
}
function showQuitBtn() {
  document.querySelector('#quitBar .quit').classList.remove('hide')
}
  

//Reset fruit
function resetFruit() {
  document.querySelector('#chry').style.visibility = 'hidden'
  document.querySelector('#strb').style.visibility = 'hidden'
  document.querySelector('#orng').style.visibility = 'hidden'
  document.querySelector('#apple').style.visibility = 'hidden'
}


//**Executions**

//page load
generateGrid()
placeItems()
addPlayer()
resetFruit()

//console.log(ghostPos.Red)


//**Events**

//leaderboard button



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
