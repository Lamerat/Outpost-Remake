import Ship from './classes/Ship.js'

/** @type { HTMLCanvasElement } */
const canvas = document.getElementById('game');
const context = canvas.getContext('2d')

const ship = new Ship(canvas)

const draw = () => {
  context.clearRect(0, 0, canvas.width, canvas.height)
  ship.draw()
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
      ship.shoot('top')
    }

    if (e.key === 'ArrowDown') {
      ship.shoot('bottom')
    }

    if (e.key === 'ArrowLeft') {
      ship.shoot('left')
    }

    if (e.key === 'ArrowRight') {
      ship.shoot('right')
    }
  })

  setInterval(() => draw(), 1000/60)
}