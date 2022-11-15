import { Laser } from './classes/Laser.js';
import Ship from './classes/Ship.js'

/** @type { HTMLCanvasElement } */
const canvas = document.getElementById('game');
const context = canvas.getContext('2d')

const ship = new Ship(canvas)
const lasers = []

const draw = () => {
  context.clearRect(0, 0, canvas.width, canvas.height)
  ship.draw()
  lasers.forEach(laser => laser.draw())
}

const update = () => {
  lasers.forEach(laser => laser.update())
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
      lasers.push(new Laser(canvas, 'top'))
      ship.shoot('top')
    }

    if (e.key === 'ArrowDown') {
      lasers.push(new Laser(canvas, 'bottom'))
      ship.shoot('bottom')
    }

    if (e.key === 'ArrowLeft') {
      lasers.push(new Laser(canvas, 'left'))
      ship.shoot('left')
    }

    if (e.key === 'ArrowRight') {
      lasers.push(new Laser(canvas, 'right'))
      ship.shoot('right')
    }
  })

  setInterval(() => {
    draw()
    update() },
    1000/60)
}