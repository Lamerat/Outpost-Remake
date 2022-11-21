import Ship from './classes/Ship.js'
import Star from './classes/Star.js'
import Bomb from './classes/Bomb.js'
import Explosion from './classes/Explosion.js'
import Fighter from './classes/Fighter.js'
import Hud from './classes/Hud.js'
import Laser from './classes/Laser.js'
import { explosionCoordinates } from './common/constants.js'

/** @type { HTMLCanvasElement } */
const canvas = document.getElementById('game');
const context = canvas.getContext('2d')

let allowShoot = true
let level = 1
let score = 0
let shipsRemaining = 16

/**@type { { left: Fighter, right: Fighter, top: Fighter, bottom: Fighter } } */
const enemies = {
  left: null,
  right: null,
  top: null,
  bottom: null
}

const stars = []
const ship = new Ship(canvas)
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


enemies.left = new Fighter(canvas, 'left', level, addBomb, enemies)
enemies.right = new Fighter(canvas, 'right', level, addBomb, enemies)
enemies.top = new Fighter(canvas, 'top', level, addBomb, enemies)
enemies.bottom = new Fighter(canvas, 'bottom', level, addBomb, enemies)




// Draw all elements
const draw = () => {
  context.clearRect(0, 0, canvas.width, canvas.height)
  stars.forEach(x => x.draw())
  context.font = '15px Arial'
  context.fillStyle = 'gray'
  context.fillText(`LEVEL: ${level}`, 10, 25)
  context.fillText(`SCORE: ${score}`, 10, 45)

  ship.draw()
  lasers.forEach(laser => laser.draw())
  bombs.forEach(bomb => bomb.draw())

  Object.values(enemies).filter(x => x).forEach(fighter => fighter.draw())
  
  explosions.forEach(explosion => explosion.draw())

  hud.draw(Ship.energy, Ship.heat)
}

// Update elements and check for collisions
const update = () => {
  lasers.forEach(laser => {
    const { position, x, y } = laser.coordinates

    if (position === 'left') {      
      if (enemies.left && x < 77) {
        enemies.left.destroy()
        enemies.left = null
        explosions.push(new Explosion(canvas, explosionCoordinates.enemyLeft, 'normal', clearExplosion))
        clearLaser(laser.id)
      }

      if (x + 30 < 0) {
        clearLaser(laser.id)
      }
    }

    if (position === 'right') {      
      if (enemies.right && x > 873) {
        enemies.right.destroy()
        enemies.right = null
        explosions.push(new Explosion(canvas, explosionCoordinates.enemyRight, 'normal', clearExplosion))
        clearLaser(laser.id)
      }

      if (x > 980) {
        clearLaser(laser.id)
      }
    }

    if (position === 'top') {
      if (enemies.top && y < 77) {
        enemies.top.destroy()
        enemies.top = null
        explosions.push(new Explosion(canvas, explosionCoordinates.enemyTop, 'normal', clearExplosion))
        clearLaser(laser.id)
      }

      if (y + 30 < 0) {
        clearLaser(laser.id)
      }
    }

    if (position === 'bottom') {
      if (enemies.bottom && y > 573) {
        enemies.bottom.destroy()
        enemies.bottom = null
        explosions.push(new Explosion(canvas, explosionCoordinates.enemyBottom, 'normal', clearExplosion))
        clearLaser(laser.id)
      }

      if (y > 680) {
        clearLaser(laser.id)
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
          clearInterval(temp)
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






let temp

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
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) allowShoot = true
    })
  })

  temp = setInterval(() => {
    draw()
    update() },
    1000/60)

  setInterval(() => starsUpdate(), 1000)
}