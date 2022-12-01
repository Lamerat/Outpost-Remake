import GameObject from './GameObject.js'

/** @typedef { 'left' | 'right' | 'top' | 'bottom' } sideDirections */

class Bomb extends GameObject {
  static counter = 0
  static speed = 10
  static clearFunc
  static startPositions = {
    left: { x: 80, y: 325 },
    right: { x: 870, y: 325 },
    top: { x: 475, y: 80 },
    bottom: { x: 475, y: 570 },
  }

  #image = super._createImage('./images/enemyBombSprite.png')
  #id
  #xPos
  #yPos
  #position
  #animationX = 0
  #animationY = 0
  #animationInterval

  get id() {
    return this.#id
  }


  /**
   * @param { HTMLCanvasElement } canvas 
   * @param { sideDirections } position
   * @param { Function } clearFunc
   */
  constructor(canvas, position, clearFunc) {
    super(canvas)

    Bomb.clearFunc = clearFunc
    Bomb.counter = Bomb.counter + 1
    this.#id = Bomb.counter
    this.#xPos = Bomb.startPositions[position].x
    this.#yPos = Bomb.startPositions[position].y
    this.#position = position

    this.#animationInterval = setInterval(() => this._animation(), 20)
  }

  _updatePosition() {
    switch (this.#position) {
      case 'left':
        this.#xPos = this.#xPos + Bomb.speed
        break
      case 'right':
        this.#xPos = this.#xPos - Bomb.speed
        break
      case 'top':
        this.#yPos = this.#yPos + Bomb.speed
        break
      case 'bottom':
        this.#yPos = this.#yPos - Bomb.speed
        break
      default:
        break
    }
  }

  _animation() {
    if (this.#animationX === 1000 && this.#animationY === 200) {
      this.#animationX = 0
      this.#animationY = 0
    } else if (this.#animationX === 1200) {
      this.#animationY < 200 ? this.#animationY = this.#animationY + 200 : this.#animationY = 0
      this.#animationX = 0
    } else {
      this.#animationX = this.#animationX + 200
    }
  }


  destroy() {
    clearInterval(this.#animationInterval)
    Bomb.clearFunc(this.#id)
  }


  coordinates() {
    return { position: this.#position, x: this.#xPos, y: this.#yPos, centerX: this.#xPos + 15, centerY: this.#yPos + 15, radius: 11 }
  }


  draw() {
    this.ctx.drawImage(this.#image, this.#animationX, this.#animationY, 200, 200, this.#xPos, this.#yPos, 30, 30)
    this._updatePosition()
  }
}

export default Bomb