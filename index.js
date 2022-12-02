import BigBang from './classes/BigBang.js'
import Bomb from './classes/Bomb.js'
import Explosion from './classes/Explosion.js'
import Fighter from './classes/Fighter.js'
import Hud from './classes/Hud.js'
import Info from './classes/Info.js'
import Laser from './classes/Laser.js'
import Satellite from './classes/Satellite.js'
import Ship from './classes/Ship.js'
import Star from './classes/Star.js'

const shipsForLevel = 16
let gameStarted = false
let gamePaused = false
let gameOver = false
let gameCompleted = false
let demoInterval
let gameInterval
/** @type { HTMLCanvasElement } */
const canvas = document.getElementById('game')
const context = canvas.getContext('2d')
const hud = new Hud(canvas)
const info = new Info(canvas)
/** @type { Array<Star> } */
const stars = []
/** @type { Array<Laser> } */
let lasers = []
/** @type { Array<Bomb> } */
let bombs = []
/** @type { Array<Explosion> } */
let explosions = []
/**@type { { left: Fighter, right: Fighter, top: Fighter, bottom: Fighter } } */
const enemies = { left: null, right: null, top: null, bottom: null }
const freePositions = { left: true, right: true, top: true, bottom: true }
/**@type { Satellite } */
let satellite = null
let allowShoot = true
const shipScore = 40
const satelliteScore = 200
let level = 1
let score = 0
let shipsRemaining = shipsForLevel
let shipsPlaced = shipsForLevel
let timeForSatellite = false
let playerDestroyed = false

// Create random stars
for (let index = 0; index < 40; index++) {
  const x = Math.floor(Math.random() * (960 - 20) + 20)
  const y = Math.floor(Math.random() * (660 - 20) + 20)
  stars.push(new Star(canvas, x, y))
}

const clearLaser = (laserId) => lasers = lasers.filter(laser => laser.id !== laserId)
const createLaser = (position) => lasers.push(new Laser(canvas, position, clearLaser))
const clearBomb = (bombId) => bombs = bombs.filter(bomb => bomb.id !== bombId)
const createBomb = (position) => bombs.push(new Bomb(canvas, position, clearBomb))
const clearExplosion = (explosionId) => explosions = explosions.filter(explosion => explosion.id !== explosionId)
const createExplosion = (xPos, yPos, size) => explosions.push(new Explosion(canvas, xPos, yPos, size, clearExplosion))
const shipDiagonalDamage = (side) => ship.diagonalDamage(side)

const shipDestroy = () => {
  timeForSatellite = false
  if (satellite) satellite.clean()
  satellite = null
  playerDestroyed = true
  Object.keys(enemies).filter(x => enemies[x] !== null).forEach(s => enemies[s].destroy(false))
  Object.keys(enemies).forEach(x => enemies[x] = null)
  bombs = []
  explosions.push(new BigBang(canvas, () => {
    explosions.push(new Explosion(canvas, 444, 294, 60, clearExplosion))
    explosions.push(new Explosion(canvas, 536, 294, 60, clearExplosion))
    explosions.push(new Explosion(canvas, 444, 386, 60, clearExplosion))
    explosions.push(new Explosion(canvas, 536, 386, 60, clearExplosion))
    ship.destroy()
    gameOver = true
  }))
}

const removeFighter = (position) => (explosion) => {  
  if (explosion) clearExplosion(explosion)
  enemies[position] = null
  shipsRemaining = shipsRemaining - 1
  setTimeout(() => freePositions[position] = true, 100)

  if (shipsRemaining === 0 && !playerDestroyed) {
    timeForSatellite = true
    setTimeout(() => satellite = new Satellite(canvas, shipDiagonalDamage, changeLevel), 2000)
  }
}

const destroyedFighter = (position, destroyed) => {
  if (destroyed) {
    const explosionPosition = {
      left: { x: 50, y: canvas.height / 2 },
      right: { x: canvas.width - 50, y: canvas.height / 2 },
      top: { x: canvas.width / 2, y: 50 },
      bottom: { x: canvas.width / 2, y: canvas.height - 50 },
    }

    explosions.push(new Explosion(canvas, explosionPosition[position].x, explosionPosition[position].y, 100, removeFighter(position)))
    score = score + shipScore
  } else {
    removeFighter(position)()
  }
}

const createEnemyShip = () => {
  if (timeForSatellite || playerDestroyed || gamePaused) return

  const pos = Object.keys(freePositions).map(x => freePositions[x] ? x : null).filter(s => s)

  if (pos.length && shipsPlaced > 0) {
    if ((level < 3 && pos.length > 2) || (level >=3 && level < 7 && pos.length > 1) || level >= 7) {
      const randomIndex = Math.floor(Math.random() * (pos.length))
      const side = pos[randomIndex]
      enemies[side] = new Fighter(canvas, side, level, createBomb, destroyedFighter)
      freePositions[side] = false
      shipsPlaced = shipsPlaced - 1
    } 
  }

  const additionalTime = pos.length === 4 ? 4.5 : 4
  const nextCall = Math.floor(Math.random() * (1500 - 500) + 500) * (additionalTime - pos.length)
  
  setTimeout(() => createEnemyShip(), nextCall)
}

const changeLevel = () => {
  if (level === 15) {
    gameCompleted = true
    return
  }
  level++
  shipsPlaced = shipsForLevel
  shipsRemaining = shipsForLevel
  timeForSatellite = false
  satellite = null
  setTimeout(() => createEnemyShip(), 1000)
}

let ship = new Ship(canvas, createLaser, shipDestroy, true)

const newGame = () => {
  playerDestroyed = false
  gameOver = false
  gameCompleted = false
  score = 0
  level = 0
  lasers = []
  bombs = []
  explosions = []
  ship = new Ship(canvas, createLaser, shipDestroy, false)
  changeLevel()
}


const demoMode = () => {
  const directions = Object.keys(enemies)
  const rndShoot = Math.floor(Math.random() * directions.length)
  const rndShield = Math.floor(Math.random() * directions.length)
  const currentShoot = directions[rndShoot]
  const currentShield = directions[rndShield]

  ship.createShield(currentShield)
  ship.shoot(currentShoot)
  lasers.push(new Laser(canvas, currentShoot, clearLaser))
}


const draw = () => {
  context.clearRect(0, 0, canvas.width, canvas.height)
  stars.forEach(star => star.draw())
  context.font = '15px Arial'
  context.fillStyle = 'gray'
  context.fillText(`LEVEL: ${level.toString().padStart(2, 0)}`, 10, 25)
  context.fillText(`SCORE: ${score.toString().padStart(4, 0)}`, 10, 45)
  
  if (!gameStarted) {
    info.drawTitle()
    if (lasers.filter(laser => laser.position === 'bottom').length === 0) {
      info.drawDescription()
      info.drawStartText()
    }
  } else {
    hud.draw(ship.heat, ship.energy)
    if (timeForSatellite && satellite) satellite.draw()
  }

  if (gameOver) info.drawGameOver()
  if (gameCompleted) info.drawGameCompleted()

  ship.draw()
  Object.values(enemies).filter(x => x && !x.destroyed).forEach(fighter => fighter.draw())

  lasers.forEach(laser => {
    const { position, x, y  } = laser.coordinates()

    if (position === 'left' && x < 77 && enemies.left && !enemies.left.destroyed) {
      clearLaser(laser.id)
      enemies.left.destroy(true)
    }

    if (position === 'right' && x > 873 && enemies.right && !enemies.right.destroyed) {
      clearLaser(laser.id)
      enemies.right.destroy(true)
    }

    if (position === 'top' && y < 77 && enemies.top && !enemies.top.destroyed) {
      clearLaser(laser.id)
      enemies.top.destroy(true)
    }

    if (position === 'bottom' && y > 573 && enemies.bottom && !enemies.bottom.destroyed) {
      clearLaser(laser.id)
      enemies.bottom.destroy(true)
    }

    bombs.forEach(bomb => {
      const { centerX, centerY, radius } = bomb.coordinates()
      if (laser.collisionWithCircle(centerX, centerY , radius)) {
        bomb.destroy()
        createExplosion(centerX, centerY, 60)
      }
    })

    if (timeForSatellite && satellite && !satellite.destroyed) {
      const satCoordinates = satellite.getCoordinates()
      if (laser.collisionWithCircle(satCoordinates.x, satCoordinates.y , satCoordinates.r)) {
        satellite.destroy()
        score = score + satelliteScore
      }
    }
    
    laser.draw()
  })

  bombs.forEach(bomb => {
    const { position, x, y } = bomb.coordinates()
    if (position === 'left') {
      if (ship.shield === position && x >= 345 && x <= 360) {
        bomb.destroy()
        createExplosion(360, canvas.height / 2, 60)
        ship.shieldDamage()
      }

      if (x >= 371) {
        bomb.destroy()
        createExplosion(425, canvas.height / 2, 100)
        ship.corpusDamage(position)
      }
    } else if (position === 'right') {
      if (ship.shield === position && x <= 605 && x >= 590) {
        bomb.destroy()
        createExplosion(canvas.width - 360, canvas.height / 2, 60)
        ship.shieldDamage()
      }

      if (x <= 579) {
        bomb.destroy()
        createExplosion(canvas.width - 425, canvas.height / 2, 100)
        ship.corpusDamage(position)
      }
    } else if (position === 'top') {
      if (ship.shield === position && y >= 195 && y <= 210) {
        bomb.destroy()
        createExplosion(canvas.width / 2, 210, 60)
        ship.shieldDamage()
      }

      if (y >= 221) {
        bomb.destroy()
        createExplosion(canvas.width / 2, 275, 100)
        ship.corpusDamage(position)
      }
    } else {
      if (ship.shield === position && y <= 455 && y >= 440) {
        bomb.destroy()
        createExplosion(canvas.width / 2, canvas.height - 210, 60)
        ship.shieldDamage()
      }

      if (y <= 429) {
        bomb.destroy()
        createExplosion(canvas.width / 2, canvas.height - 275, 100)
        ship.corpusDamage(position)
      }
    }

    bomb.draw()
  })

  explosions.forEach(explosion => explosion.draw())
}

window.onload = () => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'a' || e.key === 'A' || e.key === 'а' || e.key === 'А') {
      ship.createShield('left')
    }
  
    if (e.key === 'd' || e.key === 'D' || e.key === 'д' || e.key === 'Д') {
      ship.createShield('right')
    }

    if (e.key === 'w' || e.key === 'W' || e.key === 'в' || e.key === 'В') {
      ship.createShield('top')
    }

    if (e.key === 's' || e.key === 'S' || e.key === 'с' || e.key === 'С') {
      ship.createShield('bottom')
    }

    if (e.key === ' ') {
      ship.createShield('none')
    }

    if (e.key === 'ArrowUp' && allowShoot) {
      ship.shoot('top')
      allowShoot = false
    }

    if (e.key === 'ArrowLeft' && allowShoot) {
      ship.shoot('left')
      allowShoot = false
    }

    if (e.key === 'ArrowRight' && allowShoot) {
      ship.shoot('right')
      allowShoot = false
    }

    if (e.key === 'ArrowDown' && allowShoot) {
      ship.shoot('bottom')
      allowShoot = false
    }

    if ((e.key === 'p' || e.key === 'P' || e.key === 'п' || e.key === 'П') && gameStarted && !gameOver && !gameCompleted) {
      if (gamePaused) {
        gamePaused = false
        gameInterval = setInterval(() => draw(), 1000 / 60)
        Object.values(enemies).filter(x => x && !x.destroyed).forEach(enemy => enemy.unpause())
        createEnemyShip()
        explosions.forEach(x => x.unpause())
        if (satellite) satellite.unpause()
      } else {
        gamePaused = true
        info.drawPaused()
        clearInterval(gameInterval)
        Object.values(enemies).filter(x => x).forEach(enemy => enemy.pause())
        explosions.forEach(x => x.pause())
        if (satellite) satellite.pause()
      }
    }
  })

  document.addEventListener('keyup', (e) => {
    if (!gameStarted) {
      clearInterval(demoInterval)
      gameStarted = true
      newGame()
    }

    if (gameOver || gameCompleted) {
      newGame()
    }

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) allowShoot = true
  })

  demoInterval = setInterval(() => demoMode(), 500)
  gameInterval = setInterval(() => draw(), 1000 / 60)
}

