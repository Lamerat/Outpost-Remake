import { Bomb } from './classes/Bomb.js';
import { Fighter } from './classes/Fighter.js';
import { Hud } from './classes/Hud.js';
import { Laser } from './classes/Laser.js';
import Ship from './classes/Ship.js'
import { Star } from './classes/Star.js';

/** @type { HTMLCanvasElement } */
const canvas = document.getElementById('game');
const context = canvas.getContext('2d')

const ship = new Ship(canvas)
let allowShoot = true
const lasers = []


const tempFighter = new Fighter(canvas, 'top')
const tempBomb = new Bomb(canvas, 'top')

const hud = new Hud(canvas)
const stars = []

// Create stars
for (let index = 0; index < 40; index++) {
  const x = Math.floor(Math.random() * (960 - 20) + 20)
  const y = Math.floor(Math.random() * (660 - 20) + 20)
  stars.push(new Star(canvas, x, y))
}


const draw = () => {
  context.clearRect(0, 0, canvas.width, canvas.height)
  stars.forEach(x => x.draw())
  context.font = '15px Arial'
  context.fillStyle = 'gray'
  context.fillText('LEVEL:', 10, 25)
  context.fillText('SCORE:', 10, 45)

  ship.draw()
  lasers.forEach(laser => laser.draw())

  tempFighter.draw()
  tempBomb.draw()
  hud.draw(Ship.energy, Ship.heat)
}

const update = () => {
  lasers.forEach(laser => laser.update())
}


const starsUpdate = () => {
  const rndIndex = Math.floor(Math.random() * (39 - 0) + 0)
  const x = Math.floor(Math.random() * (960 - 20) + 20)
  const y = Math.floor(Math.random() * (660 - 20) + 20)
  stars[rndIndex] = new Star(canvas, x, y)
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

  setInterval(() => {
    draw()
    update() },
    1000/60)

  setInterval(() => starsUpdate(), 1000)
}