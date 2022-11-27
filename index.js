import Ship from './classes/Ship.js'
import Star from './classes/Star.js'
import Bomb from './classes/Bomb.js'
import Explosion from './classes/Explosion.js'
import Fighter from './classes/Fighter.js'
import Hud from './classes/Hud.js'
import Laser from './classes/Laser.js'
import { explosionCoordinates } from './common/constants.js'
import Satellite from './classes/Satellite.js'
import BigBang from './classes/BigBang.js'

let gameStarted = false
let demoTimer
/** @type { HTMLCanvasElement } */
const canvas = document.getElementById('game');
const context = canvas.getContext('2d')
const infoText = new Image()
infoText.src = './images/text.png'

const shipScore = 40
const satelliteScore = 200
let allowShoot = true
let level = 1
let score = 0
let shipsRemaining = 16
let shipsPlaced = 16
let timeForSatellite = false
let playerDestroyed = false

/**@type { { left: Fighter, right: Fighter, top: Fighter, bottom: Fighter } } */
const enemies = { left: null, right: null, top: null, bottom: null }
const freePositions = { left: true, right: true, top: true, bottom: true }
/**@type { Satellite } */
let satellite = null

const finishDestroyPlayer = () => {
  explosions.push(new Explosion(canvas, { x: 414, y: 264 }, 'small', clearExplosion))
  explosions.push(new Explosion(canvas, { x: 506, y: 264 }, 'small', clearExplosion))
  explosions.push(new Explosion(canvas, { x: 414, y: 356 }, 'small', clearExplosion))
  explosions.push(new Explosion(canvas, { x: 506, y: 356 }, 'small', clearExplosion))
  ship.destroy()
}

const destroyPlayer = () => {
  timeForSatellite = false
  if (satellite) satellite.clean()
  satellite = null
  playerDestroyed = true
  Object.keys(enemies).filter(x => enemies[x] !== null).forEach(s => enemies[s].clean())
  Object.keys(enemies).forEach(x => enemies[x] = null)
  bombs = []
  explosions.push(new BigBang(canvas, finishDestroyPlayer))
}

const stars = []
const ship = new Ship(canvas, destroyPlayer)
const hud = new Hud(canvas)

// Object arrays
/**@type { Array<Laser> } */
let lasers = []
/**@type { Array<Bomb> } */
let bombs = []
/** @type { Array<Explosion> } */
let explosions = []


// Create stars
for (let index = 0; index < 40; index++) {
  const x = Math.floor(Math.random() * (960 - 20) + 20)
  const y = Math.floor(Math.random() * (660 - 20) + 20)
  stars.push(new Star(canvas, x, y))
}


// Help functions
const addBomb = (position) => bombs.push(new Bomb(canvas, position))
const clearExplosion = (explosionId) => explosions = explosions.filter(explosion => explosion.id !== explosionId)
const clearBomb = (bombId) => bombs = bombs.filter(bomb => bomb.id !== bombId)
const clearLaser = (laserId) => lasers = lasers.filter(laser => laser.id !== laserId)
const damageDiagonal = (side) => ship.diagonalDamage(side)

const satelliteCollision = (px, py, cx, cy, r) => {
  const distX = px - cx
  const distY = py - cy
  const distance = Math.sqrt( (distX * distX) + (distY * distY) )

  return distance <= r ? true : false
}

const clearEnemy = (position) => {
  enemies[position] = null
  shipsRemaining = shipsRemaining - 1
  setTimeout(() => freePositions[position] = true)

  if (shipsRemaining === 0) {
    console.log('level completed')
    
    timeForSatellite = true
    setTimeout(() => satellite = new Satellite(canvas, changeLevel, damageDiagonal), 2000)
  }
}

const destroyEnemy = (position, laserId) => {
  enemies[position].destroy()
  clearLaser(laserId)
  score = score + shipScore
}

const createEnemyShip = () => {
  if (timeForSatellite || playerDestroyed) return

  const pos = Object.keys(freePositions).map(x => freePositions[x] ? x : null).filter(s => s)

  if (pos.length && shipsPlaced > 0) {
    if ((level < 3 && pos.length > 2) || (level >=3 && level < 7 && pos.length > 1) || level >= 7) {
      const randomIndex = Math.floor(Math.random() * (pos.length))
      const side = pos[randomIndex]
      enemies[side] = new Fighter(canvas, side, level, addBomb, clearEnemy)
      freePositions[side] = false
      shipsPlaced = shipsPlaced - 1
    } 
  }

  const additionalTime = pos.length === 4 ? 4.5 : 4
  const nextCall = Math.floor(Math.random() * (1500 - 500) + 500) * (additionalTime - pos.length)
  
  setTimeout(() => createEnemyShip(), nextCall)
}

const changeLevel = () => {
  level++
  shipsPlaced = 16
  shipsRemaining = 16
  timeForSatellite = false
  satellite = null
  setTimeout(() => createEnemyShip(), 1000)
}


// Draw all elements
const draw = () => {
  context.clearRect(0, 0, canvas.width, canvas.height)
  stars.forEach(x => x.draw())
  context.font = '15px Arial'
  context.fillStyle = 'gray'
  context.fillText(`LEVEL: ${level.toString().padStart(2, 0)}`, 10, 25)
  context.fillText(`SCORE: ${score.toString().padStart(4, 0)}`, 10, 45)

  if (!gameStarted) {
    context.drawImage(infoText, 0, 0, 858, 81, 61, 80, 858, 81)
    context.drawImage(infoText, 0, 81, 641, 63, 169.5, 490, 641, 63)
    context.font = '20px Arial'
    context.fillText('press any key to start', 400, 590)
  }

  if (gameStarted) {
    hud.draw(Ship.energy, Ship.heat)
    if (timeForSatellite && satellite) satellite.draw()
  }

  ship.draw()

  lasers.forEach(laser => laser.draw())
  bombs.forEach(bomb => bomb.draw())

  Object.values(enemies).filter(x => x).forEach(fighter => fighter.draw())

  explosions.forEach(explosion => explosion.draw())
}

// Update elements and check for collisions
const update = () => {
  lasers.forEach(laser => {
    const { position, x, y } = laser.coordinates

    if (position === 'left') {
      if (enemies.left && x < 77) {
        destroyEnemy(position, laser.id, explosionCoordinates.enemyLeft)
      }

      if (x + 30 < 0) {
        clearLaser(laser.id)
      }
    }

    if (position === 'right') {      
      if (enemies.right && x > 873) {
        destroyEnemy(position, laser.id, explosionCoordinates.enemyRight)
      }

      if (x > 980) {
        clearLaser(laser.id)
      }
    }

    if (position === 'top') {
      if (enemies.top && y < 77) {
        destroyEnemy(position, laser.id, explosionCoordinates.enemyTop)
      }

      if (y + 30 < 0) {
        clearLaser(laser.id)
      }
    }

    if (position === 'bottom') {
      if (enemies.bottom && y > 573) {
        destroyEnemy(position, laser.id, explosionCoordinates.enemyBottom)
      }

      if (y > 680) {
        clearLaser(laser.id)
      }
      
    }

    if (timeForSatellite && satellite) {
      const { x: satX, y: satY, r } = satellite.getCoordinates()
      let laserX = x
      let laserY = y
      if (position === 'bottom') laserY = laserY + 30
      if (position === 'right') laserX = laserX + 30
      
      if (satelliteCollision(laserX, laserY, satX, satY, r)) {
        satellite.destroy()
        score = score + satelliteScore
      }
    }
    
    laser.update()
  })

  bombs.forEach(bomb => {
    const { position, x, y }  = bomb.coordinates

    if (position === 'left') {
      lasers.filter(laser => laser.coordinates.position === 'left').forEach(current => {
        if (current.coordinates.x <= x + 15 ) {
          explosions.push(new Explosion(canvas, { x: x, y: 310 }, 'small', clearExplosion))
          clearBomb(bomb.id)
          bomb.destroy()
          lasers = lasers.filter(x => x.id !== current.id)
        }
      })

      if (Ship.shield === position && x >= 345 && x <= 360) {
        clearBomb(bomb.id)
        bomb.destroy()
        explosions.push(new Explosion(canvas, explosionCoordinates.shieldLeft, 'small', clearExplosion))
        ship.shieldDamage()
      }

      if (x >= 371) {
        clearBomb(bomb.id)
        bomb.destroy()
        explosions.push(new Explosion(canvas, explosionCoordinates.shipLeft, 'normal', clearExplosion))
        ship.corpusDamage('left')
      }
    }

    if (position === 'right') {
      lasers.filter(laser => laser.coordinates.position === 'right').forEach(current => {
        if (current.coordinates.x >= x - 15 ) {
          explosions.push(new Explosion(canvas, { x: x, y: 310 }, 'small', clearExplosion))
          clearBomb(bomb.id)
          bomb.destroy()
          lasers = lasers.filter(x => x.id !== current.id)
        }
      })

      if (Ship.shield === position && x <= 605 && x >= 590) {
        clearBomb(bomb.id)
        bomb.destroy()
        explosions.push(new Explosion(canvas, explosionCoordinates.shieldRight, 'small', clearExplosion))
        ship.shieldDamage()
      }

      if (x <= 579) {
        clearBomb(bomb.id)
        bomb.destroy()
        explosions.push(new Explosion(canvas, explosionCoordinates.shipRight, 'normal', clearExplosion))
        ship.corpusDamage('right')
      }
    }

    if (position === 'top') {
      lasers.filter(laser => laser.coordinates.position === 'top').forEach(current => {
        if (current.coordinates.y <= y + 15 ) {
          explosions.push(new Explosion(canvas, { x: 460, y: y }, 'small', clearExplosion))
          clearBomb(bomb.id)
          bomb.destroy()
          lasers = lasers.filter(x => x.id !== current.id)
        }
      })

      if (Ship.shield === position && y >= 195 && y <= 210) {
        clearBomb(bomb.id)
        bomb.destroy()
        explosions.push(new Explosion(canvas, explosionCoordinates.shieldTop, 'small', clearExplosion))
        ship.shieldDamage()
      }

      if (y >= 221) {
        clearBomb(bomb.id)
        bomb.destroy()
        explosions.push(new Explosion(canvas, explosionCoordinates.shipTop, 'normal', clearExplosion))
        ship.corpusDamage('top')
      }
    }

    if (position === 'bottom') {
      lasers.filter(laser => laser.coordinates.position === 'bottom').forEach(current => {
        if (current.coordinates.y >= y - 15 ) {
          explosions.push(new Explosion(canvas, { x: 460, y: y }, 'small', clearExplosion))
          clearBomb(bomb.id)
          bomb.destroy()
          lasers = lasers.filter(x => x.id !== current.id)
        }
      })

      if (Ship.shield === position && y <= 455 && y >= 440) {
        clearBomb(bomb.id)
        bomb.destroy()
        explosions.push(new Explosion(canvas, explosionCoordinates.shieldBottom, 'small', clearExplosion))
        ship.shieldDamage()
      }

      if (y <= 429) {
        clearBomb(bomb.id)
        bomb.destroy()
        explosions.push(new Explosion(canvas, explosionCoordinates.shipBottom, 'normal', clearExplosion))
        ship.corpusDamage('bottom')
      }
    }

    bomb.update()
  })
}


const starsUpdate = () => {
  const rndIndex = Math.floor(Math.random() * (39 - 0) + 0)
  const x = Math.floor(Math.random() * (960 - 20) + 20)
  const y = Math.floor(Math.random() * (660 - 20) + 20)
  stars[rndIndex] = new Star(canvas, x, y)
}


const demo = () => {
  const directions = Object.keys(enemies)
  const rndShoot = Math.floor(Math.random() * directions.length)
  const rndShield = Math.floor(Math.random() * directions.length)
  const currentShoot = directions[rndShoot]
  const currentShield = directions[rndShield]

  ship.shoot(currentShoot)
  lasers.push(new Laser(canvas, currentShoot))
  ship.createShield(currentShield)
}


window.onload = () => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'a' || e.key === 'A') {
      ship.createShield('left')
    }
  
    if (e.key === 'd' || e.key === 'D') {
      ship.createShield('right')
    }

    if (e.key === 'w' || e.key === 'W') {
      ship.createShield('top')
    }

    if (e.key === 's' || e.key === 'S') {
      ship.createShield('bottom')
    }

    if (e.key === ' ') {
      ship.createShield('none')
    }

    if (e.key === 'ArrowUp') {
      if (!allowShoot || !ship.shoot('top')) return
        lasers.push(new Laser(canvas, 'top'))
        allowShoot = false
    }

    if (e.key === 'ArrowDown') {
      if (!allowShoot || !ship.shoot('bottom')) return
      lasers.push(new Laser(canvas, 'bottom'))
      allowShoot = false
    }

    if (e.key === 'ArrowLeft') {
      if (!allowShoot || !ship.shoot('left')) return
      lasers.push(new Laser(canvas, 'left'))
      allowShoot = false
    }

    if (e.key === 'ArrowRight') {
      if (!allowShoot || !ship.shoot('right')) return
      lasers.push(new Laser(canvas, 'right'))
      allowShoot = false
    }

    document.addEventListener('keyup', (e) => {
      if (!gameStarted) {
        clearInterval(demoTimer)
        gameStarted = true
        lasers = []
        Ship.shield = 'none'
        ship.shoot('none')
        setTimeout(() => createEnemyShip(), 1000)
      }

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) allowShoot = true
    })
  })
  
  setInterval(() => {
    draw()
    update()
  }, 1000 / 60)

  demoTimer = setInterval(() => demo(), 500)
  setInterval(() => starsUpdate(), 1000)
}