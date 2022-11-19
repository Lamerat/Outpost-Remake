import { Bomb } from './classes/Bomb.js'
import { Explosion } from './classes/Explosion.js'
import { Fighter } from './classes/Fighter.js'
import { Hud } from './classes/Hud.js'
import { Laser } from './classes/Laser.js'
import Ship from './classes/Ship.js'
import Star from './classes/Star.js'
import { explosionCoordinates } from './common/constants.js'

/** @type { HTMLCanvasElement } */
const canvas = document.getElementById('game');
const context = canvas.getContext('2d')

let allowShoot = true
const stars = []
const ship = new Ship(canvas)
const hud = new Hud(canvas)

// Object arrays
/**@type { Array<Laser> } */
let lasers = []
/**@type { Array<Bomb> } */
let bombs = []
/** @type { Array<Fighter> } */
let fighters = []
/** @type { Array<Explosion> } */
let explosions = []




// Create stars
for (let index = 0; index < 40; index++) {
  const x = Math.floor(Math.random() * (960 - 20) + 20)
  const y = Math.floor(Math.random() * (660 - 20) + 20)
  stars.push(new Star(canvas, x, y))
}


const addBomb = (position) => bombs.push(new Bomb(canvas, position))

const clearExplosion = (explosionId) => explosions = explosions.filter(explosion => explosion.id !== explosionId)

const clearBomb = (bombId) => bombs = bombs.filter(bomb => bomb.id !== bombId)

const clearLaser = (laserId) => lasers = lasers.filter(laser => laser.id !== laserId)



// fighters.push(new Fighter(canvas, 'bottom', 1, addBomb))
// fighters.push(new Fighter(canvas, 'top', 1, addBomb))
fighters.push(new Fighter(canvas, 'left', 1, addBomb))
// fighters.push(new Fighter(canvas, 'right', 1, addBomb))

const draw = () => {
  context.clearRect(0, 0, canvas.width, canvas.height)
  stars.forEach(x => x.draw())
  context.font = '15px Arial'
  context.fillStyle = 'gray'
  context.fillText('LEVEL:', 10, 25)
  context.fillText('SCORE:', 10, 45)

  ship.draw()
  lasers.forEach(laser => laser.draw())
  bombs.forEach(bomb => bomb.draw())

  fighters.forEach(fighter => fighter.draw())
  
  explosions.forEach(explosion => explosion.draw())

  hud.draw(Ship.energy, Ship.heat)
}

const update = () => {
  lasers.forEach(laser => {
    const { position, x, y } = laser.coordinates

    if (position === 'left') {
      if (x + 30 < 0) {
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
          lasers = lasers.filter(x => x.id !== current.id)
        }
      })

      if (Ship.shield === position && x >= 345 && x <= 360) {
        // clearInterval(temp)
        clearBomb(bomb.id)
        explosions.push(new Explosion(canvas, explosionCoordinates.shieldLeft, 'small', clearExplosion))
        ship.shieldDamage()
      }

      if (x >= 371) {
        // clearInterval(temp)
        clearBomb(bomb.id)
        explosions.push(new Explosion(canvas, explosionCoordinates.shipLeft, 'normal', clearExplosion))
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